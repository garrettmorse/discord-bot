const { Client, Intents } = require('discord.js');

const bot = new Client({ partials: ['CHANNEL', 'MESSAGE'], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

module.exports = bot;
