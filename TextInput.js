import React, {useRef, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
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

const springConfig = {
  mass: 0.5,
  stiffness: 70,
  damping: 100,
};

export default function AnimatedStyleUpdateExample(props) {
  const translation = {x: useSharedValue(0), y: useSharedValue(0)};
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const [textValue, setTextValue] = useState('Drag me');
  const [isEditing, setIsEditing] = useState(false);

  const rotationRef = useRef(null);
  const tapRef = useRef(null);
  const panRef = useRef(null);
  const pinchRef = useRef(null);
  const textInputRef = useRef(null);

  const boxStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translation.x.value,
        },
        {
          translateY: translation.y.value,
        },
        {
          rotateZ: `${rotation.value}rad`,
        },
        {scale: scale.value},
      ],
    };
  });

  const onPanGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translation.x.value;
      ctx.startY = translation.y.value;
      ctx.initialScale = scale.value;
      scale.value = withSpring(ctx.initialScale * 0.95, springConfig);
      textInputRef.current && textInputRef.current.blur();
    },
    onActive: (event, ctx) => {
      translation.x.value = ctx.startX + event.translationX;
      translation.y.value = ctx.startY + event.translationY;
    },
    onEnd: (_) => {
      const initialScale = scale.value;
      scale.value = withSpring(initialScale / 0.95, springConfig);
    },
  });

  const onPinchGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.start = scale.value;
      textInputRef.current && textInputRef.current.blur();
    },
    onActive: (event, ctx) => {
      scale.value = withSpring(ctx.start * event.scale, springConfig);
    },
  });

  const onRotateGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.start = rotation.value;
      textInputRef.current && textInputRef.current.blur();
    },
    onActive: (event, ctx) => {
      rotation.value = ctx.start + event.rotation;
    },
  });

  const onSingleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setIsEditing(true);
      textInputRef.current && textInputRef.current.focus();
    }
  };

  const reset = () => {
    textInputRef.current && textInputRef.current.blur();
    setIsEditing(false);
    translation.x.value = withSpring(0, springConfig);
    translation.y.value = withSpring(0, springConfig);
    rotation.value = withSpring(0, springConfig);
    scale.value = withSpring(1, springConfig);
  };

  function setEditingFalse() {
    setIsEditing(false);
  }

  return (
    <View style={styles.container}>
      <View>
        <TapGestureHandler ref={tapRef} onHandlerStateChange={onSingleTap}>
          <Animated.View style={boxStyle}>
            <RotationGestureHandler
              ref={rotationRef}
              simultaneousHandlers={[pinchRef, panRef]}
              onGestureEvent={onRotateGestureEvent}>
              <Animated.View style={boxStyle}>
                <PinchGestureHandler
                  ref={pinchRef}
                  simultaneousHandlers={[panRef, rotationRef]}
                  onGestureEvent={onPinchGestureEvent}>
                  <Animated.View style={boxStyle}>
                    <PanGestureHandler
                      ref={panRef}
                      waitFor={tapRef}
                      simultaneousHandlers={[pinchRef, rotationRef]}
                      onGestureEvent={onPanGestureEvent}>
                      <Animated.View style={[styles.box, boxStyle]}>
                        {isEditing ? (
                          <TextInput
                            ref={textInputRef}
                            scrollEnabled={false}
                            editable={true}
                            onChangeText={(text) => setTextValue(text)}
                            value={textValue}
                            style={styles.text}
                            onSubmitEditing={setEditingFalse}
                            returnKeyLabel={'Boom'}
                          />
                        ) : (
                          <Text style={styles.text}>{textValue}</Text>
                        )}
                      </Animated.View>
                    </PanGestureHandler>
                  </Animated.View>
                </PinchGestureHandler>
              </Animated.View>
            </RotationGestureHandler>
          </Animated.View>
        </TapGestureHandler>
      </View>
      <Button title="Reset" onPress={reset} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 150,
    height: 50,
    backgroundColor: 'transparent',

    borderRadius: 5,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    elevation: 5,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  text: {
    flex: 1,
    color: 'white',
    fontFamily: 'sans-serif',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  wrapper: {
    // flex: 1,
  },
});
