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

const {height: wHeight, width: wWidth} = Dimensions.get('window');

const springConfig = {
  mass: 0.5,
  stiffness: 70,
  damping: 10,
};

export default function AnimatedStyleUpdateExample(props) {
  const modalY = useSharedValue(wHeight - 100);
  const modalScale = useSharedValue(1);
  const modalWidth = useSharedValue(wWidth - 20);
  const modalShadow = useSharedValue(5);

  const modalTransform = useAnimatedStyle(() => {
    return {
      transform: [{translateY: modalY.value}, {scale: modalScale.value}],
      width: modalWidth.value,
      elevation: modalShadow.value,
    };
  });

  const showModal = () => {
    modalY.value = withSpring(0, springConfig);
  };

  const onPanGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = modalY.value;
      modalScale.value = withSpring(0.95, springConfig);
      modalShadow.value = withSpring(0, springConfig);
    },
    onActive: (event, ctx) => {
      modalY.value = ctx.startY + event.translationY;
    },
    onCancel: () => {
      modalScale.value = withSpring(1, springConfig);
    },
    onEnd: (_, ctx) => {
      modalScale.value = withSpring(1, springConfig);
      modalShadow.value = withSpring(5, springConfig);

      if (Math.abs(modalY.value - ctx.startY) > 50) {
        modalY.value = withSpring(
          ctx.startY > wHeight / 2 ? 10 : wHeight - 100,
          springConfig,
        );
      } else {
        modalY.value = withSpring(
          ctx.startY < wHeight / 2 ? 10 : wHeight - 100,
          springConfig,
        );
      }

      modalWidth.value = withSpring(
        ctx.startY > wHeight / 2 ? wWidth : wWidth - 20,
        springConfig,
      );
    },
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={onPanGestureEvent}>
        <Animated.View style={[styles.modal, modalTransform]}>
          <View style={{padding: 20}}>
            <View style={styles.handle} />
            <Text style={styles.heading}>Fonts</Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: '#5352ed',
  },
  handle: {
    backgroundColor: '#e3e3e3',
    marginLeft: 140,
    marginRight: 140,
    borderRadius: 5,
    height: 5,
  },
  modal: {
    height: wHeight,
    backgroundColor: 'white',
    borderRadius: 20,
    // overflow: 'hidden',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
});
