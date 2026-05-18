import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';

export default function AboutGeoLoreScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      {/* Header — just back arrow, no TopBar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={22} color="#5C3A00" />
        </TouchableOpacity>
      </View>

      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>About GeoLore</Text>

        {/* Links */}
        <TouchableOpacity
          style={styles.linkRow}
          activeOpacity={0.7}
          onPress={() => navigation?.navigate('TermsAndConditions')}
        >
          <Text style={styles.linkText}>Terms and Conditions</Text>
          <Ionicons name="chevron-forward-outline" size={18} color="#C4A882" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.linkRow}
          activeOpacity={0.7}
          onPress={() => navigation?.navigate('PrivacyPolicy')}
        >
          <Text style={styles.linkText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward-outline" size={18} color="#C4A882" />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Description */}
        <Text style={styles.description}>
          <Text style={styles.bold}>Geo-Lore </Text>
          is a language learning platform that teaches people all over about their culture and tradition
        </Text>
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
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F5A623',
    marginBottom: 28,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B1F00',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0D0B8',
  },
  description: {
    fontSize: 14,
    color: '#5C4A30',
    lineHeight: 22,
    marginTop: 28,
  },
  bold: {
    fontWeight: '800',
    color: '#3B1F00',
  },
});