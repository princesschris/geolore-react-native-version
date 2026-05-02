import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import { DatePickerModal, TimePickerModal } from '../components/DateTimePicker';

export default function ClassInfoScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('Home');
  const [cancelReason, setCancelReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Reschedule picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState(null);
  const [rescheduleTime, setRescheduleTime] = useState(null);

  // Class details passed from ClassesScreen via route params
  const tutorName = route?.params?.tutorName ?? 'Chinazom';
  const timeFrom = route?.params?.timeFrom ?? '2:00pm';
  const timeTo = route?.params?.timeTo ?? '4:00pm';
  const payment = route?.params?.payment ?? '$40';

  const formatDate = (d) => d ? `${d.day} ${d.month} ${d.year}` : '';
  const formatTime = (t) => t ? `${t.hour}:${t.minute} ${t.period}` : '';

  const handleSubmit = () => {
    if (!cancelReason.trim()) return;
    setSubmitted(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      {/* Top Bar — no search bar on this screen */}
      <View style={styles.topBar}>
        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="person-outline" size={20} color="#5C3A00" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <View>
              <Ionicons name="notifications-outline" size={20} color="#5C3A00" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>5</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bunting Banner */}
      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Orange Title Bar */}
        <View style={styles.titleBar}>
          <Text style={styles.titleText}>CLASSES</Text>
        </View>

        {/* Class Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={14} color="#5C4A30" />
            <Text style={styles.detailText}>
              Tutor: <Text style={styles.detailBold}>{tutorName}</Text>
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={14} color="#5C4A30" />
            <Text style={styles.detailText}>
              Time: <Text style={styles.detailBold}>{timeFrom} - {timeTo}</Text>
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={14} color="#5C4A30" />
            <Text style={styles.detailText}>
              Payment: <Text style={styles.detailBold}>{payment}</Text>
            </Text>
          </View>

          {/* Reschedule Section */}
          <Text style={styles.sectionLabel}>Reschedule:</Text>

          {/* Date Picker Field */}
          <TouchableOpacity
            style={styles.pickerField}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <Text style={[styles.pickerFieldText, !rescheduleDate && styles.pickerPlaceholder]}>
              {rescheduleDate ? formatDate(rescheduleDate) : 'Date'}
            </Text>
            <Ionicons name="calendar-outline" size={16} color="#F5A623" />
          </TouchableOpacity>

          {/* Time Picker Field */}
          <TouchableOpacity
            style={styles.pickerField}
            onPress={() => setShowTimePicker(true)}
            activeOpacity={0.8}
          >
            <Text style={[styles.pickerFieldText, !rescheduleTime && styles.pickerPlaceholder]}>
              {rescheduleTime ? formatTime(rescheduleTime) : 'Time'}
            </Text>
            <Ionicons name="time-outline" size={16} color="#F5A623" />
          </TouchableOpacity>

          {/* Send Request Button */}
          <TouchableOpacity
            style={styles.sendRequestBtn}
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <Text style={styles.sendRequestText}>Send request to student</Text>
          </TouchableOpacity>
        </View>

        {/* Cancel Appointment Section */}
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
          style={[styles.submitBtn, submitted && styles.submitBtnDisabled]}
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={submitted}
        >
          <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>

        {/* Processing message — shown after submit */}
        {submitted && (
          <View style={styles.processingCard}>
            <Text style={styles.processingText}>
              We are processing your request we will get back to you within 24 hrs
            </Text>
            <Text style={styles.noteText}>
              NOTE: The company will keep 20% of your payment
            </Text>
          </View>
        )}

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={16} color="#fff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={showDatePicker}
        onConfirm={(val) => { setRescheduleDate(val); setShowDatePicker(false); }}
        onCancel={() => setShowDatePicker(false)}
        initialValue={rescheduleDate}
      />

      {/* Time Picker Modal */}
      <TimePickerModal
        visible={showTimePicker}
        title="Select New Time"
        onConfirm={(val) => { setRescheduleTime(val); setShowTimePicker(false); }}
        onCancel={() => setShowTimePicker(false)}
        initialValue={rescheduleTime}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  topBarRight: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#F5A623',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 32,
  },
  titleBar: {
    backgroundColor: '#F5A623',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  detailsCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F5C070',
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#5C4A30',
  },
  detailBold: {
    fontWeight: '700',
    color: '#3B1F00',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B1F00',
    marginTop: 4,
  },
  pickerField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0D0B8',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  pickerFieldText: {
    fontSize: 13,
    color: '#3B1F00',
    fontWeight: '600',
  },
  pickerPlaceholder: {
    color: '#C4A882',
    fontWeight: '400',
  },
  sendRequestBtn: {
    backgroundColor: '#3B1F00',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 4,
  },
  sendRequestText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  cancelLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B1F00',
    marginBottom: 8,
  },
  reasonInput: {
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F5C070',
    padding: 12,
    fontSize: 13,
    color: '#3B1F00',
    minHeight: 90,
    marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: '#3B1F00',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitBtnDisabled: {
    backgroundColor: '#8B6F4E',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  processingCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F5C070',
    gap: 8,
  },
  processingText: {
    fontSize: 12,
    color: '#E67E22',
    lineHeight: 18,
  },
  noteText: {
    fontSize: 12,
    color: '#E74C3C',
    fontWeight: '700',
    lineHeight: 18,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F5A623',
    paddingVertical: 12,
    borderRadius: 10,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginTop: 4,
  },
  backButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});