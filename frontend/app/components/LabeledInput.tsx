import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder = '',
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  secureTextEntry = false,
  showToggle = false,
  onToggleShow,
  isPasswordVisible,
}: {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: string;
  autoCapitalize?: string;
  autoCorrect?: boolean;
  secureTextEntry?: boolean;
  showToggle?: boolean;
  onToggleShow?: () => void;
  isPasswordVisible?: boolean;
}) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputRow, showToggle && styles.inputRowWithToggle]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#C4B49A"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
        />
        {showToggle && (
          <TouchableOpacity onPress={onToggleShow} style={styles.toggleBtn}>
            <Text style={styles.toggleText}>
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A08060',
    marginBottom: 6,
  },
  inputRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0D0B8',
  },
  inputRowWithToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 13,
    color: '#333',
    paddingHorizontal: 2,
  },
  toggleBtn: {
    paddingHorizontal: 4,
  },
  toggleText: {
    fontSize: 12,
    color: '#F5A623',
    fontWeight: '600',
  },
});