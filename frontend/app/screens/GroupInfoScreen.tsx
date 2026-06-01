import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../components/CustomAlert';

export default function GroupInfoScreen({ navigation, route }: any) {
  const groupName = route?.params?.name ?? 'Group';
  const groupId   = route?.params?.id   ?? null;

  const [members,   setMembers]   = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [creatorId, setCreatorId] = useState<string | null>(null);

  const { user }               = useAuth();
  const { showAlert, showConfirm } = useAlert();

  useEffect(() => {
    if (!groupId) { setLoading(false); return; }
    const fetch = async () => {
      const { data: groupData } = await supabase
        .from('groups')
        .select('created_by')
        .eq('id', groupId)
        .single();
      setCreatorId(groupData?.created_by ?? null);

      const { data: memberData } = await supabase
        .from('group_members')
        .select(`
          user_id,
          user:users!group_members_user_id_fkey (id, first_name, last_name)
        `)
        .eq('group_id', groupId);

      setMembers((memberData ?? []).map((m: any) => m.user).filter(Boolean));
      setLoading(false);
    };
    fetch();
  }, [groupId]);

  const handleExitGroup = () => {
    showConfirm(
      'Exit group',
      `Are you sure you want to leave "${groupName}"?`,
      async () => {
        try {
          await supabase
            .from('group_members')
            .delete()
            .eq('group_id', groupId)
            .eq('user_id', user?.id);
          navigation?.goBack();
        } catch (err: any) {
          showAlert('error', 'Could not exit', err.message || 'Something went wrong. Please try again.');
        }
      },
      () => {},
      'Yes, exit',
      'Cancel',
    );
  };

  const handleReportGroup = () => {
    showAlert('info', 'Report submitted', 'Thank you for your report. Our team will review it shortly.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF3E0" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back-outline" size={22} color="#5C3A00" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Group Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.groupAvatar}>
            <Ionicons name="people" size={52} color="#F5A623" />
          </View>
          <Text style={styles.groupName}>{groupName}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation?.navigate('GroupChat', { name: groupName, id: groupId })}
          >
            <Ionicons name="chatbubble-outline" size={22} color="#F5A623" />
            <Text style={styles.actionBtnText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation?.navigate('AddGroupMembers', { id: groupId, name: groupName })}
          >
            <Ionicons name="person-add-outline" size={22} color="#F5A623" />
            <Text style={styles.actionBtnText}>Add+</Text>
          </TouchableOpacity>
        </View>

        {/* Members */}
        <View style={styles.membersSection}>
          <View style={styles.membersHeader}>
            <Text style={styles.membersCount}>
              {loading ? '...' : `${members.length} members`}
            </Text>
            <Ionicons name="search-outline" size={18} color="#A08060" />
          </View>

          {loading ? (
            <ActivityIndicator color="#F5A623" style={{ marginVertical: 16 }} />
          ) : (
            members.map((member) => {
              const name      = `${member.first_name} ${member.last_name}`;
              const isCreator = member.id === creatorId;
              return (
                <View key={member.id} style={styles.memberRow}>
                  <View style={styles.memberAvatar}>
                    <Ionicons name="person" size={20} color="#C4A882" />
                  </View>
                  <Text style={styles.memberName}>{name}</Text>
                  {isCreator && (
                    <View style={styles.creatorBadge}>
                      <Text style={styles.creatorBadgeText}>creator</Text>
                    </View>
                  )}
                </View>
              );
            })
          )}

          <View style={styles.divider} />

          <TouchableOpacity style={styles.dangerRow} onPress={handleExitGroup}>
            <Ionicons name="exit-outline" size={20} color="#E74C3C" />
            <Text style={styles.dangerText}>Exit group</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dangerRow} onPress={handleReportGroup}>
            <Ionicons name="flag-outline" size={20} color="#E74C3C" />
            <Text style={styles.dangerText}>Report group</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF3E0' },
  header: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8 },
  scrollContent: { paddingBottom: 32 },
  avatarSection: { alignItems: 'center', paddingVertical: 20, gap: 8 },
  groupAvatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFE8C2', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#F5A623' },
  groupName: { fontSize: 22, fontWeight: '800', color: '#3B1F00' },
  actionButtons: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 20, paddingHorizontal: 16 },
  actionBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 14, borderWidth: 1, borderColor: '#F5C070' },
  actionBtnText: { fontSize: 12, fontWeight: '700', color: '#3B1F00' },
  membersSection: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, borderWidth: 1, borderColor: '#F5C070' },
  membersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  membersCount: { fontSize: 13, fontWeight: '700', color: '#F5A623' },
  memberRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0E6D6', gap: 12 },
  memberAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F5E6CC', alignItems: 'center', justifyContent: 'center' },
  memberName: { flex: 1, fontSize: 14, fontWeight: '600', color: '#3B1F00' },
  creatorBadge: { backgroundColor: '#F5A623', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  creatorBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#E0D0B8', marginVertical: 8 },
  dangerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  dangerText: { fontSize: 14, fontWeight: '600', color: '#E74C3C' },
});