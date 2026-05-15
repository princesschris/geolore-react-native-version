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
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';
import { Ionicons } from '@expo/vector-icons';
import ImageCard from '../components/ImageCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

export const TRADITIONS = [
  {
    id: '1',
    title: 'Kolanut Presentation',
    // imageSource: require('../assets/traditions/kolanut.png'),
    body: `The Kolanut presentation is a deeply revered tradition among the Igbo people of Nigeria. The kolanut (oji) is more than just a nut — it is a sacred symbol of life, hospitality, and connection between the living and the ancestors.\n\nWhen a guest arrives, the host presents a kolanut as a gesture of welcome and respect. The eldest man in the room is given the honor of praying over and breaking the kola. The prayer, known as "igo oji", calls on the gods and ancestors to bless those present.\n\nThe kola is then broken and shared among those gathered, with each piece symbolizing unity, peace, and goodwill. No important ceremony — be it marriage, title-taking, or community meeting — begins without the presentation of the kolanut.\n\nIt is said among the Igbo: "Onye wetara oji wetara ndụ" — He who brings kola brings life.`,
  },
  {
    id: '2',
    title: 'Title Taking',
    // imageSource: require('../assets/traditions/title.png'),
    body: `Title taking is one of the most prestigious traditions in Igbo culture. It represents a recognition of a person's achievements, wealth, character, and contribution to the community.\n\nCommon titles include Ozo, Nze, Eze (king/chief), and Lolo (for women). Each title comes with specific rights, responsibilities, and regalia. The process involves elaborate ceremonies, feasting, dancing, and formal acceptance by the community.\n\nTitle holders are expected to be role models — generous, just, and wise. They serve as advisors, mediators, and custodians of tradition.`,
  },
  {
    id: '3',
    title: 'New Yam Festival',
    // imageSource: require('../assets/traditions/newyam.png'),
    body: `The New Yam Festival (Iri Ji) is one of the most celebrated Igbo traditions. It marks the end of the farming season and the beginning of harvest time.\n\nBefore anyone eats from the new harvest, the first yams are offered to the gods and ancestors in thanksgiving. The festival is filled with music, masquerades, traditional dances, and feasting. It brings families and communities together in a spirit of gratitude and joy.\n\nYam is considered the "king of crops" in Igbo culture — a symbol of strength, prosperity, and identity.`,
  },
  {
    id: '4',
    title: 'Age Grade System',
    // imageSource: require('../assets/traditions/agegrade.png'),
    body: `The Age Grade System (Otu Ogbo) is a social structure in Igbo communities where people born within the same period are grouped together and given communal responsibilities.\n\nAge grades are responsible for maintaining public order, community service, and enforcing decisions. They organize festivals, clean the village, and support their members in times of need.\n\nAs members grow older, they take on more senior roles. The system fosters unity, discipline, and a sense of belonging across generations.`,
  },
  {
    id: '5',
    title: 'Igbo Nkwu',
    // imageSource: require('../assets/traditions/igbonkwu.png'),
    body: `Igbo Nkwu (Traditional Wine Carrying) is the traditional Igbo marriage ceremony. It is the most culturally significant part of an Igbo wedding.\n\nThe bride carries a cup of palm wine through the crowd of guests and walks toward her groom to present it to him. This act symbolizes her choice and acceptance of him as her husband.\n\nThe ceremony is vibrant, colourful, and deeply rooted in tradition — with families gathering, gifts exchanged, and blessings given by elders.`,
  },
  {
    id: '6',
    title: 'Mmanwu',
    // imageSource: require('../assets/traditions/mmanwu.png'),
    body: `Mmanwu (Masquerade) is a sacred tradition in Igbo culture representing the spirits of ancestors returning to the land of the living.\n\nMasquerades appear during festivals, funerals, and important ceremonies. They are adorned in elaborate costumes and perform dances with spiritual significance. The identity of the masquerade performer is kept secret — it is believed to truly be a spirit.\n\nThey serve as enforcers of law, entertainers, and spiritual intermediaries. Mmanwu is a cornerstone of Igbo spiritual and cultural identity.`,
  },
];

export default function TraditionsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filtered = TRADITIONS.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const displayed = showAll ? filtered : filtered.slice(0, 6);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      {/* Top Bar */}
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
         

      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>TRADITIONS</Text>

        {/* 2-column grid */}
        <View style={styles.grid}>
          {displayed.map((tradition) => (
            <ImageCard
              key={tradition.id}
              title={tradition.title}
              imageSource={tradition.imageSource}
              width={CARD_WIDTH}
              height={120}
              onPress={() => navigation?.navigate('TraditionDetailsScreen', { tradition })}
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
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' ,
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
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