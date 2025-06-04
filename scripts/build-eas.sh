#!/bin/bash

# EAS Build Script for French Teacher Classroom Management System
# © 2024 Litoi Code

echo "🚀 Building APK with EAS CLI"
echo "============================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_status "Starting EAS build process..."

# Step 1: Install EAS CLI
print_status "Installing EAS CLI..."
npm install -g @expo/eas-cli
if [ $? -ne 0 ]; then
    print_warning "Failed to install EAS CLI globally, trying with npx..."
fi

# Step 2: Check EAS CLI version
print_status "Checking EAS CLI version..."
if command -v eas &> /dev/null; then
    eas --version
    EAS_CMD="eas"
else
    print_warning "Using npx to run EAS CLI..."
    npx @expo/eas-cli --version
    EAS_CMD="npx @expo/eas-cli"
fi

# Step 3: Login to Expo (if not already logged in)
print_status "Checking Expo authentication..."
$EAS_CMD whoami
if [ $? -ne 0 ]; then
    print_status "Please login to your Expo account..."
    $EAS_CMD login
    if [ $? -ne 0 ]; then
        print_error "Failed to login to Expo. Please check your credentials."
        exit 1
    fi
fi

# Step 4: Configure EAS project (if needed)
print_status "Configuring EAS project..."
if [ ! -f "eas.json" ]; then
    print_status "Creating EAS configuration..."
    $EAS_CMD build:configure
else
    print_success "EAS configuration already exists."
fi

# Step 5: Build APK
print_status "Starting APK build..."
print_warning "This will build in the cloud and may take 10-20 minutes..."

$EAS_CMD build --platform android --profile production --non-interactive

if [ $? -eq 0 ]; then
    print_success "APK build completed successfully!"
    
    echo ""
    echo "🎉 Build completed!"
    echo "📱 Your APK has been built in the cloud"
    echo "📥 Download link will be provided by EAS CLI"
    echo ""
    echo "📋 Next steps:"
    echo "1. Download the APK from the provided link"
    echo "2. Test on Android devices"
    echo "3. Distribute to users"
    echo ""
    echo "🔒 Security features included:"
    echo "• Device-specific licensing"
    echo "• 30-day trial system"
    echo "• Export/Import functionality"
    echo "• Mobile Money integration"
    
else
    print_error "APK build failed. Please check the error messages above."
    exit 1
fi

print_success "EAS build script completed!"
