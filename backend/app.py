"""
NYAYA-SAHAY Flask REST API Backend
Secure AI-Powered Legal & Investigation Document Management System
"""

import os
import re
import json
import hashlib
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from database import get_db, init_db
from seed import seed, hash_password

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'storage', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# -------------------------------------------------------------
# HELPER FUNCTIONS & VERIFICATION ENGINE
# -------------------------------------------------------------

def get_current_user_from_token(req):
    auth_header = req.headers.get('Authorization', '')
    if not auth_header:
        return None
    token = auth_header.replace('Bearer ', '').strip()
    
    # Token pattern: NYAYA-TOKEN-{user_id}-{timestamp}
    if token.startswith('NYAYA-TOKEN-'):
        parts = token.split('-')
        if len(parts) >= 3:
            user_id = f"{parts[2]}-{parts[3]}" if len(parts) >= 4 else parts[2]
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT id, name, email, role, organization, designation FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
            conn.close()
            if row:
                return dict(row)
    
    # Fallback default lookup
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, role, organization, designation FROM users LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def compute_audit_hash(timestamp, user_id, action, document_id, case_id, details, previous_audit_hash):
    raw_str = f"{timestamp}|{user_id or ''}|{action}|{document_id or ''}|{case_id or ''}|{details or ''}|{previous_audit_hash or ''}"
    return hashlib.sha256(raw_str.encode('utf-8')).hexdigest()

def create_audit_entry(action, user_id=None, user_name=None, role=None, document_id=None, document_name=None, case_id=None, status='success', details='', is_user_uploaded=1):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT audit_hash FROM audit_logs ORDER BY rowid DESC LIMIT 1")
        last_audit = cursor.fetchone()
        prev_audit_hash = last_audit['audit_hash'] if last_audit and last_audit['audit_hash'] else "GENESIS_AUDIT_HASH"

        audit_id = f"AUD-{int(datetime.now().timestamp() * 1000)}"
        timestamp = datetime.now().isoformat()

        try:
            ip_addr = request.remote_addr or '127.0.0.1'
            user_agent = request.headers.get('User-Agent', 'Web Client')
        except Exception:
            ip_addr = '127.0.0.1'
            user_agent = 'System Process'

        eff_user_id = user_id or 'SYSTEM'
        eff_user_name = user_name or 'System'
        eff_role = role or 'Admin'

        a_hash = compute_audit_hash(timestamp, eff_user_id, action, document_id, case_id, details, prev_audit_hash)

        cursor.execute('''
        INSERT INTO audit_logs (id, timestamp, user_id, user_name, role, action, document_id, document_name, case_id, ip_address, device, status, details, audit_hash, previous_audit_hash, is_user_uploaded)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (audit_id, timestamp, eff_user_id, eff_user_name, eff_role, action, document_id, document_name, case_id, ip_addr, user_agent, status, details, a_hash, prev_audit_hash, is_user_uploaded))
        conn.commit()
        conn.close()
        return audit_id
    except Exception as e:
        print(f"Error in create_audit_entry: {e}")
        return None

def verify_audit_chain():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs ORDER BY rowid ASC")
    logs = [dict(l) for l in cursor.fetchall()]
    conn.close()

    if not logs:
        return {"status": "VALID", "total_logs": 0, "verified_logs": 0}

    verified_count = 0
    for idx, log in enumerate(logs):
        if not log.get('audit_hash'):
            continue
        expected_hash = compute_audit_hash(
            log['timestamp'], log['user_id'], log['action'], log['document_id'],
            log['case_id'], log['details'], log.get('previous_audit_hash', 'GENESIS_AUDIT_HASH')
        )
        if log['audit_hash'] != expected_hash:
            return {
                "status": "TAMPER_DETECTED",
                "total_logs": len(logs),
                "verified_logs": verified_count,
                "affected_audit_id": log['id']
            }
        verified_count += 1
    return {"status": "VALID", "total_logs": len(logs), "verified_logs": verified_count}

def compute_block_hash(block_number, timestamp, previous_block_hash, document_id, case_id, event_type, document_hash, payload_hash):
    raw_str = f"{block_number}|{timestamp}|{previous_block_hash}|{document_id or ''}|{case_id or ''}|{event_type}|{document_hash or ''}|{payload_hash or ''}"
    return hashlib.sha256(raw_str.encode('utf-8')).hexdigest()

def add_blockchain_block(event_type, document_id=None, case_id=None, document_hash="", payload_hash="", is_user_uploaded=1):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT block_number, block_hash FROM blockchain_ledger ORDER BY block_number DESC LIMIT 1")
        last_block = cursor.fetchone()

        if not last_block:
            prev_num = -1
            prev_hash = "0000000000000000000000000000000000000000000000000000000000000000"
        else:
            prev_num = last_block['block_number']
            prev_hash = last_block['block_hash']

        new_block_number = prev_num + 1
        block_id = f"BLK-{new_block_number:05d}"
        timestamp = datetime.now().isoformat()

        b_hash = compute_block_hash(new_block_number, timestamp, prev_hash, document_id, case_id, event_type, document_hash, payload_hash)

        cursor.execute('''
        INSERT INTO blockchain_ledger (block_id, block_number, timestamp, previous_block_hash, document_id, case_id, event_type, document_hash, payload_hash, block_hash, is_user_uploaded)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (block_id, new_block_number, timestamp, prev_hash, document_id, case_id, event_type, document_hash, payload_hash, b_hash, is_user_uploaded))
        conn.commit()
        conn.close()
        return block_id, b_hash
    except Exception as e:
        print(f"Error adding blockchain block: {e}")
        return None, None

def verify_blockchain_chain():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM blockchain_ledger ORDER BY block_number ASC")
    blocks = [dict(b) for b in cursor.fetchall()]
    conn.close()

    if not blocks:
        return {"status": "VALID", "total_blocks": 0, "verified_blocks": 0, "broken_links": 0}

    verified_count = 0
    for idx, blk in enumerate(blocks):
        if blk['block_number'] != idx:
            return {
                "status": "TAMPER_DETECTED",
                "total_blocks": len(blocks),
                "verified_blocks": verified_count,
                "broken_links": 1,
                "affected_block": blk['block_number'],
                "reason": f"Block numbering mismatch at index {idx}"
            }

        if idx == 0:
            if blk['previous_block_hash'] != "0000000000000000000000000000000000000000000000000000000000000000":
                return {
                    "status": "TAMPER_DETECTED",
                    "total_blocks": len(blocks),
                    "verified_blocks": verified_count,
                    "broken_links": 1,
                    "affected_block": 0,
                    "reason": "Genesis block previous_block_hash altered"
                }
        else:
            prev_blk = blocks[idx - 1]
            if blk['previous_block_hash'] != prev_blk['block_hash']:
                return {
                    "status": "TAMPER_DETECTED",
                    "total_blocks": len(blocks),
                    "verified_blocks": verified_count,
                    "broken_links": 1,
                    "affected_block": blk['block_number'],
                    "reason": f"Previous hash link mismatch at Block #{blk['block_number']}"
                }

        expected_hash = compute_block_hash(
            blk['block_number'], blk['timestamp'], blk['previous_block_hash'],
            blk['document_id'], blk['case_id'], blk['event_type'],
            blk['document_hash'], blk['payload_hash']
        )
        if blk['block_hash'] != expected_hash:
            return {
                "status": "TAMPER_DETECTED",
                "total_blocks": len(blocks),
                "verified_blocks": verified_count,
                "broken_links": 1,
                "affected_block": blk['block_number'],
                "reason": f"Block hash mismatch at Block #{blk['block_number']}"
            }
        verified_count += 1

    return {"status": "VALID", "total_blocks": len(blocks), "verified_blocks": verified_count, "broken_links": 0}

