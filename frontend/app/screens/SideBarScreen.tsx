import React from 'react';
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

const HISTORY_ITEMS = [
  { id: '1', text: 'War stories' },
  { id: '2', text: 'Igbo History' },
  { id: '3', text: 'War stories' },
  { id: '4', text: 'The diaspora rules' },
  { id: '5', text: 'New Yam Festival date 20...' },
  { id: '6', text: 'Igbo History' },
  { id: '7', text: 'War stories' },
  { id: '8', text: 'The diaspora rules' },
  { id: '9', text: 'New Yam Festival date 20' },
];

const HistoryItem = ({ text, onPress }:any) => (
  <TouchableOpacity style={styles.historyItem} onPress={onPress} activeOpacity={0.7}>
    <Ionicons name="chatbubble-outline" size={16} color="#A08060" />
    <Text style={styles.historyText} numberOfLines={1}>{text}</Text>
  </TouchableOpacity>
);

export default function SideBarScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="close-outline" size={26} color="#5C3A00" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.newChatBtn}
            activeOpacity={0.8}
            onPress={() => {
              navigation?.goBack();
              navigation?.navigate('AIChat');
            }}
          >
            <Ionicons name="add-outline" size={18} color="#F5A623" />
            <Text style={styles.newChatText}>New chat</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.historyScroll}
          showsVerticalScrollIndicator={false}
        >
          {HISTORY_ITEMS.map((item) => (
            <HistoryItem
              key={item.id}
              text={item.text}
              onPress={() => {
                navigation?.goBack();
                navigation?.navigate('AIChat');
              }}
            />
          ))}
        </ScrollView>
        <View style={styles.bottomSection}>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation?.navigate('Profile')}
          >
            <Ionicons name="person-outline" size={18} color="#5C3A00" />
            <Text style={styles.settingText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="settings-outline" size={18} color="#5C3A00" />
            <Text style={styles.settingText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="log-out-outline" size={18} color="#E74C3C" />
            <Text style={[styles.settingText, styles.logoutText]}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF5',
  },
  container: {
    flex: 1,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#F5C070',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  newChatText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F5A623',
  },
  historyScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6D6',
  },
  historyText: {
    flex: 1,
    fontSize: 14,
    color: '#5C4A30',
    fontWeight: '500',
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0D0B8',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
  },
  settingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C4A30',
  },
  logoutText: {
    color: '#E74C3C',
  },
});