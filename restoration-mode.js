/**
 * RESTORATION MODE MODULE
 */

// Current mode state
let currentMode = 'video'; // 'video' or 'restoration'

// Switch between video and restoration modes
function switchMode(mode) {
    currentMode = mode;

    // Update button states
    const videoBtn = document.getElementById('mode-video');
    const restorationBtn = document.getElementById('mode-restoration');

    if (videoBtn && restorationBtn) {
        if (mode === 'video') {
            videoBtn.classList.add('active');
            restorationBtn.classList.remove('active');
        } else {
            videoBtn.classList.remove('active');
            restorationBtn.classList.add('active');
        }
    }

    // Toggle UI sections
    const videoConfig = document.getElementById('video-config');
    const restorationOptions = document.getElementById('restoration-options');
    const storyInput = document.getElementById('storyInput');

    if (video Config) videoConfig.style.display = mode === 'video' ? 'grid' : 'none';
    if (restorationOptions) restorationOptions.style.display = mode === 'restoration' ? 'grid' : 'none';

    // Update placeholder
    if (storyInput) {
        const videoPlaceholder = storyInput.getAttribute('data-video-placeholder') || "Describe your story here...";
        const restorationPlaceholder = storyInput.getAttribute('data-restoration-placeholder') || "Describe what you want the photo to be like...";
        storyInput.placeholder = mode === 'video' ? videoPlaceholder : restorationPlaceholder;
    }

    console.log(`✅ Switched to ${mode} mode`);
}

// Generate restoration prompt using Gemini
async function generateRestorationPrompt(userDescription) {
    const task = document.getElementById('task-select')?.value || 'restore';
    const damage = document.getElementById('damage-select')?.value || 'moderate';
    const quality = document.getElementById('quality-select')?.value || '4k';

    const systemPrompt = `You are an expert AI image restoration prompt engineer. Generate optimized prompts for AI photo restoration tools (Remini, MyHeritage, Topaz Photo AI, etc.).

USER REQUEST: "${userDescription}"
TASK: ${task}
DAMAGE LEVEL: ${damage}
QUALITY TARGET: ${quality}

Generate a comprehensive restoration prompt that:
1. Describes the restoration task clearly
2. Specifies quality and detail requirements
3. Includes preservation instructions (maintain original features)
4. Accounts for the damage level
5. Is optimized for ${quality.toUpperCase()} output

Also recommend 2-3 specific AI tools best suited for this task and provide 2-3 practical tips.

Format your response as:
RESTORATION PROMPT:
[detailed prompt here]

RECOMMENDED TOOLS:
• Tool 1 (reason why)
• Tool 2 (reason why)

TIPS:
• Tip 1
• Tip 2`;

    try {
        const apiKey = document.getElementById('apiKey')?.value;
        if (!apiKey) {
            throw new Error('Please enter your Gemini API key');
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.candidates[0].content.parts[0].text;

        return generatedText;
    } catch (error) {
        console.error('Restoration prompt generation error:', error);
        throw error;
    }
}

// Export functions
if (typeof window !== 'undefined') {
    window.switchMode = switchMode;
    window.generateRestorationPrompt = generateRestorationPrompt;
    window.currentMode = currentMode;
}
