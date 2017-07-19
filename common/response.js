
/**
 * This js file exports a response object which is used to enforce uniform responses going
 * out of the controller layer.
 */

var Response = function () {
	  return{
	    data: {

	    },
	    status: {
	      statusCode: '',
	      message: '',
	    }
	 }
}

module.exports = Response;
