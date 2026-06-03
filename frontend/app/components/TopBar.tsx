import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import SearchBar from './SearchBar';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

type TopBarProps = {
  searchQuery?:    string;
  onSearchChange?: (text: string) => void;
  showSearch?:     boolean;
};

export default function TopBar({
  searchQuery = '',
  onSearchChange,
  showSearch = true,
}: TopBarProps) {
  const navigation = useNavigation<any>();
  const isFocused  = useIsFocused();
  const { user }   = useAuth();
  const [unread, setUnread] = useState(0);

  // Stable unique channel name per component instance — never collides across screens
  const channelName = useRef(`topbar_notifs_${user?.id}_${Math.random().toString(36).slice(2)}`);

  const fetchCount = async () => {
    if (!user?.id) return;
    const { count } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_done', false);
    setUnread(count ?? 0);
  };

  useEffect(() => {
    if (!user?.id) return;

    fetchCount();

    // Remove any stale channel with this name before subscribing
    const existing = supabase.getChannels().find(c => c.topic === `realtime:${channelName.current}`);
    if (existing) supabase.removeChannel(existing);

    const channel = supabase
      .channel(channelName.current)
      .on('postgres_changes', {
        event:  'INSERT',
        schema: 'public',
        table:  'notifications',
        filter: `user_id=eq.${user.id}`,
      }, () => setUnread((prev) => prev + 1))
      .on('postgres_changes', {
        event:  'UPDATE',
        schema: 'public',
        table:  'notifications',
        filter: `user_id=eq.${user.id}`,
      }, () => fetchCount())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  // Refetch on focus so badge stays accurate after visiting Notifications screen
  useEffect(() => {
    if (isFocused) fetchCount();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {showSearch && (
        <SearchBar
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search"
        />
      )}

      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => navigation.navigate('Events')}
      >
        <Ionicons name="calendar-outline" size={20} color="#5C3A00" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons name="person-outline" size={20} color="#5C3A00" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => navigation.navigate('Notifications')}
      >
        <View>
          <Ionicons name="notifications-outline" size={20} color="#5C3A00" />
          {unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unread > 99 ? '99+' : unread}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 10,
  },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  badge: {
    position: 'absolute', top: -4, right: -6,
    backgroundColor: '#F5A623', borderRadius: 8,
    minWidth: 16, height: 16,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
});