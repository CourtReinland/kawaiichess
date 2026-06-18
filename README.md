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
- Simple enemy AI

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

## Unit Draft System

After each victorious battle, you are offered **three randomized units** drawn from the currently unlocked tier pool:

- **Tier 1**: available immediately (15 common pieces)
- **Tier 2**: unlocked after clearing stage 3 (25 specialized pieces)
- **Tier 3**: unlocked after clearing stage 6 (15 rare & legendary pieces)

Drafted units are added to your army and appear in the next battle. Duplicate units are allowed.

## Controls

- **Web**: click/tap a piece to select it, then click/tap a highlighted square to move
- **Android**: touch a piece to select, touch a highlighted square to move
- Green dots = valid moves; red ring = capture

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
