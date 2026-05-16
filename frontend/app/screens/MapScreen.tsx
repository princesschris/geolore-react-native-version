import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import TopBar from '../components/TopBar';
import BuntingBanner from '../components/BuntingBanner';
import TopTabBar from '../components/TopTabBar';

export default function MapScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />
      <TopTabBar />

      {/* Map Placeholder — integrate react-native-maps here */}
      <View style={styles.mapPlaceholder}>
        <View style={styles.mapIcon}>
          <Ionicons name="map" size={64} color="#F5A623" />
        </View>
        <Text style={styles.mapTitle}>Map Coming Soon</Text>
        <Text style={styles.mapSubtitle}>
          Discover cultural events and{'\n'}communities near you
        </Text>
      </View>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  mapIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F5C070',
    marginBottom: 8,
  },
  mapTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3B1F00',
  },
  mapSubtitle: {
    fontSize: 13,
    color: '#A08060',
    textAlign: 'center',
    lineHeight: 20,
  },
});