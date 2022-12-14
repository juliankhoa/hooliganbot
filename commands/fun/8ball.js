const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Let the magic 8-ball answer your question')
        .addStringOption((option) =>
            option.setName('question')
            .setDescription('Question you want answered')
            .setRequired(true)
        ),
    async execute(interaction) {
        let replies = [
            // Yes
            'Yes!',
            'Absolutely!',
            'Hell yes.',
            'For sure!',
            'Yup!',
            'Affirmative.',
            'Of course!',
            'Certainly so.',
            'lmao yeah.',
            'Undoubtedly.',
            // No
            'Nope!',
            'Never!',
            'Hell no!',
            'Not in your wildest dreams.',
            'Pfft.',
            'Sorry, bucko.',
            'WTF? No.',
            'Certainly not.',
            'lol no.',
            'Never, ever, ever.',
            // Uncertain
            'Maybe.',
            'I would rather not say.',
            'Who cares?',
            'Possibly.',
            'What difference does it make?',
            'Not my problem.',
            'Ask someone else.',
            'The future is uncertain.',
            // Hopeful
            'I think so.',
            'I hope so.',
            'There is a good chance.',
            'Quite likely.',
            'There is a high probability.',
            'The future looks bright!',
            // Doubtful
            'I doubt it.',
            'I hope not.',
            'There is a small chance.',
            'Unlikely.',
            'The odds are low.',
            'The future is bleak.'
        ];
        let result = replies[Math.floor((Math.random() * replies.length))];
        let responseEmbed = {
            title: 'Magic 8-Ball!',
            color: '#000000',
            fields: [
                {
                    name: interaction.user.username + ' asked:',
                    value: interaction.options.getString('question'),
                },
                {
                    name: 'Answer:',
                    value: result,
                },
            ]
        };
        await interaction.reply({ embeds: [responseEmbed] });
    }
};