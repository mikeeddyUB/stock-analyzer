var osmosis = require('osmosis');
var colors = require('colors');
var fs = require('fs');

var promiseList = [];

['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].forEach(function(letter){
  promiseList.push(getTickers(letter));
  Promise.all(promiseList).then(function(data){
    fs.writeFileSync('stocks_A.txt', data);
  });
});

function getTickers(letter){
  return new Promise( function(suc, fail){
    osmosis.get('http://eoddata.com/stocklist/NYSE/' + letter + '.htm').set({
      tickers: ['.quotes tr>td:first-child>a']
    }).data(function(data){
      suc(data.tickers);
    })
  });
}
