import React, { useState, useEffect } from 'react';

function DurationExercise({ name }) {
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 10); // Update every 10ms
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running]);

  // Helper to pad numbers: 0 -> "00", 5 -> "05"
  const formatTime = (time) => {
    let mins = Math.floor((time / 60000) % 60).toString().padStart(2, "0");
    let secs = Math.floor((time / 1000) % 60).toString().padStart(2, "0");
    let mills = Math.floor((time / 10) % 100).toString().padStart(2, "0");
    return `${mins}:${secs}:${mills}`;
  };

  return (
    <div className="exercise-screen">
      <h2>{name}</h2>
      <p className="timer-display">{formatTime(timer)}</p>
      <div className="controls">
        {!running ? (
          <button onClick={() => setRunning(true)}>Start</button>
        ) : (
          <button onClick={() => setRunning(false)}>Stop</button>
        )}
        <button onClick={() => { setTimer(0); setRunning(false); }}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default DurationExercise;