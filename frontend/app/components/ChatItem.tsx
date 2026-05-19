import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatItem({ name, lastMessage, time, unreadCount, isGroup = false, onPress }:any) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={onPress}>
      {/* Avatar */}
      <View style={[styles.avatar, isGroup && styles.groupAvatar]}>
        <Ionicons
          name={isGroup ? 'people' : 'person'}
          size={22}
          color="#C4A882"
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>{lastMessage}</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6D6',
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F5E6CC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F5C070',
  },
  groupAvatar: {
    backgroundColor: '#FFF3E0',
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B1F00',
  },
  time: {
    fontSize: 11,
    color: '#A08060',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    flex: 1,
    fontSize: 12,
    color: '#A08060',
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#F5A623',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
});