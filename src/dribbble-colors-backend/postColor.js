// POST COLOR
'use strict';
console.log('Loading function');

let doc = require('dynamodb-doc');
let dynamo = new doc.DynamoDB();

// Newer api
let AWS = require('aws-sdk');
let docClient = new AWS.DynamoDB.DocumentClient();

function addColorsToId(event, callback) {
    
    var colorsPerPartition = 1000;
    var partitionKey = Math.floor(event.id / colorsPerPartition) + 1;
    event['partitionKey'] = partitionKey.toString();
    
    var object = {
        'TableName': 'Color',
        'Item': {
            'partitionKey': event.partitionKey,
            'id': event.id,
            'colors': event.colors,
            'url': event.url
        }
    }
    
    dynamo.putItem(object, callback);
}

// recursively update each color with the id
function addIdToColors(id, colors, callback) {
    
    var nextColor = colors.pop();
    
    var params = {
        TableName : 'Hex',
        Key: {'hex': nextColor},
        UpdateExpression : 'ADD #oldIds :newId',
        ExpressionAttributeNames : {
          '#oldIds' : 'ids'
        },
        ExpressionAttributeValues : {
          ':newId' : docClient.createSet([id])
        }
    };
    
    console.log('adding color ' + nextColor + ' to id ' + id);
        
    if (colors.length === 0) {
        docClient.update(params, callback);
        return;
    }
    
    docClient.update(params, function(err, data) {
        if (err) callback(err);
        else {
            addIdToColors(id, colors, callback);
        }
    });
}

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    // So we can test on aws console
    if ('body-json' in event) {
        event = event['body-json'];
    }
    
    // First add all hex to the Color table
    addColorsToId(event, function(err, data) {
        if (err) callback(err);
        else {
            // Then add all ids to each hex in Hex table
            addIdToColors(event.id, event.colors, callback);
        }
    });
};