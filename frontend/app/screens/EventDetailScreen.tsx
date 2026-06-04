import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import TopBar from '../components/TopBar';
import BuntingBanner from '../components/BuntingBanner';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../components/CustomAlert';

export default function EventDetailScreen({ navigation, route }: any) {
  const event = route?.params?.event ?? {
    title:      'Event',
    date_label: '',
    start_time: '',
    end_time:   '',
    location:   '',
    description:'',
    color:      '#F5A623',
    creator_id: null,
  };

  const { user }               = useAuth();
  const { showConfirm, showAlert } = useAlert();

  const isOwner = user?.id === event.creator_id;

  const timeLabel = event.start_time
    ? event.end_time
      ? `${event.start_time} – ${event.end_time}`
      : event.start_time
    : null;

  const handleDelete = () => {
    showConfirm(
      'Delete event',
      `Are you sure you want to delete "${event.title}"? This cannot be undone.`,
      async () => {
        try {
          const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', event.id);
          if (error) throw error;
          showAlert('success', 'Event deleted', 'The event has been removed from your calendar.');
          setTimeout(() => navigation?.goBack(), 1500);
        } catch (err: any) {
          showAlert('error', 'Delete failed', err.message || 'Could not delete event. Please try again.');
        }
      },
      () => {},
      'Yes, delete',
      'Cancel',
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar showSearch={false} />
      <BuntingBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={[styles.eventCard, { backgroundColor: event.color ?? '#F5A623' }]}>
          <Text style={styles.eventTitle}>{event.title}</Text>

          <View style={styles.divider} />
          {event.date_label ? (
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.eventDate}>{event.date_label}</Text>
            </View>
          ) : null}
          {timeLabel ? (
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.eventTime}>{timeLabel}</Text>
            </View>
          ) : null}
          {event.location ? (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color="rgba(255,255,255,0.8)" />
                <View style={styles.venueBlock}>
                  <Text style={styles.venueLabel}>Venue</Text>
                  <Text style={styles.venueText}>{event.location}</Text>
                </View>
              </View>
            </>
          ) : null}
          {event.description ? (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Ionicons name="document-text-outline" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.descriptionText}>{event.description}</Text>
              </View>
            </>
          ) : null}

          {event.reminder && event.reminder !== 'never' ? (
            <View style={styles.reminderBadge}>
              <Ionicons name="notifications-outline" size={13} color="#3B1F00" />
              <Text style={styles.reminderText}>Reminder: {event.reminder}</Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.closeBtn}
              activeOpacity={0.8}
              onPress={() => navigation?.goBack()}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
            {isOwner && (
              <TouchableOpacity
                style={styles.deleteBtn}
                activeOpacity={0.8}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={16} color="#fff" />
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 },
  eventCard: { borderRadius: 20, padding: 24, gap: 12 },
  eventTitle: { fontSize: 24, fontWeight: '800', color: '#fff', lineHeight: 30 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.25)', marginVertical: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  eventDate: { fontSize: 15, fontWeight: '700', color: '#fff', flex: 1 },
  eventTime: { fontSize: 15, fontWeight: '600', color: '#fff', flex: 1 },
  venueBlock: { flex: 1, gap: 2 },
  venueLabel: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },
  venueText: { fontSize: 14, fontWeight: '600', color: '#fff', lineHeight: 20 },
  descriptionText: { fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 20, flex: 1 },
  reminderBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start',
  },
  reminderText: { fontSize: 12, fontWeight: '700', color: '#3B1F00' },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  closeBtn: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12, borderRadius: 10, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
  },
  closeBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#3B1F00', paddingVertical: 12,
    paddingHorizontal: 20, borderRadius: 10,
  },
  deleteBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});