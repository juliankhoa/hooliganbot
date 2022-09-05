module.exports = async(client, interaction) => {
    try {
        if (!interaction.isCommand()) return;
        let commandName = interaction.commandName;
        const command = client.commands.get(commandName);
        if (!command) return;
        
        client.logger.cmd(`${interaction.user.tag} used /${commandName}`);
        await command.execute(interaction);
    }
    catch(err) {
        let responseEmbed = {
            title: `/${commandName} Error!`,
            color: '#FF0000',
            description: 'Something went wrong while executing this command.'
        };
        interaction.reply({ embeds: [responseEmbed], ephemeral: true });
        client.logger.error(`Unable to execute /${commandName}: ` + err);
    }
};