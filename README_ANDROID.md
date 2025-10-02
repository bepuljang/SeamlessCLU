# Android HMI 실행 가이드

## 빠른 시작

재부팅 후 또는 처음 실행 시:

```bash
./scripts/start-android-hmi.sh
```

## 수동 실행 명령어

각 단계별로 수동 실행이 필요한 경우:

### 1. ADB 연결
```bash
# WiFi ADB 연결
adb connect 172.30.1.83:5555

# 연결 확인
adb devices
```

### 2. 개발 서버 시작
```bash
# Vite 개발 서버 시작
npm run dev

# 또는 기존 프로세스 종료 후 시작
lsof -ti:5173 | xargs kill -9
npm run dev
```

### 3. 포트 포워딩 설정
```bash
# Android의 localhost:5173을 Mac의 localhost:5173으로 연결
adb reverse tcp:5173 tcp:5173

# 포워딩 확인
adb reverse --list
```

### 4. 브라우저 실행
```bash
# Chrome에서 열기
adb shell am start -a android.intent.action.VIEW -d "http://localhost:5173"

# 또는 특정 Chrome 실행
adb shell am start -n com.android.chrome/com.google.android.apps.chrome.Main -d "http://localhost:5173"
```

## 전체화면(키오스크) 모드

### 방법 1: 앱 내 버튼 사용
- 앱 우측 상단의 "Enter Fullscreen" 버튼 클릭

### 방법 2: 키오스크 스크립트 실행
```bash
./scripts/launch-kiosk.sh
```

### 방법 3: PWA 설치
1. Chrome 메뉴 (⋮) 열기
2. "홈 화면에 추가" 선택
3. 설치된 아이콘으로 실행 시 자동 전체화면

## 문제 해결

### 연결이 끊어진 경우
```bash
# 재연결 스크립트 실행
./scripts/start-android-hmi.sh
```

### 포트가 이미 사용 중인 경우
```bash
# 기존 프로세스 종료
lsof -ti:5173 | xargs kill -9

# 서버 재시작
npm run dev
```

### ADB 기기가 오프라인인 경우
```bash
# ADB 재시작
adb kill-server
adb start-server
adb connect 172.30.1.83:5555
```

### 네트워크 직접 접속
포트 포워딩 없이 직접 접속:
```bash
# Android 브라우저에서 직접 입력
http://172.30.1.9:5173
```

## 유용한 명령어

```bash
# 로그 확인
adb logcat | grep -i chrome

# 스크린샷 캡처
adb shell screencap /sdcard/screenshot.png
adb pull /sdcard/screenshot.png

# 화면 녹화 (최대 3분)
adb shell screenrecord /sdcard/demo.mp4
adb pull /sdcard/demo.mp4

# Chrome 캐시 삭제
adb shell pm clear com.android.chrome
```

## 설정 정보

- **개발 서버 포트**: 5173
- **Android 기기 IP**: 172.30.1.83:5555
- **Mac IP**: 172.30.1.9
- **Vite 설정**: 모든 네트워크 인터페이스 허용 (`host: '0.0.0.0'`)
- **PWA 설정**: 전체화면, 가로 모드 고정