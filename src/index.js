const { token } = require('../config/constants');
const { roleIds } = require('../config/text.json');
const bot = require('./bot');
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
});

bot.on('messageReactionRemove', async (reaction, _user) => {
  users[reaction.message.author.id] = messageReactionRemove(reaction, _user, users);
});

bot.on('guildMemberAdd', async (member) => {
  users[member.user.id] = 0;
  await member.roles.add(roleIds[8]);
});

bot.on('guildMemberRemove', async (member) => {
  delete users[member.user.id];
});

bot.on('interactionCreate', async (interaction) => {
  users = await interactionCreate(interaction, users);
});

process.on('SIGINT', () => handleInterrupt(users));
