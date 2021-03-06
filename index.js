const express = require('express'),
	bodyParser = require('body-parser'),
	dotenv = require('dotenv').config(),
	mongo = require('mongodb').MongoClient;

let dbuser = process.env.MONGOLAB_USER,
	dbpassword = process.env.MONGOLAB_PASSWORD;

const app = express(),
	port = process.env.PORT || 80,
	mongoUrl = `mongodb://${dbuser}:${dbpassword}@ds149479.mlab.com:49479/history_quiz_database`;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.sendFile(`${__dirname}/index.html`);
});

app.get('*', function (req, res) {
	res.send("404 not found :D");
});

app.post('/sendJSON', function (req, res) {
	let json = req.body.pytanie;
	let tag = req.body.tag;
	console.log(json);
	mongo.connect(mongoUrl, function (err, db) {
		if (err) throw err;
		db.createCollection(tag);
		let collection = db.collection(tag);
		collection.insert({json}, function (err, result) {
			if (err) throw err;
			console.log("Pytanie zostało wysłane do bazy danych. . .");
		});
		collection.find({}).toArray(function (err, result) {
			if (err) throw err;
			res.send(result);
		});
	});
});

app.listen(port, function() {
	console.log(`Listening on port ${port}`);
});