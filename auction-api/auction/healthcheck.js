// event: contains body query parameter, path parameter and other headers, etc...
// context: contains some meta-data about function lambda
// can add custom data to event, and context via middleware
// authentication, can put id to context via middleware
async function healthcheck(event, context) {
  return {
    statusCode: 200,
    // body: JSON.stringify({event, context}), // To see detail of event and context
    body: JSON.stringify({ message: 'Health check status OK.' }), // the body must wrap around JSON.stringify, otherwise we get bunch of error
  };
}

export const handler = healthcheck;


