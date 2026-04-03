// Solo Game Mode Logic
import { auth, db } from './firebase-config.js';
import { doc, updateDoc, getDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Import all question sets
import { questionsSciencesFacile } from './questions/sciences-facile.js';
import { questionsSciencesMoyen } from './questions/sciences-moyen.js';
import { questionsSciencesDifficile } from './questions/sciences-difficile.js';
import { questionsTechFacile } from './questions/tech-facile.js';
import { questionsTechMoyen } from './questions/tech-moyen.js';
import { questionsTechDifficile } from './questions/tech-difficile.js';
import { questionsGeoFacile } from './questions/geo-facile.js';
import { questionsGeoMoyen } from './questions/geo-moyen.js';
import { questionsGeoDifficile } from './questions/geo-difficile.js';
import { questionsCulturePopFacile } from './questions/culture-pop-facile.js';
import { questionsCulturePopMoyen } from './questions/culture-pop-moyen.js';
import { questionsCulturePopDifficile } from './questions/culture-pop-difficile.js';
import { questionsHistoireFacile } from './questions/histoire-facile.js';
import { questionsHistoireMoyen } from './questions/histoire-moyen.js';
import { questionsHistoireDifficile } from './questions/histoire-difficile.js';
import { questionsArtsFacile } from './questions/arts-facile.js';
import { questionsArtsMoyen } from './questions/arts-moyen.js';
import { questionsArtsDifficile } from './questions/arts-difficile.js';
import { questionsMusicFacile } from './questions/musique-facile.js';
import { questionsMusicMoyen } from './questions/musique-moyen.js';
import { questionsMusicDifficile } from './questions/musique-difficile.js';
import { questionsJeuxVideosFacile } from './questions/jeux-videos-facile.js';
import { questionsJeuxVideosMoyen } from './questions/jeux-videos-moyen.js';
import { questionsJeuxVideosDifficile } from './questions/jeux-videos-difficile.js';

// XP Settings
const XP_SETTINGS = {
    easy: 300,
    medium: 500,
    hard: 1000
};

// Level thresholds - 100 levels with progressive XP requirements
// Level 1->2: 600 XP, 2->3: 650 XP, 3->4: 700 XP, etc. (+50 XP per level)
const LEVEL_THRESHOLDS = (() => {
    const thresholds = [0]; // Level 1 starts at 0
    let currentXP = 0;
    for (let i = 1; i < 100; i++) {
        currentXP += 600 + (i - 1) * 50;
        thresholds.push(currentXP);
    }
    return thresholds;
})();

// Game state
const gameState = {
    currentQuestionIndex: 0,
    score: 0,
    answered: 0,
    questions: [],
    timePerQuestion: 30,
    totalTime: 300,
    startTime: 0,
    elapsedTime: 0,
    gameActive: true,
    answers: []
};

// Current question being reported (for error reporting feature)
let currentReportingQuestion = null;

// Theme names mapping
const themeNames = {
    'sciences': 'Sciences',
    'tech': 'Tech',
    'geo': 'Géographie',
    'culture-pop': 'Culture Pop',
    'histoire': 'Histoire',
    'arts': 'Arts & Divertissement',
    'musique': 'Musique',
    'jeux-videos': 'Jeux-Vidéos',
    'all': 'Tous les Thèmes'
};

// Difficulty names mapping
const difficultyNames = {
    'easy': 'Facile',
    'medium': 'Moyen',
    'hard': 'Difficile'
};

// Questions library
const questionsLibrary = {
    'sciences-easy': questionsSciencesFacile,
    'sciences-medium': questionsSciencesMoyen,
    'sciences-hard': questionsSciencesDifficile,
    'tech-easy': questionsTechFacile,
    'tech-medium': questionsTechMoyen,
    'tech-hard': questionsTechDifficile,
    'geo-easy': questionsGeoFacile,
    'geo-medium': questionsGeoMoyen,
    'geo-hard': questionsGeoDifficile,
    'culture-pop-easy': questionsCulturePopFacile,
    'culture-pop-medium': questionsCulturePopMoyen,
    'culture-pop-hard': questionsCulturePopDifficile,
    'histoire-easy': questionsHistoireFacile,
    'histoire-medium': questionsHistoireMoyen,
    'histoire-hard': questionsHistoireDifficile,
    'arts-easy': questionsArtsFacile,
    'arts-medium': questionsArtsMoyen,
    'arts-hard': questionsArtsDifficile,
    'musique-easy': questionsMusicFacile,
    'musique-medium': questionsMusicMoyen,
    'musique-hard': questionsMusicDifficile,
    'jeux-videos-easy': questionsJeuxVideosFacile,
    'jeux-videos-medium': questionsJeuxVideosMoyen,
    'jeux-videos-hard': questionsJeuxVideosDifficile,
};

// Calculate level from total XP
function calculateLevel(totalXP) {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (totalXP >= LEVEL_THRESHOLDS[i]) {
            return i + 1;
        }
    }
    return 1;
}

