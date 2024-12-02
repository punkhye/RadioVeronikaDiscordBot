const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Влизам във Voice channel-а, в който се намираш и ти пускам най-доброто българско радио!'),
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
