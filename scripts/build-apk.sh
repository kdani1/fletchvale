#!/usr/bin/env bash
set -euo pipefail
export JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/java-21-openjdk-amd64}"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/android-sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
npm run build
npx cap sync android
cd android
./gradlew assembleRelease
APK="$ROOT/android/app/build/outputs/apk/release/app-release.apk"
cp -f "$APK" "$ROOT/public/Nyilvölgy.apk"
mkdir -p /opt/cursor/artifacts
cp -f "$APK" /opt/cursor/artifacts/Nyilvölgy.apk
echo "APK: $APK"
ls -lh "$APK" "$ROOT/public/Nyilvölgy.apk"
