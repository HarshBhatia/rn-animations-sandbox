import React, {useRef, useState} from 'react';
import {Button, StyleSheet, Text, View, Dimensions} from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State,
  TapGestureHandler,
  TextInput,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.box} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    elevation: 5,
    height: 200,
    width: 200,
    backgroundColor: 'blue',
    borderRadius: 10,
  },
});

export default App;
