const { SlashCommandBuilder } = require('discord.js');
const ytdl = require('ytdl-core');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sb')
        .setDescription('Play a sound from the soundboard channel')
        .addStringOption((option) =>
            option.setName('sound_name')
            .setDescription('Name of the sound effect from soundboard channel')
            .setRequired(true)
        ),

    async execute(interaction) {
        let soundName = interaction.options.getString('sound_name');

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            await interaction.reply({content: `You must be in a voice channel!`, ephemeral: true });
            return;
        }

        let errorEmbed = {
            title: '/sb Error!',
            color: '#FF0000',
            description: 'The soundboard channel is invalid or has not been set on this server.\n' +
                         'Use `/set_channel` `feature: Soundboard` `channel: <CHANNEL>` to set it.',
            footer: {
                text: '(Admin only)'
            }
        };

        let guildData = await client.database.fetchGuild(interaction.guild.id);
        if (guildData.soundboardChannelId == undefined) {
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
        else {
            try {
                let channel = await interaction.guild.channels.fetch(guildData.soundboardChannelId);
                let found = false;
                await channel.messages.fetch({limit: 100}).then(async(messages) => {
                    for await (let msg of messages) {
                        let kwargs = msg[1].content.split(/\s+|\r?\n|\r/);
                        if (kwargs.length < 2 || !kwargs.at(-1).includes('www.youtube.com/watch')) {
                            continue;
                        }
                        let name = kwargs.slice(0, -1).join(' ').toLowerCase();
                        let url = kwargs.at(-1);
                        
                        if (name == soundName) {
                            found = true;
                            const stream = ytdl(url, { filter: 'audioonly', highWaterMark: 104857600 });
                            client.tools.streamToVoice(stream, voiceChannel);
                            client.logger.cmd(`Playing '${soundName}'...`);
                            await interaction.reply('Playing `' + soundName + '`!');
                            break;
                        }
                    }
                    if (!found) {
                        await interaction.reply({
                            content: `There is no sound called \`${soundName}\` in <#${channel.id}>! ` +
                                     `Try adding it by sending \`${soundName} <YOUTUBE_URL>\` to the channel.`,
                            ephemeral: true
                        });
                    }
                });
            } catch(err) {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};