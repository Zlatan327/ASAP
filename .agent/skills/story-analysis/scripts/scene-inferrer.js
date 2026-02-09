/**
 * Scene Inferrer Skill
 * Intelligently breaks down long stories into distinct, shootable scenes.
 * Detects Sluglines, Temporal Shifts, and Dramatic Beats.
 */

class SceneInferrer {
    constructor() {
        // Relaxed regex: Matches start of line, allows text after newline
        this.sluglineRegex = /^(?:INT\.|EXT\.|INT\/EXT\.|I\/E\.|INTERIOR|EXTERIOR)\s+([A-Z0-9\s\-\.]+?)(?:\s-\s([A-Z0-9\s]+))?$/im;
        this.transitionRegex = /^(LATER|MEANWHILE|THE NEXT DAY|SUDDENLY|CUT TO:|DISSOLVE TO:|FADE IN:|FADE OUT:)/i;
        this.locationKeywords = ["room", "house", "park", "street", "kitchen", "office", "car", "forest", "beach", "city"];
    }

    /**
     * Segment text into scenes with context
     * @param {string} fullText 
     */
    segment(fullText) {
        // Split by double newlines to get paragraphs
        const rawBlocks = fullText.split(/\n\s*\n/);
        const scenes = [];

        let currentScene = {
            text: "",
            location: "Unknown Location",
            time: "Day",
            slugline: "EXT. UNKNOWN - DAY"
        };
        let isFirstScene = true;

        rawBlocks.forEach(block => {
            let trimmed = block.trim();
            if (!trimmed) return;

            // 1. Detect Explicit Slugline (Script Format)
            // Check if the block *starts* with a slugline line
            const lines = trimmed.split('\n');
            const firstLine = lines[0].trim();
            const slugMatch = firstLine.match(this.sluglineRegex);

            if (slugMatch) {
                // If we have content in current scene, push it before starting new one
                if (currentScene.text.length > 0) {
                    scenes.push({ ...currentScene });
                }

                // Start New Scene
                currentScene = {
                    text: "", // We will append the rest of the block below
                    location: slugMatch[1].trim(), // e.g., "KITCHEN"
                    time: slugMatch[2] ? slugMatch[2].trim() : "Day",
                    slugline: firstLine.toUpperCase()
                };

                // Remove the slugline from this block for the text body
                lines.shift();
                trimmed = lines.join('\n').trim();

                if (!trimmed) return; // If block was ONLY slugline, we are done with this block
            }

            // 2. Detect Narrative Transition (Prose Format)
            // "The next day, he walked..." -> New Scene
            if (this.transitionRegex.test(trimmed)) {
                if (currentScene.text.length > 0) {
                    scenes.push({ ...currentScene });
                }
                // Infer new context from this block
                const inferredCtx = this.inferContext(trimmed);
                currentScene = {
                    text: trimmed,
                    location: inferredCtx.location,
                    time: inferredCtx.time,
                    slugline: inferredCtx.slugline
                };
                return;
            }

            // 3. Detect Action/Location Shift (Heuristic)
            const inferredCtx = this.inferContext(trimmed);
            // If location changed significantly from current scene
            if (!isFirstScene && inferredCtx.location !== "Unknown Location" && inferredCtx.location !== currentScene.location) {
                if (currentScene.text.length > 0) {
                    scenes.push({ ...currentScene });
                }
                currentScene = {
                    text: trimmed,
                    location: inferredCtx.location,
                    time: inferredCtx.time,
                    slugline: inferredCtx.slugline
                };
                return;
            }

            // Append to current scene
            currentScene.text += (currentScene.text ? "\n\n" : "") + trimmed;

            // If this was the first block, we might update the initial context if it was generic
            if (isFirstScene && currentScene.location === "Unknown Location") {
                currentScene.location = inferredCtx.location;
                currentScene.time = inferredCtx.time;
                currentScene.slugline = inferredCtx.slugline;
            }
            isFirstScene = false;
        });

        // Push final scene
        if (currentScene.text.length > 0) {
            scenes.push({ ...currentScene });
        }

        return scenes;
    }

    /**
     * Infer context (Location/Time) from a text block
     */
    inferContext(text) {
        const lower = text.toLowerCase();
        let location = "Unknown Location";
        let time = "Day";

        // Location inference
        for (const loc of this.locationKeywords) {
            if (lower.includes(loc)) {
                location = loc.charAt(0).toUpperCase() + loc.slice(1);
                break;
            }
        }

        // Time inference
        if (lower.includes("night") || lower.includes("dark") || lower.includes("moon")) time = "Night";
        if (lower.includes("morning") || lower.includes("sunrise")) time = "Morning";
        if (lower.includes("sunset") || lower.includes("dusk")) time = "Evening";

        const prefix = (location === "Unknown Location" || location === "Park" || location === "Street" || location === "Forest") ? "EXT." : "INT.";

        return {
            location,
            time,
            slugline: `${prefix} ${location.toUpperCase()} - ${time.toUpperCase()}`
        };
    }
}

// Export
if (typeof window !== 'undefined') {
    window.SceneInferrer = SceneInferrer;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SceneInferrer };
}
