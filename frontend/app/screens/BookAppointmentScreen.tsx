import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import { DatePickerModal, TimePickerModal } from '../components/DateTimePicker';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const PickerField = ({ label, value, placeholder, onPress, icon }: any) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TouchableOpacity style={styles.fieldButton} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.fieldValue, !value && styles.fieldPlaceholder]}>
        {value || placeholder}
      </Text>
      <Ionicons name={icon} size={18} color="#F5A623" />
    </TouchableOpacity>
  </View>
);

export default function BookAppointmentScreen({ navigation, route }: any) {
  const [searchQuery,    setSearchQuery]    = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker,   setShowToPicker]   = useState(false);
  const [date,           setDate]           = useState<any>(null);
  const [timeFrom,       setTimeFrom]       = useState<any>(null);
  const [timeTo,         setTimeTo]         = useState<any>(null);
  const [booked,         setBooked]         = useState(false);
  const [loading,        setLoading]        = useState(false);

  const { user } = useAuth();

  const teacher = route?.params?.teacher ?? {
    id:         null,
    name:       'Amaka',
    location:   'Nigeria',
    rating:     3,
    pricePerHr: 50,
  };

  const formatDate = (d: any) => d ? `${d.day} ${d.month} ${d.year}` : null;
  const formatTime = (t: any) => t ? `${t.hour}:${t.minute} ${t.period}` : null;

  const formattedDate = formatDate(date);
  const formattedFrom = formatTime(timeFrom);
  const formattedTo   = formatTime(timeTo);
  const price         = `$${teacher.pricePerHr ?? 50}`;
  const isFormComplete = date && timeFrom && timeTo;

  const handleBookAppointment = async () => {
    if (!isFormComplete) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('appointments').insert({
        student_id: user?.id,
        tutor_id:   teacher.id ?? null,
        tutor_name: teacher.name,
        date:       formattedDate,
        time_from:  formattedFrom,
        time_to:    formattedTo,
        price,
        status:     'upcoming',
      });

      if (error) throw error;
      setBooked(true);
    } catch (err: any) {
      Alert.alert('Booking failed', err.message || 'Could not book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToCheckout = () => {
    navigation?.navigate('Checkout', {
      teacher,
      date:     formattedDate,
      timeFrom: formattedFrom,
      timeTo:   formattedTo,
      price,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.topBar}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search" />
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="person-outline" size={20} color="#5C3A00" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <View>
            <Ionicons name="notifications-outline" size={20} color="#5C3A00" />
            <View style={styles.badge}><Text style={styles.badgeText}>5</Text></View>
          </View>
        </TouchableOpacity>
      </View>

      <BuntingBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>BOOK APPOINTMENT</Text>

        {/* Teacher summary */}
        <View style={styles.teacherSummary}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={28} color="#C4A882" />
          </View>
          <View>
            <Text style={styles.teacherName}>{teacher.name}</Text>
            <Text style={styles.teacherLocation}>Based in {teacher.location}</Text>
            <Text style={styles.teacherPrice}>${teacher.pricePerHr} per/hr</Text>
          </View>
        </View>

        <PickerField label="Date"      value={formattedDate} placeholder="Select a date"    icon="calendar-outline" onPress={() => setShowDatePicker(true)} />
        <PickerField label="Time From" value={formattedFrom} placeholder="Select start time" icon="time-outline"    onPress={() => setShowFromPicker(true)} />
        <PickerField label="Time To"   value={formattedTo}   placeholder="Select end time"   icon="time-outline"    onPress={() => setShowToPicker(true)} />

        <View style={styles.priceRow}>
          <Text style={styles.fieldLabel}>Price</Text>
          <View style={styles.priceBadge}>
            <Text style={styles.priceValue}>{price}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {booked && (
          <View style={styles.confirmedBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#2ECC71" />
            <Text style={styles.confirmedText}>Appointment booked!</Text>
          </View>
        )}

        {!booked ? (
          <TouchableOpacity
            style={[styles.primaryButton, (!isFormComplete || loading) && styles.primaryButtonDisabled]}
            activeOpacity={0.8}
            onPress={handleBookAppointment}
            disabled={!isFormComplete || loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.primaryButtonText}>Book Appointment</Text>
            }
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8} onPress={handleProceedToCheckout}>
            <Text style={styles.primaryButtonText}>Proceed to checkout</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <BottomTabBar />

      <DatePickerModal
        visible={showDatePicker}
        onConfirm={(val: any) => { setDate(val); setShowDatePicker(false); }}
        onCancel={() => setShowDatePicker(false)}
        initialValue={date}
      />
      <TimePickerModal
        visible={showFromPicker}
        title="Select Start Time"
        onConfirm={(val: any) => { setTimeFrom(val); setShowFromPicker(false); }}
        onCancel={() => setShowFromPicker(false)}
        initialValue={timeFrom}
      />
      <TimePickerModal
        visible={showToPicker}
        title="Select End Time"
        onConfirm={(val: any) => { setTimeTo(val); setShowToPicker(false); }}
        onCancel={() => setShowToPicker(false)}
        initialValue={timeTo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10, gap: 10 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  badge: { position: 'absolute', top: -4, right: -6, backgroundColor: '#F5A623', borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 },
  title: { fontSize: 20, fontWeight: '800', color: '#3B1F00', textAlign: 'center', letterSpacing: 1.5, marginBottom: 20 },
  teacherSummary: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#FFF3E0', borderRadius: 14, padding: 14, marginBottom: 24, borderWidth: 1, borderColor: '#F5C070' },
  avatarPlaceholder: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F5E6CC', alignItems: 'center', justifyContent: 'center' },
  teacherName: { fontSize: 16, fontWeight: '800', color: '#3B1F00', marginBottom: 2 },
  teacherLocation: { fontSize: 12, color: '#A08060', marginBottom: 2 },
  teacherPrice: { fontSize: 12, fontWeight: '700', color: '#F5A623' },
  fieldWrapper: { marginBottom: 18 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: '#A08060', marginBottom: 8 },
  fieldButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, borderColor: '#E0D0B8', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: '#fff' },
  fieldValue: { fontSize: 14, color: '#3B1F00', fontWeight: '600' },
  fieldPlaceholder: { color: '#C4B49A', fontWeight: '400' },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  priceBadge: { backgroundColor: '#F5A623', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 16 },
  priceValue: { color: '#fff', fontSize: 14, fontWeight: '800' },
  divider: { height: 1, backgroundColor: '#E0D0B8', marginVertical: 20 },
  confirmedBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#F0FFF4', borderRadius: 10, paddingVertical: 10, marginBottom: 14, borderWidth: 1, borderColor: '#2ECC71' },
  confirmedText: { fontSize: 13, fontWeight: '700', color: '#2ECC71' },
  primaryButton: { backgroundColor: '#F5A623', paddingVertical: 13, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  primaryButtonDisabled: { backgroundColor: '#F5C070' },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});