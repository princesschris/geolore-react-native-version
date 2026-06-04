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
import { getPushToken, sendPushNotification } from '../services/notificationService';

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
  return `${weeks}wk`;
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

  const dismiss = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await supabase.from('notifications').update({ is_done: true }).eq('id', id);
  };

  const handleAcceptFriend = async (notification: Notification) => {
    try {
      const { data: requests } = await supabase
        .from('friends')
        .select('id, user_id')
        .eq('friend_id', user?.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!requests || requests.length === 0) {
        dismiss(notification.id);
        return;
      }
      const request = requests[0];

      await supabase
        .from('friends')
        .update({ status: 'connected' })
        .eq('id', request.id);
      await supabase
        .from('friends')
        .insert({ user_id: user?.id, friend_id: request.user_id, status: 'connected' });

      const token = await getPushToken(request.user_id);
      if (token) {
        const myName = user?.first_name
          ? `${user.first_name} ${user.last_name ?? ''}`.trim()
          : 'Someone';
        await sendPushNotification([token], 'Friend request accepted', `${myName} accepted your friend request`);
      }

      dismiss(notification.id);
    } catch (err) {
      console.error('[AcceptFriend]', err);
      dismiss(notification.id);
    }
  };

  const handleDeclineFriend = async (notification: Notification) => {
    try {
      await supabase
        .from('friends')
        .delete()
        .eq('friend_id', user?.id)
        .eq('status', 'pending');

      dismiss(notification.id);
    } catch {
      dismiss(notification.id);
    }
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
              <View style={styles.bellCircle}>
                <Ionicons name="notifications-outline" size={52} color="#F5A623" />
              </View>
              <Text style={styles.emptyTitle}>You&apos;re all caught up</Text>
              <Text style={styles.emptySubtitle}>Come back later for updates</Text>
            </View>
          ) : (
            filtered.map((n) => (
              <NotificationCard
                key={n.id}
                type={n.type}
                title={n.title}
                timeAgo={timeAgo(n.created_at)}
                message={n.message}
                onMarkDone={() => dismiss(n.id)}
                onUpdate={() => {}}
                onView={() => navigation?.navigate('IncomingClass')}
                onAccept={() => handleAcceptFriend(n)}
                onDecline={() => handleDeclineFriend(n)}
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