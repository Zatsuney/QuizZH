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
                text: "Quel animé est connu grâce à son personnage principale et son chapeau de paille ?",
                answers: [
                    { text: "One Piece", correct: true },
                    { text: "Naruto", correct: false },
                    { text: "Bleach", correct: false },
                    { text: "Death Note", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 2,
                number: 2,
                text: "En formule 1, avec quelle écurie roule Charles Leclerc ?",
                answers: [
                    { text: "Mercedes", correct: false },
                    { text: "Red Bull", correct: false },
                    { text: "Ferrari", correct: true },
                    { text: "Audi", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 3,
                number: 3,
                text: "Quel groupe de musique a fait connaître le rappeur GIMS ?",
                answers: [
                    { text: "Les Beatles", correct: false },
                    { text: "Sexion d'assaut", correct: true },
                    { text: "IAM", correct: false },
                    { text: "S-crew", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 4,
                number: 4,
                text: "À combien de questions avez-vous répondu à la manche 1 ?",
                answers: [
                    { text: "15", correct: false },
                    { text: "20", correct: true },
                    { text: "25", correct: false },
                    { text: "30", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 5,
                number: 5,
                text: "En France, à quel classe commence-t-on le collège ?",
                answers: [
                    { text: "CM2", correct: false },
                    { text: "3ème", correct: false },
                    { text: "Terminale", correct: false },
                    { text: "6ème", correct: true }
                ],
                timeLimit: 30
            },
            {
                id: 6,
                number: 6,
                text: "Qui est le créateur d'Apple ?",
                answers: [
                    { text: "Steve Jobs", correct: true },
                    { text: "Mark Zuckerberg", correct: false },
                    { text: "Elon Musk", correct: false },
                    { text: "Jeff Bezos", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 7,
                number: 7,
                text: "Dans le dessin animé Titeuf, quel doubleur français prête sa voix à Titeuf ?",
                answers: [
                    { text: "Jérémie Covillault", correct: false },
                    { text: "Alexandre Nguyen", correct: false },
                    { text: "Donald Reignoux", correct: true },
                    { text: "Dorothée Pousséo", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 8,
                number: 8,
                text: "Quel est le pays le plus petit du monde ?",
                answers: [
                    { text: "Saint-Marin", correct: false },
                    { text: "Vatican", correct: true },
                    { text: "Bangladesh", correct: false },
                    { text: "Andorre", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 9,
                number: 9,
                text: "Quel groupe de musique avait comme chanteur John Lennon ?",
                answers: [
                    { text: "Nirvana", correct: false },
                    { text: "Queen", correct: false },
                    { text: "U2", correct: false },
                    { text: "The Beatles", correct: true }
                ],
                timeLimit: 30
            },
            {
                id: 10,
                number: 10,
                text: "De quelle nationalité est le groupe de rock U2 ?",
                answers: [
                    { text: "Anglais", correct: false },
                    { text: "Écossais", correct: false },
                    { text: "Irlandais", correct: true },
                    { text: "Gallois", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 11,
                number: 11,
                text: "Dans le dessin animé Code Lyoko, comment s'appelle l'antagoniste ?",
                answers: [
                    { text: "Xana", correct: true },
                    { text: "Hopper", correct: false },
                    { text: "Stern", correct: false },
                    { text: "Lyoko", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 12,
                number: 12,
                text: "Quel pays a remporté la première coupe du monde de football ?",
                answers: [
                    { text: "Brésil", correct: false },
                    { text: "Argentine", correct: false },
                    { text: "Allemagne", correct: false },
                    { text: "Uruguay", correct: true }
                ],
                timeLimit: 30
            },
            {
                id: 13,
                number: 13,
                text: "Qui est le premier homme à avoir fait le tour du monde ?",
                answers: [
                    { text: "Diderot", correct: false },
                    { text: "Mona Lisa", correct: false },
                    { text: "Magellan", correct: true },
                    { text: "Gutenberg", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 14,
                number: 14,
                text: "Qui a écrit « Candide » ?",
                answers: [
                    { text: "Voltaire", correct: true },
                    { text: "Prévert", correct: false },
                    { text: "Hugo", correct: false },
                    { text: "Diderot", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 15,
                number: 15,
                text: "Quel est le nom du texte religieux juif ?",
                answers: [
                    { text: "L'Avesta", correct: false },
                    { text: "La Torah", correct: true },
                    { text: "Le Coran", correct: false },
                    { text: "La Bible", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 16,
                number: 16,
                text: "En quelle année Anne Frank est-elle décédée ?",
                answers: [
                    { text: "1914", correct: false },
                    { text: "1918", correct: false },
                    { text: "1939", correct: false },
                    { text: "1945", correct: true }
                ],
                timeLimit: 30
            },
            {
                id: 17,
                number: 17,
                text: "Quelle est la hauteur du Mont Blanc ?",
                answers: [
                    { text: "4806m", correct: true },
                    { text: "3659m", correct: false },
                    { text: "4009m", correct: false },
                    { text: "5012m", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 18,
                number: 18,
                text: "Quelle est la capitale de la Bolivie ?",
                answers: [
                    { text: "Bogota", correct: false },
                    { text: "La Paz", correct: true },
                    { text: "Lima", correct: false },
                    { text: "Montevideo", correct: false }
                ],
                timeLimit: 30
            },
            {
                id: 19,
                number: 19,
                text: "Quel rôle au loup-garou de Thiercelieux permet de changer de camp si son mentor est éliminé ?",
                answers: [
                    { text: "Le chien-loup", correct: false },
                    { text: "Le joueur de flûte", correct: false },
                    { text: "L'ange", correct: false },
                    { text: "L'enfant sauvage", correct: true }
                ],
                timeLimit: 30
            },
            {
                id: 20,
                number: 20,
                text: "Comment s'appelle le calendrier maya avec 365 jours ?",
                answers: [
                    { text: "Hijri", correct: false },
                    { text: "Hégirien", correct: false },
                    { text: "Haab'", correct: true },
                    { text: "Le calendrier lunaire", correct: false }
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