// Calculate XP earned from quiz
function calculateXP(difficulty, correctAnswers, totalQuestions, timeSpent) {
    const maxXP = XP_SETTINGS[difficulty];
    
    // Base XP from correct answers
    const answerPercentage = correctAnswers / totalQuestions;
    const baseXP = maxXP * answerPercentage;
    
    // Time bonus (up to 1.5x)
    const maxTimePerQuestion = gameState.timePerQuestion;
    const maxTotalTime = maxTimePerQuestion * totalQuestions;
    const timeRatio = maxTotalTime / timeSpent;
    const timeBonus = Math.min(timeRatio, 1.5); // Cap at 1.5x
    
    // Final XP
    const earnedXP = Math.round(baseXP * timeBonus);
    
    return {
        earnedXP,
        baseXP: Math.round(baseXP),
        timeMultiplier: timeBonus.toFixed(2)
    };
}

// ===== ERROR REPORTING FUNCTIONS =====
// Open report modal
window.openReportModal = function(question) {
    currentReportingQuestion = question;
    document.getElementById('reportErrorModal').style.display = 'flex';
    document.getElementById('errorDescription').value = '';
};

// Close report modal
window.closeReportModal = function() {
    document.getElementById('reportErrorModal').style.display = 'none';
    document.getElementById('errorDescription').value = '';
    currentReportingQuestion = null;
};

// Submit error report to Firebase
window.submitErrorReport = async function() {
    if (!currentReportingQuestion) return;
    
    const playerUID = localStorage.getItem('quizZH_playerUID');
    const playerName = localStorage.getItem('quizZH_playerName');
    const description = document.getElementById('errorDescription').value.trim();
    const theme = localStorage.getItem('quizZH_selectedTheme');
    const difficulty = localStorage.getItem('quizZH_difficulty');
    
    console.log('📤 Envoi du signalement:', {
        playerUID,
        playerName,
        theme,
        difficulty,
        questionId: currentReportingQuestion.id
    });
    
    try {
        // Add error report to Firestore
        const reportsRef = collection(db, 'errorReports');
        const docRef = await addDoc(reportsRef, {
            questionId: currentReportingQuestion.id,
            questionText: currentReportingQuestion.question,
            theme: theme,
            difficulty: difficulty,
            correctAnswer: currentReportingQuestion.correctAnswer,
            answers: currentReportingQuestion.answers,
            description: description,
            reportedBy: playerUID || 'anonymous',
            reporterName: playerName || 'Anonyme',
            timestamp: serverTimestamp(),
            status: 'pending'
        });
        
        console.log('✅ Erreur signalée avec succès - ID:', docRef.id);
        
        // Show success notification
        const notif = document.getElementById('reportSuccessNotif');
        notif.style.display = 'block';
        setTimeout(() => {
            notif.style.display = 'none';
        }, 3000);
        
        // Close modal
        closeReportModal();
        
    } catch (error) {
        console.error('❌ Erreur lors du signalement:', error);
        alert('Erreur lors du signalement: ' + error.message);
    }
};

// Check if player is logged in
function checkPlayerLoggedIn() {
    const playerName = localStorage.getItem('quizZH_playerName');
    if (!playerName) {
        window.location.href = 'index.html';
        return null;
    }
    return playerName;
}

// Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Shuffle answer options and update correct answer index
function shuffleAnswerOptions(question) {
    const options = question.answers || question.options || [];
    if (options.length === 0) return question;
    
    // Create array of {answer, isCorrect} pairs
    const answersWithIndicators = options.map((answer, index) => ({
        answer,
        isCorrect: index === question.correctAnswer
    }));
    
    // Shuffle the pairs
    const shuffled = shuffleArray(answersWithIndicators);
    
    // Extract shuffled answers and find new correct index
    const newAnswers = shuffled.map(item => item.answer);
    const newCorrectAnswer = shuffled.findIndex(item => item.isCorrect);
    
    return {
        ...question,
        answers: newAnswers,
        correctAnswer: newCorrectAnswer
    };
}

