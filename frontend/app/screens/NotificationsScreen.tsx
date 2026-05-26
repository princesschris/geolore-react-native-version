import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';
import NotificationCard from '../components/NotificationCard';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

interface Notification {
  id:         string;
  type:       string;
  title:      string;
  message:    string;
  created_at: string;
  is_done:    boolean;
}

function timeAgo(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);
  if (mins  < 60) return `${mins}min`;
  if (hours < 24) return `${hours}hr`;
  if (days  < 7)  return `${days}d`;
  return `${weeks}week`;
}

export default function NotificationsScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [searchQuery,   setSearchQuery]   = useState('');
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_done', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setNotifications(data ?? []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchNotifications(); }, [user?.id]));

  const handleMarkDone = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await supabase.from('notifications').update({ is_done: true }).eq('id', id);
  };

  const filtered = notifications.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F5A623" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              {/* Icon instead of emoji */}
              <View style={styles.bellCircle}>
                <Ionicons name="notifications-outline" size={52} color="#F5A623" />
              </View>
              <Text style={styles.emptyTitle}>You're all caught up</Text>
              <Text style={styles.emptySubtitle}>Come back later for reminders</Text>
            </View>
          ) : (
            filtered.map((n) => (
              <NotificationCard
                key={n.id}
                type={n.type}
                title={n.title}
                timeAgo={timeAgo(n.created_at)}
                message={n.message}
                onMarkDone={() => handleMarkDone(n.id)}
                onUpdate={() => {}}
                onView={() => navigation?.navigate('IncomingClass')}
              />
            ))
          )}
        </ScrollView>
      )}

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32, flexGrow: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  bellCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center',
    marginBottom: 8, borderWidth: 1, borderColor: '#F5C070',
  },
  emptyTitle:    { fontSize: 20, fontWeight: '800', color: '#3B1F00', textAlign: 'center' },
  emptySubtitle: { fontSize: 13, color: '#A08060', textAlign: 'center' },
});