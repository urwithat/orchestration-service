var express = require("express");
var config = require('./config').props();
var swaggerFileName = '../public/swagger-ui/data/swagger.json';
var swaggerJsonFile = require(swaggerFileName);
var path = require('path');
var bodyParser = require("body-parser");
var orchestrationRoute = require("../app/routes/orchestration.route.js");
var swaggerRoute = require("../app/routes/swagger.route.js");
var corsFilter = require("../app/routes/filters/cors.filter");
var morganLogger = require("morgan");
var Response = require("../app/response.js");
var logger = require("../logger.js");
var fs = require('fs');

var app = express();
app.use(morganLogger('dev'));

// SWAGGER IMPLEMENTATION
app.use('/v1/orchestration-services/apis/docs', express.static('./public/swagger-ui'));
var router = express.Router();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', "extended": false }));

corsFilter(router);

app.use('/v1/orchestration-services/apis', router);

//error handler if something breaks
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke in the server!');
});


if (!fs.existsSync(config.logs.location)) {
    // Create the directory if it does not exist
    fs.mkdirSync(config.logs.location);
}


var apiConfig = function () {
    this.app = app;
}



//defining routes
orchestrationRoute.init(router);
swaggerRoute.init(router);

module.exports = apiConfig;
