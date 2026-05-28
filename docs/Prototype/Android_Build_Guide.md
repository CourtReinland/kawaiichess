# Android Build Guide - Kawaii Ouroboros (Updated)

## Prerequisites
- Unity 2022.3 LTS or Unity 6
- Android Build Support installed via Unity Hub
- Android device connected with USB Debugging enabled

## Quick Automated Setup (Recommended)

The project now includes automation to do most of the scene wiring for you.

1. Open the `UnityProject_KawaiiOuroboros` folder in Unity 6.
2. Run the menu item:  
   **KawaiiChess → Setup Minimal MainTest Scene (and Wire Systems)**
3. This will:
   - Create `Assets/Scenes/MainTest.unity`
   - Create the `Systems` GameObject with all required components wired
   - Add the scene to Build Settings

You can then immediately build using the new tools (see below).

## Manual Scene Setup (Fallback)

If you prefer to do it by hand or the script doesn't cover everything:

1. Create a new scene called `MainTest`
2. Create an empty GameObject called `Systems`
3. Add these components to it:
   - `Bootstrap`
   - `Board`
   - `GameManager`
   - `TurnSystem`
   - `InputHandler`
   - `MoveHighlighter`
   - `BoardSetup`
   - `SimpleEnemyAI`
   - `WinCondition`

4. In the Inspector, assign references in `Bootstrap`:
   - Board → Board
   - GameManager → GameManager
   - TurnSystem → TurnSystem
   - InputHandler → InputHandler
   - MoveHighlighter → MoveHighlighter
   - BoardSetup → BoardSetup
   - enemyAI → SimpleEnemyAI

5. Create a simple Quad or Sprite as the board background (optional)

## Android Player Settings
- Company Name: YourName
- Product Name: Kawaii Ouroboros
- Package Name: com.yourname.kawaiiouroboros
- Minimum API Level: 24
- Target API Level: Highest installed

## Build Tools

We now have one-click build support:

### From inside Unity
- **KawaiiChess → Build Android APK**
- **KawaiiChess → Build and Run on Android Device**

### From terminal (at workspace root)
```bash
./build-android.sh          # Build APK only
./build-android.sh run      # Build + push to connected device
```

The build script automatically sets the correct package name (`com.courtreinland.kawaiichess`), company name, and Android settings.

## Android Player Settings (still applied automatically)
- Company Name: CourtReinland
- Product Name: KawaiiChess
- Package Name: com.courtreinland.kawaiichess
- Minimum API Level: 24

**Last Updated**: 2026-05-28