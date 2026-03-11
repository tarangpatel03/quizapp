import { Box } from '../components/Box';
import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appEvents } from '../config/events';

export const HomeScreen = () => {
  const [randoms, setRandoms] = useState({ a: 0, b: 0 });
  const [answers, setAnswers] = useState<number[]>([]);

  // Set Referance and position for Dropzone
  const dropRef = useRef<View>(null);
  const [dropZone, setDropZone] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  function shuffle(arr: number[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const generateRandom = () => {
    const randomA = Number((Math.random() * 100).toFixed(0));
    const randomB = Number((Math.random() * 100).toFixed(0));
    setRandoms({
      a: randomA,
      b: randomB,
    });
    let i = 0;
    const ans = randomA + randomB;
    const options: number[] = [ans];
    while (i < 3) {
      const option = Number((Math.random() * 200).toFixed(0));
      if (!options.includes(option)) {
        options.push(option);
        i++;
      }
    }
    setAnswers(shuffle(options));
  };

  // Emit event to reset options position & style
  const next = () => {
    DeviceEventEmitter.emit(appEvents.onNext);
    generateRandom();
  };

  // Get position of droping place
  useEffect(() => {
    setTimeout(() => {
      dropRef.current?.measure((x, y, width, height, pageX, pageY) => {
        setDropZone({ x: pageX, y: pageY, width, height });
      });
    }, 300);
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      appEvents.afterAnswer,
      () => {
        next();
      },
    );

    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    generateRandom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Text style={styles.questionText}>{`${randoms.a} + ${randoms.b}`}</Text>
        {/* Drop point */}
        <View
          ref={dropRef}
          onLayout={e => {
            setDropZone(e.nativeEvent.layout);
          }}
          style={styles.box}
        />
        <View style={styles.options}>
          <Box
            value={answers[0]}
            answer={randoms.a + randoms.b}
            dropZone={dropZone}
            index={0}
          />
          <Box
            value={answers[1]}
            answer={randoms.a + randoms.b}
            dropZone={dropZone}
            index={1}
          />
          <Box
            value={answers[2]}
            answer={randoms.a + randoms.b}
            dropZone={dropZone}
            index={2}
          />
          <Box
            value={answers[3]}
            answer={randoms.a + randoms.b}
            dropZone={dropZone}
            index={3}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  view: {
    gap: 24,
    position: 'absolute',
    alignItems: 'center',
  },
  box: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderRadius: 10,
  },
  questionText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  options: {
    gap: 12,
    flexDirection: 'row',
  },
});
