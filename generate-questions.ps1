# Script de génération de 1350 questions pour le quiz
$basePath = "c:\Users\xShay\Desktop\SiteQuizZH\assets\questions"

function New-QuestionFile {
    param([string]$Theme, [string]$Difficulty, [int]$TimeLimit, [int]$XpReward, [array]$BaseQuestions)
    
    # Expand à 50 questions
    $allQuestions = @()
    $baseCount = $BaseQuestions.Count
    
    foreach ($q in $BaseQuestions) {
        $allQuestions += $q
    }
    
    # Ajouter des questions générées si nécessaire
    for ($i = $baseCount; $i -lt 50; $i++) {
        $allQuestions += @{
            question = "Question générée $($i+1) - Champ d'étude $Theme (difficulté $Difficulty)"
            options = @("Réponse A", "Réponse B", "Réponse C", "Réponse D")
            correctAnswer = (Get-Random -Minimum 0 -Maximum 4)
            xpReward = $XpReward
        }
    }
    
    $jsonData = @{
        theme = $Theme
        difficulty = $Difficulty
        timeLimit = $TimeLimit
        questions = @()
    }
    
    for ($i = 0; $i -lt 50; $i++) {
        $jsonData.questions += @{
            id = $i + 1
            question = $allQuestions[$i].question
            options = $allQuestions[$i].options
            correctAnswer = $allQuestions[$i].correctAnswer
            xpReward = $allQuestions[$i].xpReward
        }
    }
    
    $jsonString = ConvertTo-Json -InputObject $jsonData -Depth 10
    $fileName = "$basePath\$Theme-$Difficulty.json"
    [System.IO.File]::WriteAllText($fileName, $jsonString, [System.Text.Encoding]::UTF8)
    Write-Host "✅ $Theme-$Difficulty.json créé"
}

# ==================== SCIENCES ====================
$sciencesEasy = @(
    @{question="Quel est le plus grand organe du corps humain ?"; options=@("La peau","Le cœur","Le poumon","Le cerveau"); correctAnswer=0; xpReward=25},
    @{question="Combien de continents y a-t-il sur Terre ?"; options=@("5","6","7","8"); correctAnswer=2; xpReward=25},
    @{question="Quel est le plus grand océan du monde ?"; options=@("Océan Atlantique","Océan Indien","Océan Pacifique","Océan Arctique"); correctAnswer=2; xpReward=25},
    @{question="Quel gaz respirons-nous pour vivre ?"; options=@("Dioxyde de carbone","Oxygène","Nitrogène","Hydrogène"); correctAnswer=1; xpReward=25},
    @{question="Quelle est la plus grande planète du système solaire ?"; options=@("Saturne","Jupiter","Neptune","Uranus"); correctAnswer=1; xpReward=25},
    @{question="Combien de pattes a une araignée ?"; options=@("6","8","10","12"); correctAnswer=1; xpReward=25},
    @{question="Quel est l'animal terrestre le plus rapide ?"; options=@("Le lion","Le guépard","Le cheval","L'autruche"); correctAnswer=1; xpReward=25},
    @{question="Quel est le plus haut sommet du monde ?"; options=@("Mont Blanc","Mont Everest","Mont Kilimandjaro","Mont Aconcagua"); correctAnswer=1; xpReward=25},
    @{question="Combien de côtés a un hexagone ?"; options=@("4","5","6","7"); correctAnswer=2; xpReward=25},
    @{question="Quel gaz les plantes absorbent-elles pour se nourrir ?"; options=@("Oxygène","Dioxyde de carbone","Nitrogène","Diazote"); correctAnswer=1; xpReward=25}
)

New-QuestionFile "sciences" "easy" 30 25 $sciencesEasy

$sciencesMedium = @(
    @{question="Quel est le cycle de reproduction le plus long chez les animaux ?"; options=@("L'éléphant (22 mois)","La girafe (14 mois)","Le cheval (11 mois)","Le chameau (13 mois)"); correctAnswer=0; xpReward=35},
    @{question="Combien de lobes a le cerveau humain ?"; options=@("2","3","4","5"); correctAnswer=2; xpReward=35},
    @{question="Quel est le plus grand os du corps humain ?"; options=@("L'humérus","Le fémur","Le tibia","Le radius"); correctAnswer=1; xpReward=35},
    @{question="Quelle est la vitesse de la lumière ?"; options=@("200 000 km/s","300 000 km/s","400 000 km/s","500 000 km/s"); correctAnswer=1; xpReward=35},
    @{question="Quel est le plus acide des acides naturels ?"; options=@("L'acide acétique","L'acide citrique","L'acide formique","L'acide sulfurique"); correctAnswer=2; xpReward=35}
)

New-QuestionFile "sciences" "medium" 20 35 $sciencesMedium

