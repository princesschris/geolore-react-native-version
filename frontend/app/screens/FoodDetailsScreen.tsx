import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';

const BulletItem = ({ text }: { text: string }) => (
  <View style={styles.bulletRow}>
    <View style={styles.bulletDot} />
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

export default function FoodDetailsScreen({ navigation, route }: any) {
  const food = route?.params?.food;

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

  // Both are plain string[] from Supabase
  const ingredients: string[] = Array.isArray(food.ingredients) ? food.ingredients : [];
  const steps:       string[] = Array.isArray(food.steps)       ? food.steps       : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar showSearch={false} />
      <BuntingBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Title */}
        <Text style={styles.title}>{food.name.toUpperCase()}</Text>

        {/* Native name */}
        {food.native_name ? (
          <Text style={styles.nativeName}>{food.native_name}</Text>
        ) : null}

        {/* Category badge */}
        {food.category ? (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{food.category}</Text>
          </View>
        ) : null}

        {/* Icon */}
        <Ionicons name="restaurant-outline" size={56} color="#F5A623" style={styles.icon} />

        <View style={styles.card}>

          {/* ── INGREDIENTS ── */}
          {ingredients.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              {ingredients.map((item, i) => (
                <BulletItem key={`ing-${i}`} text={item} />
              ))}
            </>
          ) : (
            <Text style={styles.emptyText}>No ingredients listed.</Text>
          )}

          {/* ── STEPS ── */}
          {steps.length > 0 ? (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                How to prepare {food.name}
              </Text>
              {steps.map((step, i) => (
                <View key={`step-${i}`} style={styles.stepRow}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </>
          ) : null}
        </View>

        {/* Back */}
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
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '800', color: '#3B1F00', textAlign: 'center', letterSpacing: 1.5, marginBottom: 4 },
  nativeName: { fontSize: 14, color: '#A08060', fontStyle: 'italic', textAlign: 'center', marginBottom: 8 },
  categoryBadge: { backgroundColor: '#FFF3E0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 4, borderWidth: 1, borderColor: '#F5C070', marginBottom: 12 },
  categoryText: { fontSize: 12, fontWeight: '700', color: '#5C3A00' },
  icon: { marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1.5, borderColor: '#F5C070', padding: 16, width: '100%', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#3B1F00', marginBottom: 12 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6, paddingLeft: 4 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F5A623', marginTop: 7, flexShrink: 0 },
  bulletText: { flex: 1, fontSize: 13, color: '#5C4A30', lineHeight: 20 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10, paddingLeft: 4 },
  stepNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#F5A623', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  stepNumberText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  stepText: { flex: 1, fontSize: 13, color: '#5C4A30', lineHeight: 20 },
  emptyText: { fontSize: 13, color: '#A08060', fontStyle: 'italic' },
  centeredState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 48 },
  stateText: { fontSize: 14, color: '#A08060', fontWeight: '500' },
  retryBtn: { backgroundColor: '#F5A623', paddingVertical: 10, paddingHorizontal: 28, borderRadius: 10 },
  retryBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  backButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F5A623', paddingVertical: 12, borderRadius: 10, paddingHorizontal: 32, alignSelf: 'center', marginTop: 4 },
  backButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});