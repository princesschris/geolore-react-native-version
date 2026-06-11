import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value:          string;
  onChangeText:   (text: string) => void;
  placeholder?:   string;
  collapsed?:     boolean;
  onIconPress?:   () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search',
  collapsed   = false,
  onIconPress,
}: SearchBarProps) {
  const widthAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue:         collapsed ? 0 : 1,
      useNativeDriver: false,
      friction:        7,
      tension:         80,
    }).start();
  }, [collapsed]);

  const containerWidth = widthAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0%', '100%'],
  });

  const inputOpacity = widthAnim.interpolate({
    inputRange:  [0, 0.4, 1],
    outputRange: [0,  0,   1],
  });

  if (collapsed) {
    return (
      <TouchableOpacity style={styles.iconOnly} onPress={onIconPress} activeOpacity={0.8}>
        <Ionicons name="search-outline" size={18} color="#5C3A00" />
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View style={[styles.container, { width: containerWidth }]}>
      <Ionicons name="search-outline" size={18} color="#A08060" />
      <Animated.View style={{ flex: 1, opacity: inputOpacity }}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#C4B49A"
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:  'row',
    alignItems:     'center',
    backgroundColor: '#fff',
    borderRadius:   24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#333',
  },
  iconOnly: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
});