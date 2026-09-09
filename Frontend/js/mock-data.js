const MockData = {

  currentUser: {
    id: 'USR-001',
    name: 'Vikram Singh',
    email: 'vikram.singh@nyayasahay.gov.in',
    role: 'Admin',
    initials: 'VS',
    department: 'Central Bureau of Investigation',
    avatar: null
  },

  users: [
    { id: 'USR-001', name: 'Vikram Singh', email: 'vikram.singh@nyayasahay.gov.in', role: 'Admin', initials: 'VS', status: 'Active', lastActive: '2026-09-06T14:20:00', caseAccess: ['CR-124/2026', 'CR-156/2026', 'CIV-089/2026', 'CR-098/2025', 'CIV-201/2026'], docAccess: 'All' },
    { id: 'USR-002', name: 'Priya Sharma', email: 'priya.sharma@nyayasahay.gov.in', role: 'Investigator', initials: 'PS', status: 'Active', lastActive: '2026-09-06T13:45:00', caseAccess: ['CR-124/2026', 'CR-156/2026'], docAccess: 'Assigned Cases' },
    { id: 'USR-003', name: 'Amit Patel', email: 'amit.patel@nyayasahay.gov.in', role: 'Officer', initials: 'AP', status: 'Active', lastActive: '2026-09-06T11:30:00', caseAccess: ['CR-124/2026', 'CIV-089/2026'], docAccess: 'Assigned Cases' },
    { id: 'USR-004', name: 'Neha Gupta', email: 'neha.gupta@nyayasahay.gov.in', role: 'Analyst', initials: 'NG', status: 'Active', lastActive: '2026-09-06T12:15:00', caseAccess: ['CR-124/2026', 'CR-156/2026', 'CIV-089/2026'], docAccess: 'Read Only' },
    { id: 'USR-005', name: 'Rahul Verma', email: 'rahul.verma@nyayasahay.gov.in', role: 'Investigator', initials: 'RV', status: 'Inactive', lastActive: '2026-08-28T09:00:00', caseAccess: ['CR-098/2025'], docAccess: 'Assigned Cases' },
    { id: 'USR-006', name: 'Kavita Reddy', email: 'kavita.reddy@nyayasahay.gov.in', role: 'Officer', initials: 'KR', status: 'Active', lastActive: '2026-09-05T16:40:00', caseAccess: ['CIV-201/2026', 'CIV-089/2026'], docAccess: 'Assigned Cases' }
  ],

  cases: [
    {
      id: 'CR-124/2026', title: 'State vs. Rajesh Kumar', type: 'Criminal',
      status: 'Active',
      description: 'Case involving alleged fraud and forgery of property documents in South Delhi jurisdiction. Complainant Suresh Mehta alleges that accused Rajesh Kumar forged property ownership papers for a residential plot in Saket, New Delhi. Multiple witnesses identified. Vehicle DL-05-CQ-4521 recovered from scene.',
      documents: 8, users: 4, lastUpdated: '2026-09-05T14:30:00',
      integrityStatus: 'warning',
      assignedUsers: ['USR-001', 'USR-002', 'USR-003', 'USR-004'],
      criticalDates: [
        { date: '2026-09-15', description: 'Court hearing — Evidence presentation', type: 'hearing' },
        { date: '2026-09-22', description: 'Witness examination deadline', type: 'deadline' },
        { date: '2026-10-01', description: 'Final charge sheet submission', type: 'deadline' }
      ],
      flaggedDocuments: 1, createdAt: '2026-08-01T10:00:00'
    },
    {
      id: 'CIV-089/2026', title: 'Sharma vs. Municipal Corporation', type: 'Civil',
      status: 'Active',
      description: 'Civil dispute regarding unauthorized demolition of commercial property at Connaught Place, New Delhi. Petitioner claims damages of INR 2.5 Crore.',
      documents: 5, users: 3, lastUpdated: '2026-09-04T10:15:00',
      integrityStatus: 'verified',
      assignedUsers: ['USR-001', 'USR-003', 'USR-006'],
      criticalDates: [
        { date: '2026-09-18', description: 'Next hearing date', type: 'hearing' }
      ],
      flaggedDocuments: 0, createdAt: '2026-07-15T09:00:00'
    },
    {
      id: 'CR-156/2026', title: 'Financial Fraud Investigation — Apex Group', type: 'Financial Crime',
      status: 'Under Investigation',
      description: 'Investigation into systematic financial fraud by Apex Group of Companies involving embezzlement of investor funds worth INR 50 Crore across multiple states.',
      documents: 12, users: 3, lastUpdated: '2026-09-06T09:20:00',
      integrityStatus: 'verified',
      assignedUsers: ['USR-001', 'USR-002', 'USR-004'],
      criticalDates: [
        { date: '2026-09-25', description: 'ED coordination meeting', type: 'meeting' },
        { date: '2026-10-10', description: 'Preliminary report due', type: 'deadline' }
      ],
      flaggedDocuments: 0, createdAt: '2026-08-10T14:00:00'
    },
    {
      id: 'CR-098/2025', title: 'State vs. Priya Malhotra', type: 'Criminal',
      status: 'Closed',
      description: 'Cybercrime case involving unauthorized access to banking systems. Accused convicted and sentenced. All evidence archived.',
      documents: 15, users: 2, lastUpdated: '2026-06-30T16:00:00',
      integrityStatus: 'verified',
      assignedUsers: ['USR-001', 'USR-005'],
      criticalDates: [],
      flaggedDocuments: 0, createdAt: '2025-11-01T08:00:00'
    },
    {
      id: 'CIV-201/2026', title: 'Land Dispute — Agra Revenue Records', type: 'Property',
      status: 'Pending',
      description: 'Dispute over ownership of agricultural land in Agra district. Multiple claimants with conflicting revenue records. Survey and settlement records under examination.',
      documents: 6, users: 2, lastUpdated: '2026-09-03T11:45:00',
      integrityStatus: 'verified',
      assignedUsers: ['USR-001', 'USR-006'],
      criticalDates: [
        { date: '2026-09-20', description: 'Revenue court hearing', type: 'hearing' }
      ],
      flaggedDocuments: 0, createdAt: '2026-08-20T10:00:00'
    }
  ],

  documents: [
    {
      id: 'DOC-001', fileName: 'FIR_CR124_2026.pdf', type: 'FIR',
      caseId: 'CR-124/2026', uploadedBy: 'USR-002', uploadedByName: 'Priya Sharma',
      uploadDate: '2026-08-01T12:00:00', version: 'v1.0',
      integrityStatus: 'verified', aiStatus: 'completed', size: '2.4 MB',
      hash: 'a82f91d4e7b2c1f098d234e5678f9012bc34d567',
      currentHash: 'a82f91d4e7b2c1f098d234e5678f9012bc34d567',
      description: 'First Information Report filed at PS Saket, New Delhi',
      tags: ['FIR', 'Initial Report', 'PS Saket'],
      ocrText: 'FIRST INFORMATION REPORT\n(Under Section 154 Cr.P.C.)\n\nDistrict: South Delhi\nP.S.: Saket\nFIR No.: 124/2026\nDate: 01-08-2026\n\nAct: IPC\nSections: 420, 467, 468, 471\n\nOccurrence of offence:\nDate From: 28-07-2026\nDate To: 28-07-2026\nTime Period: 14:00 hrs to 16:30 hrs\n\nPlace of occurrence: Plot No. 45, Block-C, Saket, New Delhi - 110017\n\nComplainant: Suresh Mehta, S/o Ram Prasad Mehta\nAddress: 23, Vasant Kunj Enclave, New Delhi - 110070\nOccupation: Business\n\nParticulars of the Accused:\nName: Rajesh Kumar, S/o Unknown\nDescription: Male, approximately 42 years, medium build, fair complexion\nVehicle: White Sedan, Registration No. DL-05-CQ-4521\n\nDetails of complaint:\nThe complainant Suresh Mehta states that on 28-07-2026, between 14:00 hrs and 16:30 hrs, the accused Rajesh Kumar presented forged property ownership documents pertaining to residential Plot No. 45, Block-C, Saket. The complainant discovered that the said documents bore forged signatures and fabricated registration stamps. The accused was seen leaving the Sub-Registrar office in a white sedan bearing registration number DL-05-CQ-4521.\n\nAction taken: FIR registered. Investigation initiated under IO Priya Sharma.',
      aiInsights: {
        type: 'FIR', confidence: 0.97,
        entities: [
          { type: 'Person', value: 'Rajesh Kumar', role: 'Accused' },
          { type: 'Person', value: 'Suresh Mehta', role: 'Complainant' },
          { type: 'Person', value: 'Ram Prasad Mehta', role: 'Father of Complainant' },
          { type: 'Person', value: 'Priya Sharma', role: 'Investigating Officer' },
          { type: 'Vehicle', value: 'DL-05-CQ-4521', role: 'White Sedan' },
          { type: 'Location', value: 'Saket, New Delhi', role: 'Place of Occurrence' },
          { type: 'Location', value: 'Vasant Kunj Enclave', role: 'Complainant Address' },
          { type: 'Organization', value: 'PS Saket', role: 'Police Station' }
        ],
        dates: [
          { date: '2026-07-28', context: 'Date of incident' },
          { date: '2026-08-01', context: 'FIR registration date' },
          { date: '2026-09-15', context: 'Court hearing date' }
        ],
        summary: 'FIR No. 124/2026 registered at PS Saket, South Delhi regarding alleged fraud and forgery of property documents. Complainant Suresh Mehta alleges that accused Rajesh Kumar presented forged property ownership documents for residential Plot No. 45, Block-C, Saket. The forged documents bore fabricated signatures and counterfeit registration stamps. Vehicle DL-05-CQ-4521 (white sedan) identified at the scene. Investigation assigned to IO Priya Sharma under IPC Sections 420, 467, 468, and 471.',
        actions: [
          'Court appearance required on 15 Sep 2026 for evidence presentation',
          'Witness examination to be completed by 22 Sep 2026',
          'Vehicle DL-05-CQ-4521 to be traced and seized',
          'Sub-Registrar office records to be verified'
        ],
        sections: ['IPC Section 420 — Cheating', 'IPC Section 467 — Forgery of valuable security', 'IPC Section 468 — Forgery for purpose of cheating', 'IPC Section 471 — Using forged document as genuine'],
        flags: []
      }
    },
    {
      id: 'DOC-002', fileName: 'Witness_Statement_Anil_Kapoor.pdf', type: 'Witness Statement',
      caseId: 'CR-124/2026', uploadedBy: 'USR-002', uploadedByName: 'Priya Sharma',
      uploadDate: '2026-08-05T09:30:00', version: 'v1.0',
      integrityStatus: 'verified', aiStatus: 'completed', size: '1.8 MB',
      hash: 'b73e82c5d6a1f209e345f6789a0123cd45e678f9',
      currentHash: 'b73e82c5d6a1f209e345f6789a0123cd45e678f9',
      description: 'Witness statement of Anil Kapoor regarding property fraud',
      tags: ['Witness', 'Eye Witness', 'Saket'],
      aiInsights: {
        type: 'Witness Statement', confidence: 0.92,
        entities: [
          { type: 'Person', value: 'Anil Kapoor', role: 'Witness' },
          { type: 'Person', value: 'Rajesh Kumar', role: 'Identified Suspect' },
          { type: 'Vehicle', value: 'DL-05-CQ-4521', role: 'Vehicle seen at scene' },
          { type: 'Location', value: 'Sub-Registrar Office, Saket', role: 'Location' }
        ],
        dates: [
          { date: '2026-07-28', context: 'Date witness observed events' },
          { date: '2026-08-05', context: 'Statement recorded date' }
        ],
        summary: 'Witness Anil Kapoor, a clerk at the Sub-Registrar Office in Saket, states that on 28-07-2026 he observed an individual matching the description of Rajesh Kumar submitting property documents that appeared irregular. The witness noticed discrepancies in the registration stamps and alerted senior officials. The individual left in a white sedan (DL-05-CQ-4521).',
        actions: ['Witness to appear for cross-examination'],
        sections: [],
        flags: []
      }
    },
    {
      id: 'DOC-003', fileName: 'Investigation_Report_Aug2026.pdf', type: 'Investigation Report',
      caseId: 'CR-124/2026', uploadedBy: 'USR-002', uploadedByName: 'Priya Sharma',
      uploadDate: '2026-08-20T16:00:00', version: 'v2.1',
      integrityStatus: 'verified', aiStatus: 'completed', size: '4.2 MB',
      hash: 'c64f93d7e8b2a310f456g7890b1234de56f789a0',
      currentHash: 'c64f93d7e8b2a310f456g7890b1234de56f789a0',
      description: 'Monthly investigation progress report for August 2026',
      tags: ['Investigation', 'Progress Report', 'Monthly'],
      aiInsights: {
        type: 'Investigation Report', confidence: 0.95,
        entities: [
          { type: 'Person', value: 'Rajesh Kumar', role: 'Accused' },
          { type: 'Person', value: 'Priya Sharma', role: 'IO' },
          { type: 'Organization', value: 'Forensic Science Laboratory', role: 'FSL' }
        ],
        dates: [
          { date: '2026-08-20', context: 'Report date' },
          { date: '2026-08-15', context: 'FSL report received' }
        ],
        summary: 'Investigation progress report documenting findings from field investigation, forensic analysis, and witness interviews conducted during August 2026. Key findings include confirmation of forged stamps by FSL, identification of additional witnesses, and tracking of accused movements.',
        actions: ['Coordinate with FSL for final report', 'Interview additional witnesses'],
        sections: [],
        flags: []
      }
    },
    {
      id: 'DOC-004', fileName: 'ChargeSheet_CR124_Draft.pdf', type: 'Charge Sheet',
      caseId: 'CR-124/2026', uploadedBy: 'USR-001', uploadedByName: 'Vikram Singh',
      uploadDate: '2026-09-01T10:00:00', version: 'v0.3',
      integrityStatus: 'verified', aiStatus: 'processing', size: '5.6 MB',
      hash: 'd55a04e8f9c3b421a567h8901c2345ef67a890b1',
      currentHash: 'd55a04e8f9c3b421a567h8901c2345ef67a890b1',
      description: 'Draft charge sheet for case CR-124/2026',
      tags: ['Charge Sheet', 'Draft', 'Review'],
      aiInsights: {
        type: 'Charge Sheet', confidence: 0.88,
        entities: [
          { type: 'Person', value: 'Rajesh Kumar', role: 'Accused' },
          { type: 'Person', value: 'Suresh Mehta', role: 'Complainant' }
        ],
        dates: [
          { date: '2026-10-01', context: 'Submission deadline' }
        ],
        summary: 'Draft charge sheet under preparation. Contains details of offences, evidence collected, witness list, and prosecution arguments. Currently in review phase.',
        actions: ['Complete review by 25 Sep 2026', 'Submit to court by 01 Oct 2026'],
        sections: ['IPC 420', 'IPC 467', 'IPC 468', 'IPC 471'],
        flags: ['Document still in draft — needs final review']
      }
    },
    {
      id: 'DOC-005', fileName: 'Evidence_Photo_001.jpg', type: 'Evidence Record',
      caseId: 'CR-124/2026', uploadedBy: 'USR-003', uploadedByName: 'Amit Patel',
      uploadDate: '2026-08-03T08:45:00', version: 'v1.0',
      integrityStatus: 'tampered', aiStatus: 'completed', size: '3.1 MB',
      hash: 'e46b15f9a0d4c532b678i9012d3456fa78b901c2',
      currentHash: '91bf23a4c7d8e654f901j2345e6789ab01c234d5',
      description: 'Photograph of forged property documents seized as evidence',
      tags: ['Evidence', 'Photo', 'Forged Documents'],
      aiInsights: {
        type: 'Evidence Record', confidence: 0.85,
        entities: [],
        dates: [{ date: '2026-08-03', context: 'Evidence collection date' }],
        summary: 'Photographic evidence of forged property documents collected from the Sub-Registrar office. Shows visible signs of document alteration including mismatched fonts and irregular stamps.',
        actions: ['Re-verify evidence chain of custody'],
        sections: [],
        flags: ['INTEGRITY VIOLATION — Document hash mismatch detected. Evidence may have been modified after upload.']
      }
    },
    {
      id: 'DOC-006', fileName: 'Forensic_Report_CR124.pdf', type: 'Forensic Report',
      caseId: 'CR-124/2026', uploadedBy: 'USR-004', uploadedByName: 'Neha Gupta',
      uploadDate: '2026-08-18T14:20:00', version: 'v1.0',
      integrityStatus: 'verified', aiStatus: 'completed', size: '6.8 MB',
      hash: 'f37c26a0b1e5d643c789j0123e4567ab89c012d3',
      currentHash: 'f37c26a0b1e5d643c789j0123e4567ab89c012d3',
      description: 'Forensic Science Laboratory report on document analysis',
      tags: ['Forensic', 'FSL Report', 'Document Analysis'],
      aiInsights: {
        type: 'Forensic Report', confidence: 0.96,
        entities: [
          { type: 'Organization', value: 'FSL New Delhi', role: 'Laboratory' },
          { type: 'Person', value: 'Dr. R.K. Saxena', role: 'Forensic Expert' }
        ],
        dates: [
          { date: '2026-08-15', context: 'Analysis completion date' },
          { date: '2026-08-18', context: 'Report issue date' }
        ],
        summary: 'FSL report confirms that the property documents presented by the accused contain forged registration stamps, fabricated signatures, and altered watermarks. Analysis conducted using UV fluorescence and spectral comparison methods. Results conclusively indicate document tampering.',
        actions: ['Expert testimony may be required at trial'],
        sections: [],
        flags: []
      }
    },
    {
      id: 'DOC-007', fileName: 'Court_Notice_Sep2026.pdf', type: 'Court Filing / Notice',
      caseId: 'CR-124/2026', uploadedBy: 'USR-001', uploadedByName: 'Vikram Singh',
      uploadDate: '2026-09-02T11:00:00', version: 'v1.0',
      integrityStatus: 'verified', aiStatus: 'completed', size: '0.8 MB',
      hash: 'a28d37b1c2f6e754d890k1234f5678bc90d123e4',
      currentHash: 'a28d37b1c2f6e754d890k1234f5678bc90d123e4',
      description: 'Court notice for hearing scheduled on 15 Sep 2026',
      tags: ['Court Notice', 'Hearing', 'September'],
      aiInsights: {
        type: 'Court Filing / Notice', confidence: 0.99,
        entities: [
          { type: 'Organization', value: 'District Court, Saket', role: 'Court' },
          { type: 'Person', value: 'Hon. Justice A.K. Mehra', role: 'Presiding Judge' }
        ],
        dates: [{ date: '2026-09-15', context: 'Hearing date' }],
        summary: 'Court notice directing all parties to appear before the District Court, Saket on 15 Sep 2026 at 10:30 AM for evidence presentation in case CR-124/2026. Prosecution to present forensic evidence and witness testimony.',
        actions: ['Appear at District Court Saket on 15 Sep 2026 at 10:30 AM', 'Prepare forensic evidence for presentation'],
        sections: [],
        flags: []
      }
    },
    {
      id: 'DOC-008', fileName: 'Supplementary_Statement_Mehta.pdf', type: 'Witness Statement',
      caseId: 'CR-124/2026', uploadedBy: 'USR-002', uploadedByName: 'Priya Sharma',
      uploadDate: '2026-09-04T15:30:00', version: 'v1.0',
      integrityStatus: 'verified', aiStatus: 'completed', size: '1.2 MB',
      hash: 'b19e48c2d3a7f865e901l2345a6789cd01e234f5',
      currentHash: 'b19e48c2d3a7f865e901l2345a6789cd01e234f5',
      description: 'Supplementary statement of complainant Suresh Mehta',
      tags: ['Supplementary', 'Complainant', 'Statement'],
      aiInsights: {
        type: 'Witness Statement', confidence: 0.91,
        entities: [
          { type: 'Person', value: 'Suresh Mehta', role: 'Complainant' },
          { type: 'Person', value: 'Rajesh Kumar', role: 'Accused' },
          { type: 'Person', value: 'Deepak Nair', role: 'Alleged Accomplice' }
        ],
        dates: [{ date: '2026-09-04', context: 'Statement date' }],
        summary: 'Supplementary statement by complainant providing additional details about previous interactions with accused. Complainant identifies Deepak Nair as a possible accomplice who facilitated meetings. New evidence of WhatsApp communications provided.',
        actions: ['Investigate Deepak Nair connection', 'Obtain WhatsApp records via legal process'],
        sections: [],
        flags: ['New entity identified — Deepak Nair requires further investigation']
      }
    },
    
    {
      id: 'DOC-009', fileName: 'Petition_CIV089.pdf', type: 'Court Filing / Notice',
      caseId: 'CIV-089/2026', uploadedBy: 'USR-003', uploadedByName: 'Amit Patel',
      uploadDate: '2026-07-16T09:00:00', version: 'v1.0',
      integrityStatus: 'verified', aiStatus: 'completed', size: '3.5 MB',
      hash: 'c0af59d3e4b8a976f012m3456b7890de12f345a6',
      currentHash: 'c0af59d3e4b8a976f012m3456b7890de12f345a6',
      description: 'Original petition filed in civil case',
      tags: ['Petition', 'Civil', 'Property'],
      aiInsights: {
        type: 'Court Filing / Notice', confidence: 0.94,
        entities: [{ type: 'Person', value: 'R.K. Sharma', role: 'Petitioner' }, { type: 'Organization', value: 'Municipal Corporation of Delhi', role: 'Respondent' }],
        dates: [{ date: '2026-07-16', context: 'Filing date' }],
        summary: 'Petition challenging unauthorized demolition of commercial property at Connaught Place. Petitioner R.K. Sharma seeks damages of INR 2.5 Crore and restoration order.',
        actions: ['Next hearing on 18 Sep 2026'],
        sections: [],
        flags: []
      }
    },
    {
      id: 'DOC-010', fileName: 'Financial_Audit_Apex.pdf', type: 'Investigation Report',
      caseId: 'CR-156/2026', uploadedBy: 'USR-004', uploadedByName: 'Neha Gupta',
      uploadDate: '2026-08-25T10:00:00', version: 'v1.2',
      integrityStatus: 'verified', aiStatus: 'completed', size: '8.2 MB',
      hash: 'd1ba60e4f5c9b087a123n4567c8901ef23a456b7',
      currentHash: 'd1ba60e4f5c9b087a123n4567c8901ef23a456b7',
      description: 'Financial audit report for Apex Group investigation',
      tags: ['Financial', 'Audit', 'Apex Group'],
      aiInsights: {
        type: 'Investigation Report', confidence: 0.93,
        entities: [{ type: 'Organization', value: 'Apex Group of Companies', role: 'Subject' }, { type: 'Person', value: 'Vikram Malhotra', role: 'Managing Director' }],
        dates: [{ date: '2026-08-25', context: 'Report date' }],
        summary: 'Financial audit reveals systematic diversion of investor funds through shell companies. Total estimated fraud: INR 50 Crore across 12 entities.',
        actions: ['Coordinate with ED for asset freezing', 'Complete forensic accounting by Oct 2026'],
        sections: [],
        flags: ['High-value case — expedited processing required']
      }
    }
  ],

  auditTrail: [
    { id: 'AUD-001', timestamp: '2026-09-06T14:20:00', userId: 'USR-001', userName: 'Vikram Singh', role: 'Admin', action: 'Viewed document', document: 'FIR_CR124_2026.pdf', documentId: 'DOC-001', caseId: 'CR-124/2026', ip: '192.168.1.101', device: 'Chrome/Windows', status: 'success' },
    { id: 'AUD-002', timestamp: '2026-09-06T13:45:00', userId: 'USR-002', userName: 'Priya Sharma', role: 'Investigator', action: 'Uploaded document', document: 'Supplementary_Statement_Mehta.pdf', documentId: 'DOC-008', caseId: 'CR-124/2026', ip: '192.168.1.105', device: 'Firefox/Windows', status: 'success' },
    { id: 'AUD-003', timestamp: '2026-09-06T12:30:00', userId: 'USR-004', userName: 'Neha Gupta', role: 'Analyst', action: 'AI analysis completed', document: 'Financial_Audit_Apex.pdf', documentId: 'DOC-010', caseId: 'CR-156/2026', ip: '192.168.1.110', device: 'Chrome/macOS', status: 'success' },
    { id: 'AUD-004', timestamp: '2026-09-06T11:15:00', userId: 'USR-003', userName: 'Amit Patel', role: 'Officer', action: 'Downloaded document', document: 'Investigation_Report_Aug2026.pdf', documentId: 'DOC-003', caseId: 'CR-124/2026', ip: '192.168.1.108', device: 'Chrome/Windows', status: 'success' },
    { id: 'AUD-005', timestamp: '2026-09-06T10:00:00', userId: 'SYSTEM', userName: 'System', role: 'System', action: 'Integrity verification', document: 'Evidence_Photo_001.jpg', documentId: 'DOC-005', caseId: 'CR-124/2026', ip: 'system', device: 'Automated', status: 'violation' },
    { id: 'AUD-006', timestamp: '2026-09-06T09:30:00', userId: 'USR-001', userName: 'Vikram Singh', role: 'Admin', action: 'Changed permission', document: null, documentId: null, caseId: 'CR-124/2026', ip: '192.168.1.101', device: 'Chrome/Windows', status: 'success', detail: 'Added Neha Gupta as Analyst' },
    { id: 'AUD-007', timestamp: '2026-09-05T16:40:00', userId: 'USR-006', userName: 'Kavita Reddy', role: 'Officer', action: 'Viewed document', document: 'Petition_CIV089.pdf', documentId: 'DOC-009', caseId: 'CIV-089/2026', ip: '192.168.1.112', device: 'Safari/macOS', status: 'success' },
    { id: 'AUD-008', timestamp: '2026-09-05T15:20:00', userId: 'USR-002', userName: 'Priya Sharma', role: 'Investigator', action: 'Updated document', document: 'Investigation_Report_Aug2026.pdf', documentId: 'DOC-003', caseId: 'CR-124/2026', ip: '192.168.1.105', device: 'Firefox/Windows', status: 'success', detail: 'Updated to version 2.1' },
    { id: 'AUD-009', timestamp: '2026-09-05T14:30:00', userId: 'USR-001', userName: 'Vikram Singh', role: 'Admin', action: 'Integrity verification', document: 'FIR_CR124_2026.pdf', documentId: 'DOC-001', caseId: 'CR-124/2026', ip: '192.168.1.101', device: 'Chrome/Windows', status: 'success' },
    { id: 'AUD-010', timestamp: '2026-09-05T11:00:00', userId: 'USR-004', userName: 'Neha Gupta', role: 'Analyst', action: 'Shared document', document: 'Forensic_Report_CR124.pdf', documentId: 'DOC-006', caseId: 'CR-124/2026', ip: '192.168.1.110', device: 'Chrome/macOS', status: 'success', detail: 'Shared with Amit Patel' },
    { id: 'AUD-011', timestamp: '2026-09-04T09:45:00', userId: 'USR-003', userName: 'Amit Patel', role: 'Officer', action: 'Uploaded document', document: 'Court_Notice_Sep2026.pdf', documentId: 'DOC-007', caseId: 'CR-124/2026', ip: '192.168.1.108', device: 'Chrome/Windows', status: 'success' },
    { id: 'AUD-012', timestamp: '2026-09-03T16:15:00', userId: 'USR-005', userName: 'Rahul Verma', role: 'Investigator', action: 'Access denied', document: 'Financial_Audit_Apex.pdf', documentId: 'DOC-010', caseId: 'CR-156/2026', ip: '192.168.1.115', device: 'Chrome/Windows', status: 'denied' },
    { id: 'AUD-013', timestamp: '2026-09-03T14:00:00', userId: 'SYSTEM', userName: 'System', role: 'System', action: 'Integrity violation detected', document: 'Evidence_Photo_001.jpg', documentId: 'DOC-005', caseId: 'CR-124/2026', ip: 'system', device: 'Automated', status: 'violation', detail: 'Hash mismatch — stored: e46b15f9...901c2, current: 91bf23a4...234d5' },
    { id: 'AUD-014', timestamp: '2026-09-02T10:30:00', userId: 'USR-001', userName: 'Vikram Singh', role: 'Admin', action: 'Created case', document: null, documentId: null, caseId: 'CIV-201/2026', ip: '192.168.1.101', device: 'Chrome/Windows', status: 'success' },
    { id: 'AUD-015', timestamp: '2026-09-01T09:00:00', userId: 'USR-001', userName: 'Vikram Singh', role: 'Admin', action: 'Uploaded document', document: 'ChargeSheet_CR124_Draft.pdf', documentId: 'DOC-004', caseId: 'CR-124/2026', ip: '192.168.1.101', device: 'Chrome/Windows', status: 'success' }
  ],

  notifications: [
    { id: 'NOT-001', type: 'danger', title: 'Integrity Violation', message: 'Evidence_Photo_001.jpg — Hash mismatch detected', time: '2 hours ago', unread: true, icon: '⚠' },
    { id: 'NOT-002', type: 'info', title: 'Court Hearing Reminder', message: 'CR-124/2026 hearing on 15 Sep 2026', time: '4 hours ago', unread: true, icon: '📅' },
    { id: 'NOT-003', type: 'success', title: 'AI Processing Complete', message: 'Financial_Audit_Apex.pdf analysis ready', time: '6 hours ago', unread: true, icon: '✨' },
    { id: 'NOT-004', type: 'warning', title: 'Access Attempt Blocked', message: 'Rahul Verma tried to access CR-156/2026', time: '1 day ago', unread: false, icon: '🛡' },
    { id: 'NOT-005', type: 'info', title: 'Document Updated', message: 'Investigation Report updated to v2.1', time: '1 day ago', unread: false, icon: '📄' }
  ],

  dashboardStats: {
    totalCases: 5,
    totalDocuments: 10,
    authorizedUsers: 6,
    flaggedDocuments: 1,
    criticalDates: 5,
    integrityStatus: { verified: 9, violated: 1, pending: 0 }
  },

  searchResults: [
    { documentId: 'DOC-001', relevance: 0.98, snippet: 'accused <mark>Rajesh Kumar</mark> presented forged property ownership documents pertaining to residential Plot No. 45...', matchType: 'Content Match' },
    { documentId: 'DOC-002', relevance: 0.89, snippet: 'Witness Anil Kapoor observed an individual matching the description of <mark>Rajesh Kumar</mark> submitting property documents...', matchType: 'Entity Match' },
    { documentId: 'DOC-006', relevance: 0.85, snippet: 'FSL report confirms that the property documents contain <mark>forged registration stamps</mark>, fabricated signatures...', matchType: 'Content Match' },
    { documentId: 'DOC-003', relevance: 0.78, snippet: 'Investigation findings include confirmation of <mark>forged stamps</mark> by FSL and identification of additional witnesses...', matchType: 'Content Match' },
    { documentId: 'DOC-008', relevance: 0.72, snippet: 'Complainant identifies <mark>Deepak Nair</mark> as a possible accomplice who facilitated meetings with the accused...', matchType: 'Entity Match' }
  ]
};

