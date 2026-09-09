let auditData = null;

document.addEventListener('DOMContentLoaded', async () => {
  NyayaSahay.initApp('audit-trail', 'Audit Trail', [{label: 'Home', href: 'dashboard.html'}, {label: 'Audit Trail'}]);

  document.getElementById('icon-scroll-container').innerHTML = NyayaSahay.icons.file; 
  document.getElementById('icon-search').innerHTML = NyayaSahay.icons.searchSmall;

  if (typeof ApiClient !== 'undefined') {
    const apiLogs = await ApiClient.getAuditTrail();
    if (apiLogs && apiLogs.length > 0) {
      auditData = apiLogs;
    }
  }

  initFilters();
  renderTable();
});

async function initFilters() {
  const userSelect = document.getElementById('filter-user');
  if (!userSelect) return;

  let users = null;
  if (typeof ApiClient !== 'undefined') {
    users = await ApiClient.getUsers();
  }
  if (!users || users.length === 0) {
    users = typeof MockData !== 'undefined' ? MockData.users : [];
  }

  users.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u.name;
    opt.textContent = `${u.name} (${u.role || 'User'})`;
    userSelect.appendChild(opt);
  });

  const filterInputs = document.querySelectorAll('.filter-bar input, .filter-bar select');
  filterInputs.forEach(input => {
    input.addEventListener('input', renderTable);
    input.addEventListener('change', renderTable);
  });
}

function renderTable() {
  const tbody = document.querySelector('#audit-table tbody');
  
  const search = document.getElementById('filter-search').value.toLowerCase();
  const dateFrom = document.getElementById('filter-date-from').value;
  const dateTo = document.getElementById('filter-date-to').value;
  const user = document.getElementById('filter-user').value;
  const action = document.getElementById('filter-action').value;
  const status = document.getElementById('filter-status').value.toLowerCase();

  const sourceLogs = auditData || (typeof MockData !== 'undefined' ? MockData.auditTrail : []);
  const filtered = sourceLogs.filter(item => {
    const userName = item.user_name || item.userName || '';
    const act = item.action || '';
    const docName = item.document_name || item.document || '';
    const caseId = item.case_id || item.caseId || '';
    const itemStatus = (item.status || 'success').toLowerCase();

    if (search) {
      const match = userName.toLowerCase().includes(search) ||
                    act.toLowerCase().includes(search) ||
                    docName.toLowerCase().includes(search) ||
                    caseId.toLowerCase().includes(search);
      if (!match) return false;
    }
    
    if (user && userName !== user) return false;
    if (action && act !== action) return false;
    if (status && itemStatus !== status) return false;
    
    if (dateFrom && item.timestamp) {
      const itemDate = new Date(item.timestamp).toISOString().split('T')[0];
      if (itemDate < dateFrom) return false;
    }
    if (dateTo && item.timestamp) {
      const itemDate = new Date(item.timestamp).toISOString().split('T')[0];
      if (itemDate > dateTo) return false;
    }

    return true;
  });

  document.getElementById('entries-count').textContent = filtered.length;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center p-8 text-muted">No audit records found matching the filters.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const userName = item.user_name || item.userName || 'System';
    const docName = item.document_name || item.document || '';
    const docId = item.document_id || item.documentId || '';
    const caseId = item.case_id || item.caseId || '';
    const ip = item.ip_address || item.ip || '127.0.0.1';
    const device = item.device || 'Desktop / Chrome';
    const itemStatus = (item.status || 'success').toLowerCase();

    const isViolation = itemStatus === 'violation' || itemStatus === 'failure';
    const isDenied = itemStatus === 'denied';
    const rowClass = isViolation ? 'row-violation' : '';
    
    let statusBadge = '';
    if (isViolation) statusBadge = `<span class="badge badge-danger"><span class="badge-dot bg-red-500 rounded-full w-2 h-2 inline-block mr-1"></span>Violation</span>`;
    else if (isDenied) statusBadge = `<span class="badge badge-warning"><span class="badge-dot bg-amber-500 rounded-full w-2 h-2 inline-block mr-1"></span>Denied</span>`;
    else statusBadge = `<span class="badge badge-success"><span class="badge-dot bg-green-500 rounded-full w-2 h-2 inline-block mr-1"></span>Success</span>`;

    const initials = userName.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || 'UN';

    return `
      <tr class="${rowClass}">
        <td class="text-sm whitespace-nowrap">${NyayaSahay.formatDateTime(item.timestamp)}</td>
        <td>
          <div class="flex items-center gap-2">
            <div class="avatar w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
              ${initials}
            </div>
            <span class="text-sm font-medium">${userName}</span>
          </div>
        </td>
        <td>${NyayaSahay.roleBadge(item.role || 'Officer')}</td>
        <td class="text-sm">${item.action}</td>
        <td>${docName ? `<a href="document-viewer.html?id=${docId || ''}" class="cell-link text-blue-600 hover:underline text-sm truncate block" style="max-width: 150px;" title="${docName}">${docName}</a>` : '-'}</td>
        <td>${caseId ? `<a href="case-details.html?id=${caseId}" class="cell-link text-blue-600 hover:underline text-sm">${caseId}</a>` : '-'}</td>
        <td class="text-xs text-muted font-mono">${ip}</td>
        <td class="text-xs text-muted">${device}</td>
        <td>${statusBadge}</td>
      </tr>
    `;
  }).join('');
}
