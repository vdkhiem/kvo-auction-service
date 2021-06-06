import AWS from 'aws-sdk';
import commonMiddleware from '../libs/commonMiddleware';
import createError from 'http-errors'; // create error in a decorative way


const dynamodb = new AWS.DynamoDB.DocumentClient

export async function getAuctionById(id) {
    let auction;

    try {
        const result = await dynamodb.get({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { id }
        }).promise();
        auction = result.Item;
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    if (!auction) {
        throw new createError.NotFound(`This auction Id ${id} not found`);
    }

    return auction;
}

async function getAuction(event, context) {
    const { id } = event.pathParameters;

    const auction = await getAuctionById(id);

    return {
        statusCode: 200, // Resource created
        body: JSON.stringify(auction),
    };
}

export const handler = commonMiddleware(getAuction);


