/**
 * Importing required
 */
var orchestrationService = require("./orchestration.service.js");
var products = require('../data/products.json')
var logger = require("../common/logger.js");
var Response = require("../common/response.js");
var Promise = require("bluebird");
var path = require('path');
var fs = require("fs");
var _ = require('underscore');

// Creating the object to be exported.
// http://localhost:9002/v1/orchestration/apis/webhook
// http://pg-orchestration.azurewebsites.net/v1/orchestration/apis/webhook
// User ID - 29:1FnE-gdUEBY5j8vY7LKYtgrWLLvOzuLHAN5VbegVP7trngAmaxfqWHX7g46x1f-2F
function init(router) {
    router.route('/webhook').post(getWebhook);
    router.route('/logs').get(getLogs);
    router.route('/logs/:fileId').get(getLogs);
};

function getWebhook(req, res) {
    var response = "";
    var userId = req.body.result.parameters["userId"];
    var productName = req.body.result.parameters["productName"];
    logger.info("userId :: " + userId);
    logger.info("productName :: " + productName);
    if(userId !== undefined && userId !== "") {
        orchestrationService.getWorkOrdersByUserId(userId).then(function (result) {
            result.forEach(function(workorder, i) {
                if(response != "") response = response + " ";
                else response = "Your Work Orders : ";
                response = response + "Description '" + workorder.workorderdescription[0].Note.trim() + "' has a status of '" + workorder.workorderstatus + "'.";
            });
            logger.info("Work Order for User with id :" + userId + " fetched successfully.");
        }).catch(function (error) {
            response = "Work Orders for User with id : " + userId + " were not fetched successfully";
        });
    } else if(productName !== undefined && productName !== "") {
        var product = _.findWhere(products, { name: productName });
        if(product) {
            response = product.description;
            logger.info("Product Name :" + productName + " fetched successfully.");
        } else {
            response = "Could not find the product '" + productName + "'";
            logger.info("Product Name :" + productName + " not fetched successfully.");
        }
    } else {
        response = "Details not fetched successfully";
    }
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ 'speech': response, 'displayText': response }));
};

function getLogs(req, res) {
    var fileId = req.params.fileId;
    if(fileId) {
        var files = allFilesFromFolder(path.join("./logs/"));
        if(fileId < files.length) {
            var file = path.join("./logs/" + files[fileId].fileName);
            res.download(file);
        } else {
            res.send(JSON.parse('{"status" : "Requested files does not exist"}'));
        }
    } else {
        var files = allFilesFromFolder(path.join("./logs/"));
        res.send(files);
    }
};

function allFilesFromFolder(dir) {
    var results = [];
    fs.readdirSync(dir).forEach(function(file, i) {
        results.push(JSON.parse('{"index" : "' + i + '", "fileName": "' + file + '"}'));
    });
    return results;
};


module.exports.init = init;