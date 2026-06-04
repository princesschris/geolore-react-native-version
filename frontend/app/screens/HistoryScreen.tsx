import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, SafeAreaView, StatusBar, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ContentDetailScreen from '../components/ContentDetailScreen';
import TopBar from '../components/TopBar';
import BottomTabBar from '../components/BottomTabBar';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

export default function HistoryScreen({ navigation, route }: any) {
  const { user } = useAuth();
  const tribe = route?.params?.tribe ?? user?.tribe ?? 'Igbo';

  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => { fetchHistory(); }, [tribe]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('culture_content')
        .select('title, content')
        .eq('category', 'history')
        .eq('culture', tribe)
        .order('sort_order', { ascending: true });

      if (supabaseError) throw supabaseError;
      if (!data || data.length === 0) throw new Error('No content found');
      const combined = data
        .map((row) => `## ${row.title}\n\n${row.content}`)
        .join('\n\n');

      setContent(combined);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
        <TopBar showSearch={false} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#F5A623" />
          <Text style={styles.stateText}>Loading history...</Text>
        </View>
        <BottomTabBar />
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
        <TopBar showSearch={false} />
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color="#C4A882" />
          <Text style={styles.stateText}>Could not load content</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchHistory}>
            <Text style={styles.retryBtnText}>Try again</Text>
          </TouchableOpacity>
        </View>
        <BottomTabBar />
      </SafeAreaView>
    );
  }

  return (
    <ContentDetailScreen
      navigation={navigation}
      rawContent={content ?? ''}
      heroTitle={`${tribe} History`}
      heroIcon="time-outline"
      heroColor="#5C3A1E"
      accentColor="#F5A623"
      label="History"
    />
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  stateText:    { fontSize: 14, color: '#A08060', fontWeight: '500' },
  retryBtn:     { backgroundColor: '#F5A623', paddingVertical: 10, paddingHorizontal: 28, borderRadius: 10 },
  retryBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});