var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 3000;
var mongo = require('./mongo');
var assert = require('assert');
var config = require('./config');
var path = require('path');
app.use(express.static(__dirname));


require("fs").symlink(
path.resolve(config.folder),
path.resolve(__dirname + "/" + config.webfolder),
'file',
 function (err) {
	if (err) {
		console.log( err.code === 'EEXIST' ? "Go to the link above!\n" : err);
	}
  }
);

// connect to mongo
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/testing_storeX3D';

app.get('/x3d', function(req, res, err) {
	res.contentType("text/json");
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		mongo.findDocuments(db, function(docs) {
			res.send(docs);
		});
	});
});

http.listen(port, function () {
    console.log('listening on http://localhost:' + port);
});
