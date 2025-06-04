# 🚀 EAS CLI Build Guide - French Teacher Classroom Management System

## 📱 **Build APK with EAS CLI (Cloud Build)**

### **✅ Prerequisites**

#### **1. Expo Account**
- Create account at: https://expo.dev/
- Free account includes build credits
- No local Android SDK required

#### **2. EAS CLI Installation**
```bash
# Install globally (recommended)
npm install -g eas-cli

# Or use with npx (no installation)
npx eas-cli --version
```

---

## 🛠️ **Step-by-Step Build Process**

### **Step 1: Login to Expo**
```bash
# Login to your Expo account
eas login

# Check if logged in
eas whoami
```

### **Step 2: Configure EAS Build**
```bash
# Configure project for EAS Build (already done)
eas build:configure

# Select "Android" or "All" when prompted
```

### **Step 3: Start APK Build**
```bash
# Build APK (recommended for distribution)
eas build --platform android --profile production

# Alternative: Build AAB for Google Play Store
eas build --platform android --profile production-aab
```

### **Step 4: Monitor Build Progress**
- Build runs in Expo's cloud infrastructure
- Takes 10-20 minutes typically
- Progress shown in terminal
- Build logs available on Expo dashboard

### **Step 5: Download APK**
- Download link provided when build completes
- APK available for 30 days
- Can download multiple times

---

## 📋 **Build Profiles (Already Configured)**

### **Production APK**
```json
"production": {
  "android": {
    "buildType": "apk",
    "gradleCommand": ":app:assembleRelease"
  }
}
```

### **Production AAB (Google Play)**
```json
"production-aab": {
  "android": {
    "buildType": "app-bundle",
    "gradleCommand": ":app:bundleRelease"
  }
}
```

### **Preview Build**
```json
"preview": {
  "distribution": "internal",
  "android": {
    "buildType": "apk",
    "gradleCommand": ":app:assembleRelease"
  }
}
```

---

## 🎯 **Quick Commands**

### **Build APK for Distribution**
```bash
eas build --platform android --profile production
```

### **Build AAB for Google Play**
```bash
eas build --platform android --profile production-aab
```

### **Build Preview APK**
```bash
eas build --platform android --profile preview
```

### **Check Build Status**
```bash
eas build:list
```

### **View Build Details**
```bash
eas build:view [BUILD_ID]
```

---

## 🔧 **Automated Build Scripts**

### **Windows**
```bash
# Run automated EAS build
scripts\build-eas.bat
```

### **Mac/Linux**
```bash
# Run automated EAS build
./scripts/build-eas.sh
```

---

## 📊 **Build Information**

### **Expected Output**
- **File**: `Enseignant-ClassroomManagement-v1.0.0.apk`
- **Size**: ~50-80 MB
- **Package**: `com.litoicode.enseignant`
- **Min Android**: 6.0 (API 23)
- **Target Android**: 14 (API 34)

### **Build Features**
- ✅ **Device-specific licensing**
- ✅ **30-day trial system**
- ✅ **Export/Import functionality**
- ✅ **Mobile Money integration**
- ✅ **Offline capability**
- ✅ **French localization**

---

## 🎉 **Build Success**

### **What You Get**
1. **Download Link**: Direct APK download
2. **Build Artifacts**: Available on Expo dashboard
3. **Build Logs**: Detailed build information
4. **QR Code**: For easy device installation

### **Next Steps**
1. **Download APK** from provided link
2. **Test on Android devices**
3. **Distribute to customers**
4. **Use admin tools** for code generation

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **"Not logged in"**
```bash
eas login
# Enter your Expo credentials
```

#### **"Project not configured"**
```bash
eas build:configure
# Select Android platform
```

#### **"Build failed"**
- Check build logs on Expo dashboard
- Verify app.json configuration
- Check for dependency issues

#### **"No build credits"**
- Free accounts get limited builds
- Upgrade to paid plan for unlimited builds
- Or wait for monthly credit reset

### **Build Optimization**

#### **Faster Builds**
- Use `--profile preview` for testing
- Cache dependencies when possible
- Optimize bundle size

#### **Smaller APK**
- Enable ProGuard (already configured)
- Use APK splits for different architectures
- Remove unused dependencies

---

## 💰 **Cost Information**

### **Free Tier**
- **Android builds**: Limited per month
- **Build time**: Standard priority
- **Storage**: 30 days

### **Paid Plans**
- **Unlimited builds**: $99/month
- **Priority builds**: Faster queue
- **Extended storage**: Longer retention

---

## 📱 **Testing the APK**

### **Installation Methods**
```bash
# Install via ADB
adb install Enseignant-ClassroomManagement-v1.0.0.apk

# Or scan QR code provided by EAS
# Or transfer file to device manually
```

### **Test Checklist**
- [ ] App launches successfully
- [ ] Trial banner shows 30 days
- [ ] Can create classes and students
- [ ] Test unlock codes work
- [ ] Export/Import functions (premium)
- [ ] Offline functionality works
- [ ] French text displays correctly

---

## 🌐 **Distribution Options**

### **Direct Distribution**
1. **Upload APK** to file hosting
2. **Share download link** with customers
3. **Provide installation instructions**

### **Google Play Store**
1. **Build AAB** with production-aab profile
2. **Upload to Play Console**
3. **Complete store listing**
4. **Submit for review**

---

## 📞 **Support**

### **EAS Build Issues**
- **Expo Documentation**: https://docs.expo.dev/build/
- **Community Forum**: https://forums.expo.dev/
- **Discord**: https://chat.expo.dev/

### **App-Specific Issues**
- **Email**: teacher.app@education.cm
- **Phone**: +237674667234

---

## 🎯 **Summary**

### **EAS CLI Commands**
```bash
# 1. Login
eas login

# 2. Build APK
eas build --platform android --profile production

# 3. Download and distribute
# Use provided download link
```

### **Expected Timeline**
- **Setup**: 5 minutes
- **Build**: 10-20 minutes
- **Download**: 1 minute
- **Total**: ~30 minutes

---

**🎉 Your French Teacher Classroom Management System will be built in the cloud with professional-grade infrastructure!**

**The APK will include all premium features, device-specific licensing, and be ready for distribution to Cameroonian teachers.** 🇨🇲📱💰

---

**© 2024 Litoi Code - Professional EAS Build Process**
