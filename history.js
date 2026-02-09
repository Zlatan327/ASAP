/**
 * History Module - LocalStorage Prompt History
 * Manages saving, loading, and displaying user's past prompts
 */

const HISTORY_KEY = 'asap_prompt_history';
const MAX_HISTORY_ITEMS = 50; // Limit to prevent localStorage overflow

// Save a new prompt to history
function savePromptToHistory(input, outputs, model, style) {
    const user = getCurrentUser();
    if (!user) {
        console.log('No user signed in, skipping history save');
        return;
    }

    const history = getHistory();

    const promptEntry = {
        id: generateId(),
        timestamp: Date.now(),
        userEmail: user.email,
        input: input,
        outputs: outputs,
        model: model,
        style: style
    };

    // Add to beginning (newest first)
    history.unshift(promptEntry);

    // Limit history size
    if (history.length > MAX_HISTORY_ITEMS) {
        history.splice(MAX_HISTORY_ITEMS);
    }

    // Save to localStorage
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        console.log('Prompt saved to history');

        // Refresh history display
        loadHistory();
    } catch (error) {
        console.error('Failed to save to history:', error);
        if (error.name === 'QuotaExceededError') {
            alert('Storage full! Please delete some history items.');
        }
    }
}

// Get all history from localStorage
function getHistory() {
    try {
        const stored = localStorage.getItem(HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Failed to load history:', error);
        return [];
    }
}

// Load and display history for current user
function loadHistory() {
    const user = getCurrentUser();
    if (!user) {
        return;
    }

    const allHistory = getHistory();
    const userHistory = allHistory.filter(item => item.userEmail === user.email);

    displayHistory(userHistory);
}

// Display history in UI
function displayHistory(history) {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;

    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-state">No prompts yet. Generate your first!</p>';
        return;
    }

    historyList.innerHTML = history.map(item => `
        <div class="history-item" data-id="${item.id}">
            <div class="history-header">
                <span class="history-date">${formatDate(item.timestamp)}</span>
                <button class="history-delete" onclick="deletePrompt('${item.id}')" title="Delete">
                    ×
                </button>
            </div>
            <div class="history-input">${truncate(item.input, 80)}</div>
            <div class="history-meta">
                <span class="history-model">${item.model}</span>
                <span class="history-style">${item.style}</span>
                <span class="history-count">${item.outputs.length} scenes</span>
            </div>
            <button class="history-load-btn" onclick="loadPromptFromHistory('${item.id}')">
                Load
            </button>
        </div>
    `).join('');
}

// Load a specific prompt from history
function loadPromptFromHistory(id) {
    const history = getHistory();
    const item = history.find(h => h.id === id);

    if (!item) {
        alert('Prompt not found');
        return;
    }

    // Populate input field
    const promptInput = document.getElementById('prompt-input');
    if (promptInput) {
        promptInput.value = item.input;
    }

    // Set model and style
    const modelSelect = document.getElementById('model-select');
    const styleSelect = document.getElementById('style-preset');

    if (modelSelect) modelSelect.value = item.model;
    if (styleSelect) styleSelect.value = item.style;

    // Display outputs
    const terminalOutput = document.getElementById('terminal-output');
    if (terminalOutput && typeof renderResult === 'function') {
        terminalOutput.innerHTML = '';
        item.outputs.forEach(output => renderResult(output));
    }

    // Close history panel on mobile
    const historyPanel = document.getElementById('history-panel');
    if (historyPanel && window.innerWidth < 768) {
        historyPanel.classList.remove('visible');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delete a prompt from history
function deletePrompt(id) {
    if (!confirm('Delete this prompt from history?')) {
        return;
    }

    let history = getHistory();
    history = history.filter(item => item.id !== id);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    loadHistory();
}

// Export all history as JSON
function exportHistory() {
    const user = getCurrentUser();
    if (!user) {
        alert('Please sign in first');
        return;
    }

    const allHistory = getHistory();
    const userHistory = allHistory.filter(item => item.userEmail === user.email);

    const dataStr = JSON.stringify(userHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `asap-history-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
}

// Clear all history for current user
function clearHistory() {
    if (!confirm('Delete ALL your history? This cannot be undone.')) {
        return;
    }

    const user = getCurrentUser();
    if (!user) return;

    let allHistory = getHistory();
    allHistory = allHistory.filter(item => item.userEmail !== user.email);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));
    loadHistory();
}

// Helper: Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Helper: Format timestamp
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
}

// Helper: Truncate text
function truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Export functions
window.savePromptToHistory = savePromptToHistory;
window.loadHistory = loadHistory;
window.loadPromptFromHistory = loadPromptFromHistory;
window.deletePrompt = deletePrompt;
window.exportHistory = exportHistory;
window.clearHistory = clearHistory;
