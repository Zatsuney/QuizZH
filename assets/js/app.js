// ===== CONFIGURATION DE BASE =====
const STORAGE_KEYS = {
    PLAYER_NAME: 'quizZH_playerName',
    SESSION_ID: 'quizZH_sessionId',
    LOGIN_TIME: 'quizZH_loginTime',
    ADMIN_TOKEN: 'quizZH_adminToken',
    ADMIN_LOGIN_TIME: 'quizZH_adminLoginTime'
};

// Les identifiants admin sont chargés depuis admin-config.js
// (voir assets/js/admin-config.js pour les modifier)

// ===== GÉNÉRATION DE SESSION ID =====
function generateSessionId() {
    return 'QUIZ-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// ===== VÉRIFIER SI L'UTILISATEUR EST CONNECTÉ =====
function isPlayerLoggedIn() {
    return localStorage.getItem(STORAGE_KEYS.PLAYER_NAME);
}

// ===== VÉRIFIER SI UN ADMIN EST CONNECTÉ =====
function isAdminLoggedIn() {
    const adminToken = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    return adminToken && adminToken === 'admin_authenticated';
}

// ===== GESTION DES JOUEURS RÉELS (GLOBAL) =====
// Récupérer la liste réelle des joueurs connectés depuis localStorage
function getRealPlayers() {
    const playersData = localStorage.getItem('quizZH_connectedPlayers');
    return playersData ? JSON.parse(playersData) : {};
}

// Enregistrer un joueur
function registerPlayer(playerName) {
    const playerSessionId = generateSessionId();
    let players = getRealPlayers();
    
    if (!players[playerName]) {
        players[playerName] = {
            name: playerName,
            status: 'waiting',
            room: 'Salle d\'attente',
            sessionId: playerSessionId,
            loginTime: Date.now()
        };
        
        localStorage.setItem('quizZH_connectedPlayers', JSON.stringify(players));
    }
    
    return players[playerName];
}

// Retirer un joueur
function unregisterPlayer(playerName) {
    let players = getRealPlayers();
    delete players[playerName];
    localStorage.setItem('quizZH_connectedPlayers', JSON.stringify(players));
}

// Mettre à jour le statut d'un joueur
function updatePlayerStatus(playerName, status, room = null) {
    let players = getRealPlayers();
    
    if (players[playerName]) {
        players[playerName].status = status;
        if (room) {
            players[playerName].room = room;
        }
        localStorage.setItem('quizZH_connectedPlayers', JSON.stringify(players));
    }
}

// ===== PAGE DE CONNEXION =====
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    const playerNameInput = document.getElementById('playerName');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const playerName = playerNameInput.value.trim();

        // Validation
        if (!playerName || playerName.length < 2) {
            showError('Le nom doit contenir au moins 2 caractères');
            playerNameInput.classList.add('error');
            return;
        }

        if (playerName.length > 30) {
            showError('Le nom ne doit pas dépasser 30 caractères');
            playerNameInput.classList.add('error');
            return;
        }

        // Stocker les données
        localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, playerName);
        localStorage.setItem(STORAGE_KEYS.SESSION_ID, generateSessionId());
        localStorage.setItem(STORAGE_KEYS.LOGIN_TIME, new Date().toISOString());

        // Enregistrer le joueur dans la liste des joueurs connectés
        registerPlayer(playerName);

        // Redirection vers la salle d'attente
        window.location.href = 'waiting-room.html';
    });

    // Enlever l'erreur quand on commence à taper
    playerNameInput.addEventListener('focus', function() {
        playerNameInput.classList.remove('error');
    });

    function showError(message) {
        const errorDiv = document.querySelector('.error-message') || createErrorElement();
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        setTimeout(() => errorDiv.classList.remove('show'), 3000);
    }

    function createErrorElement() {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        document.querySelector('.form-group').appendChild(errorDiv);
        return errorDiv;
    }
}

