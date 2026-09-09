import sqlite3
import hashlib
import json
import os
from datetime import datetime, timedelta
from database import get_db, init_db

def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def compute_block_hash(block_number, timestamp, previous_block_hash, document_id, case_id, event_type, document_hash, payload_hash):
    raw_str = f"{block_number}|{timestamp}|{previous_block_hash}|{document_id or ''}|{case_id or ''}|{event_type}|{document_hash or ''}|{payload_hash or ''}"
    return hashlib.sha256(raw_str.encode('utf-8')).hexdigest()

def compute_audit_hash(timestamp, user_id, action, document_id, case_id, details, previous_audit_hash):
    raw_str = f"{timestamp}|{user_id or ''}|{action}|{document_id or ''}|{case_id or ''}|{details or ''}|{previous_audit_hash or ''}"
    return hashlib.sha256(raw_str.encode('utf-8')).hexdigest()

def seed():
    init_db()
    conn = get_db()
    cursor = conn.cursor()

    now = datetime.now().isoformat()
    yesterday = (datetime.now() - timedelta(days=1)).isoformat()
    last_week = (datetime.now() - timedelta(days=7)).isoformat()

    # ==========================================
    # CLEANUP OLD SEED DATA ONLY (is_user_uploaded = 0)
    # USER-UPLOADED RECS (is_user_uploaded = 1) ARE NEVER DELETED!
    # ==========================================
    cursor.execute("DELETE FROM blockchain_ledger")
    cursor.execute("DELETE FROM audit_logs")
    cursor.execute("DELETE FROM document_metadata")
    cursor.execute("DELETE FROM extracted_fields")
    cursor.execute("DELETE FROM verification_results")
    cursor.execute("DELETE FROM folder_documents")
    cursor.execute("DELETE FROM document_versions")
    cursor.execute("DELETE FROM case_stages WHERE case_id IN (SELECT case_id FROM cases WHERE is_user_uploaded = 0)")
    cursor.execute("DELETE FROM case_users WHERE case_id IN (SELECT case_id FROM cases WHERE is_user_uploaded = 0)")
    cursor.execute("DELETE FROM hearings WHERE case_id IN (SELECT case_id FROM cases WHERE is_user_uploaded = 0)")
    cursor.execute("DELETE FROM grievance_submissions WHERE is_user_uploaded = 0")
    cursor.execute("DELETE FROM notifications")
    cursor.execute("DELETE FROM folders")
    cursor.execute("DELETE FROM documents WHERE is_user_uploaded = 0")
    cursor.execute("DELETE FROM cases WHERE is_user_uploaded = 0")

    # ==========================================
    # 1. SEED REQUIRED DEMO USERS (4 roles + 4 default logins)
    # ==========================================
    users_data = [
        ('USR-001', 'Inspector R. Sharma', 'police.demo@nyayasahay.demo', hash_password('DemoPolice#2026'), 'police', 'Delhi Police', 'Station House Officer', 'ACTIVE', now, now),
        ('USR-002', 'Advocate A. Verma', 'legal.demo@nyayasahay.demo', hash_password('DemoLegal#2026'), 'legal', 'Delhi High Court Bar', 'Senior Counsel', 'ACTIVE', now, now),
        ('USR-003', 'Suresh Mehta', 'citizen.demo@nyayasahay.demo', hash_password('DemoCitizen#2026'), 'citizen', 'Citizen Portal', 'Complainant', 'ACTIVE', now, now),
        ('USR-004', 'Vikram Singh', 'admin.demo@nyayasahay.demo', hash_password('DemoAdmin#2026'), 'admin', 'Ministry of Law & Justice', 'System Administrator', 'ACTIVE', now, now),
        
        # Default logins mapping
        ('USR-005', 'Inspector R. Sharma', 'police.officer@nyayasahay.gov.in', hash_password('Police#2026'), 'police', 'Delhi Police', 'SHO Saket', 'ACTIVE', now, now),
        ('USR-006', 'Advocate A. Verma', 'advocate.verma@nyayasahay.gov.in', hash_password('Legal#2026'), 'legal', 'Delhi HC Bar', 'Advocate', 'ACTIVE', now, now),
        ('USR-007', 'R.K. Sharma', 'citizen.sharma@nyayasahay.gov.in', hash_password('Citizen#2026'), 'citizen', 'Citizen Portal', 'Petitioner', 'ACTIVE', now, now),
        ('USR-008', 'Admin Officer', 'admin.nyaya@nyayasahay.gov.in', hash_password('Admin#2026'), 'admin', 'Nyaya Sahay HQ', 'Admin', 'ACTIVE', now, now),
    ]

    cursor.executemany('''
    INSERT OR IGNORE INTO users (id, name, email, password_hash, role, organization, designation, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', users_data)

    # ==========================================
    # 2. SEED PRIMARY DEMO CASE (CR-124/2026)
    # ==========================================
    cases_data = [
        (
            'CAS-101', 'CR-124/2026', 'FIR #124/2026', 'State vs. Rajesh Kumar', 'Homicide & Document Forgery Trial',
            'Criminal', 'Active', 'High profile criminal prosecution under Section 302 IPC / 103 BNS and forgery under IPC 467.',
            'District & Sessions Court, Saket, Delhi', 'DLHC010048292026', 'Inspector R. Sharma', 'Advocate A. Verma',
            'Suresh Mehta', 'Stage 5: Trial & Witness Examination', 65, 0, '2026-08-01T10:00:00', now
        )
    ]

    cursor.executemany('''
    INSERT OR IGNORE INTO cases (id, case_id, fir_number, title, subject, case_type, status, description, court, cnr_code, investigating_officer, advocate, complainant, current_stage, progress_percentage, is_user_uploaded, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', cases_data)

    # ==========================================
    # 3. SEED CASE ASSIGNMENTS
    # ==========================================
    case_users_data = [
        ('CR-124/2026', 'USR-005', 'Inspector R. Sharma', 'Investigating Officer', now, 'USR-008'),
        ('CR-124/2026', 'USR-006', 'Advocate A. Verma', 'Lead Advocate', now, 'USR-008'),
        ('CR-124/2026', 'USR-007', 'R.K. Sharma', 'Complainant', now, 'USR-008'),
    ]

    cursor.executemany('''
    INSERT OR IGNORE INTO case_users (case_id, user_id, user_name, role_in_case, assigned_at, assigned_by)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', case_users_data)

    # ==========================================
    # 4. SEED CASE STAGES
    # ==========================================
    stages_data = [
        ('CR-124/2026', 'FIR Registration', 1, 'completed', '2026-08-01', 'FIR #124/2026 registered under BNS 103 / IPC 420 at PS Saket'),
        ('CR-124/2026', 'Police Investigation & Vaulting', 2, 'completed', '2026-08-20', 'Forensic evidence & witness statements recorded and SHA-256 sealed'),
        ('CR-124/2026', 'Charge Sheet Submission', 3, 'completed', '2026-09-01', 'Draft Charge Sheet filed before Metropolitan Magistrate'),
        ('CR-124/2026', 'Court Cognizance & Framing Charges', 4, 'completed', '2026-09-05', 'Charges framed under BNS Sec 103 / IPC 467'),
        ('CR-124/2026', 'Trial Hearings & Backlog Lifecycle', 5, 'active', '2026-09-15', 'Trial ongoing. Adjournment logged due to FSL report delay'),
        ('CR-124/2026', 'Final Verdict & Judgment', 6, 'pending', 'Estimated Oct 2026', 'Final arguments & judicial order')
    ]

    for s in stages_data:
        cursor.execute("SELECT id FROM case_stages WHERE case_id = ? AND stage_number = ?", (s[0], s[2]))
        if not cursor.fetchone():
            cursor.execute('''
            INSERT INTO case_stages (case_id, stage, stage_number, status, date, notes)
            VALUES (?, ?, ?, ?, ?, ?)
            ''', s)

    # ==========================================
    # 5. SEED 1 REPRESENTATIVE DEMO FIR DOCUMENT
    # ==========================================
    doc_id = "DOC-101"
    case_id = "CR-124/2026"
    file_name = "FIR_CR124_2026_Official.pdf"
    d_type = "FIR"
    file_p = f"storage/uploads/{file_name}"
    stored_hash = "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0"
    current_hash = "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0"

    # Write dummy file to disk if not existing
    os.makedirs(os.path.join(os.path.dirname(__file__), 'storage', 'uploads'), exist_ok=True)
    disk_path = os.path.join(os.path.dirname(__file__), 'storage', 'uploads', file_name)
    if not os.path.exists(disk_path):
        with open(disk_path, 'w') as f:
            f.write("NYAYA-SAHAY OFFICIAL DEMO FIR DOCUMENT CONTENT FOR CR-124/2026")

    cursor.execute('''
    INSERT OR IGNORE INTO documents (id, document_id, case_id, file_name, document_type, description, tags, file_path, file_size, mime_type, uploaded_by, uploaded_at, version, visibility, status, is_user_uploaded)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (doc_id, doc_id, case_id, file_name, d_type, "Official First Information Report registered at PS Saket under CrPC 154.", json.dumps(['Official', 'FIR', 'Verified']), file_p, "1.4 MB", "application/pdf", "USR-005", yesterday, "v1.0", "PUBLIC", "ACTIVE", 0))

    cursor.execute('''
    INSERT OR IGNORE INTO document_metadata (document_id, issuing_authority, document_number, case_number, document_date, location, language, metadata_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (doc_id, "Saket Court / Delhi Police", "NUM-2026-1001", case_id, "2026-08-01", "Delhi, India", "English/Hindi", "VALID"))

    cursor.execute('''
    INSERT OR IGNORE INTO extracted_fields (document_id, document_type, case_number, people, organizations, locations, dates, legal_sections, entities, summary, actions, deadlines, confidence, extraction_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        doc_id, d_type, case_id,
        json.dumps(['Rajesh Kumar (Accused)', 'Suresh Mehta (Complainant)', 'Anil Kapoor (Witness)']),
        json.dumps(['Delhi Police Department', 'Saket District Court', 'CFSL Forensic Lab']),
        json.dumps(['Saket, Delhi', 'Connaught Place']),
        json.dumps(['2026-08-01', '2026-08-20', '2026-09-15']),
        json.dumps(['BNS Sec 103', 'IPC Sec 420', 'IPC Sec 467', 'CrPC Sec 154']),
        json.dumps([{'type': 'Law', 'value': 'BNS 103'}, {'type': 'Court', 'value': 'Saket Court'}]),
        "Extracted AI summary for FIR_CR124_2026_Official.pdf: Key statutory provisions and evidence metadata indexed.",
        json.dumps(['Verify FSL signature', 'Schedule witness examination']),
        json.dumps(['2026-09-15 (Court Hearing)']),
        0.96, "COMPLETED"
    ))

    cursor.execute('''
    INSERT OR IGNORE INTO verification_results (document_id, overall_status, file_security_status, ocr_status, classification_status, required_fields_status, metadata_status, authority_status, qr_status, digital_signature_status, hash_status, blockchain_status, duplicate_status, stored_hash, current_hash, warnings, failure_reasons, review_reasons, verified_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (doc_id, "VERIFIED", "PASSED", "PASSED", "PASSED", "PASSED", "PASSED", "PASSED", "PASSED", "PASSED", "PASSED", "PASSED", "PASSED", stored_hash, current_hash, json.dumps([]), json.dumps([]), json.dumps([]), now))

    cursor.execute('''
    INSERT OR IGNORE INTO document_versions (document_id, version, file_name, file_path, file_hash, uploaded_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (doc_id, "v1.0", file_name, file_p, stored_hash, "USR-005", yesterday))

    # ==========================================
    # 6. SEED ADVOCATE VAULT FOLDER (FLD-101)
    # ==========================================
    cursor.execute('''
    INSERT OR IGNORE INTO folders (id, case_id, folder_name, description, color, created_by, created_at, is_user_uploaded)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', ('FLD-101', 'CR-124/2026', 'FIR & Investigation Files', 'Primary police investigation records', '#2563eb', 'USR-006', now, 0))

    cursor.execute('''
    INSERT OR IGNORE INTO folder_documents (folder_id, document_id, added_at)
    VALUES (?, ?, ?)
    ''', ('FLD-101', 'DOC-101', now))

    # ==========================================
    # 7. SEED 1 REPRESENTATIVE HEARING
    # ==========================================
    cursor.execute('''
    INSERT OR IGNORE INTO hearings (id, case_id, hearing_date, hearing_type, court, judge, status, adjournment_reason, summary, action_items, next_date, is_user_uploaded)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', ('HLOG-001', 'CR-124/2026', '2026-08-10', 'First Appearance & Bail Hearing', 'Courtroom 3, Saket Court', 'Hon. Justice A.K. Mehra', 'Completed', 'N/A — Judicial custody extended', 'Accused presented. Bail denied considering risk of evidence tampering.', 'IO directed to expedite FSL analysis report.', '2026-09-15', 0))

    # ==========================================
    # 8. SEED 1 REPRESENTATIVE GRIEVANCE & NOTIFICATION
    # ==========================================
    cursor.execute('''
    INSERT OR IGNORE INTO grievance_submissions (id, citizen_id, case_id, subject, description, attached_document, status, submitted_at, updated_at, is_user_uploaded)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', ('GRV-501', 'USR-007', 'CR-124/2026', 'Request for Hearing Update', 'I am the complainant in State vs Rajesh Kumar. Please provide copy of latest FSL report.', 'FIR_CR124_Official.pdf', 'UNDER_REVIEW', yesterday, now, 0))

    cursor.execute('''
    INSERT OR IGNORE INTO notifications (id, user_id, role, title, message, type, is_read, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', ('NOTIF-001', 'USR-005', 'police', 'Case Assigned: CR-124/2026', 'You have been assigned as Investigating Officer for State vs. Rajesh Kumar.', 'info', 0, now))

    # ==========================================
    # 9. SEED BLOCKCHAIN-STYLE LEDGER (GENESIS + DOC-101)
    # ==========================================
    # Genesis Block
    genesis_ts = "2026-01-01T00:00:00Z"
    genesis_prev = "0000000000000000000000000000000000000000000000000000000000000000"
    genesis_hash = compute_block_hash(0, genesis_ts, genesis_prev, "", "", "GENESIS", "", "GENESIS_PAYLOAD")

    cursor.execute('''
    INSERT OR IGNORE INTO blockchain_ledger (block_id, block_number, timestamp, previous_block_hash, document_id, case_id, event_type, document_hash, payload_hash, block_hash, is_user_uploaded)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', ('BLK-00000', 0, genesis_ts, genesis_prev, None, None, 'GENESIS', '', 'GENESIS_PAYLOAD', genesis_hash, 0))

    # Block 1 for DOC-101 registration
    b1_ts = yesterday
    b1_hash = compute_block_hash(1, b1_ts, genesis_hash, doc_id, case_id, "DOCUMENT_REGISTERED", stored_hash, "REG_DOC_101")

    cursor.execute('''
    INSERT OR IGNORE INTO blockchain_ledger (block_id, block_number, timestamp, previous_block_hash, document_id, case_id, event_type, document_hash, payload_hash, block_hash, is_user_uploaded)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', ('BLK-00001', 1, b1_ts, genesis_hash, doc_id, case_id, 'DOCUMENT_REGISTERED', stored_hash, 'REG_DOC_101', b1_hash, 0))

    # ==========================================
    # 10. SEED CHAINED AUDIT LOGS
    # ==========================================
    a1_ts = last_week
    a1_hash = compute_audit_hash(a1_ts, 'USR-005', 'LOGIN', None, None, 'Authenticated via encrypted NyayaToken session', 'GENESIS_AUDIT_HASH')

    a2_ts = yesterday
    a2_hash = compute_audit_hash(a2_ts, 'USR-005', 'DOCUMENT_UPLOADED', doc_id, case_id, 'Verification Outcome: VERIFIED (11/11 Checks Passed)', a1_hash)

    cursor.execute('''
    INSERT OR IGNORE INTO audit_logs (id, timestamp, user_id, user_name, role, action, document_id, document_name, case_id, ip_address, device, status, details, audit_hash, previous_audit_hash, is_user_uploaded)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', ('AUD-9001', a1_ts, 'USR-005', 'Inspector R. Sharma', 'police', 'LOGIN', None, None, None, '127.0.0.1', 'Web Client', 'success', 'Authenticated via encrypted NyayaToken session', a1_hash, 'GENESIS_AUDIT_HASH', 0))

    cursor.execute('''
    INSERT OR IGNORE INTO audit_logs (id, timestamp, user_id, user_name, role, action, document_id, document_name, case_id, ip_address, device, status, details, audit_hash, previous_audit_hash, is_user_uploaded)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', ('AUD-9002', a2_ts, 'USR-005', 'Inspector R. Sharma', 'police', 'DOCUMENT_UPLOADED', doc_id, file_name, case_id, '127.0.0.1', 'Web Client', 'success', 'Verification Outcome: VERIFIED (11/11 Checks Passed)', a2_hash, a1_hash, 0))

    conn.commit()
    conn.close()
    print("Database cleaned and seeded with 1 primary demo case, 1 demo FIR, Genesis ledger, and chained audit trail!")

    # Ingest case-files dataset
    try:
        from dataset_importer import import_case_files_dataset
        import_case_files_dataset('CR-124/2026')
    except Exception as e:
        print(f"Dataset import trigger warning: {e}")

if __name__ == '__main__':
    seed()
