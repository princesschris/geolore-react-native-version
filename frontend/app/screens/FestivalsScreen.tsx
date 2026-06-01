import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';
import ImageCard from '../components/ImageCard';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

type Festival = {
  id: string;
  culture: string;
  category: string;
  title: string;
  content: string;
  sort_order: number;
  imageSource?: any;
};

export default function FestivalsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const tribe = user?.tribe ?? 'igbo';

  useEffect(() => {
    fetchFestivals();
  }, [tribe]);

  const fetchFestivals = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('culture_content')
        .select('*')
        .eq('category', 'festivals')
        .eq('culture', tribe.toLowerCase())
        .order('sort_order', { ascending: true });

      if (supabaseError) throw supabaseError;
      setFestivals(data ?? []);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load festivals');
    } finally {
      setLoading(false);
    }
  };

  const filtered = festivals.filter((f) =>
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

        {/* Loading */}
        {loading && (
          <View style={styles.centeredState}>
            <ActivityIndicator size="large" color="#F5A623" />
            <Text style={styles.stateText}>Loading {tribe} festivals...</Text>
          </View>
        )}

        {/* Error */}
        {!loading && error && (
          <View style={styles.centeredState}>
            <Ionicons name="alert-circle-outline" size={48} color="#C4A882" />
            <Text style={styles.stateText}>Could not load festivals</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchFestivals}>
              <Text style={styles.retryBtnText}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <View style={styles.centeredState}>
            <Ionicons name="calendar-outline" size={48} color="#C4A882" />
            <Text style={styles.stateText}>No festivals found for {tribe}</Text>
          </View>
        )}

        {/* 2-column grid */}
        {!loading && !error && displayed.length > 0 && (
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
        )}

        {/* View More */}
        {!loading && !error && !showAll && filtered.length > 6 && (
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
  viewMoreBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  viewMoreText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  centeredState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  stateText: { fontSize: 14, color: '#A08060', fontWeight: '500' },
  retryBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  retryBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});