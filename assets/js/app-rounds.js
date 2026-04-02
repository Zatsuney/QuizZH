// Rounds logic with Firebase
import { 
  db, 
  auth 
} from './firebase-config.js';
import { 
  setActiveRound,
  getActiveRound,
  getActiveRoundData,
  clearActiveRound,
  getCurrentQuestion,
  setCurrentQuestion,
  getAnswers,
  setAnswer,
  setQuestionsOrder,
  getQuestionsOrder,
  updatePlayerStatus,
  removePlayer,
  listenToActiveRound,
  listenToCurrentQuestion,
  listenToAnswers,
  getPlayers
} from './firebase-db.js';
import { getQuestionsForRound, getQuestion, getTotalQuestionsInRound, generateQuestionOrder, getRulesForRound } from './questions.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Global state
let playerUID = null;
let playerName = null;
let currentRoundNumber = null;
let currentQuestionNumber = 1;
let roundState = null; // 'showingRules', 'running', or null
let roundStateUnsubscribe = null;
let totalQuestionsInRound = 0;
let shuffledQuestionOrder = [];
let timerInterval = null;
let timerStartTime = null;
const TIMER_DURATION = 15; // seconds
let playerAnswersSubmitted = {};
let isGameOver = false;
let answersUnsubscribe = null;
let totalPlayersInRound = 0;
let allPlayersAnswered = false;

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function updateProgressBar() {
  const progressBar = document.getElementById('progressBar');
  const questionProgress = document.getElementById('questionProgress');

  if (progressBar && questionProgress) {
    const progress = (currentQuestionNumber / totalQuestionsInRound) * 100;
    progressBar.style.width = progress + '%';
    questionProgress.textContent = `${currentQuestionNumber}/${totalQuestionsInRound}`;
  }
}

function startTimer() {
  // Clear any existing timer
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  allPlayersAnswered = false;
  resetAnswerDisplay();

  timerStartTime = Date.now();
  const timerValue = document.getElementById('timerValue');
  const timerBadge = document.querySelector('.timer-badge');

  if (!timerValue || !timerBadge) return;

  let timeRemaining = TIMER_DURATION;

  // Setup listener to watch for all players answering
  setupAnswersWatcher();

  // Update every 100ms for smooth animation
  timerInterval = setInterval(() => {
    const elapsedMs = Date.now() - timerStartTime;
    timeRemaining = Math.max(0, TIMER_DURATION - Math.floor(elapsedMs / 1000));

    // Update display
    timerValue.textContent = timeRemaining;

    // Warning state when < 5 seconds
    if (timeRemaining <= 5) {
      timerBadge.classList.add('warning');
    } else {
      timerBadge.classList.remove('warning');
    }

    // Check if all players answered (before time runs out)
    if (allPlayersAnswered && timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      showWaitingMessage();
      return;
    }

    // Time's up!
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerValue.textContent = '0';
      
      // Disable input
      const answerInput = document.getElementById('answerInput');
      const submitButton = document.querySelector('#answerForm button[type="submit"]');
      if (answerInput && !answerInput.disabled) {
        answerInput.disabled = true;
        answerInput.style.opacity = '0.7';
      }
      if (submitButton && !submitButton.disabled) {
        submitButton.disabled = true;
        submitButton.textContent = '⏱️ Temps écoulé';
        submitButton.style.opacity = '0.6';
      }
      
      showWaitingMessage();
      showNotification('⏱️ Temps écoulé!', 'info');
    }
  }, 100);
}

