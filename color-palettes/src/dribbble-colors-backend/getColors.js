'use strict';
console.log('Loading function');

let doc = require('dynamodb-doc');
let dynamo = new doc.DynamoDB();

/**
 * Provide an event that contains the following keys:
 *
 *   - payload: a parameter to pass to the operation being performed
 */
exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    // Return everything in the color table
    var object = {
        "TableName": "Color"
    }
    
    dynamo.scan(object, callback);
};