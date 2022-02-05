const { token } = require('./config/constants');
const bot = require('./src/bot');
const {
  botReady,
  handleInterrupt,
  interactionCreate,
  messageReactionAdd,
  messageReactionRemove,
} = require('./src/listeners');

let users = {};

bot.once('ready', (_bot) => { users = botReady(_bot); });

bot.login(token);

bot.on('messageReactionAdd', async (reaction, _user) => {
  users[reaction.message.author.id] = messageReactionAdd(reaction, _user, users);
});

bot.on('messageReactionRemove', async (reaction, _user) => {
  users[reaction.message.author.id] = messageReactionRemove(reaction, _user, users);
});

bot.on('interactionCreate', async (interaction) => {
  users = interactionCreate(interaction, users);
});

process.on('SIGINT', () => handleInterrupt(users));
