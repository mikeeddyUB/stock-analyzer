var pg = require('pg');

require('dotenv').config();

var connectionString = 'pg://' + process.env.DBUSER + ':' + process.env.DBPASS + '@' + process.env.DBADDRESS + ':5432/stockanalyzer';

var client = new pg.Client(connectionString);
client.connect();
//var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');

var createStockTable = 'CREATE TABLE STOCKS(id VARCHAR(10) PRIMARY KEY, ticker VARCHAR(10) not null, company VARCHAR(80) not null, st_grade VARCHAR(10) not null, value VARCHAR(10) not null, growth VARCHAR(10) not null, momentum VARCHAR(10) not null, vgm VARCHAR(10) not null, rating VARCHAR(10) not null, last_dividend VARCHAR(10) not null, dividend_percentage VARCHAR(10) not null, price VARCHAR(10) not null);';

var insertStocks = '';//"INSERT INTO TRAINERS (id, first, last, email, profile, active) VALUES (3, 'Jim', 'Jones', 'jimjones@gmail.com', NULL, true),(4, 'Snoop', 'Dogg', 'blazeallday@gmail.com', '4.jpg', true),(5, 'Marshall', 'Mathers', 'm_m@gmail.com', '5.jpg', true),(6, 'Peyton', 'Manning', 'colts@gmail.com', '6.jpg', true),(7, 'Joe', 'Namath', 'jetsjetsjetsjets@gmail.com', NULL, true),(8, 'Captain', 'Morgan', 'rum@gmail.com', '8.jpg', true),(9, 'Steve', 'Harvey', 'family@gmail.com', '9.jpg', true);"

var query = client.query(createStockTable);

query.on('end', function() { client.end(); });


