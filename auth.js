/**
 * Authentication Module - Google Identity Services
 * Handles user sign-in/sign-out and profile management
 */

// Google OAuth Client ID from Google Cloud Console
// https://console.cloud.google.com/apis/credentials
const GOOGLE_CLIENT_ID = '372043524088-h4pes4fdtsjs7cjtrfb4hfjf720q2p06.apps.googleusercontent.com';

let currentUser = null;

// Initialize Google Identity Services on page load
function initializeGoogleAuth() {
    // Check if user already signed in (from localStorage)
    const storedUser = localStorage.getItem('asap_user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showUserProfile(currentUser);
    }

    // Initialize Google Sign-In
    if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false
        });

        // Render sign-in button
        google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            {
                theme: 'filled_black',
                size: 'large',
                text: 'signin_with',
                shape: 'rectangular'
            }
        );
    }
}

// Handle Google sign-in response
function handleCredentialResponse(response) {
    try {
        const userInfo = parseJwt(response.credential);

        currentUser = {
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            sub: userInfo.sub // Google user ID
        };

        // Store user info
        localStorage.setItem('asap_user', JSON.stringify(currentUser));

        showUserProfile(currentUser);

        // Load user's history
        if (typeof loadHistory === 'function') {
            loadHistory();
        }
    } catch (error) {
        console.error('Sign-in error:', error);
        alert('Sign-in failed. Please try again.');
    }
}

// Parse JWT token (simple base64 decode)
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('JWT parse error:', error);
        throw error;
    }
}

// Show user profile in UI
function showUserProfile(user) {
    const signInContainer = document.getElementById('google-signin-button');
    const userProfile = document.getElementById('user-profile');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');

    if (signInContainer) signInContainer.style.display = 'none';
    if (userProfile) userProfile.style.display = 'flex';
    if (userAvatar) userAvatar.src = user.picture;
    if (userName) userName.textContent = user.name;

    // Show history panel
    const historyPanel = document.getElementById('history-panel');
    if (historyPanel) historyPanel.classList.add('visible');
}

// Sign out
function signOut() {
    // Clear user data
    localStorage.removeItem('asap_user');
    currentUser = null;

    // Update UI
    const signInContainer = document.getElementById('google-signin-button');
    const userProfile = document.getElementById('user-profile');

    if (signInContainer) signInContainer.style.display = 'block';
    if (userProfile) userProfile.style.display = 'none';

    // Hide history panel
    const historyPanel = document.getElementById('history-panel');
    if (historyPanel) historyPanel.classList.remove('visible');

    // Clear history display
    const historyList = document.getElementById('history-list');
    if (historyList) historyList.innerHTML = '<p class="empty-state">Sign in to view history</p>';
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Export functions for use in other modules
window.initializeGoogleAuth = initializeGoogleAuth;
window.signOut = signOut;
window.getCurrentUser = getCurrentUser;
