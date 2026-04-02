// 🔐 CONFIGURATION DES IDENTIFIANTS ADMIN
// 
// Modifiez ces identifiants avec vos propres valeurs
// ⚠️ IMPORTANT: En production, utilisez des identifiants forts et uniques !
//
// Identifiants actuels:
// Pseudo: admin
// Mot de passe: admin123

const ADMIN_CONFIG = {
    // ⚠️ MODIFICATION OBLIGATOIRE AVANT LA MISE EN PRODUCTION
    // Remplacez 'admin' par votre pseudo administrateur
    username: 'admin',
    
    // ⚠️ MODIFICATION OBLIGATOIRE AVANT LA MISE EN PRODUCTION
    // Remplacez 'admin123' par un mot de passe fort
    password: 'admin123',
    
    // (Optionnel) Délai d'inactivité avant déconnexion automatique (en millisecondes)
    // Par défaut: 30 minutes
    inactivityTimeout: 30 * 60 * 1000
};

/**
 * INSTRUCTIONS DE MODIFICATION:
 * 
 * 1. Ouvrez ce fichier (assets/js/admin-config.js)
 * 2. Changez la valeur de 'username' par votre pseudo
 * 3. Changez la valeur de 'password' par votre mot de passe
 * 4. Gardez le délai d'inactivité ou modifiez-le selon vos besoins
 * 5. Sauvegardez le fichier
 * 
 * Exemple:
 * username: 'monAdmin',
 * password: 'monMotDePass3Secur!' 
 */
