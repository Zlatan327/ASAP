/**
 * Account Popup Module
 * Handles the user account popup modal
 */

// Toggle account popup
function toggleAccountPopup() {
    const popup = document.getElementById('account-popup');
    if (!popup) return;

    if (popup.style.display === 'none' || !popup.style.display) {
        openAccountPopup();
    } else {
        closeAccountPopup();
    }
}

// Open account popup
function openAccountPopup() {
    const user = getCurrentUser();
    if (!user) return;

    const popup = document.getElementById('account-popup');
    const email = document.getElementById('popup-user-email');
    const avatar = document.getElementById('popup-user-avatar');
    const greeting = document.getElementById('popup-user-greeting');

    const prefModel = document.getElementById('popup-pref-model');
    const prefStyle = document.getElementById('popup-pref-style');
    const prefRatio = document.getElementById('popup-pref-ratio');
    const prefApi = document.getElementById('popup-pref-api');

    // Set user info
    if (email) email.textContent = user.email;
    if (avatar) avatar.src = user.picture;
    if (greeting) greeting.textContent = `Hi, ${user.name.split(' ')[0]}!`;

    // Get current preferences
    const modelSelect = document.getElementById('model-select');
    const styleSelect = document.getElementById('style-select');
    const ratioSelect = document.getElementById('ratio-select');
    const apiKeyInput = document.getElementById('apiKey');

    const model = modelSelect ? modelSelect.options[modelSelect.selectedIndex]?.text : 'VEO 3';
    const style = styleSelect?.value || 'Cinematic';
    const ratio = ratioSelect?.value || '16:9';
    const apiKey = apiKeyInput?.value || '';

    // Display preferences
    if (prefModel) prefModel.textContent = model;
    if (prefStyle) prefStyle.textContent = style.charAt(0).toUpperCase() + style.slice(1);
    if (prefRatio) prefRatio.textContent = ratio;

    if (prefApi) {
        if (apiKey) {
            prefApi.innerHTML = '<span class="popup-api-status">●</span> Configured';
        } else {
            prefApi.innerHTML = '<span class="popup-api-status" style="color: var(--text-muted)">○</span> Not Set';
        }
    }

    // Show popup
    if (popup) {
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
}

// Close account popup
function closeAccountPopup(event) {
    // Only close if clicking overlay directly (not its children)
    if (event && !event.target.classList.contains('account-popup-overlay')) {
        return;
    }

    const popup = document.getElementById('account-popup');
    if (popup) {
        popup.style.display = 'none';
        document.body.style.overflow = ''; // Restore scroll
    }
}

// Export functions
if (typeof window !== 'undefined') {
    window.toggleAccountPopup = toggleAccountPopup;
    window.openAccountPopup = openAccountPopup;
    window.closeAccountPopup = closeAccountPopup;
}
