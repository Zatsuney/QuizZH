// Waiting room logic with Firebase
import { listenToActiveRound, updatePlayerStatus, registerPlayer, getActiveRound, listenToPlayers, getPlayers } from './firebase-db.js';
import { auth } from './firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function isPlayerLoggedIn() {
    return localStorage.getItem('quizZH_playerName') !== null;
}

document.addEventListener('DOMContentLoaded', async () => {
    // Redirect if not logged in
    if (!isPlayerLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    let isRedirecting = false; // Guard against multiple redirects

    const playerName = localStorage.getItem('quizZH_playerName');
    const playerDisplay = document.getElementById('playerDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    const backBtn = document.getElementById('backBtn');

    // Update player display
    if (playerDisplay) {
        playerDisplay.textContent = playerName;
    }

    // Back button - return to mode selection
    if (backBtn) {
        backBtn.addEventListener('click', async function() {
            try {
                // Unregister player from Firestore
                const { unregisterPlayer } = await import('./firebase-db.js');
                await unregisterPlayer(playerName);
                
                // Clear game mode
                localStorage.removeItem('quizZH_gameMode');
                
                showNotification('Retour aux menus', 'info');
                
                // Redirect to game mode selection
                setTimeout(() => {
                    window.location.href = 'game-mode-selection.html';
                }, 500);
            } catch (error) {
                console.error('Back button error:', error);
                showNotification('Erreur lors du retour', 'error');
            }
        });
    }

    // Register player in game (ensure they exist in Firebase)
    console.log(`👤 Player entered waiting room: ${playerName}`);
    await registerPlayer(playerName, 'tournament');

    // Update player status to waiting
    await updatePlayerStatus(playerName, 'waiting', 'Salle d\'attente');

    // Listen for players count changes (real-time)
    listenToPlayers(async (playersData) => {
      const playerCount = document.getElementById('playerCount');
      if (playerCount) {
        const totalPlayers = Object.keys(playersData).length;
        const waitingPlayers = Object.values(playersData).filter(p => p.status === 'waiting').length;
        playerCount.textContent = `Joueurs en attente: ${waitingPlayers}`;
        console.log(`Joueurs connectés: ${totalPlayers}, En attente: ${waitingPlayers}`);
      }
    });

    // Listen for active round changes (real-time)
    listenToActiveRound(async (activeRoundData) => {
        if (activeRoundData && activeRoundData.round && !isRedirecting) {
            isRedirecting = true;
            const roundNumber = activeRoundData.round;
            console.log(`Round ${roundNumber} started!`);
            // Update player status to waiting for round state
            await updatePlayerStatus(playerName, 'waiting', `Manche ${roundNumber}`);
            
            // Redirect to round page after a small delay
            setTimeout(() => {
                window.location.href = `round-${roundNumber}.html`;
            }, 500);
        }
    });

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function() {
            try {
                // Unregister player from Firestore
                const { unregisterPlayer } = await import('./firebase-db.js');
                await unregisterPlayer(playerName);
                
                // Sign out from Firebase Auth
                await signOut(auth);
                
                // Clear localStorage
                localStorage.removeItem('quizZH_playerName');
                localStorage.removeItem('quizZH_playerUID');
                
                showNotification('Déconnecté', 'info');
                
                // Redirect to login
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } catch (error) {
                console.error('Logout error:', error);
                showNotification('Erreur de déconnexion', 'error');
            }
        });
    }
});
