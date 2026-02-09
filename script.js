/**
 * ASAP - LOGIC CORE 5.1 (INTEGRATED SKILLS)
 * Includes: Visual Director + Active Continuity Tracking + Scene Bridging
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. VISUAL DIRECTOR KNOWLEDGE BASE
    // ==========================================

    // SKILL 1: VISUAL TRANSLATOR
    const abstractConceptDb = {
        "lazy": "slouched posture, unkempt clothing, sleeping in daytime, piles of trash, stain on shirt",
        "angry": "clenched fists, red face, veins popping on neck, shouting, aggressive stance, spittle flying",
        "sad": "slumped shoulders, head down, eyes red and puffy, tears tracking through dust, isolation",
        "happy": "wide smile, crinkled eyes, bouncing step, open arms, warm glowing expression",
        "old": "deep wrinkles, sunspots, thinning hair, clouded eyes, trembling hands, weathered skin",
        "young": "smooth skin, bright clear eyes, energetic posture, fresh face, unblemished",
        "rich": "silk suit, gold watch, polished shoes, manicured hands, sneering expression, chauffeur",
        "poor": "ragged clothes, dirt smudges, worn-out shoes, hollow cheeks, desperate eyes",
        "messy": "overflowing trash, clothes scattered on floor, unmade bed, dust motes, cluttered surfaces",
        "clean": "pristine surfaces, sparkling glass, aligned objects, minimal dust, fresh atmosphere",
        "chaos": "people running, debris flying, smoke filling air, blurred motion, panicked crowds",
        "peace": "still water, gentle breeze, soft light, motionless leaves, quiet atmosphere"
    };

    // SKILL 4: TOKEN ECONOMY
    const stopWords = new Set([
        "the", "a", "an", "is", "are", "was", "were", "suddenly", "meanwhile", "then",
        "next", "and", "or", "because", "so", "very", "really", "literally", "totally",
        "mysterious style", "cinematic style", "okay", "just", "basically"
    ]);

    const visualDictionary = {
        "soldier": "Character Reference: [Soldier]. Male, 25 years old, square jaw, buzz cut, blue eyes, sweat and mud on face, dirty green fatigues",
        "enforcer": "Character Reference: [Enforcer]. 7ft tall robot, single glowing red eye slit, white carbon-fiber armor, battle damage on chest plate",
        "runner": "Character Reference: [Runner]. Female, 20s, neon blue bob hair, holographic visor over eyes, black techwear jacket, glowing tattoos on neck"
    };

    // ==========================================
    // 1. STORY SKILLS (StoryState + Continuity)
    // ==========================================

    class StoryState {
        constructor(rawStory) {
            this.rawStory = rawStory;
            this.characters = this.extractCharacters();
            this.scenes = this.segmentScenes();
            this.globalContext = this.extractGlobalContext();
        }

        extractCharacters() {
            const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g;
            const matches = [...this.rawStory.matchAll(namePattern)];
            const nameCounts = {};
            matches.forEach(match => {
                const name = match[1];
                const stopWordsList = ['The', 'A', 'An', 'In', 'On', 'At', 'To', 'For', 'Of', 'By', 'With', 'Then', 'Suddenly'];
                if (!stopWordsList.includes(name)) nameCounts[name] = (nameCounts[name] || 0) + 1;
            });
            return Object.entries(nameCounts)
                .filter(([name, count]) => count > 1 || this.isLikelyCharacter(name))
                .map(([name]) => name).slice(0, 5);
        }

        isLikelyCharacter(name) {
            const characterContexts = [
                new RegExp(`${name}\\s+(said|says|walks|runs|looks|enters|exits)`, 'i'),
                new RegExp(`(Mr\\.|Mrs\\.|Dr\\.|Miss|Captain|Detective)\\s+${name}`, 'i')
            ];
            return characterContexts.some(pattern => pattern.test(this.rawStory));
        }

        extractGlobalContext() {
            if (this.rawStory.match(/highway|road|interstate/i)) return "Highway";
            if (this.rawStory.match(/space|ship|star/i)) return "Spaceship";
            if (this.rawStory.match(/desert|dune|sand/i)) return "Desert";
            return "Cinematic World";
        }

        segmentScenes() {
            const transitions = {
                temporal: /\b(then|next|after|later|soon|meanwhile|suddenly|now|finally|eventually)\b/gi,
                spatial: /\b(enters|leaves|arrives|moves to|goes to|walks to|drives to)\b/gi
            };
            const sentences = this.rawStory.split(/[.!?]+/).filter(s => s.trim().length > 0);
            const scenes = [];
            let currentScene = [];
            sentences.forEach((sentence) => {
                const trimmed = sentence.trim();
                const hasTemporalShift = transitions.temporal.test(trimmed) && trimmed.match(/later|after|meanwhile/i);
                const hasSpatialShift = transitions.spatial.test(trimmed);
                const shouldBreak = (hasTemporalShift || hasSpatialShift) && currentScene.length >= 2;
                if (shouldBreak && currentScene.length > 0) {
                    scenes.push(currentScene.join('. ') + '.');
                    currentScene = [trimmed];
                } else {
                    currentScene.push(trimmed);
                }
            });
            if (currentScene.length > 0) scenes.push(currentScene.join('. ') + '.');
            return scenes.length > 0 ? scenes : [this.rawStory];
        }
    }

    class ContinuityTracker {
        constructor() {
            this.state = {
                characters: {},
                environment: { timeOfDay: null, weather: null, location: null },
                objects: []
            };
        }

        updateFromScene(sceneText) {
            const lower = sceneText.toLowerCase();
            // Time
            if (/\b(morning|dawn|sunrise)\b/.test(lower)) this.state.environment.timeOfDay = 'morning';
            if (/\b(afternoon|midday)\b/.test(lower)) this.state.environment.timeOfDay = 'afternoon';
            if (/\b(evening|dusk|sunset)\b/.test(lower)) this.state.environment.timeOfDay = 'evening';
            if (/\b(night|midnight|dark)\b/.test(lower)) this.state.environment.timeOfDay = 'night';
            // Weather
            if (/\b(rain|raining)\b/.test(lower)) this.state.environment.weather = 'rain';
            if (/\b(snow|snowing)\b/.test(lower)) this.state.environment.weather = 'snow';
            // Injuries
            const injuryMatch = sceneText.match(/(\w+)\s+(?:cuts|cut|breaks|broke|wounds|wounded)/i);
            if (injuryMatch) {
                const char = injuryMatch[1];
                if (!this.state.characters[char]) this.state.characters[char] = { injuries: [] };
                if (!this.state.characters[char].injuries.includes('injured')) this.state.characters[char].injuries.push('injured');
            }
        }

        injectIntoPrompt(basePrompt) {
            const notes = [];
            if (this.state.environment.timeOfDay) notes.push(`Time: ${this.state.environment.timeOfDay}`);
            if (this.state.environment.weather) notes.push(`Weather: ${this.state.environment.weather}`);
            for (const [char, data] of Object.entries(this.state.characters)) {
                if (data.injuries.length > 0) notes.push(`${char}: ${data.injuries.join(', ')}`);
            }
            return notes.length > 0 ? `${basePrompt}\n[Story State]: ${notes.join(' | ')}` : basePrompt;
        }

        reset() {
            this.state = { characters: {}, environment: { timeOfDay: null, weather: null, location: null }, objects: [] };
        }
    }

    // ==========================================
    // 2. LOGIC CORE
    // ==========================================

    const cinematicShots = {
        "establishing": { name: "Establishing Shot", trigger: ["start", "begin", "open"], desc: "Extreme Wide Shot, establishing scale." },
        "pov": { name: "First-Person POV", trigger: ["run", "escape", "chase"], desc: "Action Camera Perspective (POV). Motion blur." },
        "crane": { name: "Crane Shot Reveal", trigger: ["reveal", "above"], desc: "Sweeping Crane Shot. High-angle perspective." },
        "ots": { name: "Over-The-Shoulder (OTS)", trigger: ["talk", "argue"], desc: "Tight Over-the-Shoulder Shot. Focus on reaction." },
        "low_angle": { name: "Low Angle Shot", trigger: ["hero", "giant"], desc: "Low Angle Shot (Worm's Eye View). Imposing." },
        "dutch": { name: "Dutch Angle (Tension)", trigger: ["fear", "weird"], desc: "Extreme Dutch Angle (Canted Shot). Unease." },
        "closeup": { name: "Tight Close-Up", trigger: ["cry", "eye"], desc: "Hyper-realistic Tight Close-Up (TCU). macro details." },
        "ews": { name: "Extreme Wide Shot", trigger: ["tiny", "vast"], desc: "Extreme Wide Shot. Vast negative space." }
    };

    const techSpecs = {
        stocks: {
            "gritty": "Kodak Vision3 500T 5219 (Heavy Grain)",
            "noir": "Kodak Tri-X 400 (B&W High Contrast)",
            "scifi": "Fujifilm Eterna 500T (Cool Teals/Greens)",
            "natural": "Kodak Vision3 250D (Fine Grain, Warm)",
            "vintage": "Kodachrome 64 (Vibrant, Saturated)"
        },
        lenses: { "wide": "Panavision C-Series (15mm)", "portrait": "85mm Prime", "macro": "100mm Macro", "standard": "35mm Anamorphic" }
    };

    function translateAbstractToConcrete(text) {
        let processed = text;
        for (const [abstract, concrete] of Object.entries(abstractConceptDb)) {
            processed = processed.replace(new RegExp(`\\b${abstract}\\b`, 'gi'), concrete);
        }
        return processed;
    }

    function optimizeTokens(text) {
        return text.split(/\s+/).filter(w => !stopWords.has(w.toLowerCase().replace(/[^a-z]/g, ''))).join(' ');
    }

    // UPDATED: analyzeText now accepts 'bridgeContext' and 'continuityNotes'
    function analyzeText(text, bridgeContext = "", continuityNotes = "") {
        const concreteText = translateAbstractToConcrete(text);
        const lower = concreteText.toLowerCase();

        // 1. EXTRACT SUBJECT 
        let name = "The Protagonist";
        if (text.split(' ').length > 15) {
            const quickState = new StoryState(text);
            if (quickState.characters.length > 0) name = quickState.characters[0];
        }
        const weightedName = `(${name}:1.2)`;

        // 2. DETECT MOOD
        let mood = "cinematic";
        let filmStock = techSpecs.stocks["natural"];
        if (lower.match(/sad|cry|tear/)) { mood = "sad"; filmStock = techSpecs.stocks["natural"]; }
        if (lower.match(/scary|dark|fear/)) { mood = "scary"; filmStock = techSpecs.stocks["gritty"]; }
        if (lower.match(/happy|joy/)) { mood = "happy"; filmStock = techSpecs.stocks["vintage"]; }
        if (lower.match(/cyber|future/)) { mood = "tense"; filmStock = techSpecs.stocks["scifi"]; }

        // Colorist
        const colorGrades = {
            "cinematic": "Teal and Orange separation",
            "sad": "Cool blue desaturated palette",
            "scary": "High contrast, crushed blacks",
            "happy": "Warm golden hour hues",
            "tense": "Bleach bypass look"
        };
        const colorGrade = colorGrades[mood] || "Cinematic";

        // 3. CAMERA
        let camera = cinematicShots["establishing"];
        let movementType = "smooth";
        for (const key in cinematicShots) {
            if (cinematicShots[key].trigger.some(t => lower.includes(t))) {
                camera = cinematicShots[key];
                if (key === 'pov') movementType = "handheld";
                if (key === 'crane') movementType = "sweeping_crane";
                break;
            }
        }
        // Action Director
        const movementDescriptors = {
            "static": "Tripod lock-off", "smooth": "Steadicam glide",
            "handheld": "Handheld organic shake", "sweeping_crane": "Epic crane", "chaotic": "SnorriCam rig"
        };
        const movementDesc = movementDescriptors[movementType];
        const cameraFinal = { name: camera.name, desc: `${camera.desc} Movement: ${movementDesc}.` };

        // 4. SCENE CONTEXT (Skill 3)
        // Inject continuity notes into context
        let context = "Cinematic Background";
        if (lower.includes("casino")) context = "Casino interior";
        else if (lower.includes("highway")) context = "Highway";

        // Append Continuity & Bridge
        if (bridgeContext) context += ` ${bridgeContext}`;
        if (continuityNotes) context += ` ${continuityNotes}`;

        // 5. NEGATIVE
        let negativeConstraints = "text, watermark, blurry";

        const optimizedAction = optimizeTokens(concreteText);

        return {
            subject: weightedName,
            action: optimizedAction,
            env: context,
            lighting: `Lighting: ${colorGrade}`,
            camera: cameraFinal,
            mood,
            filmStock,
            negativeConstraints,
            motionBucket: 5
        };
    }

    const modelSpecs = {
        'nano-storyboard': {
            name: 'NANO_BANANA_PRO (STORYBOARD)', type: 'grid',
            format: (data) => `DIRECTIVE: 3x3 storyboard for ${data.action}.\nSUBJECT: ${data.subject}.\nSCENE: ${data.env}.\nLOOK: ${data.lighting}, ${data.camera.desc}.`
        },
        'veo3': {
            name: 'GOOGLE_VEO_3.1', type: 'video',
            format: (data) => `(Cinematic, 8k) [SCENE]: ${data.action} [CONTEXT]: ${data.env} [LIGHTING]: ${data.lighting} (Camera: ${data.camera.desc}) ${data.filmStock} --no ${data.negativeConstraints}`
        },
        'kling-o1': {
            name: 'KLING_PRO_1.6', type: 'video',
            format: (data) => `[Action]: ${data.action}. [Subject]: ${data.subject} in ${data.env}. [Look]: ${data.lighting}. [Cam]: ${data.camera.desc}. --camera_control enabled`
        },
        'runway-gen4': {
            name: 'RUNWAY_GEN_4', type: 'video',
            format: (data) => `${data.action} [Details]: ${data.subject} in ${data.env}. [Style]: ${data.lighting}, ${data.camera.desc}. --motion_bucket ${data.motionBucket}`
        }
    };

    function processScene(rawText, modelId, index, bridge = "", continuity = "") {
        const analysis = analyzeText(rawText, bridge, continuity);
        const model = modelSpecs[modelId] || modelSpecs['veo3'];
        return {
            id: index + 1,
            label: model.name,
            optimized: model.format(analysis),
            raw: rawText
        };
    }

    // UI INIT
    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const terminalOutput = document.getElementById('terminal-output');
    const modelSelect = document.getElementById('model-select');

    function init() {
        if (modelSelect) {
            modelSelect.innerHTML = '';
            Object.keys(modelSpecs).forEach(k => {
                const opt = document.createElement('option');
                opt.value = k;
                opt.textContent = modelSpecs[k].name;
                modelSelect.appendChild(opt);
            });
        }
    }
    init();

    if (generateBtn) {
        generateBtn.replaceWith(generateBtn.cloneNode(true));
        document.getElementById('generate-btn').addEventListener('click', () => {
            const text = promptInput.value;
            // SCENE BUILDER LOGIC (Active Continuity)
            const storyState = new StoryState(text);
            const continuityTracker = new ContinuityTracker();

            terminalOutput.innerHTML = '';

            let previousSceneText = "";

            storyState.scenes.forEach((scene, i) => {
                // 1. Generate Bridge
                let bridge = "";
                if (i > 0) {
                    const lastWords = previousSceneText.slice(-50).replace(/\s+/g, ' ').trim();
                    bridge = `[BRIDGE]: Action flows from previous scene ("...${lastWords}").`;
                }

                // 2. Inject Continuity
                // We don't inject *into* the tracker here, we ASK the tracker for current state prompt
                const continuityNote = continuityTracker.injectIntoPrompt("").replace("", "").trim();
                // Result is "[Story State]: Time: Morning | Alex: injured"

                // 3. Process
                const res = processScene(scene, modelSelect.value, i, bridge, continuityNote);

                // 4. Update Tracker for NEXT scene
                continuityTracker.updateFromScene(scene);
                previousSceneText = scene;

                // Render
                const div = document.createElement('div');
                div.className = 'prompt-block';
                div.innerHTML = `<div class="prompt-header"><span class="prompt-id">#${res.id}</span><span class="prompt-label">${res.label}</span></div><div class="prompt-content">${res.optimized}</div>`;
                terminalOutput.appendChild(div);
            });
        });
    }

});
