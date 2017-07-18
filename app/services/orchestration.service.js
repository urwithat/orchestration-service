
/**
 * This service file contains the service layer methods for manipulating the workorder objects.
 */
var logger = require("../../logger.js");
var Promise = require('bluebird');
var _ = require('underscore');
var fs = require('fs');
var request = require('request');

//Creating the object which will finally be exported
var orchestrationService = {
    getWorkOrdersByUserId: getWorkOrdersByUserId
};

function getWorkOrdersByUserId(userId) {
    return new Promise(function (resolve, reject) {
        // Invoke Service - API Gateway: Work Order Mapping, Operation : Work Orders By User Id
        // request(
        //     {
        //         url : "http://pg-work-order-map.azurewebsites.net/v1/work-order-services/apis/workorders/user/M1032747",
        //         headers : { "Content-Type" : "application/json" }
        //     },
        //     function (error, response, body) {
        //         var workOrdersByUserId = JSON.parse(body);
        //         var workOrderIds = _.pluck(workOrdersByUserId.data,'workOrderId');
        //         var workOrdersByUserIdOutput = "";
        //         workOrderIds.forEach(function(item) {
        //             // Invoke Service - API Gateway: JLL API, Operation : Get Work Order
        //             var getWorkOrderOutput = "";
        //             request(
        //                 {
        //                     url : "https://pgecommerce.azure-api.net/v1/jll/workorder/MQA21260609-1",
        //                     headers : { "Content-Type" : "application/json" }
        //                 },
        //                 function (error, response, body) {
        //                     var getWorkOrder = JSON.parse(body);
        //                     var getWorkOrderOutput = getWorkOrderOutput + ", " + getWorkOrder.StatusCode;
        //                 }
        //             );
        //             workOrdersByUserIdOutput = workOrdersByUserIdOutput + getWorkOrderOutput;
        //         });
        //         resolve(workOrdersByUserIdOutput);
        //     }
        // );

        request(
            {
                url : "https://pgecommerce.azure-api.net/v1/jll/workorder/MQA21260609-1",
                headers : { "Content-Type" : "application/json" }
            },
            function (error, response, body) {
                var getWorkOrder = JSON.parse(body);
                resolve(getWorkOrder);
            }
        );

        
        
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