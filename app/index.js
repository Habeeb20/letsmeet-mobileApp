import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import Onboarding1 from './onboarding1';

import Onboarding2 from './onboarding2';
import Onboarding3 from './onboarding3';

import { useNavigation } from 'expo-router';

const Index = () => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);

  const renderPagination = (index, total, context) => {
    return (
      <View style={styles.pagination}>
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              index === i ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <Swiper
      style={styles.wrapper}
      showsButtons={false}
      loop={false}
      index={index}
      onIndexChanged={setIndex}
      dotStyle={styles.dot}
      activeDotStyle={styles.activeDot}
      paginationStyle={styles.pagination}
      renderPagination={renderPagination}
    >
      <View style={styles.slide}>
        <Onboarding1 />
      </View>
      <View style={styles.slide}>
        <Onboarding2 />
      </View>
      <View style={styles.slide}>
        <Onboarding3 />
      </View>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 3,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: '#000',
  },
});

export default Index;