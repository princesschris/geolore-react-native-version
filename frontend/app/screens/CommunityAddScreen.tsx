import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { getPushToken, sendPushNotification } from '../services/notificationService';

const PersonCard = ({ person, status, onAdd }: any) => {
  const name = `${person.first_name} ${person.last_name}`;
  const isPending  = status === 'pending';
  const isAccepted = status === 'connected';

  return (
    <View style={styles.personCard}>
      <View style={styles.personAvatar}>
        <Ionicons name="person" size={22} color="#C4A882" />
      </View>
      <Text style={styles.personName} numberOfLines={1}>{name}</Text>
      <TouchableOpacity
        style={[
          styles.addBtn,
          isPending  && styles.pendingBtn,
          isAccepted && styles.addedBtn,
        ]}
        onPress={onAdd}
        activeOpacity={0.8}
        disabled={isPending || isAccepted}
      >
        <Text style={styles.addBtnText}>
          {isAccepted ? 'Connected' : isPending ? 'Pending' : 'Add+'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default function CommunityAddScreen({ navigation }: any) {
  const [searchQuery,  setSearchQuery]  = useState('');
  const [users,        setUsers]        = useState<any[]>([]);
  const [statusMap,    setStatusMap]    = useState<Record<string, string>>({});
  const [loading,      setLoading]      = useState(true);
  const { user } = useAuth();

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data: allUsers } = await supabase
        .from('users')
        .select('id, first_name, last_name, country_of_origin, tribe')
        .neq('id', user.id);
      const { data: friendRows } = await supabase
        .from('friends')
        .select('user_id, friend_id, status')
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);
      const map: Record<string, string> = {};
      for (const row of friendRows ?? []) {
        const otherId = row.user_id === user.id ? row.friend_id : row.user_id;
        const isSentByMe = row.user_id === user.id;
        if (row.status === 'connected') {
          map[otherId] = 'connected';
        }
        else if (row.status === 'pending' && isSentByMe && map[otherId] !== 'connected') {
          map[otherId] = 'pending';
        }
      }

      setStatusMap(map);
      setUsers(allUsers ?? []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, [user?.id]));

  const handleAdd = async (person: any) => {
    setStatusMap((prev) => ({ ...prev, [person.id]: 'pending' }));

    const { data, error } = await supabase
      .from('friends')
      .insert({ user_id: user?.id, friend_id: person.id, status: 'pending' })
      .select()
      .single();

    console.log('[AddFriend] data:', JSON.stringify(data));
    console.log('[AddFriend] error:', JSON.stringify(error));
    console.log('[AddFriend] user?.id:', user?.id);
    console.log('[AddFriend] person.id:', person.id);

    if (error) {
      setStatusMap((prev) => {
        const next = { ...prev };
        delete next[person.id];
        return next;
      });
      return;
    }

    getPushToken(person.id).then((token) => {
      if (token) {
        const myName = user?.first_name
          ? `${user.first_name} ${user.last_name ?? ''}`.trim()
          : 'Someone';
        sendPushNotification([token], 'Friend request', `${myName} sent you a friend request`);
      }
    });
  };

  const filtered = users.filter((u) => {
    const name = `${u.first_name} ${u.last_name}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const nearby = filtered.filter((u) => u.country_of_origin === user?.country_of_origin);
  const others  = filtered.filter((u) => u.country_of_origin !== user?.country_of_origin);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      <View style={styles.filterRow}>
        {['All', 'DMs','Groups', 'Add +', 'Groups +'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterTab, tab === 'Add +' && styles.filterTabActive]}
            activeOpacity={0.8}
            onPress={() => {
              if (tab === 'All')      navigation?.navigate('Community');
              if (tab === 'Groups')   navigation?.navigate('CommunityGroups');
              if (tab === 'Groups +') navigation?.navigate('CommunityAddGroups');
            }}
          >
            <Text style={[styles.filterTabText, tab === 'Add +' && styles.filterTabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F5A623" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {nearby.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>People around you</Text>
              <View style={styles.grid}>
                {nearby.map((p) => (
                  <PersonCard
                    key={p.id}
                    person={p}
                    status={statusMap[p.id]}
                    onAdd={() => handleAdd(p)}
                  />
                ))}
              </View>
            </>
          )}

          {others.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Connect with people round the world</Text>
              <View style={styles.grid}>
                {others.map((p) => (
                  <PersonCard
                    key={p.id}
                    person={p}
                    status={statusMap[p.id]}
                    onAdd={() => handleAdd(p)}
                  />
                ))}
              </View>
            </>
          )}

          {filtered.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="globe-outline" size={48} color="#A08060" />
              <Text style={styles.emptyTitle}>No users found</Text>
            </View>
          )}
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
  personCard: { width: '30%', alignItems: 'center', gap: 6 },
  personAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F5E6CC', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F5C070' },
  personName: { fontSize: 12, fontWeight: '600', color: '#3B1F00', textAlign: 'center' },
  addBtn:     { backgroundColor: '#F5A623', paddingVertical: 4, paddingHorizontal: 14, borderRadius: 12 },
  pendingBtn: { backgroundColor: '#C4A882' },
  addedBtn:   { backgroundColor: '#8B6F4E' },
  addBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#A08060' },
});