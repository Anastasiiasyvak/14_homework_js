const http = require('http');
const fs = require('fs');

function readAsyncFile(response) {
  fs.readFile('my_file.txt', 'utf8', (err, data) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('Internal Server Error');
      return;
    }
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(data);
  });
}

function readSyncFile(response) {
  try {
    const data = fs.readFileSync('my_file.txt', 'utf8');
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(data);
  } catch (err) {
    response.writeHead(500, { 'Content-Type': 'text/plain' });
    response.end('Internal Server Error');
  }
}

const server = http.createServer((request, response) => {
  if (request.url === '/getAsync') {
    readAsyncFile(response);
  } else if (request.url === '/getSync') {
    readSyncFile(response);
  }
});

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
