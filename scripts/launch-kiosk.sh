#!/bin/bash

# Kill any existing Chrome instances
adb shell am force-stop com.android.chrome

# Clear Chrome cache (optional)
# adb shell pm clear com.android.chrome

# Launch Chrome in fullscreen/immersive mode
adb shell am start \
    -n com.android.chrome/com.google.android.apps.chrome.Main \
    -a android.intent.action.VIEW \
    -d "http://localhost:5173" \
    --es "com.android.browser.application_id" "com.seamless.hmi" \
    --ez "android.webview.suppress_download_bar" true

# Wait for Chrome to load
sleep 2

# Enable immersive mode (hide status bar and navigation bar)
adb shell settings put global policy_control immersive.full=com.android.chrome

# Alternative: Use input keyevents to simulate fullscreen
# F11 equivalent for Android
adb shell input keyevent 122

echo "Launched in kiosk mode at http://localhost:5173"
echo "To exit immersive mode, run: adb shell settings put global policy_control null"