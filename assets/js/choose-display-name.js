// Choose display name for Google users
import { auth, db } from './firebase-config.js';
import { createPlayer } from './firebase-db.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

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

async function checkExistingUser(uid, email) {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            // Utilisateur existe déjà, retourner son pseudo
            return userDoc.data().displayName;
        }
    } catch (error) {
        console.error('Error checking existing user:', error);
    }
    return null;
}

document.addEventListener('DOMContentLoaded', async () => {
    // Check if coming from Google login
    const googleUID = localStorage.getItem('quizZH_tempGoogleUID');
    const googleEmail = localStorage.getItem('quizZH_tempGoogleEmail');
    const googleName = localStorage.getItem('quizZH_tempGoogleName');

    if (!googleUID || !googleEmail) {
        // Not from Google login, redirect to index
        window.location.href = 'index.html';
        return;
    }

    // Vérifier si cet utilisateur a déjà un pseudo enregistré
    const existingDisplayName = await checkExistingUser(googleUID, googleEmail);
    
    if (existingDisplayName) {
        // Utilisateur a déjà un compte, utiliser le pseudo existant
        localStorage.setItem('quizZH_playerName', existingDisplayName);
        localStorage.setItem('quizZH_playerUID', googleUID);
        localStorage.setItem('quizZH_userEmail', googleEmail);

        // Clear temporary data
        localStorage.removeItem('quizZH_tempGoogleUID');
        localStorage.removeItem('quizZH_tempGoogleEmail');
        localStorage.removeItem('quizZH_tempGoogleName');

        showNotification(`Bienvenue ${existingDisplayName}! 🎉`, 'success');

        setTimeout(() => {
            window.location.href = 'game-mode-selection.html';
        }, 1000);
        return;
    }

    // Nouvel utilisateur, laisser choisir un pseudo
    const displayNameInput = document.getElementById('displayName');
    const previewName = document.getElementById('previewName');
    const form = document.getElementById('displayNameForm');

    // Set initial preview name
    if (googleName) {
        displayNameInput.value = googleName;
        previewName.textContent = googleName;
    }

    // Real-time preview
    displayNameInput.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        previewName.textContent = value || 'Mon Pseudo';
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const displayName = displayNameInput.value.trim();

        if (displayName.length < 2) {
            showNotification('Le pseudo doit avoir au moins 2 caractères', 'error');
            return;
        }

        try {
            // Create user record in Firestore
            await createPlayer(googleUID, googleEmail, displayName);

            // Save to localStorage
            localStorage.setItem('quizZH_playerName', displayName);
            localStorage.setItem('quizZH_playerUID', googleUID);
            localStorage.setItem('quizZH_userEmail', googleEmail);

            // Clear temporary data
            localStorage.removeItem('quizZH_tempGoogleUID');
            localStorage.removeItem('quizZH_tempGoogleEmail');
            localStorage.removeItem('quizZH_tempGoogleName');

            showNotification(`Bienvenue ${displayName}! 🎉`, 'success');

            setTimeout(() => {
                window.location.href = 'game-mode-selection.html';
            }, 1000);
        } catch (error) {
            console.error('Error setting display name:', error);
            showNotification('Erreur: ' + error.message, 'error');
        }
    });
});
