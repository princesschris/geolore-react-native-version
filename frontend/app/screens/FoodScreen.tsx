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

// Steps use a nested structure:
// { title: 'Major step title', substeps: ['sub step 1', 'sub step 2'], note: 'optional note' }
// OR a simple string for a plain numbered step

export const FOODS = [
  {
    id: '1',
    name: 'Egusi Soup',
    emoji: '🍲',
    ingredients: {
      main: [
        'Egusi (about 1 cup)',
        'Palm oil (½ cup)',
        'Assorted meat (beef, goat meat, or chicken)',
        'Stockfish (optional but common)',
        'Dried fish',
        'Onion (1 medium)',
        'Pepper (fresh or ground)',
        'Ground crayfish (2–3 tablespoons)',
        'Seasoning cubes',
        'Salt',
      ],
      vegetables: ['Bitterleaf or', 'Spinach / Ugu'],
      optional: ['Locust beans (Iru)', 'Ground pepper mix for extra spice'],
    },
    steps: [
      {
        title: 'Prepare the meat',
        substeps: [
          'Wash the meat and place it in a pot.',
          'Add chopped onions, seasoning cubes, salt, and pepper.',
          'Add a little water and boil until the meat becomes tender.',
        ],
        note: '(This also creates your meat stock.)',
      },
      {
        title: 'Prepare the egusi paste',
        substeps: [
          'Put the egusi (ground melon seeds) in a bowl.',
          'Add a small amount of water.',
          'Mix until it forms a thick paste.',
        ],
      },
      {
        title: 'Fry the base',
        substeps: [
          'Heat palm oil in a pot.',
          'Add chopped onions and fry for about 1–2 minutes.',
          'Add the egusi paste and stir continuously.',
          'Fry for about 10–15 minutes, stirring to prevent burning.',
        ],
      },
      {
        title: 'Add the protein',
        substeps: [
          'Add the cooked meat, stockfish, and dried fish into the pot.',
          'Pour in the meat stock gradually and stir.',
          'Add ground crayfish and pepper.',
          'Let it simmer on low heat for 10 minutes.',
        ],
      },
      {
        title: 'Add vegetables and finish',
        substeps: [
          'Wash and chop your vegetables (bitterleaf or spinach/ugu).',
          'Add the vegetables to the pot.',
          'Stir and cook for another 3–5 minutes.',
          'Taste and adjust salt and seasoning.',
          'Serve hot with eba, pounded yam, or fufu.',
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'White Soup',
    emoji: '🥣',
    ingredients: {
      main: [
        'Assorted meat (goat meat, tripe, or chicken)',
        'Uziza leaves (handful)',
        'Cocoyam (for thickening)',
        'Crayfish (2 tablespoons)',
        'Onion (1 medium)',
        'Seasoning cubes',
        'Salt to taste',
        'Pepper (to taste)',
      ],
      vegetables: ['Uziza leaves'],
      optional: ['Dried fish', 'Stockfish'],
    },
    steps: [
      {
        title: 'Cook the meat',
        substeps: [
          'Season meat with onions, seasoning cubes, and salt.',
          'Boil until tender and set aside with the stock.',
        ],
      },
      {
        title: 'Prepare cocoyam thickener',
        substeps: [
          'Boil cocoyam until very soft.',
          'Pound in a mortar until smooth with no lumps.',
          'Mold into small balls.',
        ],
      },
      {
        title: 'Build the soup',
        substeps: [
          'Bring the meat stock to a boil.',
          'Drop in cocoyam balls one at a time.',
          'Stir until the soup thickens to your liking.',
          'Add crayfish, pepper, and dried fish.',
          'Simmer for 10 minutes.',
        ],
      },
      {
        title: 'Finish with vegetables',
        substeps: [
          'Add washed uziza leaves.',
          'Stir and cook for 2–3 more minutes.',
          'Adjust seasoning and serve hot.',
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Yam Pepper Soup',
    emoji: '🍠',
    ingredients: {
      main: [
        'Yam (half tuber, peeled and cubed)',
        'Assorted meat or fish',
        'Pepper soup spice mix',
        'Crayfish (1 tablespoon)',
        'Onion (1 medium)',
        'Seasoning cubes',
        'Salt to taste',
      ],
      vegetables: ['Uziza leaves', 'Scent leaves (optional)'],
      optional: ['Catfish (point and kill)'],
    },
    steps: [
      {
        title: 'Cook the protein',
        substeps: [
          'Season meat or fish with onions, seasoning, and salt.',
          'Boil until cooked through.',
        ],
      },
      {
        title: 'Add yam and spices',
        substeps: [
          'Add cubed yam to the pot.',
          'Add pepper soup spice mix and crayfish.',
          'Add water as needed to cover everything.',
        ],
      },
      {
        title: 'Simmer and finish',
        substeps: [
          'Cook until yam is soft (about 15–20 minutes).',
          'Add uziza leaves and stir.',
          'Simmer for 3 more minutes.',
          'Adjust salt and serve hot.',
        ],
      },
    ],
  },
];

// Food Card Component
const FoodCard = ({ name, emoji, onTryIt }) => (
  <View style={styles.foodCard}>
    <Text style={styles.foodEmoji}>{emoji}</Text>
    <Text style={styles.foodName}>{name}</Text>
    <TouchableOpacity style={styles.tryItBtn} activeOpacity={0.8} onPress={onTryIt}>
      <Text style={styles.tryItText}>TRY IT</Text>
    </TouchableOpacity>
  </View>
);

export default function FoodScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  

  const filteredFoods = FOODS.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>FOOD</Text>

        {filteredFoods.map((food) => (
          <FoodCard
            key={food.id}
            name={food.name}
            emoji={food.emoji}
            onTryIt={() => navigation?.navigate('FoodDetails', { food })}
          />
        ))}

        <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={() => navigation?.goBack()}>
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
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10, gap: 10,
  },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  badge: {
    position: 'absolute', top: -4, right: -6, backgroundColor: '#F5A623',
    borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },
  title: {
    fontSize: 20, fontWeight: '800', color: '#3B1F00',
    textAlign: 'center', letterSpacing: 1.5, marginBottom: 20,
  },
  foodCard: {
    backgroundColor: '#fff', borderRadius: 16, borderWidth: 1.5,
    borderColor: '#F5A623', paddingVertical: 20, paddingHorizontal: 16,
    alignItems: 'center', marginBottom: 14, gap: 8,
  },
  foodEmoji: { fontSize: 48, marginBottom: 4 },
  foodName: { fontSize: 18, fontWeight: '800', color: '#3B1F00', textAlign: 'center' },
  tryItBtn: {
    backgroundColor: '#F5A623', paddingVertical: 9,
    paddingHorizontal: 36, borderRadius: 20, marginTop: 4,
  },
  tryItText: { color: '#fff', fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  backButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: '#F5A623', paddingVertical: 12,
    borderRadius: 10, paddingHorizontal: 32, alignSelf: 'center', marginTop: 8,
  },
  backButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});