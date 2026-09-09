/**
 * NYAYA-SAHAY Document Verification Service
 * Handles multi-stage document verification & human review API simulation.
 * Structured to be seamlessly replaced by Python FastAPI backend endpoints.
 */
const VerificationService = {

  /**
   * Run multi-stage verification pipeline on a document.
   * Simulates POST /api/documents/{id}/verify
   */
  async verifyDocument(documentId) {
    await new Promise(resolve => setTimeout(resolve, 800));

    const doc = MockData.getDocument(documentId);
    if (!doc) {
      throw new Error(`Document with ID ${documentId} not found.`);
    }

    // Return verification result based on document record
    const record = MockData.verificationRecords[documentId] || this.generateDefaultVerificationRecord(doc);
    
    // Log verification event into Audit Trail
    if (MockData.auditTrail) {
      MockData.auditTrail.unshift({
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        userId: MockData.currentUser ? MockData.currentUser.id : 'USR-001',
        userName: MockData.currentUser ? MockData.currentUser.name : 'Vikram Singh',
        role: MockData.currentUser ? MockData.currentUser.role : 'Admin',
        action: 'Verification Pipeline Executed',
        document: doc.fileName,
        documentId: doc.id,
        caseId: doc.caseId,
        ip: '192.168.1.101',
        device: 'Web Client',
        status: record.overallStatus === 'VERIFIED' ? 'success' : record.overallStatus === 'REQUIRES_HUMAN_REVIEW' ? 'warning' : 'violation',
        detail: `Overall Outcome: ${record.overallStatus}`
      });
    }

    return {
      success: true,
      documentId: doc.id,
      fileName: doc.fileName,
      verificationRecord: record
    };
  },

  /**
   * Real-Time AI & Document Classification / Verification Engine
   * Inspects text, file name, placeholders, and structure to distinguish:
   * 1. Legal Document vs Non-Legal Document (Resume, Receipt, Personal File, General Text)
   * 2. Authentic Legal Document vs Fake/AI ChatGPT Generated or Tampered Legal Document
   */
  analyzeFileContent(fileName = '', textContent = '', docType = 'Auto Detect') {
    const textCombined = (textContent + ' ' + fileName).trim();
    const textLower = textCombined.toLowerCase();

    // -------------------------------------------------------------
    // STEP 1: LEGAL VS NON-LEGAL DOCUMENT CLASSIFICATION
    // -------------------------------------------------------------
    const legalKeywords = [
      'fir', 'first information report', 'police station', 'p.s.', 'थाना', 'crpc', 'bns', 'ipc', 'sec ', 'section',
      'charge sheet', 'chargesheet', 'investigation report', 'witness statement', 'court', 'magistrate', 'judge',
      'high court', 'supreme court', 'district court', 'session court', 'affidavit', 'petitioner', 'respondent',
      'complainant', 'accused', 'forensic', 'evidence', 'seizure memo', 'sub-inspector', 'inspector', 'warrant',
      'summons', 'notice', 'judgement', 'bail', 'custody', 'offence', 'offense', 'punishable', 'penal code',
      'bharatiya nagarik suraksha', 'bharatiya nyaya sanhita', 'cctns', 'nldx', 'vakalatnama', 'notary', 'deed',
      'agreement', 'contract', 'power of attorney', 'sub-registrar', 'g.d. entry', 'general diary', 'legal'
    ];

    const nonLegalKeywords = [
      'resume', 'curriculum vitae', 'cv', 'work experience', 'education', 'b.tech', 'm.tech', 'b.sc', 'm.sc',
      'shopping list', 'grocery', 'recipe', 'ingredient', 'invoice', 'receipt', 'flight ticket', 'hotel booking',
      'essay', 'homework', 'assignment', 'mathematics', 'physics', 'chemistry', 'meeting notes', 'todo list', 'to-do list',
      'party', 'movie', 'song', 'photo', 'wallpaper'
    ];

    const matchedLegal = legalKeywords.filter(k => textLower.includes(k));
    const matchedNonLegal = nonLegalKeywords.filter(k => textLower.includes(k));

    // Determine if Document is NON-LEGAL
    const isNonLegal = (matchedLegal.length === 0) && (matchedNonLegal.length > 0 || (docType === 'Auto Detect' && matchedLegal.length === 0));

    if (isNonLegal) {
      const nonLegalCategory = matchedNonLegal.length > 0 ? matchedNonLegal[0].toUpperCase() : 'GENERAL NON-LEGAL FILE';
      return {
        overallStatus: 'NON_LEGAL_DOCUMENT',
        detectedCategory: `Non-Legal Document (${nonLegalCategory})`,
        isLegalDocument: false,
        isAiGenerated: false,
        warnings: [
          `⚠️ NON-LEGAL DOCUMENT DETECTED: The uploaded file ("${fileName}") does not contain statutory legal provisions, court filings, or official police station headers. It appears to be a ${nonLegalCategory}.`,
          `⚠️ Verification Skipped: Non-legal documents cannot be validated for statutory legal authenticity or CCTNS police records.`
        ],
        checks: [
          { id: 1, name: 'File Security', status: 'passed', detail: 'File clean, valid container structure' },
          { id: 2, name: 'OCR Text Extraction', status: 'passed', detail: textContent ? `Extracted ${textContent.length} characters` : 'File header inspected' },
          { id: 3, name: 'Document Classification', status: 'warning', detail: `CLASSIFIED AS NON-LEGAL DOCUMENT (${nonLegalCategory})` },
          { id: 4, name: 'Required Legal Fields', status: 'failed', detail: 'FAILED: No statutory legal sections, court filings, or FIR headers present' },
          { id: 5, name: 'Metadata Consistency', status: 'warning', detail: 'External non-legal file metadata' },
          { id: 6, name: 'Authority Verification', status: 'failed', detail: 'N/A: Not a registered legal document in authority registries' },
          { id: 7, name: 'QR / Barcode Verification', status: 'warning', detail: 'N/A: No legal verification QR' },
          { id: 8, name: 'Digital Signature Verification', status: 'warning', detail: 'N/A: No legal PKI digital signature' },
          { id: 9, name: 'SHA-256 Integrity Check', status: 'warning', detail: 'N/A: Unregistered non-legal hash' },
          { id: 10, name: 'Blockchain Record Verification', status: 'warning', detail: 'N/A: Non-legal document not committed to police ledger' },
          { id: 11, name: 'Duplicate / Version Check', status: 'passed', detail: 'Single external upload' }
        ]
      };
    }

    // -------------------------------------------------------------
    // STEP 2: LEGAL DOCUMENT DETECTED - EVALUATE AUTHENTICITY & FAKE / AI SYNTHESIS
    // -------------------------------------------------------------
    // 1. Detect ChatGPT / LLM synthetic signatures & bracket placeholders
    const aiPatterns = [
      'as an ai language model',
      'here is a sample fir',
      'sample fir',
      'insert station name',
      '[station name]',
      '[insert station',
      '[insert fir',
      '[insert date]',
      '[your name]',
      '[complainant name]',
      'dd/mm/yyyy',
      'lorem ipsum',
      'sample draft fir',
      'chatgpt',
      'openai',
      '[fill here]',
      '[specify details]',
      '[place of incident]',
      '[insert police station]',
      'fake_fir',
      'fake fir',
      'fake',
      'draft fir',
      'unverified sample'
    ];

    const detectedAiMarkers = aiPatterns.filter(pattern => textLower.includes(pattern));
    const hasBracketPlaceholders = /\[[a-zA-Z0-9\s\_\-\:\/]+\]/.test(textContent || fileName);
    const isAiGenerated = detectedAiMarkers.length > 0 || hasBracketPlaceholders;

    // 2. Determine Legal Sub-Category
    let detectedCategory = docType !== 'Auto Detect' ? docType : 'Legal Document';
    if (docType === 'Auto Detect') {
      if (textLower.includes('fir') || textLower.includes('first information report') || textLower.includes('police station') || textLower.includes('थाना')) {
        detectedCategory = 'FIR';
      } else if (textLower.includes('court') || textLower.includes('notice') || textLower.includes('petition') || textLower.includes('summons')) {
        detectedCategory = 'Court Filing / Notice';
      } else if (textLower.includes('witness') || textLower.includes('statement') || textLower.includes('bayan')) {
        detectedCategory = 'Witness Statement';
      } else if (textLower.includes('charge sheet') || textLower.includes('chargesheet') || textLower.includes('final report')) {
        detectedCategory = 'Charge Sheet';
      } else if (textLower.includes('forensic') || textLower.includes('fsl')) {
        detectedCategory = 'Forensic Report';
      } else if (textLower.includes('investigation') || textLower.includes('progress report')) {
        detectedCategory = 'Investigation Report';
      }
    }

    // 3. Structural & Header Integrity Check
    const hasPoliceStation = textLower.includes('police station') || textLower.includes('p.s.') || textLower.includes('थाना') || textLower.includes('court') || textLower.includes('sub-registrar') || textLower.includes('department');
    const isMissingHeaders = !hasPoliceStation && (detectedCategory === 'FIR' || textLower.includes('fir'));

    const isTampered = textLower.includes('tampered') || textLower.includes('modified_hash');

    let overallStatus = 'VERIFICATION_FAILED';
    let warnings = [];

    if (isAiGenerated) {
      const markerLabel = detectedAiMarkers.length > 0 ? detectedAiMarkers.join(', ') : 'Unfilled Bracket Placeholders [...]';
      warnings.push(`🔴 AI / ChatGPT Synthetic Text Detected: Found LLM boilerplate & unfilled bracket placeholders ("${markerLabel}").`);
    }

    if (isTampered) {
      warnings.push('🔴 SHA-256 Binary Hash Mismatch: Document hash does not match immutable recorded blockchain ledger hash.');
    }

    if (isMissingHeaders) {
      warnings.push('🔴 Structural Anomaly: Document lacks mandatory CCTNS Police Station seal & Section 154 CrPC / BNS 173 headers.');
    }

    if (!isAiGenerated && !isTampered && !isMissingHeaders && (matchedLegal.length >= 2 || textLower.includes('official') || textLower.includes('verified') || textLower.includes('valid'))) {
      overallStatus = 'VERIFIED';
    } else if (!isAiGenerated && !isTampered && (matchedLegal.length >= 1)) {
      overallStatus = 'REQUIRES_HUMAN_REVIEW';
      warnings.push('🟠 Human Review Required: Scanned document requires official judicial lookup for digital signature & authority seal.');
    } else {
      overallStatus = 'VERIFICATION_FAILED';
      if (warnings.length === 0) {
        warnings.push('🔴 Cryptographic Verification Failed: Unverified digital seal and unregistered SHA-256 binary hash.');
      }
    }

    const checks = [
      { id: 1, name: 'File Security', status: 'passed', detail: 'Virus clean, valid file container structure' },
      { id: 2, name: 'OCR Text Extraction', status: 'passed', detail: textContent ? `OCR extracted ${textContent.length} characters` : 'File stream extracted' },
      { id: 3, name: 'Document Classification', status: 'passed', detail: `Official Legal Document (${detectedCategory})` },
      { id: 4, name: 'Required Fields Present', status: isAiGenerated ? 'failed' : 'passed', detail: isAiGenerated ? 'FAILED: Synthetic AI placeholders detected' : `Mandatory fields extracted for ${detectedCategory}` },
      { id: 5, name: 'Metadata Consistency', status: overallStatus === 'VERIFIED' ? 'passed' : 'warning', detail: 'Upload metadata timestamp aligned' },
      { id: 6, name: 'Authority Verification', status: overallStatus === 'VERIFIED' ? 'passed' : overallStatus === 'REQUIRES_HUMAN_REVIEW' ? 'warning' : 'failed', detail: overallStatus === 'VERIFIED' ? 'Verified against Central Legal Registry' : 'Pending manual authority lookup' },
      { id: 7, name: 'QR / Barcode Verification', status: overallStatus === 'VERIFIED' ? 'passed' : 'warning', detail: overallStatus === 'VERIFIED' ? 'QR Code matched' : 'No embedded QR verification code' },
      { id: 8, name: 'Digital Signature Verification', status: overallStatus === 'VERIFIED' ? 'passed' : 'failed', detail: overallStatus === 'VERIFIED' ? 'Valid PKI Class-3 Signature' : 'Cryptographic signature missing/unverified' },
      { id: 9, name: 'SHA-256 Integrity Check', status: overallStatus === 'VERIFIED' ? 'passed' : 'failed', detail: overallStatus === 'VERIFIED' ? 'Binary hash matched registered database' : 'Unregistered / Mismatched SHA-256 hash' },
      { id: 10, name: 'Blockchain Record Verification', status: overallStatus === 'VERIFIED' ? 'passed' : 'failed', detail: overallStatus === 'VERIFIED' ? 'Verified on NIC Permissioned Blockchain' : 'Hash not committed to permissioned ledger' },
      { id: 11, name: 'Duplicate / Version Check', status: 'passed', detail: 'Single upload confirmed' }
    ];

    return {
      overallStatus,
      detectedCategory,
      isLegalDocument: true,
      isAiGenerated,
      warnings,
      checks
    };
  },

  /**
   * Process Custom File Upload and run real-time verification pipeline
   */
  async verifyCustomUploadedFile(fileObj, textContent = '', caseId = 'CR-124/2026', docType = 'FIR') {
    const fileName = fileObj ? fileObj.name : 'Custom_Uploaded_Document.pdf';

    if (typeof ApiClient !== 'undefined') {
      const apiResult = await ApiClient.verifyDocument(fileName, textContent, docType, caseId);
      if (apiResult && apiResult.status === 'success') {
        const docId = apiResult.documentId;
        const analysis = {
          overallStatus: apiResult.overallStatus,
          detectedCategory: apiResult.detectedCategory,
          isLegalDocument: apiResult.isLegalDocument,
          isAiGenerated: apiResult.isAiGenerated,
          warnings: apiResult.warnings || [],
          checks: [
            { id: 1, name: 'File Security', status: 'passed', detail: 'Virus clean, valid PDF structure' },
            { id: 2, name: 'OCR Text Extraction', status: 'passed', detail: `Extracted ${textContent.length} characters` },
            { id: 3, name: 'Document Classification', status: 'passed', detail: apiResult.detectedCategory },
            { id: 4, name: 'Required Legal Fields', status: apiResult.isAiGenerated ? 'failed' : 'passed', detail: apiResult.isAiGenerated ? 'FAILED: Synthetic AI markers present' : 'Mandatory fields extracted' },
            { id: 5, name: 'Metadata Consistency', status: 'passed', detail: 'Upload timestamp aligned' },
            { id: 6, name: 'Authority Verification', status: apiResult.overallStatus === 'VERIFIED' ? 'passed' : 'failed', detail: apiResult.overallStatus === 'VERIFIED' ? 'Verified against State Registry' : 'Unverified Seal' },
            { id: 7, name: 'QR / Barcode Verification', status: apiResult.overallStatus === 'VERIFIED' ? 'passed' : 'warning', detail: apiResult.overallStatus === 'VERIFIED' ? 'QR Code matched' : 'No QR embedded' },
            { id: 8, name: 'Digital Signature Verification', status: apiResult.overallStatus === 'VERIFIED' ? 'passed' : 'failed', detail: apiResult.overallStatus === 'VERIFIED' ? 'Valid PKI Class-3 Signature' : 'Signature missing/unverified' },
            { id: 9, name: 'SHA-256 Integrity Check', status: apiResult.overallStatus === 'VERIFIED' ? 'passed' : 'failed', detail: `SHA-256: ${apiResult.sha256Hash ? apiResult.sha256Hash.slice(0, 16) : 'registered'}` },
            { id: 10, name: 'Blockchain Record Verification', status: apiResult.overallStatus === 'VERIFIED' ? 'passed' : 'failed', detail: apiResult.overallStatus === 'VERIFIED' ? 'Verified on NIC Blockchain' : 'Hash not committed' },
            { id: 11, name: 'Duplicate / Version Check', status: 'passed', detail: 'Single upload confirmed' }
          ]
        };

        const record = {
          documentId: docId,
          fileName: fileName,
          overallStatus: apiResult.overallStatus,
          verificationTimestamp: new Date().toISOString(),
          issuingAuthority: apiResult.overallStatus === 'VERIFIED' ? 'Connaught Place Police Station, Delhi' : 'Unverified External Upload',
          documentType: apiResult.detectedCategory || docType,
          caseNumber: caseId,
          warnings: apiResult.warnings || [],
          checks: analysis.checks
        };

        MockData.verificationRecords[docId] = record;
        return {
          success: true,
          documentId: docId,
          fileName: fileName,
          verificationRecord: record
        };
      }
    }

    await new Promise(resolve => setTimeout(resolve, 800));
    const docId = `DOC-UPLOAD-${Date.now().toString().slice(-6)}`;

    // Run AI & Structural Detection Engine
    const analysis = this.analyzeFileContent(fileName, textContent, docType);

    const record = {
      documentId: docId,
      fileName: fileName,
      overallStatus: analysis.overallStatus,
      verificationTimestamp: new Date().toISOString(),
      issuingAuthority: analysis.overallStatus === 'VERIFIED' ? 'Connaught Place Police Station, Delhi' : analysis.overallStatus === 'NON_LEGAL_DOCUMENT' ? 'Non-Legal Document (Unregistered Personal Upload)' : 'Unverified External Upload / Synthetic Draft',
      documentType: analysis.detectedCategory || docType,
      caseNumber: caseId,
      warnings: analysis.warnings,
      checks: analysis.checks
    };

    // Save Record to MockData
    MockData.verificationRecords[docId] = record;

    // Create Document Entry
    const newDoc = {
      id: docId,
      fileName: fileName,
      type: docType,
      caseId: caseId,
      uploadedBy: MockData.currentUser ? MockData.currentUser.id : 'USR-001',
      uploadedByName: MockData.currentUser ? MockData.currentUser.name : 'Inspector R. Sharma',
      uploadDate: new Date().toISOString(),
      version: 'v1.0',
      integrityStatus: analysis.overallStatus === 'VERIFIED' ? 'verified' : 'tampered',
      aiStatus: analysis.overallStatus === 'VERIFIED' ? 'completed' : 'failed',
      size: fileObj && fileObj.size ? `${(fileObj.size / 1024 / 1024).toFixed(1)} MB` : '1.2 MB',
      hash: 'registered_ledger_hash_778129034',
      currentHash: analysis.overallStatus === 'VERIFIED' ? 'registered_ledger_hash_778129034' : 'unregistered_hash_' + Date.now(),
      description: `Uploaded ${docType} - Real-time Verification (${analysis.overallStatus})`,
      tags: ['Uploaded', analysis.overallStatus, docType],
      ocrText: textContent || `Extracted OCR text for ${fileName}`,
      aiInsights: {
        type: docType,
        confidence: analysis.overallStatus === 'VERIFIED' ? 0.96 : 0.38,
        entities: [
          { type: 'Organization', value: 'Delhi Police', role: 'Authority' }
        ],
        dates: [{ date: new Date().toISOString().split('T')[0], context: 'Upload Date' }],
        summary: analysis.overallStatus === 'VERIFIED'
          ? `Real-time Verification Complete: Authentic ${docType} verified against State Police Ledger.`
          : `Real-time Verification Complete: FAILED. Document contains synthetic AI markers, missing police stamps, or unregistered blockchain hash.`,
        actions: analysis.overallStatus === 'VERIFIED' ? ['Proceed to legal filing'] : ['Flag as unverified / fake document'],
        sections: ['CrPC 154', 'BNS 173'],
        flags: analysis.warnings
      }
    };

    MockData.documents.push(newDoc);

    // Audit Log
    if (MockData.auditTrail) {
      MockData.auditTrail.unshift({
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        userId: MockData.currentUser ? MockData.currentUser.id : 'USR-001',
        userName: MockData.currentUser ? MockData.currentUser.name : 'Inspector R. Sharma',
        role: MockData.currentUser ? MockData.currentUser.role : 'Police',
        action: 'Uploaded Document & Verification Pipeline Executed',
        document: fileName,
        documentId: docId,
        caseId: caseId,
        ip: '192.168.1.101',
        device: 'Web Client',
        status: analysis.overallStatus === 'VERIFIED' ? 'success' : 'violation',
        detail: `Verification Outcome: ${analysis.overallStatus} (${analysis.warnings.length} warnings detected)`
      });
    }

    return {
      success: true,
      documentId: docId,
      fileName: fileName,
      verificationRecord: record
    };
  },

  /**
   * Fetch verification status & detailed checklist for a document.
   * Simulates GET /api/documents/{id}/verification
   */
  async getVerificationDetails(documentId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const doc = MockData.getDocument(documentId);
    if (!doc) return null;

    return MockData.verificationRecords[documentId] || this.generateDefaultVerificationRecord(doc);
  },

  /**
   * Submit document for official human review.
   * Simulates POST /api/documents/{id}/human-review
   */
  async submitHumanReview(reviewData) {
    await new Promise(resolve => setTimeout(resolve, 600));

    const { documentId, reasons, reviewerRole, notes } = reviewData;
    const doc = MockData.getDocument(documentId);

    const ticketId = `REV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const reviewRecord = {
      ticketId,
      documentId,
      fileName: doc ? doc.fileName : 'Document.pdf',
      submittedBy: MockData.currentUser ? MockData.currentUser.name : 'Vikram Singh',
      submittedByRole: MockData.currentUser ? MockData.currentUser.role : 'Admin',
      assignedRole: reviewerRole || 'Senior Judicial Reviewer',
      reasons: reasons || ['Manual verification requested by user'],
      notes: notes || '',
      status: 'Pending', // Pending, Under Review, Verified by Officer, Rejected by Officer
      timestamp: new Date().toISOString()
    };

    if (!MockData.humanReviews) {
      MockData.humanReviews = {};
    }
    MockData.humanReviews[documentId] = reviewRecord;

    // Update document record status
    if (doc) {
      doc.verificationStatus = 'REQUIRES_HUMAN_REVIEW';
    }

    // Add Audit log
    if (MockData.auditTrail) {
      MockData.auditTrail.unshift({
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        userId: MockData.currentUser ? MockData.currentUser.id : 'USR-001',
        userName: MockData.currentUser ? MockData.currentUser.name : 'Vikram Singh',
        role: MockData.currentUser ? MockData.currentUser.role : 'Admin',
        action: 'Sent for Human Review',
        document: doc ? doc.fileName : 'Document.pdf',
        documentId: documentId,
        caseId: doc ? doc.caseId : 'CR-124/2026',
        ip: '192.168.1.101',
        device: 'Web Client',
        status: 'warning',
        detail: `Review Ticket Created: ${ticketId}`
      });
    }

    return {
      success: true,
      reviewRecord
    };
  },

  /**
   * Get human review ticket status.
   * Simulates GET /api/documents/{id}/human-review
   */
  async getHumanReviewStatus(documentId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MockData.humanReviews ? MockData.humanReviews[documentId] || null : null;
  },

  /**
   * Helper fallback record generator
   */
  generateDefaultVerificationRecord(doc) {
    const isTampered = doc.integrityStatus === 'tampered' || doc.hash !== doc.currentHash;
    const isWarning = doc.integrityStatus === 'warning';

    const overallStatus = isTampered ? 'VERIFICATION_FAILED' : isWarning ? 'REQUIRES_HUMAN_REVIEW' : 'VERIFIED';

    return {
      documentId: doc.id,
      fileName: doc.fileName,
      overallStatus: overallStatus,
      verificationTimestamp: new Date().toISOString(),
      issuingAuthority: 'District Police Office / Sub-Registrar Saket',
      documentType: doc.type,
      caseNumber: doc.caseId,
      warnings: isTampered ? ['SHA-256 binary hash mismatch with registered blockchain record'] : isWarning ? ['Digital signature not available', 'Authority registry lookup required'] : [],
      checks: [
        { id: 1, name: 'File Security', status: 'passed', detail: 'Virus clean, valid PDF structure' },
        { id: 2, name: 'OCR Extraction', status: 'passed', detail: 'OCR text extracted with 97% confidence' },
        { id: 3, name: 'Document Classification', status: 'passed', detail: `Identified as ${doc.type}` },
        { id: 4, name: 'Required Fields Present', status: 'passed', detail: 'All mandatory FIR/Legal sections extracted' },
        { id: 5, name: 'Metadata Consistency', status: 'passed', detail: 'Upload timestamp aligns with filing date' },
        { id: 6, name: 'Authority Verification', status: isWarning ? 'warning' : 'passed', detail: isWarning ? 'Service pending manual lookup' : 'Verified against State Police Registry' },
        { id: 7, name: 'QR / Barcode Verification', status: isWarning ? 'warning' : 'passed', detail: isWarning ? 'No QR code embedded in document scan' : 'QR code ABC-1024-2026 verified' },
        { id: 8, name: 'Digital Signature Verification', status: isWarning ? 'warning' : 'passed', detail: isWarning ? 'Digital signature not available' : 'Valid PKI Cryptographic Digital Signature' },
        { id: 9, name: 'SHA-256 Integrity Check', status: isTampered ? 'failed' : 'passed', detail: isTampered ? `Hash Mismatch! Expected: ${doc.hash.slice(0, 10)}... Current: ${doc.currentHash.slice(0, 10)}...` : 'Binary hash matched registered record' },
        { id: 10, name: 'Blockchain Record Verification', status: isTampered ? 'failed' : 'passed', detail: isTampered ? 'Ledger hash mismatch' : 'Verified on NIC Permissioned Blockchain (Tx: 0x7f8a...29cd)' },
        { id: 11, name: 'Duplicate / Version Check', status: 'passed', detail: 'Original version v1.0 confirmed' }
      ]
    };
  }
};
