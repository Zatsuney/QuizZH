// ===== LOGIQUE DES PAGES DE MANCHE =====

let currentRound = null;
let currentQuestion = 1;
let currentQuestionNumber = null; // Numéro réel de la question (1, 2, 3... selon l'ordre aléatoire)
let playerAnswers = {};
let timerInterval = null;
let timeRemaining = 0;
let isTimerRunning = false;
let checkInterval = null; // Pour tracker l'intervalle de polling

// Déterminer le numéro de la manche actuelle
function getCurrentRoundNumber() {
    const current = window.location.pathname;
    const match = current.match(/round-(\d)\.html/);
    return match ? parseInt(match[1]) : null;
}

// ===== INITIALISER LA PAGE DE MANCHE =====
function initRoundPage() {
    currentRound = getCurrentRoundNumber();
    
    // Vérifier si le joueur est connecté
    if (!isPlayerLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Vérifier si le joueur a été supprimé par l'admin
    const playerName = localStorage.getItem('quizZH_playerName');
    if (localStorage.getItem(`quizZH_playerRemoved_${playerName}`)) {
        showNotification('Vous avez été retiré par l\'administrateur', 'error');
        localStorage.removeItem(`quizZH_playerRemoved_${playerName}`);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }
    
    // Afficher le nom du joueur
    const playerNameDisplay = document.getElementById('playerNameDisplay');
    if (playerNameDisplay) {
        playerNameDisplay.textContent = playerName;
    }
    
    // Mettre à jour le statut du joueur à "playing"
    updatePlayerStatus(playerName, 'playing', `Manche ${currentRound}`);
    
    // Charger les questions
    loadRoundQuestions();
    
    // Vérifier l'état de la manche
    checkRoundStatus();
    setupEventListeners();
}

// ===== CHARGER LES QUESTIONS DE LA MANCHE =====
function loadRoundQuestions() {
    const roundData = getQuestionsForRound(currentRound);
    
    if (roundData.questions.length === 0) {
        showQuestionError('Aucune question disponible pour cette manche.');
        return;
    }
    
    // Initialiser les réponses du joueur
    const playerName = localStorage.getItem('quizZH_playerName');
    if (!playerAnswers[playerName]) {
        playerAnswers[playerName] = {};
    }
    
    // Créer un ordre aléatoire des questions
    let questionsOrder = localStorage.getItem(`quizZH_questionsOrder_round${currentRound}`);
    if (!questionsOrder) {
        // Premier joueur de cette manche - créer et sauvegarder l'ordre aléatoire
        const questionNumbers = roundData.questions.map(q => q.number);
        const shuffled = questionNumbers.sort(() => Math.random() - 0.5);
        questionsOrder = JSON.stringify(shuffled);
        localStorage.setItem(`quizZH_questionsOrder_round${currentRound}`, questionsOrder);
    }
    
    // Afficher la première question
    displayQuestion(currentQuestion);
}

// ===== AFFICHER UNE QUESTION =====
function displayQuestion(questionIndex) {
    // questionIndex est la position (1, 2, 3...) pas le numéro de question
    const questionsOrder = JSON.parse(localStorage.getItem(`quizZH_questionsOrder_round${currentRound}`) || '[]');
    
    if (questionIndex < 1 || questionIndex > questionsOrder.length) {
        showQuestionError('Question non trouvée.');
        return;
    }
    
    // Récupérer le numéro de question selon l'ordre aléatoire
    const questionNumber = questionsOrder[questionIndex - 1];
    const question = getQuestion(currentRound, questionNumber);
    
    // Stocker le numéro réel pour submitPlayerAnswer
    currentQuestionNumber = questionNumber;
    
    if (!question) {
        showQuestionError('Question non trouvée.');
        return;
    }
    
    const questionContainer = document.querySelector('.questions-container');
    if (!questionContainer) return;
    
    const playerName = localStorage.getItem('quizZH_playerName');
    const playerAnswerData = playerAnswers[playerName]?.[currentQuestionNumber] || {};
    const totalQuestions = getTotalQuestionsInRound(currentRound);
    
    questionContainer.innerHTML = `
        <div class="question-view">
            <div class="question-header">
                <h3 class="question-number">Question ${question.number}</h3>
                <span class="question-counter">Question ${questionIndex}/${totalQuestions}</span>
            </div>
            
            <div class="question-text question-centered">
                <p>${question.text}</p>
            </div>
            
            <div class="answer-section">
                <label for="playerAnswer">Votre réponse:</label>
                <input 
                    type="text"
                    id="playerAnswer" 
                    class="answer-input" 
                    placeholder="Tapez votre réponse ici..."
                    maxlength="500"
                    ${playerAnswerData.validated === true || playerAnswerData.validated === false ? 'disabled' : ''}
                    value="${playerAnswerData.answer || ''}"
                />
                <div class="answer-char-count">
                    <span id="charCount">0</span>/500
                </div>
            </div>
            
            <button id="submitAnswerBtn" class="btn-submit-answer" ${playerAnswerData.validated === true || playerAnswerData.validated === false ? 'disabled' : ''}>
                ${playerAnswerData.answer ? 'Mettre à jour' : 'Soumettre'}
            </button>
            
            <div class="answer-status" id="answerStatus">
                ${playerAnswerData.answer ? '<span class="status-submitted">✓ Réponse soumise</span>' : ''}
                ${playerAnswerData.validated === true ? '<span class="status-validated">✓ Validée</span>' : ''}
                ${playerAnswerData.validated === false ? '<span class="status-rejected">✗ Non validée</span>' : ''}
            </div>
            
            <div class="timer-display timer-compact" id="timerDisplay">
                Temps restant: <span id="timeRemaining">--</span>
            </div>
        </div>
    `;
    
    // Update char count et soumission Enter
    const answerInput = document.getElementById('playerAnswer');
    if (answerInput) {
        answerInput.addEventListener('input', () => {
            document.getElementById('charCount').textContent = answerInput.value.length;
        });
        
        if (answerInput.value) {
            document.getElementById('charCount').textContent = answerInput.value.length;
        }
        
        // Soumettre avec Enter
        answerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitPlayerAnswer();
            }
        });
    }
    
    // Submit answer button
    const submitBtn = document.getElementById('submitAnswerBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitPlayerAnswer);
    }
}

