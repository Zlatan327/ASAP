/**
 * Style Manager Skill
 * Manages negative prompts and style constraints based on selected aesthetic.
 * Includes "Beech's Lab" Visual Recipes.
 */

class StyleManager {
    constructor() {
        this.presets = {
            "cinematic": {
                neg: "cartoon, anime, 3d render, flat lighting, low resolution, watermark, text, bad anatomy, ugly, low quality, pixelated",
                desc: "Cinematic lighting, 8k resolution, photorealistic, depth of field"
            },
            "anime": {
                neg: "photorealistic, 3d render, unity, unreal engine, photograph, live action, western comic, sketch, rough lines, messy",
                desc: "High-quality 2D Animation, vibrant colors, clean lines, cel-shaded, anime style"
            },
            "digital": {
                neg: "photograph, film grain, noise, vintage, fuzzy, analog, rustic",
                desc: "Unreal Engine 5 Render, Octane Render, 3D masterpiece, ray tracing, global illumination"
            },
            "raw": {
                neg: "cgi, render, painting, drawing, cartoon, anime, illustration, 3d render, beauty filter, smooth skin, plastic, fake",
                desc: "Raw Footage, handheld, uncolorgraded, GoPro aesthetic, natural lighting, high dynamic range"
            },
            // BEECH'S LAB RECIPES
            "security": {
                neg: "hd, 4k, clean, cinematic, color graded, professional lighting, bokeh",
                desc: "Security camera footage. High-contrast, slightly grainy, low-fidelity security feed. CRT monitor texture. On-screen text overlays 'RECORDING IN PROGRESS', timestamp. Wide-angle lens distortion (bulbous foreground)."
            },
            "gta6": {
                neg: "low res, pixelated, real photo, film grain, noisy, blurry, low quality",
                desc: "GTA VI gameplay screenshot style. Hyper-realistic, high-fidelity graphics. Glossy textures, cinematic lighting, saturated colors. Third-person perspective. Cutting-edge game engine render."
            },
            "webcam": {
                neg: "hd, 4k, professional lighting, bokeh, sharp, clean, modern",
                desc: "MacBook Photo Booth webcam (mid 2000s). Wide-angle lens distortion, overexposed flash, muted green-tinted color cast. Pixelated 'Photo Booth' UI overlay."
            },
            "film35": {
                neg: "digital, crisp, clean, noise-free, modern, hdr, 4k",
                desc: "Fujifilm 35mm film photo. Flash photography, prominent film grain. Muted, desaturated palette with subtle filmic warmth, analog aesthetic."
            },
            "iphone3g": {
                neg: "sharp, 4k, hdr, vibrant, modern, high resolution, clean, professional",
                desc: "Original iPhone 3G photo (late 2000s). Low resolution (640x480), soft/blurry, digital noise. Limited dynamic range, crushed blacks. Muted/dull colors, cool/greenish tint. Chromatic aberration."
            },
            "vx1000": {
                neg: "hd, 4k, clean, steady, vibrant, modern, sharp, digital",
                desc: "Sony VX1000 camcorder footage. Fisheye lens (extreme barrel distortion, vignette). Low-resolution, interlacing artifacts, fuzzy. Washed-out colors. Harsh natural lighting."
            },
            "csgo": {
                neg: "third person, movie, cinema, realistic photo, live action",
                desc: "CS:GO First-Person Perspective (FPP). FPS HUD (health, ammo, map). Realistic game textures, Dust II environment. Weapon viewmodel in foreground. Source Engine aesthetic."
            }
        };
    }

    /**
     * Get negative prompt string for a given style
     */
    getNegatives(styleKey = 'cinematic') {
        const preset = this.presets[styleKey] || this.presets["cinematic"];
        return preset.neg;
    }

    /**
     * Get style-specific visual description/recipe
     */
    getStyleDescription(styleKey) {
        const preset = this.presets[styleKey];
        return preset ? preset.desc : "";
    }
}

// Export
if (typeof window !== 'undefined') {
    window.StyleManager = StyleManager;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StyleManager };
}
