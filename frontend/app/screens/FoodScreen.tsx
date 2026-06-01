import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

type FoodItem = {
  id: string;
  name: string;
  emoji?: string;
  culture: string;
  ingredients: {
    main: string[];
    vegetables?: string[];
    optional?: string[];
  };
  steps: Array<{
    title: string;
    substeps: string[];
    note?: string | null;
  }>;
};

const FoodCard = ({ name, emoji, onTryIt }: { name: string; emoji?: string; onTryIt: () => void }) => (
  <View style={styles.foodCard}>
    {emoji
      ? <Text style={styles.foodEmoji}>{emoji}</Text>
      : <Ionicons name="restaurant-outline" size={48} color="#F5A623" />
    }
    <Text style={styles.foodName}>{name}</Text>
    <TouchableOpacity style={styles.tryItBtn} activeOpacity={0.8} onPress={onTryIt}>
      <Text style={styles.tryItText}>TRY IT</Text>
    </TouchableOpacity>
  </View>
);

export default function FoodScreen({ navigation }: any) {
  const { user } = useAuth();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Tribe from auth context — falls back to 'igbo'
  const tribe = user?.tribe ?? 'igbo';

  useEffect(() => {
    fetchFoods();
  }, [tribe]);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('food_items')
        .select('*')
        .eq('culture', tribe);

      if (supabaseError) throw supabaseError;
      setFoods(data ?? []);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load food items');
    } finally {
      setLoading(false);
    }
  };

  const filtered = foods.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>FOOD</Text>

        {/* Loading */}
        {loading && (
          <View style={styles.centeredState}>
            <ActivityIndicator size="large" color="#F5A623" />
            <Text style={styles.stateText}>Loading {tribe} food...</Text>
          </View>
        )}

        {/* Error */}
        {!loading && error && (
          <View style={styles.centeredState}>
            <Ionicons name="alert-circle-outline" size={48} color="#C4A882" />
            <Text style={styles.stateText}>Could not load food items</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchFoods}>
              <Text style={styles.retryBtnText}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <View style={styles.centeredState}>
            <Ionicons name="restaurant-outline" size={48} color="#C4A882" />
            <Text style={styles.stateText}>No food items found for {tribe}</Text>
          </View>
        )}

        {/* Food list */}
        {!loading && !error && filtered.map((food) => (
          <FoodCard
            key={food.id}
            name={food.name}
            emoji={food.emoji}
            onTryIt={() => navigation?.navigate('FoodDetails', { food })}
          />
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
  centeredState: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12,
  },
  stateText: { fontSize: 14, color: '#A08060', fontWeight: '500' },
  retryBtn: {
    backgroundColor: '#F5A623', paddingVertical: 10, paddingHorizontal: 28, borderRadius: 10,
  },
  retryBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});