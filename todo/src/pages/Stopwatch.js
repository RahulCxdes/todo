import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';

const Stopwatch = ({ activityId, onStop }) => {
  const [seconds, setSeconds] = useState(0);
  const [minutesPassed, setMinutesPassed] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { username } = useContext(AuthContext);

  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  useEffect(() => {
    if (seconds >= 60) {
      setMinutesPassed(prevMinutes => prevMinutes + 1);
      setSeconds(0);
      updateXP(1);
    }
  }, [seconds]);

  const updateXP = async (minutes) => {
    try {
      await axios.post('https://todo-8.onrender.com/api/stopwatches/update-time', {
        activityId,
        time: minutes,
        username,
      });
    } catch (error) {
      console.error('Error updating XP:', error);
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsActive(false);
    onStop();
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center w-60 h-60 bg-blue-100 rounded-full shadow-xl">
        <div className="absolute text-4xl font-mono text-gray-800">
          {minutesPassed}:{('0' + (seconds % 60)).slice(-2)}
        </div>

        {!isActive && !isPaused && (
          <button
            onClick={handleStart}
            className="absolute bottom-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full"
          >
            Start
          </button>
        )}

        {isActive && !isPaused && (
          <>
            <button
              onClick={handlePause}
              className="absolute bottom-4 left-1/4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-full"
            >
              Pause
            </button>
            <button
              onClick={handleStop}
              className="absolute bottom-4 right-1/4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full"
            >
              Stop
            </button>
          </>
        )}

        {isPaused && (
          <button
            onClick={handleResume}
            className="absolute bottom-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full"
          >
            Resume
          </button>
        )}
      </div>
    </div>
  );
};

export default Stopwatch;
