
/**
 * This file contains the controller methods related to manipulation of item documents.
 */

/**
 * Importing required
 */
var orchestrationService = require("./orchestration.service.js");
var logger = require("../common/logger.js");
var Response = require("../common/response.js");
var Promise = require("bluebird");

//Creating the object to be exported.
function init(router) {
    router.route('/workorders/user/:userId').get(getWorkOrdersByUserId);
};

function getWorkOrdersByUserId(req, res) {
    var response = new Response();
    var userId = req.params.userId;
    orchestrationService.getWorkOrdersByUserId(userId).then(function (result) {
        response.data = result;
        response.status.code = "200";
        response.status.message = "Work Order for User with id :" + userId + " fetched successfully.";
        logger.info("Work Order for User with id :" + userId + " fetched successfully.");
        res.status(200).json(response);
    }).catch(function (error) {
        logger.error("error while fetching Work Order with User id :" + userId + " {{In Controller}}", error);
        response.status.code = "500";
        response.status.message = "Work Orders for User with id : " + userId + " were not fetched successfully";
        res.status(500).json(response);
    });
}

//Finally exporting the employee controller methods as an object.
module.exports.init = init;