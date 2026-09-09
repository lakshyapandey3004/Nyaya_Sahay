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

function initFilters() {
  const userSelect = document.getElementById('filter-user');
  MockData.users.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u.name;
    opt.textContent = u.name;
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

  const sourceLogs = auditData || MockData.auditTrail;
  const filtered = sourceLogs.filter(item => {
    
    if (search) {
      const match = (item.userName && item.userName.toLowerCase().includes(search)) ||
                    (item.action && item.action.toLowerCase().includes(search)) ||
                    (item.document && item.document.toLowerCase().includes(search));
      if (!match) return false;
    }
    
    if (user && item.userName !== user) return false;
    
    if (action && item.action !== action) return false;
    
    if (status && item.status.toLowerCase() !== status) return false;
    
    if (dateFrom) {
      const itemDate = new Date(item.timestamp).toISOString().split('T')[0];
      if (itemDate < dateFrom) return false;
    }
    if (dateTo) {
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
    const isViolation = item.status.toLowerCase() === 'violation';
    const isDenied = item.status.toLowerCase() === 'denied';
    const rowClass = isViolation ? 'row-violation' : '';
    
    let statusBadge = '';
    if (isViolation) statusBadge = `<span class="badge badge-danger"><span class="badge-dot bg-red-500 rounded-full w-2 h-2 inline-block mr-1"></span>Violation</span>`;
    else if (isDenied) statusBadge = `<span class="badge badge-warning"><span class="badge-dot bg-amber-500 rounded-full w-2 h-2 inline-block mr-1"></span>Denied</span>`;
    else statusBadge = `<span class="badge badge-success"><span class="badge-dot bg-green-500 rounded-full w-2 h-2 inline-block mr-1"></span>Success</span>`;

    const userObj = MockData.users.find(u => u.name === item.userName) || { initials: 'UN' };

    return `
      <tr class="${rowClass}">
        <td class="text-sm whitespace-nowrap">${NyayaSahay.formatDateTime(item.timestamp)}</td>
        <td>
          <div class="flex items-center gap-2">
            <div class="avatar w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
              ${userObj.initials}
            </div>
            <span class="text-sm font-medium">${item.userName}</span>
          </div>
        </td>
        <td>${NyayaSahay.roleBadge(item.role || 'Officer')}</td>
        <td class="text-sm">${item.action}</td>
        <td>${item.document ? `<a href="document-viewer.html?id=${item.documentId || ''}" class="cell-link text-blue-600 hover:underline text-sm truncate block" style="max-width: 150px;" title="${item.document}">${item.document}</a>` : '-'}</td>
        <td>${item.caseId ? `<a href="case-details.html?id=${item.caseId}" class="cell-link text-blue-600 hover:underline text-sm">${item.caseId}</a>` : '-'}</td>
        <td class="text-xs text-muted font-mono">${item.ip || '192.168.1.100'}</td>
        <td class="text-xs text-muted">${item.device || 'Desktop / Chrome'}</td>
        <td>${statusBadge}</td>
      </tr>
    `;
  }).join('');
}
