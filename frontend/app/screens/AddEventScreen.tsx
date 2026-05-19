import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import TopBar from '../components/TopBar';
import BuntingBanner from '../components/BuntingBanner';
import { DatePickerModal, TimePickerModal } from '../components/DateTimePicker';

const REMINDER_OPTIONS = [
  { key: 'daily',      label: 'Daily' },
  { key: '1hour',      label: '1 hour before' },
  { key: '30min',      label: '30 minutes before' },
  { key: '1day',       label: '1 day before' },
  { key: 'never',      label: 'Never' },
];

// Simple field row with bottom border
const FieldRow = ({ label, sublabel, value, onChangeText, placeholder, onPress, isButton }) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {sublabel ? <Text style={styles.fieldSublabel}>{sublabel}</Text> : null}
    {isButton ? (
      <TouchableOpacity style={styles.fieldBtn} onPress={onPress} activeOpacity={0.8}>
        <Text style={[styles.fieldBtnText, !value && styles.fieldPlaceholder]}>
          {value || ''}
        </Text>
      </TouchableOpacity>
    ) : (
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? ''}
        placeholderTextColor="#C4B49A"
      />
    )}
  </View>
);

// Radio button row
const RadioOption = ({ label, selected, onPress }) => (
  <TouchableOpacity style={styles.radioRow} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.radioCircle, selected && styles.radioCircleSelected]}>
      {selected && <View style={styles.radioDot} />}
    </View>
    <Text style={[styles.radioLabel, selected && styles.radioLabelSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function AddEventScreen({ navigation }:any) {
  const [eventName, setEventName]   = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate]             = useState(null);
  const [startTime, setStartTime]   = useState(null);
  const [endTime, setEndTime]       = useState(null);
  const [location, setLocation]     = useState('');
  const [reminder, setReminder]     = useState('daily');
  const [allowGuests, setAllowGuests] = useState(false);
  const [guestsNotified, setGuestsNotified] = useState(true);

  const [showDatePicker, setShowDatePicker]   = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker]     = useState(false);

  const formatDate = (d) => d ? `${d.day} ${d.month} ${d.year}` : '';
  const formatTime = (t) => t ? `${t.hour}:${t.minute} ${t.period}` : '';

  const handleSave = () => {
    if (!eventName.trim()) return;
    navigation?.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar showSearch={false} />
      <BuntingBanner />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Bar */}
          <View style={styles.titleBar}>
            <Text style={styles.titleText}>ADD EVENT</Text>
          </View>

          {/* Event Name */}
          <FieldRow
            label="Event name"
            value={eventName}
            onChangeText={setEventName}
          />

          {/* Description */}
          <FieldRow
            label="Description"
            value={description}
            onChangeText={setDescription}
          />

          {/* Date */}
          <FieldRow
            label="Date"
            value={formatDate(date)}
            isButton
            onPress={() => setShowDatePicker(true)}
          />

          {/* Time */}
          <FieldRow
            label="Time"
            value={formatTime(startTime)}
            isButton
            onPress={() => setShowStartPicker(true)}
          />

          {/* Add end time */}
          <FieldRow
            label="Add end time"
            value={formatTime(endTime)}
            isButton
            onPress={() => setShowEndPicker(true)}
          />

          {/* Location */}
          <FieldRow
            label="Add location"
            value={location}
            onChangeText={setLocation}
          />

          {/* Reminder Section */}
          <View style={styles.reminderSection}>
            <Text style={styles.fieldLabel}>Reminder</Text>
            {REMINDER_OPTIONS.map((opt) => (
              <RadioOption
                key={opt.key}
                label={opt.label}
                selected={reminder === opt.key}
                onPress={() => setReminder(opt.key)}
              />
            ))}
          </View>

          {/* Allow Guests */}
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <Text style={styles.fieldLabel}>Allow guests</Text>
              <Text style={styles.fieldSublabel}>Allow people to bring additional guests</Text>
            </View>
            <Switch
              value={allowGuests}
              onValueChange={setAllowGuests}
              trackColor={{ false: '#E0D0B8', true: '#F5A623' }}
              thumbColor="#fff"
            />
          </View>

          {/* Guests also get notified */}
          {allowGuests && (
            <View style={styles.switchRow}>
              <Text style={styles.fieldLabel}>Guests also get notified</Text>
              <Switch
                value={guestsNotified}
                onValueChange={setGuestsNotified}
                trackColor={{ false: '#E0D0B8', true: '#F5A623' }}
                thumbColor="#fff"
              />
            </View>
          )}

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveBtn, !eventName.trim() && styles.saveBtnDisabled]}
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={!eventName.trim()}
          >
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomTabBar />

      {/* Pickers */}
      <DatePickerModal
        visible={showDatePicker}
        onConfirm={(val) => { setDate(val); setShowDatePicker(false); }}
        onCancel={() => setShowDatePicker(false)}
        initialValue={date}
      />
      <TimePickerModal
        visible={showStartPicker}
        title="Start Time"
        onConfirm={(val) => { setStartTime(val); setShowStartPicker(false); }}
        onCancel={() => setShowStartPicker(false)}
        initialValue={startTime}
      />
      <TimePickerModal
        visible={showEndPicker}
        title="End Time"
        onConfirm={(val) => { setEndTime(val); setShowEndPicker(false); }}
        onCancel={() => setShowEndPicker(false)}
        initialValue={endTime}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  flex: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  titleBar: {
    backgroundColor: '#3B1F00',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  fieldWrapper: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B1F00',
    marginBottom: 2,
  },
  fieldSublabel: {
    fontSize: 11,
    color: '#A08060',
    marginBottom: 4,
  },
  fieldInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0D0B8',
    paddingVertical: 8,
    fontSize: 13,
    color: '#3B1F00',
  },
  fieldBtn: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0D0B8',
    paddingVertical: 8,
  },
  fieldBtnText: {
    fontSize: 13,
    color: '#3B1F00',
    fontWeight: '500',
  },
  fieldPlaceholder: {
    color: '#C4B49A',
  },

  // Reminder
  reminderSection: {
    marginBottom: 16,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6D6',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#C4A882',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#F5A623',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F5A623',
  },
  radioLabel: {
    fontSize: 13,
    color: '#5C4A30',
    fontWeight: '500',
  },
  radioLabelSelected: {
    color: '#F5A623',
    fontWeight: '700',
  },

  // Switches
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0D0B8',
    marginBottom: 8,
  },
  switchLeft: {
    flex: 1,
    paddingRight: 16,
  },

  // Save
  saveBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnDisabled: {
    backgroundColor: '#F5C070',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});