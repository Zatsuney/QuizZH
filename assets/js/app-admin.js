// Admin panel logic with Firebase
import { 
  db, 
  auth 
} from './firebase-config.js';
import { 
  setActiveRound,
  getActiveRound,
  clearActiveRound,
  getPlayers,
  removePlayer,
  setCurrentQuestion,
  getCurrentQuestion,
  getAnswers,
  setAnswer,
  validateAnswer,
  setQuestionsOrder,
  getQuestionsOrder,
  clearRoundData,
  listenToPlayers,
  listenToAnswers,
  listenToActiveRound,
  calculateRoundScores,
  createPairingsFromRound,
  savePairings,
  initializeTeamsFromPairings,
  eliminateLastPlayers,
  keepTopPlayers
} from './firebase-db.js';
import { getQuestionsForRound, getQuestion, getTotalQuestionsInRound } from './questions.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Global state
let adminCurrentRound = null;
let adminCurrentQuestion = 1;
let allPlayersAnswers = {};
let answersUnsubscribe = null;
let roundsData = {
  1: { title: 'Manche 1', isRunning: false },
  2: { title: 'Manche 2', isRunning: false },
  3: { title: 'Manche 3', isRunning: false }
};

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// ===== MANCHES =====
async function startRoundAnswersListener(roundNumber) {
  // Détacher le listener précédent s'il existe
  if (answersUnsubscribe) {
    answersUnsubscribe();
  }

  // Créer un nouveau listener pour cette manche
  answersUnsubscribe = listenToAnswers(roundNumber, async (answers) => {
    allPlayersAnswers = answers;
    await updatePlayersAnswers();
  });

  // Afficher le panel de gestion des réponses
  const questionPanel = document.getElementById('questionManagement');
  if (questionPanel) {
    questionPanel.style.display = 'flex';
  }

  // Ajouter la classe pour layout spécial
  const adminLayout = document.querySelector('.admin-layout');
  if (adminLayout) {
    adminLayout.classList.add('round-active');
  }

  // Afficher les premières réponses
  await updateAdminQuestionDisplay();
  await updatePlayersAnswers();
}

async function toggleRound(roundNumber) {
  const roundCard = document.getElementById('round' + roundNumber);
  const button = roundCard.querySelector('.btn-start-round');
  const statusBadge = roundCard.querySelector('.round-status');
  const roundData = roundsData[roundNumber];

  // Si le bouton affiche "⏹️ Arrêter", c'est un arrêt
  if (button.textContent.includes('Arrêter')) {
    button.textContent = '🚀 Lancer';
    button.classList.remove('running');
    statusBadge.textContent = 'Inactive';
    statusBadge.classList.remove('active');
    roundData.isRunning = false;
    
    showNotification(`Manche ${roundNumber} arrêtée`, 'info');
    await stopRoundInternal(roundNumber);
    return;
  }

  // Arrêter toutes les autres manches
  for (let key in roundsData) {
    if (key != roundNumber && roundsData[key].isRunning) {
      await stopRoundInternal(parseInt(key));
    }
  }

  // Vérifier l'état actuel de la manche
  if (!roundData.isRunning) {
    // PREMIER CLIC: Afficher les règles
    roundData.isRunning = true;
    button.textContent = '▶️ Démarrer la manche';
    button.classList.add('running');
    statusBadge.textContent = 'Règles';
    statusBadge.classList.add('active');
    showNotification(`Règles affichées pour la Manche ${roundNumber}! 📋`, 'success');
    
    // Sauvegarder dans Firebase avec l'état "showingRules"
    await setActiveRound(roundNumber, 'showingRules');
    adminCurrentRound = roundNumber;
    adminCurrentQuestion = 1;
    await setCurrentQuestion(roundNumber, 1);

    // Démarrer le listener pour les réponses
    await startRoundAnswersListener(roundNumber);
  } else {
    // DEUXIÈME CLIC: Démarrer vraiment la manche
    button.textContent = '⏹️ Arrêter';
    statusBadge.textContent = 'En cours';
    showNotification(`Manche ${roundNumber} démarrée! 🚀`, 'success');
    
    // Passer tous les joueurs "ready" à "playing"
    try {
      const allPlayers = await getPlayers();
      for (const playerName of Object.keys(allPlayers)) {
        if (allPlayers[playerName].status === 'ready') {
          await updatePlayerStatus(playerName, 'playing', `Manche ${roundNumber}`);
        }
      }
    } catch (error) {
      console.error('Error updating player statuses:', error);
    }
    
    // Sauvegarder dans Firebase avec l'état "running"
    await setActiveRound(roundNumber, 'running');
  }
}

