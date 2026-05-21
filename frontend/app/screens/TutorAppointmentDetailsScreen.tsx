import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import RoleGate from '../components/RoleGate';
import { DatePickerModal, TimePickerModal } from '../components/DateTimePicker';
import { supabase } from '../config/supabase';

export default function TutorAppointmentDetailsScreen({ navigation, route }: any) {
  const studentName   = route?.params?.studentName   ?? 'Student';
  const timeFrom      = route?.params?.timeFrom      ?? '2:00pm';
  const timeTo        = route?.params?.timeTo        ?? '4:00pm';
  const payment       = route?.params?.payment       ?? '$40';
  const appointmentId = route?.params?.appointmentId ?? null;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<any>(null);
  const [rescheduleTime, setRescheduleTime] = useState<any>(null);
  const [cancelReason,   setCancelReason]   = useState('');
  const [submitted,      setSubmitted]      = useState(false);
  const [loading,        setLoading]        = useState(false);

  const formatDate = (d: any) => d ? `${d.day} ${d.month} ${d.year}` : '';
  const formatTime = (t: any) => t ? `${t.hour}:${t.minute} ${t.period}` : '';

  const handleSendReschedule = async () => {
    if (!rescheduleDate || !rescheduleTime) {
      Alert.alert('Select date and time', 'Please select both a new date and time.');
      return;
    }
    if (!appointmentId) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          reschedule_date: formatDate(rescheduleDate),
          reschedule_time: formatTime(rescheduleTime),
        })
        .eq('id', appointmentId);
      if (error) throw error;
      Alert.alert('Request sent!', 'Reschedule request sent to student.');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not send request.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCancel = async () => {
    if (!cancelReason.trim()) return;
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
      Alert.alert('Error', err.message || 'Could not cancel appointment.');
    } finally {
      setLoading(false);
    }
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

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.titleBar}>
            <Text style={styles.titleText}>APPOINTMENTS</Text>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={14} color="#5C4A30" />
              <Text style={styles.detailText}>Student: <Text style={styles.detailBold}>{studentName}</Text></Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={14} color="#5C4A30" />
              <Text style={styles.detailText}>Time: <Text style={styles.detailBold}>{timeFrom} – {timeTo}</Text></Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={14} color="#5C4A30" />
              <Text style={styles.detailText}>Payment: <Text style={styles.detailBold}>{payment}</Text></Text>
            </View>

            <Text style={styles.sectionLabel}>Reschedule:</Text>
            <TouchableOpacity style={styles.pickerField} onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
              <Text style={[styles.pickerText, !rescheduleDate && styles.pickerPlaceholder]}>
                {rescheduleDate ? formatDate(rescheduleDate) : 'Date'}
              </Text>
              <Ionicons name="calendar-outline" size={16} color="#F5A623" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.pickerField} onPress={() => setShowTimePicker(true)} activeOpacity={0.8}>
              <Text style={[styles.pickerText, !rescheduleTime && styles.pickerPlaceholder]}>
                {rescheduleTime ? formatTime(rescheduleTime) : 'Time'}
              </Text>
              <Ionicons name="time-outline" size={16} color="#F5A623" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sendRequestBtn, loading && styles.sendRequestBtnDisabled]}
              activeOpacity={0.8}
              onPress={handleSendReschedule}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={styles.sendRequestText}>Send request to student</Text>
              }
            </TouchableOpacity>
          </View>

          <Text style={styles.cancelLabel}>Cancel appointment:</Text>
          <TextInput
            style={styles.reasonInput}
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
            style={[styles.submitBtn, (submitted || loading) && styles.submitBtnDisabled]}
            activeOpacity={0.8}
            onPress={handleSubmitCancel}
            disabled={submitted || loading}
          >
            <Text style={styles.submitBtnText}>Submit</Text>
          </TouchableOpacity>

          {submitted && (
            <View style={styles.processingCard}>
              <Text style={styles.processingText}>We are processing your request and will get back to you within 24 hrs.</Text>
              <Text style={styles.noteText}>NOTE: The company will keep 20% of your payment.</Text>
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
    </RoleGate>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  topBarRight: { flexDirection: 'row', gap: 10 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 32 },
  titleBar: { backgroundColor: '#F5A623', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  titleText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 1.5 },
  detailsCard: { backgroundColor: '#FFF3E0', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F5C070', gap: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 14, color: '#5C4A30' },
  detailBold: { fontWeight: '700', color: '#3B1F00' },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#3B1F00', marginTop: 4 },
  pickerField: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#E0D0B8', paddingVertical: 10, paddingHorizontal: 12 },
  pickerText: { fontSize: 13, color: '#3B1F00', fontWeight: '600' },
  pickerPlaceholder: { color: '#C4A882', fontWeight: '400' },
  sendRequestBtn: { backgroundColor: '#3B1F00', borderRadius: 8, paddingVertical: 11, alignItems: 'center', marginTop: 4 },
  sendRequestBtnDisabled: { backgroundColor: '#8B6F4E' },
  sendRequestText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  cancelLabel: { fontSize: 14, fontWeight: '700', color: '#3B1F00', marginBottom: 8 },
  reasonInput: { backgroundColor: '#FFF3E0', borderRadius: 10, borderWidth: 1, borderColor: '#F5C070', padding: 12, fontSize: 13, color: '#3B1F00', minHeight: 90, marginBottom: 12 },
  submitBtn: { backgroundColor: '#3B1F00', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 16 },
  submitBtnDisabled: { backgroundColor: '#8B6F4E' },
  submitBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  processingCard: { backgroundColor: '#FFF3E0', borderRadius: 10, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#F5C070', gap: 8 },
  processingText: { fontSize: 12, color: '#E67E22', lineHeight: 18 },
  noteText: { fontSize: 12, color: '#E74C3C', fontWeight: '700', lineHeight: 18 },
});