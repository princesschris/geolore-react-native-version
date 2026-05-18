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

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export const BELIEFS = [
  {
    id: '1',
    title: 'Chukwu is the Supreme God',
    color: '#F5A623',
    body: `In Igbo cosmology, Chukwu (meaning "Great Spirit" or "Great God") is the supreme deity and the source of all creation. Chukwu is considered omnipotent, omniscient, and the ultimate source of all life.\n\nChukwu is believed to be too great and distant for direct worship, so the Igbo people communicate with him through lesser deities (Arusi) and ancestral spirits. Everything that exists — both good and bad — is ultimately attributed to Chukwu's will.\n\nThe name "Chukwu" combines "Chi" (personal spirit/God) and "Ukwu" (great/big), literally meaning "the Great Chi" or "the Great God."`,
  },
  {
    id: '2',
    title: 'Lesser gods (Alusi/Arusi)',
    color: '#8B6F4E',
    body: `The Alusi (also called Arusi) are the lesser deities in Igbo religion who serve as intermediaries between Chukwu and humanity. Each Alusi has a specific domain — some govern rivers, land, harvest, war, or fertility.\n\nFamous Alusi include Amadioha (god of thunder and justice), Ana/Ala (earth goddess and moral authority), and Idemili (water deity). Shrines are built for these deities, and offerings are made to seek their favor and protection.\n\nThe Alusi can be benevolent or malevolent depending on whether they are properly honored and respected by the community.`,
  },
  {
    id: '3',
    title: 'Life after death',
    color: '#F5A623',
    body: `The Igbo believe in life after death and reincarnation. When a person dies, their spirit (Chi) continues to exist in the spirit world (Ala mmuo). Ancestors who lived good lives become protective spirits watching over their descendants.\n\nReincarnation is central to Igbo belief — souls are believed to return to the physical world, often within the same family. A newborn may be identified as the reincarnation of a recently deceased ancestor through physical resemblances or behavioral similarities.\n\nProper burial rites are essential to ensure the deceased's spirit transitions peacefully to the spirit world and eventually reincarnates.`,
  },
  {
    id: '4',
    title: 'Ancestor worship (Ndichie)',
    color: '#8B6F4E',
    body: `The Ndichie are the revered ancestors in Igbo culture. They are believed to exist in the spirit world while maintaining a close connection to the living. Ancestors are consulted in important matters and are believed to influence the fortune of their descendants.\n\nLibations (pouring of palm wine or water on the ground) are offered to ancestors during ceremonies and important occasions. Ancestors are invoked during the breaking of kola nut and other rituals.\n\nBad conduct or neglect of ancestors can result in misfortune, while honoring them brings blessings and prosperity to the family.`,
  },
  {
    id: '5',
    title: 'Chi (personal god)',
    color: '#F5A623',
    body: `Every Igbo individual has a personal Chi — a personal spirit or guardian deity assigned at birth. The Chi is considered a person's alter ego in the spirit world, responsible for their destiny and fortune.\n\nThe Igbo saying "Onye kwe, Chi ya ekwe" (When a person agrees, their Chi agrees) reflects the belief that personal effort and determination align with one's Chi to achieve destiny.\n\nA person's Chi can be strong or weak, which explains why some people seem naturally fortunate while others struggle. Rituals and good conduct can strengthen one's relationship with their Chi.`,
  },
  {
    id: '6',
    title: 'Reincarnation (Ilo uwa)',
    color: '#8B6F4E',
    body: `"Ilo uwa" literally means "returning to the world" in Igbo. It is the belief that souls are recycled through multiple lifetimes, typically within the same family lineage.\n\nA child showing unusual traits, birthmarks similar to a deceased relative, or speaking of past life memories may be identified as a reincarnated ancestor. Divination is sometimes used to confirm this identification.\n\nReincarnation gives meaning to death in Igbo culture — it is not an end but a transition. Living a good life ensures a favorable reincarnation, while evil deeds may result in a difficult next life.`,
  },
  {
    id: '7',
    title: 'Good moral conduct (Omenala)',
    color: '#F5A623',
    body: `Omenala (also Omenani) refers to the customs, traditions, and moral code of the Igbo people. It encompasses the laws, taboos, and ethical standards that govern behavior within the community.\n\nOmenala is considered sacred and is believed to have been instituted by the earth goddess Ala. Violations of Omenala — such as murder, theft, adultery, or disrespect for elders — are considered offenses against the gods and the community.\n\nThe community enforces Omenala through social pressure, fines, ostracism, or spiritual consequences. Living by Omenala ensures harmony between humans, nature, and the spirit world.`,
  },
  {
    id: '8',
    title: 'Sacrifices and offerings',
    color: '#8B6F4E',
    body: `Sacrifices and offerings are central to Igbo spiritual practice. They serve as a means of communicating with Chukwu, the Alusi, and ancestors — expressing gratitude, seeking favor, or appeasing offended spirits.\n\nCommon offerings include kola nuts, palm wine, food, animals (goats, chickens), and in ancient times, human sacrifice (now abolished). Each deity has preferred offerings.\n\nOfferings are typically presented at shrines, during festivals, or at significant life events such as births, marriages, and deaths. The act of offering acknowledges the power of the spiritual world and humanity's dependence on it.`,
  },
  {
    id: '9',
    title: 'Taboos (Nso Ala)',
    color: '#F5A623',
    body: `Nso Ala refers to taboos — actions considered abominations against the earth goddess Ala and the community. Committing Nso Ala brings spiritual pollution and misfortune not just to the individual but to the entire community.\n\nExamples of Nso Ala include suicide, killing of certain animals, certain sexual acts, desecration of sacred places, and particular crimes against community members.\n\nWhen Nso Ala is committed, elaborate purification rituals must be performed to cleanse the land and restore balance. Failure to perform these rituals was believed to result in communal disasters like drought, disease, or defeat in war.`,
  },
  {
    id: '10',
    title: 'Spirits (Mmuo)',
    color: '#8B6F4E',
    body: `Mmuo refers to spirits in Igbo belief. These include the spirits of ancestors, nature spirits, and other supernatural beings. The spirit world (Ala mmuo) is believed to exist parallel to the physical world.\n\nMasquerades (Mmanwu) are physical representations of ancestral spirits visiting the land of the living. They appear during festivals, funerals, and important ceremonies.\n\nSpirits can be benevolent (ancestral protectors) or malevolent (evil spirits causing illness and misfortune). Diviners (Dibia) are specialists who can communicate with spirits, diagnose spiritual problems, and prescribe remedies.`,
  },
];

const BeliefCard = ({ title, color, onPress }) => (
  <TouchableOpacity
    style={[styles.card, { backgroundColor: color }]}
    activeOpacity={0.85}
    onPress={onPress}
  >
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);

export default function BeliefsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filtered = BELIEFS.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const displayed = showAll ? filtered : filtered.slice(0, 10);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>BELIEFS</Text>

        <View style={styles.grid}>
          {displayed.map((belief) => (
            <BeliefCard
              key={belief.id}
              title={belief.title}
              color={belief.color}
              onPress={() => navigation?.navigate('BeliefDetail', { belief })}
            />
          ))}
        </View>

        {!showAll && filtered.length > 10 && (
          <TouchableOpacity
            style={styles.viewMoreBtn}
            activeOpacity={0.8}
            onPress={() => setShowAll(true)}
          >
            <Text style={styles.viewMoreText}>View More</Text>
          </TouchableOpacity>
        )}

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
  card: {
    width: CARD_WIDTH,
    borderRadius: 14,
    padding: 16,
    minHeight: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 18,
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