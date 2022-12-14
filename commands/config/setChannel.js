const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription('Set special channels for quotes, soundboard, etc. (ADMIN ONLY)')
        .addStringOption(option =>
            option.setName('feature')
            .setDescription('Feature that this channel will serve')
            .setRequired(true)
            .addChoices(
                { name: 'Quotes', value: 'Quotes' },
                { name: 'Soundboard', value: 'Soundboard' },
            )
        )
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('Text channel to use as source')
            .setRequired(true)
        ),
    async execute(interaction) {
        let feature = interaction.options.getString('feature');
        let channel = interaction.options.getChannel('channel');

        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            let responseEmbed = {
                title: '/setchannel Error!',
                color: '#FF0000',
                description: 'You do not have permission to set feature channels!',
                footer: {
                    text: '(Admin only)'
                }
            };
            await interaction.reply({ embeds: [responseEmbed], ephemeral: true });

            client.logger.log(`${interaction.user.tag} tried to set ${feature} channel in ${interaction.guild.name}`);
        }
        else if (channel.type !== 'GUILD_TEXT') {
            let responseEmbed = {
                title: '/setchannel Error!',
                color: '#FF0000',
                description: `${feature} channel must be a text channel!`
            };
            await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
        }
        else {
            let guildData = await client.database.fetchGuild(interaction.guild.id);
            guildData[feature.toLowerCase() + 'ChannelId'] = channel.id;
            await guildData.save();
            await interaction.reply({content: `${feature} channel has been set to <#${channel.id}>!`, ephemeral: true });
        }
    },
};