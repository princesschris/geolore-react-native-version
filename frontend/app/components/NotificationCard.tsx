import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type NotificationCardProps = {
  type:        string;
  title:       string;
  timeAgo:     string;
  message:     string;
  onMarkDone?: () => void;
  onUpdate?:   () => void;
  onView?:     () => void;
  onAccept?:   () => void;
  onDecline?:  () => void;
};

const TYPE_ICON: Record<string, { name: string; bg: string; color: string }> = {
  friend_request:  { name: 'person-add-outline',       bg: '#FFF3E0', color: '#F5A623' },
  friend_accepted: { name: 'people-outline',            bg: '#E8F5E9', color: '#4CAF50' },
  group_added:     { name: 'people-circle-outline',     bg: '#FFF3E0', color: '#F5A623' },
  reminder:        { name: 'alarm-outline',             bg: '#FFF3E0', color: '#F5A623' },
  lesson:          { name: 'book-outline',              bg: '#FFF3E0', color: '#F5A623' },
};

export default function NotificationCard({
  type, title, timeAgo, message,
  onMarkDone, onUpdate, onView, onAccept, onDecline,
}: NotificationCardProps) {
  const icon = TYPE_ICON[type] ?? TYPE_ICON.reminder;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        {/* Icon */}
        <View style={[styles.iconCircle, { backgroundColor: icon.bg }]}>
          <Ionicons name={icon.name as any} size={18} color={icon.color} />
        </View>

        <View style={styles.textBlock}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.timeAgo}>{timeAgo}</Text>
          </View>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>

      {/* ── Action buttons per type ── */}
      {(type === 'friend_request') && (
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.declineBtn} onPress={onDecline} activeOpacity={0.8}>
            <Text style={styles.declineBtnText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptBtn} onPress={onAccept} activeOpacity={0.8}>
            <Text style={styles.acceptBtnText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}

      {(type === 'friend_accepted' || type === 'group_added') && (
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.dismissBtn} onPress={onMarkDone} activeOpacity={0.8}>
            <Text style={styles.dismissBtnText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      {type === 'reminder' && (
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={onMarkDone}>
            <Text style={styles.actionLink}>Mark as done</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onUpdate}>
            <Text style={styles.actionLink}>Update</Text>
          </TouchableOpacity>
        </View>
      )}

      {type === 'lesson' && (
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={onView}>
            <Text style={styles.actionLink}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onUpdate}>
            <Text style={styles.actionLink}>Update</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0E6D6',
    padding: 14,
    marginBottom: 12,
    shadowColor: '#3B1F00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  iconCircle: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  textBlock: { flex: 1, gap: 4 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title:   { fontSize: 14, fontWeight: '800', color: '#3B1F00', flex: 1 },
  timeAgo: { fontSize: 11, color: '#A08060', fontWeight: '500', marginLeft: 8 },
  message: { fontSize: 12, color: '#5C4A30', lineHeight: 18 },

  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 4 },

  // Accept / Decline
  acceptBtn:  { flex: 1, backgroundColor: '#F5A623', paddingVertical: 9, borderRadius: 10, alignItems: 'center' },
  acceptBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  declineBtn: { flex: 1, backgroundColor: '#F5E6CC', paddingVertical: 9, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#E0D0B8' },
  declineBtnText: { color: '#5C3A00', fontSize: 13, fontWeight: '700' },

  // Dismiss
  dismissBtn: { paddingVertical: 7, paddingHorizontal: 16, borderRadius: 10, backgroundColor: '#F5E6CC', borderWidth: 1, borderColor: '#E0D0B8' },
  dismissBtnText: { color: '#5C3A00', fontSize: 12, fontWeight: '700' },

  // Text links (reminder/lesson)
  actionLink: { fontSize: 13, fontWeight: '700', color: '#F5A623' },
});