const express = require('express');
const userRoutes = require('./userRoutes');
const workoutRoutes = require('./workoutRoutes');
const entryRoutes = require('./entryRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/workouts', workoutRoutes);
router.use('/entries', entryRoutes);

module.exports = router;
