const {
  buildLeaderboardEmbed, resetUserData, saveUserData, calculateRoles,
} = require('../utils');
const { clientId, botCommandsId } = require('../../config/constants');
const text = require('../../config/text.json');
const bot = require('../bot');

module.exports = async function handleInteractionCreate(interaction, users) {
  const { user } = interaction;
  const target = interaction.options.get('comrade');
  const reversed = interaction.options.get('reverse');
  const gifIdx = interaction.options.get('whichgif');
  switch (interaction.commandName) {
    case 'help':
      interaction.reply({ content: 'Use the /score command to view social credit score determined by :ToadOk: (+1) and :NotOkToad: (-1).' });
      break;
    case 'rank':
      interaction.reply({ content: 'Fetching from CCP Database...' });
      interaction.channel.send({
        embeds: [await buildLeaderboardEmbed(users, user, reversed.value)],
      });
      await calculateRoles(users);
      return users;
    case 'reset':
      const freshUserData = await resetUserData();
      return freshUserData;
    case 'send':
      console.log(`Sending GIF ${gifIdx.value} in #bot-commands`);
      interaction.reply({ content: text.gifs.sus[gifIdx.value] });
      (await bot.channels.fetch(botCommandsId)).send(text.gifs.sus[gifIdx.value]);
      break;
    case 'save':
      console.log(`Saving:\n${JSON.stringify(users, null, 2)}`);
      saveUserData(users);
      interaction.reply({ content: 'Done.' });
      break;
    case 'score':
      if (target && target.value === clientId) interaction.reply({ content: 'CCP have perfect social credit score!' });
      else if (target) interaction.reply({ content: `${target.user.username} has a social credit score of ${users[target.value]}` });
      else interaction.reply({ content: `${user.username} has a social credit score of ${users[user.id]}` });
      break;
    default:
      interaction.reply({ content: 'This command is disabled temporarily.' });
      break;
  }
  return users;
};