function setupAnswersWatcher() {
  // Unsubscribe from previous listener
  if (answersUnsubscribe) {
    answersUnsubscribe();
  }

  // Get question number from order
  const questionNumberFromOrder = shuffledQuestionOrder[currentQuestionNumber - 1];

  // Listen to answers for this question
  answersUnsubscribe = listenToAnswers(currentRoundNumber, async (answersData) => {
    // Count how many players answered this question
    let answeredCount = 0;
    
    Object.entries(answersData).forEach(([playerName, answers]) => {
      if (answers[questionNumberFromOrder]?.answer) {
        answeredCount++;
      }
    });

    // Check if all players have answered
    if (totalPlayersInRound > 0 && answeredCount >= totalPlayersInRound) {
      allPlayersAnswered = true;
      
      // Arrêter le timer s'il est encore actif
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      
      // Afficher le message d'attente
      showWaitingMessage();
    }
  });
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function showWaitingMessage() {
  const answerForm = document.getElementById('answerForm');
  const waitingMessage = document.getElementById('waitingMessage');
  
  if (answerForm) {
    answerForm.style.display = 'none';
  }
  
  if (waitingMessage) {
    waitingMessage.style.display = 'block';
  }
}

function resetAnswerDisplay() {
  const waitingMessage = document.getElementById('waitingMessage');
  if (waitingMessage) {
    waitingMessage.style.display = 'none';
  }
}

function showRulesModal() {
  console.log('showRulesModal called');
  const rulesModal = document.getElementById('rulesModal');
  const rulesList = document.getElementById('rulesList');
  const readyBtn = document.getElementById('readyBtn');
  
  console.log('Elements found:', { rulesModal: !!rulesModal, rulesList: !!rulesList, readyBtn: !!readyBtn });
  
  if (!rulesModal || !rulesList) {
    console.error('Rules modal or rules list not found in DOM');
    return;
  }
  
  const rules = getRulesForRound(currentRoundNumber);
  console.log('Rules to display:', rules);
  
  // Build HTML for rules
  let rulesHTML = '<ul>';
  rules.forEach(rule => {
    rulesHTML += `<li>${rule}</li>`;
  });
  rulesHTML += '</ul>';
  
  rulesList.innerHTML = rulesHTML;
  rulesModal.style.display = 'flex';
  console.log('Rules modal display set to flex');
  
  // Handle ready button click
  if (readyBtn) {
    readyBtn.style.opacity = '1';
    readyBtn.style.cursor = 'pointer';
    readyBtn.disabled = false;
    readyBtn.textContent = '✅ Prêt';
    
    readyBtn.onclick = async () => {
      // Mark player as ready
      readyBtn.disabled = true;
      readyBtn.textContent = '⏳ En attente...';
      readyBtn.style.opacity = '0.6';
      
      // Update player status to include ready state
      await updatePlayerStatus(playerName, 'ready', `Manche ${currentRoundNumber}`);
    };
  }
}

function hideRulesModal() {
  const rulesModal = document.getElementById('rulesModal');
  if (rulesModal) {
    rulesModal.style.display = 'none';
  }
}

function setupRoundStateListener() {
  // Unsubscribe from previous listener
  if (roundStateUnsubscribe) {
    roundStateUnsubscribe();
  }

  // Listen to active round state changes
  roundStateUnsubscribe = listenToActiveRound(async (activeRoundData) => {
    console.log('Listener received:', activeRoundData);
    
    // If no active round, redirect to waiting room
    if (!activeRoundData || !activeRoundData.round) {
      console.log('Round stopped, redirecting to waiting room...');
      showNotification('Manche terminée, retour à la salle d\'attente...', 'info');
      setTimeout(() => {
        window.location.href = 'waiting-room.html';
      }, 1000);
      return;
    }

    const activeRound = activeRoundData.round;
    const newState = activeRoundData.state || 'running'; // Default to 'running' for backward compatibility

    console.log(`Round: ${activeRound}, State: ${newState}, Current Round: ${currentRoundNumber}`);

    // If this is not our round, ignore
    if (activeRound !== currentRoundNumber) {
      console.log('Different round, ignoring...');
      return;
    }

    roundState = newState;

    if (newState === 'showingRules') {
      console.log('Showing rules modal...');
      // Show rules modal
      showRulesModal();
    } else if (newState === 'running') {
      console.log('Starting round, hiding rules and showing questions...');
      // Hide rules and show questions
      hideRulesModal();
      displayCurrentQuestion();
      
      // Update player status to playing (in background)
      updatePlayerStatus(playerName, 'playing', `Manche ${currentRoundNumber}`).catch(error => {
        console.error('Error updating player status:', error);
      });
    }
  });

  // Check initial state when listener is set up
  console.log('Checking initial round state...');
  getActiveRoundData().then((initialState) => {
    console.log('Initial state:', initialState);
    if (initialState && initialState.round === currentRoundNumber) {
      // Manually trigger the listener with initial state
      console.log('Triggering initial state handler...');
      if (initialState.state === 'showingRules') {
        showRulesModal();
      } else if (initialState.state === 'running') {
        hideRulesModal();
        displayCurrentQuestion();
      }
    }
  });
}

async function initializeGameState() {
  console.log('Initializing game state...');
  // Récupérer les données du joueur (avec les bonnes clés)
  playerUID = localStorage.getItem('quizZH_playerUID');
  playerName = localStorage.getItem('quizZH_playerName');

  if (!playerUID || !playerName) {
    window.location.href = 'index.html';
    return;
  }

  // Extraire le numéro de manche de l'URL (ex: round-2.html)
  const currentPageUrl = window.location.pathname;
  const roundMatch = currentPageUrl.match(/round-(\d+)/);
  if (roundMatch) {
    currentRoundNumber = parseInt(roundMatch[1]);
  }

  // Mettre à jour le statut du joueur
  await updatePlayerStatus(playerName, 'waiting', `Manche ${currentRoundNumber}`);

  // Récupérer l'ordre aléatoire des questions (créé par le premier joueur ou l'admin)
  let questionOrder = await getQuestionsOrder(currentRoundNumber);

  // Si pas encore d'ordre (premier joueur arrivé), générer et sauvegarder
  if (!questionOrder || questionOrder.length === 0) {
    questionOrder = generateQuestionOrder(currentRoundNumber);
    await setQuestionsOrder(currentRoundNumber, questionOrder);
    shuffledQuestionOrder = questionOrder;
  } else {
    shuffledQuestionOrder = questionOrder;
  }

  // Récupérer les réponses existantes du joueur
  try {
    const allAnswers = await getAnswers(currentRoundNumber);
    if (allAnswers[playerName]) {
      playerAnswersSubmitted = allAnswers[playerName] || {};
    }
  } catch (error) {
    console.error('Error fetching answers:', error);
  }

  totalQuestionsInRound = getTotalQuestionsInRound(currentRoundNumber);
  
  // Récupérer la question actuelle
  const storedCurrentQuestion = await getCurrentQuestion(currentRoundNumber);
  if (storedCurrentQuestion) {
    currentQuestionNumber = storedCurrentQuestion;
  } else {
    currentQuestionNumber = 1;
    await setCurrentQuestion(currentRoundNumber, 1);
  }

  // Écouter les changements d'état de la manche (affichage des règles ou démarrage)
  console.log('Game state initialized. Setting up round state listener...');
  console.log('currentRoundNumber:', currentRoundNumber, 'totalQuestionsInRound:', totalQuestionsInRound, 'currentQuestionNumber:', currentQuestionNumber);
  setupRoundStateListener();
  updateProgressBar();
}

async function displayCurrentQuestion() {
  console.log('displayCurrentQuestion called, question number:', currentQuestionNumber, 'total:', totalQuestionsInRound);
  
  const questionContainer = document.getElementById('questionContainer');
  const answerForm = document.getElementById('answerForm');
  const answerInput = document.getElementById('answerInput');
  const gameEndCard = document.getElementById('gameEndCard');
  const playerNameDisplay = document.getElementById('playerNameDisplay');

  // Afficher le nom du joueur
  if (playerNameDisplay) {
    playerNameDisplay.textContent = playerName;
  }

  if (currentQuestionNumber > totalQuestionsInRound) {
    // Jeu terminé
    if (questionContainer) questionContainer.style.display = 'none';
    if (answerForm) answerForm.style.display = 'none';
    if (gameEndCard) gameEndCard.style.display = 'block';
    isGameOver = true;
    showNotification('Manche terminée! Bravo! 🎉', 'success');
    
    // If it's the final round (round 3), redirect to leaderboard after 3 seconds
    if (currentRoundNumber === 3) {
      setTimeout(() => {
        window.location.href = 'leaderboard.html';
      }, 3000);
    }
    
    return;
  }

  // Récupérer le numéro de question selon l'ordre aléatoire
  const questionNumberFromOrder = shuffledQuestionOrder[currentQuestionNumber - 1];
  const question = getQuestion(currentRoundNumber, questionNumberFromOrder);

  if (!question) {
    if (questionContainer) questionContainer.innerHTML = '<p>Question non trouvée</p>';
    return;
  }

  // Récupérer la réponse préalable si elle existe
  const previousAnswer = playerAnswersSubmitted[questionNumberFromOrder];
  const answerValue = previousAnswer?.answer || '';

  const questionText = document.getElementById('questionText');
  if (questionText) {
    questionText.textContent = question.text;
  }

  if (answerInput) {
    answerInput.value = answerValue;
    
    // Si réponse déjà soumise, désactiver
    if (previousAnswer?.answer) {
      answerInput.disabled = true;
      answerInput.style.opacity = '0.7';
      answerInput.style.backgroundColor = '#f3f4f6';
      
      const submitButton = document.querySelector('#answerForm button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = '✓ Réponse envoyée';
        submitButton.style.opacity = '0.6';
      }
    } else {
      // Réactiver si pas encore répondu
      answerInput.disabled = false;
      answerInput.style.opacity = '1';
      answerInput.style.backgroundColor = 'white';
      
      const submitButton = document.querySelector('#answerForm button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = '📤 Soumettre';
        submitButton.style.opacity = '1';
      }
    }
    
    if (!previousAnswer?.answer) {
      answerInput.focus();
    }
  }

  // Afficher le statut de la réponse
  const answerStatus = document.getElementById('answerStatus');
  if (answerStatus && previousAnswer) {
    if (previousAnswer.validated === true) {
      answerStatus.innerHTML = '<span style="color: #51c88a;">✓ Validée par l\'admin</span>';
      answerStatus.style.display = 'block';
    } else if (previousAnswer.validated === false) {
      answerStatus.innerHTML = '<span style="color: #ff6b6b;">✗ Rejetée par l\'admin</span>';
      answerStatus.style.display = 'block';
    } else {
      answerStatus.style.display = 'none';
    }
  }

  if (questionContainer) questionContainer.style.display = 'block';
  if (answerForm) answerForm.style.display = 'block';
  if (gameEndCard) gameEndCard.style.display = 'none';

  // Get total players count and reset timer state
  try {
    const allPlayers = await getPlayers();
    totalPlayersInRound = Object.keys(allPlayers).length;
  } catch (error) {
    console.error('Error getting players count:', error);
    totalPlayersInRound = 1; // Fallback to avoid division issues
  }
  
  // Reset answer display and completion flag for new question
  resetAnswerDisplay();
  allPlayersAnswered = false;
  
  // If previous listener exists, unsubscribe before starting new one
  if (answersUnsubscribe) {
    answersUnsubscribe();
    answersUnsubscribe = null;
  }

  // Start timer if answer not submitted yet
  if (!previousAnswer?.answer) {
    startTimer();
  } else {
    stopTimer();
  }
}

async function submitAnswer() {
  const answerInput = document.getElementById('answerInput');
  const submitButton = document.querySelector('#answerForm button[type="submit"]');
  if (!answerInput) return;

  const answer = answerInput.value.trim();

  if (!answer) {
    showNotification('Veuillez entrer une réponse!', 'error');
    return;
  }

  // Récupérer le numéro de question selon l'ordre aléatoire
  const questionNumberFromOrder = shuffledQuestionOrder[currentQuestionNumber - 1];

  // Vérifier si réponse déjà soumise
  if (playerAnswersSubmitted[questionNumberFromOrder]?.answer) {
    showNotification('Vous avez déjà répondu à cette question', 'info');
    return;
  }

  // Sauvegarder la réponse dans Firebase
  try {
    await setAnswer(currentRoundNumber, playerName, questionNumberFromOrder, answer);
    playerAnswersSubmitted[questionNumberFromOrder] = {
      answer: answer,
      validated: null,
      submittedAt: new Date().toISOString()
    };

    showNotification('Réponse soumise! ✓', 'success');
    
    // Stop timer when answer is submitted
    stopTimer();
    
    // Désactiver l'input et le bouton
    answerInput.disabled = true;
    answerInput.style.opacity = '0.7';
    answerInput.style.backgroundColor = '#f3f4f6';
    
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = '✓ Réponse envoyée';
      submitButton.style.opacity = '0.6';
    }
    
    // Check if all players have answered this question
    try {
      const allAnswers = await getAnswers(currentRoundNumber);
      const allPlayers = await getPlayers();
      const totalPlayers = Object.keys(allPlayers).length;
      
      // Count how many players answered this specific question
      let answeredCount = 0;
      Object.entries(allAnswers).forEach(([playerName, playerAnswers]) => {
        if (playerAnswers[questionNumberFromOrder]?.answer) {
          answeredCount++;
        }
      });
      
      if (answeredCount >= totalPlayers) {
        // All players have answered
        showWaitingMessage();
      }
    } catch (error) {
      console.error('Error checking if all players answered:', error);
    }
  } catch (error) {
    console.error('Error submitting answer:', error);
    showNotification('Erreur lors de la soumission', 'error');
  }
}

