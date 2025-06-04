@echo off
REM EAS Build Script for French Teacher Classroom Management System
REM © 2024 Litoi Code

echo 🚀 Building APK with EAS CLI
echo ============================

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

echo [INFO] Starting EAS build process...

REM Step 1: Install EAS CLI
echo [INFO] Installing EAS CLI...
call npm install -g @expo/eas-cli
if errorlevel 1 (
    echo [WARNING] Failed to install EAS CLI globally, trying with npx...
    set EAS_CMD=npx @expo/eas-cli
) else (
    set EAS_CMD=eas
)

REM Step 2: Check EAS CLI version
echo [INFO] Checking EAS CLI version...
call %EAS_CMD% --version

REM Step 3: Login to Expo (if not already logged in)
echo [INFO] Checking Expo authentication...
call %EAS_CMD% whoami
if errorlevel 1 (
    echo [INFO] Please login to your Expo account...
    call %EAS_CMD% login
    if errorlevel 1 (
        echo [ERROR] Failed to login to Expo. Please check your credentials.
        pause
        exit /b 1
    )
)

REM Step 4: Configure EAS project (if needed)
echo [INFO] Configuring EAS project...
if not exist "eas.json" (
    echo [INFO] Creating EAS configuration...
    call %EAS_CMD% build:configure
) else (
    echo [SUCCESS] EAS configuration already exists.
)

REM Step 5: Build APK
echo [INFO] Starting APK build...
echo [WARNING] This will build in the cloud and may take 10-20 minutes...

call %EAS_CMD% build --platform android --profile production --non-interactive

if errorlevel 1 (
    echo [ERROR] APK build failed. Please check the error messages above.
    pause
    exit /b 1
)

echo [SUCCESS] APK build completed successfully!

echo.
echo 🎉 Build completed!
echo 📱 Your APK has been built in the cloud
echo 📥 Download link will be provided by EAS CLI
echo.
echo 📋 Next steps:
echo 1. Download the APK from the provided link
echo 2. Test on Android devices
echo 3. Distribute to users
echo.
echo 🔒 Security features included:
echo • Device-specific licensing
echo • 30-day trial system
echo • Export/Import functionality
echo • Mobile Money integration

echo [SUCCESS] EAS build script completed!
pause
