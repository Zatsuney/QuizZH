// Structure of questions for each round (Manche)
const QUESTIONS_DATA = {
    1: {
        title: "Manche 1 - Questions",
        rules: [
            "📝 10 questions à répondre",
            "⏱️ 15 secondes par question",
            "✍️ Réponses courtes et simples",
            "🎯 +1 point par bonne réponse"
        ],
        questions: [
            {
                id: 1,
                number: 1,
                text: "Quelle est la capitale de la France?",
                timeLimit: 30
            },
            {
                id: 2,
                number: 2,
                text: "En quelle année l'homme a-t-il marché sur la lune?",
                timeLimit: 30
            },
            {
                id: 3,
                number: 3,
                text: "Quel est le plus grand océan du monde?",
                timeLimit: 30
            },
            {
                id: 4,
                number: 4,
                text: "Quel est le plus haut sommet du monde?",
                timeLimit: 30
            },
            {
                id: 5,
                number: 5,
                text: "En quelle année la Déclaration d'indépendance des États-Unis a-t-elle été signée?",
                timeLimit: 30
            },
            {
                id: 6,
                number: 6,
                text: "Quel élément chimique a le symbole Au?",
                timeLimit: 30
            },
            {
                id: 7,
                number: 7,
                text: "Quel est le fleuve le plus long du monde?",
                timeLimit: 30
            },
            {
                id: 8,
                number: 8,
                text: "En quel siècle a été inventée l'imprimerie?",
                timeLimit: 30
            },
            {
                id: 9,
                number: 9,
                text: "Quel est le pays le plus peuplé du monde?",
                timeLimit: 30
            },
            {
                id: 10,
                number: 10,
                text: "Quel est le plus grand désert du monde?",
                timeLimit: 30
            }
        ]
    },
    2: {
        title: "Manche 2 - Questions",
        rules: [
            "📝 5 questions à répondre",
            "⏱️ 15 secondes par question",
            "🤝 Les réponses doivent être exactes",
            "🎯 +1 point par bonne réponse"
        ],
        questions: [
            {
                id: 1,
                number: 1,
                text: "En quelle année a-t-on mis fin à l'apartheid en Afrique du Sud?",
                timeLimit: 30
            },
            {
                id: 2,
                number: 2,
                text: "Quel artiste a peint la Joconde?",
                timeLimit: 30
            },
            {
                id: 3,
                number: 3,
                text: "Combien de cordes a une guitare classique?",
                timeLimit: 30
            },
            {
                id: 4,
                number: 4,
                text: "En quel année l'homme a-t-il inventé le téléphone?",
                timeLimit: 30
            },
            {
                id: 5,
                number: 5,
                text: "Quel est le plus petit pays du monde?",
                timeLimit: 30
            }
        ]
    },
    3: {
        title: "Manche 3 - Among Us Edition",
        rules: [
            "👽 10 questions sur Among Us",
            "⏱️ 15 secondes par question",
            "🚀 Les 6 premiers terminent le quiz avec succès!",
            "🎯 +1 point par bonne réponse"
        ],
        questions: [
            {
                id: 1,
                number: 1,
                text: "En quelle année Among Us a-t-il été créé?",
                timeLimit: 30
            },
            {
                id: 2,
                number: 2,
                text: "Quel est le studio créateur d'Among Us?",
                timeLimit: 30
            },
            {
                id: 3,
                number: 3,
                text: "Combien de joueurs maximum dans une partie standard d'Among Us?",
                timeLimit: 30
            },
            {
                id: 4,
                number: 4,
                text: "Quel est le nom du vaisseau principal dans Among Us?",
                timeLimit: 30
            },
            {
                id: 5,
                number: 5,
                text: "Combien de cartes principales sont disponibles dans Among Us?",
                timeLimit: 30
            },
            {
                id: 6,
                number: 6,
                text: "Quel est le rôle spécial qui peut revenir d'entre les morts?",
                timeLimit: 30
            },
            {
                id: 7,
                number: 7,
                text: "Dans Among Us, comment appelle-t-on une personne qui sabote?",
                timeLimit: 30
            },
            {
                id: 8,
                number: 8,
                text: "Quel est le nom de la petite créature verte qu'on incarne?",
                timeLimit: 30
            },
            {
                id: 9,
                number: 9,
                text: "Combien de tâches les innocents doivent-ils généralement compléter?",
                timeLimit: 30
            },
            {
                id: 10,
                number: 10,
                text: "Dans quelle année Among Us a-t-il atteint son pic de popularité?",
                timeLimit: 30
            }
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
