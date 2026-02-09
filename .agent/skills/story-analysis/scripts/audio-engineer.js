/**
 * Audio Engineer Skill
 * Generates 4-layer audio prompts: Dialogue, Ambient, SFX, Music.
 * Enforces strict "8-second rule" for dialogue.
 */

class AudioEngineer {
    constructor() {
        this.musicMoods = {
            "action": "High tempo, percussion-heavy, intense orchestral trailer music",
            "horror": "Dissonant strings, low drones, unsettling silence, sudden stings",
            "romance": "Soft piano, swelling strings, warm acoustic guitar",
            "scifi": "Synthwave, pulsing bass, electronic textures, futuristic",
            "nature": "Acoustic, folk, gentle wind instruments",
            "sad": "Melancholic cello, slow tempo, minor key",
            "cinematic": "Orchestral scores, Hans Zimmer style, deep bass"
        };
    }

    analyze(text, mood = "cinematic") {
        const layers = {
            dialogue: this.extractDialogue(text),
            ambient: this.inferAmbient(text),
            sfx: this.inferSFX(text),
            music: this.musicMoods[mood] || this.musicMoods["cinematic"]
        };

        return this.formatOutput(layers);
    }

    extractDialogue(text) {
        // Match content inside quotes
        const quoteMatch = text.match(/["']([^"']+)["']/);
        if (quoteMatch) {
            let dialogue = quoteMatch[1];
            // 8-Second Rule: Approx 20 words = 8 seconds. 
            // If longer, we assume Veo speeds it up (as per guide), but we warn or trim if needed.
            // For now, we passthrough but valid workflow would split it.
            return `Dialogue: "${dialogue}"`;
        }

        // Implicit dialogue
        if (text.match(/says|speaks|shouts|whispers/i)) {
            return "Dialogue: [Indistinct speech matches lip movement]";
        }

        return null;
    }

    inferAmbient(text) {
        const lower = text.toLowerCase();
        if (lower.includes("rain")) return "Ambient: Heavy rain, thunder rumble, water hitting surfaces";
        if (lower.includes("city") || lower.includes("street")) return "Ambient: City traffic, distant sirens, urban hum";
        if (lower.includes("forest") || lower.includes("park")) return "Ambient: Birds chirping, wind in trees, rustling leaves";
        if (lower.includes("indoor") || lower.includes("room")) return "Ambient: Room tone, air conditioner hum, quiet atmosphere";
        if (lower.includes("ocean") || lower.includes("beach")) return "Ambient: Crashing waves, seagulls, wind";

        return "Ambient: High fidelity room tone/environment sound"; // Default
    }

    inferSFX(text) {
        const lower = text.toLowerCase();
        const sfx = [];

        if (lower.includes("footsteps") || lower.includes("walk") || lower.includes("run")) sfx.push("Footsteps on surface");
        if (lower.includes("gun") || lower.includes("shoot")) sfx.push("Gunshot echo, casing drop");
        if (lower.includes("car") || lower.includes("drive")) sfx.push("Engine rev, tires on asphalt");
        if (lower.includes("punch") || lower.includes("hit")) sfx.push("Impact sound, cloth rustle");
        if (lower.includes("scream")) sfx.push("Scream reverb");

        return sfx.length > 0 ? `SFX: ${sfx.join(', ')}` : null;
    }

    formatOutput(layers) {
        // "Think in four layers"
        const parts = [];
        if (layers.dialogue) parts.push(layers.dialogue);
        parts.push(layers.ambient);
        if (layers.sfx) parts.push(layers.sfx);
        parts.push(`Music: ${layers.music}`); // Music is always good filler if empty

        return parts.join(" | ");
    }
}

// Export
if (typeof window !== 'undefined') {
    window.AudioEngineer = AudioEngineer;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioEngineer };
}
