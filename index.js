require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {REST} = require("@discordjs/rest");


// Import command modules
const joinCommand = require('./commands/join.js');
const nowPlayingCommand = require('./commands/nowplaying.js');
const leaveCommand = require('./commands/leave.js');
const nextSongCommand = require('./commands/nextsong.js');
const helpCommand = require('./commands/help.js');
const top10Command = require('./commands/top10.js'); 


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
    ]
});

client.commands = new Collection();

// Register commands
client.commands.set(joinCommand.data.name, joinCommand);
client.commands.set(nowPlayingCommand.data.name, nowPlayingCommand);
client.commands.set(leaveCommand.data.name, leaveCommand);
client.commands.set(nextSongCommand.data.name, nextSongCommand);
client.commands.set(helpCommand.data.name, helpCommand);
client.commands.set(top10Command.data.name, top10Command);

// Handle interactions
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute({ interaction });
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Проблем с командата!', ephemeral: true });
    }
});

// Log the bot in and register commands
client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const guild = client.guilds.cache.first();
    if (guild) {
        await guild.commands.set(client.commands.map(command => command.data.toJSON()));
        console.log('Slash commands registered!');
    }
    else{
        console.log('error. the commands are not registered!');
    }
});

// Log in using the bot token
client.login(process.env.TOKEN);
