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
import LabeledInput from '../components/LabeledInput';

export default function WhereAreYouFromScreen({ navigation }:any) {
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [tribe, setTribe] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');

  const handleDone = () => {
    navigation?.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>Where are you{'\n'}from?</Text>

        {/* Flags Grid — replace with actual image asset when ready */}
        {/* <Image source={require('../assets/flags.png')} style={styles.flagsImage} /> */}
        <View style={styles.flagsPlaceholder}>
          <Text style={styles.flagsGrid}>
            {'🇳🇬 🇬🇭 🇰🇪 🇿🇦 🇪🇹\n🇪🇬 🇨🇲 🇺🇬 🇸🇳 🇹🇿\n🇷🇼 🇨🇮 🇲🇦 🇩🇿 🇦🇴\n🇿🇲 🇿🇼 🇲🇿 🇹🇳 🇸🇩\n🇲🇱 🇧🇫 🇳🇪 🇹🇩 🇸🇴'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <LabeledInput
            label="Country of origin"
            value={countryOfOrigin}
            onChangeText={setCountryOfOrigin}
            autoCapitalize="words"
          />
          <LabeledInput
            label="Tribe"
            value={tribe}
            onChangeText={setTribe}
            autoCapitalize="words"
          />
          <LabeledInput
            label="Current Location"
            value={currentLocation}
            onChangeText={setCurrentLocation}
            autoCapitalize="words"
          />

          <TouchableOpacity
            style={styles.doneButton}
            activeOpacity={0.8}
            onPress={handleDone}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF5',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#E87D0D',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 34,
  },
  flagsPlaceholder: {
    width: '100%',
    backgroundColor: '#F5A623',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  flagsGrid: {
    fontSize: 26,
    lineHeight: 40,
    textAlign: 'center',
    letterSpacing: 4,
  },
  // flagsImage: {
  //   width: '100%',
  //   height: 220,
  //   borderRadius: 16,
  //   resizeMode: 'cover',
  //   marginBottom: 32,
  // },
  form: {
    width: '100%',
  },
  doneButton: {
    backgroundColor: '#F5A623',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});