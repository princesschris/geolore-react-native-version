import React from 'react';
import { View, StyleSheet } from 'react-native';

const FLAG_COLORS = [
  '#E74C3C', '#F5A623', '#2ECC71', '#3498DB',
  '#9B59B6', '#E74C3C', '#F5A623', '#2ECC71',
  '#3498DB', '#9B59B6', '#E74C3C', '#F5A623',
];

export default function BuntingBanner() {
  return (
    <View style={styles.container}>
      <View style={styles.string} />
      <View style={styles.flagsRow}>
        {FLAG_COLORS.map((color, i) => (
          <View key={i} style={[styles.flag, { backgroundColor: color }]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 32,
    marginBottom: 8,
    justifyContent: 'flex-start',
  },
  string: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: '#C4A882',
  },
  flagsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    top: 0,
  },
  flag: {
    width: 14,
    height: 20,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
});