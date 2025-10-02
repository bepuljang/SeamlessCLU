#!/bin/bash

echo "🚀 Starting Android HMI Setup..."

# 1. ADB 기기 연결 확인
echo "📱 Checking ADB connection..."
adb connect 172.30.1.83:5555
sleep 2

# 기기 연결 상태 확인
if ! adb devices | grep -q "172.30.1.83:5555.*device"; then
    echo "❌ Device not connected. Please check your Android device."
    echo "   Make sure USB debugging or WiFi debugging is enabled."
    exit 1
fi

echo "✅ Device connected"

# 2. 개발 서버 확인 및 시작
echo "🔧 Checking development server..."
if ! curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "Starting Vite development server..."
    # 기존 프로세스 종료
    lsof -ti:5173 | xargs kill -9 2>/dev/null
    # 백그라운드로 서버 시작
    npm run dev &
    echo "Waiting for server to start..."
    sleep 5
else
    echo "✅ Development server already running"
fi

# 3. 포트 포워딩 설정
echo "🔌 Setting up port forwarding..."
adb reverse tcp:5173 tcp:5173

# 포워딩 확인
if adb reverse --list | grep -q "tcp:5173"; then
    echo "✅ Port forwarding established"
else
    echo "❌ Failed to set up port forwarding"
    exit 1
fi

# 4. Chrome 브라우저 실행
echo "🌐 Launching Chrome browser..."
adb shell am start \
    -n com.android.chrome/com.google.android.apps.chrome.Main \
    -a android.intent.action.VIEW \
    -d "http://localhost:5173"

echo ""
echo "✨ Setup complete!"
echo ""
echo "📝 Quick Commands:"
echo "  • Fullscreen: Click 'Enter Fullscreen' button in the app"
echo "  • Stop server: Press Ctrl+C or run 'lsof -ti:5173 | xargs kill -9'"
echo "  • Reconnect: Run this script again"
echo "  • Network URL: http://172.30.1.9:5173"
echo ""
echo "🔄 If connection lost after reboot, just run: ./scripts/start-android-hmi.sh"