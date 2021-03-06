const mongoose = require("mongoose");
const { Schema } = mongoose;

const linkSchema = new Schema({
	author: { type: String, required: true },
	created_at: { type: Date, default: Date.now },
	name: { type: String, required: true },
	tags: { type: [String], default: [] },
	updated_at: { type: [Date], default: [] },
	url: { type: String, required: true }
});

const linkModel = mongoose.model("Link", linkSchema);
linkSchema.index({ name: "text", author: "text", tags: "text" });

module.exports = linkModel;
