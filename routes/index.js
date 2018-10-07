const bodyParser = require("body-parser");
const async = require("async");
const db = require("../schema");

module.exports = app => {
	app.use(bodyParser());

	app.get("/api/search", (req, res) => {
		const { page, query } = req.query;
		const searchQuery = {
			$text: { $search: query }
		};

		db.Link.createIndexes({ author: "text", name: "text" });

		const paginatedResultsQuery = cb => {
			db.Link.find(searchQuery)
				.skip(parseInt(page) || 0)
				.limit(5)
				.exec((err, results) => {
					if (err) {
						return cb(err);
					}

					cb(null, { results, query: req.query });
				});
		};

		const countQuery = cb => {
			db.Link.countDocuments(query, (err, count) => {
				if (err) {
					return cb(err);
				}
				cb(null, count);
			});
		};

		async.parallel([paginatedResultsQuery, countQuery], (err, results) => {
			if (err) throw err;
			res.json({ ...results[0], totalHits: results[1] });
		});
	});

	app.post("/api/new", (req, res) => {
		db.Link.create(req.body, (err, newLink) => {
			if (err) {
				throw err;
			} else {
				res.json(newLink);
			}
		});
	});

	app.post("/api/update", (req, res) => {
		const { _id, ...update } = req.body;

		db.Link.findOneAndUpdate(
			{ _id },
			{ ...update, updated_at: new Date() },
			(err, updatedLink) => {
				if (err) {
					throw err;
				} else {
					res.json({ ...updatedLink._doc, ...update });
				}
			}
		);
	});

	app.get("/api/delete/:_id", (req, res) => {
		const { _id } = req.params;

		db.Link.findOneAndDelete({ _id }, err => {
			if (err) {
				throw err;
			}

			res.json(`Deleted post ${_id}`);
		});
	});
};
