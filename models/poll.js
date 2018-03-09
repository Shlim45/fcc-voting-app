const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
    name: String,
    optionA: String,
    optionB: String,
    createdAt: { type: Date, default: Date.now() },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    votes:  {
                optionA: {
                    type: Number,
                    default: 0,
                },
                optionB: {
                    type: Number,
                    default: 0,
                },
            },
});

module.exports = mongoose.model('Poll', PollSchema);