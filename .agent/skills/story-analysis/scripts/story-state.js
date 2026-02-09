/**
 * Story State Manager
 * Unified story analysis for character, scene, and timeline extraction
 */

class StoryState {
    constructor(rawStory) {
        this.rawStory = rawStory;
        this.characters = this.extractCharacters();
        this.scenes = this.segmentScenes();
        this.genre = this.detectGenre();
    }

    /**
     * Entity Encapsulation: Extract characters with attributes
     * Looks for capitalized names and nearby descriptive adjectives
     */
    extractCharacters() {
        const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g;
        const matches = [...this.rawStory.matchAll(namePattern)];
        const characterMap = new Map();

        matches.forEach(match => {
            const name = match[1];
            if (this.isStopWord(name)) return;

            if (!characterMap.has(name)) {
                characterMap.set(name, {
                    name: name,
                    count: 0,
                    attributes: new Set(),
                    firstMentionIndex: match.index
                });
            }

            const charData = characterMap.get(name);
            charData.count++;

            // Look for adjectives before the name (e.g. "lazy Detective")
            // Simple check: look at preceding 3 words
            const preContext = this.rawStory.substring(Math.max(0, match.index - 30), match.index);
            const adjMatch = preContext.match(/\b(lazy|angry|sad|happy|old|young|rich|poor|tall|short|dark|bright)\b/gi);
            if (adjMatch) {
                adjMatch.forEach(adj => charData.attributes.add(adj.toLowerCase()));
            }
        });

        // Convert Map to array and filter weak matches
        return Array.from(characterMap.values())
            .filter(c => c.count > 1 || this.isLikelyCharacter(c.name))
            .map(c => ({
                name: c.name,
                attributes: Array.from(c.attributes),
                description: Array.from(c.attributes).join(' ') + ' ' + c.name
            }))
            .slice(0, 5);
    }

    isStopWord(word) {
        const stops = ['The', 'A', 'An', 'In', 'On', 'At', 'To', 'For', 'Of', 'By', 'With', 'Then', 'Suddenly', 'Meanwhile'];
        return stops.includes(word);
    }

    isLikelyCharacter(name) {
        const characterContexts = [
            new RegExp(`${name}\\s+(said|says|walks|runs|looks|enters|exits|sat|stood|was)`, 'i'),
            new RegExp(`(Mr\\.|Mrs\\.|Dr\\.|Miss|Captain|Detective)\\s+${name}`, 'i')
        ];
        return characterContexts.some(pattern => pattern.test(this.rawStory));
    }

    /**
     * Hierarchical Scene Injection
     * Detects Master Scenes (Location changes) and Sub-beats (Actions within location)
     */
    segmentScenes() {
        const sentences = this.rawStory.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const scenes = [];

        // Transitions
        const temporal = /\b(then|next|after|later|soon|meanwhile|suddenly|finally)\b/gi;
        const locationKeys = /\b(room|hall|outside|inside|kitchen|street|park|office|basement|bedroom)\b/i;

        let currentMasterScene = {
            location: "Unknown Location",
            beats: []
        };
        let currentBeat = [];

        sentences.forEach((sentence) => {
            const trimmed = sentence.trim();
            const hasTemporalShift = temporal.test(trimmed);
            const locationMatch = trimmed.match(locationKeys);

            // Update initial location if unknown
            if (locationMatch && currentMasterScene.location === "Unknown Location") {
                currentMasterScene.location = locationMatch[0];
            }

            // New Master Scene if location changes significantly (and we ensure it's a NEW location)
            const isNewLocation = locationMatch &&
                currentMasterScene.location !== "Unknown Location" &&
                !currentMasterScene.location.toLowerCase().includes(locationMatch[0].toLowerCase());

            if (isNewLocation) {
                // Finish previous beat
                if (currentBeat.length > 0) {
                    currentMasterScene.beats.push(currentBeat.join('. ') + '.');
                }
                // Push previous master scene if it has content
                if (currentMasterScene.beats.length > 0) {
                    scenes.push(currentMasterScene);
                }

                // Start new master scene
                currentMasterScene = {
                    location: locationMatch[0],
                    beats: []
                };
                currentBeat = [trimmed];
            }
            // New Beat if temporal shift
            else if (hasTemporalShift && currentBeat.length > 0) {
                currentMasterScene.beats.push(currentBeat.join('. ') + '.');
                currentBeat = [trimmed];
            }
            else {
                currentBeat.push(trimmed);
            }
        });

        // Final cleanup
        if (currentBeat.length > 0) {
            currentMasterScene.beats.push(currentBeat.join('. ') + '.');
        }
        if (currentMasterScene.beats.length > 0) {
            scenes.push(currentMasterScene);
        }

        // Flatten for simple consumption but keep metadata
        // We return an array where each item is a "Cut" but it carries the Master Scene context
        const flatScenes = [];
        scenes.forEach(master => {
            master.beats.forEach(beat => {
                flatScenes.push({
                    text: beat,
                    context: master.location,
                    isMasterStart: master.beats.indexOf(beat) === 0
                });
            });
        });

        return flatScenes.length > 0 ? flatScenes : [{ text: this.rawStory, context: "Scene", isMasterStart: true }];
    }

    /**
     * Gets visually consistent description for a character
     * Uses the global registry if available
     */
    getCharacterDescription(name) {
        // Find in local extraction
        const localChar = this.characters.find(c => c.name === name);

        if (localChar) {
            const attributes = localChar.attributes.join(', ');
            return attributes ? `(${name}:1.2) [${attributes}]` : `(${name}:1.2)`;
        }
        // Fallback for non-extracted characters
        return `(${name}:1.2)`;
    }

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
        return (topGenre && topGenre[1] > 0) ? topGenre[0] : 'cinematic';
    }

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
if (typeof window !== 'undefined') {
    window.StoryState = StoryState;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StoryState };
}
