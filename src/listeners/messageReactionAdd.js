module.exports = function handleMessageReactionAdd(reaction, _user, users) {
  if (reaction.message.author.id === _user.id) {
    // if reaction is self, don't do anything
    return users[reaction.message.author.id];
  }
  switch (reaction.emoji.name) {
    case 'ToadOk':
      console.log(`${_user.username} gave ${reaction.message.author.username} a +1 for a total of ${users[reaction.message.author.id]}`);
      return users[reaction.message.author.id] + 1;

    case 'NotOkToad':
      console.log(`${_user.username} gave ${reaction.message.author.username} a -1 for a total of ${users[reaction.message.author.id]}`);
      return users[reaction.message.author.id] - 1;

    default:
      break;
  }
  return users[reaction.message.author.id];
};