// Get questions based on theme and difficulty
async function getQuestions(theme, difficulty) {
    let questions = [];
    
    console.log('🚀 getQuestions called with theme:', theme, 'difficulty:', difficulty);
    
    try {
        // Map theme names to actual JSON file names
        const themeFileMap = {
            'culture-pop': 'pop',
            'arts': 'art',
            'jeux-videos': 'jeuxvideos'
        };
        
        let fileTheme = themeFileMap[theme] || theme;
        
        if (theme === 'all') {
            // Load pre-combined all-questions file
            const response = await fetch(`assets/json/all-${difficulty}.json`);
            const data = await response.json();
            questions = (data.questions || []).map(q => ({
                ...q,
                answers: q.options || q.answers || [],
                originalTheme: q.subtheme || 'Mixte'
            }));
        } else {
            // Get questions for specific theme
            const response = await fetch(`assets/json/${fileTheme}-${difficulty}.json`);
            const data = await response.json();
            questions = (data.questions || []).map(q => ({
                ...q,
                answers: q.options || q.answers || []
            }));
        }
        
        // Shuffle answer options for each question
        questions = questions.map(q => shuffleAnswerOptions(q));
        
        console.log('✅ Questions loaded with shuffled answers');
        
        return shuffleArray(questions).slice(0, 10);
    } catch (error) {
        console.error('❌ Error loading questions:', error);
        return [];
    }
}

// Save game session to sessionStorage to prevent cheating with F5
function saveGameSession() {
    const sessionData = {
        currentQuestionIndex: gameState.currentQuestionIndex,
        score: gameState.score,
        answers: gameState.answers,
        elapsedTime: gameState.elapsedTime,
        questionStartTime: window.questionStartTime, // ⏱️ Timestamp du début de la question
        timestamp: Date.now(),
        questionsLength: gameState.questions.length
    };
    sessionStorage.setItem('quizZH_activeSession', JSON.stringify(sessionData));
    console.log('💾 Session sauvegardée:', sessionData);
}

// Display current question
function displayQuestion() {
    const question = gameState.questions[gameState.currentQuestionIndex];
    if (!question) {
        console.error('❌ No question found at index:', gameState.currentQuestionIndex);
        return;
    }
    
    console.log('🎯 Displaying question:', question);
    console.log('📝 Answers for this question:', question.answers);
    console.log('✓ Correct answer index:', question.correctAnswer);
    
    const gameArea = document.getElementById('gameArea');
    
    // Ensure answers exist
    const answers = question.answers || question.options || [];
    if (answers.length === 0) {
        console.error('❌ No answers found for question:', question);
        gameArea.innerHTML = '<p style="color: red;">Erreur: Pas de réponses pour cette question</p>';
        return;
    }
    
    // Display subtheme if available (use subtheme for "all" theme, originalTheme otherwise)
    let badgeDisplay = '';
    if (question.subtheme) {
        badgeDisplay = `<div class="subtheme-badge">${question.subtheme}</div>`;
    } else if (question.originalTheme) {
        badgeDisplay = `<span class="original-theme">${question.originalTheme}</span>`;
    }
    
    const questionHTML = `
        <div class="question-wrapper">
            ${badgeDisplay}
            <div class="question-text">
                <p>${question.question}</p>
            </div>
            
            <div class="answers-options">
                ${answers.map((answer, index) => `
                    <button class="answer-btn" data-answer="${index}" onclick="selectAnswer(${index})">
                        ${answer}
                    </button>
                `).join('')}
            </div>
            
            <div class="question-footer">
                <p>Question ${gameState.currentQuestionIndex + 1}/${gameState.questions.length}</p>
                <button class="btn-report-error" onclick="openReportModal(gameState.questions[gameState.currentQuestionIndex])" title="Signaler une erreur">🚩 Signaler une erreur</button>
            </div>
        </div>
    `;
    
    gameArea.innerHTML = questionHTML;
    
    // ⏱️ Set timestamp for this question (unless it's a restore with existing timestamp)
    if (!window.questionStartTime) {
        window.questionStartTime = Date.now();
    }
    
    // Save session before starting timer
    saveGameSession();
    
    // Update progress
    updateProgress();
    startQuestionTimer();
}