// ===== PAGE CONNEXION ADMIN =====
if (document.getElementById('adminLoginForm')) {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminUsernameInput = document.getElementById('adminUsername');
    const adminPasswordInput = document.getElementById('adminPassword');
    const togglePasswordBtn = document.getElementById('togglePasswordBtn');
    const errorMessageDiv = document.getElementById('errorMessage');

    // Afficher/Masquer le mot de passe
    togglePasswordBtn.addEventListener('click', function() {
        const type = adminPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        adminPasswordInput.setAttribute('type', type);
        togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
    });

    // Soumission du formulaire
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = adminUsernameInput.value.trim();
        const password = adminPasswordInput.value;

        // Validation
        if (!username || !password) {
            showAdminError('Veuillez entrer votre pseudo et votre mot de passe');
            return;
        }

        // Vérification des identifiants
        if (username === ADMIN_CONFIG.username && password === ADMIN_CONFIG.password) {
            // Connexion réussie
            localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, 'admin_authenticated');
            localStorage.setItem(STORAGE_KEYS.ADMIN_LOGIN_TIME, new Date().toISOString());
            
            // Redirection vers le panel admin
            window.location.href = 'admin-panel.html';
        } else {
            // Identifiants incorrects
            showAdminError('Pseudo ou mot de passe incorrect');
            adminPasswordInput.value = '';
            adminPasswordInput.focus();
        }
    });

    function showAdminError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.classList.add('show');
        
        // Animer le champ
        adminUsernameInput.classList.add('error');
        adminPasswordInput.classList.add('error');
        
        setTimeout(() => {
            errorMessageDiv.classList.remove('show');
            adminUsernameInput.classList.remove('error');
            adminPasswordInput.classList.remove('error');
        }, 4000);
    }

    // Enlever l'erreur au focus
    adminUsernameInput.addEventListener('focus', function() {
        adminUsernameInput.classList.remove('error');
        errorMessageDiv.classList.remove('show');
    });

    adminPasswordInput.addEventListener('focus', function() {
        adminPasswordInput.classList.remove('error');
        errorMessageDiv.classList.remove('show');
    });
}

