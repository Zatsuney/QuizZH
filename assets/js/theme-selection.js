// Theme selection for solo mode
import { auth } from './firebase-config.js';

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

    // Theme buttons
    const themeButtons = document.querySelectorAll('.btn-theme');
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            localStorage.setItem('quizZH_selectedTheme', theme);
            localStorage.setItem('quizZH_gameMode', 'solo');
            
            showNotification(`Thème: ${button.querySelector('.theme-title').textContent}`, 'info');
            setTimeout(() => {
                window.location.href = 'difficulty-selection.html';
            }, 500);
        });
    });

    // Back link
    document.getElementById('backLink').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'game-mode-selection.html';
    });
});