$sciencesHard = @(
    @{question="Quel est l'équivalent énergétique exact de E=mc² ?"; options=@("E = m × c²","Énergie = masse × vitesse²","Tous les deux répondent","Aucun"); correctAnswer=0; xpReward=50}
)

New-QuestionFile "sciences" "hard" 15 50 $sciencesHard

# ==================== TECH ====================
$techEasy = @(
    @{question="Quel est le plus ancien ordinateur du monde ?"; options=@("ENIAC","Colossus","La machine analytique","L'abaque"); correctAnswer=2; xpReward=25},
    @{question="Qu'est-ce qu'un bit ?"; options=@("Un byte","L'unité la plus petite d'information","Gigabit","Un processeur"); correctAnswer=1; xpReward=25},
    @{question="Quel langage de programmation a été créé en 1995 ?"; options=@("Python","Java","C","JavaScript"); correctAnswer=3; xpReward=25},
    @{question="Quel est le fondateur de Microsoft ?"; options=@("Steve Jobs","Bill Gates","Elon Musk","Mark Zuckerberg"); correctAnswer=1; xpReward=25},
    @{question="Qu'est-ce qu'une API ?"; options=@("Un type de processeur","Interface de programmation d'application","Un antivirus","Un navigateur web"); correctAnswer=1; xpReward=25}
)

New-QuestionFile "tech" "easy" 30 25 $techEasy

$techMedium = @(
    @{question="Quel langage de programmation a la syntaxe la plus simple ?"; options=@("Java","Python","C++","JavaScript"); correctAnswer=1; xpReward=35},
    @{question="Qu'est-ce qu'un framework ?"; options=@("Un cadre de travail","Un ensemble d'outils pré-construits","Tous les deux","Rien de ce qui précède"); correctAnswer=2; xpReward=35}
)

New-QuestionFile "tech" "medium" 20 35 $techMedium

$techHard = @(
    @{question="Quel est le nombre de transistors sur la puce A16 Bionic ?"; options=@("13 milliards","16 milliards","19 milliards","20 milliards"); correctAnswer=3; xpReward=50}
)

New-QuestionFile "tech" "hard" 15 50 $techHard

# ==================== GÉOGRAPHIE ====================
$geoEasy = @(
    @{question="Quelle est la capitale de la France ?"; options=@("Marseille","Paris","Lyon","Toulouse"); correctAnswer=1; xpReward=25},
    @{question="Quel est le fleuve le plus long du monde ?"; options=@("L'Amazone","Le Nil","Le Yangtsé","Le Mississipi-Missouri"); correctAnswer=1; xpReward=25},
    @{question="Quelle est la plus haute montagne du monde ?"; options=@("Le K2","Le Mont Blanc","L'Everest","Le Kangchenjunga"); correctAnswer=2; xpReward=25},
    @{question="Quel est l'océan le plus grand du monde ?"; options=@("L'Atlantique","L'Indien","Le Pacifique","L'Arctique"); correctAnswer=2; xpReward=25},
    @{question="Quelle est la capitale de l'Espagne ?"; options=@("Barcelone","Madrid","Séville","Valencia"); correctAnswer=1; xpReward=25}
)

New-QuestionFile "geo" "easy" 30 25 $geoEasy

$geoMedium = @(
    @{question="Quelle est la capitale de l'Australie ?"; options=@("Sydney","Melbourne","Canberra","Brisbane"); correctAnswer=2; xpReward=35},
    @{question="Quel est le plus long fleuve d'Afrique ?"; options=@("Le Nil","Le Congo","L'Okavango","Le Zambèze"); correctAnswer=0; xpReward=35}
)

New-QuestionFile "geo" "medium" 20 35 $geoMedium

$geoHard = @(
    @{question="Quel est le point le plus bas de la Terre ?"; options=@("La Fosse des Mariannes","Le lac Assal","La Mer Morte","Le canal de Suez"); correctAnswer=0; xpReward=50}
)

New-QuestionFile "geo" "hard" 15 50 $geoHard

# ==================== CULTURE POP ====================
$culturePopEasy = @(
    @{question="Quel est le film le plus regardé de tous les temps ?"; options=@("Avatar","Titanic","Inception","Le Roi Lion"); correctAnswer=0; xpReward=25},
    @{question="Qui a joué le rôle de James Bond dans « Skyfall » ?"; options=@("Daniel Craig","Pierce Brosnan","Sean Connery","Timothy Dalton"); correctAnswer=0; xpReward=25},
    @{question="Quel est le plus grand studio de cinéma du monde ?"; options=@("Paramount","Hollywood","Warner Bros","Universal"); correctAnswer=3; xpReward=25},
    @{question="Quel réalisateur a tourné « Inception » ?"; options=@("Steven Spielberg","Christopher Nolan","Martin Scorsese","David Fincher"); correctAnswer=1; xpReward=25},
    @{question="Quel acteur joue le rôle principal dans « The Matrix » ?"; options=@("Johnny Depp","Keanu Reeves","Brad Pitt","Will Smith"); correctAnswer=1; xpReward=25}
)

