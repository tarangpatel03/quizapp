import { Box } from '../components/Box';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HomeScreen = () => {
  const [randoms, setRandoms] = useState({ a: 0, b: 0 });
  const [answers, setAnswers] = useState<number[]>([]);

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

  const next = () => {
    generateRandom();
  };

  useEffect(() => {
    generateRandom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.question}>
        <Text style={styles.questionText}>{`${randoms.a} + ${randoms.b}`}</Text>
      </View>
      <View style={styles.box} />
      <View style={styles.options}>
        <Box value={answers[0]} />
        <Box value={answers[1]} />
        <Box value={answers[2]} />
        <Box value={answers[3]} />
      </View>
      <TouchableOpacity onPress={next}>
        <Text>{'Next'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  box: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderRadius: 12,
  },
  question: {
    paddingBottom: 20,
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
