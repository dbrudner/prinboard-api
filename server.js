const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(function(req, res, next) {
	// Website you wish to allow to connect
	res.setHeader("Access-Control-Allow-Origin", "*");

	// Request methods you wish to allow
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE"
	);

	// Request headers you wish to allow
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type"
	);

	next();
});

const routes = require("./routes")(app);
const port = process.env.PORT || 3001;
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
