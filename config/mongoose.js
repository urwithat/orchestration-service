// /**
//  * This file contains the method to connect to the mongodb based on the configurations set in config file.
//  */

// var config = require("./config").props();
// var mongoose = require("mongoose");
// var logger = require("../logger");

// /**
//  * This function establishes the connection to mongo
//  * @param {*} environ
//  */
// function connect(environ) {

//     logger.info("mongo db host : " + config.db.host);
//     logger.info("mongo db host after trim : " + config.db.host.trim());

//     // Checking the environment
//     if (environ == "DEV") {
//         //You can perform any db url manipulation based on this environment check
//     }

//     // disabling username pass auth as of now
//     // uncomment next line for enabling auth and comment second line
//     // url = 'mongodb://' + config.db.username + ':' + config.db.password + '@' + config.db.host.trim() + ':' + config.db.port + '/' + config.db.dbName;
//     // url = 'mongodb://' + config.db.host.trim() + ':' + config.db.port + '/' + config.db.dbName;

//     //Declaring the connection URL.
//     var url = 'mongodb://' + config.db.host.trim() + ':' + config.db.port + '/' + config.db.dbName;


//     //Authorizing the connection
//     var opt = {
//         auth: {
//             authdb: 'admin'
//         }
//     };
//     logger.info("MONGO DB CONNECTION URL : " + url);

//     //Establishing the connection
//     mongoose.connect(url, opt);

//     //Logging based on events emitted by mongo connection
//     mongoose.connection.on('connected', function () {
//         logger.info("Connection to Mongo established successfully");
//     });

//     mongoose.connection.on('error', function (err) {
//         logger.error('Connection to mongo failed ' + err);
//     });
// }

// //Creating the object to be exported
// var Mongoose = function () {
//     this.connect = connect;
// }

// //Exporting the function as an object
// module.exports = Mongoose;