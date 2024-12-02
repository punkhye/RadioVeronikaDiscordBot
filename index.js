require('dotenv').config();

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages
    ]
});

client.commands = new Collection();

// Function to fetch current song metadata
async function getRadioMetadata() {
    try {
        const response = await axios.get('https://meta.metacast.eu/?radio=radioveronika');
        if (response.status === 200) {
            return response.data; // This should contain the JSON metadata
        } else {
            console.error('Failed to fetch metadata:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error fetching metadata:', error);
        return null;
    }
}

// Register the `/play` command
const playCommand = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Join your voice channel and play the radio'),
    async execute({ interaction }) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply('Трябва да си във Voice Channel за да мога да влезна!');
        }

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            const radioStreamUrl = 'http://31.13.223.148:8000/veronika.mp3';
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

// Register the `/nowplaying` command
const nowPlayingCommand = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show the current artist and song name'),
    async execute({ interaction }) {
        try {
            const metadata = await getRadioMetadata();
            if (metadata) {
                const currentArtist = metadata.current_artist;
                const currentSong = metadata.current_song;

                if (currentArtist && currentSong) {
                    await interaction.reply(`Сега се изпълнява: ${currentSong} от ${currentArtist}`);
                    console.log(`Сега се изпълнява: ${currentSong} от ${currentArtist}`);
                } else {
                    await interaction.reply('Не можах да получа информация за текущата песен.');
                }
            } else {
                await interaction.reply('Грешка при получаването на информация за песента');
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('Възникна проблем при получаването на информацията за песента.');
        }
    }
};

// Register commands on the bot
client.commands.set(playCommand.data.name, playCommand);
client.commands.set(nowPlayingCommand.data.name, nowPlayingCommand);

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
});

// Log in using the bot token
client.login(process.env.TOKEN);
