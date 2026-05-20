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
import CategoryCard from '../components/CategoryCard';
import BottomTabBar from '../components/BottomTabBar';
import TopBar from '../components/TopBar';
import { useRole } from '../context/AuthContext';

export default function YourCultureScreen({ navigation, route }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const { isTutor } = useRole();

  const cultureName = route?.params?.culture ?? 'IGBO';
  const cultureFlag = route?.params?.flag    ?? '🇳🇬';

  // ── Culture categories ─────────────────────────────────────────────────
  // The 'Language' card destination is role-aware:
  //   • Tutor  → TutorAppointments  (their own session management)
  //   • Student → Language          (book / browse tutors)
  const CULTURE_CATEGORIES = [
    { key: 'history',   title: 'History',    screen: 'History' },
    {
      key: 'language',
      title: 'Language',
      screen: isTutor ? 'TutorAppointments' : 'Language',
    },
    { key: 'food',      title: 'Food',       screen: 'Food' },
    { key: 'cultures',  title: 'Traditions', screen: 'Traditions' },
    { key: 'fashion',   title: 'Fashion',    screen: 'Fashion' },
    { key: 'festivals', title: 'Festivals',  screen: 'Festivals' },
    { key: 'beliefs',   title: 'Beliefs',    screen: 'Beliefs' },
    { key: 'stories',   title: 'Stories',    screen: 'Stories' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Culture Title + Flag */}
        <View style={styles.cultureHeader}>
          <Text style={styles.cultureName}>{cultureName}</Text>
          <Text style={styles.cultureFlag}>{cultureFlag}</Text>
        </View>

        {CULTURE_CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.key}
            title={cat.title}
            imageSource={cat.imageSource}
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
  safeArea: {
    flex: 1, backgroundColor: '#FFFDF5',
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 },
  cultureHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
    marginBottom: 24, marginTop: 8,
  },
  cultureName: { fontSize: 28, fontWeight: '800', color: '#3B1F00', letterSpacing: 1 },
  cultureFlag: { fontSize: 28 },
});