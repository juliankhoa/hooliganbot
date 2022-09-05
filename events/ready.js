module.exports = async(client) => {
    client.logger.ready(`Bot is ready! (${client.user.tag})`);
    client.user.setActivity('you always', { type: 'WATCHING' });
}