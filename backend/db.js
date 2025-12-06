const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('TensorFit', 'ada', 'freja2137', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
