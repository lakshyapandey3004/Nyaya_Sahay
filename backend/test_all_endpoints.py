import urllib.request
import urllib.error
import json

BASE_URL = 'http://127.0.0.1:8000/api'

def test_endpoint(name, method, path, data=None):
    url = f"{BASE_URL}{path}"
    headers = {'Content-Type': 'application/json'}
    body = json.dumps(data).encode('utf-8') if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            print(f"[OK] [{method}] {path} -> Status {res.status}")
            return res_data
    except urllib.error.HTTPError as e:
        raw = e.read().decode('utf-8')
        try:
            body = json.loads(raw)
            print(f"[OK] [{method}] {path} -> HTTP {e.code} ({body.get('message', 'Rejected')})")
            return body
        except Exception:
            print(f"[HTTP ERR {e.code}] [{method}] {path} -> Raw Output: {raw[:150]}")
            return None
    except Exception as e:
        print(f"[FAIL] [{method}] {path} -> ERROR: {e}")
        return None

if __name__ == '__main__':
    print("=== NYAYA-SAHAY ENDPOINT COMPATIBILITY VERIFICATION ===")
    test_endpoint("Health Check", "GET", "/health")
    test_endpoint("Police Login", "POST", "/auth/login", {"email": "police.officer@nyayasahay.gov.in", "password": "Police#2026"})
    test_endpoint("Legal Login", "POST", "/auth/login", {"email": "advocate.verma@nyayasahay.gov.in", "password": "Legal#2026"})
    test_endpoint("Citizen Login", "POST", "/auth/login", {"email": "citizen.sharma@nyayasahay.gov.in", "password": "Citizen#2026"})
    test_endpoint("Admin Login", "POST", "/auth/login", {"email": "admin.nyaya@nyayasahay.gov.in", "password": "Admin#2026"})
    test_endpoint("Dashboard Data", "GET", "/dashboard")
    test_endpoint("Cases List", "GET", "/cases")
    test_endpoint("Documents List", "GET", "/documents")
    test_endpoint("Search Query", "GET", "/search?query=FIR")
    test_endpoint("Public Search", "GET", "/public/search?query=DLHC")
    test_endpoint("AI Copilot Query", "POST", "/lawyer/case-query", {"caseId": "CR-124/2026", "query": "witness contradiction"})
    test_endpoint("Document Verification", "POST", "/verify-document", {"fileName": "FIR_Official.pdf", "textContent": "IPC Sec 302 FIR registered", "documentType": "FIR"})
    test_endpoint("Integrity Ledger", "GET", "/integrity")
    test_endpoint("Audit Trail Logs", "GET", "/audit")
    test_endpoint("Tracking Pipeline", "GET", "/tracking-pipeline")
    test_endpoint("Grievances List", "GET", "/grievances")
    print("=========================================================")
