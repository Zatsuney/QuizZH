import { 
  calculateFinalScores, 
  saveFinalLeaderboard, 
  getFinalLeaderboard,
  calculateRoundScores,
  getAnswers
} from './firebase-db.js';

let finalLeaderboard = [];

// Initialize the final leaderboard page
export async function initFinalLeaderboard() {
  const tableBody = document.getElementById('leaderboardTableBody');
  const statusEl = document.getElementById('tournamentStatus');
  const backBtn = document.getElementById('backHomeBtn');

  if (!tableBody) {
    console.warn('Leaderboard elements not found');
    return;
  }

  try {
    // Calculate final scores
    console.log('📊 Calculating final scores...');
    finalLeaderboard = await calculateFinalScores();
    
    // Save to database
    if (finalLeaderboard.length > 0) {
      await saveFinalLeaderboard(finalLeaderboard);
    }

    // Display leaderboard
    displayLeaderboard(finalLeaderboard, tableBody, statusEl);

  } catch (error) {
    console.error('Error initializing final leaderboard:', error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 30px;">
          <p>❌ Erreur lors du chargement du classement.</p>
        </td>
      </tr>
    `;
  }

  // Back button handler
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
}

function displayLeaderboard(leaderboard, tableBody, statusEl) {
  if (leaderboard.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 30px;">
          <p>Aucun joueur n'a complété le quiz.</p>
        </td>
      </tr>
    `;
    statusEl.textContent = 'Tournoi en cours...';
    return;
  }

  let html = '';
  leaderboard.forEach((entry) => {
    const { rank, displayName, totalScore, totalTime } = entry;
    
    // Format time
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    const timeStr = totalTime > 0 ? `${minutes}m ${seconds}s` : '--';

    // Get rank badge
    let badgeClass = 'other';
    let medal = rank;
    
    if (rank === 1) {
      badgeClass = 'first';
      medal = '🥇';
    } else if (rank === 2) {
      badgeClass = 'second';
      medal = '🥈';
    } else if (rank === 3) {
      badgeClass = 'third';
      medal = '🥉';
    }

    html += `
      <tr>
        <td>
          <span class="rank-badge ${badgeClass}">
            ${medal}
          </span>
        </td>
        <td class="player-name">${escapeHtml(displayName)}</td>
        <td class="score-value">${totalScore} pts</td>
        <td class="time-value">${timeStr}</td>
      </tr>
    `;
  });

  tableBody.innerHTML = html;
  
  // Update status with winner
  const winner = leaderboard[0];
  if (winner) {
    statusEl.textContent = `🎉 Bravo à ${winner.displayName} pour cette victoire!`;
  }

  // Update refresh time
  updateRefreshTime();
}

function updateRefreshTime() {
  const refreshEl = document.getElementById('refreshTime');
  if (refreshEl) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    refreshEl.textContent = `${hours}:${mins}`;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFinalLeaderboard);
} else {
  initFinalLeaderboard();
}
