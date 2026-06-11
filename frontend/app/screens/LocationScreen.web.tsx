import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LocationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map is not available on web.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFDF5' },
  text: { color: '#5C3A00', fontSize: 16 },
});