const mongoose = require("mongoose");
// var dburl 	 = 'mongodb://@localhost:27017/chatapp';
var dburl 	 = 'mongodb+srv://NitinKumar:mongo@Nitin@minicluster-rr1b0.mongodb.net/test?retryWrites=true&w=majority';

mongoose.Promise = global.Promise;
//mongoose.Promise = require('bluebird');
mongoose.connect(dburl,{useNewUrlParser: true});

mongoose.connection.on('connected', function() {
	console.log("mongoose connected to "+ dburl);
});

mongoose.connection.on('disconnected', function() {
	console.log("mongoose disconnected");
});

mongoose.connection.on('error', function(err) {
	console.log("mongoose connection error: " + err);
});