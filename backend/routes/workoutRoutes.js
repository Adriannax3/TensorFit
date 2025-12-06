const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, workoutController.createWorkout);
router.get('/', protect, workoutController.getMyWorkouts);
router.get('/stats', protect, workoutController.getWorkoutStats);
router.get('/ranking', protect, workoutController.getRanking);
router.get('/:id', protect, workoutController.getWorkoutById);
router.delete('/:id', protect, workoutController.deleteWorkout);

module.exports = router;