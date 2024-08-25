// const http = require('http');
// const fs = require('fs');

//http.createServer().listen(3000);
// http
//   .createServer(function (request, response) {
//     console.log(request.url);
//     console.log(request.headers['user-agent']);
//     response.setHeader('Content-Type', 'text/html; charset=utf-8;');
//     if (request.url == '/') {
//       response.end('Main');
//     } else if (request.url == '/cat') {
//       response.end('Category <h1>Welcome to the shop</h1>');
//     } else if (request.url == '/dat') {
//       let myFile = fs.readFileSync('1.dat');
//       console.log(myFile);
//       response.end(myFile);
//     }
//   })
//   .listen(3000);

let express = require('express');
let app = express();
/**
 * public -имя папки где хранится статика
 */
app.use(express.static('public'));

/**
 * шаблонизатор
 *
 */
app.set('view engine', 'pug');

app.listen(3000, function () {
  console.log('node express work on 3000');
});

app.get('/', function (req, res) {
  console.log('load /');
  res.render('main', {
    foo: 4,
    bar: 7,
  });
});

app.get('/cat', function (req, res) {
  res.end('cat');
});
