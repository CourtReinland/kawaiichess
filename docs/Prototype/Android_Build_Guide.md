# Android Build Guide - Kawaii Ouroboros (Updated)

## Prerequisites
- Unity 2022.3 LTS or Unity 6
- Android Build Support installed via Unity Hub
- Android device connected with USB Debugging enabled

## Recommended Scene Setup

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

## Build Steps
1. File → Build Settings
2. Switch to Android
3. Add `MainTest` scene
4. Click **Build And Run**

**Last Updated**: 2026-05-27 20:56 PDT