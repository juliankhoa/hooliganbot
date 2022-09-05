const { getVoiceConnection } = require('@discordjs/voice');

module.exports = async(client, oldState, newState) => {
    try {
        let user = newState.member.user;
        if (user.bot) return;

        const oldVoice = oldState.channel;
        const newVoice = newState.channel;

        const username = user.username.replace(/\s+/g,'');
        if (newVoice != oldVoice) {
            if (oldVoice) {
                await client.tools.voiceTTS(username + ' left', oldVoice);
                client.logger.event(`${user.tag} left ${oldVoice.name}`);
                let guildVoiceUsers = await client.apiServer.updateVoicePresences(oldVoice.guild);
                if (guildVoiceUsers.length == 0) {
                    getVoiceConnection(oldVoice.guild.id).destroy();
                }
            }
            if (newVoice) {
                client.tools.voiceTTS(username + ' joined', newVoice);
                client.logger.event(`${user.tag} joined ${newVoice.name}`);
                client.apiServer.updateVoicePresences(newVoice.guild);
            }
        }
    } catch(err) {
        client.logger.error('Error occurred on voiceStateUpdate: ' + err.stack);
    }
};