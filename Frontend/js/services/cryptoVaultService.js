/**
 * NYAYA-SAHAY Crypto Vault & IndexedDB Storage Service
 * Implements real Web Crypto API (crypto.subtle AES-256-GCM) encryption
 * and IndexedDB binary file persistence for PDFs, images, and legal documents.
 */
const CryptoVaultService = {
  dbName: 'NyayaCryptoVaultDB',
  dbVersion: 1,
  storeName: 'encrypted_documents',
  keyStoreName: 'vault_keys',
  cryptoKey: null,

  /**
   * Initialize IndexedDB database stores
   */
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(this.keyStoreName)) {
          db.createObjectStore(this.keyStoreName, { keyPath: 'id' });
        }
      };

      request.onsuccess = (e) => {
        resolve(e.target.result);
      };

      request.onerror = (e) => {
        console.error('IndexedDB open error:', e);
        reject(e.target.error);
      };
    });
  },

  /**
   * Get or generate a persistent AES-256-GCM Web Crypto Key
   */
  async getOrCreateCryptoKey() {
    if (this.cryptoKey) return this.cryptoKey;

    try {
      const db = await this.initDB();
      const storedKeyData = await new Promise((resolve) => {
        const tx = db.transaction(this.keyStoreName, 'readonly');
        const store = tx.objectStore(this.keyStoreName);
        const req = store.get('master_vault_key');
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      });

      if (storedKeyData && storedKeyData.rawKey) {
        this.cryptoKey = await window.crypto.subtle.importKey(
          'raw',
          new Uint8Array(storedKeyData.rawKey),
          { name: 'AES-GCM', length: 256 },
          true,
          ['encrypt', 'decrypt']
        );
        return this.cryptoKey;
      }

      // Generate new 256-bit AES-GCM Key
      const newKey = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );

      const exportedRaw = await window.crypto.subtle.exportKey('raw', newKey);
      const tx = db.transaction(this.keyStoreName, 'readwrite');
      const store = tx.objectStore(this.keyStoreName);
      store.put({ id: 'master_vault_key', rawKey: Array.from(new Uint8Array(exportedRaw)), createdAt: new Date().toISOString() });

      this.cryptoKey = newKey;
      return this.cryptoKey;
    } catch (err) {
      console.warn('CryptoKey initialization fallback:', err);
      // Fallback to session key if storage fails
      this.cryptoKey = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      return this.cryptoKey;
    }
  },

  /**
   * Encrypt file or text buffer using AES-256-GCM and store in IndexedDB
   */
  async encryptAndStoreDocument({ id, fileName, fileType, caseId, folderId, documentType, fileObj, textContent }) {
    const key = await this.getOrCreateCryptoKey();

    let plaintextBuffer = null;
    let mimeType = fileObj ? (fileObj.type || 'application/octet-stream') : 'text/plain;charset=utf-8';
    
    if (fileName.toLowerCase().endsWith('.pdf')) mimeType = 'application/pdf';
    else if (fileName.toLowerCase().endsWith('.png')) mimeType = 'image/png';
    else if (fileName.toLowerCase().endsWith('.jpg') || fileName.toLowerCase().endsWith('.jpeg')) mimeType = 'image/jpeg';
    else if (fileName.toLowerCase().endsWith('.webp')) mimeType = 'image/webp';
    else if (fileName.toLowerCase().endsWith('.txt')) mimeType = 'text/plain';

    if (fileObj) {
      plaintextBuffer = await fileObj.arrayBuffer();
    } else if (textContent) {
      const encoder = new TextEncoder();
      plaintextBuffer = encoder.encode(textContent).buffer;
    } else {
      const encoder = new TextEncoder();
      plaintextBuffer = encoder.encode(`Empty case file: ${fileName}`).buffer;
    }

    // Generate secure 12-byte random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // AES-256-GCM Encryption
    const ciphertextBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      plaintextBuffer
    );

    const fileSizeFormatted = fileObj && fileObj.size 
      ? `${(fileObj.size / 1024).toFixed(1)} KB`
      : `${(plaintextBuffer.byteLength / 1024).toFixed(1)} KB`;

    const encryptedRecord = {
      id: id,
      fileName: fileName,
      title: fileName,
      caseId: caseId || 'CR-124/2026',
      folderId: folderId || 'f-1',
      documentType: documentType || fileType || 'Evidence Record',
      mimeType: mimeType,
      fileSize: fileSizeFormatted,
      encryptedData: ciphertextBuffer, // ArrayBuffer stored natively in IndexedDB
      iv: Array.from(iv),
      encryptionVersion: 'AES-256-GCM-WebCrypto',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEncrypted: true
    };

    // Save into IndexedDB store
    const db = await this.initDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.put(encryptedRecord);
      req.onsuccess = () => resolve();
      req.onerror = (e) => reject(e.target.error);
    });

    return encryptedRecord;
  },

  /**
   * Retrieve and decrypt document from IndexedDB
   */
  async getAndDecryptDocument(docId) {
    const db = await this.initDB();
    const record = await new Promise((resolve) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const req = store.get(docId);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });

    if (!record || !record.encryptedData) {
      return null;
    }

    const key = await this.getOrCreateCryptoKey();
    const iv = new Uint8Array(record.iv);

    // AES-256-GCM Decryption
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      record.encryptedData
    );

    return {
      record: record,
      decryptedBytes: decryptedBuffer,
      mimeType: record.mimeType,
      fileName: record.fileName
    };
  },

  /**
   * Create Blob and Object URL from decrypted bytes
   */
  createDecryptedBlobUrl(decryptedBytes, mimeType) {
    const blob = new Blob([decryptedBytes], { type: mimeType || 'application/octet-stream' });
    return URL.createObjectURL(blob);
  },

  /**
   * Trigger direct browser download of decrypted original document
   */
  async downloadOfficialCopy(docId, fallbackFileName = 'Document.pdf') {
    try {
      const result = await this.getAndDecryptDocument(docId);
      if (!result) {
        throw new Error('Encrypted document record not found in vault storage.');
      }
      const blobUrl = this.createDecryptedBlobUrl(result.decryptedBytes, result.mimeType);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = result.fileName || fallbackFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      NyayaSahay.showToast(`📥 Official copy of "${result.fileName}" downloaded cleanly!`, 'success');
      return true;
    } catch (err) {
      console.error('Download error:', err);
      NyayaSahay.showToast(`Failed to download official copy: ${err.message}`, 'error');
      return false;
    }
  }
};
