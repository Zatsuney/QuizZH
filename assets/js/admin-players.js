// Admin Players Management
import { auth, db } from './firebase-config.js';
import { collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Check if admin is logged in
function checkAdminLoggedIn() {
    const adminSession = localStorage.getItem('adminSessionId');
    if (!adminSession) {
        window.location.href = 'admin-login.html';
        return null;
    }
    return adminSession;
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

// Get all players from users collection
async function getAllPlayers() {
    try {
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);
        const players = [];
        
        snapshot.forEach(doc => {
            const data = doc.data();
            players.push({
                uid: doc.id,
                displayName: data.displayName || 'Sans pseudo',
                email: data.email || '-',
                level: data.level || 1,
                totalXP: data.totalXP || 0,
                createdAt: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString('fr-FR') : '-',
                avatarImage: data.avatarImage || 'alien1.png'
            });
        });
        
        return players.sort((a, b) => b.totalXP - a.totalXP);
    } catch (error) {
        console.error('Error getting players:', error);
        return [];
    }
}

// Reset player data
async function resetPlayerData(uid, playerName) {
    if (!confirm(`Êtes-vous sûr de vouloir réinitialiser les données de ${playerName}? Cela supprimera tous les XP, le niveau et les statistiques.`)) {
        return;
    }
    
    try {
        const userDocRef = doc(db, 'users', uid);
        
        // All themes and difficulties to reset
        const themes = ['all', 'sciences', 'tech', 'geo', 'culture-pop', 'histoire', 'arts', 'musique', 'jeux-videos'];
        const difficulties = ['easy', 'medium', 'hard'];
        
        // Build reset object for all theme/difficulty combinations
        const resetStats = {
            level: 1,
            totalXP: 0,
            lastPlayedDate: null
        };
        
        // Reset all theme statistics to 0
        themes.forEach(theme => {
            difficulties.forEach(difficulty => {
                const statsKey = `stats_${theme}_${difficulty}`;
                resetStats[statsKey] = {
                    played: 0,
                    correctAnswers: 0,
                    totalQuestions: 0,
                    totalXP: 0
                };
            });
        });
        
        console.log('🔄 Resetting stats for:', uid);
        
        // Update user document with all reset values
        await updateDoc(userDocRef, resetStats);
        console.log('✅ Reset completed for:', uid);
        
        showNotification(`Données de ${playerName} réinitialisées complètement! ✅`, 'success');
        await loadAndDisplayPlayers();
    } catch (error) {
        console.error('Error resetting player data:', error);
        showNotification('Erreur lors de la réinitialisation', 'error');
    }
}

// Display players table
async function loadAndDisplayPlayers() {
    try {
        const players = await getAllPlayers();
        const playersDisplay = document.getElementById('playersDisplay');
        const searchInput = document.getElementById('searchInput');
        
        if (!playersDisplay) return;
        
        // Filter based on search
        const searchTerm = (searchInput?.value || '').toLowerCase();
        const filteredPlayers = players.filter(p => 
            p.displayName.toLowerCase().includes(searchTerm) ||
            p.email.toLowerCase().includes(searchTerm)
        );
        
        // Update statistics
        updateStats(players);
        
        if (filteredPlayers.length === 0) {
            playersDisplay.innerHTML = '<div class="empty-state">Aucun joueur trouvé</div>';
            return;
        }
        
        // Build table
        let tableHtml = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f3f4f6; border-bottom: 2px solid #e5e7eb;">
                        <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Pseudo</th>
                        <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Email</th>
                        <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151;">Niveau</th>
                        <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151;">XP Total</th>
                        <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Date d'inscription</th>
                        <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151;">Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        filteredPlayers.forEach((player, index) => {
            const rowBg = index % 2 === 0 ? '#ffffff' : '#f9fafb';
            tableHtml += `
                <tr style="background: ${rowBg}; border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 12px; color: #111827;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 32px; height: 32px; background-image: url('image/avatars/${player.avatarImage}'); background-size: cover; background-position: center; border-radius: 50%;"></div>
                            <span>${player.displayName}</span>
                        </div>
                    </td>
                    <td style="padding: 12px; color: #6b7280; font-size: 0.9em;">${player.email}</td>
                    <td style="padding: 12px; text-align: center; font-weight: 600; color: var(--primary-color);">${player.level}</td>
                    <td style="padding: 12px; text-align: center; color: #6b7280;">${player.totalXP.toLocaleString('fr-FR')}</td>
                    <td style="padding: 12px; color: #6b7280; font-size: 0.9em;">${player.createdAt}</td>
                    <td style="padding: 12px; text-align: center;">
                        <button class="btn-reset-player" data-uid="${player.uid}" data-name="${player.displayName}" style="
                            background: #fbbf24; color: #1f2937; border: none; padding: 6px 12px; border-radius: 4px; 
                            cursor: pointer; font-weight: 600; font-size: 0.85em; transition: all 0.3s ease;
                        " onmouseover="this.style.background='#f59e0b'" onmouseout="this.style.background='#fbbf24'">
                            🔄 Réinit
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tableHtml += `
                </tbody>
            </table>
        `;
        
        playersDisplay.innerHTML = tableHtml;
        
        // Add event listeners to reset buttons
        document.querySelectorAll('.btn-reset-player').forEach(btn => {
            btn.addEventListener('click', () => {
                const uid = btn.dataset.uid;
                const name = btn.dataset.name;
                resetPlayerData(uid, name);
            });
        });
    } catch (error) {
        console.error('Error loading players:', error);
    }
}

// Update statistics
async function updateStats(players) {
    const totalCount = document.getElementById('totalPlayersCount');
    const activeCount = document.getElementById('activePlayersCount');
    const avgXP = document.getElementById('averageXP');
    const avgLevel = document.getElementById('averageLevel');
    
    if (!totalCount) return;
    
    const total = players.length;
    const active = players.filter(p => p.totalXP > 0).length;
    const avgXPValue = total > 0 ? Math.round(players.reduce((sum, p) => sum + p.totalXP, 0) / total) : 0;
    const avgLevelValue = total > 0 ? (players.reduce((sum, p) => sum + p.level, 0) / total).toFixed(1) : 1;
    
    totalCount.textContent = total;
    if (activeCount) activeCount.textContent = active;
    if (avgXP) avgXP.textContent = avgXPValue.toLocaleString('fr-FR');
    if (avgLevel) avgLevel.textContent = avgLevelValue;
}

// Global functions for inline onclick handlers (if needed)
// Removed - using event listeners instead

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    checkAdminLoggedIn();
    
    // Load initial data
    await loadAndDisplayPlayers();
    
    // Setup search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', loadAndDisplayPlayers);
    }
    
    // Setup refresh button
    const refreshBtn = document.getElementById('refreshPlayersBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadAndDisplayPlayers);
    }
    
    // Setup logout button
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                localStorage.removeItem('adminSessionId');
                window.location.href = 'admin-login.html';
            } catch (error) {
                console.error('Logout error:', error);
            }
        });
    }
});
