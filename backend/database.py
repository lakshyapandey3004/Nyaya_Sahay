import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'nyaya_sahay.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def safe_add_column(cursor, table, column_def):
    try:
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column_def}")
    except sqlite3.OperationalError:
        pass # Column already exists

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # 1. USERS
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        organization TEXT,
        designation TEXT,
        status TEXT DEFAULT 'ACTIVE',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
    ''')

    # 2. CASES
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS cases (
        id TEXT PRIMARY KEY,
        case_id TEXT UNIQUE NOT NULL,
        fir_number TEXT,
        title TEXT NOT NULL,
        subject TEXT,
        case_type TEXT NOT NULL,
        status TEXT NOT NULL,
        description TEXT,
        court TEXT,
        cnr_code TEXT,
        investigating_officer TEXT,
        advocate TEXT,
        complainant TEXT,
        current_stage TEXT,
        progress_percentage INTEGER DEFAULT 0,
        is_user_uploaded INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
    ''')
    safe_add_column(cursor, 'cases', 'is_user_uploaded INTEGER DEFAULT 0')

    # 3. CASE_STAGES
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS case_stages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        case_id TEXT NOT NULL,
        stage TEXT NOT NULL,
        stage_number INTEGER NOT NULL,
        status TEXT NOT NULL,
        date TEXT,
        notes TEXT,
        FOREIGN KEY (case_id) REFERENCES cases (case_id)
    )
    ''')

    # 4. DOCUMENTS
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        document_id TEXT UNIQUE NOT NULL,
        case_id TEXT NOT NULL,
        file_name TEXT NOT NULL,
        document_type TEXT NOT NULL,
        description TEXT,
        tags TEXT,
        file_path TEXT,
        file_size TEXT,
        mime_type TEXT,
        uploaded_by TEXT NOT NULL,
        uploaded_at TEXT NOT NULL,
        version TEXT DEFAULT 'v1.0',
        visibility TEXT DEFAULT 'RESTRICTED',
        status TEXT DEFAULT 'ACTIVE',
        sha256_hash TEXT,
        is_user_uploaded INTEGER DEFAULT 0,
        FOREIGN KEY (case_id) REFERENCES cases (case_id)
    )
    ''')
    safe_add_column(cursor, 'documents', 'sha256_hash TEXT')
    safe_add_column(cursor, 'documents', 'is_user_uploaded INTEGER DEFAULT 0')

    # 5. DOCUMENT_METADATA
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS document_metadata (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id TEXT UNIQUE NOT NULL,
        issuing_authority TEXT,
        document_number TEXT,
        case_number TEXT,
        document_date TEXT,
        location TEXT,
        language TEXT DEFAULT 'English',
        metadata_status TEXT DEFAULT 'VALID',
        FOREIGN KEY (document_id) REFERENCES documents (document_id)
    )
    ''')

    # 6. EXTRACTED_FIELDS
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS extracted_fields (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id TEXT UNIQUE NOT NULL,
        document_type TEXT,
        case_number TEXT,
        people TEXT,
        organizations TEXT,
        locations TEXT,
        dates TEXT,
        legal_sections TEXT,
        entities TEXT,
        summary TEXT,
        actions TEXT,
        deadlines TEXT,
        confidence REAL DEFAULT 0.95,
        extraction_status TEXT DEFAULT 'COMPLETED',
        extracted_text TEXT,
        FOREIGN KEY (document_id) REFERENCES documents (document_id)
    )
    ''')
    safe_add_column(cursor, 'extracted_fields', 'extracted_text TEXT')

    # 7. VERIFICATION_RESULTS
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS verification_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id TEXT UNIQUE NOT NULL,
        overall_status TEXT NOT NULL,
        file_security_status TEXT DEFAULT 'PASSED',
        ocr_status TEXT DEFAULT 'PASSED',
        classification_status TEXT DEFAULT 'PASSED',
        required_fields_status TEXT DEFAULT 'PASSED',
        metadata_status TEXT DEFAULT 'PASSED',
        authority_status TEXT DEFAULT 'PASSED',
        qr_status TEXT DEFAULT 'PASSED',
        digital_signature_status TEXT DEFAULT 'PASSED',
        hash_status TEXT DEFAULT 'PASSED',
        blockchain_status TEXT DEFAULT 'PASSED',
        duplicate_status TEXT DEFAULT 'PASSED',
        stored_hash TEXT NOT NULL,
        current_hash TEXT NOT NULL,
        warnings TEXT,
        failure_reasons TEXT,
        review_reasons TEXT,
        verified_at TEXT NOT NULL,
        FOREIGN KEY (document_id) REFERENCES documents (document_id)
    )
    ''')

    # 8. AUDIT_LOGS
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        user_id TEXT,
        user_name TEXT,
        role TEXT,
        action TEXT NOT NULL,
        document_id TEXT,
        document_name TEXT,
        case_id TEXT,
        ip_address TEXT DEFAULT '127.0.0.1',
        device TEXT DEFAULT 'Web Client',
        status TEXT DEFAULT 'success',
        details TEXT,
        audit_hash TEXT,
        previous_audit_hash TEXT,
        is_user_uploaded INTEGER DEFAULT 0
    )
    ''')
    safe_add_column(cursor, 'audit_logs', 'audit_hash TEXT')
    safe_add_column(cursor, 'audit_logs', 'previous_audit_hash TEXT')
    safe_add_column(cursor, 'audit_logs', 'is_user_uploaded INTEGER DEFAULT 0')

    # 9. HEARINGS
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS hearings (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        hearing_date TEXT NOT NULL,
        hearing_type TEXT,
        court TEXT,
        judge TEXT,
        status TEXT NOT NULL,
        adjournment_reason TEXT,
        summary TEXT,
        action_items TEXT,
        next_date TEXT,
        is_user_uploaded INTEGER DEFAULT 0,
        FOREIGN KEY (case_id) REFERENCES cases (case_id)
    )
    ''')
    safe_add_column(cursor, 'hearings', 'is_user_uploaded INTEGER DEFAULT 0')

    # 10. GRIEVANCE_SUBMISSIONS
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS grievance_submissions (
        id TEXT PRIMARY KEY,
        citizen_id TEXT NOT NULL,
        case_id TEXT,
        subject TEXT NOT NULL,
        description TEXT NOT NULL,
        attached_document TEXT,
        status TEXT DEFAULT 'SUBMITTED',
        submitted_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        is_user_uploaded INTEGER DEFAULT 0
    )
    ''')
    safe_add_column(cursor, 'grievance_submissions', 'is_user_uploaded INTEGER DEFAULT 0')

    # 11. NOTIFICATIONS
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        role TEXT,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info',
        is_read INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    )
    ''')

    # 12. CASE_USERS (Assigned Users mapping)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS case_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        case_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        user_name TEXT,
        role_in_case TEXT DEFAULT 'Assigned Officer',
        assigned_at TEXT NOT NULL,
        assigned_by TEXT,
        FOREIGN KEY (case_id) REFERENCES cases (case_id),
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')

    # 13. FOLDERS (Advocate Vault Folders)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS folders (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        folder_name TEXT NOT NULL,
        description TEXT,
        color TEXT DEFAULT '#2563eb',
        created_by TEXT NOT NULL,
        created_at TEXT NOT NULL,
        is_user_uploaded INTEGER DEFAULT 0,
        FOREIGN KEY (case_id) REFERENCES cases (case_id)
    )
    ''')
    safe_add_column(cursor, 'folders', 'is_user_uploaded INTEGER DEFAULT 0')

    # 14. FOLDER_DOCUMENTS
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS folder_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        folder_id TEXT NOT NULL,
        document_id TEXT NOT NULL,
        added_at TEXT NOT NULL,
        FOREIGN KEY (folder_id) REFERENCES folders (id),
        FOREIGN KEY (document_id) REFERENCES documents (document_id)
    )
    ''')

    # 15. DOCUMENT_VERSIONS
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS document_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id TEXT NOT NULL,
        version TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_hash TEXT NOT NULL,
        uploaded_by TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (document_id) REFERENCES documents (document_id)
    )
    ''')

    # 16. BLOCKCHAIN_LEDGER (Real Cryptographic Hash-Chain Ledger)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS blockchain_ledger (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        block_id TEXT UNIQUE NOT NULL,
        block_number INTEGER UNIQUE NOT NULL,
        timestamp TEXT NOT NULL,
        previous_block_hash TEXT NOT NULL,
        document_id TEXT,
        case_id TEXT,
        event_type TEXT NOT NULL,
        document_hash TEXT,
        payload_hash TEXT,
        block_hash TEXT NOT NULL,
        is_user_uploaded INTEGER DEFAULT 0
    )
    ''')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Expanded database schema created successfully with blockchain ledger & chained audit log support.")
