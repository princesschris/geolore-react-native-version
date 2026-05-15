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
import CategoryCard from '../components/CategoryCard';
import BottomTabBar from '../components/BottomTabBar';
import TopBar from '../components/TopBar';

// Culture categories shown on this screen
const CULTURE_CATEGORIES = [
  {
    key: 'history',
    title: 'History',
    screen: 'History',
    // imageSource: require('../assets/history.png'),
  },
  {
    key: 'language',
    title: 'Language',
    screen: 'Language',
    // imageSource: require('../assets/language.png'),
  },
  {
    key: 'food',
    title: 'Food',
    screen: 'Food',
    // imageSource: require('../assets/food.png'),
  },
  {
    key: 'cultures',
    title: 'Traditions',
    screen: 'Traditions',
    // imageSource: require('../assets/cultures.png'),
  },
  {
    key: 'fashion',
    title: 'Fashion',
    screen: 'Fashion',
    // imageSource: require('../assets/fashion.png'),
  },
  {
    key: 'festivals',
    title: 'Festivals',
    screen: 'Festivals',
    // imageSource: require('../assets/festivals.png'),
  },
  {
    key: 'beliefs',
    title: 'Beliefs',
    screen: 'Beliefs',
    // imageSource: require('../assets/beliefs.png'),
  },
  {
    key: 'stories',
    title: 'Stories',
    screen: 'Stories',
    // imageSource: require('../assets/stories.png'),
  },
];

export default function YourCultureScreen({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  

  // Culture name and flag can be passed via route params from WhereAreYouFrom
  // e.g. navigation.navigate('YourCulture', { culture: 'IGBO', flag: '🇳🇬' })
  const cultureName = route?.params?.culture ?? 'IGBO';
  const cultureFlag = route?.params?.flag ?? '🇳🇬';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      {/* Top Bar */}
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
    

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
            centered
            onDiscover={() => navigation?.navigate(cat.screen)}
          />
        ))}
      </ScrollView>

      {/* Bottom Tab Bar */}
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