import React, { useState, useEffect } from 'react';
import { workoutProgram as training_plan } from '../utils/index.js';
import WorkoutCard from './WorkoutCard.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Grid() {
  const [savedWorkouts, setSavedWorkouts] = useState({});
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  useEffect(() => {
    try {
      if (!localStorage) {
        return;
      }
      let savedData = {};
      if (localStorage.getItem('brogram')) {
        savedData = JSON.parse(localStorage.getItem('brogram'));
      }
      setSavedWorkouts(savedData);
    } catch (error) {
      toast.error('Failed to load saved workouts.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
      });
      console.error('Error loading saved workouts:', error);
    }
  }, []);

  const handleWorkoutComplete = (completedWorkoutIndex, completedData) => {
    const nextWorkoutIndex = completedWorkoutIndex + 1;
    if (nextWorkoutIndex < Object.keys(training_plan).length) {
    }

    setSavedWorkouts((prevSavedWorkouts) => ({
      ...prevSavedWorkouts,
      [completedWorkoutIndex]: {
        ...completedData,
        isComplete: true,
      },
    }));

    localStorage.setItem('brogram', JSON.stringify({
      ...savedWorkouts,
      [completedWorkoutIndex]: {
        ...completedData,
        isComplete: true,
      }
    }));
  };

  const handleSaveCallback = (index, data) => {
    setSavedWorkouts((prevSavedWorkouts) => ({
      ...prevSavedWorkouts,
      [index]: {
        ...data,
      },
    }));
  };

  return (
    <div className="training-plan-grid">
      {Object.keys(training_plan).map((workout, workoutIndex) => {
        const workoutIndexNum = parseInt(workoutIndex);
        const isLocked = workoutIndexNum === 0 ? false : !savedWorkouts?.[workoutIndexNum - 1]?.isComplete;

        const type = workoutIndexNum % 3 === 0 ? 'Push' : workoutIndexNum % 3 === 1 ? 'Pull' : 'Legs';
        const trainingPlan = training_plan[workoutIndex];
        const dayNum = (workoutIndexNum / 8 <= 1) ? '0' + (workoutIndexNum + 1) : workoutIndexNum + 1;
        const icon = workoutIndexNum % 3 === 0 ? (<i className='fa-solid fa-dumbbell'></i>) : (workoutIndexNum % 3 === 1 ? (<i className='fa-solid fa-weight-hanging'></i>) : (<i className='fa-solid fa-bolt'></i>));

        if (workoutIndexNum === selectedWorkout) {
          return (
            <WorkoutCard
              savedWeights={savedWorkouts?.[workoutIndexNum]}
              key={workoutIndexNum}
              trainingPlan={trainingPlan}
              type={type}
              workoutIndex={workoutIndexNum}
              icon={icon}
              dayNum={dayNum}
              onComplete={handleWorkoutComplete}
              onSaveCallback={handleSaveCallback} //add onSaveCallback
            />
          );
        }

        return (
          <button
            onClick={() => {
              if (isLocked) {
                return;
              }
              setSelectedWorkout(workoutIndexNum);
            }}
            className={'card plan-card  ' + (isLocked ? 'inactive' : '')}
            key={workoutIndexNum}
          >
            <div className='plan-card-header'>
              <p>Day {dayNum}</p>
              {isLocked ? <i className='fa-solid fa-lock'></i> : icon}
            </div>
            <div className='plan-card-header'>
              <h4>
                <b>{type}</b>
              </h4>
            </div>
          </button>
        );
      })}
      <ToastContainer />
    </div>
  );
}