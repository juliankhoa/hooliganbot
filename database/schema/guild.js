const mongoose = require('mongoose');

module.exports = mongoose.model('Guild', new mongoose.Schema({
    id: { type: String },                                   // Guild ID
    registeredAt: { type: Number, default: Date.now() },    // Date registered to DB
    quotesChannelId: { type: String },                      // ID of quotes channel
    soundboardChannelId: { type: String },                  // ID of soundboard channel
}));