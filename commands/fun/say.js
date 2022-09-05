const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make HooliganBot speak some text')
        .addStringOption((option) =>
            option.setName('text')
            .setDescription('Text to speak')
            .setRequired(true)
        ),

    async execute(interaction) {
        let text = interaction.options.getString('text');
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            await interaction.reply({content: `You must be in a voice channel!`, ephemeral: true });
            return;
        }
        client.tools.voiceTTS(text, voiceChannel);
        await interaction.reply(`"${text}"`);
    },
};