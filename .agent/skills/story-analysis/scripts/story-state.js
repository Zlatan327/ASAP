/**
 * Story State Manager
 * Unified story analysis for character, scene, and timeline extraction
 */

class StoryState {
    constructor(rawStory) {
        this.rawStory = rawStory;
        this.characters = this.extractCharacters();
        this.scenes = this.segmentScenes();
        this.timeline = { timeOfDay: null, location: null };
        this.genre = this.detectGenre();
    }

    /**
     * Extract character names using simple NER
     * Looks for capitalized words that appear multiple times
     */
    extractCharacters() {
        // Match capitalized names (first name or full name)
        const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g;
        const matches = [...this.rawStory.matchAll(namePattern)];

        // Count occurrences
        const nameCounts = {};
        matches.forEach(match => {
            const name = match[1];
            // Filter out common non-names
            const stopWords = ['The', 'A', 'An', 'In', 'On', 'At', 'To', 'For', 'Of', 'By', 'With'];
            if (!stopWords.includes(name)) {
                nameCounts[name] = (nameCounts[name] || 0) + 1;
            }
        });

        // Return names that appear more than once (likely characters)
        // Or single-occurrence names that are clearly character references
        return Object.entries(nameCounts)
            .filter(([name, count]) => count > 1 || this.isLikelyCharacter(name))
            .map(([name]) => name)
            .slice(0, 5); // Limit to top 5 characters
    }

    isLikelyCharacter(name) {
        // Check if name appears in common character contexts
        const characterContexts = [
            new RegExp(`${name}\\s+(said|says|walks|runs|looks|enters|exits)`, 'i'),
            new RegExp(`(Mr\\.|Mrs\\.|Dr\\.|Miss|Captain|Detective)\\s+${name}`, 'i')
        ];
        return characterContexts.some(pattern => pattern.test(this.rawStory));
    }

    /**
     * Segment story into logical scenes
     * Uses transition words and paragraph breaks
     */
    segmentScenes() {
        // Transition indicators
        const transitions = {
            temporal: /\b(then|next|after|later|soon|meanwhile|suddenly|now|finally|eventually)\b/gi,
            spatial: /\b(enters|leaves|arrives|moves to|goes to|walks to|drives to)\b/gi,
            narrative: /\b(cut to|fade to|dissolve to|switch to)\b/gi
        };

        // Split into sentences first
        const sentences = this.rawStory.split(/[.!?]+/).filter(s => s.trim().length > 0);

        const scenes = [];
        let currentScene = [];
        let lastTransitionType = null;

        sentences.forEach((sentence, index) => {
            const trimmed = sentence.trim();

            // Check for strong scene breaks
            const hasTemporalShift = transitions.temporal.test(trimmed) &&
                (trimmed.match(/later|after|meanwhile/i));
            const hasSpatialShift = transitions.spatial.test(trimmed);
            const hasNarrativeBreak = transitions.narrative.test(trimmed);

            // Break scene if:
            // 1. Strong transition detected
            // 2. Current scene has at least 2 sentences
            // 3. New paragraph detected (double break in original text)
            const shouldBreak = (hasTemporalShift || hasSpatialShift || hasNarrativeBreak) &&
                currentScene.length >= 2;

            if (shouldBreak && currentScene.length > 0) {
                scenes.push(currentScene.join('. ') + '.');
                currentScene = [trimmed];
            } else {
                currentScene.push(trimmed);
            }
        });

        // Add final scene
        if (currentScene.length > 0) {
            scenes.push(currentScene.join('. ') + '.');
        }

        // Ensure at least one scene
        return scenes.length > 0 ? scenes : [this.rawStory];
    }

    /**
     * Detect story genre based on keywords
     */
    detectGenre() {
        const genrePatterns = {
            noir: /detective|crime|murder|shadow|rain|fog|whiskey|gunshot/i,
            scifi: /robot|space|laser|cyber|neon|android|starship|quantum/i,
            western: /desert|cowboy|sheriff|saloon|horse|dusty|tumble/i,
            horror: /blood|scream|dark|ghost|creature|terror|nightmare|shadow/i,
            romance: /love|heart|kiss|embrace|tender|passion|longing/i,
            action: /explosion|fight|chase|weapon|combat|battle|punch/i,
            fantasy: /magic|dragon|wizard|spell|enchant|kingdom|quest/i
        };

        const scores = {};
        for (const [genre, pattern] of Object.entries(genrePatterns)) {
            const matches = this.rawStory.match(new RegExp(pattern, 'gi')) || [];
            scores[genre] = matches.length;
        }

        const topGenre = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
        return topGenre[1] > 0 ? topGenre[0] : 'cinematic';
    }

    /**
     * Get character description from visual dictionary
     */
    getCharacterVisuals(characterName, visualDictionary) {
        const lower = characterName.toLowerCase();
        for (const [key, description] of Object.entries(visualDictionary)) {
            if (lower.includes(key)) {
                return description;
            }
        }
        return null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StoryState };
}
