import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';
import NotificationCard from '../components/NotificationCard';

const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    type: 'reminder',
    title: 'Reminder',
    timeAgo: '25min',
    message: "You have lessons today at 6:00pm, be punctual oh don't say I didn't tell you",
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Reminder',
    timeAgo: '25min',
    message: "You have lessons today at 6:00pm, be punctual oh don't say I didn't tell you",
  },
  {
    id: '3',
    type: 'lesson',
    title: "It's time for your lesson",
    timeAgo: '1week',
    message: "You have lessons today at 6:00pm, be punctual oh don't say I didn't tell you",
  },
];

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMarkDone = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          // Empty state
          <View style={styles.emptyState}>
            <View style={styles.bellCircle}>
              <Text style={styles.bellEmoji}>🔔</Text>
            </View>
            <Text style={styles.emptyTitle}>You're all caught up</Text>
            <Text style={styles.emptySubtitle}>Come back later for reminders</Text>
          </View>
        ) : (
          notifications.map((n) => (
            <NotificationCard
              key={n.id}
              type={n.type}
              title={n.title}
              timeAgo={n.timeAgo}
              message={n.message}
              onMarkDone={() => handleMarkDone(n.id)}
              onUpdate={() => {}}
              onView={() => navigation?.navigate('IncomingClass')}
            />
          ))
        )}
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  bellCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F5C070',
  },
  bellEmoji: {
    fontSize: 52,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3B1F00',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#A08060',
    textAlign: 'center',
  },
});