const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nextsong')
        .setDescription('Показвам ти следващата песен.'),
    async execute({ interaction }) {
        try {
            // Fetch the radio metadata
            const response = await axios.get('https://meta.metacast.eu/?radio=radioveronika&songsNumber=3');
            
            if (response.status === 200) {
                const metadata = response.data;

                // Extract next song information
                const nextSong = metadata.next_song;
                
                if (nextSong) {
                    const nextArtist = nextSong.artist;
                    const nextTitle = nextSong.title;
                  //  await interaction.reply(`Следващата песен е : '${nextTitle}' от '${nextArtist}'`);
                  await interaction.reply(`Следващата песен е : ${nextArtist} - ${nextTitle}`);
                    console.log(`Next song: '${nextTitle}' by '${nextArtist}'`);
                } else {
                    await interaction.reply('Не можах да получа информация за следващата песен.');
                }
            } else {
                console.error('Failed to fetch metadata:', response.status);
                await interaction.reply('Грешка при получаването на информация за песента.');
            }
        } catch (error) {
            console.error('Error fetching metadata:', error);
            await interaction.reply('Възникна проблем при получаването на информацията за песента.');
        }
    }
};
