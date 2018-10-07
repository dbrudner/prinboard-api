const mongoose = require("mongoose");
const { Schema } = mongoose;

const linkSchema = new Schema({
	author: { type: String, required: true },
	created_at: { type: Date, required: true, default: Date.now },
	name: { type: String, required: true },
	tags: { type: [String], default: [] },
	url: { type: String, required: true }
});

module.exports = mongoose.model("Link", linkSchema);
