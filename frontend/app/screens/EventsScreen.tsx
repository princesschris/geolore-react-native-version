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
import { Calendar } from 'react-native-calendars';
import BottomTabBar from '../components/BottomTabBar';
import TopBar from '../components/TopBar';
import BuntingBanner from '../components/BuntingBanner';

const UPCOMING_EVENTS = [
  { id: '1', title: 'Outing with the girls', color: '#F5A623', date: '2026-05-18' },
  { id: '2', title: 'Museum visit',           color: '#8B6F4E', date: '2026-05-20' },
  { id: '3', title: 'Site Seeing',            color: '#F5A623', date: '2026-05-22' },
  { id: '4', title: "Zomie's Birthday",       color: '#8B6F4E', date: '2026-05-25' },
  { id: '5', title: 'Random event',           color: '#F5A623', date: '2026-05-28' },
  { id: '6', title: 'yh yh',                  color: '#C4A882', date: '2026-05-30' },
];

// Build marked dates from events
const buildMarkedDates = (selectedDate) => {
  const marked = {};

  UPCOMING_EVENTS.forEach((event) => {
    marked[event.date] = {
      marked: true,
      dotColor: event.color,
    };
  });

  if (selectedDate) {
    marked[selectedDate] = {
      ...(marked[selectedDate] || {}),
      selected: true,
      selectedColor: '#F5A623',
    };
  }

  return marked;
};

export default function EventsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Filter events for selected date, or show all
  const displayedEvents = selectedDate
    ? UPCOMING_EVENTS.filter((e) => e.date === selectedDate)
    : UPCOMING_EVENTS;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Interactive Calendar */}
        <Calendar
          onDayPress={(day) => {
            setSelectedDate(day.dateString === selectedDate ? '' : day.dateString);
          }}
          markedDates={buildMarkedDates(selectedDate)}
          theme={{
            backgroundColor: '#FFF3E0',
            calendarBackground: '#FFF3E0',
            textSectionTitleColor: '#A08060',
            selectedDayBackgroundColor: '#F5A623',
            selectedDayTextColor: '#fff',
            todayTextColor: '#F5A623',
            dayTextColor: '#3B1F00',
            textDisabledColor: '#C4A882',
            dotColor: '#F5A623',
            selectedDotColor: '#fff',
            arrowColor: '#F5A623',
            monthTextColor: '#3B1F00',
            indicatorColor: '#F5A623',
            textDayFontWeight: '500',
            textMonthFontWeight: '800',
            textDayHeaderFontWeight: '700',
            textDayFontSize: 13,
            textMonthFontSize: 15,
            textDayHeaderFontSize: 12,
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

        {/* Events grid */}
        {displayedEvents.length > 0 ? (
          <View style={styles.eventsGrid}>
            {displayedEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={[styles.eventCard, { backgroundColor: event.color }]}
                activeOpacity={0.85}
                onPress={() => navigation?.navigate('EventDetail', { event })}
              >
                <Text style={styles.eventTitle}>{event.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={40} color="#C4A882" />
            <Text style={styles.emptyText}>No events on this day</Text>
          </View>
        )}

        {/* Add Event Button */}
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  calendar: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F5C070',
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#3B1F00',
    letterSpacing: 1,
  },
  clearFilter: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F5A623',
  },
  eventsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  eventCard: {
    width: '47%',
    borderRadius: 14,
    padding: 16,
    minHeight: 80,
    justifyContent: 'flex-end',
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#A08060',
    fontWeight: '600',
  },
  addEventBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F5A623',
    paddingVertical: 13,
    borderRadius: 10,
  },
  addEventBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});