//(function(){
	console.log('loaded myGrid');

// make the xhr call to replace the records field

	var gridNode = $('#myGrid');
	gridNode.w2grid({
		name   : 'myGrid', 
		columns: [                
			{ field: 'ticker', caption: 'Ticker', size: '100px' },
			{ field: 'company', caption: 'Company', size: '9%' },
			{ field: 'st_grade', caption: 'Grade', size: '75px' },
			{ field: 'value', caption: 'Value', size: '100px' },
			{ field: 'growth', caption: 'Growth', size: '100px' },
			{ field: 'momentum', caption: 'Momentum', size: '100px' },
			{ field: 'vgm', caption: 'VGM', size: '100px' },
			{ field: 'rating', caption: 'Rating', size: '100px' },
			{ field: 'price', caption: 'Price', size: '100px' },
			{ field: 'last_dividend', caption: 'Dividend Amount', size: '150px' },
			{ field: 'dividend_percentage', caption: 'Dividend %', size: '150px' }
		],
		onAdd: function(event){
			console.log('onAdd called');
		},
		onRender: function(event){
		  console.log('onRender called');
		},
		onRefresh: function(event){
			console.log('onRefresh called');
		},
		onResize: function(event){
			console.log('onResize called');
		}

		// add on click handlers for the headers, for sorting
		
		// add inputs for filtering

		/*,
		records: [
			{ recid: 1, fname: 'John', lname: 'Doe', email: 'jdoe@gmail.com', sdate: '4/3/2012' },
			{ recid: 2, fname: 'Stuart', lname: 'Motzart', email: 'jdoe@gmail.com', sdate: '4/3/2012' },
			{ recid: 9, fname: 'Sergei', lname: 'Rachmaninov', email: 'jdoe@gmail.com', sdate: '4/3/2012' }
		]*/
	});
	nanoajax.ajax({url:'http://localhost:3003/stocks'}, function (code, res) {
		w2ui['myGrid'].add(JSON.parse(res));
	});

//})();
