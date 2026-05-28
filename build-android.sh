#!/bin/zsh
# Convenience wrapper for building KawaiiChess for Android
# Usage:
#   ./build-android.sh          # Build APK only
#   ./build-android.sh run      # Build + attempt AutoRun on connected device

set -e

UNITY="/Applications/Unity/Hub/Editor/6000.3.10f1/Unity.app/Contents/MacOS/Unity"
PROJECT="UnityProject_KawaiiOuroboros"
LOG="/tmp/kawaiichess-android-build.log"

METHOD="BuildKawaiiChess.BuildAndroidAPK"

if [[ "$1" == "run" ]]; then
    METHOD="BuildKawaiiChess.BuildAndRunAndroid"
    echo "→ Build + AutoRun mode"
fi

echo "=== KawaiiChess Android Build ==="
echo "Unity: $UNITY"
echo "Project: $PROJECT"
echo "Method: $METHOD"
echo "Log: $LOG"
echo ""

"$UNITY" \
  -batchmode \
  -quit \
  -projectPath "$PROJECT" \
  -executeMethod "$METHOD" \
  -logFile "$LOG" \
  2>&1 | tail -20 || true

echo ""
echo "=== Build finished. Check log for details: $LOG ==="
echo "If you got a licensing error, open the project in the normal Unity Editor GUI"
echo "and use the menu: KawaiiChess → Build Android APK (or Build and Run on Android Device)."
echo ""
echo "After a successful build, the APK will be in: $PROJECT/Builds/KawaiiChess.apk"
echo "You can then install manually with:"
echo "  adb install -r $PROJECT/Builds/KawaiiChess.apk"