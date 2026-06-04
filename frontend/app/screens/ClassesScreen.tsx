import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import BottomTabBar from '../components/BottomTabBar';
import ClassCard from '../components/ClassCard';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';

const DAILY_API_KEY = process.env.EXPO_PUBLIC_DAILY_API_KEY;

interface Appointment {
  id:              string;
  tutor_name:      string;
  date:            string;
  time_from:       string;
  time_to:         string;
  price:           string;
  status:          string;
  tutor_id:        string;
  daily_room_url?: string | null;
}

async function createDailyRoom(appointmentId: string): Promise<string | null> {
  try {
    const res = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DAILY_API_KEY}` },
      body: JSON.stringify({
        name: `geolore-${appointmentId}`,
        properties: {
          enable_chat: true, enable_screenshare: false,
          start_video_off: false, start_audio_off: false,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
        },
      }),
    });
    const data = await res.json();
    return data?.url ?? null;
  } catch { return null; }
}

async function getOrCreateRoomUrl(appointment: Appointment): Promise<string | null> {
  if (appointment.daily_room_url) return appointment.daily_room_url;
  const url = await createDailyRoom(appointment.id);
  if (!url) return null;
  await supabase.from('appointments').update({ daily_room_url: url }).eq('id', appointment.id);
  return url;
}

export default function ClassesScreen({ navigation }: any) {
  const [searchQuery,  setSearchQuery]  = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [joiningId,    setJoiningId]    = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAppointments = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments').select('*')
        .eq('student_id', user.id).eq('status', 'upcoming')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAppointments(data ?? []);
    } catch { setAppointments([]); }
    finally { setLoading(false); }
  };

  useFocusEffect(useCallback(() => { fetchAppointments(); }, [user?.id]));

  const filtered = appointments.filter((a) =>
    a.tutor_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinClass = async (appointment: Appointment) => {
    setJoiningId(appointment.id);
    try {
      const roomUrl = await getOrCreateRoomUrl(appointment);
      if (!roomUrl) { Alert.alert('Error', 'Could not create the class room. Please try again.'); return; }
      navigation?.navigate('ClassSession', {
        teacherName: appointment.tutor_name, roomUrl, appointmentId: appointment.id,
      });
    } catch { Alert.alert('Error', 'Something went wrong. Please try again.'); }
    finally { setJoiningId(null); }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F5A623" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Hero header */}
          <LinearGradient
            colors={['#F5A623', '#E8891A']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroIconWrap}>
              <Ionicons name="book" size={28} color="#fff" />
            </View>
            <Text style={styles.heroTitle}>My Classes</Text>
            <Text style={styles.heroSub}>
              {filtered.length} upcoming {filtered.length === 1 ? 'session' : 'sessions'}
            </Text>
          </LinearGradient>

          {filtered.length === 0 && appointments.length > 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={40} color="#C4A882" />
              <Text style={styles.emptyText}>No results for "{searchQuery}"</Text>
            </View>
          ) : filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#E0C49A" />
              <Text style={styles.emptyTitle}>No upcoming classes</Text>
              <Text style={styles.emptyText}>Book a session with a tutor to get started</Text>
            </View>
          ) : (
            <>
              <Text style={styles.sectionLabel}>Upcoming Sessions</Text>
              {filtered.map((cls) => (
                <View key={cls.id}>
                  <ClassCard
                    teacherName={cls.tutor_name}
                    timeFrom={cls.time_from}
                    timeTo={cls.time_to}
                    onViewDetails={() =>
                      navigation?.navigate('ClassInfo', {
                        tutorName: cls.tutor_name, timeFrom: cls.time_from,
                        timeTo: cls.time_to, payment: cls.price, appointmentId: cls.id,
                      })
                    }
                    onJoinClass={() => handleJoinClass(cls)}
                  />
                  {joiningId === cls.id && (
                    <View style={styles.joiningOverlay}>
                      <ActivityIndicator size="small" color="#F5A623" />
                      <Text style={styles.joiningText}>Setting up your class room…</Text>
                    </View>
                  )}
                </View>
              ))}
            </>
          )}
        </ScrollView>
      )}

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },

  heroCard: {
    borderRadius: 20, padding: 24, marginBottom: 24,
    alignItems: 'flex-start', gap: 4,
  },
  heroIconWrap: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
  heroSub:   { fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },

  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#A08060', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 },

  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  joiningOverlay: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#FFF3E0', borderRadius: 10,
    marginTop: -8, marginBottom: 12,
    borderWidth: 1, borderColor: '#F5C070',
  },
  joiningText: { fontSize: 12, color: '#A08060', fontWeight: '600' },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#3B1F00' },
  emptyText:  { fontSize: 14, color: '#A08060', textAlign: 'center' },
});