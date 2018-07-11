'use strict';
console.log('Loading function');

let doc = require('dynamodb-doc');
let dynamo = new doc.DynamoDB();

function randomNumber(min, max) {
    var diff = max - min;
    return Math.round(Math.random() * (diff)) + min;
}

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    var highestColor = 5000;
    var colorsPerSet = 10;
    var colorsPerPartition = 1000;
    
    var randomColor = randomNumber(1, highestColor);
    
    // Leave enough headroom to get x random colors
    // if on top half of partition, move by 1/2 partition down
    if (colorsPerPartition - (randomColor % colorsPerPartition) < (colorsPerPartition / 10)) {
        randomColor -= (colorsPerPartition / 2);
    }
    
    var partitionKey = Math.floor(randomColor / colorsPerPartition) + 1;
    
    console.log('getting: ' + randomColor);

    // Return random range in color table
    var object = {
        TableName: "Color",
        Limit: 10,
        ProjectionExpression: "id, colors, #url",
        KeyConditionExpression: "partitionKey = :partitionKey AND id > :low",
        ExpressionAttributeValues: {
            ":partitionKey": partitionKey.toString(),
            ":low": randomColor
        },
        ExpressionAttributeNames: {
            "#url": "url"
          }
    };
    
    dynamo.query(object, callback);
};