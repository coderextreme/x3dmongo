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
 function (err) { console.log(err || "Done."); }
);

// connect to mongo
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/testing_storeX3D';

app.get('/', function(req, res, err) {
	res.contentType("text/html");
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		mongo.findDocuments(db, function(docs) {
			res.send('<!doctype html><html><head><title>JSON Loader</title><link rel="stylesheet" type="text/css" href="http://www.x3dom.org/x3dom/release/x3dom.css"></link><script type="text/javascript" src="http://www.x3dom.org/x3dom/release/x3dom-full.js"></script><script type="text/javascript" src="http://x3dom.org/x3dom/release/components/Geometry2D.js"></script><script type="text/javascript" src="http://x3dom.org/x3dom/release/components/Geometry3DExt.js"></script><script type="text/javascript" src="http://d3js.org/d3.v3.min.js"></script><script language="Javascript" src="http://code.jquery.com/jquery-1.11.1.js"></script></head><script type="text/javascript" src="X3DJSONLD.js"></script><body><table>' + docs.map(function(doc) {
				
				return '<tr><td>' + doc.X3D.head[0].meta['@content'] + '</td><td><X3D width="250" height="125"><scene id="id' + doc._id + '"></scene></X3D></td></tr><script>/*console.log("'+doc.X3D.head[0].meta["@content"]+'");*/loadX3DJS("#id' + doc._id + '", ' + JSON.stringify(doc.X3D) + ');</script>';
	
			}).reduce(function(pv, cv) {
				return pv+cv;
			})+'</table></body></html>');
		});
	});
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});
