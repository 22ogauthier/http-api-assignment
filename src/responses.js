// function to send a json object
const respondJSON = (request, response, status, object) => {
  // Stringify object
  const content = JSON.stringify(object);

  // Set headers including type and length
  response.writeHead(status, {
    'Content-Security-Policy': "script-src 'self' 'unsafe-inline'; object-src 'none';",
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  // Write content and send back to client
  response.write(content);
  response.end();
};

// used ChatGPT to help me structure XML
const respondXML = (request, response, status, object) => {
  // create a valid XML string with name and age tags.
  let responseXML = '<response>';
  responseXML += `<message>${object.message}</message>`;
  if (object.id) {
    responseXML += `<id>${object.id}</id>`;
  }
  responseXML += '</response>';

  response.writeHead(status, {
    'Content-Security-Policy': "script-src 'self' 'unsafe-inline'; object-src 'none';",
    'Content-Type': 'text/xml',
    'Content-Length': Buffer.byteLength(responseXML, 'utf8'),
  });

  // Write content and send back to client
  response.write(responseXML);
  response.end();
};

// Had ChatGPT help me come up with a way to detect the accept type
const handleResponse = (request, response, status, responseData) => {
  const accept = request.headers.accept || 'application/json'; // Default to JSON

  if (accept.includes('text/xml')) {
    return respondXML(request, response, status, responseData);
  }
  return respondJSON(request, response, status, responseData);
};

// function to show a success status code
const success = (request, response) => {
  const responseData = {
    message: 'This is a successful response',
  };
  handleResponse(request, response, 200, responseData);
};

// function to show a bad request without the correct parameters
const badRequest = (request, response) => {
  // message to send
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  // if the request does not contain a valid=true query parameter
  if (!request.query.valid || request.query.valid !== 'true') {
    // set our error message
    responseJSON.message = 'Missing valid query parameter set to true';
    // give the error a consistent id
    responseJSON.id = 'badRequest';
    // return our json with a 400 bad request code
    return respondJSON(request, response, 400, responseJSON);
  }
  console.log(`Message: ${responseJSON.message} id: ${responseJSON.id}`);

  // if the parameter is here, send json with a success status code
  return respondJSON(request, response, 200, responseJSON);
};

const unauthorized = (request, response) => {
  // message to send
  const responseJSON = {
    message: 'Missing loggedIn query paramter set to yes',
  };

  // if the request does not contain a valid=true query parameter
  if (!request.query.loggedIn || request.query.loggedIn !== 'yes') {
    // set our error message
    responseJSON.message = 'Missing valid query parameter set to yes';
    // give the error a consistent id
    responseJSON.id = 'unauthorized';
    // return our json with a 400 bad request code
    return respondJSON(request, response, 401, responseJSON);
  }
  console.log(`Message: ${responseJSON.message} id: ${responseJSON.id}`);

  // if the parameter is here, send json with a success status code
  return respondJSON(request, response, 200, responseJSON);
};

const forbidden = (request, response) => {
  // message to send
  const responseJSON = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };
  console.log(`Message: ${responseJSON.message}`);

  // send our json with a success status code
  respondJSON(request, response, 403, responseJSON);
};

const internal = (request, response) => {
  // message to send
  const responseJSON = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };
  console.log(`Message: ${responseJSON.message}`);

  // send our json with a success status code
  respondJSON(request, response, 500, responseJSON);
};

const notImplemented = (request, response) => {
  // message to send
  const responseJSON = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };
  console.log(`Message: ${responseJSON.message}`);

  // send our json with a success status code
  respondJSON(request, response, 501, responseJSON);
};

// function to show not found error
const notFound = (request, response) => {
  // error message with a description and consistent error id
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  console.log(`Message: ${responseJSON.message}`);

  // return our json with a 404 not found error code
  respondJSON(request, response, 404, responseJSON);
};

// exports to set functions to public.
// In this syntax, you can do getIndex:getIndex, but if they
// are the same name, you can short handle to just getIndex,
module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  internal,
  notImplemented,
};
