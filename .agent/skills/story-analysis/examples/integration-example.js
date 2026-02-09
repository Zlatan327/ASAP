/**
 * Integration Example: Full Story Analysis Pipeline
 * Demonstrates how to use StoryState and ContinuityTracker together
 */

// This example shows how to integrate the story analysis skill
// into the existing ASAP video prompter tool

function processStoryWithContinuity(rawStory, modelConfig, visualDictionary) {
    // 1. Initialize Story State
    const storyState = new StoryState(rawStory);

    console.log(`📖 Story Analysis:`);
    console.log(`   Characters: ${storyState.characters.join(', ')}`);
    console.log(`   Scenes: ${storyState.scenes.length}`);
    console.log(`   Genre: ${storyState.genre}`);

    // 2. Initialize Continuity Tracker
    const continuity = new ContinuityTracker();

    // 3. Process each scene
    const results = [];

    storyState.scenes.forEach((scene, index) => {
        console.log(`\n🎬 Processing Scene ${index + 1}/${storyState.scenes.length}`);

        // Use first detected character as subject
        const characterName = storyState.characters[0] || "The Protagonist";

        // Analyze scene (using existing analyzeText logic)
        const analysis = analyzeText(scene);

        // Override character name with detected name
        analysis.subject = characterName;

        // Get character visuals if available
        const characterVisuals = storyState.getCharacterVisuals(characterName, visualDictionary);
        if (characterVisuals) {
            analysis.visuals = characterVisuals;
        }

        // Format prompt using model specs
        let prompt = modelConfig.format(analysis);

        // 4. Inject continuity
        prompt = continuity.injectIntoPrompt(prompt);

        // 5. Update continuity for next scene
        continuity.updateFromScene(scene);

        // Debug output
        console.log(`   Character: ${characterName}`);
        console.log(`   Continuity: ${JSON.stringify(continuity.state.environment)}`);

        results.push({
            id: index + 1,
            label: `${modelConfig.name} - Scene ${index + 1}`,
            optimized: prompt,
            raw: scene,
            continuity: continuity.formatState()
        });
    });

    return results;
}

// Example Usage
const exampleStory = `
Alex enters the dark warehouse. Rain pours outside.
She cuts her hand on a broken window while climbing in.
A red car sits in the corner, covered in dust.

Hours later, she examines the vehicle.
Blood drips from her wounded hand onto the hood.
Thunder rumbles in the distance.

Suddenly, she hears footsteps. Alex turns around.
The warehouse door slams shut.
`;

// Run the enhanced pipeline
const results = processStoryWithContinuity(
    exampleStory,
    modelSpecs['veo3'],
    visualDictionary
);

console.log('\n📊 Final Results:');
results.forEach(result => {
    console.log(`\nScene ${result.id}:`);
    console.log(result.optimized);
});

/**
 * Expected Output:
 * 
 * Scene 1:
 * [Camera: Establishing Shot]
 * Alex enters the dark warehouse. Rain pours outside. She cuts her hand on a broken window...
 * [CONTINUITY]: Time: evening | Weather: rain | Alex: cut hand | Visible objects: red car
 * 
 * Scene 2:
 * [Camera: Close-up]
 * Alex examines the vehicle. Blood drips from her wounded hand...
 * [CONTINUITY]: Time: evening | Weather: rain | Alex: cut hand | Visible objects: red car
 * 
 * Scene 3:
 * [Camera: POV]
 * Alex turns around. The warehouse door slams shut...
 * [CONTINUITY]: Time: evening | Weather: rain | Alex: cut hand, bleeding | Visible objects: red car
 */
