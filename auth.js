/**
 * Authentication Module - Google Identity Services
 * Handles user sign-in/sign-out and profile management
 */

// Google OAuth Client ID
const GOOGLE_CLIENT_ID = '372043524088-h4pes4fdtsjs7cjtrfb4hfjf720q2p06.apps.googleusercontent.com';

let currentUser = null;
let tokenClient;

// Initialize Google OAuth
function initializeGoogleAuth() {
    // Check if user is already signed in (from localStorage)
    const savedUser = localStorage.getItem('asap_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showUserProfile(currentUser);
        if (typeof loadHistory === 'function') loadHistory();
    } else {
        hideUI();
    }

    // Initialize the Token Client (Popup Flow)
    if (typeof google !== 'undefined') {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
            callback: async (response) => {
                if (response.error) {
                    console.error('Auth Error:', response);
                    return;
                }
                const token = response.access_token;
                await fetchUserInfo(token);
            }
        });

        // Attach click handler to custom button
        const customButton = document.getElementById('custom-signin-btn');
        if (customButton) {
            // Remove old listeners
            const newBtn = customButton.cloneNode(true);
            customButton.parentNode.replaceChild(newBtn, customButton);

            newBtn.addEventListener('click', () => {
                // Force "Select Account" prompt in a new window/popup
                tokenClient.requestAccessToken({ prompt: 'select_account' });
            });
        }
    }
}

// Fetch User Info using Access Token
async function fetchUserInfo(accessToken) {
    try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const userInfo = await res.json();

        currentUser = {
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            sub: userInfo.sub
        };

        // Store user info
        localStorage.setItem('asap_user', JSON.stringify(currentUser));

        showUserProfile(currentUser);

        // Load user's history
        if (typeof loadHistory === 'function') {
            loadHistory();
        }
    } catch (e) {
        console.error('Failed to fetch user info:', e);
    }
}

// Hide UI elements when not signed in
function hideUI() {
    const historyPanel = document.getElementById('history-panel');
    const historyToggle = document.getElementById('history-toggle-btn');
    if (historyPanel) historyPanel.style.display = 'none';
    if (historyToggle) historyToggle.style.display = 'none';
}

// Show user profile in UI
function showUserProfile(user) {
    const customSigninBtn = document.getElementById('custom-signin-btn');
    const userProfile = document.getElementById('user-profile');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const historyToggleBtn = document.getElementById('history-toggle-btn');

    if (customSigninBtn) customSigninBtn.style.display = 'none';
    if (userProfile) userProfile.style.display = 'flex';
    if (userAvatar) userAvatar.src = user.picture;
    if (userName) userName.textContent = user.name;
    if (historyToggleBtn) historyToggleBtn.style.display = 'flex';

    // Show history panel
    const historyPanel = document.getElementById('history-panel');
    if (historyPanel) {
        historyPanel.style.display = 'block';
        setTimeout(() => historyPanel.classList.add('visible'), 10);
    }
}

// Sign out
function signOut() {
    localStorage.removeItem('asap_user');
    currentUser = null;

    // Reset UI
    const customSigninBtn = document.getElementById('custom-signin-btn');
    const userProfile = document.getElementById('user-profile');
    const historyToggleBtn = document.getElementById('history-toggle-btn');

    if (customSigninBtn) customSigninBtn.style.display = 'block';
    if (userProfile) userProfile.style.display = 'none';
    if (historyToggleBtn) historyToggleBtn.style.display = 'none';

    // Hide history panel
    const historyPanel = document.getElementById('history-panel');
    if (historyPanel) {
        historyPanel.classList.remove('visible');
        setTimeout(() => historyPanel.style.display = 'none', 300);
    }

    // Clear history list
    const historyList = document.getElementById('history-list');
    if (historyList) historyList.innerHTML = '<p class="empty-state">Sign in to view history</p>';

    // Revoke token if we stored it (optional, usually not needed for simple sign-in)
    // google.accounts.oauth2.revoke(token, done)
}

function getCurrentUser() {
    return currentUser;
}

// Export
window.initializeGoogleAuth = initializeGoogleAuth;
window.signOut = signOut;
window.getCurrentUser = getCurrentUser;
