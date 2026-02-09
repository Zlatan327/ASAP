/**
 * Quick Test - Story Analysis Functions
 * Run this in browser console after loading index.html
 */

// Test 1: Character Extraction
console.log("=== TEST 1: Character Extraction ===");
const testStory1 = "Alex enters the room. Dr. Martinez looks up from his desk. Alex walks over to the window.";
const state1 = new StoryState(testStory1);
console.log("Characters found:", state1.characters);
console.log("Expected: ['Alex', 'Dr. Martinez']");

// Test 2: Scene Segmentation
console.log("\n=== TEST 2: Scene Segmentation ===");
const testStory2 = "Alex enters the room. The lights flicker. Suddenly, she hears a noise. Later that night, she investigates the basement.";
const state2 = new StoryState(testStory2);
console.log("Scenes:", state2.scenes);
console.log("Expected: 2 scenes (split on 'Later that night')");

// Test 3: Continuity Tracking
console.log("\n=== TEST 3: Continuity Tracking ===");
const tracker = new ContinuityTracker();
tracker.updateFromScene("Alex cuts her hand on broken glass. It's raining outside.");
console.log("State after Scene 1:", tracker.state);
const prompt = tracker.injectIntoPrompt("Alex runs down the hallway.");
console.log("Enhanced prompt:", prompt);
console.log("Expected: Prompt should include '[Continuity]: Alex: injured | Weather: rain'");

// Test 4: Genre Detection
console.log("\n=== TEST 4: Genre Detection ===");
const horrorStory = "Blood drips from the walls. A scream echoes. The creature emerges from the darkness.";
const state4 = new StoryState(horrorStory);
console.log("Detected genre:", state4.genre);
console.log("Expected: 'horror'");

console.log("\n✅ Tests complete. Review console output above.");
