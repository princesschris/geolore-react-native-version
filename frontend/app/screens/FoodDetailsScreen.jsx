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
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';

// Bullet point ingredient item
const BulletItem = ({ text }) => (
  <View style={styles.bulletRow}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

// Major step — e.g. "1. Prepare the meat"
// With nested sub-steps numbered 1. 2. 3. underneath
const MajorStep = ({ index, title, substeps, note }) => (
  <View style={styles.majorStepWrapper}>
    {/* Major step title */}
    <Text style={styles.majorStepTitle}>{index}. {String(title ?? '')}</Text>

    {/* Sub-steps */}
    {Array.isArray(substeps) && substeps.map((sub, i) => (
      <View key={i} style={styles.subStepRow}>
        <Text style={styles.subStepNumber}>{i + 1}.</Text>
        <Text style={styles.subStepText}>{String(sub ?? '')}</Text>
      </View>
    ))}

    {/* Optional note in italics */}
    {note ? <Text style={styles.stepNote}>{note}</Text> : null}
  </View>
);

// Normalizes food data regardless of how steps are passed in —
// handles both { title, substeps } objects and plain strings
function normalizeFood(food) {
  if (!food) return null;
  const steps = (food.steps ?? []).map((step, i) => {
    if (typeof step === 'string') {
      return { title: step, substeps: [], note: null };
    }
    return {
      title: step.title ?? step.heading ?? `Step ${i + 1}`,
      substeps: step.substeps ?? step.sub ?? [],
      note: step.note ?? null,
    };
  });
  return { ...food, steps };
}

export default function FoodDetailScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('Home');

  const rawFood = route?.params?.food ?? {
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
      vegetables: ['Bitterleaf or Spinach / Ugu'],
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
        note: null,
      },
      {
        title: 'Fry the base',
        substeps: [
          'Heat palm oil in a pot.',
          'Add chopped onions and fry for about 1–2 minutes.',
          'Add the egusi paste in lumps and fry, stirring occasionally, for 5–8 minutes until it dries and starts to brown slightly.',
        ],
        note: null,
      },
      {
        title: 'Build the soup',
        substeps: [
          'Add the meat stock (from step 1) gradually to the fried egusi.',
          'Stir well and let it simmer on low-medium heat for 10 minutes.',
          'Add the cooked meat, stockfish, and dried fish.',
          'Stir in the ground crayfish and locust beans (if using).',
          'Season with more salt and seasoning cubes to taste.',
        ],
        note: null,
      },
      {
        title: 'Add vegetables',
        substeps: [
          'Wash and roughly chop your chosen vegetable (bitterleaf, spinach, or ugu).',
          'Stir into the soup.',
          "Cook for another 3–5 minutes (don't overcook the greens).",
        ],
        note: null,
      },
      {
        title: 'Final check',
        substeps: [
          'Taste and adjust seasoning.',
          'The soup should be thick and rich.',
          'Serve hot with pounded yam, fufu, eba, or any swallow of your choice.',
        ],
        note: null,
      },
    ],
  };

  const food = normalizeFood(rawFood);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      {/* Top Bar */}
      <View style={styles.topBar}>
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

      {/* Bunting Banner */}
      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>{food.name.toUpperCase()}</Text>

        {/* Emoji */}
        <Text style={styles.emoji}>{food.emoji}</Text>

        {/* Recipe Card */}
        <View style={styles.card}>

          {/* ── INGREDIENTS ── */}
          <Text style={styles.sectionTitle}>Ingredients</Text>

          <Text style={styles.subSectionLabel}>Main ingredients</Text>
          {food.ingredients.main.map((item, i) => (
            <BulletItem key={`main-${i}`} text={item} />
          ))}

          {food.ingredients.vegetables?.length > 0 && (
            <>
              <Text style={styles.subSectionLabel}>Vegetables</Text>
              {food.ingredients.vegetables.map((item, i) => (
                <BulletItem key={`veg-${i}`} text={item} />
              ))}
            </>
          )}

          {food.ingredients.optional?.length > 0 && (
            <>
              <Text style={styles.subSectionLabel}>Optional extras</Text>
              {food.ingredients.optional.map((item, i) => (
                <BulletItem key={`opt-${i}`} text={item} />
              ))}
            </>
          )}

          {/* ── STEPS ── */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
            Steps to Cook {food.name}
          </Text>

          {food.steps && food.steps.map((step, i) => (
            <MajorStep
              key={`step-${i}`}
              index={i + 1}
              title={step.title}
              substeps={step.substeps ?? []}
              note={step.note ?? null}
            />
          ))}
        </View>

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

      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
    alignItems: 'center',
  },
  title: {
    fontSize: 20, fontWeight: '800', color: '#3B1F00',
    textAlign: 'center', letterSpacing: 1.5, marginBottom: 8,
  },
  emoji: { fontSize: 56, marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F5C070',
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },

  // Section titles
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3B1F00',
    marginBottom: 8,
  },
  subSectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5C4A30',
    marginTop: 10,
    marginBottom: 4,
  },

  // Bullet ingredient items
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 3,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 12,
    color: '#5C4A30',
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    color: '#5C4A30',
    lineHeight: 20,
  },

  // Major step block
  majorStepWrapper: {
    marginBottom: 14,
  },
  majorStepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B1F00',
    marginBottom: 6,
  },

  // Sub-steps inside each major step
  subStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingLeft: 12,
    marginBottom: 4,
  },
  subStepNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5C4A30',
    lineHeight: 20,
    minWidth: 16,
  },
  subStepText: {
    flex: 1,
    fontSize: 12,
    color: '#5C4A30',
    lineHeight: 20,
  },

  // Optional note under a step
  stepNote: {
    fontSize: 11,
    color: '#A08060',
    fontStyle: 'italic',
    paddingLeft: 12,
    marginTop: 2,
  },

  // Back button
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
    marginTop: 4,
  },
  backButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});