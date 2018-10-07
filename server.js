const express = require("express");
const mongoose = require("mongoose");
const app = express();
const routes = require("./routes")(app);
const port = 3000 || process.env.PORT;
const developmentUrl = "mongodb://localhost/prinboard";

if (process.env.MONGODB_URI) {
	mongoose.connect(process.env.MONGODB_URI);
} else {
	mongoose.connect(
		developmentUrl,
		err => {
			if (err) {
				throw err;
			}
		}
	);
}

app.listen(port, () => console.log(`Listening on ${port}`));
