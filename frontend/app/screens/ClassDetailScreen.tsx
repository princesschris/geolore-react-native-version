import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../components/CustomAlert';

export default function ClassDetailScreen({ navigation, route }: any) {
  const classItem           = route?.params?.classItem;
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
        .from('class_enrollments')
        .select('id')
        .eq('class_id', classItem.id)
        .eq('student_id', user.id)
        .single();
      setEnrolled(!!data);
      setLoading(false);
    };
    check();
  }, [classItem?.id, user?.id]);

  const handleEnroll = async () => {
    if (isFull) {
      showAlert('warning', 'Class full', 'This class has no more spots available.');
      return;
    }
    if (!user?.id || !classItem?.id) return;
    setBooking(true);
    try {
      const { error: enrollError } = await supabase
        .from('class_enrollments')
        .insert({ class_id: classItem.id, student_id: user.id });
      if (enrollError) throw enrollError;

      await supabase
        .from('classes')
        .update({ enrolled: (classItem.enrolled ?? 0) + 1 })
        .eq('id', classItem.id);

      await supabase.from('appointments').insert({
        student_id: user.id,
        tutor_id:   classItem.tutor_id,
        tutor_name: classItem.tutor_name,
        date:       classItem.date,
        time_from:  classItem.time_from,
        time_to:    classItem.time_to,
        price:      `$${classItem.price}`,
        status:     'upcoming',
      });

      setEnrolled(true);
      showAlert('success', 'Enrolled!', `You have successfully joined "${classItem.title}".`);
    } catch (err: any) {
      showAlert('error', 'Enrolment failed', err.message || 'Could not enrol. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (!classItem) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Class not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back-outline" size={22} color="#5C3A00" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Class Details</Text>
        <View style={{ width: 36 }} />
      </View>

      <BuntingBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.classCard}>
          <View style={[styles.typeBadge, isGroup ? styles.typeBadgeGroup : styles.typeBadgeOne]}>
            <Ionicons name={isGroup ? 'people' : 'person'} size={13} color="#fff" />
            <Text style={styles.typeBadgeText}>{isGroup ? 'Group Class' : 'One-on-One'}</Text>
          </View>
          <Text style={styles.classTitle}>{classItem.title}</Text>
          <Text style={styles.language}>🗣 {classItem.language}</Text>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="person-outline" size={16} color="#F5A623" />
              <Text style={styles.detailLabel}>Tutor</Text>
              <Text style={styles.detailValue}>{classItem.tutor_name}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color="#F5A623" />
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{classItem.date}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color="#F5A623" />
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{classItem.time_from} – {classItem.time_to}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={16} color="#F5A623" />
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValue}>${classItem.price}</Text>
            </View>
            {isGroup && (
              <View style={styles.detailItem}>
                <Ionicons name="people-outline" size={16} color="#F5A623" />
                <Text style={styles.detailLabel}>Spots</Text>
                <Text style={[styles.detailValue, isFull && { color: '#E74C3C' }]}>
                  {isFull ? 'Full' : `${spotsLeft} / ${classItem.capacity}`}
                </Text>
              </View>
            )}
          </View>
        </View>

        {isGroup && (
          <View style={styles.capacitySection}>
            <Text style={styles.capacityLabel}>Enrollment</Text>
            <View style={styles.capacityBar}>
              <View style={[
                styles.capacityFill,
                { width: `${Math.min(((classItem.enrolled ?? 0) / classItem.capacity) * 100, 100)}%` },
                isFull && styles.capacityFillFull,
              ]} />
            </View>
            <Text style={styles.capacityText}>{classItem.enrolled ?? 0} enrolled out of {classItem.capacity}</Text>
          </View>
        )}

        {loading ? (
          <ActivityIndicator color="#F5A623" style={{ marginTop: 24 }} />
        ) : enrolled ? (
          <View style={styles.enrolledBanner}>
            <Ionicons name="checkmark-circle" size={22} color="#27AE60" />
            <Text style={styles.enrolledText}>You're enrolled in this class</Text>
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
              : <Text style={styles.enrollBtnText}>{isFull ? 'Class Full' : 'Enrol Now'}</Text>
            }
          </TouchableOpacity>
        )}
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', color: '#F5A623', textAlign: 'center' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 14, color: '#A08060' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  classCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E0D0B8', padding: 20, marginBottom: 20, gap: 10 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginBottom: 4 },
  typeBadgeGroup: { backgroundColor: '#3B8ED0' },
  typeBadgeOne:   { backgroundColor: '#F5A623' },
  typeBadgeText:  { color: '#fff', fontSize: 11, fontWeight: '700' },
  classTitle: { fontSize: 22, fontWeight: '800', color: '#3B1F00' },
  language:   { fontSize: 14, color: '#7A5C3A', fontWeight: '600' },
  detailsGrid: { gap: 12, marginTop: 8 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailLabel: { fontSize: 12, color: '#A08060', width: 50 },
  detailValue: { fontSize: 14, fontWeight: '700', color: '#3B1F00', flex: 1 },
  capacitySection: { marginBottom: 20, gap: 8 },
  capacityLabel: { fontSize: 13, fontWeight: '700', color: '#3B1F00' },
  capacityBar: { height: 8, backgroundColor: '#F0E6D6', borderRadius: 4, overflow: 'hidden' },
  capacityFill: { height: '100%', backgroundColor: '#F5A623', borderRadius: 4 },
  capacityFillFull: { backgroundColor: '#E74C3C' },
  capacityText: { fontSize: 12, color: '#A08060' },
  enrolledBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#F0FFF4', borderRadius: 12, paddingVertical: 14, borderWidth: 1, borderColor: '#27AE60' },
  enrolledText: { fontSize: 14, fontWeight: '700', color: '#27AE60' },
  enrollBtn: { backgroundColor: '#F5A623', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  enrollBtnDisabled: { backgroundColor: '#E0C49A' },
  enrollBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});