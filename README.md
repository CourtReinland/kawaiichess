# Kawaii Chess (Web)

A cute anime-themed chess roguelike, inspired by *The Ouroboros King*.
TypeScript + Phaser 3 + Vite, packaged for Android with Capacitor.

This replaces the Unity prototype (the parent directory) — same art, same
concept, but with a complete roguelike loop and a real AI.

## Game loop

Menu → **Adventure Map** (5 layers, branching) → Battles / Shops → **Boss**.

- Win battles by capturing the enemy King; lose your King and the run ends.
- Victories pay gold (elites pay double). Spend it in shops to recruit pieces.
- Your army persists between battles (max 12 pieces).

### Pieces

Standard chess movement (no castling/en passant; pawns always single-step,
capture diagonally, promote to Queen) plus fairy pieces:

| Piece | Movement |
|---|---|
| 🌸 Sakura Pawn | pawn + sideways step |
| 🌙 Ninja Knight | knight + 1-square diagonal "shadow step" |
| ✨ Magical Girl | rook + barrier that absorbs the first capture |

The enemy AI is minimax with alpha-beta pruning (depth 2 on early layers,
3 from layer 3 and on bosses).

## Development

```sh
npm install
npm run dev        # browser at localhost:5173
npx tsx tests/engine.test.ts   # engine sanity tests
```

## Android (Pixel) build

Uses Unity's bundled JDK + Android SDK — no separate install needed:

```sh
./deploy-android.sh   # build web → sync capacitor → gradle APK → adb install
```

APK lands at `android/app/build/outputs/apk/debug/app-debug.apk`.

## Layout

```
src/core/    pure-TS game logic (battle rules, AI, run state) — no Phaser
src/scenes/  Boot, Menu, Map, Battle, Shop, RunVictory
src/ui/      theme helpers + circular token generation from the JPG art
public/art/  kawaii art carried over from the Unity project
tests/       engine sanity tests (run with tsx)
```
