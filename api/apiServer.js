const   express = require('express'),
        http = require('http');

const app = express();
const PORT = 3000;

module.exports = {
    guildMessageLogs: {},   // Map of guild IDs to array of recent messages
    guildVoiceLogs: {},     // Map of guild IDs to array of recent voice transcripts
    guildvoicePresences: {} // Map of guild IDs to array of active voice channel members
};
const MESSAGE_MEMORY = 10;
const VOICE_LOG_MEMORY = 20;
const DEFAULT_AVATAR = 'https://cdn.discordapp.com/embed/avatars/0.png';

module.exports.updateMessageLog = async function(message) {
    if (!client.apiServer.guildMessageLogs.hasOwnProperty(message.guildId)) {
        client.apiServer.guildMessageLogs[message.guildId] = [];
    }
    let messageLog = client.apiServer.guildMessageLogs[message.guildId];

    if (messageLog.length >= MESSAGE_MEMORY) {
        messageLog.shift();
    }

    let attachedFiles = [];
    message.attachments.forEach((att) => {
        let contentType = '', fileType = '';
        if (att.contentType && att.contentType.includes('/')) {
            contentType = att.contentType.split('/')[0];
            fileType = att.contentType.split('/')[1];
        }

        attachedFiles.push({
            name: att.name,
            contentType: contentType,
            fileType: fileType
        });
    });

    messageLog.push({
        messageURL: message.url,
        content: await client.tools.formatMentions(message.content),
        attachments: attachedFiles,
        user: message.author.tag,
        avatarURL: message.author.avatarURL() || DEFAULT_AVATAR,
        channel: message.channel.name,
        timestamp: new Date().toJSON()
    });
};

module.exports.updateVoiceLog = async function(message) {
    // speech message type doesn't have direct guildId property
    if (!client.apiServer.guildVoiceLogs.hasOwnProperty(message.guild.id)) {
        client.apiServer.guildVoiceLogs[message.guild.id] = [];
    }
    let voiceLog = client.apiServer.guildVoiceLogs[message.guild.id];

    // if newest voice message is from the same user as the last one,
    // and is within 4 seconds, append to previous message
    if (voiceLog.length > 0) {
        let lastMessage = voiceLog[voiceLog.length - 1];
        if (message.author.tag == lastMessage.user) {
            let timeSince = new Date() - new Date(lastMessage.timestamp);
            if (timeSince < 4000) {
                lastMessage.content += ' ' + message.content;
                return;
            }
        }
    }
    if (voiceLog.length >= VOICE_LOG_MEMORY) {
        voiceLog.shift();
    }
    voiceLog.push({
        content: message.content,
        user: message.author.tag,
        avatarURL: message.author.avatarURL() || DEFAULT_AVATAR,
        channel: message.channel.name,
        timestamp: new Date().toJSON()
    });
};

module.exports.updateVoicePresences = async function(guild) {
    let voicePresences = [];
    let voiceChannels = guild.channels.cache.filter(c => c.type == 'GUILD_VOICE');
    for (let [_, channel] of voiceChannels) {
        for (let [_, member] of channel.members) {
            if (member.user.bot) continue;
            let status = '', activity = '';
            if (member.presence) {
                status = member.presence.status;
                if (member.presence.activities.length) {
                    for (a of member.presence.activities) {
                        if (a.type == 'PLAYING' || a.type == 'STREAMING') {
                            activity = a.type.toLowerCase() + ' ' + a.name;
                            break;
                        }
                    }
                }
            }
            voicePresences.push({
                user: member.user.tag,
                avatarURL: member.user.avatarURL() || DEFAULT_AVATAR,
                status: status,
                activity: activity,
                channel: channel.name,
                timeJoined: new Date().toJSON()
            });
        }
    }
    client.apiServer.guildvoicePresences[guild.id] = voicePresences;
    return voicePresences;
};

module.exports.initAPI = async function() {
    app.use(express['static'](__dirname));

    app.get('/messageLogs/:id', function(req, res) {
        let data = client.apiServer.guildMessageLogs[req.params.id];
        if (!data) data = [];
        res.status(200).json(data);
    });

    app.get('/voiceLogs/:id', function(req, res) {
        let data = client.apiServer.guildVoiceLogs[req.params.id];
        if (!data) data = [];
        res.status(200).json(data);
    });

    app.get('/voicePresences/:id', function(req, res) {
        let data = client.apiServer.guildvoicePresences[req.params.id];
        if (!data) data = [];
        res.status(200).json(data);
    });

    app.get('*', function(req, res) {
        res.status(404).send('Unrecognized API call');
    });

    app.use(function(err, req, res, next) {
        if (req.xhr) {
            res.status(500).send('Oops, something went wrong!');
        }
        else {
            next(err);
        }
    });

    var httpServer = http.createServer(app);
    httpServer.listen(PORT);
    client.logger.load('API running on port ' + PORT);
};