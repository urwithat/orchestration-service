
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
        fetchWorkOrdersByUserId(userId, "", "", 0, resolve, STATUS.START);
    })
}

function fetchWorkOrdersByUserId(userId, data, response, count, resolve, status) {
    if(status == STATUS.START) {
        callWorkOrdersByUserId(userId, resolve);
    } else if(status == STATUS.STEP1_COMPLETED) {
        var size = (Object.keys(data).length - count);
        callWorkOrder(userId, data, response, data[size], size, count, resolve, status);
    } else if(status == STATUS.STEP2_COMPLETED) {
        resolve(response);
    }
}

// Invoke Service - API Gateway: JLL API, Operation : Get Work Order
function callWorkOrder(userId, data, response, item, size, count, resolve, status) {
    var getWorkOrderOutput = "";
    request(
        {
            url : "https://pgecommerce.azure-api.net/v1/jll/workorder/" + item,
            headers : { "Content-Type" : "application/json" }
        },
        function (error, response, body) {
            if(body != "Service ready to receive work orders") {
                var getWorkOrder = JSON.parse(body);
                response = response + ", " + getWorkOrder.StatusCode;
            }
            if(size != 0) {
                fetchWorkOrdersByUserId(userId, data, response, (count + 1), resolve, STATUS.STEP1_COMPLETED);
            } else {
                fetchWorkOrdersByUserId(userId, data, response, 1, resolve, STATUS.STEP2_COMPLETED);
            }
        }
    );
}

// Invoke Service - API Gateway: Work Order Mapping, Operation : Work Orders By User Id
function callWorkOrdersByUserId(userId, resolve) {
    request(
        {
            url : "http://pg-work-order-map.azurewebsites.net/v1/work-order-services/apis/workorders/user/" + userId,
            headers : { "Content-Type" : "application/json" }
        },
        function (error, response, body) {
            var workOrdersByUserId = JSON.parse(body);
            var data = _.pluck(workOrdersByUserId.data, 'workOrderId');
            fetchWorkOrdersByUserId(userId, data, "", 1, resolve, STATUS.STEP1_COMPLETED);
            
        }
    );
}

//Exporting allthe methods in an object
module.exports = orchestrationService;