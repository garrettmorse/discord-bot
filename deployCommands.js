const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const {
  clientId, guildId, token, testGuildId,
} = require('./config/constants');

const commands = [
  new SlashCommandBuilder()
    .setName('score')
    .setDescription('Displays Social Credit Score.')
    .addUserOption((option) => option.setName('member')
      .setDescription("Displays this Member's Social Credit Score.")
      .setRequired(false)),
  new SlashCommandBuilder()
    .setName('save')
    .setDescription('Saves User Data'),
  new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Wipes User Data'),
]
  .map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, testGuildId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
