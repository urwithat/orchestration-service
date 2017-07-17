/**
 * This is the first javascript in the invocation process
 * which starts the express server.
 */

//Importing the configuration from the config file.
var configObj = require("./config/config");

//Setting the properties according the environment passed as an env variable.
configObj.setEnv(process.argv[2]);

var config = configObj.props();
var logger = require("./logger");


//Importing the application configuration
var Apis = require("./config/api-config");
var apis = new Apis();

/**
 * This function starts the express server
 */
function start() {
  logger.info("starting the server using startup function");
  var port = process.env.PORT || config.app.port;
  apis.app.listen(port,function(){
  logger.info("Listening on :",port);
  });
  logger.info("Express server listening on port %d ", port);

  //calling the function to connect to mongodb using mongoose ORM
  // mong.connect(process.argv[2]);

}

//Calling the startup function to start the application
start();
