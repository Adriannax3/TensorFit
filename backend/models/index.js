const User = require('./User');
const Entry = require('./Entry');
const Comment = require('./Comment');
const Like = require('./Like');
const Workout = require('./Workout');

// Relations 
User.hasMany(Workout);
Workout.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Entry, { foreignKey: 'userId' });
Entry.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

User.belongsToMany(Entry, { 
  through: Like, 
  foreignKey: 'userId',
  otherKey: 'entryId'
});


Entry.hasMany(Comment, { foreignKey: 'entryId' });
Comment.belongsTo(Entry, { foreignKey: 'entryId' });
Entry.belongsToMany(User, { through: Like, foreignKey: 'entryId', otherKey: 'userId' });

module.exports = { User, Entry, Comment, Like, Workout };