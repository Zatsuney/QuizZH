// Admin login with Firebase
import { 
  auth 
} from './firebase-config.js';
import { 
  signInAnonymously,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { ADMIN_CONFIG } from './admin-config.js';

// Check if already logged in
onAuthStateChanged(auth, function(user) {
  if (user && localStorage.getItem('adminSessionId')) {
    window.location.href = 'admin-menu.html';
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const adminLoginForm = document.getElementById('adminLoginForm');
  
  if (!adminLoginForm) return;

  adminLoginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const adminUsername = document.getElementById('adminName').value.trim();
    const adminPassword = document.getElementById('adminPassword').value;
    const adminNameInput = document.getElementById('adminName');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const loginButton = this.querySelector('button[type="submit"]');

    // Vérify credentials against admin list
    const validAdmin = ADMIN_CONFIG.admins.find(
      admin => admin.username === adminUsername && admin.password === adminPassword
    );

    if (!validAdmin) {
      alert('Identifiants incorrect! (pseudo ou mot de passe invalide)');
      if (adminNameInput) adminNameInput.value = '';
      document.getElementById('adminPassword').value = '';
      return;
    }

    try {
      // Show loading
      if (loadingIndicator) loadingIndicator.style.display = 'block';
      if (loginButton) loginButton.disabled = true;

      // Sign in with Firebase (anonymous for admins too, but marked as admin)
      const userCredential = await signInAnonymously(auth);

      // Mark as admin in localStorage
      localStorage.setItem('adminSessionId', userCredential.user.uid);
      localStorage.setItem('adminUsername', adminUsername);

      // Redirect to admin menu
      window.location.href = 'admin-menu.html';
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.code === 'auth/operation-not-allowed') {
        alert('Anonymous sign-in est désactivé. Activez-le dans Firebase Console.');
      } else {
        alert('Erreur de connexion Firebase: ' + error.message);
      }

      if (adminNameInput) adminNameInput.value = '';
      document.getElementById('adminPassword').value = '';
      if (loadingIndicator) loadingIndicator.style.display = 'none';
      if (loginButton) loginButton.disabled = false;
    }
  });
});
