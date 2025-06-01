#!/usr/bin/env node

/**
 * Build APK Script for French Teacher Classroom Management System
 * This script helps build the APK using Expo CLI
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎓 Building French Teacher Classroom Management System APK...\n');

// Check if required files exist
const requiredFiles = ['app.json', 'package.json'];
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Required file ${file} not found!`);
    process.exit(1);
  }
}

console.log('✅ Required files found');

// Read app configuration
const appConfig = JSON.parse(fs.readFileSync('app.json', 'utf8'));
console.log(`📱 App: ${appConfig.expo.name}`);
console.log(`📦 Version: ${appConfig.expo.version}`);
console.log(`🏷️  Package: ${appConfig.expo.android?.package || 'com.enseignant.classroommanagement'}`);

console.log('\n🔧 Build Options:');
console.log('1. EAS Build (Cloud) - Recommended');
console.log('2. Local Build (Requires Android SDK)');
console.log('3. Expo Build (Legacy)');

console.log('\n📋 Instructions:');
console.log('');
console.log('🌐 Option 1: EAS Build (Recommended)');
console.log('   Run: npx eas build --platform android --profile preview');
console.log('   - Builds in the cloud');
console.log('   - No local Android SDK required');
console.log('   - Requires Expo account');
console.log('');
console.log('🏠 Option 2: Local Build');
console.log('   Run: npx expo run:android --variant release');
console.log('   - Requires Android SDK and Android Studio');
console.log('   - Builds locally on your machine');
console.log('');
console.log('🔄 Option 3: Expo Build (Legacy)');
console.log('   Run: npx expo build:android --type apk');
console.log('   - Legacy build service');
console.log('   - May be deprecated');
console.log('');

console.log('🎯 For immediate APK creation, we recommend Option 1 (EAS Build)');
console.log('');
console.log('📱 The APK will be compatible with:');
console.log('   - Android 6.0+ (API level 23+)');
console.log('   - ARM and x86 architectures');
console.log('   - Offline functionality included');
console.log('');
console.log('🇨🇲 Features included in APK:');
console.log('   ✅ Cameroonian flag integration');
console.log('   ✅ French 0-20 grading system');
console.log('   ✅ Complete classroom management');
console.log('   ✅ Offline SQLite database');
console.log('   ✅ Interactive user guide');
console.log('   ✅ Professional UI/UX');
console.log('');
console.log('🚀 Ready to build your French Teacher Classroom Management System!');
