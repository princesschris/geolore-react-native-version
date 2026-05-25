import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import RoleGate from '../components/RoleGate';
import { DatePickerModal, TimePickerModal } from '../components/DateTimePicker';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../components/CustomAlert';

type ClassType = 'one_on_one' | 'group';

const TypeButton = ({ label, icon, selected, onPress }: any) => (
  <TouchableOpacity
    style={[styles.typeBtn, selected && styles.typeBtnSelected]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Ionicons name={icon} size={22} color={selected ? '#fff' : '#F5A623'} />
    <Text style={[styles.typeBtnText, selected && styles.typeBtnTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

export default function CreateClassScreen({ navigation }: any) {
  const [title,     setTitle]     = useState('');
  const [language,  setLanguage]  = useState('');
  const [classType, setClassType] = useState<ClassType>('one_on_one');
  const [date,      setDate]      = useState<any>(null);
  const [timeFrom,  setTimeFrom]  = useState<any>(null);
  const [timeTo,    setTimeTo]    = useState<any>(null);
  const [price,     setPrice]     = useState('');
  const [capacity,  setCapacity]  = useState('');
  const [loading,   setLoading]   = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker,   setShowToPicker]   = useState(false);

  const { user }      = useAuth();
  const { showAlert } = useAlert();

  const formatDate = (d: any) => d ? `${d.day} ${d.month} ${d.year}` : '';
  const formatTime = (t: any) => t ? `${t.hour}:${t.minute} ${t.period}` : '';

  const canSubmit = title.trim() && language.trim() && date && timeFrom && timeTo
    && price.trim() && (classType === 'one_on_one' || capacity.trim());

  const handleCreate = async () => {
    if (!canSubmit || !user?.id) {
      showAlert('warning', 'Incomplete form', 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('classes').insert({
        tutor_id:   user.id,
        tutor_name: `${user.first_name} ${user.last_name}`,
        title:      title.trim(),
        language:   language.trim(),
        type:       classType,
        date:       formatDate(date),
        time_from:  formatTime(timeFrom),
        time_to:    formatTime(timeTo),
        price:      parseFloat(price),
        capacity:   classType === 'one_on_one' ? 1 : parseInt(capacity, 10),
        enrolled:   0,
        status:     'open',
      });
      if (error) throw error;
      showAlert('success', 'Class created!', 'Your class is now visible to students.');
      setTimeout(() => navigation?.goBack(), 1500);
    } catch (err: any) {
      showAlert('error', 'Creation failed', err.message || 'Could not create class. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGate allowedRoles={['tutor', 'both']}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
            <Ionicons name="arrow-back-outline" size={22} color="#5C3A00" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Class</Text>
          <View style={{ width: 36 }} />
        </View>

        <BuntingBanner />

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>Class Type</Text>
          <View style={styles.typeRow}>
            <TypeButton label="One-on-One" icon="person-outline"  selected={classType === 'one_on_one'} onPress={() => setClassType('one_on_one')} />
            <TypeButton label="Group"      icon="people-outline"  selected={classType === 'group'}      onPress={() => setClassType('group')} />
          </View>

          <Text style={styles.fieldLabel}>Class Title</Text>
          <TextInput style={styles.input} placeholder="e.g. Beginner Igbo Conversation" placeholderTextColor="#C4A882" value={title} onChangeText={setTitle} autoCapitalize="words" />

          <Text style={styles.fieldLabel}>Language Taught</Text>
          <TextInput style={styles.input} placeholder="e.g. Igbo, Yoruba, Hausa..." placeholderTextColor="#C4A882" value={language} onChangeText={setLanguage} autoCapitalize="words" />

          <Text style={styles.fieldLabel}>Date</Text>
          <TouchableOpacity style={styles.pickerField} onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
            <Text style={[styles.pickerText, !date && styles.pickerPlaceholder]}>{date ? formatDate(date) : 'Select date'}</Text>
            <Ionicons name="calendar-outline" size={18} color="#F5A623" />
          </TouchableOpacity>

          <Text style={styles.fieldLabel}>Start Time</Text>
          <TouchableOpacity style={styles.pickerField} onPress={() => setShowFromPicker(true)} activeOpacity={0.8}>
            <Text style={[styles.pickerText, !timeFrom && styles.pickerPlaceholder]}>{timeFrom ? formatTime(timeFrom) : 'Select start time'}</Text>
            <Ionicons name="time-outline" size={18} color="#F5A623" />
          </TouchableOpacity>

          <Text style={styles.fieldLabel}>End Time</Text>
          <TouchableOpacity style={styles.pickerField} onPress={() => setShowToPicker(true)} activeOpacity={0.8}>
            <Text style={[styles.pickerText, !timeTo && styles.pickerPlaceholder]}>{timeTo ? formatTime(timeTo) : 'Select end time'}</Text>
            <Ionicons name="time-outline" size={18} color="#F5A623" />
          </TouchableOpacity>

          <Text style={styles.fieldLabel}>Price per Student ($)</Text>
          <TextInput style={styles.input} placeholder="e.g. 40" placeholderTextColor="#C4A882" value={price} onChangeText={setPrice} keyboardType="numeric" />

          {classType === 'group' && (
            <>
              <Text style={styles.fieldLabel}>Max Students</Text>
              <TextInput style={styles.input} placeholder="e.g. 10" placeholderTextColor="#C4A882" value={capacity} onChangeText={setCapacity} keyboardType="numeric" />
            </>
          )}

          {classType === 'one_on_one' && (
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={16} color="#F5A623" />
              <Text style={styles.infoText}>One-on-one classes are limited to 1 student.</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.createBtn, (!canSubmit || loading) && styles.createBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleCreate}
            disabled={!canSubmit || loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.createBtnText}>Create Class</Text>
            }
          </TouchableOpacity>
        </ScrollView>

        <BottomTabBar />

        <DatePickerModal visible={showDatePicker} onConfirm={(val: any) => { setDate(val); setShowDatePicker(false); }} onCancel={() => setShowDatePicker(false)} initialValue={date} />
        <TimePickerModal visible={showFromPicker} title="Select Start Time" onConfirm={(val: any) => { setTimeFrom(val); setShowFromPicker(false); }} onCancel={() => setShowFromPicker(false)} initialValue={timeFrom} />
        <TimePickerModal visible={showToPicker}   title="Select End Time"   onConfirm={(val: any) => { setTimeTo(val);   setShowToPicker(false);   }} onCancel={() => setShowToPicker(false)}   initialValue={timeTo} />
      </SafeAreaView>
    </RoleGate>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', color: '#F5A623', textAlign: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  sectionLabel: { fontSize: 14, fontWeight: '800', color: '#3B1F00', marginBottom: 10, marginTop: 4 },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, backgroundColor: '#FFF3E0', borderWidth: 1.5, borderColor: '#F5A623' },
  typeBtnSelected: { backgroundColor: '#F5A623', borderColor: '#F5A623' },
  typeBtnText: { fontSize: 13, fontWeight: '700', color: '#F5A623' },
  typeBtnTextSelected: { color: '#fff' },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#3B1F00', marginBottom: 6, marginTop: 4 },
  input: { backgroundColor: '#FFF3E0', borderRadius: 10, borderWidth: 1, borderColor: '#E0D0B8', paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#3B1F00', marginBottom: 16 },
  pickerField: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF3E0', borderRadius: 10, borderWidth: 1, borderColor: '#E0D0B8', paddingVertical: 13, paddingHorizontal: 14, marginBottom: 16 },
  pickerText: { fontSize: 14, color: '#3B1F00', fontWeight: '600' },
  pickerPlaceholder: { color: '#C4A882', fontWeight: '400' },
  infoBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF6E8', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#F5C070', marginBottom: 16 },
  infoText: { fontSize: 12, color: '#7A5C3A', flex: 1 },
  createBtn: { backgroundColor: '#F5A623', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  createBtnDisabled: { backgroundColor: '#E0C49A' },
  createBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});