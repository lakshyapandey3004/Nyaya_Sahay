/**
 * NYAYA-SAHAY Blockchain Verification Service
 * Simulates permissioned blockchain ledger record checks for legal document integrity.
 * Note: Blockchain stores cryptographic hash/event telemetry, NOT original document files.
 */
const BlockchainService = {

  /**
   * Fetch permissioned blockchain ledger record for a document.
   * Simulates GET /api/documents/{id}/blockchain
   */
  async getLedgerRecord(documentId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const doc = MockData.getDocument(documentId);
    if (!doc) return null;

    const isTampered = doc.integrityStatus === 'tampered' || doc.hash !== doc.currentHash;

    return {
      network: 'NIC LegalPermissioned Blockchain (Hyperledger Besu)',
      nodeId: 'NIC-DELHI-NODE-04',
      documentId: doc.id,
      version: doc.version || 'v1.0',
      recordedHash: doc.hash || 'a82f91d4e7b2c1f098d234e5678f9012bc34d567',
      currentHash: doc.currentHash || doc.hash || 'a82f91d4e7b2c1f098d234e5678f9012bc34d567',
      status: isTampered ? 'HASH_MISMATCH' : 'MATCHED',
      blockNumber: 1489204,
      transactionHash: '0x7f8a91b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abc',
      timestamp: doc.uploadDate || '2026-08-01T12:00:00Z',
      recordedBy: doc.uploadedByName || 'Priya Sharma (Investigator)',
      smartContract: '0x3a4b5c6d7e8f90123456789abcdef0123456789a',
      consensusType: 'IBFT 2.0 (Proof of Authority)'
    };
  },

  /**
   * Verify an arbitrary file hash against the blockchain ledger.
   * Simulates POST /api/blockchain/verify-hash
   */
  async verifyHash(computedHash, expectedDocId) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const ledger = await this.getLedgerRecord(expectedDocId);
    if (!ledger) {
      return { match: false, reason: 'No blockchain record found for Document ID' };
    }

    const match = ledger.recordedHash.toLowerCase() === computedHash.toLowerCase();
    return {
      match,
      recordedHash: ledger.recordedHash,
      computedHash: computedHash,
      transactionHash: ledger.transactionHash,
      timestamp: ledger.timestamp
    };
  }
};
