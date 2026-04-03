// Game mode selection page logic
import { auth } from './firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Check if player is logged in
function checkPlayerLoggedIn() {
    const playerName = localStorage.getItem('quizZH_playerName');
    if (!playerName) {
        window.location.href = 'index.html';
        return null;
    }
    return playerName;
}

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

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const playerName = checkPlayerLoggedIn();
    if (!playerName) return;

    // Display player name
    document.getElementById('playerName').textContent = playerName;

    // Mode Solo button
    document.getElementById('soloBtn').addEventListener('click', () => {
        localStorage.setItem('quizZH_gameMode', 'solo');
        window.location.href = 'theme-selection.html';
    });

    // Mode Tournoi button
    document.getElementById('tournamentBtn').addEventListener('click', () => {
        localStorage.setItem('quizZH_gameMode', 'tournament');
        window.location.href = 'waiting-room.html';
    });

    // Profile button
    document.getElementById('profileBtn').addEventListener('click', () => {
        window.location.href = 'profile.html';
    });

    // Leaderboard button
    document.getElementById('leaderboardBtn').addEventListener('click', () => {
        window.location.href = 'leaderboard.html';
    });

    // Logout link
    document.getElementById('logoutLink').addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            localStorage.removeItem('quizZH_playerName');
            localStorage.removeItem('quizZH_playerUID');
            localStorage.removeItem('quizZH_userEmail');
            localStorage.removeItem('quizZH_gameMode');
            showNotification('Déconnecté', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } catch (error) {
            console.error('Logout error:', error);
            showNotification('Erreur lors de la déconnexion', 'error');
        }
    });
});
