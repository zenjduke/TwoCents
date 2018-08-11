// Scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

module.exports = function(app) {

	app.get("/", function(req, res) {
		db.Article.find({}, null, {sort: {created: -1}}, function(err, data) {
			if(data.length === 0) {
				res.render("placeholder", {message: "There are no articles to view. Please click \"Get New Articles\" for current news."});
			}
			else{
				res.render("index", {articles: data});
			}
		});
	});

	app.get("/myarticles", function(req, res) {
		db.Article.find({saved: true}, null, {sort: {created: -1}}, function(err, data) {
			if(data.length === 0) {
				res.render("placeholder", {message: "You have not saved any articles yet."});
			}
			else {
				res.render("saved", {saved: data});
			}
		});
	});

	app.get("/delete", function(req, res) {
		db.Article.remove({}, function(err, data) {
			res.render("placeholder", {message: "There are no articles to view. Please click \"Get New Articles\" for fresh news."});
		});
	});


	app.get("/articles/saved", function(req, res) {
		// Grab every document in the Articles collection
		db.Article.find({saved:true})
		.then(function(dbArticle) {
		// If we were able to successfully find Articles, send them back to the client
		res.json(dbArticle);
		})
		.catch(function(err) {
		// If an error occurred, send it to the client
		res.json(err);
		});
	});

	// A GET route for scraping the NYT website
	app.get("/scrape", function(req, res) {
		// First, we grab the body of the html with request
		request("https://www.nytimes.com/section/politics", function(error, response, html) {
			// Then, we load that into cheerio and save it to $ for a shorthand selector
			var $ = cheerio.load(html);
			var result = {};
			
			// Now, we grab every h2 within an article tag, and do the following:
			$("div.story-body").each(function(i, element) {
			
			var link = $(element).find("a").attr("href");
			var title = $(element).find("h2.headline").text().trim();
			var summary = $(element).find("p.summary").text().trim();
			var img = $(element).parent().find("figure.media").find("img").attr("src");
			result.link = link;
			result.title = title;
			if (summary) {
				result.summary = summary;
			};
			if (img) {
				result.img = img;
			}
			else {
				result.img = $(element).find(".wide-thumb").find("img").attr("src");
			};
		
			// Create a new Article using the `result` object built from scraping
			db.Article.create(result)
				.then(function(dbArticle) {
				// View the added result in the console
				console.log(dbArticle);
				})
				.catch(function(err) {
				// If an error occurred, send it to the client
				return res.json(err);
				});
			});
		
			// If we were able to successfully scrape and save an Article, send a message to the client
			res.redirect('/');
		});
	
	});
	
	// Route for getting all Articles from the db
	app.get("/articles", function(req, res) {
		// Grab every document in the Articles collection
		db.Article.find({})
			.then(function(dbArticle) {
			// If we were able to successfully find Articles, send them back to the client
			res.json(dbArticle);
			})
			.catch(function(err) {
			// If an error occurred, send it to the client
			res.json(err);
			});
	});
	
	// Route for grabbing a specific Article by id, populate it with it's note
	app.get("/articles/:id", function(req, res) {
		// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
		db.Article.findOne({ _id: req.params.id })
			// ..and populate all of the notes associated with it
			.populate("note")
			.then(function(dbArticle) {
			// If we were able to successfully find an Article with the given id, send it back to the client
			res.json(dbArticle);
			})
			.catch(function(err) {
			// If an error occurred, send it to the client
			res.json(err);
			});
	});
	
	// Route for saving/updating an Article's associated Note
	app.post("/articles/:id", function(req, res) {
	// Create a new note and pass the req.body to the entry
	db.Note.create(req.body)
		.then(function(dbNote) {
		// If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
		// { new: true } tells the query that we want it to return the updated User -- it returns the original by default
		// Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
		return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
		})
		.then(function(dbArticle) {
		// If we were able to successfully update an Article, send it back to the client
		res.json(dbArticle);
		})
		.catch(function(err) {
		// If an error occurred, send it to the client
		res.json(err);
		});
	});

	app.post("/save/:id", function(req, res) {
		Article.findById(req.params.id, function(err, data) {
			if (data.saved) {
				Article.findByIdAndUpdate(req.params.id, {$set: {issaved: false, status: "Save"}}, {new: true}, function(err, data) {
					res.redirect("/");
				});
			}
			else {
				Article.findByIdAndUpdate(req.params.id, {$set: {issaved: true, status: "Saved"}}, {new: true}, function(err, data) {
					res.redirect("/saved");
				});
			}
		});
	});

	// =====================================
	// 404 Error Page ======================
	// =====================================

	// Render 404 page for any unmatched routes
	
	app.get("*", function(req, res) {
		res.render("404");
	});	
};
