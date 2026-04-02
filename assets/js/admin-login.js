// Admin login with Firebase
import { 
  auth 
} from './firebase-config.js';
import { 
  signInAnonymously,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Check if already logged in
onAuthStateChanged(auth, function(user) {
  if (user && localStorage.getItem('quizZH_isAdmin')) {
    window.location.href = 'admin-panel.html';
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const adminLoginForm = document.getElementById('adminLoginForm');
  
  if (!adminLoginForm) return;

  adminLoginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const adminPassword = document.getElementById('adminPassword').value;
    const adminNameInput = document.getElementById('adminName');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const loginButton = this.querySelector('button[type="submit"]');

    // HARDCODED ADMIN PASSWORD - Change this!
    const ADMIN_PASSWORD = 'admin';

    if (adminPassword !== ADMIN_PASSWORD) {
      alert('Mot de passe incorrect!');
      if (adminNameInput) adminNameInput.value = '';
      return;
    }

    try {
      // Show loading
      if (loadingIndicator) loadingIndicator.style.display = 'block';
      if (loginButton) loginButton.disabled = true;

      // Sign in with Firebase (anonymous for admins too, but marked as admin)
      const userCredential = await signInAnonymously(auth);

      // Mark as admin in localStorage
      localStorage.setItem('quizZH_isAdmin', 'true');
      localStorage.setItem('quizZH_adminUID', userCredential.user.uid);

      // Redirect to admin panel
      window.location.href = 'admin-panel.html';
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.code === 'auth/operation-not-allowed') {
        alert('Anonymous sign-in est désactivé. Activez-le dans Firebase Console.');
      } else {
        alert('Erreur de connexion Firebase: ' + error.message);
      }

      if (adminNameInput) adminNameInput.value = '';
      if (loadingIndicator) loadingIndicator.style.display = 'none';
      if (loginButton) loginButton.disabled = false;
    }
  });
});
