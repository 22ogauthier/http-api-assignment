const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);

  response.writeHead(status, {
    'Content-Security-Policy': "script-src 'self' 'unsafe-inline'; object-src 'none';", //used ChatGPT to help try and solve the error about "eval", wasn't successful but left this here in case all code breaks
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  response.write(content);
  response.end();
};

// used ChatGPT to help me structure XML
const respondXML = (request, response, status, object) => {
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

  response.write(responseXML);
  response.end();
};

// Had ChatGPT help me come up with a way to detect the accept type
const handleResponse = (request, response, status, responseData) => {
  const accept = request.headers.accept || 'application/json';

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

// function to show a bad request status code
const badRequest = (request, response) => {
  const responseData = {
    message: 'This request has the required parameters',
  };

  // if the request does not contain a valid=true query parameter
  if (!request.query.valid || request.query.valid !== 'true') {
    responseData.message = 'Missing valid query parameter set to true';
    responseData.id = 'badRequest';
    handleResponse(request, response, 400, responseData);
  } else {
    handleResponse(request, response, 200, responseData);
  }
};

// function to show an unauthorized status code
const unauthorized = (request, response) => {
  const responseData = {
    message: 'Missing loggedIn query paramter set to yes',
  };

  // if the request does not contain a valid=true query parameter
  if (!request.query.loggedIn || request.query.loggedIn !== 'yes') {
    responseData.message = 'Missing valid query parameter set to yes';
    responseData.id = 'unauthorized';
    handleResponse(request, response, 401, responseData);
  } else {
    handleResponse(request, response, 200, responseData);
  }
};

// function to show a forbidden status code
const forbidden = (request, response) => {
  const responseData = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };
  console.log(`Message: ${responseData.message}`);

  handleResponse(request, response, 403, responseData);
};

// function to show an internal status code
const internal = (request, response) => {
  const responseData = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };
  console.log(`Message: ${responseData.message}`);

  handleResponse(request, response, 500, responseData);
};

// function to show a notImplemented status code
const notImplemented = (request, response) => {
  const responseData = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };
  console.log(`Message: ${responseData.message}`);

  handleResponse(request, response, 501, responseData);
};

// function to show not found error
const notFound = (request, response) => {
  const responseData = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  console.log(`Message: ${responseData.message}`);

  handleResponse(request, response, 404, responseData);
};

module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  internal,
  notImplemented,
};
