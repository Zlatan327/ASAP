/**
 * ASAP - LOGIC CORE 5.0 (VISUAL DIRECTOR EDITION)
 * Includes: Visual Translator, Variable Isolation, Scene Manager, Token Economy, Smart Negation
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. VISUAL DIRECTOR KNOWLEDGE BASE
    // ==========================================

    // Initialize Skills (loaded via index.html)
    const visualTranslator = new window.VisualTranslator();
    const tokenOptimizer = new window.TokenOptimizer();
    const styleManager = new window.StyleManager();
    const cameraDirector = new window.CameraDirector ? new window.CameraDirector() : null;
    const detailInjector = new window.DetailInjector ? new window.DetailInjector() : null;
    const audioEngineer = new window.AudioEngineer ? new window.AudioEngineer() : null;
    const sceneInferrer = new window.SceneInferrer ? new window.SceneInferrer() : null;

    // Legacy Support for Visual Dictionary (can be moved to a skill later)
    const visualDictionary = {
        "soldier": "Character Reference: [Soldier]. Male, 25 years old, square jaw, buzz cut, blue eyes, sweat and mud on face, dirty green fatigues",
        "enforcer": "Character Reference: [Enforcer]. 7ft tall robot, single glowing red eye slit, white carbon-fiber armor, battle damage on chest plate",
        "runner": "Character Reference: [Runner]. Female, 20s, neon blue bob hair, holographic visor over eyes, black techwear jacket, glowing tattoos on neck"
    };

    // ==========================================
    // 1. LOGIC CORE & DIRECTOR'S TABLE
    // ==========================================

    const techSpecs = {
        stocks: {
            "gritty": "Kodak Vision3 500T 5219 (Heavy Grain)",
            "noir": "Kodak Tri-X 400 (B&W High Contrast)",
            "scifi": "Fujifilm Eterna 500T (Cool Teals/Greens)",
            "natural": "Kodak Vision3 250D (Fine Grain, Warm)",
            "vintage": "Kodachrome 64 (Vibrant, Saturated)"
        }
    };

    function analyzeText(text, context) {
        // SKILL 1: VISUAL TRANSLATION (Abstract -> Concrete)
        const concreteText = visualTranslator.translate(text);
        const lower = concreteText.toLowerCase();

        // 0. CREATIVE AMPLIFIER 
        const stylePreset = document.getElementById('style-preset') ? document.getElementById('style-preset').value : 'cinematic';

        // 1. EXTRACT SUBJECT & ATTRIBUTES (Entity Encapsulation)
        // We use a temporary StoryState just for this snippet to get local entities
        const quickState = new window.StoryState(concreteText);
        let name = "The Protagonist";
        let attributes = "";

        if (quickState.characters.length > 0) {
            const charData = quickState.characters[0];
            name = charData.name;
            // Lookup visual dictionary first
            const dictDef = quickState.getCharacterVisuals(name, visualDictionary);
            if (dictDef) {
                attributes = dictDef;
            } else if (charData.attributes.length > 0) {
                attributes = charData.attributes.join(', ');
            }
        }

        // SKILL 4: TOKEN ECONOMY (Subject Weighting)
        // If we found a character, weight them. If we found attributes, bind them.
        let subjectToken = name;
        if (attributes) {
            subjectToken = `(${name}:1.2) [${attributes}]`;
        } else {
            subjectToken = `(${name}:1.2)`;
        }

        // 2. DETECT MOOD & MATCH FILM STOCK
        let mood = quickState.genre || "cinematic";
        let filmStock = techSpecs.stocks["natural"];

        // FORCE STYLE OVERRIDE (Fix for User Request)
        // If user selects a specific non-cinematic style, we override the auto-detection
        if (stylePreset === 'anime') {
            mood = 'anime';
            filmStock = "High-quality 2D Animation, vibrant colors, cel-shaded";
        } else if (stylePreset === 'digital') {
            mood = 'digital';
            filmStock = "Unreal Engine 5 Render, Octane Render, 3D masterpiece";
        } else if (stylePreset === 'raw') {
            mood = 'raw';
            filmStock = "Raw Footage, handheld, uncolorgraded, GoPro aesthetic";
        } else {
            // Default "Cinematic" behavior - rely on text analysis
            if (mood === 'horror' || lower.match(/scary|dark|fear/)) { filmStock = techSpecs.stocks["gritty"]; }
            else if (mood === 'romance' || lower.match(/happy|love/)) { filmStock = techSpecs.stocks["vintage"]; }
            else if (mood === 'scifi' || lower.match(/cyber|future/)) { filmStock = techSpecs.stocks["scifi"]; }
            else if (mood === 'noir') { filmStock = techSpecs.stocks["noir"]; }
        }

        // [DIRECTOR'S TABLE] - COLORIST
        const colorGrades = {
            "cinematic": "Teal and Orange color theory, deep blacks",
            "anime": "Vibrant, clean lines, high saturation",
            "digital": "Ray-traced lighting, global illumination",
            "raw": "Natural lighting, overexposed highlights",
            "sad": "Cool blue desaturated palette, muted tones",
            "horror": "High contrast, crushed blacks, sickly green palette",
            "romance": "Warm golden hour hues, vibrant saturation",
            "scifi": "Neon accents, deep blues and magentas",
            "noir": "High contrast black and white, chiaroscuro lighting",
            "western": "Warm amber dust, harsh sunlight"
        };
        const colorGrade = colorGrades[mood] || colorGrades["cinematic"];

        // BRIDGE: Beech's Lab Style Recipes
        // If the selected style has a specific description (recipe), we override the film stock/lighting
        const recipeDesc = styleManager.getStyleDescription(stylePreset);
        if (recipeDesc) {
            filmStock = recipeDesc;
        }

        // 3. DETECT CAMERA & LENS (MOTIVATED) - BEECH'S LAB UPGRADE
        // Use the new Camera Director Skill if available, else fallback provided manually (but we assume it loads)
        let cameraFinal = { name: "Standard", desc: "Stable shot." };
        let motionParams = { bucket: 5 };

        if (cameraDirector) {
            let shot = cameraDirector.determineShot(concreteText);
            // REFINE: Selfie Logic
            shot = cameraDirector.refineSelfie(concreteText, shot);

            const lens = cameraDirector.determineLens(shot.name, concreteText);
            const motion = cameraDirector.getMotionParams('veo3', concreteText); // Defaulting to VEO logic for params

            cameraFinal = {
                name: shot.name,
                desc: `${shot.desc} Lens: ${lens}.`
            };
            motionParams = motion;
        } else {
            // Fallback (Simple)
            cameraFinal = { name: "Wide", desc: "Wide angle shot." };
        }

        // SKILL 3: HIERARCHICAL SCENE INJECTION
        // Use the passed 'context' (Master Scene Location) -> Sub-beat
        let envContext = context || "Cinematic Background";
        // Override if we detect specific keywords locally
        if (lower.includes("casino")) envContext = "Casino interior, slot machines, green felt tables";

        // SKILL 5: STYLE-DEPENDENT NEGATION + ANTI-PLASTIC
        let negativeConstraints = styleManager.getNegatives(stylePreset);
        if (detailInjector) {
            negativeConstraints += " " + detailInjector.getNegative(true); // Always append anti-plastic for safety
        }

        // SKILL: DETAIL INJECTOR (Skin Enhancer)
        let details = "";
        if (detailInjector) {
            details = detailInjector.injectDetails(concreteText, name, cameraFinal);
        }

        // SKILL: AUDIO ENGINEER
        let audioPrompt = "";
        if (audioEngineer) {
            audioPrompt = audioEngineer.analyze(concreteText, mood);
        }

        // SKILL 4: TOKEN ECONOMY (Final Polish)
        // Optimize the action description
        const optimizedAction = tokenOptimizer.optimize(concreteText, [name]);

        // Combine Action + Details for the final prompt
        const finalAction = `${optimizedAction}${details}`;

        return {
            subject: subjectToken,
            action: finalAction,
            env: envContext,
            lighting: `Lighting: ${colorGrade}`,
            camera: cameraFinal,
            mood,
            filmStock,
            negativeConstraints,
            motionBucket: 5,
            audio: audioPrompt
        };
    }

    // ==========================================
    // 3. MODEL SPECS
    // ==========================================

    const modelSpecs = {
        'veo3': {
            name: 'GOOGLE_VEO_3.1',
            type: 'video',
            format: (data) => `(Cinematic, 8k) [SCENE]: ${data.action} [CONTEXT]: ${data.env} [LIGHTING]: ${data.lighting} [AUDIO]: ${data.audio} (Camera: ${data.camera.desc}) ${data.filmStock} --no ${data.negativeConstraints}`
        },
        'kling-o1': {
            name: 'KLING_PRO_1.6',
            type: 'video',
            format: (data) => `[Role: Director] [Action]: ${data.action}. [Subject]: ${data.subject} in ${data.env}. [Look]: ${data.lighting}. [Cam]: ${data.camera.desc}. --camera_control enabled --no ${data.negativeConstraints}`
        },
        'runway-gen4': {
            name: 'RUNWAY_GEN_4',
            type: 'video',
            format: (data) => `${data.action} [Details]: ${data.subject} in ${data.env}. [Style]: ${data.lighting}, ${data.camera.desc}. --motion_bucket ${data.motionBucket} --style_preset cinematic --no ${data.negativeConstraints}`
        },
        'luma-dream': {
            name: 'LUMA_DREAM_MACHINE',
            type: 'video',
            format: (data) => `[Abstract]: ${data.action}. [Morphing]: ${data.subject}. [Vibe]: ${data.mood}, ${data.lighting}. --no ${data.negativeConstraints}`
        }
    };

    // ==========================================
    // 4. UI & EXECUTION
    // ==========================================

    function processScene(sceneData, modelId, index) {
        // sceneData is { text, context, isMasterStart }
        const analysis = analyzeText(sceneData.text, sceneData.context);
        const model = modelSpecs[modelId] || modelSpecs['veo3'];

        return {
            id: index + 1,
            label: model.name,
            optimized: model.format(analysis),
            raw: sceneData.text,
            isMasterStart: sceneData.isMasterStart,
            context: sceneData.context
        };
    }

    // UI Handlers
    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const terminalOutput = document.getElementById('terminal-output');
    const modelSelect = document.getElementById('model-select');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-all-btn');

    function init() {
        if (modelSelect) {
            Object.keys(modelSpecs).forEach(k => {
                const opt = document.createElement('option');
                opt.value = k;
                opt.textContent = modelSpecs[k].name;
                modelSelect.appendChild(opt);
            });
        }
    }

    init();

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            promptInput.value = '';
            terminalOutput.innerHTML = '<div class="empty-state"><p>READY_FOR_SYNTHESIS...</p></div>';
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const text = Array.from(document.querySelectorAll('.prompt-content'))
                .map(el => el.textContent)
                .join('\n\n');
            navigator.clipboard.writeText(text);
            alert('All prompts copied to clipboard!');
        });
    }

    if (generateBtn) {
        // Clone to remove old listeners
        generateBtn.replaceWith(generateBtn.cloneNode(true));
        document.getElementById('generate-btn').addEventListener('click', () => {
            const text = promptInput.value;
            terminalOutput.innerHTML = '';

            // 1. STORY STATE ANALYSIS
            const storyState = new window.StoryState(text);

            // SKILL: SCENE INFERRER
            // If available, use it for smarter segmentation, otherwise fallback to StoryState
            let scenes = [];
            if (sceneInferrer) {
                const inferred = sceneInferrer.segment(text);
                // Map to format expected by processScene
                scenes = inferred.map((s, idx) => ({
                    text: s.text,
                    context: s.slugline, // Use Slugline as the context (e.g. "INT. KITCHEN - DAY")
                    isMasterStart: idx === 0 || s.location !== inferred[idx - 1]?.location
                }));
            } else {
                scenes = storyState.scenes; // Fallback
            }

            // 2. PROCESS SCENES
            scenes.forEach((scene, i) => {
                const res = processScene(scene, modelSelect.value, i);

                const div = document.createElement('div');
                div.className = 'prompt-block';
                if (res.isMasterStart) {
                    div.style.borderTop = "2px solid rgba(255, 165, 0, 0.5)";
                    div.style.marginTop = "20px";
                }

                const contextBadge = res.context !== "Unknown Location" ?
                    `<span class="tag" style="margin-left:auto; background:rgba(255,255,255,0.1)">📍 ${res.context}</span>` : '';

                div.innerHTML = `
                    <div class="prompt-header">
                        <span class="prompt-id">#${res.id}</span>
                        <span class="prompt-label">${res.label}</span>
                        ${contextBadge}
                    </div>
                    <div class="prompt-content">${res.optimized}</div>
                `;
                terminalOutput.appendChild(div);
            });
        });
    }

});
