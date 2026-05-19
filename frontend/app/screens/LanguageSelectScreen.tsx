import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';

const LANGUAGES = [
  'Albanian',
  'Arabic',
  'Assamese (India)',
  'Bangla (Bangladesh)',
  'Bangla (India)',
  'Bodo',
  'Bosnian',
  'Bulgarian',
  'Catalan',
  'Chinese (Simplified)',
  'Chinese (Traditional)',
  'Croatian',
  'Czech',
  'Danish',
  'Dutch',
  'English',
  'Estonian',
  'Finnish',
  'French',
  'German',
  'Greek',
  'Gujarati',
  'Hausa',
  'Hebrew',
  'Hindi',
  'Hungarian',
  'Igbo',
  'Indonesian',
  'Italian',
  'Japanese',
  'Kannada',
  'Korean',
  'Latvian',
  'Lithuanian',
  'Malay',
  'Malayalam',
  'Marathi',
  'Norwegian',
  'Odia (India)',
  'Persian',
  'Polish',
  'Portuguese',
  'Punjabi',
  'Romanian',
  'Russian',
  'Serbian',
  'Sinhala',
  'Slovak',
  'Slovenian',
  'Spanish',
  'Swahili',
  'Swedish',
  'Tamil',
  'Telugu',
  'Thai',
  'Turkish',
  'Ukrainian',
  'Urdu',
  'Vietnamese',
  'Welsh',
  'Yoruba',
  'Zulu',
];

export default function LanguageSelectScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState('Use system language');

  const filtered = LANGUAGES.filter((l) =>
    l.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (language) => {
    setSelected(language);
    // Save language preference here
    setTimeout(() => navigation?.goBack(), 300);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      {/* Language Card */}
      <View style={styles.card}>
        {/* Title */}
        <Text style={styles.cardTitle}>LANGUAGE</Text>

        {/* Use system language */}
        <TouchableOpacity
          style={styles.systemLanguageBtn}
          activeOpacity={0.8}
          onPress={() => handleSelect('Use system language')}
        >
          <Text style={styles.systemLanguageText}>Use system language</Text>
          {selected === 'Use system language' && (
            <Ionicons name="checkmark" size={18} color="#fff" />
          )}
        </TouchableOpacity>

        {/* Language list */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.languageRow,
                selected === item && styles.languageRowSelected,
              ]}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.languageText,
                selected === item && styles.languageTextSelected,
              ]}>
                {item}
              </Text>
              {selected === item && (
                <Ionicons name="checkmark" size={16} color="#F5A623" />
              )}
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelBtn}
          activeOpacity={0.8}
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  card: {
    flex: 1,
    backgroundColor: '#C4956A',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 1.5,
  },
  systemLanguageBtn: {
    backgroundColor: '#F5A623',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  systemLanguageText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  list: {
    flex: 1,
    marginBottom: 10,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  languageRowSelected: {
    backgroundColor: 'rgba(245,166,35,0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  languageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  languageTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  cancelBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  cancelBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});