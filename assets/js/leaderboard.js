import { calculateRoundScores } from './firebase-db.js';

let currentRound = null;
let leaderboardUnsubscribe = null;

// Get current round from URL
function getCurrentRoundNumber() {
  const path = window.location.pathname;
  const match = path.match(/round-(\d)/);
  if (match) {
    return parseInt(match[1]);
  }
  return null;
}

// Initialize leaderboard functionality
export function initLeaderboard() {
  currentRound = getCurrentRoundNumber();
  
  if (!currentRound) {
    console.error('Could not determine round number');
    return;
  }

  const leaderboardBtn = document.getElementById('leaderboardBtn');
  const closeLeaderboardBtn = document.getElementById('closeLeaderboardBtn');
  const leaderboardModal = document.getElementById('leaderboardModal');

  if (!leaderboardBtn || !closeLeaderboardBtn || !leaderboardModal) {
    console.warn('Leaderboard elements not found');
    return;
  }

  // Open modal
  leaderboardBtn.addEventListener('click', () => {
    leaderboardModal.style.display = 'flex';
    loadLeaderboard();
  });

  // Close modal
  closeLeaderboardBtn.addEventListener('click', () => {
    leaderboardModal.style.display = 'none';
  });

  // Close on modal background click
  leaderboardModal.addEventListener('click', (e) => {
    if (e.target === leaderboardModal) {
      leaderboardModal.style.display = 'none';
    }
  });
}

// Load and display leaderboard
async function loadLeaderboard() {
  const leaderboardList = document.getElementById('leaderboardList');
  
  if (!leaderboardList) return;

  try {
    leaderboardList.innerHTML = '<p>Chargement du classement...</p>';
    
    const scores = await calculateRoundScores(currentRound);
    
    if (scores.length === 0) {
      leaderboardList.innerHTML = '<p>Aucun joueur n\'a répondu pour le moment.</p>';
      return;
    }

    let html = '<div class="leaderboard-items">';
    
    scores.forEach((entry) => {
      const { rank, playerName, score } = entry;
      let medal = '';
      
      if (rank === 1) medal = '🥇';
      else if (rank === 2) medal = '🥈';
      else if (rank === 3) medal = '🥉';
      else medal = `${rank}`;

      html += `
        <div class="leaderboard-item">
          <span class="medal">${medal}</span>
          <span class="player-name">${playerName}</span>
          <span class="score">${score} pt${score !== 1 ? 's' : ''}</span>
        </div>
      `;
    });

    html += '</div>';
    leaderboardList.innerHTML = html;
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    leaderboardList.innerHTML = '<p>Erreur lors du chargement du classement.</p>';
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLeaderboard);
} else {
  initLeaderboard();
}
