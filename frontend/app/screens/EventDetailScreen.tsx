import React from 'react';
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

export default function EventDetailScreen({ navigation, route }) {
  const event = route?.params?.event ?? {
    title: "Zomie's Birthday",
    day: 'Monday',
    date: '20th April 2026',
    time: '10:00am - 2:00pm',
    venue: 'You Moms house papa\'s street house 419',
    color: '#8B6F4E',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar showSearch={false} />
      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Card */}
        <View style={[styles.eventCard, { backgroundColor: event.color ?? '#8B6F4E' }]}>
          {/* Title */}
          <Text style={styles.eventTitle}>{event.title}</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Day */}
          <Text style={styles.eventDay}>{event.day}</Text>

          {/* Date */}
          <Text style={styles.eventDate}>{event.date}</Text>

          {/* Time */}
          <Text style={styles.eventTime}>{event.time}</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Venue label */}
          <Text style={styles.venueLabel}>Venue</Text>

          {/* Venue */}
          <Text style={styles.venueText}>{event.venue}</Text>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeBtn}
            activeOpacity={0.8}
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
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
  eventCard: {
    borderRadius: 20,
    padding: 24,
    gap: 12,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 30,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 4,
  },
  eventDay: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  eventDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  eventTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  venueLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
  },
  venueText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 22,
  },
  closeBtn: {
    marginTop: 12,
    backgroundColor: '#F5A623',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});