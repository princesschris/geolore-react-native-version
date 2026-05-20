import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BuntingBanner from '../components/BuntingBanner';

// Flag grid data — same palette as mockup
const FLAGS = ['🇳🇬', '🇬🇧', '🇺🇸', '🇫🇷', '🇩🇪', '🇯🇵', '🇧🇷', '🇿🇦', '🇮🇳', '🇨🇳', '🇪🇸', '🇮🇹'];

export default function TellUsAboutYourselfScreen({ navigation }: any) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [selectedFlag, setSelectedFlag] = useState<string | null>(null);

  const canProceed = firstName.trim().length > 0 && lastName.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      {/* Top bar icons */}
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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Tell us about yourself</Text>

        {/* Avatar placeholder */}
        <View style={styles.avatarRow}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color="#C4A882" />
          </View>
        </View>

        {/* Flag grid */}
        <View style={styles.flagGrid}>
          {FLAGS.map((flag) => (
            <TouchableOpacity
              key={flag}
              style={[
                styles.flagCell,
                selectedFlag === flag && styles.flagCellSelected,
              ]}
              onPress={() => setSelectedFlag(flag)}
              activeOpacity={0.75}
            >
              <Text style={styles.flagEmoji}>{flag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Name inputs */}
        <TextInput
          style={styles.input}
          placeholder="First name"
          placeholderTextColor="#C4A882"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last name"
          placeholderTextColor="#C4A882"
          value={lastName}
          onChangeText={setLastName}
        />

        {/* Helper text */}
        <Text style={styles.helperText}>
          We wouldn't share your information with anyone.
        </Text>

        <TouchableOpacity
          style={[styles.nextBtn, !canProceed && styles.nextBtnDisabled]}
          activeOpacity={0.85}
          disabled={!canProceed}
          onPress={() => navigation?.navigate('ScheduleInterview')}
        >
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  topBarRight: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3B1F00',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  avatarRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#F5E6CC',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#F5C070',
  },
  flagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
    width: '100%',
  },
  flagCell: {
    width: 48, height: 48, borderRadius: 10,
    backgroundColor: '#FFF3E0',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#E0D0B8',
  },
  flagCellSelected: {
    borderColor: '#F5A623',
    backgroundColor: '#FDEBD0',
    borderWidth: 2,
  },
  flagEmoji: { fontSize: 26 },
  input: {
    width: '100%',
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0D0B8',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#3B1F00',
    marginBottom: 12,
  },
  helperText: {
    fontSize: 11,
    color: '#A08060',
    alignSelf: 'flex-start',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  nextBtn: {
    backgroundColor: '#F5A623',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 60,
    alignItems: 'center',
  },
  nextBtnDisabled: { backgroundColor: '#E0C49A' },
  nextBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});