/**
 * Importing required
 */
var orchestrationService = require("./orchestration.service.js");
var logger = require("../common/logger.js");
var Response = require("../common/response.js");
var Promise = require("bluebird");

// Creating the object to be exported.
// http://localhost:9002/v1/orchestration/apis/webhook
// http://pg-orchestration.azurewebsites.net/v1/orchestration/apis/webhook
// User ID - 29:1FnE-gdUEBY5j8vY7LKYtgrWLLvOzuLHAN5VbegVP7trngAmaxfqWHX7g46x1f-2F
function init(router) {
    router.route('/webhook').post(getWebhook);
};

function getWebhook(req, res) {
    var response = "";
    var userId = req.body.result.parameters["userId"];
    if(userId !== undefined && userId !== "") {
        orchestrationService.getWorkOrdersByUserId(userId).then(function (result) {
            result.data.forEach(function(workorder, i) {
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

module.exports.init = init;