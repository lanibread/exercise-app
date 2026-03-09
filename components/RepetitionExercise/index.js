import React, { useState } from 'react';

function RepetitionExercise({ name }) {
  const [count, setCount] = useState(0);

  return (
    <div className="exercise-screen">
      <h2>{name}</h2>
      <p className="counter-display">{count}</p>
      <div className="controls">
        <button onClick={() => setCount(count + 1)}>Add Rep</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>
    </div>
  );
}

export default RepetitionExercise;