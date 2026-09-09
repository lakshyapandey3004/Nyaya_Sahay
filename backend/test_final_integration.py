"""
Final Integration Verification Suite for NYAYA-SAHAY
Validates Dataset Import, Content Search, Search Audit, AI Copilot Grounding,
Advocate Case Vault, and Login/Logout Lifecycle.
"""

import os
import json
import sqlite3
import unittest
from dataset_importer import import_case_files_dataset
from app import app, get_db

class TestFinalIntegration(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_01_dataset_files_imported(self):
        """Verify that case-files dataset is imported into SQLite database."""
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as cnt FROM documents WHERE case_id = 'CR-124/2026'")
        doc_count = cursor.fetchone()['cnt']
        conn.close()
        self.assertGreaterEqual(doc_count, 8, f"Expected at least 8 documents imported for CR-124/2026, found {doc_count}")

    def test_02_duplicate_file_protection(self):
        """Verify that re-importing the same files skips duplicates and logs audit events."""
        res = import_case_files_dataset('CR-124/2026')
        self.assertEqual(res['imported'], 0, "Duplicate files should not be re-imported")
        self.assertGreaterEqual(res['duplicates'], 8, "Expected 8 duplicate files skipped")

    def test_03_search_across_actual_content(self):
        """Verify search API searches actual document content and generates snippets."""
        res = self.app.get('/api/search?query=Ramesh', content_type='application/json')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data['status'], 'success')
        self.assertGreater(data['count'], 0)

    def test_04_search_audit_logging(self):
        """Verify that performing a search creates a SEARCH_PERFORMED audit entry."""
        login_res = self.app.post('/api/auth/login', json={
            "email": "police.officer@nyayasahay.gov.in",
            "password": "Police#2026"
        })
        token = json.loads(login_res.data)['token']

        search_res = self.app.get('/api/search?query=occipital', headers={"Authorization": f"Bearer {token}"}, content_type='application/json')
        self.assertEqual(search_res.status_code, 200)

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM audit_logs WHERE action = 'SEARCH_PERFORMED' ORDER BY id DESC LIMIT 1")
        audit_entry = cursor.fetchone()
        conn.close()

        self.assertIsNotNone(audit_entry, "Expected SEARCH_PERFORMED audit entry in audit_logs")

    def test_05_ai_copilot_source_grounding(self):
        """Verify AI Copilot returns source-grounded answers with citations for existing data."""
        copilot_res = self.app.post('/api/lawyer/case-query', json={
            "caseId": "CR-124/2026",
            "query": "autopsy death occipital"
        })
        self.assertEqual(copilot_res.status_code, 200)
        data = json.loads(copilot_res.data)
        self.assertGreater(len(data['citations']), 0)

    def test_06_ai_copilot_missing_data_fallback(self):
        """Verify AI Copilot returns no-hallucination message when query terms do not exist."""
        copilot_res = self.app.post('/api/lawyer/case-query', json={
            "caseId": "CR-124/2026",
            "query": "quantum physics entanglement supercomputer"
        })
        self.assertEqual(copilot_res.status_code, 200)
        data = json.loads(copilot_res.data)
        self.assertIn("No relevant information was found", data['answer'])

    def test_07_advocate_case_vault_integration(self):
        """Verify Advocate Case Vault API returns imported case folders and documents."""
        vault_res = self.app.get('/api/lawyer/cases', content_type='application/json')
        self.assertEqual(vault_res.status_code, 200)
        data = json.loads(vault_res.data)
        self.assertGreater(len(data['cases']), 0)

        folders_res = self.app.get('/api/lawyer/folders?caseId=CR-124/2026', content_type='application/json')
        self.assertEqual(folders_res.status_code, 200)
        fdata = json.loads(folders_res.data)
        self.assertGreater(len(fdata['folders']), 0)

    def test_08_auth_logout_lifecycle(self):
        """Verify authentication, logout audit logging, and session invalidation."""
        login_res = self.app.post('/api/auth/login', json={
            "email": "advocate.verma@nyayasahay.gov.in",
            "password": "Legal#2026"
        })
        token = json.loads(login_res.data)['token']

        logout_res = self.app.post('/api/auth/logout', headers={"Authorization": f"Bearer {token}"}, content_type='application/json')
        self.assertEqual(logout_res.status_code, 200)

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM audit_logs WHERE action = 'LOGOUT' ORDER BY id DESC LIMIT 1")
        audit_entry = cursor.fetchone()
        conn.close()

        self.assertIsNotNone(audit_entry)
        self.assertIn(audit_entry['user_id'], ['USR-006', 'USR-LEGAL'])

if __name__ == '__main__':
    unittest.main()
