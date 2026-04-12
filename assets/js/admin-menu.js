// Admin Menu Logic
import { auth } from './firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Check if admin is logged in
function checkAdminLoggedIn() {
    const adminSession = localStorage.getItem('adminSessionId');
    if (!adminSession) {
        window.location.href = 'admin-login.html';
        return null;
    }
    return adminSession;
}

// Initialize admin menu
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const sessionId = checkAdminLoggedIn();
    if (!sessionId) return;

    // Display session ID
    document.getElementById('sessionId').textContent = sessionId;

    // Setup logout button
    document.getElementById('adminLogoutBtn').addEventListener('click', async () => {
        // Clear session
        localStorage.removeItem('adminSessionId');
        localStorage.removeItem('adminUsername');

        // Logout from Firebase if needed
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }

        // Redirect to login
        window.location.href = 'admin-login.html';
    });
});
