import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import FashionCard from '../components/FashionCard';
import TopBar from '../components/TopBar';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

type FashionOutfit = {
  id:                    string;
  culture:               string;
  title:                 string;
  subtitle?:             string;
  content:               string;
  fashion_description?:  string;
  fashion_materials?:    string;
  fashion_worn_by?:      string;
  fashion_occasions?:    string;
  fashion_significance?: string;
  fashion_modern_usage?: string;
};

export default function FashionScreen({ navigation }: any) {
  const { user } = useAuth();
  const [outfits, setOutfits]     = useState<FashionOutfit[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const tribe = user?.tribe
    ? user.tribe.charAt(0).toUpperCase() + user.tribe.slice(1).toLowerCase()
    : 'Igbo';

  useEffect(() => { fetchOutfits(); }, [tribe]);

  const fetchOutfits = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from('culture_content')
        .select('id, culture, title, subtitle, content, fashion_description, fashion_materials, fashion_worn_by, fashion_occasions, fashion_significance, fashion_modern_usage')
        .eq('category', 'fashion')
        .ilike('culture', tribe)
        .order('sort_order', { ascending: true });
      if (supabaseError) throw supabaseError;
      setOutfits(data ?? []);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load fashion items');
    } finally {
      setLoading(false);
    }
  };

  const filtered = outfits.filter((o) =>
    o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.subtitle ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by subtitle — items without a subtitle are excluded entirely
  const grouped: { category: string; items: FashionOutfit[] }[] = [];
  for (const outfit of filtered) {
    if (!outfit.subtitle) continue;
    const existing = grouped.find((g) => g.category === outfit.subtitle);
    if (existing) existing.items.push(outfit);
    else grouped.push({ category: outfit.subtitle, items: [outfit] });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>FASHION</Text>

        {loading && (
          <View style={styles.centeredState}>
            <ActivityIndicator size="large" color="#F5A623" />
            <Text style={styles.stateText}>Loading {tribe} fashion...</Text>
          </View>
        )}

        {!loading && error && (
          <View style={styles.centeredState}>
            <Ionicons name="alert-circle-outline" size={48} color="#C4A882" />
            <Text style={styles.stateText}>Could not load fashion items</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchOutfits}>
              <Text style={styles.retryBtnText}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && grouped.length === 0 && (
          <View style={styles.centeredState}>
            <Ionicons name="shirt-outline" size={48} color="#C4A882" />
            <Text style={styles.stateText}>No fashion items found for {tribe}</Text>
          </View>
        )}

        {!loading && !error && grouped.map(({ category, items }) => (
          <View key={category} style={styles.group}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupTitle}>{category.toUpperCase()}</Text>
              <View style={styles.groupDivider} />
            </View>
            {items.map((outfit) => (
              <FashionCard
                key={outfit.id}
                title={outfit.title}
                description={outfit.content}
                imageSource={undefined}
                onView={() => navigation?.navigate('FashionDetail', { outfit })}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },
  title: {
    fontSize: 20, fontWeight: '800', color: '#3B1F00',
    textAlign: 'center', letterSpacing: 1.5, marginBottom: 20,
  },
  group: { marginBottom: 8 },
  groupHeader: { marginBottom: 12 },
  groupTitle: {
    fontSize: 15, fontWeight: '800', color: '#F5A623',
    letterSpacing: 1, marginBottom: 6,
  },
  groupDivider: { height: 2, backgroundColor: '#F5A623', borderRadius: 1 },
  centeredState: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12,
  },
  stateText: { fontSize: 14, color: '#A08060', fontWeight: '500' },
  retryBtn: { backgroundColor: '#F5A623', paddingVertical: 10, paddingHorizontal: 28, borderRadius: 10 },
  retryBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});