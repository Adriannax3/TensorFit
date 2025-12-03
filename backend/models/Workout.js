const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Workout = sequelize.define('Workout', {
    date: {
        type: DataTypes.DATE,  // date + time
        allowNull: false,
    },
    exerciseType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    counter: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

module.exports = Workout;
