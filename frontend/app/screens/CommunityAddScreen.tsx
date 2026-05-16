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

const PEOPLE = [
  { id: '1', name: 'Chinazom' },
  { id: '2', name: 'Chinazom' },
  { id: '3', name: 'Chi...' },
  { id: '4', name: 'Chinazom' },
  { id: '5', name: 'Chinazom' },
  { id: '6', name: 'Chi...' },
];

const PersonCard = ({ name, added, onAdd }) => (
  <View style={styles.personCard}>
    <View style={styles.personAvatar}>
      <Ionicons name="person" size={22} color="#C4A882" />
    </View>
    <Text style={styles.personName} numberOfLines={1}>{name}</Text>
    <TouchableOpacity
      style={[styles.addBtn, added && styles.addedBtn]}
      onPress={onAdd}
      activeOpacity={0.8}
    >
      <Text style={styles.addBtnText}>{added ? 'Added' : 'Add+'}</Text>
    </TouchableOpacity>
  </View>
);

export default function CommunityAddScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [added, setAdded] = useState({});

  const toggleAdd = (id) => {
    setAdded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const nearbyPeople = PEOPLE.slice(0, 3);
  const morePeople = PEOPLE.slice(3);

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
            style={[styles.filterTab, tab === 'Add +' && styles.filterTabActive]}
            activeOpacity={0.8}
            onPress={() => {
              if (tab === 'Groups') navigation?.navigate('CommunityGroups');
              else if (tab === 'Groups +') navigation?.navigate('CommunityAddGroups');
              else if (tab === 'All') navigation?.navigate('Community');
            }}
          >
            <Text style={[styles.filterTabText, tab === 'Add +' && styles.filterTabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* People around you */}
        <Text style={styles.sectionTitle}>People around you</Text>
        <View style={styles.grid}>
          {nearbyPeople.map((p) => (
            <PersonCard
              key={p.id}
              name={p.name}
              added={added[p.id]}
              onAdd={() => toggleAdd(p.id)}
            />
          ))}
        </View>

        {/* Connect with people */}
        <Text style={styles.sectionTitle}>Connect with people round the world</Text>
        <View style={styles.grid}>
          {morePeople.map((p) => (
            <PersonCard
              key={p.id}
              name={p.name}
              added={added[p.id]}
              onAdd={() => toggleAdd(p.id)}
            />
          ))}
        </View>
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
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5C3A00',
  },
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
  personCard: {
    width: '30%',
    alignItems: 'center',
    gap: 6,
  },
  personAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5E6CC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F5C070',
  },
  personName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B1F00',
    textAlign: 'center',
  },
  addBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  addedBtn: {
    backgroundColor: '#C4A882',
  },
  addBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});