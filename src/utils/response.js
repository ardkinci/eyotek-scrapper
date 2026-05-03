const config = require('../config');
const packageJson = require('../../package.json'); 

/**
 * Creates the output format for successful responses.
 * @param {Object} data - Data to be sent
 * @param {Number} startTime - The time the request came
 * @returns {Object} JSON data
 */
function successResponse(data, startTime = Date.now()) {
    const executionTime = Date.now() - startTime;

    return {
        success: true,
        meta: {
            api_version: packageJson.version,
            timestamp: new Date().toISOString(),
            source_url: config.eyotek_url,
            date_format: config.API_DATE_FORMAT || "YYYY-MM-DD",
            execution_time_ms: executionTime
        },
        data: data
    };
}

/**
 * Creates the output format for error responses.
 * @param {String} message - Error message
 * @returns {Object} JSON error
 */
function errorResponse(message) {
    return {
        success: false,
        meta: {
            api_version: packageJson.version,
            timestamp: new Date().toISOString(),
            source_url: config.eyotek_url
        },
        error: {
            message: message
        }
    };
}

module.exports = {
    successResponse,
    errorResponse
};