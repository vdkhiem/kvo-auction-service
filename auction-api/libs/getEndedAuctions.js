import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getEndedAuctions() {
    const now = new Date();
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status AND endingAt <= :now', // dynamo language query
        ExpressionAttributeValues: {
            ':status': 'OPEN',
            ':now': now.toISOString(),
        },
        ExpressionAttributeNames: {
            '#status': 'status', //status is reserved word that why we need to use '#' keyword
        },
    };

    const result = await dynamodb.query(params).promise();
    return result.Items;
}