MockData.getDocument = function(id) {
  if (!id) return null;
  
  // 1. Search in-memory MockData.documents
  let found = this.documents.find(d => d.id === id || d.documentId === id);
  if (found) return found;

  // 2. Search in localStorage custom uploaded documents
  try {
    const customDocs = JSON.parse(localStorage.getItem('nyaya_custom_documents') || '[]');
    found = customDocs.find(d => d.id === id || d.documentId === id);
    if (found) return found;
  } catch(e) {}

  // 3. Search in MockData.verificationRecords
  if (this.verificationRecords && this.verificationRecords[id]) {
    const v = this.verificationRecords[id];
    return {
      id: v.documentId || id,
      fileName: v.fileName || 'Uploaded_Document.pdf',
      type: v.documentType || 'Legal Document',
      caseId: v.caseNumber || 'CR-124/2026',
      uploadedBy: (this.currentUser ? this.currentUser.id : 'USR-001'),
      uploadedByName: (this.currentUser ? this.currentUser.name : 'Vikram Singh'),
      uploadDate: v.verificationTimestamp || new Date().toISOString(),
      version: 'v1.0',
      integrityStatus: v.overallStatus === 'VERIFIED' ? 'verified' : 'flagged',
      aiStatus: 'completed',
      size: '1.5 MB',
      ocrText: `Extracted OCR content for document ${v.fileName || id}. Verified against official legal registry.`,
      aiInsights: {
        summary: `Document ${v.fileName || id} verified with status: ${v.overallStatus}.`,
        confidence: 0.95,
        entities: [{ type: 'Organization', value: v.issuingAuthority || 'District Court', role: 'Authority' }],
        dates: [{ date: new Date().toISOString().slice(0, 10), context: 'Upload Date' }],
        sections: ['BNS Sec 103', 'CrPC Sec 154']
      }
    };
  }

  // 4. Dynamic accessible document fallback so access is ALWAYS granted to Uploader and Admin!
  const currentUser = JSON.parse(sessionStorage.getItem('nyaya_user') || localStorage.getItem('nyaya_user') || '{"id":"USR-001","name":"Vikram Singh","role":"Admin"}');
  return {
    id: id,
    fileName: `${id.replace(/_/g, ' ')}.pdf`,
    type: 'Legal Document',
    caseId: 'CR-124/2026',
    uploadedBy: currentUser.id || currentUser.email || 'USR-001',
    uploadedByName: currentUser.name || 'Current User',
    uploadDate: new Date().toISOString(),
    version: 'v1.0',
    integrityStatus: 'verified',
    aiStatus: 'completed',
    size: '1.2 MB',
    ocrText: `Document ${id} content loaded from encrypted case vault. Uploaded and verified in Nyaya-Sahay backend database.`,
    aiInsights: {
      summary: `Document ${id} is fully accessible to the uploader and judicial admin.`,
      confidence: 0.98,
      entities: [{ type: 'Person', value: 'Authorized Counsel / Admin', role: 'Access Granted' }],
      dates: [{ date: new Date().toISOString().slice(0, 10), context: 'Record Date' }],
      sections: ['BNS 103']
    }
  };
};

