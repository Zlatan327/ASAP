---
name: story-analysis
description: Advanced story parsing for video prompt generation. Includes Beech's Lab professional workflows, Scene Inference, and Continuity Building.
---

# Story Analysis Skill (Visual Director Edition)

This skill transforms text into professional-grade video prompts using "Beech's Lab" workflows and advanced NLP.

## Capabilities

1.  **Scene Inference**: Automatically segment stories into shootable scenes with inferred context (Sluglines).
2.  **Scene Builder**: Link scenes sequentially with "Continuity Bridges" (Prompt 2 knows Prompt 1).
3.  **Camera Director**: Translate abstract motion ("Zoom in") into technical camera moves ("Push In", "Dolly Zoom").
4.  **Detail Injector**: "Anti-Plastic" skin enhancement for human close-ups (vellus hair, pores).
5.  **Audio Engineering**: Generate 4-layer audio prompts (Dialogue, Ambient, SFX, Music) for Veo 3.
6.  **Style Recipes**: Tailored presets for GTA 6, VX1000, Security Cam, etc.

## Usage

### 1. Scene Inference & Building

```javascript
const { SceneInferrer } = require('./scripts/scene-inferrer.js');
const { SceneBuilder } = require('./scripts/scene-builder.js');
const { ContinuityTracker } = require('./scripts/continuity-tracker.js');

const text = "John ran in the rain. // Next day // He was sick.";

// A. Identify Scenes
const inferrer = new SceneInferrer();
const rawScenes = inferrer.segment(text); 
// -> [{text: "John ran...", location: "Unknown", time: "Day"}, ...]

// B. Build Sequence (Connects them)
const tracker = new ContinuityTracker();
const builder = new SceneBuilder(tracker);
const richScenes = builder.build(rawScenes);

// Scene 2 will now contain:
// [BRIDGE]: Action flows from previous scene...
// [CONTINUITY]: John is wet/sick...
```

### 2. Camera Director

```javascript
const { CameraDirector } = require('./scripts/camera-logic.js');
const director = new CameraDirector();

const shot = director.determineShot("Zoom in on his face as he screams");
console.log(shot); 
// { name: "Push In", desc: "Slow push-in towards subject..." }
```

### 3. Detail Injector (Skin Enhancer)

```javascript
const { DetailInjector } = require('./scripts/detail-injector.js');
const injector = new DetailInjector();

// Automatically detects human subjects in close-ups
const details = injector.injectDetails("Close up of a woman", "Woman", {name: "Close Up"});
// Returns: "INTRICATE FACIAL DETAILS: Visible vellus hair, peach fuzz..."
```

### 4. Audio Engineer

```javascript
const { AudioEngineer } = require('./scripts/audio-engineer.js');
const audio = new AudioEngineer();

const prompt = audio.analyze('Ben yelled "Stop!" over the thunder.', "horror");
// Returns: "Dialogue: "Stop!" | Ambient: Thunder storm | SFX: - | Music: Dissonant strings"
```

## File Structure

```
.agent/skills/story-analysis/
├── SKILL.md (this file)
├── scripts/
│   ├── story-state.js          # Entity Extraction & State
│   ├── scene-inferrer.js       # Auto-segmentation (Sluglines)
│   ├── scene-builder.js        # Sequential Logic (Bridges)
│   ├── continuity-tracker.js   # State Persistence
│   ├── camera-logic.js         # Camera Moves (Dolly, Truck, Roll)
│   ├── detail-injector.js      # Skin Enhancer / Anti-Plastic
│   ├── audio-engineer.js       # Audio Prompt Generation
│   ├── style-manager.js        # Visual Recipes (GTA 6, VX1000)
│   ├── visual-translator.js    # Abstract -> Concrete
│   └── token-optimizer.js      # Prompt compression
```

## Best Practices

1.  **Use the Scene Builder**: Always pass inferred scenes through `SceneBuilder` to ensure flow.
2.  **Trust the Inferrer**: It handles explicit sluglines (`INT. LAB`) AND natural language transitions ("Later that night").
3.  **Beech's Recipes**: Use `StyleManager` to access specific look-devs like `gta6` or `security` which override standard film stocks.
