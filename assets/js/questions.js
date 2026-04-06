// Structure of questions for each round (Manche)
const QUESTIONS_DATA = {
    1: {
        title: "Manche 1 - Questions",
        rules: [
            "📝 20 questions à répondre",
            "📋 4 réponses par question",
            "⏱️ 15 secondes par question",
            "🎯 +1 point par bonne réponse"
        ],
        questions: [
            {
                id: 1,
                number: 1,
                text: "Quelle est la capitale de l'Italie ?",
                answers: [
                    { text: "Madrid", correct: false },
                    { text: "Rome", correct: true },
                    { text: "Athènes", correct: false },
                    { text: "Lisbonne", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 2,
                number: 2,
                text: "Combien y a-t-il de continents sur Terre ?",
                answers: [
                    { text: "5", correct: false },
                    { text: "6", correct: false },
                    { text: "7", correct: true },
                    { text: "8", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 3,
                number: 3,
                text: "Quel est le plus grand océan ?",
                answers: [
                    { text: "Atlantique", correct: false },
                    { text: "Indien", correct: false },
                    { text: "Arctique", correct: false },
                    { text: "Pacifique", correct: true }
                ],
                timeLimit: 30
            },
            {
                id: 4,
                number: 4,
                text: "Qui a peint la Joconde ?",
                answers: [
                    { text: "Picasso", correct: false },
                    { text: "Léonard de Vinci", correct: true },
                    { text: "Van Gogh", correct: false },
                    { text: "Monet", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 5,
                number: 5,
                text: "Quelle planète est surnommée la planète rouge ?",
                answers: [
                    { text: "Mars", correct: true },
                    { text: "Jupiter", correct: false },
                    { text: "Vénus", correct: false },
                    { text: "Saturne", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 6,
                number: 6,
                text: "Quel est l'animal le plus rapide sur terre ?",
                answers: [
                    { text: "Lion", correct: false },
                    { text: "Guépard", correct: true },
                    { text: "Tigre", correct: false },
                    { text: "Léopard", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 7,
                number: 7,
                text: "Combien font 8 × 7 ?",
                answers: [
                    { text: "54", correct: false },
                    { text: "56", correct: true },
                    { text: "58", correct: false },
                    { text: "60", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 8,
                number: 8,
                text: "Dans quel pays se trouve la tour Eiffel ?",
                answers: [
                    { text: "Italie", correct: false },
                    { text: "Espagne", correct: false },
                    { text: "France", correct: true },
                    { text: "Belgique", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 9,
                number: 9,
                text: "Quel est le symbole chimique de l'eau ?",
                answers: [
                    { text: "O2", correct: false },
                    { text: "CO2", correct: false },
                    { text: "H2O", correct: true },
                    { text: "HO", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 10,
                number: 10,
                text: "Qui a écrit \"Les Misérables\" ?",
                answers: [
                    { text: "Émile Zola", correct: false },
                    { text: "Victor Hugo", correct: true },
                    { text: "Molière", correct: false },
                    { text: "Balzac", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 11,
                number: 11,
                text: "Combien de jours y a-t-il dans une année normale ?",
                answers: [
                    { text: "364", correct: false },
                    { text: "365", correct: true },
                    { text: "366", correct: false },
                    { text: "360", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 12,
                number: 12,
                text: "Quel est le plus grand animal du monde ?",
                answers: [
                    { text: "Éléphant", correct: false },
                    { text: "Requin", correct: false },
                    { text: "Baleine bleue", correct: true },
                    { text: "Girafe", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 13,
                number: 13,
                text: "Quelle langue est parlée au Brésil ?",
                answers: [
                    { text: "Espagnol", correct: false },
                    { text: "Portugais", correct: true },
                    { text: "Français", correct: false },
                    { text: "Anglais", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 14,
                number: 14,
                text: "Quelle est la monnaie de l'Union européenne ?",
                answers: [
                    { text: "Dollar", correct: false },
                    { text: "Euro", correct: true },
                    { text: "Livre", correct: false },
                    { text: "Yen", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 15,
                number: 15,
                text: "Combien de côtés a un triangle ?",
                answers: [
                    { text: "2", correct: false },
                    { text: "3", correct: true },
                    { text: "4", correct: false },
                    { text: "5", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 16,
                number: 16,
                text: "Quel instrument a des touches noires et blanches ?",
                answers: [
                    { text: "Guitare", correct: false },
                    { text: "Piano", correct: true },
                    { text: "Violon", correct: false },
                    { text: "Flûte", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 17,
                number: 17,
                text: "Quel est le plus long fleuve du monde ?",
                answers: [
                    { text: "Amazone", correct: false },
                    { text: "Nil", correct: true },
                    { text: "Yangtsé", correct: false },
                    { text: "Mississippi", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 18,
                number: 18,
                text: "Qui est le créateur de Mickey Mouse ?",
                answers: [
                    { text: "Walt Disney", correct: true },
                    { text: "Pixar", correct: false },
                    { text: "DreamWorks", correct: false },
                    { text: "Warner Bros", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 19,
                number: 19,
                text: "Quelle couleur obtient-on en mélangeant bleu et jaune ?",
                answers: [
                    { text: "Rouge", correct: false },
                    { text: "Vert", correct: true },
                    { text: "Orange", correct: false },
                    { text: "Violet", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 20,
                number: 20,
                text: "Quel gaz respirons-nous principalement ?",
                answers: [
                    { text: "Oxygène", correct: true },
                    { text: "Azote", correct: false },
                    { text: "CO2", correct: false },
                    { text: "Hélium", correct: false }
                ],
                timeLimit: 30
            }
        ]
    },
    2: {
        title: "Manche 2 - Questions",
        rules: [
            "📝 20 questions à répondre",
            "📋 4 réponses par question",
            "⏱️ 15 secondes par question",
            "🎯 +1 point par bonne réponse"
        ],
        questions: [
            {
                id: 1,
                number: 1,
                text: "Quelle est la capitale de l'Espagne ?",
                answers: [
                    { text: "Barcelone", correct: false },
                    { text: "Madrid", correct: true },
                    { text: "Séville", correct: false },
                    { text: "Valence", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 2,
                number: 2,
                text: "Combien de planètes dans le système solaire ?",
                answers: [
                    { text: "7", correct: false },
                    { text: "8", correct: true },
                    { text: "9", correct: false },
                    { text: "10", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 3,
                number: 3,
                text: "Quel est l'organe qui pompe le sang ?",
                answers: [
                    { text: "Poumon", correct: false },
                    { text: "Foie", correct: false },
                    { text: "Cœur", correct: true },
                    { text: "Rein", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 4,
                number: 4,
                text: "Quelle est la langue officielle de l'Allemagne ?",
                answers: [
                    { text: "Anglais", correct: false },
                    { text: "Allemand", correct: true },
                    { text: "Néerlandais", correct: false },
                    { text: "Suédois", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 5,
                number: 5,
                text: "Quel animal est surnommé le roi de la jungle ?",
                answers: [
                    { text: "Tigre", correct: false },
                    { text: "Lion", correct: true },
                    { text: "Ours", correct: false },
                    { text: "Loup", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 6,
                number: 6,
                text: "Combien de minutes dans une heure ?",
                answers: [
                    { text: "30", correct: false },
                    { text: "45", correct: false },
                    { text: "60", correct: true },
                    { text: "90", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 7,
                number: 7,
                text: "Quel métal est utilisé pour fabriquer les canettes ?",
                answers: [
                    { text: "Fer", correct: false },
                    { text: "Aluminium", correct: true },
                    { text: "Or", correct: false },
                    { text: "Cuivre", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 8,
                number: 8,
                text: "Qui a découvert l'Amérique en 1492 ?",
                answers: [
                    { text: "Magellan", correct: false },
                    { text: "Christophe Colomb", correct: true },
                    { text: "Vasco de Gama", correct: false },
                    { text: "Cook", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 9,
                number: 9,
                text: "Quel est le plus petit pays du monde ?",
                answers: [
                    { text: "Monaco", correct: false },
                    { text: "Vatican", correct: true },
                    { text: "Malte", correct: false },
                    { text: "Luxembourg", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 10,
                number: 10,
                text: "Combien de pattes a une araignée ?",
                answers: [
                    { text: "6", correct: false },
                    { text: "8", correct: true },
                    { text: "10", correct: false },
                    { text: "12", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 11,
                number: 11,
                text: "Quelle saison suit l'été ?",
                answers: [
                    { text: "Printemps", correct: false },
                    { text: "Automne", correct: true },
                    { text: "Hiver", correct: false },
                    { text: "Saison sèche", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 12,
                number: 12,
                text: "Quel est le principal gaz à effet de serre ?",
                answers: [
                    { text: "Oxygène", correct: false },
                    { text: "CO2", correct: true },
                    { text: "Azote", correct: false },
                    { text: "Hydrogène", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 13,
                number: 13,
                text: "Quel sport utilise un ballon rond ?",
                answers: [
                    { text: "Tennis", correct: false },
                    { text: "Football", correct: true },
                    { text: "Rugby", correct: false },
                    { text: "Golf", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 14,
                number: 14,
                text: "Combien de lettres dans l'alphabet français ?",
                answers: [
                    { text: "24", correct: false },
                    { text: "25", correct: false },
                    { text: "26", correct: true },
                    { text: "27", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 15,
                number: 15,
                text: "Quel est le contraire de \"rapide\" ?",
                answers: [
                    { text: "Lent", correct: true },
                    { text: "Fort", correct: false },
                    { text: "Grand", correct: false },
                    { text: "Court", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 16,
                number: 16,
                text: "Quel pays est connu pour les pyramides ?",
                answers: [
                    { text: "Mexique", correct: false },
                    { text: "Égypte", correct: true },
                    { text: "Inde", correct: false },
                    { text: "Chine", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 17,
                number: 17,
                text: "Quelle est la couleur du soleil dans un dessin d'enfant ?",
                answers: [
                    { text: "Bleu", correct: false },
                    { text: "Jaune", correct: true },
                    { text: "Rouge", correct: false },
                    { text: "Vert", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 18,
                number: 18,
                text: "Quel fruit est jaune et courbé ?",
                answers: [
                    { text: "Pomme", correct: false },
                    { text: "Banane", correct: true },
                    { text: "Poire", correct: false },
                    { text: "Orange", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 19,
                number: 19,
                text: "Combien de doigts sur une main ?",
                answers: [
                    { text: "4", correct: false },
                    { text: "5", correct: true },
                    { text: "6", correct: false },
                    { text: "7", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 20,
                number: 20,
                text: "Quelle est la boisson faite avec des grains de café ?",
                answers: [
                    { text: "Thé", correct: false },
                    { text: "Chocolat", correct: false },
                    { text: "Café", correct: true },
                    { text: "Lait", correct: false }
                ],
                timeLimit: 30
            }
        ]
    },
    3: {
        title: "Manche 3 - Among Us Edition",
        rules: [
            "👽 20 questions sur Among Us",
            "⏱️ 15 secondes par question",
            "✍️ Réponses courtes et simples",
            "🎯 +1 point par bonne réponse"
        ],
        questions: [
            { id: 1, number: 1, text: "En quelle année est sortie Among us ?", answer: "2018", timeLimit: 30 },
            { id: 2, number: 2, text: "Sur quelle plateforme est-il sorti en premier ?", answer: "Téléphone", timeLimit: 30 },
            { id: 3, number: 3, text: "Combien de couleurs peut-on choisir pour jouer ?", answer: "18", timeLimit: 30 },
            { id: 4, number: 4, text: "Dans la boutique, combien de haricots coûte le pet le plus chère ?", answer: "42000", timeLimit: 30 },
            { id: 5, number: 5, text: "Comment s'appelle la monnaie payante ?", answer: "Les étoiles", timeLimit: 30 },
            { id: 6, number: 6, text: "Quel studio à développé Among us ?", answer: "Innersloth", timeLimit: 30 },
            { id: 7, number: 7, text: "Combien y a-t-il de maps ?", answer: "5", timeLimit: 30 },
            { id: 8, number: 8, text: "Quel est le nom de la dernière arrivée sur le jeu ?", answer: "FUNGLE", timeLimit: 30 },
            { id: 9, number: 9, text: "Combien de lettres comporte un code ?", answer: "6", timeLimit: 30 },
            { id: 10, number: 10, text: "Sur Polus, dans combien de salles nommées y a-t-il de quêtes ?", answer: "10", timeLimit: 30 },
            { id: 11, number: 11, text: "Sur Polus, si on a toutes les quêtes de la map, combien en avons-nous ?", answer: "35", timeLimit: 30 },
            { id: 12, number: 12, text: "De quelle couleur est la table admin ?", answer: "Vert", timeLimit: 30 },
            { id: 13, number: 13, text: "En imposteur sur Polus, combien de portes peut-on fermer ?", answer: "7", timeLimit: 30 },
            { id: 14, number: 14, text: "Combien de vents y a-t-il sur Polus ?", answer: "12", timeLimit: 30 },
            { id: 15, number: 15, text: "Combien y a-t-il de quêtes Téléchargement (hors comm) sur Polus ?", answer: "5", timeLimit: 30 },
            { id: 16, number: 16, text: "Combien de rôles y a-t-il en crewmates ?", answer: "6", timeLimit: 30 },
            { id: 17, number: 17, text: "Combien de rôles y a-t-il en Imposteurs ?", answer: "3", timeLimit: 30 },
            { id: 18, number: 18, text: "Quelle est la particularité des portes sur The Skeld ?", answer: "Automatique", timeLimit: 30 },
            { id: 19, number: 19, text: "Sur Polus, dans quelle salle on réapparaît après un meeting ?", answer: "Office", timeLimit: 30 },
            { id: 20, number: 20, text: "Sur The Skeld, combien de sabotages y a-t-il ?", answer: "4", timeLimit: 30 }
        ]
    }
};

// Get questions for a specific round
function getQuestionsForRound(roundNumber) {
    return QUESTIONS_DATA[roundNumber] || { title: `Manche ${roundNumber}`, questions: [] };
}

// Get a specific question from a round
function getQuestion(roundNumber, questionNumber) {
    const roundQuestions = getQuestionsForRound(roundNumber);
    return roundQuestions.questions.find(q => q.number === questionNumber);
}

// Get total questions count for a round
function getTotalQuestionsInRound(roundNumber) {
    return getQuestionsForRound(roundNumber).questions.length;
}

// Generate random question order
function generateQuestionOrder(roundNumber) {
    const totalQuestions = getTotalQuestionsInRound(roundNumber);
    const order = Array.from({ length: totalQuestions }, (_, i) => i + 1);
    // Fisher-Yates shuffle
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
}

// Get rules for a specific round
function getRulesForRound(roundNumber) {
    const roundData = getQuestionsForRound(roundNumber);
    return roundData.rules || [];
}

export { QUESTIONS_DATA, getQuestionsForRound, getQuestion, getTotalQuestionsInRound, generateQuestionOrder, getRulesForRound };
