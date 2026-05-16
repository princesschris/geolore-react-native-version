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
  { id: '1',  text: 'Princess',  isUser: false, showName: true,  isLight: true },
  { id: '2',  text: 'Princess',  isUser: false, showName: false, isLight: true },
  { id: '3',  text: 'Chielotam', isUser: false, showName: true,  isLight: true },
  { id: '4',  text: '',          isUser: true,  isOrange: true },
  { id: '5',  text: 'Princess',  isUser: false, showName: true,  isLight: true },
  { id: '6',  text: 'Princess',  isUser: false, showName: false, isLight: true },
  { id: '7',  text: 'Chielotam', isUser: false, showName: true,  isLight: true },
  { id: '8',  text: '',          isUser: true,  isOrange: true },
];

const MessageBubble = ({ message }) => (
  <View style={[styles.bubbleWrapper, message.isUser && styles.bubbleWrapperRight]}>
    {!message.isUser && message.showName && (
      <Text style={styles.senderName}>{message.text}</Text>
    )}
    <View style={[
      styles.bubble,
      message.isOrange ? styles.orangeBubble : styles.lightBubble,
    ]}>
      {!message.isOrange && (
        <Text style={styles.bubbleText}>{message.text}</Text>
      )}
    </View>
  </View>
);

export default function GroupChatScreen({ navigation, route }) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const flatListRef = useRef(null);
  const groupName = route?.params?.name ?? 'GeoLore';

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      isOrange: true,
    }]);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      {/* Header */}
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

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6D6',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
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
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
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
  bubbleWrapper: {
    alignSelf: 'flex-start',
    maxWidth: '75%',
    marginBottom: 8,
  },
  bubbleWrapperRight: {
    alignSelf: 'flex-end',
  },
  senderName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F5A623',
    marginBottom: 3,
    marginLeft: 4,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 100,
    minHeight: 36,
  },
  orangeBubble: {
    backgroundColor: '#F5A623',
    borderBottomRightRadius: 4,
    minWidth: 120,
  },
  lightBubble: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#F5C070',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 13,
    color: '#3B1F00',
    lineHeight: 20,
  },
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
  micLines: { color: '#fff', fontSize: 10, letterSpacing: 1 },
});