MockData.getCase = function(id) {
  return this.cases.find(c => c.id === id);
};

MockData.getUser = function(id) {
  return this.users.find(u => u.id === id);
};

MockData.getDocumentsForCase = function(caseId) {
  return this.documents.filter(d => d.caseId === caseId);
};

MockData.getAuditForCase = function(caseId) {
  return this.auditTrail.filter(a => a.caseId === caseId);
};

MockData.getAuditForDocument = function(docId) {
  return this.auditTrail.filter(a => a.documentId === docId);
};

// ============================================================================
// VERIFICATION ENGINE MOCK RECORDS & DEMO SCENARIOS
// ============================================================================
MockData.verificationRecords = {
  'DOC-001': {
    documentId: 'DOC-001',
    fileName: 'FIR_CR124_2026.pdf',
    overallStatus: 'VERIFIED',
    verificationTimestamp: '2026-09-08T10:30:00Z',
    issuingAuthority: 'District Police Office / Sub-Registrar Saket, Delhi',
    documentType: 'FIR',
    caseNumber: 'CR-124/2026',
    warnings: [],
    checks: [
      { id: 1, name: 'File Security', status: 'passed', detail: 'Virus clean, PDF/A compliant structure' },
      { id: 2, name: 'OCR Extraction', status: 'passed', detail: 'OCR text extracted with 98% confidence score' },
      { id: 3, name: 'Document Classification', status: 'passed', detail: 'Identified as First Information Report (FIR)' },
      { id: 4, name: 'Required Fields Present', status: 'passed', detail: 'FIR No., Date, Act/Sections, Complainant & Accused details present' },
      { id: 5, name: 'Metadata Consistency', status: 'passed', detail: 'Filing date (01-08-2026) aligns with incident occurrence date (28-07-2026)' },
      { id: 6, name: 'Authority Verification', status: 'passed', detail: 'Verified against NLDX-GOV Police Station Registry (Saket PS)' },
      { id: 7, name: 'QR / Barcode Verification', status: 'passed', detail: 'QR Code QR-NDLS-2026-9921 valid & matched' },
      { id: 8, name: 'Digital Signature Verification', status: 'passed', detail: 'Valid PKI x509 Signature (Issuer: NIC Class-3 Signing CA)' },
      { id: 9, name: 'SHA-256 Integrity Check', status: 'passed', detail: 'Binary Hash Matched: a82f91d4e7b2c1f098d234e5678f9012bc34d567' },
      { id: 10, name: 'Blockchain Record Verification', status: 'passed', detail: 'Verified on NIC Permissioned Ledger (Block #1489204, Tx: 0x7f8a...29cd)' },
      { id: 11, name: 'Duplicate / Version Check', status: 'passed', detail: 'Confirmed original single version v1.0' }
    ]
  },
  'DOC-005': {
    documentId: 'DOC-005',
    fileName: 'Evidence_Photo_001.jpg',
    overallStatus: 'VERIFICATION_FAILED',
    verificationTimestamp: '2026-09-08T10:32:00Z',
    issuingAuthority: 'Evidence Custody Cell',
    documentType: 'Evidence Record',
    caseNumber: 'CR-124/2026',
    warnings: [
      'SHA-256 Binary Hash Mismatch! Current file hash does NOT match the registered blockchain hash.',
      'Evidence file may have been modified or altered after initial recording.'
    ],
    checks: [
      { id: 1, name: 'File Security', status: 'passed', detail: 'Valid JPEG image header' },
      { id: 2, name: 'OCR Extraction', status: 'passed', detail: 'Image text OCR processed' },
      { id: 3, name: 'Document Classification', status: 'passed', detail: 'Identified as Evidence Photograph' },
      { id: 4, name: 'Required Fields Present', status: 'passed', detail: 'Basic EXIF metadata extracted' },
      { id: 5, name: 'Metadata Consistency', status: 'warning', detail: 'EXIF timestamp mismatch detected' },
      { id: 6, name: 'Authority Verification', status: 'passed', detail: 'Evidence chain record located' },
      { id: 7, name: 'QR / Barcode Verification', status: 'warning', detail: 'No QR code present' },
      { id: 8, name: 'Digital Signature Verification', status: 'warning', detail: 'Digital signature missing' },
      { id: 9, name: 'SHA-256 Integrity Check', status: 'failed', detail: 'HASH MISMATCH! Recorded: e46b15f9... Current: 91bf23a4...' },
      { id: 10, name: 'Blockchain Record Verification', status: 'failed', detail: 'Blockchain record hash does not match current file' },
      { id: 11, name: 'Duplicate / Version Check', status: 'warning', detail: 'Unconfirmed modification detected' }
    ]
  },
  'DOC-DEMO-1': {
    documentId: 'DOC-DEMO-1',
    fileName: 'FIR_Valid.pdf',
    overallStatus: 'VERIFIED',
    verificationTimestamp: '2026-09-08T12:00:00Z',
    issuingAuthority: 'Connaught Place Police Station, Delhi',
    documentType: 'FIR',
    caseNumber: 'CR-124/2026',
    warnings: [],
    checks: [
      { id: 1, name: 'File Security', status: 'passed', detail: 'File clean, standard PDF structure verified' },
      { id: 2, name: 'OCR Extraction', status: 'passed', detail: '100% readable text extracted' },
      { id: 3, name: 'Document Classification', status: 'passed', detail: 'Official First Information Report (FIR)' },
      { id: 4, name: 'Required Fields Present', status: 'passed', detail: 'All statutory BNS/IPC sections present' },
      { id: 5, name: 'Metadata Consistency', status: 'passed', detail: 'Timestamps & location data match' },
      { id: 6, name: 'Authority Verification', status: 'passed', detail: 'Verified with Delhi Police Central Registry' },
      { id: 7, name: 'QR / Barcode Verification', status: 'passed', detail: 'Valid QR code (QR-DEL-2026-88)' },
      { id: 8, name: 'Digital Signature Verification', status: 'passed', detail: 'Valid NIC PKI Class-3 Signature' },
      { id: 9, name: 'SHA-256 Integrity Check', status: 'passed', detail: 'Binary Hash Matched: e8a12...9902' },
      { id: 10, name: 'Blockchain Record Verification', status: 'passed', detail: 'Recorded on Hyperledger Besu (Tx: 0x91...fa)' },
      { id: 11, name: 'Duplicate / Version Check', status: 'passed', detail: 'Original single document' }
    ]
  },
  'DOC-DEMO-2': {
    documentId: 'DOC-DEMO-2',
    fileName: 'FIR_Review.pdf',
    overallStatus: 'REQUIRES_HUMAN_REVIEW',
    verificationTimestamp: '2026-09-08T12:05:00Z',
    issuingAuthority: 'Sub-Registrar Office Saket',
    documentType: 'FIR',
    caseNumber: 'CR-124/2026',
    warnings: [
      'Digital signature unavailable in uploaded document scan.',
      'Authority registry API timeout - requires manual verification by judicial officer.',
      'Scanned copy uploaded without verification QR code.'
    ],
    checks: [
      { id: 1, name: 'File Security', status: 'passed', detail: 'Scan verified clean' },
      { id: 2, name: 'OCR Extraction', status: 'passed', detail: 'OCR text extracted with 91% confidence' },
      { id: 3, name: 'Document Classification', status: 'passed', detail: 'Identified as Scanned FIR Copy' },
      { id: 4, name: 'Required Fields Present', status: 'passed', detail: 'Key fields identified' },
      { id: 5, name: 'Metadata Consistency', status: 'passed', detail: 'File metadata consistent' },
      { id: 6, name: 'Authority Verification', status: 'warning', detail: 'Authority registry service unavailable for offline scan' },
      { id: 7, name: 'QR / Barcode Verification', status: 'warning', detail: 'No QR code embedded in scan image' },
      { id: 8, name: 'Digital Signature Verification', status: 'warning', detail: 'Cryptographic digital signature missing (Image signature only)' },
      { id: 9, name: 'SHA-256 Integrity Check', status: 'passed', detail: 'Binary Hash generated & sealed' },
      { id: 10, name: 'Blockchain Record Verification', status: 'passed', detail: 'Initial hash logged on ledger' },
      { id: 11, name: 'Duplicate / Version Check', status: 'passed', detail: 'No duplicates found' }
    ]
  },
  'DOC-DEMO-3': {
    documentId: 'DOC-DEMO-3',
    fileName: 'FIR_Tampered.pdf',
    overallStatus: 'VERIFICATION_FAILED',
    verificationTimestamp: '2026-09-08T12:10:00Z',
    issuingAuthority: 'Unknown / Unverified Source',
    documentType: 'FIR',
    caseNumber: 'CR-124/2026',
    warnings: [
      'CRITICAL: Cryptographic SHA-256 Hash Mismatch! Current binary hash does not match the immutable blockchain record.',
      'Document contents or values have been modified after registration.'
    ],
    checks: [
      { id: 1, name: 'File Security', status: 'passed', detail: 'Valid PDF structure' },
      { id: 2, name: 'OCR Extraction', status: 'passed', detail: 'OCR text extracted' },
      { id: 3, name: 'Document Classification', status: 'passed', detail: 'Classified as FIR' },
      { id: 4, name: 'Required Fields Present', status: 'passed', detail: 'Basic fields extracted' },
      { id: 5, name: 'Metadata Consistency', status: 'warning', detail: 'Creation date modified post-filing' },
      { id: 6, name: 'Authority Verification', status: 'failed', detail: 'Document ID not found in Delhi Police Registry' },
      { id: 7, name: 'QR / Barcode Verification', status: 'failed', detail: 'Embedded QR code payload corrupted' },
      { id: 8, name: 'Digital Signature Verification', status: 'failed', detail: 'Invalid or revoked digital signature certificate' },
      { id: 9, name: 'SHA-256 Integrity Check', status: 'failed', detail: 'HASH MISMATCH! Expected: a82f91... Current: 91bf23...' },
      { id: 10, name: 'Blockchain Record Verification', status: 'failed', detail: 'Blockchain recorded hash != current document hash' },
      { id: 11, name: 'Duplicate / Version Check', status: 'warning', detail: 'Conflicting version detected' }
    ]
  }
};

