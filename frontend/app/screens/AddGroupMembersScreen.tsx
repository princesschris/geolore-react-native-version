import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import BottomTabBar from '../components/BottomTabBar';
import TopBar from '../components/TopBar';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../components/CustomAlert';
import { getPushToken, sendPushNotification } from '../services/notificationService';

export default function AddGroupMembersScreen({ navigation, route }: any) {
  const groupId   = route?.params?.id   ?? null;
  const groupName = route?.params?.name ?? 'Group';

  const [searchQuery, setSearchQuery] = useState('');
  const [friends,     setFriends]     = useState<any[]>([]);
  const [existingIds, setExistingIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading,     setLoading]     = useState(true);
  const [adding,      setAdding]      = useState(false);

  const { user }                   = useAuth();
  const { showAlert, showConfirm } = useAlert();

  const fetchData = async () => {
    if (!user?.id || !groupId) return;
    setLoading(true);
    try {
      // Step 1: get friend_ids
      const { data: friendRows } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', user.id);

      // Step 2: get existing group member ids
      const { data: memberRows } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', groupId);

      const existingSet = new Set((memberRows ?? []).map((m: any) => m.user_id));
      setExistingIds(existingSet);

      if (!friendRows || friendRows.length === 0) {
        setFriends([]);
        return;
      }

      // Step 3: fetch friend user details
      const ids = friendRows.map((f: any) => f.friend_id);
      const { data: users } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', ids);

      setFriends(users ?? []);
    } catch {
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, [groupId, user?.id]));

  const toggleSelect = (id: string) => {
    if (existingIds.has(id)) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAdd = async () => {
    if (selectedIds.size === 0) {
      showAlert('warning', 'No one selected', 'Tap friends to select them first.');
      return;
    }
    setAdding(true);
    try {
      const rows = [...selectedIds].map((uid) => ({ group_id: groupId, user_id: uid }));
      const { error } = await supabase.from('group_members').insert(rows);
      if (error) throw error;

      // Send push notifications to each added member
      const tokenFetches = [...selectedIds].map(async (uid) => {
        const token = await getPushToken(uid);
        if (token) await sendPushNotification([token], 'Added to group', `You were added to "${groupName}"`);
      });
      await Promise.allSettled(tokenFetches);

      showConfirm(
        'Members added!',
        `${selectedIds.size} friend${selectedIds.size > 1 ? 's' : ''} added to "${groupName}".`,
        () => navigation?.goBack(),
        () => navigation?.goBack(),
        'Done',
        'Done',
      );
    } catch (err: any) {
      showAlert('error', 'Error', err.message || 'Could not add members.');
    } finally {
      setAdding(false);
    }
  };

  const filtered = friends.filter((u) => {
    const name = `${u.first_name} ${u.last_name}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back-outline" size={22} color="#5C3A00" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Members</Text>
        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#F5A623" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <View style={styles.centered}>
              <Ionicons name="people-outline" size={48} color="#C4A882" />
              <Text style={styles.emptyText}>
                {friends.length === 0 ? 'Add friends first to invite them to groups.' : 'No friends found.'}
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {filtered.map((u) => {
                const isExisting = existingIds.has(u.id);
                const isSelected = selectedIds.has(u.id);
                return (
                  <TouchableOpacity
                    key={u.id}
                    style={[
                      styles.memberCard,
                      isSelected  && styles.memberCardSelected,
                      isExisting  && styles.memberCardExisting,
                    ]}
                    onPress={() => toggleSelect(u.id)}
                    activeOpacity={isExisting ? 1 : 0.75}
                  >
                    <View style={[
                      styles.memberAvatar,
                      isSelected && styles.memberAvatarSelected,
                      isExisting && styles.memberAvatarExisting,
                    ]}>
                      {isSelected
                        ? <Ionicons name="checkmark" size={22} color="#fff" />
                        : isExisting
                          ? <Ionicons name="checkmark-done" size={22} color="#fff" />
                          : <Ionicons name="person" size={22} color="#C4A882" />
                      }
                    </View>
                    <Text style={styles.memberName} numberOfLines={1}>
                      {u.first_name} {u.last_name}
                    </Text>
                    {isExisting && <Text style={styles.alreadyText}>In group</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <TouchableOpacity
            style={[styles.addBtn, (selectedIds.size === 0 || adding) && styles.addBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleAdd}
            disabled={selectedIds.size === 0 || adding}
          >
            {adding
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.addBtnText}>
                  Add{selectedIds.size > 0 ? ` ${selectedIds.size} friend${selectedIds.size > 1 ? 's' : ''}` : ' Friends'}
                </Text>
            }
          </TouchableOpacity>
        </ScrollView>
      )}

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: '#F5A623', textAlign: 'center' },
  centered: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 14, color: '#A08060', fontWeight: '500', textAlign: 'center', paddingHorizontal: 24 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 32 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  memberCard: { width: '30%', alignItems: 'center', gap: 6, padding: 8, borderRadius: 12, borderWidth: 1.5, borderColor: '#E0D0B8', backgroundColor: '#fff' },
  memberCardSelected: { borderColor: '#F5A623', backgroundColor: '#FFF3E0' },
  memberCardExisting: { borderColor: '#C4A882', backgroundColor: '#F5F0E8' },
  memberAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F5E6CC', alignItems: 'center', justifyContent: 'center' },
  memberAvatarSelected: { backgroundColor: '#F5A623' },
  memberAvatarExisting: { backgroundColor: '#C4A882' },
  memberName: { fontSize: 11, fontWeight: '600', color: '#3B1F00', textAlign: 'center' },
  alreadyText: { fontSize: 10, color: '#C4A882', fontWeight: '500' },
  addBtn: { backgroundColor: '#F5A623', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  addBtnDisabled: { backgroundColor: '#E0C49A' },
  addBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});