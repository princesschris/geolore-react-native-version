import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';

const CATEGORIES = [
  {
    key: 'culture',
    title: 'Learn About Your Culture',
    screen: 'YourCulture',
    imageSource: require('../../assets/images/learn_about_your_culture_image.png'),
  },
  {
    key: 'aiTutor',
    title: 'AI Tutor',
    screen: 'AITutor',
    imageSource: require('../../assets/images/ai_tutor_image.png'),
  },
  {
    key: 'community',
    title: 'Community',
    screen: 'Community',
    imageSource: require('../../assets/images/community_image.png'),
  },
  {
    key: 'events',
    title: 'Events',
    screen: 'Events',
    imageSource: require('../../assets/images/events_image.png'),
  },
  {
    key: 'language',
    title: 'Language',
    screen: 'Language',
    imageSource: require('../../assets/images/language_image.png'),
  },
  {
    key: 'history',
    title: 'History',
    screen: 'History',
    imageSource: require('../../assets/images/history_image.png'),
  },
  {
    key: 'food',
    title: 'Food',
    screen: 'Food',
    imageSource: require('../../assets/images/food_image.png'),
  },
  {
    key: 'cultures',
    title: 'Traditions',
    screen: 'Traditions',
    imageSource: require('../../assets/images/culture_image.png'),
  },
];

export default function HomeScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter categories based on search query
  const filtered = CATEGORIES.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <View style={styles.badge}>
              <Text style={styles.badgeText}>5</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Bunting Banner */}
      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>There's a whole world{'\n'}to discover</Text>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
          />
        </View>

        {/* Category Cards */}
        {filtered.map((cat) => (
          <CategoryCard
            key={cat.key}
            title={cat.title}
            imageSource={cat.imageSource}
            onDiscover={() => navigation?.navigate(cat.screen)}
          />
        ))}

        {/* Empty search state */}
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color="#C4A882" />
            <Text style={styles.emptyText}>No results for "{searchQuery}"</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Tab Bar — no props needed, uses useRoute internally */}
      <BottomTabBar />
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
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 16,
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
  logo: {
    height: 100,
    width: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#A08060',
    fontWeight: '600',
  },
});