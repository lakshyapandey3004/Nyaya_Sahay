document.addEventListener('DOMContentLoaded', async () => {
    NyayaSahay.initApp('dashboard', 'Dashboard', [
        { label: 'Home', href: 'dashboard.html' },
        { label: 'Dashboard' }
    ]);

    renderRoleWelcomeBanner();
    
    let backendData = null;
    if (typeof ApiClient !== 'undefined') {
        backendData = await ApiClient.getDashboard();
    }

    renderStats(backendData);
    renderRecentCases(backendData);
    renderRecentActivity(backendData);
    renderCriticalDates();
    renderIntegrityOverview(backendData);
    renderAIInsights();
});

function renderRoleWelcomeBanner() {
    const container = document.getElementById('role-welcome-banner');
    if (!container) return;

    const user = MockData.currentUser;
    const roleKey = user.roleKey || 'police';

    let title = '';
    let subtitle = '';
    let icon = '👮';
    let badgeText = 'POLICE INVESTIGATION WORKSPACE';
    let badgeBg = '#dbeafe';
    let badgeColor = '#1d4ed8';
    let quickActionsHtml = '';

    if (roleKey === 'police') {
        icon = '👮';
        title = `Welcome back, ${user.name}`;
        subtitle = `Official Police Investigation Portal • Active Case Monitoring & Evidence Vault`;
        badgeText = 'LAW ENFORCEMENT ACCESS';
        badgeBg = '#dbeafe';
        badgeColor = '#1d4ed8';
        quickActionsHtml = `
            <a href="upload.html" class="btn btn-primary btn-sm" style="background:#0284c7; border-color:#0284c7; font-weight:600;">+ Upload FIR / Evidence</a>
            <a href="search.html" class="btn btn-outline btn-sm" style="font-weight:600;">🔍 Search Case / Suspect</a>
            <a href="integrity.html" class="btn btn-outline btn-sm" style="font-weight:600;">🛡 Integrity Verification</a>
        `;
    } else if (roleKey === 'legal') {
        icon = '⚖️';
        title = `Welcome back, ${user.name}`;
        subtitle = `High Court & Judicial Review Desk • Admissibility Checks & AI BNS/IPC Analysis`;
        badgeText = 'JUDICIAL REVIEW ACCESS';
        badgeBg = '#fef3c7';
        badgeColor = '#b45309';
        quickActionsHtml = `
            <a href="documents.html" class="btn btn-primary btn-sm" style="background:#d97706; border-color:#d97706; font-weight:600;">🛡 Human Review Queue</a>
            <a href="ai-insights.html" class="btn btn-outline btn-sm" style="font-weight:600;">✦ BNS / IPC Analysis</a>
            <a href="reports.html" class="btn btn-outline btn-sm" style="font-weight:600;">📄 Download Legal Reports</a>
        `;
    } else if (roleKey === 'citizen') {
        icon = '👤';
        title = `Welcome, ${user.name}`;
        subtitle = `NYAYA-SAHAY Public Citizen Assistance Portal • Track FIR Status & Submit Documents`;
        badgeText = 'PUBLIC CITIZEN ACCESS';
        badgeBg = '#dcfce7';
        badgeColor = '#15803d';
        quickActionsHtml = `
            <a href="search.html" class="btn btn-primary btn-sm" style="background:#16a34a; border-color:#16a34a; font-weight:600;">🔍 Track My Complaint / FIR</a>
            <a href="upload.html" class="btn btn-outline btn-sm" style="font-weight:600;">📝 Submit Grievance / Document</a>
            <a href="integrity.html" class="btn btn-outline btn-sm" style="font-weight:600;">🛡 Public Verification Check</a>
        `;
    } else if (roleKey === 'admin') {
        icon = '🛡️';
        title = `Welcome back, ${user.name}`;
        subtitle = `Super Admin Command Center • Role Allocation, Ledger Health & System Audit Telemetry`;
        badgeText = 'SYSTEM ADMINISTRATOR';
        badgeBg = '#f3e8ff';
        badgeColor = '#6b21a8';
        quickActionsHtml = `
            <a href="permissions.html" class="btn btn-primary btn-sm" style="background:#7c3aed; border-color:#7c3aed; font-weight:600;">👥 User Roles & Access</a>
            <a href="audit-trail.html" class="btn btn-outline btn-sm" style="font-weight:600;">⛓ Blockchain Telemetry</a>
            <a href="settings.html" class="btn btn-outline btn-sm" style="font-weight:600;">⚙ System Settings</a>
        `;
    }

    container.innerHTML = `
        <div class="card p-4" style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-left: 5px solid ${badgeColor}; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div class="flex justify-between items-center flex-wrap gap-3">
                <div class="flex items-center gap-3">
                    <div style="font-size: 2.5rem; line-height: 1;">${icon}</div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0;">${title}</h2>
                            <span style="background: ${badgeBg}; color: ${badgeColor}; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.5px;">${badgeText}</span>
                        </div>
                        <p style="color: #64748b; font-size: 0.875rem; margin-top: 4px; margin-bottom: 0;">${subtitle}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 flex-wrap">
                    ${quickActionsHtml}
                </div>
            </div>
        </div>
    `;
}