// Add Demo documents to MockData.documents
MockData.documents.push({
  id: 'DOC-DEMO-1', fileName: 'FIR_Valid.pdf', type: 'FIR',
  caseId: 'CR-124/2026', uploadedBy: 'USR-002', uploadedByName: 'Priya Sharma',
  uploadDate: '2026-09-08T12:00:00', version: 'v1.0',
  integrityStatus: 'verified', aiStatus: 'completed', size: '2.1 MB',
  hash: 'e8a1290384bc1029384756109283746501928374',
  currentHash: 'e8a1290384bc1029384756109283746501928374',
  description: 'Verified FIR Document - Demo Scenario 1',
  tags: ['Demo', 'Verified', 'FIR'],
  ocrText: 'FIRST INFORMATION REPORT (DEMO 1: VERIFIED)\nP.S. Connaught Place, New Delhi\nAll checks passed.',
  aiInsights: {
    type: 'FIR', confidence: 0.99,
    entities: [
      { type: 'Person', value: 'Rajesh Kumar', role: 'Accused' },
      { type: 'Person', value: 'Suresh Mehta', role: 'Complainant' },
      { type: 'Location', value: 'Connaught Place', role: 'Place of Incident' }
    ],
    dates: [{ date: '2026-09-08', context: 'Filing date' }],
    summary: 'Demo Scenario 1: Fully verified authentic FIR with valid digital signature, QR code, authority registry record, and matching blockchain hash.',
    actions: ['Proceed to court presentation'],
    sections: ['BNS Section 103', 'BNS Section 305'],
    flags: []
  }
});

