// utils/keyboardUtils.js
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

// Reusable function to wrap input fields and keep them above the keyboard
export const withKeyboardAvoiding = (
  children,
  options = {
    behavior: Platform.OS === 'ios' ? 'padding' : 'height', // Platform-specific behavior
    keyboardVerticalOffset: Platform.OS === 'ios' ? 100 : 80, // Adjust offset as needed
    style: {}, // Custom styles for KeyboardAvoidingView
  }
) => {
  return (
    <KeyboardAvoidingView
      style={[styles.container, options.style]}
      behavior={options.behavior}
      keyboardVerticalOffset={options.keyboardVerticalOffset}
      enabled
    >
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure it takes up available space
  },
});