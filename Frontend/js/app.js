const NyayaSahay = {

  icons: {
    dashboard: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    cases: '<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>',
    documents: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    aiInsights: '<svg viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>',
    permissions: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    integrity: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9,12 11,14 15,10"/></svg>',
    auditTrail: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>',
    reports: '<svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
    logout: '<svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    bell: '<svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>',
    searchSmall: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    close: '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    check: '<svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>',
    alert: '<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    upload: '<svg viewBox="0 0 24 24"><polyline points="16,16 12,12 8,16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>',
    eye: '<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff: '<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    user: '<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    users: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
    file: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>',
    calendar: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    filter: '<svg viewBox="0 0 24 24"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/></svg>',
    download: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
    edit: '<svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    brain: '<svg viewBox="0 0 24 24"><path d="M12 2a4 4 0 014 4 4 4 0 012 3.46 4 4 0 01-1 7.54v1a4 4 0 01-8 0V17a4 4 0 01-1-7.54A4 4 0 0112 2z"/></svg>',
    sparkles: '<svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24"><polyline points="6,9 12,15 18,9"/></svg>',
    externalLink: '<svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>',
    hash: '<svg viewBox="0 0 24 24"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>',
    vault: '<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/><circle cx="12" cy="16" r="1.5"/></svg>',
    printer: '<svg viewBox="0 0 24 24"><polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  },

  lang: localStorage.getItem('nyaya_lang') || 'en',

  translations: {
    en: {
      dashboard: "Dashboard",
      cases: "Cases",
      myCases: "My Cases / FIRs",
      trackingPipeline: "Case Tracking Pipeline",
      uploadDocument: "Upload Document",
      submitGrievance: "Submit Grievance / Document",
      documents: "Documents",
      lawyerVault: "Advocate Case Vault",
      search: "Search",
      aiInsights: "AI Insights",
      permissions: "User Permissions",
      integrityCheck: "Integrity Check",
      auditTrail: "Audit Trail",
      reports: "Legal Reports",
      settings: "Settings",
      logout: "Logout",
      profile: "Profile",
      security: "Security",
      notifications: "Notifications",
      sessions: "Sessions",
      saveChanges: "Save Changes",
      profileUpdated: "Profile updated and saved successfully",
      langChanged: "Language set to English"
    },
    hi: {
      dashboard: "डैशबोर्ड",
      cases: "केस सूची",
      myCases: "मेरे केस / एफआईआर",
      trackingPipeline: "केस ट्रैकिंग पाइपलाइन",
      uploadDocument: "दस्तावेज़ अपलोड करें",
      submitGrievance: "शिकायत / दस्तावेज़ जमा करें",
      documents: "दस्तावेज़",
      lawyerVault: "अधिवक्ता केस वॉल्ट",
      search: "खोजें",
      aiInsights: "एआई अंतर्दृष्टि",
      permissions: "उपयोगकर्ता अनुमतियां",
      integrityCheck: "सत्यनिष्ठा जांच",
      auditTrail: "ऑडिट ट्रेल",
      reports: "कानूनी रिपोर्ट",
      settings: "सेटिंग्स",
      logout: "लॉगआउट",
      profile: "प्रोफ़ाइल",
      security: "सुरक्षा",
      notifications: "सूचनाएं",
      sessions: "सत्र",
      saveChanges: "बदलाव सहेजें",
      profileUpdated: "प्रोफ़ाइल सफलतापूर्वक अपडेट और सहेजी गई",
      langChanged: "भाषा बदलकर हिन्दी कर दी गई है"
    }
  },

  syncUserSession() {
    const roleName = localStorage.getItem('nyaya_role') || sessionStorage.getItem('nyaya_role') || 'Police Officer';
    const name = localStorage.getItem('nyaya_fullname') || sessionStorage.getItem('nyaya_fullname') || 'Inspector R. Sharma';
    const email = localStorage.getItem('nyaya_user') || sessionStorage.getItem('nyaya_user') || 'police.officer@nyayasahay.gov.in';
    const bio = localStorage.getItem('nyaya_bio') || sessionStorage.getItem('nyaya_bio') || '';
    const deptStored = localStorage.getItem('nyaya_dept') || sessionStorage.getItem('nyaya_dept');

    let roleKey = 'police';
    const lowerRole = roleName.toLowerCase();
    if (lowerRole.includes('legal') || lowerRole.includes('judicial')) roleKey = 'legal';
    else if (lowerRole.includes('citizen') || lowerRole.includes('public')) roleKey = 'citizen';
    else if (lowerRole.includes('admin')) roleKey = 'admin';

    let dept = deptStored || 'State Police Investigation Cell';
    if (!deptStored) {
      if (roleKey === 'legal') dept = 'High Court Judicial Review Cell';
      else if (roleKey === 'citizen') dept = 'Public Citizen Services';
      else if (roleKey === 'admin') dept = 'Ministry of Law & Justice Admin';
    }

    const initials = name.split(' ').filter(n => n.length > 0).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'US';

    MockData.currentUser = {
      id: roleKey === 'admin' ? 'USR-ADMIN' : roleKey === 'legal' ? 'USR-LEGAL' : roleKey === 'citizen' ? 'USR-CITIZEN' : 'USR-POLICE',
      name: name,
      email: email,
      role: roleName,
      roleKey: roleKey,
      initials: initials,
      department: dept,
      bio: bio,
      avatar: null
    };
  },

  saveUserProfile(profileData) {
    if (profileData.name) {
      localStorage.setItem('nyaya_fullname', profileData.name);
      sessionStorage.setItem('nyaya_fullname', profileData.name);
    }
    if (profileData.email) {
      localStorage.setItem('nyaya_user', profileData.email);
      sessionStorage.setItem('nyaya_user', profileData.email);
    }
    if (profileData.department) {
      localStorage.setItem('nyaya_dept', profileData.department);
      sessionStorage.setItem('nyaya_dept', profileData.department);
    }
    if (profileData.bio !== undefined) {
      localStorage.setItem('nyaya_bio', profileData.bio);
      sessionStorage.setItem('nyaya_bio', profileData.bio);
    }

    this.syncUserSession();

    const activePage = document.querySelector('.nav-item.active')?.dataset.page || 'dashboard';
    const pageTitle = document.querySelector('.header-title')?.textContent || 'Dashboard';
    this.renderSidebar(activePage);
    this.renderHeader(pageTitle);
    this.renderGovTopBar();
    this.applyLanguage();
  },

  setLanguage(lang) {
    this.lang = lang;
    localStorage.setItem('nyaya_lang', lang);
    this.renderGovTopBar();
    this.applyLanguage();
    const msg = this.translations[lang] ? this.translations[lang].langChanged : 'Language updated';
    this.showToast(msg, 'info');
  },

  applyLanguage() {
    const lang = this.lang || 'en';
    const t = this.translations[lang] || this.translations.en;

    document.querySelectorAll('.nav-item').forEach(item => {
      const page = item.dataset.page;
      const labelEl = item.querySelector('.nav-label');
      if (labelEl && page && t[page]) {
        labelEl.textContent = t[page];
      } else if (labelEl && item.classList.contains('logout-item')) {
        labelEl.textContent = t.logout;
      }
    });

    const enBtn = document.getElementById('lang-btn-en');
    const hiBtn = document.getElementById('lang-btn-hi');
    if (enBtn && hiBtn) {
      enBtn.className = `lang-opt ${lang === 'en' ? 'active' : ''}`;
      hiBtn.className = `lang-opt ${lang === 'hi' ? 'active' : ''}`;
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });
  },

  generateNyayaToken(email, role, sessionTime) {
    if (!email || !role || !sessionTime) return '';
    const secret = 'NYAYA_SAHAY_ENCRYPTED_AUTH_KEY_2026_v2';
    const raw = `${email.trim().toLowerCase()}||${role.trim()}||${sessionTime}||${secret}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `NYAYA-SEC-${hex.toUpperCase()}-${btoa(email).slice(0, 6)}`;
  },

  verifyNyayaToken(email, role, sessionTime, token) {
    if (!email || !role || !sessionTime || !token) return false;
    return this.generateNyayaToken(email, role, sessionTime) === token;
  },

  getAllowedPagesForRole(roleKey) {
    const rolePagesMap = {
      'police': ['dashboard', 'cases', 'tracking-pipeline', 'upload', 'documents', 'lawyer-vault', 'search', 'ai-insights', 'integrity', 'audit-trail', 'settings'],
      'legal': ['dashboard', 'cases', 'tracking-pipeline', 'upload', 'documents', 'lawyer-vault', 'search', 'ai-insights', 'integrity', 'audit-trail', 'reports', 'settings'],
      'citizen': ['dashboard', 'cases', 'tracking-pipeline', 'upload', 'search', 'integrity'],
      'admin': ['dashboard', 'cases', 'tracking-pipeline', 'upload', 'documents', 'lawyer-vault', 'search', 'ai-insights', 'permissions', 'integrity', 'audit-trail', 'reports', 'settings']
    };
    return rolePagesMap[roleKey] || rolePagesMap['police'];
  },

  checkUrlToastAlerts() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('active_session') === 'true') {
      setTimeout(() => {
        this.showToast('🛡 Active Session: Direct URL navigation back to login page was blocked. Click Logout to exit.', 'info', 5000);
      }, 500);
    } else if (urlParams.get('denied') === 'true') {
      setTimeout(() => {
        this.showToast('⚠️ Access Denied: Direct URL navigation to that page is restricted for your role.', 'warning', 5000);
      }, 500);
    }
  },

  initApp(activePage, pageTitle, breadcrumbs) {
    if (activePage !== 'login') {
      const isAuth = sessionStorage.getItem('nyaya_auth') === 'true';
      const user = sessionStorage.getItem('nyaya_user');
      const role = sessionStorage.getItem('nyaya_role');
      const token = sessionStorage.getItem('nyaya_session_token');
      const sessionTime = sessionStorage.getItem('nyaya_session_time');

      // 1. Verify Encrypted Session Signature & Auth State
      const isValid = isAuth && token && this.verifyNyayaToken(user, role, sessionTime, token);

      if (!isValid) {
        // Clear invalid / unauthenticated session state
        sessionStorage.clear();
        // Block direct URL navigation & redirect immediately to login page
        window.location.href = 'index.html?unauthorized=true';
        return;
      }

      this.syncUserSession();

      // 2. Role Access & Route Guard for direct URL typing
      const userRoleKey = MockData.currentUser ? MockData.currentUser.roleKey : 'police';
      const allowedPages = this.getAllowedPagesForRole(userRoleKey);

      if (!allowedPages.includes(activePage)) {
        window.location.href = 'dashboard.html?denied=true';
        return;
      }

      this.renderGovTopBar();
      this.renderSidebar(activePage);
      this.renderHeader(pageTitle, breadcrumbs);

      this.checkUrlToastAlerts();
    }
  },

  renderGovTopBar() {
    if (!document.getElementById('gov-tricolor-line')) {
      const tricolor = document.createElement('div');
      tricolor.id = 'gov-tricolor-line';
      tricolor.className = 'gov-tricolor-line';
      document.body.prepend(tricolor);
    }

    const mainContent = document.getElementById('main-content');
    let topbar = document.getElementById('gov-topbar');

    if (mainContent && !topbar) {
      topbar = document.createElement('div');
      topbar.id = 'gov-topbar';
      topbar.className = 'gov-topbar';
      mainContent.prepend(topbar);
    }

    if (topbar) {
      const user = MockData.currentUser;
      const lang = this.lang || 'en';
      
      let portalBadge = '🛡 RESTRICTED INVESTIGATION PORTAL';
      if (user.roleKey === 'legal') portalBadge = '⚖ JUDICIAL & LEGAL REVIEW PORTAL';
      else if (user.roleKey === 'citizen') portalBadge = '👤 CITIZEN PUBLIC SERVICES PORTAL';
      else if (user.roleKey === 'admin') portalBadge = '🛡 CENTRAL SYSTEM ADMIN PORTAL';

      topbar.innerHTML = `
        <div class="gov-topbar-left">
          <span class="gov-emblem">⚖</span>
          <span class="gov-title-hindi">भारत सरकार</span>
          <span class="gov-title-en">| Government of India &bull; विधि और न्याय मंत्रालय (Ministry of Law & Justice)</span>
        </div>
        <div class="gov-topbar-right">
          <span class="gov-badge-security">${portalBadge}</span>
          <span class="gov-lang-switch">
            <span id="lang-btn-en" class="lang-opt ${lang === 'en' ? 'active' : ''}" onclick="NyayaSahay.setLanguage('en')">English</span>
            <span style="color:#64748b;">|</span>
            <span id="lang-btn-hi" class="lang-opt ${lang === 'hi' ? 'active' : ''}" onclick="NyayaSahay.setLanguage('hi')">हिन्दी</span>
          </span>
          <span style="color:#64748b;">|</span>
          <span style="font-size:0.7rem; color:#94a3b8;">NIC-CERT Verified &bull; STQC Audited</span>
        </div>
      `;
    }
  },

  renderSidebar(activePage) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const user = MockData.currentUser;
    const roleKey = user.roleKey;

    const allNavItems = [
      { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: this.icons.dashboard, roles: ['police', 'legal', 'citizen', 'admin'] },
      { id: 'cases', label: roleKey === 'citizen' ? 'My Cases / FIRs' : 'Cases', href: 'cases.html', icon: this.icons.cases, roles: ['police', 'legal', 'citizen', 'admin'] },
      { id: 'tracking-pipeline', label: 'Case Tracking Pipeline', href: 'tracking-pipeline.html', icon: this.icons.clock, roles: ['police', 'legal', 'citizen', 'admin'] },
      { id: 'upload', label: roleKey === 'citizen' ? 'Submit Grievance / Document' : 'Upload Document', href: 'upload.html', icon: this.icons.upload, roles: ['police', 'legal', 'citizen', 'admin'] },
      { id: 'documents', label: 'Documents', href: 'documents.html', icon: this.icons.documents, roles: ['police', 'legal', 'admin'] },
      { id: 'lawyer-vault', label: 'Advocate Case Vault', href: 'lawyer-vault.html', icon: this.icons.vault, roles: ['legal', 'admin', 'police'] },
      { id: 'search', label: 'Search', href: 'search.html', icon: this.icons.search, roles: ['police', 'legal', 'citizen', 'admin'] },
      { id: 'ai-insights', label: 'AI Insights', href: 'ai-insights.html', icon: this.icons.aiInsights, roles: ['police', 'legal', 'admin'] },
      { id: 'permissions', label: 'User Permissions', href: 'permissions.html', icon: this.icons.permissions, roles: ['admin'] },
      { id: 'integrity', label: 'Integrity Check', href: 'integrity.html', icon: this.icons.integrity, roles: ['police', 'legal', 'citizen', 'admin'] },
      { id: 'audit-trail', label: 'Audit Trail', href: 'audit-trail.html', icon: this.icons.auditTrail, roles: ['police', 'legal', 'admin'] },
      { id: 'reports', label: 'Legal Reports', href: 'reports.html', icon: this.icons.reports, roles: ['legal', 'admin'] },
      { id: 'settings', label: 'Settings', href: 'settings.html', icon: this.icons.settings, roles: ['police', 'legal', 'admin'] },
    ];

    const navItems = allNavItems.filter(item => item.roles.includes(roleKey));

    sidebar.className = 'sidebar';
    sidebar.innerHTML = `
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon" style="background: transparent; border: none; box-shadow: none;">
          <img src="images/emblem-india.svg" alt="Emblem of India" style="height: 38px; width: auto;">
        </div>
        <div>
          <div class="sidebar-logo-title">न्याय सहाय <span style="font-size:0.75rem; color:#60a5fa; font-weight:600;">(v2.6)</span></div>
          <div class="sidebar-logo-subtitle">NYAYA-SAHAY &bull; ${roleKey.toUpperCase()} PORTAL</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        ${navItems.map(item => `
          <a href="${item.href}" class="nav-item ${activePage === item.id ? 'active' : ''}" data-page="${item.id}">
            <span class="nav-icon">${item.icon}</span>
            <span class="nav-label">${item.label}</span>
          </a>
        `).join('')}
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-user-avatar">${user.initials}</div>
          <div>
            <div class="sidebar-user-name">${user.name}</div>
            <div class="sidebar-user-role">${user.role} &bull; ${user.department.split(' ')[0]}</div>
          </div>
        </div>
        <a href="#" class="nav-item logout-item" onclick="NyayaSahay.logout(); return false;">
          <span class="nav-icon">${this.icons.logout}</span>
          <span class="nav-label">Logout</span>
        </a>
      </div>
    `;

    if (!document.getElementById('sidebar-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'sidebar-overlay';
      overlay.className = 'sidebar-overlay';
      overlay.onclick = () => this.toggleSidebar(false);
      document.body.appendChild(overlay);
    }
  },

  renderHeader(title, breadcrumbs) {
    const header = document.getElementById('header');
    if (!header) return;

    const user = MockData.currentUser;
    const unread = MockData.notifications.filter(n => n.unread).length;
    const isHi = (this.lang === 'hi');

    header.className = 'header';
    header.innerHTML = `
      <div class="header-left">
        <button class="sidebar-toggle" onclick="NyayaSahay.toggleSidebar()">
          <span class="nav-icon">${this.icons.menu}</span>
        </button>
        <div>
          <h1 class="header-title">${title}</h1>
          ${breadcrumbs ? `
            <div class="breadcrumbs">
              ${breadcrumbs.map((bc, i) => {
                if (i === breadcrumbs.length - 1) return `<span>${bc.label}</span>`;
                return `<a href="${bc.href}">${bc.label}</a><span class="breadcrumb-sep">/</span>`;
              }).join('')}
            </div>
          ` : ''}
        </div>
      </div>
      <div class="header-right">
        <div class="header-search">
          <span class="header-search-icon"><span class="nav-icon">${this.icons.searchSmall}</span></span>
          <input type="text" placeholder="${isHi ? 'सभी दस्तावेज़ों में खोजें...' : 'Search across all documents...'}" onkeydown="if(event.key==='Enter') window.location.href='search.html?q='+this.value">
        </div>
        <div class="relative">
          <button class="notification-btn" onclick="NyayaSahay.toggleNotifications()">
            <span class="nav-icon">${this.icons.bell}</span>
            ${unread > 0 ? `<span class="notification-badge">${unread}</span>` : ''}
          </button>
          <div class="notification-dropdown" id="notification-dropdown">
            <div class="notification-dropdown-header">
              <h4>${isHi ? 'सूचनाएं' : 'Notifications'}</h4>
              <button class="btn btn-ghost btn-sm" onclick="NyayaSahay.markAllRead()">${isHi ? 'सभी पढ़े मार्क करें' : 'Mark all read'}</button>
            </div>
            <div class="notification-list">
              ${MockData.notifications.map(n => `
                <div class="notification-item ${n.unread ? 'unread' : ''}">
                  <div class="notification-item-icon timeline-dot ${n.type === 'danger' ? 'red' : n.type === 'success' ? 'green' : n.type === 'warning' ? 'amber' : 'blue'}">${n.icon}</div>
                  <div class="notification-item-content">
                    <div class="notification-item-text"><strong>${n.title}</strong> — ${n.message}</div>
                    <div class="notification-item-time">${n.time}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <!-- User Profile Avatar & Dropdown Menu -->
        <div class="relative">
          <div class="header-user-avatar" id="header-avatar-btn" onclick="NyayaSahay.toggleUserDropdown()" title="${user.name}">
            ${user.initials}
          </div>
          <div class="user-dropdown-menu" id="user-dropdown-menu">
            <div class="user-dropdown-header">
              <div class="user-dropdown-avatar">${user.initials}</div>
              <div class="user-dropdown-info">
                <div class="user-dropdown-name">${user.name}</div>
                <div class="user-dropdown-email">${user.email}</div>
                <div class="user-dropdown-role"><span class="badge badge-info">${user.role}</span></div>
              </div>
            </div>
            <div class="user-dropdown-divider"></div>
            <a href="settings.html" class="user-dropdown-item">
              <span class="nav-icon">${this.icons.settings}</span>
              <span>${isHi ? 'सेटिंग्स एवं प्रोफ़ाइल' : 'Settings / Profile'}</span>
            </a>
            <div class="user-dropdown-divider"></div>
            <button class="user-dropdown-item text-danger" onclick="NyayaSahay.logout(); return false;">
              <span class="nav-icon">${this.icons.logout}</span>
              <span>${isHi ? 'लॉगआउट (Logout)' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  toggleUserDropdown() {
    const dropdown = document.getElementById('user-dropdown-menu');
    if (!dropdown) return;

    dropdown.classList.toggle('show');

    const closeHandler = (e) => {
      if (!dropdown.contains(e.target) && !e.target.closest('#header-avatar-btn')) {
        dropdown.classList.remove('show');
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 0);
  },

  toggleSidebar(force) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (force === false) {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    } else {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    }
  },

  toggleNotifications() {
    const dd = document.getElementById('notification-dropdown');
    dd.classList.toggle('show');

    const handler = (e) => {
      if (!dd.contains(e.target) && !e.target.closest('.notification-btn')) {
        dd.classList.remove('show');
        document.removeEventListener('click', handler);
      }
    };
    setTimeout(() => document.addEventListener('click', handler), 0);
  },

  markAllRead() {
    MockData.notifications.forEach(n => n.unread = false);
    document.querySelectorAll('.notification-item.unread').forEach(el => el.classList.remove('unread'));
    const badge = document.querySelector('.notification-badge');
    if (badge) badge.remove();
    this.showToast('All notifications marked as read', 'success');
  },

  showToast(message, type = 'info', duration = 4000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const iconMap = {
      success: this.icons.check,
      error: this.icons.alert,
      warning: this.icons.alert,
      info: this.icons.info
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon nav-icon">${iconMap[type] || iconMap.info}</span>
      <span class="toast-message">${message}</span>
      <span class="toast-close" onclick="this.parentElement.classList.add('toast-exit'); setTimeout(() => this.parentElement.remove(), 300)">✕</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  },

  showModal(config) {
    let overlay = document.getElementById('modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'modal-overlay';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }

    const sizeClass = config.size === 'lg' ? 'modal-lg' : '';

    overlay.innerHTML = `
      <div class="modal ${sizeClass}">
        <div class="modal-header">
          <h3>${config.title}</h3>
          <button class="modal-close" onclick="NyayaSahay.hideModal()">
            <span class="nav-icon">${this.icons.close}</span>
          </button>
        </div>
        <div class="modal-body">${config.body}</div>
        ${config.footer ? `<div class="modal-footer">${config.footer}</div>` : ''}
      </div>
    `;

    requestAnimationFrame(() => overlay.classList.add('visible'));

    overlay.onclick = (e) => {
      if (e.target === overlay) this.hideModal();
    };

    const escHandler = (e) => {
      if (e.key === 'Escape') {
        this.hideModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  },

  hideModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.classList.remove('visible');
      setTimeout(() => { overlay.innerHTML = ''; }, 300);
    }
  },

  showConfirm(message, onConfirm, confirmText = 'Confirm', type = 'danger') {
    this.showModal({
      title: 'Confirm Action',
      body: `<p style="font-size: 0.9375rem; color: var(--text-secondary);">${message}</p>`,
      footer: `
        <button class="btn btn-secondary" onclick="NyayaSahay.hideModal()">Cancel</button>
        <button class="btn btn-${type}" onclick="NyayaSahay.hideModal(); (${onConfirm.toString()})()">${confirmText}</button>
      `
    });
  },

  async performLogout() {
    try {
      if (typeof ApiClient !== 'undefined' && ApiClient.logout) {
        await ApiClient.logout();
      }
    } catch(e) {}
    
    // Purge all session and persistent storage
    sessionStorage.clear();
    localStorage.clear();

    // Reset MockData currentUser state to baseline default
    if (typeof MockData !== 'undefined') {
      MockData.currentUser = {
        id: 'USR-POLICE',
        name: 'Inspector R. Sharma',
        email: 'police.officer@nyayasahay.gov.in',
        role: 'Police Officer',
        roleKey: 'police',
        initials: 'RS',
        department: 'State Police Investigation Cell',
        bio: '',
        avatar: null
      };
    }

    // Redirect cleanly to login page with auto-reset flag
    window.location.href = 'index.html?logged_out=true&reset=true';
  },

  logout() {
    if (confirm('Are you sure you want to logout from NYAYA-SAHAY Portal?')) {
      this.performLogout();
    }
  },

  formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  },

  formatDateTime(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
           d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  },

  formatTimeAgo(dateStr) {
    const now = new Date();
    const d = new Date(dateStr);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return this.formatDate(dateStr);
  },

  statusBadge(status) {
    const map = {
      'Active': 'badge-success', 'Closed': 'badge-neutral', 'Pending': 'badge-warning',
      'Under Investigation': 'badge-info', 'Draft': 'badge-warning'
    };
    const cls = map[status] || 'badge-neutral';
    return `<span class="badge ${cls}"><span class="badge-dot"></span>${status}</span>`;
  },

  integrityBadge(status) {
    const map = {
      'verified': { cls: 'integrity-verified', label: '✓ Verified', icon: '✓' },
      'tampered': { cls: 'integrity-violated', label: '⚠ Tampered', icon: '⚠' },
      'warning': { cls: 'integrity-violated', label: '⚠ Violation', icon: '⚠' },
      'pending': { cls: 'integrity-pending', label: '◷ Pending', icon: '◷' },
      'processing': { cls: 'integrity-pending', label: '◷ Processing', icon: '◷' }
    };
    const s = map[status] || map['pending'];
    return `<span class="integrity-badge ${s.cls}">${s.label}</span>`;
  },

  aiStatusBadge(status) {
    const map = {
      'completed': { cls: 'badge-ai', label: '✦ AI Processed' },
      'processing': { cls: 'badge-warning', label: '◷ Processing' },
      'pending': { cls: 'badge-neutral', label: 'Pending' },
      'failed': { cls: 'badge-danger', label: 'Failed' }
    };
    const s = map[status] || map['pending'];
    return `<span class="badge ${s.cls}"><span class="badge-dot"></span>${s.label}</span>`;
  },

  roleBadge(role) {
    const cls = {
      'Admin': 'role-admin', 'Investigator': 'role-investigator',
      'Officer': 'role-officer', 'Analyst': 'role-analyst'
    };
    return `<span class="role-badge ${cls[role] || ''}">${role}</span>`;
  },

  buildTable(columns, rows, options = {}) {
    const onRowClick = options.onRowClick || null;
    return `
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>${columns.map(c => `<th>${c.label}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.length === 0 ? `<tr><td colspan="${columns.length}"><div class="empty-state"><p>No data available</p></div></td></tr>` : ''}
            ${rows.map((row, i) => `
              <tr ${onRowClick ? `onclick="${onRowClick}('${row._id || i}')" style="cursor:pointer"` : ''}>
                ${columns.map(c => {
                  let cellData = c.render ? c.render(row) : row[c.key];
                  if (cellData && typeof cellData === 'object' && cellData.value !== undefined) {
                    cellData = cellData.value;
                  }
                  if (cellData === undefined || cellData === null || cellData === '') cellData = '—';
                  return `<td>${cellData}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  statCard(icon, color, value, label, change) {
    return `
      <div class="stat-card">
        <div class="stat-icon ${color}">
          <span class="nav-icon">${icon}</span>
        </div>
        <div class="stat-info">
          <div class="stat-value">${value}</div>
          <div class="stat-label">${label}</div>
          ${change ? `<div class="stat-change ${change.startsWith('+') || change.startsWith('↑') ? 'up' : 'down'}">${change}</div>` : ''}
        </div>
      </div>
    `;
  },

  loadingState(message = 'Loading...') {
    return `
      <div class="loading-state">
        <div class="spinner"></div>
        <div class="loading-text">${message}</div>
      </div>
    `;
  },

  emptyState(icon, title, message, action) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon nav-icon">${icon}</div>
        <h4>${title}</h4>
        <p>${message}</p>
        ${action ? `<button class="btn btn-primary mt-4" onclick="${action.onclick}">${action.label}</button>` : ''}
      </div>
    `;
  },

  entityTag(entity) {
    const typeClass = {
      'Person': 'entity-person', 'Vehicle': 'entity-vehicle',
      'Location': 'entity-location', 'Organization': 'entity-org',
      'Date': 'entity-date'
    };
    return `<span class="entity-tag ${typeClass[entity.type] || 'entity-person'}">${entity.type}: ${entity.value}</span>`;
  },

  confidenceBar(value) {
    let num = Number(value);
    if (num > 1) num = num / 100;
    const pct = Math.round(num * 100);
    const level = pct >= 90 ? 'high' : pct >= 70 ? 'medium' : 'low';
    return `
      <div class="confidence-meter">
        <div class="confidence-bar">
          <div class="confidence-fill ${level}" style="width: ${pct}%"></div>
        </div>
        <span class="confidence-value text-${level === 'high' ? 'success' : level === 'medium' ? 'warning' : 'danger'}">${pct}%</span>
      </div>
    `;
  },

  initTabs(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const buttons = container.querySelectorAll('.tab-btn');
    const panes = container.querySelectorAll('.tab-pane');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const targetId = btn.dataset.tab || btn.dataset.target;
        panes.forEach(p => {
          if (p.id === targetId) {
            p.classList.add('active');
            p.classList.remove('hidden');
          } else {
            p.classList.remove('active');
            p.classList.add('hidden');
          }
        });
      });
    });
  },

  getUrlParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  },

  simulateAsync(duration = 1500) {
    return new Promise(resolve => setTimeout(resolve, duration));
  }
};
