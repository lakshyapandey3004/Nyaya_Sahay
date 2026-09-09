document.addEventListener('DOMContentLoaded', () => {
  NyayaSahay.initApp('tracking-pipeline', 'Case Tracking Pipeline', [
    { label: 'Home', href: 'dashboard.html' },
    { label: 'Cases', href: 'cases.html' },
    { label: 'Tracking Pipeline', href: 'tracking-pipeline.html' }
  ]);

  const urlParams = new URLSearchParams(window.location.search);
  const initialCaseId = urlParams.get('id') || 'CR-124/2026';

  window.NyayaSahayTracking = {
    currentCaseId: initialCaseId,
    activeTab: 'tab-logs',
    filterStatus: 'ALL',
    searchQuery: '',

    init() {
      this.populateCaseDropdown();
      this.loadCase(this.currentCaseId);
      this.bindFormSubmit();
    },

    async populateCaseDropdown() {
      const dropdown = document.getElementById('case-select-dropdown');
      if (!dropdown) return;

      let casesList = null;
      if (typeof ApiClient !== 'undefined') {
        casesList = await ApiClient.getCases();
      }
      if (!casesList || casesList.length === 0) {
        casesList = typeof MockData !== 'undefined' ? MockData.cases : [];
      }

      dropdown.innerHTML = casesList.map(c => {
        const cId = c.case_id || c.id;
        const title = c.title || c.caseTitle || 'Legal Case';
        const type = c.case_type || c.type || 'Criminal';
        return `
          <option value="${cId}" ${cId === this.currentCaseId ? 'selected' : ''}>
            ${cId} — ${title} (${type})
          </option>
        `;
      }).join('');

      dropdown.onchange = (e) => {
        const selectedId = e.target.value;
        this.loadCase(selectedId);
      };
    },

    async loadCase(caseId) {
      this.currentCaseId = caseId;
      let pipeline = null;
      if (typeof ApiClient !== 'undefined') {
        pipeline = await ApiClient.getTrackingPipeline(caseId);
      }
      if (!pipeline) {
        pipeline = MockData.getTrackingPipeline(caseId);
      }

      this.renderHeroBanner(pipeline);
      this.renderKpiGrid(pipeline);
      this.renderHearingLogs(pipeline);
      this.renderClientBrief(pipeline);
      this.renderLawyerNotes(pipeline);
    },

    renderHeroBanner(pipeline) {
      const heroEl = document.getElementById('pipeline-hero-container');
      if (!heroEl) return;

      const progressWidth = Math.min(100, Math.max(10, pipeline.overallProgressPercent));

      const stepsHtml = pipeline.lifecycleStages.map(stage => {
        let statusClass = stage.status; // 'completed', 'active', 'pending'
        let iconSymbol = stage.status === 'completed' ? '✓' : (stage.status === 'active' ? '●' : stage.step);

        return `
          <div class="step-item ${statusClass}">
            <div class="step-circle">${iconSymbol}</div>
            <div class="step-label">${stage.title || stage.stage_name || stage.name || ('Stage ' + (stage.step || stage.stage_number))}</div>
            <div class="step-date">${stage.date || stage.target_date || ''}</div>
          </div>
        `;
      }).join('');

      heroEl.innerHTML = `
        <div class="flex justify-between items-start flex-wrap gap-4 mb-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="badge badge-primary font-mono" style="font-size:0.875rem; padding:4px 10px;">CNR: ${pipeline.cnrNumber}</span>
              <span class="badge badge-warning font-mono" style="font-size:0.875rem; padding:4px 10px;">CASE ID: ${pipeline.caseId}</span>
            </div>
            <h1 style="margin:6px 0; font-size:1.6rem; font-weight:800; color:#ffffff;">${pipeline.caseTitle}</h1>
            <div style="font-size:0.875rem; color:#94a3b8; display:flex; gap:16px; flex-wrap:wrap; margin-top:6px;">
              <span>🏛 <strong>Court:</strong> ${pipeline.courtName}</span>
              <span>👨‍⚖️ <strong>Presiding Judge:</strong> ${pipeline.judgeName}</span>
            </div>
          </div>

          <div style="background: rgba(255,255,255,0.06); padding:12px 18px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); min-width:240px;">
            <div style="font-size:0.75rem; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px;">Key Stakeholders</div>
            <div style="font-size:0.8125rem; color:#f8fafc; margin-top:4px;">👤 <strong>Client:</strong> ${pipeline.clientName}</div>
            <div style="font-size:0.8125rem; color:#f8fafc; margin-top:2px;">⚖ <strong>Advocate:</strong> ${pipeline.advocateName}</div>
            <div style="font-size:0.8125rem; color:#f8fafc; margin-top:2px;">👮 <strong>IO / Police:</strong> ${pipeline.investigatingOfficer}</div>
          </div>
        </div>

        <!-- Visual Stepper Progress Pipeline -->
        <div style="margin-top:24px;">
          <div class="flex justify-between items-center mb-1">
            <span style="font-size:0.8125rem; font-weight:700; color:#60a5fa; text-transform:uppercase; letter-spacing:0.5px;">
              CURRENT STAGE: ${pipeline.currentStage}
            </span>
            <span style="font-size:0.875rem; font-weight:700; color:#10b981;">
              ${pipeline.overallProgressPercent}% Complete
            </span>
          </div>

          <div class="pipeline-stepper">
            <div class="pipeline-progress-bar" style="width: ${progressWidth}%;"></div>
            ${stepsHtml}
          </div>
        </div>
      `;
    },

    renderKpiGrid(pipeline) {
      const container = document.getElementById('kpi-cards-container');
      if (!container) return;

      const stats = pipeline.backlogStats;
      const nextDateFormatted = stats.nextHearingDate ? NyayaSahay.formatDateTime(stats.nextHearingDate) : 'Not Scheduled';

      container.innerHTML = `
        <div class="kpi-card">
          <div class="kpi-icon" style="background:#eff6ff; color:#2563eb;">⚡</div>
          <div>
            <div class="kpi-title">Overall Progression</div>
            <div class="kpi-value">${pipeline.overallProgressPercent}%</div>
            <div class="kpi-sub">${pipeline.currentStage.split(':')[0]}</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" style="background:#fef3c7; color:#d97706;">⌛</div>
          <div>
            <div class="kpi-title">Adjournment Backlog</div>
            <div class="kpi-value" style="color:#d97706;">${stats.adjournedHearings} Hearings</div>
            <div class="kpi-sub">+${stats.pendingBacklogDays} Days Cumulative Delay</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" style="background:#dcfce7; color:#15803d;">📅</div>
          <div>
            <div class="kpi-title">Next Scheduled Court Date</div>
            <div class="kpi-value" style="font-size:1.1rem; color:#15803d;">${nextDateFormatted.split(' ')[0]} ${nextDateFormatted.split(' ')[1]} ${nextDateFormatted.split(' ')[2]}</div>
            <div class="kpi-sub">${pipeline.courtName.split(',')[0]}</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" style="background:#f3e8ff; color:#7e22ce;">📊</div>
          <div>
            <div class="kpi-title">Hearings Tracker</div>
            <div class="kpi-value" style="color:#7e22ce;">${stats.completedHearings} / ${stats.totalHearingsScheduled} Done</div>
            <div class="kpi-sub">${stats.totalHearingsScheduled - stats.completedHearings} Remaining / Scheduled</div>
          </div>
        </div>
      `;
    },

    renderHearingLogs(pipeline) {
      const container = document.getElementById('hearing-logs-list');
      if (!container) return;

      let logs = pipeline.hearingBacklogLogs || [];

      // Filter
      if (this.filterStatus !== 'ALL') {
        logs = logs.filter(l => l.outcomeStatus.toLowerCase().includes(this.filterStatus.toLowerCase()));
      }

      // Search
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        logs = logs.filter(l => 
          l.summary.toLowerCase().includes(q) ||
          l.stage.toLowerCase().includes(q) ||
          l.adjournmentReason.toLowerCase().includes(q) ||
          l.courtRoom.toLowerCase().includes(q)
        );
      }

      if (logs.length === 0) {
        container.innerHTML = `
          <div class="text-center p-8 border rounded background-white">
            <div style="font-size:2rem; margin-bottom:8px;">🔍</div>
            <h4 class="m-0 text-muted">No hearing logs found matching filter criteria.</h4>
          </div>
        `;
        return;
      }

      container.innerHTML = logs.map(log => {
        let cardTypeClass = 'completed';
        let badgeBg = 'background:#dcfce7; color:#15803d;';
        let badgeText = '✓ Completed';

        if (log.outcomeStatus.includes('Adjourned')) {
          cardTypeClass = 'adjourned';
          badgeBg = 'background:#fef3c7; color:#b45309;';
          badgeText = '⌛ Adjourned (Backlog Delay)';
        } else if (log.outcomeStatus.includes('Scheduled') || log.outcomeStatus.includes('Upcoming')) {
          cardTypeClass = 'upcoming';
          badgeBg = 'background:#dbeafe; color:#1d4ed8;';
          badgeText = '📅 Scheduled (Upcoming)';
        }

        const isAdjourned = log.outcomeStatus.includes('Adjourned');

        return `
          <div class="hearing-log-card ${cardTypeClass}">
            <div class="flex justify-between items-start flex-wrap gap-2 mb-2">
              <div>
                <div class="flex items-center gap-2">
                  <span style="font-weight:800; font-size:1.1rem; color:#0f172a;">📅 ${NyayaSahay.formatDate(log.hearingDate)}</span>
                  <span style="background:#f1f5f9; color:#475569; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:4px;">
                    🏛 ${log.courtRoom}
                  </span>
                </div>
                <div style="font-weight:700; color:#2563eb; font-size:0.9375rem; margin-top:2px;">
                  Stage: ${log.stage}
                </div>
              </div>

              <div>
                <span style="${badgeBg} font-size:0.8125rem; font-weight:700; padding:4px 12px; border-radius:6px;">
                  ${badgeText}
                </span>
              </div>
            </div>

            ${isAdjourned ? `
              <div class="adjournment-badge mb-2">
                <span>⚠️ Reason for Adjournment & Backlog:</span>
                <span>${log.adjournmentReason}</span>
              </div>
            ` : ''}

            <div style="font-size:0.9375rem; color:#334155; line-height:1.6; margin-top:8px;">
              <strong>Court Proceeding & Summary:</strong> ${log.summary}
            </div>

            ${log.evidenceProduced && log.evidenceProduced.length > 0 ? `
              <div style="margin-top:10px; font-size:0.8125rem; color:#64748b;">
                <strong>📁 Evidence / Documents Produced:</strong>
                ${log.evidenceProduced.map(doc => `<code style="background:#f1f5f9; color:#0f172a; padding:2px 6px; border-radius:4px; margin-left:4px;">${doc}</code>`).join('')}
              </div>
            ` : ''}

            <div class="flex justify-between items-center mt-3 pt-3 border-t text-sm">
              <div style="color:#475569;">
                <strong>Action Required:</strong> ${log.actionItems || 'None'}
              </div>
              <div style="color:#059669; font-weight:700;">
                Next Hearing Target: ${log.nextDate ? NyayaSahay.formatDate(log.nextDate) : 'TBD'}
              </div>
            </div>
          </div>
        `;
      }).join('');
    },

    renderClientBrief(pipeline) {
      const container = document.getElementById('client-brief-container');
      if (!container) return;

      const nextHearingFormatted = pipeline.backlogStats.nextHearingDate ? NyayaSahay.formatDateTime(pipeline.backlogStats.nextHearingDate) : 'Pending Announcement';

      container.innerHTML = `
        <div class="client-summary-box">
          <div class="flex items-center gap-3 mb-3">
            <div style="font-size:2.2rem;">👤</div>
            <div>
              <h3 class="m-0 font-bold" style="color:#065f46;">Client Case Progress & Backlog Brief</h3>
              <div style="font-size:0.875rem; color:#047857;">Client Name: ${pipeline.clientName} &bull; Case CNR: ${pipeline.cnrNumber}</div>
            </div>
          </div>

          <div class="grid grid-2 gap-4 mt-4">
            <div style="background:#ffffff; padding:16px; border-radius:8px; border:1px solid #a7f3d0;">
              <h4 style="margin:0 0 8px 0; color:#065f46; font-size:1rem;">📌 Current Case Status (हिंदी में विवरण)</h4>
              <p style="font-size:0.9375rem; color:#1f2937; line-height:1.6; margin:0;">
                आपका केस <strong>${pipeline.caseTitle}</strong> वर्तमान में <strong>${pipeline.currentStage}</strong> चरण में है।
                कुल <strong>${pipeline.overallProgressPercent}%</strong> कार्रवाई पूरी हो चुकी है।
              </p>
            </div>

            <div style="background:#ffffff; padding:16px; border-radius:8px; border:1px solid #a7f3d0;">
              <h4 style="margin:0 0 8px 0; color:#065f46; font-size:1rem;">📅 Next Court Hearing Date</h4>
              <div style="font-size:1.15rem; font-weight:800; color:#047857;">${nextHearingFormatted}</div>
              <div style="font-size:0.8125rem; color:#4b5563; margin-top:2px;">Location: ${pipeline.courtName} &bull; ${pipeline.judgeName}</div>
            </div>
          </div>

          <div style="background:#ffffff; padding:16px; border-radius:8px; border:1px solid #a7f3d0; margin-top:16px;">
            <h4 style="margin:0 0 8px 0; color:#065f46; font-size:1rem;">💡 Previous Adjournment & Backlog Explanation</h4>
            <p style="font-size:0.9375rem; color:#374151; line-height:1.6; margin:0;">
              आपके केस में कुल <strong>${pipeline.backlogStats.adjournedHearings} सुनवाई</strong> स्थगित (Adjourned) हुई हैं, मुख्य रूप से फोरेंसिक साइंस लैब (FSL) रिपोर्ट की विलंबता एवं गवाहों की तारीखों के कारण। आपके वकील <strong>${pipeline.advocateName}</strong> एवं जांच अधिकारी <strong>${pipeline.investigatingOfficer}</strong> अगली सुनवाई में गवाही की प्रक्रिया पूरी कराने के लिए तैयार हैं।
            </p>
          </div>
        </div>
      `;
    },

    renderLawyerNotes(pipeline) {
      const container = document.getElementById('lawyer-notes-container');
      if (!container) return;

      container.innerHTML = `
        <div class="card p-4 border rounded background-white">
          <h3 class="m-0 font-bold mb-3" style="color:#0f172a;">⚖ Advocate & Law Enforcement Action Checklist</h3>
          <p class="text-muted text-sm mb-4">Internal trial backlog items and evidence preparation checklist for Case ${pipeline.caseId}</p>

          <div class="grid grid-2 gap-4">
            <div style="background:#f8fafc; padding:16px; border-radius:8px; border:1px solid #e2e8f0;">
              <h4 style="margin:0 0 10px 0; color:#1e293b; font-size:0.9375rem;">📋 Advocate Prosecution/Defense Checklist</h4>
              <ul style="padding-left:20px; line-height:1.8; font-size:0.875rem; color:#334155; margin:0;">
                <li><span style="color:#10b981; font-weight:700;">✓</span> Cross-examination questions prepared for witness Anil Kapoor</li>
                <li><span style="color:#10b981; font-weight:700;">✓</span> Cryptographic SHA-256 evidence photo hash verified on ledger</li>
                <li><span style="color:#d97706; font-weight:700;">⌛</span> File written synopsis on FSL report contradiction by 12 Sep 2026</li>
                <li><span style="color:#2563eb; font-weight:700;">◷</span> Issue court summons to secondary witness Deepak Nair</li>
              </ul>
            </div>

            <div style="background:#f8fafc; padding:16px; border-radius:8px; border:1px solid #e2e8f0;">
              <h4 style="margin:0 0 10px 0; color:#1e293b; font-size:0.9375rem;">👮 Investigating Officer (IO) Backlog Checklist</h4>
              <ul style="padding-left:20px; line-height:1.8; font-size:0.875rem; color:#334155; margin:0;">
                <li><span style="color:#10b981; font-weight:700;">✓</span> Original FIR and Supplementary statement uploaded to court portal</li>
                <li><span style="color:#10b981; font-weight:700;">✓</span> Physical seized vehicle DL-05-CQ-4521 produced in malkhana</li>
                <li><span style="color:#d97706; font-weight:700;">⌛</span> Ensure presence of IO Priya Sharma on hearing date 15 Sep 2026</li>
                <li><span style="color:#2563eb; font-weight:700;">◷</span> Obtain WhatsApp communication dump from cyber cell</li>
              </ul>
            </div>
          </div>
        </div>
      `;
    },

    switchTab(tabId) {
      this.activeTab = tabId;
      document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      document.querySelectorAll('.tab-pane').forEach(pane => {
        if (pane.id === tabId) {
          pane.classList.remove('hidden');
          pane.classList.add('active');
        } else {
          pane.classList.add('hidden');
          pane.classList.remove('active');
        }
      });
    },

    filterLogs(status) {
      this.filterStatus = status;
      const pipeline = MockData.getTrackingPipeline(this.currentCaseId);
      this.renderHearingLogs(pipeline);
    },

    searchLogs(query) {
      this.searchQuery = query.trim();
      const pipeline = MockData.getTrackingPipeline(this.currentCaseId);
      this.renderHearingLogs(pipeline);
    },

    openAddLogModal() {
      const modal = document.getElementById('portal-modal-overlay');
      if (modal) modal.classList.add('visible');
    },

    closeModal() {
      const modal = document.getElementById('portal-modal-overlay');
      if (modal) modal.classList.remove('visible');
    },

    bindFormSubmit() {
      const form = document.getElementById('add-log-form');
      if (!form) return;

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const date = document.getElementById('new-log-date').value;
        const court = document.getElementById('new-log-court').value.trim();
        const stage = document.getElementById('new-log-stage').value.trim();
        const status = document.getElementById('new-log-status').value;
        const reason = document.getElementById('new-log-reason').value.trim();
        const summary = document.getElementById('new-log-summary').value.trim();
        const action = document.getElementById('new-log-action').value.trim();
        const nextDate = document.getElementById('new-log-next-date').value;

        const newLog = {
          hearingDate: date,
          stage: stage,
          courtRoom: court,
          outcomeStatus: status,
          adjournmentReason: status.includes('Adjourned') ? (reason || 'Court Backlog / Counsel Extension') : 'N/A',
          summary: summary,
          actionItems: action,
          nextDate: nextDate
        };

        if (typeof ApiClient !== 'undefined') {
          await ApiClient.addHearingLog(this.currentCaseId, newLog);
        }

        const pipeline = MockData.getTrackingPipeline(this.currentCaseId);
        if (pipeline) {
          if (!pipeline.hearingBacklogLogs) pipeline.hearingBacklogLogs = [];
          pipeline.hearingBacklogLogs.unshift({
            id: `HLOG-${Date.now()}`,
            ...newLog,
            evidenceProduced: []
          });

          if (status.includes('Adjourned')) {
            pipeline.backlogStats.adjournedHearings += 1;
            pipeline.backlogStats.pendingBacklogDays += 14;
          }

          pipeline.backlogStats.totalHearingsScheduled += 1;
          if (nextDate) {
            pipeline.backlogStats.nextHearingDate = `${nextDate}T10:30:00`;
          }
        }

        this.closeModal();
        await this.loadCase(this.currentCaseId);
        form.reset();

        NyayaSahay.showToast('✓ New Court Hearing Log & Backlog record saved successfully to backend database!', 'success');
      });
    }
  };

  window.NyayaSahayTracking.init();
});
