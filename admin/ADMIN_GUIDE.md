# 🔑 Admin Guide - Code Generation System

## 📱 **How to Generate Unique Codes for Each Customer**

### **🚀 Quick Start (3 Methods)**

#### **Method 1: Mobile Web Interface (Recommended)**
1. Open `admin/mobileCodeGen.html` on your phone
2. Enter customer phone number
3. Tap "Générer le Code"
4. Copy code and send SMS directly

#### **Method 2: Desktop Web Interface**
1. Open `admin/codeGenerator.html` in browser
2. Fill customer details
3. Generate code with SMS template
4. Copy and send to customer

#### **Method 3: Command Line (Advanced)**
```bash
./admin/quickCode.sh +237674667234 "Marie Dupont" COFFEE
```

---

## 💰 **Daily Workflow**

### **When You Receive Payment**

#### **Step 1: Verify Payment**
- ✅ Amount: 2000 FCFA
- ✅ Number: +237674667234
- ✅ Message: "ENSEIGNANT APP"

#### **Step 2: Generate Code**
1. **Open mobile generator**: `admin/mobileCodeGen.html`
2. **Enter phone number**: Customer's number
3. **Select type**: Usually "COFFEE"
4. **Generate**: Tap the button

#### **Step 3: Send Code**
1. **Copy generated code**
2. **Use SMS template** (auto-generated)
3. **Send to customer**
4. **Mark as sent**

---

## 🔑 **Code Types & Patterns**

### **Standard Codes**
- **COFFEE_XXX**: Regular customers (2000 FCFA)
- **TEACH_XXX**: Teachers/Educators
- **SCHOOL_XXX**: Educational institutions
- **PREMIUM_XXX**: Premium customers

### **Code Format**
```
PATTERN_HASH_TIMESTAMP_RANDOM
Example: COFFEE_A1B_1K2M3N_X9Y8
```

### **Code Properties**
- **Unique**: Each code is mathematically unique
- **Traceable**: Contains customer hash for identification
- **Secure**: Cannot be guessed or duplicated
- **Device-locked**: Works on one device only

---

## 📊 **Customer Management**

### **Customer Types**

#### **Individual (1 device)**
- **Price**: 2000 FCFA
- **Code**: COFFEE_XXX
- **Devices**: 1 only

#### **Teacher (1 device)**
- **Price**: 2000 FCFA
- **Code**: TEACH_XXX
- **Devices**: 1 only

#### **School (5 devices)**
- **Price**: 8000 FCFA (1600/device)
- **Code**: SCHOOL_XXX
- **Devices**: 5 maximum

---

## 🔧 **Troubleshooting Customer Issues**

### **"Code already used"**
**Customer says**: "Le code ne marche pas, il dit déjà utilisé"

**Your response**:
```
Bonjour,

Votre code est déjà activé sur un autre appareil. 
Chaque code fonctionne sur un seul appareil.

Solutions:
1. Utilisez l'appareil original
2. Transférez la licence:
   - Ancien appareil: Paramètres → Licence → Désactiver
   - Nouvel appareil: Entrez le même code
3. Nouveau code pour nouvel appareil (2000 FCFA)

Support: +237674667234
```

### **"Want to change device"**
**Customer says**: "Je veux utiliser sur mon nouveau téléphone"

**Your options**:
1. **Free transfer**: Guide them through deactivation process
2. **New code**: Sell new code for new device (2000 FCFA)
3. **Support**: Help them transfer manually

### **"Lost device"**
**Customer says**: "J'ai perdu mon téléphone"

**Your response**:
1. **Generate new code** (charge 1000 FCFA for replacement)
2. **Deactivate old device** (if possible)
3. **Send new code** with instructions

---

## 📱 **SMS Templates**

### **Standard Code Delivery**
```
🎉 Merci pour votre soutien !

Votre code ENSEIGNANT APP:
[CODE]

⚠️ Ce code fonctionne sur 1 appareil uniquement.

Instructions:
1. Ouvrez l'app
2. Appuyez "☕ Upgrade"
3. Entrez: [CODE]
4. Appuyez "Débloquer"

Support: +237674667234
© 2024 Litoi Code
```

### **School/Institution Code**
```
🏫 Code École - ENSEIGNANT APP

Code institution: [CODE]
Appareils autorisés: 5

Instructions pour chaque enseignant:
1. Installer l'app
2. Appuyer "☕ Upgrade"
3. Entrer: [CODE]
4. Débloquer

Formation disponible: +237674667234
© 2024 Litoi Code
```

### **Transfer Instructions**
```
🔄 Transfert de licence

Pour transférer vers nouvel appareil:

1. Ancien appareil:
   - Paramètres → Licence → Désactiver

2. Nouvel appareil:
   - Entrer le même code: [CODE]

Besoin d'aide? +237674667234
```

---

## 📈 **Business Analytics**

### **Daily Tracking**
- **Codes generated**: Track in web interface
- **Revenue**: 2000 FCFA × codes
- **Customer types**: Individual vs School
- **Support requests**: Track common issues

### **Monthly Reports**
- **Total revenue**: Sum of all payments
- **Active licenses**: Number of active devices
- **Customer satisfaction**: Support ticket resolution
- **Growth rate**: Month-over-month increase

---

## 🎯 **Best Practices**

### **Code Generation**
1. **Always verify payment** before generating
2. **Use customer phone** as identifier
3. **Send within 24 hours** of payment
4. **Keep records** of all generated codes

### **Customer Service**
1. **Respond quickly** to support requests
2. **Be helpful** with device transfers
3. **Explain limitations** clearly
4. **Offer solutions** for problems

### **Security**
1. **Never share** admin tools
2. **Keep code logs** secure
3. **Monitor for abuse** patterns
4. **Report suspicious** activity

---

## 🔗 **Quick Links**

- **Mobile Generator**: `admin/mobileCodeGen.html`
- **Desktop Generator**: `admin/codeGenerator.html`
- **Command Line**: `./admin/quickCode.sh`
- **Code Logs**: `admin/codes_generated.log`

---

## 📞 **Emergency Contacts**

- **Your Number**: +237674667234
- **Support Email**: teacher.app@education.cm
- **Business Hours**: Monday-Friday 8AM-6PM

---

**© 2024 Litoi Code - Admin Guide v1.0**
