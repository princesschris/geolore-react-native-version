import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Timer color logic based on elapsed minutes
// 0-30 min  → orange     #F5A623
// 30-45 min → dark amber #D97706
// 45-60 min → dark red   #C0392B
const getTimerColor = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 30) return '#F5A623';
  if (minutes < 45) return '#D97706';
  return '#C0392B';
};

const formatTime = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [
    String(h).padStart(2, '0'),
    String(m).padStart(2, '0'),
    String(s).padStart(2, '0'),
  ].join(':');
};

export default function ClassSessionScreen({ navigation, route }) {
  const teacherName = route?.params?.teacherName ?? 'Princess';

  const [elapsed, setElapsed] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isCCOn, setIsCCOn] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const timerColor = getTimerColor(elapsed);

  const handleEndCall = () => {
    clearInterval(intervalRef.current);
    navigation?.navigate('ClassEnd');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />

      {/* Full screen video area */}
      <View style={styles.videoContainer}>

        {/* Teacher name */}
        <Text style={styles.teacherName}>{teacherName}</Text>

        {/* Main video feed placeholder */}
        {/* Replace with actual video component e.g. Twilio, Agora, etc. */}
        <View style={styles.videoFeed}>
          {/* <Image source={require('../assets/teacher-video.png')} style={styles.videoImage} /> */}
          <View style={styles.videoPlaceholder}>
            <Ionicons name="videocam" size={48} color="rgba(255,255,255,0.3)" />
            <Text style={styles.videoPlaceholderText}>Video feed</Text>
          </View>

          {/* Timer overlay on video */}
          <View style={styles.timerOverlay}>
            <Text style={[styles.timerText, { color: timerColor }]}>
              {formatTime(elapsed)}
            </Text>
          </View>
        </View>

        {/* Captions / CC area */}
        {isCCOn && (
          <View style={styles.captionsContainer}>
            <View style={styles.ccBadge}>
              <Text style={styles.ccBadgeText}>CC</Text>
            </View>
            <Text style={styles.captionsText}>
              quam, modi officia ipsam sed repellendus excepturi nulla, eius voluptates a
              impedit quisquam nisi quibusdam numquam et odit fugit accusamus. Nostrum,
              harum animi. Eum assumenda voluptatibus voluptatum vero dolor. Recusandae
              eaque asperiores ipsam aperiam nam sequi nihil perferendis la
            </Text>
          </View>
        )}

        {/* Control Buttons Row */}
        <View style={styles.controlsRow}>
          {/* Microphone */}
          <TouchableOpacity
            style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
            activeOpacity={0.8}
            onPress={() => setIsMuted(!isMuted)}
          >
            <Ionicons
              name={isMuted ? 'mic-off' : 'mic'}
              size={22}
              color="#fff"
            />
          </TouchableOpacity>

          {/* Camera */}
          <TouchableOpacity
            style={[styles.controlBtn, isCameraOff && styles.controlBtnActive]}
            activeOpacity={0.8}
            onPress={() => setIsCameraOff(!isCameraOff)}
          >
            <Ionicons
              name={isCameraOff ? 'videocam-off' : 'videocam'}
              size={22}
              color="#fff"
            />
          </TouchableOpacity>

          {/* Closed Captions */}
          <TouchableOpacity
            style={[styles.controlBtn, isCCOn && styles.controlBtnActive]}
            activeOpacity={0.8}
            onPress={() => setIsCCOn(!isCCOn)}
          >
            <Text style={styles.ccIcon}>CC</Text>
          </TouchableOpacity>

          {/* End Call */}
          <TouchableOpacity
            style={[styles.controlBtn, styles.endCallBtn]}
            activeOpacity={0.8}
            onPress={handleEndCall}
          >
            <Ionicons name="call" size={22} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  videoFeed: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#2C2C2C',
    marginBottom: 12,
    position: 'relative',
  },
  videoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  videoPlaceholderText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 13,
  },
  videoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  timerOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 14,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  captionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  ccBadge: {
    backgroundColor: '#3B1F00',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 1,
  },
  ccBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  captionsText: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5A623',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  controlBtnActive: {
    backgroundColor: '#D97706',
  },
  endCallBtn: {
    backgroundColor: '#E74C3C',
  },
  ccIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
});