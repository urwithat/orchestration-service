//This module will be used for writing in the swagger.json file.
var fs = require('fs');

//Importing the swagger.json file.
var swaggerFileURL = '../public/swagger-ui/data/swagger.json';
var swaggerJsonFile = require(swaggerFileURL);
var logger = require('../logger.js');

var env = 'LOCAL';
var props = {
    //LOCAL means connecting from running services on your system.
    LOCAL: {
        app: {
            port: 9002
        },
        logs: {
            location: 'logs'
        },
        swagger: {
            protocol: 'http',
            host: 'localhost',
            port: 9002
        }
    },
    //Running services on VM and connecting to DB on same VM
    DEV: {
        app: {
            port: process.env.APP_PORT
        },
        logs: {
            location: 'logs'
        },
        swagger: {
            protocol: 'http',
            host: process.env.SWAGGER_IP,
            port: process.env.SWAGGER_PORT
        }
    }
};

//This function will return the configurations according to the environment.
var getprops = function() {
    return props[env];
}

//This function actually changes the swagger.json file in the swagger-ui folder according to the environment.
var changeSwaggerConfigurations = function() {
    if (swaggerJsonFile.host != (getprops().swagger.host + ":" + getprops().swagger.port || swaggerJsonFile.schemes[0] != getprops().swagger.protocol)) {
        swaggerJsonFile.host = getprops().swagger.host + ":" + getprops().swagger.port;
        swaggerJsonFile.schemes = [];
        swaggerJsonFile.schemes.push(getprops().swagger.protocol);

        fs.writeFile(swaggerFileName, JSON.stringify(swaggerJsonFile, null, 2), function(err) {
            if (err) return console.log(err);
            logger.info("Changed swagger json file for ", env, " environment");
        });
    }
};

//Setting the environment and fixing the configurations accordingly
var setEnv = function(newEnv) {
    if (props[newEnv]) {

        env = newEnv;
    }
    logger.info("Setting up properties for ", env, " environment");
    changeSwaggerConfigurations();
};

//Exporting the functions
module.exports = {
    props: getprops,
    setEnv: setEnv
};