/**
 * Camera Director Skill
 * Advanced camera logic inspired by professional AI video workflows ("Beech's Lab")
 * Maps abstract motion concepts to concrete camera moves and model parameters.
 */

class CameraDirector {
    constructor() {
        this.cameraMoves = {
            // Basic Moves
            "feature": { name: "Static / Lock-off", keywords: ["still", "static", "locked"], desc: "Tripod lock-off, zero camera shake." },
            "pan": { name: "Pan", keywords: ["pan", "scan", "look across"], desc: "Smooth panning shot." },
            "tilt": { name: "Tilt", keywords: ["tilt", "look up", "look down"], desc: "Vertical tilt shot." },

            // Advanced / Cinematic Moves
            "push_in": { name: "Push In", keywords: ["push in", "zoom in", "closer"], desc: "Slow push-in towards subject (dolly in)." },
            "pull_out": { name: "Pull Out", keywords: ["pull out", "zoom out", "reveal", "away"], desc: "Slow pull-out to reveal environment (dolly out)." },
            "truck": { name: "Truck / Tracking", keywords: ["track", "follow", "walk with", "side"], desc: "Trucking shot (tracking sideways) parallel to subject." },
            "orbit": { name: "Orbit / Arc", keywords: ["orbit", "circle", "around", "rotate", "arc"], desc: "Orbital arc shot around the subject." },
            "hero": { name: "Low Angle Hero", keywords: ["hero", "power", "strong", "imposing"], desc: "Low angle, looking up at subject." },
            "overhead": { name: "God's Eye / Overhead", keywords: ["top down", "overhead", "bird's eye", "map"], desc: "Top-down overhead view (God's Eye)." },
            "handheld": { name: "Handheld / POV", keywords: ["shaky", "run", "chaos", "pov", "point of view"], desc: "Handheld camera movement, organic shake." },
            "crane": { name: "Crane / Jib", keywords: ["crane", "jib", "swoop", "fly"], desc: "Sweeping crane shot." },
            "roll": { name: "Camera Roll", keywords: ["roll", "spin", "dizzy", "turn"], desc: "Camera roll (Dutch angle rotation)." },
            "dolly_zoom": { name: "Dolly Zoom", keywords: ["vertigo", "dolly zoom", "warp"], desc: "Dolly Zoom (Zolly) effect. Background compression." },
            "boom": { name: "Boom Up/Down", keywords: ["boom", "lift", "drop", "elevator"], desc: "Vertical boom movement." }
        };

        this.lensTypes = {
            "wide": "16mm Wide Angle",
            "standard": "35mm Standard",
            "portrait": "85mm Portrait",
            "telephoto": "200mm Telephoto"
        };
    }

    /**
     * Applies specific selfie logical constraints
     */
    refineSelfie(text, currentShot) {
        if (text.toLowerCase().includes("selfie")) {
            return {
                name: "Selfie / POV",
                desc: "A selfie video of [subject], holding the camera at arm's length, arm visible in frame. High angle selfie perspective."
            };
        }
        return currentShot;
    }

    /**
     * Determines the best camera move based on text triggers
     * @param {string} text - The scene description
     * @returns {object} { name, desc, keywords }
     */
    determineShot(text) {
        const lower = text.toLowerCase();

        // Check manually defined moves first
        for (const key in this.cameraMoves) {
            const move = this.cameraMoves[key];
            if (move.keywords.some(k => lower.includes(k))) {
                return move;
            }
        }

        // Default logic if no specific move detected
        if (lower.includes("face") || lower.includes("expression")) return this.cameraMoves["push_in"];
        if (lower.includes("landscape") || lower.includes("city")) return this.cameraMoves["pull_out"];

        return this.cameraMoves["feature"]; // Default static/stable
    }

    /**
     * Estimates the lens based on shot type and content
     */
    determineLens(shotType, text) {
        if (text.includes("landscape") || text.includes("room")) return this.lensTypes["wide"];
        if (text.includes("face") || text.includes("eye")) return this.lensTypes["portrait"];
        return this.lensTypes["standard"];
    }

    /**
     * Returns model-specific motion parameters
     * @param {string} modelId 
     * @param {string} text 
     */
    getMotionParams(modelId, text) {
        const lower = text.toLowerCase();

        // Motion Intensity (1-10)
        let intensity = 5;
        if (lower.match(/run|fast|chase|fight|storm/)) intensity = 8;
        if (lower.match(/slow|calm|lock|stand|sleep/)) intensity = 2;

        const params = {
            bucket: intensity, // Gen-3/Gen-4
            cameraControl: ""  // Kling
        };

        const shot = this.determineShot(text);

        // Kling Camera Control Syntax (Example mapping)
        if (shot.name.includes("Pan")) params.cameraControl = "--camera_pan";
        if (shot.name.includes("Push")) params.cameraControl = "--camera_zoom 0.5";
        if (shot.name.includes("Pull")) params.cameraControl = "--camera_zoom -0.5";

        return params;
    }
}

// Export for usage
if (typeof window !== 'undefined') {
    window.CameraDirector = CameraDirector;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CameraDirector };
}
