/**
 * Importing required
 */
var orchestrationService = require("./orchestration.service.js");
var logger = require("../common/logger.js");
var Response = require("../common/response.js");
var Promise = require("bluebird");
var path = require('path');
var fs = require("fs");

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
    if(userId !== undefined && userId !== "") {
        orchestrationService.getWorkOrdersByUserId(userId).then(function (result) {
            logger.info("Data : ================ Atif Test ");
            logger.info(result);
            result.forEach(function(workorder, i) {
                if(response != "") response = response + " ";
                else response = "Your Work Orders : ";
                response = response + "Description '" + workorder.workorderdescription[0].Note.trim() + "' has a status of '" + workorder.workorderstatus + "'.";
            });
            logger.info("Work Order for User with id :" + userId + " fetched successfully.");
            res.status(200).json(response);
        }).catch(function (error) {
            logger.error("error while fetching Work Order with User id :" + userId + " {{In Controller}}", error);
            response.status.code = "500";
            response.status.message = "Work Orders for User with id : " + userId + " were not fetched successfully";
            res.status(500).json(response);
        });
    } else {
        response.status.code = "500";
        response.status.message = "Work Orders for User with id : " + userId + " were not fetched successfully, because User Id Not provided";
        res.status(500).json(response);
    }
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