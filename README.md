# NYAYA-SAHAY — Secure AI-Powered Legal & Investigation Document Management System

## SIH 2026 | Problem Statement: SIH26190

NYAYA-SAHAY is a Secure Digital Document Management System designed for law enforcement agencies, courts, legal departments, and investigative organizations. It centralizes sensitive legal documents, provides AI-powered document understanding, and ensures integrity through secure access, audit trails, and tamper detection.

### Problem Statement

Law enforcement and legal institutions manage large volumes of sensitive documents such as FIRs, investigation reports, witness statements, charge sheets, court filings, evidence records, and forensic reports. Existing systems often suffer from fragmented storage, unauthorized access risks, and poor auditability.

### Features

* Secure document upload and storage.
* Role-Based Access Control (RBAC).
* OCR for scanned legal documents.
* AI document classification and metadata extraction.
* Natural language semantic search.
* AI-generated document summaries.
* Integrity verification using cryptographic hashing.
* Audit trail for every document activity.
* Compliance and reporting dashboard.

### Technology Stack

| Layer    | Technology                                    |
| -------- | --------------------------------------------- |
| Frontend | HTML, CSS, JavaScript                         |
| Backend  | Python + FastAPI                              |
| Database | PostgreSQL                                    |
| AI       | OCR, NLP/LLM, Information Extraction, RAG     |
| Search   | PostgreSQL Full-Text Search + FAISS           |
| Security | RBAC, Encryption, Hashing, Digital Signatures |

### Project Structure

```text
NYAYA-SAHAY/
│── frontend/
│── backend/
│── database/
│── ai/
│── docs/
│── README.md
```

### Workflow

1. User Login.
2. Upload Legal Document.
3. OCR & AI Processing.
4. Metadata Extraction.
5. Secure Storage.
6. Semantic Search.
7. Integrity Verification.
8. Audit Logging.

### Future Scope

* Blockchain-based integrity anchoring.
* Regional language legal assistance.
* Court and police department integrations.

### Team

**Team Name:** NYAYA-SAHAY

**Hackathon:** Smart India Hackathon 2026 (SIH26190)