async function moveToNextQuestion() {
  const answerInput = document.getElementById('answerInput');

  if (currentQuestionNumber < totalQuestionsInRound) {
    const questionNumberFromOrder = shuffledQuestionOrder[currentQuestionNumber - 1];
    const answer = answerInput?.value.trim();

    // Si pas de réponse, demander confirmation
    if (!answer && !playerAnswersSubmitted[questionNumberFromOrder]) {
      const confirmMove = confirm('Vous n\'avez pas répondu à cette question. Continuer?');
      if (!confirmMove) return;
    }

    currentQuestionNumber++;
    await setCurrentQuestion(currentRoundNumber, currentQuestionNumber);
    await displayCurrentQuestion();
    updateProgressBar();
  } else if (currentQuestionNumber === totalQuestionsInRound) {
    // Passer à la prochaine (termine le jeu)
    currentQuestionNumber++;
    await displayCurrentQuestion();
    updateProgressBar();
  }
}

async function goToPreviousQuestion() {
  if (currentQuestionNumber > 1) {
    currentQuestionNumber--;
    await displayCurrentQuestion();
    updateProgressBar();
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
  // Vérifier si le joueur est connecté via localStorage
  if (!localStorage.getItem('quizZH_playerName')) {
    window.location.href = 'index.html';
    return;
  }

  await initializeGameState();

  // Afficher le nom du joueur
  const playerNameDisplay = document.getElementById('playerNameDisplay');
  if (playerNameDisplay) {
    playerNameDisplay.textContent = playerName;
  }

  // Setup form submission
  const answerForm = document.getElementById('answerForm');
  if (answerForm) {
    answerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      submitAnswer();
    });
  }

  // Setup quit button
  const quitBtn = document.getElementById('quitBtn');
  if (quitBtn) {
    quitBtn.addEventListener('click', async function() {
      if (confirm('Êtes-vous sûr de vouloir quitter?')) {
        stopTimer();
        await removePlayer(playerName);
        await signOut(auth);
        localStorage.removeItem('quizZH_playerName');
        localStorage.removeItem('quizZH_playerUID');
        window.location.href = 'index.html';
      }
    });
  }

  // Listen to active round changes (en cas d'annulation de la manche)
  listenToActiveRound(async (activeRoundData) => {
    if ((!activeRoundData || !activeRoundData.round) && !isGameOver) {
      stopTimer();
      showNotification('La manche a été arrêtée par l\'admin', 'info');
      await removePlayer(playerName);
      setTimeout(() => {
        window.location.href = 'waiting-room.html';
      }, 2000);
    }
  });

  // Listen to current question changes
  listenToCurrentQuestion(currentRoundNumber, async (questionNum) => {
    if (questionNum && questionNum !== currentQuestionNumber && !isGameOver) {
      currentQuestionNumber = questionNum;
      await displayCurrentQuestion();
      updateProgressBar();
    }
  });

  // Setup enter key to submit
  const answerInput = document.getElementById('answerInput');
  if (answerInput) {
    answerInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        submitAnswer();
      }
    });
  }
});
