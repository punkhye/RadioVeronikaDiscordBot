const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

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

module.exports = {
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
                   // await interaction.reply(`Сега се изпълнява: ${currentSong} от ${currentArtist}`);
                    //await interaction.reply(`Песента, която върви в момента е : ${currentArtist} - ${currentSong}`);
                    await interaction.reply(`Сега се изпълнява : ${currentArtist} - ${currentSong} `);
                    console.log(`Сега се изпълнява : ${currentArtist} - ${currentSong} `);
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
