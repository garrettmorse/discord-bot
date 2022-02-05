const fs = require('fs');
const { guildId } = require('../config/constants');
const bot = require('./bot');

function saveUserData(users) {
  fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));
  console.log('Saved User Data');
  return users;
}

async function resetUserData() {
  const users = (await bot.guilds.cache.get(guildId).members.list({ limit: 1000 }))
    .map((_, v) => v)
    .reduce((acc, id) => ({ ...acc, [id]: 0 }), {});
  fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));
  return users;
}

module.exports = {
  saveUserData,
  resetUserData,
};
