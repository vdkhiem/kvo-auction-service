async function healthcheck(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Health check status OK.' }),
  };
}

export const handler = healthcheck;


