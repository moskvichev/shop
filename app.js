const http = require('http');

//http.createServer().listen(3000);
http
  .createServer(function (request, response) {
    console.log(request.url);
    console.log(request.headers['user-agent']);
    response.setHeader('Content-Type', 'text/html; charset=utf-8;');
    if (request.url == '/') {
      response.end('Main');
    } else if (request.url == '/cat') {
      response.end('Category <h1>Welcome to the shop</h1>');
    }
  })
  .listen(3000);
