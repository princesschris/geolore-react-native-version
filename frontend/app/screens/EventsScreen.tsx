import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import BottomTabBar from '../components/BottomTabBar';
import TopBar from '../components/TopBar';
import BuntingBanner from '../components/BuntingBanner';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../components/CustomAlert';

interface Event {
  id:          string;
  title:       string;
  description: string;
  date:        string;
  date_label:  string;
  start_time:  string;
  end_time:    string;
  location:    string;
  color:       string;
  reminder:    string;
  allow_guests:    boolean;
  guests_notified: boolean;
  creator_id:  string;
}

const ACCENT_COLORS = ['#F5A623', '#3B1F00', '#8B6F4E', '#C4A882'];

const buildMarkedDates = (events: Event[], selectedDate: string) => {
  const marked: Record<string, any> = {};
  events.forEach((event) => {
    marked[event.date] = {
      marked:   true,
      dotColor: event.color ?? '#F5A623',
    };
  });
  if (selectedDate) {
    marked[selectedDate] = {
      ...(marked[selectedDate] ?? {}),
      selected:      true,
      selectedColor: '#F5A623',
    };
  }
  return marked;
};
const parseDateBadge = (dateStr: string) => {
  if (!dateStr) return { day: '', month: '' };
  const [, m, d] = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return { day: String(parseInt(d, 10)), month: months[parseInt(m, 10) - 1] ?? '' };
};

const EventCard = ({
  event, index, onPress, onDelete,
}: {
  event: Event;
  index: number;
  onPress: () => void;
  onDelete: () => void;
}) => {
  const accent = event.color ?? ACCENT_COLORS[index % ACCENT_COLORS.length];
  const { day, month } = parseDateBadge(event.date);
  const timeLabel = event.start_time
    ? event.end_time ? `${event.start_time} – ${event.end_time}` : event.start_time
    : null;

  return (
    <View style={styles.eventCard}>
      <View style={[styles.accentStrip, { backgroundColor: accent }]}>
        <Text style={styles.badgeDay}>{day}</Text>
        <Text style={styles.badgeMonth}>{month}</Text>
      </View>
      <TouchableOpacity style={styles.cardBody} onPress={onPress} activeOpacity={0.75}>
        <Text style={styles.cardTitle} numberOfLines={1}>{event.title}</Text>

        <View style={styles.cardMeta}>
          {timeLabel ? (
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={12} color="#A08060" />
              <Text style={styles.metaText}>{timeLabel}</Text>
            </View>
          ) : null}
          {event.location ? (
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={12} color="#A08060" />
              <Text style={styles.metaText} numberOfLines={1}>{event.location}</Text>
            </View>
          ) : null}
          {!timeLabel && !event.location && event.description ? (
            <Text style={styles.cardDesc} numberOfLines={1}>{event.description}</Text>
          ) : null}
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteBtn} onPress={onDelete} activeOpacity={0.7}>
        <Ionicons name="trash-outline" size={16} color="#E74C3C" />
      </TouchableOpacity>
    </View>
  );
};

