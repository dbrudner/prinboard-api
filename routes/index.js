const async = require("async");
const bodyParser = require("body-parser");
const db = require("../schema");

module.exports = app => {
	app.all("/", function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	});

	app.use(bodyParser());

	app.get("/api/fetch", (req, res) => {
		const { page, query } = req.query;
		const createSearchQuery = () => {
			if (query) {
				return {
					$text: { $search: query }
				};
			}
			return {};
		};

		const paginatedResultsQuery = cb => {
			db.Link.find(createSearchQuery())
				.sort({ created_at: -1 })
				.skip((parseInt(page - 1) || 0) * 5)
				.limit(5)
				.exec((err, links) => {
					const result = query
						? { links, query: req.query }
						: { links };

					if (err) {
						cb(err);
					}

					cb(null, result);
				});
		};

		const countQuery = cb => {
			db.Link.countDocuments(createSearchQuery(), (err, count) => {
				if (err) {
					cb(err);
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

	app.post("/api/create", (req, res) => {
		db.Link.create(req.body, (err, newLink) => {
			// Leave this console.log for checking post bodies inside heroku logs if something goes wrong
			// Replace this with morgan or another logger at some point
			console.log(req.body);
			if (err) {
				throw err;
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

	app.get("/api/fetch/tags", (req, res) => {
		db.Link.find().distinct("tags", (err, tags) => {
			if (err) {
				res.status(500).send("Something went wrong");
			}

			res.json(tags);
		});
	});
};
