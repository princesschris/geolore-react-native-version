import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const getTimerColor = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 30) return '#F5A623';
  if (minutes < 45) return '#D97706';
  return '#C0392B';
};

const formatTime = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [
    String(h).padStart(2, '0'),
    String(m).padStart(2, '0'),
    String(s).padStart(2, '0'),
  ].join(':');
};

export default function ClassSessionScreen({ navigation, route }: any) {
  const teacherName    = route?.params?.teacherName    ?? 'Teacher';
  const roomUrl        = route?.params?.roomUrl        ?? '';
  const appointmentId  = route?.params?.appointmentId  ?? null;

  const [elapsed,      setElapsed]      = useState(0);
  const [isMuted,      setIsMuted]      = useState(false);
  const [isCameraOff,  setIsCameraOff]  = useState(false);
  const [isCCOn,       setIsCCOn]       = useState(false);
  const [webViewReady, setWebViewReady] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const webViewRef  = useRef<WebView>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const timerColor = getTimerColor(elapsed);

  const handleEndCall = () => {
    Alert.alert('End Class', 'Are you sure you want to end this class?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'End Class', style: 'destructive',
        onPress: () => {
          if (intervalRef.current) clearInterval(intervalRef.current);
          navigation?.navigate('ClassEnd');
        },
      },
    ]);
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    webViewRef.current?.injectJavaScript(`
      (function() {
        try {
          const tracks = window.__dailyCall?.participants()?.local?.tracks;
          if (tracks?.audio?.track) {
            tracks.audio.track.enabled = ${!next};
          }
        } catch(e) {}
      })();
      true;
    `);
  };

  const toggleCamera = () => {
    const next = !isCameraOff;
    setIsCameraOff(next);
    webViewRef.current?.injectJavaScript(`
      (function() {
        try {
          const tracks = window.__dailyCall?.participants()?.local?.tracks;
          if (tracks?.video?.track) {
            tracks.video.track.enabled = ${!next};
          }
        } catch(e) {}
      })();
      true;
    `);
  };

  if (!roomUrl) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#F5A623" />
          <Text style={styles.errorText}>No room URL provided.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />

      <View style={styles.videoContainer}>

        <View style={styles.header}>
          <Text style={styles.teacherName}>{teacherName}</Text>
          <Text style={[styles.timerText, { color: timerColor }]}>
            {formatTime(elapsed)}
          </Text>
        </View>
        <View style={styles.videoFeed}>
          {!webViewReady && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#F5A623" />
              <Text style={styles.loadingText}>Connecting to class...</Text>
            </View>
          )}
          <WebView
            ref={webViewRef}
            source={{ uri: roomUrl }}
            style={styles.webView}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            onLoadEnd={() => setWebViewReady(true)}
            onError={() => Alert.alert('Connection Error', 'Could not load the class room. Please check your connection.')}
            javaScriptEnabled
            domStorageEnabled
            injectedJavaScript={`
              (function() {
                const interval = setInterval(() => {
                  if (window.DailyIframe) {
                    window.__dailyCall = window.DailyIframe.createFrame();
                    clearInterval(interval);
                  }
                }, 500);
              })();
              true;
            `}
          />
        </View>

        {isCCOn && (
          <View style={styles.captionsContainer}>
            <View style={styles.ccBadge}>
              <Text style={styles.ccBadgeText}>CC</Text>
            </View>
            <Text style={styles.captionsText}>Live captions will appear here...</Text>
          </View>
        )}

            <View style={styles.controlsRow}>
          
          <TouchableOpacity
            style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
            activeOpacity={0.8}
            onPress={toggleMute}
          >
            <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, isCameraOff && styles.controlBtnActive]}
            activeOpacity={0.8}
            onPress={toggleCamera}
          >
            <Ionicons name={isCameraOff ? 'videocam-off' : 'videocam'} size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, isCCOn && styles.controlBtnActive]}
            activeOpacity={0.8}
            onPress={() => setIsCCOn(!isCCOn)}
          >
            <Text style={styles.ccIcon}>CC</Text>
          </TouchableOpacity>
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
  safeArea: { flex: 1, backgroundColor: '#1A1A1A' },

  videoContainer: {
    flex: 1, backgroundColor: '#1A1A1A',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24,
  },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  teacherName: { fontSize: 18, fontWeight: '700', color: '#fff' },
  timerText:   { fontSize: 18, fontWeight: '800', letterSpacing: 1 },

  videoFeed: {
    flex: 1, borderRadius: 16, overflow: 'hidden',
    backgroundColor: '#2C2C2C', marginBottom: 12, position: 'relative',
  },
  webView: { flex: 1, backgroundColor: '#2C2C2C' },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#2C2C2C', gap: 12, zIndex: 10,
  },
  loadingText: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },

  captionsContainer: {
    backgroundColor: '#fff', borderRadius: 12, padding: 12,
    marginBottom: 16, flexDirection: 'row', gap: 8, alignItems: 'flex-start',
  },
  ccBadge: {
    backgroundColor: '#3B1F00', borderRadius: 4,
    paddingHorizontal: 6, paddingVertical: 2, marginTop: 1,
  },
  ccBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  captionsText: { flex: 1, fontSize: 12, color: '#333', lineHeight: 18 },

  controlsRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 16, paddingVertical: 8,
  },
  controlBtn: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#F5A623', alignItems: 'center', justifyContent: 'center',
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 4,
  },
  controlBtnActive: { backgroundColor: '#D97706' },
  endCallBtn:       { backgroundColor: '#E74C3C' },
  ccIcon:           { color: '#fff', fontSize: 14, fontWeight: '800' },

  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  errorText:      { fontSize: 14, color: '#A08060' },
  backBtn:        { backgroundColor: '#F5A623', paddingVertical: 10, paddingHorizontal: 28, borderRadius: 10 },
  backBtnText:    { color: '#fff', fontWeight: '700' },
});