import React, {useRef, useState} from 'react';
import {Button, StyleSheet, Text, View, Dimensions} from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State,
  TapGestureHandler,
  TextInput,
  TouchableHighlight,
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
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const rotationY = useSharedValue(0);
  const rotationX = useSharedValue(0);
  const shareButtonsOpacity = useSharedValue(0);

  const [shareMode, setShareMode] = useState(true);

  const cardTransform = useAnimatedStyle(() => {
    return {
      transform: [
        {translateY: translateY.value},
        {rotateX: `${rotationX.value}deg`},
        {rotateY: `${rotationY.value}deg`},
        {scale: scale.value},
      ],
    };
  });

  const shareOptionsStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
      opacity: shareButtonsOpacity.value,
    };
  });

  const shareCard = () => {
    if (shareMode) {
      rotationY.value = withSpring(0, springConfig);
      scale.value = withSpring(1, springConfig);
      translateY.value = withSpring(0, springConfig);
      shareButtonsOpacity.value = withSpring(0, springConfig);
    } else {
      rotationY.value = withSpring(180, springConfig);
      scale.value = withSpring(0.5, springConfig);
      translateY.value = withSpring(-140, springConfig);
      shareButtonsOpacity.value = withSpring(1, springConfig);
    }
    setShareMode(!shareMode);
  };
  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <Animated.View style={[styles.card, cardTransform]}>
          <View style={{padding: 20}}>
            <Text style={styles.heading}>Your Ecard</Text>
          </View>
        </Animated.View>
        <Animated.View style={[shareOptionsStyle]}>
          <View>
            <TouchableHighlight style={styles.shareSocialButton} onPress={null}>
              <Text style={styles.buttonLabel}>Share</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.printButton} onPress={null}>
              <Text style={styles.buttonLabel}>Print</Text>
            </TouchableHighlight>
          </View>
        </Animated.View>
      </View>
      <Button title={'share'} onPress={shareCard} style={styles.shareButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5352ed',
  },
  buttonLabel: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  card: {
    height: wHeight - 220,
    width: wWidth - 20,
    backgroundColor: 'white',
    borderRadius: 10,
    // overflow: 'hidden',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
  shareButton: {
    position: 'absolute',
    top: 30,
    left: 30,
  },
  shareSocialButton: {
    paddingLeft: 50,
    paddingRight: 50,
    borderRadius: 40,
    padding: 15,

    backgroundColor: '#ff4757',
  },
  printButton: {
    paddingLeft: 50,
    paddingRight: 50,
    borderRadius: 40,
    padding: 15,

    backgroundColor: 'transparent',
  },
});
