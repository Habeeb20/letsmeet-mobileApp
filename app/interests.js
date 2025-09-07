



import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Footer from "./others/Footer"
import colors from "./../colors"
import LoveLoader from "./others/LoveLoader";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { submitInterests } from '../constants/api';

const Interests = ({ navigation }) => {
  const router = useRouter();
  const { email } = useLocalSearchParams(); // Retrieve email from route params
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const interestOptions = [
    'Music', 'Travel', 'Food', 'Sports', 'Movies', 'Gaming', 'Art', 'Fitness',
  ];

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleNext = async () => {
    if (selectedInterests.length === 0) {
      Alert.alert('Error', 'Please select at least one interest');
      return;
    }
    setIsLoading(true);
    try {
      await submitInterests(email, selectedInterests);
      router.push({ pathname: '/contacts', params: { email } });
    } catch (error) {
      console.error('Failed to save interests:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save interests');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/datingLogo.jpeg')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Select your interests</Text>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.interestsContainer}>
          {interestOptions.map((interest) => (
            <TouchableOpacity
              key={interest}
              style={[
                styles.interestButton,
                selectedInterests.includes(interest) && styles.selectedInterest,
              ]}
              onPress={() => toggleInterest(interest)}
            >
              <Text style={styles.interestText}>{interest}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.button}
        onPress={handleNext}
        disabled={isLoading || selectedInterests.length === 0}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.buttonText} />
        ) : (
          <Text style={styles.buttonText}>Next</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    padding: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 40,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 40,
  },
  scroll: {
    width: '100%',
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '80%',
  },
  interestButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  selectedInterest: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  interestText: {
    color: colors.textPrimary,
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    width: '85%',
    marginTop: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Interests;