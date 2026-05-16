import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';

export default function NoClassesScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      {/* Bunting Banner — no top bar on this screen */}
      <View style={styles.bannerWrapper}>
        <BuntingBanner />
      </View>

      <View style={styles.container}>
        {/* Tiger Mascot */}
        <View style={styles.mascotPlaceholder}>
          {/* Replace with actual image:
          <Image source={require('../assets/tiger.png')} style={styles.mascot} /> */}
          <Text style={styles.mascotEmoji}>🐯</Text>
        </View>

        {/* Message */}
        <Text style={styles.title}>You&apos;re all caught up</Text>
        <Text style={styles.subtitle}>
          You currently have no{'\n'}scheduled classes
        </Text>
      </View>

      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  bannerWrapper: {
    paddingTop: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
    paddingBottom: 40,
  },
  mascotPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  mascotEmoji: {
    fontSize: 90,
  },
  mascot: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3B1F00',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#A08060',
    textAlign: 'center',
    lineHeight: 22,
  },
});