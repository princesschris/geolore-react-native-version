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
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import BottomTabBar from '../components/BottomTabBar';

// Culture categories shown on this screen
const CULTURE_CATEGORIES = [
  {
    key: 'history',
    title: 'History',
    screen: 'History',
    imageLeft: false,
    // imageSource: require('../assets/history.png'),
  },
  {
    key: 'language',
    title: 'Language',
    screen: 'Language',
    imageLeft: false,
    // imageSource: require('../assets/language.png'),
  },
  {
    key: 'food',
    title: 'Food',
    screen: 'Food',
    imageLeft: false,
    // imageSource: require('../assets/food.png'),
  },
  {
    key: 'cultures',
    title: 'Cultures',
    screen: 'Cultures',
    imageLeft: false,
    // imageSource: require('../assets/cultures.png'),
  },
];

export default function YourCultureScreen({ navigation, route }:any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Home');

  // Culture name and flag can be passed via route params from WhereAreYouFrom
  // e.g. navigation.navigate('YourCulture', { culture: 'IGBO', flag: '🇳🇬' })
  const cultureName = route?.params?.culture ?? 'IGBO';
  const cultureFlag = route?.params?.flag ?? '🇳🇬';

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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Culture Title + Flag */}
        <View style={styles.cultureHeader}>
          <Text style={styles.cultureName}>{cultureName}</Text>
          <Text style={styles.cultureFlag}>{cultureFlag}</Text>
        </View>

        {/* Category Cards */}
        {CULTURE_CATEGORIES.map((cat) => (
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
    paddingTop: 20,
    paddingBottom: 10,
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
  cultureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
    marginTop: 8,
  },
  cultureName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3B1F00',
    letterSpacing: 1,
  },
  cultureFlag: {
    fontSize: 28,
  },
});