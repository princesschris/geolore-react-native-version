import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BuntingBanner from '../components/BuntingBanner';
import { DatePickerModal, TimePickerModal } from '../components/DateTimePicker';

export default function ScheduleInterviewScreen({ navigation }: any) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState<any>(null);
  const [time, setTime] = useState<any>(null);

  const formatDate = (d: any) => d ? `${d.day} ${d.month} ${d.year}` : '';
  const formatTime = (t: any) => t ? `${t.hour}:${t.minute} ${t.period}` : '';

  const canProceed = date !== null && time !== null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.topBar}>
        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="person-outline" size={20} color="#5C3A00" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={20} color="#5C3A00" />
          </TouchableOpacity>
        </View>
      </View>

      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Orange title bar */}
        <View style={styles.titleBar}>
          <Text style={styles.titleText}>SCHEDULE AN INTERVIEW</Text>
        </View>

        <Text style={styles.subLabel}>Date</Text>
        <TouchableOpacity
          style={styles.pickerField}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.8}
        >
          <Text style={[styles.pickerText, !date && styles.placeholder]}>
            {date ? formatDate(date) : 'Select date'}
          </Text>
          <Ionicons name="calendar-outline" size={18} color="#F5A623" />
        </TouchableOpacity>

        <Text style={styles.subLabel}>Time</Text>
        <TouchableOpacity
          style={styles.pickerField}
          onPress={() => setShowTimePicker(true)}
          activeOpacity={0.8}
        >
          <Text style={[styles.pickerText, !time && styles.placeholder]}>
            {time ? formatTime(time) : 'Select time'}
          </Text>
          <Ionicons name="time-outline" size={18} color="#F5A623" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextBtn, !canProceed && styles.nextBtnDisabled]}
          activeOpacity={0.85}
          disabled={!canProceed}
          onPress={() => navigation?.navigate('InterviewIncoming')}
        >
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>

      <DatePickerModal
        visible={showDatePicker}
        onConfirm={(val: any) => { setDate(val); setShowDatePicker(false); }}
        onCancel={() => setShowDatePicker(false)}
        initialValue={date}
      />
      <TimePickerModal
        visible={showTimePicker}
        title="Select Interview Time"
        onConfirm={(val: any) => { setTime(val); setShowTimePicker(false); }}
        onCancel={() => setShowTimePicker(false)}
        initialValue={time}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  topBar: {
    flexDirection: 'row', justifyContent: 'flex-end',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },
  topBarRight: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  scrollContent: {
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40,
  },
  titleBar: {
    backgroundColor: '#F5A623', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginBottom: 24,
  },
  titleText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 1.2 },
  subLabel: { fontSize: 13, fontWeight: '700', color: '#3B1F00', marginBottom: 8 },
  pickerField: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFF3E0', borderRadius: 10, borderWidth: 1,
    borderColor: '#E0D0B8', paddingVertical: 13, paddingHorizontal: 14,
    marginBottom: 18,
  },
  pickerText: { fontSize: 14, color: '#3B1F00', fontWeight: '600' },
  placeholder: { color: '#C4A882', fontWeight: '400' },
  nextBtn: {
    backgroundColor: '#F5A623', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 8,
  },
  nextBtnDisabled: { backgroundColor: '#E0C49A' },
  nextBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});