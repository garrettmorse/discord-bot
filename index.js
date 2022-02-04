const { Client, Intents } = require('discord.js');
const { token } = require('./config/constants');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
  console.log('ready');
});

client.login(token);

client.on('interactionCreate', console.log);
