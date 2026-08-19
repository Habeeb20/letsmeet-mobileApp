import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const TABS = [
  { key: 'history', label: 'History', icon: 'time-outline', route: '/likedusers' },
  { key: 'likedBy', label: 'Liked you', icon: 'heart-outline', route: '/likedBy' },
  { key: 'visited', label: 'Visited', icon: 'eye-outline', route: '/visitorScreen' },
  { key: 'favorites', label: 'Favorites', icon: 'star-outline', route: '/favorite' },
];

// active: one of 'history' | 'likedBy' | 'visited' | 'favorites' | undefined
const SubNav = ({ active }) => {
  const router = useRouter();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.wrap}
    >
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => !isActive && router.push(tab.route)}
            activeOpacity={0.8}
          >
            {isActive ? (
              <LinearGradient
                colors={['#FF6B6B', '#FF3D77']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.pill}
              >
                <Ionicons name={tab.icon.replace('-outline', '')} size={15} color="#fff" />
                <Text style={styles.pillTextActive}>{tab.label}</Text>
              </LinearGradient>
            ) : (
              <View style={styles.pillInactive}>
                <Ionicons name={tab.icon} size={15} color="#8A7373" />
                <Text style={styles.pillText}>{tab.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 16,
  },
  pillInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F3E4E2',
  },
  pillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#8A7373',
  },
  pillTextActive: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#fff',
  },
});

export default SubNav;