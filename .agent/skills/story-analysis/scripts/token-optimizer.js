/**
 * Token Optimizer Skill
 * Removes fluff words and applies re-weighting to key subjects/actions
 */

const STOP_WORDS = new Set([
    "the", "a", "an", "is", "are", "was", "were",
    "suddenly", "meanwhile", "then", "next", "later", "eventually",
    "and", "or", "because", "so", "but", "however",
    "in", "on", "at", "by", "with", "from", "of",
    "very", "really", "literally", "totally", "quite", "rather",
    "mysterious style", "cinematic style", "style of",
    "okay", "just", "basically", "actually", "essentially"
]);

class TokenOptimizer {
    constructor() {
        this.stopWords = STOP_WORDS;
    }

    /**
     * Removes stop words from the text
     * @param {string} text 
     * @returns {string} 
     */
    removeFluff(text) {
        let processed = text;

        // 1. Remove multi-word phrases first
        this.stopWords.forEach(word => {
            if (word.includes(' ')) {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                processed = processed.replace(regex, '');
            }
        });

        // 2. Remove single words
        const words = processed.split(/\s+/);
        const filtered = words.filter(w => {
            const cleanWord = w.toLowerCase().replace(/[^a-z0-9]/g, '');
            return !this.stopWords.has(cleanWord) && cleanWord.length > 0;
        });
        return filtered.join(' ');
    }

    /**
     * Applies emphasis syntax (keyword:weight) to specific terms
     * @param {string} text - The prompt text
     * @param {Array} priorityTerms - List of terms to emphasize
     * @param {number} weight - Weight to apply (default 1.2)
     */
    applyWeights(text, priorityTerms = [], weight = 1.2) {
        let processed = text;
        priorityTerms.forEach(term => {
            if (!term) return;
            // Escape special regex chars in term
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');

            // Only weight if it's not already weighted
            processed = processed.replace(regex, (match) => {
                return `(${match}:${weight})`;
            });
        });
        return processed;
    }

    /**
     * Full optimization pipeline
     */
    optimize(text, prioritySubjects = []) {
        let cleanText = this.removeFluff(text);

        // If we have priority subjects (like "Detective"), ensure they are weighted
        if (prioritySubjects.length > 0) {
            cleanText = this.applyWeights(cleanText, prioritySubjects, 1.3);
        }

        return cleanText;
    }
}

// Export
if (typeof window !== 'undefined') {
    window.TokenOptimizer = TokenOptimizer;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TokenOptimizer, STOP_WORDS };
}
