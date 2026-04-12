// 🔐 CONFIGURATION DES IDENTIFIANTS ADMIN
// 
// Vous pouvez créer plusieurs comptes administrateur
// ⚠️ IMPORTANT: En production, utilisez des identifiants forts et uniques !
//
// Identifiants par défaut:
// Admin 1: pseudo='admin', mot de passe='admin123'
// Admin 2: pseudo='admin2', mot de passe='admin456'

const ADMIN_CONFIG = {
    // Liste des administrateurs autorisés
    // Format: { username: 'pseudo', password: 'motdepasse' }
    admins: [
        {
            username: 'Zatsu',
            password: 'Qz9$kL2mP@wX7vN4dE!'
        },
        {
            username: 'Bzh',
            password: 'Ry7#mK3nB@tP8wJ5gH!'
        }
        // Ajoutez d'autres admins comme ceci:
        // {
        //     username: 'monAdmin',
        //     password: 'MonMDP!SecurePass2024'
        // }
    ],
    
    // (Optionnel) Délai d'inactivité avant déconnexion automatique (en millisecondes)
    // Par défaut: 30 minutes
    inactivityTimeout: 30 * 60 * 1000
};

/**
 * INSTRUCTIONS POUR AJOUTER UN NOUVEL ADMIN:
 * 
 * 1. Ouvrez ce fichier (assets/js/admin-config.js)
 * 2. Dans la section 'admins', ajoutez un nouvel objet:
 * 
 *    {
 *        username: 'votreNom',
 *        password: 'votreMotDePasseSecurisé'
 *    }
 * 
 * 3. Sauvegardez et pushez sur GitHub
 * 
 * Exemple:
 * {
 *     username: 'paul',
 *     password: 'Paul!SecurePass2024'
 * }
 */

export { ADMIN_CONFIG };
