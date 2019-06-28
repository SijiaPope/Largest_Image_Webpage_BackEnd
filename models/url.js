const mongoose = require("mongoose");
const URL = mongoose.Schema({
    inputUrl: String,
    status: Boolean,
    outputUrl: {
        url: String,
        size: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("URL", URL);

