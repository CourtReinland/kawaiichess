#!/bin/zsh
# Build KawaiiChess Android APK from the web-based client using Capacitor.
# Usage:
#   ./build-android.sh          # Build APK only
#   ./build-android.sh run      # Build + install + launch on connected device

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
APK_DIR="$PROJECT_DIR/android/app/build/outputs/apk/debug"
APK_NAME="app-debug.apk"
APK_PATH="$APK_DIR/$APK_NAME"
LOG="/tmp/kawaiichess-android-build.log"

RUN_MODE=false
if [[ "$1" == "run" ]]; then
  RUN_MODE=true
  echo "→ Build + install + launch mode"
fi

echo "=== KawaiiChess Android Build (Web → Capacitor) ==="
echo "Project: $PROJECT_DIR"
echo "Log: $LOG"
echo ""

# Validate Android SDK.
if [[ -z "$ANDROID_HOME" && -z "$ANDROID_SDK_ROOT" ]]; then
  if [[ -d "/opt/homebrew/share/android-commandlinetools" ]]; then
    export ANDROID_HOME="/opt/homebrew/share/android-commandlinetools"
    export ANDROID_SDK_ROOT="$ANDROID_HOME"
  else
    echo "Error: ANDROID_HOME or ANDROID_SDK_ROOT is not set."
    echo "Install the Android SDK or set ANDROID_HOME before building."
    exit 1
  fi
fi

# Validate Node tooling.
if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is not installed."
  exit 1
fi

cd "$PROJECT_DIR"

# Ensure dependencies are installed.
echo "→ Installing dependencies..."
npm install >> "$LOG" 2>&1

# Build the web client.
echo "→ Building web client..."
npm run build >> "$LOG" 2>&1

# Sync Capacitor with the native project.
echo "→ Syncing Capacitor Android project..."
npx cap sync android >> "$LOG" 2>&1

# Build the Android APK.
echo "→ Building Android APK..."
cd android
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  ./gradlew assembleDebug >> "$LOG" 2>&1
elif [[ "$OSTYPE" == "darwin"* ]]; then
  ./gradlew assembleDebug >> "$LOG" 2>&1
else
  gradlew assembleDebug >> "$LOG" 2>&1
fi

cd "$PROJECT_DIR"

if [[ ! -f "$APK_PATH" ]]; then
  echo "Error: APK not found at $APK_PATH"
  echo "Check the build log: $LOG"
  exit 1
fi

echo ""
echo "=== Build finished ==="
echo "APK: $APK_PATH"
echo ""

if [[ "$RUN_MODE" == true ]]; then
  echo "→ Stopping any running instance..."
  adb shell am force-stop com.kawaiichess.app || true

  echo "→ Clearing app cache and storage (prevents stale WebView assets)..."
  adb shell pm clear com.kawaiichess.app || true

  echo "→ Installing APK on connected device..."
  adb install -r "$APK_PATH"

  echo "→ Launching Kawaii Chess..."
  adb shell am start -n com.kawaiichess.app/.MainActivity
fi
