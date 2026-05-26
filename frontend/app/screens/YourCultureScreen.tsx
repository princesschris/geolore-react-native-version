import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import CategoryCard from '../components/CategoryCard';
import BottomTabBar from '../components/BottomTabBar';
import TopBar from '../components/TopBar';
import { useRole, useAuth } from '../context/AuthContext';

export default function YourCultureScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const { isTutor }  = useRole();
  const { user }     = useAuth();

  const cultureName = user?.tribe            ?? 'My Culture';
  const cultureFlag = user?.country_flag     ?? '🌍';

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
    {key:'proverbs', title:'Proverbs', screen:'Proverbs'},
  ];

  const filtered = CULTURE_CATEGORIES.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tribe name + country flag — auto-populated from profile */}
        <View style={styles.cultureHeader}>
          <Text style={styles.cultureName}>{cultureName.toUpperCase()}</Text>
          <Text style={styles.cultureFlag}>{cultureFlag}</Text>
        </View>

        {filtered.map((cat) => (
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