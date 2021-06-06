import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../libs/commonMiddleware';
import createError from 'http-errors'; // create error in a decorative way
import validator from '@middy/validator';
import createAuctionSchema from '../libs/schemas/createAuctionSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient

async function createAuction(event, context) {
    const { title } = event.body;
    const { email } = event.requestContext.authorizer;
    const now = new Date();
    const endDate = new Date();
    endDate.setHours(now.getHours() + 1);

    const auction = {
        id: uuid(),
        title,
        status: 'OPEN',
        createdAt: now.toISOString(), //now.toUTCString()
        endingAt: endDate.toISOString(),
        highestBid: {
            amount: 0,
        },
        seller: email,
    }

    try {
        await dynamodb.put({
            TableName: process.env.AUCTIONS_TABLE_NAME,//'AuctionsTable'
            Item: auction,
        }).promise();
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 201, // Resource created
        //body: JSON.stringify({ event, context }), // this example body returns event and context detail
        body: JSON.stringify(auction),
    };
}

export const handler = commonMiddleware(createAuction)
    .use(validator({ inputSchema: createAuctionSchema, useDefaults: true }));