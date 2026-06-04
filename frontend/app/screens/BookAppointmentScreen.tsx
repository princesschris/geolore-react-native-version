import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import { DatePickerModal, TimePickerModal } from '../components/DateTimePicker';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../components/CustomAlert';

// ─── Picker Field ─────────────────────────────────────────────────────────────

const PickerField = ({ label, value, placeholder, onPress, icon }: any) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TouchableOpacity style={styles.fieldButton} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.fieldLeft}>
        <Ionicons name={icon} size={16} color={value ? '#C4882A' : '#C4A882'} />
        <Text style={[styles.fieldValue, !value && styles.fieldPlaceholder]}>
          {value || placeholder}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#C4A882" />
    </TouchableOpacity>
  </View>
);

const Stars = ({ rating }: { rating: number }) => (
  <View style={styles.starsRow}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Ionicons
        key={i}
        name={i <= rating ? 'star' : 'star-outline'}
        size={12}
        color="#F5A623"
      />
    ))}
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

  const { user }      = useAuth();
  const { showAlert } = useAlert();

  const teacher = route?.params?.teacher ?? {
    id: null, name: 'Amaka', location: 'Nigeria', rating: 3, pricePerHr: 50,
  };

  const formatDate = (d: any) => d ? `${d.day} ${d.month} ${d.year}` : null;
  const formatTime = (t: any) => t ? `${t.hour}:${t.minute} ${t.period}` : null;

  const formattedDate = formatDate(date);
  const formattedFrom = formatTime(timeFrom);
  const formattedTo   = formatTime(timeTo);
  const price         = `$${teacher.pricePerHr ?? 50}`;
  const isFormComplete = date && timeFrom && timeTo;

  const initials = teacher.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleBookAppointment = async () => {
    if (!isFormComplete) {
      showAlert('warning', 'Incomplete form', 'Please select a date and both start and end times.');
      return;
    }
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
      showAlert('error', 'Booking failed', err.message || 'Could not book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToCheckout = () => {
    navigation?.navigate('Checkout', {
      teacher, date: formattedDate, timeFrom: formattedFrom, timeTo: formattedTo, price,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Page header */}
        <View style={styles.pageHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={18} color="#3B1F00" />
          </TouchableOpacity>
          <View>
            <Text style={styles.pageEyebrow}>Schedule a Session</Text>
            <Text style={styles.pageTitle}>Book Appointment</Text>
          </View>
        </View>

        {/* Teacher card */}
        <View style={styles.teacherCard}>
          <View style={styles.teacherCardStripe} />
          <View style={styles.teacherCardInner}>
            <View style={styles.teacherAvatar}>
              <Text style={styles.teacherAvatarText}>{initials}</Text>
            </View>
            <View style={styles.teacherInfo}>
              <Text style={styles.teacherName}>{teacher.name}</Text>
              <Stars rating={teacher.rating ?? 0} />
              <View style={styles.teacherMetaRow}>
                <Ionicons name="location-outline" size={12} color="#A08060" />
                <Text style={styles.teacherMeta}>{teacher.location}</Text>
              </View>
            </View>
            <View style={styles.priceBubble}>
              <Text style={styles.priceBubbleAmount}>${teacher.pricePerHr}</Text>
              <Text style={styles.priceBubbleLabel}>per/hr</Text>
            </View>
          </View>
        </View>

        {/* Booking form */}
        <View style={styles.formCard}>
          <View style={styles.formCardLabelRow}>
            <View style={styles.formDot} />
            <Text style={styles.formCardLabel}>Select Date & Time</Text>
          </View>

          <PickerField
            label="Date"
            value={formattedDate}
            placeholder="Select a date"
            icon="calendar-outline"
            onPress={() => setShowDatePicker(true)}
          />
          <PickerField
            label="Time From"
            value={formattedFrom}
            placeholder="Select start time"
            icon="time-outline"
            onPress={() => setShowFromPicker(true)}
          />
          <PickerField
            label="Time To"
            value={formattedTo}
            placeholder="Select end time"
            icon="time-outline"
            onPress={() => setShowToPicker(true)}
          />

          {/* Summary row */}
          {isFormComplete && (
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Ionicons name="calendar-outline" size={13} color="#C4882A" />
                <Text style={styles.summaryText}>{formattedDate}</Text>
              </View>
              <View style={styles.summaryDot} />
              <View style={styles.summaryItem}>
                <Ionicons name="time-outline" size={13} color="#C4882A" />
                <Text style={styles.summaryText}>{formattedFrom} – {formattedTo}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Price card */}
        <View style={styles.priceCard}>
          <View style={styles.priceCardLeft}>
            <Text style={styles.priceCardLabel}>Total Payment</Text>
            <Text style={styles.priceCardSub}>1 session · {teacher.pricePerHr}/hr</Text>
          </View>
          <View style={styles.priceCardRight}>
            <Text style={styles.priceCardAmount}>{price}</Text>
          </View>
        </View>

        {/* Confirmed banner */}
        {booked && (
          <View style={styles.confirmedBanner}>
            <View style={styles.confirmedIconWrap}>
              <Ionicons name="checkmark" size={16} color="#fff" />
            </View>
            <Text style={styles.confirmedText}>Appointment booked successfully!</Text>
          </View>
        )}

        {/* CTA */}
        {!booked ? (
          <TouchableOpacity
            style={[styles.primaryBtn, (!isFormComplete || loading) && styles.primaryBtnDisabled]}
            activeOpacity={0.8}
            onPress={handleBookAppointment}
            disabled={!isFormComplete || loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <>
                  <Ionicons name="calendar-outline" size={16} color="#fff" />
                  <Text style={styles.primaryBtnText}>Book Appointment</Text>
                </>
            }
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8} onPress={handleProceedToCheckout}>
            <Ionicons name="card-outline" size={16} color="#fff" />
            <Text style={styles.primaryBtnText}>Proceed to Checkout</Text>
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
  safeArea:      { flex: 1, backgroundColor: '#FFFDF5' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 40 },
  pageHeader:  { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, paddingHorizontal: 4 },
  backBtn:     { width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F5C070' },
  pageEyebrow: { fontSize: 11, fontWeight: '700', color: '#F5A623', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 1 },
  pageTitle:   { fontSize: 26, fontWeight: '900', color: '#3B1F00' },
  teacherCard: {
    backgroundColor: '#fff', borderRadius: 20, marginBottom: 16,
    borderWidth: 1, borderColor: '#EDE0CC', overflow: 'hidden',
    shadowColor: '#C4882A', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
  },
  teacherCardStripe: { height: 5, backgroundColor: '#F5A623' },
  teacherCardInner:  { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  teacherAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#3B1F00', alignItems: 'center', justifyContent: 'center',
  },
  teacherAvatarText: { fontSize: 18, fontWeight: '900', color: '#F5A623' },
  teacherInfo:       { flex: 1, gap: 4 },
  teacherName:       { fontSize: 17, fontWeight: '900', color: '#3B1F00' },
  starsRow:          { flexDirection: 'row', gap: 2 },
  teacherMetaRow:    { flexDirection: 'row', alignItems: 'center', gap: 4 },
  teacherMeta:       { fontSize: 11, color: '#A08060' },
  priceBubble:       { alignItems: 'center', backgroundColor: '#FFF3E0', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#F5C070' },
  priceBubbleAmount: { fontSize: 18, fontWeight: '900', color: '#C4882A' },
  priceBubbleLabel:  { fontSize: 9, fontWeight: '700', color: '#A08060', textTransform: 'uppercase', letterSpacing: 0.5 },
 formCard: {
    backgroundColor: '#fff', borderRadius: 18, marginBottom: 16,
    borderWidth: 1, borderColor: '#EDE0CC', padding: 16,
    shadowColor: '#C4882A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  formCardLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  formDot:          { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F5A623' },
  formCardLabel:    { fontSize: 14, fontWeight: '800', color: '#3B1F00' },
  fieldWrapper: { marginBottom: 12 },
  fieldLabel:   { fontSize: 11, fontWeight: '700', color: '#A08060', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 },
  fieldButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#E0D0B8', borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 14, backgroundColor: '#FFFDF5',
  },
  fieldLeft:        { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  fieldValue:       { fontSize: 14, color: '#3B1F00', fontWeight: '600' },
  fieldPlaceholder: { color: '#C4B49A', fontWeight: '400' },
  summaryRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFF8EE', borderRadius: 10, padding: 10,
    borderWidth: 1, borderColor: '#F5C070', marginTop: 4,
  },
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 },
  summaryDot:  { width: 4, height: 4, borderRadius: 2, backgroundColor: '#F5C070' },
  summaryText: { fontSize: 12, color: '#7D5A1E', fontWeight: '600' },
  priceCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#3B1F00', borderRadius: 16, padding: 16, marginBottom: 16,
  },
  priceCardLeft:   { gap: 3 },
  priceCardLabel:  { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },
  priceCardSub:    { fontSize: 11, color: 'rgba(255,255,255,0.45)' },
  priceCardRight:  {},
  priceCardAmount: { fontSize: 28, fontWeight: '900', color: '#F5A623' },
  confirmedBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#F0FFF4', borderRadius: 12, padding: 12, marginBottom: 14,
    borderWidth: 1, borderColor: '#A8E6C0',
  },
  confirmedIconWrap: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#27AE60', alignItems: 'center', justifyContent: 'center',
  },
  confirmedText: { fontSize: 13, fontWeight: '700', color: '#1E8449' },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#F5A623', paddingVertical: 15, borderRadius: 14,
    shadowColor: '#F5A623', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  primaryBtnDisabled: { backgroundColor: '#F5C070', shadowOpacity: 0 },
  primaryBtnText:     { color: '#fff', fontSize: 15, fontWeight: '800' },
});