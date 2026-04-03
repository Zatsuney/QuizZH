// Player Profile Page Logic (View another player's profile)
import { auth, db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Theme names mapping
const themeNames = {
    'all': 'Tous les Thèmes',
    'sciences': 'Sciences',
    'tech': 'Tech',
    'geo': 'Géographie',
    'culture-pop': 'Culture Pop',
    'histoire': 'Histoire',
    'arts': 'Arts & Divertissement',
    'musique': 'Musique',
    'jeux-videos': 'Jeux-Vidéos',
};

const difficultyNames = {
    'easy': 'Facile',
    'medium': 'Moyen',
    'hard': 'Difficile'
};

// Level thresholds - 100 levels with progressive XP requirements
const LEVEL_THRESHOLDS = (() => {
    const thresholds = [0]; // Level 1 starts at 0
    let currentXP = 0;
    for (let i = 1; i < 100; i++) {
        currentXP += 600 + (i - 1) * 50;
        thresholds.push(currentXP);
    }
    return thresholds;
})();

// Predefined avatars - images
const AVATAR_IMAGES = [
    'alien1.png',
    'boy1.png',
    'boy2.png',
    'boy3.png',
    'detective1.png',
    'einstein.png',
    'girl1.png',
    'girl2.png',
    'girl3.png',
    'pirategirl1.png'
];

// Display player avatar
function displayPlayerAvatar(avatarImage) {
    const avatarElement = document.getElementById('playerAvatar');
    
    if (!avatarImage) {
        avatarImage = 'boy1.png';
    }
    
    const imageUrl = `image/avatars/${avatarImage}`;
    avatarElement.style.backgroundImage = `url('${imageUrl}')`;
    avatarElement.style.backgroundSize = 'contain';
    avatarElement.style.backgroundPosition = 'center';
    avatarElement.style.backgroundRepeat = 'no-repeat';
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

// Load player data
async function loadPlayerData() {
    try {
        // Get UID from URL parameters
        const params = new URLSearchParams(window.location.search);
        const playerUID = params.get('uid');

        if (!playerUID) {
            window.location.href = 'leaderboard.html';
            return;
        }

        // Fetch player data from Firestore
        const userDocRef = doc(db, 'users', playerUID);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();

        if (!userData) {
            showNotification('Joueur non trouvé', 'error');
            window.location.href = 'leaderboard.html';
            return;
        }

        const playerName = userData.displayName || 'Joueur anonyme';

        // Display player name
        document.getElementById('playerName').textContent = playerName;

        // Display avatar
        displayPlayerAvatar(userData.avatarImage);

        // Display level and XP
        const level = userData.level || 1;
        const totalXP = userData.totalXP || 0;
        
        document.getElementById('playerLevel').textContent = level;
        document.getElementById('playerXP').textContent = totalXP;
        document.getElementById('currentLevel').textContent = level;

        // Calculate progress for current level
        const currentLevelXP = LEVEL_THRESHOLDS[level - 1] || 0;
        const nextLevelXP = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
        const xpInCurrentLevel = totalXP - currentLevelXP;
        const xpNeededForLevel = nextLevelXP - currentLevelXP;
        const progressPercent = (xpInCurrentLevel / xpNeededForLevel) * 100;

        document.getElementById('xpProgressBar').style.width = `${Math.min(progressPercent, 100)}%`;
        document.getElementById('progressText').textContent = `${xpInCurrentLevel} / ${xpNeededForLevel} XP`;

        // Display theme stats
        displayThemeStats(userData);

    } catch (error) {
        console.error('Error loading player data:', error);
        showNotification('Erreur lors du chargement du profil', 'error');
    }
}

// Display theme statistics
function displayThemeStats(userData) {
    const container = document.getElementById('themeStatsContainer');
    container.innerHTML = '';

    const themes = Object.keys(themeNames);
    const difficulties = ['easy', 'medium', 'hard'];

    themes.forEach(theme => {
        const themeDiv = document.createElement('div');
        themeDiv.className = 'theme-stat-card';
        themeDiv.innerHTML = `<h4>${themeNames[theme]}</h4>`;

        difficulties.forEach(difficulty => {
            const statsKey = `stats_${theme}_${difficulty}`;
            const stats = userData[statsKey];

            if (stats) {
                const played = stats.played || 0;
                const correctAnswers = stats.correctAnswers || 0;
                const totalQuestions = stats.totalQuestions || 0;
                const themeXP = stats.totalXP || 0;
                const accuracy = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(1) : 0;

                const statHTML = `
                    <div class="difficulty-stat">
                        <span class="difficulty-name">${difficultyNames[difficulty]}</span>
                        <span class="stat-item">Parties: <strong>${played}</strong></span>
                        <span class="stat-item">Bonnes: <strong>${correctAnswers}</strong></span>
                        <span class="stat-item">Précision: <strong>${accuracy}%</strong></span>
                        <span class="stat-xp">XP: <strong>${themeXP}</strong></span>
                    </div>
                `;
                themeDiv.innerHTML += statHTML;
            } else {
                const statHTML = `
                    <div class="difficulty-stat empty">
                        <span class="difficulty-name">${difficultyNames[difficulty]}</span>
                        <span class="stat-text">Pas encore joué</span>
                    </div>
                `;
                themeDiv.innerHTML += statHTML;
            }
        });

        container.appendChild(themeDiv);
    });
}

// Initialize player profile
document.addEventListener('DOMContentLoaded', async () => {
    await loadPlayerData();
});
