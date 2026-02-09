/**
 * Model Optimization Skill
 * Capability profiles for video generation models
 * Guides prompt generation to leverage each model's strengths
 */

const MODEL_PROFILES = {
    'veo3': {
        name: 'Google VEO 3.1',
        strengths: ['cinematic-quality', 'photorealism', 'long-form-content', 'temporal-consistency', 'complex-camera-movements', 'narrative-coherence'],
        weaknesses: ['abstract-art', 'stylized-content', 'fast-generation-speed'],
        idealFor: ['narrative-films', 'documentaries', 'realistic-scenes', 'drama', 'multi-scene-stories'],
        avoidFor: ['abstract-concepts', 'experimental-art', 'quick-iterations'],
        promptGuidance: {
            emphasize: ['detailed-scene-descriptions', 'camera-language', 'lighting-setups', 'temporal-flow', 'cinematography-terms'],
            deemphasize: ['minimalist-descriptions', 'abstract-concepts', 'rapid-cuts'],
            keywords: ['cinematic', 'photorealistic', '8k', 'HDR', 'temporal', 'coherent', 'narrative'],
            structurePreference: 'detailed-technical-specs'
        },
        technicalNotes: 'Best for 30s-2min content. Requires detailed prompts. Excels at maintaining visual consistency across scenes.'
    },

    'kling-o1': {
        name: 'Kling AI Pro 1.6',
        strengths: ['motion-quality', 'action-sequences', 'dynamic-movement', 'high-speed-subjects', 'fluid-animation', 'sports-content'],
        weaknesses: ['static-shots', 'dialogue-scenes', 'character-consistency', 'slow-pacing'],
        idealFor: ['action-movies', 'sports', 'chase-scenes', 'dance', 'parkour', 'martial-arts'],
        avoidFor: ['still-life', 'talking-heads', 'slow-contemplative-scenes'],
        promptGuidance: {
            emphasize: ['action-verbs', 'motion-descriptors', 'speed-indicators', 'movement-paths', 'dynamic-gestures'],
            deemphasize: ['static-compositions', 'slow-movements', 'dialogue'],
            keywords: ['dynamic', 'fast-paced', 'motion', 'fluid', 'action', 'kinetic', 'explosive'],
            structurePreference: 'action-focused'
        },
        technicalNotes: '5s-3min range. Motion is king. Perfect for high-energy content. Use camera_control for precise movement.'
    },

    'runway-gen4': {
        name: 'Runway Gen-4',
        strengths: ['commercial-quality', 'motion-brushes', 'precise-control', 'clean-aesthetic', 'product-shots', 'brand-content'],
        weaknesses: ['creative-experimentation', 'long-form', 'narrative-depth'],
        idealFor: ['advertisements', 'product-videos', 'marketing', 'brand-content', 'corporate'],
        avoidFor: ['abstract-art', 'long-narratives', 'experimental-work'],
        promptGuidance: {
            emphasize: ['clean-compositions', 'product-focus', 'controlled-movement', 'brand-aesthetic', 'professional-polish'],
            deemphasize: ['chaos', 'unpredictability', 'rawness'],
            keywords: ['polished', 'professional', 'commercial', 'clean', 'refined', 'controlled'],
            structurePreference: 'commercial-brief'
        },
        technicalNotes: '10s max clips. Expensive but precise. Motion brushes allow exact control. Best for high-budget commercial work.'
    },

    'pika-labs': {
        name: 'Pika Labs',
        strengths: ['creative-style', 'image-to-video', 'fast-iteration', 'stylized-content', 'affordability'],
        weaknesses: ['resolution', 'photorealism', 'length', 'motion-artifacts'],
        idealFor: ['creative-projects', 'concept-tests', 'stylized-content', 'social-media', 'quick-prototypes'],
        avoidFor: ['high-res-production', 'photorealistic-scenes', 'complex-multi-character'],
        promptGuidance: {
            emphasize: ['style-elements', 'creative-effects', 'simple-motions', 'single-subjects', 'artistic-flair'],
            deemphasize: ['photorealism', 'complexity', 'multi-character-interactions'],
            keywords: ['stylized', 'creative', 'artistic', 'simple', 'loopable', 'effect-driven'],
            structurePreference: 'creative-concept'
        },
        technicalNotes: 'Fast and affordable. Great for iteration. Lower quality but high creativity. Perfect for testing ideas.'
    },

    'luma-dream': {
        name: 'Luma Dream Machine',
        strengths: ['surreal-visuals', 'morphing', 'fluid-transformations', 'abstract-art', 'experimental', 'dreamlike-quality'],
        weaknesses: ['predictability', 'narrative-coherence', 'control', 'photorealism'],
        idealFor: ['music-videos', 'experimental-art', 'abstract-concepts', 'surrealism', 'metaphorical-content'],
        avoidFor: ['literal-interpretations', 'realism', 'corporate-content', 'product-shots'],
        promptGuidance: {
            emphasize: ['metamorphosis', 'fluid-motion', 'symbolic-imagery', 'emotional-tones', 'abstract-concepts'],
            deemphasize: ['literal-descriptions', 'realism', 'logical-coherence'],
            keywords: ['dreamlike', 'surreal', 'morphing', 'fluid', 'abstract', 'symbolic', 'ethereal'],
            structurePreference: 'poetic-metaphorical'
        },
        technicalNotes: 'Unpredictable but unique. Creates one-of-a-kind visuals. Best for when you want something no other model can create.'
    },

    'nano-storyboard': {
        name: 'Nano Storyboard (Image)',
        strengths: ['storyboarding', '3x3-grid', 'comic-book-panels', 'quick-visualization', 'multiple-angles'],
        weaknesses: ['not-video', 'static-output'],
        idealFor: ['pre-visualization', 'storyboards', 'comic-books', 'concept-art', 'shot-planning'],
        avoidFor: ['final-video-output'],
        promptGuidance: {
            emphasize: ['panel-flow', 'composition', 'camera-angles', 'sequential-storytelling'],
            deemphasize: ['motion', 'animation'],
            keywords: ['storyboard', 'panel', 'composition', 'sequential', 'visual-flow'],
            structurePreference: 'panel-breakdown'
        },
        technicalNotes: 'Static image output. 3x3 grid format. Perfect for planning before video generation.'
    }
};

