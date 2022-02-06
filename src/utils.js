const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { clientId, guildId } = require('../config/constants');
const bot = require('./bot');

async function reduceUsers(users) {
  const members = await bot.guilds.cache.get(guildId).members.fetch();
  const reduced = Object.entries(users).reduce((acc, entry) => {
    const [userId, userScore] = entry;
    if (clientId === userId) return acc;
    console.log(members.get(userId));
    const { username } = members.get(userId).user;
    return [...acc, { [username]: userScore }];
  }, []);
  return reduced;
}

function sortLeaderboard(leaderboard, reversed) {
  // eslint-disable-next-line max-len
  return leaderboard.sort((cur, next) => (reversed ? Object.values(cur)[0] - Object.values(next)[0] : Object.values(next)[0] - Object.values(cur)[0]));
}

// slice the leaderboard so that we only have the top (or bottom) 10 users
// also remap the leaderboard so that the key is prepended by its sorted order
// then, conditionally add the user if they're not already in the leaderboard array
function mapAndSliceLeaderboard(leaderboard, user) {
  const sliced = leaderboard.slice(0, 10);
  const mapped = leaderboard.map((obj, idx) => ({ [`${idx + 1}. ${Object.keys(obj)[0]}`]: Object.values(obj)[0] }));
  const isUserIn = sliced.some((obj) => Object.keys(obj)[0].includes(user.username));
  if (isUserIn) return mapped.slice(0, 10);
  const mappedAndSliced = mapped.slice(0, 10);
  mappedAndSliced.push(mapped.find((obj) => Object.keys(obj)[0].includes(user.username)));
  return mappedAndSliced;
}

async function buildLeaderboardEmbed(users, user, reversed = false) {
  let leaderboard = [];
  const reduced = await reduceUsers(users);
  leaderboard = mapAndSliceLeaderboard(sortLeaderboard(reduced, reversed), user);

  const entries = leaderboard.map((obj) => ({ name: '\u200B', value: `${Object.keys(obj)[0]}: ${Object.values(obj)[0]}` }));
  const descriptionStr = reversed ? `${bot.guilds.cache.get(guildId).name} Enemies of the State` : `${bot.guilds.cache.get(guildId).name} State Rankings`;
  return new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Leaderboard')
    .setDescription(descriptionStr)
    .addFields(
      ...entries,
    )
    .setTimestamp();
}

async function resetUserData() {
  const users = (await bot.guilds.cache.get(guildId).members.list({ limit: 1000 }))
    .map((_, v) => v)
    .reduce((acc, id) => ({ ...acc, [id]: 0 }), {});
  fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));
  return users;
}

function saveUserData(users) {
  fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));
  console.log('Saved User Data');
  return users;
}

module.exports = {
  buildLeaderboardEmbed,
  saveUserData,
  resetUserData,
};
