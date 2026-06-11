import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const AGORA_APP_ID = process.env.EXPO_PUBLIC_AGORA_APP_ID!;

const getTimerColor = (s: number) => {
  const m = Math.floor(s / 60);
  if (m < 30) return '#F5A623';
  if (m < 45) return '#D97706';
  return '#C0392B';
};

const formatTime = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map(n => String(n).padStart(2, '0')).join(':');
};


export default function ClassSessionScreen({ navigation, route }: any) {
  const teacherName   = route?.params?.teacherName   ?? 'Teacher';
  const channelName   = route?.params?.channelName   ?? 'test-channel';
  const agoraToken    = route?.params?.agoraToken    ?? null; // pass null for testing

  const [elapsed,      setElapsed]      = useState(0);
  const [isMuted,      setIsMuted]      = useState(false);
  const [isCameraOff,  setIsCameraOff]  = useState(false);
  const [isCCOn,       setIsCCOn]       = useState(false);
  const [webViewReady, setWebViewReady] = useState(false);
  const [agoraReady,   setAgoraReady]   = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const webViewRef  = useRef<WebView>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const sendToWebView = (msg: object) => {
    webViewRef.current?.injectJavaScript(
      `window.dispatchEvent(new MessageEvent('message', { data: '${JSON.stringify(msg)}' })); true;`
    );
  };

  const handleWebViewMessage = (event: any) => {
    const { type } = JSON.parse(event.nativeEvent.data);
    if (type === 'READY') {
      setAgoraReady(true);
      sendToWebView({
        type: 'JOIN',
        appId: AGORA_APP_ID,
        channel: channelName,
        token: agoraToken,
        uid: null,
      });
    }
    if (type === 'JOINED') setWebViewReady(true);
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sendToWebView({ type: next ? 'MUTE' : 'UNMUTE' });
  };

  const toggleCamera = () => {
    const next = !isCameraOff;
    setIsCameraOff(next);
    sendToWebView({ type: next ? 'CAM_OFF' : 'CAM_ON' });
  };

  const handleEndCall = () => {
    Alert.alert('End Class', 'Are you sure you want to end this class?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'End Class', style: 'destructive',
        onPress: () => {
          sendToWebView({ type: 'LEAVE' });
          if (intervalRef.current) clearInterval(intervalRef.current);
          navigation?.navigate('ClassEnd');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />

      <View style={styles.videoContainer}>

        <View style={styles.header}>
          <Text style={styles.teacherName}>{teacherName}</Text>
          <Text style={[styles.timerText, { color: getTimerColor(elapsed) }]}>
            {formatTime(elapsed)}
          </Text>
        </View>

        <View style={styles.videoFeed}>
          {!webViewReady && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#F5A623" />
              <Text style={styles.loadingText}>
                {agoraReady ? 'Joining class...' : 'Connecting...'}
              </Text>
            </View>
          )}
          <WebView
            ref={webViewRef}
            // Option A: local file  ──  require('../assets/agora-room.html')
            // Option B: hosted URL  ──  { uri: 'https://yourserver.com/agora-room.html' }
            source={require('../../assets/agora-room.html')}
            style={styles.webView}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            domStorageEnabled
            onMessage={handleWebViewMessage}
            onError={() =>
              Alert.alert('Connection Error', 'Could not load the class room.')
            }
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
            onPress={toggleMute}
          >
            <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, isCameraOff && styles.controlBtnActive]}
            onPress={toggleCamera}
          >
            <Ionicons name={isCameraOff ? 'videocam-off' : 'videocam'} size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, isCCOn && styles.controlBtnActive]}
            onPress={() => setIsCCOn(!isCCOn)}
          >
            <Text style={styles.ccIcon}>CC</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, styles.endCallBtn]}
            onPress={handleEndCall}
          >
            <Ionicons
              name="call" size={22} color="#fff"
              style={{ transform: [{ rotate: '135deg' }] }}
            />
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:       { flex: 1, backgroundColor: '#1A1A1A' },
  videoContainer: { flex: 1, backgroundColor: '#1A1A1A', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  teacherName:    { fontSize: 18, fontWeight: '700', color: '#fff' },
  timerText:      { fontSize: 18, fontWeight: '800', letterSpacing: 1 },
  videoFeed:      { flex: 1, borderRadius: 16, overflow: 'hidden', backgroundColor: '#2C2C2C', marginBottom: 12, position: 'relative' },
  webView:        { flex: 1, backgroundColor: '#2C2C2C' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2C2C2C', gap: 12, zIndex: 10 },
  loadingText:    { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  captionsContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 16, flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  ccBadge:        { backgroundColor: '#3B1F00', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginTop: 1 },
  ccBadgeText:    { color: '#fff', fontSize: 11, fontWeight: '800' },
  captionsText:   { flex: 1, fontSize: 12, color: '#333', lineHeight: 18 },
  controlsRow:    { flexDirection: 'row', justifyContent: 'center', gap: 16, paddingVertical: 8 },
  controlBtn:     { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F5A623', alignItems: 'center', justifyContent: 'center', elevation: 3 },
  controlBtnActive: { backgroundColor: '#D97706' },
  endCallBtn:     { backgroundColor: '#E74C3C' },
  ccIcon:         { color: '#fff', fontSize: 14, fontWeight: '800' },
});