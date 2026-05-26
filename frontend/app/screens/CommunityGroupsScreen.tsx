import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, FlatList, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';
import ChatItem from '../components/ChatItem';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import Ionicons from '@expo/vector-icons/build/Ionicons';

const FILTER_TABS = [
  { label: 'All',      navigate: 'Community' },
  { label: 'Groups',   navigate: null },
  { label: 'Add +',    navigate: 'CommunityAdd' },
  { label: 'Groups +', navigate: 'CommunityAddGroups' },
];

export default function CommunityGroupsScreen({ navigation }: any) {
  const [searchQuery,  setSearchQuery]  = useState('');
  const [activeFilter, setActiveFilter] = useState('Groups');
  const [groups,       setGroups]       = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const { user } = useAuth();

  const fetchGroups = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // Fetch groups the user is a member of
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          group_id,
          group:groups!group_members_group_id_fkey (
            id, name, created_by
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setGroups((data ?? []).map((d: any) => d.group).filter(Boolean));
    } catch {
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchGroups(); }, [user?.id]));

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatItem
              name={item.name}
              lastMessage="Tap to open group chat"
              time=""
              unreadCount={0}
              isGroup
              onPress={() => navigation?.navigate('GroupChat', { name: item.name, id: item.id })}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}><Ionicons name="people-outline" size={48} color="#A08060" />  </Text>
              <Text style={styles.emptyTitle}>No groups yet</Text>
              <Text style={styles.emptySubtitle}>Tap "Groups +" to join or create a group</Text>
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
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 10 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#3B1F00' },
  emptySubtitle: { fontSize: 13, color: '#A08060' },
});