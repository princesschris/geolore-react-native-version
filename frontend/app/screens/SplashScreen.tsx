import React from 'react';
import {
  View, Text, TouchableOpacity,StyleSheet,SafeAreaView,StatusBar,Dimensions,
} from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  Line,
  Path,
  Rect,
  Polygon,
} from 'react-native-svg';

const { width } = Dimensions.get('window');

const GlobeWithTree = () => (
  <Svg width="100" height="100" viewBox="0 0 70 70" fill="none">
    {/* Globe outline */}
    <Circle cx="35" cy="35" r="32" stroke="#F5A623" strokeWidth="2.5" fill="none" />
    {/* Vertical ellipse */}
    <Ellipse cx="35" cy="35" rx="14" ry="32" stroke="#F5A623" strokeWidth="1.5" fill="none" />
    {/* Horizontal lines */}
    <Line x1="3" y1="35" x2="67" y2="35" stroke="#F5A623" strokeWidth="1.5" />
    <Line x1="7" y1="23" x2="63" y2="23" stroke="#F5A623" strokeWidth="1" />
    <Line x1="7" y1="47" x2="63" y2="47" stroke="#F5A623" strokeWidth="1" />
    {/* Meridian curves */}
    <Path d="M32 10 Q35 20 35 35 Q35 50 38 60" stroke="#F5A623" strokeWidth="1" fill="none" />
    <Path d="M38 10 Q35 20 35 35 Q35 50 32 60" stroke="#F5A623" strokeWidth="1" fill="none" />
    {/* Tree trunk */}
    <Rect x="33.5" y="32" width="3" height="12" rx="1.5" fill="#E87D0D" />
    {/* Tree canopy layers */}
    <Polygon points="35,12 42,26 28,26" fill="#F5A623" />
    <Polygon points="35,18 43,32 27,32" fill="#F5A623" />
    <Polygon points="35,24 44,38 26,38" fill="#E87D0D" opacity="0.7" />
    {/* Root lines */}
    <Path d="M35 44 Q30 48 26 48" stroke="#E87D0D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Path d="M35 44 Q40 48 44 48" stroke="#E87D0D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </Svg>
);

export default function SplashScreen({ navigation }:any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoWrapper}>
          <GlobeWithTree />
        </View>

        {/* App Name */}
        <Text style={styles.title}>GeoLore</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>
          Here or Get yourself together we organize your day to day activities.
          Ensuring you go about your daily schedules with ease.
        </Text>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Login')}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Register')}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 48,
  },
  logoWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FFF3E0',
    borderWidth: 2,
    borderColor: '#F5C070',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#E87D0D',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: 13,
    color: '#A08060',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 'auto',
    maxWidth: 260,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 48,
  },
  button: {
    flex: 1,
    backgroundColor: '#F5A623',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});