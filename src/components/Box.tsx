import { useEffect, useState } from 'react';
import { DeviceEventEmitter, Platform, StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import { appEvents } from '../config/events';

type Props = {
  value: number;
  answer: number;
  index: number;
  dropZone: any;
};

export const Box = (props: Props) => {
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);
  const prevPositionX = useSharedValue(0);
  const prevPositionY = useSharedValue(0);
  const scale = useSharedValue(1);
  const [isCorrect, setIsCorrect] = useState<-1 | 0 | 1>(0);

  const emitAfterAnswer = (correct: -1 | 0 | 1) => {
    setTimeout(() => {
      DeviceEventEmitter.emit(appEvents.afterAnswer, correct);
    }, 500);
  };

  // Set Gesture Detector
  const panGesture = Gesture.Pan()
    .onStart(() => {
      prevPositionX.value = positionX.value;
      prevPositionY.value = positionY.value;
    })
    .onUpdate(e => {
      positionX.value = prevPositionX.value + e.translationX;
      positionY.value = prevPositionY.value + e.translationY;
    })
    .onFinalize(e => {
      scale.value = withTiming(1);
      if (!props.dropZone) return;
      // touch position
      const fingerX = e.absoluteX;
      const fingerY = e.absoluteY;
      // check finger is in dropzone
      const isInside =
        fingerX > props.dropZone.x &&
        fingerX < props.dropZone.x + props.dropZone.width &&
        fingerY > props.dropZone.y &&
        fingerY < props.dropZone.y + props.dropZone.height;
      if (isInside) {
        const result: -1 | 1 = props.value === props.answer ? 1 : -1;
        positionX.value = withTiming(
          Platform.OS === 'android'
            ? props.dropZone.x -
                props.index * 80 -
                props.dropZone.width +
                (3 - props.index) * 12 -
                2
            : props.dropZone.x -
                props.index * 80 -
                props.dropZone.width +
                (3 - props.index) * 12 +
                2,
        );
        positionY.value = withTiming(
          Platform.OS === 'android'
            ? props.dropZone.y - 538
            : props.dropZone.y - 514,
        );
        runOnJS(setIsCorrect)(result);
        runOnJS(emitAfterAnswer)(result);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: positionX.value },
      { translateY: positionY.value },
    ],
  }));

  // Event listner to reset position & style of optionBox
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      appEvents.onNext,
      () => {
        setIsCorrect(0);
        positionX.value = 0;
        positionY.value = 0;
      },
    );

    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.box,
          animatedStyle,
          isCorrect === 1
            ? styles.correctAnswer
            : isCorrect === -1
            ? styles.wrongAnswer
            : null,
        ]}
      >
        <Text style={[styles.text, styles.correctText]}>{props.value}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  box: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#E5E5E5',
    backgroundColor: '#7C3AED',
  },
  wrongAnswer: {
    backgroundColor: '#DC2626',
  },
  correctAnswer: {
    backgroundColor: '#16A34A',
  },
  correctText: {
    color: '#FFFFFF',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
