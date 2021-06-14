import createError from 'http-errors';
import { getEndedAuctions } from '../libs/getEndedAuctions';
import { closeAuction } from '../libs/closeAuction';

async function processAuctions(event, context) {
    try {
        const auctionsToClose = await getEndedAuctions();
        const closePromises = auctionsToClose.map(auction => closeAuction(auction)); // returns all the promises
        await Promise.all(closePromises); // await until all the promises are resolved.
        console.log('List of auctions are going to close');
        console.log(auctionsToClose);
        return {
            closed: closePromises.length
        }
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

}

export const handler = processAuctions;
