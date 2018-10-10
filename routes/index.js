const async = require("async");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("../schema");

module.exports = app => {
	app.all("/", function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	});

	app.use(bodyParser());

	app.get("/api/links", (req, res) => {
		const { page } = req.query;
		const paginatedResultsQuery = cb => {
			db.Link.find()
				.sort({ created_at: -1 })
				.skip((parseInt(page - 1) || 0) * 5)
				.limit(5)
				.exec((err, results) => {
					if (err) {
						res.status(500).send("Something went wrong");
					}

					cb(null, { results, query: req.query });
				});
		};

		const countQuery = cb => {
			db.Link.countDocuments({}, (err, count) => {
				if (err) {
					res.status(500).send("Something went wrong");
				}

				cb(null, count);
			});
		};

		async.parallel([paginatedResultsQuery, countQuery], (err, results) => {
			if (err) {
				res.status(500).send("Something went wrong");
			}

			res.json({ ...results[0], totalHits: results[1] });
		});
	});

	app.get("/api/search", (req, res) => {
		const { page, query } = req.query;
		const searchQuery = {
			$text: { $search: query || "" }
		};

		const paginatedResultsQuery = cb => {
			db.Link.find(searchQuery)
				.sort({ created_at: -1 })
				.skip((parseInt(page - 1) || 0) * 5)
				.limit(5)
				.exec((err, results) => {
					if (err) {
						res.status(500).send("Something went wrong");
					}

					cb(null, { results, query: req.query });
				});
		};

		const countQuery = cb => {
			db.Link.countDocuments(searchQuery, (err, count) => {
				if (err) {
					res.status(500).send("Something went wrong");
				}

				cb(null, count);
			});
		};

		async.parallel([paginatedResultsQuery, countQuery], (err, results) => {
			if (err) {
				res.status(500).send("Something went wrong");
			}

			res.json({ ...results[0], totalHits: results[1] });
		});
	});

	app.post("/api/new", (req, res) => {
		db.Link.create(req.body, (err, newLink) => {
			if (err) {
				// Leave this console.log for checking post bodies inside heroku logs if something goes wrong
				console.log(req.body);
				res.status(500).send("Something went wrong");
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
					res.status(500).send("Something went wrong");
				}

				res.json({ ...updatedLink._doc });
			}
		);
	});

	app.get("/api/delete/:_id", (req, res) => {
		const { _id } = req.params;

		db.Link.findOneAndDelete({ _id }, err => {
			if (err) {
				res.status(500).send("Something went wrong");
			}

			res.status(200).send(`Deleted post ${_id}`);
		});
	});

	app.get("/api/tags", (req, res) => {
		db.Link.find().distinct("tags", (err, tags) => {
			if (err) {
				res.status(500).send("Something went wrong");
			}

			res.json(tags);
		});
	});
};
