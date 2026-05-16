import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Linking,
} from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Rect, Polygon } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';

const GlobeWithTree = () => (
  <Svg width="160" height="160" viewBox="0 0 70 70" fill="none">
    <Circle cx="35" cy="35" r="32" stroke="#F5A623" strokeWidth="2" fill="none" />
    <Ellipse cx="35" cy="35" rx="14" ry="32" stroke="#F5A623" strokeWidth="1.2" fill="none" />
    <Line x1="3" y1="35" x2="67" y2="35" stroke="#F5A623" strokeWidth="1.2" />
    <Line x1="7" y1="23" x2="63" y2="23" stroke="#F5A623" strokeWidth="0.8" />
    <Line x1="7" y1="47" x2="63" y2="47" stroke="#F5A623" strokeWidth="0.8" />
    <Path d="M28 22 Q30 20 33 21 Q36 22 37 25 Q38 29 36 33 Q34 37 33 40 Q32 43 30 42 Q27 40 26 36 Q24 31 25 27 Z" fill="#F5A623" opacity="0.85" />
    <Rect x="33.5" y="15" width="2.5" height="10" rx="1.2" fill="#D97706" />
    <Polygon points="34.5,4 40,13 29,13" fill="#F5A623" />
    <Polygon points="34.5,8 41,17 28,17" fill="#F5A623" />
    <Polygon points="34.5,12 42,21 27,21" fill="#D97706" opacity="0.75" />
    <Path d="M34.5 25 Q30 29 26 29" stroke="#D97706" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <Path d="M34.5 25 Q39 29 43 29" stroke="#D97706" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </Svg>
);

export default function ClassEndScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.container}>
        <View style={styles.logoWrapper}>
          <GlobeWithTree />
        </View>

        <Text style={styles.thankYouText}>Thank you for choosing{'\n'}GeoLore</Text>

        <View style={styles.complaintCard}>
          <Text style={styles.complaintText}>
            If you have any complaints please send us an email{' '}
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:GeoLore@gmail.com')}>
            <Text style={styles.emailLink}>GeoLore@gmail.com</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.homeButton}
          activeOpacity={0.8}
          onPress={() => navigation?.navigate('Home')}
        >
          <Ionicons name="home-outline" size={18} color="#fff" />
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>

      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 24,
    gap: 28,
  },
  logoWrapper: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFF3E0',
    borderWidth: 2.5,
    borderColor: '#F5C070',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thankYouText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#3B1F00',
    textAlign: 'center',
    lineHeight: 34,
  },
  complaintCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F5C070',
    width: '100%',
  },
  complaintText: {
    fontSize: 13,
    color: '#5C4A30',
    textAlign: 'center',
    lineHeight: 20,
  },
  emailLink: {
    fontSize: 13,
    color: '#F5A623',
    fontWeight: '700',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5A623',
    paddingVertical: 13,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  homeButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});