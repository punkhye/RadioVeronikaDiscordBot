const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top10')
        .setDescription('Displays the top 10 songs on the chart.'),
    async execute({ interaction }) {
        try {
            // Add the logic for the command here
            await interaction.reply('Top 10 command executed!');
        } catch (error) {
            console.error('Error executing top10 command:', error);
            await interaction.reply({ content: 'An error occurred while executing the top 10 command.', ephemeral: true });
        }
    },
};
