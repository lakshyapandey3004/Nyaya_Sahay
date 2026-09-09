document.addEventListener('DOMContentLoaded', () => {
    NyayaSahay.initApp('ai-insights', 'AI Insights', [
        { label: 'Home', href: 'dashboard.html' },
        { label: 'AI Insights' }
    ]);

    const aiDocs = MockData.documents.filter(d => d.aiStatus === 'completed' && d.aiInsights);
    let totalEntities = 0;
    let totalDates = 0;
    let totalActions = 0;
    let entitiesByType = { Person: [], Vehicle: [], Location: [], Organization: [] };
    let allDates = [];
    let allActions = [];
    let docTypes = {};
    let confidenceStats = { High: 0, Medium: 0, Low: 0 };

    aiDocs.forEach(doc => {
        
        docTypes[doc.type] = (docTypes[doc.type] || 0) + 1;

        const confVal = doc.aiInsights.confidence !== undefined ? (doc.aiInsights.confidence <= 1 ? doc.aiInsights.confidence * 100 : doc.aiInsights.confidence) : (doc.aiInsights.confidenceScore || 92);
        if (confVal >= 90) confidenceStats.High++;
        else if (confVal >= 70) confidenceStats.Medium++;
        else confidenceStats.Low++;

        if (doc.aiInsights.entities) {
            doc.aiInsights.entities.forEach(ent => {
                totalEntities++;
                if (entitiesByType[ent.type]) {
                    
                    if (!entitiesByType[ent.type].find(e => e.value === ent.value)) {
                        entitiesByType[ent.type].push({ ...ent, docName: doc.fileName });
                    }
                }
            });
        }

        if (doc.aiInsights.dates) {
            doc.aiInsights.dates.forEach(d => {
                totalDates++;
                allDates.push({ ...d, docName: doc.fileName, docId: doc.id });
            });
        }

        if (doc.aiInsights.actionItems) {
            doc.aiInsights.actionItems.forEach(a => {
                totalActions++;
                allActions.push({ text: a, docName: doc.fileName, docId: doc.id, caseId: doc.caseId });
            });
        }
    });

    statsContainer.innerHTML = `
        ${NyayaSahay.statCard(NyayaSahay.icons.sparkles, 'purple', aiDocs.length, 'Documents Processed', 'Auto-Indexed')}
        ${NyayaSahay.statCard(NyayaSahay.icons.users, 'blue', totalEntities, 'Entities Extracted', 'Persons & Orgs')}
        ${NyayaSahay.statCard(NyayaSahay.icons.calendar, 'amber', totalDates, 'Dates Identified', 'Court & Police')}
        ${NyayaSahay.statCard(NyayaSahay.icons.check, 'green', totalActions, 'Actions Detected', 'Deadlines & Tasks')}
    `;

    const classificationChart = document.getElementById('classification-chart');
    let chartHtml = '<div class="flex flex-col gap-3">';
    const maxTypeCount = Math.max(...Object.values(docTypes), 1);
    
    for (const [type, count] of Object.entries(docTypes)) {
        const pct = (count / maxTypeCount) * 100;
        chartHtml += `
            <div class="flex items-center gap-3">
                <div class="w-24 text-sm font-medium truncate">${type}</div>
                <div class="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div class="bg-purple-500 h-full rounded-full" style="width: ${pct}%"></div>
                </div>
                <div class="w-8 text-right text-sm text-muted">${count}</div>
            </div>
        `;
    }
    chartHtml += '</div>';
    classificationChart.innerHTML = chartHtml || '<div class="text-muted text-sm">No classification data</div>';

    const confChart = document.getElementById('confidence-chart');
    const totalConf = confidenceStats.High + confidenceStats.Medium + confidenceStats.Low || 1;
    confChart.innerHTML = `
        <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3">
                <div class="w-20 text-sm font-medium">High (&ge;90%)</div>
                <div class="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div class="bg-green-500 h-full rounded-full" style="width: ${(confidenceStats.High/totalConf)*100}%"></div>
                </div>
                <div class="w-8 text-right text-sm text-muted">${confidenceStats.High}</div>
            </div>
            <div class="flex items-center gap-3">
                <div class="w-20 text-sm font-medium">Medium</div>
                <div class="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div class="bg-yellow-500 h-full rounded-full" style="width: ${(confidenceStats.Medium/totalConf)*100}%"></div>
                </div>
                <div class="w-8 text-right text-sm text-muted">${confidenceStats.Medium}</div>
            </div>
            <div class="flex items-center gap-3">
                <div class="w-20 text-sm font-medium">Low (&lt;70%)</div>
                <div class="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div class="bg-red-500 h-full rounded-full" style="width: ${(confidenceStats.Low/totalConf)*100}%"></div>
                </div>
                <div class="w-8 text-right text-sm text-muted">${confidenceStats.Low}</div>
            </div>
        </div>
    `;

    const entitiesContainer = document.getElementById('entities-container');
    let entHtml = '<div class="flex flex-col gap-4">';
    for (const [type, entities] of Object.entries(entitiesByType)) {
        if (entities.length > 0) {
            entHtml += `
                <div>
                    <div class="text-sm text-muted mb-2 uppercase tracking-wide font-medium">${type} (${entities.length})</div>
                    <div class="flex flex-wrap gap-2">
                        ${entities.map(e => NyayaSahay.entityTag(e)).join('')}
                    </div>
                </div>
            `;
        }
    }
    entHtml += '</div>';
    entitiesContainer.innerHTML = entHtml || '<div class="text-muted text-sm">No entities found</div>';

    const datesContainer = document.getElementById('dates-container');
    allDates.sort((a, b) => new Date(a.date) - new Date(b.date));
    let datesHtml = '';
    allDates.forEach(d => {
        datesHtml += `
            <div class="timeline-item pb-4 relative pl-6 border-l border-gray-200 ml-3">
                <div class="absolute w-3 h-3 bg-amber-500 rounded-full -left-1.5 top-1 border-2 border-white"></div>
                <div class="text-sm font-medium text-gray-900">${d.date}</div>
                <div class="text-sm text-gray-700 mt-1">${d.context}</div>
                <div class="text-xs text-muted mt-1">Source: <a href="document-viewer.html?id=${d.docId}" class="text-primary hover:underline">${d.docName}</a></div>
            </div>
        `;
    });
    datesContainer.innerHTML = datesHtml || '<div class="text-muted text-sm">No dates found</div>';

    const actionsContainer = document.getElementById('actions-container');
    let actionsHtml = '<ul class="divide-y divide-gray-100">';
    allActions.forEach(a => {
        actionsHtml += `
            <li class="p-4 hover:bg-gray-50 flex items-start gap-3">
                <div class="mt-0.5 text-green-500">${NyayaSahay.icons.check}</div>
                <div>
                    <div class="text-sm text-gray-900">${a.text}</div>
                    <div class="text-xs text-muted mt-1">Source: <a href="document-viewer.html?id=${a.docId}" class="text-primary hover:underline">${a.docName}</a></div>
                </div>
            </li>
        `;
    });
    actionsHtml += '</ul>';
    actionsContainer.innerHTML = actionsHtml || '<div class="p-4 text-muted text-sm">No actions found</div>';

    const tableContainer = document.getElementById('recently-processed-container');
    
    const rows = aiDocs.slice(0, 5).map(doc => {
        const caseObj = MockData.getCase(doc.caseId);
        return {
            docName: `<a href="document-viewer.html?id=${doc.id}" class="font-medium text-primary hover:underline">${doc.fileName}</a>`,
            type: `<span class="badge badge-neutral">${doc.type}</span>`,
            case: caseObj ? caseObj.title : doc.caseId,
            conf: NyayaSahay.confidenceBar(doc.aiInsights.confidenceScore),
            date: NyayaSahay.formatDate(doc.uploadDate) 
        };
    });

    const cols = [
        { key: 'docName', label: 'Document' },
        { key: 'type', label: 'Type' },
        { key: 'case', label: 'Case' },
        { key: 'conf', label: 'Confidence' },
        { key: 'date', label: 'Date' }
    ];

    if (rows.length > 0) {
        tableContainer.innerHTML = NyayaSahay.buildTable(cols, rows, { className: 'data-table w-full text-sm' });
    } else {
        tableContainer.innerHTML = '<div class="p-4 text-muted text-sm">No documents processed yet.</div>';
    }
});
