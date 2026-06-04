import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BottomTabBar from '../components/BottomTabBar';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../components/CustomAlert';

export default function ClassDetailScreen({ navigation, route }: any) {
  const classItem               = route?.params?.classItem;
  const [enrolled, setEnrolled] = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [booking,  setBooking]  = useState(false);

  const { user }      = useAuth();
  const { showAlert } = useAlert();

  const spotsLeft = (classItem?.capacity ?? 1) - (classItem?.enrolled ?? 0);
  const isFull    = spotsLeft <= 0;
  const isGroup   = classItem?.type === 'group';

  useEffect(() => {
    const check = async () => {
      if (!user?.id || !classItem?.id) { setLoading(false); return; }
      const { data } = await supabase
        .from('class_enrollments').select('id')
        .eq('class_id', classItem.id).eq('student_id', user.id).single();
      setEnrolled(!!data);
      setLoading(false);
    };
    check();
  }, [classItem?.id, user?.id]);

  const handleEnroll = async () => {
    if (isFull) { showAlert('warning', 'Class full', 'This class has no more spots available.'); return; }
    if (!user?.id || !classItem?.id) return;
    setBooking(true);
    try {
      const { error: enrollError } = await supabase
        .from('class_enrollments').insert({ class_id: classItem.id, student_id: user.id });
      if (enrollError) throw enrollError;
      await supabase.from('classes').update({ enrolled: (classItem.enrolled ?? 0) + 1 }).eq('id', classItem.id);
      await supabase.from('appointments').insert({
        student_id: user.id, tutor_id: classItem.tutor_id, tutor_name: classItem.tutor_name,
        date: classItem.date, time_from: classItem.time_from, time_to: classItem.time_to,
        price: `$${classItem.price}`, status: 'upcoming',
      });
      setEnrolled(true);
      showAlert('success', 'Enrolled!', `You have successfully joined "${classItem.title}".`);
    } catch (err: any) {
      showAlert('error', 'Enrolment failed', err.message || 'Could not enrol. Please try again.');
    } finally { setBooking(false); }
  };

  if (!classItem) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}><Text style={styles.errorText}>Class not found.</Text></View>
      </SafeAreaView>
    );
  }

  const enrollPct = Math.min(((classItem.enrolled ?? 0) / classItem.capacity) * 100, 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#F5A623" />
      <LinearGradient
        colors={['#F5A623', '#E8891A']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.heroHeader}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={[styles.typePill, isGroup ? styles.typePillGroup : styles.typePillOne]}>
          <Ionicons name={isGroup ? 'people' : 'person'} size={12} color="#fff" />
          <Text style={styles.typePillText}>{isGroup ? 'Group Class' : 'One-on-One'}</Text>
        </View>

        <Text style={styles.heroTitle}>{classItem.title}</Text>
        <View style={styles.heroLangRow}>
          <Ionicons name="language" size={14} color="rgba(255,255,255,0.8)" />
          <Text style={styles.heroLang}>{classItem.language}</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.infoGrid}>
          {[
            { icon: 'person-outline',   label: 'Tutor',  value: classItem.tutor_name },
            { icon: 'calendar-outline', label: 'Date',   value: classItem.date },
            { icon: 'time-outline',     label: 'Time',   value: `${classItem.time_from} – ${classItem.time_to}` },
            { icon: 'cash-outline',     label: 'Price',  value: `$${classItem.price}` },
          ].map((item) => (
            <View key={item.label} style={styles.infoCell}>
              <View style={styles.infoIcon}>
                <Ionicons name={item.icon as any} size={16} color="#F5A623" />
              </View>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>
        {isGroup && (
          <View style={styles.capacityCard}>
            <View style={styles.capacityHeader}>
              <Text style={styles.capacityTitle}>Enrollment</Text>
              <Text style={[styles.capacityCount, isFull && { color: '#E74C3C' }]}>
                {isFull ? 'Full' : `${spotsLeft} spots left`}
              </Text>
            </View>
            <View style={styles.capacityTrack}>
              <View style={[styles.capacityFill, { width: `${enrollPct}%` }, isFull && styles.capacityFillFull]} />
            </View>
            <Text style={styles.capacitySub}>{classItem.enrolled ?? 0} of {classItem.capacity} enrolled</Text>
          </View>
        )}
        {loading ? (
          <ActivityIndicator color="#F5A623" style={{ marginTop: 24 }} />
        ) : enrolled ? (
          <View style={styles.enrolledBanner}>
            <View style={styles.enrolledIcon}>
              <Ionicons name="checkmark" size={18} color="#27AE60" />
            </View>
            <Text style={styles.enrolledText}>You&apos;re enrolled in this class</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.enrollBtn, (isFull || booking) && styles.enrollBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleEnroll}
            disabled={isFull || booking}
          >
            {booking
              ? <ActivityIndicator color="#fff" />
              : <>
                  <Ionicons name={isFull ? 'close-circle-outline' : 'checkmark-circle-outline'} size={18} color="#fff" />
                  <Text style={styles.enrollBtnText}>{isFull ? 'Class Full' : 'Enrol Now'}</Text>
                </>
            }
          </TouchableOpacity>
        )}
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:         { flex: 1, backgroundColor: '#FFFDF5' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText:        { fontSize: 14, color: '#A08060' },

  heroHeader: { paddingTop: 16, paddingBottom: 28, paddingHorizontal: 20, gap: 8 },
  backBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  typePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.25)',
  },
  typePillGroup: {},
  typePillOne:   {},
  typePillText:  { color: '#fff', fontSize: 11, fontWeight: '700' },
  heroTitle:     { fontSize: 24, fontWeight: '800', color: '#fff', lineHeight: 30 },
  heroLangRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroLang:      { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },

  scrollContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },

  infoGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20,
  },
  infoCell: {
    width: '47%', backgroundColor: '#fff',
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#F0E6D6',
    gap: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  infoIcon:  { width: 32, height: 32, borderRadius: 10, backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  infoLabel: { fontSize: 11, color: '#A08060', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontSize: 14, fontWeight: '700', color: '#3B1F00' },

  capacityCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: '#F0E6D6',
    gap: 8,
  },
  capacityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  capacityTitle:  { fontSize: 13, fontWeight: '700', color: '#3B1F00' },
  capacityCount:  { fontSize: 13, fontWeight: '700', color: '#F5A623' },
  capacityTrack:  { height: 8, backgroundColor: '#F0E6D6', borderRadius: 4, overflow: 'hidden' },
  capacityFill:   { height: '100%', backgroundColor: '#F5A623', borderRadius: 4 },
  capacityFillFull: { backgroundColor: '#E74C3C' },
  capacitySub:    { fontSize: 12, color: '#A08060' },

  enrolledBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#F0FFF4', borderRadius: 14,
    paddingVertical: 16, paddingHorizontal: 20,
    borderWidth: 1, borderColor: '#A8E6C0',
  },
  enrolledIcon: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center',
  },
  enrolledText: { fontSize: 14, fontWeight: '700', color: '#27AE60' },

  enrollBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#F5A623', paddingVertical: 16, borderRadius: 14,
    shadowColor: '#F5A623', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  enrollBtnDisabled: { backgroundColor: '#E0C49A', shadowOpacity: 0 },
  enrollBtnText:     { color: '#fff', fontWeight: '800', fontSize: 15 },
});