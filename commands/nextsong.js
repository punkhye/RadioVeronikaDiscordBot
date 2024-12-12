const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const {REST} = require("@discordjs/rest");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nextsong')
        .setDescription('Показвам ти следващата песен.'),
    async execute({ interaction }) {
        try {
            //to avoid timeout
            await interaction.reply({ content: 'В момента се обработва информацията за следващата песен...', ephemeral: true });

            // Fetch the radio metadata
            const response = await axios.get('https://meta.metacast.eu/?radio=radioveronika&songsNumber=3', {
                timeout: 24000 
            });

            if (response.status === 200) {
                const metadata = response.data;

                // Extract next song information
                const nextSong = metadata.next_song;
                
                if (nextSong) {
                    const nextArtist = nextSong.artist;
                    const nextTitle = nextSong.title;
                    // Edit the initial message with the actual data
                    await interaction.editReply(`Следващата песен е : ${nextArtist} - ${nextTitle}`);
                    console.log(`Next song: '${nextTitle}' by '${nextArtist}'`);
                } else {
                    await interaction.editReply('Не можах да получа информация за следващата песен.');
                }
            } else {
                console.error('Failed to fetch metadata:', response.status);
                await interaction.editReply('Грешка при получаването на информация за следващата песен.');
            }
        } catch (error) {
            console.error('Error fetching metadata:', error);
            if (!interaction.deferred && !interaction.replied) {
                try {
                    await interaction.reply('Възникна проблем при получаването на информацията за песента.');
                } catch (replyError) {
                    console.error('Error replying to interaction:', replyError);
                }
            }
        }
    }
};
