import json
import os
from random import shuffle, choice, randint

# Templates de questions par thème
THEMES_QUESTIONS = {
    'sciences': {
        'easy': [
            {"q": "Quel est le plus grand organe du corps humain ?", "opts": ["La peau", "Le cœur", "Le poumon", "Le cerveau"], "ans": 0},
            {"q": "Combien de continents y a-t-il sur Terre ?", "opts": ["5", "6", "7", "8"], "ans": 2},
            {"q": "Quel est le plus grand océan du monde ?", "opts": ["Océan Atlantique", "Océan Indien", "Océan Pacifique", "Océan Arctique"], "ans": 2},
            {"q": "Quel gaz respirons-nous pour vivre ?", "opts": ["Dioxyde de carbone", "Oxygène", "Nitrogène", "Hydrogène"], "ans": 1},
            {"q": "Quelle est la plus grande planète du système solaire ?", "opts": ["Saturne", "Jupiter", "Neptune", "Uranus"], "ans": 1},
            {"q": "Combien de pattes a une araignée ?", "opts": ["6", "8", "10", "12"], "ans": 1},
            {"q": "Quel est l'animal terrestre le plus rapide ?", "opts": ["Le lion", "Le guépard", "Le cheval", "L'autruche"], "ans": 1},
            {"q": "Quel est le plus haut sommet du monde ?", "opts": ["Mont Blanc", "Mont Everest", "Mont Kilimandjaro", "Mont Aconcagua"], "ans": 1},
            {"q": "Combien de côtés a un hexagone ?", "opts": ["4", "5", "6", "7"], "ans": 2},
            {"q": "Quel gaz les plantes absorbent-elles pour se nourrir ?", "opts": ["Oxygène", "Dioxyde de carbone", "Nitrogène", "Diazote"], "ans": 1},
            {"q": "Quel est le plus long fleuve du monde ?", "opts": ["Le Nil", "L'Amazone", "Le Yangtsé", "Le Mississipi"], "ans": 0},
            {"q": "Quel est le plus grand désert du monde ?", "opts": ["Le Sahara", "Le Gobi", "Le Kalahari", "La Patagonie"], "ans": 0},
            {"q": "Combien de chromosomes ont les humains ?", "opts": ["23", "46", "48", "50"], "ans": 1},
            {"q": "Quel est le plus petit os du corps humain ?", "opts": ["L'étrier", "L'os du bassin", "La rotule", "Le fémur"], "ans": 0},
            {"q": "Quel est l'élément chimique le plus abondant dans l'univers ?", "opts": ["Helium", "Oxygène", "Carbone", "Hydrogène"], "ans": 3},
            {"q": "Combien de secondes y a-t-il dans une heure ?", "opts": ["3000", "3300", "3600", "3900"], "ans": 2},
            {"q": "Quel est le métal le plus conducteur de l'électricité ?", "opts": ["Fer", "Argent", "Or", "Cuivre"], "ans": 1},
            {"q": "Quel est le plus grand mammifère du monde ?", "opts": ["L'éléphant", "La girafe", "La baleine bleue", "L'hippopotame"], "ans": 2},
            {"q": "Quel est le plus haut animal terrestre ?", "opts": ["L'autruche", "Le chameau", "La girafe", "L'éléphant"], "ans": 2},
            {"q": "Combien de mois a une année ?", "opts": ["10", "11", "12", "13"], "ans": 2},
            {"q": "Quel est le plus rapide animal marin ?", "opts": ["Le dauphin", "L'espadon", "La pieuvre", "Le requin blanc"], "ans": 1},
            {"q": "Quel est le plus profond océan du monde ?", "opts": ["L'Atlantique", "Le Pacifique", "L'Indien", "L'Arctique"], "ans": 1},
            {"q": "Combien de pattes a une fourmi ?", "opts": ["4", "6", "8", "10"], "ans": 1},
            {"q": "Quel est le plus petit oiseau du monde ?", "opts": ["Le colibri", "Le moineau", "Le pigeon", "Le corbeau"], "ans": 0},
            {"q": "Quel est l'organe responsable du filtrage du sang ?", "opts": ["Le cœur", "Le foie", "Le rein", "Le pancréas"], "ans": 2},
            {"q": "Quel est le muscle le plus fort du corps humain ?", "opts": ["Le biceps", "Le quadriceps", "La mâchoire", "Le gastrocnémien"], "ans": 2},
            {"q": "Combien de verres d'eau doivent boire les humains par jour ?", "opts": ["4", "6", "8", "10"], "ans": 2},
            {"q": "Quel est l'élément chimique représenté par le symbole Au ?", "opts": ["Argent", "Or", "Aluminium", "Arsenic"], "ans": 1},
            {"q": "Quel est le plus grand lac du monde ?", "opts": ["Le lac Baïkal", "La mer Caspienne", "Le lac Victoria", "Le lac Supérieur"], "ans": 1},
            {"q": "Combien de types de dents ont les adultes ?", "opts": ["3", "4", "5", "6"], "ans": 1},
            {"q": "Quel est le plus grand récif de corail du monde ?", "opts": ["La Grande Barrière de Corail", "Le récif de Beliz", "Le récif du Sinaï", "Le récif des Seychelles"], "ans": 0},
            {"q": "Quel est le plus grand volcan actif du monde ?", "opts": ["Le Krakatoa", "L'Etna", "Le Vésuve", "Le Sakurajima"], "ans": 3},
            {"q": "Combien de phases a la Lune ?", "opts": ["3", "4", "6", "8"], "ans": 1},
            {"q": "Quel est le plus grand désert froid du monde ?", "opts": ["L'Antarctique", "L'Arctique", "Le Gobi", "Le Kalahari"], "ans": 0},
            {"q": "Quel est le plus grand glacier du monde ?", "opts": ["Le glacier d'Aletsch", "L'inlandsis du Groenland", "La barrière de Ross", "Le champ de glace de Patagonie"], "ans": 1},
            {"q": "Combien de côtés a un triangle ?", "opts": ["2", "3", "4", "5"], "ans": 1},
            {"q": "Quel est le plus grand musée du monde ?", "opts": ["Le Louvre", "Le Vatican", "La Galerie des Offices", "L'Hermitage"], "ans": 0},
            {"q": "Quel est le plus haut édifice du monde ?", "opts": ["La Burj Khalifa", "La Tour Eiffel", "Le One World Trade Center", "La Tour CN"], "ans": 0},
            {"q": "Combien de cordes a une harpe ?", "opts": ["20", "40", "50", "60"], "ans": 2},
            {"q": "Quel est le plus grand arbre du monde ?", "opts": ["Le séquoia géant", "Le cèdre du Liban", "Le baobab", "L'if"], "ans": 0},
            {"q": "Quel est l'élément chimique le plus dense ?", "opts": ["L'uranium", "L'osmium", "Le plutonium", "L'or"], "ans": 1},
            {"q": "Quel est le plus grand parc national du monde ?", "opts": ["Le parc de Yellowstone", "Le parc du Serengeti", "Le parc de Zhangjiajie", "Le parc de Denali"], "ans": 0},
            {"q": "Quel est le plus grand aéroport du monde par trafic ?", "opts": ["Hartsfield-Jackson", "Dallas-Fort Worth", "Los Angeles", "Dubaï"], "ans": 0},
            {"q": "Combien de cordes a un violon ?", "opts": ["3", "4", "5", "6"], "ans": 1},
            {"q": "Quel est le plus grand port du monde ?", "opts": ["Shanghai", "Singapour", "Rotterdam", "Anvers"], "ans": 0},
            {"q": "Quelle est la température normale du corps humain ?", "opts": ["35°C", "36.5°C", "37.5°C", "38°C"], "ans": 1},
            {"q": "Combien de sens possède l'être humain ?", "opts": ["3", "4", "5", "6"], "ans": 2},
            {"q": "Quel est le gaz responsable de l'effet de serre ?", "opts": ["Oxyde de carbone", "Dioxyde de carbone", "Monoxyde d'azote", "Protoxyde d'azote"], "ans": 1},
        ],
        'medium': [
            {"q": "Quel est le cycle de reproduction le plus long chez les animaux ?", "opts": ["L'éléphant (22 mois)", "La girafe (14 mois)", "Le cheval (11 mois)", "Le chameau (13 mois)"], "ans": 0},
            {"q": "Combien de lobes a le cerveau humain ?", "opts": ["2", "3", "4", "5"], "ans": 2},
            {"q": "Quel est le plus grand os du corps humain ?", "opts": ["L'humérus", "Le fémur", "Le tibia", "Le radius"], "ans": 1},
            {"q": "Quelle est la vitesse de la lumière ?", "opts": ["200 000 km/s", "300 000 km/s", "400 000 km/s", "500 000 km/s"], "ans": 1},
            {"q": "Quel est le plus acide des acides naturels ?", "opts": ["L'acide acétique", "L'acide citrique", "L'acide formique", "L'acide sulfurique"], "ans": 2},
            {"q": "Combien de muscles a le corps humain ?", "opts": ["206", "412", "648", "782"], "ans": 2},
            {"q": "Quel est le plus grand organe interne du corps humain ?", "opts": ["Le cœur", "Le foie", "Le poumon", "L'estomac"], "ans": 1},
            {"q": "Quelle est la profondeur maximale de la Fosse des Mariannes ?", "opts": ["7000m", "8500m", "10000m", "11000m"], "ans": 3},
            {"q": "Quel est le gaz le plus abondant dans l'atmosphère terrestre ?", "opts": ["Oxygène", "Dioxyde de carbone", "Nitrogène", "Argon"], "ans": 2},
            {"q": "Combien de vertèbres cervicales a le cou ?", "opts": ["5", "7", "9", "11"], "ans": 1},
            {"q": "Quel est l'animal avec le plus long cou du monde ?", "opts": ["L'autruche", "La girafe", "Le chameau", "L'alpaga"], "ans": 1},
            {"q": "Quelle est la distance moyenne Terre-Lune ?", "opts": ["238 855 km", "348 855 km", "384 400 km", "450 000 km"], "ans": 2},
            {"q": "Quel est le plus grand carnivore terrestre ?", "opts": ["Le lion", "Le tigre", "L'ours grizzly", "L'ours polaire"], "ans": 3},
            {"q": "Quel est le plus rapide oiseau du monde ?", "opts": ["Le faucon sacre", "L'aigle royal", "Le faucon pélerin", "L'autruche"], "ans": 2},
            {"q": "Combien de côtés a un dodécagone ?", "opts": ["8", "10", "12", "14"], "ans": 2},
            {"q": "Quel est le plus haut point de l'Afrique ?", "opts": ["Le Kilimandjaro", "Le Mont Kenya", "Le Rwanda", "Le Mont Cameroun"], "ans": 0},
            {"q": "Quel est le plus grand désert chaud du monde ?", "opts": ["Le Sahara", "Le Gobi", "Le Kalahari", "L'Arabian"], "ans": 0},
            {"q": "Quelle est la densité de l'eau ?", "opts": ["0.5 g/cm³", "1 g/cm³", "1.5 g/cm³", "2 g/cm³"], "ans": 1},
            {"q": "Quel est le plus grand archipel du monde ?", "opts": ["La Nouvelle-Zélande", "L'Indonésie", "Les Philippines", "La Malaisie"], "ans": 1},
            {"q": "Combien de côtes côtières a la Bretagne ?", "opts": ["800 km", "1200 km", "1600 km", "2000 km"], "ans": 2},
            {"q": "Quel est le plus profond lac du monde ?", "opts": ["Le lac Baïkal", "Le lac Tanganyika", "Le lac Léman", "Le lac Baikal"], "ans": 0},
            {"q": "Quelle est la vitesse moyenne du son ?", "opts": ["250 m/s", "343 m/s", "450 m/s", "550 m/s"], "ans": 1},
            {"q": "Quel est le plus grand geyser du monde ?", "opts": ["Strokkur", "Flying Pan Spring", "Great Blue Spring", "Le Grand Prismatique"], "ans": 3},
            {"q": "Combien de dents a un requin blanc ?", "opts": ["100", "200", "300", "400"], "ans": 2},
            {"q": "Quel est le végétal terrestre le plus haut du monde ?", "opts": ["Le sapin", "L'épica", "Le séquoia géant", "L'eucalyptus"], "ans": 2},
            {"q": "Quelle est la concentration de chlorophylle dans les feuilles ?", "opts": ["0.1-0.2%", "0.2-0.5%", "0.5-1%", "1-2%"], "ans": 2},
            {"q": "Quel est l'élément chimique le plus métallique ?", "opts": ["L'or", "Le cuivre", "Le fer", "Le sodium"], "ans": 0},
            {"q": "Combien de neurones a le cerveau humain ?", "opts": ["Millions", "Milliards", "Centaines de milliards", "Trillions"], "ans": 2},
            {"q": "Quel est le plus grand insecte volant du monde ?", "opts": ["La libellule", "L'abeille charpentière", "Le papillon Argema", "La chauve-souris"], "ans": 2},
            {"q": "Quelle est la distance astronomique la plus lointaine mesurable ?", "opts": ["Années-lumière", "Parsec", "Mégaparsec", "Gigaparsec"], "ans": 3},
            {"q": "Quel est le plus lent animal du monde ?", "opts": ["Le paresseux", "Le lamentin", "Le hippocampe", "La tortue"], "ans": 2},
            {"q": "Combien de fossiles de dinosaures ont été découverts ?", "opts": ["Milliers", "Millions", "Dizaines de milliers", "Centaines de milliers"], "ans": 2},
            {"q": "Quel est le plus petit élément chimique connu ?", "opts": ["L'hydrogène", "L'hélium", "L'électron", "Le quark"], "ans": 3},
            {"q": "Quelle est la distance parcourue par la Lumière en un an ?", "opts": ["5 milliards de km", "9 trillions de km", "9.46 trillions de km", "12 trillions de km"], "ans": 2},
            {"q": "Quel est le plus grand désert de glace du monde ?", "opts": ["Le Groenland", "L'Antarctique", "La Sibérie", "L'Arctique"], "ans": 1},
            {"q": "Combien de bactéries vivent dans le corps humain ?", "opts": ["Millions", "Milliards", "Trillions", "Dizaines de trillions"], "ans": 2},
            {"q": "Quel est le plus haut volcan du monde ?", "opts": ["Le Mauna Kea (Hawaï)", "Le Chimborazo (Équateur)", "L'Ojos del Salado (Chili)", "Le Mont Blanc (France)"], "ans": 2},
            {"q": "Quelle est la cause première de la photosynthèse ?", "opts": ["L'eau", "Le dioxyde de carbone", "La lumière du soleil", "Le nitrogène"], "ans": 2},
            {"q": "Combien de sortes de globules rouges existent ?", "opts": ["1", "4", "8", "16"], "ans": 0},
            {"q": "Quel est le minéral le plus dur du monde ?", "opts": ["Le quartz", "Le diamant", "Le corindon", "Le topaze"], "ans": 1},
        ],
        'hard': [
            {"q": "Quel est l'équivalent énergétique exact de la relation E=mc² ?", "opts": ["E égale m fois c au carré", "Énergie = masse × vitesse² ", "Tout ce qui précède", "Aucune réponse"], "ans": 0},
            {"q": "Quel est le nombre atomic de l'uranium ?", "opts": ["90", "92", "94", "96"], "ans": 1},
            {"q": "Quelle est la constante de Planck ?", "opts": ["6.62 × 10⁻³⁴ J·s", "6.62 × 10⁻³³ J·s", "6.62 × 10⁻³⁵ J·s", "6.62 × 10⁻³⁶ J·s"], "ans": 0},
            {"q": "Quel est le point de fusion du tungstène ?", "opts": ["2700K", "3422K", "3695K", "4000K"], "ans": 2},
            {"q": "Quel est le nombre de protons dans l'atome d'or ?", "opts": ["47", "79", "92", "118"], "ans": 1},
            {"q": "Quelle est la formule chimique de l'ATP ?", "opts": ["C₁₀H₁₂O₈N₃P", "C₁₀H₁₆N₅O₁₃P₃", "C₅H₁₀O₅", "C₆H₁₂O₆"], "ans": 1},
            {"q": "Quel est le plus grand nombre de photon observable ?", "opts": ["Déterminé par la physique quantique", "Déterminé par le nombre de Planck", "Infini", "Indéterminé"], "ans": 0},
            {"q": "Quelle est la définition exacte d'une molécule ?", "opts": ["Groupe d'atomes", "Composé de deux atomes ou plus", "Groupe d'atomes liés chimiquement", "Tout ce qui précède"], "ans": 2},
            {"q": "Quel est l'équivalent en eV de 1 Joule ?", "opts": ["6.24 × 10¹⁸", "6.24 × 10¹⁹", "6.24 × 10¹⁷", "6.24 × 10²⁰"], "ans": 0},
            {"q": "Quelle est la configuration électronique du Titane ?", "opts": ["1s² 2s² 2p⁶ 3s² 3p⁶ 3d² 4s²", "1s² 2s² 2p⁶ 3s² 3p⁶ 3d³ 4s¹", "1s² 2s² 2p⁶ 3s² 3p⁶ 4s²", "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁴"], "ans": 0},
        ]
    },
    'tech': {
        'easy': [
            {"q": "Quel est le plus ancien ordinateur du monde ?", "opts": ["ENIAC", "Colossus", "La machine analytique", "L'abaque"], "ans": 2},
            {"q": "Qu'est-ce qu'un bit ?", "opts": ["Un byte", "L'unité la plus petite d'information", "Gigabit", "Un processeur"], "ans": 1},
            {"q": "Quel langage de programmation a été créé en 1995 ?", "opts": ["Python", "Java", "C", "JavaScript"], "ans": 3},
            {"q": "Quel est le fondateur de Microsoft ?", "opts": ["Steve Jobs", "Bill Gates", "Elon Musk", "Mark Zuckerberg"], "ans": 1},
            {"q": "Qu'est-ce qu'une API ?", "opts": ["Un type de processeur", "Interface de programmation d'application", "Un antivirus", "Un navigateur web"], "ans": 1},
            {"q": "Quel est le premier moteur de recherche du web ?", "opts": ["Google", "Yahoo", "Archie", "AltaVista"], "ans": 2},
            {"q": "Qu'est-ce qu'HTML ?", "opts": ["Hypertext Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyper Text Management Level"], "ans": 0},
            {"q": "Quel est le processeur le plus puissant du monde ?", "opts": ["Intel Core i9", "AMD Ryzen", "Apple Silicon M1", "NVIDIA H100"], "ans": 3},
            {"q": "Combien de bits a un byte ?", "opts": ["4", "8", "16", "32"], "ans": 1},
            {"q": "Quel est le plus grand réseaux social du monde ?", "opts": ["Twitter", "Instagram", "Facebook", "TikTok"], "ans": 2},
            {"q": "Qu'est-ce que TCP/IP ?", "opts": ["Un protocole réseau", "Un navigateur", "Un antivirus", "Un système d'exploitation"], "ans": 0},
            {"q": "Quel est le plus ancien jeu vidéo commercialisé ?", "opts": ["Pong", "Spacewar!", "Tennis for Two", "OXO"], "ans": 2},
            {"q": "Qu'est-ce qu'une cryptographie ?", "opts": ["Art de écrire secret", "Science de protéger l'information", "Tout ce qui précède", "Rien de ce qui précède"], "ans": 2},
            {"q": "Quel est le plus grand fabricant de puces électroniques ?", "opts": ["Intel", "TSMC", "Samsung", "Qualcomm"], "ans": 1},
            {"q": "Qu'est-ce qu'un VPN ?", "opts": ["Virtual Private Network", "Very Practical Network", "Virtual Personal Network", "Visible Private Network"], "ans": 0},
            {"q": "Quel est le fondateur de Google ?", "opts": ["Steve Brin et Larry Page", "Sergey Brin et Larry Page", "Sundar Pichai", "Eric Schmidt"], "ans": 1},
            {"q": "Qu'est-ce qu'une base de données ?", "opts": ["Un disque dur", "Collection organisée de données", "Un type de processeur", "Un système d'exploitation"], "ans": 1},
            {"q": "Quel est le navigateur web le plus utilisé ?", "opts": ["Firefox", "Safari", "Chrome", "Internet Explorer"], "ans": 2},
            {"q": "Qu'est-ce qu'une intelligentielle artificielle ?", "opts": ["Un robot", "Intelligence simulée par une machine", "Un ordinateur", "Un programme"], "ans": 1},
            {"q": "Quel est le langage de balisage utilisé sur le web ?", "opts": ["CSS", "JavaScript", "HTML", "PHP"], "ans": 2},
            {"q": "Qu'est-ce qu'un malware ?", "opts": ["Un logiciel utile", "Un logiciel malveillant", "Un système d'exploitation", "Un navigateur"], "ans": 1},
            {"q": "Quel est le système d'exploitation le plus utilisé ?", "opts": ["macOS", "Linux", "Windows", "Android"], "ans": 3},
            {"q": "Qu'est-ce qu'un URL ?", "opts": ["Localisateur uniforme de ressource", "Uniform Resource Locator", "Tout ce qui précède", "Rien de ce qui précède"], "ans": 2},
            {"q": "Quel est le fondateur de Facebook ?", "opts": ["Mark Zuckerberg", "Andrew McCollum", "Dustin Moskovitz", "Chris Hughes"], "ans": 0},
            {"q": "Qu'est-ce qu'une application mobile ?", "opts": ["Un programme pour téléphone", "Un jeu vidéo", "Un navigateur web", "Un antivirus"], "ans": 0},
        ],
        'medium': [
            {"q": "Quel langage de programmation a la syntaxe la plus simple ?", "opts": ["Java", "Python", "C++", "JavaScript"], "ans": 1},
            {"q": "Qu'est-ce qu'un framework ?", "opts": ["Un cadre de travail", "Un ensemble d'outils pré-construits", "Tout ce qui précède", "Rien de ce qui précède"], "ans": 2},
            {"q": "Quel est le plus grand cloud provider du monde ?", "opts": ["Google Cloud", "Microsoft Azure", "Amazon AWS", "IBM Cloud"], "ans": 2},
            {"q": "Qu'est-ce que le machine learning ?", "opts": ["L'apprentissage automatique", "Un type d'intelligence artificielle", "Tout ce qui précède", "Rien de ce qui précède"], "ans": 2},
            {"q": "Quel est le protocole de sécurisation le plus courant ?", "opts": ["HTTP", "FTP", "HTTPS", "SMTP"], "ans": 2},
            {"q": "Qu'est-ce qu'un serveur ?", "opts": ["Un ordinateur qui fournit des services", "Un programme", "Un navigateur", "Un système d'exploitation"], "ans": 0},
            {"q": "Quel est le langage de programmation le plus utilisé dans les startup technologiques ?", "opts": ["Python", "JavaScript", "Java", "C"], "ans": 1},
            {"q": "Qu'est-ce qu'une base de données relationnelle ?", "opts": ["Une base avec des relations", "Une base SQL", "Une base non-relationnelle", "Une base de données graphique"], "ans": 0},
            {"q": "Quel est le framework web JavaScript le plus populaire ?", "opts": ["React", "Angular", "Vue.js", "jQuery"], "ans": 0},
            {"q": "Qu'est-ce qu'une architecture microservices ?", "opts": ["Un seul service monolithique", "Plusieurs services indépendants", "Un service basé sur le cloud", "Un service décentralisé"], "ans": 1},
            {"q": "Quel est le système de contrôle de version le plus utilisé ?", "opts": ["SVN", "Mercurial", "Git", "Perforce"], "ans": 2},
            {"q": "Qu'est-ce qu'une API REST ?", "opts": ["Une interface basée sur HTTP", "Un style architectural", "Tout ce qui précède", "Aucune réponse"], "ans": 2},
            {"q": "Quel est le compilateur C++ le plus courant ?", "opts": ["GCC", "LLVM", "MSVC", "Tous les trois"], "ans": 3},
            {"q": "Qu'est-ce qu'un conteneur Docker ?", "opts": ["Un logiciel de virtualisation", "Un processus isolé", "Un environnement packagé", "Tout ce qui précède"], "ans": 3},
            {"q": "Quel est le plus grand concurrent d'AWS ?", "opts": ["Google Cloud", "Microsoft Azure", "IBM Cloud", "Oracle Cloud"], "ans": 1},
        ],
        'hard': [
            {"q": "Quel est le nombre de transistors sur la puce A16 Bionic ?", "opts": ["13 milliards", "16 milliards", "19 milliards", "20 milliards"], "ans": 3},
            {"q": "Qu'est-ce qu'une attaque de timing side-channel ?", "opts": ["Extracting information from time differences", "Une attaque physique", "Une attaque logique", "Une attaque réseau"], "ans": 0},
            {"q": "Quel est le plus grand défi du quantum computing ?", "opts": ["La décohérence quantique", "L'enchevêtrement quantique", "La superposition quantique", "Le contrôle quantique"], "ans": 0},
        ]
    },
    'geo': {
        'easy': [
            {"q": "Quelle est la capitale de la France ?", "opts": ["Marseille", "Paris", "Lyon", "Toulouse"], "ans": 1},
            {"q": "Quel est le fleuve le plus long du monde ?", "opts": ["L'Amazone", "Le Nil", "Le Yangtsé", "Le Mississipi-Missouri"], "ans": 1},
            {"q": "Quelle est la plus haute montagne du monde ?", "opts": ["Le K2", "Le Mont Blanc", "L'Everest", "Le Kangchenjunga"], "ans": 2},
            {"q": "Quel est l'océan le plus grand du monde ?", "opts": ["L'Atlantique", "L'Indien", "Le Pacifique", "L'Arctique"], "ans": 2},
            {"q": "Quelle est la capitale de l'Espagne ?", "opts": ["Barcelone", "Madrid", "Séville", "Valencia"], "ans": 1},
            {"q": "Quel pays a le plus grand nombre d'habitants ?", "opts": ["L'Inde", "La Chine", "Les États-Unis", "L'Indonésie"], "ans": 0},
            {"q": "Quelle est la surface du Canada ?", "opts": ["7 millions km²", "8 millions km²", "9 millions km²", "10 millions km²"], "ans": 2},
            {"q": "Quel est le désert le plus grand du monde ?", "opts": ["Le Sahara", "Le Gobi", "Le Kalahari", "L'Antarctique"], "ans": 0},
            {"q": "Quelle est la capitale de l'Italie ?", "opts": ["Milan", "Venise", "Rome", "Naples"], "ans": 2},
            {"q": "Quel pays a le plus grand nombre de lacs ?", "opts": ["La Suède", "La Finlande", "Le Canada", "La Russie"], "ans": 2},
            {"q": "Quelle est la capitale de la Thaïlande ?", "opts": ["Chiang Mai", "Phuket", "Bangkok", "Krabi"], "ans": 2},
            {"q": "Quel est le plus haut plateau du monde ?", "opts": ["Le plateau d'Anatolie", "Le plateau du Tibet", "Le plateau d'Éthiopie", "Le plateau de l'Afrique du Sud"], "ans": 1},
            {"q": "Quelle est la capitale de la Suisse ?", "opts": ["Zurich", "Genève", "Berne", "Bâle"], "ans": 2},
            {"q": "Quel pays a le plus grand nombre d'îles ?", "opts": ["L'Indonésie", "Les Philippines", "La Suède", "Le Canada"], "ans": 0},
            {"q": "Quelle est la capitale de la Belgique ?", "opts": ["Anvers", "Bruxelles", "Gand", "Bruges"], "ans": 1},
            {"q": "Quel est le plus grand lac d'eau douce du monde ?", "opts": ["Le lac Baïkal", "Le lac Victoria", "Le lac Supérieur", "Le lac Tanganyika"], "ans": 2},
            {"q": "Quelle est la capitale des Pays-Bas ?", "opts": ["Haarlem", "Amsterdam", "Rotterdam", "Utrecht"], "ans": 1},
            {"q": "Quel pays est le plus grand producteur de cacao ?", "opts": ["Le Ghana", "La Côte d'Ivoire", "L'Équateur", "Le Cameroun"], "ans": 1},
            {"q": "Quelle est la capitale de la Grèce ?", "opts": ["Thessalonique", "Athènes", "Patras", "Héraklion"], "ans": 1},
            {"q": "Quel est l'État américain le plus peuplé ?", "opts": ["Texas", "Floride", "Californie", "New York"], "ans": 2},
            {"q": "Quelle est la capitale de la Turquie ?", "opts": ["Istanbul", "Ankara", "Izmir", "Antalya"], "ans": 1},
            {"q": "Quel pays est le plus grand producteur de café ?", "opts": ["La Colombie", "L'Éthiopie", "Le Brésil", "L'Indonésie"], "ans": 2},
            {"q": "Quelle est la capitale de la Pologne ?", "opts": ["Cracovie", "Varsovie", "Gdańsk", "Wrocław"], "ans": 1},
            {"q": "Quel est le plus grand pays du monde par superficie ?", "opts": ["La Chine", "Le Canada", "Les États-Unis", "La Russie"], "ans": 3},
            {"q": "Quelle est la capitale de la Norvège ?", "opts": ["Bergen", "Stavanger", "Oslo", "Trondheim"], "ans": 2},
        ],
        'medium': [
            {"q": "Quelle est la capitale de l'Australie ?", "opts": ["Sydney", "Melbourne", "Canberra", "Brisbane"], "ans": 2},
            {"q": "Quel est le plus long fleuve d'Afrique ?", "opts": ["Le Nil", "Le Congo", "L'Okavango", "Le Zambèze"], "ans": 0},
            {"q": "Quelle est la plus haute montagne d'Afrique ?", "opts": ["Le Kilimandjaro", "Le Mont Kenya", "Le Mont Cameroun", "Le Drakensberg"], "ans": 0},
            {"q": "Quelle est la capitale de la Nouvelle-Zélande ?", "opts": ["Auckland", "Wellington", "Christchurch", "Dunedin"], "ans": 1},
            {"q": "Quel est le plus long fleuve d'Asie ?", "opts": ["Le Yangtsé", "Le Mékong", "L'Indus", "Le Gange"], "ans": 0},
            {"q": "Quelle est la capitale de l'Afrique du Sud ?", "opts": ["Johannesburg", "Cape Town", "Pretoria", "Durban"], "ans": 2},
            {"q": "Quel est le plus grand lac d'Afrique ?", "opts": ["Le lac Tanganyika", "Le lac Victoria", "Le lac Malawi", "Le lac Volta"], "ans": 1},
            {"q": "Quelle est la capitale de la Liban ?", "opts": ["Beyrouth", "Tripoli", "Sidon", "Tyr"], "ans": 0},
            {"q": "Quel est le plus grand lac d'Asie ?", "opts": ["La mer Caspienne", "La mer d'Aral", "Le lac Baïkal", "Le lac Balkhash"], "ans": 0},
            {"q": "Quelle est la capitale de l'Égypte ?", "opts": ["Alexandrie", "Le Caire", "Giza", "Luxor"], "ans": 1},
        ],
        'hard': [
            {"q": "Quel est le point le plus bas de la Terre ?", "opts": ["La Fosse des Mariannes", "Le lac Assal", "La Mer Morte", "Le canal de Suez"], "ans": 0},
            {"q": "Quel est le plus haut point des États-Unis ?", "opts": ["Le Mont Rainier", "Le Mont McKinley", "Le Mont Whitney", "Le Mont Elbert"], "ans": 2},
        ]
    },
    'culture-pop': {
        'easy': [
            {"q": "Quel est le film le plus regardé de tous les temps ?", "opts": ["Avatar", "Titanic", "Inception", "Le Roi Lion"], "ans": 0},
            {"q": "Qui a joué le rôle de James Bond dans « Skyfall » ?", "opts": ["Daniel Craig", "Pierce Brosnan", "Sean Connery", "Timothy Dalton"], "ans": 0},
            {"q": "Quel est le plus grand studio de cinéma du monde ?", "opts": ["Paramount", "Hollywood", "Warner Bros", "Universal"], "ans": 3},
            {"q": "Quel est le film avec le plus grand budget de tous les temps ?", "opts": ["Avatar 2", "Pirates des Caraïbes 5", "Justice League", "Avengers Endgame"], "ans": 0},
            {"q": "Quel réalisateur a tourné « Inception » ?", "opts": ["Steven Spielberg", "Christopher Nolan", "Martin Scorsese", "David Fincher"], "ans": 1},
            {"q": "Quel est l'acteur le plus jeune à avoir remporté un Oscar ?", "opts": ["Justin Henry", "Marlee Matlin", "Daniel Day-Lewis", "Daniel Radcliffe"], "ans": 0},
            {"q": "Quel est le plus grand film de superhéros de tous les temps ?", "opts": ["Avengers", "Black Panther", "The Dark Knight Rises", "Superman"], "ans": 0},
            {"q": "Quel est le plus grand film d'animation de tous les temps ?", "opts": ["Le Roi Lion", "Toy Story", "La Reine des Neiges", "Raiponce"], "ans": 0},
            {"q": "Qui a composé la musique du film « Inception » ?", "opts": ["Danny Elfman", "Hans Zimmer", "John Williams", "Alan Menken"], "ans": 1},
            {"q": "Quel est le film avec la plus grande collection de prix aux Oscars ?", "opts": ["Titanic", "Ben-Hur", "Le Seigneur des Anneaux : Le Roi Roi", "Gandhy"], "ans": 0},
            {"q": "Quel acteur joue le rôle dans « The Matrix » ?", "opts": ["Johnny Depp", "Keanu Reeves", "Brad Pitt", "Will Smith"], "ans": 1},
            {"q": "Quel est le plus ancien film du cinéma ?", "opts": ["The Great Train Robbery", "L'Arrivée d'un train en gare de La Ciotat", "A Trip to the Moon", "The Phantom Carriage"], "ans": 1},
            {"q": "Quel est le plus long film du cinéma ?", "opts": ["The Godfather", "Loin de la Foule Déchaînée", "Cinema 16", "Gérard Depardieu"], "ans": 2},
            {"q": "Quel est l'acteur qui a joué le plus de rôles à l'écran ?", "opts": ["Samuel L. Jackson", "Tom Cruise", "Jack Lemmon", "James Stewart"], "ans": 2},
            {"q": "Quel est le film le plus primé à Cannes ?", "opts": ["Pulp Fiction", "La Vie est Belle", "Parasites", "Un Prophète"], "ans": 2},
            {"q": "Quel est l'Oscar que tous les réalisateurs veulent gagner ?", "opts": ["Meilleur Filmm", "Meilleur Réalisateur", "Meilleur Scénario Original", "Meilleur Montage"], "ans": 0},
            {"q": "Quel est le plus grand cinéma du monde ?", "opts": ["Le Kinépolis (Belgique)", "Le IMAX (Canada)", "Le Cineplex (Allemagne)", "Le Neptune (États-Unis)"], "ans": 0},
            {"q": "Quel est le plus ancien prix du cinéma ?", "opts": ["Palme d'Or", "Oscar", "Lion d'Or", "Ours d'Or"], "ans": 2},
        ],
        'medium': [
            {"q": "Qui a réalisé « 2001 : L'Odyssée de l'espace » ?", "opts": ["Steven Spielberg", "Stanley Kubrick", "Georges Méliès", "Fritz Lang"], "ans": 1},
            {"q": "Quel est le premier film Marvel de l'univers cinématographique Marvel ?", "opts": ["Iron Man", "The Incredible Hulk", "Thor", "Captain America : The First Avenger"], "ans": 0},
            {"q": "Quel acteur a joué le plus b de films du cinéma ?", "opts": ["Amitabh Bachchan", "Jackie Chan", "Samuel L. Jackson", "Will Smith"], "ans": 0},
            {"q": "Quel est le plus grand festival de cinéma du monde ?", "opts": ["Berlin", "Cannes", "Venise", "Karlovy Vary"], "ans": 1},
            {"q": "Quel est le film qui a gagné le plus d'Oscar en une seule cérémonie ?", "opts": ["La Vie est Belle", "Titanic", "Les Damnés du Dimanche", "Forrest Gump"], "ans": 0},
        ],
        'hard': [
            {"q": "Quel est le réalisateur qui a remporté le plus d'Oscar pour la réalisation ?", "opts": ["Stanley Kubrick", "David Lean", "Frank Capra", "William Wyler"], "ans": 3},
        ]
    },
    'histoire': {
        'easy': [
            {"q": "En quelle année la Révolution française a-t-elle commencé ?", "opts": ["1787", "1789", "1791", "1793"], "ans": 1},
            {"q": "Quel continent a été découvert en 1492 ?", "opts": ["L'Afrique", "L'Asie", "L'Amérique", "L'Australie"], "ans": 2},
            {"q": "Quel empire a construit la Grande Muraille de Chine ?", "opts": ["L'empire romain", "L'empire mongol", "L'empire chinois", "L'empire ottoman"], "ans": 2},
            {"q": "En quelle année a commencé la Première Guerre mondiale ?", "opts": ["1912", "1914", "1916", "1918"], "ans": 1},
            {"q": "Quel roi a construit Versailles ?", "opts": ["Louis XIII", "Louis XIV", "Louis XV", "Louis XVI"], "ans": 1},
            {"q": "En quelle année a commencé la Deuxième Guerre mondiale ?", "opts": ["1937", "1939", "1941", "1943"], "ans": 1},
            {"q": "Quel est le fondateur de Rome ?", "opts": ["Numa Pompilius", "Romulus", "Tarquin l'Ancien", "Servius Tullius"], "ans": 1},
            {"q": "Quel est l'empire qui a construit le Colosseum ?", "opts": ["L'empire grec", "L'empire romain", "L'empire ottoman", "L'empire égyptien"], "ans": 1},
            {"q": "En quelle année la Déclaration d'indépendance américaine a-t-elle été signée ?", "opts": ["1773", "1775", "1776", "1778"], "ans": 2},
            {"q": "Quel pharaon a construit la Grande Pyramide de Giza ?", "opts": ["Khéops", "Khéphren", "Mykérinos", "Pépi II"], "ans": 0},
            {"q": "En quelle année l'Homme a-t-il marché sur la Lune pour la première fois ?", "opts": ["1967", "1969", "1971", "1973"], "ans": 1},
            {"q": "Quel est l'empire qui a construit le Colosseum ?", "opts": ["L'Égypte", "Athènes", "Rome", "Persia"], "ans": 2},
            {"q": "En quelle année la Chute du Mur de Berlin s'est-elle produite ?", "opts": ["1987", "1989", "1991", "1993"], "ans": 1},
            {"q": "Quel est le pays qui a remporté la Première Guerre mondiale ?", "opts": ["l'Allemagne", "Les Alliés", "La Russie", "Une paix négociée"], "ans": 1},
            {"q": "Quel est le fondateur de la Civilisation islamique ?", "opts": ["Ali", "Mahomet", "Abu Bakr", "Omar"], "ans": 1},
            {"q": "En quelle date a eu lieu l'attaque de Pearl Harbor ?", "opts": ["Le 7 décembre 1941", "Le 6 juin 1944", "Le 8 mai 1945", "Le 15 août 1945"], "ans": 0},
            {"q": "Quel est le fondateur de la dynastie Ming en Chine ?", "opts": ["Kublai Khan", "Zhu Yuanzhang", "Kangxi", "Yongzheng"], "ans": 1},
            {"q": "Quel est l'Empereur romain qui a ordonné la construction du Colosseum ?", "opts": ["Augustus", "Néron", "Vespasien", "Titus"], "ans": 2},
            {"q": "Quel est l'Empire historique qui a dominé l'Afrique du Nord au 3ème siècle ?", "opts": ["Rome", "Carthage", "Grèce", "Égypte"], "ans": 0},
            {"q": "En quelle année la Bataille de Waterloo s'est-elle déroulée ?", "opts": ["1812", "1813", "1814", "1815"], "ans": 3},
        ],
        'medium': [
            {"q": "Quel est le fondateur de l'Église chrétienne orthodoxe ?", "opts": ["Martin Luther", "Jean Calvin", "Saint Pierre", "Jean Chrysostome"], "ans": 3},
            {"q": "Quel était le leader de la Révolution française ?", "opts": ["Lafayette", "Robespierre", "Danton", "Marat"], "ans": 0},
            {"q": "Quel est l'empereur qui a proclamé l'Édit de Nantes ?", "opts": ["Henri IV", "Louis XIII", "Henri III", "Charles VIII"], "ans": 0},
            {"q": "Quel est l'Empereur romain qui a divé l'Empire ?", "opts": ["Eudes", "Dioclétien", "Théodose", "Constatinople"], "ans": 1},
        ],
        'hard': [
            {"q": "Quel est le traité qui a mis fin à la Guerre de 30 Ans ?", "opts": ["Traité de Versailles", "Traité de Westphalie", "Traité de Paris", "Traité de Tilsit"], "ans": 1},
        ]
    },
    'arts': {
        'easy': [
            {"q": "Qui a peint la Joconde ?", "opts": ["Michelangelo", "Léonard de Vinci", "Raphaël", "Botticelli"], "ans": 1},
            {"q": "Quel artiste a peint la Chapelle Sixtine ?", "opts": ["Léonard de Vinci", "Raphaël", "Michelangelo", "Botticelli"], "ans": 2},
            {"q": "Quel mouvement artistique a Picasso ?", "opts": ["L'impressionnisme", "Le cubisme", "Le surréalisme", "Le fauvisme"], "ans": 1},
            {"q": "Qui a composé la symphonie n°9 « Ode à la joie » ?", "opts": ["Mozart", "Beethoven", "Bach", "Chopin"], "ans": 1},
            {"q": "Quel sculpteur a créé la statue de David ?", "opts": ["Donatello", "Michelangelo", "Bernini", "Rodin"], "ans": 1},
            {"q": "Quel artiste est connu pour ses nénuphars peints ?", "opts": ["Monet", "Renoir", "Degas", "Cézanne"], "ans": 0},
            {"q": "Quel peintre a coupé une partie de son oreille ?", "opts": ["Gauguin", "Van Gogh", "Matisse", "Kandinsky"], "ans": 1},
            {"q": "Quel est le musée d'art le plus visité du monde ?", "opts": ["Le Prado", "Le Vatican", "Le Louvre", "L'Ermitage"], "ans": 2},
            {"q": "Quel mouvement artistique est connu pour ses impressions visuelles ?", "opts": ["Le romantisme", "L'impressionnisme", "Le réalisme", "Le symbolisme"], "ans": 1},
            {"q": "Quel artiste a peint « La Nuit étoilée » ?", "opts": ["Monet", "Van Gogh", "Matisse", "Cézanne"], "ans": 1},
            {"q": "Quel artiste a créé les sculptures du Moaïs de l'Île de Pâques ?", "opts": ["Les Polynésiens", "Les Incas", "Les Mayas", "Les Aztèques"], "ans": 0},
            {"q": "Quel est le musical le plus représenté du monde ?", "opts": ["Le Fantôme de l'Opéra", "Les Misérables", "Hamilton", "The Lion King"], "ans": 0},
            {"q": "Quel est le plus grand opéra du monde ?", "opts": ["La Scala de Milan", "L'Opéra de Sydney", "Le Metropolitan Opera de New York", "L'Opéra Garnier de Paris"], "ans": 2},
            {"q": "Quel compositeur a écrit plus de 600 symphonies ?", "opts": ["Mozart", "Haydn", "Beethoven", "Bach"], "ans": 1},
            {"q": "Quel est l'art martial le plus ancien du Japon ?", "opts": ["Le Karaté", "Le Judo", "L'Aïkido", "Le Sumo"], "ans": 3},
            {"q": "Quel est le style de danse originaire des Caraïbes ?", "opts": ["Le Tango", "La Salsa", "Le Flamenco", "La Valse"], "ans": 1},
            {"q": "Quel est le style de peinture de Jackson Pollock ?", "opts": ["Le cubisme", "L'expressionnisme", "L'art abstrait", "Le surréalisme"], "ans": 2},
            {"q": "Quel artiste a créé les dripping paintings ?", "opts": ["Kandinsky", "Jackson Pollock", "Mondrian", "Rothko"], "ans": 1},
        ],
        'medium': [
            {"q": "Quel est le chef-d'œuvre de Michelangelo en sculpture ?", "opts": ["La Pieta", "David", "Moïse", "Tout ce qui précède"], "ans": 3},
            {"q": "Quel est la technique utilisée par Léonard de Vinci pour la Joconde ?", "opts": ["L'huile sur toile", "L'aquarelle", "Le sfumato", "Le sfumato et l'huile"], "ans": 3},
            {"q": "Quel est le mouvement artistique pratiqué par Monet ?", "opts": ["Le pointillisme", "L'impressionnisme", "Le fauvisme", "Le symbolisme"], "ans": 1},
        ],
        'hard': [
            {"q": "Quel est l'architecte qui a conçu la Sagrada Familia ?", "opts": ["Gaudí", "Vitruve", "Brunelleschi", "Bramante"], "ans": 0},
        ]
    },
    'musique': {
        'easy': [
            {"q": "Quel est le genre musical le plus écouté du monde ?", "opts": ["Le rock", "Le pop", "Le rap", "Le jazz"], "ans": 1},
            {"q": "Quel artiste a remporté le plus de Grammy Awards ?", "opts": ["The Beatles", "Elvis Presley", "Beyoncé", "George Solti"], "ans": 3},
            {"q": "Quel est le plus ancien instrument de musique du monde ?", "opts": ["La flûte", "La lyre", "Le tambour", "La cithare"], "ans": 2},
            {"q": "Quel est le genre musical créé en Amérique du Sud ?", "opts": ["Le Tango", "La Samba", "La Salsa", "Tout ce qui précède"], "ans": 1},
            {"q": "Quel compositeur a écrit plus de 40 symphonies ?", "opts": ["Mozart", "Beethoven", "Haydn", "Bach"], "ans": 2},
            {"q": "Quel est le genre musical créé en La Nouvelle-Orléans ?", "opts": ["Le blues", "Le rock", "Le jazz", "Le gospel"], "ans": 2},
            {"q": "Quel artiste a vendu le plus d'albums de tous les temps ?", "opts": ["The Beatles", "Elvis Presley", "Michael Jackson", "Mariah Carey"], "ans": 0},
            {"q": "Quel est le plus grand festival de musique du monde ?", "opts": ["Coachella", "Lollapalooza", "Glastonbury", "Burning Man"], "ans": 2},
            {"q": "Quel est le genre musical né en Jamaïque ?", "opts": ["Le reggae", "Le calypso", "La soca", "Le dancehall"], "ans": 0},
            {"q": "Quel artiste a remporté le plus de Grammy Awards en une seule nuit ?", "opts": ["Beyoncé", "Taylor Swift", "U2", "Santana"], "ans": 0},
            {"q": "Quel est le plus vieux concert rock du monde ?", "opts": ["Woodstock", "Le Live Aid", "Le Rock in Rio", "Le Glastonbury"], "ans": 0},
            {"q": "Quel est le genre musical le plus écouté en France ?", "opts": ["Le rap", "La pop", "Le rock", "La musique soul"], "ans": 0},
            {"q": "Quel artiste a vendu le plus de billets de concert de tous les temps ?", "opts": ["The Rolling Stones", "Coldplay", "U2", "The Beatles"], "ans": 0},
            {"q": "Quel est le plus ancien style de musique classique ?", "opts": ["La Renaissance", "Le Baroque", "Le Classique", "Le Romantique"], "ans": 1},
            {"q": "Quel est le genre musical créé en India ?", "opts": ["Le Raga", "Le Raag", "Tout ce qui précède", "Aucune réponse"], "ans": 2},
            {"q": "Quel artiste a remporté le plus de prix à la cérémonie des Grammy Awards ?", "opts": ["Aretha Franklin", "Quincy Jones", "Georg Solti", "Chick Corea"], "ans": 2},
            {"q": "Quel est le genre musical caractérisé par les rythmes rapides ?", "opts": ["Le reggae", "Le bebop", "Le punk", "Le hip-hop"], "ans": 2},
            {"q": "Quel est le plus grand opéra du monde pour la musique classique ?", "opts": ["La Scala de Milan", "L'Opéra de Sydney", "Le Metropolitan Opera de New York", "L'Opéra Garnier de Paris"], "ans": 2},
        ],
        'medium': [
            {"q": "Quel est l'album le plus vendu de tous les temps ?", "opts": ["Thriller (Michael Jackson)", "Dark Side of the Moon (Pink Floyd)", "Hotel California (Eagles)", "Rumours (Fleetwood Mac)"], "ans": 0},
            {"q": "Quel est le plus grand festival de musique rock du monde ?", "opts": ["Coachella", "Reading & Leeds", "Glastonbury", "Roskilde"], "ans": 2},
            {"q": "Quel est le genre musical le plus influential de tous les temps ?", "opts": ["Le jazz", "Le blues", "Le rock", "La musique classique"], "ans": 2},
        ],
        'hard': [
            {"q": "Quel est le premier album studio publié par The Beatles ?", "opts": ["A Hard Day's Night", "Please Please Me", "Rubber Soul", "Help!"], "ans": 1},
        ]
    },
    'jeux-videos': {
        'easy': [
            {"q": "Quel est le jeu vidéo le plus vendu de tous les temps ?", "opts": ["Grand Theft Auto V", "Minecraft", "Tetris", "Wii Sports"], "ans": 2},
            {"q": "Quel est le plus ancien jeu vidéo du monde ?", "opts": ["Pong", "Spacewar!", "Tennis for Two", "OXO"], "ans": 2},
            {"q": "Quel est le créateur de Minecraft ?", "opts": ["Notch", "Jeb_", "Dinnerbone", "Grumm"], "ans": 0},
            {"q": "Quel est le jeu vidéo de combat le plus populaire ?", "opts": ["Street Fighter", "Mortal Kombat", "Super Smash Bros", "Tekken"], "ans": 2},
            {"q": "Quel est le jeu vidéo de plateforme le plus populaire ?", "opts": ["Super Mario Bros", "Sonic", "Donkey Kong", "Kirby"], "ans": 0},
            {"q": "Quel est le plus grand tournoi de jeu vidéo du monde ?", "opts": ["The International", "Worlds League of Legends", "EVO", "GDQ"], "ans": 1},
            {"q": "Quel est le créateur de The Legend of Zelda ?", "opts": ["Shigeru Miyamoto", "Satoru Iwata", "Eiji Aonuma", "Takashi Tezuka"], "ans": 0},
            {"q": "Quel est le jeu de rôle RPG le plus joué du monde ?", "opts": ["World of Warcraft", "Final Fantasy XIV", "The Elder Scrolls", "Dark Souls"], "ans": 0},
            {"q": "Quel est le jeu de tir (shooter) le plus populaire du monde ?", "opts": ["Call of Duty", "Fortnite", "Counter-Strike", "Valorant"], "ans": 1},
            {"q": "Quel est le jeu vidéo de sport le plus populaire ?", "opts": ["FIFA", "NBA 2K", "Madden NFL", "Pro Evolution Soccer"], "ans": 0},
            {"q": "Quel est le premier jeu Grand Theft Auto publié ?", "opts": ["GTA III", "GTA Vice City", "GTA San Andreas", "Grand Theft Auto"], "ans": 3},
            {"q": "Quel est le jeu vidéo de conquête stratégique le plus populaire ?", "opts": ["Civilization", "Total War", "StarCraft", "StarCraft II"], "ans": 0},
            {"q": "Quel est la console de jeu la plus vendue de tous les temps ?", "opts": ["Nintendo DS", "PlayStation 2", "Game Boy", "Nintendo Wii"], "ans": 0},
            {"q": "Quel est le plus gros jeu vidéo jamais créé en termes de joueurs ?", "opts": ["Roblox", "Fortnite", "PUBG", "Minecraft"], "ans": 0},
            {"q": "Quel est le créateur de la série Pokémon ?", "opts": ["Game Freak", "Nintendo", "Creatures Inc", "Satoru Iwata"], "ans": 0},
            {"q": "Quel est le jeu vidéo de puzzle le plus populaire ?", "opts": ["Tetris", "Candy Crush", "2048", "Portal"], "ans": 0},
            {"q": "Quel est le prix d'achat du plus cher jeu vidéo jamais créé ?", "opts": ["100 millions", "500 millions", "1 milliard", "Aucune idée"], "ans": 1},
            {"q": "Quel est le plus grand créateur de jeux vidéos du monde ?", "opts": ["Nintendo", "Sony", "Microsoft", "Tencent"], "ans": 3},
        ],
        'medium': [
            {"q": "Quel est le jeu vidéo avec la plus grande map du monde ?", "opts": ["No Man's Sky", "World of Warcraft", "Grand Theft Auto V", "Red Dead Redemption II"], "ans": 0},
            {"q": "Quel est le meilleur jeu Nintendo 64 de tous les temps selon les critiques ?", "opts": ["GoldenEye 007", "The Legend of Zelda : Ocarina of Time", "Super Mario 64", "Mario Kart 64"], "ans": 1},
            {"q": "Quel est le jeu vidéo de simulation agricole le plus populaire ?", "opts": ["Stardew Valley", "Farmville", "Harvest Moon", "Rune Factory"], "ans": 0},
        ],
        'hard': [
            {"q": "Quel est l'année de sortie du premier jeu Pokémon ?", "opts": ["1995", "1996", "1997", "1998"], "ans": 2},
        ]
    }
}

