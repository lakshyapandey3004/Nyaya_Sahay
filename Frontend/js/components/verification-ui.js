/**
 * NYAYA-SAHAY Reusable Verification UI Components Library
 * Renders document verification outcome status, 11-point checklist, authority cards,
 * digital signature indicators, blockchain telemetry, and human review modals.
 * Uses existing project styles & colors.
 */
const VerificationUI = {

  /**
   * Render Main Verification Outcome Status Card
   */
  renderStatusCard(record, onHumanReviewClick) {
    const statusMap = {
      'VERIFIED': {
        class: 'verified',
        badgeClass: 'badge-success',
        icon: '🟢',
        title: 'VERIFIED',
        sub: 'All cryptographic, authority, and rule-based verification checks passed.',
        bg: '#ecfdf5',
        border: '#10b981',
        textColor: '#065f46'
      },
      'REQUIRES_HUMAN_REVIEW': {
        class: 'review',
        badgeClass: 'badge-warning',
        icon: '🟠',
        title: 'REQUIRES HUMAN REVIEW',
        sub: 'Automated verification incomplete or requires official judicial confirmation.',
        bg: '#fffbeb',
        border: '#f59e0b',
        textColor: '#92400e'
      },
      'VERIFICATION_FAILED': {
        class: 'failed',
        badgeClass: 'badge-danger',
        icon: '🔴',
        title: 'VERIFICATION FAILED (FAKE / FORGED LEGAL DOCUMENT)',
        sub: 'Synthetic AI text, unfilled bracket placeholders, or cryptographic hash mismatch detected!',
        bg: '#fef2f2',
        border: '#ef4444',
        textColor: '#991b1b'
      },
      'NON_LEGAL_DOCUMENT': {
        class: 'non-legal',
        badgeClass: 'badge-warning',
        icon: '⚠️',
        title: 'NON-LEGAL DOCUMENT DETECTED',
        sub: 'The uploaded file is not a recognized legal document (e.g. Personal Resume, Receipt, General Text, or Unrelated File).',
        bg: '#fefce8',
        border: '#eab308',
        textColor: '#854d0e'
      }
    };

    const s = statusMap[record.overallStatus] || statusMap['REQUIRES_HUMAN_REVIEW'];

    return `
      <div class="verification-status-card" style="background:${s.bg}; border: 2px solid ${s.border}; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="font-size: 2rem;">${s.icon}</div>
            <div>
              <div style="font-size: 0.75rem; text-transform: uppercase; font-weight:700; color:${s.textColor}; letter-spacing:0.05em;">Document Verification Status</div>
              <h2 style="margin:2px 0 4px 0; color:${s.textColor}; font-size:1.35rem; font-weight:700;">${s.title}</h2>
              <div style="font-size: 0.875rem; color:${s.textColor}; font-weight:500;">${s.sub}</div>
            </div>
          </div>
          <div style="text-align:right; display:flex; flex-direction:column; gap:8px;">
            <div style="font-size:0.75rem; color:#64748b;">Verification ID: <strong style="color:#1e293b;">VRF-2026-${record.documentId}</strong></div>
            <div style="font-size:0.75rem; color:#64748b;">Timestamp: <strong>${new Date(record.verificationTimestamp || Date.now()).toLocaleString('en-IN')}</strong></div>
            
            ${record.overallStatus === 'REQUIRES_HUMAN_REVIEW' || record.overallStatus === 'VERIFICATION_FAILED' ? `
              <button class="btn btn-warning btn-sm mt-2" onclick="${onHumanReviewClick || 'VerificationUI.openHumanReviewModal(\'' + record.documentId + '\')'}">
                🛡 Send for Human Review
              </button>
            ` : ''}
          </div>
        </div>

        ${record.warnings && record.warnings.length > 0 ? `
          <div style="margin-top:16px; padding:12px; background:#ffffff; border-left:4px solid #f59e0b; border-radius:4px; font-size:0.875rem;">
            <strong style="color:#b45309;">⚠️ Warnings / Action items:</strong>
            <ul style="margin:6px 0 0 18px; color:#92400e; padding:0;">
              ${record.warnings.map(w => `<li>${w}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  },

  /**
   * Render Reusable 11-Point Verification Checklist
   */
  renderChecklist(checks) {
    return `
      <div class="card mb-4">
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
          <h3 class="section-title" style="margin:0;">Verification Checklist (11 Automated Checks)</h3>
          <span class="badge badge-info">${checks.filter(c => c.status === 'passed').length} / ${checks.length} Passed</span>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="checklist-container">
            ${checks.map((c, i) => {
              const statusIcon = c.status === 'passed' ? '✓' : c.status === 'warning' ? '⚠️' : '✕';
              const statusColor = c.status === 'passed' ? '#10b981' : c.status === 'warning' ? '#f59e0b' : '#ef4444';
              const statusBg = c.status === 'passed' ? '#ecfdf5' : c.status === 'warning' ? '#fffbeb' : '#fef2f2';

              return `
                <div style="border-bottom: 1px solid #f1f5f9; padding: 14px 20px; display:flex; align-items:flex-start; gap: 14px;">
                  <div style="width:24px; height:24px; border-radius:50%; background:${statusBg}; color:${statusColor}; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.85rem; flex-shrink:0;">
                    ${statusIcon}
                  </div>
                  <div style="flex:1;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <div style="font-weight:600; font-size:0.925rem; color:#1e293b;">${i + 1}. ${c.name}</div>
                      <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:${statusColor};">${c.status}</span>
                    </div>
                    <div style="font-size:0.825rem; color:#64748b; margin-top:2px;">${c.detail}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Authority Verification UI Widget
   */
  renderAuthorityCard(authData) {
    if (!authData) return '';

    const isVerified = authData.verified;

    return `
      <div class="card mb-4">
        <div class="card-header" style="background:#f8fafc; border-bottom:1px solid #e2e8f0; padding:14px 20px;">
          <h4 style="margin:0; font-weight:600; font-size:0.95rem; color:#1e293b; display:flex; align-items:center; gap:8px;">
            🏢 Authority Verification Registry
          </h4>
        </div>
        <div class="card-body" style="padding:16px 20px;">
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
            <div>
              <div style="font-size:0.75rem; color:#64748b; font-weight:600; text-transform:uppercase;">Issuing Authority</div>
              <div style="font-weight:600; color:#1e293b; margin-top:2px;">${authData.issuingAuthority}</div>
            </div>
            <div>
              <div style="font-size:0.75rem; color:#64748b; font-weight:600; text-transform:uppercase;">Registry ID</div>
              <div style="font-weight:600; color:#1e293b; margin-top:2px;">${authData.registryId || authData.documentId}</div>
            </div>
            <div>
              <div style="font-size:0.75rem; color:#64748b; font-weight:600; text-transform:uppercase;">Verification Source</div>
              <div style="font-weight:500; color:#3b82f6; margin-top:2px;">${authData.verificationSource}</div>
            </div>
            <div>
              <div style="font-size:0.75rem; color:#64748b; font-weight:600; text-transform:uppercase;">Registry Status</div>
              <div style="margin-top:2px;">
                <span class="badge ${isVerified ? 'badge-success' : 'badge-warning'}">
                  ${isVerified ? '✓ Record Found & Verified' : '⚠️ Record Pending Lookup'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Digital Signature & QR Verification Widget
   */
  renderDigitalSignatureCard(sigData, qrData) {
    if (!sigData) return '';

    return `
      <div class="card mb-4">
        <div class="card-header" style="background:#f8fafc; border-bottom:1px solid #e2e8f0; padding:14px 20px; display:flex; justify-content:space-between; align-items:center;">
          <h4 style="margin:0; font-weight:600; font-size:0.95rem; color:#1e293b; display:flex; align-items:center; gap:8px;">
            ✍️ Digital Signature & QR Verification
          </h4>
          <span style="font-size:0.75rem; color:#64748b; background:#f1f5f9; padding:2px 8px; border-radius:4px; font-weight:600;">STQC & PKI Audited</span>
        </div>
        <div class="card-body" style="padding:16px 20px;">
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
            
            <!-- Digital Signature Section -->
            <div style="border:1px solid #e2e8f0; border-radius:6px; padding:14px; background:${sigData.hasDigitalSignature ? '#f0fdf4' : '#fffbeb'};">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-weight:700; font-size:0.875rem; color:#1e293b;">Cryptographic Digital Signature</span>
                <span class="badge ${sigData.hasDigitalSignature ? 'badge-success' : 'badge-warning'}">
                  ${sigData.hasDigitalSignature ? '✓ Valid' : '⚠️ Not Available'}
                </span>
              </div>
              <div style="font-size:0.8rem; color:#475569; line-height:1.5;">
                <div><strong>Signature Type:</strong> ${sigData.signatureType}</div>
                ${sigData.signer ? `<div><strong>Signer:</strong> ${sigData.signer}</div>` : ''}
                ${sigData.certificate ? `<div><strong>CA Certificate:</strong> ${sigData.certificate.issuer}</div>` : ''}
              </div>
              ${sigData.warning ? `
                <div style="margin-top:8px; font-size:0.75rem; color:#b45309; background:#fef3c7; padding:6px 8px; border-radius:4px; line-height:1.4;">
                  <strong>Note:</strong> ${sigData.warning}
                </div>
              ` : ''}
            </div>

            <!-- QR Code Section -->
            <div style="border:1px solid #e2e8f0; border-radius:6px; padding:14px; background:${qrData && qrData.hasQR ? '#f0fdf4' : '#f8fafc'};">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-weight:700; font-size:0.875rem; color:#1e293b;">QR / Barcode Seal</span>
                <span class="badge ${qrData && qrData.hasQR ? 'badge-success' : 'badge-neutral'}">
                  ${qrData && qrData.hasQR ? '✓ QR Verified' : '⚠️ Not Available'}
                </span>
              </div>
              <div style="font-size:0.8rem; color:#475569; line-height:1.5;">
                ${qrData && qrData.hasQR ? `
                  <div><strong>Verification ID:</strong> ${qrData.verificationId}</div>
                  <div><strong>Registry Source:</strong> ${qrData.source}</div>
                  <div style="font-size:0.75rem; color:#059669; margin-top:4px;">✓ QR payload matches server verification hash</div>
                ` : `
                  <div>Document scan does not contain an embedded verification QR code.</div>
                  <div style="font-size:0.75rem; color:#64748b; margin-top:4px;">(Absence of QR code does not mark document as fake)</div>
                `}
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Blockchain Integrity & Telemetry Widget
   */
  renderBlockchainCard(ledger) {
    if (!ledger) return '';

    const isMatch = ledger.status === 'MATCHED';

    return `
      <div class="card mb-4">
        <div class="card-header" style="background:#0f172a; color:#ffffff; padding:14px 20px; display:flex; justify-content:space-between; align-items:center;">
          <h4 style="margin:0; font-weight:600; font-size:0.95rem; color:#ffffff; display:flex; align-items:center; gap:8px;">
            ⛓️ Blockchain Integrity Record (NIC Permissioned Ledger)
          </h4>
          <span class="badge ${isMatch ? 'badge-success' : 'badge-danger'}">
            ${isMatch ? '✓ HASH MATCHED' : '🔴 HASH MISMATCH'}
          </span>
        </div>
        <div class="card-body" style="padding:16px 20px; background:#1e293b; color:#f8fafc; font-size:0.85rem;">
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:16px; margin-bottom:14px;">
            <div>
              <div style="color:#94a3b8; font-size:0.75rem; text-transform:uppercase;">Network</div>
              <div style="font-weight:600; color:#38bdf8;">${ledger.network}</div>
            </div>
            <div>
              <div style="color:#94a3b8; font-size:0.75rem; text-transform:uppercase;">Consensus Mechanism</div>
              <div style="font-weight:600; color:#f1f5f9;">${ledger.consensusType}</div>
            </div>
            <div>
              <div style="color:#94a3b8; font-size:0.75rem; text-transform:uppercase;">Block Number</div>
              <div style="font-weight:600; color:#f1f5f9;">#${ledger.blockNumber}</div>
            </div>
            <div>
              <div style="color:#94a3b8; font-size:0.75rem; text-transform:uppercase;">Recorded Timestamp</div>
              <div style="font-weight:600; color:#f1f5f9;">${new Date(ledger.timestamp).toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div style="background:#0f172a; border-radius:6px; padding:12px; font-family:monospace; font-size:0.78rem; line-height:1.6;">
            <div><span style="color:#94a3b8;">Recorded Ledger Hash :</span> <span style="color:#4ade80;">${ledger.recordedHash}</span></div>
            <div><span style="color:#94a3b8;">Current Computed Hash :</span> <span style="${isMatch ? 'color:#4ade80;' : 'color:#f87171; font-weight:700;'}">${ledger.currentHash}</span></div>
            <div><span style="color:#94a3b8;">Transaction Tx Hash :</span> <span style="color:#38bdf8;">${ledger.transactionHash}</span></div>
          </div>

          <div style="margin-top:10px; font-size:0.75rem; color:#94a3b8; font-style:italic;">
            ℹ️ Note: The permissioned blockchain stores immutable cryptographic hash telemetry and chain of custody events. Original PDF/document binaries are NOT stored on-chain.
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Extracted Evidence & Source References Table
   */
  renderEvidenceTable(doc) {
    if (!doc || !doc.aiInsights || !doc.aiInsights.entities) return '';

    return `
      <div class="card mb-4">
        <div class="card-header" style="background:#f8fafc; border-bottom:1px solid #e2e8f0; padding:14px 20px;">
          <h4 style="margin:0; font-weight:600; font-size:0.95rem; color:#1e293b; display:flex; align-items:center; gap:8px;">
            🔍 Extracted Legal Evidence & Source References
          </h4>
        </div>
        <div class="card-body" style="padding:0;">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Field / Entity Name</th>
                  <th>Extracted Value</th>
                  <th>Entity Role</th>
                  <th>Source Reference</th>
                </tr>
              </thead>
              <tbody>
                ${doc.aiInsights.entities.map((e, idx) => `
                  <tr>
                    <td><strong style="color:#1e293b;">${e.type}</strong></td>
                    <td><span class="entity-tag entity-${e.type.toLowerCase().slice(0, 3)}">${e.value}</span></td>
                    <td>${e.role || 'Extracted Legal Fact'}</td>
                    <td><span style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-size:0.78rem; font-weight:600; color:#475569;">Page 1 (Line ${12 + idx * 4})</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Open Human Review Request Modal
   */
  openHumanReviewModal(documentId) {
    const doc = MockData.getDocument(documentId);
    const fileName = doc ? doc.fileName : 'Document.pdf';

    const modalBody = `
      <form id="human-review-form" onsubmit="event.preventDefault(); VerificationUI.handleReviewSubmit('${documentId}');">
        <div class="form-group mb-3">
          <label class="form-label">Document Under Review</label>
          <input type="text" class="form-input" value="${fileName} (${documentId})" disabled style="background:#f1f5f9;">
        </div>

        <div class="form-group mb-3">
          <label class="form-label">Reason for Human Review *</label>
          <div style="display:flex; flex-direction:column; gap:6px; margin-top:4px;">
            <label style="font-size:0.875rem; color:#334155; cursor:pointer;">
              <input type="checkbox" name="review-reason" value="Authority registry verification required" checked> Authority registry verification required
            </label>
            <label style="font-size:0.875rem; color:#334155; cursor:pointer;">
              <input type="checkbox" name="review-reason" value="Digital signature missing or unverified"> Digital signature missing or unverified
            </label>
            <label style="font-size:0.875rem; color:#334155; cursor:pointer;">
              <input type="checkbox" name="review-reason" value="Cryptographic hash discrepancy investigation"> Cryptographic hash discrepancy investigation
            </label>
            <label style="font-size:0.875rem; color:#334155; cursor:pointer;">
              <input type="checkbox" name="review-reason" value="Complex legal section / clause verification"> Complex legal section / clause verification
            </label>
          </div>
        </div>

        <div class="form-group mb-3">
          <label class="form-label">Assign Reviewer Role</label>
          <select id="review-role-select" class="form-select">
            <option value="Senior Judicial Reviewer">Senior Judicial Reviewer</option>
            <option value="CBI Investigating Officer">CBI Investigating Officer</option>
            <option value="Forensic Document Analyst">Forensic Document Analyst</option>
            <option value="Public Prosecutor Cell">Public Prosecutor Cell</option>
          </select>
        </div>

        <div class="form-group mb-3">
          <label class="form-label">Additional Investigator Notes</label>
          <textarea id="review-notes" class="form-textarea" rows="3" placeholder="Provide notes or context for the human reviewer..."></textarea>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px;">
          <button type="button" class="btn btn-secondary" onclick="NyayaSahay.hideModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Submit for Official Review</button>
        </div>
      </form>
    `;

    NyayaSahay.showModal({
      title: '🛡 Request Official Human Review',
      body: modalBody
    });
  },

  /**
   * Handle Submission of Human Review Form
   */
  async handleReviewSubmit(documentId) {
    const checkedReasons = Array.from(document.querySelectorAll('input[name="review-reason"]:checked')).map(cb => cb.value);
    const reviewerRole = document.getElementById('review-role-select').value;
    const notes = document.getElementById('review-notes').value;

    if (checkedReasons.length === 0) {
      NyayaSahay.showToast('Please select at least one reason for human review.', 'warning');
      return;
    }

    const res = await VerificationService.submitHumanReview({
      documentId,
      reasons: checkedReasons,
      reviewerRole,
      notes
    });

    NyayaSahay.hideModal();
    NyayaSahay.showToast(`Human Review Ticket ${res.reviewRecord.ticketId} created successfully! Assigned to ${reviewerRole}.`, 'success');

    // Refresh active view if on document viewer
    if (typeof loadVerificationTab === 'function') {
      loadVerificationTab();
    } else {
      setTimeout(() => window.location.reload(), 1000);
    }
  }
};
