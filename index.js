const { Client, Intents } = require('discord.js');
const tty = require('tty');
const fs = require('fs');
const {
  token, testChannelId, testGuildId, guildId, clientId,
} = require('./config/constants');

const bot = new Client({ partials: ['CHANNEL', 'MESSAGE'], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
let users = {};

function saveData() {
  fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));
  console.log('Saved User Data');
}

bot.once('ready', (_bot) => {
  console.log('ready');
  if (fs.existsSync('./data/users.json')) users = require('./data/users.json');
});

bot.login(token);

bot.on('messageReactionAdd', async (reaction, _user) => {
  if (reaction.message.author.id === _user.id) return; // if reaction is self, don't do anything
  switch (reaction.emoji.name) {
    case 'ToadOk':
      users[reaction.message.author.id] += 1;
      console.log(`${_user.username} gave ${reaction.message.author.username} a +1 for a total of ${users[reaction.message.author.id]}`);
      break;

    case 'NotOkToad':
      users[reaction.message.author.id] -= 1;
      console.log(`${_user.username} gave ${reaction.message.author.username} a -1 for a total of ${users[reaction.message.author.id]}`);
      break;

    default:
      break;
  }
});

bot.on('messageReactionRemove', async (reaction, _user) => {
  if (reaction.message.author.id === _user.id) return;
  switch (reaction.emoji.name) {
    case 'ToadOk':
      users[reaction.message.author.id] -= 1;
      console.log(`${_user.username} removed a +1 emoji from ${reaction.message.author.username}'s message for a total of ${users[reaction.message.author.id]}`);
      break;

    case 'NotOkToad':
      users[reaction.message.author.id] += 1;
      console.log(`${_user.username} removed a -1 emoji from ${reaction.message.author.username}'s message for a total of ${users[reaction.message.author.id]}`);
      break;

    default:
      break;
  }
});

bot.on('interactionCreate', async (interaction) => {
  const { user } = interaction;
  const target = interaction.options.get('member');
  switch (interaction.commandName) {
    case 'help':
      interaction.reply({ content: 'Use the /score command to view social credit score determined by :ToadOk: (+1) and :NotOkToad: (-1).' });
      break;
    case 'score':
      if (target && target.value === clientId) interaction.reply({ content: 'CCP have perfect social credit score!' });
      else if (target) interaction.reply({ content: `${target.user.username} has a social credit score of ${users[target.value]}` });
      else interaction.reply({ content: `${user.username} has a social credit score of ${users[user.id]}` });
      break;
    case 'save':
      saveData();
      interaction.reply({ content: 'Done.' });
      break;
    case 'reset':
      users = (await bot.guilds.cache.get(guildId).members.list({ limit: 1000 }))
        .map((_, v) => v)
        .reduce((acc, id) => ({ ...acc, [id]: 0 }), {});
      fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));
      console.log('Rebuilt users.json');
      interaction.reply({ content: 'Done.' });
      break;
    default:
      break;
  }
});

process.on('SIGINT', () => {
  saveData();
  console.log('Goodbye.');
  process.exit();
});
