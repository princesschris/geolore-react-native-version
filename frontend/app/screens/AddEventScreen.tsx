import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, TextInput, Switch,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import TopBar from '../components/TopBar';
import BuntingBanner from '../components/BuntingBanner';
import { DatePickerModal, TimePickerModal } from '../components/DateTimePicker';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../components/CustomAlert';

const REMINDER_OPTIONS = [
  { key: 'daily',  label: 'Daily' },
  { key: '1hour',  label: '1 hour before' },
  { key: '30min',  label: '30 minutes before' },
  { key: '1day',   label: '1 day before' },
  { key: 'never',  label: 'Never' },
];

const COLOR_OPTIONS = [
  '#F5A623', '#3B1F00', '#8B6F4E', '#C4A882', '#F5C070', '#E67E22',
];

const FieldRow = ({ label, sublabel, value, onChangeText, placeholder, onPress, isButton }: any) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {sublabel ? <Text style={styles.fieldSublabel}>{sublabel}</Text> : null}
    {isButton ? (
      <TouchableOpacity style={styles.fieldBtn} onPress={onPress} activeOpacity={0.8}>
        <Text style={[styles.fieldBtnText, !value && styles.fieldPlaceholder]}>
          {value || 'Tap to select'}
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

const RadioOption = ({ label, selected, onPress }: any) => (
  <TouchableOpacity style={styles.radioRow} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.radioCircle, selected && styles.radioCircleSelected]}>
      {selected && <View style={styles.radioDot} />}
    </View>
    <Text style={[styles.radioLabel, selected && styles.radioLabelSelected]}>{label}</Text>
  </TouchableOpacity>
);

