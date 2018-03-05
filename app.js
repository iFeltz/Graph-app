const express = require('express'),
			mysql = require('mysql'),
			app = express(),
			bodyParser = require("body-parser");

var jsonParser = bodyParser.json();
var ID, myDate = [];
var query, db;
var event_value, encome = 0;

app.set('view engine', 'pug');

function handleDisconnect() {
  db = mysql.createConnection({
		host			: 'localhost',
		user			: 'root',
		password	: '',
		database	: 'test'
	});

  // Reconnect to database
  db.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
    else console.log('Connected');
  });

  db.on('error', function(err) {
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
};

handleDisconnect();

app.post('/id', jsonParser,(req, res) => {
			ID = req.body.id;
			myDate = req.body.myDate.split(' ');
			myDate.splice(1, 1);
			for (var i = 0; i < 2; i++) {
				myDate[i] = myDate[i].split('/');
				myDate[i] = parseInt(myDate[i].slice(2).concat(myDate[i].slice(0, 2)).join(''));
			}

			var shortDate = myDate[1].toString().split('');
			var dateMonth, dateDay;

			var date = new Date(parseInt(shortDate.slice(0, 4).join('')), 
				parseInt(shortDate.slice(4, 6).join('')) - 1, parseInt(shortDate.slice(6).join('')));

			date.setTime(date.getTime() - 29*24*3600*1000)

			dateDay = parseInt(date.getDate()) >= 10 ? parseInt(date.getDate()) : '0' + parseInt(date.getDate());
			dateMonth = parseInt(date.getMonth()) + 1;
			dateMonth = dateMonth >= 10 ? dateMonth : '0' + dateMonth;


			// Запрос данных по указанном периоду
			db.query('SELECT * FROM `stats` WHERE partner_id = ' + ID + ' AND date >= ' + myDate[0]
				+ ' AND date <= ' + myDate[1] + ' ORDER BY `date` ASC', function(error, results, fields) {
					if (error) console.log(error);
					if (results.length) {
						var eValue = [[],[],[]];
						for (var i = 0; i < results.length; i++) {
							encome += results[i].event_value;
						}

						// Запрос данных за 30 дней от последней даты
						db.query('SELECT * FROM `stats` WHERE date >= ' + 
							date.getFullYear() + dateMonth + dateDay + ' AND date <= ' + myDate[1] + ' AND partner_id = ' + 
							 ID + ' ORDER BY `date` ASC', 
							function(err, data, fieldsData) {
								if (err) throw err;
								var j = 0;
								for (var i = 0; i < 30; i++) {
									eValue[1][i] = 0;
									eValue[2][i] = 0;
									while (j < data.length && date.getTime() == data[j].date.getTime()) {
										eValue[1][i] += 1;
										eValue[2][i] += data[j].event_value;
										j++;
									}
									date.setTime(date.getTime() + 24*3600*1000);
								}
								eValue[0][0] = encome;
								eValue[0][1] = encome / results.length ? encome / results.length : 0;
								eValue[0][2] = myDate[1];
								res.status(200).send(eValue);
						});
				}
				else {
					var res_data = '404';
					res.status(200).send(res_data);
				}
			})
			encome = 0;
			eValue = [[],[],[]]
})

app.get('/', (req, res) => {
	res.render('index.pug');
});

app.get('/?*', (req, res) => {
	res.send("Not found");
})

app.listen('3000', () => {
	console.log('Server started on port 3000');
})

