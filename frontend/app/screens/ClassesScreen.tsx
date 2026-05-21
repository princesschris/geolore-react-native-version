import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import ClassCard from '../components/ClassCard';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

interface Appointment {
  id:         string;
  tutor_name: string;
  date:       string;
  time_from:  string;
  time_to:    string;
  price:      string;
  status:     string;
  tutor_id:   string;
}

export default function ClassesScreen({ navigation }: any) {
  const [searchQuery,   setSearchQuery]   = useState('');
  const [appointments,  setAppointments]  = useState<Appointment[]>([]);
  const [loading,       setLoading]       = useState(true);

  const { user } = useAuth();

  // Fetch appointments for the logged-in student
  const fetchAppointments = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('student_id', user.id)
        .eq('status', 'upcoming')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAppointments(data ?? []);
    } catch (err) {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch every time this screen comes into focus
  // so newly booked appointments show up immediately
  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [user?.id])
  );

  const filtered = appointments.filter((a) =>
    a.tutor_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigate to NoClasses if empty after loading
  useEffect(() => {
    if (!loading && appointments.length === 0) {
      navigation?.navigate('NoClasses');
    }
  }, [loading, appointments]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.topBar}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search" />
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="person-outline" size={20} color="#5C3A00" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <View>
            <Ionicons name="notifications-outline" size={20} color="#5C3A00" />
            <View style={styles.badge}><Text style={styles.badgeText}>5</Text></View>
          </View>
        </TouchableOpacity>
      </View>

      <BuntingBanner />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F5A623" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>CLASSES</Text>

          {filtered.map((cls) => (
            <ClassCard
              key={cls.id}
              teacherName={cls.tutor_name}
              timeFrom={cls.time_from}
              timeTo={cls.time_to}
              onViewDetails={() =>
                navigation?.navigate('ClassInfo', {
                  tutorName: cls.tutor_name,
                  timeFrom:  cls.time_from,
                  timeTo:    cls.time_to,
                  payment:   cls.price,
                  appointmentId: cls.id,
                })
              }
            />
          ))}

          {filtered.length === 0 && appointments.length > 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={40} color="#C4A882" />
              <Text style={styles.emptyText}>No results for "{searchQuery}"</Text>
            </View>
          )}
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
  badge: { position: 'absolute', top: -4, right: -6, backgroundColor: '#F5A623', borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 28 },
  title: { fontSize: 20, fontWeight: '800', color: '#3B1F00', textAlign: 'center', letterSpacing: 1.5, marginBottom: 20 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 14, color: '#A08060', fontWeight: '600' },
});