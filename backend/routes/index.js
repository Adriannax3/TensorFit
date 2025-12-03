const express = require('express');
const userRoutes = require('./userRoutes');
const workoutRoutes = require('./workoutRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/workouts', workoutRoutes);


module.exports = router;
