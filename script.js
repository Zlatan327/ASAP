/**
 * ASAP - LOGIC CORE 4.0 (DIRECTOR'S CUT + MULTI-SHOT)
 * Includes: Cinematic Engine, Storyboard Mode, JSON Output, Creative Amplifier, Face Lock, Multi-Shot Cuts
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. CINEMATIC KNOWLEDGE BASE
    // ==========================================

    const visualDictionary = {
        // CHARACTERS & TRAITS (STRICT FACE LOCK)
        "jobless": "wearing worn-out oversized t-shirt, messy unkempt hair, stubble beard, tired dark circles under eyes, slouched posture",
        "poor": "faded clothes, scuffed shoes, rough hands, weary expression, poverty-stricken appearance",
        "rich": "tailored italian suit, silk tie, gold heavy watch, polished oxfords, manicured hands, confident arrogant posture",
        "lazy": "lying on couch, snacks scattered around, heavy eyelids, disheveled appearance, stain on shirt, lethargic",
        "gamble": "sweaty forehead, intense focused eyes, trembling hands holding cards, smoke-filled room, dim casino lighting",
        "gambling": "piles of chips, green felt table, nervous twitch, desperate expression, high contrast lighting, risk-taking atmosphere",
        "mysterious": "shadowed face, hooded figure, silhouette against light, piercing eyes, long trench coat, unknown identity",
        "old woman": "deeply wrinkled face, silver hair in bun, wise eyes, shawl wrapped around shoulders, weathered hands, grandmotherly",
        "pelz": "Character Reference: [Pelz]. Male, late 30s, gaunt face, stubble beard, disheveled hair, dark circles under eyes, wearing dirty grey t-shirt",
        "soldier": "Character Reference: [Soldier]. Male, 25 years old, square jaw, buzz cut, blue eyes, sweat and mud on face, dirty green fatigues",
        "enforcer": "Character Reference: [Enforcer]. 7ft tall robot, single glowing red eye slit, white carbon-fiber armor, battle damage on chest plate",
        "runner": "Character Reference: [Runner]. Female, 20s, neon blue bob hair, holographic visor over eyes, black techwear jacket, glowing tattoos on neck",

        // ENVIRONMENTS
        "messy": "cluttered room, piles of laundry, overflowing trash bin, peeling wallpaper, dust motes dancing in light",
        "luxury": "marble floors, crystal chandelier, velvet curtains, expansive windows, pristine minimal furniture",
        "city": "wet pavement reflections, neon signs buzzing, steam rising from vents, towering glass skyscrapers, crowded streets",
        "nature": "dappled sunlight through leaves, swaying tall grass, mossy rocks, chirping birds, vibrant green palette",
        "road": "dusty highway, asphalt stretching to horizon, passing cars, roadside diner, travel context",
        "desert": "endless golden dunes, heat haze shimmering, brutal sun, cracked earth, vast isolation",
        "arctic": "frozen tundra, jagged ice formations, swirling snow mist, pale blue atmosphere, sub-zero temperature",
        "cyberpunk": "neon-drenched alleyway, holographic advertisements, steam vents, rain-slicked metal, high-tech slum",
        "war": "scorched battlefield, craters, smoke rising from ruins, gray ash filling the air, desaturated landscape",

        // ACTING & EMOTION (VISUAL TRANSLATION)
        "complain": "agitated expression, furrowed brows, mouth moving rapidly, hands gesturing in frustration, tense body language",
        "complains": "agitated expression, furrowed brows, mouth moving rapidly, hands gesturing in frustration, tense body language",
        "argue": "shouting, tense posture, aggressive finger pointing, face red with anger, confrontation",
        "cry": "tears streaming down cheeks, red puffy eyes, quivering lower lip, sobbing shoulders, wet face",
        "crying": "tears streaming down cheeks, red puffy eyes, quivering lower lip, sobbing shoulders, wet face",
        "laugh": "head thrown back, wide open mouth smile, crinkled eyes, shaking shoulders, joyful expression",
        "laughing": "head thrown back, wide open mouth smile, crinkled eyes, shaking shoulders, joyful expression",
        "scream": "mouth wide open, strained neck muscles, intense fear or rage expression, veins popping",
        "whisper": "leaning close, hand cupping mouth, secretive expression, soft focus, private exchange",
        "love": "soft expression, gentle eyes, warm lighting, affectionate body language, tender moment",
        "tired": "heavy eyelids, dark circles, yawning, slumping posture, slow movements"
    };

    // NARRATIVE DECODER (IMPLICIT ACTION EXPANSION)
    // Maps summary verbs to granular visual beats (Chronological Micro-Storytelling)
    const narrativeDecoder = {
        // TRAVEL & ARRIVAL
        "arrive": "traveling shot > destination appears in distance > approaching structure > slowing down > stopping > looking up in awe",
        "arrived": "traveling shot > destination appears in distance > approaching structure > slowing down > stopping > looking up in awe",
        "leave": "turning away > walking into distance > figure becoming smaller > looking back once > disappearing over horizon",
        "left": "turning away > walking into distance > figure becoming smaller > looking back once > disappearing over horizon",
        "enter": "hand pushing door open > stepping across threshold > eyes adjusting to light > scanning the room > step forward",
        "entered": "hand pushing door open > stepping across threshold > eyes adjusting to light > scanning the room > step forward",

        // INTERACTION
        "meet": "walking along path > notices someone ahead > slows pace > hesitant approach > making eye contact > greeting nod",
        "met": "walking along path > notices someone ahead > slows pace > hesitant approach > making eye contact > greeting nod",
        "talk": "leaning in > expressive hand gestures > nodding > reaction shot of listener > animated conversation",
        "talked": "leaning in > expressive hand gestures > nodding > reaction shot of listener > animated conversation",
        "argue": "sudden stop > sharp finger pointing > chest heaving > invading personal space > shouting > turning away in disgust",
        "argued": "sudden stop > sharp finger pointing > chest heaving > invading personal space > shouting > turning away in disgust",

        // DISCOVERY & SEARCH
        "find": "scanning environment > eyes narrowing > crouching down > intense focus > brushing away dirt > eyes widening in realization > picking object up",
        "found": "scanning environment > eyes narrowing > crouching down > intense focus > brushing away dirt > eyes widening in realization > picking object up",
        "search": "looking left and right > moving objects aside > frantic pace > sweat on brow > desperation building > rapid head movements",
        "searched": "looking left and right > moving objects aside > frantic pace > sweat on brow > desperation building > rapid head movements",

        // CONFLICT & ACTION
        "fight": "tense standoff > circling opponent > fists raised > sudden lunge > impact > recoil > heavy breathing",
        "fought": "tense standoff > circling opponent > fists raised > sudden lunge > impact > recoil > heavy breathing",
        "chase": "sprinting > looking back over shoulder > stumbling > scrambling up > heavy breathing > terrified expression > running harder",
        "chased": "sprinting > looking back over shoulder > stumbling > scrambling up > heavy breathing > terrified expression > running harder",
        "escape": "hiding in shadows > checking coast is clear > silent movement > sudden dash > bursting through exit > freedom",
        "escaped": "hiding in shadows > checking coast is clear > silent movement > sudden dash > bursting through exit > freedom",

        // EMOTION & REACTION
        "realize": "sudden stillness > eyes widening > mouth slightly open > background dolly zoom > dawning comprehension",
        "realized": "sudden stillness > eyes widening > mouth slightly open > background dolly zoom > dawning comprehension",
        "remember": "thousand-yard stare > soft focus > subtle smile or frown > tilt head > lost in thought > return to present",
        "remembered": "thousand-yard stare > soft focus > subtle smile or frown > tilt head > lost in thought > return to present"
    };

    // HIGGSFIELD 8 CORE SHOTS + NANO BANANA SPECS
    const cinematicShots = {
        "establishing": {
            name: "Establishing Shot",
            trigger: ["start", "begin", "open", "dune", "desert", "city", "world", "landscape"],
            desc: "Extreme Wide Shot, 15mm wide-angle, IMAX 70mm, Rule of Thirds, High Contrast, establishing scale and mood."
        },
        "pov": {
            name: "First-Person POV",
            trigger: ["run", "escape", "chase", "fight", "hands", "grab", "running", "flee"],
            desc: "Action Camera Perspective (POV). 14mm Ultra-Wide Fisheye. Motion blur at edges. Immersive and chaotic."
        },
        "crane": {
            name: "Crane Shot Reveal",
            trigger: ["revealing", "suddenly", "appear", "risen", "above", "fly", "reveal"],
            desc: "Sweeping Crane Shot. Camera rising to reveal the scale of the environment. High-angle perspective. Epic scope."
        },
        "ots": {
            name: "Over-The-Shoulder (OTS)",
            trigger: ["talk", "argue", "speak", "meet", "listen", "chat", "discuss"],
            desc: "Tight Over-the-Shoulder Shot. 85mm Prime Lens, f/2.8 Shallow Depth of Field. Focus on the listener/speaker's reaction."
        },
        "low_angle": {
            name: "Low Angle Shot",
            trigger: ["hero", "boss", "giant", "power", "tall", "looming", "monster", "god"],
            desc: "Low Angle Shot (Worm's Eye View), camera tilted up 75-degrees. Imposing silhouette, dominant power dynamic. 15mm Wide Lens."
        },
        "dutch": {
            name: "Dutch Angle (Tension)",
            trigger: ["trap", "fear", "nightmare", "confused", "dizzy", "scary", "weird", "unease", "panic"],
            desc: "Extreme Dutch Angle (Canted Shot), 45-degree tilt. Inducing vertigo and psychological instability. Harsh shadows."
        },
        "closeup": {
            name: "Tight Close-Up",
            trigger: ["cry", "sad", "tear", "realize", "eye", "look", "emotion", "face"],
            desc: "Hyper-realistic Tight Close-Up (TCU). 135mm Macro Lens. Focus razor-sharp on eyes. Pore-level detail. Bokeh background."
        },
        "ews": {
            name: "Extreme Wide Shot (EWS)",
            trigger: ["tiny", "lost", "vast", "small", "alone", "distance", "isolation"],
            desc: "Extreme Wide Shot showing environmental dominance. Subject is a micro-element (<3% of frame). Vast negative space."
        }
    };

    const techSpecs = {
        stocks: {
            "gritty": "Kodak Vision3 500T 5219 (Heavy Grain)",
            "noir": "Kodak Tri-X 400 (B&W High Contrast)",
            "scifi": "Fujifilm Eterna 500T (Cool Teals/Greens)",
            "natural": "Kodak Vision3 250D (Fine Grain, Warm)",
            "vintage": "Kodachrome 64 (Vibrant, Saturated)"
        },
        lenses: {
            "wide": "Panavision C-Series Anamorphic (15mm)",
            "portrait": "85mm Prime f/1.4",
            "macro": "100mm Macro",
            "standard": "35mm Anamorphic"
        }
    };

    const lightingMoods = {
        "happy": "High Key Lighting, Warm Golden Hour, Soft Shadows",
        "sad": "Low Key Lighting, Cool Blue Tones, Rain on Window, Overcast",
        "scary": "Chiaroscuro, Harsh Shadows, Flicker Effect, Cold Color Palette",
        "tense": "High Contrast, Uneasy Green Tint, Silhouette",
        "mysterious": "Volumetric Fog, Rim Lighting, Backlit, Moonbeams"
    };

    // ==========================================
    // 2. MODEL CONFIGURATION
    // ==========================================

    const modelSpecs = {
        'nano-storyboard': {
            name: 'NANO_BANANA_PRO (STORYBOARD)',
            type: 'grid',
            jsonType: 'nano_grid',
            // Nano Banana 3x3 Grid Format
            format: (data) => `
DIRECTIVE:
Generate a cinematic 3x3 storyboard grid (9 panels) visualizing: ${data.action} in a ${data.mood} style.

SUBJECTS:
${data.subject}: ${data.visuals}.

SCENE & ATMOSPHERE:
Location: ${data.env}.
Lighting: ${data.lighting}.
Key Cinematography: ${data.camera.desc || data.camera}. ${data.filmStock}.

PANEL BREAKDOWN (Chronological Flow):
Panel 1 (Top-Left): [Establishing Shot] Wide view of ${data.env}.
Panel 2 (Top-Center): [Action] ${data.subject} moves through the scene.
Panel 3 (Top-Right): [Detail] Close up on a specific detail involved in the action.
Panel 4 (Mid-Left): [Reaction] ${data.subject}'s face showing ${data.mood} emotion.
Panel 5 (Mid-Center): [Focus] The core moment of ${data.action}.
Panel 6 (Mid-Right): [POV] First person view of what ${data.subject} sees.
Panel 7 (Bottom-Left): [Low Angle] Emphasizing scale or power.
Panel 8 (Bottom-Center): [Consequence] The result of the action.
Panel 9 (Bottom-Right): [Closing Shot] A final wide or symbolic shot fading out.

TECHNICAL SPECS:
Film Stock: ${data.filmStock}.
Lenses: ${data.lensMatch}.
Negative Prompt: ${data.negativeConstraints}.
            `
        },
        'veo3': {
            name: 'GOOGLE_VEO_3.1',
            type: 'video',
            jsonType: 'veo_video',
            format: (data) => `
(Cinematic, 8k, HDR)
[SCENE]: ${data.action} ${data.narrativeBeats ? `\n[SEQUENCE]: ${data.narrativeBeats}` : ''}
[VISUALS]: ${data.visuals}
[CONTEXT]: ${data.env}
[LIGHTING]: ${data.lighting}
(Camera: ${data.camera.desc || data.camera})
${data.audio ? `[Audio: ${data.audio}]` : ''}
--no ${data.negativeConstraints}
            `
        },
        'kling-o1': {
            name: 'KLING_PRO_1.6',
            type: 'video',
            jsonType: 'kling_video',
            format: (data) => `
[Role: Cinematic Masterpiece]
[Action]: ${data.action} ${data.narrativeBeats ? `\n[Micro-Sequence]: ${data.narrativeBeats}` : ''}
[Character Details]: ${data.visuals} in ${data.env}.
[Atmosphere]: ${data.lighting}.
[Camera]: ${data.camera.desc || data.camera}.
High fidelity, 4k.
--camera_control enabled --no ${data.negativeConstraints}
            `
        },
        'runway-gen4': {
            name: 'RUNWAY_GEN_4',
            type: 'video',
            jsonType: 'runway_gen4',
            format: (data) => `
${data.action}
${data.narrativeBeats ? `[Sequence]: ${data.narrativeBeats}.` : ''}
[Details]: ${data.visuals}.
[Environment]: ${data.env}.
[Style]: ${data.lighting}, ${data.camera.desc || data.camera}. 
--motion_bucket 8 --style_preset cinematic --no ${data.negativeConstraints}
            `
        }
    };

    // ==========================================
    // 3. ENGINE LOGIC
    // ==========================================

    function analyzeText(text) {
        const lower = text.toLowerCase();

        // 0. CREATIVE AMPLIFIER (For weak inputs)
        let amplifiedText = text;
        const stylePreset = document.getElementById('style-preset') ? document.getElementById('style-preset').value : 'cinematic';

        if (text.split(' ').length < 5) {
            // "Weak Input" detected
            // Optimization: If detecting "Shot" or numbered list, do NOT amplify to avoid "Shot 1: neon city... Shot 2: neon city..."
            if (!text.match(/Shot \d|^\d\./i)) {
                if (stylePreset === 'cinematic') amplifiedText += " in a highly detailed cinematic environment with dramatic lighting and deep atmosphere";
                if (stylePreset === 'anime') amplifiedText += " in a vibrant anime style with dynamic action lines and colorful background";
                if (stylePreset === 'digital') amplifiedText += " in a futuristic cyberpunk world with neon lights and digital artifacts";
                if (stylePreset === 'raw') amplifiedText += " captured in raw 4k footage, realistic textures, documentary style";
            }
        }

        // 1. EXTRACT SUBJECT
        let name = "The Protagonist";
        // Heuristic: matching specific dictionary keys first
        if (lower.includes("pelz")) name = "Pelz (a man)";
        if (lower.includes("soldier")) name = "The Soldier";
        if (lower.includes("enforcer") || lower.includes("robot")) name = "The Enforcer";
        if (lower.includes("runner")) name = "The Runner";

        // 2. DETECT MOOD & MATCH FILM STOCK
        let mood = "cinematic";
        let filmStock = techSpecs.stocks["natural"];

        if (lower.match(/sad|cry|tear|grief|loss/)) { mood = "sad"; filmStock = techSpecs.stocks["natural"]; }
        if (lower.match(/scary|dark|fear|ghost|horror|trap/)) { mood = "scary"; filmStock = techSpecs.stocks["gritty"]; }
        if (lower.match(/happy|laugh|smile|joy/)) { mood = "happy"; filmStock = techSpecs.stocks["vintage"]; }
        if (lower.match(/mysterious|secret|witch|magic/)) { mood = "mysterious"; filmStock = techSpecs.stocks["noir"]; }
        if (lower.match(/fight|run|chase|action|cyber/)) { mood = "tense"; filmStock = techSpecs.stocks["scifi"]; }

        // 3. DETECT CAMERA & LENS
        let camera = cinematicShots["establishing"]; // Default
        let lensMatch = techSpecs.lenses["wide"];

        for (const key in cinematicShots) {
            const shot = cinematicShots[key];
            if (shot.trigger.some(trigger => lower.includes(trigger))) {
                camera = shot;
                // Match lens to shot type
                if (key === 'close_up' || key === 'emotion') lensMatch = techSpecs.lenses["portrait"];
                if (key === 'pov' || key === 'dutch') lensMatch = techSpecs.lenses["wide"];
                if (key === 'ots') lensMatch = techSpecs.lenses["portrait"];
                break;
            }
        }

        // 4. EXPAND VISUALS & DECODE NARRATIVE
        let visualTags = [];
        let envTags = [];
        let actionBeats = []; // For implicit narrative expansion

        // Check for narrative verbs to expand
        for (const key in narrativeDecoder) {
            // We use a regex word boundary check to ensure we match "met" but not "helmet"
            const regex = new RegExp(`\\b${key}\\b`, 'i');
            if (regex.test(lower)) {
                actionBeats.push(narrativeDecoder[key]);
            }
        }

        for (const key in visualDictionary) {
            if (lower.includes(key)) {
                if (key.match(/city|nature|messy|luxury|road|desert|arctic|cyberpunk|war/)) {
                    envTags.push(visualDictionary[key]);
                } else {
                    // Include ALL other dictionary matches (including emotions/actions like 'cry', 'complain')
                    visualTags.push(visualDictionary[key]);
                }
            }
        }

        let visuals = visualTags.length > 0 ? visualTags.join(", ") : "highly detailed cinematic appearance";
        let narrativeBeats = null;

        if (actionBeats.length > 0) {
            // Store separately, don't just append to visuals
            narrativeBeats = actionBeats.join(" > ");
        }

        const env = envTags.length > 0 ? envTags.join(", ") : "cinematic background with depth";
        const lighting = lightingMoods[mood] || lightingMoods["mysterious"];

        // 5. AUDIO
        const quoteMatch = text.match(/"([^"]+)"/);
        const audio = quoteMatch ? `Character speaks "${quoteMatch[1]}"` : null;

        // 6. NEGATIVE CONSTRAINTS (Rule 7) - Dynamic
        let negativeConstraints = "text, watermark, blurry, distorted, low quality, pixelated, bad anatomy";

        if (stylePreset === 'anime') {
            negativeConstraints += ", photorealistic, 3d render, cgi, live action";
        } else if (stylePreset === 'raw') {
            negativeConstraints += ", cartoon, illustration, painting, drawing, anime, cgi, 3d render, smooth skin";
        } else {
            // Cinematic/Digital default
            negativeConstraints += ", cartoon, ugly faces, cgi, 3d render, flat lighting";
        }

        return {
            subject: name,
            visuals,
            action: amplifiedText,
            env,
            lighting,
            camera,
            audio,
            mood,
            filmStock,
            lensMatch,
            negativeConstraints,
            narrativeBeats
        };
    }

    function processScene(rawText, modelId, index, isJsonMode, seed) {
        const analysis = analyzeText(rawText);
        const model = modelSpecs[modelId] || modelSpecs['veo3'];

        if (isJsonMode) {
            // JSON API Payload Construction
            // Removing --no constraints from the positive prompt to avoid duplication with negative_prompt field
            let cleanPrompt = model.format(analysis).replace(/--no .*$/, '').trim();

            const payload = {
                model_id: model.name,
                prompt: cleanPrompt,
                negative_prompt: analysis.negativeConstraints,
                cfg_scale: 0.5,
                aspect_ratio: selectedRatio || "16:9",
                camera_control: {
                    type: analysis.camera.name,
                    lens: analysis.lensMatch
                },
                seed: seed || Math.floor(Math.random() * 1000000)
            };

            return {
                id: index + 1,
                label: `${model.name} [JSON]`,
                optimized: JSON.stringify(payload, null, 2),
                raw: rawText
            };
        }

        const optimizedPrompt = model.format(analysis);

        return {
            id: index + 1,
            label: model.name,
            optimized: optimizedPrompt.trim(),
            raw: rawText
        };
    }

    // ORIGINAL RESTORATION LOGIC
    const restorationRules = {
        restore: (text, damage) => `Restore old photo: ${text}. Fix ${damage} damage. Remove scratches, cracks, tears, dust. Reconstruct missing details. Maintain original facial features.`,
        colorize: (text, damage) => `Colorize black and white photo: ${text}. Fix ${damage} damage. Apply natural, realistic coloration. Authentic skin tones. Period-accurate colors. High fidelity.`,
        upscale: (text, damage) => `Upscale and sharpen old photo: ${text}. Fix ${damage} damage. 4k resolution, razor sharp focus, de-blur, remove noise, enhance fine details.`,
        denoise: (text, damage) => `De-noise vintage photo: ${text}. Fix ${damage} damage. Remove grain, speckles, and artifacts. Smooth textures while preserving edges.`
    };

    function optimizeRestoration(text) {
        const modeSelect = document.getElementById('restore-mode');
        const damageSelect = document.getElementById('damage-level');
        const mode = modeSelect ? modeSelect.value : 'restore';
        const damage = damageSelect ? damageSelect.value : 'medium';

        const rule = restorationRules[mode] || restorationRules.restore;
        let processed = rule(text, damage);

        return [{
            id: 1,
            label: `RESTORATION :: ${mode.toUpperCase()}`,
            optimized: processed + " --quality 4k"
        }];
    }

    // ==========================================
    // 4. UI HANDLERS & INIT
    // ==========================================

    const promptInput = document.getElementById('prompt-input');
    const modelSelect = document.getElementById('model-select');
    const generateBtn = document.getElementById('generate-btn');
    const terminalOutput = document.getElementById('terminal-output');
    const appContainer = document.querySelector('.app-container');
    const copyAllBtn = document.getElementById('copy-all-btn');
    const modeTabs = document.querySelectorAll('.mode-tab');
    const jsonToggle = document.getElementById('json-toggle');
    const multiShotToggle = document.getElementById('multishot-toggle');
    const ratioBtns = document.querySelectorAll('.ratio-btn');

    // Config
    const models = Object.keys(modelSpecs).map(k => ({ id: k, name: modelSpecs[k].name }));
    let activeMode = 'video';
    let selectedRatio = "16:9";
    let isJsonMode = false;
    let isMultiShotMode = false;

    function init() {
        if (modelSelect) {
            modelSelect.innerHTML = '';
            models.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.id;
                opt.textContent = m.name;
                // Default selection
                if (m.id === 'nano-storyboard') opt.selected = true;
                modelSelect.appendChild(opt);
            });
        }
        if (appContainer) appContainer.classList.add('boot-anim');
    }

    init();

    // HANDLERS

    if (jsonToggle) {
        jsonToggle.addEventListener('click', () => {
            isJsonMode = !isJsonMode;
            jsonToggle.classList.toggle('active', isJsonMode);
            jsonToggle.style.background = isJsonMode ? 'var(--accent-primary)' : '';
            jsonToggle.textContent = isJsonMode ? 'JSON ON' : 'JSON';
        });
    }

    if (multiShotToggle) {
        multiShotToggle.addEventListener('click', () => {
            isMultiShotMode = !isMultiShotMode;
            multiShotToggle.classList.toggle('active', isMultiShotMode);
            multiShotToggle.style.background = isMultiShotMode ? 'var(--accent-secondary)' : '';
            multiShotToggle.textContent = isMultiShotMode ? 'CUTS ON' : 'CUTS';
        });
    }

    if (ratioBtns) {
        ratioBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.id === 'json-toggle' || btn.id === 'multishot-toggle') return; // Skip function toggles

                const group = btn.parentElement;
                group.querySelectorAll('.ratio-btn').forEach(b => {
                    if (b.id !== 'json-toggle' && b.id !== 'multishot-toggle') b.classList.remove('active');
                });
                btn.classList.add('active');

                if (btn.dataset.ratio) selectedRatio = btn.dataset.ratio;
            });
        });
    }

    if (modeTabs) {
        modeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                modeTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                activeMode = tab.dataset.mode;

                const videoSettings = document.getElementById('video-settings');
                const photoSettings = document.getElementById('photo-settings');
                const btnText = generateBtn.querySelector('.btn-content');

                if (activeMode === 'video') {
                    videoSettings.classList.remove('hidden');
                    photoSettings.classList.add('hidden');
                    btnText.textContent = "PROCESS_NARRATIVE";
                } else {
                    videoSettings.classList.add('hidden');
                    photoSettings.classList.remove('hidden');
                    btnText.textContent = "OPTIMIZE_RESTORATION";
                }
            });
        });
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const text = promptInput.value.trim();
            if (!text) {
                promptInput.style.borderColor = 'red';
                setTimeout(() => promptInput.style.borderColor = '', 500);
                return;
            }

            // UI State
            const originalBtnText = generateBtn.querySelector('.btn-content').textContent;
            generateBtn.querySelector('.btn-content').textContent = isJsonMode ? "COMPILING JSON..." : "DIRECTING...";
            generateBtn.classList.add('disabled');
            terminalOutput.innerHTML = '<div class="empty-state"><p>ANALYZING_CINEMATOGRAPHY...</p></div>';

            // Shared Seed for Consistency across the sequence
            const sessionSeed = Math.floor(Math.random() * 1000000000);

            setTimeout(() => {
                terminalOutput.innerHTML = '';
                let results = [];

                if (activeMode === 'video') {
                    // If Storyboard mode selected, don't split scenes, just do 1 giant prompt
                    if (modelSelect.value === 'nano-storyboard') {
                        results.push(processScene(text, 'nano-storyboard', 0, isJsonMode, sessionSeed));
                    } else {
                        // MULTI-SHOT MODE LOGIC (The "Framer" Flex)
                        if (isMultiShotMode && text.split(/\n+/).length > 1) {
                            const segments = splitIntoScenes(text);
                            let combinedPrompt = "";

                            // 1. Build the Multi-Shot textual prompt
                            segments.forEach((seg, i) => {
                                const analysis = analyzeText(seg);
                                // Check if user already typed "Shot 1:" or "Shot 2:" to avoid double labeling
                                let cleanAction = analysis.action;
                                if (cleanAction.match(/^Shot \d+:/i)) {
                                    cleanAction = cleanAction.replace(/^Shot \d+:\s*/i, '');
                                }

                                // If user already specified a camera in brackets [Crane Shot], trust it, otherwise use detected
                                const cameraLabel = cleanAction.match(/^\[(.*?)\]/) ? '' : `[${analysis.camera.name}] `;
                                const sequenceLabel = analysis.narrativeBeats ? ` (Sequence: ${analysis.narrativeBeats})` : '';

                                combinedPrompt += `Shot ${i + 1}: ${cameraLabel}${cleanAction}.${sequenceLabel} ${analysis.visuals}. \n`;
                            });

                            const masterAnalysis = analyzeText(text); // Macro analysis for env/lighting
                            combinedPrompt += `\n[Consistent Environment]: ${masterAnalysis.env}. [Lighting]: ${masterAnalysis.lighting}. \n(Continuous Shot Sequence, No Cuts).`;

                            // 2. Handle JSON Mode for Multi-Shot
                            if (isJsonMode) {
                                const model = modelSpecs[modelSelect.value] || modelSpecs['veo3'];
                                const payload = {
                                    model_id: model.name,
                                    prompt: combinedPrompt.trim(),
                                    negative_prompt: masterAnalysis.negativeConstraints,
                                    cfg_scale: 0.5,
                                    aspect_ratio: selectedRatio || "16:9",
                                    camera_control: {
                                        type: "Dynamic/Multi-Shot",
                                        lens: "Variable"
                                    },
                                    seed: sessionSeed
                                };

                                results.push({
                                    id: 1,
                                    label: `${model.name} [JSON] [MULTI-SHOT]`,
                                    optimized: JSON.stringify(payload, null, 2),
                                    raw: text
                                });
                            } else {
                                // Standard Text Output
                                results.push({
                                    id: 1,
                                    label: `${modelSpecs[modelSelect.value].name} [MULTI-SHOT]`,
                                    optimized: combinedPrompt,
                                    raw: text
                                });
                            }

                        } else {
                            // Standard video split
                            const segments = splitIntoScenes(text);
                            const isSingleShot = segments.length === 1;

                            segments.forEach((seg, i) => {
                                const res = processScene(seg, modelSelect.value, i, isJsonMode, sessionSeed);
                                if (isSingleShot) res.label = res.label.replace('SEQ_001', 'SINGLE_SHOT'); // Override label
                                results.push(res);
                            });
                        }
                    }
                } else {
                    results = optimizeRestoration(text);
                }

                results.forEach(res => renderResult(res));

                generateBtn.classList.remove('disabled');
                generateBtn.querySelector('.btn-content').textContent = originalBtnText;
            }, 1000);
        });
    }

    function splitIntoScenes(text) {
        let chunks = text.split(/\n+/).map(s => s.trim()).filter(s => s.length > 0);
        if (chunks.length === 1 && text.length > 100) {
            chunks = text.match(/[^.!?]+[.!?]+/g) || [text];
        }
        return chunks;
    }

    function renderResult(res) {
        const block = document.createElement('div');
        block.className = 'prompt-block';

        let content = res.optimized.replace(/\n/g, '<br>');
        // Pretty print JSON in HTML
        if (res.label.includes('JSON')) {
            content = `<pre style="white-space: pre-wrap; color: #a5f3fc; font-family: 'JetBrains Mono', monospace; font-size: 0.85em;">${res.optimized}</pre>`;
        }

        block.innerHTML = `
            <div class="prompt-header">
                <span>${res.label.includes('SINGLE_SHOT') ? 'MASTER_PROMPT' : (activeMode === 'video' ? 'SEQ' : 'TASK') + '_' + String(res.id).padStart(3, '0')} // ${res.label}</span>
                <button class="copy-btn">COPY</button>
            </div>
            <div class="prompt-content">${content}</div>
        `;

        const cBtn = block.querySelector('.copy-btn');
        cBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(res.optimized);
            cBtn.textContent = "COPIED";
            setTimeout(() => cBtn.textContent = "COPY", 1000);
        });

        terminalOutput.appendChild(block);
    }

    if (copyAllBtn) {
        copyAllBtn.addEventListener('click', () => {
            const all = document.querySelectorAll('.prompt-content');
            if (all.length === 0) return;
            const text = Array.from(all).map(d => d.innerText).join('\n\n');
            navigator.clipboard.writeText(text);
            copyAllBtn.style.color = '#10b981';
            setTimeout(() => copyAllBtn.style.color = '', 1000);
        });
    }

});
