document.addEventListener('DOMContentLoaded', () => {
  NyayaSahay.initApp('permissions', 'Permissions', [{label: 'Home', href: 'dashboard.html'}, {label: 'Permissions'}]);

  document.getElementById('icon-shield-container').innerHTML = NyayaSahay.icons.shield;
  document.getElementById('icon-plus').innerHTML = NyayaSahay.icons.plus;

  renderTable();

  document.getElementById('add-user-btn').addEventListener('click', () => {
    openUserModal();
  });
});

function renderTable() {
  const tbody = document.querySelector('#users-table tbody');
  
  const users = MockData.users.map(u => ({
    ...u,
    status: u.id === 'USR-004' ? 'Inactive' : 'Active', 
    lastActive: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    cases: u.role === 'Admin' ? ['All Cases'] : ['CR-124-2026', 'CR-130-2026'],
    docAccess: u.role === 'Admin' ? 'All' : (u.role === 'Analyst' ? 'Read Only' : 'Assigned Cases')
  }));

  tbody.innerHTML = users.map(user => {
    const isInactive = user.status === 'Inactive';
    const rowClass = isInactive ? 'row-inactive' : '';
    const statusBadge = isInactive ? `<span class="badge badge-neutral">Inactive</span>` : `<span class="badge badge-success">Active</span>`;
    
    const caseBadges = user.cases.map(c => `<span class="badge badge-outline text-xs mr-1">${c}</span>`).join('');

    return `
      <tr class="${rowClass}">
        <td>
          <div class="flex items-center gap-3">
            <div class="avatar w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              ${user.initials}
            </div>
            <div>
              <div class="font-medium">${user.name}</div>
              <div class="text-xs text-muted">${user.email}</div>
            </div>
          </div>
        </td>
        <td>${NyayaSahay.roleBadge(user.role)}</td>
        <td><div class="flex flex-wrap gap-1">${caseBadges}</div></td>
        <td class="text-sm">${user.docAccess}</td>
        <td>${statusBadge}</td>
        <td class="text-sm text-muted">${NyayaSahay.formatTimeAgo(user.lastActive)}</td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-sm btn-ghost edit-btn" data-id="${user.id}" title="Edit" ${isInactive ? 'disabled' : ''}>
              ${NyayaSahay.icons.edit}
            </button>
            <button class="btn btn-sm btn-ghost text-danger remove-btn" data-id="${user.id}" title="Remove">
              ${NyayaSahay.icons.trash}
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const user = MockData.users.find(u => u.id === id);
      if (user) openUserModal(user);
    });
  });

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      NyayaSahay.showConfirm(
        'Are you sure you want to remove this user? Their access will be immediately revoked.',
        () => {
          NyayaSahay.showToast('User removed successfully.', 'success');
          
        },
        'Remove User',
        'danger'
      );
    });
  });
}

function openUserModal(user = null) {
  const isEdit = !!user;
  const template = document.getElementById('user-modal-template').innerHTML;
  
  let bodyContent = document.createElement('div');
  bodyContent.innerHTML = template;

  const casesContainer = bodyContent.querySelector('#modal-cases');
  MockData.cases.forEach(c => {
    casesContainer.innerHTML += `
      <div class="flex items-center gap-2 mb-2">
        <input type="checkbox" id="case-${c.id}" class="form-checkbox" ${isEdit && (user.role==='Admin' || Math.random()>0.5) ? 'checked' : ''}>
        <label for="case-${c.id}" class="text-sm cursor-pointer">${c.id} - ${c.title}</label>
      </div>
    `;
  });

  NyayaSahay.showModal({
    title: isEdit ? 'Edit User' : 'Add New User',
    body: bodyContent.innerHTML,
    footer: `
      <button class="btn btn-outline" onclick="NyayaSahay.hideModal()">Cancel</button>
      <button class="btn btn-primary" id="save-user-btn">${isEdit ? 'Save Changes' : 'Add User'}</button>
    `,
    size: 'lg'
  });

  if (isEdit) {
    document.getElementById('modal-name').value = user.name;
    document.getElementById('modal-email').value = user.email;
    document.getElementById('modal-role').value = user.role;
  }

  document.getElementById('save-user-btn').addEventListener('click', () => {
    const name = document.getElementById('modal-name').value;
    const email = document.getElementById('modal-email').value;
    if (!name || !email) {
      NyayaSahay.showToast('Please fill all required fields', 'error');
      return;
    }
    
    NyayaSahay.hideModal();
    NyayaSahay.showToast(isEdit ? 'User updated successfully' : 'User added successfully', 'success');
  });
}
