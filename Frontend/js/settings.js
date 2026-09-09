document.addEventListener('DOMContentLoaded', () => {
  NyayaSahay.initApp('settings', 'Settings', [
    { label: 'Home', href: 'dashboard.html' },
    { label: 'Settings' }
  ]);

  const pageIconEl = document.getElementById('page-icon');
  if (pageIconEl && NyayaSahay.icons.settings) {
    pageIconEl.innerHTML = NyayaSahay.icons.settings;
  }

  NyayaSahay.initTabs('.tabs');

  const user = MockData.currentUser;
  const nameInput = document.getElementById('profile-name');
  const emailInput = document.getElementById('profile-email');
  const deptInput = document.getElementById('profile-dept');
  const roleInput = document.getElementById('profile-role');
  const bioInput = document.getElementById('profile-bio');

  if (nameInput) nameInput.value = user.name || '';
  if (emailInput) emailInput.value = user.email || '';
  if (deptInput) deptInput.value = user.department || '';
  if (roleInput) roleInput.value = (user.role || '').replace('_', ' ').toUpperCase();
  if (bioInput) bioInput.value = user.bio || localStorage.getItem('nyaya_bio') || '';

  document.getElementById('btn-save-profile')?.addEventListener('click', () => {
    const newName = nameInput ? nameInput.value.trim() : '';
    const newEmail = emailInput ? emailInput.value.trim() : '';
    const newDept = deptInput ? deptInput.value.trim() : '';
    const newBio = bioInput ? bioInput.value.trim() : '';

    if (!newName || !newEmail) {
      NyayaSahay.showToast('Please enter a valid Name and Email Address.', 'warning');
      return;
    }

    NyayaSahay.saveUserProfile({
      name: newName,
      email: newEmail,
      department: newDept,
      bio: newBio
    });

    NyayaSahay.showToast(NyayaSahay.lang === 'hi' ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट और सहेजी गई' : 'Profile updated and saved successfully', 'success');
  });

  document.getElementById('btn-update-password')?.addEventListener('click', () => {
    NyayaSahay.showToast(NyayaSahay.lang === 'hi' ? 'पासवर्ड सफलतापूर्वक अपडेट किया गया' : 'Password updated successfully', 'success');
  });

  document.getElementById('btn-save-notifications')?.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#tab-notifications input[type="checkbox"]');
    const prefs = Array.from(checkboxes).map(c => c.checked);
    localStorage.setItem('nyaya_notif_prefs', JSON.stringify(prefs));
    NyayaSahay.showToast(NyayaSahay.lang === 'hi' ? 'सूचना प्राथमिकताएं सहेजी गईं' : 'Notification preferences saved', 'success');
  });

  document.getElementById('btn-terminate-sessions')?.addEventListener('click', () => {
    NyayaSahay.showConfirm(
      NyayaSahay.lang === 'hi' ? 'क्या आप अन्य सभी सक्रिय सत्रों को समाप्त करना चाहते हैं?' : 'Are you sure you want to terminate all other active sessions? You will be logged out on all other devices.',
      () => {
        NyayaSahay.showToast(NyayaSahay.lang === 'hi' ? 'अन्य सभी सत्र सफलतापूर्वक समाप्त कर दिए गए' : 'All other sessions terminated successfully', 'success');
      },
      NyayaSahay.lang === 'hi' ? 'सत्र समाप्त करें' : 'Terminate Sessions',
      'danger'
    );
  });
});
