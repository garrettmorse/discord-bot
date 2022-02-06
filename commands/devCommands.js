const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = [
  new SlashCommandBuilder()
    .setName('save')
    .setDescription('Saves User Data'),
  new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Wipes User Data'),
];
