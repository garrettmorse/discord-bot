module.exports = function handleMessageReactionRemove(reaction, _user, users) {
  if (reaction.message.author.id === _user.id) {
    // if reaction is self, don't do anything
    return users[reaction.message.author.id];
  }
  switch (reaction.emoji.name) {
    case 'ToadOk':
      console.log(`${_user.username} (${_user.id}) removed a +50 emoji from ${reaction.message.author.username}'s (${reaction.message.author.id}) message for a total of ${users[reaction.message.author.id] - 50}`);
      return users[reaction.message.author.id] - 50;

    case 'NotOkToad':
      console.log(`${_user.username} (${_user.id}) removed a -100 emoji from ${reaction.message.author.username}'s (${reaction.message.author.id}) message for a total of ${users[reaction.message.author.id] + 100}`);
      return users[reaction.message.author.id] + 100;

    default:
      break;
  }
  return users[reaction.message.author.id];
};
