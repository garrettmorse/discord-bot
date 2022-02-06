const { token } = require('../config/constants');
const bot = require('./bot');
const { calculateRoles } = require('./utils');
const {
  botReady,
  handleInterrupt,
  interactionCreate,
  messageReactionAdd,
  messageReactionRemove,
} = require('./listeners');

let users = {};

bot.login(token);

bot.once('ready', async (_bot) => { users = botReady(_bot); });

bot.on('messageReactionAdd', async (reaction, _user) => {
  users[reaction.message.author.id] = messageReactionAdd(reaction, _user, users);
  await calculateRoles(users);
});

bot.on('messageReactionRemove', async (reaction, _user) => {
  users[reaction.message.author.id] = messageReactionRemove(reaction, _user, users);
  await calculateRoles(users);
});

bot.on('interactionCreate', async (interaction) => {
  users = await interactionCreate(interaction, users);
});

process.on('SIGINT', () => handleInterrupt(users));