function renderStats(backendData) {
    const statsContainer = document.getElementById('dashboard-stats');
    const { dashboardStats } = MockData;
    const user = MockData.currentUser;
    const roleKey = user.roleKey || 'police';

    const activeCasesVal = backendData ? `${backendData.activeCases} Active` : '8 Active';
    const totalDocsVal = backendData ? `${backendData.totalDocuments} Files` : '24 Files';
    const alertsVal = backendData ? `${backendData.integrityAlerts} Flagged` : '1 Flagged';
    const integrityVal = backendData ? `${backendData.integrityPercentage}%` : '96%';
    const aiDocsVal = backendData ? `${backendData.aiProcessedDocuments} Docs` : '12 Docs';

    if (roleKey === 'police') {
        statsContainer.innerHTML = `
            ${NyayaSahay.statCard(NyayaSahay.icons.cases, 'blue', activeCasesVal, 'Assigned Cases', '+2 this week')}
            ${NyayaSahay.statCard(NyayaSahay.icons.documents, 'green', totalDocsVal, 'Evidence Vault', 'SHA-256 Vaulted')}
            ${NyayaSahay.statCard(NyayaSahay.icons.alert, 'red', alertsVal, 'Integrity Alert', 'Action Required')}
            ${NyayaSahay.statCard(NyayaSahay.icons.calendar, 'amber', '15 Sep', 'Next Hearing', 'Evidence Present')}
            ${NyayaSahay.statCard(NyayaSahay.icons.integrity, 'green', integrityVal, 'Chain Integrity', 'Verified Match')}
            ${NyayaSahay.statCard(NyayaSahay.icons.brain, 'purple', aiDocsVal, 'AI FIR Summaries', 'Automated')}
        `;
    } else if (roleKey === 'legal') {
        statsContainer.innerHTML = `
            ${NyayaSahay.statCard(NyayaSahay.icons.cases, 'amber', activeCasesVal, 'Judicial Cases', 'High Court Docket')}
            ${NyayaSahay.statCard(NyayaSahay.icons.documents, 'blue', totalDocsVal, 'Court Records', 'BNS Mapped')}
            ${NyayaSahay.statCard(NyayaSahay.icons.alert, 'amber', alertsVal, 'Review Queue', 'Review Pending')}
            ${NyayaSahay.statCard(NyayaSahay.icons.calendar, 'green', '3 Dates', 'Court Hearings', 'This Month')}
            ${NyayaSahay.statCard(NyayaSahay.icons.integrity, 'green', integrityVal, 'Admissibility', 'Court Ready')}
            ${NyayaSahay.statCard(NyayaSahay.icons.reports, 'purple', '6 Briefs', 'Legal Reports', 'Export Ready')}
        `;
    } else if (roleKey === 'citizen') {
        statsContainer.innerHTML = `
            ${NyayaSahay.statCard(NyayaSahay.icons.cases, 'green', '1 FIR', 'My Complaints', 'FIR #2026/0892')}
            ${NyayaSahay.statCard(NyayaSahay.icons.documents, 'blue', totalDocsVal, 'Submitted Docs', 'Verified')}
            ${NyayaSahay.statCard(NyayaSahay.icons.clock, 'amber', 'Active', 'FIR Status', 'Connaught Place')}
            ${NyayaSahay.statCard(NyayaSahay.icons.check, 'green', integrityVal, 'Doc Integrity', 'Hash Match')}
            ${NyayaSahay.statCard(NyayaSahay.icons.calendar, 'slate', '18 Sep', 'Status Update', 'Officer Desk')}
            ${NyayaSahay.statCard(NyayaSahay.icons.info, 'blue', 'Helpdesk', 'Public Support', 'Free Access')}
        `;
    } else {
        // Admin
        statsContainer.innerHTML = `
            ${NyayaSahay.statCard(NyayaSahay.icons.cases, 'blue', activeCasesVal, 'System Cases', 'All Jurisdictions')}
            ${NyayaSahay.statCard(NyayaSahay.icons.documents, 'green', totalDocsVal, 'Secured Docs', 'Vault Active')}
            ${NyayaSahay.statCard(NyayaSahay.icons.users, 'purple', '8 Users', 'Active Users', 'Configured')}
            ${NyayaSahay.statCard(NyayaSahay.icons.alert, 'red', alertsVal, 'Hash Violation', 'Action Required')}
            ${NyayaSahay.statCard(NyayaSahay.icons.calendar, 'amber', '15 Sep', 'Next Hearing', 'Scheduled')}
            ${NyayaSahay.statCard(NyayaSahay.icons.integrity, 'green', integrityVal, 'Ledger Status', '100% Uptime')}
        `;
    }
}

