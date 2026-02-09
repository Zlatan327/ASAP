/**
 * Detail Injector Skill
 * Implements "Beech's Lab" Skin Enhancer and Anti-Plastic logic.
 * Automatically injects hyper-realism details for close-ups of human subjects.
 */

class DetailInjector {
    constructor() {
        this.skinEnhancer = `
INTRICATE FACIAL DETAILS (The Key Section):
SKIN: Visible vellus hair (peach fuzz) catches the light along the jawline and forehead. There is subtle, natural melanin variance and mottling across the cheeks, with slight redness around the nose. The skin exhibits subdermal vascularity (faint blue/green veins) visible beneath the thin skin of the temples and inner corners of the eyes.
EYES: The irises must show intense, complex iris striations and texture, with a natural crystalline gleam. The lower waterline is visibly wet and slightly reflective. There is faint capillary visibility (tiny red blood vessels) in the whites of the eyes (sclera) and corner of the nose.
LIPS: The lips are not smooth; they have a distinctly cracked, chapped, dry texture, with small vertical lines and peeling skin, catching light unevenly.
        `.trim();

        this.antiPlasticNegative = `
SKIN TEXTURE (Crucial Anti-Plastic): Skin must be highly textured, exhibiting stochastic noise and perceptible pores. Visible skin grain, not smooth or airbrushed. Emphasize micro-surface details and subtle topographical variations. Visible vellus hair (peach fuzz) catches the light at sharp angles. Slight, natural oiliness/sheen on the nose and forehead.
IMPERFECTIONS: Natural, uneven skin tone with clear melanin variance and minor redness. Subtly visible capillary visibility (tiny red vessels) and fine subdermal vascularity (blue/green veins) especially under the eyes and at the temples. A scattering of micro-freckles and subtle skin mottling.
LIPS & EYES: Lips are visibly dry, with a distinct cracked/chapped texture showing vertical lines and tiny flecks. The eyes feature intense iris striations, and the lower waterline is glistening and wet.
QUALITY REINFORCEMENT: 8k, highly detailed, macro photography, zero airbrushing, photorealistic skin, high-frequency detail, filmic grain.
        `.trim();
    }

    /**
     * Injects logic based on Subject and Shot Type
     */
    injectDetails(text, subject, shotType) {
        const lowerText = text.toLowerCase();
        const lowerSubject = subject.toLowerCase();

        // 1. Check if Human Subject (Heuristic)
        // We look for gendered terms, 'man', 'woman', 'person', 'hero'
        const isHuman = /man|woman|boy|girl|guy|lady|person|hero|protagonist|detective|soldier|face|eye|portrait/i.test(lowerSubject) ||
            /man|woman|boy|girl|guy|lady|person|hero|protagonist|detective/i.test(lowerText);

        // 2. Check if Close Up
        const isCloseUp = shotType.name.includes("Close") || shotType.name.includes("Portrait") || shotType.name.includes("Push In") || shotType.name.includes("Selfie");

        if (isHuman && isCloseUp) {
            return `\n${this.skinEnhancer}`;
        }
        return "";
    }

    getNegative(isHuman) {
        // Always return anti-plastic for human-centric generations if consistent with style
        // For now, we return it as a string to be appended
        return this.antiPlasticNegative;
    }
}

// Export
if (typeof window !== 'undefined') {
    window.DetailInjector = DetailInjector;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DetailInjector };
}
