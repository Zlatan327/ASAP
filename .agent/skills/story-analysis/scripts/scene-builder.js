/**
 * Scene Builder Skill
 * Orchestrates multi-scene generation, ensuring narrative continuity.
 * Uses ContinuityTracker to inject state from previous scenes into current prompts.
 */

class SceneBuilder {
    constructor(continuityTracker) {
        this.continuityTracker = continuityTracker;
    }

    /**
     * Build a sequence of prompts from inferred scenes
     * @param {Array} scenes - Objects { text, location, time, slugline }
     * @returns {Array} - Enriched scene objects ready for processing
     */
    build(scenes) {
        // Reset continuity for a new story
        this.continuityTracker.reset();

        const enrichedScenes = scenes.map((scene, index) => {
            // 1. Get Context from Previous Scenes (if not first)
            let bridgeContext = "";
            let continuityNote = "";

            if (index > 0) {
                const prevScene = scenes[index - 1];

                // Bridge: Explicitly link action flow
                const lastFewWords = prevScene.text.slice(-50).trim();
                bridgeContext = `[BRIDGE]: Action flows directly from previous scene ending: "...${lastFewWords}".`;

                // Continuity: Inject persistent state (injuries, weather, etc.)
                // We ask the tracker what is currently active
                continuityNote = this.continuityTracker.injectIntoPrompt("");
                // formatted as "[CONTINUITY]: ..." by the tracker if state exists
            }

            // 2. Update Tracker with CURRENT Scene's content
            // (So it's available for the NEXT scene)
            this.continuityTracker.updateFromScene(scene.text);

            // 3. Return Enriched Scene Data
            // We append the context to the text so the main prompt logic sees it
            // but we keep it structured so we can style it if needed
            return {
                ...scene,
                bridge: bridgeContext,
                continuity: continuityNote,
                isMasterStart: scene.isMasterStart // Preserved from Inferrer
            };
        });

        return enrichedScenes;
    }
}

// Export
if (typeof window !== 'undefined') {
    window.SceneBuilder = SceneBuilder;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SceneBuilder };
}
