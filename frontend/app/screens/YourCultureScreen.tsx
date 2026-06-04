import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import CategoryCard from '../components/CategoryCard';
import BottomTabBar from '../components/BottomTabBar';
import TopBar from '../components/TopBar';
import { useRole, useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

export default function YourCultureScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const { isTutor }  = useRole();
  const { user, setUser } = useAuth();

  const [tribeInput, setTribeInput] = useState('');
  const [saving, setSaving] = useState(false);

  const cultureName = user?.tribe        ?? null;
  const cultureFlag = user?.country_flag ?? '🌍';

  const CULTURE_CATEGORIES = [
    { key: 'history',   title: 'History',    screen: 'History' },
    // {
    //   key: 'language',
    //   title: 'Language',
    //   screen: isTutor ? 'TutorAppointments' : 'Language',
    // },
    // { key: 'food',      title: 'Food',       screen: 'Food'       },
    // { key: 'cultures',  title: 'Traditions', screen: 'Traditions' },
    { key: 'fashion',   title: 'Fashion',    screen: 'Fashion'    },
    { key: 'festivals', title: 'Festivals',  screen: 'Festivals'  },
    { key: 'beliefs',   title: 'Beliefs',    screen: 'Beliefs'    },
    { key: 'stories',   title: 'Stories',    screen: 'Stories'    },
    { key: 'proverbs',  title: 'Proverbs',   screen: 'Proverbs'   },
    { key: 'culture',   title: 'Culture',    screen: 'Culture'    },
  ];

  const filtered = CULTURE_CATEGORIES.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveTribe = async () => {
    if (!tribeInput.trim()) {
      Alert.alert('Required', 'Please enter your tribe / ethnicity.');
      return;
    }
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ tribe: tribeInput.trim() })
        .eq('id', user?.id)
        .select()
        .single();
      if (error) throw error;
      if (data) setUser(data);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!cultureName) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
        <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <ScrollView contentContainerStyle={styles.setupContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.setupEmoji}>🌍</Text>
          <Text style={styles.setupTitle}>What&apos;s your culture?</Text>
          <Text style={styles.setupSubtitle}>
            Enter your tribe or ethnicity so we can personalise your experience.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Igbo, Yoruba, Hausa…"
            placeholderTextColor="#C4A882"
            value={tribeInput}
            onChangeText={setTribeInput}
            autoCapitalize="words"
          />

          <TouchableOpacity
            style={[styles.saveBtn, (!tribeInput.trim() || saving) && styles.saveBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleSaveTribe}
            disabled={!tribeInput.trim() || saving}
          >
            {saving
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.saveBtnText}>Save & Continue</Text>
            }
          </TouchableOpacity>
        </ScrollView>

        <BottomTabBar />
      </SafeAreaView>
    );
  }

  // Culture is set — show the normal categories screen
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cultureHeader}>
          <Text style={styles.cultureName}>{cultureName.toUpperCase()}</Text>
          <Text style={styles.cultureFlag}>{cultureFlag}</Text>
        </View>

        {filtered.map((cat) => (
          <CategoryCard
            key={cat.key}
            title={cat.title}
            imageSource={(cat as any).imageSource}
            centered
            onDiscover={() => navigation?.navigate(cat.screen)}
          />
        ))}
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5', shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20, alignItems: 'stretch' },
  cultureHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
    marginBottom: 24, marginTop: 8,
  },
  cultureName: { fontSize: 28, fontWeight: '800', color: '#3B1F00', letterSpacing: 1 },
  cultureFlag:  { fontSize: 28 },

  // Setup prompt styles
  setupContent: {
    paddingHorizontal: 28, paddingTop: 48, paddingBottom: 40,
    alignItems: 'center',
  },
  setupEmoji:    { fontSize: 56, marginBottom: 16 },
  setupTitle:    { fontSize: 22, fontWeight: '800', color: '#3B1F00', marginBottom: 10, textAlign: 'center' },
  setupSubtitle: { fontSize: 14, color: '#A08060', textAlign: 'center', marginBottom: 28, lineHeight: 20 },
  input: {
    width: '100%', backgroundColor: '#FFF3E0', borderRadius: 10,
    borderWidth: 1, borderColor: '#E0D0B8', paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 14, color: '#3B1F00', marginBottom: 20,
  },
  saveBtn: {
    backgroundColor: '#F5A623', borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 60, alignItems: 'center',
  },
  saveBtnDisabled: { backgroundColor: '#E0C49A' },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});