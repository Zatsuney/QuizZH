// Admin Error Reports Management
import { auth, db } from './firebase-config.js';
import { collection, query, onSnapshot, where, updateDoc, doc, deleteDoc, orderBy } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// State
let allReports = [];
let filteredReports = [];
let currentReport = null;

// Theme and difficulty names
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

const difficultyNames = {
    'easy': 'Facile',
    'medium': 'Moyen',
    'hard': 'Difficile'
};

// Check admin authentication
function checkAdminAuth() {
    const adminToken = localStorage.getItem('quizZH_adminToken');
    if (adminToken !== 'admin_authenticated') {
        window.location.href = 'admin-login.html';
    }
}

// Load reports from Firebase
function loadReports() {
    document.getElementById('loadingSpinner').style.display = 'block';

    const reportsRef = collection(db, 'errorReports');
    const q = query(reportsRef, orderBy('timestamp', 'desc'));

    onSnapshot(q, (snapshot) => {
        allReports = [];
        snapshot.forEach((doc) => {
            allReports.push({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate()
            });
        });

        document.getElementById('loadingSpinner').style.display = 'none';
        updateStats();
        applyFilters();
    }, (error) => {
        console.error('❌ Erreur lors du chargement:', error);
        document.getElementById('loadingSpinner').style.display = 'none';
    });
}

// Update statistics
function updateStats() {
    const total = allReports.length;
    const pending = allReports.filter(r => r.status === 'pending').length;
    const resolved = allReports.filter(r => r.status === 'resolved').length;

    document.getElementById('totalReports').textContent = total;
    document.getElementById('pendingReports').textContent = pending;
    document.getElementById('resolvedReports').textContent = resolved;
    document.getElementById('totalCount').textContent = total;
}

// Apply filters
function applyFilters() {
    const themeFilter = document.getElementById('filterTheme').value;
    const difficultyFilter = document.getElementById('filterDifficulty').value;
    const statusFilter = document.getElementById('filterStatus').value;

    filteredReports = allReports.filter(report => {
        if (themeFilter && report.theme !== themeFilter) return false;
        if (difficultyFilter && report.difficulty !== difficultyFilter) return false;
        if (statusFilter && report.status !== statusFilter) return false;
        return true;
    });

    displayReports();
}

// Display reports
function displayReports() {
    const reportsList = document.getElementById('reportsList');
    const noReports = document.getElementById('noReports');
    const displayedCount = document.getElementById('displayedCount');

    displayedCount.textContent = filteredReports.length;

    if (filteredReports.length === 0) {
        reportsList.innerHTML = '';
        noReports.style.display = 'block';
        return;
    }

    noReports.style.display = 'none';
    reportsList.innerHTML = filteredReports.map(report => `
        <div class="report-item ${report.status === 'resolved' ? 'resolved' : 'pending'}">
            <div class="report-header">
                <div class="report-title">
                    <h4>${report.questionId || 'Q?'} - ${report.theme.toUpperCase()}</h4>
                    <span class="report-status ${report.status}">${report.status === 'pending' ? '⏳ En attente' : '✓ Résolu'}</span>
                </div>
                <div class="report-date">
                    ${report.timestamp ? new Date(report.timestamp).toLocaleDateString('fr-FR') : 'Date inconnue'}
                </div>
            </div>

            <div class="report-question">
                <p><strong>Question:</strong> ${report.questionText}</p>
            </div>

            <div class="report-details-preview">
                <p><strong>Difficulté:</strong> ${difficultyNames[report.difficulty]}</p>
                <p><strong>Bonne réponse:</strong> ${report.correctAnswer !== undefined ? report.answers[report.correctAnswer] : 'Inconnue'}</p>
                ${report.description ? `<p><strong>Description:</strong> ${report.description.substring(0, 100)}...</p>` : ''}
                <p><strong>Signalé par:</strong> ${report.reporterName || 'Anonyme'}</p>
            </div>

            <button class="btn-view-details" onclick="openReportModal('${report.id}')">Voir les détails</button>
        </div>
    `).join('');
}

