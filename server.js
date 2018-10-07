const express = require("express");
const mongoose = require("mongoose");
const app = express();
const routes = require("./routes")(app);
const port = process.env.PORT;
const developmentUrl = "mongodb://localhost/prinboard";

if (process.env.MONGODB_URI) {
	mongoose.connect(process.env.MONGODB_URI);
} else {
	mongoose.connect(
		developmentUrl,
		err => {
			if (err) {
				throw err;
			} else {
				console.log("connected");
			}
		}
	);
}

app.listen(port, () => console.log(`Listening on ${port}`));
