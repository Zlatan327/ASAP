
const { VisualTranslator } = require('./.agent/skills/story-analysis/scripts/visual-translator.js');
const { TokenOptimizer } = require('./.agent/skills/story-analysis/scripts/token-optimizer.js');
const { StyleManager } = require('./.agent/skills/story-analysis/scripts/style-manager.js');
const { StoryState } = require('./.agent/skills/story-analysis/scripts/story-state.js');
const { CameraDirector } = require('./.agent/skills/story-analysis/scripts/camera-logic.js');
const { DetailInjector } = require('./.agent/skills/story-analysis/scripts/detail-injector.js');
const { AudioEngineer } = require('./.agent/skills/story-analysis/scripts/audio-engineer.js');

// MOCK DOM
global.document = {
    getElementById: (id) => ({ value: 'gta6' }) // Simulator finding "GTA 6" selected
};
global.window = {
    VisualTranslator, TokenOptimizer, StyleManager, StoryState,
    CameraDirector, DetailInjector, AudioEngineer
};

// Load "script.js" logic (Simulation)
// Since script.js isn't a module, we replicate the analyzeText logic here for testing
// in a real environment we'd export it, but for this quick check we simulate the pipeline.

function analyzeTextSim(text, stylePreset = 'gta6') {
    const vt = new VisualTranslator();
    const to = new TokenOptimizer();
    const sm = new StyleManager();
    const cd = new CameraDirector();
    const di = new DetailInjector();
    const ae = new AudioEngineer();

    const concrete = vt.translate(text);
    const ss = new StoryState(concrete);

    // Style & Tech
    const recipe = sm.getStyleDescription(stylePreset);
    const negs = sm.getNegatives(stylePreset);
    const antiPlastic = di.getNegative(true);

    // Camera
    let shot = cd.determineShot(concrete);
    shot = cd.refineSelfie(concrete, shot);

    // Details (Skin)
    const details = di.injectDetails(concrete, "Hero", shot);

    // Audio
    const audio = ae.analyze(concrete, "cinematic");

    // Optimizer
    const action = to.optimize(concrete, ["Hero"]);

    return {
        action: action + details,
        style: recipe,
        camera: shot.name,
        audio: audio,
        neg: negs + " " + antiPlastic
    };
}

console.log("=== MASTER INTEGRATION TEST ===");

const input = "Close up selfie of a crazy man screaming in the rain.";
console.log(`INPUT: "${input}"\n`);

const result = analyzeTextSim(input, 'gta6');

console.log("--- RESULT ---");
console.log("STYLE     :", result.style.substring(0, 50) + "...");
console.log("CAMERA    :", result.camera);
console.log("DETAILS   :", result.action.includes("vellus hair") ? "✅ Skin Details Injected" : "❌ Missing Details");
console.log("AUDIO     :", result.audio);
console.log("NEGATIVES :", result.neg.substring(0, 50) + "...");

if (
    result.style.includes("GTA VI") &&
    result.camera.includes("Selfie") &&
    result.action.includes("vellus hair") &&
    result.audio.includes("Rain")
) {
    console.log("\n✅ ALL SYSTEMS FUNCTIONAL");
    process.exit(0);
} else {
    console.error("\n❌ SYSTEM FAILURE");
    process.exit(1);
}
