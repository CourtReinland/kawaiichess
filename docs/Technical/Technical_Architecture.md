# Technical Architecture - Kawaii Ouroboros

## Recommended Engine
- **Unity 2022 LTS or Unity 6** (best mobile support + 2D tools)
- Alternative: Godot 4.3+ (if we want lighter and fully open source)

## Project Structure
```
Assets/
├── Scenes/
│   ├── MainMenu
│   ├── MapView
│   ├── BattleScene
│   └── RecruitScreen
├── Scripts/
│   ├── Core/               # Board, Piece, GameManager
│   ├── Battle/             # TurnSystem, MovementValidator
│   ├── Roguelike/          # MapGenerator, RunManager, RelicSystem
│   ├── UI/
│   ├── Data/               # ScriptableObjects for Pieces & Relics
│   └── SaveSystem/
├── Prefabs/
├── Art/
├── Audio/
└── Resources/
```

## Key Systems
- **Board System**: 8x8 grid with coordinate system (Vector2Int)
- **Piece System**: ScriptableObject-based piece definitions + runtime instances
- **Turn System**: Player turn → AI turn with clear state machine
- **Roguelike Map**: Node-based map with procedural generation
- **Save System**: JSON-based with cloud sync (Firebase or Play Games)
- **Input**: Touch-first with drag & drop + tap-to-move. Long-press shows piece ability description.
- **Save System**: JSON + optional Firebase sync. Stores run state, unlocked pieces, and relics.

## Performance Targets (Android)
- 60 FPS on mid-range devices
- Lightweight particle system
- Asset bundles for piece skins

**Status**: v3 – Documented piece data structure using ScriptableObjects. Ready for prototype.