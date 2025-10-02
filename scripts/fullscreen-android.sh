#!/bin/bash

echo "🎯 Enabling Android Fullscreen/Kiosk Mode..."

# Method 1: Hide status bar
echo "Hiding status bar..."
adb shell settings put global policy_control immersive.status=com.android.chrome

# Method 2: Hide navigation bar
echo "Hiding navigation bar..."
adb shell settings put global policy_control immersive.navigation=com.android.chrome

# Method 3: Full immersive mode (hide both)
echo "Enabling full immersive mode..."
adb shell settings put global policy_control immersive.full=com.android.chrome

# Method 4: Alternative - using wm command to overscan
# This pushes the UI elements off screen
echo "Setting overscan to hide system UI..."
adb shell wm overscan 0,0,0,-50

# Method 5: Set Chrome to full screen via activity manager
echo "Launching Chrome in fullscreen..."
adb shell am start -n com.android.chrome/com.google.android.apps.chrome.Main \
    -a android.intent.action.VIEW \
    -d "http://localhost:5173" \
    --ei com.android.chrome.EXTRA_OPEN_NEW_INCOGNITO_TAB 0

# Send F11 key event (fullscreen toggle)
sleep 2
echo "Sending fullscreen key event..."
adb shell input keyevent 122

echo ""
echo "✅ Fullscreen mode enabled!"
echo ""
echo "To restore normal mode, run:"
echo "  adb shell settings put global policy_control null"
echo "  adb shell wm overscan reset"
echo ""
echo "Alternative methods if this doesn't work:"
echo "1. Swipe up from bottom to show navigation temporarily"
echo "2. Use the in-app fullscreen button"
echo "3. Install app as PWA from Chrome menu"