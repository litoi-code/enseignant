#!/bin/bash

# APK Build Script for French Teacher Classroom Management System
# © 2024 Litoi Code

echo "🏗️ Building APK for French Teacher Classroom Management System"
echo "=============================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Android SDK is available
if [ -z "$ANDROID_HOME" ]; then
    print_warning "ANDROID_HOME not set. Please install Android SDK."
    print_warning "Download from: https://developer.android.com/studio"
fi

# Check if Java is available
if ! command -v java &> /dev/null; then
    print_warning "Java not found. Please install Java JDK 11 or higher."
fi

print_status "Starting APK build process..."

# Step 1: Install dependencies
print_status "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 2: Pre-build Android
print_status "Pre-building Android project..."
npx expo prebuild --platform android --clear
if [ $? -ne 0 ]; then
    print_error "Failed to prebuild Android project"
    exit 1
fi

# Step 3: Build APK
print_status "Building release APK..."
cd android

# Build using Gradle
if command -v ./gradlew &> /dev/null; then
    print_status "Using project Gradle wrapper..."
    ./gradlew assembleRelease
elif command -v gradle &> /dev/null; then
    print_status "Using system Gradle..."
    gradle assembleRelease
else
    print_error "Gradle not found. Please install Gradle or use Android Studio."
    exit 1
fi

if [ $? -eq 0 ]; then
    print_success "APK built successfully!"
    
    # Find the APK file
    APK_PATH=$(find . -name "*.apk" -path "*/outputs/apk/release/*" | head -1)
    
    if [ -n "$APK_PATH" ]; then
        print_success "APK location: $APK_PATH"
        
        # Copy APK to project root with descriptive name
        APK_NAME="Enseignant-ClassroomManagement-v1.0.0-release.apk"
        cp "$APK_PATH" "../$APK_NAME"
        
        print_success "APK copied to: $APK_NAME"
        
        # Get APK size
        APK_SIZE=$(du -h "../$APK_NAME" | cut -f1)
        print_success "APK size: $APK_SIZE"
        
        echo ""
        echo "🎉 Build completed successfully!"
        echo "📱 APK file: $APK_NAME"
        echo "📦 Size: $APK_SIZE"
        echo ""
        echo "📋 Next steps:"
        echo "1. Test the APK on Android devices"
        echo "2. Upload to Google Play Console (if publishing)"
        echo "3. Distribute to users via direct download"
        echo ""
        echo "🔒 Security note:"
        echo "This APK includes device-specific licensing system"
        echo "Each unlock code works on one device only"
        
    else
        print_error "APK file not found in expected location"
        exit 1
    fi
else
    print_error "Failed to build APK"
    exit 1
fi

cd ..

print_success "Build script completed!"
