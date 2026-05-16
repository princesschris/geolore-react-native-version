import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';

const INITIAL_MESSAGES = [
  { id: '1', text: "Hey! How's it going?", isUser: false },
  { id: '2', text: '', isUser: true, isOrange: true },
  { id: '3', text: '', isUser: false, isLight: true },
  { id: '4', text: '', isUser: true, isOrange: true },
  { id: '5', text: '', isUser: false, isLight: true },
  { id: '6', text: '', isUser: true, isOrange: true },
  { id: '7', text: '', isUser: false, isLight: true },
];

const MessageBubble = ({ message }) => {
  if (!message.text && !message.isOrange && !message.isLight) return null;

  return (
    <View style={[
      styles.bubble,
      message.isUser ? styles.userBubble : styles.otherBubble,
      message.isOrange && styles.orangeBubble,
      message.isLight && styles.lightBubble,
    ]}>
      {message.text ? (
        <Text style={[styles.bubbleText, message.isUser && styles.userBubbleText]}>
          {message.text}
        </Text>
      ) : (
        // Empty placeholder bubble (like in the Figma)
        <View style={styles.emptyBubbleContent} />
      )}
    </View>
  );
};

export default function ChatScreen({ navigation, route }) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const flatListRef = useRef(null);

  const contactName = route?.params?.name ?? 'Princessa';

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      isOrange: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      {/* Chat Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={22} color="#5C3A00" />
        </TouchableOpacity>
        <View style={styles.avatarSmall}>
          <Ionicons name="person" size={18} color="#C4A882" />
        </View>
        <Text style={styles.headerName}>{contactName}</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeText}>Today</Text>
            </View>
          }
        />

        {/* Input Bar */}
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
          <TouchableOpacity style={styles.micBtn} onPress={handleSend}>
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6D6',
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmall: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5E6CC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F5C070',
  },
  headerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3B1F00',
  },

  // Messages
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 8,
  },
  dateBadge: {
    alignSelf: 'center',
    backgroundColor: '#F5E6CC',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  dateBadgeText: {
    fontSize: 11,
    color: '#A08060',
    fontWeight: '600',
  },
  bubble: {
    maxWidth: '70%',
    borderRadius: 16,
    padding: 10,
    marginBottom: 6,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  orangeBubble: {
    backgroundColor: '#F5A623',
    minWidth: 120,
    minHeight: 36,
  },
  lightBubble: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#F5C070',
    minWidth: 100,
    minHeight: 36,
  },
  bubbleText: {
    fontSize: 13,
    color: '#3B1F00',
    lineHeight: 20,
  },
  userBubbleText: {
    color: '#fff',
  },
  emptyBubbleContent: {
    minWidth: 80,
    minHeight: 16,
  },

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
  emojiBtn: {
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