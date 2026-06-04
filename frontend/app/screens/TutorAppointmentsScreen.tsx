import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
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

  const initials = item.student_first_name
    ? `${item.student_first_name[0]}${item.student_last_name?.[0] ?? ''}`.toUpperCase()
    : 'ST';

  return (
    <View style={styles.apptCard}>
      <View style={styles.apptStripe} />

      <View style={styles.apptInner}>
        <View style={styles.apptHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.apptHeaderInfo}>
            <Text style={styles.apptStudentName}>{studentName}</Text>
            <View style={styles.upcomingBadge}>
              <View style={styles.upcomingDot} />
              <Text style={styles.upcomingBadgeText}>Upcoming</Text>
            </View>
          </View>
        </View>
        <View style={styles.apptDivider} />
        <View style={styles.apptDetails}>
          <View style={styles.apptDetailItem}>
            <Ionicons name="calendar-outline" size={13} color="#C4882A" />
            <Text style={styles.apptDetailLabel}>Date</Text>
            <Text style={styles.apptDetailValue}>{item.date}</Text>
          </View>
          <View style={styles.apptDetailSep} />
          <View style={styles.apptDetailItem}>
            <Ionicons name="time-outline" size={13} color="#C4882A" />
            <Text style={styles.apptDetailLabel}>Time</Text>
            <Text style={styles.apptDetailValue}>{item.time_from} – {item.time_to}</Text>
          </View>
          <View style={styles.apptDetailSep} />
          <View style={styles.apptDetailItem}>
            <Ionicons name="cash-outline" size={13} color="#C4882A" />
            <Text style={styles.apptDetailLabel}>Payment</Text>
            <Text style={styles.apptDetailValue}>{item.price}</Text>
          </View>
        </View>
        <View style={styles.apptActions}>
          <TouchableOpacity style={styles.viewApptBtn} onPress={onPress} activeOpacity={0.8}>
            <Ionicons name="eye-outline" size={14} color="#fff" />
            <Text style={styles.viewApptBtnText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelApptBtn} onPress={onCancel} activeOpacity={0.8}>
            <Ionicons name="close-outline" size={14} color="#C4573A" />
            <Text style={styles.cancelApptBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
function ClassCard({ cls, onCancel }: { cls: any; onCancel: () => void }) {
  const isGroup = cls.type === 'group';
  const isOpen  = cls.status === 'open';

  return (
    <View style={styles.classCard}>
      <View style={styles.classCardTop}>
        <View style={styles.classCardTitleRow}>
          <Text style={styles.classTitle} numberOfLines={1}>{cls.title}</Text>
          <View style={[styles.classStatusBadge, isOpen ? styles.classStatusOpen : styles.classStatusClosed]}>
            <Text style={[styles.classStatusText, isOpen ? styles.classStatusTextOpen : styles.classStatusTextClosed]}>
              {cls.status}
            </Text>
          </View>
        </View>

        <View style={styles.classTypePill}>
          <Ionicons name={isGroup ? 'people-outline' : 'person-outline'} size={11} color="#C4882A" />
          <Text style={styles.classTypeText}>{isGroup ? 'Group Class' : '1-on-1'}</Text>
        </View>
      </View>

      <View style={styles.classMeta}>
        <View style={styles.classMetaItem}>
          <Ionicons name="people-outline" size={12} color="#A08060" />
          <Text style={styles.classMetaText}>{cls.enrolled ?? 0} / {cls.capacity} enrolled</Text>
        </View>
        <View style={styles.classMetaItem}>
          <Ionicons name="cash-outline" size={12} color="#A08060" />
          <Text style={styles.classMetaText}>${cls.price}</Text>
        </View>
        <View style={styles.classMetaItem}>
          <Ionicons name="calendar-outline" size={12} color="#A08060" />
          <Text style={styles.classMetaText}>{cls.date}</Text>
        </View>
        <View style={styles.classMetaItem}>
          <Ionicons name="time-outline" size={12} color="#A08060" />
          <Text style={styles.classMetaText}>{cls.time_from} – {cls.time_to}</Text>
        </View>
      </View>
      <View style={styles.enrollBar}>
        <View style={[styles.enrollFill, { width: `${Math.min(((cls.enrolled ?? 0) / (cls.capacity || 1)) * 100, 100)}%` as any }]} />
      </View>

      {isOpen && (
        <TouchableOpacity style={styles.cancelClassBtn} onPress={onCancel} activeOpacity={0.8}>
          <Text style={styles.cancelClassBtnText}>Cancel Class</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderLine} />
      <Text style={styles.sectionHeaderText}>{title}</Text>
      {count !== undefined && (
        <View style={styles.sectionCount}>
          <Text style={styles.sectionCountText}>{count}</Text>
        </View>
      )}
      <View style={styles.sectionHeaderLine} />
    </View>
  );
}
export default function TutorAppointmentsScreen({ navigation }: any) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [myClasses,    setMyClasses]    = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);

  const { user }                   = useAuth();
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

  const handleCancelAppointment = (id: string) => {
    showConfirm(
      'Cancel appointment',
      'Are you sure you want to cancel this appointment? The student will be notified.',
      async () => {
        try {
          setAppointments((prev) => prev.filter((a) => a.id !== id));
          await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id);
        } catch (err: any) {
          showAlert('error', 'Could not cancel', err.message || 'Something went wrong.');
          fetchData();
        }
      },
      () => {},
      'Yes, cancel',
      'Keep it',
    );
  };

  const handleCancelClass = (id: string, title: string) => {
    showConfirm(
      'Cancel class',
      `This will cancel "${title}" for all enrolled students. This cannot be undone.`,
      async () => {
        try {
          setMyClasses((prev) => prev.filter((c) => c.id !== id));
          await supabase.from('classes').update({ status: 'cancelled' }).eq('id', id);
          showAlert('success', 'Class cancelled', 'The class has been cancelled successfully.');
        } catch (err: any) {
          showAlert('error', 'Could not cancel', err.message || 'Something went wrong.');
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
        <TopBar showSearch={false} />

        <BuntingBanner />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F5A623" />
            <Text style={styles.loadingText}>Loading your schedule...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

              <View style={styles.pageHeader}>
              <View>
                <Text style={styles.pageEyebrow}>Your Schedule</Text>
                <Text style={styles.pageTitle}>Appointments</Text>
              </View>
              <View style={styles.pageHeaderBadge}>
                <Ionicons name="calendar" size={26} color="#F5A623" />
              </View>
            </View>

            <TouchableOpacity
              style={styles.createClassBtn}
              onPress={() => navigation?.navigate('CreateClass')}
              activeOpacity={0.85}
            >
              <View style={styles.createClassIcon}>
                <Ionicons name="add" size={20} color="#F5A623" />
              </View>
              <Text style={styles.createClassBtnText}>Create a New Class</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
            <SectionHeader title="Student Appointments" count={appointments.length} />

            {appointments.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="calendar-outline" size={36} color="#E0C89A" />
                <Text style={styles.emptyTitle}>No upcoming appointments</Text>
                <Text style={styles.emptySubtitle}>Students haven't booked with you yet.</Text>
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
            <SectionHeader title="My Classes" count={myClasses.length} />

            {myClasses.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="school-outline" size={36} color="#E0C89A" />
                <Text style={styles.emptyTitle}>No classes yet</Text>
                <Text style={styles.emptySubtitle}>Tap "Create a New Class" to get started.</Text>
              </View>
            ) : (
              myClasses.map((cls) => (
                <ClassCard
                  key={cls.id}
                  cls={cls}
                  onCancel={() => handleCancelClass(cls.id, cls.title)}
                />
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
  safeArea:         { flex: 1, backgroundColor: '#FFFDF5' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText:      { fontSize: 13, color: '#A08060', fontWeight: '500' },
  scrollContent:    { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 40 },
  pageHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 20, paddingHorizontal: 4,
  },
  pageEyebrow: { fontSize: 11, fontWeight: '700', color: '#F5A623', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 2 },
  pageTitle:   { fontSize: 28, fontWeight: '900', color: '#3B1F00', letterSpacing: 0.3 },
  pageHeaderBadge: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#F5C070',
  },
  createClassBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#3B1F00', borderRadius: 16,
    paddingVertical: 15, paddingHorizontal: 18, marginBottom: 28,
  },
  createClassIcon: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: 'rgba(245,166,35,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  createClassBtnText: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '800' },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14,
  },
  sectionHeaderLine: { flex: 1, height: 1, backgroundColor: '#E8D5B5' },
  sectionHeaderText: { fontSize: 11, fontWeight: '800', color: '#A08060', letterSpacing: 1.2, textTransform: 'uppercase' },
  sectionCount: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#F5A623', alignItems: 'center', justifyContent: 'center',
  },
  sectionCountText: { fontSize: 10, fontWeight: '900', color: '#fff' },
  apptCard: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderRadius: 18, marginBottom: 14,
    borderWidth: 1, borderColor: '#EDE0CC',
    shadowColor: '#C4882A', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
    overflow: 'hidden',
  },
  apptStripe: { width: 5, backgroundColor: '#F5A623' },
  apptInner:  { flex: 1, padding: 16, gap: 12 },

  apptHeader:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#3B1F00', alignItems: 'center', justifyContent: 'center',
  },
  avatarText:      { fontSize: 15, fontWeight: '800', color: '#F5A623' },
  apptHeaderInfo:  { gap: 4 },
  apptStudentName: { fontSize: 16, fontWeight: '800', color: '#3B1F00' },
  upcomingBadge:   { flexDirection: 'row', alignItems: 'center', gap: 5 },
  upcomingDot:     { width: 6, height: 6, borderRadius: 3, backgroundColor: '#27AE60' },
  upcomingBadgeText: { fontSize: 11, fontWeight: '600', color: '#27AE60' },
  apptDivider: { height: 1, backgroundColor: '#F0E6D4' },
  apptDetails:    { flexDirection: 'row', alignItems: 'center' },
  apptDetailItem: { flex: 1, alignItems: 'center', gap: 3 },
  apptDetailSep:  { width: 1, height: 36, backgroundColor: '#F0E6D4' },
  apptDetailLabel: { fontSize: 9, fontWeight: '700', color: '#C4A882', textTransform: 'uppercase', letterSpacing: 0.8 },
  apptDetailValue: { fontSize: 12, fontWeight: '700', color: '#3B1F00', textAlign: 'center' },
  apptActions:    { flexDirection: 'row', gap: 8 },
  viewApptBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#3B1F00', borderRadius: 10, paddingVertical: 10,
  },
  viewApptBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  cancelApptBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: '#FFF0EB', borderRadius: 10, paddingVertical: 10,
    borderWidth: 1, borderColor: '#F5C4B0',
  },
  cancelApptBtnText: { color: '#C4573A', fontSize: 12, fontWeight: '700' },
  classCard: {
    backgroundColor: '#fff', borderRadius: 18, marginBottom: 14,
    borderWidth: 1, borderColor: '#EDE0CC', padding: 16, gap: 10,
    shadowColor: '#C4882A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  classCardTop:     { gap: 6 },
  classCardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  classTitle:       { flex: 1, fontSize: 16, fontWeight: '800', color: '#3B1F00' },
  classStatusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  classStatusOpen:  { backgroundColor: '#E8F8EF', borderWidth: 1, borderColor: '#A8E6C0' },
  classStatusClosed: { backgroundColor: '#F5F0E8', borderWidth: 1, borderColor: '#D4C4A4' },
  classStatusText:  { fontSize: 10, fontWeight: '700' },
  classStatusTextOpen:   { color: '#27AE60' },
  classStatusTextClosed: { color: '#A08060' },
  classTypePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    alignSelf: 'flex-start', backgroundColor: '#FFF3E0',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
    borderWidth: 1, borderColor: '#F5C070',
  },
  classTypeText: { fontSize: 11, fontWeight: '700', color: '#C4882A' },
  classMeta:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  classMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  classMetaText: { fontSize: 12, color: '#A08060' },
  enrollBar: { height: 4, backgroundColor: '#F0E6D4', borderRadius: 2, overflow: 'hidden' },
  enrollFill: { height: 4, backgroundColor: '#F5A623', borderRadius: 2 },
  cancelClassBtn: {
    backgroundColor: '#FFF0EB', borderRadius: 10, paddingVertical: 9,
    alignItems: 'center', borderWidth: 1, borderColor: '#F5C4B0',
  },
  cancelClassBtnText: { color: '#C4573A', fontSize: 12, fontWeight: '700' },
  emptyCard: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFF8EE', borderRadius: 16,
    paddingVertical: 32, marginBottom: 14,
    borderWidth: 1, borderColor: '#EDE0CC',
    gap: 8,
  },
  emptyTitle:    { fontSize: 15, fontWeight: '800', color: '#3B1F00' },
  emptySubtitle: { fontSize: 12, color: '#A08060', textAlign: 'center' },
});