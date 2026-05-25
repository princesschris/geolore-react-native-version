import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import BottomTabBar from '../components/BottomTabBar';
import TopBar from '../components/TopBar';
import BuntingBanner from '../components/BuntingBanner';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

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

// Alternate between the two brand colours for event cards
const CARD_COLORS = ['#F5A623', '#3B1F00', '#8B6F4E', '#C4A882'];

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

export default function EventsScreen({ navigation }: any) {
  const [searchQuery,  setSearchQuery]  = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [events,       setEvents]       = useState<Event[]>([]);
  const [loading,      setLoading]      = useState(true);
  const { user } = useAuth();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      if (error) throw error;
      setEvents(data ?? []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchEvents(); }, []));

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

        {/* Calendar */}
        <Calendar
          onDayPress={(day) => {
            setSelectedDate(day.dateString === selectedDate ? '' : day.dateString);
          }}
          markedDates={buildMarkedDates(events, selectedDate)}
          theme={{
            backgroundColor:          '#FFF3E0',
            calendarBackground:       '#FFF3E0',
            textSectionTitleColor:    '#A08060',
            selectedDayBackgroundColor: '#F5A623',
            selectedDayTextColor:     '#fff',
            todayTextColor:           '#F5A623',
            dayTextColor:             '#3B1F00',
            textDisabledColor:        '#C4A882',
            dotColor:                 '#F5A623',
            selectedDotColor:         '#fff',
            arrowColor:               '#F5A623',
            monthTextColor:           '#3B1F00',
            indicatorColor:           '#F5A623',
            textDayFontWeight:        '500',
            textMonthFontWeight:      '800',
            textDayHeaderFontWeight:  '700',
            textDayFontSize:          13,
            textMonthFontSize:        15,
            textDayHeaderFontSize:    12,
          }}
          style={styles.calendar}
        />

        {/* Section title */}
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

        {/* Events */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F5A623" />
          </View>
        ) : filtered.length > 0 ? (
          <View style={styles.eventsGrid}>
            {filtered.map((event, index) => (
              <TouchableOpacity
                key={event.id}
                style={[
                  styles.eventCard,
                  { backgroundColor: event.color ?? CARD_COLORS[index % CARD_COLORS.length] },
                ]}
                activeOpacity={0.85}
                onPress={() => navigation?.navigate('EventDetail', { event })}
              >
                <Text style={styles.eventTitle}>{event.title}</Text>
                {event.start_time ? (
                  <Text style={styles.eventTime}>{event.start_time}</Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={40} color="#C4A882" />
            <Text style={styles.emptyText}>
              {selectedDate ? 'No events on this day' : 'No events yet. Add one!'}
            </Text>
          </View>
        )}

        {/* Add Event */}
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
  calendar: { borderRadius: 16, borderWidth: 1, borderColor: '#F5C070', marginBottom: 20, overflow: 'hidden' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#3B1F00', letterSpacing: 1 },
  clearFilter: { fontSize: 13, fontWeight: '700', color: '#F5A623' },
  loadingContainer: { alignItems: 'center', paddingVertical: 32 },
  eventsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  eventCard: { width: '47%', borderRadius: 14, padding: 16, minHeight: 80, justifyContent: 'flex-end', gap: 4 },
  eventTitle: { fontSize: 13, fontWeight: '700', color: '#fff', lineHeight: 18 },
  eventTime:  { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 32, gap: 10 },
  emptyText: { fontSize: 14, color: '#A08060', fontWeight: '600' },
  addEventBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#F5A623', paddingVertical: 13, borderRadius: 10 },
  addEventBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});