async function stopRoundInternal(roundNumber) {
  // Arrêter l'écoute des réponses
  if (answersUnsubscribe) {
    answersUnsubscribe();
    answersUnsubscribe = null;
  }

  // Supprimer la manche active
  await clearActiveRound();
  
  // Nettoyer toutes les données de cette manche
  await clearRoundData(roundNumber);
  
  // Reset player statuses back to waiting
  const allPlayers = await getPlayers();
  for (const playerName of Object.keys(allPlayers)) {
    await updatePlayerStatus(playerName, 'waiting', 'Salle d\'attente');
  }
  
  adminCurrentRound = null;
  adminCurrentQuestion = 1;

  // Masquer le panel de gestion des réponses
  const questionPanel = document.getElementById('questionManagement');
  if (questionPanel) {
    questionPanel.style.display = 'none';
  }

  // Retirer la classe de layout spécial
  const adminLayout = document.querySelector('.admin-layout');
  if (adminLayout) {
    adminLayout.classList.remove('round-active');
  }

  // Rafraîchir l'affichage des joueurs qui restent
  await updatePlayersDisplay();
  showNotification('Tous les joueurs sont revenus à la salle d\'attente', 'info');
}

// ===== JOUEURS =====
async function syncPlayersFromLocalStorage() {
  /**
   * Force sync: enregistre les joueurs depuis la salle d'attente vers Firebase
   */
  try {
    console.log('🔄 Syncing players from waiting room...');
    // Dans une vrai app, on aurait une table de joueurs actifs
    // Pour maintenant, on compte juste sur registerPlayer() depuis les clients
    await updatePlayersDisplay();
  } catch (error) {
    console.error('Error syncing players:', error);
  }
}

async function updatePlayersDisplay() {
  try {
    const allPlayers = await getPlayers();
    console.log('All players from Firebase:', allPlayers);
    
    const displayPlayers = Object.values(allPlayers).slice(0, 20);
    
    const totalPlayers = Object.keys(allPlayers).length;
    const waitingPlayers = Object.values(allPlayers).filter(p => p.status === 'waiting').length;
    const playingPlayers = Object.values(allPlayers).filter(p => p.status === 'playing').length;

    console.log(`Total: ${totalPlayers}, Waiting: ${waitingPlayers}, Playing: ${playingPlayers}`);

    // Update counts
    const totalCount = document.getElementById('totalPlayers');
    const waitingCount = document.getElementById('waitingPlayers');
    const playingCount = document.getElementById('playingPlayers');

    if (totalCount) totalCount.textContent = totalPlayers;
    if (waitingCount) waitingCount.textContent = waitingPlayers;
    if (playingCount) playingCount.textContent = playingPlayers;

    // Display players grid
    const playersGrid = document.getElementById('playersGrid');
    if (!playersGrid) return;

    if (displayPlayers.length === 0) {
      playersGrid.innerHTML = '<div class="empty-state">Aucun joueur connecté</div>';
      return;
    }

    let playersHtml = '';
    displayPlayers.forEach(player => {
      let statusBadge = '';
      let playerCardClass = '';
      
      if (player.status === 'playing') {
        statusBadge = `<span class="player-status-badge playing">▶️ En jeu</span>`;
      } else if (player.status === 'ready') {
        statusBadge = `<span class="player-status-badge ready">✅ Prêt</span>`;
        playerCardClass = 'ready';
      } else {
        statusBadge = `<span class="player-status-badge waiting">⏱️ Attente</span>`;
      }

      playersHtml += `
        <div class="player-card ${playerCardClass}">
          <span class="player-name">${player.name}</span>
          <span class="player-info">
            ${statusBadge}
          </span>
          <span class="player-info">${player.room || '-'}</span>
          <button class="btn-player-remove" onclick="removePlayerFromAdmin('${player.name}')">Retirer</button>
        </div>
      `;
    });

    playersGrid.innerHTML = playersHtml;
  } catch (error) {
    console.error('Error updating players display:', error);
  }
}

