const { ActivityType } = require('discord.js');

module.exports = async(client) => {
    client.logger.ready(`Bot is ready! (${client.user.tag})`);
    client.user.setPresence({
        activities: [{ name: 'you always', type: ActivityType.Watching }],
        status: 'online'
    });
}