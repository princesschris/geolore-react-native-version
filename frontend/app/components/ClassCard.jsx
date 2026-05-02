import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ClassCard({ teacherName, timeFrom, timeTo, onViewDetails }) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.teacherName}>{teacherName}</Text>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={13} color="#A08060" />
          <Text style={styles.timeText}>
            Time : {timeFrom} - {timeTo}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.viewButton}
        activeOpacity={0.8}
        onPress={onViewDetails}
      >
        <Text style={styles.viewButtonText}>View details</Text>
      </TouchableOpacity>
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
  },
  info: {
    flex: 1,
    gap: 6,
  },
  teacherName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#3B1F00',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#A08060',
    fontWeight: '500',
  },
  viewButton: {
    backgroundColor: '#F5A623',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});