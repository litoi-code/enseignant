#!/bin/bash

# Quick Code Generator for French Teacher Classroom Management System
# Usage: ./quickCode.sh [phone_number] [customer_name] [pattern]
# © 2024 Litoi Code

echo "🔑 Quick Code Generator - Enseignant App"
echo "========================================"

# Default values
PHONE=${1:-"+237674667234"}
NAME=${2:-"Customer"}
PATTERN=${3:-"COFFEE"}

# Generate timestamp and random components
TIMESTAMP=$(date +%s | tail -c 6)
RANDOM_PART=$(printf "%04X" $RANDOM)
HASH_PART=$(echo -n "$PHONE$NAME" | cksum | cut -d' ' -f1 | tail -c 4)

# Generate the code
CODE="${PATTERN}_${HASH_PART}_${TIMESTAMP}_${RANDOM_PART}"

echo ""
echo "✅ Code généré avec succès !"
echo "📱 Client: $NAME ($PHONE)"
echo "🔑 Code: $CODE"
echo "📅 Généré le: $(date '+%d/%m/%Y à %H:%M')"
echo ""

# Generate SMS template
SMS_MESSAGE="🎉 Merci pour votre soutien !

Votre code de déblocage ENSEIGNANT APP:
$CODE

⚠️ IMPORTANT: Ce code fonctionne sur 1 appareil uniquement.

Instructions:
1. Ouvrez l'app sur VOTRE appareil
2. Appuyez \"☕ Upgrade\"
3. Entrez: $CODE
4. Appuyez \"Débloquer\"

🔒 Sécurisé: Impossible de partager le code

Support: +237674667234
© 2024 Litoi Code"

echo "📱 Message SMS à envoyer:"
echo "========================"
echo "$SMS_MESSAGE"
echo ""

# Save to log file
LOG_FILE="codes_generated.log"
echo "$(date '+%Y-%m-%d %H:%M:%S') | $PHONE | $NAME | $CODE | $PATTERN" >> $LOG_FILE

echo "💾 Code sauvegardé dans: $LOG_FILE"
echo ""

# Copy to clipboard if available
if command -v pbcopy &> /dev/null; then
    echo "$CODE" | pbcopy
    echo "📋 Code copié dans le presse-papiers (macOS)"
elif command -v xclip &> /dev/null; then
    echo "$CODE" | xclip -selection clipboard
    echo "📋 Code copié dans le presse-papiers (Linux)"
elif command -v clip &> /dev/null; then
    echo "$CODE" | clip
    echo "📋 Code copié dans le presse-papiers (Windows)"
fi

echo ""
echo "🎯 Utilisation:"
echo "./quickCode.sh +237698765432 \"Marie Dupont\" TEACHER"
echo "./quickCode.sh +237612345678 \"Lycee Douala\" SCHOOL"
