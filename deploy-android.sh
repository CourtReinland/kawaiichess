#!/bin/bash
# Build the web app, package it with Capacitor, and install on the attached
# Android device. Uses Unity's bundled JDK + Android SDK.
set -euo pipefail
cd "$(dirname "$0")"

UNITY_PLAYER=/Applications/Unity/Hub/Editor/6000.3.10f1/PlaybackEngines/AndroidPlayer
export JAVA_HOME="$UNITY_PLAYER/OpenJDK"
export ANDROID_HOME="$UNITY_PLAYER/SDK"
export GRADLE_USER_HOME="$PWD/.gradle-home"
ADB="$ANDROID_HOME/platform-tools/adb"

echo "==> Building web assets"
npm run build

echo "==> Syncing Capacitor"
npx cap sync android

echo "==> Building APK"
(cd android && echo "sdk.dir=$ANDROID_HOME" > local.properties && ./gradlew assembleDebug --no-daemon)

APK=android/app/build/outputs/apk/debug/app-debug.apk
echo "==> Installing $APK"
"$ADB" install -r "$APK"

echo "==> Launching"
"$ADB" shell monkey -p com.courtreinland.kawaiichess -c android.intent.category.LAUNCHER 1 >/dev/null
echo "Done! Kawaii Chess is running on the device. ♟✨"
