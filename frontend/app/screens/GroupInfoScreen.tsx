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
import BottomTabBar from '../components/BottomTabBar';

const MEMBERS = [
  { id: '1', name: 'Chinazom',  isCreator: true },
  { id: '2', name: 'Princess',  isCreator: false },
  { id: '3', name: 'Chielotam', isCreator: false },
  { id: '4', name: 'Ella',      isCreator: false },
];

export default function GroupInfoScreen({ navigation, route }) {
  const groupName = route?.params?.name ?? 'GeoLore';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF3E0" />

      {/* Header */}
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
            onPress={() => navigation?.navigate('GroupChat', { name: groupName })}
          >
            <Ionicons name="chatbubble-outline" size={22} color="#F5A623" />
            <Text style={styles.actionBtnText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation?.navigate('CommunityAdd')}
          >
            <Ionicons name="person-add-outline" size={22} color="#F5A623" />
            <Text style={styles.actionBtnText}>Add+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="calendar-outline" size={22} color="#F5A623" />
            <Text style={styles.actionBtnText}>Events</Text>
          </TouchableOpacity>
        </View>

        {/* Members Section */}
        <View style={styles.membersSection}>
          <View style={styles.membersHeader}>
            <Text style={styles.membersCount}>{MEMBERS.length} members</Text>
            <TouchableOpacity>
              <Ionicons name="search-outline" size={18} color="#A08060" />
            </TouchableOpacity>
          </View>

          {MEMBERS.map((member) => (
            <View key={member.id} style={styles.memberRow}>
              <View style={styles.memberAvatar}>
                <Ionicons name="person" size={20} color="#C4A882" />
              </View>
              <Text style={styles.memberName}>{member.name}</Text>
              {member.isCreator && (
                <View style={styles.creatorBadge}>
                  <Text style={styles.creatorBadgeText}>creator</Text>
                </View>
              )}
            </View>
          ))}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Exit Group */}
          <TouchableOpacity style={styles.dangerRow} onPress={() => navigation?.goBack()}>
            <Ionicons name="exit-outline" size={20} color="#E74C3C" />
            <Text style={styles.dangerText}>Exit group</Text>
          </TouchableOpacity>

          {/* Report Group */}
          <TouchableOpacity style={styles.dangerRow}>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  groupAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFE8C2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F5A623',
  },
  groupName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3B1F00',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#F5C070',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B1F00',
  },
  membersSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderWidth: 1,
    borderColor: '#F5C070',
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  membersCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F5A623',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6D6',
    gap: 12,
  },
  memberAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5E6CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#3B1F00',
  },
  creatorBadge: {
    backgroundColor: '#F5A623',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  creatorBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0D0B8',
    marginVertical: 8,
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  dangerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E74C3C',
  },
});