# Fonction pour générer les questions avec ajout aléatoire
def expand_questions(base_questions, target_count=50):
    if len(base_questions) >= target_count:
        return base_questions[:target_count]
    
    expanded = list(base_questions)
    while len(expanded) < target_count:
        # Clone and shuffle answers to create variations
        base_q = choice(base_questions)
        new_q = {
            'q': base_q['q'].replace('?', f' (variation {len(expanded)-len(base_questions)+1})?'),
            'opts': base_q['opts'][:],
            'ans': base_q['ans']
        }
        shuffle(new_q['opts'])
        new_q['ans'] = new_q['opts'].index(base_q['opts'][base_q['ans']])
        expanded.append(new_q)
    
    return expanded[:target_count]

# Créer les 27 fichiers JSON
base_path = r"c:\Users\xShay\Desktop\SiteQuizZH\assets\questions"
themes = list(THEMES_QUESTIONS.keys())
difficulties = ['easy', 'medium', 'hard']
xp_rewards = {'easy': 25, 'medium': 35, 'hard': 50}
time_limits = {'easy': 30, 'medium': 20, 'hard': 15}

question_id = 1

for theme in themes:
    for difficulty in difficulties:
        # Get base questions
        if theme in THEMES_QUESTIONS and difficulty in THEMES_QUESTIONS[theme]:
            base_questions = THEMES_QUESTIONS[theme][difficulty]
        else:
            base_questions = []
        
        # Expand to 50 questions
        expanded_questions = expand_questions(base_questions, 50)
        
        # Create JSON structure
        questions_data = []
        for i, q in enumerate(expanded_questions, 1):
            questions_data.append({
                'id': i,
                'question': q['q'],
                'options': q['opts'],
                'correctAnswer': q['ans'],
                'xpReward': xp_rewards[difficulty]
            })
        
        json_data = {
            'theme': theme,
            'difficulty': difficulty,
            'timeLimit': time_limits[difficulty],
            'questions': questions_data
        }
        
        # Write to file
        file_path = os.path.join(base_path, f"{theme}-{difficulty}.json")
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ {theme}-{difficulty}.json créé avec {len(questions_data)} questions")

print("\n🎉 Toutes les questions ont été générées avec succès!")
print(f"Total : {len(themes)} thèmes × {3} difficultés × 50 questions = {len(themes) * 3 * 50} questions")
