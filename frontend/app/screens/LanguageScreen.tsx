import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import TopBar from '../components/TopBar';
import BottomTabBar from '../components/BottomTabBar';
import TeacherCard from '../components/TeacherCard';
import { supabase } from '../config/supabase';

type Tab = 'tutors' | 'classes' | 'myClasses';

interface ClassItem {
  id: string; tutor_id: string; tutor_name: string; title: string;
  language: string; type: string; date: string; time_from: string;
  time_to: string; price: number; capacity: number; enrolled: number; status: string;
}

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
        <Text style={styles.classPrice}>${item.price}<Text style={styles.classPriceSub}>/session</Text></Text>
      </View>

      <Text style={styles.classTitle}>{item.title}</Text>

      <View style={styles.classMetaRow}>
        <Ionicons name="language" size={13} color="#F5A623" />
        <Text style={styles.classMetaText}>{item.language}</Text>
      </View>

      <View style={styles.classDivider} />

      <View style={styles.classFooter}>
        <View style={styles.classMetaRow}>
          <Ionicons name="person-outline" size={13} color="#A08060" />
          <Text style={styles.classMetaText}>{item.tutor_name}</Text>
        </View>
        <View style={styles.classMetaRow}>
          <Ionicons name="calendar-outline" size={13} color="#A08060" />
          <Text style={styles.classMetaText}>{item.date}</Text>
        </View>
        {isGroup && (
          <View style={styles.classMetaRow}>
            <Ionicons name="people-outline" size={13} color={isFull ? '#E74C3C' : '#27AE60'} />
            <Text style={[styles.classMetaText, { color: isFull ? '#E74C3C' : '#27AE60', fontWeight: '700' }]}>
              {isFull ? 'Full' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.joinBtn, isFull && styles.joinBtnFull]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Ionicons name={isFull ? 'eye-outline' : 'checkmark-circle-outline'} size={15} color="#fff" />
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
      const { data: tutorData } = await supabase
        .from('users')
        .select('id, first_name, last_name, country_of_origin, country_flag, price_per_hr, languages, registered_students, reviews(rating)')
        .in('role', ['tutor', 'both']);

      const withRating = (tutorData ?? []).map((t: any) => {
        const ratings = (t.reviews ?? []).map((r: any) => r.rating);
        const avg = ratings.length
          ? Math.round(ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) : 0;
        return { ...t, avg_rating: avg };
      });
      setTutors(withRating);

      const { data: classData } = await supabase
        .from('classes').select('*').eq('status', 'open')
        .order('created_at', { ascending: false });
      setClasses(classData ?? []);
    } catch {
      setTutors([]); setClasses([]);
    } finally { setLoading(false); }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  const q = searchQuery.toLowerCase();
  const filteredTutors = tutors.filter((t) => {
    const name = `${t.first_name} ${t.last_name}`.toLowerCase();
    return name.includes(q) || (t.country_of_origin ?? '').toLowerCase().includes(q);
  });
  const filteredClasses = classes.filter((c) =>
    c.title.toLowerCase().includes(q) || c.language.toLowerCase().includes(q) || c.tutor_name.toLowerCase().includes(q)
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <LinearGradient
        colors={['#F5A623', '#E8891A']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.heroBanner}
      >
        <View style={styles.heroLeft}>
          <Text style={styles.heroEyebrow}>EXPLORE</Text>
          <Text style={styles.heroTitle}>Language Learning</Text>
          <Text style={styles.heroSub}>Find tutors & join classes in your culture</Text>
        </View>
        <View style={styles.heroIconWrap}>
          <Ionicons name="language" size={36} color="rgba(255,255,255,0.9)" />
        </View>
      </LinearGradient>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tutors' && styles.tabActive]}
          onPress={() => setActiveTab('tutors')}
          activeOpacity={0.8}
        >
          <Ionicons name="person-outline" size={15} color={activeTab === 'tutors' ? '#fff' : '#F5A623'} />
          <Text style={[styles.tabText, activeTab === 'tutors' && styles.tabTextActive]}>Tutors</Text>
          {tutors.length > 0 && activeTab !== 'tutors' && (
            <View style={styles.countBadge}><Text style={styles.countBadgeText}>{tutors.length}</Text></View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'classes' && styles.tabActive]}
          onPress={() => setActiveTab('classes')}
          activeOpacity={0.8}
        >
          <Ionicons name="book-outline" size={15} color={activeTab === 'classes' ? '#fff' : '#F5A623'} />
          <Text style={[styles.tabText, activeTab === 'classes' && styles.tabTextActive]}>Available Classes</Text>
          {classes.length > 0 && activeTab !== 'classes' && (
            <View style={styles.countBadge}><Text style={styles.countBadgeText}>{classes.length}</Text></View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'myClasses' && styles.tabActive]}
          onPress={() => navigation?.navigate('Classes')}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar-outline" size={15} color={activeTab === 'myClasses' ? '#fff' : '#F5A623'} />
          <Text style={[styles.tabText, activeTab === 'myClasses' && styles.tabTextActive]}>My Classes</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F5A623" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab !== 'myClasses' && (
            <View style={styles.sectionRow}>
              <Text style={styles.sectionLabel}>
                {activeTab === 'tutors' ? 'Available Tutors' : 'Open Classes'}
              </Text>
              <Text style={styles.sectionCount}>
                {activeTab === 'tutors' ? filteredTutors.length : filteredClasses.length} found
              </Text>
            </View>
          )}
          {activeTab === 'tutors' && (
            filteredTutors.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrap}>
                  <FontAwesome name="graduation-cap" size={30} color="#F5A623" />
                </View>
                <Text style={styles.emptyTitle}>No tutors found</Text>
                <Text style={styles.emptySubtitle}>
                  {searchQuery ? `No results for "${searchQuery}"` : 'No tutors available yet.'}
                </Text>
              </View>
            ) : (
              filteredTutors.map((tutor) => {
                const tutorObj = {
                  id: tutor.id, name: `${tutor.first_name} ${tutor.last_name}`,
                  location: tutor.country_of_origin ?? 'Unknown', flag: tutor.country_flag,
                  rating: tutor.avg_rating, pricePerHr: tutor.price_per_hr ?? 0,
                  registeredStudents: tutor.registered_students ?? 0, languages: tutor.languages ?? [],
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

          {/* Classes tab */}
          {activeTab === 'classes' && (
            filteredClasses.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrap}>
                  <Ionicons name="book-outline" size={30} color="#F5A623" />
                </View>
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

        </ScrollView>
      )}

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  heroBanner: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 12,
    borderRadius: 20, padding: 20, gap: 12,
  },
  heroLeft:    { flex: 1, gap: 3 },
  heroEyebrow: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.75)', letterSpacing: 1.5, textTransform: 'uppercase' },
  heroTitle:   { fontSize: 20, fontWeight: '800', color: '#fff', lineHeight: 24 },
  heroSub:     { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '500', lineHeight: 17 },
  heroIconWrap: {
    width: 64, height: 64, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 12, gap: 10 },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 11, borderRadius: 14,
    backgroundColor: '#FFF3E0', borderWidth: 1.5, borderColor: '#F5A623',
  },
  tabActive:     { backgroundColor: '#F5A623', borderColor: '#F5A623' },
  tabText:       { fontSize: 11, fontWeight: '700', color: '#F5A623' },
  tabTextActive: { color: '#fff' },
  countBadge:     { backgroundColor: '#F5A623', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  countBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent:    { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 28 },
  sectionRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#3B1F00', textTransform: 'uppercase', letterSpacing: 0.8 },
  sectionCount: { fontSize: 12, color: '#A08060', fontWeight: '600' },
  classCard: {
    backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 1, borderColor: '#F0E6D6',
    padding: 16, marginBottom: 14, gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  classCardTop:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typePill:      { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  typePillGroup: { backgroundColor: '#3B8ED0' },
  typePillOne:   { backgroundColor: '#F5A623' },
  typePillText:  { color: '#fff', fontSize: 10, fontWeight: '700' },
  classPrice:    { fontSize: 16, fontWeight: '800', color: '#F5A623' },
  classPriceSub: { fontSize: 11, fontWeight: '500', color: '#A08060' },
  classTitle:    { fontSize: 16, fontWeight: '800', color: '#3B1F00', lineHeight: 21 },
  classDivider:  { height: 1, backgroundColor: '#F0E6D6' },
  classFooter:   { gap: 6 },
  classMetaRow:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  classMetaText: { fontSize: 12, color: '#A08060' },
  joinBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#F5A623', paddingVertical: 11, borderRadius: 12,
    shadowColor: '#F5A623', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 6, elevation: 2,
  },
  joinBtnFull: { backgroundColor: '#C4A882', shadowOpacity: 0 },
  joinBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
    emptyState:    { alignItems: 'center', paddingTop: 48, gap: 12 },
  emptyIconWrap: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle:    { fontSize: 17, fontWeight: '800', color: '#3B1F00' },
  emptySubtitle: { fontSize: 13, color: '#A08060', textAlign: 'center', lineHeight: 20 },
});