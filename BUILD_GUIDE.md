# 🏗️ APK Build Guide - French Teacher Classroom Management System

## 📱 **Generate Production APK**

### **🚀 Quick Build (Recommended)**

#### **Windows Users**
```bash
# Run the automated build script
scripts\build-apk.bat
```

#### **Mac/Linux Users**
```bash
# Run the automated build script
./scripts/build-apk.sh
```

---

## 🛠️ **Manual Build Process**

### **Prerequisites**

#### **Required Software**
1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **Android Studio** (for Android SDK)
   - Download: https://developer.android.com/studio
   - Install Android SDK (API 34)
   - Set ANDROID_HOME environment variable

3. **Java JDK** (v11 or higher)
   - Download: https://adoptium.net/
   - Verify: `java --version`

#### **Environment Setup**
```bash
# Set Android SDK path (Windows)
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk

# Set Android SDK path (Mac/Linux)
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

---

## 📋 **Step-by-Step Build Process**

### **Step 1: Prepare Project**
```bash
# Clone repository (if not already done)
git clone https://github.com/your-username/french-teacher-app.git
cd french-teacher-app

# Install dependencies
npm install

# Install Expo CLI (if not installed)
npm install -g @expo/cli
```

### **Step 2: Configure for Production**
```bash
# Update app version (optional)
# Edit app.json -> version and android.versionCode

# Pre-build Android project
npx expo prebuild --platform android --clear
```

### **Step 3: Build APK**
```bash
# Navigate to Android directory
cd android

# Build release APK using Gradle
./gradlew assembleRelease  # Mac/Linux
gradlew.bat assembleRelease  # Windows
```

### **Step 4: Locate APK**
```bash
# APK will be generated at:
android/app/build/outputs/apk/release/app-release.apk

# Copy to project root with descriptive name
cp android/app/build/outputs/apk/release/app-release.apk ./Enseignant-ClassroomManagement-v1.0.0.apk
```

---

## 🎯 **Alternative Build Methods**

### **Method 1: EAS Build (Cloud)**
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Build APK in cloud
eas build --platform android --profile production
```

### **Method 2: Expo Development Build**
```bash
# Create development build
npx expo run:android --variant release
```

### **Method 3: Android Studio**
1. Open `android` folder in Android Studio
2. Select "Build" → "Generate Signed Bundle/APK"
3. Choose "APK" and follow wizard
4. Select "release" build variant

---

## 📦 **Build Outputs**

### **APK Information**
- **File Name**: `Enseignant-ClassroomManagement-v1.0.0.apk`
- **Package**: `com.litoicode.enseignant`
- **Version**: 1.0.0 (versionCode: 1)
- **Min SDK**: Android 6.0 (API 23)
- **Target SDK**: Android 14 (API 34)
- **Size**: ~50-80 MB (estimated)

### **Features Included**
- ✅ **Complete Classroom Management**
- ✅ **Device-Specific Licensing**
- ✅ **30-Day Trial System**
- ✅ **Export/Import Functionality**
- ✅ **Offline Capability**
- ✅ **French Localization**

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **"ANDROID_HOME not set"**
```bash
# Windows
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk

# Mac/Linux
export ANDROID_HOME=$HOME/Android/Sdk
```

#### **"Java not found"**
- Install Java JDK 11 or higher
- Verify with `java --version`

#### **"Gradle build failed"**
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew assembleRelease
```

#### **"Out of memory"**
```bash
# Increase Gradle memory
echo "org.gradle.jvmargs=-Xmx4096m" >> android/gradle.properties
```

### **Build Optimization**

#### **Reduce APK Size**
```bash
# Enable ProGuard (already configured)
# Enable resource shrinking (already configured)
# Use APK splits for different architectures
```

#### **Faster Builds**
```bash
# Use Gradle daemon
echo "org.gradle.daemon=true" >> android/gradle.properties

# Parallel builds
echo "org.gradle.parallel=true" >> android/gradle.properties
```

---

## 📱 **Testing the APK**

### **Installation**
```bash
# Install via ADB
adb install Enseignant-ClassroomManagement-v1.0.0.apk

# Or transfer to device and install manually
```

### **Testing Checklist**
- [ ] App launches successfully
- [ ] Trial banner appears
- [ ] Can create classes and students
- [ ] License system works (try test codes)
- [ ] Export/Import functions (premium only)
- [ ] Offline functionality
- [ ] French text displays correctly

---

## 🚀 **Distribution**

### **Direct Distribution**
1. **Upload APK** to file hosting service
2. **Share download link** with customers
3. **Provide installation instructions**

### **Google Play Store**
1. **Create developer account** ($25 one-time fee)
2. **Upload APK** to Play Console
3. **Complete store listing**
4. **Submit for review**

### **Alternative Stores**
- **APKPure**
- **F-Droid** (open source only)
- **Samsung Galaxy Store**
- **Amazon Appstore**

---

## 🔒 **Security Notes**

### **APK Signing**
- APK is automatically signed with debug key for testing
- For production, use release keystore
- Keep keystore file secure and backed up

### **License Protection**
- Device-specific licensing implemented
- Anti-piracy measures included
- Unique codes per customer

### **Data Security**
- All data stored locally on device
- No cloud data transmission
- User privacy protected

---

## 📞 **Support**

### **Build Issues**
- **Email**: teacher.app@education.cm
- **Phone**: +237674667234

### **Technical Documentation**
- **React Native**: https://reactnative.dev/docs/signed-apk-android
- **Expo**: https://docs.expo.dev/build/setup/
- **Android**: https://developer.android.com/studio/build/

---

**© 2024 Litoi Code - French Teacher Classroom Management System**

*Professional APK build process for Cameroonian educators*
