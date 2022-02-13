const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = [
  new SlashCommandBuilder()
    .setName('save')
    .setDescription('Saves User Data'),
  new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Wipes User Data'),
  new SlashCommandBuilder()
    .setName('send')
    .setDescription('Send a Gif in #bot-commands')
    .addIntegerOption((option) => option.setName('whichgif')
      .setDescription('GIF idx')
      .setRequired(true)),
];
