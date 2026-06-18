# Kawaii Chess Roguelike

A cute anime-themed chess roguelike for web and Android, inspired by *The Ouroboros King*.

## Project Overview

This is a spiritual successor to *The Ouroboros King*, reimagined with cute anime characters, touch-friendly controls, and a roguelike army-building loop.

**Core Gameplay**
- Chess battles on an 8x8 board with 55+ unique fairy chess pieces
- Build and upgrade an army of cute anime characters
- Roguelike progression with randomized unit drafts, stage rewards, and rewind mechanics
- Web-first client wrapped as an Android app with Capacitor

## Current Status

**Phase**: Playable web + Android vertical slice

- Web client runs in any modern browser
- Android APK builds from the web client via Capacitor
- 7-stage campaign with draft unit selection between battles
- Rich 3D battle board rendered with Three.js
- Camera-facing 2.5D character standees
- Unique academy-themed battle boards
- Simple enemy AI

## Game Elements

### 3D Battle Board
Battles take place on a framed, academy-themed 3D board. Each rival school has its own board texture, color scheme, and decorative border. The board is built from a single textured slab with raised rails, corner posts, feet, and a soft ground plane so it reads as a physical object on both desktop and mobile.

### Character Standees
Pieces are rendered as upright 2.5D standee cards:
- A rounded card frame tinted by side (player = sky blue, enemy = sakura pink) and by royal status (gold).
- The character mini portrait is displayed on the front with the white background removed.
- A metallic rim and colored base ring give each piece weight and readability.
- Cards billboard toward the camera so the character is always visible, even when the board is rotated.
- Royal pieces (Kings and boss Queens) receive an extra glowing halo.

### Highlighting
- **Green dot / ring** = valid move
- **Red ring** = capture
- **Pink dot** = enemy attack range preview
- **Green selection ring** = currently selected piece

### Academies & Board Themes
Each stage is themed after a rival academy. The board texture changes to match the opponent, while the piece silhouettes and color coding stay consistent.

### Roguelike Run Flow
1. Start a run from the title screen.
2. Choose the next academy on the National Chess Circuit.
3. Arrange your drafted club members in **Match Formation**.
4. Fight the battle on the 3D board.
5. Draft a new unit (or skip) and continue to the next stage.
6. Rewind the run if your King is captured.

## Repository Structure

```
├── README.md
├── build-android.sh           # Build + install Android APK from web code
├── capacitor.config.ts        # Capacitor configuration
├── android/                   # Generated Capacitor Android project
├── docs/
│   ├── Game_Design/
│   ├── Technical/
│   ├── Art/                   # Art direction + kawaii style guide
│   ├── Business/
│   └── Prototype/
├── src/
│   ├── client/                # React + TypeScript game client
│   │   ├── components/        # Board, draft screen, run screen
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── game/                  # Core chess engine (types, pieces, board, AI, run)
│   └── ...                    # Cloudflare Worker backend (unchanged)
├── UnityProject/              # Legacy Unity prototype
└── UnityProject_KawaiiOuroboros/  # Legacy Unity prototype with art
```

## Quick Start

```bash
npm install
npm run dev        # Dev server (requires Docker for Cloudflare containers)
npm run build      # Production web build → dist/client/
npm run test       # Run all tests
npm run typecheck  # TypeScript check
npm run lint       # Lint check
```

## Android Build

Requirements:
- Android SDK (set `ANDROID_HOME` or install to `/opt/homebrew/share/android-commandlinetools`)
- Java 17
- A connected Android device with USB debugging enabled

```bash
# Build APK only
./build-android.sh

# Build + install + launch on connected device
./build-android.sh run
```

The APK is output to `android/app/build/outputs/apk/debug/app-debug.apk`.

The `run` mode now force-stops the app and clears its storage before installing, so the Android WebView cannot accidentally serve stale assets from a previous build.

## Unit Draft System

After each victorious battle, you are offered **three randomized units** drawn from the currently unlocked tier pool:

- **Tier 1**: available immediately (15 common pieces)
- **Tier 2**: unlocked after clearing stage 3 (25 specialized pieces)
- **Tier 3**: unlocked after clearing stage 6 (15 rare & legendary pieces)

Drafted units are added to your army and appear in the next battle. Duplicate units are allowed.

## Controls

- **Web**: click/tap a piece to select it, then click/tap a highlighted square to move
- **Android**: touch a piece to select, touch a highlighted square to move
- **Rotate Board**: tap the button (or drag with the mouse) to spin the camera and view the board from another angle
- **Deselect**: tap the Deselect button to clear the current selection
- Green dots = valid moves; red ring = capture; pink dot = enemy range preview

## Running Locally

The Vite dev server uses the Cloudflare plugin, which attempts to build containers. If Docker is not available, use the production build and serve it statically:

```bash
npm run build
npx serve dist/client
```

## License

Apache-2.0

---

*Project started May 2026*
