const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { REST } = require("@discordjs/rest");

// Function to fetch current song metadata
async function getRadioMetadata() {
    try {
        const response = await axios.get('https://meta.metacast.eu/?radio=radioveronika', {
            timeout: 24000 
        });

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
        .setDescription('Показвам коя песен върви в момента.'),
    async execute({ interaction }) {
        try {
            // Acknowledge the interaction and extend the response time
            await interaction.reply({ content: 'В момента се обработва информацията...', ephemeral: true });

            // Fetch the metadata
            const metadata = await getRadioMetadata();

            // Check if metadata was fetched successfully
            if (metadata) {
                const currentArtist = metadata.current_artist;
                const currentSong = metadata.current_song;

                // Check if both artist and song are available
                if (currentArtist && currentSong) {
                    await interaction.editReply(`Сега се изпълнява: ${currentArtist} - ${currentSong}`);
                    console.log(`Сега се изпълнява: ${currentArtist} - ${currentSong}`);
                } else {
                    await interaction.editReply('Не можах да получа информация за текущата песен.');
                }
            } else {
                await interaction.editReply('Грешка при получаването на информация за песента');
            }
        } catch (error) {
            console.error('Error in command execution:', error);

            // Ensure that the interaction is valid before attempting to reply
            if (!interaction.isReplied() && !interaction.isDeferred()) {
                try {
                    await interaction.editReply('Възникна проблем при получаването на информацията за песента.');
                } catch (replyError) {
                    console.error('Error replying to interaction:', replyError);
                }
            } else {
                console.log('Interaction was already replied or deferred.');
            }
        }
    }
};
