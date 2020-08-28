//https://stackoverflow.com/questions/39627549/how-to-center-modal-to-the-center-of-screen/39636961
$(window).on('load', function () {
	var modal = $('#shoppingCart');
	console.log('fdjaopisdfjaosij');
	var body = $(window);
	// Get modal size
	var w = modal.width();
	var h = modal.height();
	// Get window size
	var bw = body.width();
	var bh = body.height();

	// Update the css and center the modal on screen
	modal.css({
		position: 'absolute',
		top: (bh - h) / 2 + 'px',
		left: (bw - w) / 2 + 'px',
	});
});

//https://www.smashingmagazine.com/2019/08/shopping-cart-html5-web-storage/
function checkBrowser() {
	if ('localStorage' in window && window['localStorage'] !== null) {
		console.log('true');
		// We can use localStorage object to store data.
		return true;
	} else {
		return false;
	}
}

// Dynamically populate the table with shopping list items.
//Step below can be done via PHP and AJAX, too.
function splitCamelCaseToString(str) {
	return (
		str
			// insert a space between lower & upper
			.replace(/([a-z])([A-Z])/g, '$1 $2')
			// space before last upper in a sequence followed by lower
			.replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
			// uppercase the first character
			.replace(/^./, function (str) {
				return str.toUpperCase();
			})
	);
}

