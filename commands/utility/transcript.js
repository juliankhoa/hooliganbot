const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transcript')
        .setDescription('Print a transcript of recent voice chat'),

    async execute(interaction) {
        let voiceLog = client.apiServer.guildVoiceLogs[interaction.guild.id];
        if (voiceLog != undefined && voiceLog.length > 0) {
            let messages = [];
            for (let msg of voiceLog) {
                let unixTimestamp = Math.floor(new Date(msg.timestamp).getTime() / 1000);
                messages.push({
                    name: msg.content,
                    value: `${msg.user.split('#')[0]} <t:${unixTimestamp}:T>`
                });
            }

            let responseEmbed = {
                title: 'Voice Chat Transcript',
                color: '#000000',
                fields: messages,
                timestamp: new Date().toISOString()
            };
            await interaction.reply({ embeds: [responseEmbed] });
        }
        else {
            await interaction.reply('Transcript is empty! Try speaking in voice chat.');
        }
    },
};