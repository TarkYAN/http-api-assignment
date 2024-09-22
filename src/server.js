const http = require('http');
const url = require('url');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
    console.log(request.url);

    const parsedUrl = url.parse(request.url, true);
    request.acceptedTypes = request.headers.accept ? request.headers.accept.split(',') : ['application/json'];

    const params = parsedUrl.query;


    if (parsedUrl.pathname === '/') 
    {
        responseHandler.getIndex(request, response);
    }
    else if (parsedUrl.pathname === '/style.css') 
    {
        responseHandler.getCSS(request, response);
    }
    else if (parsedUrl.pathname === '/success') 
    {
        responseHandler.success(request, response);
    }
    else if (parsedUrl.pathname === '/badRequest') 
    {
        responseHandler.badRequest(request, response, params);
    }
    else if (parsedUrl.pathname === '/unauthorized') 
    {
        responseHandler.unauthorized(request, response, params);
    }
    else if (parsedUrl.pathname === '/forbidden') 
    {
        responseHandler.forbidden(request, response);
    }
    else if (parsedUrl.pathname === '/internal') 
    {
        responseHandler.internal(request, response);
    }
    else if (parsedUrl.pathname === '/notImplemented') 
    {
        responseHandler.notImplemented(request, response);
    }
    else 
    {
        responseHandler.notFound(request, response);
    }
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
});
