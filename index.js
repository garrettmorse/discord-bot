const { Client, Intents } = require('discord.js');
const fs = require('fs');
const {
  token, testChannelId, testGuildId, guildId, clientId,
} = require('./config/constants');

const bot = new Client({ partials: ['CHANNEL', 'MESSAGE'], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
let users = {};

bot.once('ready', async (_bot) => {
  console.log('ready');
  const userIds = [];
  const guild = _bot.guilds.cache.get(guildId);
  const members = await guild.members.list({ limit: 1000 });
  members.forEach((_, v) => userIds.push(v));
  users = userIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {});
  fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));
});

bot.login(token);

bot.on('messageReactionAdd', async (reaction, _user) => {
  console.log(reaction);
  switch (reaction.emoji.name) {
    case '👍':
      break;

    case '👎':
      break;

    case 'ToadOk':
      users[reaction.message.author.id] += 1;
      break;

    case 'NotOkToad':
      users[reaction.message.author.id] -= 1;
      break;

    default:
      break;
  }
});

bot.on('messageReactionRemove', async (reaction, _user) => {
  // 👎
});

bot.on('interactionCreate', (interaction) => {
  const { user } = interaction;
  const target = interaction.options.get('member');
  switch (interaction.commandName) {
    case 'score':
      // if (interaction.channel.name !== 'bot-commands') return;
      if (target && target.value === clientId) interaction.reply({ content: 'CCP have no score!' });
      else if (target) interaction.reply({ content: `${target.user.username} has a score of ${users[target.value]}` });
      else interaction.reply({ content: `${user.username} has a score of ${users[user.id]}` });
      break;
    default:
      break;
  }
});
