
/**
 * This service file contains the service layer methods for manipulating the workorder objects.
 */
var logger = require("../../logger.js");
var Promise = require('bluebird');
var _ = require('underscore');
var fs = require('fs');
var https = require('https');

//Creating the object which will finally be exported
var orchestrationService = {
    getWorkOrdersByUserId: getWorkOrdersByUserId
};

function getWorkOrdersByUserId(userId) {
    return new Promise(function (resolve, reject) {

        // Invoke Service - 
        var options = {
            host : 'pgecommerce.azure-api.net',
            port : 443,
            path : 'v1/mapping/workorders/user/' + userId,
            method: 'GET'
        };

        https.request(options, function(res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
            });
        }).end();


        // var workOrderMapping = workOrderFile.workOrderMapping;
        // if (workOrderMapping != undefined && workOrderMapping != null) {
        //     var workOrders = _.where(workOrderMapping, {userId: userId });
        //     if (workOrders.length > 0) {
        //         var workOrder = _.sortBy(workOrders, function(data) { return data.createddate; });
        //         logger.info("Work Order fetched for user with userId : " + userId + " fetched successfully {{IN SERVICE}}")
        //         workOrder = workOrder.reverse()
        //         resolve(_.first(workOrder));
        //     } else {
        //         logger.error("No assocaition with UserId found {{IN SERVICE}}");
        //         reject("No assocaition with UserId found User");
        //     }
        // }
        // else {
        //     logger.error("Some error in fetching the Work Order for User {{IN SERVICE}}");
        //     reject("Some error in fetching the Work Order for User");
        // }
    })
}


//Exporting allthe methods in an object
module.exports = orchestrationService;