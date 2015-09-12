var fs = require('fs');
var assert = require('assert');
var config = require('./config');

module.exports.removeDocuments = function(db, callback) {
	  // Get the documents collection
	  var collection = db.collection(config.collection);
	  // Insert some documents
	  collection.remove({}, function(err, result) {
		assert.equal(null, err);
		callback(result);
	  });
	};
module.exports.findDocuments = function(db, callback) {
		var collection = db.collection(config.collection);
		collection.find({}).toArray(function(err, docs) {
			assert.equal(null, err);
			callback(docs);
		});
	};

function convertChildren(object, file) {
	var key;
	for (key in object) {
		if (typeof object[key] === 'object') {
				convertUrls(object[key], key, file);
		}
	}
}

function convertUrls(object, parentkey, file) {
	var key;
	for (key in object) {
		if (typeof object[key] === 'object') {
			if (key.substr(0,1) === '@') {
				convertUrls(object[key], key, file);
			} else if (key.substr(0,1) === '-') {
				convertChildren(object[key], file);
			} else {
				convertUrls(object[key], key, file);
			}
		} else if (typeof object[key] === 'string') {
			if (parentkey === '@url') {
			      if (object[key].indexOf("http") < 0) {
				       object[key] = '/'+file.substring(0, file.lastIndexOf('/')+1)+object[key];
			       }
			       console.log('filepath',file.substring(0, file.lastIndexOf('/')+1));
			       console.log(object[key]);
			}
		}
	}
}

module.exports.insertDocuments = function(db, callback) {
		var collection = db.collection(config.collection);

		var finder = require('findit')(config.folder);
		finder.on('file', function(file) {
			if (file.indexOf('.json') < 0) {
				return; // if not .json, continue
			}
			var data = fs.readFileSync(file);
			try {
				var x3d = JSON.parse(data);
				if (typeof x3d[0].X3D.head == 'undefined') {
					x3d[0].X3D.head = [];
				}
			} catch (e) {
				// console.log(file, 'failed', e);
				return;
			}
			var ex = file.indexOf("examples");
			if (ex >= 0) {
				file = file.substring(ex);
			}
			x3d[0].X3D.head.unshift({ "meta": { "@content": file, "@name":"file" } });
			convertUrls(x3d, "", file);
			data = JSON.stringify(x3d);
			var x3d = JSON.parse(data);
			collection.insert(x3d, function(err, result) {
				// assert.equal(null, err);
				callback(result);
			});
			// console.log(file, 'succeeded');
		});
	};