window.removePlayerFromAdmin = async function(playerName) {
  if (confirm(`Êtes-vous sûr de vouloir retirer ${playerName}?`)) {
    try {
      // Marquer le joueur pour suppression
      await removePlayer(playerName);
      showNotification(`${playerName} a été retiré`, 'info');
      await updatePlayersDisplay();
    } catch (error) {
      console.error('Error removing player:', error);
      showNotification('Erreur lors de la suppression', 'error');
    }
  }
};

// ===== GESTION DES RÉPONSES =====
async function updateAdminQuestionDisplay() {
  if (!adminCurrentRound) return;

  // Respecter l'ordre aléatoire des questions
  const questionsOrder = await getQuestionsOrder(adminCurrentRound);
  
  if (!questionsOrder || questionsOrder.length === 0) {
    document.getElementById('currentQuestionText').textContent = 'En attente du démarrage des joueurs...';
    document.getElementById('questionNumber').textContent = '-';
    return;
  }

  // Récupérer le numéro de question selon l'ordre aléatoire
  const questionNumberFromOrder = questionsOrder[adminCurrentQuestion - 1];
  const question = getQuestion(adminCurrentRound, questionNumberFromOrder);

  const questionText = document.getElementById('currentQuestionText');
  const questionNumber = document.getElementById('questionNumber');

  if (question) {
    questionText.textContent = question.text;
    questionNumber.textContent = `${question.number}/${getTotalQuestionsInRound(adminCurrentRound)}`;
  } else {
    questionText.textContent = `Question ${adminCurrentQuestion} non trouvée`;
    questionNumber.textContent = '-';
  }
}

async function updatePlayersAnswers() {
  if (!adminCurrentRound) return;

  try {
    // Charger les réponses du Firebase
    const answersData = await getAnswers(adminCurrentRound);
    allPlayersAnswers = answersData;

    const answersList = document.getElementById('answersList');
    const answersCount = document.getElementById('answersCount');

    if (!answersList) return;

    // Respecter l'ordre aléatoire des questions
    const questionsOrder = await getQuestionsOrder(adminCurrentRound);
    const questionNumberFromOrder = questionsOrder && questionsOrder.length > 0 
      ? questionsOrder[adminCurrentQuestion - 1] 
      : adminCurrentQuestion;

    // Compter les joueurs qui ont répondu
    let respondedCount = 0;
    let answeredHtml = '';

    // Parcourir tous les joueurs connectés réels
    const allPlayers = await getPlayers();
    const playerNames = Object.keys(allPlayers);

    playerNames.forEach(playerName => {
      const playerAnswer = allPlayersAnswers[playerName]?.[questionNumberFromOrder];

      if (playerAnswer?.answer) {
        respondedCount++;

        let validationClass = '';
        let validationButton = '';

        if (playerAnswer.validated === true) {
          validationClass = 'answer-item-validated';
          validationButton = `<button class="validation-badge validated" onclick="toggleAnswerValidation('${playerName}', ${questionNumberFromOrder}, true)" title="Cliquer pour rejeter">✓ Validée</button>`;
        } else if (playerAnswer.validated === false) {
          validationClass = 'answer-item-rejected';
          validationButton = `<button class="validation-badge rejected" onclick="toggleAnswerValidation('${playerName}', ${questionNumberFromOrder}, false)" title="Cliquer pour valider">✗ Rejetée</button>`;
        } else {
          validationButton = `
            <div class="validation-buttons">
              <button class="btn-validate" onclick="validateAnswerFromAdmin('${playerName}', ${questionNumberFromOrder}, true)">✓</button>
              <button class="btn-reject" onclick="validateAnswerFromAdmin('${playerName}', ${questionNumberFromOrder}, false)">✗</button>
            </div>
          `;
        }

        answeredHtml += `
          <div class="answer-item ${validationClass}">
            <div class="answer-player">
              <span class="player-name">${playerName}</span>
              <span class="player-answer">"${playerAnswer.answer}"</span>
            </div>
            <div class="answer-actions">
              ${validationButton}
            </div>
          </div>
        `;
      }
    });

    // Afficher le nombre de joueurs qui ont répondu
    answersCount.textContent = `${respondedCount} joueur${respondedCount > 1 ? 's' : ''} ${respondedCount > 0 ? 'ont répondu' : 'attendant'}`;

    if (answeredHtml) {
      answersList.innerHTML = answeredHtml;
    } else {
      answersList.innerHTML = '<div class="empty-state">En attente des réponses des joueurs...</div>';
    }
  } catch (error) {
    console.error('Error updating answers:', error);
  }
}

