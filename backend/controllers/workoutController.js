const { Workout } = require('../models');
const { Op } = require('sequelize');
const dayjs = require('dayjs');

exports.createWorkout = async (req, res) => {
    console.log('Received workout creation request:', req.body);
    try {
        const { date, exerciseType, counter, time } = req.body;
        if (!date || !exerciseType) {
            return res.status(400).json({ error: 'Brak wymaganych pól' });
        }
        console.log('Trying to create workout for user:', req.user.id);

        const workout = await Workout.create({
            userId: req.user.id,
            date,
            exerciseType,
            counter,
            time
        });

        res.status(201).json(workout);
    } catch (err) {
        console.log('Error while create workout:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.getMyWorkouts = async (req, res) => {
    try {
        const days = parseInt(req.query.days, 10);

        const where = { userId: req.user.id };

        if (!isNaN(days)) {
            const dateFrom = new Date();
            dateFrom.setDate(dateFrom.getDate() - days);

            where.date = {
                [Op.gte]: dateFrom
            };
        }

        const workouts = await Workout.findAll({
            where,
            order: [['date', 'DESC']]
        });

        res.json(workouts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getWorkoutById = async (req, res) => {
    try {
        const workout = await Workout.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!workout) return res.status(404).json({ error: 'Nie znaleziono treningu' });

        res.json(workout);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!workout) return res.status(404).json({ error: 'Nie znaleziono treningu' });

        await workout.destroy();

        res.json({ message: 'Trening usunięty' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getWorkoutStats = async (req, res) => {
  try {
    const workouts = await Workout.findAll({
      where: { userId: req.user.id },
      order: [['date', 'ASC']],
    });

    if (!workouts.length) {
      return res.json({
        longestStreakDays: 0,
        longestWorkout: null,
        mostFrequent: null,
        biggestReps: null,
      });
    }

    // longest streak
    const dates = workouts.map(w => dayjs(w.date).startOf('day'));
    let streak = 1;
    let longestStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      if (dates[i].diff(dates[i-1], 'day') === 1) {
        streak++;
      } else if (!dates[i].isSame(dates[i-1], 'day')) {
        streak = 1;
      }
      if (streak > longestStreak) longestStreak = streak;
    }

    // longest workout by duration
    const longestWorkout = workouts.reduce((max, w) => (!max || w.time > max.time ? w : max), null);
    
    // most frequent exerciseType
    const freqMap = {};
    for (const w of workouts) {
      freqMap[w.exerciseType] = (freqMap[w.exerciseType] || 0) + 1;
    }
    const mostFrequent = Object.keys(freqMap).reduce((a, b) => freqMap[a] > freqMap[b] ? a : b);

    // biggest reps
    const biggestReps = workouts.reduce((max, w) => (!max || w.counter > max.counter ? w : max), null);

    res.json({
      longestStreakDays: longestStreak,
      longestWorkout: longestWorkout ? { type: longestWorkout.exerciseType, duration: longestWorkout.time } : null,
      mostFrequent,
      biggestReps: biggestReps ? { type: biggestReps.exerciseType, count: biggestReps.counter } : null,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
