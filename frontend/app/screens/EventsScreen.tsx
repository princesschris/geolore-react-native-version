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
import BottomTabBar from '../components/BottomTabBar';
import TopBar from '../components/TopBar';
import BuntingBanner from '../components/BuntingBanner';
import TopTabBar from '../components/TopTabBar';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const UPCOMING_EVENTS = [
  { id: '1', title: 'Outing with the girls', color: '#F5A623' },
  { id: '2', title: 'Museum visit',          color: '#8B6F4E' },
  { id: '3', title: 'Site Seeing',           color: '#F5A623' },
  { id: '4', title: "Zomie's Birthday",      color: '#8B6F4E' },
  { id: '5', title: 'Random event',          color: '#F5A623' },
  { id: '6', title: 'yh yh',                 color: '#C4A882' },
];

// Simple calendar component
const MiniCalendar = () => {
  const [currentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = currentDate.getDate();

  // Get days in month and first day offset
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <View style={calStyles.container}>
      {/* Month header */}
      <Text style={calStyles.monthTitle}>
        {MONTHS[month].toUpperCase()} {year}
      </Text>
      {/* Day headers */}
      <View style={calStyles.daysRow}>
        {DAYS.map((d) => (
          <Text key={d} style={calStyles.dayHeader}>{d}</Text>
        ))}
      </View>
      {/* Date grid */}
      <View style={calStyles.grid}>
        {cells.map((cell, i) => (
          <View key={i} style={calStyles.cell}>
            {cell && (
              <View style={[calStyles.dateCircle, cell === today && calStyles.todayCircle]}>
                <Text style={[calStyles.dateText, cell === today && calStyles.todayText]}>
                  {cell}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const calStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F5C070',
  },
  monthTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#3B1F00',
    textAlign: 'center',
    marginBottom: 8,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 4,
  },
  dayHeader: {
    width: 32,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
    color: '#A08060',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 2,
  },
  dateCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCircle: {
    backgroundColor: '#F5A623',
  },
  dateText: {
    fontSize: 11,
    color: '#3B1F00',
    fontWeight: '500',
  },
  todayText: {
    color: '#fff',
    fontWeight: '800',
  },
});

export default function EventsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />
      <TopTabBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar */}
        <MiniCalendar />

        {/* Upcoming Events */}
        <Text style={styles.sectionTitle}>UPCOMING EVENTS</Text>
        <View style={styles.eventsGrid}>
          {UPCOMING_EVENTS.map((event) => (
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3B1F00',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 14,
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