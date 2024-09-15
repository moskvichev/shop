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

/**
 * подключение mysql
 */

let mysql = require('mysql');

/**
 * настраиваем модуль
 */

let con = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'market',
});

// con.connect(function (err) {
//   if (err) throw err;
//   console.log('Connected');
// });

app.listen(3000, function () {
  console.log('node express work on 3000');
});

app.get('/', function (req, res) {
  con.query('SELECT * FROM goods', function (error, result) {
    if (error) throw error;
    console.log(result);
    let goods = {};
    for (let i = 0; i < result.length; i++) {
      goods[result[i]['id']] = result[i];
    }
    console.log(JSON.parse(JSON.stringify(goods)));
    res.render('main', {
      foo: 'Hello',
      bar: 7,
      goods: JSON.parse(JSON.stringify(goods)),
    });
  });
});

/**
 * страница категории
 *
 */

app.get('/cat', function (req, res) {
  console.log(req.query.id);
  let catId = req.query.id;
  // res.render('cat', {});

  let cat = new Promise(function (resolve, reject) {
    con.query('SELECT * FROM category WHERE id = ' + catId, function (error, result) {
      if (error) reject(err);
      resolve(result);
    });
  });

  let goods = new Promise(function (resolve, reject) {
    con.query('SELECT * FROM goods WHERE category = ' + catId, function (error, result) {
      if (error) reject(err);
      resolve(result);
    });
  });

  Promise.all([cat, goods]).then(function (value) {
    console.log(value[1]);
    res.render('cat', {
      cat: JSON.parse(JSON.stringify(value[0])),
      goods: JSON.parse(JSON.stringify(value[1])),
    });
  });
});