function renderRecentCases() {
    const container = document.getElementById('recent-cases-table');
    if (!container) return;

    const user = MockData.currentUser;
    const roleKey = user.roleKey || 'police';

    let recentCases = MockData.cases;
    if (roleKey === 'citizen') {
        recentCases = MockData.cases.filter(c => c.id === 'CR-124/2026');
    } else {
        recentCases = MockData.cases.slice(0, 4);
    }

    const columns = [
        { key: 'id', label: 'Case / FIR ID' },
        { key: 'title', label: 'Title / Subject' },
        { key: 'type', label: 'Classification' },
        { key: 'status', label: 'Status' },
        { key: 'documents', label: 'Documents' },
        { key: 'lastUpdated', label: 'Last Activity' },
        { key: 'integrityStatus', label: 'Integrity' }
    ];

    const rows = recentCases.map(c => ({
        id: `<a href="case-details.html?id=${c.id}" class="cell-link" style="font-weight:700;">${c.id}</a>`,
        title: `<span style="font-weight:600; color:var(--text);">${c.title}</span>`,
        type: c.type,
        status: NyayaSahay.statusBadge(c.status),
        documents: `<span class="badge badge-neutral">${c.documents} files</span>`,
        lastUpdated: NyayaSahay.formatTimeAgo(c.lastUpdated),
        integrityStatus: NyayaSahay.integrityBadge(c.integrityStatus)
    }));

    container.innerHTML = NyayaSahay.buildTable(columns, rows, {
        onRowClick: (index) => {
            if (recentCases[index]) {
                window.location.href = `case-details.html?id=${recentCases[index].id}`;
            }
        }
    });
}

