// Importing modules
require('dotenv').config()
const   Discord = require('discord.js'),
        mongoose = require('mongoose'),
        fs = require('fs'),
        util = require('util'),
        readdir = util.promisify(fs.readdir);

const   { REST } = require('@discordjs/rest'),
        { Routes } = require('discord-api-types/v9'),
        { addSpeechEvent } = require('discord-speech-recognition');

client = new Discord.Client({ intents: ['GUILDS', 
                                        'GUILD_MEMBERS',
                                        'GUILD_PRESENCES',
                                        'GUILD_VOICE_STATES',
                                        'GUILD_MESSAGES']
                            });
addSpeechEvent(client, { profanityFilter: false });

// Adding to the client
client.event = new Discord.Collection();
client.commands = new Discord.Collection();
client.database = require('./database/mongoose.js');
client.tools = require('./tools/tools.js');
client.logger = require('./tools/logger.js');
client.apiServer = require('./api/apiServer.js');

async function initBot() {
    // Load events
    client.logger.load('Loading event handlers...');

    const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        const eventName = file.split('.')[0];
        client.on(eventName, event.bind(null, client));
        console.log(`\t+ ${eventName}`);
    }

    // Load commands
    client.logger.load('Loading slash commands...');
    const restCommands = [];
    let folders = await readdir('./commands/');
    folders.forEach(direct => {
        const commandFiles = fs.readdirSync('./commands/' + direct + '/').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/${direct}/${file}`);
            client.commands.set(command.data.name, command);
            restCommands.push(command.data.toJSON());
            console.log(`\t+ ${command.data.name}`);
        }
    })

    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_BOT_TOKEN);
    (async () => {
        try {
            await rest.put(
                Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
                { body: restCommands },
            );
            client.logger.load('Reloaded slash commands');
        } catch(err) {
            client.logger.error('Unable to reload slash commands: ' + err);
        }
    })();

    // Connect to database
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        client.logger.load('Connected to MongoDB');
    }).catch((err) => {
        client.logger.error('Unable to connect to MongoDB: ' + err);
    });

    await client.login(process.env.DISCORD_BOT_TOKEN)
    client.on('error', err => {
        client.logger.error('Unknown error occured: ' + err);
    });
}

initBot();
client.apiServer.initAPI();

process.on('unhandledRejection', err => {
    client.logger.error('Unknown error occured: ' + err);
});