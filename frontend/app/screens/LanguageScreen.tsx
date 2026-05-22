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

interface Tutor {
  id:                  string;
  first_name:          string;
  last_name:           string;
  country_of_origin:   string;
  country_flag:        string;
  price_per_hr:        number;
  languages:           string[];
  registered_students: number;
  avg_rating:          number;
}

export default function LanguageScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tutors,      setTutors]      = useState<Tutor[]>([]);
  const [loading,     setLoading]     = useState(true);

  const fetchTutors = async () => {
    setLoading(true);
    try {
      // Fetch all users who are tutors or both
      // Also compute their average rating from the reviews table
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          first_name,
          last_name,
          country_of_origin,
          country_flag,
          price_per_hr,
          languages,
          registered_students,
          reviews (rating)
        `)
        .in('role', ['tutor', 'both']);

      if (error) throw error;

      // Compute average rating per tutor
      const withRating = (data ?? []).map((t: any) => {
        const ratings = (t.reviews ?? []).map((r: any) => r.rating);
        const avg = ratings.length
          ? Math.round(ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length)
          : 0;
        return { ...t, avg_rating: avg };
      });

      setTutors(withRating);
    } catch {
      setTutors([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchTutors(); }, []));

  const filtered = tutors.filter((t) => {
    const name = `${t.first_name} ${t.last_name}`.toLowerCase();
    const loc  = (t.country_of_origin ?? '').toLowerCase();
    const q    = searchQuery.toLowerCase();
    return name.includes(q) || loc.includes(q);
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.topBar}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search tutors..." />
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="person-outline" size={20} color="#5C3A00" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation?.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={20} color="#5C3A00" />
        </TouchableOpacity>
      </View>

      <BuntingBanner />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F5A623" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>LANGUAGE COURSES</Text>

          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🎓</Text>
              <Text style={styles.emptyTitle}>No tutors found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : 'No tutors are available yet. Check back soon!'}
              </Text>
            </View>
          ) : (
            filtered.map((tutor) => {
              const tutorObj = {
                id:                  tutor.id,
                name:                `${tutor.first_name} ${tutor.last_name}`,
                location:            tutor.country_of_origin ?? 'Unknown',
                flag:                tutor.country_flag ?? '🌍',
                rating:              tutor.avg_rating,
                pricePerHr:          tutor.price_per_hr ?? 0,
                registeredStudents:  tutor.registered_students ?? 0,
                languages:           tutor.languages ?? [],
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
          )}

          <TouchableOpacity
            style={styles.classesButton}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Classes')}
          >
            <Text style={styles.classesButtonText}>My Classes</Text>
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
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 28 },
  title: { fontSize: 20, fontWeight: '800', color: '#3B1F00', textAlign: 'center', marginBottom: 20, letterSpacing: 1.5 },
  classesButton: { backgroundColor: '#F5A623', paddingVertical: 13, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  classesButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#3B1F00' },
  emptySubtitle: { fontSize: 13, color: '#A08060', textAlign: 'center', lineHeight: 20 },
});