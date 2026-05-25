import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import RoleGate from '../components/RoleGate';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../components/CustomAlert';

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
          <Text style={styles.viewBtnText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TutorAppointmentsScreen({ navigation }: any) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [myClasses,    setMyClasses]    = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);

  const { user }               = useAuth();
  const { showConfirm, showAlert } = useAlert();

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data: apptData } = await supabase
        .from('appointments')
        .select(`*, student:users!appointments_student_id_fkey (first_name, last_name)`)
        .eq('tutor_id', user.id)
        .eq('status', 'upcoming')
        .order('created_at', { ascending: false });

      const flattened = (apptData ?? []).map((a: any) => ({
        ...a,
        student_first_name: a.student?.first_name,
        student_last_name:  a.student?.last_name,
      }));
      setAppointments(flattened);

      const { data: classData } = await supabase
        .from('classes')
        .select('*')
        .eq('tutor_id', user.id)
        .order('created_at', { ascending: false });

      setMyClasses(classData ?? []);
    } catch {
      setAppointments([]);
      setMyClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, [user?.id]));

  // ── Cancel appointment ────────────────────────────────────────────────────
  const handleCancelAppointment = (id: string) => {
    showConfirm(
      'Cancel appointment',
      'Are you sure you want to cancel this appointment? The student will be notified.',
      async () => {
        try {
          setAppointments((prev) => prev.filter((a) => a.id !== id));
          await supabase
            .from('appointments')
            .update({ status: 'cancelled' })
            .eq('id', id);
        } catch (err: any) {
          showAlert('error', 'Could not cancel', err.message || 'Something went wrong. Please try again.');
          fetchData(); // re-fetch to restore accurate state
        }
      },
      () => {},
      'Yes, cancel',
      'Keep it',
    );
  };

  // ── Cancel class ──────────────────────────────────────────────────────────
  const handleCancelClass = (id: string, title: string) => {
    showConfirm(
      'Cancel class',
      `This will cancel "${title}" for all enrolled students. This cannot be undone.`,
      async () => {
        try {
          setMyClasses((prev) => prev.filter((c) => c.id !== id));
          await supabase
            .from('classes')
            .update({ status: 'cancelled' })
            .eq('id', id);
          showAlert('success', 'Class cancelled', 'The class has been cancelled successfully.');
        } catch (err: any) {
          showAlert('error', 'Could not cancel', err.message || 'Something went wrong. Please try again.');
          fetchData();
        }
      },
      () => {},
      'Yes, cancel class',
      'Keep it',
    );
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
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

            {/* Create Class CTA */}
            <TouchableOpacity
              style={styles.createClassBtn}
              onPress={() => navigation?.navigate('CreateClass')}
              activeOpacity={0.85}
            >
              <Ionicons name="add-circle-outline" size={22} color="#fff" />
              <Text style={styles.createClassBtnText}>Create a New Class</Text>
            </TouchableOpacity>

            {/* Student Appointments */}
            <View style={styles.titleBar}>
              <Text style={styles.titleText}>STUDENT APPOINTMENTS</Text>
            </View>

            {appointments.length === 0 ? (
              <View style={styles.emptySection}>
                <Text style={styles.emptyText}>No upcoming appointments from students yet.</Text>
              </View>
            ) : (
              appointments.map((item) => (
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
                  onCancel={() => handleCancelAppointment(item.id)}
                />
              ))
            )}

            {/* My Classes */}
            <View style={[styles.titleBar, { marginTop: 16 }]}>
              <Text style={styles.titleText}>MY CLASSES</Text>
            </View>

            {myClasses.length === 0 ? (
              <View style={styles.emptySection}>
                <Text style={styles.emptyText}>You haven't created any classes yet.</Text>
              </View>
            ) : (
              myClasses.map((cls) => (
                <View key={cls.id} style={styles.classCard}>
                  <View style={styles.classCardHeader}>
                    <View style={[styles.typePill, cls.type === 'group' ? styles.typePillGroup : styles.typePillOne]}>
                      <Text style={styles.typePillText}>{cls.type === 'group' ? 'Group' : '1-on-1'}</Text>
                    </View>
                    <View style={[styles.statusPill, cls.status === 'open' ? styles.statusOpen : styles.statusClosed]}>
                      <Text style={styles.statusText}>{cls.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.classTitle}>{cls.title}</Text>
                  <View style={styles.classRow}>
                    <Ionicons name="people-outline" size={13} color="#A08060" />
                    <Text style={styles.classMeta}>{cls.enrolled ?? 0} / {cls.capacity} enrolled</Text>
                    <Ionicons name="cash-outline" size={13} color="#A08060" />
                    <Text style={styles.classMeta}>${cls.price}</Text>
                  </View>
                  <View style={styles.classRow}>
                    <Ionicons name="calendar-outline" size={13} color="#A08060" />
                    <Text style={styles.classMeta}>{cls.date} · {cls.time_from} – {cls.time_to}</Text>
                  </View>
                  {cls.status === 'open' && (
                    <TouchableOpacity
                      style={styles.cancelClassBtn}
                      onPress={() => handleCancelClass(cls.id, cls.title)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.cancelClassBtnText}>Cancel Class</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
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
  createClassBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#F5A623', borderRadius: 14, paddingVertical: 14, marginBottom: 20 },
  createClassBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  titleBar: { backgroundColor: '#3B1F00', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginBottom: 14 },
  titleText: { color: '#fff', fontSize: 14, fontWeight: '800', letterSpacing: 1.5 },
  card: { backgroundColor: '#FFF3E0', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#F5C070', gap: 8 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardText: { fontSize: 13, color: '#5C4A30' },
  cardBold: { fontWeight: '700', color: '#3B1F00' },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  viewBtn: { flex: 1, backgroundColor: '#3B1F00', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  viewBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  cancelBtn: { flex: 1, backgroundColor: '#F5A623', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  cancelBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  emptySection: { alignItems: 'center', paddingVertical: 20 },
  emptyText: { fontSize: 13, color: '#A08060', fontStyle: 'italic' },
  classCard: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E0D0B8', padding: 14, marginBottom: 12, gap: 8 },
  classCardHeader: { flexDirection: 'row', gap: 8 },
  typePill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  typePillGroup: { backgroundColor: '#F5A623' },
  typePillOne:   { backgroundColor: '#3B1F00' },
  typePillText:  { color: '#fff', fontSize: 10, fontWeight: '700' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  statusOpen:   { backgroundColor: '#F5C070' },
  statusClosed: { backgroundColor: '#C4A882' },
  statusText: { color: '#3B1F00', fontSize: 10, fontWeight: '700' },
  classTitle: { fontSize: 15, fontWeight: '800', color: '#3B1F00' },
  classRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  classMeta: { fontSize: 12, color: '#A08060', marginRight: 8 },
  cancelClassBtn: { backgroundColor: '#FFF3E0', borderRadius: 8, paddingVertical: 8, alignItems: 'center', borderWidth: 1.5, borderColor: '#3B1F00' },
  cancelClassBtnText: { color: '#3B1F00', fontSize: 12, fontWeight: '700' },
});