const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Entry = sequelize.define('Entry', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    image: {
        type: DataTypes.BLOB('long'),
        allowNull: true,
    }
});

module.exports = Entry;