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

export const getEntries = async (pageToLoad, limit) => {
  const response = await axios.get('/entries/all', {
     params: { page: pageToLoad, limit }
  });
  return response.data;
}

// Admin

export const toggleBlockUser = async (id) => {
  const response = await axios.post(`/admin/block/${id}`);
  return response.data;
};

export const deleteEntry = async (id) => {
  const response = await axios.delete(`/admin/entry/${id}`);
  return response.data;
};

export const deleteComment = async (id) => {
  const response = await axios.delete(`/admin/comment/${id}`);
  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get('/admin/users');
  return response.data;
}

export const getAllComments = async (pageToLoad, limit) => {
  const response = await axios.get('/admin/comments', {
     params: { page: pageToLoad, limit }
  });
  return response.data;
}