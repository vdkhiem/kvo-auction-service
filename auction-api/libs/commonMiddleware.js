import middly from '@middy/core'; // middleware
import httpJsonBodyParse from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';

export default handler => middly(handler)
    .use([
        httpJsonBodyParse(), // Automatically parse stringfy event body, so we don't need to use JSON.parse(event.body)
        httpEventNormalizer(), // Automatically adjust API gateway event objects to prevent us having non existing object when trying to access path parameter or query parameter
        httpErrorHandler(), // handling error process smoothly
        cors(),
    ]);