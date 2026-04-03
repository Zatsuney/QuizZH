// Profile Page Logic
import { auth, db } from './firebase-config.js';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
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

// Level thresholds
const LEVEL_THRESHOLDS = (() => {
    const thresholds = [0];
    let currentXP = 0;
    for (let i = 1; i < 100; i++) {
        currentXP += 600 + (i - 1) * 50;
        thresholds.push(currentXP);
    }
    return thresholds;
})();

// Avatar images
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

// Avatar unlock levels - level required to use each avatar
const AVATAR_UNLOCK_LEVELS = {
    'alien1.png': 5,
    'boy1.png': 1,
    'boy2.png': 1,
    'boy3.png': 1,
    'detective1.png': 1,
    'einstein.png': 10,
    'girl1.png': 1,
    'girl2.png': 1,
    'girl3.png': 1,
    'pirategirl1.png': 1
};

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

// Display player avatar
function displayPlayerAvatar(avatarImage) {
    const avatarElement = document.getElementById('playerAvatar');
    
    if (!avatarElement) {
        console.error('❌ Avatar element not found in DOM');
        return;
    }

    if (!avatarImage) {
        avatarImage = 'boy1.png';
    }
    
    const imageUrl = `image/avatars/${avatarImage}`;
    avatarElement.style.backgroundImage = `url('${imageUrl}')`;
    avatarElement.style.backgroundSize = 'contain';
    avatarElement.style.backgroundPosition = 'center';
    avatarElement.style.backgroundRepeat = 'no-repeat';
}

// Load player data
async function loadPlayerData() {
    try {
        const playerUID = localStorage.getItem('quizZH_playerUID');
        
        if (!playerUID) {
            window.location.href = 'index.html';
            return;
        }

        const userDocRef = doc(db, 'users', playerUID);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            window.location.href = 'index.html';
            return;
        }

        const userData = userDoc.data();
        const playerName = userData.displayName || localStorage.getItem('quizZH_playerName') || 'Joueur';
        
        localStorage.setItem('quizZH_playerName', playerName);

        document.getElementById('playerName').textContent = playerName;
        displayPlayerAvatar(userData.avatarImage);

        const level = userData.level || 1;
        const totalXP = userData.totalXP || 0;
        
        document.getElementById('playerLevel').textContent = level;
        document.getElementById('playerXP').textContent = totalXP;
        document.getElementById('currentLevel').textContent = level;

        const currentLevelXP = LEVEL_THRESHOLDS[level - 1] || 0;
        const nextLevelXP = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
        const xpInCurrentLevel = totalXP - currentLevelXP;
        const xpNeededForLevel = nextLevelXP - currentLevelXP;
        const progressPercent = (xpInCurrentLevel / xpNeededForLevel) * 100;

        document.getElementById('xpProgressBar').style.width = `${Math.min(progressPercent, 100)}%`;
        document.getElementById('progressText').textContent = `${xpInCurrentLevel} / ${xpNeededForLevel} XP`;

        displayThemeStats(userData);
        setupNameEditing();
        await setupAvatarModal();

    } catch (error) {
        console.error('Error loading player data:', error);
        showNotification('Erreur lors du chargement du profil', 'error');
    }
}

// Setup name editing
function setupNameEditing() {
    const editBtn = document.getElementById('editNameBtn');
    const saveBtn = document.getElementById('saveName');
    const cancelBtn = document.getElementById('cancelName');
    const playerNameDisplay = document.getElementById('playerName');
    const nameEditForm = document.getElementById('nameEditForm');
    const newNameInput = document.getElementById('newNameInput');
    const nameError = document.getElementById('nameError');

    editBtn.addEventListener('click', () => {
        newNameInput.value = playerNameDisplay.textContent;
        nameEditForm.style.display = 'flex';
        newNameInput.focus();
    });

    cancelBtn.addEventListener('click', () => {
        nameEditForm.style.display = 'none';
        nameError.style.display = 'none';
    });

    saveBtn.addEventListener('click', async () => {
        const newName = newNameInput.value.trim();

        if (newName.length < 2) {
            showError('Le pseudo doit avoir au moins 2 caractères');
            return;
        }

        if (newName.length > 20) {
            showError('Le pseudo ne doit pas dépasser 20 caractères');
            return;
        }

        const validNameRegex = /^[a-zA-Z0-9\s_-]+$/;
        if (!validNameRegex.test(newName)) {
            showError('Caractères invalides dans le pseudo');
            return;
        }

        if (newName === playerNameDisplay.textContent) {
            showError('Choisissez un pseudo différent');
            return;
        }

        try {
            const playerUID = localStorage.getItem('quizZH_playerUID');
            const userDocRef = doc(db, 'users', playerUID);
            
            await updateDoc(userDocRef, {
                displayName: newName
            });

            localStorage.setItem('quizZH_playerName', newName);
            playerNameDisplay.textContent = newName;
            nameEditForm.style.display = 'none';
            nameError.style.display = 'none';
            
            showNotification('Pseudo modifié! 🎉', 'success');
        } catch (error) {
            console.error('Error saving name:', error);
            showError('Erreur lors de la sauvegarde');
        }
    });

    function showError(message) {
        nameError.textContent = message;
        nameError.style.display = 'block';
    }
}

