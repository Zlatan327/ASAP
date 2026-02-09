/**
 * User Preferences Module
 * Saves user settings per Google account (API key, model, style, ratio)
 */

// Save user preferences
function saveUserPreferences() {
    const user = getCurrentUser();
    if (!user) return;

    const apiKey = document.getElementById('apiKey')?.value || '';
    const model = document.getElementById('model-select')?.value || 'veo3';
    const style = document.getElementById('style-select')?.value || 'cinematic';
    const ratio = document.getElementById('ratio-select')?.value || '16:9';

    const prefs = {
        apiKey,
        model,
        style,
        ratio,
        lastUpdated: new Date().toISOString()
    };

    localStorage.setItem(`asap_prefs_${user.email}`, JSON.stringify(prefs));
    console.log('✅ Preferences saved for', user.email);
}

// Load user preferences
function loadUserPreferences() {
    const user = getCurrentUser();
    if (!user) return;

    const saved = localStorage.getItem(`asap_prefs_${user.email}`);
    if (!saved) return;

    try {
        const prefs = JSON.parse(saved);

        // Restore API key
        const apiKeyInput = document.getElementById('apiKey');
        if (apiKeyInput && prefs.apiKey) {
            apiKeyInput.value = prefs.apiKey;
        }

        // Restore model selection
        const modelSelect = document.getElementById('model-select');
        if (modelSelect && prefs.model) {
            modelSelect.value = prefs.model;
        }

        // Restore style
        const styleSelect = document.getElementById('style-select');
        if (styleSelect && prefs.style) {
            styleSelect.value = prefs.style;
        }

        // Restore ratio
        const ratioSelect = document.getElementById('ratio-select');
        if (ratioSelect && prefs.ratio) {
            ratioSelect.value = prefs.ratio;
        }

        console.log('✅ Preferences loaded for', user.email);

        // Show welcome message
        showWelcomeMessage(user.name);
    } catch (error) {
        console.error('Error loading preferences:', error);
    }
}

// Show brief welcome message
function showWelcomeMessage(name) {
    const terminal = document.getElementById('terminal-output');
    if (!terminal) return;

    const welcomeMsg = document.createElement('div');
    welcomeMsg.className = 'terminal-line success';
    welcomeMsg.innerHTML = `<span class="code-keyword">WELCOME_BACK</span> <span class="code-function">${name}</span> <span class="code-comment">// Settings restored</span>`;

    terminal.innerHTML = '';
    terminal.appendChild(welcomeMsg);

    // Clear after 3 seconds
    setTimeout(() => {
        if (terminal.firstChild === welcomeMsg) {
            terminal.innerHTML = '<div class="empty-state"><p>READY_FOR_SYNTHESIS...</p></div>';
        }
    }, 3000);
}

// Auto-save on changes
function initializePreferencesAutoSave() {
    const apiKeyInput = document.getElementById('apiKey');
    const modelSelect = document.getElementById('model-select');
    const styleSelect = document.getElementById('style-select');
    const ratioSelect = document.getElementById('ratio-select');

    [apiKeyInput, modelSelect, styleSelect, ratioSelect].forEach(el => {
        if (el) {
            el.addEventListener('change', () => {
                if (getCurrentUser()) {
                    saveUserPreferences();
                }
            });
        }
    });
}

// Export functions
if (typeof window !== 'undefined') {
    window.saveUserPreferences = saveUserPreferences;
    window.loadUserPreferences = loadUserPreferences;
    window.initializePreferencesAutoSave = initializePreferencesAutoSave;
}
