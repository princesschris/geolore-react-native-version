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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import { CULTURAL_DATA } from '../../data/cultures/culturalData';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

const SUGGESTIONS = [
  { id: '1', label: 'What are popular cultural festivals?' },
  { id: '2', label: 'What traditional foods exist?' },
  { id: '3', label: 'Tell me about cultural traditions' },
];

const MessageBubble = ({ message }) => (
  <View style={[styles.bubble, message.isUser ? styles.userBubble : styles.botBubble]}>
    {message.isLoading ? (
      <ActivityIndicator size="small" color="#A08060" />
    ) : (
      <Text style={[styles.bubbleText, message.isUser ? styles.userBubbleText : styles.botBubbleText]}>
        {message.text}
      </Text>
    )}
  </View>
);

export default function AIChatBotScreen({ navigation }: any) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  const handleSend = async (text?: string) => {
    const msg = text || inputText;
    if (!msg.trim() || isLoading) return;

    setShowChat(true);
    setIsLoading(true);

    const userMsg = { id: Date.now().toString(), text: msg, isUser: true };
    const loadingMsg = {
      id: (Date.now() + 1).toString(),
      text: '',
      isUser: false,
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInputText('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const trimmedData = CULTURAL_DATA.slice(0, 10000);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [
                {
                  text: `You are a cultural knowledge assistant. Answer questions ONLY based on the cultural data provided. 
If the answer is not found in the data, respond with: "I don't have information on that in my cultural database."
Keep answers clear, friendly, and informative.`,
                },
              ],
            },
            contents: [
              {
                parts: [
                  {
                    text: `CULTURAL DATA:\n\n${trimmedData}\n\n---\n\nUser question: ${msg}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));

      const botReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I couldn't find an answer. Please try rephrasing your question.";

      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMsg.id ? { ...m, text: botReply, isLoading: false } : m
        )
      );
    } catch (error) {
      console.log('API Error:', error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMsg.id
            ? { ...m, text: 'Something went wrong. Please check your connection and try again.', isLoading: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      {/* Top bar */}
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
                  onPress={() => handleSend(s.label)}
                >
                  <Ionicons name="chatbubble-outline" size={13} color="#F5A623" />
                  <Text style={styles.chipText}>{s.label}</Text>
                </TouchableOpacity>
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
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.micBtn, isLoading && styles.micBtnDisabled]}
            onPress={() => handleSend()}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="mic-outline" size={18} color="#fff" />
                <Text style={styles.micLines}>||||</Text>
              </>
            )}
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

  bubble: {
    maxWidth: '78%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    minWidth: 60,
    minHeight: 40,
    justifyContent: 'center',
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
  micBtnDisabled: {
    backgroundColor: '#C4A882',
  },
  micLines: {
    color: '#fff',
    fontSize: 10,
    letterSpacing: 1,
  },
});