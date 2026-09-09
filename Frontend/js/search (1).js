document.addEventListener('DOMContentLoaded', () => {
    NyayaSahay.initApp('search', 'Smart Search', [
        { label: 'Home', href: 'dashboard.html' },
        { label: 'Search' }
    ]);

    const searchInput = document.getElementById('main-search-input');
    const searchBtn = document.getElementById('search-btn');
    const btnKeyword = document.getElementById('btn-keyword-mode');
    const btnSemantic = document.getElementById('btn-semantic-mode');
    const aiModeHint = document.getElementById('ai-mode-hint');
    const resultsContainer = document.getElementById('search-results-container');
    const resultsCount = document.getElementById('results-count');
    const filterCase = document.getElementById('filter-case');

    let isSemanticMode = true;

    if (MockData.cases) {
        MockData.cases.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.title;
            filterCase.appendChild(opt);
        });
    }

    const updateModeUI = () => {
        if (isSemanticMode) {
            btnSemantic.classList.add('active', 'ai-mode');
            btnKeyword.classList.remove('active', 'ai-mode');
            aiModeHint.classList.remove('hidden');
        } else {
            btnKeyword.classList.add('active');
            btnSemantic.classList.remove('active', 'ai-mode');
            aiModeHint.classList.add('hidden');
        }
    };

    btnKeyword.addEventListener('click', () => {
        isSemanticMode = false;
        updateModeUI();
    });

    btnSemantic.addEventListener('click', () => {
        isSemanticMode = true;
        updateModeUI();
    });

    updateModeUI();

    const q = NyayaSahay.getUrlParam('q');
    if (q) {
        searchInput.value = q;
        performSearch(q);
    } else {
        searchInput.value = 'forged property documents Rajesh Kumar';
        performSearch(searchInput.value);
    }

    searchBtn.addEventListener('click', () => performSearch(searchInput.value));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch(searchInput.value);
    });

    async function performSearch(query) {
        if (!query.trim()) return;
        
        resultsContainer.innerHTML = NyayaSahay.loadingState('Searching case documents and forensic evidence...');
        resultsCount.textContent = 'Searching...';

        const selectedCase = filterCase ? filterCase.value : '';
        const apiResults = await ApiClient.search(query, selectedCase);

        if (apiResults && Array.isArray(apiResults)) {
            renderResults(apiResults);
            return;
        }

        // Fallback to local filtering if backend offline
        setTimeout(() => {
            const lowerQ = query.toLowerCase();
            let results = [];

            if (MockData.searchResults) {
                 results = MockData.searchResults.filter(r => 
                    r.snippet.toLowerCase().includes(lowerQ) || 
                    MockData.getDocument(r.documentId)?.fileName.toLowerCase().includes(lowerQ) ||
                    MockData.getDocument(r.documentId)?.description?.toLowerCase().includes(lowerQ)
                );
            }

            if(results.length < 2) {
                MockData.documents.forEach(doc => {
                    if (doc.fileName.toLowerCase().includes(lowerQ) || 
                        doc.description?.toLowerCase().includes(lowerQ) ||
                        doc.tags?.some(t => t.toLowerCase().includes(lowerQ))) {
                        
                        if(!results.find(r => r.documentId === doc.id)) {
                             results.push({
                                documentId: doc.id,
                                fileName: doc.fileName,
                                type: doc.type,
                                caseId: doc.caseId,
                                uploadDate: doc.uploadDate,
                                integrityStatus: doc.integrityStatus,
                                relevance: 75 + Math.floor(Math.random() * 20),
                                snippet: `...match found in document metadata or description matching query...`,
                                matchType: 'Metadata'
                            });
                        }
                    }
                });
            }

            renderResults(results);
        }, 500);
    }

    function renderResults(results) {
        if (results.length === 0) {
            resultsContainer.innerHTML = NyayaSahay.emptyState(NyayaSahay.icons.search, 'No Results Found', 'Try adjusting your search terms or filters.');
            resultsCount.textContent = 'Search Results (0)';
            return;
        }

        resultsCount.textContent = `Search Results (${results.length})`;
        resultsContainer.innerHTML = '';

        results.sort((a,b) => b.relevance - a.relevance).forEach(result => {
            const doc = MockData.getDocument(result.documentId) || {
                id: result.documentId || result.id,
                fileName: result.fileName,
                type: result.documentType || result.type || 'Legal Document',
                caseId: result.caseId || 'CR-124/2026',
                uploadDate: result.uploadDate || new Date().toISOString(),
                integrityStatus: result.integrityStatus || 'verified',
                aiStatus: result.aiStatus || 'completed'
            };

            const scoreClass = result.relevance > 90 ? 'text-success' : (result.relevance > 70 ? 'text-warning' : 'text-muted');

            const item = document.createElement('div');
            item.className = 'card search-result-item p-4 mb-3 flex gap-4';
            item.innerHTML = `
                <div class="search-result-icon pt-1 text-primary">
                    ${NyayaSahay.icons.file}
                </div>
                <div class="search-result-content flex-1">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <a href="document-viewer.html?id=${doc.id}" class="text-lg font-medium text-primary hover:underline">${doc.fileName || result.fileName}</a>
                            <div class="search-result-meta flex items-center gap-2 text-sm text-muted mt-1">
                                <span class="badge badge-neutral">${doc.type}</span>
                                <span>&bull;</span>
                                <span>Case: <a href="#" class="text-primary hover:underline">${doc.caseId}</a></span>
                                <span>&bull;</span>
                                <span>Uploaded: ${NyayaSahay.formatDate(doc.uploadDate)}</span>
                                <span>&bull;</span>
                                ${NyayaSahay.integrityBadge(doc.integrityStatus)}
                            </div>
                        </div>
                        <div class="search-result-score text-center">
                            <div class="text-2xl font-bold ${scoreClass}">${result.relevance}%</div>
                            <div class="text-xs text-muted">Relevance</div>
                        </div>
                    </div>
                    <div class="search-result-snippet text-sm bg-gray-50 p-3 rounded border border-gray-100 mt-2">
                        ${result.snippet ? result.snippet.replace(/<mark>/g, '<mark class="bg-yellow-200 px-1 rounded">') : 'Document content matched search criteria.'}
                    </div>
                    <div class="mt-2 text-xs text-muted flex gap-2">
                        <span class="badge badge-neutral bg-gray-100">Match: ${result.matchType || 'Full Text Search'}</span>
                        <span class="badge badge-ai"><span class="ai-dot"></span> AI Processed</span>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(item);
        });
    }
});
