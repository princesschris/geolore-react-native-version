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
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const CARD_COLORS = ['#F5A623', '#8B6F4E'];

type Belief = {
  id: string;
  culture: string;
  category: string;
  title: string;
  content: string;
  sort_order: number;
};

const BeliefCard = ({ title, color, onPress }: { title: string; color: string; onPress: () => void }) => (
  <TouchableOpacity
    style={[styles.card, { backgroundColor: color }]}
    activeOpacity={0.85}
    onPress={onPress}
  >
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);

export default function BeliefsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [beliefs, setBeliefs] = useState<Belief[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Use tribe exactly as stored — seeder capitalises first letter e.g. "Igbo"
  const tribe = user?.tribe ?? 'Igbo';

  useEffect(() => {
    fetchBeliefs();
  }, [tribe]);

  const fetchBeliefs = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[BeliefsScreen] fetching for tribe:', tribe);

      // ilike = case-insensitive match, handles "igbo" == "Igbo" either way
      const { data, error: supabaseError } = await supabase
        .from('culture_content')
        .select('*')
        .eq('category', 'beliefs')
        .ilike('culture', tribe)
        .order('sort_order', { ascending: true });

      console.log('[BeliefsScreen] rows returned:', data?.length ?? 0, 'error:', supabaseError?.message ?? 'none');

      if (supabaseError) throw supabaseError;
      setBeliefs(data ?? []);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load beliefs');
    } finally {
      setLoading(false);
    }
  };

  const filtered = beliefs.filter((b) =>
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

        {/* Loading */}
        {loading && (
          <View style={styles.centeredState}>
            <ActivityIndicator size="large" color="#F5A623" />
            <Text style={styles.stateText}>Loading beliefs...</Text>
          </View>
        )}

        {/* Error */}
        {!loading && error && (
          <View style={styles.centeredState}>
            <Ionicons name="alert-circle-outline" size={48} color="#C4A882" />
            <Text style={styles.stateText}>Could not load beliefs</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchBeliefs}>
              <Text style={styles.retryBtnText}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <View style={styles.centeredState}>
            <Ionicons name="book-outline" size={48} color="#C4A882" />
            <Text style={styles.stateText}>No beliefs found for {tribe}</Text>
          </View>
        )}

        {/* Grid */}
        {!loading && !error && displayed.length > 0 && (
          <View style={styles.grid}>
            {displayed.map((belief, index) => (
              <BeliefCard
                key={belief.id}
                title={belief.title}
                color={CARD_COLORS[index % CARD_COLORS.length]}
                onPress={() =>
                  navigation?.navigate('BeliefDetail', { belief, index })
                }
              />
            ))}
          </View>
        )}

        {/* View More */}
        {!loading && !error && !showAll && filtered.length > 10 && (
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