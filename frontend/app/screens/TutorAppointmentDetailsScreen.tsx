import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import RoleGate from '../components/RoleGate';
import { DatePickerModal, TimePickerModal } from '../components/DateTimePicker';
import { useAlert } from '../components/CustomAlert';
import { supabase } from '../config/supabase';

export default function TutorAppointmentDetailsScreen({ navigation, route }: any) {
  const studentName   = route?.params?.studentName   ?? 'Student';
  const timeFrom      = route?.params?.timeFrom      ?? '2:00pm';
  const timeTo        = route?.params?.timeTo        ?? '4:00pm';
  const payment       = route?.params?.payment       ?? '$40';
  const date          = route?.params?.date          ?? '';
  const appointmentId = route?.params?.appointmentId ?? null;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<any>(null);
  const [rescheduleTime, setRescheduleTime] = useState<any>(null);
  const [cancelReason,   setCancelReason]   = useState('');
  const [submitted,      setSubmitted]      = useState(false);
  const [loading,        setLoading]        = useState(false);

  const { showAlert } = useAlert();

  const formatDate = (d: any) => d ? `${d.day} ${d.month} ${d.year}` : '';
  const formatTime = (t: any) => t ? `${t.hour}:${t.minute} ${t.period}` : '';

  const initials = studentName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSendReschedule = async () => {
    if (!rescheduleDate || !rescheduleTime) {
      showAlert('warning', 'Select date & time', 'Please pick both a new date and time before sending.');
      return;
    }
    if (!appointmentId) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ reschedule_date: formatDate(rescheduleDate), reschedule_time: formatTime(rescheduleTime) })
        .eq('id', appointmentId);
      if (error) throw error;
      showAlert('success', 'Request sent!', 'Reschedule request sent to the student successfully.');
    } catch (err: any) {
      showAlert('error', 'Request failed', err.message || 'Could not send reschedule request.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCancel = async () => {
    if (!cancelReason.trim()) {
      showAlert('warning', 'Reason required', 'Please state the reason for cancellation.');
      return;
    }
    if (!appointmentId) { setSubmitted(true); return; }
    setLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled', cancel_reason: cancelReason.trim() })
        .eq('id', appointmentId);
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      showAlert('error', 'Cancellation failed', err.message || 'Could not cancel appointment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGate allowedRoles={['tutor', 'both']}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

        <TopBar showSearch={false} />

        <BuntingBanner />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.pageHeader}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()} activeOpacity={0.8}>
              <Ionicons name="arrow-back" size={18} color="#3B1F00" />
            </TouchableOpacity>
            <View>
              <Text style={styles.pageEyebrow}>Appointment</Text>
              <Text style={styles.pageTitle}>Details</Text>
            </View>
          </View>
          <View style={styles.heroCard}>
            <View style={styles.heroStripe} />
            <View style={styles.heroInner}>
              <View style={styles.heroAvatar}>
                <Text style={styles.heroAvatarText}>{initials}</Text>
              </View>
              <View style={styles.heroInfo}>
                <Text style={styles.heroName}>{studentName}</Text>
                <View style={styles.upcomingBadge}>
                  <View style={styles.upcomingDot} />
                  <Text style={styles.upcomingText}>Upcoming</Text>
                </View>
              </View>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroDetails}>
              <View style={styles.heroDetailItem}>
                <Ionicons name="calendar-outline" size={14} color="#C4882A" />
                <Text style={styles.heroDetailLabel}>Date</Text>
                <Text style={styles.heroDetailValue}>{date || '—'}</Text>
              </View>
              <View style={styles.heroDetailSep} />
              <View style={styles.heroDetailItem}>
                <Ionicons name="time-outline" size={14} color="#C4882A" />
                <Text style={styles.heroDetailLabel}>Time</Text>
                <Text style={styles.heroDetailValue}>{timeFrom} – {timeTo}</Text>
              </View>
              <View style={styles.heroDetailSep} />
              <View style={styles.heroDetailItem}>
                <Ionicons name="cash-outline" size={14} color="#C4882A" />
                <Text style={styles.heroDetailLabel}>Payment</Text>
                <Text style={styles.heroDetailValue}>{payment}</Text>
              </View>
            </View>
          </View>
          <View style={styles.sectionBlock}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionLabel}>Request Reschedule</Text>
            </View>

            <View style={styles.pickerRow}>
              <TouchableOpacity
                style={[styles.pickerField, styles.pickerFieldHalf]}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="calendar-outline" size={15} color="#F5A623" />
                <Text style={[styles.pickerText, !rescheduleDate && styles.pickerPlaceholder]}>
                  {rescheduleDate ? formatDate(rescheduleDate) : 'Pick date'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.pickerField, styles.pickerFieldHalf]}
                onPress={() => setShowTimePicker(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="time-outline" size={15} color="#F5A623" />
                <Text style={[styles.pickerText, !rescheduleTime && styles.pickerPlaceholder]}>
                  {rescheduleTime ? formatTime(rescheduleTime) : 'Pick time'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
              activeOpacity={0.8}
              onPress={handleSendReschedule}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" size="small" />
                : <>
                    <Ionicons name="send-outline" size={15} color="#fff" />
                    <Text style={styles.primaryBtnText}>Send Request to Student</Text>
                  </>
              }
            </TouchableOpacity>
          </View>
              <View style={[styles.sectionBlock, styles.cancelBlock]}>
            <View style={styles.sectionLabelRow}>
              <View style={[styles.sectionDot, styles.sectionDotRed]} />
              <Text style={[styles.sectionLabel, styles.sectionLabelRed]}>Cancel Appointment</Text>
            </View>

            <Text style={styles.cancelHint}>
              Please explain why you're cancelling. The student will be notified.
            </Text>

            <TextInput
              style={[styles.reasonInput, submitted && styles.reasonInputDisabled]}
              placeholder="State the reason why..."
              placeholderTextColor="#C4A882"
              value={cancelReason}
              onChangeText={setCancelReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!submitted}
            />

            <TouchableOpacity
              style={[styles.cancelSubmitBtn, (submitted || loading) && styles.cancelSubmitBtnDisabled]}
              activeOpacity={0.8}
              onPress={handleSubmitCancel}
              disabled={submitted || loading}
            >
              <Ionicons name="close-circle-outline" size={15} color={submitted ? '#C4A882' : '#C4573A'} />
              <Text style={[styles.cancelSubmitBtnText, submitted && styles.cancelSubmitBtnTextDisabled]}>
                {submitted ? 'Cancellation Submitted' : 'Submit Cancellation'}
              </Text>
            </TouchableOpacity>

            {submitted && (
              <View style={styles.processingCard}>
                <View style={styles.processingIconRow}>
                  <Ionicons name="information-circle-outline" size={18} color="#E67E22" />
                  <Text style={styles.processingTitle}>Request Processing</Text>
                </View>
                <Text style={styles.processingText}>
                  We are processing your request and will get back to you within 24 hrs.
                </Text>
                <View style={styles.noteRow}>
                  <Ionicons name="alert-outline" size={13} color="#E74C3C" />
                  <Text style={styles.noteText}>The company will retain 20% of your payment.</Text>
                </View>
              </View>
            )}
          </View>

        </ScrollView>

        <BottomTabBar />

        <DatePickerModal
          visible={showDatePicker}
          onConfirm={(val: any) => { setRescheduleDate(val); setShowDatePicker(false); }}
          onCancel={() => setShowDatePicker(false)}
          initialValue={rescheduleDate}
        />
        <TimePickerModal
          visible={showTimePicker}
          title="Select New Time"
          onConfirm={(val: any) => { setRescheduleTime(val); setShowTimePicker(false); }}
          onCancel={() => setShowTimePicker(false)}
          initialValue={rescheduleTime}
        />
      </SafeAreaView>
    </RoleGate>
  );
}

