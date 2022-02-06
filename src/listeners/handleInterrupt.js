const { saveUserData } = require('../utils');

module.exports = function handleInterrupt(users) {
  saveUserData(users);
  console.log('Goodbye.');
  process.exit();
};
