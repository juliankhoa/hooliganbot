const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop Hooliganbot\'s voice chat output'),

    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            await interaction.reply({content: `You must be in a voice channel!`, ephemeral: true });
            return;
        }
        client.tools.voiceTTS('', voiceChannel);
        await interaction.reply('Stopped voice chat output!');
    },
};