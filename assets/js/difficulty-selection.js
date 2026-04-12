// Difficulty selection for solo mode
import { auth } from './firebase-config.js';

// Difficulty settings
const difficultySettings = {
    easy: {
        questions: 10,
        timePerQuestion: 30,
        totalTime: 300
    },
    medium: {
        questions: 10,
        timePerQuestion: 20,
        totalTime: 200
    },
    hard: {
        questions: 10,
        timePerQuestion: 15,
        totalTime: 150
    }
};

// Check if player is logged in and theme is selected
function checkPlayerAndTheme() {
    const playerName = localStorage.getItem('quizZH_playerName');
    const selectedTheme = localStorage.getItem('quizZH_selectedTheme');
    
    if (!playerName) {
        window.location.href = 'index.html';
        return null;
    }
    
    if (!selectedTheme) {
        window.location.href = 'theme-selection.html';
        return null;
    }
    
    return { playerName, selectedTheme };
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

// Get theme display name
function getThemeDisplayName(theme) {
    const themeNames = {
        'sciences': 'Sciences',
        'tech': 'Tech',
        'geo': 'Géographie',
        'culture-pop': 'Culture Pop',
        'histoire': 'Histoire',
        'arts': 'Arts & Divertissement',
        'all': 'Tous les Thèmes'
    };
    return themeNames[theme] || theme;
}

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const data = checkPlayerAndTheme();
    if (!data) return;

    const { playerName, selectedTheme } = data;

    // Display selected theme
    document.getElementById('selectedTheme').textContent = getThemeDisplayName(selectedTheme);

    // Difficulty buttons
    const difficultyButtons = document.querySelectorAll('.btn-difficulty');
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const difficulty = button.dataset.difficulty;
            const settings = difficultySettings[difficulty];
            
            // Store difficulty settings in localStorage
            localStorage.setItem('quizZH_difficulty', difficulty);
            localStorage.setItem('quizZH_totalQuestions', settings.questions);
            localStorage.setItem('quizZH_timePerQuestion', settings.timePerQuestion);
            localStorage.setItem('quizZH_totalTime', settings.totalTime);
            
            const difficultyName = button.querySelector('.difficulty-title').textContent;
            showNotification(`Difficulté: ${difficultyName}`, 'info');
            
            setTimeout(() => {
                window.location.href = 'solo-game.html';
            }, 500);
        });
    });

    // Back link
    document.getElementById('backLink').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'theme-selection.html';
    });
});
