document.addEventListener('DOMContentLoaded', () => {
    let caseId = NyayaSahay.getUrlParam('id');
    
    if (!caseId && MockData.cases.length > 0) {
        caseId = MockData.cases[0].id;
    }

    const caseData = MockData.getCase(caseId);

    if (!caseData) {
        document.getElementById('case-tabs')?.classList.add('hidden');
        document.querySelector('.page-header')?.classList.add('hidden');
        document.getElementById('error-state').classList.remove('hidden');
        document.getElementById('error-state').innerHTML = NyayaSahay.emptyState(
            NyayaSahay.icons.alert,
            'Case Not Found',
            `Could not find case with ID ${caseId}`,
            '<a href="cases.html" class="btn btn-primary">Back to Cases</a>'
        );
        return;
    }

    NyayaSahay.initApp('cases', caseData.title, [
        { label: 'Home', href: 'dashboard.html' },
        { label: 'Cases', href: 'cases.html' },
        { label: caseData.title }
    ]);

    NyayaSahay.initTabs('.tabs-container');

    document.getElementById('case-header-info').innerHTML = `
        <h2 class="mb-0 m-0">${caseData.title}</h2>
        <span class="badge badge-neutral bg-gray-200 px-2 py-1 rounded text-sm">${caseData.id}</span>
        ${NyayaSahay.statusBadge(caseData.status)}
    `;
    
    const btnAddDocIcon = document.querySelector('#btn-add-doc .icon');
    if (btnAddDocIcon) btnAddDocIcon.innerHTML = NyayaSahay.icons.plus;

    const btnTrackPipeline = document.getElementById('btn-track-pipeline');
    if (btnTrackPipeline) {
        btnTrackPipeline.addEventListener('click', () => {
            window.location.href = `tracking-pipeline.html?id=${caseId}`;
        });
    }

    document.getElementById('case-info-grid').innerHTML = `
        <div class="info-item mb-2">
            <div class="text-muted text-sm mb-1">Case ID</div>
            <strong>${caseData.id}</strong>
        </div>
        <div class="info-item mb-2">
            <div class="text-muted text-sm mb-1">Case Type</div>
            <strong>${caseData.type}</strong>
        </div>
        <div class="info-item mb-2">
            <div class="text-muted text-sm mb-1">Status</div>
            <div>${NyayaSahay.statusBadge(caseData.status)}</div>
        </div>
        <div class="info-item mb-2">
            <div class="text-muted text-sm mb-1">Last Updated</div>
            <strong>${NyayaSahay.formatDate(caseData.lastUpdated)}</strong>
        </div>
        <div class="info-item mb-2">
            <div class="text-muted text-sm mb-1">Documents</div>
            <strong>${caseData.documents.length}</strong>
        </div>
        <div class="info-item mb-2">
            <div class="text-muted text-sm mb-1">Users</div>
            <strong>${caseData.users.length}</strong>
        </div>
        <div class="info-item mb-2">
            <div class="text-muted text-sm mb-1">Integrity</div>
            <div>${NyayaSahay.integrityBadge(caseData.integrityStatus)}</div>
        </div>
    `;

    document.getElementById('case-description').innerHTML = `<p class="m-0">${caseData.description || 'No description provided.'}</p>`;

    const assignedUsersHtml = caseData.assignedUsers ? caseData.assignedUsers.map(userId => {
        const user = MockData.getUser(userId);
        if (!user) return '';
        return `
            <div class="flex items-center gap-3 mb-3 pb-3 border-b last:border-0 last:mb-0 last:pb-0">
                <div class="avatar bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center font-medium">
                    ${user.initials}
                </div>
                <div class="flex-1">
                    <div class="font-medium">${user.name}</div>
                    <div class="text-muted text-sm">${user.email}</div>
                </div>
                <div>${NyayaSahay.roleBadge(user.role)}</div>
            </div>
        `;
    }).join('') : '<p class="text-muted">No users assigned.</p>';
    document.getElementById('case-users').innerHTML = assignedUsersHtml;

    const criticalDatesHtml = caseData.criticalDates ? caseData.criticalDates.map(d => `
        <div class="critical-date-item flex gap-3 mb-3 pb-3 border-b last:border-0 last:mb-0 last:pb-0">
            <div class="text-danger flex items-center justify-center w-8">${NyayaSahay.icons.calendar}</div>
            <div>
                <div class="font-medium">${d.title}</div>
                <div class="text-muted text-sm">${NyayaSahay.formatDate(d.date)}</div>
            </div>
        </div>
    `).join('') : '<p class="text-muted">No critical dates found.</p>';
    document.getElementById('case-dates').innerHTML = criticalDatesHtml;

    const docs = MockData.getDocumentsForCase(caseId);
    if (docs.length === 0) {
        document.getElementById('documents-table').innerHTML = NyayaSahay.emptyState(
            NyayaSahay.icons.file,
            'No Documents',
            'This case currently has no documents attached.'
        );
    } else {
        const columns = [
            { key: 'fileName', label: 'File Name' },
            { key: 'type', label: 'Type' },
            { key: 'uploadedBy', label: 'Uploaded By' },
            { key: 'date', label: 'Date' },
            { key: 'version', label: 'Version' },
            { key: 'integrity', label: 'Integrity' },
            { key: 'ai', label: 'AI Status' }
        ];

        const rows = docs.map(d => ({
            fileName: { value: d.fileName, className: 'cell-link', href: `document-viewer.html?id=${d.id}` },
            type: { value: d.type },
            uploadedBy: { value: d.uploadedByName || d.uploadedBy },
            date: { value: NyayaSahay.formatDate(d.uploadDate) },
            version: { value: d.version },
            integrity: { value: NyayaSahay.integrityBadge(d.integrityStatus), isHtml: true },
            ai: { value: NyayaSahay.aiStatusBadge(d.aiStatus), isHtml: true }
        }));

        document.getElementById('documents-table').innerHTML = NyayaSahay.buildTable(columns, rows);
    }

    const aiDocs = docs.filter(d => d.aiInsights);
    if (aiDocs.length === 0) {
        document.getElementById('ai-insights-container').innerHTML = `
            <div style="grid-column: 1 / -1">
                ${NyayaSahay.emptyState(NyayaSahay.icons.aiInsights || NyayaSahay.icons.brain, 'No AI Insights', 'No documents with AI insights found for this case.')}
            </div>
        `;
    } else {
        const aiHtml = aiDocs.map(d => {
            const insights = d.aiInsights;
            const entitiesHtml = insights.entities ? insights.entities.map(e => NyayaSahay.entityTag(e)).join(' ') : '';
            const summaryHtml = insights.summary ? `<div class="ai-summary-box mb-3 p-3 bg-gray-50 border rounded text-sm">${insights.summary}</div>` : '';
            const confBar = insights.confidence ? NyayaSahay.confidenceBar(insights.confidence) : '';
            
            return `
                <div class="ai-card border rounded p-4">
                    <div class="ai-card-header flex justify-between items-center pb-2 mb-3 border-b">
                        <div class="font-medium">${d.fileName}</div>
                        ${NyayaSahay.aiStatusBadge(d.aiStatus)}
                    </div>
                    <div class="ai-card-body">
                        ${summaryHtml}
                        <div class="mb-3">
                            <div class="text-muted mb-1 text-sm">Extracted Entities:</div>
                            <div class="flex flex-wrap gap-2">${entitiesHtml}</div>
                        </div>
                        <div class="mb-3">
                            <div class="text-muted mb-1 text-sm">AI Confidence:</div>
                            ${confBar}
                        </div>
                        <div class="ai-disclaimer flex gap-2 text-muted items-center text-xs bg-gray-50 p-2 rounded">
                            <span class="w-4 h-4 flex items-center justify-center">${NyayaSahay.icons.info || ''}</span> AI-generated insights. Verify for accuracy.
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        document.getElementById('ai-insights-container').innerHTML = aiHtml;
    }

    const auditEntries = MockData.getAuditForCase(caseId);
    if (auditEntries.length === 0) {
        document.getElementById('case-timeline').innerHTML = NyayaSahay.emptyState(
            NyayaSahay.icons.clock || NyayaSahay.icons.history,
            'No Activity',
            'No recent activity found for this case.'
        );
    } else {
        const timelineHtml = auditEntries.map((entry, idx) => {
            let dotColor = '#3b82f6'; 
            if (entry.status === 'success') dotColor = '#22c55e'; 
            if (entry.status === 'warning') dotColor = '#f59e0b'; 
            if (entry.status === 'error' || entry.status === 'violation') dotColor = '#ef4444'; 

            return `
                <div class="timeline-item flex gap-4 mb-4 relative">
                    <div class="timeline-dot absolute w-3 h-3 rounded-full z-10" style="background:${dotColor}; left:4px; top:6px;"></div>
                    ${idx < auditEntries.length - 1 ? `<div class="timeline-line absolute w-0.5 bg-gray-200" style="left:9px; top:18px; bottom:-16px;"></div>` : ''}
                    <div class="pl-8 w-full pb-2">
                        <div class="flex justify-between items-start">
                            <div>
                                <span class="font-medium">${entry.userName}</span>
                                <span class="text-muted mx-1">${entry.action}</span>
                                ${entry.document ? `<span class="font-medium">${entry.document}</span>` : ''}
                            </div>
                            <span class="text-muted text-sm whitespace-nowrap ml-4">${NyayaSahay.formatTimeAgo(entry.timestamp)}</span>
                        </div>
                        ${entry.status === 'violation' ? `<div class="text-danger mt-1 text-sm">Integrity Violation Detected!</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        document.getElementById('case-timeline').innerHTML = `<div class="pl-2">${timelineHtml}</div>`;
    }
});
