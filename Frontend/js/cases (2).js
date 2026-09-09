document.addEventListener('DOMContentLoaded', () => {
    NyayaSahay.initApp('cases', 'Cases', [
        { label: 'Home', href: 'dashboard.html' },
        { label: 'Cases' }
    ]);

    const searchIconContainer = document.querySelector('.search-filter .icon');
    if (searchIconContainer) searchIconContainer.innerHTML = NyayaSahay.icons.search;
    
    const createBtn = document.getElementById('btn-create-case');
    if (createBtn) createBtn.innerHTML = `${NyayaSahay.icons.plus} Create New Case`;

    const searchInput = document.getElementById('search-input');
    const typeFilter = document.getElementById('type-filter');
    const statusFilter = document.getElementById('status-filter');
    const sortFilter = document.getElementById('sort-filter');
    const tableContainer = document.getElementById('cases-table-container');

    let currentCases = [...MockData.cases];

    function renderTable() {
        const columns = [
            { key: 'id', label: 'Case ID' },
            { key: 'title', label: 'Title' },
            { key: 'type', label: 'Type' },
            { key: 'status', label: 'Status' },
            { key: 'documents', label: 'Documents' },
            { key: 'users', label: 'Users' },
            { key: 'lastUpdated', label: 'Last Updated' },
            { key: 'integrity', label: 'Integrity' }
        ];

        const rows = currentCases.map(c => {
            return {
                id: `<a href="case-details.html?id=${c.id}" class="cell-link" style="font-weight:700;">${c.id}</a>`,
                title: `<span style="font-weight:600; color:var(--text);">${c.title}</span>`,
                type: `<span class="badge badge-neutral">${c.type}</span>`,
                status: NyayaSahay.statusBadge(c.status),
                documents: `<span class="badge badge-neutral">${c.documents} documents</span>`,
                users: `<span class="badge badge-neutral">${c.users} officers</span>`,
                lastUpdated: NyayaSahay.formatDate(c.lastUpdated),
                integrity: NyayaSahay.integrityBadge(c.integrityStatus)
            };
        });

        tableContainer.innerHTML = NyayaSahay.buildTable(columns, rows, {
            onRowClick: (row, data) => {
                window.location.href = `case-details.html?id=${currentCases[row].id}`;
            }
        });
    }

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const type = typeFilter.value;
        const status = statusFilter.value;
        const sort = sortFilter.value;

        currentCases = MockData.cases.filter(c => {
            const matchesSearch = c.id.toLowerCase().includes(searchTerm) || c.title.toLowerCase().includes(searchTerm);
            const matchesType = type === 'All Types' || c.type === type;
            const matchesStatus = status === 'All Status' || c.status === status;
            return matchesSearch && matchesType && matchesStatus;
        });

        currentCases.sort((a, b) => {
            if (sort === 'Last Updated') return new Date(b.lastUpdated) - new Date(a.lastUpdated);
            if (sort === 'Case ID') return a.id.localeCompare(b.id);
            if (sort === 'Title') return a.title.localeCompare(b.title);
            return 0;
        });

        renderTable();
    }

    searchInput.addEventListener('input', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);

    createBtn.addEventListener('click', () => {
        const usersList = MockData.users.map(u => 
            `<div class="form-checkbox-group flex items-center gap-2 mb-2">
                <input type="checkbox" id="user-${u.id}" value="${u.id}">
                <label for="user-${u.id}">${u.name} <span class="text-muted">(${u.role})</span></label>
            </div>`
        ).join('');

        const bodyHtml = `
            <div class="form-group mb-3">
                <label class="form-label block mb-1" for="case-title">Case Title</label>
                <input type="text" id="case-title" class="form-input w-full" placeholder="Enter case title">
            </div>
            <div class="form-group mb-3">
                <label class="form-label block mb-1" for="case-type">Case Type</label>
                <select id="case-type" class="form-select w-full">
                    <option value="Criminal">Criminal</option>
                    <option value="Civil">Civil</option>
                    <option value="Financial Crime">Financial Crime</option>
                    <option value="Property">Property</option>
                </select>
            </div>
            <div class="form-group mb-3">
                <label class="form-label block mb-1" for="case-desc">Description</label>
                <textarea id="case-desc" class="form-textarea w-full" rows="4" placeholder="Enter case description"></textarea>
            </div>
            <div class="form-group">
                <label class="form-label block mb-2">Assigned Users</label>
                <div style="max-height: 150px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 4px; padding: 10px;">
                    ${usersList}
                </div>
            </div>
        `;

        const footerHtml = `
            <button class="btn btn-outline" id="modal-cancel">Cancel</button>
            <button class="btn btn-primary" id="modal-create">Create Case</button>
        `;

        NyayaSahay.showModal({
            title: 'Create New Case',
            body: bodyHtml,
            footer: footerHtml,
            size: 'lg'
        });

        document.getElementById('modal-cancel').addEventListener('click', () => {
            NyayaSahay.hideModal();
        });

        document.getElementById('modal-create').addEventListener('click', () => {
            const title = document.getElementById('case-title').value;
            const type = document.getElementById('case-type').value;
            const desc = document.getElementById('case-desc').value;
            if (!title) {
                NyayaSahay.showToast('Please enter a case title', 'error');
                return;
            }
            const newCaseId = `CR-${Math.floor(200 + Math.random() * 800)}/2026`;
            const newCase = {
                id: newCaseId,
                title: title,
                type: type,
                status: 'Active',
                description: desc || 'Newly initiated investigation case file.',
                documents: 1,
                users: 3,
                lastUpdated: new Date().toISOString(),
                integrityStatus: 'verified'
            };
            MockData.cases.unshift(newCase);
            currentCases.unshift(newCase);
            renderTable();
            NyayaSahay.hideModal();
            NyayaSahay.showToast(`Case ${newCaseId} created and registered in National Ledger!`, 'success');
        });
    });

    renderTable();
});
