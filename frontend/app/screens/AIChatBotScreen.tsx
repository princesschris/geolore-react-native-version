import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, TextInput, KeyboardAvoidingView,
  Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = 'https://ypoumpucjsauimirpoil.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlwb3VtcHVjanNhdWltaXJwb2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjMwOTcsImV4cCI6MjA5NDgzOTA5N30.LyF2elLk8cnBsGDA_Y0LLaB8weOJC7Vn-4sISO6FufQ';
const GROQ_API_KEY      = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const HF_TOKEN          = process.env.EXPO_PUBLIC_HF_TOKEN; 

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const SUGGESTIONS = [
  { id: '1', label: 'What are popular cultural festivals?' },
  { id: '2', label: 'What traditional foods exist?' },
  { id: '3', label: 'Tell me about cultural traditions' },
];

async function getEmbedding(text: string): Promise<number[] | null> {
  try {
    const res = await fetch(
      'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2',
      {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(HF_TOKEN ? { Authorization: `Bearer ${HF_TOKEN}` } : {}),
        },
        body: JSON.stringify({ inputs: text.slice(0, 500), options: { wait_for_model: true } }),
      }
    );
    if (!res.ok) return null;
    const json = await res.json() as number[] | number[][];
    return Array.isArray(json[0]) ? (json as number[][])[0] : (json as number[]);
  } catch {
    return null;
  }
}

async function searchContext(query: string): Promise<string> {
  try {
    const embedding = await getEmbedding(query);
    if (!embedding) return '';

    const { data, error } = await supabase.rpc('match_culture_content', {
      query_embedding: embedding,
      match_count: 5,
    });

    if (error || !data || data.length === 0) return '';

    return data
      .map((row: any) => `[${row.culture} — ${row.category}] ${row.title}:\n${row.content}`)
      .join('\n\n');
  } catch {
    return '';
  }
}


async function askGroq(question: string, context: string): Promise<string> {
  const systemPrompt = context
    ? `You are a friendly and knowledgeable African cultural assistant for the GeoLore app.
Answer questions ONLY using the cultural context provided below.
If the answer is not in the context, say: "I don't have information on that in my cultural database."
Be clear, warm, and informative. Keep answers concise.

CULTURAL CONTEXT:
${context}`
    : `You are a friendly African cultural assistant for the GeoLore app.
You don't have specific data for this question. Politely let the user know and suggest they ask about Nigerian tribes, traditions, food, fashion, or festivals.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model:      'llama3-8b-8192',
      max_tokens: 512,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: question },
      ],
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content
    ?? "I couldn't find an answer. Please try rephrasing your question.";
}


const MessageBubble = ({ message }: any) => (
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
  const [messages,  setMessages]  = useState<any[]>([]);
  const [showChat,  setShowChat]  = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = async (text?: string) => {
    const msg = (text || inputText).trim();
    if (!msg || isLoading) return;

    setShowChat(true);
    setIsLoading(true);
    setInputText('');

    
    const userId    = `user-${Date.now()}-${Math.random()}`;
  const loadingId = `bot-${Date.now()}-${Math.random()}`;
  setMessages(prev => [
    ...prev,
    { id: userId,    text: msg, isUser: true },
    { id: loadingId, text: '', isUser: false, isLoading: true },
  ]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const context  = await searchContext(msg);
      const botReply = await askGroq(msg, context);
      setMessages(prev =>
        prev.map(m => m.id === loadingId ? { ...m, text: botReply, isLoading: false } : m)
      );
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev =>
        prev.map(m =>
          m.id === loadingId
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

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => navigation?.navigate('SideBar')}>
          <Ionicons name="menu-outline" size={26} color="#5C3A00" />
        </TouchableOpacity>
        <View style={styles.topBarIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation?.navigate('Profile')}>
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
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.welcomeTitle}>What can I help with?</Text>
            <View style={styles.chipsRow}>
              {SUGGESTIONS.map(s => (
                <TouchableOpacity key={s.id} style={styles.chip} activeOpacity={0.8} onPress={() => handleSend(s.label)}>
                  <Ionicons name="chatbubble-outline" size={13} color="#F5A623" />
                  <Text style={styles.chipText}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : (
          <ScrollView ref={scrollRef} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
            {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
          </ScrollView>
        )}

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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10,
  },
  menuBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  topBarIcons: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  badge: {
    position: 'absolute', top: -4, right: -6, backgroundColor: '#F5A623',
    borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
  chatContent:   { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
  welcomeTitle:  { fontSize: 22, fontWeight: '800', color: '#3B1F00', textAlign: 'center', marginBottom: 20 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 24 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFF3E0', borderWidth: 1, borderColor: '#F5C070',
    borderRadius: 20, paddingVertical: 7, paddingHorizontal: 14,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: '#5C3A00' },
  bubble: {
    maxWidth: '78%', borderRadius: 16, padding: 12,
    marginBottom: 10, minWidth: 60, minHeight: 40, justifyContent: 'center',
  },
  userBubble: { backgroundColor: '#F5A623', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  botBubble:  { backgroundColor: '#FFF3E0', alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#F5C070' },
  bubbleText:     { fontSize: 13, lineHeight: 20 },
  userBubbleText: { color: '#fff' },
  botBubbleText:  { color: '#3B1F00' },
  inputBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: '#E0D0B8',
    backgroundColor: '#FFFDF5', gap: 8,
  },
  addBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  input: {
    flex: 1, backgroundColor: '#FFF3E0', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8, fontSize: 13,
    color: '#3B1F00', maxHeight: 100, borderWidth: 1, borderColor: '#F5C070',
  },
  micBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#F5A623', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8,
  },
  micBtnDisabled: { backgroundColor: '#C4A882' },
  micLines: { color: '#fff', fontSize: 10, letterSpacing: 1 },
});