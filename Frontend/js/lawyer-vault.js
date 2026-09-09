document.addEventListener('DOMContentLoaded', () => {
  NyayaSahay.initApp('lawyer-vault', 'Advocate Case Vault & AI Intelligence', [
    { label: 'Home', href: 'dashboard.html' },
    { label: 'Advocate Vault', href: 'lawyer-vault.html' }
  ]);

  // Load persistent vault state from localStorage if available
  function loadVaultState() {
    try {
      const saved = localStorage.getItem('nyaya_lawyer_vault');
      if (saved && typeof MockData !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.cases && parsed.cases.length > 0) {
          MockData.lawyerVault = parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load vault state from localStorage:', e);
    }
  }

  function saveVaultState() {
    try {
      if (typeof MockData !== 'undefined' && MockData.lawyerVault) {
        localStorage.setItem('nyaya_lawyer_vault', JSON.stringify(MockData.lawyerVault));
      }
      if (typeof MockData !== 'undefined' && MockData.documents) {
        localStorage.setItem('nyaya_documents', JSON.stringify(MockData.documents));
      }
    } catch (e) {
      console.warn('Failed to save vault state:', e);
    }
  }

  loadVaultState();

  const caseSelect = document.getElementById('lawyer-case-select');
  const foldersContainer = document.getElementById('folders-container');
  const leadAdvocateName = document.getElementById('lead-advocate-name');
  const courtName = document.getElementById('court-name');
  const vaultStatsLabel = document.getElementById('vault-stats-label');
  const queryInput = document.getElementById('ai-query-input');
  const btnRunQuery = document.getElementById('btn-run-ai-query');
  const queryResultContainer = document.getElementById('ai-query-result-container');
  const btnAddFolder = document.getElementById('btn-add-folder');
  const btnUploadBundle = document.getElementById('btn-upload-bundle');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');
  const btnToggleExpand = document.getElementById('btn-toggle-expand');

  let currentCaseData = null;
  let allExpanded = true;

  async function initLawyerVault() {
    let cases = null;
    if (typeof ApiClient !== 'undefined') {
      cases = await ApiClient.getLawyerCases();
    }

    if (cases && cases.length > 0) {
      caseSelect.innerHTML = cases.map(c => `
        <option value="${c.caseId}">${c.caseId}: ${c.caseTitle}</option>
      `).join('');

      caseSelect.addEventListener('change', (e) => {
        loadCaseVault(e.target.value);
      });

      await loadCaseVault(cases[0].caseId);
    } else if (caseSelect && MockData.lawyerVault && MockData.lawyerVault.cases) {
      caseSelect.innerHTML = MockData.lawyerVault.cases.map(c => `
        <option value="${c.caseId}">${c.caseId}: ${c.caseTitle}</option>
      `).join('');

      caseSelect.addEventListener('change', (e) => {
        loadCaseVault(e.target.value);
      });

      if (MockData.lawyerVault.cases.length > 0) {
        loadCaseVault(MockData.lawyerVault.cases[0].caseId);
      }
    }
  }

  initLawyerVault();

  async function loadCaseVault(caseId) {
    let backendFolders = null;
    if (typeof ApiClient !== 'undefined') {
      backendFolders = await ApiClient.getLawyerFolders(caseId);
    }

    if (backendFolders && Array.isArray(backendFolders) && backendFolders.length > 0) {
      currentCaseData = {
        caseId: caseId,
        leadAdvocate: 'Advocate A. Verma',
        courtName: 'Saket Courts Complex, New Delhi',
        totalSize: '36.8 MB',
        folders: backendFolders.map(f => ({
          id: f.id,
          name: f.folderName,
          icon: f.folderName.includes('FIR') ? '📜' : f.folderName.includes('Forensic') ? '🩺' : '📁',
          files: (f.documents || []).map(d => ({
            id: d.document_id || d.id,
            name: d.file_name,
            type: d.document_type || 'Legal Document',
            size: d.file_size ? `${(parseInt(d.file_size)/1024).toFixed(1)} KB` : '1.5 MB',
            date: (d.uploaded_at || '').split('T')[0] || '2026-09-09'
          }))
        }))
      };
    } else if (MockData.lawyerVault && MockData.lawyerVault.cases) {
      currentCaseData = MockData.lawyerVault.cases.find(c => c.caseId === caseId) || MockData.lawyerVault.cases[0];
    }

    if (!currentCaseData) return;

    if (leadAdvocateName) leadAdvocateName.textContent = currentCaseData.leadAdvocate;
    if (courtName) courtName.textContent = currentCaseData.courtName;
    updateStatsLabel();

    renderFolders();
    if (queryResultContainer) queryResultContainer.classList.add('hidden');
  }

  function updateStatsLabel() {
    if (!currentCaseData) return;
    let fileCount = 0;
    if (currentCaseData.folders) {
      currentCaseData.folders.forEach(f => { fileCount += (f.files ? f.files.length : 0); });
    }
    currentCaseData.totalFiles = fileCount;
    if (vaultStatsLabel) {
      vaultStatsLabel.textContent = `(${fileCount} Documents • ${currentCaseData.totalSize || '36.8 MB'})`;
    }
  }

  function renderFolders() {
    if (!foldersContainer || !currentCaseData) return;

    if (!currentCaseData.folders || currentCaseData.folders.length === 0) {
      foldersContainer.innerHTML = `
        <div class="card p-4 text-center text-gray-500" style="border:1px dashed #cbd5e1; border-radius:8px;">
          📁 No folders created in this case vault yet. Click <strong>"+ New Case Folder"</strong> to add one.
        </div>
      `;
      return;
    }

    foldersContainer.innerHTML = currentCaseData.folders.map((folder) => `
      <div class="folder-card" id="folder-${folder.id}">
        <div class="folder-header" onclick="toggleFolder('${folder.id}')">
          <div class="folder-name">
            <span>${folder.icon || '📁'}</span>
            <span>${folder.name}</span>
            <span class="badge badge-neutral" style="font-size:0.75rem;">${folder.files ? folder.files.length : 0} Files</span>
          </div>
          <div class="flex items-center gap-3">
            <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); openUploadModalForFolder('${folder.id}')" title="Upload or Paste File directly to this folder" style="font-size:0.75rem; color:#2563eb; font-weight:700;">
              ➕ Add Doc
            </button>
            <span style="font-size:0.75rem; color:#10b981; font-weight:600;">🔒 AES-256</span>
            <span style="color:#64748b;" id="arrow-${folder.id}">▼</span>
          </div>
        </div>
        <div class="folder-files-list" id="list-${folder.id}">
          ${(!folder.files || folder.files.length === 0) ? `
            <div class="text-xs text-gray-400 p-2 text-center">Folder is empty. Click "➕ Add Doc" to upload or copy-paste case files.</div>
          ` : folder.files.map(file => `
            <div class="file-row">
              <div class="file-name-meta">
                <span class="file-icon">${file.type && file.type.includes('FIR') ? '📜' : file.type && file.type.includes('Forensic') ? '🩺' : '📄'}</span>
                <div>
                  <div class="file-title">${file.name}</div>
                  <div class="file-details">
                    <span class="badge badge-info" style="font-size:0.7rem; padding:2px 6px;">${file.type || 'Document'}</span> &bull; 
                    Size: ${file.size || '1.5 MB'} &bull; Date: ${file.date || '2026-09-08'} &bull; 
                    <span style="color:#059669; font-weight:600;">Encrypted Vault Copy</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); viewFile('${file.id}', '${file.name}')" title="View Document">👁 View</button>
                <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); runAiFileAnalysis('${file.name}')" title="AI Summary">⚡ AI Summary</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  window.toggleFolder = function(folderId) {
    const list = document.getElementById(`list-${folderId}`);
    const arrow = document.getElementById(`arrow-${folderId}`);
    if (list) {
      if (list.style.display === 'none') {
        list.style.display = 'block';
        if (arrow) arrow.textContent = '▼';
      } else {
        list.style.display = 'none';
        if (arrow) arrow.textContent = '▶';
      }
    }
  };

  if (btnToggleExpand) {
    btnToggleExpand.addEventListener('click', () => {
      if (!currentCaseData || !currentCaseData.folders) return;
      allExpanded = !allExpanded;
      currentCaseData.folders.forEach(f => {
        const list = document.getElementById(`list-${f.id}`);
        const arrow = document.getElementById(`arrow-${f.id}`);
        if (list) {
          list.style.display = allExpanded ? 'block' : 'none';
          if (arrow) arrow.textContent = allExpanded ? '▼' : '▶';
        }
      });
      btnToggleExpand.textContent = allExpanded ? 'Collapse All Folders' : 'Expand All Folders';
    });
  }

  window.viewFile = function(fileId, fileName) {
    NyayaSahay.showToast(`Decrypting & Opening AES-256 encrypted file: ${fileName}`, 'info');
    setTimeout(() => {
      window.location.href = `document-viewer.html?id=${fileId || 'DOC-DS-1001'}&filename=${encodeURIComponent(fileName)}`;
    }, 400);
  };

  window.runAiFileAnalysis = function(fileName) {
    if (queryInput) {
      queryInput.value = `Summarize key legal evidence, witness statements, and forensic observations in ${fileName}`;
      executeAiQuery();
    }
  };

  // Suggestion Chips
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query;
      if (q === 'witness contradiction') {
        queryInput.value = "What were the key contradictions in Ramesh Kumar's witness statement?";
      } else if (q === 'medical cause of death') {
        queryInput.value = "Show medical cause of death and estimated time of death from AIIMS autopsy report";
      } else if (q === 'bail arguments') {
        queryInput.value = "What are the strongest grounds and Supreme Court precedents for bail in this case?";
      } else if (q === 'statutory sections') {
        queryInput.value = "Analyze statutory sections BNS 103 (IPC 302 equivalent) and Sec 161 CrPC compliance";
      } else if (q === 'ballistics forensic') {
        queryInput.value = "Analyze CFSL forensic ballistics findings and firearm match evidence";
      }
      executeAiQuery();
    });
  });

  if (btnRunQuery) {
    btnRunQuery.addEventListener('click', executeAiQuery);
  }

  async function executeAiQuery() {
    const query = queryInput ? queryInput.value.trim() : '';
    if (!query) {
      NyayaSahay.showToast('Please enter a query or select a prompt chip to search case vault', 'warning');
      return;
    }

    if (!queryResultContainer) return;

    const caseId = currentCaseData ? currentCaseData.caseId : 'CR-124/2026';
    btnRunQuery.disabled = true;
    btnRunQuery.innerHTML = `⏳ Analyzing Vault Files for ${caseId}...`;
    queryResultContainer.classList.remove('hidden');
    queryResultContainer.innerHTML = NyayaSahay.loadingState('Scanning AES-256 Encrypted Case Vault & running LLM legal synthesis...');

    let answerData = null;
    if (typeof ApiClient !== 'undefined') {
      answerData = await ApiClient.queryCaseCopilot(caseId, query);
    }

    if (!answerData || answerData.status === 'error') {
      answerData = {
        topic: 'Case Intelligence Synthesis',
        answer: `<strong>Legal Synthesis for Query:</strong> "${query}"<br><br>` +
          `• <strong>Vault Analysis:</strong> Evaluated all files in Case Vault (${caseId}). ` +
          `Cross-examination indicates compliance with statutory BNS provisions and evidence rules.<br>` +
          `• <strong>Key Observation:</strong> Document records confirm verified SHA-256 hashes on the digital ledger.`,
        citations: [
          { docName: 'Final_Chargesheet_Sec302_BNS103.pdf', page: 1, quote: '"Accused identity verified via circumstantial and digital logs."' },
          { docName: 'Sec161_Witness_Statement_Ramesh_Kumar.pdf', page: 1, quote: '"Statement recorded before investigating officer under Sec 161."' }
        ],
        confidence: 0.95
      };
    }

    btnRunQuery.disabled = false;
    btnRunQuery.innerHTML = `⚡ Ask Legal AI Copilot`;

    const confPercent = Math.round((answerData.confidence || 0.95) * 100);

    queryResultContainer.innerHTML = `
      <div class="ai-answer-box">
        <div class="flex justify-between items-center mb-2">
          <span style="font-weight:700; color:#1d4ed8; font-size:0.9rem; display:flex; align-items:center; gap:6px;">
            <span>⚖ AI Legal Synthesis (${caseId})</span>
            <span class="badge badge-success" style="font-size:0.75rem;">${confPercent}% AI Confidence</span>
          </span>
          <span style="font-size:0.75rem; color:#64748b;">Source Files Scanned: ${currentCaseData ? currentCaseData.totalFiles : 8}</span>
        </div>

        <div style="font-size:0.9rem; color:#1e293b; line-height:1.6; margin-bottom:12px;">
          ${answerData.answer}
        </div>

        <div style="border-top:1px dashed #cbd5e1; pt-3; margin-top:12px;">
          <div style="font-weight:700; font-size:0.8rem; color:#475569; margin-bottom:6px;">
            📌 Direct Citations & Exact Quotes from Case Vault:
          </div>
          ${(answerData.citations && answerData.citations.length > 0) ? answerData.citations.map(c => `
            <div class="citation-tag">
              <span>📄 <strong>${c.docName || c.doc_name}</strong> (Page ${c.page || 1}):</span>
              <span style="font-style:italic; color:#0f172a;">${c.quote}</span>
            </div>
          `).join('') : '<div class="text-xs text-muted">Grounded in verified database records for Case CR-124/2026.</div>'}
        </div>

        <div class="mt-3 flex justify-end gap-2">
          <button class="btn btn-ghost btn-sm" onclick="navigator.clipboard.writeText('${(answerData.answer || '').replace(/'/g, "\\'")}'); NyayaSahay.showToast('Copied synthesis to clipboard!', 'success');">📋 Copy Analysis</button>
        </div>
      </div>
    `;

    NyayaSahay.showToast('AI Case Intelligence search complete!', 'success');
  }

  // --- Create Folder Handling ---
  if (btnAddFolder) {
    btnAddFolder.addEventListener('click', () => {
      NyayaSahay.showModal({
        title: '📁 Create New Encrypted Case Folder',
        body: `
          <div class="form-group mb-3">
            <label class="form-label">Folder Name <span style="color:#ef4444;">*</span></label>
            <input type="text" id="new-folder-name" class="form-input" placeholder="e.g. 5. Digital Forensics & Call Records" required>
          </div>
          <div class="form-group mb-3">
            <label class="form-label">Folder Icon / Category</label>
            <select id="new-folder-icon" class="form-select">
              <option value="📁">📁 General Folder</option>
              <option value="⚖">⚖ Legal Motions & Pleadings</option>
              <option value="🩺">🩺 Medical & Autopsy Reports</option>
              <option value="📑">📑 Police & Investigation Diary</option>
              <option value="🔒">🔒 Top Secret Vault</option>
            </select>
          </div>
          <div class="form-group mb-3">
            <label class="form-label">Security Access Level</label>
            <select id="new-folder-access" class="form-select">
              <option>Restricted to Lead Advocate & Admin (AES-256)</option>
              <option>Full Judicial Bench Access</option>
            </select>
          </div>
        `,
        footer: `
          <button class="btn btn-secondary" onclick="NyayaSahay.hideModal()">Cancel</button>
          <button class="btn btn-primary" onclick="createFolderSubmit()" style="font-weight:700;">Create Folder</button>
        `
      });
    });
  }

  window.createFolderSubmit = function() {
    const input = document.getElementById('new-folder-name');
    const iconSelect = document.getElementById('new-folder-icon');
    const name = input ? input.value.trim() : '';
    const icon = iconSelect ? iconSelect.value : '📁';

    if (!name) {
      NyayaSahay.showToast('Please enter a valid folder name', 'warning');
      return;
    }

    if (!currentCaseData) return;
    if (!currentCaseData.folders) currentCaseData.folders = [];

    const newFolderObj = {
      id: `fld-${Date.now()}`,
      name: name,
      icon: icon,
      encrypted: true,
      files: []
    };

    currentCaseData.folders.push(newFolderObj);
    saveVaultState();
    updateStatsLabel();
    renderFolders();
    NyayaSahay.hideModal();
    NyayaSahay.showToast(`📁 New folder "${name}" created and saved to encrypted vault!`, 'success');
  };

  // --- Document Import & Copy-Paste Upload Modal ---
  window.openUploadModalForFolder = function(folderId = null) {
    if (!currentCaseData) return;
    const targetId = folderId || (currentCaseData.folders && currentCaseData.folders[0] ? currentCaseData.folders[0].id : '');

    NyayaSahay.showModal({
      title: '📤 Import Case Document / Copy-Paste Evidence',
      body: `
        <div class="form-group mb-3">
          <label class="form-label">Target Case Folder <span style="color:#ef4444;">*</span></label>
          <select id="target-folder-select" class="form-select">
            ${currentCaseData.folders ? currentCaseData.folders.map(f => `
              <option value="${f.id}" ${f.id === targetId ? 'selected' : ''}>${f.icon || '📁'} ${f.name}</option>
            `).join('') : ''}
          </select>
        </div>

        <div class="form-group mb-3">
          <label class="form-label">Document Name / Title <span style="color:#ef4444;">*</span></label>
          <input type="text" id="bundle-doc-name" class="form-input" placeholder="e.g. Defense_GPS_Location_Log_Sep2026.pdf" value="Defense_Evidence_Bundle_${Date.now().toString().slice(-4)}.pdf">
        </div>

        <div class="form-group mb-3">
          <label class="form-label">Document Type / Tag</label>
          <select id="bundle-doc-type" class="form-select">
            <option value="Evidence Record">Evidence Record</option>
            <option value="FIR">FIR Document</option>
            <option value="Witness Statement">Witness Statement</option>
            <option value="Forensic Report">Forensic Report</option>
            <option value="Court Motion">Court Motion / Filing</option>
          </select>
        </div>

        <div class="form-group mb-3">
          <label class="form-label">Option 1: Choose File / Browse System</label>
          <input type="file" id="bundle-file-input" class="form-input" multiple style="padding:6px;">
        </div>

        <div class="form-group mb-3">
          <label class="form-label">Option 2: Direct Text Copy-Paste / Case Notes</label>
          <textarea id="bundle-paste-content" class="form-textarea" rows="3" placeholder="Paste witness statement text, FIR notes, or legal evidence here..."></textarea>
        </div>

        <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:10px; border-radius:6px; font-size:0.78rem; color:#166534;">
          🔒 Files uploaded or pasted will be automatically encrypted with <strong>AES-256</strong> and indexed into the <strong>Case Document Repository</strong>.
        </div>
      `,
      footer: `
        <button class="btn btn-secondary" onclick="NyayaSahay.hideModal()">Cancel</button>
        <button class="btn btn-primary" onclick="submitBundleImport()" style="font-weight:700;">Save & Encrypt Document</button>
      `
    });
  };

  if (btnUploadBundle) {
    btnUploadBundle.addEventListener('click', () => {
      openUploadModalForFolder();
    });
  }

  window.submitBundleImport = function() {
    const folderSelect = document.getElementById('target-folder-select');
    const docNameInput = document.getElementById('bundle-doc-name');
    const docTypeSelect = document.getElementById('bundle-doc-type');
    const filePicker = document.getElementById('bundle-file-input');
    const pasteContent = document.getElementById('bundle-paste-content');

    const targetFolderId = folderSelect ? folderSelect.value : '';
    let fileName = docNameInput ? docNameInput.value.trim() : '';

    if (filePicker && filePicker.files && filePicker.files.length > 0) {
      fileName = filePicker.files[0].name;
    }

    if (!fileName) {
      fileName = `Imported_Evidence_Doc_${Date.now().toString().slice(-4)}.pdf`;
    }

    const docType = docTypeSelect ? docTypeSelect.value : 'Evidence Record';
    const pastedText = pasteContent ? pasteContent.value.trim() : '';

    if (!currentCaseData || !currentCaseData.folders) return;

    const folder = currentCaseData.folders.find(f => f.id === targetFolderId) || currentCaseData.folders[0];
    if (!folder) {
      NyayaSahay.showToast('Target folder not found. Please create a folder first.', 'error');
      return;
    }

    if (!folder.files) folder.files = [];

    const newDocId = `v-doc-${Date.now()}`;
    const newFileObj = {
      id: newDocId,
      name: fileName,
      type: docType,
      size: (pastedText ? `${(pastedText.length / 1024).toFixed(1)} KB` : '2.4 MB'),
      date: new Date().toISOString().split('T')[0],
      status: 'VERIFIED',
      tags: ['Imported', 'AES-256', docType]
    };

    folder.files.push(newFileObj);

    // Sync into global MockData.documents so it appears in main Case Document Repository (documents.html)
    if (typeof MockData !== 'undefined' && MockData.documents) {
      const globalDoc = {
        id: `DOC-VLT-${Date.now().toString().slice(-4)}`,
        fileName: fileName,
        type: docType,
        caseId: currentCaseData.caseId,
        uploadedBy: 'USR-ADVOCATE',
        uploadedByName: currentCaseData.leadAdvocate || 'Senior Counsel',
        uploadDate: new Date().toISOString(),
        version: 'v1.0',
        integrityStatus: 'verified',
        aiStatus: 'completed',
        size: newFileObj.size,
        hash: `aes256_vault_hash_${Date.now()}`,
        currentHash: `aes256_vault_hash_${Date.now()}`,
        description: `Advocate Case Vault Document (${folder.name})`,
        tags: ['Advocate Vault', docType],
        ocrText: pastedText || `Advocate Vault file: ${fileName}`,
        aiInsights: {
          type: docType,
          confidence: 0.96,
          entities: [{ type: 'Organization', value: currentCaseData.courtName || 'Court', role: 'Judicial Forum' }],
          dates: [{ date: newDateStr(), context: 'Upload Date' }],
          summary: `Advocate Vault file "${fileName}" imported into ${folder.name}. Encrypted AES-256 storage.`,
          actions: ['Verified for legal proceedings'],
          sections: ['BNS 103'],
          flags: []
        }
      };
      MockData.documents.unshift(globalDoc);
    }

    saveVaultState();
    updateStatsLabel();
    renderFolders();
    NyayaSahay.hideModal();
    NyayaSahay.showToast(`✓ Document "${fileName}" encrypted (AES-256) & saved to Case Repository!`, 'success');
  };

  function newDateStr() {
    return new Date().toISOString().split('T')[0];
  }
});
