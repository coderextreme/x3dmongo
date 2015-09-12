var mongo = require('./mongo');
var assert = require('assert');

// connect to mongo
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/testing_storeX3D';

MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.error('mongo is open');
	mongo.removeDocuments(db, function(result) {
		mongo.insertDocuments(db, function(result) {
			// console.log(result);
			// db.close();
		});
	});
});
