// Login/Signup page logic with Firebase
import { auth, googleProvider } from './firebase-config.js';
import { createPlayer, registerPlayer } from './firebase-db.js';
import { 
    signInAnonymously,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Global state
let isSignupMode = false;

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Check if player is already logged in
function isPlayerLoggedIn() {
    return localStorage.getItem('quizZH_playerName') !== null;
}

// Toggle between signup and login
function toggleAuthMode() {
    isSignupMode = !isSignupMode;
    const form = document.getElementById('loginForm');
    const toggle = document.getElementById('authModeToggle');
    const displayNameGroup = document.getElementById('displayNameGroup');
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    const toggleText = document.getElementById('toggleText');
    const toggleLink = document.getElementById('toggleLink');

    if (isSignupMode) {
        // Signup mode
        displayNameGroup.style.display = 'block';
        submitBtn.textContent = 'Créer un compte';
        submitBtn.classList.add('btn-signup');
        submitBtn.classList.remove('btn-login');
        toggleText.textContent = 'Vous avez déjà un compte? ';
        toggleLink.textContent = 'Se connecter';
    } else {
        // Login mode
        displayNameGroup.style.display = 'none';
        submitBtn.textContent = 'Se connecter';
        submitBtn.classList.remove('btn-signup');
        submitBtn.classList.add('btn-login');
        toggleText.textContent = 'Pas encore de compte? ';
        toggleLink.textContent = 'Créer un compte';
    }

    // Clear form
    form.reset();
}

// Helper function to validate email
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Google Sign-In function
async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Store temporarily in localStorage for next page
        localStorage.setItem('quizZH_tempGoogleUID', user.uid);
        localStorage.setItem('quizZH_tempGoogleEmail', user.email);
        localStorage.setItem('quizZH_tempGoogleName', user.displayName || '');

        // Redirect to choose display name page
        window.location.href = 'choose-display-name.html';
    } catch (error) {
        console.error('Google sign-in error:', error);
        if (error.code === 'auth/popup-blocked') {
            showNotification('Pop-up bloqué. Autorisez les pop-ups', 'error');
        } else if (error.code !== 'auth/cancelled-popup-request') {
            showNotification(`Erreur Google: ${error.message}`, 'error');
        }
    }
}

// Signup function
async function signup(email, password, displayName) {
    if (!isValidEmail(email)) {
        showNotification('Email invalide', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Le mot de passe doit avoir au moins 6 caractères', 'error');
        return;
    }

    if (displayName.trim().length < 2) {
        showNotification('Le nom doit avoir au moins 2 caractères', 'error');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user record in Firestore
        await createPlayer(user.uid, email, displayName.trim());

        // Register player in game
        await registerPlayer(displayName.trim());

        // Save to localStorage
        localStorage.setItem('quizZH_playerName', displayName.trim());
        localStorage.setItem('quizZH_playerUID', user.uid);
        localStorage.setItem('quizZH_userEmail', email);

        showNotification(`Compte créé! Bienvenue ${displayName}! 🎉`, 'success');

        setTimeout(() => {
            window.location.href = 'waiting-room.html';
        }, 1000);
    } catch (error) {
        console.error('Signup error:', error);
        if (error.code === 'auth/email-already-in-use') {
            showNotification('Cet email est déjà utilisé', 'error');
        } else if (error.code === 'auth/weak-password') {
            showNotification('Le mot de passe est trop faible', 'error');
        } else {
            showNotification(`Erreur: ${error.message}`, 'error');
        }
    }
}

// Login function
async function login(email, password) {
    if (!isValidEmail(email)) {
        showNotification('Email invalide', 'error');
        return;
    }

    if (!password) {
        showNotification('Veuillez entrer un mot de passe', 'error');
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user display name from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const displayName = userDoc.data()?.displayName || user.email.split('@')[0];

        // Register player in game
        await registerPlayer(displayName);

        // Save to localStorage
        localStorage.setItem('quizZH_playerName', displayName);
        localStorage.setItem('quizZH_playerUID', user.uid);
        localStorage.setItem('quizZH_userEmail', email);

        showNotification(`Bienvenue ${displayName}! 🎉`, 'success');

        setTimeout(() => {
            window.location.href = 'waiting-room.html';
        }, 1000);
    } catch (error) {
        console.error('Login error:', error);
        if (error.code === 'auth/user-not-found') {
            showNotification('Utilisateur non trouvé', 'error');
        } else if (error.code === 'auth/wrong-password') {
            showNotification('Mot de passe incorrect', 'error');
        } else {
            showNotification(`Erreur: ${error.message}`, 'error');
        }
    }
}

// Import getDoc for login
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { db } from './firebase-config.js';

// Form handling
document.addEventListener('DOMContentLoaded', async () => {
    // Redirect if already logged in
    if (isPlayerLoggedIn()) {
        window.location.href = 'waiting-room.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const displayNameInput = document.getElementById('displayName');
    const googleSignInBtn = document.getElementById('googleSignInBtn');
    const toggleLink = document.getElementById('toggleLink');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const displayName = displayNameInput?.value.trim();

            if (isSignupMode) {
                await signup(email, password, displayName);
            } else {
                await login(email, password);
            }
        });
    }

    // Google Sign-In button
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', signInWithGoogle);
    }

    // Toggle button
    if (toggleLink) {
        toggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAuthMode();
        });
    }
});
