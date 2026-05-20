import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BuntingBanner from '../components/BuntingBanner';

const REQUIREMENTS = [
  { id: '1', text: 'You must be a native or fluent speaker of the language you wish to teach.' },
  { id: '2', text: 'You must have a reliable internet connection.' },
  { id: '3', text: 'You must be available for a video interview with our team.' },
  { id: '4', text: 'You must submit a valid government-issued ID for verification.' },
  { id: '5', text: 'You must agree to our tutor code of conduct and teaching guidelines.' },
  { id: '6', text: 'You must have a device with a working camera and microphone.' },
];

export default function RequirementsScreen({ navigation }: any) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const allChecked = REQUIREMENTS.every((r) => checked[r.id]);

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.topBar}>
        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="person-outline" size={20} color="#5C3A00" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={20} color="#5C3A00" />
          </TouchableOpacity>
        </View>
      </View>

      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Orange title bar */}
        <View style={styles.titleBar}>
          <Text style={styles.titleText}>REQUIREMENTS</Text>
        </View>

        <Text style={styles.intro}>
          Before becoming a GeoLore tutor, please confirm that you meet all the
          following requirements:
        </Text>

        {REQUIREMENTS.map((req) => (
          <TouchableOpacity
            key={req.id}
            style={styles.requirementRow}
            onPress={() => toggle(req.id)}
            activeOpacity={0.75}
          >
            <View style={[styles.checkbox, checked[req.id] && styles.checkboxChecked]}>
              {checked[req.id] && (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </View>
            <Text style={styles.requirementText}>{req.text}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.proceedBtn, !allChecked && styles.proceedBtnDisabled]}
          activeOpacity={0.85}
          disabled={!allChecked}
          onPress={() => navigation?.navigate('TellUsAboutYourself')}
        >
          <Text style={styles.proceedBtnText}>Proceed</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  topBar: {
    flexDirection: 'row', justifyContent: 'flex-end',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },
  topBarRight: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  titleBar: {
    backgroundColor: '#F5A623', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginBottom: 20,
  },
  titleText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 1.5 },
  intro: {
    fontSize: 13, color: '#6B4E2A', lineHeight: 20,
    marginBottom: 20,
  },
  requirementRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: 12, marginBottom: 16,
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: '#F5A623',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 1, flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: '#F5A623', borderColor: '#F5A623',
  },
  requirementText: {
    flex: 1, fontSize: 13, color: '#3B1F00', lineHeight: 20,
  },
  proceedBtn: {
    backgroundColor: '#F5A623', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 8,
  },
  proceedBtnDisabled: { backgroundColor: '#E0C49A' },
  proceedBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});