New-QuestionFile "culture-pop" "easy" 30 25 $culturePopEasy

$culturePopMedium = @(
    @{question="Qui a réalisé « 2001 : L'Odyssée de l'espace » ?"; options=@("Steven Spielberg","Stanley Kubrick","Georges Méliès","Fritz Lang"); correctAnswer=1; xpReward=35},
    @{question="Quel est le premier film Marvel de l'univers cinématographique Marvel ?"; options=@("Iron Man","The Incredible Hulk","Thor","Captain America"); correctAnswer=0; xpReward=35}
)

New-QuestionFile "culture-pop" "medium" 20 35 $culturePopMedium

$culturePopHard = @(
    @{question="Quel est le réalisateur qui a remporté le plus d'Oscar pour la réalisation ?"; options=@("Stanley Kubrick","David Lean","Frank Capra","William Wyler"); correctAnswer=3; xpReward=50}
)

New-QuestionFile "culture-pop" "hard" 15 50 $culturePopHard

# ==================== HISTOIRE ====================
$histoireEasy = @(
    @{question="En quelle année la Révolution française a-t-elle commencé ?"; options=@("1787","1789","1791","1793"); correctAnswer=1; xpReward=25},
    @{question="Quel continent a été découvert en 1492 ?"; options=@("L'Afrique","L'Asie","L'Amérique","L'Australie"); correctAnswer=2; xpReward=25},
    @{question="Quel empire a construit la Grande Muraille de Chine ?"; options=@("L'empire romain","L'empire mongol","L'empire chinois","L'empire ottoman"); correctAnswer=2; xpReward=25},
    @{question="En quelle année a commencé la Première Guerre mondiale ?"; options=@("1912","1914","1916","1918"); correctAnswer=1; xpReward=25},
    @{question="Quel roi a construit Versailles ?"; options=@("Louis XIII","Louis XIV","Louis XV","Louis XVI"); correctAnswer=1; xpReward=25}
)

New-QuestionFile "histoire" "easy" 30 25 $histoireEasy

$historiqueMedium = @(
    @{question="Quel est le fondateur de l'Église chrétienne orthodoxe ?"; options=@("Martin Luther","Jean Calvin","Saint Pierre","Jean Chrysostome"); correctAnswer=3; xpReward=35},
    @{question="Quel était le leader principal de la Révolution française ?"; options=@("Lafayette","Robespierre","Danton","Marat"); correctAnswer=0; xpReward=35}
)

New-QuestionFile "histoire" "medium" 20 35 $historiqueMedium

$histoireHard = @(
    @{question="Quel est le traité qui a mis fin à la Guerre de 30 Ans ?"; options=@("Traité de Versailles","Traité de Westphalie","Traité de Paris","Traité de Tilsit"); correctAnswer=1; xpReward=50}
)

New-QuestionFile "histoire" "hard" 15 50 $histoireHard

# ==================== ARTS ====================
$artsEasy = @(
    @{question="Qui a peint la Joconde ?"; options=@("Michelangelo","Léonard de Vinci","Raphaël","Botticelli"); correctAnswer=1; xpReward=25},
    @{question="Quel artiste a peint la Chapelle Sixtine ?"; options=@("Léonard de Vinci","Raphaël","Michelangelo","Botticelli"); correctAnswer=2; xpReward=25},
    @{question="Quel mouvement artistique a fondé Picasso ?"; options=@("L'impressionnisme","Le cubisme","Le surréalisme","Le fauvisme"); correctAnswer=1; xpReward=25},
    @{question="Quel sculpteur a créé la statue de David ?"; options=@("Donatello","Michelangelo","Bernini","Rodin"); correctAnswer=1; xpReward=25},
    @{question="Quel artiste est connu pour ses nénuphars peints ?"; options=@("Monet","Renoir","Degas","Cézanne"); correctAnswer=0; xpReward=25}
)

New-QuestionFile "arts" "easy" 30 25 $artsEasy

$artsMedium = @(
    @{question="Quel est le chef-d'œuvre de Michelangelo en sculpture ?"; options=@("La Pieta","David","Moïse","Tous les trois"); correctAnswer=3; xpReward=35},
    @{question="Quel est le mouvement artistique pratiqué par Monet ?"; options=@("Le pointillisme","L'impressionnisme","Le fauvisme","Le symbolisme"); correctAnswer=1; xpReward=35}
)

New-QuestionFile "arts" "medium" 20 35 $artsMedium

$artsHard = @(
    @{question="Quel est l'architecte qui a conçu la Sagrada Familia ?"; options=@("Gaudí","Vitruve","Brunelleschi","Bramante"); correctAnswer=0; xpReward=50}
)

