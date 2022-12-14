const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Test HooliganBot\'s latency'),

    async execute(interaction) {
        await interaction.channel.send('Pong!').then(async(msg) => {
            let botPing = Math.floor(msg.createdTimestamp - interaction.createdTimestamp)
            await interaction.reply(`Bot Latency: \`${botPing} ms\`\nAPI Latency: \`${client.ws.ping} ms\``);
        });
    },
};