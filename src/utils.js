const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { clientId, guildId } = require('../config/constants');
const { roleIds } = require('../config/text.json');
const bot = require('./bot');

async function reduceUsers(users) {
  const members = await (await bot.guilds.fetch(guildId)).members.fetch();
  const reduced = Object.entries(users).reduce((acc, entry) => {
    const [userId, userScore] = entry;
    if (clientId === userId) return acc;
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

function shallowCopy(obj) {
  const copy = {};
  Object.keys(obj).forEach((key) => copy[key] = obj[key]);
  return copy;
}

function calculateDistribution(sortedUsersArr) {
  const distribution = {
    ten: 0,
    quarter: 0,
    fifteen: 0,
  };
  const len = sortedUsersArr.length;
  distribution.ten = Math.round(len * 0.1);
  distribution.quarter = Math.round(len * 0.25);
  distribution.fifteen = Math.round(len * 0.15);
  // calculate difference between the approximate values and the actual length
  // then add the diff back to the quarter
  const diff = (Object.values(distribution).reduce((count, value) => count + value, 0) * 2) - len;
  distribution.quarter += diff;
  return distribution;
}

// remove all CCP roles and add the specific one we want
async function assignRoles(memberRoleManager, roleId) {
  await memberRoleManager.remove(roleIds);
  await memberRoleManager.add(roleId);
}

// given the users object, calculate roles for their scores
// first, determine the distribution of top, bottom #1/10%/25%/15%, in that order
// then, assign the appropriate role to each group
async function calculateRoles(_users) {
  const guildMemberMgr = bot.guilds.cache.get(guildId);
  const members = await guildMemberMgr.members.fetch();
  const users = shallowCopy(_users);
  // sort from least to greatest score
  const sortedUsersArr = Object.entries(users)
    .reduce((acc, [key, value]) => [...acc, { [key]: value }], [])
    .sort((cur, next) => Object.values(cur)[0] - Object.values(next)[0]);
  const distribution = calculateDistribution(sortedUsersArr);
  // pop top userId
  assignRoles(members.get(Object.keys(sortedUsersArr.pop())[0]).roles, roleIds[1]);
  // next 10%
  for (let i = 0; i < distribution.ten; i += 1) {
    assignRoles(members.get(Object.keys(sortedUsersArr.pop())[0]).roles, roleIds[3]);
  }
  // next 25%
  for (let i = 1; i < distribution.quarter; i += 1) {
    assignRoles(members.get(Object.keys(sortedUsersArr.pop())[0]).roles, roleIds[5]);
  }
  // next 15%
  for (let i = 1; i < distribution.fifteen; i += 1) {
    assignRoles(members.get(Object.keys(sortedUsersArr.pop())[0]).roles, roleIds[7]);
  }
  // next 15%
  for (let i = 1; i < distribution.fifteen; i += 1) {
    assignRoles(members.get(Object.keys(sortedUsersArr.pop())[0]).roles, roleIds[6]);
  }
  // next 25%
  for (let i = 1; i < distribution.quarter; i += 1) {
    assignRoles(members.get(Object.keys(sortedUsersArr.pop())[0]).roles, roleIds[4]);
  }
  // next 10%
  for (let i = 1; i < distribution.ten; i += 1) {
    assignRoles(members.get(Object.keys(sortedUsersArr.pop())[0]).roles, roleIds[2]);
  }
  // pop bottom userId
  assignRoles(members.get(Object.keys(sortedUsersArr.pop())[0]).roles, roleIds[0]);
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
  calculateRoles,
  saveUserData,
  resetUserData,
};