async function updateAdminLeaderboard() {
  if (!adminCurrentRound) return;

  try {
    const scores = await calculateRoundScores(adminCurrentRound);
    const leaderboardDiv = document.getElementById('adminLeaderboard');
    
    if (!leaderboardDiv) return;

    if (!scores || scores.length === 0) {
      leaderboardDiv.innerHTML = '<div class="empty-state">Aucun score pour le moment...</div>';
      return;
    }

    // Scores est déjà un tableau trié
    let leaderboardHTML = '';
    scores.forEach((entry) => {
      const medalEmoji = 
        entry.rank === 1 ? '🥇' : 
        entry.rank === 2 ? '🥈' : 
        entry.rank === 3 ? '🥉' : 
        `#${entry.rank}`;

      leaderboardHTML += `
        <div class="leaderboard-entry">
          <div class="rank-badge">${medalEmoji}</div>
          <div class="player-info">
            <span class="player-name">${entry.playerName}</span>
            <span class="player-score">${entry.score} points</span>
          </div>
        </div>
      `;
    });

    leaderboardDiv.innerHTML = leaderboardHTML;
  } catch (error) {
    console.error('Error updating admin leaderboard:', error);
  }
}

window.validateAnswerFromAdmin = async function(playerName, questionNumber, isValid) {
  await validateAnswer(adminCurrentRound, playerName, questionNumber, isValid);
  await updatePlayersAnswers();
  showNotification(`Réponse de ${playerName} marquée comme ${isValid ? 'validée' : 'rejetée'}`, 'success');
};

window.toggleAnswerValidation = async function(playerName, questionNumber, currentStatus) {
  // Inverse le statut: true -> false, false -> true, null -> true
  const newStatus = currentStatus === true ? false : true;
  await validateAnswer(adminCurrentRound, playerName, questionNumber, newStatus);
  await updatePlayersAnswers();
  showNotification(`Réponse de ${playerName} changée en ${newStatus ? '✓ validée' : '✗ rejetée'}`, 'info');
};

async function moveToNextQuestion() {
  if (!adminCurrentRound) return;

  const totalQuestions = getTotalQuestionsInRound(adminCurrentRound);

  if (adminCurrentQuestion < totalQuestions) {
    adminCurrentQuestion++;
    await setCurrentQuestion(adminCurrentRound, adminCurrentQuestion);
    await updateAdminQuestionDisplay();
    await updatePlayersAnswers();
    showNotification(`Passage à la question ${adminCurrentQuestion}`, 'success');
  } else {
    showNotification('Toutes les questions ont été posées!', 'info');
    // Show finish round button if not the last round
    if (adminCurrentRound < 5) {
      const finishBtn = document.getElementById('finishRoundBtn');
      if (finishBtn) {
        finishBtn.style.display = 'block';
      }
    }
  }
}

