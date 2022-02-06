const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const devCommands = require('./commands/devCommands');
const prodCommands = require('./commands/prodCommands');
const bot = require('./src/bot');
const {
  clientId, guildId, token, testGuildId,
} = require('./config/constants');
const { roleColors, roles, roleReasons } = require('./config/text.json');

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

async function deployRoles(_roles, _guild) {
  await bot.login(token);
  const guild = await bot.guilds.fetch(_guild);
  _roles.forEach((role, idx) => {
    guild.roles.create({
      name: role,
      color: roleColors[idx],
      reason: roleReasons[idx],
    })
      .then(console.log)
      .catch(console.error);
  });
}

// deployCommands(commands, guildId);

// deployCommands(adminCommands, testGuildId);

// deployRoles(roles, guildId);
