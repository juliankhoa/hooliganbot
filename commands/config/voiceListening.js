const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voicelistening')
        .setDescription('Turn on/off HooliganBot\'s ability to listen to your voice for transcripts and commands')
        .addBooleanOption(option =>
            option.setName('enabled')
            .setDescription('ON/OFF')
            .setRequired(true)
        ),
    async execute(interaction) {
        let enabled = interaction.options.getBoolean('enabled');

        let userData = await client.database.fetchUser(interaction.user.id);
        userData.allowVoiceListening = enabled;
        await userData.save();
        let status = (enabled) ? 'ON' : 'OFF';
        await interaction.reply({content: `Voice listening is \`${status}\`!`, ephemeral: true });
    },
};