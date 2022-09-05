const ytdl = require('ytdl-core');

SOUNDBOARD_COOLDOWN_SEC = 10;
LAST_TRIGGERED_TIMES = {};

module.exports = async(client, message) => {
    try {
        if (message.author.bot || message.content == undefined) return;

        let userData = await client.database.fetchUser(message.author.id);
        let guildData = await client.database.fetchGuild(message.guild.id);

        if (!userData.allowVoiceListening) return;
        client.logger.log(`${message.author.tag}: "${message.content}"`);
        client.apiServer.updateVoiceLog(message);

        let voiceChannel = message.channel;
        if (!voiceChannel) return;

        let searchMessage = ' ' + message.content.toLowerCase() + ' ';

        if (searchMessage.includes('stop')) {
            client.tools.voiceTTS('', voiceChannel);
            client.logger.cmd(`${message.author.tag} used /stop by voice`);
        }
        else if (guildData.soundboardChannelId != undefined) {
            await voiceSoundboard(searchMessage, voiceChannel,
                    guildData.soundboardChannelId, message.author);
        }
    } catch(err) {
        client.logger.error('Error occurred on speech: ' + err);
    }
};

async function voiceSoundboard(searchMessage, voiceChannel, soundboardChannelId, author) {
    if (!LAST_TRIGGERED_TIMES.hasOwnProperty(voiceChannel.guild.id)) {
        LAST_TRIGGERED_TIMES[voiceChannel.guild.id] = new Date(-8640000000000000);
    }
    let timeSinceLastSound = new Date() - LAST_TRIGGERED_TIMES[voiceChannel.guild.id];
    if (timeSinceLastSound < SOUNDBOARD_COOLDOWN_SEC * 1000) {
        return;
    }

    try {
        let channel = await voiceChannel.guild.channels.fetch(soundboardChannelId);
        await channel.messages.fetch({limit: 100}).then(async(messages) => {
            for await (let msg of messages) {
                let kwargs = msg[1].content.split(/\s+|\r?\n|\r/);
                if (kwargs.length < 2 || !kwargs.at(-1).includes('www.youtube.com/watch')) {
                    continue;
                }
                let name = ' ' + kwargs.slice(0, -1).join(' ').toLowerCase() + ' ';
                let url = kwargs.at(-1);
                
                if (searchMessage.includes(name)) {
                    const stream = ytdl(url, { filter: 'audioonly', highWaterMark: 104857600 });
                    client.tools.streamToVoice(stream, voiceChannel);
                    client.logger.cmd(`${author.tag} triggered sound '${name.trim()}' by voice`);
                    LAST_TRIGGERED_TIMES[voiceChannel.guild.id] = new Date();
                    break;
                }
            }
        });
    } catch(err) {
        client.logger.warn(`Error playing sound from channel with ID #${soundboardChannelId}: ${err}`);
    }
}