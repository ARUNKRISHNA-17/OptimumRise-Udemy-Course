import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { exerciseDescriptions } from '../utils';

export default function WorkoutCard(props) {
  const { trainingPlan, workoutIndex, type, dayNum, icon, savedWeights, onComplete, onSaveCallback, setSelectedWorkout } = props;

  const { warmup, workout } = trainingPlan || {};
  const [showExerciseDescription, setShowExerciseDescription] = useState(null);
  const [weights, setWeights] = useState({});
  const [warmupWeights, setWarmupWeights] = useState({});
  const [weightType, setWeightType] = useState('');

  useEffect(() => {
    if (savedWeights) {
      setWeights(savedWeights.weights || {});
      setWarmupWeights(savedWeights.warmupWeights || {});
      setWeightType(savedWeights.weightType || '');
    }
  }, [savedWeights]);

  function handleAddWeight(title, weight) {
    const clampedWeight = Math.min(999, Math.max(0, weight));
    const newObj = {
      ...weights,
      [title]: clampedWeight,
    };
    setWeights(newObj);
  }

  function handleAddWarmupWeight(title, weight) {
    const clampedWeight = Math.min(999, Math.max(0, weight));
    const newObj = {
      ...warmupWeights,
      [title]: clampedWeight,
    };
    setWarmupWeights(newObj);
  }

  const handleWeightTypeChange = (e) => {
    setWeightType(e.target.value);
  };

  function handleSave(index, data) {
    try {
      const savedWorkouts = JSON.parse(localStorage.getItem('brogram')) || {};
      const newObj = {
        ...savedWorkouts,
        [index]: {
          ...data,
          isComplete: !!data.isComplete || !!savedWorkouts?.[index]?.isComplete,
        },
      };
      localStorage.setItem('brogram', JSON.stringify(newObj));

      if (onSaveCallback) {
        onSaveCallback(index, data);
      }

      if (setSelectedWorkout) {
        setSelectedWorkout(null);
      }
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  }

  function handleComplete(index, data) {
    try {
      const newObj = { ...data };
      newObj.isComplete = true;
      handleSave(index, newObj);

      if (onComplete) {
        onComplete(index, newObj);
      }
    } catch (error) {
      console.error('Error completing workout:', error);
    }
  }

  const handleSaveClick = () => {
    const trimmedWeightType = weightType.trim().toLowerCase();

    if (trimmedWeightType !== 'kg' && trimmedWeightType !== 'lbs') {
      console.error('Only kg and lbs are supported. Check your input again.');
      return;
    }

    handleSave(workoutIndex, { weights, warmupWeights, weightType });
  };

  const handleCompleteClick = () => {
    const trimmedWeightType = weightType.trim().toLowerCase();

    if (trimmedWeightType !== 'kg' && trimmedWeightType !== 'lbs') {
      console.error('Only kg and lbs are supported. Check your input again.');
      return;
    }

    if (Object.keys(weights).length !== workout.length) {
      console.error('Please fill in all weight values.');
      return;
    }

    handleComplete(workoutIndex, { weights, warmupWeights, weightType });
  };

  return (
    <div className="workout-container">
      {showExerciseDescription && (
        <Modal
          showExerciseDescription={showExerciseDescription}
          handleCloseModal={() => {
            setShowExerciseDescription(null);
          }}
        />
      )}
      <div className="workout-card card">
        <div className="plan-card-header">
          <p>Day {dayNum}</p>
          {icon}
        </div>
        <div className="plan-card-header">
          <h2>
            <b>{type} Workout</b>
          </h2>
        </div>
      </div>

      <div className="workout-grid">
        <div className="exercise-name">
          <h4>Warmup</h4>
        </div>
        <h6>Sets</h6>
        <h6>Reps</h6>
        <h6 className="weight-input">Max Weight</h6>
        {warmup.map((warmupExercise, warmupIndex) => (
          <React.Fragment key={warmupIndex}>
            <div className="exercise-name">
              <p>{warmupIndex + 1}. {warmupExercise.name}</p>
              <button
                onClick={() => {
                  setShowExerciseDescription({
                    name: warmupExercise.name,
                    description: exerciseDescriptions[warmupExercise.name],
                  });
                }}
                className="help-icon"
              >
                <i className="fa-regular fa-circle-question" />
              </button>
            </div>
            <p className="exercise-info">{warmupExercise.sets}</p>
            <p className="exercise-info">{warmupExercise.reps}</p>
            <input
              value={warmupWeights[warmupExercise.name] || ''}
              onChange={(e) => {
                handleAddWarmupWeight(warmupExercise.name, parseInt(e.target.value, 10) || 0);
              }}
              className="weight-input"
              type="number"
            />
            <input className="weight-type" type="text" value={weightType} onChange={handleWeightTypeChange}/>
          </React.Fragment>
        ))}
      </div>

      <div className="workout-grid">
        <div className="exercise-name">
          <h4>Workout</h4>
        </div>
        <h6>Sets</h6>
        <h6>Reps</h6>
        <h6 className="weight-input">Max Weight</h6>
        {workout.map((workoutExercise, wIndex) => (
          <React.Fragment key={wIndex}>
            <div className="exercise-name">
              <p>{wIndex + 1}. {workoutExercise.name}</p>
              <button
                onClick={() => {
                  setShowExerciseDescription({
                    name: workoutExercise.name,
                    description: exerciseDescriptions[workoutExercise.name],
                  });
                }}
                className="help-icon"
              >
                <i className="fa-regular fa-circle-question" />
              </button>
            </div>
            <p className="exercise-info">{workoutExercise.sets}</p>
            <p className="exercise-info">{workoutExercise.reps}</p>
            <input
              value={weights[workoutExercise.name] || ''}
              onChange={(e) => {
                handleAddWeight(workoutExercise.name, parseInt(e.target.value, 10) || 0);
              }}
              className="weight-input"
              placeholder="Ex-14"
              type="number"
            />
            <input className="weight-type" type="text" value={weightType} onChange={handleWeightTypeChange}/>
          </React.Fragment>
        ))}
      </div>

      <div className="workout-buttons">
        <button
          onClick={handleSaveClick}
        >
          Save & Exit
        </button>
        <button
          onClick={handleCompleteClick}
          disabled={Object.keys(weights).length !== workout.length}
        >
          Complete
        </button>
      </div>
    </div>
  );
}