const express = require('express');
const userRoutes = require('./userRoutes');
const workoutRoutes = require('./workoutRoutes');
const entryRoutes = require('./entryRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/workouts', workoutRoutes);
router.use('/entries', entryRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