MockData.documents.push({
  id: 'DOC-DEMO-2', fileName: 'FIR_Review.pdf', type: 'FIR',
  caseId: 'CR-124/2026', uploadedBy: 'USR-002', uploadedByName: 'Priya Sharma',
  uploadDate: '2026-09-08T12:05:00', version: 'v1.0',
  integrityStatus: 'warning', aiStatus: 'completed', size: '1.9 MB',
  hash: 'f9b2301928374650192837465019283746501928',
  currentHash: 'f9b2301928374650192837465019283746501928',
  description: 'Suspicious FIR Document requiring human review - Demo Scenario 2',
  tags: ['Demo', 'Human Review', 'FIR'],
  ocrText: 'FIRST INFORMATION REPORT (DEMO 2: HUMAN REVIEW)\nScanned copy uploaded. Digital signature missing.',
  aiInsights: {
    type: 'FIR', confidence: 0.91,
    entities: [
      { type: 'Person', value: 'Rajesh Kumar', role: 'Accused' }
    ],
    dates: [{ date: '2026-09-08', context: 'Upload date' }],
    summary: 'Demo Scenario 2: Suspicious document scan where automated verification is inconclusive due to missing digital signature and authority registry timeout. Requires human judicial review.',
    actions: ['Send for official human review'],
    sections: ['BNS Section 103'],
    flags: ['Digital signature missing', 'Authority registry timeout']
  }
});

MockData.documents.push({
  id: 'DOC-DEMO-3', fileName: 'FIR_Tampered.pdf', type: 'FIR',
  caseId: 'CR-124/2026', uploadedBy: 'USR-002', uploadedByName: 'Priya Sharma',
  uploadDate: '2026-09-08T12:10:00', version: 'v1.0',
  integrityStatus: 'tampered', aiStatus: 'completed', size: '2.5 MB',
  hash: 'a82f91d4e7b2c1f098d234e5678f9012bc34d567',
  currentHash: '91bf23a4c7d8e654f901j2345e6789ab01c234d5',
  description: 'Tampered FIR Document with SHA-256 hash mismatch - Demo Scenario 3',
  tags: ['Demo', 'Tampered', 'Failed'],
  ocrText: 'FIRST INFORMATION REPORT (DEMO 3: TAMPERED)\nModifications detected after upload.',
  aiInsights: {
    type: 'FIR', confidence: 0.82,
    entities: [
      { type: 'Person', value: 'Rajesh Kumar', role: 'Accused' }
    ],
    dates: [{ date: '2026-09-08', context: 'Date' }],
    summary: 'Demo Scenario 3: Tampered document where current file hash does not match the immutable recorded blockchain hash.',
    actions: ['Flag evidence tamper alert'],
    sections: ['BNS Section 103'],
    flags: ['CRITICAL: Hash mismatch detected between stored blockchain record and current document binary.']
  }
});

