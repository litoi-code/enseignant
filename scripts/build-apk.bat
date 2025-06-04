@echo off
REM APK Build Script for French Teacher Classroom Management System
REM © 2024 Litoi Code

echo 🏗️ Building APK for French Teacher Classroom Management System
echo ==============================================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Check if Android SDK is available
if "%ANDROID_HOME%"=="" (
    echo [WARNING] ANDROID_HOME not set. Please install Android SDK.
    echo [WARNING] Download from: https://developer.android.com/studio
)

REM Check if Java is available
java -version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Java not found. Please install Java JDK 11 or higher.
)

echo [INFO] Starting APK build process...

REM Step 1: Install dependencies
echo [INFO] Installing dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

REM Step 2: Pre-build Android
echo [INFO] Pre-building Android project...
call npx expo prebuild --platform android --clear
if errorlevel 1 (
    echo [ERROR] Failed to prebuild Android project
    pause
    exit /b 1
)

REM Step 3: Build APK
echo [INFO] Building release APK...
cd android

REM Build using Gradle
if exist "gradlew.bat" (
    echo [INFO] Using project Gradle wrapper...
    call gradlew.bat assembleRelease
) else (
    echo [INFO] Using system Gradle...
    call gradle assembleRelease
)

if errorlevel 1 (
    echo [ERROR] Failed to build APK
    cd ..
    pause
    exit /b 1
)

echo [SUCCESS] APK built successfully!

REM Find and copy APK
for /r %%i in (*.apk) do (
    if "%%~nxi" neq "" (
        set APK_PATH=%%i
        goto :found_apk
    )
)

:found_apk
if defined APK_PATH (
    echo [SUCCESS] APK found: %APK_PATH%
    
    REM Copy APK to project root with descriptive name
    set APK_NAME=Enseignant-ClassroomManagement-v1.0.0-release.apk
    copy "%APK_PATH%" "..\%APK_NAME%"
    
    echo [SUCCESS] APK copied to: %APK_NAME%
    
    echo.
    echo 🎉 Build completed successfully!
    echo 📱 APK file: %APK_NAME%
    echo.
    echo 📋 Next steps:
    echo 1. Test the APK on Android devices
    echo 2. Upload to Google Play Console (if publishing)
    echo 3. Distribute to users via direct download
    echo.
    echo 🔒 Security note:
    echo This APK includes device-specific licensing system
    echo Each unlock code works on one device only
    
) else (
    echo [ERROR] APK file not found
    cd ..
    pause
    exit /b 1
)

cd ..

echo [SUCCESS] Build script completed!
pause
