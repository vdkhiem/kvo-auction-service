async function createAuction(event, context) {
    return {
        statusCode: 201,
        body: JSON.stringify({ event, context })
    };
}

export const handler = createAuction;