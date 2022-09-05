const { MessageMentions: { USERS_PATTERN } } = require('discord.js');
const { getVoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const googleTextToSpeech = require('@google-cloud/text-to-speech');
const Duplex = require('stream').Duplex;

module.exports.voiceConnection = async function(voiceChannel) {
    const connection = getVoiceConnection(voiceChannel.guild.id);
    if (connection) {
        return connection;
    }
    else {
        return joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            selfDeaf: false
        });
    }
};

module.exports.streamToVoice = async function(stream, voiceChannel) {
    const connection = await client.tools.voiceConnection(voiceChannel);
    const player = createAudioPlayer();
    connection.subscribe(player);
    const resource = createAudioResource(stream);
    player.play(resource);
};

module.exports.voiceTTS = async function(text, voiceChannel) {
    const ttsClient = new googleTextToSpeech.TextToSpeechClient();
    const request = {
        input: { text },
        voice: {
            languageCode: 'en-GB',
            name: 'en-GB-Wavenet-B',
            ssmlGender: 'MALE',
        },
        audioConfig: { audioEncoding: 'OGG_OPUS' }
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    const stream = new Duplex();
    stream.push(response.audioContent);
    stream.push(null);
    await client.tools.streamToVoice(stream, voiceChannel);
};

// Replace Discord's mention syntax with the actual user name being mentioned
module.exports.formatMentions = async function(str) {
    const matches = str.match(USERS_PATTERN);
    if (!matches) return str;

    for (let mention of matches) {
        let id = mention.replace(/\D/g,'');
        let user = client.users.cache.get(id);
        str = str.replace(mention, '@' + user.username);
    }
    return str;
};