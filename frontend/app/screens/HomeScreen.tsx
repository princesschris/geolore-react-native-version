import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  Line,
  Path,
  Rect,
  Polygon,
} from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import BottomTabBar from '../components/BottomTabBar';

// Compact Globe + Tree for banner
const GlobeWithTree = () => (
  <Svg width="90" height="90" viewBox="0 0 70 70" fill="none">
    <Circle cx="35" cy="35" r="32" stroke="#F5A623" strokeWidth="2" fill="none" />
    <Ellipse cx="35" cy="35" rx="14" ry="32" stroke="#F5A623" strokeWidth="1.2" fill="none" />
    <Line x1="3" y1="35" x2="67" y2="35" stroke="#F5A623" strokeWidth="1.2" />
    <Line x1="7" y1="23" x2="63" y2="23" stroke="#F5A623" strokeWidth="0.8" />
    <Line x1="7" y1="47" x2="63" y2="47" stroke="#F5A623" strokeWidth="0.8" />
    <Path
      d="M28 22 Q30 20 33 21 Q36 22 37 25 Q38 29 36 33 Q34 37 33 40 Q32 43 30 42 Q27 40 26 36 Q24 31 25 27 Z"
      fill="#F5A623"
      opacity="0.85"
    />
    <Rect x="33.5" y="15" width="2.5" height="10" rx="1.2" fill="#D97706" />
    <Polygon points="34.5,4 40,13 29,13" fill="#F5A623" />
    <Polygon points="34.5,8 41,17 28,17" fill="#F5A623" />
    <Polygon points="34.5,12 42,21 27,21" fill="#D97706" opacity="0.75" />
    <Path d="M34.5 25 Q30 29 26 29" stroke="#D97706" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <Path d="M34.5 25 Q39 29 43 29" stroke="#D97706" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </Svg>
);

// All home screen category cards
// imageSource: replace require('../assets/...') with your actual images
const CATEGORIES = [
  {
    key: 'culture',
    title: 'Learn About Your Culture',
    screen: 'YourCulture',
    imageLeft: false,
    imageSource: require('../../assets/images/learn_about_your_culture_image.png'),
  },
  {
    key: 'aiTutor',
    title: 'AI Tutor',
    screen: 'AITutor',
    imageLeft: false,
    imageSource: require('../../assets/images/ai_tutor_image.png'),
  },
  {
    key: 'community',
    title: 'Community',
    screen: 'Community',
    imageLeft: false,
    imageSource: require('../../assets/images/community_image.png'),
  },
  {
    key: 'events',
    title: 'Events',
    screen: 'Events',
    imageLeft: false,
    imageSource: require('../../assets/images/events_image.png'),
  },
  {
    key: 'language',
    title: 'Language',
    screen: 'Language',
    imageLeft: false,
    imageSource: require('../../assets/images/language_image.png'),
  },
  {
    key: 'history',
    title: 'History',
    screen: 'History',
    imageLeft: false,
    imageSource: require('../../assets/images/history_image.png'),
  },
  {
    key: 'food',
    title: 'Food',
    screen: 'Food',
    imageLeft: false,
    imageSource: require('../../assets/images/food_image.png'),
  },
  {
    key: 'cultures',
    title: 'Cultures',
    screen: 'Cultures',
    imageLeft: false,
    imageSource: require('../../assets/images/culture_image.png'),
  },
];

export default function HomeScreen({ navigation }:any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search"
        />
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation?.navigate('Profile')}
        >
          <Ionicons name="person-outline" size={20} color="#5C3A00" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <View>
            <Ionicons name="notifications-outline" size={20} color="#5C3A00" />
            {/* Notification badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>5</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>There&apos;s a whole world{'\n'}to discover</Text>
          <GlobeWithTree />
        </View>

        {/* Category Cards */}
        {CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.key}
            title={cat.title}
            imageSource={cat.imageSource}
            imageLeft={cat.imageLeft}
            onDiscover={() => navigation?.navigate(cat.screen)}
          />
        ))}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF5',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    gap: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#F5A623',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  banner: {
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bannerText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#5C3A00',
    lineHeight: 26,
    flex: 1,
  },
});