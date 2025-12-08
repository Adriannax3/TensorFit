const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('TensorFit', 'postgres', 'qwerty123', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
