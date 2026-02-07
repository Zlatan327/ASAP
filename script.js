/**
 * ASAP - LOGIC CORE
 * Ported from prompt-generator.jsx & Enhanced for Story-to-Prompt + Image Restoration
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DATA & CONFIG MODELS (From prompt-generator.jsx) ---
    const models = {
        video: [
            { id: 'veo3', name: 'GOOGLE_VEO_3.1', strengths: ['Native audio', 'Multi-shot', 'Cinematic motion', 'Camera semantics'] },
            { id: 'sora2', name: 'OPENAI_SORA_2', strengths: ['Photorealism', 'Physics simulation', 'Long-form coherence'] },
            { id: 'runway-gen4', name: 'RUNWAY_GEN_4', strengths: ['Motion control', 'Character consistency', 'Commercial license'] },
            { id: 'luma-ray3', name: 'LUMA_DREAM_MACHINE', strengths: ['Fluid movement', 'Natural language', 'Draft speed'] },
            { id: 'kling-o1', name: 'KLING_PRO_1.6', strengths: ['Master Shots', 'Physics 3.0', 'Complex interactions'] }
        ]
    };

    const optimizationRules = {
        veo3: (text) => `[STYLE: Cinematic, HDR, 4k] ${text}`,
        sora2: (text) => `[PHYSICS: Newton-compliant, High Fidelity] ${text}`,
        'runway-gen4': (text) => `[MOTION_BUCKET: 10] ${text} [AESTHETIC: Commercial]`,
        'luma-ray3': (text) => `[FLOW: Liquid, Dreamy] ${text}`,
        'kling-o1': (text) => `[HIGH_QUALITY] ${text} [MODE: Pro]`
    };

    const restorationRules = {
        restore: (text, damage) => `Restore old photo: ${text}. Fix ${damage} damage. Remove scratches, cracks, tears, dust. Reconstruct missing details. Maintain original facial features.`,
        colorize: (text, damage) => `Colorize black and white photo: ${text}. Fix ${damage} damage. Apply natural, realistic coloration. Authentic skin tones. Period-accurate colors. High fidelity.`,
        upscale: (text, damage) => `Upscale and sharpen old photo: ${text}. Fix ${damage} damage. 4k resolution, razor sharp focus, de-blur, remove noise, enhance fine details.`,
        denoise: (text, damage) => `De-noise vintage photo: ${text}. Fix ${damage} damage. Remove grain, speckles, and artifacts. Smooth textures while preserving edges.`
    };

    // --- DIRECTOR MODE: Camera Logic ---
    function enrichWithCamera(text, modelId) {
        // Randomly select camera moves for variety, customized by model strength
        const moves = [
            'Slow Pan Right', 'Truck Left', 'Low Angle Push-In', 'Bird\'s Eye View',
            'Tracking Shot', 'Handheld Shake', 'Static Focus', 'Orbit CW'
        ];
        const selectedMove = moves[Math.floor(Math.random() * moves.length)];

        switch (modelId) {
            case 'veo3':
                return `(Camera: ${selectedMove}, Cinematic Lighting) ${text}`;
            case 'sora2':
                return `(Shot: ${selectedMove}, Highly Detailed) ${text}`;
            case 'kling-o1':
                // Kling prefers "Master Shot" descriptions
                return `[Master Shot: ${selectedMove} + Shallow Depth of Field] ${text} --camera_control enabled`;
            case 'runway-gen4':
                return `${text} --camera_motion ${selectedMove.toLowerCase().replace(' ', '_')}`;
            default:
                return `[Camera: ${selectedMove}] ${text}`;
        }
    }

    // --- DOM ELEMENTS ---
    const promptInput = document.getElementById('prompt-input');
    const modelSelect = document.getElementById('model-select');
    const generateBtn = document.getElementById('generate-btn');
    const terminalOutput = document.getElementById('terminal-output');
    const appContainer = document.querySelector('.app-container');
    const statusText = document.querySelector('.status-text');
    const statusDot = document.querySelector('.status-dot');
    const ratioBtns = document.querySelectorAll('.ratio-btn'); // Handles both ratio and quality
    const copyAllBtn = document.getElementById('copy-all-btn');

    // Tab Elements
    const modeTabs = document.querySelectorAll('.mode-tab');
    const videoSettings = document.getElementById('video-settings');
    const photoSettings = document.getElementById('photo-settings');
    const inputLabel = document.getElementById('input-label');
    const restoreModeSelect = document.getElementById('restore-mode');
    const damageLevelSelect = document.getElementById('damage-level');

    // --- INITIALIZATION ---
    function init() {
        // Clear existing options (if any)
        modelSelect.innerHTML = '';

        // Populate Model Select
        models.video.forEach(m => {
            const option = document.createElement('option');
            option.value = m.id;
            option.textContent = m.name;
            modelSelect.appendChild(option);
        });

        // Boot Anim (safely check if already added)
        if (appContainer) {
            appContainer.classList.add('boot-anim');
        }
    }

    init();

    // --- STATE ---
    let activeMode = 'video'; // 'video' or 'photo'
    let selectedRatio = '16:9';
    let selectedQuality = 'hd';
    let isProcessing = false;

    // --- EVENT LISTENERS ---

    // Mode Switch
    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            modeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeMode = tab.dataset.mode;
            updateUIForMode(activeMode);
        });
    });

    // Ratio / Quality Toggle
    ratioBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const group = btn.parentElement;
            group.querySelectorAll('.ratio-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (btn.dataset.ratio) selectedRatio = btn.dataset.ratio;
            if (btn.dataset.q) selectedQuality = btn.dataset.q;
        });
    });

    // Generate/Process
    generateBtn.addEventListener('click', async () => {
        if (isProcessing) return;

        const text = promptInput.value.trim();
        if (!text) {
            flashError(promptInput);
            return;
        }

        startProcessing(text);
    });

    // Copy All
    copyAllBtn.addEventListener('click', () => {
        const blocks = document.querySelectorAll('.prompt-content');
        if (blocks.length === 0) return;

        const allText = Array.from(blocks).map((b, i) => `[SEGMENT ${i + 1}]\n${b.innerText}`).join('\n\n');
        navigator.clipboard.writeText(allText);

        const originalText = copyAllBtn.textContent;
        copyAllBtn.textContent = 'COPIED!';
        setTimeout(() => copyAllBtn.textContent = originalText, 2000);
    });

    // --- UI UPDATES ---
    function updateUIForMode(mode) {
        if (mode === 'video') {
            videoSettings.classList.remove('hidden');
            photoSettings.classList.add('hidden');
            inputLabel.textContent = 'NARRATIVE_INPUT';
            promptInput.placeholder = 'Paste your story script or raw narrative here...';
            generateBtn.querySelector('.btn-content').textContent = 'PROCESS_NARRATIVE';
        } else {
            videoSettings.classList.add('hidden');
            photoSettings.classList.remove('hidden');
            inputLabel.textContent = 'IMAGE_DESCRIPTION';
            promptInput.placeholder = 'Describe the defects and the original photo content...';
            generateBtn.querySelector('.btn-content').textContent = 'OPTIMIZE_RESTORATION';
        }
        terminalOutput.innerHTML = '<div class="empty-state"><p>AWAITING DATA...</p></div>';
    }

    // --- CORE LOGIC ---

    function startProcessing(text) {
        isProcessing = true;
        updateStatus('ANALYZING_DATA...', 'active');
        generateBtn.classList.add('disabled');
        generateBtn.querySelector('.btn-content').textContent = 'OPTIMIZING...';

        terminalOutput.innerHTML = ''; // Clear previous

        // Simulate "Thinking" time
        const delay = Math.min(text.length * 2, 1500);

        setTimeout(() => {
            let results = [];

            if (activeMode === 'video') {
                const scenes = splitIntoScenes(text);
                results = optimizeVideoScenes(scenes, modelSelect.value);
            } else {
                results = optimizeRestoration(text);
            }

            renderResults(results);

            isProcessing = false;
            updateStatus('STANDBY', '');
            generateBtn.classList.remove('disabled');
            generateBtn.querySelector('.btn-content').textContent = activeMode === 'video' ? 'PROCESS_NARRATIVE' : 'OPTIMIZE_RESTORATION';
        }, delay);
    }

    /**
     * Splits a raw story into distinct visual scenes.
     */
    function splitIntoScenes(text) {
        let chunks = text.split(/\n+/).map(s => s.trim()).filter(s => s.length > 0);
        if (chunks.length === 1) {
            const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
            chunks = sentences.map(s => s.trim());
        }

        // Merge short fragments
        const merged = [];
        let current = '';
        chunks.forEach(chunk => {
            if (current.length + chunk.length < 50) {
                current += ' ' + chunk;
            } else {
                if (current) merged.push(current);
                current = chunk;
            }
        });
        if (current) merged.push(current);
        return merged;
    }

    /**
     * Optimizes for Video Generation
     */
    function optimizeVideoScenes(scenes, modelId) {
        const rules = optimizationRules[modelId] || ((t) => t);
        const model = models.video.find(m => m.id === modelId);

        return scenes.map((scene, index) => {
            // Apply Model Rules
            let processed = rules(scene);

            // Apply Director Mode (Camera Logic)
            processed = enrichWithCamera(processed, modelId);

            // Append Global Specs
            processed += ` --ar ${selectedRatio} --v 6.0 --style raw`;

            return {
                id: index + 1,
                raw: scene,
                optimized: processed,
                label: model.name || 'Unknown Model'
            };
        });
    }

    /**
     * Optimizes for Photo Restoration
     */
    function optimizeRestoration(text) {
        const mode = restoreModeSelect.value;
        const damage = damageLevelSelect.value; // light, medium, heavy
        const rule = restorationRules[mode] || restorationRules.restore;

        let processed = rule(text, damage);

        // Inject Quality Tag
        if (selectedQuality === '4k') processed += ' --quality 4k';
        if (selectedQuality === '8k') processed += ' --quality 8k --v 6.0';

        return [{
            id: 1,
            optimized: processed,
            label: `RESTORATION :: ${mode.toUpperCase()} (${damage.toUpperCase()})`
        }];
    }

    // --- UI RENDERING ---

    function renderResults(results) {
        if (results.length === 0) {
            terminalOutput.innerHTML = '<div class="empty-state"><p>NO_DATA_EXTRACTED</p></div>';
            return;
        }

        results.forEach((res, i) => {
            const block = document.createElement('div');
            block.className = 'prompt-block';
            block.style.animationDelay = `${i * 100}ms`;

            // Sanitize output to prevent XSS
            const safeContent = res.optimized
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

            block.innerHTML = `
                <div class="prompt-header">
                    <span>${activeMode === 'video' ? 'SEQ' : 'TASK'}_${String(res.id).padStart(3, '0')} // ${res.label}</span>
                    <button class="copy-btn">COPY</button>
                </div>
                <div class="prompt-content">${safeContent}</div>
            `;

            // Copy Handler
            const copyBtn = block.querySelector('.copy-btn');
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(res.optimized);
                copyBtn.textContent = 'COPIED';
                setTimeout(() => copyBtn.textContent = 'COPY', 1500);
            });

            terminalOutput.appendChild(block);
        });
    }

    function flashError(element) {
        element.style.borderColor = 'var(--accent-error)';
        setTimeout(() => {
            element.style.borderColor = 'var(--text-muted)';
        }, 500);
    }

    function updateStatus(text, className) {
        statusText.textContent = text;
        statusDot.className = 'status-dot ' + className;

        // Add glow effect to parent badge for active state
        const badge = document.querySelector('.status-badge');
        if (!badge) return;

        if (className === 'active') {
            badge.style.borderColor = 'var(--accent-primary)';
            badge.style.background = 'rgba(6, 182, 212, 0.1)';
        } else {
            badge.style.borderColor = 'var(--border-subtle)';
            badge.style.background = 'rgba(255,255,255,0.05)';
        }
    }
});
