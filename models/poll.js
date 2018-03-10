const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
    name: String,
    options: [String],
    createdAt: { type: Date, default: Date.now() },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        username: String
    },
    votes:  [
        {
            type: Number,
            default: 0,
        },
    ],
    // store the voters, will use this to prevent double voting
    voters: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        },
    ],
});

module.exports = mongoose.model('Poll', PollSchema);