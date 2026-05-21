import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, FlatList, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

interface Message {
  id:         string;
  text:       string;
  sender_id:  string;
  created_at: string;
}

const MessageBubble = ({ message, isUser }: { message: Message; isUser: boolean }) => (
  <View style={[styles.bubble, isUser ? styles.userBubble : styles.otherBubble]}>
    <Text style={[styles.bubbleText, isUser && styles.userBubbleText]}>{message.text}</Text>
  </View>
);

export default function ChatScreen({ navigation, route }: any) {
  const [inputText,  setInputText]  = useState('');
  const [messages,   setMessages]   = useState<Message[]>([]);
  const [loading,    setLoading]    = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const { user } = useAuth();

  const contactName = route?.params?.name ?? 'User';
  const contactId   = route?.params?.id   ?? null;

  // Chat ID is always the two user IDs sorted so both sides get the same chat
  const chatId = [user?.id, contactId].filter(Boolean).sort().join('_');

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    setMessages(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();

    // Real-time subscription — new messages appear instantly
    const channel = supabase
      .channel(`chat_${chatId}`)
      .on('postgres_changes', {
        event:  'INSERT',
        schema: 'public',
        table:  'messages',
        filter: `chat_id=eq.${chatId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [chatId]);

  const handleSend = async () => {
    if (!inputText.trim() || !user?.id) return;
    const text = inputText.trim();
    setInputText('');

    const { error } = await supabase.from('messages').insert({
      chat_id:   chatId,
      sender_id: user.id,
      text,
    });

    if (error) setInputText(text); // restore on failure
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back-outline" size={22} color="#5C3A00" />
        </TouchableOpacity>
        <View style={styles.avatarSmall}>
          <Ionicons name="person" size={18} color="#C4A882" />
        </View>
        <Text style={styles.headerName}>{contactName}</Text>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F5A623" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble message={item} isUser={item.sender_id === user?.id} />
            )}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            ListHeaderComponent={
              <View style={styles.dateBadge}>
                <Text style={styles.dateBadgeText}>Today</Text>
              </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No messages yet. Say hello! 👋</Text>
              </View>
            }
          />
        )}

        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.emojiBtn}>
            <Ionicons name="happy-outline" size={22} color="#A08060" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Message..."
            placeholderTextColor="#C4B49A"
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Ionicons name="send" size={18} color="#fff" />
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12, gap: 10, borderBottomWidth: 1, borderBottomColor: '#F0E6D6' },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  avatarSmall: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F5E6CC', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F5C070' },
  headerName: { fontSize: 16, fontWeight: '800', color: '#3B1F00' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  messagesList: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, gap: 8 },
  dateBadge: { alignSelf: 'center', backgroundColor: '#F5E6CC', borderRadius: 10, paddingVertical: 3, paddingHorizontal: 12, marginBottom: 12 },
  dateBadgeText: { fontSize: 11, color: '#A08060', fontWeight: '600' },
  bubble: { maxWidth: '70%', borderRadius: 16, padding: 10, marginBottom: 6 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#F5A623', borderBottomRightRadius: 4 },
  otherBubble: { alignSelf: 'flex-start', backgroundColor: '#FFF3E0', borderWidth: 1, borderColor: '#F5C070', borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 13, color: '#3B1F00', lineHeight: 20 },
  userBubbleText: { color: '#fff' },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 13, color: '#A08060' },
  inputBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#E0D0B8', backgroundColor: '#FFFDF5', gap: 8 },
  emojiBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, backgroundColor: '#FFF3E0', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, fontSize: 13, color: '#3B1F00', maxHeight: 100, borderWidth: 1, borderColor: '#F5C070' },
  sendBtn: { backgroundColor: '#F5A623', borderRadius: 20, padding: 10, alignItems: 'center', justifyContent: 'center' },
});