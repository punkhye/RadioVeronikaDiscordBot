const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top10')
    .setDescription('Displays the current top 10 chart from Radio Veronika'),

  async execute(interaction) {
    try {
      // Fetch the data from the source (you can adjust this URL and parsing logic as needed)
      const response = await axios.get('https://www.radioveronika.bg/chart/veronika-top-10');
      const chartData = response.data; // Adjust to extract data as needed
      
      // Create an embed to display the char

      // Populate the embed with chart information
      // (Modify this part based on how data is parsed)
      chartData.forEach((item, index) => {
        embed.addFields({
          name: `${index + 1}. ${item.title}`, // Adjust 'item.title' as needed
          value: `Artist: ${item.artist}`, // Adjust 'item.artist' as needed
          inline: false,
        });
      });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching chart data:', error);
      await interaction.reply({ content: 'There was an error fetching the top 10 chart.', ephemeral: true });
    }
  },
};
