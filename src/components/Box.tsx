import { StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

type Props = {
  value: number;
};

export const Box = (props: Props) => {
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);
  const prevPositionX = useSharedValue(0);
  const prevPositionY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      prevPositionX.value = positionX.value;
      prevPositionY.value = positionY.value;
    })
    .onUpdate(e => {
      positionX.value = prevPositionX.value + e.translationX;
      positionY.value = prevPositionY.value + e.translationY;
    })
    .onEnd(() => {});

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: positionX.value },
      { translateY: positionY.value },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.box, animatedStyle]}>
        <Text style={styles.text}>{props.value}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  box: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
});
