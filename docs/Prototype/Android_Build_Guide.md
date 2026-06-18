# Android Build Guide - Kawaii Chess (Capacitor)

## Prerequisites

- Node.js 22+ (check `.nvmrc` if present)
- pnpm or npm
- Android SDK (set `ANDROID_HOME` or install to `/opt/homebrew/share/android-commandlinetools`)
- Java 17
- An Android device connected with USB Debugging enabled

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the web client and sync it to the Android project:
   ```bash
   npm run build
   npx cap sync android
   ```

3. Build and install the APK:
   ```bash
   ./build-android.sh         # Build APK only
   ./build-android.sh run     # Build + install + launch on device
   ```

The APK is output to `android/app/build/outputs/apk/debug/app-debug.apk`.

## What the Build Script Does

`./build-android.sh` performs the following steps:
1. Runs `npm install`.
2. Builds the production web client into `dist/client/`.
3. Syncs the web assets into the Capacitor Android project with `npx cap sync android`.
4. Compiles the Android APK with Gradle.

When called with `run`, it additionally:
- Force-stops any running instance of the app.
- Clears the app’s storage and cache so the WebView cannot serve stale assets.
- Installs the new APK.
- Launches the app.

## Capacitor Configuration

- **App ID**: `com.kawaiichess.app`
- **App Name**: `Kawaii Chess`
- **Web Directory**: `dist/client`

These values live in `capacitor.config.ts`.

## Troubleshooting

- **Stale assets on reinstall**: use `./build-android.sh run`, which clears app storage before installing.
- **Docker prompt during dev**: the Cloudflare Vite plugin may try to build containers. If Docker is unavailable, use the production build and serve it statically:
  ```bash
  npm run build
  npx serve dist/client
  ```
- **Android SDK not found**: set `ANDROID_HOME` to your SDK root, or place the command-line tools at `/opt/homebrew/share/android-commandlinetools`.

**Last Updated**: 2026-06-16
