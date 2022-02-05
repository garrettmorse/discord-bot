const fs = require('fs');

module.exports = function handleBotReady(_bot) {
  console.log('ready');
  if (fs.existsSync('./data/users.json')) return require('../../data/users.json');
  return {};
};
