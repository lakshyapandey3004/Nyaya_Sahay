document.addEventListener('DOMContentLoaded', () => {
  NyayaSahay.initApp('documents', 'Upload Document', [
    { label: 'Home', href: 'dashboard.html' },
    { label: 'Documents', href: 'documents.html' },
    { label: 'Upload & Verify Document' }
  ]);

  const caseSelect = document.getElementById('case-select');
  if (MockData && MockData.cases) {
    MockData.cases.forEach(c => {
      const option = document.createElement('option');
      option.value = c.id;
      option.textContent = `${c.id} - ${c.title}`;
      caseSelect.appendChild(option);
    });
  }

  const tagContainer = document.getElementById('tag-container');
  const tagInput = document.getElementById('tag-input');
  
  if (tagContainer && tagInput) {
    tagContainer.addEventListener('click', () => tagInput.focus());
    tagInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && tagInput.value.trim()) {
        e.preventDefault();
        const val = tagInput.value.trim();
        
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.style.cssText = 'background: #f1f5f9; padding: 2px 8px; border-radius: 4px; display: flex; align-items: center; gap: 4px; font-size: 0.85rem;';
        tag.innerHTML = `${val} <span class="tag-remove" style="cursor: pointer; color: #ef4444;">&times;</span>`;
        
        tag.querySelector('.tag-remove').addEventListener('click', () => {
          tag.remove();
        });

        tagContainer.insertBefore(tag, tagInput);
        tagInput.value = '';
      }
    });
  }

  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const preview = document.getElementById('drop-zone-preview');
  let selectedFile = null;
  let selectedFileText = '';
  let activeDemoDocId = 'DOC-001';

  // Quick Demo Buttons
  const btnDemo1 = document.getElementById('btn-demo-1');
  const btnDemo2 = document.getElementById('btn-demo-2');
  const btnDemo3 = document.getElementById('btn-demo-3');
  const btnDemo4 = document.getElementById('btn-demo-4');
  const btnDemo5 = document.getElementById('btn-demo-5');

  if (btnDemo1) {
    btnDemo1.addEventListener('click', () => {
      activeDemoDocId = 'DOC-DEMO-1';
      selectedFile = { name: 'FIR_Valid.pdf', size: 2202010 };
      if (preview) preview.innerHTML = `<strong>Selected Demo 1:</strong> FIR_Valid.pdf (2.1 MB) — 🟢 Standard Authentic FIR`;
      NyayaSahay.showToast('Demo 1 Loaded: Standard Authentic FIR (🟢 VERIFIED state test)', 'info');
    });
  }

  if (btnDemo2) {
    btnDemo2.addEventListener('click', () => {
      activeDemoDocId = 'DOC-DEMO-2';
      selectedFile = { name: 'FIR_Review.pdf', size: 1992010 };
      if (preview) preview.innerHTML = `<strong>Selected Demo 2:</strong> FIR_Review.pdf (1.9 MB) — 🟠 Suspicious Scan`;
      NyayaSahay.showToast('Demo 2 Loaded: Suspicious Scanned FIR (🟠 HUMAN REVIEW state test)', 'warning');
    });
  }

  if (btnDemo3) {
    btnDemo3.addEventListener('click', () => {
      activeDemoDocId = 'DOC-DEMO-3';
      selectedFile = { name: 'FIR_Tampered.pdf', size: 2621440 };
      if (preview) preview.innerHTML = `<strong>Selected Demo 3:</strong> FIR_Tampered.pdf (2.5 MB) — 🔴 Modified File`;
      NyayaSahay.showToast('Demo 3 Loaded: Tampered FIR (🔴 HASH MISMATCH state test)', 'error');
    });
  }

  if (btnDemo4) {
    btnDemo4.addEventListener('click', () => {
      activeDemoDocId = 'DOC-DEMO-4';
      selectedFile = { name: 'ChatGPT_Generated_Fake_FIR.pdf', size: 412000 };
      if (preview) preview.innerHTML = `<strong>Selected Demo 4:</strong> ChatGPT_Generated_Fake_FIR.pdf (0.4 MB) — 🔴 ChatGPT Fake FIR`;
      NyayaSahay.showToast('Demo 4 Loaded: ChatGPT Fake FIR (🔴 AI FAKE DETECTED test)', 'error');
    });
  }

  if (btnDemo5) {
    btnDemo5.addEventListener('click', () => {
      activeDemoDocId = 'DOC-DEMO-5';
      selectedFile = { name: 'Candidate_Resume_JohnDoe.pdf', size: 210000 };
      if (preview) preview.innerHTML = `<strong>Selected Demo 5:</strong> Candidate_Resume_JohnDoe.pdf (0.2 MB) — ⚠️ Non-Legal Resume`;
      NyayaSahay.showToast('Demo 5 Loaded: Candidate Resume (⚠️ NON-LEGAL DOCUMENT test)', 'warning');
    });
  }

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());
    
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        handleFile(fileInput.files[0]);
      }
    });
  }

  function handleFile(file) {
    selectedFile = file;
    activeDemoDocId = null; // Custom uploaded file
    selectedFileText = '';
    const sizeKB = (file.size / 1024).toFixed(1);
    if (preview) preview.innerHTML = `📄 Selected: <strong>${file.name}</strong> (${sizeKB} KB) — <em>Executing Real-time Inspection...</em>`;

    if (file) {
      const reader = new FileReader();
      const filenameLower = file.name.toLowerCase();

      if (filenameLower.endsWith('.txt') || filenameLower.endsWith('.md') || filenameLower.endsWith('.json') || filenameLower.endsWith('.csv')) {
        reader.onload = (e) => {
          selectedFileText = e.target.result || '';
        };
        reader.readAsText(file);
      } else {
        // Read ArrayBuffer for PDF / Binary files & extract printable tokens
        reader.onload = (e) => {
          try {
            const buffer = e.target.result;
            const bytes = new Uint8Array(buffer);
            let chunks = [];
            for (let i = 0; i < bytes.length; i++) {
              if ((bytes[i] >= 32 && bytes[i] <= 126) || bytes[i] === 10 || bytes[i] === 13) {
                chunks.push(String.fromCharCode(bytes[i]));
              } else {
                chunks.push(' ');
              }
            }
            const rawStr = chunks.join('');
            const tokens = rawStr.match(/[A-Za-z0-9\/\-\_\.\[\]\:\,\s]{3,}/g) || [];
            selectedFileText = tokens.join(' ').replace(/\s+/g, ' ');
          } catch (err) {
            selectedFileText = '';
          }
        };
        reader.readAsArrayBuffer(file);
      }
    }
  }

  const uploadBtn = document.getElementById('upload-btn');
  const emptyStatus = document.getElementById('empty-status');
  const processingStatus = document.getElementById('processing-status');
  const successMessage = document.getElementById('success-message');
  const outcomeBadge = document.getElementById('verification-outcome-badge');
  const viewVerificationBtn = document.getElementById('view-verification-btn');

  if (uploadBtn) {
    uploadBtn.addEventListener('click', async () => {
      const pastedTextInput = document.getElementById('pasted-text-input');
      const pastedText = pastedTextInput ? pastedTextInput.value.trim() : '';

      if (!selectedFile && pastedText) {
        selectedFile = { name: 'Pasted_Document_Text.txt', size: pastedText.length };
        activeDemoDocId = null;
      } else if (!selectedFile && !pastedText) {
        activeDemoDocId = 'DOC-DEMO-4'; // Default to Demo 4 (ChatGPT Fake FIR) if neither file nor text provided
        selectedFile = { name: 'ChatGPT_Generated_Fake_FIR.pdf', size: 412000 };
        if (preview) preview.innerHTML = `<strong>Default Demo Selected:</strong> ChatGPT_Generated_Fake_FIR.pdf`;
        NyayaSahay.showToast('Executing Verification Pipeline on sample ChatGPT FIR', 'warning');
      }

      uploadBtn.disabled = true;
      uploadBtn.innerHTML = `⏳ Running Verification Pipeline...`;

      if (emptyStatus) emptyStatus.classList.add('hidden');
      if (processingStatus) processingStatus.classList.remove('hidden');
      if (successMessage) successMessage.classList.add('hidden');

      const steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3'),
        document.getElementById('step-4'),
        document.getElementById('step-5'),
        document.getElementById('step-6')
      ];

      // Reset previous step animations & checkmarks
      steps.forEach(step => {
        if (step) {
          step.classList.remove('active', 'completed');
          const content = step.querySelector('.progress-step-content');
          if (content) {
            content.innerHTML = content.innerHTML.replace(/\s*<span[^>]*>✓<\/span>/gi, '');
          }
        }
      });

      let currentStep = 0;

      function processNextStep() {
        if (currentStep > 0 && steps[currentStep - 1]) {
          steps[currentStep - 1].classList.remove('active');
          steps[currentStep - 1].classList.add('completed');
          const content = steps[currentStep - 1].querySelector('.progress-step-content');
          if (content && !content.innerHTML.includes('✓')) {
            content.innerHTML += ' <span style="color:#10b981; font-weight:700;">✓</span>';
          }
        }

        if (currentStep < steps.length) {
          if (steps[currentStep]) steps[currentStep].classList.add('active');
          currentStep++;
          setTimeout(processNextStep, 350);
        } else {
          // Finish pipeline & run Verification Engine
          finishVerificationPipeline();
        }
      }

      processNextStep();
    });
  }

  async function finishVerificationPipeline() {
    try {
      let result;
      const caseSelect = document.getElementById('case-select');
      const typeSelect = document.getElementById('type-select');
      const pastedTextInput = document.getElementById('pasted-text-input');
      const selectedCase = caseSelect && caseSelect.value ? caseSelect.value : 'CR-124/2026';
      const selectedType = typeSelect && typeSelect.value ? typeSelect.value : 'Auto Detect';
      const pastedText = pastedTextInput ? pastedTextInput.value.trim() : '';
      const textToAnalyze = pastedText || selectedFileText;

      if (!pastedText && activeDemoDocId) {
        result = await VerificationService.verifyDocument(activeDemoDocId);
      } else {
        result = await VerificationService.verifyCustomUploadedFile(selectedFile, textToAnalyze, selectedCase, selectedType);
      }

      const record = result.verificationRecord;
      const targetDocId = result.documentId;

      if (successMessage) successMessage.classList.remove('hidden');

      // Set Outcome Badge
      if (outcomeBadge) {
        if (record.overallStatus === 'VERIFIED') {
          outcomeBadge.innerHTML = `<span class="badge badge-success" style="font-size:1rem; padding:6px 16px;">🟢 OVERALL STATUS: VERIFIED (AUTHENTIC LEGAL DOCUMENT)</span>`;
        } else if (record.overallStatus === 'REQUIRES_HUMAN_REVIEW') {
          outcomeBadge.innerHTML = `<span class="badge badge-warning" style="font-size:1rem; padding:6px 16px;">🟠 OVERALL STATUS: REQUIRES HUMAN REVIEW</span>`;
        } else if (record.overallStatus === 'NON_LEGAL_DOCUMENT') {
          outcomeBadge.innerHTML = `<span class="badge badge-warning" style="font-size:1rem; padding:6px 16px; background:#fef08a; color:#854d0e; border:1px solid #eab308;">⚠️ OVERALL STATUS: NON-LEGAL DOCUMENT DETECTED</span>`;
        } else {
          outcomeBadge.innerHTML = `<span class="badge badge-danger" style="font-size:1rem; padding:6px 16px;">🔴 OVERALL STATUS: VERIFICATION FAILED (FAKE / FORGED DOCUMENT)</span>`;
        }
      }

      if (viewVerificationBtn) {
        viewVerificationBtn.href = `document-viewer.html?id=${targetDocId}&tab=verification`;
      }

      NyayaSahay.showToast(`Verification complete: Document ${record.overallStatus.replace(/_/g, ' ')}!`, record.overallStatus === 'VERIFIED' ? 'success' : 'error');
    } catch (err) {
      console.error(err);
      NyayaSahay.showToast('Verification engine error', 'error');
    } finally {
      if (uploadBtn) {
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = `Upload & Verify Document`;
      }
    }
  }
});
