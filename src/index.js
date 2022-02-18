const { token, otherCID } = require('../config/constants');
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
  console.log(`Welcoming ${member.user.username} to the server!`);
  users[member.user.id] = 0;
  await member.roles.add(roleIds[8]);
});

bot.on('guildMemberRemove', async (member) => {
  console.log(`Goodbye ${member.user.username}!`);
  delete users[member.user.id];
});

bot.on('interactionCreate', async (interaction) => {
  if (interaction.channel.name !== 'bot-commands' && interaction.user.id !== otherCID) users[interaction.user.id] -= 500;
  users = await interactionCreate(interaction, users);
});

process.on('SIGINT', () => handleInterrupt(users));