const styles = StyleSheet.create({
  safeArea:      { flex: 1, backgroundColor: '#FFFDF5' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 40 },
  pageHeader:  { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, paddingHorizontal: 4 },
  backBtn:     { width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F5C070' },
  pageEyebrow: { fontSize: 11, fontWeight: '700', color: '#F5A623', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 1 },
  pageTitle:   { fontSize: 26, fontWeight: '900', color: '#3B1F00' },
  heroCard: {
    backgroundColor: '#fff', borderRadius: 20, marginBottom: 20,
    borderWidth: 1, borderColor: '#EDE0CC', overflow: 'hidden',
    shadowColor: '#C4882A', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
  },
  heroStripe: { height: 5, backgroundColor: '#F5A623' },
  heroInner:  { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  heroAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#3B1F00', alignItems: 'center', justifyContent: 'center',
  },
  heroAvatarText: { fontSize: 18, fontWeight: '900', color: '#F5A623' },
  heroInfo:       { gap: 5 },
  heroName:       { fontSize: 18, fontWeight: '900', color: '#3B1F00' },
  upcomingBadge:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  upcomingDot:    { width: 6, height: 6, borderRadius: 3, backgroundColor: '#27AE60' },
  upcomingText:   { fontSize: 11, fontWeight: '600', color: '#27AE60' },
  heroDivider:    { height: 1, backgroundColor: '#F0E6D4', marginHorizontal: 16 },
  heroDetails:    { flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 8 },
  heroDetailItem: { flex: 1, alignItems: 'center', gap: 4 },
  heroDetailSep:  { width: 1, height: 40, backgroundColor: '#F0E6D4' },
  heroDetailLabel: { fontSize: 9, fontWeight: '700', color: '#C4A882', textTransform: 'uppercase', letterSpacing: 0.8 },
  heroDetailValue: { fontSize: 12, fontWeight: '800', color: '#3B1F00', textAlign: 'center' },
  sectionBlock: {
    backgroundColor: '#fff', borderRadius: 18, marginBottom: 16,
    borderWidth: 1, borderColor: '#EDE0CC', padding: 16, gap: 12,
    shadowColor: '#C4882A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cancelBlock:    { borderColor: '#F5C4B0' },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionDot:      { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F5A623' },
  sectionDotRed:   { backgroundColor: '#C4573A' },
  sectionLabel:    { fontSize: 14, fontWeight: '800', color: '#3B1F00' },
  sectionLabelRed: { color: '#C4573A' },
  pickerRow:        { flexDirection: 'row', gap: 10 },
  pickerFieldHalf:  { flex: 1 },
  pickerField: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFFDF5', borderRadius: 10,
    borderWidth: 1, borderColor: '#E0D0B8',
    paddingVertical: 11, paddingHorizontal: 12,
  },
  pickerText:        { flex: 1, fontSize: 13, color: '#3B1F00', fontWeight: '600' },
  pickerPlaceholder: { color: '#C4A882', fontWeight: '400' },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#3B1F00', borderRadius: 12, paddingVertical: 13,
  },
  primaryBtnDisabled: { backgroundColor: '#8B6F4E' },
  primaryBtnText:     { color: '#fff', fontSize: 13, fontWeight: '800' },
  cancelHint:    { fontSize: 12, color: '#A08060', lineHeight: 18 },
  reasonInput: {
    backgroundColor: '#FFFDF5', borderRadius: 12,
    borderWidth: 1, borderColor: '#F5C4B0',
    padding: 12, fontSize: 13, color: '#3B1F00',
    minHeight: 96, lineHeight: 20,
  },
  reasonInputDisabled: { opacity: 0.6 },
  cancelSubmitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#FFF0EB', borderRadius: 12, paddingVertical: 13,
    borderWidth: 1.5, borderColor: '#F5C4B0',
  },
  cancelSubmitBtnDisabled: { borderColor: '#E0D0B8', backgroundColor: '#F5F0E8' },
  cancelSubmitBtnText:     { color: '#C4573A', fontSize: 13, fontWeight: '800' },
  cancelSubmitBtnTextDisabled: { color: '#C4A882' },
  processingCard: {
    backgroundColor: '#FFF8EE', borderRadius: 12,
    borderWidth: 1, borderColor: '#F5C070', padding: 14, gap: 8,
  },
  processingIconRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  processingTitle:   { fontSize: 13, fontWeight: '800', color: '#E67E22' },
  processingText:    { fontSize: 12, color: '#7D5A1E', lineHeight: 18 },
  noteRow:           { flexDirection: 'row', alignItems: 'center', gap: 6 },
  noteText:          { fontSize: 11, color: '#E74C3C', fontWeight: '700', flex: 1 },
});