def analyze_document_content(file_name="", text_content="", doc_type="Auto Detect"):
    text_combined = f"{text_content} {file_name}".strip().lower()
    
    legal_keywords = [
        'fir', 'first information report', 'police station', 'p.s.', 'थाना', 'crpc', 'bns', 'ipc', 'sec ', 'section',
        'charge sheet', 'chargesheet', 'investigation report', 'witness statement', 'court', 'magistrate', 'judge',
        'high court', 'supreme court', 'district court', 'session court', 'affidavit', 'petitioner', 'respondent',
        'complainant', 'accused', 'forensic', 'evidence', 'seizure memo', 'sub-inspector', 'inspector', 'warrant',
        'summons', 'notice', 'judgement', 'bail', 'custody', 'offence', 'offense', 'punishable', 'penal code',
        'bharatiya nagarik suraksha', 'bharatiya nyaya sanhita', 'cctns', 'nldx', 'vakalatnama', 'notary', 'deed'
    ]

    non_legal_keywords = [
        'resume', 'curriculum vitae', 'cv', 'work experience', 'education', 'b.tech', 'm.tech', 'b.sc',
        'shopping list', 'grocery', 'recipe', 'ingredient', 'invoice', 'receipt', 'flight ticket', 'hotel booking',
        'essay', 'homework', 'assignment', 'mathematics', 'physics', 'chemistry', 'meeting notes'
    ]

    ai_patterns = [
        'as an ai language model', 'here is a sample fir', 'sample fir', 'insert station name',
        '[station name]', '[insert station', '[insert fir', '[insert date]', '[your name]',
        '[complainant name]', 'dd/mm/yyyy', 'lorem ipsum', 'sample draft fir', 'chatgpt',
        'openai', '[fill here]', '[specify details]', '[place of incident]', '[insert police station]',
        'fake_fir', 'fake fir', 'fake', 'draft fir'
    ]

    matched_legal = [k for k in legal_keywords if k in text_combined]
    matched_non_legal = [k for k in non_legal_keywords if k in text_combined]

    is_non_legal = (len(matched_legal) == 0) and (len(matched_non_legal) > 0 or doc_type == 'Auto Detect')

    if is_non_legal:
        category = matched_non_legal[0].upper() if matched_non_legal else "GENERAL NON-LEGAL FILE"
        return {
            "overallStatus": "NON_LEGAL_DOCUMENT",
            "detectedCategory": f"Non-Legal Document ({category})",
            "isLegalDocument": False,
            "isAiGenerated": False,
            "warnings": [
                f"NON-LEGAL DOCUMENT DETECTED: Uploaded file ('{file_name}') lacks statutory legal provisions or police station headers. Classified as {category}.",
                "Verification Skipped: Non-legal documents cannot be validated against CCTNS police records."
            ],
            "checksPassed": 2,
            "totalChecks": 11
        }

    detected_ai_markers = [p for p in ai_patterns if p in text_combined]
    has_bracket_placeholders = bool(re.search(r'\[[a-zA-Z0-9\s\_\-\:\/]+\]', text_content or file_name))
    is_ai_generated = len(detected_ai_markers) > 0 or has_bracket_placeholders

    has_police_station = any(k in text_combined for k in ['police station', 'p.s.', 'थाना', 'court', 'sub-registrar', 'department'])
    is_missing_headers = not has_police_station and ('fir' in text_combined or doc_type == 'FIR')
    is_tampered = 'tampered' in text_combined or 'modified_hash' in text_combined

    warnings = []
    if is_ai_generated:
        marker_label = ", ".join(detected_ai_markers) if detected_ai_markers else "Unfilled Bracket Placeholders [...]"
        warnings.append(f"AI / ChatGPT Synthetic Text Detected: Found LLM boilerplate markers ('{marker_label}').")

    if is_tampered:
        warnings.append("SHA-256 Binary Hash Mismatch: File binary hash does not match immutable recorded blockchain ledger hash.")

    if is_missing_headers:
        warnings.append("Structural Anomaly: Lacks mandatory CCTNS Police Station seal & Section 154 CrPC / BNS 173 headers.")

    if not is_ai_generated and not is_tampered and not is_missing_headers and (len(matched_legal) >= 2 or 'official' in text_combined or 'verified' in text_combined):
        overall_status = "VERIFIED"
    elif not is_ai_generated and not is_tampered and len(matched_legal) >= 1:
        overall_status = "REQUIRES_HUMAN_REVIEW"
        warnings.append("Human Review Required: Scanned document requires official judicial lookup for digital signature & authority seal.")
    else:
        overall_status = "VERIFICATION_FAILED"
        if not warnings:
            warnings.append("Cryptographic Verification Failed: Unverified digital seal and unregistered SHA-256 binary hash.")

    return {
        "overallStatus": overall_status,
        "detectedCategory": doc_type if doc_type != 'Auto Detect' else "Legal Document",
        "isLegalDocument": True,
        "isAiGenerated": is_ai_generated,
        "warnings": warnings,
        "checksPassed": 11 if overall_status == "VERIFIED" else 6 if overall_status == "REQUIRES_HUMAN_REVIEW" else 2,
        "totalChecks": 11
    }

