const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
    id: { type: String },                                   // User ID
    registeredAt: { type: Number, default: Date.now() },    // Date registered to DB
    allowVoiceListening: { type: Boolean, default: true }   // Enable voice listening for transcripts/commands
}));