// ===== PAGE PANEL ADMIN =====
if (document.getElementById('adminLogoutBtn')) {
    // Vérifier si l'admin est connecté
    if (!isAdminLoggedIn()) {
        window.location.href = 'admin-login.html';
    }

    const adminLoginTime = localStorage.getItem(STORAGE_KEYS.ADMIN_LOGIN_TIME);
    const adminSessionId = 'ADMIN-' + Date.now();

    // Afficher les informations
    document.getElementById('adminSessionId').textContent = adminSessionId;
    
    if (adminLoginTime) {
        const loginDate = new Date(adminLoginTime);
        document.getElementById('adminLoginTime').textContent = loginDate.toLocaleString('fr-FR');
    }

    // Bouton de déconnexion
    document.getElementById('adminLogoutBtn').addEventListener('click', function() {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            logoutAdmin();
        }
    });

    // ===== GESTION DES MANCHES =====
    const roundsData = {
        1: { title: 'Manche 1', isRunning: false },
        2: { title: 'Manche 2', isRunning: false },
        3: { title: 'Manche 3', isRunning: false }
    };

    // Restaurer l'état depuis localStorage
    const activeRound = localStorage.getItem('quizZH_activeRound');
    if (activeRound) {
        const roundNum = parseInt(activeRound);
        roundsData[roundNum].isRunning = true;
        const roundCard = document.getElementById('round' + roundNum);
        const button = roundCard.querySelector('.btn-start-round');
        const statusBadge = roundCard.querySelector('.round-status');
        button.textContent = '⏹️ Arrêter';
        button.classList.add('running');
        statusBadge.textContent = 'Active';
        statusBadge.classList.add('active');
    }

    const startRoundButtons = document.querySelectorAll('.btn-start-round');
    
    startRoundButtons.forEach(button => {
        button.addEventListener('click', function() {
            const roundNumber = parseInt(this.getAttribute('data-round'));
            toggleRound(roundNumber);
        });
    });

    function toggleRound(roundNumber) {
        const roundCard = document.getElementById('round' + roundNumber);
        const button = roundCard.querySelector('.btn-start-round');
        const statusBadge = roundCard.querySelector('.round-status');
        const roundData = roundsData[roundNumber];

        // Arrêter toutes les autres manches
        Object.keys(roundsData).forEach(key => {
            if (key != roundNumber && roundsData[key].isRunning) {
                stopRound(parseInt(key));
            }
        });

        roundData.isRunning = !roundData.isRunning;

        if (roundData.isRunning) {
            button.textContent = '⏹️ Arrêter';
            button.classList.add('running');
            statusBadge.textContent = 'Active';
            statusBadge.classList.add('active');
            showNotification(`Manche ${roundNumber} lancée! 🚀`, 'success');
            
            // Sauvegarder la manche active dans localStorage
            localStorage.setItem('quizZH_activeRound', roundNumber);
        } else {
            button.textContent = '🚀 Lancer';
            button.classList.remove('running');
            statusBadge.textContent = 'Inactive';
            statusBadge.classList.remove('active');
            showNotification(`Manche ${roundNumber} arrêtée`, 'info');
            
            // Supprimer la manche active
            localStorage.removeItem('quizZH_activeRound');
            
            // Nettoyer toutes les données de cette manche
            localStorage.removeItem(`quizZH_questionsOrder_round${roundNumber}`);
            localStorage.removeItem(`quizZH_currentQuestion_round${roundNumber}`);
            localStorage.removeItem(`quizZH_answers_round${roundNumber}`);
        }
    }

    function stopRound(roundNumber) {
        const roundCard = document.getElementById('round' + roundNumber);
        const button = roundCard.querySelector('.btn-start-round');
        const statusBadge = roundCard.querySelector('.round-status');
        const roundData = roundsData[roundNumber];

        roundData.isRunning = false;
        button.textContent = '🚀 Lancer';
        button.classList.remove('running');
        statusBadge.textContent = 'Inactive';
        statusBadge.classList.remove('active');
    }

    // ===== GESTION DES JOUEURS RÉELS =====
    function updatePlayersDisplay() {
        // Récupérer les vrais joueurs
        const allPlayers = getRealPlayers();
        const displayPlayers = Object.values(allPlayers).slice(0, 20);
        
        const totalPlayers = Object.keys(allPlayers).length;
        const waitingPlayers = Object.values(allPlayers).filter(p => p.status === 'waiting').length;
        const playingPlayers = Object.values(allPlayers).filter(p => p.status === 'playing').length;

        document.getElementById('totalPlayers').textContent = totalPlayers;
        document.getElementById('waitingPlayers').textContent = waitingPlayers;
        document.getElementById('playingPlayers').textContent = playingPlayers;

        const playersGrid = document.getElementById('playersGrid');
        
        if (displayPlayers.length === 0) {
            playersGrid.innerHTML = '<div class="empty-state">Aucun joueur connecté</div>';
            return;
        }

        playersGrid.innerHTML = displayPlayers.map((player, index) => {
            const connectedTime = formatConnectedTime(player.loginTime);
            const statusClass = player.status === 'waiting' ? 'waiting' : 'playing';
            const statusText = player.status === 'waiting' ? '⏳ Attente' : '▶️ En jeu';
            
            return `
                <div class="player-card">
                    <div class="player-name">${player.name}</div>
                    <div class="player-info">
                        <span class="player-status-badge ${statusClass}">${statusText}</span>
                    </div>
                    <div class="player-info">
                        <small>${player.room}</small>
                    </div>
                    <div class="player-info">
                        <small style="color: #9ca3af;">${connectedTime}</small>
                    </div>
                    <button class="btn-player-remove" data-player-index="${index}">Retirer</button>
                </div>
            `;
        }).join('');

        // Ajouter les événements de suppression
        document.querySelectorAll('.btn-player-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-player-index'));
                removePlayer(index);
            });
        });
    }

    function formatConnectedTime(loginTime) {
        const now = Date.now();
        const diff = now - loginTime;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        if (minutes === 0) {
            return `${seconds}s`;
        } else if (minutes < 60) {
            return `${minutes}m ${seconds}s`;
        } else {
            const hours = Math.floor(minutes / 60);
            return `${hours}h ${minutes % 60}m`;
        }
    }

    function removePlayer(index) {
        const allPlayers = getRealPlayers();
        const playerArray = Object.values(allPlayers);
        
        if (index < playerArray.length) {
            const playerName = playerArray[index].name;
            if (confirm(`Êtes-vous sûr de vouloir retirer ${playerName} ?`)) {
                // Marquer le joueur comme supprimé dans localStorage
                localStorage.setItem(`quizZH_playerRemoved_${playerName}`, 'true');
                
                // Retirer le joueur de la liste
                unregisterPlayer(playerName);
                updatePlayersDisplay();
                showNotification('Joueur retiré', 'info');
            }
        }
    }

    // Actualiser l'affichage des joueurs toutes les 2 secondes
    setInterval(updatePlayersDisplay, 2000);

    // Bouton d'actualisation
    document.getElementById('refreshPlayersBtn').addEventListener('click', function() {
        this.style.transform = 'rotate(180deg)';
        updatePlayersDisplay();
        setTimeout(() => {
            this.style.transform = 'rotate(0deg)';
        }, 600);
    });

    // Initialiser l'affichage des joueurs
    updatePlayersDisplay();

    // Actualiser les joueurs et l'heure de connexion toutes les 5 secondes
    setInterval(() => {
        updatePlayersDisplay();
    }, 5000);

    // Déconnexion automatique après 30 minutes d'inactivité
    let adminInactivityTimeout;
    resetAdminInactivityTimer();

    document.addEventListener('click', resetAdminInactivityTimer);
    document.addEventListener('keypress', resetAdminInactivityTimer);
    document.addEventListener('mousemove', resetAdminInactivityTimer);

    function resetAdminInactivityTimer() {
        clearTimeout(adminInactivityTimeout);
        adminInactivityTimeout = setTimeout(() => {
            alert('Vous avez été déconnecté après 30 minutes d\'inactivité');
            logoutAdmin();
        }, ADMIN_CONFIG.inactivityTimeout);
    }
}

