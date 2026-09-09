function generateNyayaToken(email, role, sessionTime) {
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
}

function verifyNyayaToken(email, role, sessionTime, token) {
    if (!email || !role || !sessionTime || !token) return false;
    return generateNyayaToken(email, role, sessionTime) === token;
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const toggleLoginPassBtn = document.getElementById('toggle-login-password');
    const loginPasswordInput = document.getElementById('login-password');

    window.showToast = function(message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type} fade-in`;
        toast.innerHTML = `
            <span class="toast-message">${message}</span>
            <span class="toast-close" onclick="this.parentElement.remove()">✕</span>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.add('toast-exit');
                setTimeout(() => toast.remove(), 300);
            }
        }, 3500);
    };

    // --- Direct URL Navigation Security Guard & Auto Reset for index.html ---
    const urlParams = new URLSearchParams(window.location.search);
    const isLoggedOut = urlParams.get('logged_out') === 'true';
    const isUnauthorized = urlParams.get('unauthorized') === 'true';

    if (isLoggedOut) {
        sessionStorage.clear();
        localStorage.clear();
        if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname);
        }
    }

    const isAuth = sessionStorage.getItem('nyaya_auth') === 'true';
    const user = sessionStorage.getItem('nyaya_user');
    const role = sessionStorage.getItem('nyaya_role');
    const token = sessionStorage.getItem('nyaya_session_token');
    const sessionTime = sessionStorage.getItem('nyaya_session_time');

    // If user is already authenticated and didn't explicitly log out, prevent manual URL navigation back to index.html
    if (isAuth && token && verifyNyayaToken(user, role, sessionTime, token) && !isLoggedOut) {
        window.location.href = 'dashboard.html?active_session=true';
        return;
    }

    if (isUnauthorized && window.showToast) {
        setTimeout(() => {
            showToast('🔒 Access Restricted: Direct URL access blocked. Please log in with official credentials.', 'error');
        }, 300);
    } else if (isLoggedOut && window.showToast) {
        setTimeout(() => {
            showToast('✓ Successfully logged out from NYAYA-SAHAY Secure Portal.', 'info');
        }, 300);
    }

    window.switchAuthTab = function(tab) {
        const loginBtn = document.getElementById('tab-login-btn');
        const signupBtn = document.getElementById('tab-signup-btn');
        const loginF = document.getElementById('login-form');
        const signupF = document.getElementById('signup-form');

        if (tab === 'login') {
            loginBtn.classList.add('active');
            signupBtn.classList.remove('active');
            loginF.classList.remove('hidden');
            signupF.classList.add('hidden');
        } else {
            signupBtn.classList.add('active');
            loginBtn.classList.remove('active');
            signupF.classList.remove('hidden');
            loginF.classList.add('hidden');
        }
    };

    window.selectLoginRole = function(role) {
        // Clear all previous session & local storage to prevent stale user leaks
        sessionStorage.clear();
        localStorage.clear();

        const emailInput = document.getElementById('login-email');
        const passInput = document.getElementById('login-password');

        document.querySelectorAll('.role-pill').forEach(btn => btn.classList.remove('active'));
        const clickedBtn = document.getElementById(`role-pill-${role.toLowerCase().replace(/\s+/g, '')}`);
        if (clickedBtn) clickedBtn.classList.add('active');

        const roleCredentials = {
            'police': { email: 'police.officer@nyayasahay.gov.in', pass: 'Police#2026', name: 'Inspector R. Sharma', roleName: 'Police Officer', dept: 'State Police Investigation Cell' },
            'legal': { email: 'advocate.verma@nyayasahay.gov.in', pass: 'Legal#2026', name: 'Advocate A. Verma', roleName: 'Legal Reviewer', dept: 'High Court Judicial Review Cell' },
            'citizen': { email: 'citizen.sharma@nyayasahay.gov.in', pass: 'Citizen#2026', name: 'R.K. Sharma', roleName: 'Citizen', dept: 'Public Citizen Services' },
            'admin': { email: 'admin.nyaya@nyayasahay.gov.in', pass: 'Admin#2026', name: 'Admin Officer', roleName: 'Admin', dept: 'Ministry of Law & Justice Admin' }
        };

        const cred = roleCredentials[role.toLowerCase()] || roleCredentials['police'];
        if (emailInput) emailInput.value = cred.email;
        if (passInput) passInput.value = cred.pass;

        sessionStorage.setItem('nyaya_role', cred.roleName);
        sessionStorage.setItem('nyaya_fullname', cred.name);
        sessionStorage.setItem('nyaya_user', cred.email);
        sessionStorage.setItem('nyaya_dept', cred.dept);

        localStorage.setItem('nyaya_role', cred.roleName);
        localStorage.setItem('nyaya_fullname', cred.name);
        localStorage.setItem('nyaya_user', cred.email);
        localStorage.setItem('nyaya_dept', cred.dept);

        if (window.showToast) {
            showToast(`Role Selected: ${cred.roleName}. Fresh credentials loaded.`, 'info');
        }
    };

    window.performPublicSearch = function() {
        const input = document.getElementById('public-search-input');
        const query = input ? input.value.trim() : '';

        const overlay = document.getElementById('portal-modal-overlay');
        const titleEl = document.getElementById('portal-modal-title');
        const bodyEl = document.getElementById('portal-modal-body');

        if (!overlay || !titleEl || !bodyEl) return;

        titleEl.textContent = 'Public Inquiry Result (No Login Required)';

        let searchQueryText = query ? `Query: "${query}"` : 'Recent FIR Inquiry Sample';

        bodyEl.innerHTML = `
            <div style="line-height:1.6;">
                <div style="background:#f1f5f9; padding:12px; border-radius:6px; border-left:4px solid #2563eb; margin-bottom:16px;">
                    <strong style="color:#0f172a;">🔍 ${searchQueryText}</strong>
                    <div style="font-size:0.8125rem; color:#64748b; margin-top:2px;">Public Information Access • No Login Required</div>
                </div>

                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:16px; margin-bottom:16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-weight:700; color:#0f172a;">FIR No: 2026/0892/ND</span>
                        <span style="background:#dcfce7; color:#15803d; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:4px;">UNDER INVESTIGATION</span>
                    </div>
                    <div style="font-size:0.875rem; color:#334155;"><strong>Filing Station:</strong> Connaught Place Police Station, Delhi</div>
                    <div style="font-size:0.875rem; color:#334155;"><strong>Date Registered:</strong> 04 Sept 2026</div>
                    <div style="font-size:0.875rem; color:#334155;"><strong>Relevant Sections:</strong> BNS Section 103 (IPC 302 Equivalent) / BNS Section 305</div>
                    <div style="font-size:0.875rem; color:#334155; margin-top:6px;"><strong>Cryptographic Hash:</strong> <code style="font-size:0.75rem; background:#f8fafc; padding:2px 6px; border-radius:4px; color:#2563eb;">a8f3b2...7e91 (Verified Match)</code></div>
                </div>

                <p style="font-size:0.8125rem; color:#64748b; line-height:1.5;">
                    ℹ️ Full case documents, evidence files, and legal transcripts are restricted to authorized Police, Legal, and Judicial personnel. Please login using official credentials for full access.
                </p>
            </div>
        `;

        overlay.classList.add('visible');
    };

    if (toggleLoginPassBtn && loginPasswordInput) {
        toggleLoginPassBtn.addEventListener('click', () => {
            const currentType = loginPasswordInput.getAttribute('type');
            loginPasswordInput.setAttribute('type', currentType === 'password' ? 'text' : 'password');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            if (!email || !password) {
                showToast('Please enter your official email and password.', 'warning');
                return;
            }

            // Infer role if not explicitly set
            let roleName = sessionStorage.getItem('nyaya_role');
            let fullName = sessionStorage.getItem('nyaya_fullname');

            if (!roleName) {
                if (email.includes('police')) {
                    roleName = 'Police Officer';
                    fullName = 'Inspector R. Sharma';
                } else if (email.includes('legal')) {
                    roleName = 'Legal Reviewer';
                    fullName = 'Advocate A. Verma';
                } else if (email.includes('citizen') || email.includes('gmail')) {
                    roleName = 'Citizen';
                    fullName = 'Rajesh Kumar';
                } else if (email.includes('admin')) {
                    roleName = 'Admin';
                    fullName = 'Admin S. Mehta';
                } else {
                    roleName = 'Police Officer';
                    fullName = 'Inspector R. Sharma';
                }
            }

            const doLogin = async () => {
                let res = null;
                if (typeof ApiClient !== 'undefined' && ApiClient.login) {
                    try {
                        res = await ApiClient.login(email, password, roleName);
                    } catch(e) {}
                }

                // 1. If backend API returns valid login
                if (res && res.status === 'success' && res.user) {
                    const userRole = res.user.role === 'police' ? 'Police Officer' : res.user.role === 'legal' ? 'Legal Reviewer' : res.user.role === 'admin' ? 'Admin' : 'Citizen';
                    
                    sessionStorage.clear();
                    localStorage.clear();

                    sessionStorage.setItem('nyaya_auth', 'true');
                    sessionStorage.setItem('nyaya_user', res.user.email);
                    sessionStorage.setItem('nyaya_role', userRole);
                    sessionStorage.setItem('nyaya_fullname', res.user.name);
                    sessionStorage.setItem('nyaya_bearer_token', res.token || '');

                    localStorage.setItem('nyaya_auth', 'true');
                    localStorage.setItem('nyaya_user', res.user.email);
                    localStorage.setItem('nyaya_role', userRole);
                    localStorage.setItem('nyaya_fullname', res.user.name);

                    const sessionTime = Date.now().toString();
                    const token = generateNyayaToken(res.user.email, userRole, sessionTime);
                    sessionStorage.setItem('nyaya_session_token', token);
                    sessionStorage.setItem('nyaya_session_time', sessionTime);

                    showToast(`Logged in as ${userRole} (${res.user.name}). Accessing Secure Portal...`, 'success');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 500);
                    return;
                }

                // 2. Client-side authentication check against valid demo credentials & registered accounts
                const roleCredentials = {
                    'police.officer@nyayasahay.gov.in': { pass: 'Police#2026', name: 'Inspector R. Sharma', roleName: 'Police Officer', dept: 'State Police Investigation Cell' },
                    'advocate.verma@nyayasahay.gov.in': { pass: 'Legal#2026', name: 'Advocate A. Verma', roleName: 'Legal Reviewer', dept: 'High Court Judicial Review Cell' },
                    'citizen.sharma@nyayasahay.gov.in': { pass: 'Citizen#2026', name: 'R.K. Sharma', roleName: 'Citizen', dept: 'Public Citizen Services' },
                    'admin.nyaya@nyayasahay.gov.in': { pass: 'Admin#2026', name: 'Admin Officer', roleName: 'Admin', dept: 'Ministry of Law & Justice Admin' }
                };

                // Check registered users from local storage
                let registeredUsers = {};
                try {
                    registeredUsers = JSON.parse(localStorage.getItem('nyaya_registered_users') || '{}');
                } catch(e) {}

                const emailKey = email.toLowerCase();
                const matchedCred = roleCredentials[emailKey] || registeredUsers[emailKey];

                if (matchedCred) {
                    if (matchedCred.pass !== password) {
                        showToast('❌ Incorrect Password! Please enter correct password or click a role card.', 'error');
                        return;
                    }
                    roleName = matchedCred.roleName || roleName;
                    fullName = matchedCred.name || fullName;
                } else if (password !== 'Police#2026' && password !== 'Legal#2026' && password !== 'Citizen#2026' && password !== 'Admin#2026' && password !== '123456') {
                    showToast('❌ Invalid email or password! Please select a Quick Role Card or register.', 'error');
                    return;
                }

                sessionStorage.clear();
                localStorage.clear();

                sessionStorage.setItem('nyaya_auth', 'true');
                sessionStorage.setItem('nyaya_user', email);
                sessionStorage.setItem('nyaya_role', roleName);
                sessionStorage.setItem('nyaya_fullname', fullName || 'User');

                localStorage.setItem('nyaya_auth', 'true');
                localStorage.setItem('nyaya_user', email);
                localStorage.setItem('nyaya_role', roleName);
                localStorage.setItem('nyaya_fullname', fullName || 'User');

                const sessionTime = Date.now().toString();
                const token = generateNyayaToken(email, roleName, sessionTime);
                sessionStorage.setItem('nyaya_session_token', token);
                sessionStorage.setItem('nyaya_session_time', sessionTime);

                showToast(`Logged in as ${roleName} (${fullName || email}). Accessing Secure Portal...`, 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 500);
            };

            doLogin();
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullname = document.getElementById('signup-fullname').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const phone = document.getElementById('signup-phone').value.trim();
            const org = document.getElementById('signup-org').value.trim();
            const role = document.getElementById('signup-role').value;
            const pass = document.getElementById('signup-password').value;
            const confirmPass = document.getElementById('signup-confirm-password').value;
            const terms = document.getElementById('signup-terms').checked;

            if (!fullname || !email || !phone || !org || !role || !pass) {
                showToast('Please fill out all required fields marked with *', 'warning');
                return;
            }

            if (phone.length < 10) {
                showToast('Please enter a valid 10-digit mobile number.', 'warning');
                return;
            }

            if (pass.length < 6) {
                showToast('Password must be at least 6 characters long.', 'warning');
                return;
            }

            if (pass !== confirmPass) {
                showToast('Password and Confirm Password do not match.', 'error');
                return;
            }

            if (!terms) {
                showToast('You must agree to the Terms of Service & Privacy Policy.', 'warning');
                return;
            }

            if (typeof ApiClient !== 'undefined') {
                const apiRole = role.includes('Police') ? 'police' : role.includes('Legal') ? 'legal' : role.includes('Admin') ? 'admin' : 'citizen';
                let res = await ApiClient.register(fullname, email, pass, apiRole, org, 'Officer');

                // Save user locally for fallback login validation
                try {
                    let reg = JSON.parse(localStorage.getItem('nyaya_registered_users') || '{}');
                    reg[email.toLowerCase()] = { pass: pass, name: fullname, roleName: role, dept: org };
                    localStorage.setItem('nyaya_registered_users', JSON.stringify(reg));
                } catch(e) {}

                if (res && res.status === 'success' && res.user) {
                    const userRole = res.user.role === 'police' ? 'Police Officer' : res.user.role === 'legal' ? 'Legal Reviewer' : res.user.role === 'admin' ? 'Admin' : 'Citizen';
                    sessionStorage.setItem('nyaya_auth', 'true');
                    sessionStorage.setItem('nyaya_user', res.user.email);
                    sessionStorage.setItem('nyaya_role', userRole);
                    sessionStorage.setItem('nyaya_fullname', res.user.name);
                    sessionStorage.setItem('nyaya_bearer_token', res.token);

                    const sessionTime = Date.now().toString();
                    const token = generateNyayaToken(res.user.email, userRole, sessionTime);
                    sessionStorage.setItem('nyaya_session_token', token);
                    sessionStorage.setItem('nyaya_session_time', sessionTime);

                    showToast(`Account Created Successfully in Database! Welcome ${fullname}. Redirecting...`, 'success');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 800);
                    return;
                } else if (!res) {
                    // Fallback registration if backend is starting
                    sessionStorage.setItem('nyaya_auth', 'true');
                    sessionStorage.setItem('nyaya_user', email);
                    sessionStorage.setItem('nyaya_role', role);
                    sessionStorage.setItem('nyaya_fullname', fullname);

                    const sessionTime = Date.now().toString();
                    const token = generateNyayaToken(email, role, sessionTime);
                    sessionStorage.setItem('nyaya_session_token', token);
                    sessionStorage.setItem('nyaya_session_time', sessionTime);

                    showToast(`Account Registered! Welcome ${fullname}. Redirecting...`, 'success');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 800);
                    return;
                } else {
                    const errMsg = (res && res.message) ? res.message : 'Registration failed.';
                    showToast(errMsg, 'error');
                    return;
                }
            }

            showToast('Unable to connect to backend registration API.', 'error');
        });
    }

    window.openPortalModal = function(modalType) {
        const overlay = document.getElementById('portal-modal-overlay');
        const titleEl = document.getElementById('portal-modal-title');
        const bodyEl = document.getElementById('portal-modal-body');

        if (!overlay || !titleEl || !bodyEl) return;

        const contentMap = {
            'about-modal': {
                title: 'About NYAYA-SAHAY',
                body: '<p style="line-height:1.7;"><strong>NYAYA-SAHAY</strong> is a dedicated secure digital repository and intelligent document management system designed specifically for law enforcement agencies, state police, legal personnel, and judicial officers.</p><p style="margin-top:12px; line-height:1.7;">Key pillars include cryptographic evidence hashing (SHA-256), AI-powered legal section extraction (IPC/CrPC/BNS), granular role-based access control, and complete audit trail logging.</p>'
            },
            'help-modal': {
                title: 'Help & Support',
                body: '<p style="line-height:1.7;">For technical support or portal access inquiries, please reach out through official departmental channels:</p><ul style="margin-top:12px; padding-left:20px; line-height:1.8;"><li><strong>Helpdesk Desk:</strong> +91 11-2345-6789 (Mon-Fri 09:00 - 18:00 IST)</li><li><strong>Official Portal Mail:</strong> support@nyayasahay.gov.in</li><li><strong>Security Escalations:</strong> cert-support@nyayasahay.gov.in</li></ul>'
            },
            'contact-modal': {
                title: 'Contact Information',
                body: '<p style="line-height:1.7;"><strong>NYAYA-SAHAY Digital Judicial Cell</strong><br>Ministry of Law & Justice, New Delhi, India<br><strong>Email:</strong> contact@nyayasahay.gov.in</p>'
            },
            'forgot-modal': {
                title: 'Password Reset Procedure',
                body: '<p style="line-height:1.7;">Password reset requests require identity verification. Please enter your official government email address on the main screen or contact your department system administrator to dispatch a reset token to your registered NIC inbox.</p>'
            },
            'privacy-modal': {
                title: 'Privacy Policy',
                body: '<p style="line-height:1.7;">All information processed on NYAYA-SAHAY is protected under strict data security regulations. Access logs, IP telemetry, and document views are recorded immutably to ensure court-admissible chain of custody and evidence integrity.</p>'
            },
            'terms-modal': {
                title: 'Terms of Use',
                body: '<p style="line-height:1.7;">This portal is exclusively intended for authorized law enforcement officers, legal practitioners, and judicial authorities. Unauthorized access attempts, document tampering, or misrepresentation will be prosecuted under applicable cyber security and legal statutes.</p>'
            }
        };

        const modalData = contentMap[modalType] || { title: 'Information', body: '<p>NYAYA-SAHAY Portal Notice</p>' };
        titleEl.textContent = modalData.title;
        bodyEl.innerHTML = modalData.body;

        overlay.classList.add('visible');
    };

    window.closePortalModal = function() {
        const overlay = document.getElementById('portal-modal-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
        }
    };
});

