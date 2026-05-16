import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';
import ChatItem from '../components/ChatItem';

const CHATS = [
  { id: '1', name: 'Chinazom',   lastMessage: "Yo how's your mom, I've been trying ...", time: '10:22', unread: 2 },
  { id: '2', name: 'Chielotam',  lastMessage: "Yo how's your mom, I've been trying ...", time: '10:22', unread: 1 },
  { id: '3', name: 'Chielotam',  lastMessage: "Yo how's your mom, I've been trying ...", time: '10:22', unread: 3 },
  { id: '4', name: 'Princess',   lastMessage: "Yo how's your mom, I've been trying ...", time: '10:22', unread: 0 },
  { id: '5', name: 'Ella',       lastMessage: "Yo how's your mom, I've been trying ...", time: '10:22', unread: 1 },
  { id: '6', name: 'Yo Mama',    lastMessage: "Yo how's your mom, I've been trying ...", time: '10:22', unread: 0 },
  { id: '7', name: 'Angela',     lastMessage: "Yo how's your mom, I've been trying ...", time: '10:22', unread: 1 },
  { id: '8', name: 'Barbara',    lastMessage: "Yo how's your mom, I've been trying ...", time: '10:22', unread: 2 },
];

const FILTER_TABS = [
  { label: 'All',      navigate: null },
  { label: 'DMs',      navigate: null },
  { label: 'Groups',   navigate: 'CommunityGroups' },
  { label: 'Add +',    navigate: 'CommunityAdd' },
  { label: 'Groups +', navigate: 'CommunityAddGroups' },
];

export default function CommunityChatsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = CHATS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabPress = (tab) => {
    if (tab.navigate) {
      navigation?.navigate(tab.navigate);
    } else {
      setActiveFilter(tab.label);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.label}
            style={[styles.filterTab, activeFilter === tab.label && styles.filterTabActive]}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterTabText, activeFilter === tab.label && styles.filterTabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chat List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem
            name={item.name}
            lastMessage={item.lastMessage}
            time={item.time}
            unreadCount={item.unread}
            onPress={() => navigation?.navigate('Chat', { name: item.name })}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

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
    paddingHorizontal: 16,
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
  filterTabTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingBottom: 20,
  },
});