/**
 * Visual Translator Skill
 * Maps abstract concepts to concrete visual descriptions
 */

const ABSTRACT_SYMBOL_DB = {
    // Emotions
    "lazy": "slouched posture, unkempt clothing, sleeping in daytime, piles of trash, stain on shirt",
    "angry": "clenched fists, red face, veins popping on neck, shouting, aggressive stance, spittle flying",
    "sad": "slumped shoulders, head down, eyes red and puffy, tears tracking through dust, isolation, rainy window",
    "happy": "wide smile, crinkled eyes, bouncing step, open arms, warm glowing expression, sunlight",
    "fear": "wide eyes, trembling hands, pale skin, sweat beads, backing away, cornered",
    "confused": "furrowed brow, tilted head, scratching head, squinting eyes, mouth slightly open",

    // Ages / Archetypes
    "old": "deep wrinkles, sunspots, thinning hair, clouded eyes, trembling hands, weathered skin, cane",
    "young": "smooth skin, bright clear eyes, energetic posture, fresh face, unblemished, running",
    "rich": "silk suit, gold watch, polished shoes, manicured hands, sneering expression, chauffeur, velvet",
    "poor": "ragged clothes, dirt smudges, worn-out shoes, hollow cheeks, desperate eyes, fingerless gloves",

    // Atmospheres
    "messy": "overflowing trash, clothes scattered on floor, unmade bed, dust motes, cluttered surfaces, pizza boxes",
    "clean": "pristine surfaces, sparkling glass, aligned objects, minimal dust, fresh atmosphere, white marble",
    "chaos": "people running, debris flying, smoke filling air, blurred motion, panicked crowds, sirens",
    "peace": "still water, gentle breeze, soft light, motionless leaves, quiet atmosphere, hammock",
    "scary": "shadows stretching, flickering lightbulb, cobwebs, rustling in corner, cold breath fog",
    "magical": "floating particles, glowing runes, shimmering air, unnatural colors, levitating objects"
};

class VisualTranslator {
    constructor() {
        this.db = ABSTRACT_SYMBOL_DB;
    }

    /**
     * Replaces abstract words with concrete visual descriptions
     * @param {string} text - The input text
     * @returns {string} - The text with concrete descriptions
     */
    translate(text) {
        let processed = text;

        // Sort keys by length (descending) to avoid partial matches interfering (though strictly mostly single words here)
        const keys = Object.keys(this.db).sort((a, b) => b.length - a.length);

        for (const abstract of keys) {
            const concrete = this.db[abstract];
            // Match whole words only, case insensitive
            const regex = new RegExp(`\\b${abstract}\\b`, 'gi');
            if (regex.test(processed)) {
                processed = processed.replace(regex, `${abstract} (${concrete})`);
            }
        }
        return processed;
    }

    /**
     * Get the concrete description for a specific concept
     */
    lookup(concept) {
        return this.db[concept.toLowerCase()] || null;
    }
}

// Export
if (typeof window !== 'undefined') {
    window.VisualTranslator = VisualTranslator;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VisualTranslator, ABSTRACT_SYMBOL_DB };
}
