import React from 'react';
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
import TopBar from '../components/TopBar';

// Bullet ingredient item
const BulletItem = ({ text }: { text: string }) => (
  <View style={styles.bulletRow}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

// Major step with nested sub-steps
const MajorStep = ({
  index,
  title,
  substeps,
  note,
}: {
  index: number;
  title: string;
  substeps: string[];
  note?: string | null;
}) => (
  <View style={styles.majorStepWrapper}>
    <Text style={styles.majorStepTitle}>{index}. {title}</Text>
    {substeps.map((sub, i) => (
      <View key={i} style={styles.subStepRow}>
        <Text style={styles.subStepNumber}>{i + 1}.</Text>
        <Text style={styles.subStepText}>{sub}</Text>
      </View>
    ))}
    {note ? <Text style={styles.stepNote}>{note}</Text> : null}
  </View>
);

// Normalises steps — handles both plain strings and { title, substeps } objects
function normalizeSteps(steps: any[]): Array<{ title: string; substeps: string[]; note: string | null }> {
  return (steps ?? []).map((step, i) => {
    if (typeof step === 'string') {
      return { title: step, substeps: [], note: null };
    }
    return {
      title: step.title ?? step.heading ?? `Step ${i + 1}`,
      substeps: step.substeps ?? step.sub ?? [],
      note: step.note ?? null,
    };
  });
}

export default function FoodDetailsScreen({ navigation, route }: any) {
  const food = route?.params?.food;

  // Guard — if no food was passed, go back
  if (!food) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <TopBar showSearch={false} />
        <View style={styles.centeredState}>
          <Ionicons name="alert-circle-outline" size={48} color="#C4A882" />
          <Text style={styles.stateText}>No food item found</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => navigation?.goBack()}>
            <Text style={styles.retryBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
        <BottomTabBar />
      </SafeAreaView>
    );
  }

  const steps = normalizeSteps(food.steps ?? []);
  const ingredients = food.ingredients ?? { main: [], vegetables: [], optional: [] };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar showSearch={false} />
      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>{food.name.toUpperCase()}</Text>

        {/* Emoji or icon */}
        {food.emoji
          ? <Text style={styles.emoji}>{food.emoji}</Text>
          : <Ionicons name="restaurant-outline" size={56} color="#F5A623" style={styles.iconEmoji} />
        }

        {/* Recipe Card */}
        <View style={styles.card}>

          {/* INGREDIENTS */}
          <Text style={styles.sectionTitle}>Ingredients</Text>

          {ingredients.main?.length > 0 && (
            <>
              <Text style={styles.subSectionLabel}>Main ingredients</Text>
              {ingredients.main.map((item: string, i: number) => (
                <BulletItem key={`main-${i}`} text={item} />
              ))}
            </>
          )}

          {ingredients.vegetables?.length > 0 && (
            <>
              <Text style={styles.subSectionLabel}>Vegetables</Text>
              {ingredients.vegetables.map((item: string, i: number) => (
                <BulletItem key={`veg-${i}`} text={item} />
              ))}
            </>
          )}

          {ingredients.optional?.length > 0 && (
            <>
              <Text style={styles.subSectionLabel}>Optional extras</Text>
              {ingredients.optional.map((item: string, i: number) => (
                <BulletItem key={`opt-${i}`} text={item} />
              ))}
            </>
          )}

          {/* STEPS */}
          {steps.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                Steps to Cook {food.name}
              </Text>
              {steps.map((step, i) => (
                <MajorStep
                  key={`step-${i}`}
                  index={i + 1}
                  title={step.title}
                  substeps={step.substeps}
                  note={step.note}
                />
              ))}
            </>
          )}
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

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  scrollContent: {
    paddingHorizontal: 16, paddingTop: 8,
    paddingBottom: 32, alignItems: 'center',
  },
  title: {
    fontSize: 20, fontWeight: '800', color: '#3B1F00',
    textAlign: 'center', letterSpacing: 1.5, marginBottom: 8,
  },
  emoji: { fontSize: 56, marginBottom: 16 },
  iconEmoji: { marginBottom: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, borderWidth: 1.5,
    borderColor: '#F5C070', padding: 16, width: '100%', marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16, fontWeight: '800', color: '#3B1F00', marginBottom: 8,
  },
  subSectionLabel: {
    fontSize: 12, fontWeight: '600', color: '#5C4A30', marginTop: 10, marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: 6, marginBottom: 3, paddingLeft: 8,
  },
  bullet: { fontSize: 12, color: '#5C4A30', lineHeight: 20 },
  bulletText: { flex: 1, fontSize: 12, color: '#5C4A30', lineHeight: 20 },
  majorStepWrapper: { marginBottom: 14 },
  majorStepTitle: {
    fontSize: 13, fontWeight: '700', color: '#3B1F00', marginBottom: 6,
  },
  subStepRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: 6, paddingLeft: 12, marginBottom: 4,
  },
  subStepNumber: {
    fontSize: 12, fontWeight: '600', color: '#5C4A30', lineHeight: 20, minWidth: 16,
  },
  subStepText: { flex: 1, fontSize: 12, color: '#5C4A30', lineHeight: 20 },
  stepNote: {
    fontSize: 11, color: '#A08060', fontStyle: 'italic', paddingLeft: 12, marginTop: 2,
  },
  centeredState: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 48,
  },
  stateText: { fontSize: 14, color: '#A08060', fontWeight: '500' },
  retryBtn: {
    backgroundColor: '#F5A623', paddingVertical: 10, paddingHorizontal: 28, borderRadius: 10,
  },
  retryBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  backButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: '#F5A623', paddingVertical: 12,
    borderRadius: 10, paddingHorizontal: 32, alignSelf: 'center', marginTop: 4,
  },
  backButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});