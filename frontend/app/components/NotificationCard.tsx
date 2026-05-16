import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type NotificationCardProps = {
  type: 'reminder' | 'lesson';
  title: string;
  timeAgo: string;
  message: string;
  onMarkDone?: () => void;
  onUpdate?: () => void;
  onView?: () => void;
};

export default function NotificationCard({
  type,
  title,
  timeAgo,
  message,
  onMarkDone,
  onUpdate,
  onView,
}: NotificationCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.timeAgo}>{timeAgo}</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.divider} />
      <View style={styles.actionsRow}>
        {type === 'reminder' ? (
          <>
            <TouchableOpacity onPress={onMarkDone}>
              <Text style={styles.actionLink}>Mark as done</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onUpdate}>
              <Text style={styles.actionLink}>Update</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={onView}>
              <Text style={styles.actionLink}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onUpdate}>
              <Text style={styles.actionLink}>Update</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF3E0',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5C070',
    padding: 14,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#3B1F00',
  },
  timeAgo: {
    fontSize: 12,
    color: '#A08060',
    fontWeight: '500',
  },
  message: {
    fontSize: 12,
    color: '#5C4A30',
    lineHeight: 18,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0D0B8',
    marginBottom: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  actionLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F5A623',
  },
});