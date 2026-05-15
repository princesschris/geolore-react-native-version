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
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import FashionCard from '../components/FashionCard';

const OUTFITS = [
  {
    id: '1',
    title: 'Iru & Buba',
    description:
      'The Iru and Buba is a classic Yoruba attire consisting of a wrapper (Iru) tied around the waist and a loose blouse (Buba) worn on top. It is elegant, comfortable, and deeply rooted in Yoruba culture.',
    // imageSource: require('../../assets/images/iru_buba.png'),
  },
  {
    id: '2',
    title: 'Iru & Buba',
    description:
      'Often worn at celebrations, weddings, and cultural festivals, this outfit is adorned with beautiful patterns and rich Aso-oke fabric. The colours chosen carry deep cultural significance.',
    // imageSource: require('../../assets/images/iru_buba_2.png'),
  },
  {
    id: '3',
    title: 'Iru & Buba',
    description:
      'A timeless piece of Yoruba fashion heritage. The Buba can be styled in various ways — with a gele (head tie) and ipele (shoulder sash) for a complete traditional look.',
    // imageSource: require('../../assets/images/iru_buba_3.png'),
  },
];

export default function FashionScreen({ navigation }:any) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = OUTFITS.filter((o) =>
    o.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search" />
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="person-outline" size={20} color="#5C3A00" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <View>
            <Ionicons name="notifications-outline" size={20} color="#5C3A00" />
            <View style={styles.badge}><Text style={styles.badgeText}>5</Text></View>
          </View>
        </TouchableOpacity>
      </View>

      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>FASHION</Text>

        {filtered.map((outfit) => (
          <FashionCard
            key={outfit.id}
            title={outfit.title}
            description={outfit.description}
            imageSource={outfit.imageSource}
            onView={() => navigation?.navigate('FashionDetail', { outfit })}
          />
        ))}

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={16} color="#fff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 10,
  },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  badge: {
    position: 'absolute', top: -4, right: -6,
    backgroundColor: '#F5A623', borderRadius: 8,
    width: 16, height: 16, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3B1F00',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F5A623',
    paddingVertical: 12,
    borderRadius: 10,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginTop: 8,
  },
  backButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});