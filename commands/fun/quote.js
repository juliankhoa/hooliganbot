const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Quote a random entry from the quotes channel'),

    async execute(interaction) {
        let errorEmbed = {
            title: '/quote Error!',
            color: '#FF0000',
            description: 'The quotes channel is invalid or has not been set on this server.\n' +
                         'Use `/set_channel` `feature: Quotes` `channel: <CHANNEL>` to set it.',
            footer: {
                text: '(Admin only)'
            }
        };

        let guildData = await client.database.fetchGuild(interaction.guild.id);
        if (guildData.quotesChannelId == undefined) {
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
        else {
            try {
                let channel = await interaction.guild.channels.fetch(guildData.quotesChannelId);
                let quotes = [];
                await channel.messages.fetch({limit: 100}).then(async(messages) => {
                    for await (let msg of messages) {
                        let normString = msg[1].content.replace('“', '"').replace('”', '"');
                        let quoteMatch = normString.match(/"(.*?)"/);
                        if (quoteMatch) {
                            quotes.push(quoteMatch[0]);
                        }
                    }
                    if (quotes.length == 0) {
                        await interaction.reply({
                            content: `I couldn't find any quotes in <#${channel.id}>!`,
                            ephemeral: true
                        });
                    }
                    else {
                        let response = quotes[Math.floor((Math.random() * quotes.length))];

                        const voiceChannel = interaction.member.voice.channel;
                        if (voiceChannel) client.tools.voiceTTS(response, voiceChannel);

                        await interaction.reply(response);
                    }
                });
            } catch(err) {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }  
        }
    }
};