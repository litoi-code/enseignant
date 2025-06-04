import CopyrightNotice from '@/components/CopyrightNotice';
import DataExportImportComponent from '@/components/DataExportImport';
import UserGuide from '@/components/UserGuide';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [showUserGuide, setShowUserGuide] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Paramètres</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Langue</Text>
            <Text style={styles.settingValue}>Français</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Thème</Text>
            <Text style={styles.settingValue}>Automatique</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Système de notation</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Échelle de notation</Text>
            <Text style={styles.settingValue}>0-20</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Note de passage</Text>
            <Text style={styles.settingValue}>10/20</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Coefficient par défaut</Text>
            <Text style={styles.settingValue}>1.0</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sauvegarde et Export</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowDataExport(true)}
          >
            <Text style={styles.settingLabel}>📤 Export / Import des données</Text>
            <Text style={styles.settingValue}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Sauvegarde automatique</Text>
            <Text style={styles.settingValue}>Activée</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Fréquence</Text>
            <Text style={styles.settingValue}>Hebdomadaire</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aide et Support</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowUserGuide(true)}
          >
            <Text style={styles.settingLabel}>📖 Guide d'utilisation complet</Text>
            <Text style={styles.settingValue}>›</Text>
          </TouchableOpacity>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>📞 Support technique</Text>
            <Text style={styles.settingValue}>+237674667234</Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>💬 WhatsApp</Text>
            <Text style={styles.settingValue}>+237674667234</Text>
          </View>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>🔄 Vérifier les mises à jour</Text>
            <Text style={styles.settingValue}>v1.0.0</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conseils rapides</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>💡</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Démarrage rapide</Text>
              <Text style={styles.tipText}>
                1. Créez votre première classe{'\n'}
                2. Ajoutez vos élèves{'\n'}
                3. Commencez à prendre les présences{'\n'}
                4. Consultez le guide complet pour plus de fonctionnalités
              </Text>
            </View>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>⚡</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Actions rapides</Text>
              <Text style={styles.tipText}>
                • Utilisez "Tous présents" pour marquer toute la classe{'\n'}
                • Naviguez entre les dates avec les flèches ‹ ›{'\n'}
                • Exportez vos données régulièrement
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Développé pour</Text>
            <Text style={styles.settingValue}>Enseignants français</Text>
          </View>
        </View>

        {/* Copyright and License Information */}
        <View style={styles.section}>
          <CopyrightNotice variant="full" showLicense={true} />
        </View>
      </ScrollView>

      <UserGuide
        visible={showUserGuide}
        onClose={() => setShowUserGuide(false)}
      />

      <DataExportImportComponent
        visible={showDataExport}
        onClose={() => setShowDataExport(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    minHeight: 56,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  tipCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f8fafc',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
});
