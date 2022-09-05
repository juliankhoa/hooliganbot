const userSchema = require('./schema/user.js'),
guildSchema = require('./schema/guild.js');

// Create/find users Database
module.exports.fetchUser = async function(key){
    let userDoc = await userSchema.findOne({ id: key });

    if (userDoc) {
        return userDoc;
    } else {
        userDoc = new userSchema({
            id: key,
            registeredAt: Date.now()
        })
        await userDoc.save().catch(err => client.logger.error(err));
        return userDoc;
    }
};

// Create/find Guilds Database
module.exports.fetchGuild = async function(key){
    let guildDoc = await guildSchema.findOne({ id: key });
    
    if (guildDoc) {
        return guildDoc;
    } else {
        guildDoc = new guildSchema({
            id: key,
            registeredAt: Date.now()
        })
        await guildDoc.save().catch(err => client.logger.error(err));
        return guildDoc;
    }
};