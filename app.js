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
app.use(express.json());

let con = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'market',
});

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
      if (error) reject(error);
      resolve(result);
    });
  });

  let goods = new Promise(function (resolve, reject) {
    con.query('SELECT * FROM goods WHERE category = ' + catId, function (error, result) {
      if (error) reject(error);
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

app.get('/goods', function (req, res) {
  console.log(req.query.id);
  con.query('SELECT * FROM goods WHERE id = ' + req.query.id, function (error, result, fields) {
    if (error) throw error;
    res.render('goods', { goods: JSON.parse(JSON.stringify(result)) });
  });
});

app.post('/get-category-list', function (req, res) {
  con.query('SELECT id, category FROM category', function (error, result, fields) {
    if (error) throw error;
    console.log(result);
    res.json(result);
  });
});

app.post('/get-goods-info', function (req, res) {
  console.log(req.body);
  con.query('SELECT id, category FROM category', function (error, result, fields) {
    if (error) throw error;
    console.log(result);
    res.json(result);
  });
});
