const http = require('http');

//http.createServer().listen(3000);
http
  .createServer(function (request, response) {
    console.log(request.url);
    console.log(request.headers['user-agent']);
    response.setHeader('Content-Type');
    if (request.url == '/') {
      response.end('Main');
    } else if (request.url == '/cat') {
      response.end('Category');
    }
  })
  .listen(3000);
