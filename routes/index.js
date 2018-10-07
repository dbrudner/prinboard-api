const db = require("../schema");
const bodyParser = require("body-parser");

module.exports = app => {
	app.use(bodyParser());

	app.get("/api/posts/search", (req, res) => {
		const { page, query } = req.query;
		const searchQuery = {
			$text: { $search: query }
		};

		db.Link.createIndexes({ author: "text", name: "text" });

		db.Link.find(searchQuery)
			.skip(page)
			.limit(10)
			.exec((err, results) => {
				if (err) {
					throw err;
				}

				console.log(results);

				const totalResults = results.length;
				res.json({ results, query });
			});
	});

	app.post("/api/new", (req, res) => {
		console.log(req.body);

		db.Link.create(req.body, (err, newLink) => {
			if (err) {
				console.log(err);
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
