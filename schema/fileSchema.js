const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
    data: Buffer,
    contentType: String,
});

module.exports = fileSchema;
