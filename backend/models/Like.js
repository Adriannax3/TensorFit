const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Like = sequelize.define('Like', {}, {
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['userId', 'entryId'] // user can like an entry only once
        }
    ]
});

module.exports = Like;