// Setup avatar modal
async function setupAvatarModal() {
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarModal = document.getElementById('avatarModal');
    const closeAvatarModal = document.getElementById('closeAvatarModal');
    const avatarGrid = document.querySelector('.avatar-grid');
    const playerUID = localStorage.getItem('quizZH_playerUID');

    if (!changeAvatarBtn || !avatarModal || !closeAvatarModal || !avatarGrid) {
        console.error('❌ Missing avatar modal elements');
        return;
    }

    // Get player level for checking unlocked avatars
    let playerLevel = 1;
    try {
        const userDocRef = doc(db, 'users', playerUID);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            playerLevel = userDoc.data().level || 1;
        }
    } catch (error) {
        console.error('Error getting player level:', error);
    }

    // Create avatar options
    AVATAR_IMAGES.forEach((imageName) => {
        const avatarOption = document.createElement('div');
        avatarOption.className = 'avatar-option';
        const requiredLevel = AVATAR_UNLOCK_LEVELS[imageName] || 1;
        const isUnlocked = playerLevel >= requiredLevel;

        avatarOption.style.backgroundImage = `url('image/avatars/${imageName}')`;
        avatarOption.style.backgroundSize = 'contain';
        avatarOption.style.backgroundPosition = 'center';
        avatarOption.style.backgroundRepeat = 'no-repeat';
        avatarOption.style.border = '3px solid transparent';
        avatarOption.style.cursor = isUnlocked ? 'pointer' : 'not-allowed';
        avatarOption.style.position = 'relative';
        avatarOption.dataset.imageName = imageName;

        // If locked, add overlay and lock icon
        if (!isUnlocked) {
            avatarOption.style.opacity = '0.5';
            avatarOption.style.filter = 'grayscale(100%)';
            
            // Add lock icon tooltip
            const lockOverlay = document.createElement('div');
            lockOverlay.style.position = 'absolute';
            lockOverlay.style.top = '50%';
            lockOverlay.style.left = '50%';
            lockOverlay.style.transform = 'translate(-50%, -50%)';
            lockOverlay.style.fontSize = '2.5em';
            lockOverlay.style.zIndex = '10';
            lockOverlay.textContent = '🔒';
            avatarOption.appendChild(lockOverlay);

            // Add tooltip on hover
            const tooltip = document.createElement('div');
            tooltip.textContent = `Débloqué au niveau ${requiredLevel}`;
            tooltip.style.position = 'absolute';
            tooltip.style.bottom = '-30px';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.backgroundColor = '#333';
            tooltip.style.color = 'white';
            tooltip.style.padding = '5px 10px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '0.85em';
            tooltip.style.display = 'none';
            tooltip.style.zIndex = '11';
            avatarOption.appendChild(tooltip);

            avatarOption.addEventListener('mouseenter', () => {
                tooltip.style.display = 'block';
            });
            avatarOption.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
        }

        if (isUnlocked) {
            avatarOption.addEventListener('click', async () => {
                document.querySelectorAll('.avatar-option').forEach(opt => {
                    opt.classList.remove('selected');
                    opt.style.border = '3px solid transparent';
                });
                avatarOption.classList.add('selected');
                avatarOption.style.border = '3px solid var(--primary-color)';

                try {
                    const userDocRef = doc(db, 'users', playerUID);
                    await updateDoc(userDocRef, {
                        avatarImage: imageName
                    });

                    displayPlayerAvatar(imageName);
                    showNotification('Avatar mis à jour! 🎉', 'success');

                    setTimeout(() => {
                        avatarModal.style.display = 'none';
                    }, 500);
                } catch (error) {
                    console.error('Error updating avatar:', error);
                    showNotification('Erreur lors de la mise à jour', 'error');
                }
            });
        } else {
            avatarOption.addEventListener('click', () => {
                showNotification(`Débloqué au niveau ${requiredLevel}! 🔒`, 'info');
            });
        }

        avatarGrid.appendChild(avatarOption);
    });

    // Open modal
    changeAvatarBtn.addEventListener('click', () => {
        avatarModal.style.display = 'flex';
    });

    // Close modal
    closeAvatarModal.addEventListener('click', () => {
        avatarModal.style.display = 'none';
    });

    // Close on outside click
    avatarModal.addEventListener('click', (e) => {
        if (e.target === avatarModal) {
            avatarModal.style.display = 'none';
        }
    });
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
                themeDiv.innerHTML += `
                    <div class="difficulty-stat empty">
                        <span class="difficulty-name">${difficultyNames[difficulty]}</span>
                        <span class="stat-text">Pas encore joué</span>
                    </div>
                `;
            }
        });

        container.appendChild(themeDiv);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const playerName = checkPlayerLoggedIn();
    if (!playerName) return;

    await loadPlayerData();

    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('quizZH_playerName');
            localStorage.removeItem('quizZH_playerUID');
            localStorage.removeItem('quizZH_userEmail');
            showNotification('Déconnecté', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } catch (error) {
            console.error('Logout error:', error);
            showNotification('Erreur de déconnexion', 'error');
        }
    });
});
