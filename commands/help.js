const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Показва всички команди и какво правят.'),
    async execute({ interaction }) {
        try {
            // Collect all the available commands and their descriptions
            const commandsList = interaction.client.commands.map(cmd => {
                return `**/${cmd.data.name}** - ${cmd.data.description}`;
            }).join('\n');

            // Check if there are any commands
            if (commandsList.length > 0) {
                await interaction.reply(`Ето всички налични команди:\n\n${commandsList}`);
            } else {
                await interaction.reply('Няма налични команди в момента.');
            }
        } catch (error) {
            console.error('Error generating help message:', error);
            await interaction.reply('Грешка при показването на налични команди.');
        }
    }
};
