// const mongoose = require("mongoose");
// // var dburl 	 = 'mongodb://@localhost:27017/chatapp';
// var dburl 	 = 'mongodb+srv://NitinKumar:mongo@Nitin@minicluster-rr1b0.mongodb.net/test?retryWrites=true&w=majority';

// mongoose.Promise = global.Promise;
// //mongoose.Promise = require('bluebird');
// mongoose.connect(dburl,{ useUnifiedTopology: true,useNewUrlParser: true,useCreateIndex : true});

// mongoose.connection.on('connected', function() {
// 	console.log("mongoose connected to "+ dburl);
// });

// mongoose.connection.on('disconnected', function(err) {
// 	console.log("mongoose disconnected"+ err);
// });

// mongoose.connection.on('error', function(err) {
// 	console.log("mongoose connection error: " + err);
// });

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://NitinKumar:mongo@Nitin@minicluster-rr1b0.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});