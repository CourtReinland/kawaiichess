# Agent Instructions

Guidelines for AI agents working on this codebase.

## Project Overview

Kawaii Chess is a web-based anime chess roguelike. The repo contains:
- A React + TypeScript game client in `src/client/`
- A data-driven chess engine in `src/game/`
- A Capacitor Android wrapper in `android/`
- Legacy Unity prototypes in `UnityProject/` and `UnityProject_KawaiiOuroboros/`
- A Cloudflare Worker backend (currently unused by the game) in `src/index.ts` and `src/routes/`

## Project Structure

```
src/
├── client/           # React game UI
│   ├── components/   # Board, RunScreen, DraftScreen, PieceView
│   ├── App.tsx
│   └── main.tsx
├── game/             # Core game engine
│   ├── types.ts      # Shared TypeScript types
│   ├── pieces.ts     # 55+ piece definitions + draft pools
│   ├── board.ts      # Board state, move generation, applyMove
│   ├── ai.ts         # Enemy AI
│   └── run.ts        # Run state, stages, persistence
└── ...               # Worker backend
```

## Key Patterns

### Game Engine

- Pieces are data-driven records in `PIECE_DEFINITIONS`.
- Movement types are implemented in `board.ts` (`rook`, `bishop`, `knight`, `pawn`, `dragon`, etc.).
- Special abilities are stored as metadata; full ability logic is not yet implemented for every piece.
- Run state is persisted to `localStorage` for browser/Android continuity.

### Unit Drafts

- `getUnlockedTiers(stageIndex)` returns which tiers are available.
- `rollDraftOptions(nextStageIndex, playerArmy, 3)` returns the three choices.
- Drafted pieces are appended to `run.playerArmy`.

### Commands

```bash
npm install           # Install dependencies
npm run dev           # Vite dev server
npm run build         # Production web build
npm run test          # Run tests (vitest)
npm run typecheck     # TypeScript check
npm run lint          # oxlint
npm run format        # oxfmt
./build-android.sh    # Build Android APK
./build-android.sh run # Build + install + launch on device
```

## Code Style

- Use TypeScript strict mode.
- Prefer explicit types for exported function signatures.
- Keep game engine logic pure and separate from React UI.
- When a test fails because of a user modification, fix the test first.

## Documentation

- `README.md` - User-facing setup and build instructions.
- `AGENTS.md` - This file, for AI agents.
