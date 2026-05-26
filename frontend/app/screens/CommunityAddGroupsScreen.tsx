import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const GroupCard = ({ group, joined, onJoin }: any) => (
  <View style={styles.groupCard}>
    <View style={styles.groupAvatar}>
      <Ionicons name="people" size={22} color="#C4A882" />
    </View>
    <Text style={styles.groupName} numberOfLines={1}>{group.name}</Text>
    <TouchableOpacity
      style={[styles.joinBtn, joined && styles.joinedBtn]}
      onPress={onJoin}
      activeOpacity={0.8}
      disabled={joined}
    >
      <Text style={styles.joinBtnText}>{joined ? 'Joined' : 'Join+'}</Text>
    </TouchableOpacity>
  </View>
);

export default function CommunityAddGroupsScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [groups,      setGroups]      = useState<any[]>([]);
  const [joinedIds,   setJoinedIds]   = useState<Set<string>>(new Set());
  const [loading,     setLoading]     = useState(true);
  const { user } = useAuth();

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // All groups
      const { data: allGroups } = await supabase
        .from('groups')
        .select('id, name, created_by');

      // Groups user already joined
      const { data: myMemberships } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id);

      const ids = new Set((myMemberships ?? []).map((m: any) => m.group_id));
      setJoinedIds(ids);
      setGroups(allGroups ?? []);
    } catch {
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, [user?.id]));

  const handleJoin = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .insert({ group_id: groupId, user_id: user?.id });
      if (error) throw error;
      setJoinedIds((prev) => new Set([...prev, groupId]));
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not join group.');
    }
  };

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Split into groups created by friends vs others
  const myGroups    = filtered.filter((g) => joinedIds.has(g.id));
  const otherGroups = filtered.filter((g) => !joinedIds.has(g.id));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      <View style={styles.filterRow}>
        {['All', 'Groups', 'Add +', 'Groups +'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterTab, tab === 'Groups +' && styles.filterTabActive]}
            activeOpacity={0.8}
            onPress={() => {
              if (tab === 'All')    navigation?.navigate('Community');
              if (tab === 'Groups') navigation?.navigate('CommunityGroups');
              if (tab === 'Add +')  navigation?.navigate('CommunityAdd');
            }}
          >
            <Text style={[styles.filterTabText, tab === 'Groups +' && styles.filterTabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F5A623" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {otherGroups.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Groups around you</Text>
              <View style={styles.grid}>
                {otherGroups.slice(0, 3).map((g) => (
                  <GroupCard key={g.id} group={g} joined={joinedIds.has(g.id)} onJoin={() => handleJoin(g.id)} />
                ))}
              </View>
            </>
          )}

          {otherGroups.length > 3 && (
            <>
              <Text style={styles.sectionTitle}>Connect with groups round the world</Text>
              <View style={styles.grid}>
                {otherGroups.slice(3).map((g) => (
                  <GroupCard key={g.id} group={g} joined={joinedIds.has(g.id)} onJoin={() => handleJoin(g.id)} />
                ))}
              </View>
            </>
          )}

          {filtered.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}><Ionicons name="people-outline" size={48} color="#A08060" /></Text>
              <Text style={styles.emptyTitle}>No groups found</Text>
              <Text style={styles.emptySubtitle}>Create the first one!</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.newGroupBtn}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('NewGroup')}
          >
            <Text style={styles.newGroupBtnText}>+ New Group</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterTab: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#FFF3E0', borderWidth: 1, borderColor: '#F5C070' },
  filterTabActive: { backgroundColor: '#F5A623', borderColor: '#F5A623' },
  filterTabText: { fontSize: 12, fontWeight: '600', color: '#5C3A00' },
  filterTabTextActive: { color: '#fff' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 32 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#3B1F00', marginBottom: 12, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  groupCard: { width: '30%', alignItems: 'center', gap: 6 },
  groupAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F5C070' },
  groupName: { fontSize: 12, fontWeight: '600', color: '#3B1F00', textAlign: 'center' },
  joinBtn: { backgroundColor: '#F5A623', paddingVertical: 4, paddingHorizontal: 14, borderRadius: 12 },
  joinedBtn: { backgroundColor: '#C4A882' },
  joinBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#A08060' },
  emptySubtitle: { fontSize: 13, color: '#A08060' },
  newGroupBtn: { backgroundColor: '#F5A623', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  newGroupBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});