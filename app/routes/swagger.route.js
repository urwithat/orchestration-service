var logger = require('../../logger.js');
var Promise = require("bluebird");
var fs = require('fs');
var swaggerFileName = __dirname + '/../../public/swagger-ui/data/swagger.json';

function init(router) {
    router.get('/swagger', function (req, res) {
        fs.readFile(swaggerFileName, 'utf8', function (err, data) {
            if (err) throw err;
            var swaggerJsonFile = JSON.parse(data);
            res.send(swaggerJsonFile);
        });
    });
};

module.exports.init = init;