// ===== PAGE DE SALLE D'ATTENTE =====
if (document.getElementById('logoutBtn')) {
    // Redirection si pas connecté
    if (!isPlayerLoggedIn()) {
        window.location.href = 'index.html';
    }

    const playerName = localStorage.getItem(STORAGE_KEYS.PLAYER_NAME);
    const sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);

    // Afficher le nom du joueur
    document.getElementById('playerDisplay').textContent = playerName;
    document.getElementById('sessionId').textContent = sessionId;

    // Enregistrer le joueur en tant que "waiting"
    updatePlayerStatus(playerName, 'waiting', 'Salle d\'attente');

    // Afficher le nombre exact de joueurs en attente
    function updateWaitingPlayersCount() {
        const allPlayers = getRealPlayers();
        const waitingCount = Object.values(allPlayers).filter(p => p.status === 'waiting').length;
        const playerCountEl = document.getElementById('playerCount');
        if (playerCountEl) {
            playerCountEl.textContent = `Joueurs en attente: ${waitingCount}`;
        }
    }

    updateWaitingPlayersCount();
    setInterval(updateWaitingPlayersCount, 2000);

    // Vérifier si le joueur a été supprimé par l'admin
    function checkIfPlayerRemoved() {
        const playerName = localStorage.getItem(STORAGE_KEYS.PLAYER_NAME);
        
        if (localStorage.getItem(`quizZH_playerRemoved_${playerName}`)) {
            showNotification('Vous avez été retiré par l\'administrateur', 'error');
            localStorage.removeItem(`quizZH_playerRemoved_${playerName}`);
            setTimeout(() => {
                logout();
            }, 2000);
        }
    }

    checkIfPlayerRemoved();
    setInterval(checkIfPlayerRemoved, 1000);

    // Vérifier si une manche est lancée
    function checkForActiveRound() {
        const activeRound = localStorage.getItem('quizZH_activeRound');
        if (activeRound) {
            // Rediriger vers la manche
            window.location.href = `round-${activeRound}.html`;
        }
    }

    // Vérifier toutes les 2 secondes
    checkForActiveRound();
    setInterval(checkForActiveRound, 2000);

    // Bouton de déconnexion
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('Êtes-vous sûr de vouloir quitter ?')) {
            logout();
        }
    });

    // Déconnexion automatique après 30 minutes d'inactivité
    let inactivityTimeout;
    resetInactivityTimer();

    document.addEventListener('click', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);
    document.addEventListener('mousemove', resetInactivityTimer);

    function resetInactivityTimer() {
        clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(() => {
            alert('Vous avez été déconnecté après 30 minutes d\'inactivité');
            logout();
        }, 30 * 60 * 1000);
    }
}

