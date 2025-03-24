import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { exerciseDescriptions } from '../utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function WorkoutCard(props) {
  const { trainingPlan, workoutIndex, type, dayNum, icon, savedWeights, onComplete, onSaveCallback } = props; //added onSaveCallback

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
    const newObj = {
      ...weights,
      [title]: weight,
    };
    setWeights(newObj);
  }

  function handleAddWarmupWeight(title, weight) {
    const newObj = {
      ...warmupWeights,
      [title]: weight,
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

      toast.success('Workout saved successfully!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: true,
      });

      if (onSaveCallback) {
        onSaveCallback(index, data); //call back to parent to update state.
      }

    } catch (error) {
      toast.error('Failed to save workout. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
      console.error('Error saving workout:', error);
    }
  }

  function handleComplete(index, data) {
    try {
      const newObj = { ...data };
      newObj.isComplete = true;
      handleSave(index, newObj);

      toast.success('Workout completed!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
      });

      if (onComplete) {
        onComplete(index, newObj);
      }
    } catch (error) {
      toast.error('Failed to complete workout. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
      console.error('Error completing workout:', error);
    }
  }

  const handleSaveClick = () => {
    const trimmedWeightType = weightType.trim().toLowerCase();

    if (trimmedWeightType !== 'kg' && trimmedWeightType !== 'lbs') {
      toast.error('Only kg and lbs are supported. Check your input again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }

    handleSave(workoutIndex, { weights, warmupWeights, weightType });
  };

  const handleCompleteClick = () => {
    const trimmedWeightType = weightType.trim().toLowerCase();

    if (trimmedWeightType !== 'kg' && trimmedWeightType !== 'lbs') {
      toast.error('Only kg and lbs are supported. Check your input again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }

    if (Object.keys(weights).length !== workout.length) {
      toast.error('Please fill in all weight values.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
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
        {warmup.map((warmupExercise, warmupIndex) => {
          return (
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
                  handleAddWarmupWeight(warmupExercise.name, e.target.value);
                }}
                className="weight-input"
                type="number"
              />
              <input className="weight-type" type="text" value={weightType} onChange={handleWeightTypeChange}/>
            </React.Fragment>
          );
        })}
      </div>

      <div className="workout-grid">
        <div className="exercise-name">
          <h4>Workout</h4>
        </div>
        <h6>Sets</h6>
        <h6>Reps</h6>
        <h6 className="weight-input">Max Weight</h6>
        {workout.map((workoutExercise, wIndex) => {
          return (
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
                  handleAddWeight(workoutExercise.name, e.target.value);
                }}
                className="weight-input"
                placeholder="Ex-14"
                type="number"
              />
              <input className="weight-type" type="text" value={weightType} onChange={handleWeightTypeChange}/>
            </React.Fragment>
          );
        })}
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
      <ToastContainer/>
    </div>
  );
}