import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import RoleGate from '../components/RoleGate';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

interface Appointment {
  id:          string;
  student_id:  string;
  tutor_name:  string;
  date:        string;
  time_from:   string;
  time_to:     string;
  price:       string;
  status:      string;
  // joined from users table
  student_first_name?: string;
  student_last_name?:  string;
}

function AppointmentCard({ item, onPress, onCancel }: { item: any; onPress: () => void; onCancel: () => void }) {
  const studentName = item.student_first_name
    ? `${item.student_first_name} ${item.student_last_name}`
    : 'Student';

  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Ionicons name="person-outline" size={14} color="#5C4A30" />
        <Text style={styles.cardText}>Student: <Text style={styles.cardBold}>{studentName}</Text></Text>
      </View>
      <View style={styles.cardRow}>
        <Ionicons name="calendar-outline" size={14} color="#5C4A30" />
        <Text style={styles.cardText}>Date: <Text style={styles.cardBold}>{item.date}</Text></Text>
      </View>
      <View style={styles.cardRow}>
        <Ionicons name="time-outline" size={14} color="#5C4A30" />
        <Text style={styles.cardText}>Time: <Text style={styles.cardBold}>{item.time_from} – {item.time_to}</Text></Text>
      </View>
      <View style={styles.cardRow}>
        <Ionicons name="cash-outline" size={14} color="#5C4A30" />
        <Text style={styles.cardText}>Payment: <Text style={styles.cardBold}>{item.price}</Text></Text>
      </View>
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.viewBtn} onPress={onPress} activeOpacity={0.8}>
          <Text style={styles.viewBtnText}>View appointment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
          <Text style={styles.cancelBtnText}>Cancel appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TutorAppointmentsScreen({ navigation }: any) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const { user } = useAuth();

  const fetchAppointments = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // Fetch appointments where this user is the tutor
      // and join student name from users table
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          student:users!appointments_student_id_fkey (
            first_name,
            last_name
          )
        `)
        .eq('tutor_id', user.id)
        .eq('status', 'upcoming')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Flatten student name into the appointment object
      const flattened = (data ?? []).map((a: any) => ({
        ...a,
        student_first_name: a.student?.first_name,
        student_last_name:  a.student?.last_name,
      }));
      setAppointments(flattened);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchAppointments(); }, [user?.id]));

  const handleCancel = async (id: string) => {
    Alert.alert('Cancel appointment', 'Are you sure you want to cancel this appointment?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, cancel',
        style: 'destructive',
        onPress: async () => {
          // Optimistic update
          setAppointments((prev) => prev.filter((a) => a.id !== id));
          await supabase
            .from('appointments')
            .update({ status: 'cancelled' })
            .eq('id', id);
        },
      },
    ]);
  };

  return (
    <RoleGate allowedRoles={['tutor', 'both']}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

        <View style={styles.topBar}>
          <View style={styles.topBarRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="person-outline" size={20} color="#5C3A00" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation?.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={20} color="#5C3A00" />
            </TouchableOpacity>
          </View>
        </View>

        <BuntingBanner />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F5A623" />
          </View>
        ) : appointments.length === 0 ? (
          // No appointments — go to empty state
          navigation.replace('TutorNoAppointment')
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.titleBar}>
              <Text style={styles.titleText}>APPOINTMENTS</Text>
            </View>
            {appointments.map((item) => (
              <AppointmentCard
                key={item.id}
                item={item}
                onPress={() => navigation.navigate('TutorAppointmentDetails', {
                  appointmentId: item.id,
                  studentName:   `${item.student_first_name} ${item.student_last_name}`,
                  timeFrom:      item.time_from,
                  timeTo:        item.time_to,
                  payment:       item.price,
                  date:          item.date,
                })}
                onCancel={() => handleCancel(item.id)}
              />
            ))}
          </ScrollView>
        )}

        <BottomTabBar />
      </SafeAreaView>
    </RoleGate>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  topBarRight: { flexDirection: 'row', gap: 10 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 32 },
  titleBar: { backgroundColor: '#F5A623', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  titleText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 1.5 },
  card: { backgroundColor: '#FFF3E0', borderRadius: 14, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#F5C070', gap: 8 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardText: { fontSize: 13, color: '#5C4A30' },
  cardBold: { fontWeight: '700', color: '#3B1F00' },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  viewBtn: { flex: 1, backgroundColor: '#3B1F00', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  viewBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  cancelBtn: { flex: 1, backgroundColor: '#F5A623', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  cancelBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});