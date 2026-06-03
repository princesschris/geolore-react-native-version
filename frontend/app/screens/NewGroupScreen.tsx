import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import BottomTabBar from '../components/BottomTabBar';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../components/CustomAlert';
import { getPushToken, sendPushNotification } from '../services/notificationService';

export default function NewGroupScreen({ navigation }: any) {
  const [groupName,    setGroupName]    = useState('');
  const [loading,      setLoading]      = useState(false);
  const [friends,      setFriends]      = useState<any[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [selectedIds,  setSelectedIds]  = useState<Set<string>>(new Set());

  const { user }                   = useAuth();
  const { showAlert, showConfirm } = useAlert();

  // Only fetch friends — not all users
  const fetchFriends = async () => {
    if (!user?.id) return;
    setFriendsLoading(true);
    try {
      const { data: friendRows } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', user.id);

      if (!friendRows || friendRows.length === 0) {
        setFriends([]);
        return;
      }

      const ids = friendRows.map((f: any) => f.friend_id);
      const { data: users } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', ids);

      setFriends(users ?? []);
    } catch {
      setFriends([]);
    } finally {
      setFriendsLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchFriends(); }, [user?.id]));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCreate = async () => {
    if (!groupName.trim()) {
      showAlert('warning', 'Required', 'Please enter a group name.');
      return;
    }
    setLoading(true);
    try {
      const { data: newGroup, error: groupError } = await supabase
        .from('groups')
        .insert({ name: groupName.trim(), creator_id: user?.id })
        .select()
        .single();

      if (groupError) throw groupError;

      const memberRows = [
        { group_id: newGroup.id, user_id: user?.id },
        ...[...selectedIds].map((uid) => ({ group_id: newGroup.id, user_id: uid })),
      ];

      const { error: memberError } = await supabase
        .from('group_members')
        .insert(memberRows);

      if (memberError) throw memberError;

      // Send push notifications to added members (not the creator)
      if (selectedIds.size > 0) {
        const tokenFetches = [...selectedIds].map(async (uid) => {
          const token = await getPushToken(uid);
          if (token) await sendPushNotification([token], 'Added to group', `You were added to "${newGroup.name}"`);
        });
        await Promise.allSettled(tokenFetches);
      }

      const createdName = newGroup.name;
      const createdId   = newGroup.id;
      showConfirm(
        'Group created!',
        `"${createdName}" is ready with ${memberRows.length} member${memberRows.length > 1 ? 's' : ''}. Open the chat now?`,
        () => navigation?.replace('GroupChat', { name: createdName, id: createdId }),
        () => navigation?.goBack(),
        'Open chat',
        'Later',
      );
    } catch (err: any) {
      showAlert('error', 'Error', err.message || 'Could not create group.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back-outline" size={22} color="#5C3A00" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Group</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.groupAvatar} activeOpacity={0.75}>
            <Ionicons name="people" size={52} color="#F5A623" />
          </TouchableOpacity>
          <Text style={styles.hint}>Tap to add a group photo</Text>
        </View>

        <Text style={styles.label}>Group name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter group name..."
          placeholderTextColor="#C4A882"
          value={groupName}
          onChangeText={setGroupName}
          autoCapitalize="words"
          maxLength={50}
        />
        <Text style={styles.charCount}>{groupName.length}/50</Text>

        <Text style={styles.label}>
          Add friends{selectedIds.size > 0 ? ` (${selectedIds.size} selected)` : ''}
        </Text>

        {friendsLoading ? (
          <ActivityIndicator color="#F5A623" style={{ marginVertical: 16 }} />
        ) : friends.length === 0 ? (
          <Text style={styles.emptyText}>Add friends first to include them in a group.</Text>
        ) : (
          <View style={styles.memberGrid}>
            {friends.map((u) => {
              const selected = selectedIds.has(u.id);
              return (
                <TouchableOpacity
                  key={u.id}
                  style={[styles.memberCard, selected && styles.memberCardSelected]}
                  onPress={() => toggleSelect(u.id)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.memberAvatar, selected && styles.memberAvatarSelected]}>
                    {selected
                      ? <Ionicons name="checkmark" size={22} color="#fff" />
                      : <Ionicons name="person" size={22} color="#C4A882" />
                    }
                  </View>
                  <Text style={[styles.memberName, selected && styles.memberNameSelected]} numberOfLines={1}>
                    {u.first_name} {u.last_name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          style={[styles.createBtn, (!groupName.trim() || loading) && styles.createBtnDisabled]}
          activeOpacity={0.85}
          onPress={handleCreate}
          disabled={!groupName.trim() || loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.createBtnText}>
                Create Group{selectedIds.size > 0 ? ` · ${selectedIds.size + 1} members` : ''}
              </Text>
          }
        </TouchableOpacity>
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', color: '#F5A623', textAlign: 'center' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 28, gap: 10 },
  groupAvatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#F5C070' },
  hint: { fontSize: 12, color: '#A08060' },
  label: { fontSize: 13, fontWeight: '700', color: '#3B1F00', marginBottom: 8 },
  input: { backgroundColor: '#FFF3E0', borderRadius: 12, borderWidth: 1, borderColor: '#E0D0B8', paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: '#3B1F00', marginBottom: 4 },
  charCount: { fontSize: 11, color: '#C4A882', alignSelf: 'flex-end', marginBottom: 20 },
  emptyText: { fontSize: 13, color: '#A08060', fontStyle: 'italic', marginBottom: 20 },
  memberGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  memberCard: { width: '30%', alignItems: 'center', gap: 6, padding: 8, borderRadius: 12, borderWidth: 1.5, borderColor: '#E0D0B8', backgroundColor: '#fff' },
  memberCardSelected: { borderColor: '#F5A623', backgroundColor: '#FFF3E0' },
  memberAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F5E6CC', alignItems: 'center', justifyContent: 'center' },
  memberAvatarSelected: { backgroundColor: '#F5A623' },
  memberName: { fontSize: 11, fontWeight: '600', color: '#3B1F00', textAlign: 'center' },
  memberNameSelected: { color: '#F5A623' },
  createBtn: { backgroundColor: '#F5A623', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  createBtnDisabled: { backgroundColor: '#E0C49A' },
  createBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});