// ===== SOUMETTRE UNE RÉPONSE =====
function submitPlayerAnswer() {
    const answerInput = document.getElementById('playerAnswer');
    const answer = answerInput.value.trim();
    
    if (!answer) {
        showNotification('Veuillez entrer une réponse.', 'error');
        return;
    }
    
    const playerName = localStorage.getItem('quizZH_playerName');
    
    // Stocker la réponse
    if (!playerAnswers[playerName]) {
        playerAnswers[playerName] = {};
    }
    playerAnswers[playerName][currentQuestionNumber] = {
        answer: answer,
        validated: null,
        submittedAt: new Date().toISOString()
    };
    
    // Sauvegarder dans localStorage
    localStorage.setItem(`quizZH_answers_round${currentRound}`, JSON.stringify(playerAnswers));
    
    // Mettre à jour l'interface - désactiver la textarea et le bouton
    document.getElementById('submitAnswerBtn').disabled = true;
    document.getElementById('answerStatus').innerHTML = '<span class="status-submitted">✓ Réponse soumise</span>';
    answerInput.disabled = true;
    
    showNotification('Votre réponse a été soumise!', 'success');
}

// ===== CONFIGURATION DES EVENT LISTENERS =====
function setupEventListeners() {
    // Les redirection sont gérées automatiquement par checkRoundStatus()
}

// ===== VÉRIFIER L'ÉTAT DE LA MANCHE =====
function checkRoundStatus() {
    checkInterval = setInterval(() => {
        const playerName = localStorage.getItem('quizZH_playerName');
        
        // Vérifier si le joueur a été supprimé par l'admin
        if (localStorage.getItem(`quizZH_playerRemoved_${playerName}`)) {
            clearInterval(checkInterval);
            showNotification('Vous avez été retiré par l\'administrateur', 'error');
            localStorage.removeItem(`quizZH_playerRemoved_${playerName}`);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }
        
        const activeRound = localStorage.getItem('quizZH_activeRound');
        const roundMessage = document.getElementById('roundMessage');
        const roundStatus = document.getElementById('roundStatus');
        
        // Vérifier si la question a changé
        const storedQuestion = localStorage.getItem(`quizZH_currentQuestion_round${currentRound}`);
        if (storedQuestion && parseInt(storedQuestion) !== currentQuestion) {
            currentQuestion = parseInt(storedQuestion);
            displayQuestion(currentQuestion);
        }
        
        if (activeRound && parseInt(activeRound) === currentRound) {
            // La manche est lancée
            if (roundMessage) {
                roundMessage.textContent = 'La manche est en cours!';
                roundMessage.style.color = '#10b981';
            }
            if (roundStatus) {
                roundStatus.textContent = '▶️ EN COURS';
                roundStatus.style.color = '#10b981';
            }
        } else if (activeRound && parseInt(activeRound) !== currentRound) {
            // Une autre manche est lancée
            clearInterval(checkInterval);
            
            // Mettre à jour le statut du joueur pour la nouvelle manche
            const playerName = localStorage.getItem('quizZH_playerName');
            updatePlayerStatus(playerName, 'playing', `Manche ${activeRound}`);
            
            window.location.href = `round-${activeRound}.html`;
        } else {
            // Aucune manche active - rediriger à la salle d'attente
            if (!activeRound && currentRound) {
                clearInterval(checkInterval);
                showNotification('La manche a été arrêtée.', 'info');
                
                // Mettre à jour le statut du joueur à "waiting"
                const playerName = localStorage.getItem('quizZH_playerName');
                updatePlayerStatus(playerName, 'waiting', 'Salle d\'attente');
                
                setTimeout(() => {
                    window.location.href = 'waiting-room.html';
                }, 5000);
            }
        }
    }, 2000);
}

// ===== AFFICHER ERREUR =====
function showQuestionError(message) {
    const questionContainer = document.querySelector('.questions-container');
    if (questionContainer) {
        questionContainer.innerHTML = `
            <div class="placeholder-message">
                <p>⚠️ ${message}</p>
            </div>
        `;
    }
}

// ===== INITIALISER AU CHARGEMENT =====
document.addEventListener('DOMContentLoaded', initRoundPage);
