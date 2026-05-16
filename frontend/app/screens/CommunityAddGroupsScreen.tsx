import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';

const GROUPS = [
  { id: '1', name: 'Chinazom' },
  { id: '2', name: 'Chinazom' },
  { id: '3', name: 'Chi...' },
  { id: '4', name: 'Chinazom' },
  { id: '5', name: 'Chinazom' },
  { id: '6', name: 'Chi...' },
];

const GroupCard = ({ name, joined, onJoin }) => (
  <View style={styles.groupCard}>
    <View style={styles.groupAvatar}>
      <Ionicons name="people" size={22} color="#C4A882" />
    </View>
    <Text style={styles.groupName} numberOfLines={1}>{name}</Text>
    <TouchableOpacity
      style={[styles.joinBtn, joined && styles.joinedBtn]}
      onPress={onJoin}
      activeOpacity={0.8}
    >
      <Text style={styles.joinBtnText}>{joined ? 'Joined' : 'Add+'}</Text>
    </TouchableOpacity>
  </View>
);

export default function CommunityAddGroupsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [joined, setJoined] = useState({});

  const toggleJoin = (id) => {
    setJoined((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {['All', 'Groups', 'Add +', 'Groups +'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterTab, tab === 'Groups +' && styles.filterTabActive]}
            activeOpacity={0.8}
            onPress={() => {
              if (tab === 'Groups') navigation?.navigate('CommunityGroups');
              else if (tab === 'Add +') navigation?.navigate('CommunityAdd');
              else if (tab === 'All') navigation?.navigate('Community');
            }}
          >
            <Text style={[styles.filterTabText, tab === 'Groups +' && styles.filterTabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Groups around you */}
        <Text style={styles.sectionTitle}>Groups around you</Text>
        <View style={styles.grid}>
          {GROUPS.slice(0, 3).map((g) => (
            <GroupCard key={g.id} name={g.name} joined={joined[g.id]} onJoin={() => toggleJoin(g.id)} />
          ))}
        </View>

        {/* Connect with groups */}
        <Text style={styles.sectionTitle}>Connect with groups round the world</Text>
        <View style={styles.grid}>
          {GROUPS.slice(3).map((g) => (
            <GroupCard key={g.id} name={g.name} joined={joined[g.id]} onJoin={() => toggleJoin(g.id)} />
          ))}
        </View>

        {/* New Group Button */}
        <TouchableOpacity
          style={styles.newGroupBtn}
          activeOpacity={0.8}
          onPress={() => navigation?.navigate('NewGroup')}
        >
          <Text style={styles.newGroupBtnText}>New Group</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#F5C070',
  },
  filterTabActive: {
    backgroundColor: '#F5A623',
    borderColor: '#F5A623',
  },
  filterTabText: { fontSize: 12, fontWeight: '600', color: '#5C3A00' },
  filterTabTextActive: { color: '#fff' },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B1F00',
    marginBottom: 12,
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  groupCard: {
    width: '30%',
    alignItems: 'center',
    gap: 6,
  },
  groupAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F5C070',
  },
  groupName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B1F00',
    textAlign: 'center',
  },
  joinBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  joinedBtn: { backgroundColor: '#C4A882' },
  joinBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  newGroupBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  newGroupBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});