// Helper function to get optimization hints for Gemini
function getModelOptimizationHints(modelKey) {
    const profile = MODEL_PROFILES[modelKey];
    if (!profile) return '';

    return `
MODEL: ${profile.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STRENGTHS:
${profile.strengths.map(s => `✓ ${s.replace(/-/g, ' ')}`).join('\n')}

WEAKNESSES:
${profile.weaknesses.map(w => `✗ ${w.replace(/-/g, ' ')}`).join('\n')}

IDEAL FOR: ${profile.idealFor.map(i => i.replace(/-/g, ' ')).join(', ')}
AVOID FOR: ${profile.avoidFor.map(a => a.replace(/-/g, ' ')).join(', ')}

PROMPT OPTIMIZATION:
→ EMPHASIZE: ${profile.promptGuidance.emphasize.map(e => e.replace(/-/g, ' ')).join(', ')}
→ DE-EMPHASIZE: ${profile.promptGuidance.deemphasize.map(d => d.replace(/-/g, ' ')).join(', ')}
→ USE KEYWORDS: ${profile.promptGuidance.keywords.join(', ')}
→ STRUCTURE: ${profile.promptGuidance.structurePreference.replace(/-/g, ' ')}

TECHNICAL: ${profile.technicalNotes}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
}

// Export for use in main script
if (typeof window !== 'undefined') {
    window.MODEL_PROFILES = MODEL_PROFILES;
    window.getModelOptimizationHints = getModelOptimizationHints;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MODEL_PROFILES, getModelOptimizationHints };
}
