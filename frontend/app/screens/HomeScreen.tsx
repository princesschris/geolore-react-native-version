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
import CategoryCard from '../components/CategoryCard';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';

const CATEGORIES = [
  {
    key: 'culture',
    title: 'Learn About Your Culture',
    screen: 'YourCulture',
    imageSource: require('../../assets/images/learn_about_your_culture_image.png'),
  },
  {
    key: 'aiChat',
    title: 'AI Chat',
    screen: 'AIChat',
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
    key: 'traditions',
    title: 'Traditions',
    screen: 'Traditions',
    imageSource: require('../../assets/images/culture_image.png'),
  },
];

export default function HomeScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const filtered = CATEGORIES.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <Text style={styles.bannerText}>There&apos;s a whole world{'\n'}to discover</Text>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
          />
        </View>
        {filtered.map((cat) => (
          <CategoryCard
            key={cat.key}
            title={cat.title}
            imageSource={cat.imageSource}
            onDiscover={() => navigation?.navigate(cat.screen)}
          />
        ))}
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color="#C4A882" />
            <Text style={styles.emptyText}>No results for "{searchQuery}"</Text>
          </View>
        )}
      </ScrollView>
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF5',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
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