// Start timer for current question
function startQuestionTimer() {
    const timerEl = document.getElementById('timer');
    
    // Calculate time left based on when the question started
    let timeLeft;
    if (window.questionStartTime) {
        const elapsedOnThisQuestion = (Date.now() - window.questionStartTime) / 1000;
        timeLeft = gameState.timePerQuestion - Math.ceil(elapsedOnThisQuestion);
        console.log('⏱️ Timer restored - elapsed:', Math.ceil(elapsedOnThisQuestion), 'remaining:', timeLeft, 'seconds');
    } else {
        timeLeft = gameState.timePerQuestion;
        console.log('⏱️ Timer starting with', gameState.timePerQuestion, 'seconds');
    }
    
    // Ensure timeLeft doesn't go negative
    if (timeLeft <= 0) {
        moveToNextQuestion();
        return;
    }
    
    const timerInterval = setInterval(() => {
        timeLeft--;
        gameState.elapsedTime++;
        timerEl.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            moveToNextQuestion();
        }
    }, 1000);
    
    // Store interval ID for cleanup
    window.currentTimerInterval = timerInterval;
}

// Select answer
window.selectAnswer = function(answerIndex) {
    if (!gameState.gameActive) return;
    
    const question = gameState.questions[gameState.currentQuestionIndex];
    const isCorrect = answerIndex === question.correctAnswer;
    
    // Store answer
    gameState.answers.push({
        questionIndex: gameState.currentQuestionIndex,
        answered: answerIndex,
        correct: question.correctAnswer,
        isCorrect: isCorrect
    });
    
    if (isCorrect) {
        gameState.score++;
    }
    
    gameState.answered++;
    
    // Clear timer
    if (window.currentTimerInterval) {
        clearInterval(window.currentTimerInterval);
    }
    
    // Highlight correct/incorrect answer
    highlightAnswer(answerIndex, question.correctAnswer, isCorrect);
    
    // Move to next question after 1.5 seconds
    setTimeout(() => {
        moveToNextQuestion();
    }, 1500);
}

// Highlight answer
function highlightAnswer(selectedIndex, correctIndex, isCorrect) {
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === correctIndex) {
            btn.classList.add('correct');
        } else if (idx === selectedIndex && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
}

// Move to next question
function moveToNextQuestion() {
    window.questionStartTime = null; // 🔄 Reset timestamp for next question
    
    gameState.currentQuestionIndex++;
    
    if (gameState.currentQuestionIndex < gameState.questions.length) {
        updateProgress();
        displayQuestion();
    } else {
        endGame();
    }
}

// Update progress
function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const questionCounter = document.getElementById('questionCounter');
    
    const progress = ((gameState.currentQuestionIndex + 1) / gameState.questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    questionCounter.textContent = `${gameState.currentQuestionIndex + 1}/${gameState.questions.length}`;
}

// Save game results to Firebase
async function saveGameResults() {
    try {
        const playerUID = localStorage.getItem('quizZH_playerUID');
        const playerName = localStorage.getItem('quizZH_playerName');
        const theme = localStorage.getItem('quizZH_selectedTheme');
        const difficulty = localStorage.getItem('quizZH_difficulty');
        
        if (!playerUID) return;
        
        // Calculate XP
        const xpData = calculateXP(difficulty, gameState.score, gameState.questions.length, gameState.elapsedTime);
        
        // Get current player data
        const userDocRef = doc(db, 'users', playerUID);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data() || {};
        
        // Update total XP and level
        const totalXP = (userData.totalXP || 0) + xpData.earnedXP;
        const level = calculateLevel(totalXP);
        
        // Prepare stats update
        const themeKey = `stats_${theme}_${difficulty}`;
        const themeStats = userData[themeKey] || { played: 0, correctAnswers: 0, totalQuestions: 0, totalXP: 0 };
        const numQuestions = gameState.questions.length;
        
        // Update player document
        await updateDoc(userDocRef, {
            totalXP: totalXP,
            level: level,
            lastPlayedDate: new Date().toISOString(),
            [themeKey]: {
                played: themeStats.played + 1,
                correctAnswers: themeStats.correctAnswers + gameState.score,
                totalQuestions: themeStats.totalQuestions + numQuestions,
                totalXP: themeStats.totalXP + xpData.earnedXP
            }
        });
        
        // Display XP earned
        document.getElementById('xpEarned').textContent = xpData.earnedXP;
        document.getElementById('playerLevel').textContent = level;
        document.getElementById('playerXP').textContent = totalXP;
        
    } catch (error) {
        console.error('Error saving game results:', error);
    }
}

