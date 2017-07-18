
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

var STATUS = {
  STEP1_COMPLETED : "step1_completed",
  STEP2_COMPLETED : "step2_completed",
  START : "start"
};

function getWorkOrdersByUserId(userId) {
    return new Promise(function (resolve, reject) {
        fetchWorkOrdersByUserId(userId, "", [], 0, resolve, STATUS.START);
    })
}

function fetchWorkOrdersByUserId(userId, data, output, count, resolve, status) {
    if(status == STATUS.START) {
        callWorkOrdersByUserId(userId, output, resolve);
        output.
    } else if(status == STATUS.STEP1_COMPLETED) {
        var size = (Object.keys(data).length - count);
        callWorkOrder(userId, data, output, data[size], size, count, resolve, status);
    } else if(status == STATUS.STEP2_COMPLETED) {
        //resolve(output);

    } else if(status == STATUS.STEP3_COMPLETED) {
        resolve(output);
    }
}

// Invoke Service - API Gateway: Work Order Mapping, Operation : Work Orders By User Id
function callWorkOrdersByUserId(userId, output, resolve) {
    request(
        {
            url : "http://pg-work-order-map.azurewebsites.net/v1/work-order-services/apis/workorders/user/" + userId,
            headers : { "Content-Type" : "application/json" }
        },
        function (error, response, body) {
            var workOrdersByUserId = JSON.parse(body);
            var data = _.uniq(_.pluck(workOrdersByUserId.data, 'workOrderId'));
            fetchWorkOrdersByUserId(userId, data, output, 1, resolve, STATUS.STEP1_COMPLETED);
        }
    );
}

// Invoke Service - API Gateway: Work Order Mapping, Operation : Work Orders By User Id
function callWorkOrdersByUserId(userId, output, resolve) {
    request(
        {
            url : "http://pg-work-order-map.azurewebsites.net/v1/work-order-services/apis/workorders/user/" + userId,
            headers : { "Content-Type" : "application/json" }
        },
        function (error, response, body) {
            var workOrdersByUserId = JSON.parse(body);
            var data = _.uniq(_.pluck(workOrdersByUserId.data, 'workOrderId'));
            fetchWorkOrdersByUserId(userId, data, output, 1, resolve, STATUS.STEP1_COMPLETED);
        }
    );
}

// Invoke Service - API Gateway: JLL API, Operation : Get Work Order
function callWorkOrder(userId, data, output, item, size, count, resolve, status) {
    var getWorkOrderOutput = "";
    request(
        {
            url : "https://pgecommerce.azure-api.net/v1/jll/workorder/" + item,
            headers : { "Content-Type" : "application/json" }
        },
        function (error, response, body) {
            if(body != undefined) {
                if(body != "Service ready to receive work orders") {
                    var getWorkOrder = JSON.parse(body);
                    output.push({
                        "workorderstatuscode": getWorkOrder.StatusCode,
                        "workorderid": item,
                        "workorderdescription": getWorkOrder.LogNoteList
                    });
                }
            }
            if(size != 0) {
                fetchWorkOrdersByUserId(userId, data, output, (count + 1), resolve, STATUS.STEP1_COMPLETED);
            } else {
                fetchWorkOrdersByUserId(userId, data, output, 1, resolve, STATUS.STEP2_COMPLETED);
            }
        }
    );
}

//Exporting allthe methods in an object
module.exports = orchestrationService;