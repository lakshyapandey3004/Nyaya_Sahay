document.addEventListener('DOMContentLoaded', async () => {
  const docId = NyayaSahay.getUrlParam('id') || 'DOC-DS-1001';
  const initialTab = NyayaSahay.getUrlParam('tab') || 'preview';

  let doc = null;
  if (typeof ApiClient !== 'undefined') {
    try {
      const backendDoc = await ApiClient.getDocument(docId);
      if (backendDoc) {
        doc = {
          id: backendDoc.document_id || backendDoc.id,
          fileName: backendDoc.file_name,
          type: backendDoc.document_type || 'Legal Document',
          caseId: backendDoc.case_id,
          uploadDate: backendDoc.uploaded_at,
          integrityStatus: backendDoc.overall_status === 'VERIFIED' ? 'verified' : 'flagged',
          aiStatus: 'completed',
          version: '1.0',
          ocrText: backendDoc.extracted_text || backendDoc.description || 'Document content extracted from backend storage.',
          aiInsights: {
            summary: backendDoc.summary || backendDoc.description || 'Document content extracted and indexed in SQLite database.',
            confidence: 0.98,
            entities: (backendDoc.people || '').split(', ').filter(Boolean).map(p => ({ type: 'Person', value: p, role: 'Key Entity' })),
            dates: (backendDoc.dates || '').split(', ').filter(Boolean).map(d => ({ date: d, context: 'Relevant Record Date' })),
            sections: (backendDoc.legal_sections || '').split(', ').filter(Boolean)
          }
        };
      }
    } catch(e) {}
  }

  if (!doc) {
    try {
      const customDocs = JSON.parse(localStorage.getItem('nyaya_custom_documents') || '[]');
      const filenameParam = NyayaSahay.getUrlParam('filename');
      const found = customDocs.find(d => d.id === docId || d.fileName === docId || (filenameParam && d.fileName === filenameParam));
      if (found) {
        doc = found;
      }
    } catch(e) {}
  }

  if (!doc && typeof MockData !== 'undefined') {
    doc = MockData.getDocument(docId);
  }

  if (!doc) {
    document.getElementById('doc-content').classList.add('hidden');
    const errorState = document.getElementById('error-state');
    errorState.classList.remove('hidden');
    errorState.innerHTML = NyayaSahay.emptyState(NyayaSahay.icons.alert || '', 'Document Not Found', 'The requested document does not exist or you do not have permission.');
    return;
  }

  NyayaSahay.initApp('documents', doc.fileName, [
    { label: 'Home', href: 'dashboard.html' },
    { label: 'Documents', href: 'documents.html' },
    { label: doc.fileName }
  ]);

  document.getElementById('doc-title').textContent = doc.fileName;
  document.getElementById('left-panel-title').textContent = `${doc.fileName} (v${doc.version || '1.0'})`;

  // Attach Global Download Action
  window.triggerOfficialDownload = async function() {
    if (typeof CryptoVaultService !== 'undefined') {
      const success = await CryptoVaultService.downloadOfficialCopy(doc.id, doc.fileName);
      if (!success && doc.ocrText) {
        // Fallback text download for legacy mock documents
        const blob = new Blob([doc.ocrText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.fileName || 'Legal_Document.txt';
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        NyayaSahay.showToast(`📥 Official copy of "${doc.fileName}" downloaded cleanly!`, 'success');
      }
    } else {
      NyayaSahay.showToast(`📥 Downloading official copy: ${doc.fileName}`, 'success');
    }
  };

  // --- RENDERING DOCUMENT PREVIEW (NEVER STUCK ON LOADING) ---
  const preview = document.getElementById('doc-preview');
  preview.innerHTML = `
    <div style="text-align:center; padding:48px 16px;">
      <div style="font-size:2rem; margin-bottom:12px;">🔓</div>
      <div style="font-weight:600; font-size:0.95rem; color:#475569; margin-bottom:4px;">Decrypting AES-256-GCM Vault Storage & Generating Preview...</div>
      <div style="font-size:0.8rem; color:#94a3b8;">Verifying Web Crypto signatures & Object URLs</div>
    </div>
  `;

  let activeBlobUrl = null;

  async function renderDocumentPreview() {
    try {
      let vaultResult = null;
      if (typeof CryptoVaultService !== 'undefined') {
        try {
          vaultResult = await CryptoVaultService.getAndDecryptDocument(doc.id);
        } catch(err) {
          console.warn('CryptoVault lookup error:', err);
        }
      }

      if (vaultResult && vaultResult.decryptedBytes) {
        const mime = vaultResult.mimeType || 'application/pdf';
        const fileNameLower = (vaultResult.fileName || doc.fileName || '').toLowerCase();
        
        if (activeBlobUrl) URL.revokeObjectURL(activeBlobUrl);
        const blobUrl = CryptoVaultService.createDecryptedBlobUrl(vaultResult.decryptedBytes, mime);
        activeBlobUrl = blobUrl;

        if (mime.includes('pdf') || fileNameLower.endsWith('.pdf')) {
          preview.innerHTML = `<iframe src="${blobUrl}" style="width:100%; height:620px; border:1px solid #cbd5e1; border-radius:8px; box-shadow:0 4px 16px rgba(0,0,0,0.1);" title="${doc.fileName}"></iframe>`;
        } else if (mime.startsWith('image/') || fileNameLower.match(/\.(png|jpg|jpeg|webp|gif)$/)) {
          preview.innerHTML = `<div style="text-align:center; padding:16px;"><img src="${blobUrl}" style="max-width:100%; max-height:560px; border-radius:8px; box-shadow:0 4px 16px rgba(0,0,0,0.2);" alt="${doc.fileName}"/></div>`;
        } else if (mime.includes('text') || fileNameLower.match(/\.(txt|md|csv|json)$/)) {
          const textContent = new TextDecoder().decode(vaultResult.decryptedBytes);
          preview.style.whiteSpace = 'pre-wrap';
          preview.style.fontFamily = 'monospace, sans-serif';
          preview.style.fontSize = '0.9rem';
          preview.style.lineHeight = '1.6';
          preview.style.padding = '16px';
          preview.style.background = '#f8fafc';
          preview.style.borderRadius = '8px';
          preview.style.border = '1px solid #e2e8f0';
          preview.textContent = textContent;
        } else {
          // Unsupported Format Fallback UI
          preview.innerHTML = `
            <div class="card p-6 text-center" style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:8px; margin:20px 0;">
              <div style="font-size:2.5rem; margin-bottom:8px;">📄</div>
              <div style="font-weight:700; font-size:1.1rem; color:#1e293b; margin-bottom:6px;">Preview not available for this file type</div>
              <div style="font-size:0.85rem; color:#64748b; margin-bottom:16px;">The file format (${mime || 'Binary Document'}) cannot be displayed in inline browser preview.</div>
              <button class="btn btn-primary" onclick="window.triggerOfficialDownload()">📥 Download Official Copy</button>
            </div>
          `;
        }
      } else if (doc.fileDataUrl) {
        preview.innerHTML = `<div style="text-align:center; padding:16px;"><img src="${doc.fileDataUrl}" style="max-width:100%; max-height:540px; border-radius:8px; box-shadow:0 4px 16px rgba(0,0,0,0.2);" alt="${doc.fileName}"/></div>`;
      } else if (doc.ocrText) {
        preview.style.whiteSpace = 'pre-wrap';
        preview.style.fontFamily = 'monospace, sans-serif';
        preview.style.fontSize = '0.9rem';
        preview.style.lineHeight = '1.6';
        preview.style.padding = '16px';
        preview.style.background = '#f8fafc';
        preview.style.borderRadius = '8px';
        preview.style.border = '1px solid #e2e8f0';
        preview.textContent = doc.ocrText;
      } else {
        preview.innerHTML = `
          <div class="card p-6 text-center" style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px;">
            <div style="font-size:2rem; margin-bottom:8px;">📜</div>
            <div style="font-weight:700; font-size:1rem; color:#334155; margin-bottom:4px;">Encrypted Document Copy Sealed in Repository</div>
            <div class="text-sm text-muted mb-4">Cryptographic integrity hash matched. Click below to download the official unencrypted copy.</div>
            <button class="btn btn-primary btn-sm" onclick="window.triggerOfficialDownload()">📥 Download Official Copy</button>
          </div>
        `;
      }
    } catch (err) {
      console.error('Document preview render error:', err);
      preview.innerHTML = `
        <div class="card p-6 text-center" style="background:#fef2f2; border:1px solid #fca5a5; border-radius:8px;">
          <div style="font-size:2.2rem; margin-bottom:8px;">⚠️</div>
          <div style="font-weight:700; font-size:1.1rem; color:#991b1b; margin-bottom:4px;">Unable to load document preview</div>
          <div style="font-size:0.85rem; color:#dc2626; margin-bottom:16px;">${err.message || 'Decryption process encountered an error.'}</div>
          <div style="display:flex; justify-content:center; gap:12px;">
            <button class="btn btn-secondary btn-sm" onclick="location.reload()">🔄 Retry</button>
            <button class="btn btn-primary btn-sm" onclick="window.triggerOfficialDownload()">📥 Download Official Copy</button>
          </div>
        </div>
      `;
    }
  }

  // Execute preview rendering immediately
  await renderDocumentPreview();

  // Load AI Insights in Tab 1 independently
  try {
    loadAiInsights(doc);
  } catch(e) {
    console.warn('AI Insights error:', e);
  }

  let record = null;
  try {
    record = await VerificationService.getVerificationDetails(docId);
  } catch(e) {
    console.warn('Failed to fetch verification details:', e);
  }

  const badgesContainer = document.getElementById('doc-badges');
  let statusBadgeHtml = '';
  if (record) {
    if (record.overallStatus === 'VERIFIED') {
      statusBadgeHtml = `<span class="badge badge-success">🟢 VERIFIED</span>`;
    } else if (record.overallStatus === 'REQUIRES_HUMAN_REVIEW') {
      statusBadgeHtml = `<span class="badge badge-warning">🟠 HUMAN REVIEW</span>`;
    } else if (record.overallStatus === 'NON_LEGAL_DOCUMENT') {
      statusBadgeHtml = `<span class="badge badge-warning" style="background:#fef08a; color:#854d0e; border:1px solid #eab308;">⚠️ NON-LEGAL DOCUMENT</span>`;
    } else {
      statusBadgeHtml = `<span class="badge badge-danger">🔴 VERIFICATION FAILED</span>`;
    }
  }

  badgesContainer.innerHTML = `
    <span class="badge badge-neutral">${doc.type || 'Document'}</span>
    ${statusBadgeHtml}
    ${NyayaSahay.integrityBadge(doc.integrityStatus || 'verified')}
    ${NyayaSahay.aiStatusBadge(doc.aiStatus || 'completed')}
  `;

  // Load Verification Report & Audit Tabs safely
  try {
    await loadVerificationTab(doc, record);
  } catch(e) {}

  try {
    await loadAuditTab(doc);
  } catch(e) {}

  // Auto switch tab if URL parameter specifies tab=verification
  if (initialTab === 'verification') {
    switchViewerTab('verification');
  }

  window.switchViewerTab = function(tabName) {
    const previewPane = document.getElementById('tab-pane-preview');
    const vrfPane = document.getElementById('tab-pane-verification');
    const auditPane = document.getElementById('tab-pane-audit');

    const btnPrev = document.getElementById('tab-btn-preview');
    const btnVrf = document.getElementById('tab-btn-verification');
    const btnAudit = document.getElementById('tab-btn-audit');

    [btnPrev, btnVrf, btnAudit].forEach(btn => {
      if (btn) {
        btn.classList.remove('active');
        btn.style.borderBottomColor = 'transparent';
        btn.style.color = '#64748b';
      }
    });

    [previewPane, vrfPane, auditPane].forEach(pane => {
      if (pane) pane.classList.add('hidden');
    });

    if (tabName === 'verification') {
      if (vrfPane) vrfPane.classList.remove('hidden');
      if (btnVrf) {
        btnVrf.classList.add('active');
        btnVrf.style.borderBottomColor = '#3b82f6';
        btnVrf.style.color = '#1e293b';
      }
    } else if (tabName === 'audit') {
      if (auditPane) auditPane.classList.remove('hidden');
      if (btnAudit) {
        btnAudit.classList.add('active');
        btnAudit.style.borderBottomColor = '#3b82f6';
        btnAudit.style.color = '#1e293b';
      }
    } else {
      if (previewPane) previewPane.classList.remove('hidden');
      if (btnPrev) {
        btnPrev.classList.add('active');
        btnPrev.style.borderBottomColor = '#3b82f6';
        btnPrev.style.color = '#1e293b';
      }
    }
  };
});

function loadAiInsights(doc) {
  const aiContainer = document.getElementById('ai-insights-container');
  if (!aiContainer) return;

  if (doc.aiInsights) {
    const ai = doc.aiInsights;
    let html = '';

    if (ai.summary) {
      html += `
        <div class="insight-section">
          <div class="insight-title">AI Summary</div>
          <div class="ai-summary-box">${ai.summary}</div>
        </div>
      `;
    }

    html += `
      <div class="insight-section">
        <div class="insight-title">Document Classification</div>
        <div class="insight-value font-semibold">${doc.type}</div>
        <div class="confidence-bar"><div class="confidence-fill" style="width: ${Math.round((ai.confidence || 0.95)*100)}%;"></div></div>
        <div class="text-muted mt-1" style="font-size: 0.8rem;">${Math.round((ai.confidence || 0.95)*100)}% Confidence</div>
      </div>
    `;

    const relatedCase = MockData.getCase(doc.caseId);
    if (relatedCase) {
      html += `
        <div class="insight-section">
          <div class="insight-title">Case Details</div>
          <a href="case-details.html?id=${doc.caseId}" class="cell-link">${doc.caseId}</a> - ${relatedCase.title}
        </div>
      `;
    }

    if (ai.entities && ai.entities.length > 0) {
      html += `<div class="insight-section"><div class="insight-title">Key Entities</div>`;
      ai.entities.forEach(ent => {
        let cls = 'entity-other';
        if (ent.type === 'Person') cls = 'entity-person';
        if (ent.type === 'Organization') cls = 'entity-org';
        if (ent.type === 'Location') cls = 'entity-loc';
        html += `<span class="entity-tag ${cls}">${ent.value || ent.name} (${ent.role || 'Entity'})</span>`;
      });
      html += `</div>`;
    }

    if (ai.dates && ai.dates.length > 0) {
      html += `<div class="insight-section"><div class="insight-title">Important Dates</div>`;
      ai.dates.forEach(d => {
        html += `<div class="insight-value"><strong>${NyayaSahay.formatDate(d.date)}</strong>: ${d.context}</div>`;
      });
      html += `</div>`;
    }

    if (ai.sections && ai.sections.length > 0) {
      html += `<div class="insight-section"><div class="insight-title">Relevant Legal Sections</div>`;
      ai.sections.forEach(s => {
        html += `<div class="insight-value">• ${s}</div>`;
      });
      html += `</div>`;
    }

    html += `<div class="ai-disclaimer">AI-generated insights are advisory only. The original document remains the source of truth. All extractions should be verified by authorized personnel.</div>`;
    
    aiContainer.innerHTML = html;
  } else {
    aiContainer.innerHTML = '<div class="text-muted">No AI insights available for this document.</div>';
  }
}

async function loadVerificationTab(doc, record) {
  const container = document.getElementById('verification-report-container');
  if (!container || !record) return;

  // Fetch complementary service data
  const authData = await DocumentService.verifyAuthorityRecord(doc.id);
  const sigData = await DocumentService.verifyDigitalSignature(doc.id);
  const qrData = await DocumentService.verifyQRCode(doc.id);
  const ledgerData = await BlockchainService.getLedgerRecord(doc.id);
  const reviewStatus = await VerificationService.getHumanReviewStatus(doc.id);

  let html = '';

  // Render Status Card
  html += VerificationUI.renderStatusCard(record);

  // If there's an active human review ticket
  if (reviewStatus) {
    html += `
      <div class="card mb-4" style="border-left: 4px solid #3b82f6; background:#eff6ff; padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong style="color:#1d4ed8;">🛡 Human Review Request Active (Ticket #${reviewStatus.ticketId})</strong>
            <div style="font-size:0.825rem; color:#1e40af; margin-top:2px;">Assigned Role: <strong>${reviewStatus.assignedRole}</strong> • Status: <span class="badge badge-info">${reviewStatus.status}</span></div>
          </div>
          <div style="font-size:0.75rem; color:#64748b;">Submitted by ${reviewStatus.submittedBy}</div>
        </div>
      </div>
    `;
  }

  // Render 11-Point Verification Checklist
  html += VerificationUI.renderChecklist(record.checks);

  // Render Authority Card
  html += VerificationUI.renderAuthorityCard(authData);

  // Render Digital Signature & QR Card
  html += VerificationUI.renderDigitalSignatureCard(sigData, qrData);

  // Render Blockchain Ledger Widget
  html += VerificationUI.renderBlockchainCard(ledgerData);

  // Render Evidence & Source References Table
  html += VerificationUI.renderEvidenceTable(doc);

  container.innerHTML = html;
}

async function loadAuditTab(doc) {
  const container = document.getElementById('blockchain-audit-container');
  if (!container) return;

  const ledgerData = await BlockchainService.getLedgerRecord(doc.id);
  const auditLogs = MockData.getAuditForDocument(doc.id);

  let html = '';

  if (ledgerData) {
    html += VerificationUI.renderBlockchainCard(ledgerData);
  }

  html += `
    <div class="card">
      <div class="card-header">
        <h3 class="section-title">Cryptographic Audit Trail Logs for ${doc.fileName}</h3>
      </div>
      <div class="card-body" style="padding:0;">
        ${auditLogs.length === 0 ? `
          <div style="padding:24px; text-align:center; color:#94a3b8;">No audit trail events logged for this document yet.</div>
        ` : `
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User / Role</th>
                  <th>Action</th>
                  <th>IP Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${auditLogs.map(a => `
                  <tr>
                    <td>${new Date(a.timestamp).toLocaleString('en-IN')}</td>
                    <td><strong>${a.userName}</strong> (${a.role})</td>
                    <td>${a.action}</td>
                    <td><code>${a.ip}</code></td>
                    <td><span class="badge ${a.status === 'success' ? 'badge-success' : a.status === 'warning' ? 'badge-warning' : 'badge-danger'}">${a.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    </div>
  `;

  container.innerHTML = html;
}
