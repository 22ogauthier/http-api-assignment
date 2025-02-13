const fs = require('fs'); // pull in the file system module

// Load our index fully into memory.
// THIS IS NOT ALWAYS THE BEST IDEA.
// We are using this for simplicity. Ideally we won't have
// synchronous operations or load entire files into memory.
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// function to handle the index page
const getIndex = (request, response) => {
  // set status code (200 success), content type, and content length
  response.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': Buffer.byteLength(index, 'utf8'),
  });
  // write an HTML string or buffer to the response
  response.write(index);
  // send the response to the client.
  response.end();
};

const getCSS = (request, response) => {
  // set status code (200 success), content type, and content length
  response.writeHead(200, {
    'Content-Type': 'text/css',
    'Content-Length': Buffer.byteLength(css, 'utf8'),
  });
  // write an HTML string or buffer to the response
  response.write(css);
  // send the response to the client.
  response.end();
};

// exports to set functions to public.
// In this syntax, you can do getIndex:getIndex, but if they
// are the same name, you can short handle to just getIndex,
module.exports = {
  getIndex,
  getCSS,
};
