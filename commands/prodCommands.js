const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = [
  new SlashCommandBuilder()
    .setName('score')
    .setDescription('Displays Social Credit Score.')
    .addUserOption((option) => option.setName('comrade')
      .setDescription('Displays this Comrade\'s Social Credit Score.')
      .setRequired(false)),
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays some info'),
  new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Displays the greatest allies and worst enemies of the state.')
    .addBooleanOption((option) => option.setName('reverse')
      .setDescription('Shows leaderboard from bottom up')
      .setRequired(true)),
];
