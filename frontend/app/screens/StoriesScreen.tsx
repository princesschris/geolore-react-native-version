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

export const STORIES = [
  {
    id: '1',
    title: 'Life after death',
    color: '#F5A623',
    body: `Long ago in Igboland, there lived a wise elder named Okafor who was loved by all. When Okafor fell gravely ill, he called his children together and told them not to mourn.\n\n"I am going on a journey," he said, "but I will return. Watch for me in the eyes of your firstborn."\n\nMonths after Okafor passed, his daughter gave birth to a son. The boy was born with the same birthmark on his left shoulder that Okafor had carried his entire life. The child also knew the hiding place of Okafor's staff — a place only the old man had known.\n\nThe family rejoiced. Okafor had kept his promise. He had returned to walk among them once more, and the cycle of life continued as it always had.`,
  },
  {
    id: '2',
    title: 'The tortoise and the birds',
    color: '#8B6F4E',
    body: `Once upon a time, the birds of the sky were invited to a great feast in the heavens. The tortoise, famous for his cunning, convinced the birds to each give him one feather so he could join them.\n\nWith his borrowed feathers, the tortoise flew to the feast. He told the birds that in heaven, everyone takes a new name. He named himself "All of you." When the food arrived and the hosts said "This feast is for all of you," the tortoise ate everything.\n\nThe birds, furious at being tricked, took back their feathers. The tortoise fell and his shell cracked into many pieces. A kind medicine man put it back together — which is why the tortoise's shell has many lines to this day.`,
  },
  {
    id: '3',
    title: 'Why the sun and moon live in the sky',
    color: '#F5A623',
    body: `Long ago, the sun and water were great friends and both lived on earth. The sun often visited the water, but the water never came to visit the sun.\n\nThe water explained that his people — the fish, turtles, and sea creatures — were too many for the sun's home. So the sun built a bigger house. Still it was not enough.\n\nFinally the water came, and rose higher and higher until the sun and moon were forced to climb into the sky.\n\nAnd that is why the sun and moon have lived in the sky ever since.`,
  },
  {
    id: '4',
    title: 'The king who could not lie',
    color: '#8B6F4E',
    body: `There was once a great king who vowed before Chukwu never to speak a lie. When an enemy army surrounded his kingdom and demanded to know where his weapons were hidden, the king stayed silent.\n\nChukwu, seeing his faithfulness, sent a great storm that scattered the enemy army. They fled and never returned.\n\nFrom that day, honesty became the most prized virtue in that kingdom — for they had seen that truth had the power to call upon the gods.`,
  },
  {
    id: '5',
    title: 'The woman who outsmarted death',
    color: '#F5A623',
    body: `Death came to a village and began taking the young men one by one. Then Death came for Adaeze, the most clever woman in the land.\n\n"Let me say goodbye to my grandmother first," she said. While Death waited, her grandmother offered to take her place — confusing Death, for no one had ever volunteered before.\n\nWhile Death pondered, Adaeze ran to the shrine of Ala, the earth goddess, who granted her protection. Death was bound by divine law never to take her before her time.`,
  },
  {
    id: '6',
    title: 'How the leopard got its spots',
    color: '#8B6F4E',
    body: `In the beginning, the leopard had no spots — just a smooth golden coat he was very proud of.\n\nOne dry season, a great fire swept the forest. The leopard leapt through the burning grass, and sparks landed on his coat leaving dark marks wherever they touched.\n\nChukwu spoke to the weeping leopard: "Those marks are not scars — they are medals. Every spot is a story of your strength."\n\nFrom that day warriors of Igboland painted leopard spots on their bodies before battle — for strength, survival, and beauty earned through fire.`,
  },
];

const StoryCard = ({ title, color, onPress }) => (
  <TouchableOpacity
    style={[styles.card, { backgroundColor: color }]}
    activeOpacity={0.85}
    onPress={onPress}
  >
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);

export default function StoriesScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filtered = STORIES.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Text style={styles.title}>STORIES</Text>

        <View style={styles.grid}>
          {displayed.map((story) => (
            <StoryCard
              key={story.id}
              title={story.title}
              color={story.color}
              onPress={() => navigation?.navigate('StoryDetail', { story })}
            />
          ))}
        </View>

        {!showAll && filtered.length > 6 && (
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