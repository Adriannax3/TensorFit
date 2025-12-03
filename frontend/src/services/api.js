import axios from '../axios';

export const createWorkout = async (workoutData) => {
  const response = await axios.post('/workouts', workoutData);
  return response.data;
}

export const getMyWorkouts = async (days) => {
  const response = await axios.get('/workouts', {
    params: { days }
  });
  return response.data;
}

export const getMyWorkoutsStats = async () => {
  const response = await axios.get('/workouts/stats');
  return response.data;
}