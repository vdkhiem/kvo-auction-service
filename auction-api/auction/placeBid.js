import AWS from 'aws-sdk';
import commonMiddleware from '../libs/commonMiddleware';
import createError from 'http-errors'; // create error in a decorative way
import { getAuctionById } from './getAuction';
import validator from '@middy/validator';
import placeBidSchema from '../libs/schemas/placeBidSchema';


const dynamodb = new AWS.DynamoDB.DocumentClient

async function placeBid(event, context) {
    const { id } = event.pathParameters;
    const { amount } = event.body;
    const { email } = event.requestContext.authorizer;

    const auction = await getAuctionById(id);

    console.log('placeBid', auction);

    // Auction not allow bid owner place bid
    if (email === auction.seller) {
        throw new createError.Forbidden(`You cannot bid your own auction`);
    }

    // Auction not allow highest bid to bid again
    if (email === auction.highestBid.bidder) {
        throw new createError.Forbidden(`You are already highest bidder`);
    }

    // Auction status validation
    if (auction.status !== "OPEN") {
        throw new createError.Forbidden(`You cannot bit on close auction!`)
    }

    // Auction bid amount validation
    if (amount <= auction.highestBid.amount) {
        throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}`);
    }

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount',
        //UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
        ExpressionAttributeValues: {
            ':amount': amount,
            //':bidder': email,
        },
        ReturnValues: 'ALL_NEW', // Returns all items just updated 
    };

    let updatedAuction;

    try {
        let result = await dynamodb.update(params).promise();
        updatedAuction = result.Attributes;
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200, // Resource created
        body: JSON.stringify(updatedAuction),
    };
}

export const handler = commonMiddleware(placeBid)
    .use(validator({ inputSchema: placeBidSchema, useDefaults: true }));


