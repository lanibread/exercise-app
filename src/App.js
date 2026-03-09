import React, { useState } from 'react';
import RepetitionExercise from './components/RepetitionExercise';
import DurationExercise from './components/DurationExercise';

function App() {
  const [selectedExercise, setSelectedExercise] = useState(null);

  const exercises = [
    { name: "Push Ups", type: "repetition" },
    { name: "Running", type: "duration" },
    { name: "Plank", type: "duration" },
    { name: "Sit Ups", type: "repetition" }
  ];

  let content;

    if (selectedExercise) {
      if (selectedExercise.type === "repetition") {
      content = (
        <RepetitionExercise 
          name={selectedExercise.name} 
          returnToMenu={() => setSelectedExercise(null)} 
        />
      );
      } else {
      content = (
        <DurationExercise 
          name={selectedExercise.name} 
          returnToMenu={() => setSelectedExercise(null)} 
        />
      );
    }
  } else {
    content = (
      <div style={{ textAlign: "center" }}>
        <h1>Go Exercise!</h1>
         <p>Select an exercise:</p>
        {exercises.map((ex) => (
          <button 
            key={ex.name} 
            style={{ display: "block", margin: "10px auto", padding: "10px 20px", fontSize: "1.1rem" }}
            onClick={() => setSelectedExercise(ex)}
          >
          {ex.name}
          </button>
        ))}
      </div>
    );
  }

  return <div className="App">{content}</div>;
}
export default App;