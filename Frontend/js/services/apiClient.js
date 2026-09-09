/**
 * NYAYA-SAHAY API Client Service
 * Bridges frontend UI with Flask / SQLite REST API backend (http://127.0.0.1:8000)
 * Gracefully falls back to MockData if offline.
 */
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const ApiClient = {
  getHeaders() {
    const token = sessionStorage.getItem('nyaya_bearer_token') || sessionStorage.getItem('nyaya_session_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  },

  async login(email, password, role) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('API login network error:', err);
    }
    return { status: 'error', message: 'Unable to connect to backend API server at http://127.0.0.1:8000' };
  },

  async register(name, email, password, role, organization, designation) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, organization, designation })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('API register network error:', err);
    }
    return { status: 'error', message: 'Unable to connect to backend API server at http://127.0.0.1:8000' };
  },

  async getUsers() {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.users;
      }
    } catch (e) {
      console.warn('Backend offline, returning null for users');
    }
    return null;
  },

  async getDashboard() {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline, using MockData fallback for dashboard');
    }
    return null;
  },

  async getCases() {
    try {
      const res = await fetch(`${API_BASE_URL}/cases`, { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.cases;
      }
    } catch (e) {
      console.warn('Backend offline, using MockData fallback for cases');
    }
    return null;
  },

  async createCase(caseData) {
    try {
      const res = await fetch(`${API_BASE_URL}/cases`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(caseData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline, creating case locally');
    }
    return null;
  },

  async getCaseDetails(caseId) {
    try {
      const res = await fetch(`${API_BASE_URL}/cases/${encodeURIComponent(caseId)}`, { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.case;
      }
    } catch (e) {
      console.warn('Backend offline, using MockData fallback for case details');
    }
    return null;
  },

  async getTrackingPipeline(caseId) {
    try {
      const res = await fetch(`${API_BASE_URL}/tracking-pipeline?caseId=${encodeURIComponent(caseId)}`, { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.pipeline;
      }
    } catch (e) {
      console.warn('Backend offline, using MockData fallback for tracking pipeline');
    }
    return null;
  },

  async addHearingLog(caseId, logData) {
    try {
      const res = await fetch(`${API_BASE_URL}/cases/${encodeURIComponent(caseId)}/hearings`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(logData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline, adding hearing log locally');
    }
    return null;
  },

  async getDocuments(caseId = null) {
    try {
      const url = caseId ? `${API_BASE_URL}/documents?caseId=${encodeURIComponent(caseId)}` : `${API_BASE_URL}/documents`;
      const res = await fetch(url, { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.documents;
      }
    } catch (e) {
      console.warn('Backend offline, using MockData fallback for documents');
    }
    return null;
  },

  async getDocument(docId) {
    try {
      const res = await fetch(`${API_BASE_URL}/documents/${encodeURIComponent(docId)}`, { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.document;
      }
    } catch (e) {
      console.warn('Backend offline, using MockData fallback for document');
    }
    return null;
  },

  async uploadDocument(formData) {
    try {
      const token = sessionStorage.getItem('nyaya_bearer_token') || sessionStorage.getItem('nyaya_session_token');
      const res = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formData
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline, document upload fallback');
    }
    return null;
  },

  async verifyDocument(fileName, textContent, docType = 'FIR', caseId = 'CR-124/2026') {
    try {
      const res = await fetch(`${API_BASE_URL}/verify-document`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ fileName, textContent, documentType: docType, caseId })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline, using VerificationService fallback');
    }
    return null;
  },

  async getLawyerCases() {
    try {
      const res = await fetch(`${API_BASE_URL}/lawyer/cases`, { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.cases;
      }
    } catch (e) {
      console.warn('Backend offline, fallback for lawyer cases');
    }
    return null;
  },

  async getLawyerFolders(caseId = 'CR-124/2026') {
    try {
      const res = await fetch(`${API_BASE_URL}/lawyer/folders?caseId=${encodeURIComponent(caseId)}`, { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.folders;
      }
    } catch (e) {
      console.warn('Backend offline, fallback for lawyer folders');
    }
    return null;
  },

  async createLawyerFolder(folderData) {
    try {
      const res = await fetch(`${API_BASE_URL}/lawyer/folders`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(folderData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline, fallback for folder creation');
    }
    return null;
  },

  async queryCaseCopilot(caseId, query) {
    try {
      const res = await fetch(`${API_BASE_URL}/lawyer/case-query`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ caseId, query })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline, using local AI synthesis fallback');
    }
    return null;
  },

  async getIntegrityLedger() {
    try {
      const res = await fetch(`${API_BASE_URL}/integrity`, { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.ledger;
      }
    } catch (e) {
      console.warn('Backend offline, using MockData fallback for integrity ledger');
    }
    return null;
  },

  async verifyAllIntegrity() {
    try {
      const res = await fetch(`${API_BASE_URL}/integrity/verify-all`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline, using local integrity check');
    }
    return null;
  },

  async getAuditTrail() {
    try {
      const res = await fetch(`${API_BASE_URL}/audit`, { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.auditTrail;
      }
    } catch (e) {
      console.warn('Backend offline, using MockData fallback for audit trail');
    }
    return null;
  },

  async getAiInsights() {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/insights`, { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.insights;
      }
    } catch (e) {
      console.warn('Backend offline, fallback for AI insights');
    }
    return null;
  },

  async getGrievances() {
    try {
      const res = await fetch(`${API_BASE_URL}/grievances`, { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.grievances;
      }
    } catch (e) {
      console.warn('Backend offline, fallback for grievances');
    }
    return null;
  },

  async createGrievance(data) {
    try {
      const res = await fetch(`${API_BASE_URL}/grievances`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline, creating grievance locally');
    }
    return null;
  },

  async searchPublic(query) {
    try {
      const res = await fetch(`${API_BASE_URL}/public/search?query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        return data.publicResults;
      }
    } catch (e) {
      console.warn('Backend offline, using local public search fallback');
    }
    return null;
  },

  async search(query, caseId = '') {
    try {
      const res = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}&caseId=${encodeURIComponent(caseId)}`, {
        headers: this.getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.results;
      }
    } catch (e) {
      console.warn('Backend search API error, falling back');
    }
    return null;
  },

  async logout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders()
      });
    } catch (e) {
      console.warn('Backend logout call completed locally');
    }
  }
};
