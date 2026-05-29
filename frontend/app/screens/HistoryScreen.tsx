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
import Markdown from 'react-native-markdown-display';
import TopBar from '../components/TopBar';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

export default function HistoryScreen({ navigation, route }:any) {
  const { user } = useAuth();
  console.log('tribe value:', user?.tribe);
  console.log('tribe type:', typeof user?.tribe);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const tribe = route?.params?.tribe ?? user?.tribe ?? 'Igbo';

  useEffect(() => {
    fetchHistory();
  }, [tribe]);

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
      if (!data) throw new Error('No content found');
      const combined = (data ?? [])
      .map((row) => `## ${row.title}\n\n${row.content}`)
      .join('\n\n');
      setContent(combined);
        console.log('data:', JSON.stringify(data));
        console.log('error:', supabaseError);
    
    } catch (err: any) {
      setError(err.message ?? 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>HISTORY</Text>
        <Text style={styles.subtitle}>{tribe} History</Text>

        {/* Loading state */}
        {loading && (
          <View style={styles.centeredState}>
            <ActivityIndicator size="large" color="#F5A623" />
            <Text style={styles.loadingText}>Loading history...</Text>
          </View>
        )}

        {/* Error state */}
        {!loading && error && (
          <View style={styles.centeredState}>
            <Ionicons name="alert-circle-outline" size={48} color="#C4A882" />
            <Text style={styles.errorText}>Could not load content</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchHistory}>
              <Text style={styles.retryBtnText}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Content */}
        {!loading && !error && content && (
          <View style={styles.contentCard}>
            <Markdown style={markdownStyles}>{content}</Markdown>
          </View>
        )}

        {/* Back Button */}
        {!loading && (
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={16} color="#fff" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

// Markdown styles matching the app theme
const markdownStyles = {
  body: {
    fontSize: 13,
    color: '#5C4A30',
    lineHeight: 21,
  },
  heading1: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3B1F00',
    marginTop: 16,
    marginBottom: 8,
  },
  heading2: {
    fontSize: 17,
    fontWeight: '800',
    color: '#3B1F00',
    marginTop: 14,
    marginBottom: 6,
  },
  heading3: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F5A623',
    marginTop: 12,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 13,
    color: '#5C4A30',
    lineHeight: 21,
    marginBottom: 10,
    textAlign: 'justify' as const,
  },
  bullet_list: {
    marginBottom: 10,
  },
  list_item: {
    fontSize: 13,
    color: '#5C4A30',
    lineHeight: 21,
  },
  bullet_list_icon: {
    color: '#F5A623',
    fontSize: 16,
    marginTop: 2,
  },
  strong: {
    fontWeight: '800',
    color: '#3B1F00',
  },
  em: {
    fontStyle: 'italic',
    color: '#A08060',
  },
  blockquote: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#F5A623',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  code_inline: {
    backgroundColor: '#FFF3E0',
    color: '#F5A623',
    borderRadius: 4,
    paddingHorizontal: 4,
    fontSize: 12,
  },
  hr: {
    backgroundColor: '#E0D0B8',
    height: 1,
    marginVertical: 12,
  },
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3B1F00',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#A08060',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  contentCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0D0B8',
    padding: 16,
    marginBottom: 20,
  },
  centeredState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#A08060',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 14,
    color: '#A08060',
    fontWeight: '500',
  },
  retryBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  retryBtnText: {
    color: '#fff',
    fontSize: 13,
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
    alignSelf: 'center',
    paddingHorizontal: 32,
  },
  backButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});