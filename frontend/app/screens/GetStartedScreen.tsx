import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  Line,
  Path,
  Rect,
  Polygon,
} from 'react-native-svg';

const GlobeWithTree = () => (
  <Svg width="180" height="180" viewBox="0 0 70 70" fill="none">
    {/* Globe outline */}
    <Circle cx="35" cy="35" r="32" stroke="#F5A623" strokeWidth="2" fill="none" />
    {/* Vertical ellipse */}
    <Ellipse cx="35" cy="35" rx="14" ry="32" stroke="#F5A623" strokeWidth="1.2" fill="none" />
    {/* Horizontal lines */}
    <Line x1="3" y1="35" x2="67" y2="35" stroke="#F5A623" strokeWidth="1.2" />
    <Line x1="7" y1="23" x2="63" y2="23" stroke="#F5A623" strokeWidth="0.8" />
    <Line x1="7" y1="47" x2="63" y2="47" stroke="#F5A623" strokeWidth="0.8" />
    {/* Meridian curves */}
    <Path d="M32 3 Q35 18 35 35 Q35 52 38 67" stroke="#F5A623" strokeWidth="0.8" fill="none" />
    <Path d="M38 3 Q35 18 35 35 Q35 52 32 67" stroke="#F5A623" strokeWidth="0.8" fill="none" />
    {/* Africa-like continent shape */}
    <Path
      d="M28 22 Q30 20 33 21 Q36 22 37 25 Q38 29 36 33 Q34 37 33 40 Q32 43 30 42 Q27 40 26 36 Q24 31 25 27 Z"
      fill="#F5A623"
      opacity="0.85"
    />
    {/* Tree trunk growing from continent */}
    <Rect x="33.5" y="15" width="2.5" height="10" rx="1.2" fill="#D97706" />
    {/* Tree canopy layers */}
    <Polygon points="34.5,4 40,13 29,13" fill="#F5A623" />
    <Polygon points="34.5,8 41,17 28,17" fill="#F5A623" />
    <Polygon points="34.5,12 42,21 27,21" fill="#D97706" opacity="0.75" />
    {/* Root lines spreading into globe */}
    <Path d="M34.5 25 Q30 29 26 29" stroke="#D97706" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <Path d="M34.5 25 Q39 29 43 29" stroke="#D97706" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <Path d="M34.5 25 Q32 31 29 33" stroke="#D97706" strokeWidth="0.9" fill="none" strokeLinecap="round" />
    <Path d="M34.5 25 Q37 31 40 33" stroke="#D97706" strokeWidth="0.9" fill="none" strokeLinecap="round" />
  </Svg>
);

export default function GetStartedScreen({ navigation }:any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.container}>
        {/* Globe + Tree Logo */}
        <View style={styles.logoWrapper}>
          <GlobeWithTree />
        </View>

        {/* Title */}
        <Text style={styles.title}>Welcome</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>
          Here at Get yourself together we organize your day to day activities.
          Ensuring you go about your daily schedules with ease.
        </Text>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => navigation?.navigate('WhereAreYouFrom')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF5',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingBottom: 48,
  },
  logoWrapper: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFF3E0',
    borderWidth: 2.5,
    borderColor: '#F5C070',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#E87D0D',
    marginBottom: 16,
  },
  tagline: {
    fontSize: 13,
    color: '#A08060',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 40,
    maxWidth: 280,
  },
  button: {
    backgroundColor: '#F5A623',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});