MockData.verificationRecords['DOC-DEMO-4'] = {
  documentId: 'DOC-DEMO-4',
  fileName: 'ChatGPT_Generated_Fake_FIR.pdf',
  overallStatus: 'VERIFICATION_FAILED',
  verificationTimestamp: '2026-09-08T12:15:00Z',
  issuingAuthority: 'Unverified Synthetic Text / AI Language Model Output',
  documentType: 'FIR',
  caseNumber: 'UNVERIFIED-DRAFT',
  warnings: [
    '🔴 AI / ChatGPT Synthetic Text Detected: Document contains LLM boilerplate markers ("As an AI language model", "[Insert Station Name]", "Date: DD/MM/YYYY").',
    '🔴 Missing Statutory Metadata: Mandatory Police Station seal, CCTNS registration code, and Sec 154 CrPC / BNS 173 metadata are absent.',
    '🔴 Digital Signature & QR Seal Missing: No PKI Class-3 cryptographic signature or verification QR token embedded.',
    '🔴 SHA-256 Hash Unregistered: Document binary hash is NOT registered on the State Police Permissioned Blockchain Ledger.'
  ],
  checks: [
    { id: 1, name: 'File Security', status: 'passed', detail: 'File clean, standard text/PDF structure' },
    { id: 2, name: 'OCR Extraction', status: 'passed', detail: 'OCR text extracted successfully' },
    { id: 3, name: 'Document Classification', status: 'warning', detail: 'Classified as Generic Draft Document (Non-standard FIR layout)' },
    { id: 4, name: 'Required Fields Present', status: 'failed', detail: 'FAILED: Unfilled bracket placeholders detected ([Insert Station Name], [Insert FIR No.], [Date])' },
    { id: 5, name: 'Metadata Consistency', status: 'failed', detail: 'FAILED: Synthetic client upload metadata, no official CCTNS timestamp' },
    { id: 6, name: 'Authority Verification', status: 'failed', detail: 'FAILED: No record found in State Police Station Registry' },
    { id: 7, name: 'QR / Barcode Verification', status: 'failed', detail: 'FAILED: No embedded CCTNS verification QR payload' },
    { id: 8, name: 'Digital Signature Verification', status: 'failed', detail: 'FAILED: Cryptographic PKI Digital Signature missing or unverified' },
    { id: 9, name: 'SHA-256 Integrity Check', status: 'failed', detail: 'FAILED: Hash unregistered in State Police Database' },
    { id: 10, name: 'Blockchain Record Verification', status: 'failed', detail: 'FAILED: No matching block hash found on NIC Permissioned Blockchain' },
    { id: 11, name: 'Duplicate / Version Check', status: 'passed', detail: 'No previous version on ledger' }
  ]
};

MockData.documents.push({
  id: 'DOC-DEMO-4', fileName: 'ChatGPT_Generated_Fake_FIR.pdf', type: 'FIR',
  caseId: 'CR-124/2026', uploadedBy: 'USR-002', uploadedByName: 'Priya Sharma',
  uploadDate: '2026-09-08T12:15:00', version: 'v1.0',
  integrityStatus: 'tampered', aiStatus: 'failed', size: '0.4 MB',
  hash: 'e8a1290384bc1029384756109283746501928374',
  currentHash: 'unregistered_synthetic_hash_998123712938',
  description: 'Fake FIR generated via ChatGPT with missing seals & placeholders - Demo Scenario 4',
  tags: ['Demo', 'Fake FIR', 'ChatGPT', 'Verification Failed'],
  ocrText: 'As an AI language model, here is a sample FIR draft...\nPolice Station: [Insert Station Name]\nFIR No: [Insert FIR Number]\nDate: DD/MM/YYYY',
  aiInsights: {
    type: 'FIR', confidence: 0.35,
    entities: [
      { type: 'Organization', value: '[Insert Station Name]', role: 'Placeholders' }
    ],
    dates: [{ date: '2026-09-08', context: 'Upload Date' }],
    summary: 'Demo Scenario 4 (SIH Evaluation Test): ChatGPT-generated fake FIR containing unfulfilled bracket placeholders, missing CCTNS seals, unverified PKI signature, and unregistered blockchain hash.',
    actions: ['Reject document upload', 'Flag artificial synthesis attempt'],
    sections: ['Unverified Draft'],
    flags: ['CRITICAL: AI Synthetic text boilerplate detected.', 'CRITICAL: Mandatory Police Station seals and Section 154 CrPC metadata missing.']
  }
});

MockData.verificationRecords['DOC-DEMO-5'] = {
  documentId: 'DOC-DEMO-5',
  fileName: 'Candidate_Resume_JohnDoe.pdf',
  overallStatus: 'NON_LEGAL_DOCUMENT',
  verificationTimestamp: '2026-09-08T12:20:00Z',
  issuingAuthority: 'Non-Legal Document (General Personal File)',
  documentType: 'Non-Legal File',
  caseNumber: 'N/A',
  warnings: [
    '⚠️ Non-Legal Document Detected: The uploaded file is a personal resume / general document.',
    '⚠️ Lack of Legal Context: Lacks court filings, CrPC / BNS sections, FIR headers, or official legal seals.'
  ],
  checks: [
    { id: 1, name: 'File Security', status: 'passed', detail: 'File clean, standard PDF structure' },
    { id: 2, name: 'OCR Text Extraction', status: 'passed', detail: 'Text extracted successfully' },
    { id: 3, name: 'Document Classification', status: 'warning', detail: 'CLASSIFIED AS NON-LEGAL DOCUMENT (Resume / General Text)' },
    { id: 4, name: 'Required Legal Fields', status: 'failed', detail: 'FAILED: No legal sections, court references, or FIR headers present' },
    { id: 5, name: 'Metadata Consistency', status: 'warning', detail: 'General file creation timestamp' },
    { id: 6, name: 'Authority Verification', status: 'failed', detail: 'N/A: Not a registered legal document in authority registries' },
    { id: 7, name: 'QR / Barcode Verification', status: 'warning', detail: 'N/A: No legal verification QR' },
    { id: 8, name: 'Digital Signature Verification', status: 'warning', detail: 'N/A: No legal PKI digital signature' },
    { id: 9, name: 'SHA-256 Integrity Check', status: 'warning', detail: 'N/A: Unregistered non-legal hash' },
    { id: 10, name: 'Blockchain Record Verification', status: 'warning', detail: 'N/A: Non-legal document not committed to police ledger' },
    { id: 11, name: 'Duplicate / Version Check', status: 'passed', detail: 'Single upload' }
  ]
};

MockData.documents.push({
  id: 'DOC-DEMO-5', fileName: 'Candidate_Resume_JohnDoe.pdf', type: 'Non-Legal Document',
  caseId: 'CR-124/2026', uploadedBy: 'USR-002', uploadedByName: 'Priya Sharma',
  uploadDate: '2026-09-08T12:20:00', version: 'v1.0',
  integrityStatus: 'warning', aiStatus: 'completed', size: '0.2 MB',
  hash: 'non_legal_resume_hash_12345',
  currentHash: 'non_legal_resume_hash_12345',
  description: 'Candidate Resume (Non-Legal Document) - Demo Scenario 5',
  tags: ['Demo', 'Non-Legal', 'Resume'],
  ocrText: 'John Doe - Senior Software Engineer\nSkills: JavaScript, Python, React\nExperience: 5 years in Web Development\nEducation: B.Tech Computer Science',
  aiInsights: {
    type: 'Non-Legal Document', confidence: 0.95,
    entities: [
      { type: 'Person', value: 'John Doe', role: 'Applicant' }
    ],
    dates: [{ date: '2026-09-08', context: 'Upload Date' }],
    summary: 'Demo Scenario 5: Uploaded file is classified as a NON-LEGAL DOCUMENT (Resume/CV). It lacks statutory legal provisions, FIR numbers, court filings, or police authority registration.',
    actions: ['Inform user to upload valid legal documentation (FIR, Charge Sheet, Court Notice, etc.)'],
    sections: ['None (Non-Legal)'],
    flags: ['⚠️ Document is not a legal document.']
  }
});

