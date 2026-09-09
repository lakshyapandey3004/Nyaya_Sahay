# NYAYA-SAHAY Python Verification Backend API

## Overview
This backend module provides a standalone **Python REST API** for document classification and authenticity verification in **Nyaya-Sahay**.

## Features
- **Legal vs Non-Legal Document Classifier**: Automatically detects if an uploaded file is a legal document (FIR, Witness Statement, Court Filing, Charge Sheet, etc.) or a general non-legal document (Resume, Receipt, Invoice, Personal Note).
- **AI Synthetic & Fake FIR Detector**: Scans text for LLM boilerplate signatures (ChatGPT / Gemini markers like *"As an AI language model"*) and unfilled bracket placeholders (e.g. `[Insert Station Name]`, `[Insert Date]`).
- **Cryptographic & CCTNS Structural Audit**: Checks for statutory headers (Sec 154 CrPC / BNS 173), PKI digital signature presence, and blockchain hash registration.

## Running the API Server

```bash
python backend/app.py
```

The server starts on `http://localhost:8000`.

## API Endpoints

### 1. Health Check
- **GET** `/api/health`
- **Response**: `{"status": "online", "service": "NYAYA-SAHAY Document Verification & Classification Engine"}`
  
### 2. Verify / Classify Document
- **POST** `/api/verify-document`
- **Body**:
```json
{
  "fileName": "Candidate_Resume_JohnDoe.pdf",
  "textContent": "John Doe - Senior Software Engineer Skills: JavaScript, Python",
  "documentType": "Auto Detect"
}
```
- **Response**:
```json
{
  "overallStatus": "NON_LEGAL_DOCUMENT",
  "detectedCategory": "Non-Legal Document (RESUME)",
  "isLegalDocument": false,
  "isAiGenerated": false,
  "warnings": [
    "NON-LEGAL DOCUMENT DETECTED: File ('Candidate_Resume_JohnDoe.pdf') lacks statutory legal provisions or police station headers. Appears to be a RESUME."
  ],
  "checksPassed": 2,
  "totalChecks": 11
}
```