// ===== FONCTION DE DÉCONNEXION =====
function logout() {
    // Retirer le joueur de la liste des joueurs connectés
    const playerName = localStorage.getItem(STORAGE_KEYS.PLAYER_NAME);
    if (playerName) {
        unregisterPlayer(playerName);
    }

    localStorage.removeItem(STORAGE_KEYS.PLAYER_NAME);
    localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
    localStorage.removeItem(STORAGE_KEYS.LOGIN_TIME);
    window.location.href = 'index.html';
}

// ===== FONCTION DE DÉCONNEXION ADMIN =====
function logoutAdmin() {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGIN_TIME);
    window.location.href = 'index.html';
}

// ===== SYSTÈME DE NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const style = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 600;
        color: white;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    if (type === 'success') {
        notification.style.cssText = style + `background: #10b981;`;
    } else if (type === 'error') {
        notification.style.cssText = style + `background: #ef4444;`;
    } else {
        notification.style.cssText = style + `background: #3b82f6;`;
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== ACTUALISER LA PAGE TOUS LES 5 MINUTES =====
setTimeout(() => {
    if (document.getElementById('logoutBtn')) {
        location.reload();
    }
}, 5 * 60 * 1000);

// ===== AVERTISSEMENT AVANT DE QUITTER =====
// Disabled - no beforeunload warning needed for automatic redirects


// ===== GESTION DU PANEL ADMIN - QUESTIONS ET RÉPONSES =====
let adminCurrentRound = null;
let adminCurrentQuestion = 1;
let allPlayersAnswers = {};

// Initialiser le panel de gestion des questions
function initAdminQuestionPanel() {
    const questionPanel = document.getElementById('questionManagement');
    if (!questionPanel) return; // Pas sur la page admin
    
    // Fonction pour mettre à jour l'affichage
    function updateRoundDisplay() {
        const activeRound = localStorage.getItem('quizZH_activeRound');
        const adminLayout = document.querySelector('.admin-layout');
        
        if (activeRound) {
            const newRound = parseInt(activeRound);
            // Si c'est une nouvelle manche, réinitialiser la question courante
            if (adminCurrentRound !== newRound) {
                adminCurrentQuestion = 1;
                localStorage.setItem(`quizZH_currentQuestion_round${newRound}`, 1);
            }
            adminCurrentRound = newRound;
            questionPanel.style.display = 'flex';
            if (adminLayout) adminLayout.classList.add('round-active');
            updateAdminQuestionDisplay();
            updatePlayersAnswers();
        } else {
            questionPanel.style.display = 'none';
            if (adminLayout) adminLayout.classList.remove('round-active');
            adminCurrentRound = null;
        }
    }
    
    // Vérifier immédiatement au chargement
    updateRoundDisplay();
    
    // Vérifier l'état de la manche active toutes les 2 secondes
    setInterval(updateRoundDisplay, 2000);
    
    // Setup buttons
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', moveToNextQuestion);
    }
}

// Afficher la question actuelle dans le panel admin
function updateAdminQuestionDisplay() {
    if (!adminCurrentRound) return;
    
    // Respecter l'ordre aléatoire des questions (comme les joueurs)
    const questionsOrder = JSON.parse(localStorage.getItem(`quizZH_questionsOrder_round${adminCurrentRound}`) || '[]');
    
    if (questionsOrder.length === 0) {
        // Les questions n'ont pas encore été initialisées par les joueurs
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
        console.error(`Question not found: Round ${adminCurrentRound}, Question ${adminCurrentQuestion}`);
        questionText.textContent = `Question ${adminCurrentQuestion} non trouvée`;
        questionNumber.textContent = '-';
    }
}