// Open report details modal
window.openReportModal = function(reportId) {
    const report = allReports.find(r => r.id === reportId);
    if (!report) return;

    currentReport = report;

    const detailsHTML = `
        <div class="report-full-details">
            <div class="detail-row">
                <label>ID Signalement:</label>
                <span>${reportId}</span>
            </div>
            
            <div class="detail-row">
                <label>Question:</label>
                <span>${report.questionText}</span>
            </div>

            <div class="detail-row">
                <label>ID Question:</label>
                <span>${report.questionId || 'N/A'}</span>
            </div>

            <div class="detail-row">
                <label>Thème:</label>
                <span>${themeNames[report.theme]}</span>
            </div>

            <div class="detail-row">
                <label>Difficulté:</label>
                <span>${difficultyNames[report.difficulty]}</span>
            </div>

            <div class="detail-row">
                <label>Bonne réponse:</label>
                <span>${report.correctAnswer !== undefined ? report.answers[report.correctAnswer] : 'Inconnue'}</span>
            </div>

            <div class="detail-row">
                <label>Toutes les réponses:</label>
                <ul>
                    ${report.answers.map((ans, idx) => `
                        <li>${idx + 1}. ${ans} ${idx === report.correctAnswer ? '✓ (correcte)' : ''}</li>
                    `).join('')}
                </ul>
            </div>

            <div class="detail-row">
                <label>Description du signalement:</label>
                <span>${report.description || '(Pas de description)'}</span>
            </div>

            <div class="detail-row">
                <label>Signalé par:</label>
                <span>${report.reporterName || 'Anonyme'}</span>
            </div>

            <div class="detail-row">
                <label>Date:</label>
                <span>${report.timestamp ? new Date(report.timestamp).toLocaleString('fr-FR') : 'Inconnue'}</span>
            </div>

            <div class="detail-row">
                <label>Statut:</label>
                <span class="${report.status === 'pending' ? 'badge-pending' : 'badge-resolved'}">
                    ${report.status === 'pending' ? '⏳ En attente' : '✓ Résolu'}
                </span>
            </div>
        </div>
    `;

    document.getElementById('reportDetails').innerHTML = detailsHTML;

    // Update button state
    const btn = document.getElementById('markResolvedBtn');
    if (report.status === 'resolved') {
        btn.textContent = 'Déjà résolu';
        btn.disabled = true;
    } else {
        btn.textContent = 'Marquer comme résolu';
        btn.disabled = false;
    }

    document.getElementById('reportDetailModal').style.display = 'flex';
};

// Close report modal
window.closeReportModal = function() {
    document.getElementById('reportDetailModal').style.display = 'none';
    currentReport = null;
};

// Mark report as resolved
window.markReportAsResolved = async function() {
    if (!currentReport) return;

    try {
        const reportRef = doc(db, 'errorReports', currentReport.id);
        await updateDoc(reportRef, {
            status: 'resolved'
        });

        console.log('✅ Signalement marqué comme résolu');
        closeReportModal();
        loadReports();
    } catch (error) {
        console.error('❌ Erreur:', error);
        alert('Erreur lors de la mise à jour');
    }
};

// Delete report
async function deleteReport(reportId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce signalement?')) return;

    try {
        await deleteDoc(doc(db, 'errorReports', reportId));
        console.log('✅ Signalement supprimé');
        loadReports();
    } catch (error) {
        console.error('❌ Erreur:', error);
        alert('Erreur lors de la suppression');
    }
}

// Logout
function setupLogout() {
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('quizZH_adminToken');
            localStorage.removeItem('quizZH_adminLoginTime');
            window.location.href = 'admin-login.html';
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('applyFiltersBtn').addEventListener('click', () => {
        applyFilters();
    });

    // Apply filters on change
    ['filterTheme', 'filterDifficulty', 'filterStatus'].forEach(id => {
        document.getElementById(id).addEventListener('change', () => {
            applyFilters();
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    setupLogout();
    setupEventListeners();
    loadReports();
});
