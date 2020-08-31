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
function toppingPricing(toppingCategoryList, proteinCategoryList) {
	var newToppingCategoryListWithPricesofToppingCategories = [];
	for (var i = 0; i < toppingCategoryList.length; i++) {
		const toppingDict = toppingCategoryList[i];
		const toppingKey = Object.keys(toppingDict)[0];
		console.log('tkey', toppingKey);
		console.log('toppingDict', toppingDict);
		if (toppingKey == 'veggie') {
			const newToppingDict = {};
			const toppingQuantity = toppingDict[toppingKey];
			console.log('tquant', toppingQuantity);
			const amountOverIncludedAmount = toppingQuantity - 4;
			var priceForTopping;
			if (amountOverIncludedAmount > 0) {
				priceForTopping = amountOverIncludedAmount * 0.5;
			} else {
				priceForTopping = 0;
			}
			newToppingDict[`${toppingKey}`] = priceForTopping;
			newToppingCategoryListWithPricesofToppingCategories.push(newToppingDict);
		} else if (toppingKey == 'cheese') {
			const newToppingDict = {};
			const toppingQuantity = toppingDict[toppingKey];
			const amountOverIncludedAmount = toppingQuantity - 1;
			var priceForTopping;
			if (amountOverIncludedAmount > 0) {
				priceForTopping = amountOverIncludedAmount * 0.99;
			} else {
				priceForTopping = 0;
			}
			newToppingDict[`${toppingKey}`] = priceForTopping;
			newToppingCategoryListWithPricesofToppingCategories.push(newToppingDict);
		} else if (toppingKey == 'sauce') {
			const newToppingDict = {};
			const toppingQuantity = toppingDict[toppingKey];
			const amountOverIncludedAmount = toppingQuantity;
			var priceForTopping;
			if (amountOverIncludedAmount > 0) {
				priceForTopping = amountOverIncludedAmount * 0.99;
			} else {
				priceForTopping = 0;
			}
			newToppingDict[`${toppingKey}`] = priceForTopping;
			newToppingCategoryListWithPricesofToppingCategories.push(newToppingDict);
		} else if (toppingKey == 'herb') {
			const newToppingDict = {};
			const toppingQuantity = toppingDict[toppingKey];
			const amountOverIncludedAmount = toppingQuantity;
			var priceForTopping;
			if (amountOverIncludedAmount > 0) {
				priceForTopping = amountOverIncludedAmount * 0.5;
			} else {
				priceForTopping = 0;
			}
			newToppingDict[`${toppingKey}`] = priceForTopping;
			newToppingCategoryListWithPricesofToppingCategories.push(newToppingDict);
		}
	}
	//count up protein price
	console.log('pcatList', proteinCategoryList);
	var priceForProtein = 0;
	var newProteinDict = {};
	for (var i = 0; i < proteinCategoryList.length; i++) {
		const proteinDict = proteinCategoryList[i];
		const proteinKey = Object.keys(proteinDict)[0];
		console.log('tkey', proteinKey);
		console.log('proteinDict', proteinDict);

		if (proteinKey == 'Steak') {
			var priceForProtein = 9.5;
			const toppingQuantity = proteinDict[proteinKey];
			console.log('tquant', toppingQuantity);
			const proteinAmountOverIncludedAmount = toppingQuantity;
			var priceForProtein;
			if (proteinAmountOverIncludedAmount > 0) {
				priceForProtein += proteinAmountOverIncludedAmount * 3.5;
			} else {
				priceForProtein += 0;
			}
		} else if (proteinKey == 'Chicken Breast') {
			priceForProtein = 8.5;
			const toppingQuantity = proteinDict[proteinKey];
			const proteinAmountOverIncludedAmount = toppingQuantity;
			var priceForProtein;
			if (proteinAmountOverIncludedAmount > 0) {
				priceForProtein += proteinAmountOverIncludedAmount * 2.5;
			} else {
				priceForProtein += 0;
			}
		} else {
			priceForProtein = 7.5;
			const toppingQuantity = proteinDict[proteinKey];
			const proteinAmountOverIncludedAmount = toppingQuantity;
			var priceForProtein;
			if (proteinAmountOverIncludedAmount > 0) {
				priceForProtein += proteinAmountOverIncludedAmount * 2.5;
			} else {
				priceForProtein += 0;
			}
		}
	}
	newProteinDict['protein'] = priceForProtein;
	newToppingCategoryListWithPricesofToppingCategories.unshift(newProteinDict);
	console.log(
		'newToppingCategoryListWithPricesofToppingCategories',
		newToppingCategoryListWithPricesofToppingCategories
	);
	return newToppingCategoryListWithPricesofToppingCategories;
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
		var toppingCategoryCount = [];
		var proteinCategoryCount = [];
		var formattedOtherToppings = [];
		for (var key in orderItems) {
			var topping = orderItems[key];
			if (topping != '') {
				console.log('topping', topping);
				var toppingCategoryCountDict = {};
				var toppingCount = 0;
				if (key != 'protein') {
					var format = '';
					for (var i = 0; i < topping.length; i++) {
						var toppingName = Object.keys(topping[i])[0];
						var toppingQuantity = topping[i][toppingName];
						console.log('toppingName', toppingName);
						console.log('toppingQuant', toppingQuantity);
						if (toppingQuantity == 'half') {
							toppingCount += 0.5;
						} else if (toppingQuantity == 'regular') {
							toppingCount += 1;
						} else if (toppingQuantity == 'extra') {
							toppingCount += 2;
						}
						toppingQuantity = capitalize(toppingQuantity);
						toppingName = splitCamelCaseToString(toppingName);
						format += toppingQuantity;
						format += ' ';
						format += toppingName;
						if (i != topping.length - 1) {
							format += ' and ';
						}
					}
					toppingCategoryCountDict[`${key}`] = toppingCount;
					console.log('countDict', toppingCategoryCountDict);
					toppingCategoryCount.push(toppingCategoryCountDict);
					formattedOtherToppings.push(format);
				} else {
					var protein = orderItems[key];
					console.log('protein', protein);
					//if (protein.length > 1) {
					var formattedProtein = '';
					for (var i = 0; i < protein.length; i++) {
						var proteinCount = 0;
						var proteinCategoryCountDict = {};
						var proteinName = Object.keys(protein[i])[0];
						var proteinQuantity = protein[i][proteinName];
						console.log('pname', proteinName, 'pquant', proteinQuantity);
						if (proteinQuantity == 'half') {
							proteinCount += 0.5;
						} else if (proteinQuantity == 'regular') {
							proteinCount += 1;
						} else if (proteinQuantity == 'extra') {
							proteinCount += 2;
						}
						proteinName = splitCamelCaseToString(proteinName);
						proteinQuantity = capitalize(proteinQuantity);
						formattedProtein += proteinQuantity;
						formattedProtein += ' ';
						formattedProtein += proteinName;
						if (i != protein.length - 1) {
							formattedProtein += ' and ';
						}
						proteinCategoryCountDict[`${proteinName}`] = proteinCount;
						console.log('proteinCategoryCountDict', proteinCategoryCountDict);
						proteinCategoryCount.push(proteinCategoryCountDict);
					}

					console.log('final formatted protein', formattedProtein);
					protein = formattedProtein;
					formattedOtherToppings.unshift(formattedProtein);
				}
				var newToppingCategoryListWithPricesofToppingCategories = toppingPricing(
					toppingCategoryCount,
					proteinCategoryCount
				);
				console.log('TcatPrice', newToppingCategoryListWithPricesofToppingCategories);
			}
		}
		console.log(
			'fuck',
			newToppingCategoryListWithPricesofToppingCategories[i][
				`${Object.keys(newToppingCategoryListWithPricesofToppingCategories[0])[0]}`
			]
		);
		var proteinPrice =
			newToppingCategoryListWithPricesofToppingCategories[0][
				`${Object.keys(newToppingCategoryListWithPricesofToppingCategories[0])[0]}`
			];
		console.log('formattedOtherToppings', formattedOtherToppings);
		$('#modalBody1').append(`<div class="container" id="container1"></div>`);
		$('#container1').append(`<div class="row" style= "margin-bottom: 40px;" id="row0"></div>`);
		$('#row0')
			.append(`<div class="col-9" style="margin-right: 0px;" id="col0"><h5>${formattedOtherToppings[0]} Crepe</h5>
        </div>`);
		$(`<div class="col-3" style="" id="col1"><h4 >$${proteinPrice.toFixed(2)}</h4></div>`).insertAfter($('#col0'));
		var colIndex1 = 0;
		var colIndex2 = 1;
		var lastRow = formattedOtherToppings.length - 1;
		var orderPrice = proteinPrice;
		console.log(proteinPrice);
		for (var i = 1; i < formattedOtherToppings.length; i++) {
			newRowIndex = i;
			colIndex1 += 2;
			colIndex2 += 2;
			var toppingPrice =
				newToppingCategoryListWithPricesofToppingCategories[i][
					`${Object.keys(newToppingCategoryListWithPricesofToppingCategories[i])[0]}`
				];
			orderPrice += toppingPrice;
			$(
				`<div class="row" style="margin-top: 20px; margin-bottom: 40px" id="row${newRowIndex}"></div>`
			).insertAfter(`#row${i - 1}`);
			$(`#row${newRowIndex}`).append(`<div class="col-9" style="margin-right: 0px;" id="col${colIndex1}"></div>`);
			$(`#col${colIndex1}`).append(`<h5>${formattedOtherToppings[i]}</h5>`);

			$(`#row${newRowIndex}`).append(`<div class="col-3" id="col${colIndex2}" style="margin-left: 0px;"></div>`);
			$(`#col${colIndex2}`).append(`<h4>$${toppingPrice.toFixed(2)}</h4>`);
		}
		$(`<div class="modal-footer" id="row${lastRow + 1}"></div>`).insertAfter(`#modalBody1`);

		$(`#row${lastRow + 1}`).append(`<div class="col-8" id="col${
			colIndex2 + 1
		}"><h3 style="font-weight: bold;">Order Total</h3>
		</div>`);
		$(`#row${lastRow + 1}`).append(`<div class="col-3" style="margin-left: 21px" id="col${
			colIndex2 + 2
		}"><h3 style="float:right; font-weight: bold;">$${orderPrice.toFixed(2)}</h3>
		</div>`);
		$(`<div class="grid-container" id="buttoncontainer1" style="margin-top: 20px; align-content:space-evenly;   grid-template-columns: auto auto auto;
            grid-gap: 5px; display:grid;"></div>`).insertAfter($('#container1'));
		$('#buttoncontainer1').append(
			`<div id="col5"><h6 style=" margin-left:75px;text-decoration:underline"><a href="copyItem()">duplicate</a></h6></div>`
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

$(window).on('load', function () {
	console.log('order1', localStorage.getItem('order'));
	doShowAll();
	$('#shoppingCart').modal('show');
});
