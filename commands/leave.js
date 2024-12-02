const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Гониш ме от канала'),
    async execute({ interaction }) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply('Дори не си във Voice Channel. Няма как да излезна!');
        }

        const connection = getVoiceConnection(interaction.guild.id);

        if (connection) {
            connection.destroy();
            await interaction.reply(`Радио Вероника излезе от канал '${voiceChannel.name}!'`);
        } else {
            await interaction.reply('Радио Вероника не е в канал, така че не може да излезе.');
        }
    }
};
