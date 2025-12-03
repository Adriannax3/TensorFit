const bcrypt = require('bcryptjs');

exports.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

exports.comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};