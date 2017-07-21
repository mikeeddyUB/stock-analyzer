const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
//const favicon = require('serve-favicon');

const app = express();

const PORT = 3003;

var pg = require('pg');
require('dotenv').config();
var connectionString = 'pg://' + process.env.DBUSER + ':' + process.env.DBPASS + '@' + process.env.DBADDRESS + ':5432/stockanalyzer';
var client = new pg.Client(connectionString);
client.connect();

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors());

let db;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
/*
MongoClient.connect('mongodb://dev:password@ds143449.mlab.com:43449/stocks', (err, database) => { // make the username/pw part of a gitignored file and read it in
	db = database;
	if (err) { console.log('err'); return;}
	app.listen(PORT, () => {
		console.log(`listening on ${PORT}`);
	});
});*/

//app.use(express.static(path.join(__dirname, 'www')));

/*app.get('/', (req, res) => {
	res.sendFile(__dirname + '/www/index.html');
});*/

app.get('/stocks', (req, res) => {
	/*db.collection('stocks').find().toArray((err, results) => {
		res.send(results);
	});*/
	var query = client.query('select * from stocks', [], (err, results) => {
		res.json(results.rows.map(function(row){
			row.recid = row.id;
			return row;
		}));
	});
});

app.get('/query', (req, res) => {
				// get params and build the query object
	db.collection('stocks').find().toArray((err, results) => {
		res.send(results);
  });
});
