const { SlashCommandBuilder } = require('@discordjs/builders');
const puppeteer = require('puppeteer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top10')
        .setDescription('Показвам седмичната класация "Вероника Hot 10".'),
    async execute({ interaction }) {
        try {
            // Acknowledge the interaction to prevent timeout
            await interaction.deferReply();

            // Launch Puppeteer
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();

            // Navigate to the website
            await page.goto('https://www.radioveronika.bg/chart/veronika-top-10', { waitUntil: 'networkidle2' });

            // Wait for the chart grid to load
            await page.waitForSelector('#chart-grid');

            // Extract song titles and artists
            const chartData = await page.evaluate(() => {
                const songs = [];
                const songElements = document.querySelectorAll('#chart-grid .song-data');

                songElements.forEach((element, index) => {
                    if (index < 10) { // Limit to top 10
                        const titleElement = element.querySelector('.chart-song-title');
                        const artistElement = element.querySelector('.chart-song-artist');

                        const title = titleElement ? titleElement.textContent.trim() : 'Unknown Title';
                        const artist = artistElement ? artistElement.textContent.trim() : 'Unknown Artist';

                        songs.push({ rank: index + 1, title, artist });
                    }
                });

                return songs;
            });

            console.log('Вероника Hot 10:', chartData);

            await browser.close();

            // Format and respond with the extracted data
            const formattedData = chartData
                .map(song => `${song.rank}. ${song.artist} - ${song.title} `)
                .join('\n');

            await interaction.editReply(`Вероника Hot 10 :\n\n${formattedData}`);
        } catch (error) {
            console.error('Error executing top10 command:', error);
            if (!interaction.replied) {
                await interaction.reply({ content: 'Проблем при обработването на информация.', ephemeral: true });
            }
        }
    },
};
