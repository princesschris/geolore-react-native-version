import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';
import ImageCard from '../components/ImageCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export const FESTIVALS = [
  {
    id: '1',
    title: 'New Yam Festival',
    // imageSource: require('../../assets/images/new_yam_festival.png'),
    body: `The New Yam Festival (Iri Ji) is one of the most celebrated Igbo traditions. It marks the end of the farming season and the beginning of harvest time.\n\nBefore anyone eats from the new harvest, the first yams are offered to the gods and ancestors in thanksgiving. The festival is filled with music, masquerades, traditional dances, and feasting.\n\nYam is considered the "king of crops" in Igbo culture — a symbol of strength, prosperity, and identity.`,
  },
  {
    id: '2',
    title: 'Ofala Festival',
    // imageSource: require('../../assets/images/ofala_festival.png'),
    body: `The Ofala Festival is an annual royal celebration held by Igbo monarchs (Obis and Ezes) to mark their coronation anniversary and reaffirm their authority.\n\nDuring Ofala, the king emerges from seclusion in full regalia to greet his subjects. It is a time of pomp, pageantry, traditional dances, and cultural displays.\n\nThe festival strengthens the bond between the ruler and the community, and serves as a reminder of Igbo royal heritage.`,
  },
  {
    id: '3',
    title: 'New Yam Festival',
    // imageSource: require('../../assets/images/new_yam_festival_2.png'),
    body: `Communities across Igboland celebrate the New Yam Festival at different times, but the spirit remains the same — gratitude, unity, and cultural pride.\n\nElders lead prayers, masquerades perform, and families gather for feasting. It is one of the few times when the entire community comes together as one.`,
  },
  {
    id: '4',
    title: 'Ivo Ji Festival',
    // imageSource: require('../../assets/images/ivo_ji.png'),
    body: `The Ivo Ji Festival is a harvest celebration marking the end of the yam farming season in parts of Igboland. Communities gather to give thanks for a successful harvest.\n\nThe festival features traditional music, masquerade performances, and communal feasting. It reinforces values of hard work, gratitude, and communal solidarity.`,
  },
  {
    id: '5',
    title: 'Mmanwu Festival',
    // imageSource: require('../../assets/images/mmanwu_festival.png'),
    body: `The Mmanwu Festival celebrates the Igbo masquerade tradition. Masquerades representing ancestral spirits emerge to bless the community, entertain, and enforce cultural norms.\n\nEach masquerade has its own identity, costume, and purpose. Some are fierce enforcers, others are graceful dancers. Together they represent the living connection between the physical and spiritual worlds.`,
  },
  {
    id: '6',
    title: 'Ikaji Festival',
    // imageSource: require('../../assets/images/ikaji_festival.png'),
    body: `The Ikaji Festival is a cultural celebration that brings together communities for music, dance, and storytelling. It honours ancestors and celebrates the richness of Igbo heritage.\n\nYoung people are introduced to cultural values and traditions during the festival, ensuring the continuity of Igbo identity across generations.`,
  },
];

export default function FestivalsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filtered = FESTIVALS.filter((f) =>
    f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const displayed = showAll ? filtered : filtered.slice(0, 6);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>FESTIVALS</Text>

        {/* 2-column grid */}
        <View style={styles.grid}>
          {displayed.map((festival) => (
            <ImageCard
              key={festival.id}
              title={festival.title}
              imageSource={festival.imageSource}
              width={CARD_WIDTH}
              height={120}
              onPress={() => navigation?.navigate('FestivalDetail', { festival })}
            />
          ))}
        </View>

        {/* View More Button */}
        {!showAll && filtered.length > 6 && (
          <TouchableOpacity
            style={styles.viewMoreBtn}
            activeOpacity={0.8}
            onPress={() => setShowAll(true)}
          >
            <Text style={styles.viewMoreText}>View More</Text>
          </TouchableOpacity>
        )}

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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  viewMoreBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  viewMoreText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
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
  },
  backButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});