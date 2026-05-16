import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Circle,
  Ellipse,
  Line,
  Path,
  Rect,
  Polygon,
} from 'react-native-svg';

// Globe + Tree logo
const GlobeWithTree = () => (
  <Svg width="160" height="160" viewBox="0 0 70 70" fill="none">
    <Circle cx="35" cy="35" r="32" stroke="#F5A623" strokeWidth="2" fill="none" />
    <Ellipse cx="35" cy="35" rx="14" ry="32" stroke="#F5A623" strokeWidth="1.2" fill="none" />
    <Line x1="3" y1="35" x2="67" y2="35" stroke="#F5A623" strokeWidth="1.2" />
    <Line x1="7" y1="23" x2="63" y2="23" stroke="#F5A623" strokeWidth="0.8" />
    <Line x1="7" y1="47" x2="63" y2="47" stroke="#F5A623" strokeWidth="0.8" />
    <Path
      d="M28 22 Q30 20 33 21 Q36 22 37 25 Q38 29 36 33 Q34 37 33 40 Q32 43 30 42 Q27 40 26 36 Q24 31 25 27 Z"
      fill="#F5A623"
      opacity="0.85"
    />
    <Rect x="33.5" y="15" width="2.5" height="10" rx="1.2" fill="#D97706" />
    <Polygon points="34.5,4 40,13 29,13" fill="#F5A623" />
    <Polygon points="34.5,8 41,17 28,17" fill="#F5A623" />
    <Polygon points="34.5,12 42,21 27,21" fill="#D97706" opacity="0.75" />
    <Path d="M34.5 25 Q30 29 26 29" stroke="#D97706" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <Path d="M34.5 25 Q39 29 43 29" stroke="#D97706" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </Svg>
);

// Pulsing ring animation around call buttons
const PulseRing = ({ color }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.5, duration: 900, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 900, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0, duration: 900, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.6, duration: 900, useNativeDriver: true }),
        ]),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.pulseRing,
        { backgroundColor: color, transform: [{ scale }], opacity },
      ]}
    />
  );
};

export default function IncomingClassScreen({ navigation, route }) {
  const teacherName = route?.params?.teacher?.name ?? 'Princess';

  const handleAccept = () => {
    navigation?.navigate('ClassSession', { teacherName });
  };

  const handleDecline = () => {
    navigation?.goBack();
  };

  const handleDelay = () => {
    // Could set a reminder and go back
    navigation?.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.container}>
        {/* Top section — Logo */}
        <View style={styles.topSection}>
          <View style={styles.logoWrapper}>
            <GlobeWithTree />
          </View>
        </View>

        {/* Middle section — Message */}
        <View style={styles.middleSection}>
          <Text style={styles.lessonText}>It&apos;s time for your lesson with</Text>
          <Text style={styles.teacherName}>{teacherName}</Text>
        </View>

        {/* Call Buttons */}
        <View style={styles.callButtonsRow}>
          {/* Accept */}
          <View style={styles.callButtonWrapper}>
            <PulseRing color="#2ECC71" />
            <TouchableOpacity
              style={[styles.callButton, styles.acceptButton]}
              activeOpacity={0.85}
              onPress={handleAccept}
            >
              <Ionicons name="call" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Decline */}
          <View style={styles.callButtonWrapper}>
            <PulseRing color="#E74C3C" />
            <TouchableOpacity
              style={[styles.callButton, styles.declineButton]}
              activeOpacity={0.85}
              onPress={handleDecline}
            >
              <Ionicons name="call" size={28} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Delay Button */}
        <TouchableOpacity
          style={styles.delayButton}
          activeOpacity={0.8}
          onPress={handleDelay}
        >
          <Text style={styles.delayButtonText}>DELAY</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingBottom: 56,
  },
  topSection: {
    alignItems: 'center',
  },
  logoWrapper: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFF3E0',
    borderWidth: 2.5,
    borderColor: '#F5C070',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleSection: {
    alignItems: 'center',
    gap: 6,
  },
  lessonText: {
    fontSize: 16,
    color: '#5C4A30',
    textAlign: 'center',
    fontWeight: '500',
  },
  teacherName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3B1F00',
    textAlign: 'center',
  },
  callButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 64,
    alignItems: 'center',
  },
  callButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
  },
  pulseRing: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  callButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  acceptButton: {
    backgroundColor: '#2ECC71',
  },
  declineButton: {
    backgroundColor: '#E74C3C',
  },
  delayButton: {
    backgroundColor: '#F5A623',
    paddingVertical: 13,
    paddingHorizontal: 56,
    borderRadius: 12,
    alignItems: 'center',
  },
  delayButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },
});