import AWS from 'aws-sdk';
import commonMiddleware from '../libs/commonMiddleware';
import createError from 'http-errors'; // create error in a decorative way
import validator from '@middy/validator';
import getAuctionsSchema from '../libs/schemas/getAuctionsSchema';


const dynamodb = new AWS.DynamoDB.DocumentClient

async function getAuctions(event, context) {
    const { status } = event.queryStringParameters;
    let auctions;

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeValues: {
            ':status': status
        },
        ExpressionAttributeNames: {
            '#status': 'status'
        }
    };

    try {
        //scan will query entire table
        const result = await dynamodb.scan({
            TableName: process.env.AUCTIONS_TABLE_NAME,
        }).promise();

        //const result = await dynamodb.query(params).promise();
        auctions = result.Items;
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }
    return {
        statusCode: 200, // Resource created
        body: JSON.stringify(auctions),
    };
}

export const handler = commonMiddleware(getAuctions)
    .use(validator({ inputSchema: getAuctionsSchema, useDefaults: true }));