export default function EventsScreen({ navigation }: any) {
  const [searchQuery,  setSearchQuery]  = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [events,       setEvents]       = useState<Event[]>([]);
  const [loading,      setLoading]      = useState(true);
  const { user }                        = useAuth();
  const { showConfirm, showAlert }      = useAlert();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('creator_id', user?.id)
        .order('date', { ascending: true });
      if (error) throw error;
      setEvents(data ?? []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchEvents(); }, [user?.id]));

  const handleDelete = (event: Event) => {
    showConfirm(
      'Delete event',
      `Delete "${event.title}"? This cannot be undone.`,
      async () => {
        try {
          const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', event.id);
          if (error) throw error;
          setEvents((prev) => prev.filter((e) => e.id !== event.id));
          showAlert('success', 'Deleted', 'Event removed from your calendar.');
        } catch (err: any) {
          showAlert('error', 'Delete failed', err.message || 'Could not delete event.');
        }
      },
      () => {},
      'Yes, delete',
      'Cancel',
    );
  };

  const filtered = searchQuery
    ? events.filter((e) => e.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : selectedDate
      ? events.filter((e) => e.date === selectedDate)
      : events;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Calendar
          onDayPress={(day) => {
            setSelectedDate(day.dateString === selectedDate ? '' : day.dateString);
          }}
          markedDates={buildMarkedDates(events, selectedDate)}
          theme={{
            backgroundColor:            '#FFF3E0',
            calendarBackground:         '#FFF3E0',
            textSectionTitleColor:      '#A08060',
            selectedDayBackgroundColor: '#F5A623',
            selectedDayTextColor:       '#fff',
            todayTextColor:             '#F5A623',
            dayTextColor:               '#3B1F00',
            textDisabledColor:          '#C4A882',
            dotColor:                   '#F5A623',
            selectedDotColor:           '#fff',
            arrowColor:                 '#F5A623',
            monthTextColor:             '#3B1F00',
            indicatorColor:             '#F5A623',
            textDayFontWeight:          '500',
            textMonthFontWeight:        '800',
            textDayHeaderFontWeight:    '700',
            textDayFontSize:            13,
            textMonthFontSize:          15,
            textDayHeaderFontSize:      12,
          }}
          style={styles.calendar}
        />

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>
            {selectedDate ? `EVENTS ON ${selectedDate}` : 'UPCOMING EVENTS'}
          </Text>
          {selectedDate && (
            <TouchableOpacity onPress={() => setSelectedDate('')}>
              <Text style={styles.clearFilter}>Show all</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F5A623" />
          </View>
        ) : filtered.length > 0 ? (
          <View style={styles.eventsList}>
            {filtered.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                onPress={() => navigation?.navigate('EventDetail', { event })}
                onDelete={() => handleDelete(event)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="calendar-outline" size={36} color="#F5A623" />
            </View>
            <Text style={styles.emptyTitle}>No events yet</Text>
            <Text style={styles.emptySubtitle}>
              {selectedDate ? 'Nothing on this day.' : 'Tap "Add Event" to get started.'}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.addEventBtn}
          activeOpacity={0.8}
          onPress={() => navigation?.navigate('AddEvent')}
        >
          <Ionicons name="add-circle-outline" size={18} color="#fff" />
          <Text style={styles.addEventBtnText}>Add Event</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 },

  calendar: {
    borderRadius: 16, borderWidth: 1, borderColor: '#F5C070',
    marginBottom: 20, overflow: 'hidden',
  },
  sectionRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 12,
  },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#3B1F00', letterSpacing: 1.2 },
  clearFilter:  { fontSize: 13, fontWeight: '700', color: '#F5A623' },
  loadingContainer: { alignItems: 'center', paddingVertical: 32 },
  eventsList: { gap: 10, marginBottom: 20 },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0E6D6',
    shadowColor: '#3B1F00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  accentStrip: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 1,
  },
  badgeDay: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 24,
  },
  badgeMonth: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardBody: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
    gap: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#3B1F00',
    lineHeight: 18,
  },
  cardMeta: { gap: 3 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: '#A08060', fontWeight: '500', flex: 1 },
  cardDesc: { fontSize: 11, color: '#A08060', fontStyle: 'italic' },
  deleteBtn: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#F0E6D6',
  },
  emptyState: { alignItems: 'center', paddingVertical: 32, gap: 10 },
  emptyIconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#F5C070',
  },
  emptyTitle:    { fontSize: 16, fontWeight: '800', color: '#3B1F00' },
  emptySubtitle: { fontSize: 13, color: '#A08060' },
  addEventBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#F5A623', paddingVertical: 13, borderRadius: 12,
    shadowColor: '#F5A623', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  addEventBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});