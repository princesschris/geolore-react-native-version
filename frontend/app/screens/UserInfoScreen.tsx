import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, TextInput, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../components/CustomAlert';

export default function UserInfoScreen({ navigation, route }: any) {
  const userName = route?.params?.name ?? 'User';
  const friendId = route?.params?.id   ?? null;

  const [groupSearch,  setGroupSearch]  = useState('');
  const [commonGroups, setCommonGroups] = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);

  const { user }               = useAuth();
  const { showAlert, showConfirm } = useAlert();

  useEffect(() => {
    if (!friendId || !user?.id) { setLoading(false); return; }
    const fetch = async () => {
      const { data: myGroups } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id);

      const myGroupIds = (myGroups ?? []).map((g: any) => g.group_id);

      if (myGroupIds.length > 0) {
        const { data: shared } = await supabase
          .from('group_members')
          .select(`
            group_id,
            group:groups!group_members_group_id_fkey (id, name)
          `)
          .eq('user_id', friendId)
          .in('group_id', myGroupIds);

        setCommonGroups((shared ?? []).map((s: any) => s.group).filter(Boolean));
      }
      setLoading(false);
    };
    fetch();
  }, [friendId, user?.id]);

  const handleRemoveFriend = () => {
    showConfirm(
      'Remove friend',
      `Are you sure you want to remove ${userName} from your friends?`,
      async () => {
        try {
          await supabase
            .from('friends')
            .delete()
            .or(`and(user_id.eq.${user?.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user?.id})`);
          showAlert('success', 'Friend removed', `${userName} has been removed from your friends.`);
          setTimeout(() => navigation?.goBack(), 1500);
        } catch (err: any) {
          showAlert('error', 'Could not remove', err.message || 'Something went wrong. Please try again.');
        }
      },
      () => {},
      'Yes, remove',
      'Cancel',
    );
  };

  const filtered = commonGroups.filter((g) =>
    g.name.toLowerCase().includes(groupSearch.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF3E0" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back-outline" size={22} color="#5C3A00" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={64} color="#F5A623" />
          </View>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Chat', { name: userName, id: friendId })}
          >
            <Ionicons name="chatbubble-outline" size={22} color="#F5A623" />
            <Text style={styles.actionBtnText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.8}
            onPress={handleRemoveFriend}
          >
            <Ionicons name="person-remove-outline" size={22} color="#E74C3C" />
            <Text style={[styles.actionBtnText, { color: '#E74C3C' }]}>Unadd</Text>
          </TouchableOpacity>
        </View>

        {/* Groups in common */}
        <View style={styles.groupsSection}>
          <View style={styles.groupsHeader}>
            <Text style={styles.groupsCount}>
              {loading ? '...' : `${filtered.length} groups in common`}
            </Text>
            <Ionicons name="search-outline" size={18} color="#A08060" />
          </View>

          <View style={styles.groupSearchWrapper}>
            <TextInput
              style={styles.groupSearchInput}
              value={groupSearch}
              onChangeText={setGroupSearch}
              placeholder="Search groups..."
              placeholderTextColor="#C4B49A"
            />
          </View>

          {loading ? (
            <ActivityIndicator color="#F5A623" style={{ marginVertical: 12 }} />
          ) : (
            filtered.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={styles.groupRow}
                activeOpacity={0.7}
                onPress={() => navigation?.navigate('GroupChat', { name: group.name, id: group.id })}
              >
                <View style={styles.groupAvatar}>
                  <Ionicons name="people" size={20} color="#C4A882" />
                </View>
                <Text style={styles.groupName}>{group.name}</Text>
                <Ionicons name="chevron-forward-outline" size={16} color="#C4A882" />
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Remove friend */}
        <TouchableOpacity style={styles.removeFriendRow} activeOpacity={0.7} onPress={handleRemoveFriend}>
          <Ionicons name="person-remove-outline" size={20} color="#E74C3C" />
          <Text style={styles.removeFriendText}>Remove friend</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF3E0' },
  header: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8 },
  scrollContent: { paddingBottom: 32 },
  avatarSection: { alignItems: 'center', paddingVertical: 20, gap: 10 },
  avatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#FFE8C2', alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: '#F5A623' },
  userName: { fontSize: 24, fontWeight: '800', color: '#3B1F00' },
  actionButtons: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 24, paddingHorizontal: 40 },
  actionBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 14, borderWidth: 1, borderColor: '#F5C070' },
  actionBtnText: { fontSize: 12, fontWeight: '700', color: '#3B1F00' },
  groupsSection: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, borderWidth: 1, borderColor: '#F5C070', marginBottom: 16 },
  groupsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  groupsCount: { fontSize: 13, fontWeight: '700', color: '#F5A623' },
  groupSearchWrapper: { marginBottom: 8 },
  groupSearchInput: { backgroundColor: '#FFF3E0', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, fontSize: 13, color: '#3B1F00', borderWidth: 1, borderColor: '#F5C070' },
  groupRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0E6D6', gap: 12 },
  groupAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F5E6CC', alignItems: 'center', justifyContent: 'center' },
  groupName: { flex: 1, fontSize: 14, fontWeight: '600', color: '#3B1F00' },
  removeFriendRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 32, paddingVertical: 12 },
  removeFriendText: { fontSize: 14, fontWeight: '700', color: '#E74C3C' },
});