function renderRecentActivity() {
    const container = document.getElementById('recent-activity-timeline');
    if (!container) return;

    const recentActivity = MockData.auditTrail.slice(0, 5);

    let html = '';
    recentActivity.forEach(activity => {
        let dotColor = 'blue';
        if (activity.action.includes('Uploaded') || activity.action.includes('Verified')) dotColor = 'green';
        if (activity.action.includes('Flagged') || activity.status === 'warning') dotColor = 'amber';
        if (activity.action.includes('Violation') || activity.status === 'violation') dotColor = 'red';

        html += `
            <div class="timeline-item">
                <div class="timeline-dot" style="background-color: var(--color-${dotColor});"></div>
                <div class="timeline-content">
                    <div class="timeline-title"><strong>${activity.userName}</strong> ${activity.action} <strong>${activity.document || activity.caseId || ''}</strong></div>
                    <div class="timeline-meta">${NyayaSahay.formatTimeAgo(activity.timestamp)}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html || NyayaSahay.emptyState(NyayaSahay.icons.clock, 'No activity', 'No recent activity found.');
}

function renderCriticalDates() {
    const container = document.getElementById('critical-dates-list');
    if (!container) return;

    let dates = [];
    MockData.cases.forEach(c => {
        if (c.criticalDates && c.criticalDates.length > 0) {
            c.criticalDates.forEach(d => {
                dates.push({ ...d, caseId: c.id, caseTitle: c.title });
            });
        }
    });

    dates.sort((a, b) => new Date(a.date) - new Date(b.date));
    dates = dates.slice(0, 5);

    let html = '';
    dates.forEach(d => {
        const dateObj = new Date(d.date);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('default', { month: 'short' });

        html += `
            <div class="critical-date-item flex items-center gap-3 mb-4">
                <div class="badge badge-lg" style="flex-direction: column; padding: 8px;">
                    <span style="font-size: 1.2rem; font-weight: bold;">${day}</span>
                    <span style="font-size: 0.8rem; text-transform: uppercase;">${month}</span>
                </div>
                <div>
                    <div style="font-weight: 500;">${d.description}</div>
                    <div class="text-muted" style="font-size: 0.85rem;"><a href="case-details.html?id=${d.caseId}" class="cell-link">${d.caseId}</a> - ${d.caseTitle}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html || NyayaSahay.emptyState(NyayaSahay.icons.calendar, 'No critical dates', 'No upcoming critical dates.');
}

function renderIntegrityOverview() {
    const container = document.getElementById('integrity-summary');
    if (!container) return;

    container.innerHTML = `
        <div class="info-item p-4" style="background: var(--success-bg); border: 1px solid var(--success-light); border-radius: 8px; text-align: center;">
            <div style="font-size: 2.2rem; font-weight: 800; color: var(--success);">9</div>
            <div style="font-weight: 600; color: var(--success); font-size: 0.9rem;">✓ Verified Evidence</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">SHA-256 Hashes Match</div>
        </div>
        <div class="info-item p-4" style="background: var(--danger-bg); border: 1px solid var(--danger-light); border-radius: 8px; text-align: center;">
            <div style="font-size: 2.2rem; font-weight: 800; color: var(--danger);">1</div>
            <div style="font-weight: 600; color: var(--danger); font-size: 0.9rem;">⚠ Tampered Document</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;"><a href="integrity.html" style="color:var(--danger); font-weight:600; text-decoration:underline;">Inspect Violation &rarr;</a></div>
        </div>
    `;
}

function renderAIInsights() {
    const container = document.getElementById('ai-insights-list');
    if (!container) return;

    const processedDocs = MockData.documents.filter(d => d.aiStatus === 'completed').slice(0, 3);

    let html = '';
    processedDocs.forEach(doc => {
        const conf = doc.aiInsights?.confidence || 0.95;
        const confidenceHtml = NyayaSahay.confidenceBar(conf);

        html += `
            <div class="mb-3 p-3" style="border: 1px solid var(--border); border-radius: 8px; background: var(--surface); box-shadow: var(--shadow-xs);">
                <div class="flex justify-between items-center mb-1">
                    <a href="document-viewer.html?id=${doc.id}" style="font-weight: 600; color: var(--text);">${doc.fileName}</a>
                    ${NyayaSahay.aiStatusBadge(doc.aiStatus)}
                </div>
                <p class="text-muted mb-2" style="font-size: 0.825rem; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${doc.aiInsights?.summary || 'Document extracted and classified.'}
                </p>
                <div class="flex items-center justify-between text-xs text-muted">
                    <span>AI Confidence:</span>
                    <div style="width: 140px;">${confidenceHtml}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html || NyayaSahay.emptyState(NyayaSahay.icons.brain, 'No AI insights', 'No processed documents found.');
}
