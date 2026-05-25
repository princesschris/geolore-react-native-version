import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TeacherCard from '../components/TeacherCard';
import { supabase } from '../config/supabase';

type Tab = 'tutors' | 'classes';

interface ClassItem {
  id:         string;
  tutor_id:   string;
  tutor_name: string;
  title:      string;
  language:   string;
  type:       string;
  date:       string;
  time_from:  string;
  time_to:    string;
  price:      number;
  capacity:   number;
  enrolled:   number;
  status:     string;
}

// Small class card for the classes tab
const ClassCard = ({ item, onPress }: { item: ClassItem; onPress: () => void }) => {
  const spotsLeft = item.capacity - item.enrolled;
  const isFull    = spotsLeft <= 0;
  const isGroup   = item.type === 'group';

  return (
    <TouchableOpacity style={styles.classCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.classCardTop}>
        <View style={[styles.typePill, isGroup ? styles.typePillGroup : styles.typePillOne]}>
          <Ionicons name={isGroup ? 'people' : 'person'} size={11} color="#fff" />
          <Text style={styles.typePillText}>{isGroup ? 'Group' : '1-on-1'}</Text>
        </View>
        <Text style={styles.classPrice}>${item.price}/session</Text>
      </View>
      <Text style={styles.classTitle}>{item.title}</Text>
      <Text style={styles.classLanguage}>🗣 {item.language}</Text>
      <View style={styles.classRow}>
        <Ionicons name="person-outline" size={13} color="#A08060" />
        <Text style={styles.classMeta}>{item.tutor_name}</Text>
        <Ionicons name="calendar-outline" size={13} color="#A08060" />
        <Text style={styles.classMeta}>{item.date}</Text>
      </View>
      {isGroup && (
        <View style={styles.classRow}>
          <Ionicons name="people-outline" size={13} color={isFull ? '#E74C3C' : '#27AE60'} />
          <Text style={[styles.classMeta, { color: isFull ? '#E74C3C' : '#27AE60', fontWeight: '700' }]}>
            {isFull ? 'Full' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
          </Text>
        </View>
      )}
      <TouchableOpacity
        style={[styles.joinBtn, isFull && styles.joinBtnFull]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.joinBtnText}>{isFull ? 'View Details' : 'View & Enrol'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default function LanguageScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab,   setActiveTab]   = useState<Tab>('tutors');
  const [tutors,      setTutors]      = useState<any[]>([]);
  const [classes,     setClasses]     = useState<ClassItem[]>([]);
  const [loading,     setLoading]     = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch tutors
      const { data: tutorData } = await supabase
        .from('users')
        .select('id, first_name, last_name, country_of_origin, country_flag, price_per_hr, languages, registered_students, reviews(rating)')
        .in('role', ['tutor', 'both']);

      const withRating = (tutorData ?? []).map((t: any) => {
        const ratings = (t.reviews ?? []).map((r: any) => r.rating);
        const avg = ratings.length
          ? Math.round(ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length)
          : 0;
        return { ...t, avg_rating: avg };
      });
      setTutors(withRating);

      // Fetch open classes
      const { data: classData } = await supabase
        .from('classes')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      setClasses(classData ?? []);
    } catch {
      setTutors([]);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  const q = searchQuery.toLowerCase();

  const filteredTutors = tutors.filter((t) => {
    const name = `${t.first_name} ${t.last_name}`.toLowerCase();
    return name.includes(q) || (t.country_of_origin ?? '').toLowerCase().includes(q);
  });

  const filteredClasses = classes.filter((c) =>
    c.title.toLowerCase().includes(q) ||
    c.language.toLowerCase().includes(q) ||
    c.tutor_name.toLowerCase().includes(q)
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.topBar}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={activeTab === 'tutors' ? 'Search tutors...' : 'Search classes...'}
        />
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="person-outline" size={20} color="#5C3A00" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation?.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={20} color="#5C3A00" />
        </TouchableOpacity>
      </View>

      <BuntingBanner />

      {/* Tab switcher */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tutors' && styles.tabActive]}
          onPress={() => setActiveTab('tutors')}
          activeOpacity={0.8}
        >
          <Ionicons name="person-outline" size={16} color={activeTab === 'tutors' ? '#fff' : '#F5A623'} />
          <Text style={[styles.tabText, activeTab === 'tutors' && styles.tabTextActive]}>Tutors</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'classes' && styles.tabActive]}
          onPress={() => setActiveTab('classes')}
          activeOpacity={0.8}
        >
          <Ionicons name="book-outline" size={16} color={activeTab === 'classes' ? '#fff' : '#F5A623'} />
          <Text style={[styles.tabText, activeTab === 'classes' && styles.tabTextActive]}>Classes</Text>
          {classes.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{classes.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F5A623" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>
            {activeTab === 'tutors' ? 'LANGUAGE TUTORS' : 'AVAILABLE CLASSES'}
          </Text>

          {/* ── Tutors tab ── */}
          {activeTab === 'tutors' && (
            filteredTutors.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🎓</Text>
                <Text style={styles.emptyTitle}>No tutors found</Text>
                <Text style={styles.emptySubtitle}>
                  {searchQuery ? `No results for "${searchQuery}"` : 'No tutors available yet.'}
                </Text>
              </View>
            ) : (
              filteredTutors.map((tutor) => {
                const tutorObj = {
                  id:                 tutor.id,
                  name:               `${tutor.first_name} ${tutor.last_name}`,
                  location:           tutor.country_of_origin ?? 'Unknown',
                  flag:               tutor.country_flag ?? '🌍',
                  rating:             tutor.avg_rating,
                  pricePerHr:         tutor.price_per_hr ?? 0,
                  registeredStudents: tutor.registered_students ?? 0,
                  languages:          tutor.languages ?? [],
                };
                return (
                  <TeacherCard
                    key={tutor.id}
                    name={tutorObj.name}
                    location={tutorObj.location}
                    rating={tutorObj.rating}
                    pricePerHr={tutorObj.pricePerHr}
                    onPress={() => navigation?.navigate('Teacher', { teacher: tutorObj })}
                    onJoinClass={() => navigation?.navigate('IncomingClass', { teacher: tutorObj })}
                  />
                );
              })
            )
          )}

          {/* ── Classes tab ── */}
          {activeTab === 'classes' && (
            filteredClasses.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>📚</Text>
                <Text style={styles.emptyTitle}>No classes found</Text>
                <Text style={styles.emptySubtitle}>
                  {searchQuery ? `No results for "${searchQuery}"` : 'No classes available yet. Check back soon!'}
                </Text>
              </View>
            ) : (
              filteredClasses.map((cls) => (
                <ClassCard
                  key={cls.id}
                  item={cls}
                  onPress={() => navigation?.navigate('ClassDetail', { classItem: cls })}
                />
              ))
            )
          )}

          <TouchableOpacity
            style={styles.myClassesButton}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Classes')}
          >
            <Ionicons name="calendar-outline" size={16} color="#fff" />
            <Text style={styles.myClassesButtonText}>My Classes</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10, gap: 10 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 10, gap: 10 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FFF3E0', borderWidth: 1.5, borderColor: '#F5A623' },
  tabActive: { backgroundColor: '#F5A623', borderColor: '#F5A623' },
  tabText: { fontSize: 13, fontWeight: '700', color: '#F5A623' },
  tabTextActive: { color: '#fff' },
  countBadge: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  countBadgeText: { fontSize: 10, fontWeight: '800', color: '#F5A623' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 28 },
  title: { fontSize: 18, fontWeight: '800', color: '#3B1F00', textAlign: 'center', marginBottom: 16, letterSpacing: 1.2 },
  classCard: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E0D0B8', padding: 16, marginBottom: 14, gap: 8 },
  classCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typePill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  typePillGroup: { backgroundColor: '#3B8ED0' },
  typePillOne:   { backgroundColor: '#F5A623' },
  typePillText:  { color: '#fff', fontSize: 10, fontWeight: '700' },
  classPrice: { fontSize: 14, fontWeight: '800', color: '#F5A623' },
  classTitle: { fontSize: 16, fontWeight: '800', color: '#3B1F00' },
  classLanguage: { fontSize: 13, color: '#7A5C3A', fontWeight: '600' },
  classRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  classMeta: { fontSize: 12, color: '#A08060', marginRight: 8 },
  joinBtn: { backgroundColor: '#F5A623', paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginTop: 4 },
  joinBtnFull: { backgroundColor: '#C4A882' },
  joinBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  myClassesButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#3B1F00', paddingVertical: 13, borderRadius: 10, marginTop: 8 },
  myClassesButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#3B1F00' },
  emptySubtitle: { fontSize: 13, color: '#A08060', textAlign: 'center', lineHeight: 20 },
});