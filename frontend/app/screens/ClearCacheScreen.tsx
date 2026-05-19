import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';

const STORAGE_ITEMS = [
  {
    id: '1',
    name: 'Facebook',
    subtitle: 'Offline data & cache',
    size: 1.8,
    icon: 'logo-facebook',
    color: '#3b5998',
  },
  {
    id: '2',
    name: 'Chrome',
    subtitle: 'Offline data',
    size: 1.3,
    icon: 'globe-outline',
    color: '#F5A623',
  },
  {
    id: '3',
    name: 'Spotify',
    subtitle: '',
    size: 1.5,
    icon: 'musical-notes-outline',
    color: '#1DB954',
  },
];

const TOTAL_GB = 128;
const USED_GB = 120;
const SYSTEM_GB = 40;
const APP_GB = 60;
const OTHER_GB = USED_GB - SYSTEM_GB - APP_GB;
const CACHE_GB = 2.5;

export default function ClearCacheScreen({ navigation }) {
  const [cleared, setCleared] = useState(false);
  const [items, setItems] = useState(STORAGE_ITEMS);

  const usedPercent = (USED_GB / TOTAL_GB) * 100;
  const systemPercent = (SYSTEM_GB / TOTAL_GB) * 100;
  const appPercent = (APP_GB / TOTAL_GB) * 100;

  const handleClearCache = () => {
    Alert.alert(
      'Clear cached data',
      `This will free up ${CACHE_GB} GB. Are you sure?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setCleared(true);
            setItems((prev) =>
              prev.map((item) => ({ ...item, size: +(item.size * 0.4).toFixed(1) }))
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back-outline" size={22} color="#5C3A00" />
        </TouchableOpacity>
      </View>

      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>Storage</Text>

        {/* Storage usage */}
        <Text style={styles.usageText}>
          <Text style={styles.usageBold}>{cleared ? USED_GB - CACHE_GB : USED_GB} GB </Text>
          used of {TOTAL_GB} GB
        </Text>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressSegment, { width: `${systemPercent}%`, backgroundColor: '#F5A623' }]} />
          <View style={[styles.progressSegment, { width: `${appPercent}%`, backgroundColor: '#3B1F00' }]} />
          <View style={[styles.progressSegment, { flex: 1, backgroundColor: '#F5E6CC' }]} />
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F5A623' }]} />
            <Text style={styles.legendText}>System</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#3B1F00' }]} />
            <Text style={styles.legendText}>App data</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F5E6CC', borderWidth: 1, borderColor: '#E0D0B8' }]} />
            <Text style={styles.legendText}>Other</Text>
          </View>
        </View>

        {/* App storage list */}
        <View style={styles.appList}>
          {items.map((item) => (
            <View key={item.id} style={styles.appRow}>
              <View style={styles.appIconWrapper}>
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>
              <View style={styles.appInfo}>
                <Text style={styles.appName}>{item.name}</Text>
                {item.subtitle ? (
                  <Text style={styles.appSubtitle}>{item.subtitle}</Text>
                ) : null}
              </View>
              <Text style={styles.appSize}>{item.size} GB</Text>
            </View>
          ))}
        </View>

        {/* Clear cached data */}
        <TouchableOpacity
          style={[styles.clearRow, cleared && styles.clearRowDone]}
          activeOpacity={0.7}
          onPress={handleClearCache}
          disabled={cleared}
        >
          <View>
            <Text style={styles.clearTitle}>
              {cleared ? 'Cache cleared' : 'Clear cached data'}
            </Text>
            <Text style={styles.clearSubtitle}>
              {cleared ? 'Cache has been cleared' : `Free up ${CACHE_GB}GB`}
            </Text>
          </View>
          <Ionicons
            name={cleared ? 'checkmark-circle-outline' : 'trash-outline'}
            size={22}
            color={cleared ? '#2ECC71' : '#5C3A00'}
          />
        </TouchableOpacity>
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F5A623',
    marginBottom: 12,
  },
  usageText: {
    fontSize: 13,
    color: '#5C4A30',
    marginBottom: 8,
  },
  usageBold: {
    fontWeight: '800',
    color: '#3B1F00',
  },
  progressBar: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#F5E6CC',
  },
  progressSegment: {
    height: '100%',
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 12,
    color: '#5C4A30',
    fontWeight: '500',
  },
  appList: {
    backgroundColor: '#FFF3E0',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5C070',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6D6',
    gap: 12,
  },
  appIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0D0B8',
  },
  appInfo: { flex: 1 },
  appName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B1F00',
  },
  appSubtitle: {
    fontSize: 11,
    color: '#A08060',
    marginTop: 1,
  },
  appSize: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5C4A30',
  },
  clearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF3E0',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5C070',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  clearRowDone: {
    borderColor: '#2ECC71',
    backgroundColor: '#F0FFF4',
  },
  clearTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B1F00',
    marginBottom: 2,
  },
  clearSubtitle: {
    fontSize: 12,
    color: '#A08060',
  },
});