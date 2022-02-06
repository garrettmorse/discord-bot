const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const devCommands = require('./commands/devCommands');
const prodCommands = require('./commands/prodCommands');
const {
  clientId, guildId, token, testGuildId,
} = require('./config/constants');

const rest = new REST({ version: '9' }).setToken(token);
const commands = [...prodCommands]
  .map((command) => command.toJSON());
const adminCommands = [...devCommands, ...prodCommands]
  .map((command) => command.toJSON());

function deployCommands(_commands, guild) {
  rest.put(Routes.applicationGuildCommands(clientId, guild), { body: _commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
}

// deployCommands(commands, guildId);

// deployCommands(adminCommands, testGuildId);
