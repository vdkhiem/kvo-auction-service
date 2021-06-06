async function healthcheck(event, context) {
    return {
        statusCode: '200',
        body: JSON.stringify({ message: 'Kvo Auction Service is OK. V1.' }),
    };
}

export const handler = healthcheck;