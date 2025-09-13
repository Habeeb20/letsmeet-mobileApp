import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from "../../colors"

import Icon from 'react-native-vector-icons/FontAwesome';

const CustomError = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <Icon name="exclamation-circle" size={50} color={colors.primary} style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1DDD3FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  retryText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CustomError;