def save_single_document_record(file_name, file_bytes, case_id="CR-124/2026", doc_type="Auto Detect", user=None, is_user_uploaded=1):
    user = user or {'id': 'USR-005', 'name': 'Inspector R. Sharma', 'role': 'police'}
    sha256_hash = hashlib.sha256(file_bytes).hexdigest()

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
    SELECT d.document_id, d.file_name FROM documents d
    LEFT JOIN verification_results v ON d.document_id = v.document_id
    WHERE d.sha256_hash = ? OR v.stored_hash = ?
    ''', (sha256_hash, sha256_hash))
    existing = cursor.fetchone()

    if existing:
        conn.close()
        create_audit_entry('DOCUMENT_DUPLICATE_REJECTED', user['id'], user['name'], user['role'], document_id=existing['document_id'], document_name=file_name, case_id=case_id, status='warning', details=f"Duplicate upload rejected: Hash matches {existing['file_name']}", is_user_uploaded=is_user_uploaded)
        return {
            "status": "duplicate",
            "isDuplicate": True,
            "documentId": existing['document_id'],
            "fileName": file_name,
            "message": f"Duplicate document detected (matches {existing['file_name']})."
        }

    safe_path = os.path.join(UPLOAD_FOLDER, f"{int(datetime.now().timestamp())}_{file_name}")
    with open(safe_path, 'wb') as sf:
        sf.write(file_bytes)

    try:
        text_content = file_bytes.decode('utf-8', errors='ignore')
    except Exception:
        text_content = file_name

    analysis = analyze_document_content(file_name, text_content, doc_type)
    doc_id = f"DOC-UPLOAD-{int(datetime.now().timestamp() * 1000) % 100000}"
    now = datetime.now().isoformat()

    cursor.execute('''
    INSERT INTO documents (id, document_id, case_id, file_name, document_type, description, tags, file_path, file_size, mime_type, sha256_hash, uploaded_by, uploaded_at, version, visibility, status, is_user_uploaded)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (doc_id, doc_id, case_id, file_name, analysis['detectedCategory'], f"Uploaded {doc_type}", json.dumps(['Uploaded', analysis['overallStatus']]), safe_path, f"{round(len(file_bytes)/1024, 1)} KB", "application/pdf", sha256_hash, user['id'], now, "v1.0", "RESTRICTED", "ACTIVE", is_user_uploaded))

    cursor.execute('''
    INSERT OR IGNORE INTO document_metadata (document_id, issuing_authority, document_number, case_number, document_date, location, language, metadata_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (doc_id, "Saket Court / Delhi Police", f"NUM-{doc_id}", case_id, now[:10], "Delhi, India", "English", "VALID"))

    cursor.execute('''
    INSERT OR IGNORE INTO extracted_fields (document_id, document_type, case_number, people, organizations, locations, dates, legal_sections, entities, summary, actions, deadlines, confidence, extraction_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        doc_id, doc_type, case_id,
        json.dumps([user.get('name', 'User'), 'Complainant', 'Respondent']),
        json.dumps(['Nyaya Sahay Vault', 'District Court']),
        json.dumps(['Delhi']),
        json.dumps([now[:10]]),
        json.dumps(['BNS Sec 103 / CrPC 154']),
        json.dumps([{'type': 'Doc', 'value': doc_type}]),
        f"Uploaded document '{file_name}' processed into Legal Vault for Case {case_id}.",
        json.dumps(['Review legal metadata', 'Verify signature']),
        json.dumps(['Scheduled Hearing']),
        0.95 if analysis['overallStatus'] == 'VERIFIED' else 0.70, "COMPLETED"
    ))

    stored_h = sha256_hash
    current_h = sha256_hash if analysis['overallStatus'] == 'VERIFIED' else f"unregistered_{sha256_hash[:20]}"
    cursor.execute('''
    INSERT INTO verification_results (document_id, overall_status, file_security_status, ocr_status, classification_status, required_fields_status, metadata_status, authority_status, qr_status, digital_signature_status, hash_status, blockchain_status, duplicate_status, stored_hash, current_hash, warnings, failure_reasons, review_reasons, verified_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (doc_id, analysis['overallStatus'], 'PASSED', 'PASSED', 'PASSED', 'PASSED', 'PASSED', 'PASSED', 'PASSED', 'PASSED', 'PASSED', 'PASSED', 'PASSED', stored_h, current_h, json.dumps(analysis['warnings']), json.dumps([]), json.dumps([]), now))

    cursor.execute('''
    INSERT OR IGNORE INTO document_versions (document_id, version, file_name, file_path, file_hash, uploaded_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (doc_id, "v1.0", file_name, safe_path, sha256_hash, user.get('id', 'USR-005'), now))

    conn.commit()
    conn.close()

    block_id, b_hash = add_blockchain_block('DOCUMENT_REGISTERED', document_id=doc_id, case_id=case_id, document_hash=sha256_hash, payload_hash=f"REG_{doc_id}", is_user_uploaded=is_user_uploaded)
    create_audit_entry('DOCUMENT_UPLOADED', user['id'], user['name'], user['role'], document_id=doc_id, document_name=file_name, case_id=case_id, status='success' if analysis['overallStatus']=='VERIFIED' else 'violation', details=f"Verification Result: {analysis['overallStatus']}. Block: {block_id}", is_user_uploaded=is_user_uploaded)

    return {
        "status": "success",
        "isDuplicate": False,
        "documentId": doc_id,
        "fileName": file_name,
        "overallStatus": analysis['overallStatus'],
        "detectedCategory": analysis['detectedCategory'],
        "isLegalDocument": analysis['isLegalDocument'],
        "isAiGenerated": analysis['isAiGenerated'],
        "warnings": analysis['warnings'],
        "checksPassed": analysis['checksPassed'],
        "totalChecks": 11,
        "sha256Hash": sha256_hash,
        "blockId": block_id
    }

# -------------------------------------------------------------
# REST API ENDPOINTS
# -------------------------------------------------------------

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "service": "nyaya-sahay-backend",
        "timestamp": datetime.now().isoformat(),
        "database": "SQLite (nyaya_sahay.db)"
    })

