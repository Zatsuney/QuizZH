// Admin Leaderboards Management
import { auth, db } from './firebase-config.js';
import { collection, query, getDocs, orderBy, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
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

// Check if admin is logged in
function checkAdminLoggedIn() {
    const adminSession = localStorage.getItem('adminSessionId');
    if (!adminSession) {
        window.location.href = 'admin-login.html';
        return null;
    }
    return adminSession;
}

// Get all players
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
async function displayGlobalLeaderboard() {
    const players = await getAllPlayers();
    const tbody = document.getElementById('leaderboardBody');
    
    if (!tbody) return;
    
    if (players.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Aucun joueur trouvé</td></tr>';
        return;
    }

    let html = '';
    
    players.forEach((player, index) => {
        const level = player.level || 1;
        const totalXP = player.totalXP || 0;
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        const avatarImage = player.avatarImage || 'alien1.png';
        
        html += `
            <tr>
                <td>${medal || (index + 1)}</td>
                <td>
                    <div class="player-row">
                        <div class="lb-avatar" style="background-image: url('image/avatars/${avatarImage}'); background-size: contain; background-position: center; background-repeat: no-repeat;"></div>
                        <span>${player.displayName || 'Joueur anonyme'}</span>
                    </div>
                </td>
                <td><span class="level-badge">Niveau ${level}</span></td>
                <td><strong>${totalXP}</strong> XP</td>
                <td>
                    <button class="btn-reset-player" data-player-uid="${player.uid}" data-player-name="${player.displayName || 'Joueur anonyme'}" title="Réinitialiser ce joueur">🔄 Reset</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;

    // Add event listeners to reset buttons
    document.querySelectorAll('.btn-reset-player').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const playerUID = btn.dataset.playerUid;
            const playerName = btn.dataset.playerName;
            await resetPlayerScore(playerUID, playerName);
        });
    });

    // Update stats
    updateStats(players);
}

// Display theme leaderboard
async function displayThemeLeaderboard(theme, difficulty) {
    const players = await getAllPlayers();
    const tbody = document.getElementById('leaderboardBody');
    
    if (!tbody) return;
    
    const statsKey = `stats_${theme}_${difficulty}`;
    
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
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Aucun score trouvé pour ce thème et cette difficulté</td></tr>';
        return;
    }
    
    const themeName = themeNames[theme];
    const diffName = difficultyNames[difficulty];
    
    // Update page header
    const display = document.getElementById('leaderboardDisplay');
    if (display && !display.querySelector('h3')) {
        const h3 = document.createElement('h3');
        h3.textContent = `${themeName} - ${diffName}`;
        display.insertBefore(h3, display.querySelector('table'));
    } else if (display && display.querySelector('h3')) {
        display.querySelector('h3').textContent = `${themeName} - ${diffName}`;
    }
    
    let html = '';
    
    filteredPlayers.forEach((player, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        const avatarImage = player.avatarImage || 'alien1.png';
        
        html += `
            <tr>
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
                <td>
                    <button class="btn-reset-player" data-player-uid="${player.uid}" data-player-name="${player.displayName || 'Joueur anonyme'}" title="Réinitialiser ce joueur">🔄 Reset</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    
    // Add event listeners to reset buttons
    document.querySelectorAll('.btn-reset-player').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const playerUID = btn.dataset.playerUid;
            const playerName = btn.dataset.playerName;
            await resetPlayerScore(playerUID, playerName);
        });
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Reset player score
async function resetPlayerScore(playerUID, playerName) {
    console.log('🔄 Reset player:', playerUID, playerName);
    
    if (confirm(`Êtes-vous sûr de vouloir réinitialiser le score de ${playerName} ?`)) {
        try {
            console.log('💾 Updating Firebase doc for UID:', playerUID);
            const playerRef = doc(db, 'users', playerUID);
            console.log('📝 playerRef:', playerRef);
            
            await updateDoc(playerRef, {
                totalXP: 0,
                level: 1,
                totalQuestions: 0,
                correctAnswers: 0,
                accuracy: 0
            });
            
            console.log('✅ Update successful');
            showNotification(`✅ Score de ${playerName} réinitialisé`, 'success');
            
            // Refresh the leaderboard
            const theme = document.getElementById('lbThemeFilter').value;
            if (theme === 'global') {
                await displayGlobalLeaderboard();
            } else {
                const difficulty = document.getElementById('lbDifficultyFilter').value;
                await displayThemeLeaderboard(theme, difficulty);
            }
        } catch (error) {
            console.error('❌ Error resetting player score:', error);
            showNotification('Erreur lors de la réinitialisation: ' + error.message, 'error');
        }
    }
}

// Update statistics
async function updateStats(players = null) {
    if (!players) {
        players = await getAllPlayers();
    }

    let totalPlayers = players.length;
    let activePlayers = players.filter(p => (p.totalXP || 0) > 0).length;
    let totalXP = players.reduce((sum, p) => sum + (p.totalXP || 0), 0);
    
    let totalGames = 0;
    players.forEach(player => {
        const themes = ['all', 'sciences', 'tech', 'geo', 'culture-pop', 'histoire', 'arts', 'musique', 'jeux-videos'];
        const difficulties = ['easy', 'medium', 'hard'];
        themes.forEach(theme => {
            difficulties.forEach(difficulty => {
                const statsKey = `stats_${theme}_${difficulty}`;
                if (player[statsKey]) {
                    totalGames += player[statsKey].played || 0;
                }
            });
        });
    });

    document.getElementById('totalPlayers').textContent = totalPlayers;
    document.getElementById('activePlayers').textContent = activePlayers;
    document.getElementById('totalXP').textContent = totalXP.toLocaleString('fr-FR');
    document.getElementById('totalGames').textContent = totalGames.toLocaleString('fr-FR');
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Check admin session
    checkAdminLoggedIn();

    // Load initial leaderboard
    await displayGlobalLeaderboard();

    // Theme filter change
    document.getElementById('lbThemeFilter').addEventListener('change', (e) => {
        const theme = e.target.value;
        const diffGroup = document.getElementById('difficultyGroup');
        
        if (theme === 'global') {
            diffGroup.style.display = 'none';
            displayGlobalLeaderboard();
        } else {
            diffGroup.style.display = 'flex';
            const difficulty = document.getElementById('lbDifficultyFilter').value;
            displayThemeLeaderboard(theme, difficulty);
        }
    });

    // Difficulty filter change
    document.getElementById('lbDifficultyFilter').addEventListener('change', (e) => {
        const theme = document.getElementById('lbThemeFilter').value;
        const difficulty = e.target.value;
        if (theme !== 'global') {
            displayThemeLeaderboard(theme, difficulty);
        }
    });

    // Refresh button
    document.getElementById('refreshLbBtn').addEventListener('click', async () => {
        const theme = document.getElementById('lbThemeFilter').value;
        if (theme === 'global') {
            await displayGlobalLeaderboard();
        } else {
            const difficulty = document.getElementById('lbDifficultyFilter').value;
            await displayThemeLeaderboard(theme, difficulty);
        }
    });

    // Logout button
    document.getElementById('adminLogoutBtn').addEventListener('click', async () => {
        localStorage.removeItem('adminSessionId');
        localStorage.removeItem('adminUsername');
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
        window.location.href = 'admin-login.html';
    });
});
