import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, ButtonGroup, Card } from '@rneui/themed';

const Stack = createNativeStackNavigator();

/**
 * QUESTION COMPONENT
 */
export const Question = ({ route, navigation }) => {
  const { data, index, userResponses = [] } = route.params;
  const currentQuestion = data[index];
  const [selectedIndex, setSelectedIndex] = useState(
    currentQuestion.type === 'multiple-answer' ? [] : null
  );

  const handleSelect = (idx) => {
    if (currentQuestion.type === 'multiple-answer') {
      if (selectedIndex.includes(idx)) {
        setSelectedIndex(selectedIndex.filter((i) => i !== idx));
      } else {
        setSelectedIndex([...selectedIndex, idx]);
      }
    } else {
      setSelectedIndex(idx);
    }
  };

  const handleNext = () => {
    const updatedResponses = [...userResponses, selectedIndex];
    
    if (index + 1 < data.length) {
      navigation.navigate('Question', {
        data,
        index: index + 1,
        userResponses: updatedResponses,
      });
    } else {
      navigation.navigate('Summary', { data, userResponses: updatedResponses });
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title>{`Question ${index + 1}`}</Card.Title>
        <Card.Divider />
        <Text style={styles.prompt}>{currentQuestion.prompt}</Text>
        
        <ButtonGroup
          testID="choices"
          buttons={currentQuestion.choices}
          selectMultiple={currentQuestion.type === 'multiple-answer'}
          selectedIndexes={currentQuestion.type === 'multiple-answer' ? selectedIndex : []}
          selectedIndex={currentQuestion.type !== 'multiple-answer' ? selectedIndex : null}
          onPress={handleSelect}
          vertical
        />

        <Button
          testID="next-question"
          title={index === data.length - 1 ? "Finish" : "Next Question"}
          onPress={handleNext}
          containerStyle={styles.button}
          disabled={currentQuestion.type === 'multiple-answer' ? selectedIndex.length === 0 : selectedIndex === null}
        />
      </Card>
    </View>
  );
};

/**
 * SUMMARY COMPONENT
 * Calculates final score and renders feedback.
 */
export const Summary = ({ route }) => {
  const { data, userResponses } = route.params;

  const calculateScore = () => {
    let score = 0;
    data.forEach((q, i) => {
      const userAns = userResponses[i];
      if (Array.isArray(q.correct)) {
        // Sort both to compare arrays for multiple-answer
        const isCorrect = 
          Array.isArray(userAns) &&
          userAns.length === q.correct.length &&
          userAns.every(val => q.correct.includes(val));
        if (isCorrect) score++;
      } else {
        if (userAns === q.correct) score++;
      }
    });
    return score;
  };

  const renderFeedback = (q, i) => {
    const userAns = userResponses[i];
    const isCorrect = Array.isArray(q.correct) 
      ? (Array.isArray(userAns) && userAns.length === q.correct.length && userAns.every(v => q.correct.includes(v)))
      : userAns === q.correct;

    return (
      <View key={i} style={styles.summaryItem}>
        <Text style={styles.summaryPrompt}>{i + 1}. {q.prompt}</Text>
        {q.choices.map((choice, cIdx) => {
          const wasSelected = Array.isArray(userAns) ? userAns.includes(cIdx) : userAns === cIdx;
          const isActualCorrect = Array.isArray(q.correct) ? q.correct.includes(cIdx) : q.correct === cIdx;

          let textStyle = { marginVertical: 2 };
          if (wasSelected && isActualCorrect) textStyle.fontWeight = 'bold';
          if (wasSelected && !isActualCorrect) textStyle.textDecorationLine = 'line-through';
          if (!wasSelected && isActualCorrect) textStyle.color = 'green'; // Show correct answer if missed

          return <Text key={cIdx} style={textStyle}>- {choice}</Text>;
        })}
        <Text style={{ color: isCorrect ? 'green' : 'red', marginTop: 5 }}>
          {isCorrect ? "✓ Correct" : "✗ Incorrect"}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Title>Quiz Results</Card.Title>
        <Text testID="total" style={styles.scoreText}>
          Total Score: {calculateScore()} / {data.length}
        </Text>
        <Card.Divider />
        {data.map((q, i) => renderFeedback(q, i))}
      </Card>
    </ScrollView>
  );
};

/**
 * MAIN APP ENTRY
 */
export default function App() {
  const quizData = [
    {
      "prompt": "Which of these are primary colors?",
      "type": "multiple-choice",
      "choices": ["Red", "Green", "Purple", "Orange"],
      "correct": 0
    },
    {
      "prompt": "Select all even numbers:",
      "type": "multiple-answer",
      "choices": ["2", "5", "8", "11"],
      "correct": [0, 2]
    },
    {
      "prompt": "React Native is a framework for web only.",
      "type": "true-false",
      "choices": ["True", "False"],
      "correct": 1
    }
  ];

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Question">
        <Stack.Screen 
          name="Question" 
          component={Question} 
          initialParams={{ data: quizData, index: 0, userResponses: [] }}
        />
        <Stack.Screen name="Summary" component={Summary} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  prompt: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  summaryItem: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryPrompt: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 5,
  }
});