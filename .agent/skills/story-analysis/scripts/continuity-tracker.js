/**
 * Continuity Tracker
 * Maintains visual state across scenes for consistent storytelling
 */

class ContinuityTracker {
    constructor() {
        this.state = {
            characters: {}, // { "Alex": { appearance: "...", injuries: [], props: [] } }
            environment: {
                timeOfDay: null,    // morning, afternoon, evening, night
                weather: null,      // sunny, rainy, snowy, etc.
                location: null,     // current location
                lighting: null      // lighting condition
            },
            objects: [],           // Persistent props that should appear
            history: []            // Track what happened in previous scenes
        };
    }

    /**
     * Update state based on scene content
     */
    updateFromScene(sceneText) {
        const lower = sceneText.toLowerCase();

        // Track time changes
        this.updateTimeOfDay(lower);

        // Track weather
        this.updateWeather(lower);

        // Track location
        this.updateLocation(sceneText);

        // Track character actions and state changes
        this.updateCharacterState(sceneText);

        // Track persistent objects
        this.updateObjects(sceneText);

        // Add to history
        this.history.push({
            text: sceneText.substring(0, 100), // First 100 chars
            timestamp: Date.now()
        });
    }

    updateTimeOfDay(lowerText) {
        const timePatterns = {
            morning: /\b(morning|dawn|sunrise|breakfast)\b/,
            afternoon: /\b(afternoon|midday|lunch)\b/,
            evening: /\b(evening|dusk|sunset|dinner)\b/,
            night: /\b(night|midnight|dark|darkness falls)\b/
        };

        for (const [time, pattern] of Object.entries(timePatterns)) {
            if (pattern.test(lowerText)) {
                this.state.environment.timeOfDay = time;
                break;
            }
        }
    }

    updateWeather(lowerText) {
        const weatherPatterns = {
            rain: /\b(rain|raining|rainy|downpour|drizzle)\b/,
            snow: /\b(snow|snowing|snowy|blizzard)\b/,
            storm: /\b(storm|thunder|lightning)\b/,
            fog: /\b(fog|foggy|mist|misty)\b/,
            sunny: /\b(sun|sunny|clear sky|bright)\b/
        };

        for (const [weather, pattern] of Object.entries(weatherPatterns)) {
            if (pattern.test(lowerText)) {
                this.state.environment.weather = weather;
                break;
            }
        }
    }

    updateLocation(sceneText) {
        // Look for location indicators
        const locationPattern = /\b(enters|arrives at|walks into|drives to)\s+(?:the\s+)?([a-z\s]+)/i;
        const match = sceneText.match(locationPattern);

        if (match) {
            this.state.environment.location = match[2].trim();
        }
    }

    updateCharacterState(sceneText) {
        // Track injuries
        const injuryPatterns = [
            { pattern: /(\w+)\s+(?:cuts|cut)\s+(?:his|her|their)\s+(\w+)/, type: 'cut' },
            { pattern: /(\w+)\s+(?:breaks|broke)\s+(?:his|her|their)\s+(\w+)/, type: 'broken' },
            { pattern: /(\w+)\s+(?:is|gets)\s+(?:shot|stabbed|wounded)/, type: 'wounded' },
            { pattern: /(\w+)\s+(?:bleeds|bleeding)/, type: 'bleeding' }
        ];

        injuryPatterns.forEach(({ pattern, type }) => {
            const match = sceneText.match(pattern);
            if (match) {
                const character = match[1];
                if (!this.state.characters[character]) {
                    this.state.characters[character] = { injuries: [], props: [] };
                }

                const injury = type === 'cut' || type === 'broken'
                    ? `${type} ${match[2] || 'injury'}`
                    : type;

                if (!this.state.characters[character].injuries.includes(injury)) {
                    this.state.characters[character].injuries.push(injury);
                }
            }
        });
    }

    updateObjects(sceneText) {
        // Track important objects that are introduced
        const objectPattern = /\b(?:a|an|the)\s+(red|blue|green|black|white|old|new|broken)\s+(\w+)/gi;
        const matches = [...sceneText.matchAll(objectPattern)];

        matches.forEach(match => {
            const object = `${match[1]} ${match[2]}`.toLowerCase();
            // Only add distinctive objects (with adjectives)
            if (!this.state.objects.includes(object)) {
                this.state.objects.push(object);
            }
        });

        // Keep only last 5 objects to avoid clutter
        if (this.state.objects.length > 5) {
            this.state.objects = this.state.objects.slice(-5);
        }
    }

    /**
     * Inject continuity information into prompt
     */
    injectIntoPrompt(basePrompt) {
        const continuityNotes = [];

        // Add environment persistence
        if (this.state.environment.timeOfDay) {
            continuityNotes.push(`Time: ${this.state.environment.timeOfDay}`);
        }

        if (this.state.environment.weather) {
            continuityNotes.push(`Weather: ${this.state.environment.weather}`);
        }

        // Add character state
        for (const [char, data] of Object.entries(this.state.characters)) {
            if (data.injuries.length > 0) {
                continuityNotes.push(`${char}: ${data.injuries.join(', ')}`);
            }
        }

        // Add persistent objects
        if (this.state.objects.length > 0) {
            continuityNotes.push(`Visible objects: ${this.state.objects.join(', ')}`);
        }

        if (continuityNotes.length === 0) {
            return basePrompt;
        }

        return `${basePrompt}\n\n[CONTINUITY]: ${continuityNotes.join(' | ')}`;
    }

    /**
     * Format state for debugging
     */
    formatState() {
        return JSON.stringify(this.state, null, 2);
    }

    /**
     * Reset tracker for new story
     */
    reset() {
        this.state = {
            characters: {},
            environment: { timeOfDay: null, weather: null, location: null, lighting: null },
            objects: [],
            history: []
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ContinuityTracker };
}
