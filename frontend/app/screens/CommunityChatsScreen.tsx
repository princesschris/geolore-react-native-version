import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, FlatList, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';
import ChatItem from '../components/ChatItem';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const FILTER_TABS = [
  { label: 'All',      navigate: null },
  { label: 'DMs',      navigate: null },
  { label: 'Groups',   navigate: 'CommunityGroups' },
  { label: 'Add +',    navigate: 'CommunityAdd' },
  { label: 'Groups +', navigate: 'CommunityAddGroups' },
];

export default function CommunityChatsScreen({ navigation }: any) {
  const [searchQuery,  setSearchQuery]  = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [friends,      setFriends]      = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const { user } = useAuth();

  const fetchFriends = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // Fetch both directions — user may appear on either side of the friendship row
      const [{ data: asUser }, { data: asFriend }] = await Promise.all([
        supabase
          .from('friends')
          .select('friend:users!friends_friend_id_fkey (id, first_name, last_name)')
          .eq('user_id', user.id),
        supabase
          .from('friends')
          .select('friend:users!friends_user_id_fkey (id, first_name, last_name)')
          .eq('friend_id', user.id),
      ]);

      // Merge and deduplicate by friend id
      const map = new Map<string, any>();
      for (const row of (asUser ?? [])) {
        const f = row.friend as any;
        if (f) map.set(f.id, { friend_id: f.id, friend: f });
      }
      for (const row of (asFriend ?? [])) {
        const f = row.friend as any;
        if (f) map.set(f.id, { friend_id: f.id, friend: f });
      }

      setFriends(Array.from(map.values()));
    } catch {
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchFriends(); }, [user?.id]));

  const filtered = friends.filter((f) => {
    const name = `${f.friend?.first_name} ${f.friend?.last_name}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      <View style={styles.filterRow}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.label}
            style={[styles.filterTab, activeFilter === tab.label && styles.filterTabActive]}
            onPress={() => tab.navigate ? navigation?.navigate(tab.navigate) : setActiveFilter(tab.label)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterTabText, activeFilter === tab.label && styles.filterTabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F5A623" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.friend_id}
          renderItem={({ item }) => {
            const name = `${item.friend?.first_name ?? ''} ${item.friend?.last_name ?? ''}`.trim();
            return (
              <ChatItem
                name={name}
                lastMessage="Tap to start chatting"
                time=""
                unreadCount={0}
                onPress={() => navigation?.navigate('Chat', { name, id: item.friend?.id })}
              />
            );
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="people-outline" size={40} color="#F5A623" />
              </View>
              <Text style={styles.emptyTitle}>No friends yet</Text>
              <Text style={styles.emptySubtitle}>Tap &quot;Add +&quot; to connect with people</Text>
            </View>
          }
        />
      )}

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterTab: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#FFF3E0', borderWidth: 1, borderColor: '#F5C070' },
  filterTabActive: { backgroundColor: '#F5A623', borderColor: '#F5A623' },
  filterTabText: { fontSize: 12, fontWeight: '600', color: '#5C3A00' },
  filterTabTextActive: { color: '#fff' },
  listContent: { paddingBottom: 20, flexGrow: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F5C070' },
  emptyTitle:    { fontSize: 18, fontWeight: '800', color: '#3B1F00' },
  emptySubtitle: { fontSize: 13, color: '#A08060' },
});