
require('dotenv').config();

const {REST} = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
//const { Client, Intents, Collection } = require('discord.js');
const { Client,GatewayIntentBits, Collection  } = require('discord.js');
const { Player } = require("discord-player")
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');

const fs = require('fs');
const path = require('path');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages
    ]
});

client.commands = new Collection();

// Register the `/play` command
const playCommand = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Join your voice channel and play the radio'),
    async execute({ interaction }) {
        // Ensure the user is in a voice channel
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply('Трябва да си във Voice Channel за да мога да влезна!');
        }

        try {
            // Join the voice channel
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            // Play the radio stream
            const radioStreamUrl = 'http://31.13.223.148:8000/veronika.mp3'; // Replace with the actual stream URL
            const resource = createAudioResource(radioStreamUrl);
            const player = createAudioPlayer();
            connection.subscribe(player);
            player.play(resource);

            await interaction.reply(`Радио Вероника влезна в канал '${voiceChannel.name}!' `);
        } catch (error) {
            console.error(error);
            await interaction.reply('Радио Вероника не успя да се свърже...');
        }
    }
};

// Register commands on the bot
client.commands.set(playCommand.data.name, playCommand);

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

    // Register slash commands with Discord
    const guild = client.guilds.cache.first();
    if (guild) {
        await guild.commands.set(client.commands.map(command => command.data.toJSON()));
        console.log('Slash commands registered!');
    }
});

//  Log in using the bot token
client.login(process.env.TOKEN);