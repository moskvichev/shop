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
const nodemailer = require('nodemailer');

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
  let cat = new Promise(function (resolve, reject) {
    con.query(
      "select id,name, cost, image, category from (select id,name,cost,image,category, if(if(@curr_category != category, @curr_category := category, '') != '', @k := 0, @k := @k + 1) as ind   from goods, ( select @curr_category := '' ) v ) goods where ind < 3",
      function (error, result, field) {
        if (error) return reject(error);
        resolve(result);
      },
    );
  });
  let catDescription = new Promise(function (resolve, reject) {
    con.query('SELECT * FROM category', function (error, result, field) {
      if (error) return reject(error);
      resolve(result);
    });
  });
  Promise.all([cat, catDescription]).then(function (value) {
    console.log(value[0]);
    res.render('index', {
      goods: JSON.parse(JSON.stringify(value[0])),
      cat: JSON.parse(JSON.stringify(value[1])),
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

app.get('/order', function (req, res) {
  res.render('order');
});

app.post('/get-category-list', function (req, res) {
  con.query('SELECT id, category FROM category', function (error, result, fields) {
    if (error) throw error;
    console.log(result);
    res.json(result);
  });
});

app.post('/get-goods-info', function (req, res) {
  console.log(req.body.key);
  if (req.body.key.length != 0) {
    con.query(
      'SELECT id, name, cost FROM goods WHERE id IN (' + req.body.key.join(' , ') + ')',
      function (error, result, fields) {
        if (error) throw error;
        let goods = {};
        for (let i = 0; i < result.length; i++) {
          goods[result[i]['id']] = result[i];
        }
        res.json(goods);
      },
    );
  } else {
    res.send('0');
  }
});

app.post('/finish-order', function (req, res) {
  console.log(req.body);
  if (req.body.key.length != 0) {
    let key = Object.keys(req.body.key);
    con.query(
      'SELECT id, name, cost FROM goods WHERE id IN (' + key.join(' , ') + ')',
      function (error, result, fields) {
        if (error) throw error;
        sendMail(req.body, result).catch(console.error);
        res.send('1');
      },
    );
  } else {
    res.send('1');
  }
});

async function sendMail(data, result) {
  let res = '<h2>Order in lite shop</h2>';
  let total = 0;
  for (let i = 0; i < result.length; i++) {
    res += `<p>${result[i]['name']} - ${data.key[result[i]['id']]} - ${
      result[i]['cost'] * data.key[result[i]['id']]
    } uah</p>=`;
    total += result[i]['cost'] * data.key[result[i]['id']];
  }
  console.log(res);
  res += '<hr>';
  res += `Total ${total} uah`;
  res += `<hr>Phone: ${data.phone}`;
  res += `<hr>Username: ${data.username}`;
  res += `<hr>Address: ${data.address}`;
  res += `<hr>Email: ${data.email}`;

  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: 'maddison53@ethereal.email',
      pass: 'jn7jnAPss4f63QBp6D',
    },
  });

  let mailOption = {
    form: '<moskvichev_e@bk.ru>',
    to: 'moskvichev_e@bk.ru,' + data.email,
    subject: 'Lite shop order',
    text: 'Hello world',
    html: res,
  };
  let info = await transporter.sendMail(mailOption);
  console.log('MessageSent: %s', info.messageId);
  console.log('PreviewSent: %s', nodemailer.getTestMessageUrl(info));
  return true;
}
