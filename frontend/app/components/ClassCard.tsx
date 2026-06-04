import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ClassCardProps {
  teacherName:   string;
  timeFrom:      string;
  timeTo:        string;
  onViewDetails: () => void;
  onJoinClass:   () => void;
}

export default function ClassCard({
  teacherName,
  timeFrom,
  timeTo,
  onViewDetails,
  onJoinClass,
}: ClassCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.teacherName}>{teacherName}</Text>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={13} color="#A08060" />
          <Text style={styles.timeText}>
            {timeFrom} - {timeTo}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.viewButton} activeOpacity={0.8} onPress={onViewDetails}>
          <Text style={styles.viewButtonText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.joinButton} activeOpacity={0.8} onPress={onJoinClass}>
          <Ionicons name="videocam" size={13} color="#fff" />
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  info: { flex: 1, gap: 6 },
  teacherName: { fontSize: 15, fontWeight: '800', color: '#3B1F00' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontSize: 12, color: '#A08060', fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  viewButton: {
    backgroundColor: '#fff',
    paddingVertical: 7, paddingHorizontal: 12,
    borderRadius: 8, borderWidth: 1, borderColor: '#F5A623',
  },
  viewButtonText: { color: '#F5A623', fontSize: 12, fontWeight: '700' },
  joinButton: {
    backgroundColor: '#F5A623',
    paddingVertical: 7, paddingHorizontal: 12,
    borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  joinButtonText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});