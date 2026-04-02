// Firebase Database Operations (remplace localStorage)
import { db } from './firebase-config.js';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  writeBatch,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// ====== JOUEURS ======
export async function createPlayer(uid, email, displayName) {
  try {
    await setDoc(doc(db, 'users', uid), {
      email: email,
      displayName: displayName,
      createdAt: serverTimestamp(),
      role: 'player'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getPlayers() {
  try {
    const snapshot = await getDocs(collection(db, 'players'));
    const players = {};
    snapshot.forEach(doc => {
      players[doc.id] = doc.data();
    });
    console.log(`📊 getPlayers() returned ${Object.keys(players).length} players:`, players);
    return players;
  } catch (error) {
    console.error('Error getting players:', error);
    return {};
  }
}

export async function registerPlayer(playerName) {
  try {
    console.log(`📝 Registering player: ${playerName}`);
    const playerRef = doc(db, 'players', playerName);
    await setDoc(playerRef, {
      name: playerName,
      status: 'waiting',
      room: 'Salle d\'attente',
      joinedAt: serverTimestamp()
    });
    console.log(`✅ Player registered successfully: ${playerName}`);
  } catch (error) {
    console.error('❌ Error registering player:', error);
  }
}

export async function unregisterPlayer(playerName) {
  try {
    await deleteDoc(doc(db, 'players', playerName));
  } catch (error) {
    console.error('Error unregistering player:', error);
  }
}

export async function updatePlayerStatus(playerName, status, room = null) {
  try {
    const playerRef = doc(db, 'players', playerName);
    const updateData = { status };
    if (room) updateData.room = room;
    await updateDoc(playerRef, updateData);
  } catch (error) {
    console.error('Error updating player status:', error);
  }
}

export async function removePlayer(playerName) {
  try {
    await deleteDoc(doc(db, 'players', playerName));
  } catch (error) {
    console.error('Error removing player:', error);
  }
}

// ====== TEAMS (for team rounds) ======
export async function registerTeam(roundNumber, teamId, player1Name, player2Name = null) {
  try {
    console.log(`📝 Registering team ${teamId} for round ${roundNumber}`);
    const teamRef = doc(db, 'rounds', `round${roundNumber}`, 'teams', teamId);
    await setDoc(teamRef, {
      teamId: teamId,
      player1: player1Name,
      player2: player2Name,
      status: 'waiting',
      joinedAt: serverTimestamp()
    });
    console.log(`✅ Team registered successfully: ${teamId}`);
  } catch (error) {
    console.error('❌ Error registering team:', error);
  }
}

export async function getTeamsForRound(roundNumber) {
  try {
    const snapshot = await getDocs(collection(db, 'rounds', `round${roundNumber}`, 'teams'));
    const teams = {};
    snapshot.forEach(doc => {
      teams[doc.id] = doc.data();
    });
    console.log(`📊 getTeamsForRound(${roundNumber}) returned ${Object.keys(teams).length} teams`);
    return teams;
  } catch (error) {
    console.error('Error getting teams:', error);
    return {};
  }
}

export async function getTeamByPlayer(roundNumber, playerName) {
  try {
    const teams = await getTeamsForRound(roundNumber);
    for (const [teamId, team] of Object.entries(teams)) {
      if (team.player1 === playerName || team.player2 === playerName) {
        return { teamId, ...team };
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting team by player:', error);
    return null;
  }
}

export async function updateTeamStatus(roundNumber, teamId, status) {
  try {
    const teamRef = doc(db, 'rounds', `round${roundNumber}`, 'teams', teamId);
    await updateDoc(teamRef, { status });
  } catch (error) {
    console.error('Error updating team status:', error);
  }
}

export async function removeTeam(roundNumber, teamId) {
  try {
    await deleteDoc(doc(db, 'rounds', `round${roundNumber}`, 'teams', teamId));
  } catch (error) {
    console.error('Error removing team:', error);
  }
}

// ====== MANCHES ======
export async function setActiveRound(roundNumber, state = 'running') {
  try {
    const configRef = doc(db, 'config', 'activeRound');
    await setDoc(configRef, { 
      round: roundNumber,
      state: state,
      startedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error setting active round:', error);
  }
}

export async function getActiveRound() {
  try {
    const doc_ref = await getDoc(doc(db, 'config', 'activeRound'));
    return doc_ref.exists() ? doc_ref.data().round : null;
  } catch (error) {
    console.error('Error getting active round:', error);
    return null;
  }
}

export async function getActiveRoundData() {
  try {
    const doc_ref = await getDoc(doc(db, 'config', 'activeRound'));
    if (doc_ref.exists()) {
      const data = doc_ref.data();
      return {
        round: data.round,
        state: data.state || 'running'
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting active round data:', error);
    return null;
  }
}

export async function clearActiveRound() {
  try {
    const configRef = doc(db, 'config', 'activeRound');
    await setDoc(configRef, { round: null }, { merge: true });
  } catch (error) {
    console.error('Error clearing active round:', error);
  }
}

// ====== QUESTIONS ======
export async function getQuestionsOrder(roundNumber) {
  try {
    const doc_ref = await getDoc(doc(db, 'rounds', `round${roundNumber}`, 'config', 'questionsOrder'));
    return doc_ref.exists() ? doc_ref.data().order : null;
  } catch (error) {
    console.error('Error getting questions order:', error);
    return null;
  }
}

export async function setQuestionsOrder(roundNumber, order) {
  try {
    const orderRef = doc(db, 'rounds', `round${roundNumber}`, 'config', 'questionsOrder');
    await setDoc(orderRef, { order }, { merge: true });
  } catch (error) {
    console.error('Error setting questions order:', error);
  }
}

export async function getCurrentQuestion(roundNumber) {
  try {
    const doc_ref = await getDoc(doc(db, 'rounds', `round${roundNumber}`, 'config', 'currentQuestion'));
    return doc_ref.exists() ? doc_ref.data().question : 1;
  } catch (error) {
    console.error('Error getting current question:', error);
    return 1;
  }
}

export async function setCurrentQuestion(roundNumber, questionNumber) {
  try {
    const configRef = doc(db, 'rounds', `round${roundNumber}`, 'config', 'currentQuestion');
    await setDoc(configRef, { question: questionNumber }, { merge: true });
  } catch (error) {
    console.error('Error setting current question:', error);
  }
}

// ====== RÉPONSES ======
export async function getAnswers(roundNumber) {
  try {
    const snapshot = await getDocs(collection(db, 'rounds', `round${roundNumber}`, 'answers'));
    const answers = {};
    snapshot.forEach(doc => {
      answers[doc.id] = doc.data();
    });
    return answers;
  } catch (error) {
    console.error('Error getting answers:', error);
    return {};
  }
}

export async function setAnswer(roundNumber, playerName, questionNumber, answer) {
  try {
    const answerRef = doc(db, 'rounds', `round${roundNumber}`, 'answers', playerName);
    const playerAnswers = {};
    playerAnswers[questionNumber] = {
      answer,
      validated: null,
      submittedAt: serverTimestamp()
    };
    
    // Merge avec les réponses existantes
    const existing = await getDoc(answerRef);
    if (existing.exists()) {
      const allAnswers = existing.data();
      playerAnswers[questionNumber] = {
        ...(allAnswers[questionNumber] || {}),
        ...playerAnswers[questionNumber]
      };
    }
    
    await setDoc(answerRef, { ...existing.data?.(), ...playerAnswers }, { merge: true });
  } catch (error) {
    console.error('Error setting answer:', error);
  }
}

export async function validateAnswer(roundNumber, playerName, questionNumber, isValid) {
  try {
    const answerRef = doc(db, 'rounds', `round${roundNumber}`, 'answers', playerName);
    const existing = await getDoc(answerRef);
    const allAnswers = existing.data() || {};
    
    if (allAnswers[questionNumber]) {
      allAnswers[questionNumber].validated = isValid;
    }
    
    await setDoc(answerRef, allAnswers, { merge: true });
  } catch (error) {
    console.error('Error validating answer:', error);
  }
}

export async function clearRoundData(roundNumber) {
  try {
    // Effacer les réponses
    const answersSnapshot = await getDocs(collection(db, 'rounds', `round${roundNumber}`, 'answers'));
    const batch = writeBatch(db);
    answersSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Effacer la config
    const configSnapshot = await getDocs(collection(db, 'rounds', `round${roundNumber}`, 'config'));
    configSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error clearing round data:', error);
  }
}

// ====== LISTENERS (Real-time) ======
export function listenToPlayers(callback) {
  return onSnapshot(collection(db, 'players'), (snapshot) => {
    const players = {};
    snapshot.forEach(doc => {
      players[doc.id] = doc.data();
    });
    callback(players);
  });
}

export function listenToAnswers(roundNumber, callback) {
  return onSnapshot(collection(db, 'rounds', `round${roundNumber}`, 'answers'), (snapshot) => {
    const answers = {};
    snapshot.forEach(doc => {
      answers[doc.id] = doc.data();
    });
    callback(answers);
  });
}

export function listenToActiveRound(callback) {
  return onSnapshot(doc(db, 'config', 'activeRound'), (doc_snapshot) => {
    if (doc_snapshot.exists()) {
      const data = doc_snapshot.data();
      callback({
        round: data.round,
        state: data.state || 'running'
      });
    } else {
      callback(null);
    }
  });
}

export function listenToCurrentQuestion(roundNumber, callback) {
  return onSnapshot(doc(db, `rounds/round${roundNumber}/config`, 'currentQuestion'), (doc_snapshot) => {
    const questionNum = doc_snapshot.exists() ? doc_snapshot.data().question : null;
    callback(questionNum);
  });
}

// ====== SCORING ======
export async function calculateRoundScores(roundNumber) {
  try {
    const answers = await getAnswers(roundNumber);
    const scores = {};

    Object.entries(answers).forEach(([playerName, playerAnswers]) => {
      let score = 0;
      
      // Count validated answers as +1
      Object.values(playerAnswers).forEach(answer => {
        if (answer.validated === true) {
          score += 1;
        }
        // If validated === false or null, score stays 0 for that answer
      });
      
      scores[playerName] = score;
    });

    // Sort by score descending
    const sortedScores = Object.entries(scores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([playerName, score], rank) => ({
        rank: rank + 1,
        playerName,
        score
      }));

    return sortedScores;
  } catch (error) {
    console.error('Error calculating round scores:', error);
    return [];
  }
}

// ====== PAIRING SYSTEM ======
export async function createPairingsFromRound(roundNumber) {
  try {
    const scores = await calculateRoundScores(roundNumber);
    
    if (scores.length < 2) {
      console.warn('Not enough players for pairing');
      return [];
    }

    // Create pairings: 1st+Last, 2nd+2nd-to-last, etc.
    const pairings = [];
    const totalPlayers = scores.length;
    
    for (let i = 0; i < Math.floor(totalPlayers / 2); i++) {
      const firstIndex = i;
      const lastIndex = totalPlayers - 1 - i;
      
      const pairing = {
        teamId: `team_${i + 1}`,
        player1: scores[firstIndex].playerName,
        player1Rank: scores[firstIndex].rank,
        player2: scores[lastIndex].playerName,
        player2Rank: scores[lastIndex].rank,
        createdFromRound: roundNumber,
        createdAt: serverTimestamp()
      };
      
      pairings.push(pairing);
    }

    // Handle odd number of players (player stays alone)
    if (totalPlayers % 2 === 1) {
      const middleIndex = Math.floor(totalPlayers / 2);
      pairings.push({
        teamId: `team_${pairings.length + 1}`,
        player1: scores[middleIndex].playerName,
        player1Rank: scores[middleIndex].rank,
        player2: null, // Solo player
        player2Rank: null,
        createdFromRound: roundNumber,
        createdAt: serverTimestamp()
      });
    }

    return pairings;
  } catch (error) {
    console.error('Error creating pairings:', error);
    return [];
  }
}

export async function savePairings(roundNumber, pairings) {
  try {
    const batch = writeBatch(db);
    
    // Clear existing pairings for next round
    const nextRound = roundNumber + 1;
    const existingPairings = await getDocs(collection(db, 'pairings', `round${nextRound}`, 'teams'));
    existingPairings.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Save new pairings
    pairings.forEach((pairing) => {
      const docRef = doc(db, 'pairings', `round${nextRound}`, 'teams', pairing.teamId);
      batch.set(docRef, pairing);
    });

    await batch.commit();
    console.log(`✅ Saved ${pairings.length} pairings for round ${nextRound}`);
  } catch (error) {
    console.error('Error saving pairings:', error);
  }
}

export async function getPairingsForRound(roundNumber) {
  try {
    const snapshot = await getDocs(collection(db, 'pairings', `round${roundNumber}`, 'teams'));
    const pairings = [];
    
    snapshot.forEach(doc => {
      pairings.push(doc.data());
    });
    
    return pairings.sort((a, b) => {
      const aNum = parseInt(a.teamId.split('_')[1]);
      const bNum = parseInt(b.teamId.split('_')[1]);
      return aNum - bNum;
    });
  } catch (error) {
    console.error('Error getting pairings:', error);
    return [];
  }
}

export async function initializeTeamsFromPairings(roundNumber) {
  try {
    const pairings = await getPairingsForRound(roundNumber);
    
    if (pairings.length === 0) {
      console.warn('No pairings found for round', roundNumber);
      return false;
    }

    // Register each team
    for (const pairing of pairings) {
      await registerTeam(roundNumber, pairing.teamId, pairing.player1, pairing.player2);
    }

    console.log(`✅ Initialized ${pairings.length} teams for round ${roundNumber}`);
    return true;
  } catch (error) {
    console.error('Error initializing teams from pairings:', error);
    return false;
  }
}

export async function eliminateLastPlayers(roundNumber, numberOfPlayersToEliminate = 5) {
  try {
    const scores = await calculateRoundScores(roundNumber);
    
    if (scores.length <= numberOfPlayersToEliminate) {
      console.warn('⚠️ Not enough players to eliminate');
      return [];
    }

    // Get the last players (lowest scores)
    const lastPlayers = scores.slice(-numberOfPlayersToEliminate);
    const eliminatedNames = lastPlayers.map(p => p.playerName);

    // Delete each eliminated player
    for (const playerName of eliminatedNames) {
      await removePlayer(playerName);
      console.log(`❌ Eliminated player: ${playerName}`);
    }

    console.log(`✅ ${eliminatedNames.length} players eliminated after round ${roundNumber}`);
    return eliminatedNames;
  } catch (error) {
    console.error('Error eliminating players:', error);
    return [];
  }
}

export async function keepTopPlayers(roundNumber, numberOfPlayersToKeep = 6) {
  try {
    const scores = await calculateRoundScores(roundNumber);
    
    if (scores.length <= numberOfPlayersToKeep) {
      console.warn('⚠️ Less than or equal to players to keep');
      return [];
    }

    // Get players to eliminate (all except top N)
    const playersToEliminate = scores.slice(numberOfPlayersToKeep);
    const eliminatedNames = playersToEliminate.map(p => p.playerName);

    // Delete each eliminated player
    for (const playerName of eliminatedNames) {
      await removePlayer(playerName);
      console.log(`❌ Disqualified player: ${playerName}`);
    }

    console.log(`✅ ${eliminatedNames.length} players disqualified after round ${roundNumber}, ${numberOfPlayersToKeep} players qualified`);
    return eliminatedNames;
  } catch (error) {
    console.error('Error disqualifying players:', error);
    return [];
  }
}

// ====== FINAL LEADERBOARD ======
export async function calculateFinalScores() {
  try {
    const finalScores = {};
    const finalTimes = {};
    
    // Calculate scores from all 5 rounds
    for (let roundNum = 1; roundNum <= 5; roundNum++) {
      const roundScores = await calculateRoundScores(roundNum);
      
      roundScores.forEach(entry => {
        const { playerName, score } = entry;
        
        if (!finalScores[playerName]) {
          finalScores[playerName] = 0;
          finalTimes[playerName] = 0;
        }
        
        finalScores[playerName] += score;
      });
    }
    
    // Get player display names and calculate times
    const players = {};
    const playerDocs = await getDocs(collection(db, 'players'));
    playerDocs.forEach(doc => {
      players[doc.id] = doc.data();
    });
    
    // Sort by final score descending
    const sortedFinalScores = Object.entries(finalScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([playerName, totalScore], rank) => ({
        rank: rank + 1,
        playerName,
        displayName: players[playerName]?.name || playerName,
        totalScore,
        totalTime: finalTimes[playerName] || 0
      }));
    
    return sortedFinalScores;
  } catch (error) {
    console.error('Error calculating final scores:', error);
    return [];
  }
}

export async function saveFinalLeaderboard(leaderboardData) {
  try {
    const batch = writeBatch(db);
    
    // Clear previous final scores
    const existingDocs = await getDocs(collection(db, 'finalScores'));
    existingDocs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Save new final scores
    leaderboardData.forEach((entry, index) => {
      const docRef = doc(db, 'finalScores', `rank_${index + 1}_${entry.playerName}`);
      batch.set(docRef, {
        rank: entry.rank,
        playerName: entry.playerName,
        displayName: entry.displayName,
        totalScore: entry.totalScore,
        totalTime: entry.totalTime,
        savedAt: serverTimestamp()
      });
    });
    
    await batch.commit();
    console.log('✅ Final leaderboard saved successfully');
  } catch (error) {
    console.error('Error saving final leaderboard:', error);
  }
}

export async function getFinalLeaderboard() {
  try {
    const leaderboard = [];
    const snapshot = await getDocs(collection(db, 'finalScores'));
    
    snapshot.forEach(doc => {
      leaderboard.push(doc.data());
    });
    
    return leaderboard.sort((a, b) => a.rank - b.rank);
  } catch (error) {
    console.error('Error getting final leaderboard:', error);
    return [];
  }
}
