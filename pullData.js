var osmosis = require('osmosis');
var Promise = require('promise');
var colors = require('colors');
var fs = require('fs');
var pg = require('pg');

require('dotenv').config();
var connectionString = 'pg://' + process.env.DBUSER + ':' + process.env.DBPASS + '@' + process.env.DBADDRESS + ':5432/stockanalyzer';

var client = new pg.Client(connectionString);
client.connect();

var zacksConfig = {
	'value': '//*[@id="quote_ribbon_v2"]/div[2]/div[2]/p/span[1]',
	'name': '//*[@id="quote_ribbon_v2"]/div[1]/header/h1/a',
	'growth': '//*[@id="quote_ribbon_v2"]/div[2]/div[2]/p/span[2]',
	'momentum': '//*[@id="quote_ribbon_v2"]/div[2]/div[2]/p/span[3]',
	'vgm': '//*[@id="quote_ribbon_v2"]/div[2]/div[2]/p/span[4]',
	'price': '//*[@id="stock_activity"]/table/tbody/tr[1]/td[2]',
	'dividend':'//*[@id="stock_activity"]/table/tbody/tr[8]/td[2]/span',
	'rating': '//*[@id="quote_ribbon_v2"]/div[2]/div[1]/p'
};

var theStreetConfig = {
	'grade': '//*[@id="promo-div-quote-nav-unit-large-screen"]/div[1]/span[2]'
};

// Morning star -- have to pay for some data
// market grader -- have to pay for some data

var t = fs.readFileSync('stocks_A.txt', 'utf8').split(',');
// I think we want to clear the collection before we start saving
//var db;
//	db = database;

//	if (err) { console.log('err'); return;}
	console.log(('ticker\tgrade\tvalue\tgrowth\tmomntm\tVGM\trating').yellow);
	fs.writeFileSync('stock_results.txt', 'ticker,grade,name,value,growth,momntm,VGM,rating,price,dividend amt,dividend pcnt\n');
	
	t.forEach(function(ticker){
		getData(ticker);
	});
//});

var query;

function getData(ticker){
  getTheStreet(ticker).then(function(st){
    getZacks(ticker).then(function(z){
      if (ticker && st.grade && z.rating){

				// also include, a/q revenue growth, a/q net income growth, operating margin (relative to peer avg?? -- marketgrader), PE ratio?, dividend history?, volume, market cap?

				var str = ticker + ':\t' + c(st.grade) + '\t' + c(z.value) + '\t' + c(z.growth);
				str += '\t' + c(z.momentum) + '\t' + c(z.vgm) + '\t' + c(z.rating) + '\t' + z.price;
				str += '\t' + z.dividend.split('(')[0].trim() + '\t' + z.dividend.split('(')[1].replace(')','').trim();
				console.log(str);

				var fileStr = ticker + ',' + z.name.replace(',','') + ',' + fc(st.grade) + ',' + fc(z.value);
				fileStr += ',' + fc(z.growth) + ',' + fc(z.momentum) + ',' + fc(z.vgm) + ',' + fc(z.rating).split(' ')[0];
				fileStr += ',' + z.price.replace(',','').replace('USD','').trim() + ',';
				fileStr += '$' + z.dividend.split('(')[0].trim() + ',';
				fileStr += z.dividend.split('(')[1].replace(')','').trim() + '\n';
				fs.appendFileSync('stock_results.txt', fileStr);

				query = client.query(doTheDamnThing(st, z, ticker));

//				query.on('end', function() { client.end(); });

      }
    }).catch(function(e){});
  }).catch(function(e){});
	console.log('DONE');
}

function doTheDamnThing(st, z, ticker){
	var row = createRow(st, z, ticker);
	var insert = `insert into stocks(id, ticker, company, st_grade, value, growth, momentum, vgm, rating, last_dividend, dividend_percentage, price) values ('${ticker}', '${row.ticker}', '${row.company}', '${row.st_grade}', '${row.value}', '${row.growth}', '${row.momentum}', '${row.vgm}', '${row.rating}', '${row.last_dividend}', '${row.dividend_percentage}', '${row.price}');`;

	console.log('insert: ', insert);

	return insert;
}

var _index = 1;
function createRow(st, z, ticker){
	return {
		_id: ticker,
		ticker: ticker,
		recid: _index++,
		company: z.name.replace(',',''),
		st_grade: fc(st.grade),
		value: fc(z.value),
		growth: fc(z.growth),
		momentum: fc(z.momentum),
		vgm: fc(z.vgm),
		rating: fc(z.rating).split(' ')[0],
		last_dividend: z.price.replace(',','').replace('USD','').trim(),
		dividend_percentage: z.dividend.split('(')[0].trim(),
		price: z.dividend.split('(')[1].replace(')','').trim()
	};
}

function c(grade){
	// have method to parse grade correctly
  grade = grade.replace(')', '').replace('(', '');
  grade = grade.replace('Strong Buy', 'SB').replace('Buy', 'Buy').replace('Sell', 'Sell').replace('Hold', 'Hold').replace('Strong Sell', 'SS');
  switch(grade[0]){
    case 'A':
      return grade.green;
      break;
    case 'B':
      return grade.blue;
      break;
    case 'C':
      return grade.gray;
      break;
    case 'D':
      return grade.red;
      break;
    case 'E':
      return grade.red;
      break;
    case 'F':
      return grade.red;
      break;
    case '1':
      return grade.green;
      break;
    case '2':
      return grade.blue;
      break;
    case '3':
      return grade.gray;
      break;
    case '4':
      return grade.red;
      break;
    case '5':
      return grade.red;
      break;
    default:
      console.log('unknown grade: ', grade);
      return '?';
      break;
  }
}

function fc(grade){
  grade = grade.replace(')', '').replace('(', '');
  grade = grade.replace('Strong Buy', 'SB').replace('Buy', 'Buy').replace('Sell', 'Sell').replace('Hold', 'Hold').replace('Strong Sell', 'SS');
  return grade;
}

function getZacks(ticker){return fetch('https://www.zacks.com/stock/quote/' + ticker, zacksConfig);}

function getTheStreet(ticker){return fetch('https://www.thestreet.com/quote/' + ticker + '.html', theStreetConfig);}

function fetch(url, config){
  return new Promise(function(suc, fail){
    try{
      osmosis.get(url).set(config).data(function(data){
        suc(data);
      });
    } catch (e) {
      fail(e);
    }
  });
}