async function finishRound() {
  if (!adminCurrentRound) return;

  try {
    const finishBtn = document.getElementById('finishRoundBtn');
    if (finishBtn) finishBtn.disabled = true;

    // Show success message
    showNotification(`✅ Manche ${adminCurrentRound} finalisée!`, 'success');

    // Hide finish button
    if (finishBtn) {
      finishBtn.style.display = 'none';
      finishBtn.disabled = false;
    }

  } catch (error) {
    console.error('Error finishing round:', error);
    showNotification('Erreur lors de la finalisation', 'error');
    const finishBtn = document.getElementById('finishRoundBtn');
    if (finishBtn) finishBtn.disabled = false;
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
  // Setup round buttons
  const startRoundButtons = document.querySelectorAll('.btn-start-round');
  
  startRoundButtons.forEach(button => {
    button.addEventListener('click', function() {
      const roundNumber = parseInt(this.getAttribute('data-round'));
      toggleRound(roundNumber);
    });
  });

  // Setup logout button
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', async function() {
      if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        try {
          await signOut(auth);
          localStorage.removeItem('quizZH_isAdmin');
          window.location.href = 'admin-login.html';
        } catch (error) {
          console.error('Logout error:', error);
        }
      }
    });
  }

  // Setup next question button
  const nextQuestionBtn = document.getElementById('nextQuestionBtn');
  if (nextQuestionBtn) {
    nextQuestionBtn.addEventListener('click', moveToNextQuestion);
  }

  // Setup finish round button
  const finishRoundBtn = document.getElementById('finishRoundBtn');
  if (finishRoundBtn) {
    finishRoundBtn.addEventListener('click', finishRound);
  }

  // Setup refresh players button
  const refreshPlayersBtn = document.getElementById('refreshPlayersBtn');
  if (refreshPlayersBtn) {
    refreshPlayersBtn.addEventListener('click', async () => {
      console.log('🔄 Refresh button clicked');
      showNotification('Actualisation des joueurs...', 'info');
      await updatePlayersDisplay();
      console.log('🔄 Players refreshed');
    });
  }

  // Restore active round state
  const activeRound = await getActiveRound();
  if (activeRound) {
    const roundNum = activeRound;
    roundsData[roundNum].isRunning = true;
    const roundCard = document.getElementById('round' + roundNum);
    if (roundCard) {
      const button = roundCard.querySelector('.btn-start-round');
      const statusBadge = roundCard.querySelector('.round-status');
      button.textContent = '⏹️ Arrêter';
      button.classList.add('running');
      statusBadge.textContent = 'Active';
      statusBadge.classList.add('active');
    }
    adminCurrentRound = roundNum;
    adminCurrentQuestion = await getCurrentQuestion(roundNum) || 1;

    // Redémarrer le listener des réponses
    await startRoundAnswersListener(roundNum);
  }

  // Initial display
  await updatePlayersDisplay();

  // Listen to real-time changes
  listenToPlayers(async (players) => {
    await updatePlayersDisplay();
  });

  listenToActiveRound(async (activeRoundData) => {
    if (activeRoundData && activeRoundData.round && activeRoundData.round !== adminCurrentRound) {
      const roundNum = activeRoundData.round;
      roundsData[roundNum].isRunning = true;
      adminCurrentRound = roundNum;
      adminCurrentQuestion = 1;
      await setCurrentQuestion(roundNum, 1);
      
      // Démarrer le listener des réponses
      await startRoundAnswersListener(roundNum);
    } else if (!activeRoundData || !activeRoundData.round) {
      if (adminCurrentRound) {
        adminCurrentRound = null;
        const questionPanel = document.getElementById('questionManagement');
        if (questionPanel) questionPanel.style.display = 'none';
        const adminLayout = document.querySelector('.admin-layout');
        if (adminLayout) adminLayout.classList.remove('round-active');

        // Arrêter le listener
        if (answersUnsubscribe) {
          answersUnsubscribe();
          answersUnsubscribe = null;
        }
      }
    }
  });

  // Polling for question changes
  setInterval(async () => {
    if (adminCurrentRound) {
      const storedQuestion = await getCurrentQuestion(adminCurrentRound);
      if (storedQuestion && storedQuestion !== adminCurrentQuestion) {
        adminCurrentQuestion = storedQuestion;
        await updateAdminQuestionDisplay();
        await updatePlayersAnswers();
        await updateAdminLeaderboard();
      }
      await updatePlayersAnswers();
      await updateAdminLeaderboard();
    }
  }, 2000);
});
