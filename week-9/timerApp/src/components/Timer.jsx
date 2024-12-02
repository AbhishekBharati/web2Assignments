import React, { useState, useEffect } from 'react';
import style from "./Timer.module.css";
import { formatTime, calculateTime } from "../utils/auxiliaryFunctions";

const Timer = () => {
  const [time, setTime] = useState(0);
  const [initialTime, setInititalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [editState, setEditState] = useState({ field: null, value: '' });

  // Effect to update the Progress Bar as the countDown starts. 
  useEffect(() => {
    const progress = initialTime > 0 ? ((initialTime - time) / initialTime) : 0;
    document.documentElement.style.setProperty('--progress', `${progress}%`);
  }, [time, initialTime]);

  // Effect to handle timer CountDown when it's running.
  useEffect(() => {
    let interval = null;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1); // Decrease time by 10 sec.
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false); // Stop the timer when it Reaches 0.
    }
    return () => {
      if (interval) clearInterval(interval); // Clear Interval to prevent Memory Leaks.
    }
  }, [isRunning, time]);

  // Function to handle editing of Time Fields.
  const handleEditField = (field) => {
    if (editState.field === field) {
      // Edit is completed - save new value with padding and updated time.
      const newTime = {
        ...formatTime(time),
        [field]: editState.value.padStart(2, '0') // Add leading zeros if necessary.
      };

      // Use the auxilary function to calculate the total time in seconds.
      const calculatedTime = calculateTime(newTime.hours, newTime.minutes, newTime.seconds);

      // Update time and initial Time with the updated value.
      setTime(calculatedTime);
      setInititalTime(calculatedTime);

      // Reset Editing State.
      setEditState({ field: null, value: '' });
    } else {
      // Start Editing - remove leading zeros.
      setIsRunning(false); // Pause the timer while editing.
      setEditState({ field, value: formatTime(time)[field].replace(/^0+/, '') }); // Set field and remove leading zeros for easier editing.
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value.replace('/\D/g', '').slice(0, 2); // Allow only 2 numbers max 2 digits.
    setEditState((prevState) => ({ ...prevState, value })); // Upate only the value in EditState.
  }

  // Format current time into hours, minutes, and seconds for display.
  const { hours, minutes, seconds } = formatTime(time);
  return (
    <div className={style.timerApp}>
      <div className={style.timerDisplay}>
        <div className={style.timerCircle}>
          <div className={style.timerTime}>
            {editState.field === 'hours' ? (
              <input
                className={style.timeInput}
                type='text'
                value={editState.value}
                onChange={handleInputChange}
                onBlur={() => handleEditField('hours')}
                autoFocus
              />
            ) : (
              <span className={style.timeUnit} onClick={() => handleEditField('hours')}>{hours}</span>
            )}
            :
            {editState.field === 'minutes' ? (
              <input
                className={style.timeInput}
                type='text'
                value={editState.value}
                onChange={handleInputChange}
                onBlur={() => handleEditField('minutes')}
                autoFocus
              />
            ) : (
              <span className={style.timeUnit} onClick={() => handleEditField('minutes')}>{minutes}</span>
            )}
            :
            {editState.field === 'seconds' ? (
              <input
                className={style.timeInput}
                type='text'
                value={editState.value}
                onChange={handleInputChange}
                onBlur={() => handleEditField('seconds')}
                autoFocus
              />
            ) : (
              <span className={style.timeUnit} onClick={() => handleEditField('seconds')}>{seconds}</span>
            )}
          </div>
        </div>
      </div>
      <div className={style.actionButtons}>
        <button className={style.actionButton} onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button className={style.actionButton} onClick={() => { setTime(0); setInititalTime(0); setIsRunning(false) }}>
          Reset
        </button>
      </div>
    </div>
  )
}

export default Timer
