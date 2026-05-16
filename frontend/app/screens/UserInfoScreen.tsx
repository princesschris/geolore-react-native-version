import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';

const COMMON_GROUPS = [
  { id: '1', name: 'Igbo babes' },
  { id: '2', name: "Latina's" },
];

export default function UserInfoScreen({ navigation, route }:any) {
  const [groupSearch, setGroupSearch] = useState('');
  const [unadded, setUnadded] = useState(false);

  const userName = route?.params?.name ?? 'Ella';

  const filteredGroups = COMMON_GROUPS.filter((g) =>
    g.name.toLowerCase().includes(groupSearch.toLowerCase())
  );

  const handleRemoveFriend = () => {
    setUnadded(true);
    navigation?.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF3E0" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back-outline" size={22} color="#5C3A00" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
            onPress={() => navigation?.navigate('Chat', { name: userName })}
          >
            <Ionicons name="chatbubble-outline" size={22} color="#F5A623" />
            <Text style={styles.actionBtnText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, unadded && styles.actionBtnDisabled]}
            activeOpacity={0.8}
            onPress={() => setUnadded(!unadded)}
          >
            <Ionicons
              name={unadded ? 'person-add-outline' : 'person-remove-outline'}
              size={22}
              color={unadded ? '#F5A623' : '#E74C3C'}
            />
            <Text style={[styles.actionBtnText, !unadded && styles.unaddbtnText]}>
              {unadded ? 'Add' : 'Unadd'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Groups in Common */}
        <View style={styles.groupsSection}>
          <View style={styles.groupsHeader}>
            <Text style={styles.groupsCount}>
              {filteredGroups.length} groups in common
            </Text>
            <TouchableOpacity>
              <Ionicons name="search-outline" size={18} color="#A08060" />
            </TouchableOpacity>
          </View>

          {/* Group search */}
          {groupSearch !== '' || true ? (
            <View style={styles.groupSearchWrapper}>
              <TextInput
                style={styles.groupSearchInput}
                value={groupSearch}
                onChangeText={setGroupSearch}
                placeholder="Search groups..."
                placeholderTextColor="#C4B49A"
              />
            </View>
          ) : null}

          {/* Groups list */}
          {filteredGroups.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={styles.groupRow}
              activeOpacity={0.7}
              onPress={() => navigation?.navigate('GroupChat', { name: group.name })}
            >
              <View style={styles.groupAvatar}>
                <Ionicons name="people" size={20} color="#C4A882" />
              </View>
              <Text style={styles.groupName}>{group.name}</Text>
              <Ionicons name="chevron-forward-outline" size={16} color="#C4A882" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Remove Friend */}
        <TouchableOpacity
          style={styles.removeFriendRow}
          activeOpacity={0.7}
          onPress={handleRemoveFriend}
        >
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFE8C2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#F5A623',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#3B1F00',
  },

  // Action buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
    paddingHorizontal: 40,
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
  actionBtnDisabled: {
    opacity: 0.6,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B1F00',
  },
  unaddbtnText: {
    color: '#E74C3C',
  },

  // Groups section
  groupsSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderWidth: 1,
    borderColor: '#F5C070',
    marginBottom: 16,
  },
  groupsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupsCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F5A623',
  },
  groupSearchWrapper: {
    marginBottom: 8,
  },
  groupSearchInput: {
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    fontSize: 13,
    color: '#3B1F00',
    borderWidth: 1,
    borderColor: '#F5C070',
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6D6',
    gap: 12,
  },
  groupAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5E6CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#3B1F00',
  },

  // Remove friend
  removeFriendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  removeFriendText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E74C3C',
  },
});