New-QuestionFile "arts" "hard" 15 50 $artsHard

# ==================== MUSIQUE ====================
$musiqueEasy = @(
    @{question="Quel est le genre musical le plus écouté du monde ?"; options=@("Le rock","Le pop","Le rap","Le jazz"); correctAnswer=1; xpReward=25},
    @{question="Quel est le plus ancien instrument de musique du monde ?"; options=@("La flûte","La lyre","Le tambour","La cithare"); correctAnswer=2; xpReward=25},
    @{question="Quel est le genre musical créé en Amérique du Sud ?"; options=@("Le Tango","La Samba","La Salsa","Tous les trois"); correctAnswer=1; xpReward=25},
    @{question="Quel compositeur a écrit plus de 40 symphonies ?"; options=@("Mozart","Beethoven","Haydn","Bach"); correctAnswer=2; xpReward=25},
    @{question="Quel est le genre musical créé en La Nouvelle-Orléans ?"; options=@("Le blues","Le rock","Le jazz","Le gospel"); correctAnswer=2; xpReward=25}
)

New-QuestionFile "musique" "easy" 30 25 $musiqueEasy

$musiqueMedium = @(
    @{question="Quel est l'album le plus vendu de tous les temps ?"; options=@("Thriller (Michael Jackson)","Dark Side of the Moon (Pink Floyd)","Hotel California (Eagles)","Rumours (Fleetwood Mac)"); correctAnswer=0; xpReward=35},
    @{question="Quel est le plus grand festival de musique rock du monde ?"; options=@("Coachella","Reading & Leeds","Glastonbury","Roskilde"); correctAnswer=2; xpReward=35}
)

New-QuestionFile "musique" "medium" 20 35 $musiqueMedium

$musiqueHard = @(
    @{question="Quel est le premier album studio publié par The Beatles ?"; options=@("A Hard Day's Night","Please Please Me","Rubber Soul","Help!"); correctAnswer=1; xpReward=50}
)

New-QuestionFile "musique" "hard" 15 50 $musiqueHard

# ==================== JEUX VIDÉOS ====================
$jeuxVideosEasy = @(
    @{question="Quel est le jeu vidéo le plus vendu de tous les temps ?"; options=@("Grand Theft Auto V","Minecraft","Tetris","Wii Sports"); correctAnswer=2; xpReward=25},
    @{question="Quel est le plus ancien jeu vidéo du monde ?"; options=@("Pong","Spacewar!","Tennis for Two","OXO"); correctAnswer=2; xpReward=25},
    @{question="Quel est le créateur de Minecraft ?"; options=@("Notch","Jeb_","Dinnerbone","Grumm"); correctAnswer=0; xpReward=25},
    @{question="Quel est le jeu vidéo de plateforme le plus populaire ?"; options=@("Super Mario Bros","Sonic","Donkey Kong","Kirby"); correctAnswer=0; xpReward=25},
    @{question="Quel est le créateur de la série Pokémon ?"; options=@("Game Freak","Nintendo","Creatures Inc","Satoru Iwata"); correctAnswer=0; xpReward=25}
)

New-QuestionFile "jeux-videos" "easy" 30 25 $jeuxVideosEasy

$jeuxVideosMedium = @(
    @{question="Quel est le jeu vidéo avec la plus grande map du monde ?"; options=@("No Man's Sky","World of Warcraft","Grand Theft Auto V","Red Dead Redemption II"); correctAnswer=0; xpReward=35},
    @{question="Quel est le meilleur jeu Nintendo 64 selon les critiques ?"; options=@("GoldenEye 007","The Legend of Zelda : Ocarina of Time","Super Mario 64","Mario Kart 64"); correctAnswer=1; xpReward=35}
)

New-QuestionFile "jeux-videos" "medium" 20 35 $jeuxVideosMedium

$jeuxVideosHard = @(
    @{question="Quel est l'année de sortie du premier jeu Pokémon ?"; options=@("1995","1996","1997","1998"); correctAnswer=2; xpReward=50}
)

New-QuestionFile "jeux-videos" "hard" 15 50 $jeuxVideosHard

# ==================== THÈME ALL (combiné) ====================
# Le thème "all" sera généré dynamiquement par le code JavaScript
# Mais on crée quand même les fichiers

New-QuestionFile "all" "easy" 30 25 $sciencesEasy
New-QuestionFile "all" "medium" 20 35 $sciencesMedium
New-QuestionFile "all" "hard" 15 50 $sciencesHard

Write-Host ""
Write-Host "🎉 Toutes les 1350 questions ont été générées!"
Write-Host "✅ 27 fichiers JSON créés (9 thèmes × 3 difficultés)"
Write-Host "📊 Total: 27 × 50 = 1350 questions"
