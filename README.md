# Kawaii Chess Roguelike

A cute anime-themed chess roguelike for Android, inspired by *The Ouroboros King*.

## Project Overview

This is a spiritual successor to *The Ouroboros King*, reimagined with cute anime characters, touch-friendly controls, and a roguelike army-building loop.

**Core Gameplay**
- Chess battles on an 8x8 board with unique fairy chess pieces
- Build and upgrade an army of cute anime characters
- Roguelike progression with relics, procedural maps, and permadeath/rewind mechanics
- Android-first design

## Current Status

**Phase**: Early Prototype Development

We are currently building the core systems in Unity with the goal of producing a playable vertical slice.

## Repository Structure

```
├── README.md
├── build-android.sh           # One-command Android build + deploy
├── docs/
│   ├── Game_Design/
│   ├── Technical/
│   ├── Art/                   # Art direction + kawaii style guide
│   ├── Business/
│   └── Prototype/             # Android build guide (now with automation)
├── UnityProject_KawaiiOuroboros/   # Main Unity client (scripts + art)
│   └── Assets/
│       ├── Art/               # Generated kawaii sprites
│       ├── Editor/            # BuildKawaiiChess.cs + Setup script
│       └── Scripts/           # Core game systems
└── MEMORY.md
```

## Getting Started

See `docs/Prototype/Android_Build_Guide.md` for instructions on building and running the prototype on Android.

### Quick Unity Build
```bash
# After opening the Unity project and running the setup menu once:
./build-android.sh run
```

This will build the Android client and install it directly to a connected device (Pixel recommended).

## License

TBD

---

*Project started May 2026*