export default function AddEventScreen({ navigation, route }: any) {
  // Pre-filled invitees passed from UserInfoScreen or GroupInfoScreen
  // e.g. { id, name, type: 'user' | 'group' }
  const initialInvitee = route?.params?.invitee ?? null;

  const [eventName,       setEventName]       = useState('');
  const [description,     setDescription]     = useState('');
  const [date,            setDate]            = useState<any>(null);
  const [startTime,       setStartTime]       = useState<any>(null);
  const [endTime,         setEndTime]         = useState<any>(null);
  const [location,        setLocation]        = useState('');
  const [reminder,        setReminder]        = useState('never');
  const [allowGuests,     setAllowGuests]     = useState(false);
  const [guestsNotified,  setGuestsNotified]  = useState(false);
  const [selectedColor,   setSelectedColor]   = useState('#F5A623');
  const [loading,         setLoading]         = useState(false);

  // Invitees list — starts with whoever was passed in
  const [invitees, setInvitees] = useState<{ id: string; name: string; type: 'user' | 'group' }[]>(
    initialInvitee ? [initialInvitee] : []
  );

  const [showDatePicker,  setShowDatePicker]  = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker,   setShowEndPicker]   = useState(false);

  const { user }      = useAuth();
  const { showAlert } = useAlert();

  const formatDate = (d: any) => d ? `${d.day} ${d.month} ${d.year}` : '';
  const formatTime = (t: any) => t ? `${t.hour}:${t.minute} ${t.period}` : '';

  const buildDateLabel = (d: any) => {
    if (!d) return '';
    const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const dateObj = new Date(`${d.year}-${d.month}-${d.day}`);
    const suffix  = ['th','st','nd','rd'];
    const v = parseInt(d.day, 10) % 100;
    const s = suffix[(v - 20) % 10] ?? suffix[v] ?? suffix[0];
    return `${days[dateObj.getDay()]}, ${parseInt(d.day, 10)}${s} ${months[dateObj.getMonth()]} ${d.year}`;
  };

  const removeInvitee = (id: string) =>
    setInvitees((prev) => prev.filter((i) => i.id !== id));

  const handleSave = async () => {
    if (!eventName.trim()) {
      showAlert('warning', 'Name required', 'Please enter a name for your event.');
      return;
    }
    if (!date) {
      showAlert('warning', 'Date required', 'Please select a date for your event.');
      return;
    }

    setLoading(true);
    try {
      const { data: eventData, error } = await supabase.from('events').insert({
        creator_id:      user?.id,
        title:           eventName.trim(),
        description:     description.trim(),
        date:            `${date.year}-${String(date.month).padStart(2,'0')}-${String(date.day).padStart(2,'0')}`,
        date_label:      buildDateLabel(date),
        start_time:      formatTime(startTime),
        end_time:        formatTime(endTime),
        location:        location.trim(),
        reminder,
        allow_guests:    allowGuests,
        guests_notified: guestsNotified,
        color:           selectedColor,
      }).select().single();

      if (error) throw error;

      // Send event invitations to all invitees via a chat message
      if (eventData && invitees.length > 0) {
        const inviteText = `📅 You've been invited to *${eventName.trim()}*${date ? ` on ${buildDateLabel(date)}` : ''}${location.trim() ? ` at ${location.trim()}` : ''}.`;
        for (const invitee of invitees) {
          if (invitee.type === 'user') {
            // Find or create a DM between current user and invitee
            await supabase.from('messages').insert({
              sender_id:    user?.id,
              receiver_id:  invitee.id,
              content:      inviteText,
              message_type: 'event_invite',
              event_id:     eventData.id,
            });
          } else if (invitee.type === 'group') {
            await supabase.from('group_messages').insert({
              sender_id:    user?.id,
              group_id:     invitee.id,
              content:      inviteText,
              message_type: 'event_invite',
              event_id:     eventData.id,
            });
          }
        }
      }

      showAlert('success', 'Event saved!', `"${eventName}" has been added to your calendar${invitees.length > 0 ? ' and invites sent' : ''}.`);
      setTimeout(() => navigation?.goBack(), 1500);
    } catch (err: any) {
      showAlert('error', 'Save failed', err.message || 'Could not save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar showSearch={false} />
      <BuntingBanner />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <View style={styles.titleBar}>
            <Text style={styles.titleText}>ADD EVENT</Text>
          </View>

          <FieldRow label="Event name" value={eventName} onChangeText={setEventName} placeholder="e.g. Birthday party" />
          <FieldRow label="Description" value={description} onChangeText={setDescription} placeholder="Add details..." />
          <FieldRow label="Date" value={formatDate(date)} isButton onPress={() => setShowDatePicker(true)} />
          <FieldRow label="Start time" value={formatTime(startTime)} isButton onPress={() => setShowStartPicker(true)} />
          <FieldRow label="End time" value={formatTime(endTime)} isButton onPress={() => setShowEndPicker(true)} />
          <FieldRow label="Location" value={location} onChangeText={setLocation} placeholder="Add a venue or address" />

          {/* ── Invitees ── */}
          {invitees.length > 0 && (
            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>Invited</Text>
              <View style={styles.inviteeList}>
                {invitees.map((inv) => (
                  <View key={inv.id} style={styles.inviteeChip}>
                    <Ionicons
                      name={inv.type === 'group' ? 'people-outline' : 'person-outline'}
                      size={14}
                      color="#5C3A00"
                    />
                    <Text style={styles.inviteeChipText}>{inv.name}</Text>
                    <TouchableOpacity onPress={() => removeInvitee(inv.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Ionicons name="close-circle" size={16} color="#C4A882" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Color picker */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Event colour</Text>
            <View style={styles.colorRow}>
              {COLOR_OPTIONS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorDot, { backgroundColor: color }, selectedColor === color && styles.colorDotSelected]}
                  onPress={() => setSelectedColor(color)}
                  activeOpacity={0.8}
                >
                  {selectedColor === color && <Ionicons name="checkmark" size={16} color="#fff" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Reminder */}
          <View style={styles.reminderSection}>
            <Text style={styles.fieldLabel}>Reminder</Text>
            {REMINDER_OPTIONS.map((opt) => (
              <RadioOption key={opt.key} label={opt.label} selected={reminder === opt.key} onPress={() => setReminder(opt.key)} />
            ))}
          </View>

          {/* Allow guests */}
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <Text style={styles.fieldLabel}>Allow guests</Text>
              <Text style={styles.fieldSublabel}>Allow people to bring additional guests</Text>
            </View>
            <Switch value={allowGuests} onValueChange={setAllowGuests} trackColor={{ false: '#E0D0B8', true: '#F5A623' }} thumbColor="#fff" />
          </View>

          {allowGuests && (
            <View style={styles.switchRow}>
              <Text style={styles.fieldLabel}>Guests also get notified</Text>
              <Switch value={guestsNotified} onValueChange={setGuestsNotified} trackColor={{ false: '#E0D0B8', true: '#F5A623' }} thumbColor="#fff" />
            </View>
          )}

          <TouchableOpacity
            style={[styles.saveBtn, (!eventName.trim() || loading) && styles.saveBtnDisabled]}
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={!eventName.trim() || loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Event</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomTabBar />

      <DatePickerModal
        visible={showDatePicker}
        onConfirm={(val: any) => { setDate(val); setShowDatePicker(false); }}
        onCancel={() => setShowDatePicker(false)}
        initialValue={date}
      />
      <TimePickerModal
        visible={showStartPicker}
        title="Start Time"
        onConfirm={(val: any) => { setStartTime(val); setShowStartPicker(false); }}
        onCancel={() => setShowStartPicker(false)}
        initialValue={startTime}
      />
      <TimePickerModal
        visible={showEndPicker}
        title="End Time"
        onConfirm={(val: any) => { setEndTime(val); setShowEndPicker(false); }}
        onCancel={() => setShowEndPicker(false)}
        initialValue={endTime}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  flex: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },
  titleBar: { backgroundColor: '#3B1F00', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  titleText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 1.5 },
  fieldWrapper: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#3B1F00', marginBottom: 2 },
  fieldSublabel: { fontSize: 11, color: '#A08060', marginBottom: 4 },
  fieldInput: { borderBottomWidth: 1, borderBottomColor: '#E0D0B8', paddingVertical: 8, fontSize: 13, color: '#3B1F00' },
  fieldBtn: { borderBottomWidth: 1, borderBottomColor: '#E0D0B8', paddingVertical: 8 },
  fieldBtnText: { fontSize: 13, color: '#3B1F00', fontWeight: '500' },
  fieldPlaceholder: { color: '#C4B49A' },
  // Invitees
  inviteeList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  inviteeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFF3E0', borderRadius: 20, paddingHorizontal: 12,
    paddingVertical: 6, borderWidth: 1, borderColor: '#F5C070',
  },
  inviteeChipText: { fontSize: 13, fontWeight: '600', color: '#5C3A00' },
  colorRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  colorDot: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  colorDotSelected: { borderWidth: 3, borderColor: '#3B1F00' },
  reminderSection: { marginBottom: 16 },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0E6D6' },
  radioCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#C4A882', alignItems: 'center', justifyContent: 'center' },
  radioCircleSelected: { borderColor: '#F5A623' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#F5A623' },
  radioLabel: { fontSize: 13, color: '#5C4A30', fontWeight: '500' },
  radioLabelSelected: { color: '#F5A623', fontWeight: '700' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E0D0B8', marginBottom: 8 },
  switchLeft: { flex: 1, paddingRight: 16 },
  saveBtn: { backgroundColor: '#F5A623', paddingVertical: 13, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  saveBtnDisabled: { backgroundColor: '#E0C49A' },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});