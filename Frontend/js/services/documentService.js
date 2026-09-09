/**
 * NYAYA-SAHAY Document & Authority Service
 * Handles authority registry lookups, QR code validation, and digital signature verification.
 */
const DocumentService = {

  /**
   * Cross-reference document metadata with trusted government authority registry.
   */
  async verifyAuthorityRecord(documentId) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const doc = MockData.getDocument(documentId);
    if (!doc) return null;

    if (doc.id === 'DOC-002' || doc.id === 'DOC-005') {
      return {
        verified: false,
        issuingAuthority: 'Sub-Registrar Saket / State Police',
        documentId: doc.id,
        verificationSource: 'Trusted Authority Registry (NDLS)',
        status: 'UNAVAILABLE / RECORD NOT FOUND',
        reason: 'Scanned document copy requires manual verification with issuing branch office.'
      };
    }

    return {
      verified: true,
      issuingAuthority: 'District Police Office / Sub-Registrar Saket, Delhi',
      documentId: doc.id,
      verificationSource: 'National Legal Data Exchange Registry (NLDX-GOV)',
      status: 'RECORD MATCHED & CONFIRMED',
      registryId: 'GOV-REG-2026-88912',
      registeredDate: '2026-08-01'
    };
  },

  /**
   * Validate QR / Barcode embedded in document scan.
   */
  async verifyQRCode(documentId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const doc = MockData.getDocument(documentId);

    if (doc && (doc.id === 'DOC-002' || doc.id === 'DOC-005' || doc.id === 'DOC-004')) {
      return {
        hasQR: false,
        status: 'NOT AVAILABLE',
        reason: 'No QR code embedded in document header/footer.'
      };
    }

    return {
      hasQR: true,
      status: 'VERIFIED',
      verificationId: 'QR-NDLS-2026-9921',
      source: 'Official NIC Verification Portal',
      payload: `NYAYA-SAHAY|${doc ? doc.id : 'DOC-001'}|HASH-MATCHED|STQC-SEALED`
    };
  },

  /**
   * Verify digital signature and distinguish cryptographic cert from scanned image signature.
   */
  async verifyDigitalSignature(documentId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const doc = MockData.getDocument(documentId);

    if (doc && (doc.id === 'DOC-002' || doc.id === 'DOC-005' || doc.id === 'DOC-008')) {
      return {
        hasDigitalSignature: false,
        signatureType: 'Physical Scanned Ink Signature (Image Only)',
        status: 'DIGITAL SIGNATURE NOT AVAILABLE',
        warning: 'Scanned image of a physical signature is NOT a cryptographic digital signature.',
        certificate: null
      };
    }

    return {
      hasDigitalSignature: true,
      signatureType: 'Cryptographic PKI Digital Signature (x509)',
      status: 'VALID & CERTIFIED',
      signer: 'Inspector R. Sharma (CBI / State Police Authority)',
      certificate: {
        issuer: 'eMudhra / NIC Class-3 Signing CA',
        validFrom: '2026-01-01',
        validTo: '2028-12-31',
        serialNumber: '55-89-AB-12-34-CD',
        algorithm: 'SHA256withRSA (2048 bit)'
      }
    };
  }
};
