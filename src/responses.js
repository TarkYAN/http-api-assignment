const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const respond = (request, response, status, content, type) => {
    response.writeHead(status, {
        'Content-Type': type,
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });
    response.write(content);
    response.end();
};

const respondJSON = (request, response, status, object) => {
    const jsonContent = JSON.stringify(object);
    respond(request, response, status, jsonContent, 'application/json');
};

const respondXML = (request, response, status, xmlString) => {
    respond(request, response, status, xmlString, 'text/xml');
};

const respondFile = (request, response, status, fileContent, contentType) => {
    respond(request, response, status, fileContent, contentType);
};

const getIndex = (request, response) => {
    respondFile(request, response, 200, index, 'text/html');
};

const getCSS = (request, response) => {
    respond(request, response, 200, css, 'text/css');
};

const success = (request, response) => {
    const responseJSON = {
        message: 'This is a successful response',
    };

    if (request.acceptedTypes.includes('text/xml')) 
    {
        const xmlResponse = `<response><message>${responseJSON.message}</message></response>`;
        respondXML(request, response, 200, xmlResponse);
    } 
    else 
    {
        respondJSON(request, response, 200, responseJSON);
    }
};

const badRequest = (request, response, params) => {
    const responseJSON = { message: 'Missing valid query parameter set to true', id: 'badRequest' };

    if (params.valid === 'true') 
    {
        const successJSON = { message: 'This is a successful request' };
        if (request.acceptedTypes.includes('text/xml')) 
        {
            const xmlResponse = `<response><message>${successJSON.message}</message></response>`;
            return respondXML(request, response, 200, xmlResponse);
        }
        return respondJSON(request, response, 200, successJSON);
    }

    if (request.acceptedTypes.includes('text/xml')) 
    {
        const xmlResponse = `<response><message>${responseJSON.message}</message><id>${responseJSON.id}</id></response>`;
        return respondXML(request, response, 400, xmlResponse);
    }
    return respondJSON(request, response, 400, responseJSON);
};

const unauthorized = (request, response, params) => {
    const responseJSON = { message: 'Missing loggedIn query parameter set to yes', id: 'unauthorized' };

    if (params.loggedIn === 'yes') 
    {
        const successJSON = { message: 'You have successfully logged in' };
        if (request.acceptedTypes.includes('text/xml')) 
        {
            const xmlResponse = `<response><message>${successJSON.message}</message></response>`;
            return respondXML(request, response, 200, xmlResponse);
        }
        return respondJSON(request, response, 200, successJSON);
    }

    if (request.acceptedTypes.includes('text/xml')) 
    {
        const xmlResponse = `<response><message>${responseJSON.message}</message><id>${responseJSON.id}</id></response>`;
        return respondXML(request, response, 401, xmlResponse);
    }
    return respondJSON(request, response, 401, responseJSON);
};

const forbidden = (request, response) => {
    const responseJSON = { message: 'You do not have access to this content', id: 'forbidden' };

    if (request.acceptedTypes.includes('text/xml')) 
    {
        const xmlResponse = `<response><message>${responseJSON.message}</message><id>${responseJSON.id}</id></response>`;
        return respondXML(request, response, 403, xmlResponse);
    }
    return respondJSON(request, response, 403, responseJSON);
};

const internal = (request, response) => {
    const responseJSON = { message: 'Internal Server Error. Something went wrong.', id: 'internalError' };

    if (request.acceptedTypes.includes('text/xml')) 
    {
        const xmlResponse = `<response><message>${responseJSON.message}</message><id>${responseJSON.id}</id></response>`;
        return respondXML(request, response, 500, xmlResponse);
    }
    return respondJSON(request, response, 500, responseJSON);
};

const notImplemented = (request, response) => {
    const responseJSON = { message: 'A GET request for this page has not been implemented yet. Check again later for updated content.', id: 'notImplemented' };

    if (request.acceptedTypes.includes('text/xml')) 
    {
        const xmlResponse = `<response><message>${responseJSON.message}</message><id>${responseJSON.id}</id></response>`;
        return respondXML(request, response, 501, xmlResponse);
    }
    return respondJSON(request, response, 501, responseJSON);
};

const notFound = (request, response) => {
    const responseJSON = { message: 'The page you are looking for was not found.', id: 'notFound' };

    if (request.acceptedTypes.includes('text/xml')) 
    {
        const xmlResponse = `<response><message>${responseJSON.message}</message><id>${responseJSON.id}</id></response>`;
        return respondXML(request, response, 404, xmlResponse);
    }
    return respondJSON(request, response, 404, responseJSON);
};

module.exports = {
    getIndex,
    getCSS,
    success,
    badRequest,
    unauthorized,
    forbidden,
    internal,
    notImplemented,
    notFound,
};
