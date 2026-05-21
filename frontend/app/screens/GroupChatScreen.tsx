import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, FlatList, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

interface GroupMessage {
  id:          string;
  text:        string;
  sender_id:   string;
  sender_name: string;
  created_at:  string;
}

const MessageBubble = ({ message, isUser }: { message: GroupMessage; isUser: boolean }) => (
  <View style={[styles.bubbleWrapper, isUser && styles.bubbleWrapperRight]}>
    {!isUser && (
      <Text style={styles.senderName}>{message.sender_name}</Text>
    )}
    <View style={[styles.bubble, isUser ? styles.orangeBubble : styles.lightBubble]}>
      <Text style={[styles.bubbleText, isUser && styles.userBubbleText]}>{message.text}</Text>
    </View>
  </View>
);

export default function GroupChatScreen({ navigation, route }: any) {
  const [inputText, setInputText] = useState('');
  const [messages,  setMessages]  = useState<GroupMessage[]>([]);
  const [loading,   setLoading]   = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const { user } = useAuth();

  const groupName = route?.params?.name ?? 'GeoLore';
  const groupId   = route?.params?.id   ?? 'default_group';

  useEffect(() => {
    // Initial fetch
    supabase
      .from('group_messages')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setMessages(data ?? []);
        setLoading(false);
      });

    // Real-time subscription
    const channel = supabase
      .channel(`group_${groupId}`)
      .on('postgres_changes', {
        event:  'INSERT',
        schema: 'public',
        table:  'group_messages',
        filter: `group_id=eq.${groupId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as GroupMessage]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [groupId]);

  const handleSend = async () => {
    if (!inputText.trim() || !user?.id) return;
    const text        = inputText.trim();
    const senderName  = user.first_name
      ? `${user.first_name} ${user.last_name}`
      : 'User';
    setInputText('');

    const { error } = await supabase.from('group_messages').insert({
      group_id:    groupId,
      sender_id:   user.id,
      sender_name: senderName,
      text,
    });

    if (error) setInputText(text); // restore on failure
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back-outline" size={22} color="#5C3A00" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerCenter}
          onPress={() => navigation?.navigate('GroupInfo', { name: groupName })}
        >
          <View style={styles.avatarSmall}>
            <Ionicons name="people" size={18} color="#C4A882" />
          </View>
          <Text style={styles.headerName}>{groupName}</Text>
        </TouchableOpacity>
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
                <Text style={styles.emptyText}>No messages yet. Start the conversation! 🌍</Text>
              </View>
            }
          />
        )}

        <View style={styles.inputBar}>
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12, gap: 12, borderBottomWidth: 1, borderBottomColor: '#F0E6D6' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  avatarSmall: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F5E6CC', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F5C070' },
  headerName: { fontSize: 16, fontWeight: '800', color: '#3B1F00' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  messagesList: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
  dateBadge: { alignSelf: 'center', backgroundColor: '#F5E6CC', borderRadius: 10, paddingVertical: 3, paddingHorizontal: 12, marginBottom: 12 },
  dateBadgeText: { fontSize: 11, color: '#A08060', fontWeight: '600' },
  bubbleWrapper: { alignSelf: 'flex-start', maxWidth: '75%', marginBottom: 8 },
  bubbleWrapperRight: { alignSelf: 'flex-end' },
  senderName: { fontSize: 11, fontWeight: '700', color: '#F5A623', marginBottom: 3, marginLeft: 4 },
  bubble: { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, minWidth: 80 },
  orangeBubble: { backgroundColor: '#F5A623', borderBottomRightRadius: 4 },
  lightBubble: { backgroundColor: '#FFF3E0', borderWidth: 1, borderColor: '#F5C070', borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 13, color: '#3B1F00', lineHeight: 20 },
  userBubbleText: { color: '#fff' },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 13, color: '#A08060', textAlign: 'center' },
  inputBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#E0D0B8', backgroundColor: '#FFFDF5', gap: 8 },
  input: { flex: 1, backgroundColor: '#FFF3E0', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, fontSize: 13, color: '#3B1F00', maxHeight: 100, borderWidth: 1, borderColor: '#F5C070' },
  sendBtn: { backgroundColor: '#F5A623', borderRadius: 20, padding: 10, alignItems: 'center', justifyContent: 'center' },
});