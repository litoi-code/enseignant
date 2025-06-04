# 🇨🇲 French Teacher Classroom Management System

> **Système de Gestion de Classe Professionnel pour Enseignants Camerounais**
> Complete classroom management app with device-specific licensing, data export/import, and freemium business model.

[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-51-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](#license)

## 🇨🇲 Features

### 🏫 **Complete Class Management**
- Support for all Cameroonian education levels (Primaire, Collège, Lycée)
- Class creation with education-specific themes
- Multi-class management capabilities

### 👥 **Student Management**
- Complete student profiles with contact information
- Parent/guardian contact management
- Student performance tracking

### 📚 **Course Scheduling**
- Daily lesson planning and scheduling
- Course status tracking (Planned, In Progress, Completed, Cancelled)
- Subject and classroom assignment
- Time slot management

### 📊 **French Grading System (0-20)**
- Official French grading scale implementation
- Automatic grade appreciation calculation
- Coefficient-based weighted averages
- Performance analytics and statistics

### ✅ **Daily Attendance Tracking**
- Real-time attendance marking
- Multiple status options (Present, Absent, Late, Excused)
- Visual status indicators with color coding
- Daily and historical attendance reports

### 📖 **Interactive User Guide**
- Step-by-step instructions for all features
- Category-based organization
- Professional onboarding experience
- French language support

### 🎨 **Professional Design**
- Cameroonian flag integration
- Modern, clean interface
- Education-level specific color themes
- Professional icons and typography

### 💰 **Business Features (NEW)**
- 🔒 **Device-Specific Licensing** - One code per device (anti-piracy)
- ⏰ **30-Day Trial** - Full month trial period
- ☕ **Coffee Purchase Model** - 2000 FCFA unlock via Mobile Money
- 📱 **Mobile Money Integration** - +237674667234 payment
- 🔄 **License Transfer** - Move between devices securely

### 📤 **Data Export/Import (PREMIUM)**
- 📊 **Complete JSON Export** - All data with metadata
- 📄 **Professional PDF Reports** - Detailed statistics and formatting
- 📈 **CSV Export** - Spreadsheet-compatible grade exports
- 📥 **Full Data Import** - Complete backup and restore
- 🔄 **Cross-Device Transfer** - Move data between devices

## 🔧 Technical Features

### 📱 **Mobile-First Design**
- React Native with Expo
- Cross-platform compatibility (iOS/Android)
- Responsive design for all screen sizes
- Professional tab navigation

### 💾 **Offline Functionality**
- SQLite database for local storage
- Complete offline operation
- Data persistence and reliability
- No internet required for daily use

### 🏗️ **Modern Architecture**
- TypeScript for type safety
- Zustand for state management
- Component-based architecture
- Professional code organization

### 🎯 **Performance Optimized**
- Efficient data handling
- Smooth animations and transitions
- Optimized rendering
- Professional user experience

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/french-teacher-classroom-management.git
   cd french-teacher-classroom-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/emulator**
   - Scan QR code with Expo Go app (iOS/Android)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## 💰 Business Model

### **🆓 Trial System**
- **Duration**: 30 days (1 month)
- **Limitations**: 10 students, 2 classes, 50 grades, 20 courses
- **Export**: Disabled during trial
- **Banner**: Shows remaining days

### **☕ Premium Unlock**
- **Price**: 2000 FCFA via Mobile Money
- **Payment**: +237674667234 (LITOI CODE)
- **Message**: "ENSEIGNANT APP"
- **Delivery**: Unique code via SMS within 24h
- **Device Lock**: One code = one device only

### **✨ Premium Features**
- ✅ **Unlimited**: Students, classes, grades, courses
- ✅ **Export/Import**: Complete data management
- ✅ **PDF Reports**: Professional reporting
- ✅ **Priority Support**: Direct assistance
- ✅ **License Transfer**: Move to new device

### **🏫 Institutional Pricing**
- **5-10 licenses**: 1500 FCFA/license
- **11-25 licenses**: 1200 FCFA/license
- **25+ licenses**: 1000 FCFA/license
- **Training**: Included free

## 🔑 Admin Tools

### **Code Generation System**
```bash
# Mobile generator (recommended for daily use)
open admin/mobileCodeGen.html

# Desktop generator (bulk operations)
open admin/codeGenerator.html

# Command line (automation)
./admin/quickCode.sh +237698765432 "Customer Name" COFFEE
```

### **Customer Management**
- **Track all codes** generated and used
- **SMS templates** for code delivery
- **Support tools** for troubleshooting
- **Revenue tracking** and analytics

## 📖 User Guide

The application includes a comprehensive interactive user guide covering:

1. **🏫 Getting Started** - Class creation and initial setup
2. **👥 Student Management** - Adding and managing student profiles
3. **📚 Course Planning** - Scheduling and organizing lessons
4. **📊 Grade Management** - Using the French 0-20 grading system
5. **✅ Attendance Tracking** - Daily presence management
6. **📈 Analytics** - Understanding statistics and reports

Access the guide through:
- 📖 Help button on the home screen
- Settings → "Guide d'utilisation"

## 📚 Documentation

- **[📖 Unlock Guide](UNLOCK_GUIDE.md)** - Complete user unlock instructions
- **[🔑 Admin Guide](admin/ADMIN_GUIDE.md)** - Code generation and customer management
- **[🛠️ Technical Docs](docs/)** - Implementation details and API reference

## 🎯 Educational Standards

### French Curriculum Compliance
- Official 0-20 grading scale
- French educational terminology
- Standard appreciation levels
- Curriculum-aligned subjects

### Cameroonian Context
- National flag integration
- Local educational practices
- French language interface
- Cultural appropriateness

## 🛠️ Development

### Project Structure
```
├── app/                    # Main application screens
│   ├── (tabs)/            # Tab-based navigation screens
│   └── _layout.tsx        # Root layout configuration
├── components/            # Reusable UI components
├── lib/                   # Business logic and utilities
│   ├── database.ts        # SQLite database setup
│   ├── store.ts          # Zustand state management
│   └── dataAccess.ts     # Data access layer
├── types/                 # TypeScript type definitions
└── constants/            # Theme and styling constants
```

### Key Technologies
- **React Native** - Mobile app framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **SQLite** - Local database
- **Zustand** - State management
- **date-fns** - Date manipulation

## 🤝 Contributing

We welcome contributions to improve the French Teacher Classroom Management System!

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain French language consistency
- Ensure mobile responsiveness
- Add appropriate comments and documentation
- Test on both iOS and Android

## 📄 License and Copyright

**© 2024 Litoi Code. All rights reserved.**

This software is protected by copyright law and is licensed under a **Custom Educational License with Restrictions**.

### **✅ Permitted Uses:**
- ✅ Use in Cameroonian educational institutions (schools, colleges, universities)
- ✅ Installation on teacher devices for classroom management
- ✅ Educational customization within Cameroon
- ✅ Distribution within Cameroonian educational networks
- ✅ Academic research and educational development

### **❌ Restrictions:**
- ❌ Commercial redistribution or sale is strictly prohibited
- ❌ Use outside of Cameroonian educational institutions requires written permission
- ❌ Removal or modification of copyright notices is prohibited
- ❌ Reverse engineering for competitive purposes is prohibited
- ❌ Creating derivative works for commercial distribution is prohibited

### **📋 Attribution Required:**
Any use must include: "Powered by French Teacher Classroom Management System © 2024 Litoi Code"

**For licensing inquiries:** teacher.app@education.cm

See the [LICENSE](LICENSE) file for complete terms and conditions.

## 🙏 Acknowledgments

- Designed for French-speaking teachers in Cameroon
- Built with modern React Native and Expo technologies
- Follows French educational standards and practices
- Inspired by the need for quality educational tools in Africa

## 📞 Support

### **Customer Support**
- **Phone/SMS**: +237674667234
- **Email**: teacher.app@education.cm
- **Hours**: Monday-Friday 8AM-6PM (WAT)

### **Technical Support**
- **Bug Reports**: Create GitHub issue
- **Feature Requests**: Contact support email
- **Documentation**: Check guides first

### **Business Inquiries**
- **Institutional Licensing**: Volume discounts available
- **Custom Development**: Enterprise solutions
- **Partnership**: Distribution opportunities

---

**Made with ❤️ for Cameroonian educators**
