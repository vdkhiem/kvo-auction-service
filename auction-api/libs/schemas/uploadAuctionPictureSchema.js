const schema = {
    properties: {
        body: {
            type: 'string',
            minLength: 1, // validate empty base64 in the body
            //pattern: '\=$' // validate base64 body end with '=' character
        },
    },
    required: ['body'],
};

export default schema;