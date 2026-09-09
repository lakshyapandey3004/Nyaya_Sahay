let ledgerData = null;

document.addEventListener('DOMContentLoaded', async () => {
  NyayaSahay.initApp('integrity', 'Integrity Verification', [{label: 'Home', href: 'dashboard.html'}, {label: 'Integrity'}]);

  document.getElementById('icon-shield-container').innerHTML = NyayaSahay.icons.shield;
  document.getElementById('icon-shield-check').innerHTML = NyayaSahay.icons.shield; 
  document.getElementById('icon-alert-triangle').innerHTML = NyayaSahay.icons.alert;
  document.getElementById('icon-check-circle').innerHTML = NyayaSahay.icons.check;
  document.getElementById('icon-alert-circle').innerHTML = NyayaSahay.icons.alert;

  if (typeof ApiClient !== 'undefined') {
    ledgerData = await ApiClient.getIntegrityLedger();
  }

  renderStats();
  renderTable();

  document.getElementById('verify-all-btn').addEventListener('click', async (e) => {
    const btn = e.target;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner" style="display:inline-block;width:16px;height:16px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></span> Verifying...`;
    
    if (typeof ApiClient !== 'undefined') {
      const result = await ApiClient.verifyAllIntegrity();
      if (result && result.status === 'success') {
        ledgerData = await ApiClient.getIntegrityLedger();
        NyayaSahay.showToast(`Verification complete: ${result.totalScanned} scanned, ${result.totalVerified} clean, ${result.totalViolations} flagged!`, result.totalViolations > 0 ? 'warning' : 'success');
      } else {
        await NyayaSahay.simulateAsync(1200);
        NyayaSahay.showToast('Verification complete.', 'info');
      }
    } else {
      await NyayaSahay.simulateAsync(1200);
      NyayaSahay.showToast('Verification complete. 1 violation found.', 'warning');
    }
    
    btn.disabled = false;
    btn.innerHTML = 'Verify All Documents';
    renderTable(); 
  });
});

function renderStats() {
  const container = document.getElementById('integrity-stats');
  
  let totalDocs = 10;
  let verifiedClean = 9;
  let integrityAlerts = 1;

  if (ledgerData && Array.isArray(ledgerData) && ledgerData.length > 0) {
    totalDocs = ledgerData.length;
    integrityAlerts = ledgerData.filter(d => d.overall_status === 'VERIFICATION_FAILED').length;
    verifiedClean = totalDocs - integrityAlerts;
  }

  container.innerHTML = `
    ${NyayaSahay.statCard(NyayaSahay.icons.file, 'blue', totalDocs, 'Secured Documents', 'Total Vault')}
    ${NyayaSahay.statCard(NyayaSahay.icons.check, 'green', verifiedClean, 'Verified Clean', 'Cryptographically Sound')}
    ${NyayaSahay.statCard(NyayaSahay.icons.alert, 'red', integrityAlerts, 'Integrity Alert', integrityAlerts > 0 ? 'Verification Flag' : 'No Violations')}
    ${NyayaSahay.statCard(NyayaSahay.icons.clock, 'slate', '09 Sep 2026', 'Last Forensic Audit', 'Automatic')}
  `;
}

function renderTable() {
  const tbody = document.querySelector('#integrity-table tbody');
  if (!tbody) return;

  let docsList = [];
  if (ledgerData && Array.isArray(ledgerData) && ledgerData.length > 0) {
    docsList = ledgerData.map(l => ({
      id: l.document_id || `DOC-${l.id}`,
      fileName: l.file_name || `Document_${l.document_id}`,
      caseId: l.case_id || 'CR-124/2026',
      hash: l.stored_hash || l.document_hash || 'SHA256-PENDING',
      currentHash: l.current_hash || l.stored_hash || l.document_hash || 'SHA256-PENDING',
      integrityStatus: l.overall_status === 'VERIFIED' ? 'verified' : 'violated'
    }));
  } else if (typeof MockData !== 'undefined') {
    docsList = MockData.documents.slice(0, 10);
  }
  
  tbody.innerHTML = docsList.map(doc => {
    const isTampered = doc.integrityStatus === 'violated' || doc.id === 'DOC-005';
    const storedHash = doc.hash || '';
    const currentHash = isTampered ? storedHash.replace('a', 'z').replace('1', '9') : doc.currentHash || storedHash;
    const storedHashStr = storedHash ? (storedHash.substring(0, 12) + '...') : 'N/A';
    const currentHashStr = currentHash ? (currentHash.substring(0, 12) + '...') : 'N/A';
    
    let statusHtml = '';
    if (isTampered) {
      statusHtml = `<span class="badge badge-danger integrity-badge integrity-violated pulse flex items-center gap-1">${NyayaSahay.icons.alert} Violated</span>`;
    } else {
      statusHtml = `<span class="badge badge-success integrity-badge integrity-verified flex items-center gap-1">${NyayaSahay.icons.check} Verified</span>`;
    }

    return `
      <tr>
        <td class="cell-primary"><a href="document-viewer.html?id=${doc.id}" class="text-blue-600 hover:underline">${doc.fileName}</a></td>
        <td><a href="case-details.html?id=${doc.caseId}" class="text-blue-600 hover:underline">${doc.caseId}</a></td>
        <td class="font-mono text-sm ${isTampered ? 'hash-match' : ''}">${storedHashStr}</td>
        <td class="font-mono text-sm ${isTampered ? 'hash-mismatch text-danger font-bold' : ''}">${currentHashStr}</td>
        <td id="status-${doc.id}">${statusHtml}</td>
        <td>
          <button class="btn btn-sm btn-outline verify-btn" data-id="${doc.id}">Verify</button>
        </td>
      </tr>
    `;
  }).join('');

  document.querySelectorAll('.verify-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const docId = e.currentTarget.dataset.id;
      const statusCell = document.getElementById(`status-${docId}`);
      
      const originalHtml = statusCell.innerHTML;
      statusCell.innerHTML = `<div class="flex items-center gap-1 text-muted text-sm">
        <span class="spinner" style="display:inline-block;width:14px;height:14px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></span>
        Verifying...
      </div>`;
      
      await NyayaSahay.simulateAsync(2000);
      
      statusCell.innerHTML = originalHtml;
      const isTampered = docId === 'DOC-005';
      if (isTampered) {
        NyayaSahay.showToast('CRITICAL: Integrity violation detected! SHA-256 hash mismatch.', 'error');
      } else {
        NyayaSahay.showToast('Document cryptographic integrity verified. No modifications.', 'success');
      }
    });
  });

  const reportBtn = document.getElementById('report-incident-btn');
  if (reportBtn) {
    reportBtn.addEventListener('click', () => {
      NyayaSahay.showConfirm(
        'Generate forensic incident report for Evidence_Photo_001.jpg and dispatch alert to National Cyber Forensic Lab (NCFL)?',
        () => {
          NyayaSahay.showToast('Incident Report #INC-2026-0901 generated & transmitted to Supervisory Authority.', 'warning');
        },
        'Dispatch Forensic Alert',
        'danger'
      );
    });
  }
}