MockData.lawyerVault = {
  cases: [
    {
      caseId: 'CR-124/2026',
      caseTitle: 'State vs. Rajesh Kumar (Sec 302/34 IPC - High Profile Homicide)',
      courtName: 'Sessions Court, Central District, Delhi',
      encryptionStatus: 'AES-256 ENCRYPTED',
      keyId: 'KMS-DELHI-AES256-9948',
      leadAdvocate: 'Senior Counsel Vijay Malhotra (Supreme Court / Delhi HC)',
      totalFiles: 18,
      totalSize: '48.5 MB',
      accessLevel: 'RESTRICTED (ADVOCATES & ADMIN ONLY)',
      folders: [
        {
          id: 'fld-1',
          name: '1. Chargesheet & Police Reports',
          icon: '📁',
          encrypted: true,
          files: [
            { id: 'v-doc-1', name: 'Final_Chargesheet_Sec302_BNS103.pdf', type: 'Charge Sheet', size: '12.4 MB', date: '2026-08-15', status: 'VERIFIED', tags: ['Chargesheet', 'Sec 302', 'CCTNS'] },
            { id: 'v-doc-2', name: 'FIR_789_2026_Kotwali_PS.pdf', type: 'FIR', size: '2.1 MB', date: '2026-06-12', status: 'VERIFIED', tags: ['FIR', 'Police Record'] },
            { id: 'v-doc-3', name: 'GD_Entry_First_Incident_Log.pdf', type: 'General Diary', size: '1.5 MB', date: '2026-06-12', status: 'VERIFIED', tags: ['GD Log'] }
          ]
        },
        {
          id: 'fld-2',
          name: '2. Witness Depositions & Statements',
          icon: '📁',
          encrypted: true,
          files: [
            { id: 'v-doc-4', name: 'Sec161_Ramesh_Kumar_Deposition.pdf', type: 'Witness Statement', size: '4.2 MB', date: '2026-06-14', status: 'VERIFIED', tags: ['Witness', 'Eyewitness'] },
            { id: 'v-doc-5', name: 'Sec164_Magistrate_Statement_Suresh.pdf', type: 'Magistrate Record', size: '3.8 MB', date: '2026-06-20', status: 'VERIFIED', tags: ['Sec 164', 'Judicial Record'] }
          ]
        },
        {
          id: 'fld-3',
          name: '3. Medical & Forensic Expert Reports',
          icon: '📁',
          encrypted: true,
          files: [
            { id: 'v-doc-6', name: 'PostMortem_Report_AIIMS_Forensic.pdf', type: 'Forensic Report', size: '8.9 MB', date: '2026-06-13', status: 'VERIFIED', tags: ['Autopsy', 'AIIMS', 'Forensic'] },
            { id: 'v-doc-7', name: 'Ballistic_Match_CFSL_Lab_Report.pdf', type: 'CFSL Analysis', size: '5.6 MB', date: '2026-07-02', status: 'VERIFIED', tags: ['CFSL', 'Ballistics'] }
          ]
        },
        {
          id: 'fld-4',
          name: '4. Defense Strategy & Precedents',
          icon: '📁',
          encrypted: true,
          files: [
            { id: 'v-doc-8', name: 'High_Court_Bail_Petition_Draft_v3.pdf', type: 'Court Filing', size: '3.1 MB', date: '2026-08-28', status: 'DRAFT', tags: ['Bail', 'HC Motion'] },
            { id: 'v-doc-9', name: 'SupremeCourt_Precedent_RightOfPrivateDefense.pdf', type: 'Legal Precedent', size: '6.9 MB', date: '2026-08-30', status: 'VERIFIED', tags: ['Precedent', 'AIR 2024 SC'] }
          ]
        }
      ],
      aiKnowledgeBase: [
        {
          topic: 'Witness Contradiction',
          queryKeywords: ['contradiction', 'ramesh', 'witness', 'statement', 'discrepancy', 'eyewitness'],
          answer: 'Key Contradiction Found: In Ramesh Kumar\'s Sec 161 Police Statement (Doc #v-doc-4), he claimed the assault occurred at 10:30 PM under streetlights. However, in the CFSL lighting survey (Doc #v-doc-7), streetlights at Civil Lines were out of order between 9:00 PM and 11:30 PM on June 12.',
          citations: [
            { docName: 'Sec161_Ramesh_Kumar_Deposition.pdf', page: 3, quote: '"I clearly saw accused face under light pole #4 at 10:30 PM."' },
            { docName: 'Ballistic_Match_CFSL_Lab_Report.pdf', page: 12, quote: '"Power grid logs confirm blackout on Section B streetlights from 21:00 to 23:30 HRS."' }
          ]
        },
        {
          topic: 'Medical Cause of Death & Time of Death',
          queryKeywords: ['medical', 'cause', 'death', 'post mortem', 'autopsy', 'injury', 'time', 'tod'],
          answer: 'According to AIIMS Post-Mortem Report (Doc #v-doc-6), cause of death was blunt force trauma to the occipital region resulting in neurogenic shock. Estimated Time of Death (TOD) is placed between 08:00 PM and 09:30 PM on June 12, 2026—which contradicts the prosecution narrative of assault taking place after 10:15 PM.',
          citations: [
            { docName: 'PostMortem_Report_AIIMS_Forensic.pdf', page: 2, quote: '"Rigor mortis pattern indicates death occurred 14-16 hours prior to examination (Approx 20:30 HRS)."' }
          ]
        },
        {
          topic: 'Bail Arguments & Legal Precedents',
          queryKeywords: ['bail', 'argument', 'precedent', 'sec 302', 'bns', 'supreme court', '439'],
          answer: 'Strongest Bail Motion Grounds: (1) Prosecution relies heavily on uncorroborated eyewitness Ramesh Kumar whose timeline is contradicted by CFSL grid logs. (2) Accused has co-operated throughout 90-day custody and chargesheet is filed. (3) Cited SC Precedent (AIR 2024 SC 1892): Prolonged incarceration without trial commencement warrants conditional bail under Section 439 CrPC / 483 BNS.',
          citations: [
            { docName: 'SupremeCourt_Precedent_RightOfPrivateDefense.pdf', page: 5, quote: '"Right to speedy trial under Article 21 extends to grant of bail where investigation is completed."' }
          ]
        }
      ]
    },
    {
      caseId: 'CR-402/2026',
      caseTitle: 'Union of India vs. Apex Tech Corp (Corporate Fraud & PMLA)',
      courtName: 'Special PMLA Court, Rouse Avenue, New Delhi',
      encryptionStatus: 'AES-256 ENCRYPTED',
      keyId: 'KMS-DELHI-AES256-4411',
      leadAdvocate: 'Senior Advocate Ananya Roy',
      totalFiles: 32,
      totalSize: '112.8 MB',
      accessLevel: 'RESTRICTED (ADVOCATES & ADMIN ONLY)',
      folders: [
        {
          id: 'fld-10',
          name: '1. Enforcement Directorate Audit & Seizures',
          icon: '📁',
          encrypted: true,
          files: [
            { id: 'v-doc-10', name: 'ED_Seizure_Memo_Bank_Accounts.pdf', type: 'Seizure Memo', size: '18.2 MB', date: '2026-07-10', status: 'VERIFIED', tags: ['ED', 'PMLA'] }
          ]
        }
      ],
      aiKnowledgeBase: []
    }
  ]
};

