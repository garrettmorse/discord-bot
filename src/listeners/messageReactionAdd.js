module.exports = function handleMessageReactionAdd(reaction, _user, users) {
  if (reaction.message.author.id === _user.id) {
    // if reaction is self, don't do anything
    return users[reaction.message.author.id];
  }
  switch (reaction.emoji.name) {
    case 'ToadOk':
      console.log(`${_user.username} (${_user.id}) gave ${reaction.message.author.username} (${reaction.message.author.id}) a +50 for a total of ${users[reaction.message.author.id] + 50}`);
      return users[reaction.message.author.id] + 50;

    case 'NotOkToad':
      console.log(`${_user.username} (${_user.id}) gave ${reaction.message.author.username} (${reaction.message.author.id}) a -100 for a total of ${users[reaction.message.author.id] - 100}`);
      return users[reaction.message.author.id] - 100;

    default:
      break;
  }
  return users[reaction.message.author.id];
};