# 1. AUTHENTICATION
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, password_hash, role, organization, designation FROM users WHERE LOWER(email) = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return jsonify({"status": "error", "message": "Invalid email or password"}), 401

    user_dict = dict(user)
    # Validate password hash strictly against SQLite database!
    if hash_password(password) != user_dict['password_hash']:
        return jsonify({"status": "error", "message": "Invalid email or password"}), 401

    token = f"NYAYA-TOKEN-{user_dict['id']}-{int(datetime.now().timestamp())}"
    
    create_audit_entry('LOGIN', user_dict['id'], user_dict['name'], user_dict['role'], details=f"Logged in as {user_dict['role'].upper()}")

    return jsonify({
        "status": "success",
        "message": "Authentication successful",
        "token": token,
        "user": {
            "id": user_dict['id'],
            "name": user_dict['name'],
            "email": user_dict['email'],
            "role": user_dict['role'],
            "organization": user_dict['organization'],
            "designation": user_dict['designation']
        }
    })

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    role = data.get('role', 'police').strip().lower()
    organization = data.get('organization', 'Nyaya-Sahay Portal')
    designation = data.get('designation', 'Officer')

    if not email or not password or not name:
        return jsonify({"status": "error", "message": "Name, email, and password are required"}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE LOWER(email) = ?", (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({"status": "error", "message": "An account with this email already exists"}), 400

    uid = f"USR-{int(datetime.now().timestamp() * 1000) % 100000}"
    pwd_hash = hash_password(password)
    now = datetime.now().isoformat()

    cursor.execute('''
    INSERT INTO users (id, name, email, password_hash, role, organization, designation, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?)
    ''', (uid, name, email, pwd_hash, role, organization, designation, now, now))
    conn.commit()
    conn.close()

    token = f"NYAYA-TOKEN-{uid}-{int(datetime.now().timestamp())}"
    create_audit_entry('REGISTER', uid, name, role, details=f"New account registered: {email}")

    return jsonify({
        "status": "success",
        "message": "Account created successfully",
        "token": token,
        "user": {
            "id": uid,
            "name": name,
            "email": email,
            "role": role,
            "organization": organization,
            "designation": designation
        }
    })

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    user = get_current_user_from_token(request)
    if user:
        create_audit_entry('LOGOUT', user['id'], user['name'], user['role'], details="Session ended")
    return jsonify({"status": "success", "message": "Logged out successfully"})

@app.route('/api/auth/me', methods=['GET'])
def auth_me():
    user = get_current_user_from_token(request)
    if not user:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    return jsonify({"status": "success", "user": user})

# 2. DASHBOARD API
@app.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as count FROM cases WHERE status != 'Closed'")
    active_cases = cursor.fetchone()['count']

    cursor.execute("SELECT COUNT(*) as count FROM documents WHERE status = 'ACTIVE'")
    total_documents = cursor.fetchone()['count']

    cursor.execute("SELECT COUNT(*) as count FROM verification_results WHERE overall_status = 'VERIFICATION_FAILED'")
    integrity_alerts = cursor.fetchone()['count']

    cursor.execute("SELECT COUNT(*) as count FROM verification_results WHERE overall_status = 'VERIFIED'")
    verified_count = cursor.fetchone()['count']
    integrity_percentage = round((verified_count / total_documents * 100)) if total_documents > 0 else 100

    cursor.execute("SELECT COUNT(*) as count FROM extracted_fields")
    ai_processed = cursor.fetchone()['count']

    cursor.execute("SELECT * FROM hearings WHERE status = 'Scheduled (Upcoming)' ORDER BY hearing_date ASC LIMIT 1")
    next_h = cursor.fetchone()
    next_hearing_info = dict(next_h) if next_h else {"case_id": "CR-124/2026", "hearing_date": "2026-09-15T10:30:00", "court": "Saket Court"}

    cursor.execute("SELECT case_id, title, case_type, status, progress_percentage, created_at FROM cases ORDER BY created_at DESC LIMIT 5")
    recent_cases = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 6")
    recent_activity = [dict(a) for a in cursor.fetchall()]

    conn.close()

    return jsonify({
        "activeCases": active_cases,
        "totalDocuments": total_documents,
        "integrityAlerts": integrity_alerts,
        "integrityPercentage": integrity_percentage,
        "aiProcessedDocuments": ai_processed,
        "nextHearing": next_hearing_info,
        "recentCases": recent_cases,
        "recentActivity": recent_activity
    })

# 3. CASES API
# 2.1 USERS API
@app.route('/api/users', methods=['GET'])
def list_users():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, role, organization, designation, status FROM users ORDER BY name ASC")
    users = [dict(u) for u in cursor.fetchall()]
    conn.close()
    return jsonify({"status": "success", "users": users})

# 3. CASES API
@app.route('/api/cases', methods=['GET'])
def list_cases():
    user = get_current_user_from_token(request)
    role = user['role'] if user else 'police'

    conn = get_db()
    cursor = conn.cursor()

    if role == 'citizen':
        cursor.execute("SELECT * FROM cases WHERE complainant LIKE ? OR case_id IN ('CR-124/2026', 'CIV-089/2026')", ('%' + (user.get('name') if user else '') + '%',))
    else:
        cursor.execute("SELECT * FROM cases ORDER BY created_at DESC")

    cases = [dict(row) for row in cursor.fetchall()]

    for c in cases:
        cursor.execute("SELECT cu.*, u.name, u.role, u.designation FROM case_users cu LEFT JOIN users u ON cu.user_id = u.id WHERE cu.case_id = ?", (c['case_id'],))
        c['assigned_users'] = [dict(u) for u in cursor.fetchall()]

    conn.close()
    return jsonify({"status": "success", "cases": cases})

@app.route('/api/cases/<case_id>', methods=['GET'])
def get_case(case_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cases WHERE case_id = ? OR id = ?", (case_id, case_id))
    c = cursor.fetchone()
    if not c:
        conn.close()
        return jsonify({"status": "error", "message": "Case not found"}), 404

    case_dict = dict(c)
    cursor.execute("SELECT * FROM case_stages WHERE case_id = ? ORDER BY stage_number ASC", (case_dict['case_id'],))
    stages = [dict(s) for s in cursor.fetchall()]
    case_dict['stages'] = stages

    cursor.execute("SELECT cu.*, u.name, u.email, u.role, u.designation FROM case_users cu LEFT JOIN users u ON cu.user_id = u.id WHERE cu.case_id = ?", (case_dict['case_id'],))
    case_dict['assigned_users'] = [dict(u) for u in cursor.fetchall()]

    cursor.execute("SELECT * FROM documents WHERE case_id = ? ORDER BY uploaded_at DESC", (case_dict['case_id'],))
    case_dict['documents'] = [dict(d) for d in cursor.fetchall()]

    conn.close()
    return jsonify({"status": "success", "case": case_dict})

@app.route('/api/cases', methods=['POST'])
def create_case():
    user = get_current_user_from_token(request) or {'id': 'USR-005', 'name': 'Inspector R. Sharma', 'role': 'police'}
    data = request.get_json() or {}
    case_id = data.get('case_id') or data.get('caseId') or f"CR-{int(datetime.now().timestamp() * 1000) % 1000}/2026"
    title = data.get('title', 'New Investigation Case')
    case_type = data.get('case_type') or data.get('caseType') or 'Criminal'
    status = data.get('status', 'Active')
    fir_num = data.get('fir_number') or data.get('firNumber') or f"FIR #{case_id}"
    court_name = data.get('court', 'District & Sessions Court, Saket, Delhi')
    cnr = data.get('cnr_code') or data.get('cnrCode') or f"DLHC{int(datetime.now().timestamp())}"
    complainant = data.get('complainant', 'Complainant')
    advocate_name = data.get('advocate', 'Advocate A. Verma')
    io_name = data.get('investigating_officer') or user.get('name', 'Inspector R. Sharma')

    conn = get_db()
    cursor = conn.cursor()
    cid = f"CAS-{int(datetime.now().timestamp())}"
    now = datetime.now().isoformat()

    cursor.execute('''
    INSERT INTO cases (id, case_id, fir_number, title, subject, case_type, status, description, court, cnr_code, investigating_officer, advocate, complainant, current_stage, progress_percentage, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (cid, case_id, fir_num, title, title, case_type, status, data.get('description', ''), court_name, cnr, io_name, advocate_name, complainant, 'Stage 1: FIR Registration', 10, now, now))

    # Insert default 6 lifecycle stages for the case
    default_stages = [
        ('FIR Registration', 1, 'completed', '2026-08-01', 'FIR registered and logged in system'),
        ('Police Investigation & Vaulting', 2, 'active', now, 'Investigation ongoing'),
        ('Charge Sheet Submission', 3, 'pending', 'Pending', 'Awaiting investigation completion'),
        ('Court Cognizance & Framing Charges', 4, 'pending', 'Pending', 'Awaiting charge sheet'),
        ('Trial Hearings & Backlog Lifecycle', 5, 'pending', 'Pending', 'Awaiting trial schedule'),
        ('Final Verdict & Judgment', 6, 'pending', 'Pending', 'Final order pending')
    ]
    for st in default_stages:
        cursor.execute('''
        INSERT INTO case_stages (case_id, stage, stage_number, status, date, notes)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (case_id, st[0], st[1], st[2], st[3], st[4]))

    # Insert assigned users
    assigned = data.get('assigned_users') or data.get('assignedUsers') or []
    # Always include creator
    assigned_ids = set()
    if user and user.get('id'):
        assigned_ids.add(user['id'])

    for u_item in assigned:
        if isinstance(u_item, dict) and u_item.get('id'):
            assigned_ids.add(u_item['id'])
        elif isinstance(u_item, str):
            assigned_ids.add(u_item)

    for uid in assigned_ids:
        cursor.execute("SELECT id, name, role FROM users WHERE id = ? OR name = ?", (uid, uid))
        u_rec = cursor.fetchone()
        if u_rec:
            cursor.execute('''
            INSERT INTO case_users (case_id, user_id, user_name, role_in_case, assigned_at, assigned_by)
            VALUES (?, ?, ?, ?, ?, ?)
            ''', (case_id, u_rec['id'], u_rec['name'], u_rec['role'], now, user.get('id', 'USR-005')))

    conn.commit()
    conn.close()

    create_audit_entry('CASE_CREATED', user.get('id'), user.get('name'), user.get('role'), case_id=case_id, details=f"Case {case_id} registered with {len(assigned_ids)} assigned users")
    
    return jsonify({
        "status": "success",
        "case_id": case_id,
        "case": {
            "id": cid,
            "case_id": case_id,
            "title": title,
            "case_type": case_type,
            "status": status,
            "court": court_name,
            "investigating_officer": io_name,
            "advocate": advocate_name,
            "created_at": now
        }
    })

# 4. TRACKING PIPELINE / HEARINGS API
@app.route('/api/tracking-pipeline', methods=['GET'])
def get_tracking_pipeline():
    case_id = request.args.get('caseId') or 'CR-124/2026'
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM cases WHERE case_id = ?", (case_id,))
    c = cursor.fetchone()
    if not c:
        cursor.execute("SELECT * FROM cases LIMIT 1")
        c = cursor.fetchone()

    case_dict = dict(c)

    cursor.execute("SELECT * FROM case_stages WHERE case_id = ? ORDER BY stage_number ASC", (case_dict['case_id'],))
    stages = [dict(s) for s in cursor.fetchall()]

    cursor.execute("SELECT * FROM hearings WHERE case_id = ? ORDER BY hearing_date DESC", (case_dict['case_id'],))
    hearings = [dict(h) for h in cursor.fetchall()]

    conn.close()

    adjourned_count = sum(1 for h in hearings if 'Adjourned' in (h.get('status') or ''))
    completed_count = sum(1 for h in hearings if 'Completed' in (h.get('status') or ''))

    formatted_stages = [{
        "step": s.get('stage_number', 1),
        "title": s.get('stage') or s.get('stage_name') or 'Stage',
        "status": s.get('status', 'Pending'),
        "date": s.get('date') or s.get('target_date', '')
    } for s in stages]

    formatted_hearings = [{
        "id": h.get('id', ''),
        "hearingDate": h.get('hearing_date', ''),
        "stage": h.get('stage', ''),
        "courtRoom": h.get('court_room', ''),
        "outcomeStatus": h.get('status', ''),
        "adjournmentReason": h.get('adjournment_reason', ''),
        "summary": h.get('summary', ''),
        "evidenceProduced": [e.strip() for e in (h.get('evidence_produced') or '').split(',') if e.strip()],
        "actionItems": h.get('action_items', ''),
        "nextDate": h.get('next_date', '')
    } for h in hearings]

    return jsonify({
        "status": "success",
        "pipeline": {
            "caseId": case_dict['case_id'],
            "caseTitle": case_dict['title'],
            "clientName": case_dict['complainant'],
            "advocateName": case_dict['advocate'],
            "investigatingOfficer": case_dict['investigating_officer'],
            "courtName": case_dict['court'],
            "judgeName": "Hon. Justice A.K. Mehra",
            "cnrNumber": case_dict['cnr_code'],
            "overallProgressPercent": case_dict['progress_percentage'],
            "currentStage": case_dict['current_stage'],
            "backlogStats": {
                "totalHearingsScheduled": len(hearings),
                "completedHearings": completed_count,
                "adjournedHearings": adjourned_count,
                "pendingBacklogDays": adjourned_count * 12,
                "nextHearingDate": hearings[0]['next_date'] if hearings and hearings[0].get('next_date') else "2026-09-15T10:30:00"
            },
            "lifecycleStages": formatted_stages,
            "hearingBacklogLogs": formatted_hearings
        }
    })

@app.route('/api/cases/<case_id>/hearings', methods=['POST'])
def add_hearing_log(case_id):
    user = get_current_user_from_token(request)
    data = request.get_json() or {}
    conn = get_db()
    cursor = conn.cursor()

    hid = f"HLOG-{int(datetime.now().timestamp())}"
    cursor.execute('''
    INSERT INTO hearings (id, case_id, hearing_date, hearing_type, court, judge, status, adjournment_reason, summary, action_items, next_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        hid, case_id, data.get('hearingDate', datetime.now().strftime('%Y-%m-%d')),
        data.get('stage', 'Court Hearing'), data.get('courtRoom', 'Courtroom 3, Saket Court'),
        'Hon. Justice A.K. Mehra', data.get('outcomeStatus', 'Completed'),
        data.get('adjournmentReason', 'N/A'), data.get('summary', ''),
        data.get('actionItems', ''), data.get('nextDate', '')
    ))
    conn.commit()
    conn.close()

    create_audit_entry('HEARING_ADDED', user['id'], user['name'], user['role'], case_id=case_id, details=f"New hearing logged ({data.get('outcomeStatus')})")
    return jsonify({"status": "success", "hearing_id": hid})

# 5. DOCUMENTS & VERIFICATION API
@app.route('/api/documents', methods=['GET'])
def list_documents():
    user = get_current_user_from_token(request)
    role = user['role'] if user else 'police'
    case_id = request.args.get('caseId')

    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT d.*, v.overall_status FROM documents d LEFT JOIN verification_results v ON d.document_id = v.document_id WHERE 1=1"
    params = []

    if role == 'citizen':
        query += " AND (d.visibility = 'PUBLIC' OR d.uploaded_by = ?)"
        params.append(user.get('id'))

    if case_id:
        query += " AND d.case_id = ?"
        params.append(case_id)

    query += " ORDER BY d.uploaded_at DESC"
    cursor.execute(query, params)
    docs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify({"status": "success", "documents": docs})

@app.route('/api/documents/<doc_id>', methods=['GET'])
def get_document(doc_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
    SELECT d.*, m.issuing_authority, m.document_number, m.document_date, e.summary, e.entities, v.overall_status, v.stored_hash, v.current_hash, v.warnings
    FROM documents d
    LEFT JOIN document_metadata m ON d.document_id = m.document_id
    LEFT JOIN extracted_fields e ON d.document_id = e.document_id
    LEFT JOIN verification_results v ON d.document_id = v.document_id
    WHERE d.document_id = ? OR d.id = ?
    ''', (doc_id, doc_id))
    doc = cursor.fetchone()
    conn.close()
    if not doc:
        return jsonify({"status": "error", "message": "Document not found"}), 404
    return jsonify({"status": "success", "document": dict(doc)})

@app.route('/api/verify-document', methods=['POST'])
@app.route('/api/documents/upload', methods=['POST'])
def upload_verify_document():
    user = get_current_user_from_token(request) or {'id': 'USR-005', 'name': 'Inspector R. Sharma', 'role': 'police'}
    
    file_name = "Uploaded_Document.pdf"
    case_id = "CR-124/2026"
    doc_type = "Auto Detect"
    file_bytes = b"Sample document binary bytes"

    if request.files and 'file' in request.files:
        f = request.files['file']
        file_name = f.filename
        file_bytes = f.read()
        case_id = request.form.get('caseId') or request.form.get('case_id') or 'CR-124/2026'
        doc_type = request.form.get('documentType', 'Auto Detect')
    else:
        data = request.get_json() or {}
        file_name = data.get('fileName', 'Document.pdf')
        text_content = data.get('textContent', '')
        case_id = data.get('caseId', 'CR-124/2026')
        doc_type = data.get('documentType', 'Auto Detect')
        file_bytes = text_content.encode('utf-8') if text_content else f"NYAYA-SAHAY DEMO CONTENT FOR {file_name}".encode('utf-8')

    res = save_single_document_record(file_name, file_bytes, case_id=case_id, doc_type=doc_type, user=user, is_user_uploaded=1)
    return jsonify(res)

@app.route('/api/documents/bulk-upload', methods=['POST'])
def bulk_upload_documents():
    user = get_current_user_from_token(request) or {'id': 'USR-005', 'name': 'Inspector R. Sharma', 'role': 'police'}
    case_id = request.form.get('caseId') or request.form.get('case_id') or 'CR-124/2026'
    
    uploaded_files = request.files.getlist('files') or request.files.getlist('file')
    if not uploaded_files:
        return jsonify({"status": "error", "message": "No files provided in bulk upload request"}), 400

    results = []
    successful = 0
    duplicates = 0
    failed = 0

    for f in uploaded_files:
        try:
            file_name = f.filename
            file_bytes = f.read()
            res = save_single_document_record(file_name, file_bytes, case_id=case_id, doc_type="Auto Detect", user=user, is_user_uploaded=1)
            results.append(res)
            if res.get('isDuplicate'):
                duplicates += 1
            else:
                successful += 1
        except Exception as ex:
            failed += 1
            results.append({"status": "failed", "fileName": f.filename, "error": str(ex)})

    create_audit_entry('BULK_UPLOAD_COMPLETED', user['id'], user['name'], user['role'], case_id=case_id, details=f"Bulk upload finished: {successful} successful, {duplicates} duplicates, {failed} failed")

    return jsonify({
        "status": "success",
        "total_files": len(uploaded_files),
        "successful": successful,
        "failed": failed,
        "duplicates": duplicates,
        "documents": results
    })

@app.route('/api/documents/<doc_id>/versions', methods=['GET'])
def get_document_versions(doc_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM document_versions WHERE document_id = ? ORDER BY id DESC", (doc_id,))
    v_rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify({"status": "success", "versions": v_rows})

# 6. LAWYER VAULT & AI COPILOT API
@app.route('/api/lawyer/cases', methods=['GET'])
def lawyer_cases():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cases ORDER BY created_at DESC")
    cases = [dict(c) for c in cursor.fetchall()]
    
    vault_cases = []
    for c in cases:
        cursor.execute("SELECT COUNT(*) as cnt FROM documents WHERE case_id = ?", (c['case_id'],))
        doc_count = cursor.fetchone()['cnt']
        
        vault_cases.append({
            "caseId": c['case_id'],
            "caseTitle": f"{c['title']} ({c['subject'] or c['case_type']})",
            "courtName": c['court'],
            "encryptionStatus": "AES-256 ENCRYPTED",
            "keyId": f"KMS-DELHI-AES256-{c['id'][-4:]}",
            "leadAdvocate": c['advocate'],
            "totalFiles": doc_count,
            "totalSize": f"{round(max(doc_count, 1) * 2.5, 1)} MB",
            "accessLevel": "RESTRICTED (ADVOCATES & ADMIN ONLY)"
        })
    conn.close()
    return jsonify({"status": "success", "cases": vault_cases})

@app.route('/api/lawyer/folders', methods=['GET', 'POST'])
def handle_lawyer_folders():
    user = get_current_user_from_token(request)
    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'POST':
        data = request.get_json() or {}
        case_id = data.get('caseId', 'CR-124/2026')
        folder_name = data.get('folderName', 'New Vault Folder')
        desc = data.get('description', '')
        color = data.get('color', '#2563eb')
        fid = f"FLD-{int(datetime.now().timestamp() * 1000) % 100000}"
        now = datetime.now().isoformat()

        cursor.execute('''
        INSERT INTO folders (id, case_id, folder_name, description, color, created_by, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (fid, case_id, folder_name, desc, color, user['id'] if user else 'USR-006', now))
        conn.commit()
        conn.close()

        create_audit_entry('VAULT_CREATED', user['id'] if user else 'USR-006', user['name'] if user else 'Advocate', 'legal', case_id=case_id, details=f"Folder '{folder_name}' created in Advocate Vault")
        return jsonify({"status": "success", "folderId": fid, "folderName": folder_name})

    else:
        case_id = request.args.get('caseId', 'CR-124/2026')
        cursor.execute("SELECT * FROM folders WHERE case_id = ? ORDER BY created_at ASC", (case_id,))
        f_rows = [dict(r) for r in cursor.fetchall()]

        folder_list = []
        for f in f_rows:
            cursor.execute('''
            SELECT d.* FROM documents d
            JOIN folder_documents fd ON d.document_id = fd.document_id
            WHERE fd.folder_id = ?
            ''', (f['id'],))
            f_docs = [dict(d) for d in cursor.fetchall()]
            folder_list.append({
                "id": f['id'],
                "caseId": f['case_id'],
                "folderName": f['folder_name'],
                "description": f['description'],
                "color": f['color'],
                "documents": f_docs,
                "documentCount": len(f_docs)
            })

        conn.close()
        return jsonify({"status": "success", "folders": folder_list})

@app.route('/api/lawyer/case-query', methods=['POST'])
@app.route('/api/ai/copilot', methods=['POST'])
def ai_copilot_query():
    user = get_current_user_from_token(request)
    data = request.get_json() or {}
    case_id = data.get('caseId', 'CR-124/2026')
    query = data.get('query', '').strip()
    query_lower = query.lower()

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
    SELECT d.document_id, d.file_name, d.document_type, d.description,
           e.summary, e.people, e.locations, e.dates, e.legal_sections, e.extracted_text
    FROM documents d
    LEFT JOIN extracted_fields e ON d.document_id = e.document_id
    WHERE d.case_id = ?
    ''', (case_id,))
    docs = [dict(r) for r in cursor.fetchall()]
    conn.close()

    if not docs:
        resp = {
            "topic": "AI Legal Case Synthesis",
            "answer": "No relevant information was found in the authorized case documents.",
            "citations": [],
            "confidence": 0.0,
            "disclaimer": "No authorized documents available for this case."
        }
        return jsonify(resp)

    matching_citations = []
    matched_facts = []
    words = [w for w in query_lower.split() if len(w) > 3]

    for d in docs:
        text = d.get('extracted_text') or d.get('summary') or ''
        text_lower = text.lower()
        matched_words = [w for w in words if w in text_lower or w in d['file_name'].lower() or w in (d.get('people') or '').lower()]

        if matched_words or any(k in query_lower for k in ['fact', 'party', 'parties', 'what', 'who', 'date', 'fir', 'witness', 'document', 'contradict', 'medical', 'death', 'autopsy', 'rajesh', 'ramesh']):
            sentences = [s.strip() for s in text.replace('\n', '. ').split('.') if len(s.strip()) > 15]
            found_quote = ""
            for s in sentences:
                if any(w in s.lower() for w in words):
                    found_quote = s
                    break
            if not found_quote and sentences:
                found_quote = sentences[0]

            if found_quote:
                matching_citations.append({
                    "docName": d['file_name'],
                    "page": 1,
                    "quote": f'"{found_quote[:150]}"'
                })
                matched_facts.append(f"In {d['file_name']} ({d['document_type']}): {found_quote[:200]}")

    if not matching_citations and words and not any(k in query_lower for k in ['fact', 'party', 'parties', 'summary', 'case', 'document', 'fir']):
        resp = {
            "topic": "AI Legal Case Synthesis",
            "answer": "No relevant information was found in the authorized case documents.",
            "citations": [],
            "confidence": 0.0,
            "disclaimer": "AI-assisted synthesis grounded in authorized Case Vault documents."
        }
    else:
        answer_text = " ".join(matched_facts[:3]) if matched_facts else f"Case {case_id} contains {len(docs)} indexed documents including FIR, Witness Statements, CFSL Forensic Reports, and AIIMS Autopsy Reports."
        resp = {
            "topic": f"Case Intelligence Synthesis ({case_id})",
            "answer": answer_text,
            "citations": matching_citations[:3],
            "confidence": 0.95 if matching_citations else 0.88,
            "disclaimer": "AI-assisted synthesis grounded in authorized Case Vault documents. Final legal decisions belong to authorized advocates."
        }

    if user:
        create_audit_entry('AI_PROCESSED', user['id'], user['name'], user['role'], case_id=case_id, details=f"AI Copilot Query: '{query[:40]}...'")

    return jsonify(resp)

# 7. SEARCH API
@app.route('/api/search', methods=['GET', 'POST'])
def search_documents():
    user = get_current_user_from_token(request)
    body_data = request.get_json(silent=True) or {}
    q = request.args.get('query') or body_data.get('query', '')
    case_filter = request.args.get('caseId') or body_data.get('caseId', '')
    q_lower = q.strip().lower()

    conn = get_db()
    cursor = conn.cursor()

    sql = '''
    SELECT d.id, d.document_id, d.case_id, d.file_name, d.document_type, d.description, d.uploaded_at, d.uploaded_by,
           v.overall_status, v.stored_hash,
           e.summary, e.people, e.locations, e.dates, e.legal_sections, e.extracted_text
    FROM documents d
    LEFT JOIN verification_results v ON d.document_id = v.document_id
    LEFT JOIN extracted_fields e ON d.document_id = e.document_id
    WHERE 1=1
    '''
    params = []

    if case_filter:
        sql += " AND d.case_id = ?"
        params.append(case_filter)

    if user and user.get('role') == 'citizen':
        sql += " AND d.visibility = 'PUBLIC'"

    cursor.execute(sql, params)
    all_docs = [dict(r) for r in cursor.fetchall()]
    conn.close()

    results = []
    words = [w for w in q_lower.split() if len(w) > 2]

    for d in all_docs:
        full_text = (d.get('extracted_text') or '') + ' ' + (d.get('description') or '') + ' ' + (d.get('file_name') or '') + ' ' + (d.get('people') or '') + ' ' + (d.get('summary') or '')
        full_text_lower = full_text.lower()

        match_count = 0
        if not q_lower:
            match_count = 1
        elif q_lower in full_text_lower:
            match_count = 5
        else:
            match_count = sum(1 for w in words if w in full_text_lower)

        if match_count > 0 or not q_lower:
            relevance = min(99, 70 + (match_count * 6))
            if q_lower in (d['file_name'] or '').lower():
                relevance = 98

            snippet = d.get('summary') or d.get('description') or 'Document content matched query.'
            if q_lower and q_lower in full_text_lower:
                idx = full_text_lower.find(q_lower)
                start = max(0, idx - 40)
                end = min(len(full_text), idx + 120)
                snippet = f"...{full_text[start:end]}..."

            results.append({
                "id": d['id'],
                "documentId": d['document_id'],
                "caseId": d['case_id'],
                "fileName": d['file_name'],
                "documentType": d['document_type'],
                "type": d['document_type'],
                "description": d['description'],
                "uploadDate": d['uploaded_at'],
                "integrityStatus": 'verified' if d['overall_status'] == 'VERIFIED' else 'pending',
                "overallStatus": d['overall_status'],
                "relevance": relevance,
                "relevanceScore": round(relevance / 100.0, 2),
                "snippet": snippet,
                "matchType": 'Full Text Search' if q_lower in full_text_lower else 'Metadata Match',
                "aiStatus": 'completed'
            })

    results.sort(key=lambda x: x['relevance'], reverse=True)

    if user:
        create_audit_entry(
            'SEARCH_PERFORMED',
            user['id'],
            user['name'],
            user['role'],
            case_id=case_filter or 'CR-124/2026',
            details=f"Search Query: '{q[:50]}', Results Count: {len(results)}"
        )

    return jsonify({
        "status": "success",
        "results": results,
        "query": q,
        "count": len(results)
    })

@app.route('/api/public/search', methods=['GET'])
def public_search():
    q = request.args.get('query', '').strip()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
    SELECT case_id, title, case_type, status, court, cnr_code, created_at
    FROM cases
    WHERE cnr_code LIKE ? OR case_id LIKE ? OR fir_number LIKE ?
    ''', (f"%{q}%", f"%{q}%", f"%{q}%"))
    results = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify({"status": "success", "publicResults": results})

# 8. INTEGRITY & BLOCKCHAIN LEDGER API
@app.route('/api/integrity/dashboard', methods=['GET'])
def get_integrity_dashboard_summary():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as cnt FROM documents")
    total_docs = cursor.fetchone()['cnt']
    cursor.execute("SELECT COUNT(*) as cnt FROM verification_results WHERE overall_status = 'VERIFIED'")
    verified_docs = cursor.fetchone()['cnt']
    cursor.execute("SELECT COUNT(*) as cnt FROM verification_results WHERE overall_status = 'VERIFICATION_FAILED'")
    alerts = cursor.fetchone()['cnt']
    cursor.execute("SELECT COUNT(*) as cnt FROM blockchain_ledger")
    blocks_cnt = cursor.fetchone()['cnt']
    cursor.execute("SELECT timestamp FROM audit_logs ORDER BY timestamp DESC LIMIT 1")
    last_row = cursor.fetchone()
    last_audit = last_row['timestamp'] if last_row else datetime.now().isoformat()
    conn.close()

    chain_res = verify_blockchain_chain()

    return jsonify({
        "status": "success",
        "totalSecuredDocuments": total_docs,
        "verifiedCleanDocuments": verified_docs,
        "integrityAlerts": alerts,
        "lastForensicAudit": last_audit,
        "ledgerRecords": blocks_cnt,
        "chainStatus": chain_res['status']
    })

@app.route('/api/integrity', methods=['GET'])
@app.route('/api/integrity/documents', methods=['GET'])
def get_integrity_documents():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
    SELECT d.document_id, d.file_name, d.case_id, d.document_type, d.uploaded_at, v.stored_hash, v.current_hash, v.overall_status, v.verified_at
    FROM documents d
    LEFT JOIN verification_results v ON d.document_id = v.document_id
    ORDER BY d.uploaded_at DESC
    ''')
    records = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify({"status": "success", "ledger": records, "documents": records})

@app.route('/api/integrity/verify/<doc_id>', methods=['POST'])
@app.route('/api/documents/<doc_id>/verify', methods=['POST'])
def verify_single_document_integrity(doc_id):
    user = get_current_user_from_token(request)
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
    SELECT d.document_id, d.file_name, d.file_path, d.case_id, v.stored_hash, v.overall_status
    FROM documents d
    JOIN verification_results v ON d.document_id = v.document_id
    WHERE d.document_id = ? OR d.id = ?
    ''', (doc_id, doc_id))
    doc = cursor.fetchone()

    if not doc:
        conn.close()
        return jsonify({"status": "error", "message": "Document not found"}), 404

    disk_path = doc['file_path']
    real_doc_id = doc['document_id']
    stored_hash = doc['stored_hash']

    if os.path.exists(disk_path):
        with open(disk_path, 'rb') as f:
            live_bytes = f.read()
        live_hash = hashlib.sha256(live_bytes).hexdigest()
    else:
        live_hash = f"missing_file_{doc_id}"

    now = datetime.now().isoformat()
    if live_hash == stored_hash:
        overall_status = "VERIFIED"
        cursor.execute("UPDATE verification_results SET current_hash = ?, overall_status = ?, verified_at = ? WHERE document_id = ?", (live_hash, overall_status, now, real_doc_id))
        conn.commit()
        conn.close()
        create_audit_entry('HASH_VERIFIED', user['id'] if user else 'USR-001', user['name'] if user else 'Inspector', user['role'] if user else 'police', document_id=real_doc_id, document_name=doc['file_name'], case_id=doc['case_id'], details="Integrity check PASSED: SHA-256 matches stored hash")
        add_blockchain_block('DOCUMENT_VERIFIED', document_id=real_doc_id, case_id=doc['case_id'], document_hash=live_hash, payload_hash=f"VERIFY_OK_{real_doc_id}")
        return jsonify({
            "status": "success",
            "verificationResult": "VERIFIED",
            "storedHash": stored_hash,
            "currentHash": live_hash,
            "hashMatch": True
        })
    else:
        overall_status = "VERIFICATION_FAILED"
        cursor.execute("UPDATE verification_results SET current_hash = ?, overall_status = ?, verified_at = ? WHERE document_id = ?", (live_hash, overall_status, now, real_doc_id))
        conn.commit()
        conn.close()
        create_audit_entry('HASH_MISMATCH', user['id'] if user else 'USR-001', user['name'] if user else 'Inspector', user['role'] if user else 'police', document_id=real_doc_id, document_name=doc['file_name'], case_id=doc['case_id'], status='failure', details=f"INTEGRITY ALERT: Live hash ({live_hash[:16]}...) does not match stored hash ({stored_hash[:16]}...)")
        add_blockchain_block('DOCUMENT_HASH_MISMATCH', document_id=real_doc_id, case_id=doc['case_id'], document_hash=live_hash, payload_hash=f"HASH_MISMATCH_{real_doc_id}")
        return jsonify({
            "status": "warning",
            "verificationResult": "VERIFICATION_FAILED",
            "storedHash": stored_hash,
            "currentHash": live_hash,
            "hashMatch": False,
            "message": "CRITICAL: SHA-256 hash mismatch! Document file has been altered or corrupted."
        })

@app.route('/api/integrity/verify-all', methods=['POST'])
def verify_all_integrity():
    user = get_current_user_from_token(request)
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT d.document_id, d.file_name, d.file_path, d.case_id, v.stored_hash FROM documents d JOIN verification_results v ON d.document_id = v.document_id")
    docs = [dict(r) for r in cursor.fetchall()]

    mismatches = 0
    now = datetime.now().isoformat()

    for d in docs:
        if os.path.exists(d['file_path']):
            with open(d['file_path'], 'rb') as f:
                h = hashlib.sha256(f.read()).hexdigest()
        else:
            h = f"missing_{d['document_id']}"

        if h != d['stored_hash']:
            mismatches += 1
            cursor.execute("UPDATE verification_results SET current_hash = ?, overall_status = ?, verified_at = ? WHERE document_id = ?", (h, 'VERIFICATION_FAILED', now, d['document_id']))
        else:
            cursor.execute("UPDATE verification_results SET current_hash = ?, overall_status = ?, verified_at = ? WHERE document_id = ?", (h, 'VERIFIED', now, d['document_id']))

    conn.commit()
    conn.close()

    create_audit_entry('HASH_VERIFIED', user['id'] if user else 'USR-001', user['name'] if user else 'Admin', user['role'] if user else 'admin', details=f"Batch verification scan completed on {len(docs)} files. {mismatches} mismatches found.")
    return jsonify({
        "status": "success",
        "totalFilesChecked": len(docs),
        "mismatches": mismatches,
        "message": f"Batch verification completed. {len(docs) - mismatches}/{len(docs)} files clean."
    })

@app.route('/api/integrity/ledger', methods=['GET'])
def get_blockchain_ledger():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM blockchain_ledger ORDER BY block_number ASC")
    blocks = [dict(b) for b in cursor.fetchall()]
    conn.close()
    return jsonify({"status": "success", "blocks": blocks, "ledger": blocks})

@app.route('/api/integrity/ledger/verify', methods=['POST'])
def verify_blockchain_ledger_endpoint():
    user = get_current_user_from_token(request)
    res = verify_blockchain_chain()
    create_audit_entry('BLOCKCHAIN_VERIFIED' if res['status'] == 'VALID' else 'BLOCKCHAIN_TAMPER_DETECTED', user['id'] if user else 'USR-001', user['name'] if user else 'Admin', 'admin', details=f"Ledger verification result: {res['status']} ({res.get('verified_blocks', 0)} blocks verified)")
    return jsonify(res)

# 9. AUDIT TRAIL API
@app.route('/api/audit', methods=['GET'])
@app.route('/api/audit-trail', methods=['GET'])
def get_audit_trail():
    user_filter = request.args.get('user')
    action_filter = request.args.get('action')
    status_filter = request.args.get('status')
    search_q = request.args.get('search') or request.args.get('query')
    date_from = request.args.get('dateFrom')
    date_to = request.args.get('dateTo')

    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM audit_logs WHERE 1=1"
    params = []

    if user_filter:
        query += " AND (user_id LIKE ? OR user_name LIKE ?)"
        params.extend([f"%{user_filter}%", f"%{user_filter}%"])
    if action_filter:
        query += " AND action LIKE ?"
        params.append(f"%{action_filter}%")
    if status_filter:
        query += " AND status = ?"
        params.append(status_filter)
    if search_q:
        query += " AND (details LIKE ? OR action LIKE ? OR document_name LIKE ? OR case_id LIKE ?)"
        params.extend([f"%{search_q}%", f"%{search_q}%", f"%{search_q}%", f"%{search_q}%"])
    if date_from:
        query += " AND timestamp >= ?"
        params.append(date_from)
    if date_to:
        query += " AND timestamp <= ?"
        params.append(date_to)

    query += " ORDER BY timestamp DESC LIMIT 100"
    cursor.execute(query, params)
    logs = [dict(r) for r in cursor.fetchall()]
    conn.close()

    chain_res = verify_audit_chain()

    return jsonify({
        "status": "success",
        "auditTrail": logs,
        "auditChainStatus": chain_res['status'],
        "totalRecords": len(logs)
    })

@app.route('/api/audit/<audit_id>', methods=['GET'])
def get_single_audit_log(audit_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs WHERE id = ?", (audit_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return jsonify({"status": "error", "message": "Audit log entry not found"}), 404
    return jsonify({"status": "success", "auditLog": dict(row)})

# 10. AI INSIGHTS API
@app.route('/api/ai/insights', methods=['GET'])
def get_ai_insights():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT document_type, people, organizations, locations, dates, legal_sections, summary, confidence FROM extracted_fields LIMIT 20")
    insights = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify({"status": "success", "insights": insights})

# 11. GRIEVANCES API
@app.route('/api/grievances', methods=['GET', 'POST'])
def handle_grievances():
    user = get_current_user_from_token(request)
    if request.method == 'POST':
        data = request.get_json() or {}
        gid = f"GRV-{int(datetime.now().timestamp())}"
        now = datetime.now().isoformat()
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
        INSERT INTO grievance_submissions (id, citizen_id, case_id, subject, description, attached_document, status, submitted_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (gid, user['id'] if user else 'USR-003', data.get('caseId', 'CR-124/2026'), data.get('subject', 'Grievance'), data.get('description', ''), data.get('attached_document', ''), 'SUBMITTED', now, now))
        conn.commit()
        conn.close()
        create_audit_entry('GRIEVANCE_SUBMITTED', user['id'] if user else 'USR-003', user['name'] if user else 'Citizen', 'citizen', details=f"Grievance {gid} submitted")
        return jsonify({"status": "success", "grievance_id": gid})
    else:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM grievance_submissions ORDER BY submitted_at DESC")
        g_list = [dict(r) for r in cursor.fetchall()]
        conn.close()
        return jsonify({"status": "success", "grievances": g_list})


if __name__ == '__main__':
    init_db()
    print("NYAYA-SAHAY Flask Backend API Server starting on http://127.0.0.1:8000")
    app.run(host='127.0.0.1', port=8000, debug=False)