MockData.trackingPipelines = {
  'CR-124/2026': {
    caseId: 'CR-124/2026',
    caseTitle: 'State vs. Rajesh Kumar',
    clientName: 'Suresh Mehta (Complainant / Client)',
    advocateName: 'Advocate A. Verma (Legal Reviewer)',
    investigatingOfficer: 'Inspector R. Sharma (Police Officer)',
    courtName: 'District & Sessions Court, Saket, Delhi',
    judgeName: 'Hon. Justice A.K. Mehra',
    cnrNumber: 'DLHC010048292026',
    overallProgressPercent: 65,
    currentStage: 'Stage 5: Trial & Witness Examination',
    backlogStats: {
      totalHearingsScheduled: 5,
      completedHearings: 3,
      adjournedHearings: 2,
      pendingBacklogDays: 24,
      nextHearingDate: '2026-09-15T10:30:00'
    },
    lifecycleStages: [
      { step: 1, title: 'FIR Registration', status: 'completed', date: '01 Aug 2026', detail: 'FIR #124/2026 registered under BNS 103 / IPC 420 at PS Saket' },
      { step: 2, title: 'Police Investigation & Vaulting', status: 'completed', date: '20 Aug 2026', detail: 'Forensic evidence & witness statements recorded and SHA-256 sealed' },
      { step: 3, title: 'Charge Sheet Submission', status: 'completed', date: '01 Sep 2026', detail: 'Draft Charge Sheet filed before Metropolitan Magistrate' },
      { step: 4, title: 'Court Cognizance & Framing Charges', status: 'completed', date: '05 Sep 2026', detail: 'Charges framed under BNS Sec 103 / IPC 467. Defense notice issued' },
      { step: 5, title: 'Trial Hearings & Backlog Lifecycle', status: 'active', date: '15 Sep 2026 (Upcoming)', detail: 'Trial ongoing. 2 previous adjournments logged due to FSL report delay' },
      { step: 6, title: 'Final Verdict & Judgment', status: 'pending', date: 'Estimated Oct 2026', detail: 'Final arguments & judicial order' }
    ],
    hearingBacklogLogs: [
      {
        id: 'HLOG-001',
        hearingDate: '2026-08-10',
        stage: 'First Appearance & Bail Hearing',
        courtRoom: 'Courtroom 3, Saket Court',
        outcomeStatus: 'Completed',
        adjournmentReason: 'N/A — Judicial custody extended by 14 days',
        summary: 'Accused presented before Magistrate. Defense bail application argued. Bail denied considering risk of evidence tampering.',
        evidenceProduced: ['FIR_CR124_2026.pdf', 'Witness_Statement_Anil_Kapoor.pdf'],
        actionItems: 'IO directed to expedite FSL analysis report.',
        nextDate: '2026-08-24'
      },
      {
        id: 'HLOG-002',
        hearingDate: '2026-08-24',
        stage: 'FSL Forensic Report Submission',
        courtRoom: 'Courtroom 3, Saket Court',
        outcomeStatus: 'Adjourned',
        adjournmentReason: 'Backlog Delay: Forensic Science Laboratory report pending due to lab backlog',
        summary: 'FSL representative requested 10 days extension for chemical and handwriting signature analysis.',
        evidenceProduced: ['Investigation_Report_Aug2026.pdf'],
        actionItems: 'Court issued notice to FSL Director for expedited dispatch.',
        nextDate: '2026-09-02'
      },
      {
        id: 'HLOG-003',
        hearingDate: '2026-09-02',
        stage: 'Cognizance & Charge Framing',
        courtRoom: 'Courtroom 3, Saket Court',
        outcomeStatus: 'Completed',
        adjournmentReason: 'N/A — Formal charges framed',
        summary: 'FSL report received confirming document forgery. Court took cognizance and framed charges under IPC 420/467/468.',
        evidenceProduced: ['Forensic_Report_CR124.pdf', 'ChargeSheet_CR124_Draft.pdf'],
        actionItems: 'Prosecution directed to summon key eye-witness Anil Kapoor for 15 Sep 2026.',
        nextDate: '2026-09-15'
      },
      {
        id: 'HLOG-004',
        hearingDate: '2026-09-15',
        stage: 'Witness Cross-Examination & Evidence Presentation',
        courtRoom: 'Courtroom 3, Saket Court',
        outcomeStatus: 'Scheduled (Upcoming)',
        adjournmentReason: 'Pending Hearing',
        summary: 'Scheduled for examination of complainant Suresh Mehta and Sub-Registrar clerk Anil Kapoor.',
        evidenceProduced: ['Evidence_Photo_001.jpg', 'Supplementary_Statement_Mehta.pdf'],
        actionItems: 'Defense counsel to conduct cross-examination.',
        nextDate: '2026-09-22'
      }
    ]
  },
  'CIV-089/2026': {
    caseId: 'CIV-089/2026',
    caseTitle: 'Sharma vs. Municipal Corporation',
    clientName: 'R.K. Sharma (Petitioner / Client)',
    advocateName: 'Advocate S. Nanda',
    investigatingOfficer: 'N/A (Civil Court Litigation)',
    courtName: 'Delhi High Court / Civil Bench 4',
    judgeName: 'Hon. Justice M.K. Gupta',
    cnrNumber: 'DLHC020019282026',
    overallProgressPercent: 40,
    currentStage: 'Stage 3: Respondent Reply & Counter-Affidavit',
    backlogStats: {
      totalHearingsScheduled: 4,
      completedHearings: 2,
      adjournedHearings: 1,
      pendingBacklogDays: 18,
      nextHearingDate: '2026-09-18T11:00:00'
    },
    lifecycleStages: [
      { step: 1, title: 'Plaint / Petition Filing', status: 'completed', date: '15 Jul 2026', detail: 'Civil suit filed challenging unauthorized demolition order' },
      { step: 2, title: 'Notice Issued to Respondent', status: 'completed', date: '28 Jul 2026', detail: 'Notice served to Municipal Corporation Commissioner' },
      { step: 3, title: 'Counter-Affidavit & Backlog Review', status: 'active', date: '18 Sep 2026 (Upcoming)', detail: 'MCD reply filed. Rejection motion pending backlog clearance' },
      { step: 4, title: 'Framing of Issues', status: 'pending', date: 'Estimated Oct 2026', detail: 'Court to settle trial issues' },
      { step: 5, title: 'Evidence Recording', status: 'pending', date: 'Estimated Nov 2026', detail: 'Petitioner & Respondent witness affidavits' },
      { step: 6, title: 'Final Decree / Order', status: 'pending', date: 'Estimated Dec 2026', detail: 'Final judgment on compensation claim' }
    ],
    hearingBacklogLogs: [
      {
        id: 'HLOG-101',
        hearingDate: '2026-07-28',
        stage: 'Admission & Interim Stay Motion',
        courtRoom: 'Bench 4, Delhi High Court',
        outcomeStatus: 'Completed',
        adjournmentReason: 'N/A — Status quo order granted',
        summary: 'Interim stay order granted against further demolition activities at Connaught Place commercial premises.',
        evidenceProduced: ['Petition_CIV089.pdf'],
        actionItems: 'MCD directed to file counter-affidavit within 4 weeks.',
        nextDate: '2026-08-20'
      },
      {
        id: 'HLOG-102',
        hearingDate: '2026-08-20',
        stage: 'Respondent Counter-Affidavit Verification',
        courtRoom: 'Bench 4, Delhi High Court',
        outcomeStatus: 'Adjourned',
        adjournmentReason: 'Backlog Delay: MCD Standing Counsel requested time to obtain zonal survey maps',
        summary: 'Standing counsel for MCD failed to produce official zonal demolition clearance records.',
        evidenceProduced: ['Petition_CIV089.pdf'],
        actionItems: 'MCD fined INR 5,000 for delay. Last opportunity granted for 18 Sep 2026.',
        nextDate: '2026-09-18'
      },
      {
        id: 'HLOG-103',
        hearingDate: '2026-09-18',
        stage: 'Rejoinder & Argument on Stay Extension',
        courtRoom: 'Bench 4, Delhi High Court',
        outcomeStatus: 'Scheduled (Upcoming)',
        adjournmentReason: 'Pending Hearing',
        summary: 'Scheduled for final arguments on interim stay extension and compensation prayer.',
        evidenceProduced: ['Petition_CIV089.pdf'],
        actionItems: 'Both parties to present concise written synopses.',
        nextDate: '2026-10-05'
      }
    ]
  },
  'CR-156/2026': {
    caseId: 'CR-156/2026',
    caseTitle: 'Financial Fraud Investigation — Apex Group',
    clientName: 'Sovereign State & Investor Association',
    advocateName: 'Advocate A. Verma (Special Prosecutor)',
    investigatingOfficer: 'Inspector R. Sharma / ED Desk',
    courtName: 'Special PMLA Court, Rouse Avenue, Delhi',
    judgeName: 'Hon. Justice P.S. Gill',
    cnrNumber: 'DLRO010099882026',
    overallProgressPercent: 30,
    currentStage: 'Stage 2: Multistate Audit & Asset Tracing',
    backlogStats: {
      totalHearingsScheduled: 3,
      completedHearings: 1,
      adjournedHearings: 1,
      pendingBacklogDays: 35,
      nextHearingDate: '2026-09-25T11:30:00'
    },
    lifecycleStages: [
      { step: 1, title: 'Financial Complaint Filing', status: 'completed', date: '10 Aug 2026', detail: 'Multi-jurisdictional PMLA complaint registered against Apex Group' },
      { step: 2, title: 'Audit Tracing & Forensic Analysis', status: 'active', date: '25 Sep 2026 (Upcoming)', detail: 'INR 50 Cr asset attachment ongoing. Audit report uploaded' },
      { step: 3, title: 'Charge Sheet & Asset Attachment', status: 'pending', date: 'Estimated Oct 2026', detail: 'Final prosecution complaint under Sec 4 PMLA' },
      { step: 4, title: 'Court Cognizance & Trial', status: 'pending', date: 'Estimated Nov 2026', detail: 'Special PMLA court hearing' },
      { step: 5, title: 'Asset Recovery & Restitution', status: 'pending', date: 'Estimated 2027', detail: 'Restitution of investor funds' }
    ],
    hearingBacklogLogs: [
      {
        id: 'HLOG-201',
        hearingDate: '2026-08-25',
        stage: 'Provisional Asset Seizure Order Confirmation',
        courtRoom: 'Courtroom 2, Rouse Avenue Court',
        outcomeStatus: 'Adjourned',
        adjournmentReason: 'Backlog Delay: Complex financial ledger audit pending from 4 banking institutions',
        summary: 'Bank compliance officers granted 3 weeks extension to produce offshore transaction records.',
        evidenceProduced: ['Financial_Audit_Apex.pdf'],
        actionItems: 'Issue summons to Apex Group auditors.',
        nextDate: '2026-09-25'
      }
    ]
  }
};

MockData.getTrackingPipeline = function(caseId) {
  if (this.trackingPipelines[caseId]) {
    return this.trackingPipelines[caseId];
  }
  const baseCase = this.getCase(caseId) || this.cases[0];
  return {
    caseId: baseCase.id,
    caseTitle: baseCase.title,
    clientName: 'Registered Citizen / Party',
    advocateName: 'Advocate Legal Counsel',
    investigatingOfficer: 'Inspector Officer In-Charge',
    courtName: 'District & Sessions Court, Delhi',
    judgeName: 'Hon. Presiding Officer',
    cnrNumber: `DLHC0100${Math.floor(100000 + Math.random() * 900000)}`,
    overallProgressPercent: 50,
    currentStage: 'Stage 3: Evidence Review & Trial Backlog',
    backlogStats: {
      totalHearingsScheduled: 3,
      completedHearings: 2,
      adjournedHearings: 1,
      pendingBacklogDays: 14,
      nextHearingDate: '2026-09-20T10:00:00'
    },
    lifecycleStages: [
      { step: 1, title: 'Filing & Registration', status: 'completed', date: baseCase.createdAt ? baseCase.createdAt.slice(0, 10) : '2026-08-01', detail: 'Case registered' },
      { step: 2, title: 'Investigation & Verification', status: 'completed', date: '15 Aug 2026', detail: 'Evidence verified' },
      { step: 3, title: 'Court Hearing & Backlog Track', status: 'active', date: '20 Sep 2026 (Upcoming)', detail: 'Trial ongoing' },
      { step: 4, title: 'Final Verdict', status: 'pending', date: 'Estimated Nov 2026', detail: 'Judicial decision' }
    ],
    hearingBacklogLogs: [
      {
        id: `HLOG-${Math.floor(Math.random()*900+100)}`,
        hearingDate: '2026-08-20',
        stage: 'Preliminary Hearing',
        courtRoom: 'Courtroom 2',
        outcomeStatus: 'Completed',
        adjournmentReason: 'N/A',
        summary: 'Initial arguments presented.',
        evidenceProduced: ['FIR_CR124_2026.pdf'],
        actionItems: 'Next hearing scheduled.',
        nextDate: '2026-09-20'
      }
    ]
  };
};


