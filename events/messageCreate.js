module.exports = async(client, message) => {
    try {
        if (message.author.bot) return; // Return if author is bot
        if (!message.guild) return; // Return if DMs or group chat

        // Check if message mentions bot only
        if (message.mentions.has(client.user) && !message.mentions.everyone) {
            client.logger.log(`${message.author.tag} mentioned bot`);
            return message.reply({ content: 'I only answer to commands. Leave me alone.', allowedMentions: { repliedUser: true }});
        }

        if (message.content.toLowerCase().includes('hooliganbot')) {
            return message.reply({ content: 'heard you were talkin shit', allowedMentions: { repliedUser: true }});
        }

        client.apiServer.updateMessageLog(message);

    } catch(err) {
        client.logger.error('Error occurred on messageCreate: ' + err);
    }

};