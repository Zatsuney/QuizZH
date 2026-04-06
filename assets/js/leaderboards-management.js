// Leaderboards Management Page
import { auth, db } from './firebase-config.js';
import { 
    collection, 
    query, 
    getDocs, 
    orderBy, 
    doc, 
    updateDoc 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Check if admin is logged in
function checkAdminLoggedIn() {
    const adminSession = localStorage.getItem('adminSessionId');
    if (!adminSession) {
        window.location.href = 'admin-login.html';
        return false;
    }
    return true;
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
        showNotification('Erreur lors du chargement des joueurs', 'error');
        return [];
    }
}

// Display global leaderboard
async function displayGlobalLeaderboard() {
    const players = await getAllPlayers();
    const tbody = document.getElementById('leaderboardBody');
    
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
            <tr class="player-row">
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
                    <button class="btn-reset-mini" data-player-uid="${player.uid}" data-player-name="${player.displayName || 'Joueur anonyme'}" title="Réinitialiser ce joueur">🔄 Reset</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    
    // Add event listeners to reset buttons
    document.querySelectorAll('.btn-reset-mini').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const playerUID = btn.dataset.playerUid;
            const playerName = btn.dataset.playerName;
            await resetPlayerScore(playerUID, playerName);
        });
    });
}

// Display theme leaderboard
async function displayThemeLeaderboard(theme, difficulty) {
    const players = await getAllPlayers();
    const tbody = document.getElementById('leaderboardBody');
    
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
    
    let html = '';
    filteredPlayers.forEach((player, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        const avatarImage = player.avatarImage || 'alien1.png';
        
        html += `
            <tr class="player-row">
                <td>${medal || (index + 1)}</td>
                <td>
                    <div class="player-row">
                        <div class="lb-avatar" style="background-image: url('image/avatars/${avatarImage}'); background-size: contain; background-position: center; background-repeat: no-repeat;"></div>
                        <span>${player.displayName || 'Joueur anonyme'}</span>
                    </div>
                </td>
                <td><span class="level-badge">Niveau ${player.level || 1}</span></td>
                <td><strong>${player.themeXP}</strong> XP</td>
                <td>
                    <button class="btn-reset-mini" data-player-uid="${player.uid}" data-player-name="${player.displayName || 'Joueur anonyme'}" title="Réinitialiser ce joueur">🔄 Reset</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    
    // Add event listeners to reset buttons
    document.querySelectorAll('.btn-reset-mini').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const playerUID = btn.dataset.playerUid;
            const playerName = btn.dataset.playerName;
            await resetPlayerScore(playerUID, playerName);
        });
    });
}

// Reset player score
async function resetPlayerScore(playerUID, playerName) {
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
            await refreshLeaderboard();
        } catch (error) {
            console.error('Error resetting player score:', error);
            showNotification('Erreur lors de la réinitialisation', 'error');
        }
    }
}

// Refresh leaderboard based on selected option
async function refreshLeaderboard() {
    const select = document.getElementById('leaderboardSelect');
    const value = select.value;
    
    if (value === 'global') {
        await displayGlobalLeaderboard();
    } else {
        const parts = value.split('-');
        const theme = parts.slice(0, -1).join('-');
        const difficulty = parts[parts.length - 1];
        await displayThemeLeaderboard(theme, difficulty);
    }
    
    await updateGlobalStats();
}

// Update global statistics
async function updateGlobalStats() {
    const players = await getAllPlayers();
    
    const totalPlayers = players.length;
    const activePlayers = players.filter(p => (p.totalXP || 0) > 0).length;
    const totalXP = players.reduce((sum, p) => sum + (p.totalXP || 0), 0);
    const totalGames = players.reduce((sum, p) => sum + (p.totalQuestions || 0), 0);
    
    document.getElementById('totalPlayers').textContent = totalPlayers;
    document.getElementById('activePlayers').textContent = activePlayers;
    document.getElementById('totalXP').textContent = totalXP;
    document.getElementById('totalGames').textContent = totalGames;
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    if (!checkAdminLoggedIn()) return;
    
    // Setup logout button
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', async function() {
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                try {
                    await signOut(auth);
                    localStorage.removeItem('adminSessionId');
                    window.location.href = 'admin-login.html';
                } catch (error) {
                    console.error('Logout error:', error);
                }
            }
        });
    }
    
    // Setup refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshLeaderboard);
    }
    
    // Setup leaderboard selector
    const leaderboardSelect = document.getElementById('leaderboardSelect');
    if (leaderboardSelect) {
        leaderboardSelect.addEventListener('change', refreshLeaderboard);
    }
    
    // Initial load
    await refreshLeaderboard();
});
