
/**
 * This service file contains the service layer methods for manipulating the workorder objects.
 */
var logger = require("../common/logger.js");

var Promise = require('bluebird');
var _ = require('underscore');
var fs = require('fs');
var request = require('request');

//Creating the object which will finally be exported
var orchestrationService = {
    getWorkOrdersByUserId: getWorkOrdersByUserId
};

// Service's
// Work Order Mapping - Get Work Orders By User Id
var workOrderMapping_getWorkOrdersByUserId = "http://pgecommerce.azure-api.net/v1/mapping/user-workorders?userid=";
// JLL API - Get Work Order
var jllAPI_getWorkOrder = "http://pgecommerce.azure-api.net/v1/jll/workorder/";
// Work Order Master - Status By Status Code
var  workOrderMaster_statusByStatusCode = "http://pgecommerce.azure-api.net/v1/master/statuses/";

var STATUS = {
  STEP1_COMPLETED : "step1_completed",
  STEP2_COMPLETED : "step2_completed",
  STEP3_COMPLETED : "step3_completed",
  START : "start"
};

function getWorkOrdersByUserId(userId) {
    return new Promise(function (resolve, reject) {
        fetchWorkOrdersByUserId(userId, [], [], 0, resolve, STATUS.START);
    })
}

function fetchWorkOrdersByUserId(userId, data, output, count, resolve, status) {
    if(status == STATUS.START) {
        callWorkOrdersByUserId(userId, output, resolve);
    } else if(status == STATUS.STEP1_COMPLETED) {
        if(data != undefined && JSON.stringify(data) != "[]") {
            var size = (Object.keys(data).length - 1);
            callWorkOrder(userId, data, output, data[count], size, count, resolve, status);
        } else {
            fetchWorkOrdersByUserId(userId, data, output, count, resolve, STATUS.STEP3_COMPLETED);
        }
    } else if(status == STATUS.STEP2_COMPLETED) {
        if(data != undefined && JSON.stringify(data) != "[]") {
            var size = (Object.keys(data).length - 1);
            callStatusByStatusCode(userId, data, output, data[count].workorderstatuscode, size, count, resolve, status);
        } else {
            fetchWorkOrdersByUserId(userId, data, output, count, resolve, STATUS.STEP3_COMPLETED);
        }
    } else if(status == STATUS.STEP3_COMPLETED) {
        resolve(output);
    }
}

// Invoke Service - API Gateway: Work Order Mapping, Operation : Work Orders By User Id
function callWorkOrdersByUserId(userId, output, resolve) {
    request(
        {
            url : workOrderMapping_getWorkOrdersByUserId + userId,
            headers : { "Content-Type" : "application/json" }
        },
        function (error, response, body) {
            if(body != undefined) {
                var workOrdersByUserId = JSON.parse(body);
                var data = _.uniq(_.pluck(workOrdersByUserId.data, 'workOrderId'));
                fetchWorkOrdersByUserId(userId, data, output, 0, resolve, STATUS.STEP1_COMPLETED);
            }
        }
    );
}

// Invoke Service - API Gateway: JLL API, Operation : Get Work Order
function callWorkOrder(userId, data, output, item, size, count, resolve, status) {
    var getWorkOrderOutput = "";
    request(
        {
            url : jllAPI_getWorkOrder + item,
            headers : { "Content-Type" : "application/json" }
        },
        function (error, response, body) {
            if(body != undefined) {
                if(body != "Service ready to receive work orders") {
                    var getWorkOrder = JSON.parse(body);
                    output.push({
                        "workorderstatuscode": getWorkOrder.StatusCode,
                        "workorderstatus": "",
                        "workorderid": item,
                        "workorderdescription": getWorkOrder.LogNoteList
                    });
                }
            }
            if(size != count) {
                fetchWorkOrdersByUserId(userId, data, output, (count + 1), resolve, STATUS.STEP1_COMPLETED);
            } else {
                fetchWorkOrdersByUserId(userId, output, output, 0, resolve, STATUS.STEP2_COMPLETED);
            }
        }
    );
}

// Invoke Service - API Gateway: Work Order Master, Operation : Status By Status Code
function callStatusByStatusCode(userId, data, output, item, size, count, resolve, status) {
    request(
        {
            url : workOrderMaster_statusByStatusCode + item,
            headers : { "Content-Type" : "application/json" }
        },
        function (error, response, body) {
            if(body != undefined) {
                var getStatus = JSON.parse(body);
                output[count].workorderstatus = getStatus.data.desc;
            }
            if(size != count) {
                fetchWorkOrdersByUserId(userId, data, output, (count + 1), resolve, STATUS.STEP2_COMPLETED);
            } else {
                fetchWorkOrdersByUserId(userId, data, output, 0, resolve, STATUS.STEP3_COMPLETED);
            }
        }
    );
}

//Exporting allthe methods in an object
module.exports = orchestrationService;