// Afficher les réponses de tous les joueurs
function updatePlayersAnswers() {
    if (!adminCurrentRound) return;
    
    // Charger les réponses du localStorage
    const answersData = localStorage.getItem(`quizZH_answers_round${adminCurrentRound}`);
    allPlayersAnswers = answersData ? JSON.parse(answersData) : {};
    
    const answersList = document.getElementById('answersList');
    const answersCount = document.getElementById('answersCount');
    
    if (!answersList) return;
    
    // Respecter l'ordre aléatoire des questions (comme les joueurs)
    const questionsOrder = JSON.parse(localStorage.getItem(`quizZH_questionsOrder_round${adminCurrentRound}`) || '[]');
    const questionNumberFromOrder = questionsOrder.length > 0 ? questionsOrder[adminCurrentQuestion - 1] : adminCurrentQuestion;
    
    // Compter les joueurs qui ont répondu
    let respondedCount = 0;
    let answeredHtml = '';
    
    // Parcourir tous les joueurs connectés réels
    const allPlayers = getRealPlayers();
    const playerNames = Object.keys(allPlayers);
    
    playerNames.forEach(playerName => {
        const playerAnswer = allPlayersAnswers[playerName]?.[questionNumberFromOrder];
        
        if (playerAnswer?.answer) {
            respondedCount++;
            
            let validationClass = '';
            let validationButton = '';
            
            if (playerAnswer.validated === true) {
                validationClass = 'answer-item-validated';
                validationButton = '<span class="validation-badge validated">✓ Validée</span>';
            } else if (playerAnswer.validated === false) {
                validationClass = 'answer-item-rejected';
                validationButton = '<span class="validation-badge rejected">✗ Rejetée</span>';
            } else {
                validationButton = `
                    <div class="validation-buttons">
                        <button class="btn-validate" onclick="validateAnswer('${playerName}', ${questionNumberFromOrder}, true)">✓</button>
                        <button class="btn-reject" onclick="validateAnswer('${playerName}', ${questionNumberFromOrder}, false)">✗</button>
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
}

// Valider ou invalider une réponse
function validateAnswer(playerName, questionNumber, isValid) {
    const answersData = localStorage.getItem(`quizZH_answers_round${adminCurrentRound}`);
    let answers = answersData ? JSON.parse(answersData) : {};
    
    if (!answers[playerName]) {
        answers[playerName] = {};
    }
    
    if (!answers[playerName][questionNumber]) {
        answers[playerName][questionNumber] = {};
    }
    
    // Marquer la réponse comme validée ou rejetée
    answers[playerName][questionNumber].validated = isValid;
    
    // Sauvegarder
    localStorage.setItem(`quizZH_answers_round${adminCurrentRound}`, JSON.stringify(answers));
    
    // Mettre à jour l'affichage
    updatePlayersAnswers();
    
    // Notification
    showNotification(`Réponse de ${playerName} marquée comme ${isValid ? 'validée' : 'rejetée'}`, 'success');
}

// Passer à la question suivante
function moveToNextQuestion() {
    if (!adminCurrentRound) return;
    
    const totalQuestions = getTotalQuestionsInRound(adminCurrentRound);
    
    if (adminCurrentQuestion < totalQuestions) {
        adminCurrentQuestion++;
        localStorage.setItem(`quizZH_currentQuestion_round${adminCurrentRound}`, adminCurrentQuestion);
        updateAdminQuestionDisplay();
        updatePlayersAnswers();
        showNotification(`Passage à la question ${adminCurrentQuestion}`, 'success');
    } else {
        showNotification('Toutes les questions ont été posées!', 'info');
    }
}

// Arrêter la manche
function stopRound() {
    if (confirm('Êtes-vous sûr de vouloir arrêter la manche?')) {
        // Nettoyer l'ordre aléatoire des questions pour un nouvel ordre à la relance
        if (adminCurrentRound) {
            localStorage.removeItem(`quizZH_questionsOrder_round${adminCurrentRound}`);
            localStorage.removeItem(`quizZH_currentQuestion_round${adminCurrentRound}`);
            localStorage.removeItem(`quizZH_answers_round${adminCurrentRound}`);
        }
        
        localStorage.removeItem('quizZH_activeRound');
        adminCurrentRound = null;
        adminCurrentQuestion = 1;
        document.getElementById('questionManagement').style.display = 'none';
        showNotification('Manche arrêtée', 'info');
    }
}

// Initialiser si on est sur la page admin
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('questionManagement')) {
        initAdminQuestionPanel();
    }
});
