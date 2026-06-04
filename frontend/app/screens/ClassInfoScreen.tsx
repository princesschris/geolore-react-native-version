import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BottomTabBar from '../components/BottomTabBar';
import { DatePickerModal, TimePickerModal } from '../components/DateTimePicker';
import { useRole } from '../context/AuthContext';
import { useAlert } from '../components/CustomAlert';
import { supabase } from '../config/supabase';

export default function ClassInfoScreen({ navigation, route }: any) {
  const { isTutor }   = useRole();
  const { showAlert } = useAlert();

  const tutorName     = route?.params?.tutorName     ?? 'Chinazom';
  const studentName   = route?.params?.studentName   ?? 'Student';
  const timeFrom      = route?.params?.timeFrom      ?? '2:00pm';
  const timeTo        = route?.params?.timeTo        ?? '4:00pm';
  const payment       = route?.params?.payment       ?? '$40';
  const appointmentId = route?.params?.appointmentId ?? null;

  const [cancelReason,   setCancelReason]   = useState('');
  const [submitted,      setSubmitted]      = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<any>(null);
  const [rescheduleTime, setRescheduleTime] = useState<any>(null);

  const otherPartyLabel  = isTutor ? 'Student' : 'Tutor';
  const otherPartyName   = isTutor ? studentName : tutorName;
  const sendRequestLabel = isTutor ? 'Send request to student' : 'Send request to tutor';

  const formatDate = (d: any) => d ? `${d.day} ${d.month} ${d.year}` : '';
  const formatTime = (t: any) => t ? `${t.hour}:${t.minute} ${t.period}` : '';

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
      showAlert('success', 'Request sent!', 'Your reschedule request has been submitted successfully.');
    } catch (err: any) {
      showAlert('error', 'Request failed', err.message || 'Could not send reschedule request.');
    } finally { setLoading(false); }
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
    } finally { setLoading(false); }
  };

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
        <View>
          <Text style={styles.heroLabel}>CLASS INFO</Text>
          <Text style={styles.heroTitle}>{otherPartyName}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation?.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <View style={styles.chipsRow}>
          <View style={styles.chip}>
            <Ionicons name="person-outline" size={14} color="#F5A623" />
            <Text style={styles.chipText}>{otherPartyLabel}: <Text style={styles.chipBold}>{otherPartyName}</Text></Text>
          </View>
          <View style={styles.chip}>
            <Ionicons name="time-outline" size={14} color="#F5A623" />
            <Text style={styles.chipText}>{timeFrom} – {timeTo}</Text>
          </View>
          <View style={styles.chip}>
            <Ionicons name="cash-outline" size={14} color="#F5A623" />
            <Text style={styles.chipText}><Text style={styles.chipBold}>{payment}</Text></Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
              <Ionicons name="calendar-outline" size={16} color="#F5A623" />
            </View>
            <Text style={styles.sectionTitle}>Reschedule</Text>
          </View>

          <TouchableOpacity style={styles.pickerField} onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
            <Text style={[styles.pickerFieldText, !rescheduleDate && styles.pickerPlaceholder]}>
              {rescheduleDate ? formatDate(rescheduleDate) : 'Select new date'}
            </Text>
            <Ionicons name="calendar-outline" size={16} color="#F5A623" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.pickerField} onPress={() => setShowTimePicker(true)} activeOpacity={0.8}>
            <Text style={[styles.pickerFieldText, !rescheduleTime && styles.pickerPlaceholder]}>
              {rescheduleTime ? formatTime(rescheduleTime) : 'Select new time'}
            </Text>
            <Ionicons name="time-outline" size={16} color="#F5A623" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, loading && styles.actionBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleSendReschedule}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <>
                  <Ionicons name="send-outline" size={16} color="#fff" />
                  <Text style={styles.actionBtnText}>{sendRequestLabel}</Text>
                </>
            }
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, { backgroundColor: '#FFF0F0' }]}>
              <Ionicons name="close-circle-outline" size={16} color="#E74C3C" />
            </View>
            <Text style={styles.sectionTitle}>Cancel Appointment</Text>
          </View>

          <TextInput
            style={[styles.reasonInput, submitted && styles.reasonInputDisabled]}
            placeholder="State the reason why…"
            placeholderTextColor="#C4A882"
            value={cancelReason}
            onChangeText={setCancelReason}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!submitted}
          />

          <TouchableOpacity
            style={[styles.cancelBtn, (submitted || loading) && styles.cancelBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleSubmitCancel}
            disabled={submitted || loading}
          >
            <Text style={styles.cancelBtnText}>{submitted ? 'Request Submitted' : 'Submit Cancellation'}</Text>
          </TouchableOpacity>
        </View>

        {submitted && (
          <View style={styles.processingCard}>
            <Ionicons name="information-circle" size={20} color="#E67E22" />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.processingText}>
                We are processing your request and will get back to you within 24 hrs.
              </Text>
              <Text style={styles.noteText}>NOTE: The company will keep 20% of your payment.</Text>
            </View>
          </View>
        )}
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
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },

  heroHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 16, paddingBottom: 20, paddingHorizontal: 16, gap: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  heroTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  headerIcons: { marginLeft: 'auto', flexDirection: 'row', gap: 8 },
  headerIconBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },

  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40, gap: 16 },

  chipsRow: { gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 14,
    borderWidth: 1, borderColor: '#F0E6D6',
  },
  chipText: { fontSize: 13, color: '#5C4A30' },
  chipBold: { fontWeight: '700', color: '#3B1F00' },

  sectionCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 16, gap: 12,
    borderWidth: 1, borderColor: '#F0E6D6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  sectionHeader:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionIconWrap: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#3B1F00' },

  pickerField: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFDF5', borderRadius: 10,
    borderWidth: 1, borderColor: '#E0D0B8',
    paddingVertical: 12, paddingHorizontal: 14,
  },
  pickerFieldText:  { fontSize: 13, color: '#3B1F00', fontWeight: '600' },
  pickerPlaceholder: { color: '#C4A882', fontWeight: '400' },

  actionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#F5A623', borderRadius: 12, paddingVertical: 13,
    shadowColor: '#F5A623', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 6, elevation: 3,
  },
  actionBtnDisabled: { backgroundColor: '#E0C49A', shadowOpacity: 0 },
  actionBtnText:     { color: '#fff', fontSize: 13, fontWeight: '700' },

  reasonInput: {
    backgroundColor: '#FFFDF5', borderRadius: 10,
    borderWidth: 1, borderColor: '#E0D0B8',
    padding: 12, fontSize: 13, color: '#3B1F00', minHeight: 90,
  },
  reasonInputDisabled: { backgroundColor: '#F5F0E8', color: '#A08060' },

  cancelBtn: {
    backgroundColor: '#3B1F00', borderRadius: 12,
    paddingVertical: 13, alignItems: 'center',
  },
  cancelBtnDisabled: { backgroundColor: '#8B6F4E' },
  cancelBtnText:     { color: '#fff', fontSize: 13, fontWeight: '700' },

  processingCard: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    backgroundColor: '#FFF8F0', borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: '#F5C070',
  },
  processingText: { fontSize: 12, color: '#E67E22', lineHeight: 18 },
  noteText:       { fontSize: 12, color: '#E74C3C', fontWeight: '700' },
});