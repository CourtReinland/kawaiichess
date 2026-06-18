# Technical Architecture - Kawaii Ouroboros

## Current Stack

The playable vertical slice is built as a **web-first TypeScript/React application** and wrapped as an Android app with Capacitor.

- **Build tool**: Vite 6
- **UI framework**: React 19 + TypeScript
- **3D rendering**: Three.js 0.184 + React Three Fiber 9 + React Three Drei 10
- **Mobile wrapper**: Capacitor 6
- **Backend**: Cloudflare Workers (Hono + optional Puppeteer/AI gateway)
- **State management**: React state + `localStorage` for run persistence
- **Styling**: Plain CSS with CSS variables

## Project Structure

```
kawaiichess/
├── android/                       # Generated Capacitor Android project
├── build-android.sh               # Build + install Android APK from web code
├── capacitor.config.ts            # Capacitor configuration
├── docs/                          # Design, art, and technical docs
├── src/
│   ├── client/                    # React game client
│   │   ├── components/            # Board3D, RunScreen, DeploymentScreen, etc.
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── game/                      # Core chess engine
│   │   ├── board.ts               # Board state, movement, captures
│   │   ├── pieces.ts              # Piece definitions and abilities
│   │   ├── ai-engine.ts / ai.ts   # Enemy AI
│   │   ├── run.ts                 # Roguelike run state
│   │   ├── story.ts               # Prologue / story sequences
│   │   └── tournament-map.ts      # Circuit stage definitions
│   └── gateway/                   # Cloudflare Worker backend
├── dist/client/                   # Production web build
└── public/                        # Static assets (characters, academies, videos)
```

## Key Systems

- **Board System**: 8×8 grid with `Position` coordinates `{x, y}`
- **Piece System**: Data-driven piece definitions (`PieceDefinition`) + runtime instances (`PieceInstance`) with abilities
- **Battle State**: `BattleState` holds pieces, turn, phase, highlighted moves, and win/loss condition
- **Turn System**: Player turn → Enemy AI turn with a clear state machine
- **Roguelike Map**: Hand-authored 7-stage circuit with draft choices between battles
- **3D Presentation**:
  - `Board3D.tsx` renders the battle with Three.js
  - `BaseBoard` draws the framed, textured board
  - `Piece3D` draws rounded, camera-facing standee cards
  - `TileHighlight` shows selection, valid moves, captures, and enemy range previews
- **Save System**: `localStorage` stores current run progress
- **Input**: Touch-first tap-to-select / tap-to-move; mouse works identically on web

## Performance Targets (Android)

- 60 FPS on mid-range devices
- Small number of draw calls (single board mesh + ~12–32 standee meshes)
- Shadows enabled with a 1024 shadow map
- Minimal post-processing to keep mobile GPUs happy

## Build & Deploy

```bash
npm install
npm run dev        # Dev server (Cloudflare plugin may require Docker)
npm run build      # Production web build → dist/client/
npm run test       # Run all tests
npm run typecheck  # TypeScript check
npm run lint       # Lint check
```

Android:

```bash
./build-android.sh      # Build APK only
./build-android.sh run  # Build + install + launch on device
```

**Status**: v4 – Web + Capacitor vertical slice with 3D battle board, standee pieces, and Android APK builds.
