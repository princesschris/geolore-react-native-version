import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Animated,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PulseRing = ({ color }:any) => {
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

export default function IncomingClassScreen({ navigation, route }:any) {
  const teacherName = route?.params?.teacher?.name ?? 'Princess';

  const handleAccept = () => {
    navigation?.navigate('ClassSession', { teacherName });
  };

  const handleDecline = () => {
    navigation?.goBack();
  };

  const handleDelay = () => {
    navigation?.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.logoWrapper}>
           <Image source={require('../../assets/images/logo.png')} style={styles.logo}/>
          </View>
        </View>
        <View style={styles.middleSection}>
          <Text style={styles.lessonText}>It&apos;s time for your lesson with</Text>
          <Text style={styles.teacherName}>{teacherName}</Text>
        </View>
        <View style={styles.callButtonsRow}>
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
  logo: {
  width: 240,
  height: 240,
  // resizeMode: 'contain',
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