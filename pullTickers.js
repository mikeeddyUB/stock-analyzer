#!/bin/node

var osmosis = require('osmosis');
var colors = require('colors');
var fs = require('fs');

// the page we scrape the tickers off of separates them by letter
let promiseList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map((letter) => {
	return getTickers(letter);
});
Promise.all(promiseList).then(function(data){
	fs.writeFileSync('tickers.txt', data);
});

function getTickers(letter){
  return new Promise((res, rej) => {
    osmosis.get('http://eoddata.com/stocklist/NYSE/' + letter + '.htm').set({
      tickers: ['.quotes tr>td:first-child>a']
    }).data(function(data){
      res(data.tickers);
    })
  });
}
