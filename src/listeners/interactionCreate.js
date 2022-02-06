const { buildLeaderboardEmbed, resetUserData, saveUserData } = require('../utils');
const { clientId } = require('../../config/constants');

module.exports = async function handleInteractionCreate(interaction, users) {
  const { user } = interaction;
  const target = interaction.options.get('comrade');
  const reversed = interaction.options.get('reverse');
  switch (interaction.commandName) {
    case 'help':
      interaction.reply({ content: 'Use the /score command to view social credit score determined by :ToadOk: (+1) and :NotOkToad: (-1).' });
      break;
    case 'rank':
      interaction.reply({ content: 'Fetching from CCP Database...' });
      interaction.channel.send({
        embeds: [await buildLeaderboardEmbed(users, user, reversed.value)],
      });
      return users;
    case 'reset':
      const freshUserData = await resetUserData();
      return freshUserData;
    case 'save':
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
