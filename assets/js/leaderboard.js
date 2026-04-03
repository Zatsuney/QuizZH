// Leaderboard Logic
import { auth, db } from './firebase-config.js';
import { collection, query, where, getDocs, orderBy, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
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

// Get all players data
async function getAllPlayers() {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('totalXP', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const players = [];
        querySnapshot.forEach((doc) => {
            players.push({
                uid: doc.id,
                ...doc.data()
            });
        });
        
        return players;
    } catch (error) {
        console.error('Error fetching players:', error);
        return [];
    }
}

// Display global leaderboard
async function displayGlobalLeaderboard(levelFilter = 'all') {
    const players = await getAllPlayers();
    const globalLb = document.getElementById('globalLeaderboard');
    
    // Filter by level if specified
    let filteredPlayers = players;
    if (levelFilter !== 'all') {
        const level = parseInt(levelFilter);
        filteredPlayers = players.filter(p => (p.level || 1) === level);
    }
    
    if (filteredPlayers.length === 0) {
        globalLb.innerHTML = '<p class="no-data">Aucun joueur trouvé pour ce niveau</p>';
        return;
    }
    
    let html = '<div class="leaderboard-table-wrapper"><table class="leaderboard-table"><thead><tr><th>Rang</th><th>Joueur</th><th>Niveau</th><th>XP Total</th></tr></thead><tbody>';
    
    filteredPlayers.forEach((player, index) => {
        const level = player.level || 1;
        const totalXP = player.totalXP || 0;
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        const avatarImage = player.avatarImage || 'alien1.png';
        
        html += `
            <tr class="player-row-clickable" onclick="window.location.href='player-profile.html?uid=${player.uid}'">
                <td>${medal || (index + 1)}</td>
                <td>
                    <div class="player-row">
                        <div class="lb-avatar" style="background-image: url('image/avatars/${avatarImage}'); background-size: contain; background-position: center; background-repeat: no-repeat;"></div>
                        <span>${player.displayName || 'Joueur anonyme'}</span>
                    </div>
                </td>
                <td><span class="level-badge">Niveau ${level}</span></td>
                <td><strong>${totalXP}</strong> XP</td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    globalLb.innerHTML = html;
}

// Display theme leaderboard
async function displayThemeLeaderboard(theme, difficulty) {
    const players = await getAllPlayers();
    const themeLb = document.getElementById('themeLeaderboard');
    
    const statsKey = `stats_${theme}_${difficulty}`;
    
    // Filter players who have stats for this theme
    const filteredPlayers = players
        .filter(p => p[statsKey])
        .map(p => ({
            ...p,
            themeCorrect: p[statsKey].correctAnswers || 0,
            themePlayed: p[statsKey].played || 0,
            themeTotal: p[statsKey].totalQuestions || 0,
            themeXP: p[statsKey].totalXP || 0
        }))
        .sort((a, b) => b.themeXP - a.themeXP);
    
    if (filteredPlayers.length === 0) {
        themeLb.innerHTML = '<p class="no-data">Aucun score trouvé pour ce thème et cette difficulté</p>';
        return;
    }
    
    const themeName = themeNames[theme];
    const diffName = difficultyNames[difficulty];
    
    let html = `<h3>${themeName} - ${diffName}</h3>
                <div class="leaderboard-table-wrapper">
                <table class="leaderboard-table">
                <thead><tr><th>Rang</th><th>Joueur</th><th>Parties</th><th>Bonnes</th><th>XP</th></tr></thead>
                <tbody>`;
    
    filteredPlayers.forEach((player, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        const avatarImage = player.avatarImage || 'alien1.png';
        
        html += `
            <tr class="player-row-clickable" onclick="window.location.href='player-profile.html?uid=${player.uid}'">
                <td>${medal || (index + 1)}</td>
                <td>
                    <div class="player-row">
                        <div class="lb-avatar" style="background-image: url('image/avatars/${avatarImage}'); background-size: contain; background-position: center; background-repeat: no-repeat;"></div>
                        <span>${player.displayName || 'Joueur anonyme'}</span>
                    </div>
                </td>
                <td>${player.themePlayed}</td>
                <td>${player.themeCorrect}</td>
                <td><strong>${player.themeXP}</strong> XP</td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    themeLb.innerHTML = html;
}

// ===== ADMIN LEADERBOARD FUNCTIONS =====
async function loadPlayersInSelect() {
    const select = document.getElementById('playerSelect');
    try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        
        select.innerHTML = '<option value="">-- Choisir un joueur --</option>';
        
        snapshot.forEach(doc => {
            const playerName = doc.id;
            const option = document.createElement('option');
            option.value = playerName;
            option.textContent = playerName;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading players:', error);
        showNotification('Erreur lors du chargement des joueurs', 'error');
    }
}

async function resetPlayerScore(playerName) {
    if (!playerName) {
        showNotification('Veuillez sélectionner un joueur', 'error');
        return;
    }
    
    if (confirm(`Êtes-vous sûr de vouloir réinitialiser le score de ${playerName} ?`)) {
        try {
            const playerRef = doc(db, 'users', playerName);
            await updateDoc(playerRef, {
                totalXP: 0,
                level: 1,
                totalQuestions: 0,
                correctAnswers: 0,
                accuracy: 0
            });
            
            showNotification(`✅ Score de ${playerName} réinitialisé`, 'success');
            await displayGlobalLeaderboard();
            await loadPlayersInSelect();
            document.getElementById('playerSelect').value = '';
        } catch (error) {
            console.error('Error resetting player score:', error);
            showNotification('Erreur lors de la réinitialisation', 'error');
        }
    }
}

async function deletePlayer(playerName) {
    if (!playerName) {
        showNotification('Veuillez sélectionner un joueur', 'error');
        return;
    }
    
    if (confirm(`⚠️ Êtes-vous sûr de vouloir SUPPRIMER le joueur ${playerName} ? Cette action est irréversible !`)) {
        try {
            const playerRef = doc(db, 'users', playerName);
            await deleteDoc(playerRef);
            
            showNotification(`✅ Joueur ${playerName} supprimé`, 'success');
            await displayGlobalLeaderboard();
            await loadPlayersInSelect();
            document.getElementById('playerSelect').value = '';
        } catch (error) {
            console.error('Error deleting player:', error);
            showNotification('Erreur lors de la suppression', 'error');
        }
    }
}

async function resetAllPlayersScores() {
    if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser les scores de TOUS les joueurs ?')) {
        try {
            const usersRef = collection(db, 'users');
            const snapshot = await getDocs(usersRef);
            
            for (const playerDoc of snapshot.docs) {
                const playerRef = doc(db, 'users', playerDoc.id);
                await updateDoc(playerRef, {
                    totalXP: 0,
                    level: 1,
                    totalQuestions: 0,
                    correctAnswers: 0,
                    accuracy: 0
                });
            }
            
            showNotification('✅ Tous les scores ont été réinitialisés', 'success');
            await displayGlobalLeaderboard();
            await loadPlayersInSelect();
        } catch (error) {
            console.error('Error resetting all scores:', error);
            showNotification('Erreur lors de la réinitialisation', 'error');
        }
    }
}

async function deleteAllPlayers() {
    if (confirm('🚨 ATTENTION: Cette action va SUPPRIMER TOUS les joueurs !\n\nCette action est IRRÉVERSIBLE. Êtes-vous vraiment sûr ?')) {
        if (confirm('Confirmez-vous vraiment ?')) {
            try {
                const usersRef = collection(db, 'users');
                const snapshot = await getDocs(usersRef);
                
                for (const playerDoc of snapshot.docs) {
                    const playerRef = doc(db, 'users', playerDoc.id);
                    await deleteDoc(playerRef);
                }
                
                showNotification('✅ Tous les joueurs ont été supprimés', 'success');
                await displayGlobalLeaderboard();
                await loadPlayersInSelect();
            } catch (error) {
                console.error('Error deleting all players:', error);
                showNotification('Erreur lors de la suppression', 'error');
            }
        }
    }
}

// Initialize leaderboard
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const playerName = checkPlayerLoggedIn();
    if (!playerName) return;
    
    // Load initial leaderboards
    await displayGlobalLeaderboard();
    await displayThemeLeaderboard('all', 'easy');
    
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update active tab content
            tabContents.forEach(tc => tc.classList.remove('active'));
            const tabName = btn.dataset.tab;
            document.getElementById(tabName + 'Tab').classList.add('active');
        });
    });
    
    // Global leaderboard level filter
    document.getElementById('levelFilter').addEventListener('change', (e) => {
        displayGlobalLeaderboard(e.target.value);
    });
    
    // Theme leaderboard filters
    document.getElementById('themeFilter').addEventListener('change', () => {
        const theme = document.getElementById('themeFilter').value;
        const difficulty = document.getElementById('difficultyFilter').value;
        displayThemeLeaderboard(theme, difficulty);
    });
    
    document.getElementById('difficultyFilter').addEventListener('change', () => {
        const theme = document.getElementById('themeFilter').value;
        const difficulty = document.getElementById('difficultyFilter').value;
        displayThemeLeaderboard(theme, difficulty);
    });
    
    // Logout button
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

    // Quick reset buttons next to players
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-reset-player')) {
            e.stopPropagation();
            const playerUID = e.target.dataset.player;
            const playerName = e.target.dataset.playerName;
            
            if (confirm(`Êtes-vous sûr de vouloir réinitialiser le score de ${playerName} ?`)) {
                try {
                    const playerRef = doc(db, 'users', playerUID);
                    await updateDoc(playerRef, {
                        totalXP: 0,
                        level: 1,
                        totalQuestions: 0,
                        correctAnswers: 0,
                        accuracy: 0
                    });
                    
                    showNotification(`✅ Score de ${playerName} réinitialisé`, 'success');
                    await displayGlobalLeaderboard();
                    await displayThemeLeaderboard(
                        document.getElementById('themeFilter').value, 
                        document.getElementById('difficultyFilter').value
                    );
                } catch (error) {
                    console.error('Error resetting player score:', error);
                    showNotification('Erreur lors de la réinitialisation', 'error');
                }
            }
        }
    });
});