// End game
function endGame() {
    // Clean up session
    sessionStorage.removeItem('quizZH_activeSession');
    
    gameState.gameActive = false;
    
    if (window.currentTimerInterval) {
        clearInterval(window.currentTimerInterval);
    }
    
    // Save results to Firebase
    saveGameResults();
    
    // Hide game area, show results
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('resultsArea').style.display = 'block';
    
    // Display results
    document.getElementById('finalScore').textContent = `${gameState.score}/${gameState.questions.length}`;
    document.getElementById('correctCount').textContent = gameState.score;
    document.getElementById('wrongCount').textContent = gameState.questions.length - gameState.score;
    document.getElementById('totalTime').textContent = gameState.elapsedTime;
    
    // Setup restart button
    document.getElementById('restartBtn').addEventListener('click', () => {
        location.reload();
    });
}

// Initialize game
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const playerName = checkPlayerLoggedIn();
    if (!playerName) return;
    
    // Check if there's an active session (avoid cheating with F5)
    const activeSession = sessionStorage.getItem('quizZH_activeSession');
    const didQuitVoluntarily = sessionStorage.getItem('quizZH_intentionalQuit');
    
    if (activeSession && !didQuitVoluntarily) {
        const session = JSON.parse(activeSession);
        const timeSinceLastSave = (Date.now() - session.timestamp) / 1000;
        
        // If session was saved less than 1 minute ago, restore it
        if (timeSinceLastSave < 60) {
            console.log('♻️ Restoring previous session...', session);
            gameState.currentQuestionIndex = session.currentQuestionIndex;
            gameState.score = session.score;
            gameState.answers = session.answers;
            gameState.elapsedTime = session.elapsedTime + Math.ceil(timeSinceLastSave);
            
            // Restore question start time (calculate back from saved data)
            window.questionStartTime = session.questionStartTime;
            
            // Get settings from localStorage to reload questions
            const theme = localStorage.getItem('quizZH_selectedTheme');
            const difficulty = localStorage.getItem('quizZH_difficulty');
            gameState.timePerQuestion = parseInt(localStorage.getItem('quizZH_timePerQuestion')) || 30;
            gameState.questions = await getQuestions(theme, difficulty);
            
            // Update UI headers
            document.getElementById('themeName').textContent = themeNames[theme];
            document.getElementById('difficultyName').textContent = `Difficulté: ${difficultyNames[difficulty]}`;
            
            // Setup quit button
            document.getElementById('quitBtn').addEventListener('click', () => {
                if (confirm('Êtes-vous sûr de vouloir quitter? Votre progression sera perdue.')) {
                    sessionStorage.setItem('quizZH_intentionalQuit', 'true');
                    sessionStorage.removeItem('quizZH_activeSession');
                    // Clear theme/difficulty to force reselection
                    localStorage.removeItem('quizZH_selectedTheme');
                    localStorage.removeItem('quizZH_difficulty');
                    window.location.href = 'theme-selection.html';
                }
            });
            
            console.log('✅ Session restaurée, question:', gameState.currentQuestionIndex + 1);
            displayQuestion();
            return;
        } else {
            // Session expired, clean up
            sessionStorage.removeItem('quizZH_activeSession');
        }
    }
    
    // Clear the intentional quit flag if we reach here (new game started)
    sessionStorage.removeItem('quizZH_intentionalQuit');
    
    // Start new game
    // Get settings from localStorage
    const theme = localStorage.getItem('quizZH_selectedTheme');
    const difficulty = localStorage.getItem('quizZH_difficulty');
    const timePerQuestion = parseInt(localStorage.getItem('quizZH_timePerQuestion')) || 30;
    
    if (!theme || !difficulty) {
        window.location.href = 'theme-selection.html';
        return;
    }
    
    // Update game state
    gameState.timePerQuestion = timePerQuestion;
    gameState.questions = await getQuestions(theme, difficulty);
    console.log('📝 Game state questions after loading:', gameState.questions.length, 'questions loaded');
    gameState.startTime = Date.now();
    
    // Update UI headers
    document.getElementById('themeName').textContent = themeNames[theme];
    document.getElementById('difficultyName').textContent = `Difficulté: ${difficultyNames[difficulty]}`;
    
    // Setup quit button
    document.getElementById('quitBtn').addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir quitter? Votre progression sera perdue.')) {
            sessionStorage.setItem('quizZH_intentionalQuit', 'true');
            sessionStorage.removeItem('quizZH_activeSession');
            // Clear theme/difficulty to force reselection
            localStorage.removeItem('quizZH_selectedTheme');
            localStorage.removeItem('quizZH_difficulty');
            window.location.href = 'theme-selection.html';
        }
    });
    
    // Start game
    displayQuestion()
});