function capitalize(str) {
	return str.replace(/^./, function (str) {
		return str.toUpperCase();
	});
}
//https://stackoverflow.com/questions/2827764/ecommerceshopping-cartwhere-should-i-store-shopping-cart-data-in-session-or#:~:text=The%20client%20never%20stores%20individual,cart%20is%20lost%20for%20good.
function doShowAll() {
	if (checkBrowser()) {
		var key = '';
		var list = '<tr><th>Item</th><th>Value</th></tr>\n';
		var i = 0;
		var stringifiedDataObject = localStorage.getItem('order');
		console.log('StringifiedDataObject', stringifiedDataObject);
		var orderItems = JSON.parse(stringifiedDataObject);
		console.log('unstringified', orderItems);

		//https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
		var formattedOtherToppings = [];
		for (var key in orderItems) {
			console.log(key);
			var topping = orderItems[key];
			console.log('topping', topping.length);
			if (topping.length > 1 && key != 'protein') {
				var format = '';
				console.log('yeee');
				for (var i = 0; i < topping.length; i++) {
					var toppingName = Object.keys(topping[i])[0];
					var toppingQuantity = topping[i][toppingName];
					toppingQuantity = capitalize(toppingQuantity);
					console.log('toppingName', toppingName);
					toppingName = splitCamelCaseToString(toppingName);
					if (i == topping.length - 1) {
						format += toppingQuantity;
						format += ' ';
						format += toppingName;
						console.log('formattedTopping1', formattedProtein);
					} else {
						console.log('topping key', toppingName);
						console.log('topping quantity', topping[i][toppingName]);
						format += toppingQuantity;
						format += ' ';
						format += toppingName;
						format += ' and ';
						console.log('formattedTopping2', format);
					}
				}
				console.log('final formatted', format);
				formattedOtherToppings.push(format);
				// formattedOtherToppings += '<br>';
				// formattedOtherToppings += '<br>';
			}
			console.log('final final formatted', formattedOtherToppings);
		}

		console.log('final', formattedOtherToppings);
		var protein = orderItems['protein'];
		console.log('pro', protein);
		if (protein.length > 1) {
			console.log('r');
			var formattedProtein = '';
			for (var i = 0; i < protein.length; i++) {
				console.log('i', i);
				console.log('protein length', protein.length);
				if (i == protein.length - 1) {
					proteinName = Object.keys(protein[i])[0];
					console.log('protein key', proteinName);
					formattedProtein += capitalize(protein[i][proteinName]);
					formattedProtein += ' ';
					formattedProtein += splitCamelCaseToString(proteinName);
					console.log('formattedProtein1', formattedProtein);
				} else {
					proteinName = Object.keys(protein[i])[0];
					console.log('protein key', proteinName);
					formattedProtein += capitalize(protein[i][proteinName]);
					formattedProtein += ' ';
					formattedProtein += splitCamelCaseToString(proteinName);
					formattedProtein += ' and <br>';
					console.log('formattedProtein2', formattedProtein);
				}
			}
			console.log('final formatted protein', formattedProtein);
			protein = formattedProtein;
		} else {
			proteinName = Object.keys(protein[i])[0];
			proteinServingSize = protein[0][proteinName];
			proteinName = Object.keys(protein[0])[0];
			proteinServingSize += ' ';
			proteinServingSize += proteinName;
			protein = proteinServingSize;
		}
		$('#modalBody1').append(`<div class="container" id="container1"></div>`);
		$('#container1').append(`<div class="row" id="row1"></div>`);
		$('#row1').append(`<div class="col-md" id="col1"><h2 style="float:left">Steak Crepe</h2>
        </div>`);
		$(`<div class="col-md" id="col2"><h2 style="float: right;">$11.00</h2></div>`).insertAfter($('#col1'));
		var lastRow = 1 + formattedOtherToppings.length;
		for (var i = 0; i < formattedOtherToppings.length; i++) {
			$(`<div class="row" style="margin-top: 20px;" id="row${i + 2}"></div>`).insertAfter(`#row${i + 1}`);
			$(`#row${i + 2}`).append(`<div class="col-lg" style="margin-right: 25px;" id="col${i + 3}"></div>`);
			$(`#col${i + 3}`).append(`<h6 style="float: left;">${formattedOtherToppings[i]}</h6>`);
			$(`#row${i + 2}`).append(`<div class="col-xs" id="col${i + 4}" style="margin-left: 15px;"></div>`);
			$(`#col${i + 4}`).append(`<h5 style="float:right;">$2.97</h5>`);
		}
		$(`<div class="grid-container" id="buttoncontainer1" style="margin-top: 20px; align-content:space-evenly;   grid-template-columns: auto auto auto;
            grid-gap: 5px; display:grid;"></div>`).insertAfter($('#container1'));
		$('#buttoncontainer1').append(
			`<div id="col5"><h6 style=" margin-left:35px;text-decoration:underline"><a href="copyItem()">duplicate</a></h6></div>`
		);
		$('#buttoncontainer1').append(
			`<div  id="col6" ><h6 style=" margin-left: 0px; text-decoration:underline;"><a href="{{url_for('make_your_own_crepe', edit=true)}}">edit</a></h6></div>`
		);
		$('#buttoncontainer1').append(
			`<div  id="col7"><h6 style=" text-decoration:underline; margin-right: 35px"><a href="removeItem()">remove</a></h6></div>`
		);
		//$('#col5').append(`<h6 style="margin-left:0px; margin-right:0px;text-decoration:underline;"><a href="removeItem()">remove</a></h6>`
		//`<h6 style=" margin-left:0px;text-decoration:underline"><a href="copyItem()">duplicate</a></h6>`
		//);
		//$(
		// 	`<h5 style="margin-top:20px; margin-right:200px; float:left;" id = "description1">Toppings:</h5>;`
		// ).insertAfter($('#orderTitle2'));
		// $(
		// 	`<h6 style="display:inline-block; margin-top:20px;" id = "description2">${formattedOtherToppings}</h6>;`
		// ).insertAfter($('#description1'));

		// $(`<div style="display:block; margin-top: 15px" id="buttoncontainer1"></div>`).insertAfter($('#description2'));
		// $('#buttoncontainer1').append(
		// 	`<h6 style="float:left; margin-right:25px; text-decoration:underline"><a href="{{url_for('make_your_own_crepe', edit=true)}}">edit</a></h6> <h6 style="float:left; margin-left:25px; margin-right:25px;text-decoration:underline;"><a href="removeItem()">remove</a></h6><h6 style="float: left; margin-left:25px;text-decoration:underline"><a href="copyItem()">duplicate</a></h6>`
		// );

		//For a more advanced feature, you can set a cap on max items in the cart.
		for (i = 0; i <= localStorage.length - 1; i++) {
			key = localStorage.key(i);
			list += '<tr><td>' + key + '</td>\n<td>' + localStorage.getItem(key) + '</td></tr>\n';
		}
		//If no item exists in the cart.
		if (list == '<tr><th>Item</th><th>Value</th></tr>\n') {
			list += '<tr><td><i>empty</i></td>\n<td><i>empty</i></td></tr>\n';
		}
		//Bind the data to HTML table.
		//You can use jQuery, too.
		$('#list').html(`${list}`);
	} else {
		alert('Cannot save shopping list as your browser does not support HTML 5');
	}
}
// function SaveItem(item) {
// 	var name = 'order';
// 	var itemToBeSaved = $(item).val();
// 	localStorage.setItem(name, itemToBeSaved);
// 	//doShowAll();
// }

function copyItem() {
	var name1 = $('#name').val();
	var data1 = $('#data').val();
	//Check if name already exists.
	//Check if key exists.
	if (localStorage.getItem(name1) != null) {
		//update
		localStorage.setItem(name1, data1);
		var new_info = localStorage.getItem(name1);
		$('#data').val(new_info);
	}

	doShowAll();
}

function removeItem() {
	//var name = $('#name').val();
	localStorage.removeItem('order');
	doShowAll();
}

function clearAll() {
	localStorage.clear();
	doShowAll();
}

function stringify(dataObject) {
	var stringifiedDataObject = JSON.stringify(dataObject);
	console.log('stringy', stringifiedDataObject);
	localStorage.setItem('order', stringifiedDataObject);
	console.log('order', localStorage.getItem('order'));
	return true;
}

$(window).on('load', function () {
	console.log('order1', localStorage.getItem('order'));
	doShowAll();
	$('#shoppingCart').modal('show');
});
