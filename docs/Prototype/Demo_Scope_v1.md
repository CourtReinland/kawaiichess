# Demo Scope v1 - Kawaii Ouroboros

**Goal**: First playable web + Android demo (vertical slice)

## Must Have Features

### Core Systems
- 8×8 chess board with clean touch controls (tap to select, tap to move)
- 55+ anime-themed pieces with distinct abilities across three unlock tiers
- Basic turn system (Player → Enemy AI)
- Capture the enemy King to win

### Roguelike Elements
- 7-stage node-based circuit
- One battle per node
- Draft a new unit after each victory
- "Rewind" on defeat (new run)

### Content
- Full Tier 1 piece pool available immediately
- Tier 2 unlocks after stage 3, Tier 3 after stage 6
- Enemy armies themed per academy
- Prologue story sequence

### Visual Presentation
- 3D battle board rendered with Three.js
- Academy-themed board textures
- Character standee cards that billboard toward the camera
- Selection, move, capture, and enemy-range highlights

### UI
- Title screen with Begin Prologue / Continue Run
- Circuit map
- Match Formation screen
- Battle view with Deselect / Rotate Board / Rewind Run controls
- Draft screen
- Win / Lose / Rewind screens

### Technical
- Runs in any modern browser
- Android APK built from the web client with Capacitor
- Save system using `localStorage`
- 60 FPS target on mid-range phones

## Out of Scope for v1
- Full procedural map generation
- Sound and music
- Advanced piece synergies beyond existing abilities
- Relics and gold rewards
- Meta-progression outside the current run

## Success Criteria
- Player can complete at least one full short run (start → 7 battles → win or rewind)
- Touch controls feel responsive
- At least 3 pieces have unique abilities that change how you play
- 3D board and standees render correctly on both desktop and Android

**Target Timeline**: First testable build within 3–4 weeks of active development

**Current Status**: Implemented and testable on web + Android (2026-06-16)
