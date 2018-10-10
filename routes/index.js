const async = require("async");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("../schema");

module.exports = app => {
	// Add headers
	app.use(function(req, res, next) {
		// Website you wish to allow to connect
		res.setHeader("Access-Control-Allow-Origin", "http://localhost:8888");

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

		// Set to true if you need the website to include cookies in the requests sent
		// to the API (e.g. in case you use sessions)
		res.setHeader("Access-Control-Allow-Credentials", true);

		// Pass to next layer of middleware
		next();
	});

	app.use(bodyParser());

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept"
		);
		next();
	});

	app.get("/api/search", (req, res) => {
		const { page, query } = req.query;
		const searchQuery = {
			$text: { $search: query }
		};

		const paginatedResultsQuery = cb => {
			db.Link.find(searchQuery)
				.sort({ created_at: -1 })
				.skip((parseInt(page - 1) || 0) * 5)
				.limit(5)
				.exec((err, results) => {
					if (err) {
						throw err;
					}

					cb(null, { results, query: req.query });
				});
		};

		const countQuery = cb => {
			db.Link.countDocuments(searchQuery, (err, count) => {
				if (err) {
					throw err;
				}

				cb(null, count);
			});
		};

		async.parallel([paginatedResultsQuery, countQuery], (err, results) => {
			if (err) {
				throw err;
			}

			res.json({ ...results[0], totalHits: results[1] });
		});
	});

	app.post("/api/new", (req, res) => {
		db.Link.create(req.body, (err, newLink) => {
			if (err) {
				throw err;
			}

			res.json(newLink);
		});
	});

	app.post("/api/update/:_id", (req, res) => {
		db.Link.findOneAndUpdate(
			{ _id },
			{
				...req.body,
				$push: {
					updated_at: new Date()
				}
			},
			(err, updatedLink) => {
				if (err) {
					throw err;
				}

				res.json({ ...updatedLink._doc });
			}
		);
	});

	app.get("/api/delete/:_id", (req, res) => {
		const { _id } = req.params;

		db.Link.findOneAndDelete({ _id }, err => {
			if (err) {
				throw err;
			}

			res.status(200).send(`Deleted post ${_id}`);
		});
	});

	app.get("/api/tags", (req, res) => {
		db.Link.find().distinct("tags", (err, tags) => {
			if (err) {
				throw err;
			}

			res.json(tags);
		});
	});
};
