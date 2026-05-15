import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';

const SUGGESTIONS = [
  { id: '1', label: 'What is this' },
  { id: '2', label: 'Who is ...' },
  { id: '3', label: 'What happened in ...' },
  { id: '4', label: 'Fun facts' },
];

const INITIAL_HISTORY = [
  { id: '1', text: 'War stories' },
  { id: '2', text: 'Igbo History' },
  { id: '3', text: 'War stories' },
  { id: '4', text: 'The diaspora rules' },
  { id: '5', text: 'New Yam Festival date 20...' },
  { id: '6', text: 'Igbo History' },
  { id: '7', text: 'War stories' },
  { id: '8', text: 'The diaspora rules' },
  { id: '9', text: 'New Yam Festival date 20' },
];

const MessageBubble = ({ message }) => (
  <View style={[styles.bubble, message.isUser ? styles.userBubble : styles.botBubble]}>
    <Text style={[styles.bubbleText, message.isUser ? styles.userBubbleText : styles.botBubbleText]}>
      {message.text}
    </Text>
  </View>
);

const HistoryItem = ({ text, onPress }) => (
  <TouchableOpacity style={styles.historyItem} onPress={onPress} activeOpacity={0.7}>
    <Ionicons name="time-outline" size={16} color="#A08060" />
    <Text style={styles.historyText} numberOfLines={1}>{text}</Text>
    <Ionicons name="chevron-forward-outline" size={16} color="#C4A882" />
  </TouchableOpacity>
);

export default function AIChatBotScreen({ navigation }:any) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const scrollRef = useRef(null);

  const handleSend = (text) => {
    const msg = text || inputText;
    if (!msg.trim()) return;

    setShowChat(true);
    const userMsg = { id: Date.now().toString(), text: msg, isUser: true };
    const botMsg = {
      id: (Date.now() + 1).toString(),
      text: `Here's what I found about "${msg}"...`,
      isUser: false,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputText('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      {/* Top bar with hamburger + icons */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => navigation?.navigate('SideBar')}
        >
          <Ionicons name="menu-outline" size={26} color="#5C3A00" />
        </TouchableOpacity>
        <View style={styles.topBarIcons}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation?.navigate('Profile')}
          >
            <Ionicons name="person-outline" size={20} color="#5C3A00" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <View>
              <Ionicons name="notifications-outline" size={20} color="#5C3A00" />
              <View style={styles.badge}><Text style={styles.badgeText}>5</Text></View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <BuntingBanner />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        {!showChat ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.welcomeTitle}>What can I help with?</Text>

            {/* Suggestion chips */}
            <View style={styles.chipsRow}>
              {SUGGESTIONS.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.chip}
                  activeOpacity={0.8}
                  onPress={() => setInputText(s.label)}
                >
                  <Ionicons name="chatbubble-outline" size={13} color="#F5A623" />
                  <Text style={styles.chipText}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Chat history */}
            <View style={styles.historyList}>
              {INITIAL_HISTORY.map((item) => (
                <HistoryItem
                  key={item.id}
                  text={item.text}
                  onPress={() => handleSend(item.text)}
                />
              ))}
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </ScrollView>
        )}

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add" size={22} color="#A08060" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything..."
            placeholderTextColor="#C4B49A"
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity style={styles.micBtn} onPress={() => handleSend()}>
            <Ionicons name="mic-outline" size={18} color="#fff" />
            <Text style={styles.micLines}>||||</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  flex: { flex: 1 },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  menuBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#F5A623',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },

  // Content
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3B1F00',
    textAlign: 'center',
    marginBottom: 20,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 24,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#F5C070',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5C3A00',
  },
  historyList: { gap: 2 },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6D6',
  },
  historyText: {
    flex: 1,
    fontSize: 13,
    color: '#5C4A30',
    fontWeight: '500',
  },

  // Bubbles
  bubble: {
    maxWidth: '78%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  userBubble: {
    backgroundColor: '#F5A623',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#FFF3E0',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#F5C070',
  },
  bubbleText: { fontSize: 13, lineHeight: 20 },
  userBubbleText: { color: '#fff' },
  botBubbleText: { color: '#3B1F00' },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0D0B8',
    backgroundColor: '#FFFDF5',
    gap: 8,
  },
  addBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: '#3B1F00',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#F5C070',
  },
  micBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5A623',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  micLines: {
    color: '#fff',
    fontSize: 10,
    letterSpacing: 1,
  },
});