const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        // default: Date.now
    },
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Log", schema, "logs")