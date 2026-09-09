document.addEventListener('DOMContentLoaded', async () => {
  NyayaSahay.initApp('documents', 'Documents', [
    { label: 'Home', href: 'dashboard.html' },
    { label: 'Documents' }
  ]);

  const searchInput = document.getElementById('search-input');
  const typeFilter = document.getElementById('type-filter');
  const caseFilter = document.getElementById('case-filter');
  const statusFilter = document.getElementById('status-filter');
  const tableContainer = document.getElementById('documents-table-container');
  const countSpan = document.getElementById('doc-count');

  let allDocuments = [];
  if (typeof ApiClient !== 'undefined') {
    const backendDocs = await ApiClient.getDocuments();
    if (backendDocs && Array.isArray(backendDocs) && backendDocs.length > 0) {
      allDocuments = backendDocs.map(d => ({
        id: d.document_id || d.id,
        fileName: d.file_name,
        type: d.document_type || 'Legal Document',
        caseId: d.case_id,
        uploadedByName: d.uploaded_by || 'Inspector R. Sharma',
        uploadDate: d.uploaded_at,
        version: '1.0',
        size: d.file_size ? `${(parseInt(d.file_size)/1024).toFixed(1)} KB` : '1.5 MB',
        integrityStatus: d.overall_status === 'VERIFIED' ? 'verified' : 'flagged',
        aiStatus: 'completed'
      }));
    }
  }

  if (allDocuments.length === 0 && typeof MockData !== 'undefined') {
    allDocuments = MockData.documents || [];
  }

  if (MockData && MockData.cases) {
    MockData.cases.forEach(c => {
      const option = document.createElement('option');
      option.value = c.id;
      option.textContent = `${c.id} - ${c.title}`;
      caseFilter.appendChild(option);
    });
  }

  const renderTable = () => {
    const searchVal = searchInput.value.toLowerCase();
    const typeVal = typeFilter.value;
    const caseVal = caseFilter.value;
    const statusVal = statusFilter.value;

    let filtered = allDocuments;
    filtered = filtered.filter(doc => {
      if (searchVal && !doc.fileName.toLowerCase().includes(searchVal)) return false;
      if (typeVal && doc.type !== typeVal) return false;
      if (caseVal && doc.caseId !== caseVal) return false;
      if (statusVal && doc.integrityStatus.toLowerCase() !== statusVal.toLowerCase()) return false;
      return true;
    });

    countSpan.textContent = filtered.length;

    if (filtered.length === 0) {
      tableContainer.innerHTML = NyayaSahay.emptyState(NyayaSahay.icons.documents || '', 'No documents found', 'Try adjusting your filters.');
      return;
    }

    const columns = [
      { key: 'fileName', label: 'File Name' },
      { key: 'type', label: 'Document Type' },
      { key: 'caseId', label: 'Case ID' },
      { key: 'uploadedByName', label: 'Uploaded By' },
      { key: 'uploadDate', label: 'Date' },
      { key: 'version', label: 'Version' },
      { key: 'size', label: 'Size' },
      { key: 'integrityStatus', label: 'Integrity' },
      { key: 'aiStatus', label: 'AI' }
    ];

    const rows = filtered.map(doc => ({
      fileName: `<a href="document-viewer.html?id=${doc.id}" class="cell-link">${doc.fileName}</a>`,
      type: doc.type,
      caseId: `<a href="case-details.html?id=${doc.caseId}" class="cell-link">${doc.caseId}</a>`,
      uploadedByName: doc.uploadedByName,
      uploadDate: NyayaSahay.formatDate(doc.uploadDate),
      version: `v${doc.version}`,
      size: doc.size,
      integrityStatus: NyayaSahay.integrityBadge(doc.integrityStatus),
      aiStatus: NyayaSahay.aiStatusBadge(doc.aiStatus)
    }));

    tableContainer.innerHTML = NyayaSahay.buildTable(columns, rows);
  };

  searchInput.addEventListener('input', renderTable);
  typeFilter.addEventListener('change', renderTable);
  caseFilter.addEventListener('change', renderTable);
  statusFilter.addEventListener('change', renderTable);

  renderTable();
});
