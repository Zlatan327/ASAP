/**
 * ASAP - LOGIC CORE 4.0 (DIRECTOR'S CUT + MULTI-SHOT)
 * Includes: Cinematic Engine, Storyboard Mode, JSON Output, Creative Amplifier, Face Lock, Multi-Shot Cuts
 */


document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. STORY ANALYSIS SKILL (Advanced NLP)
    // ==========================================

    // StoryState: Unified character/scene extraction
    class StoryState {
        constructor(rawStory) {
            this.rawStory = rawStory;
            this.characters = this.extractCharacters();
            this.scenes = this.segmentScenes();
            this.timeline = { timeOfDay: null, location: null };
            this.genre = this.detectGenre();
        }

        extractCharacters() {
            const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g;
            const matches = [...this.rawStory.matchAll(namePattern)];
            const nameCounts = {};
            matches.forEach(match => {
                const name = match[1];
                const stopWords = ['The', 'A', 'An', 'In', 'On', 'At', 'To', 'For', 'Of', 'By', 'With'];
                if (!stopWords.includes(name)) {
                    nameCounts[name] = (nameCounts[name] || 0) + 1;
                }
            });
            return Object.entries(nameCounts)
                .filter(([name, count]) => count > 1 || this.isLikelyCharacter(name))
                .map(([name]) => name)
                .slice(0, 5);
        }

        isLikelyCharacter(name) {
            const characterContexts = [
                new RegExp(`${name}\\s+(said|says|walks|runs|looks|enters|exits)`, 'i'),
                new RegExp(`(Mr\\.|Mrs\\.|Dr\\.|Miss|Captain|Detective)\\s+${name}`, 'i')
            ];
            return characterContexts.some(pattern => pattern.test(this.rawStory));
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

            if (currentScene.length > 0) {
                scenes.push(currentScene.join('. ') + '.');
            }
            return scenes.length > 0 ? scenes : [this.rawStory];
        }

        detectGenre() {
            const genrePatterns = {
                noir: /detective|crime|murder|shadow|rain|fog/i,
                scifi: /robot|space|laser|cyber|neon|android/i,
                western: /desert|cowboy|sheriff|saloon|horse/i,
                horror: /blood|scream|dark|ghost|creature|terror/i,
                action: /explosion|fight|chase|weapon|combat|battle/i
            };
            const scores = {};
            for (const [genre, pattern] of Object.entries(genrePatterns)) {
                const matches = this.rawStory.match(new RegExp(pattern, 'gi')) || [];
                scores[genre] = matches.length;
            }
            const topGenre = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
            return topGenre[1] > 0 ? topGenre[0] : 'cinematic';
        }
    }

    // ContinuityTracker: State persistence across scenes
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

            // Time tracking
            if (/\b(morning|dawn|sunrise)\b/.test(lower)) this.state.environment.timeOfDay = 'morning';
            if (/\b(afternoon|midday)\b/.test(lower)) this.state.environment.timeOfDay = 'afternoon';
            if (/\b(evening|dusk|sunset)\b/.test(lower)) this.state.environment.timeOfDay = 'evening';
            if (/\b(night|midnight|darkness)\b/.test(lower)) this.state.environment.timeOfDay = 'night';

            // Weather tracking
            if (/\b(rain|raining)\b/.test(lower)) this.state.environment.weather = 'rain';
            if (/\b(snow|snowing)\b/.test(lower)) this.state.environment.weather = 'snow';
            if (/\b(fog|foggy)\b/.test(lower)) this.state.environment.weather = 'fog';

            // Injury tracking
            const injuryMatch = sceneText.match(/(\w+)\s+(?:cuts|cut|breaks|broke|wounds|wounded)/i);
            if (injuryMatch) {
                const char = injuryMatch[1];
                if (!this.state.characters[char]) this.state.characters[char] = { injuries: [] };
                this.state.characters[char].injuries.push('injured');
            }
        }

        injectIntoPrompt(basePrompt) {
            const notes = [];
            if (this.state.environment.timeOfDay) notes.push(`Time: ${this.state.environment.timeOfDay}`);
            if (this.state.environment.weather) notes.push(`Weather: ${this.state.environment.weather}`);
            for (const [char, data] of Object.entries(this.state.characters)) {
                if (data.injuries.length > 0) notes.push(`${char}: ${data.injuries.join(', ')}`);
            }
            return notes.length > 0 ? `${basePrompt}\n\n[Continuity]: ${notes.join(' | ')}` : basePrompt;
        }

        reset() {
            this.state = {
                characters: {},
                environment: { timeOfDay: null, weather: null, location: null },
                objects: []
            };
        }
    }


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

    // MOTIVATED CAMERA LOGIC (Object-Oriented)
    // Links specific actions+objects to specific camera movements
    const cameraMotivators = [
        {
            // "Looking at..." -> POV
            regex: /look(?:ing|s)? (?:at|towards|up at|down at) (?:the |a |an )?(\w+(?: \w+)?)/i,
            shot: "pov",
            descTemplate: (obj) => `First-Person POV Shot. The camera puts us in the subject's eyes, looking directly at the ${obj}. Focus on ${obj}.`
        },
        {
            // "Holding..." -> Insert/Close Up
            regex: /hold(?:ing|s)? (?:the |a |an )?(\w+(?: \w+)?)/i,
            shot: "closeup",
            descTemplate: (obj) => `Extreme Close-Up (Insert Shot) of the ${obj}. Macro lens details on the texture of the ${obj} in the subject's hand.`
        },
        {
            // "Talking to..." -> OTS
            regex: /talk(?:ing|s)? (?:to|with) (?:the |a |an )?(\w+(?: \w+)?)/i,
            shot: "ots",
            descTemplate: (obj) => `Over-The-Shoulder (OTS) Shot. Camera framed behind the subject, focused on ${obj} who is listening/reacting.`
        },
        {
            // "Punch/Hit..." -> Action Cam
            regex: /(?:punch|hit|strike|attack)(?:ing|s|ed)? (?:the |a |an )?(\w+(?: \w+)?)/i,
            shot: "pov",
            descTemplate: (obj) => `Dynamic Action Camera (SnorriCam). Shaky handheld movement following the impact on ${obj}. Motion blur.`
        },
        {
            // "Walking to..." -> Tracking
            regex: /(?:walk|run|mov)(?:ing|s|ed)? (?:towards|to) (?:the |a |an )?(\w+(?: \w+)?)/i,
            shot: "ews", // Using EWS slot for tracking often works well to show path
            descTemplate: (obj) => `Tracking Shot. The camera follows the subject from behind as they move towards the ${obj}. Establishing the distance.`
        }
    ];

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
--motion_bucket ${data.motionBucket} --style_preset cinematic --no ${data.negativeConstraints}
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

        // 1. EXTRACT SUBJECT (Enhanced with NER)
        let name = "The Protagonist";

        // Try to extract character from broader context if available
        if (text.split(' ').length > 15) {
            const quickState = new StoryState(text);
            if (quickState.characters.length > 0) {
                name = quickState.characters[0];
            }
        }

        // Fallback: matching specific dictionary keys for known archetypes
        if (name === "The Protagonist") {
            if (lower.includes("soldier")) name = "The Soldier";
            if (lower.includes("enforcer") || lower.includes("robot")) name = "The Enforcer";
            if (lower.includes("runner")) name = "The Runner";
        }

        // 2. DETECT MOOD & MATCH FILM STOCK
        let mood = "cinematic";
        let filmStock = techSpecs.stocks["natural"];

        if (lower.match(/sad|cry|tear|grief|loss/)) { mood = "sad"; filmStock = techSpecs.stocks["natural"]; }
        if (lower.match(/scary|dark|fear|ghost|horror|trap/)) { mood = "scary"; filmStock = techSpecs.stocks["gritty"]; }
        if (lower.match(/happy|laugh|smile|joy/)) { mood = "happy"; filmStock = techSpecs.stocks["vintage"]; }
        if (lower.match(/mysterious|secret|witch|magic/)) { mood = "mysterious"; filmStock = techSpecs.stocks["noir"]; }
        if (lower.match(/fight|run|chase|action|cyber/)) { mood = "tense"; filmStock = techSpecs.stocks["scifi"]; }

        // 3. DETECT CAMERA & LENS (MOTIVATED)
        let camera = cinematicShots["establishing"]; // Default
        let lensMatch = techSpecs.lenses["wide"];
        let cameraMotivated = false;

        // A. Priority: Check Motivated Camera Logic (Object-Oriented)
        for (const motivator of cameraMotivators) {
            const match = text.match(motivator.regex);
            if (match) {
                // Determine Object
                const obj = match[1];
                camera = {
                    name: cinematicShots[motivator.shot].name + ` [Focus: ${obj}]`,
                    desc: motivator.descTemplate(obj)
                };

                // Lens Logic
                if (motivator.shot === 'closeup') lensMatch = techSpecs.lenses["macro"];
                if (motivator.shot === 'ots') lensMatch = techSpecs.lenses["portrait"];
                if (motivator.shot === 'pov') lensMatch = techSpecs.lenses["wide"];

                cameraMotivated = true;
                break; // Stop at first strong motivation
            }
        }

        // B. Fallback: Keyword triggers if no specific motivation found
        if (!cameraMotivated) {
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
        }

        // 4. EXPAND VISUALS & DECODE NARRATIVE
        let visualTags = [];
        let envTags = [];
        let actionBeats = []; // For implicit narrative expansion
        let motionBucket = 5; // Default "Mid" motion
        let audioIntensity = 0; // 0-10 scale for synesthesia

        // A. Narrative Decoder
        for (const key in narrativeDecoder) {
            const regex = new RegExp(`\\b${key}\\b`, 'i');
            if (regex.test(lower)) {
                actionBeats.push(narrativeDecoder[key]);
                motionBucket += 2; // Implicit actions usually imply movement
            }
        }

        // B. Visual Dictionary & Synesthesia
        for (const key in visualDictionary) {
            if (lower.includes(key)) {
                if (key.match(/city|nature|messy|luxury|road|desert|arctic|cyberpunk|war/)) {
                    envTags.push(visualDictionary[key]);
                } else {
                    visualTags.push(visualDictionary[key]);
                }
                // Intensity Logic
                if (key.match(/run|fight|chase|argue|scream|storm|chaos/)) { motionBucket += 3; audioIntensity += 2; }
                if (key.match(/sleep|wait|stand|sit|sad|tired|calm/)) { motionBucket -= 2; }
            }
        }

        // C. Audio Synesthesia (Sound -> Visuals)
        // If sound text exists (e.g. "loud explosion"), inject visual intensity without user asking
        if (lower.match(/loud|scream|explosion|bang|crash|shout|thunder/)) {
            visualTags.push("camera shake, high contrast, motion blur, debris in air");
            motionBucket = 10; // Max motion
        }
        if (lower.match(/whisper|silence|quiet|soft|wind|hum/)) {
            visualTags.push("slow motion, stillness, dust particles floating, soft focus");
            motionBucket = 3; // Low motion
        }

        // Cap Motion Bucket (1-10)
        motionBucket = Math.max(1, Math.min(10, motionBucket));

        let visuals = visualTags.length > 0 ? visualTags.join(", ") : "highly detailed cinematic appearance";
        let narrativeBeats = null;

        if (actionBeats.length > 0) {
            // Store separately
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
            narrativeBeats,
            motionBucket
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
    const clearBtn = document.getElementById('clear-btn');

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

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                promptInput.value = '';
                promptInput.focus();
            });
        }
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

    // ==========================================
    // 5. GEMINI AGENT INTEGRATION
    // ==========================================

    const apiKeyInput = document.getElementById('gemini-api-key');
    const toggleKeyBtn = document.getElementById('toggle-key-visibility');
    const aiStatusIndicator = document.getElementById('ai-status-indicator');

    let geminiApiKey = localStorage.getItem('asap_gemini_key') || '';

    // Initialize Key State
    if (apiKeyInput) {
        apiKeyInput.value = geminiApiKey;
        updateAIStatus();

        apiKeyInput.addEventListener('input', (e) => {
            geminiApiKey = e.target.value.trim();
            localStorage.setItem('asap_gemini_key', geminiApiKey);
            updateAIStatus();
        });

        if (toggleKeyBtn) {
            toggleKeyBtn.addEventListener('click', () => {
                const type = apiKeyInput.getAttribute('type') === 'password' ? 'text' : 'password';
                apiKeyInput.setAttribute('type', type);
            });
        }
    }

    function updateAIStatus() {
        if (aiStatusIndicator) {
            if (geminiApiKey.length > 10) {
                aiStatusIndicator.classList.remove('hidden');
                generateBtn.querySelector('.btn-content').textContent = "GENERATE_WITH_GEMINI";
            } else {
                aiStatusIndicator.classList.add('hidden');
                generateBtn.querySelector('.btn-content').textContent = "Process Request";
            }
        }
    }

    async function callGemini(userStory, modelConfig) {
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

        // SYSTEM INSTRUCTION: Chain-of-Thought + Advanced Prompting (Story Fidelity Focused)
        const systemPrompt = `
ROLE:
You are a Hollywood Storyboard Artist and Logical Continuity Editor. Your goal is to translate stories into consecutive video prompts with ZERO hallucinations and 100% story fidelity.

OBJECTIVE:
Analyze the story. Break it down into a logical visual sequence (Scenes). Generate a JSON output.

CRITICAL RULES For "Story Fidelity":
1. [CHARACTER ANCHORING]: Describe characters EXACTLY as the story does. If a character is "wearing a red hat" in scene 1, they MUST wear it in scene 2. Do not invent traits.
2. [VISUAL CONTINUITY]: Objects and environment must persist. If a window breaks in Scene 2, it MUST remain broken in Scene 3.
3. [SHOT PROGRESSION]: Vary your camera angles logically. Start Wide to establish, move to Medium/Close-up for action/emotion. Do not repeat the same angle 3 times in a row.
4. [STORY ARC]: Your scenes must cover the ENTIRE story provided:
    - Beat 1: Inciting Incident / Setup
    - Beat 2...N: Rising Action / Conflict
    - Final Beat: Climax / Resolution
5. [NO NARRATIVE FLUFF]: Do NOT use phrases like "In this scene," "We see," "The story continues," or "The shot shows." Start DIRECTLY with the visual description.

PROCESS:
1. [ANALYZE]: Identify Characters, Setting, and Tone.
2. [SEGMENT]: Break story into 3-9 logical beats covering the FULL narrative arc.
3. [DRAFT]: Write the prompts using direct visual language.
4. [REVIEW]: Check against Critical Rules (Continuity & Progression).
5. [OUTPUT]: Final JSON.

PROMPT FORMULA:
[Camera/Angle] + [Subject (Anchored)] + [Action (Specific)] + [Environment (Detailed)] + [Lighting/Style (Story-Driven)]

EXAMPLES:

Input: "A robot finds a flower in a scrapyard."
Output:
[
  {
    "scene_id": 1,
    "prompt": "Wide establishing shot of a rust-colored scrapyard under a gray sky. Piles of twisted metal stretch to the horizon. A small, dented worker robot (rusty beige chassis, one blue eye) rolls slowly over debris. Melancholic atmosphere. Audio: Wind howling, crunching metal.",
    "camera": "Wide establishing shot",
    "subject": "Small worker robot (rusty beige, blue eye)",
    "action": "Rolling over debris",
    "context": "Rust-colored scrapyard, gray sky",
    "style": "Melancholic, realistic texture"
  },
  {
    "scene_id": 2,
    "prompt": "Close-up, low angle. The robot pauses. Its mechanical claw reaches down toward a single vibrant purple flower growing out of an oil stain. Contrast between the gray metal and the purple petals. Hopeful lighting. Audio: Servo whirring, silence.",
    "camera": "Close-up, low angle",
    "subject": "Worker robot's claw",
    "action": "Reaching for flower",
    "context": "Oil stain in scrapyard",
    "style": "High contrast, hopeful"
  }
]
`;

        // INJECT RICH CONTEXT
        const stylePreset = document.getElementById('style-preset').value;
        const ratio = selectedRatio;
        const modelName = modelConfig.name;

        // "Simulated" Search Context (Heuristic based on keywords)
        let searchContext = "";
        const lowerStory = userStory.toLowerCase();
        if (lowerStory.includes("sci-fi") || stylePreset === "digital") {
            searchContext = "Reference: Blade Runner 2049, Dune aesthetics, high-tech interfaces, neon lighting.";
        } else if (lowerStory.includes("horror") || stylePreset === "raw") {
            searchContext = "Reference: A24 Horror style, psychological tension, dark shadows, unsettling angles.";
        } else if (stylePreset === "anime") {
            searchContext = "Reference: Makoto Shinkai backgrounds, fluid animation, vibrant colors, emotional lighting.";
        }

        const userMessage = {
            contents: [{
                parts: [{
                    text: `
SYSTEM_INSTRUCTION: ${systemPrompt}

MODEL_OPTIMIZATION_GUIDE:
${typeof getModelOptimizationHints === 'function' ? getModelOptimizationHints(modelConfig.jsonType || 'veo3') : ''}

CONTEXT_DATA:
- Target Model: ${modelName}
- Style Hint: ${stylePreset} (Apply ONLY if consistent with story)
- Aspect Ratio: ${ratio}
- External References (Simulated): ${searchContext}

VISUAL_LIBRARY:
You have access to a rich Visual Dictionary for character archetypes and environments.
Use these descriptors for consistency:
${JSON.stringify(visualDictionary, null, 2).substring(0, 500)}... [truncated for brevity]

CHARACTER_EXTRACTION_HINT:
Look for capitalized proper nouns that appear multiple times or in character contexts (e.g., "Alex runs", "Dr. Martinez said").

USER_STORY:
"${userStory}"

INSTRUCTIONS:
1. Analyze the story and extract scenes using the StoryState logic (semantic segmentation, NER).
2. For EACH scene, generate a prompt optimized for ${modelName}.
3. **CRITICAL**: Tailor prompts to this model's STRENGTHS and AVOID its WEAKNESSES (see MODEL_OPTIMIZATION_GUIDE above).
4. Return ONLY valid JSON array of objects.
5. Each object: {"scene": "brief description", "prompt": "optimized prompt for ${modelName}"}

Example structure:
[
  {"scene": "Opening shot", "prompt": "..."},
  {"scene": "Character introduction", "prompt": "..."}
]
                    `
                }]
            }]
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userMessage)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error?.message || 'Gemini API Error');
            }

            const data = await response.json();
            const textResponse = data.candidates[0].content.parts[0].text;

            // Clean up code blocks if Gemini mimics them despite instructions
            const jsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);

        } catch (error) {
            console.error("Gemini Error:", error);
            throw error;
        }
    }

    // OVERRIDE GENERATE BUTTON FOR AI MODE
    if (generateBtn) {
        // Remove old listener to avoid double execution (cleanest way is cloning or just handling logic inside)
        // Since we are appending to the file, we need to be careful. 
        // Better approach: Modify the existing listener or create a unified handler.
        // For this patch, I will replace the main logic block in Step 4 instead of appending.

        // REPLACING ORIGINAL LISTENER LOGIC
        generateBtn.replaceWith(generateBtn.cloneNode(true));
        const newBtn = document.getElementById('generate-btn'); // Re-select

        newBtn.addEventListener('click', async () => {
            const text = promptInput.value.trim();
            if (!text) {
                promptInput.style.borderColor = 'red';
                setTimeout(() => promptInput.style.borderColor = '', 500);
                return;
            }

            // UI State
            const originalBtnText = newBtn.querySelector('.btn-content').textContent;
            newBtn.classList.add('disabled');
            terminalOutput.innerHTML = '<div class="empty-state"><p>INITIALIZING_AGENT...</p></div>';

            const sessionSeed = Math.floor(Math.random() * 1000000000);

            // DECISION: AI or LEGACY?
            if (geminiApiKey.length > 10 && activeMode === 'video') {
                // AI FLOW
                newBtn.querySelector('.btn-content').textContent = "GEMINI_THINKING...";

                try {
                    const modelConfig = modelSpecs[modelSelect.value] || modelSpecs['veo3'];
                    const scenes = await callGemini(text, modelConfig);

                    terminalOutput.innerHTML = ''; // Clear loading

                    scenes.forEach((scene, index) => {
                        const res = {
                            id: index + 1,
                            label: `${modelConfig.name} [GEMINI_AGENT]`,
                            optimized: isJsonMode ? JSON.stringify(scene, null, 2) : scene.prompt,
                            raw: text
                        };
                        renderResult(res);
                    });

                    // Save to history after all outputs rendered
                    if (typeof savePromptToHistory === 'function' && window._tempOutputs && window._tempOutputs.length > 0) {
                        savePromptToHistory(text, window._tempOutputs, modelConfig.name, styleSelect.value);
                        window._tempOutputs = []; // Reset
                    }

                } catch (error) {
                    terminalOutput.innerHTML = `<div class="prompt-block" style="color: var(--solar-crimson)"><p>⚠️ ERROR: ${error.message}</p><p>Falling back to Legacy Engine...</p></div>`;
                    setTimeout(() => {
                        runLegacyLogic(text, sessionSeed);
                    }, 2000);
                } finally {
                    newBtn.classList.remove('disabled');
                    newBtn.querySelector('.btn-content').textContent = originalBtnText;
                }

            } else {
                // LEGACY FLOW (No API Key or Restoration Mode)
                runLegacyLogic(text, sessionSeed);
            }
        });
    }

    // HELPER FUNCTIONS (Enhanced with Story Analysis Skill)
    function splitIntoScenes(text) {
        // Use StoryState for intelligent segmentation
        const storyState = new StoryState(text);
        return storyState.scenes;
    }

    function renderResult(res) {
        const div = document.createElement('div');
        div.className = 'prompt-block';
        div.innerHTML = `
        <div class="prompt-header">
            <span class="prompt-id">#${res.id}</span>
            <span class="prompt-label">${res.label}</span>
            <button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button>
        </div>
        <div class="prompt-content" style="white-space: pre-wrap;">${res.optimized}</div>
    `;
        terminalOutput.appendChild(div);

        // Save to history (if user signed in)
        if (typeof savePromptToHistory === 'function' && typeof getCurrentUser === 'function' && getCurrentUser()) {
            // Collect all rendered outputs to save together
            if (!window._tempOutputs) window._tempOutputs = [];
            window._tempOutputs.push(res);
        }
    }

    function runLegacyLogic(text, sessionSeed) {
        const originalBtnText = isJsonMode ? "COMPILING JSON..." : "DIRECTING...";
        // (Re-using original logic wrapper)
        setTimeout(() => {
            terminalOutput.innerHTML = '';
            let results = [];

            if (activeMode === 'video') {
                if (modelSelect.value === 'nano-storyboard') {
                    results.push(processScene(text, 'nano-storyboard', 0, isJsonMode, sessionSeed));
                } else {
                    if (isMultiShotMode && text.split(/\\n+/).length > 1) {
                        // ... (Original Multi-Shot Logic kept intact effectively by implicit availability of helper functions)
                        const segments = splitIntoScenes(text);
                        let combinedPrompt = "";
                        segments.forEach((seg, i) => {
                            const analysis = analyzeText(seg);
                            let cleanAction = analysis.action;
                            if (cleanAction.match(/^Shot \\d+:/i)) {
                                cleanAction = cleanAction.replace(/^Shot \\d+:\\s*/i, '');
                            }
                            const cameraLabel = cleanAction.match(/^\\[(.*?)\\]/) ? '' : `[${analysis.camera.name}] `;
                            const sequenceLabel = analysis.narrativeBeats ? ` (Sequence: ${analysis.narrativeBeats})` : '';
                            combinedPrompt += `Shot ${i + 1}: ${cameraLabel}${cleanAction}.${sequenceLabel} ${analysis.visuals}. \\n`;
                        });
                        const masterAnalysis = analyzeText(text);
                        combinedPrompt += `\\n[Consistent Environment]: ${masterAnalysis.env}. [Lighting]: ${masterAnalysis.lighting}. \\n(Continuous Shot Sequence, No Cuts).`;

                        if (isJsonMode) {
                            const model = modelSpecs[modelSelect.value] || modelSpecs['veo3'];
                            const payload = {
                                model_id: model.name,
                                prompt: combinedPrompt.trim(),
                                negative_prompt: masterAnalysis.negativeConstraints,
                                cfg_scale: 0.5,
                                aspect_ratio: selectedRatio || "16:9",
                                camera_control: { type: "Dynamic/Multi-Shot", lens: "Variable" },
                                seed: sessionSeed
                            };
                            results.push({ id: 1, label: `${model.name} [JSON] [MULTI-SHOT]`, optimized: JSON.stringify(payload, null, 2), raw: text });
                        } else {
                            results.push({ id: 1, label: `${modelSpecs[modelSelect.value].name} [MULTI-SHOT]`, optimized: combinedPrompt, raw: text });
                        }

                    } else {
                        const segments = splitIntoScenes(text);
                        const isSingleShot = segments.length === 1;
                        segments.forEach((seg, i) => {
                            const res = processScene(seg, modelSelect.value, i, isJsonMode, sessionSeed);
                            if (isSingleShot) res.label = res.label.replace('SEQ_001', 'SINGLE_SHOT');
                            results.push(res);
                        });
                    }
                }
            } else {
                results = optimizeRestoration(text);
            }

            results.forEach(res => renderResult(res));
            const btn = document.getElementById('generate-btn');
            if (btn) {
                btn.classList.remove('disabled');
                btn.querySelector('.btn-content').textContent = "Process Request"; // Reset to default
            }
        }, 500);
    }

    if (copyAllBtn) {
        copyAllBtn.addEventListener('click', () => {
            const all = document.querySelectorAll('.prompt-content');
            if (all.length === 0) return;
            const text = Array.from(all).map(d => d.innerText).join('\\n\\n');
            navigator.clipboard.writeText(text);
            copyAllBtn.style.color = '#10b981';
            setTimeout(() => copyAllBtn.style.color = '', 1000);
        });
    }

});

