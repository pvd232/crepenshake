// Example starter JavaScript for disabling form submissions if there are invalid fields
//https://www.codeply.com/p?starter=Bootstrap&ex=Sh3KmpOVTc

(function () {
	//https://www.tutorialspoint.com/Why-are-parenthesis-used-to-wrap-a-JavaScript-function-call#:~:text=In%20JavaScript%2C%20the%20functions%20wrapped,decrease%20clashing%20with%20other%20libraries.
	('use strict');

	window.addEventListener(
		'load',
		function () {
			const forms = document.getElementsByClassName('needs-validation');

			// Loop over them and prevent submission
			Array.prototype.filter.call(forms, function (form) {
				console.log('form', form);
				//https://gomakethings.com/what-the-hell-is-the-call-method-and-when-should-you-use-it/
				form.addEventListener(
					'submit',
					function (event) {
						if (form.checkValidity() === false) {
							console.log('wppp');
							event.preventDefault();
							event.stopPropagation();
							form.classList.add('was-validated');
						} else {
							event.preventDefault();
							console.log('wee', form);
							handleFormSubmit();
						}
					},
					false
				);
			});
		},
		false
	);
})();

function handleFormSubmit() {
	console.log('handled');
	const responseDict = {};
	const customerDataDict = {};
	$('input, select', $('#checkoutForm')).each(function () {
		console.log('thisVal', $(this).val());
		console.log('thisKey', $(this).attr('id'));
		console.log('thisSer', $(this).serialize());

		if ($(this).serialize() == 'paymentMethod=on') {
			customerDataDict['paymentMethod'] = $(this).attr('id');
		} else if ($(this).val() != '' && $(this).val() != 'on') {
			customerDataDict[$(this).attr('id')] = $(this).val();
		}
	});

	responseDict['customerData'] = customerDataDict;
	responseDict['orderTotal'] = orderTotal;
	const orderCrepeArray = [];
	// unpack orders from local storage into jsonData
	for (var i = 0; i < localStorage.length; i++) {
		const order = {};
		const key = localStorage.key(i);
		order[key] = JSON.parse(localStorage.getItem(key));
		console.log('order', order);
		orderCrepeArray.push(order);
	}

	responseDict['orderCrepe'] = orderCrepeArray;
	const jsonValue = JSON.stringify(responseDict);
	console.log('jsonValue', jsonValue);
	console.log('responseDict', responseDict);

	$.ajax({
		url: '/checkout',
		data: jsonValue,
		dataType: 'json',
		type: 'POST',
		contentType: 'application/json',
		success: location.assign('/order-confirmation'),

		error: (response) => console.log('console.log error', response),
	});
}
var orderTotal = 0;
$(window).on('load', function () {
	var orderPrice = 0;
	key = localStorage.key(0);
	const orderDict = JSON.parse(localStorage.getItem(key));
	console.log('check orderDict', orderDict);
	if (orderDict) {
		if ('orderCrepe' in orderDict) {
			const orderCrepes = orderDict['orderCrepe'];
			for (var j = 0; j <= orderCrepes.length - 1; j++) {
				// the crepe is an object with the higher level crepe properties like the crepe price and type of crepe as keys
				// the crepe is inside an object whose only key is "ordercrepes" and whose value is a list of different orders of crepes. for custom crepes there will only be one crepe in the list
				const crepes = orderCrepes[j]['crepes'];
				console.log('crepes: %s', crepes);
				for (key in crepes) {
					console.log('key: %s', key);
					console.log('crepes key: %s', crepes[key]);
				}
				$(`#checkingCartBody0`).append(
					`<li class="list-group-item d-flex justify-content-between lh-condensed" style="border-top: 0px solid white;" id="flexRow${j}"></li>`
				);
				$(`#flexRow${j}`).append(`<div id=""><h4>Crepe #${j + 1}</h4></div>`);
				for (var i = 0; i < crepes.length; i++) {
					const crepe = crepes[i];
					console.log('crepe: %s', crepe);

					if (crepe['customCrepe'] && crepe['flavorProfile'] === 'savory') {
						//https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
						var formattedOtherToppings = [];
						const customCrepeIngredients = crepe['ingredients'];
						console.log('customCrepeIngredients', customCrepeIngredients);
						for (var key in customCrepeIngredients) {
							console.log('key', key);
							const topping = customCrepeIngredients[key];
							console.log('topping', topping);
							if (topping != '' && topping != []) {
								console.log('topping', topping);
								const formatDict = {};
								if (key != 'protein') {
									var format = '';
									for (var i = 0; i < topping.length; i++) {
										var toppingName = topping[i]['name'];
										console.log('toppingName: %s', toppingName);

										var toppingQuantity = topping[i]['servingSize'];
										console.log('toppingQuantity: %s', toppingQuantity);

										if (toppingName) {
											toppingQuantity = capitalize(toppingQuantity);
											if (toppingQuantity != 'Regular') {
												format += toppingQuantity;
												format += ' ';
											}
											toppingName = splitCamelCaseToString(toppingName);
											format += toppingName;
											if (i != topping.length - 2) {
												format += ' and ';
											}
										} else {
											formatDict['price'] = topping[i]['price'];
										}
									}

									formatDict['format'] = format;
									formattedOtherToppings.push(formatDict);
								} else {
									const protein = customCrepeIngredients[key];
									console.log('protein', protein);
									var formattedProtein = '';
									for (var i = 0; i < protein.length; i++) {
										var proteinName = protein[i]['name'];
										var proteinQuantity = protein[i]['servingSize'];
										if (proteinName) {
											console.log('pq', proteinQuantity);
											console.log('pn', proteinName);
											proteinName = splitCamelCaseToString(proteinName);
											proteinQuantity = capitalize(proteinQuantity);
											if (proteinQuantity != 'Regular') {
												formattedProtein += proteinQuantity;
												formattedProtein += ' ';
											}

											formattedProtein += proteinName;
											console.log('protein', protein);
											formattedProtein += ' and ';
										} else {
											formatDict['price'] = protein[i]['price'];
										}
									}
									console.log('formattedProtein1: %s', formattedProtein);

									formattedProtein = Array.from(formattedProtein).splice(
										0,
										formattedProtein.length - 5
									);
									formattedProtein = formattedProtein.join('');
									console.log('formattedProtein2: %s', formattedProtein);

									formatDict['format'] = formattedProtein;
									formattedOtherToppings.unshift(formatDict);
								}
							}
						}

						var subtotal = 0;
						// insert the row and child header with the crepe number
						console.log('formattedOtherToppings', formattedOtherToppings);

						for (var i = 0; i < formattedOtherToppings.length; i++) {
							const toppingPrice = parseFloat(formattedOtherToppings[i]['price']);

							subtotal += toppingPrice;
							$(
								`<li class="list-group-item d-flex justify-content-between lh-condensed" id="flexRow${j}${
									i + 1
								}"><div class="col-9" style="margin-right: 0px; " id="col${j}${i}"><h5 style=''>
								${formattedOtherToppings[i]['format']}</h5>
									</div><div class="col-3" style=""id="col${j}${i + 2}"><h4 style=''>$${formattedOtherToppings[i]['price'].toFixed(
									2
								)}</h4></div></li>`
							).insertAfter(`#flexRow${j}`);
						} // end of the loop iterating through the toppings in the crepe

						// the i iterator ends with an id of k, i+1 so this must be formattedOtherToppings.length not formattedothertoppings.length -1
						// insert the subtotal after completing the insertion of the toppings

						if (subtotal) {
							orderPrice += subtotal;
						}
						console.log('orderPrice: %s', orderPrice);
					} // end of if block that corrals custom crepe
				}
			}
		}
	}
});

//because the crepes are being prepended their order is reversed, so this switches the order of iteration through the crepes to put them back in order

// $(
// 	`<li class="list-group-item d-flex justify-content-between lh-condensed" id="flexRow${j}0"></li>`
// ).insertAfter(`#flexRow${j}-1`);
// if (j == 0) {
// 	lastRowIndex = checkoutCartLength + 1;
// }
// for (var i = 0; i < checkoutCartLength + 1; i++) {
// 	// index is longer than format toppings so we have to get the price inside the if blocks
// 	if (i == checkoutCartLength) {
// 		// add total price at the end

// 		$(`#flexRow${j}${i}`).append(
// 			`<h5 style="color: black; font-weight:bold;" id="span${j}${i}">Subtotal (USD)</h5>`
// 		);
// 		$(`<h5 style="font-weight:bold; color:black;">$${subtotal.toFixed(2)}</h5>`).insertAfter(
// 			`#span${j}${i}`
// 		);
// 		$(
// 			`<li class="list-group-item d-flex justify-content-between lh-condensed" style="border-top: 5px solid red" id="flexRow${j}${
// 				i + 1
// 			}"></li>`
// 		).insertAfter(`#flexRow${j}${i}`);
// else if (!crepe['customCrepe']) {
// 	const crepeName = splitCamelCaseToString(crepe['name']);
// 	console.log('crepe: %s', crepe);
// 	const crepeQuantity = crepe['quantity'];
// 	console.log('crepeName', crepeName);
// 	const crepePrice = crepe['price'];
// 	if (crepePrice) {
// 		orderPrice += crepePrice;
// 	}
// 	$(`<div class="row" name="menu" style= "margin-bottom: 20px;" id="crepeRow${k}${i + 1}">
// 			<div class="col-9" style="margin-right: 0px; " id="crepeCol${k}${i}">
// 				<h5 style=''>${crepeQuantity + 'x' + ' ' + crepeName}</h5>
// 			</div>
// 			<div class="col-3" style=""id="crepeCol${k}${i + 2}">
// 				<h4 style=''>$${crepePrice.toFixed(2)}</h4>
// 			</div>
// 			</div>`).insertAfter(`#row${k}${i}`);

// const itemIndex =
// 	$(`#container${k}`)
// 		.find('.row')
// 		.first()
// 		.text()
// 		.replace('Order ', '')
// 		.replace(' ', '-')
// 		.replace('#', '')
// 		.toLowerCase()
// 		.split('-')[1] - 1;
// console.log('itemIndex: %s', itemIndex);
// 		} else if (crepe['customCrepe'] && crepe['flavorProfile'] === 'sweet') {
// 			const customCrepeIngredients = crepe['ingredients'];
// 			console.log('customCrepeIngredients', customCrepeIngredients);
// 			var sweetCrepeSubtotal = 0;
// 			var z = 0;

// 			for (var key in customCrepeIngredients) {
// 				console.log('key', key);
// 				const toppingArray = customCrepeIngredients[key];
// 				if (toppingArray != '' && toppingArray != []) {
// 					for (var j = 0; j < toppingArray.length; j++) {
// 						z += 1;
// 						const topping = toppingArray[j];
// 						console.log('topping', topping);
// 						const toppingName = topping['name'];
// 						const toppingCost = topping['cost'];
// 						const toppingQuantity = topping['quantity'];
// 						sweetCrepeSubtotal += toppingCost;
// 						const lastElementId = $('#modalBody1').find('.row').last().attr('id');
// 						$(`<div class="row" name="sweet" style= "margin-bottom: 20px;" id="sweetRow${j}${
// 							z + 1
// 						}">
// 								<div class="col-9" style="margin-right: 0px; " id="sweetCrepeCol${j}${z}">
// 									<h5 style=''>${toppingQuantity + 'x' + ' ' + toppingName}</h5>
// 								</div>
// 								<div class="col-3" style="" id="sweetCrepeCol${j}${z + 2}">
// 									<h4 style=''>$${toppingCost.toFixed(2)}</h4>
// 								</div>
// 								</div>`).insertAfter(`#${lastElementId}`);

// 						const itemIndex =
// 							$(`#container${k}`)
// 								.find('.row')
// 								.first()
// 								.text()
// 								.replace('Order ', '')
// 								.replace(' ', '-')
// 								.replace('#', '')
// 								.toLowerCase()
// 								.split('-')[1] - 1;
// 						console.log('itemIndex: %s', itemIndex);
// 					}
// 				}
// 			}
// 			const lastElementId = $('#modalBody1').find('.row').last().attr('id');
// 			console.log('lastElementId: %s', lastElementId);

// 			$(
// 				`<div class="row"
// 					style="margin-top: 20px; margin-bottom: 20px; margin-top: 20px; border-top: 1px solid black" id=""><div class="col-9" id="0col23" style="margin-left: 0px;"><h5 style="font-weight: 700" ;="">Crepe #${
// 						k + 1
// 					} Total</h5></div><div class="col-3" id="0col22" style="margin-left: 0px;"><h4 style="font-weight: 700;">$${sweetCrepeSubtotal.toFixed(
// 					2
// 				)}</h4></div></div>`
// 			).insertAfter($(`#${lastElementId}`));
// 			if (subtotal) {
// 				orderPrice += sweetCrepeSubtotal;
// 			}
// 		}
// 	} // end of the loop iterating through crepes in the order
// 	const itemIndex =
// 		$(`#container${k}`)
// 			.find('.row')
// 			.first()
// 			.text()
// 			.replace('Order ', '')
// 			.replace(' ', '-')
// 			.replace('#', '')
// 			.toLowerCase()
// 			.split('-')[1] - 1;
// 	var crepeURL;
// 	var crepeProfile = $(`#container${k}`).find('.row').first().next().attr('name');
// 	if (crepeProfile === 'menu') {
// 		crepeURL = 'menu-crepe';
// 	} else {
// 		crepeURL = 'make-your-own-' + crepeProfile + '-crepe';
// 	}
// 	console.log('crepeProfile: %s', crepeProfile);

// 	console.log('itemIndex: %s', itemIndex);
// 	$(`<div class="grid-container" id="menubuttoncontainer${k}" style="margin-top: 30px; margin-bottom:40px; align-content:space-evenly; grid-template-columns: auto auto auto;
// 				grid-gap: 5px; display:grid;"></div>`).insertAfter($(`#container${k}`));
// 	$(`#menubuttoncontainer${k}`).append(
// 		`<div id="col5"><button class="btn" onclick="modifyItem('${itemIndex}', 'crepe', 'copy')" style="margin-left:40px;">Duplicate</button></div>`
// 	);
// 	// pass in the item that is being modified to the make your own crepe page
// 	$(`#menubuttoncontainer${k}`).append(
// 		`<div  id="col6" ><button class= "btn" style="margin-top:.5px;" onclick="location.assign('/order/${crepeURL}?editOrder=${itemIndex}')">Edit</button></div>`
// 	);
// 	$(`#menubuttoncontainer${k}`).append(
// 		`<div id="col5"><button class="btn" onclick="modifyItem('${itemIndex}', 'crepe', 'remove')" >Remove</button></div>`
// 	);
// }
// } // end of for loop confirming orderCrepe existence
// if ('orderDrink' in orderDict) {
// 	if ($('#modalBody1').children.length > 0) {
// 		// format the drink list

// 		const orderDrinks = orderDict['orderDrink'];
// 		console.log('orderDrinks Lookng for milk: %s', orderDrinks);

// 		for (var k = 0; k <= orderDrinks.length - 1; k++) {
// 			// for each drink order, tracked by the index number k, i will add a new container with a row appended to it that lists the drink order # k

// 			var drinkSubTotal = 0;

// 			$('#modalBody1').append(
// 				`<div class="container" id="drinkContainer${k}"><div class="row" style= "border-bottom: 1px solid black; margin-bottom:20px;" id="drinkRow${k}0"><h5 style='font-weight: 700; '>Drink Order #${
// 					k + 1
// 				}</h5></div></div>`
// 			);
// 			const drinks = orderDrinks[k]['drinks'];
// 			console.log('drinks milk: %s', drinks);

// 			for (var key in drinks) {
// 				console.log('key milk: %s', key);

// 				const drinksInDrinkCategory = drinks[key];
// 				for (var i = 0; i < drinksInDrinkCategory.length; i++) {
// 					const drink = drinksInDrinkCategory[i];
// 					const drinkName = splitCamelCaseToString(drink['name']);

// 					console.log('drink: %s', drink);

// 					const drinkQuantity = drink['quantity'];
// 					console.log('drinkName', drinkName);
// 					const drinkPrice = drink['price'];
// 					drinkSubTotal += drinkPrice;
// 					for (var key in drink) {
// 						console.log('key plz', key);
// 					}
// 					console.log('drinkPrice: %s', drinkPrice);

// 					if ('milk' in drink) {
// 						const milk = drink['milk'];
// 						const milkPrice = milk['price'];

// 						const milkName = splitCamelCaseToString(milk['name']);
// 						const espresso = drink['espresso'];
// 						const espressoPrice = espresso['price'];
// 						const espressFormat = espresso['quantity'] + 'x Espresso Shot';
// 						$(`<div class="row" style= "margin-bottom: 20px;">
// 								<div class="col-9" style="margin-right: 0px; " >
// 									<h5 style=''>${drinkQuantity + ' ' + drinkName}</h5>
// 								</div>
// 								<div class="col-3">
// 									<h4 style=''>$${drinkPrice.toFixed(2)}</h4>
// 								</div>
// 								</div>
// 								<div class="row" style= "margin-bottom: 20px;">
// 								<div class="col-9" style="margin-right: 0px; " >
// 									<h5 style=''>${espressFormat}</h5>
// 								</div>
// 								<div class="col-3" style="">
// 									<h4 style=''>$${espressoPrice}</h4>
// 								</div></div>
// 								<div class="row" style= "margin-bottom: 20px;" id="drinkRow${k}${i + 1}">
// 								<div class="col-9" style="margin-right: 0px; " id="drinkCol${k}${i}">
// 									<h5 style=''>${milkName}</h5>
// 								</div>
// 								<div class="col-3" style=""id="drinkCol${k}${i + 2}">
// 									<h4 style=''>$${milkPrice}</h4>
// 								</div>
// 								</div>`).insertAfter(`#drinkRow${k}${i}`);
// 						drinkSubTotal += parseFloat(milkPrice);
// 						drinkSubTotal += parseFloat(espressoPrice);
// 					} // coffee block
// 					else {
// 						if (drinkQuantity > 1) {
// 							// add an "s" to the title
// 							$(`<div class="row" style= "margin-bottom: 20px;" id="drinkRow${k}${i + 1}">
// 									<div class="col-9" style="margin-right: 0px; " id="drinkCol${k}${i}">
// 										<h5 style=''>${drinkQuantity + ' ' + drinkName + 's'}</h5>
// 									</div>
// 									<div class="col-3" style=""id="drinkCol${k}${i + 2}">
// 										<h4 style=''>$${drinkPrice.toFixed(2)}</h4>
// 									</div>
// 									</div>`).insertAfter(`#drinkRow${k}${i}`);
// 						} else {
// 							$(`<div class="row" style= "margin-bottom: 20px;" id="drinkRow${k}${i + 1}">
// 									<div class="col-9" style="margin-right: 0px; " id="drinkCol${k}${i}">
// 										<h5 style=''>${drinkQuantity + ' ' + drinkName}</h5>
// 									</div>
// 									<div class="col-3" style=""id="drinkCol${k}${i + 2}">
// 										<h4 style=''>$${drinkPrice.toFixed(2)}</h4>
// 									</div>
// 									</div>`).insertAfter(`#drinkRow${k}${i}`);
// 						}
// 					} // end of non-coffee drinks else block
// 				} // end of for loop iterating through list of drink dictionaries in drink category
// 			} // end of loop itering through drink category key values

// 			const drinkItemIndex =
// 				$(`#drinkContainer${k}`)
// 					.find('.row')
// 					.first()
// 					.text()
// 					.replace('Order ', '')
// 					.replace(' ', '-')
// 					.replace('#', '')
// 					.toLowerCase()
// 					.split('-')[1] - 1;
// 			console.log('drinkItemIndex: %s', drinkItemIndex);

// 			$(`<div class="grid-container" id="drinkButtonContainer${k}" style="margin-top: 30px; margin-bottom:40px; align-content:space-evenly; grid-template-columns: auto auto auto;
//     				grid-gap: 5px; display:grid;"></div>`).insertAfter($(`#drinkContainer${k}`));
// 			$(`#drinkButtonContainer${k}`).append(
// 				`<div id="col5"><button class="btn" onclick="modifyItem('${drinkItemIndex}', 'drink', 'copy')" style="margin-left:40px;">Duplicate</button></div>`
// 			);
// 			// pass in the item that is being modified to the make your own crepe page
// 			$(`#drinkButtonContainer${k}`).append(
// 				`<div  id="col6" ><button class= "btn" style="margin-top:.5px;" onclick="location.assign('/order/drink?editOrder=${drinkItemIndex}')">Edit</button></div>`
// 			);
// 			$(`#drinkButtonContainer${k}`).append(
// 				`<div id="col5"><button class="btn" onclick="modifyItem('${drinkItemIndex}', 'drink', 'remove')" >Remove</button></div>`
// 			);
// 			if (drinkSubTotal) {
// 				orderPrice += drinkSubTotal;
// 			}
// 		} // end of for loop iterating through drink list
// 		console.log('drinkSubTotal', drinkSubTotal);
// 	}
// 	console.log('orderPriceDrink: %s', orderPrice);

// 	console.log('orderPriceDrink: %s', orderPrice);
// }

// if ('orderSide' in orderDict) {
// 	if ($('#modalBody1').children.length > 0) {
// 		// format the drink list

// 		const orderSide = orderDict['orderSide'];

// 		for (var k = 0; k < orderSide.length; k++) {
// 			// const lastElementId = $('#modalBody1').children().last().attr('id');
// 			//https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
// 			$('#modalBody1').append(
// 				`<div class="container" id="sideContainer${k}"><div class="row" style= "border-bottom: 1px solid black; margin-bottom:20px;" id="sideRow${k}0"><h5 style='font-weight: 700; '>Side Order #${
// 					k + 1
// 				}</h5></div></div>`
// 			);
// 			const sides = orderSide[k]['sides'];
// 			var sideSubTotal = 0;
// 			for (var key in sides) {
// 				console.log('sideSubTotal: %s', sideSubTotal);

// 				// if (key != 'sideTotal') {
// 				console.log('key', key);
// 				const sidesInSideCategory = sides[key];
// 				console.log('sidesInSideCategory: %s', sidesInSideCategory);

// 				if (sidesInSideCategory != '') {
// 					console.log('sidesInSideCategory', sidesInSideCategory);
// 					for (var i = 0; i < sidesInSideCategory.length; i++) {
// 						var side = sidesInSideCategory[i];
// 						console.log('side: %s', side);
// 						var sideName = splitCamelCaseToString(side['name']);
// 						console.log('sideName', sideName);
// 						const sideQuantity = side['quantity'];
// 						console.log('sideQuantity: %s', sideQuantity);
// 						var sidePrice = parseFloat(side['price']);

// 						$(`<div class="row" style= "margin-bottom: 20px;" id="sideRow${k}${i + 1}">
// 								<div class="col-9" style="margin-right: 0px; " id="sideCol${k}${i}">
// 									<h5 style=''>${sideName}</h5>
// 								</div>
// 								<div class="col-3" style=""id="sideCol${k}${i + 2}">
// 									<h4 style=''>$${sidePrice}</h4>
// 								</div>
// 								</div>`).insertAfter(`#sideRow${k}${i}`);
// 						console.log('sideSubTotal: %s', sideSubTotal);

// 						// i will add the side with the side price regardless of whether there are toppings that go after it, thus i check for the existence of the toppings array afer
// 						if ('toppings' in side) {
// 							const arrayOfToppingDictionaries = side['toppings'];
// 							console.log('arrayOfToppingDictionaries: %s', arrayOfToppingDictionaries);
// 							console.log('sideSubTotal: %s', sideSubTotal);

// 							for (var j = 0; j < arrayOfToppingDictionaries.length; j++) {
// 								const toppingDictionary = arrayOfToppingDictionaries[j];
// 								console.log('toppingDictionary: %s', toppingDictionary);

// 								const toppingServingSize = splitCamelCaseToString(
// 									toppingDictionary['servingSize']
// 								);
// 								console.log('sideSubTotal: %s', sideSubTotal);

// 								const toppingName = splitCamelCaseToString(toppingDictionary['name']);
// 								const toppingPrice = toppingDictionary['price'];
// 								console.log('toppingPrice: %s', toppingPrice);

// 								sideSubTotal += toppingPrice;
// 								var toppingFormat = '';
// 								if (toppingServingSize === 'Extra') {
// 									const newToppingServingSize = 'Double';
// 									toppingFormat += newToppingServingSize;
// 								} else {
// 									toppingFormat += toppingServingSize;
// 								}
// 								toppingFormat += ' ';
// 								toppingFormat += toppingName;

// 								$(`<div class="row" style= "margin-bottom: 20px;">
// 									<div class="col-9" style="margin-right: 0px; " id="toppingCol${k}${j}">
// 										<h5 style=''>${toppingFormat}</h5>
// 									</div>
// 									<div class="col-3" style=""id="toppingCol${k}${j + 2}">
// 										<h4 style=''>$${toppingPrice.toFixed(2)}</h4>
// 									</div>
// 									</div>`).insertAfter($(`#sideRow${k}${i + 1}`));
// 							}
// 						}
// 					} // end of for loop iterating through side list
// 					// const lastElementId = $('#modalBody1').find('.container').last().attr('id');
// 					console.log('sideSubTotal', sideSubTotal);
// 				} // end of for loop iterating through sides in side order
// 				console.log('sideSubTotal: %s', sideSubTotal);
// 			}
// 			// console.log('orderPriceSide: %s', orderPrice);
// 			// console.log('sideSubTotal: %s', sideSubTotal);
// 			// if (sideSubTotal) {
// 			// 	orderPrice += sideSubTotal;
// 			// }
// 			// console.log('orderPriceSide: %s', orderPrice);

// 			// const sideItemIndex =
// 			// 	$(`#sideContainer${k}`)
// 			// 		.find('.row')
// 			// 		.first()
// 			// 		.text()
// 			// 		.replace('Order ', '')
// 			// 		.replace(' ', '-')
// 			// 		.replace('#', '')
// 			// 		.toLowerCase()
// 			// 		.split('-')[1] - 1;
// 			// console.log('sideItemIndex: %s', sideItemIndex);

// 		}
// 	}
// }
// }

// $(`<div class="modal-footer" id="footer"></div>`).insertAfter(`#modalBody1`);

// $(`#footer`).append(`<div class="col-8" id="footerCol0"><h3 style="font-weight: bold;">Order Total</h3>
// 	</div>`);
// $(`#footer`)
// 	.append(`<div class="col-3" style="margin-left: 21px; " id="footerCol1"><h3 style="float:right; font-weight: bold; ">$${orderPrice.toFixed(
// 	2
// )}</h3>
// 	</div>`);
// for (var j = 0; j < localStorage.length; j++) {
// 	const stringifiedDataObject = localStorage.getItem(`order${localStorage.length - 1 - j}`);
// 	console.log('StringifiedDataObject', stringifiedDataObject);
// 	const customCrepeProps = JSON.parse(stringifiedDataObject);
// 	const customCrepeIngredients = customCrepeProps['ingredients'];
// 	console.log('customCrepeIngredients', customCrepeIngredients);
// 	//https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
// 	var formattedOtherToppings = [];
// 	for (var key in customCrepeIngredients) {
// 		if (key != 'orderTotal' && key != 'flavorProfile') {
// 			const topping = customCrepeIngredients[key];
// 			if (topping != '') {
// 				console.log('topping', topping);
// 				const formatDict = {};
// 				if (key != 'protein') {
// 					var format = '';
// 					for (var i = 0; i < topping.length; i++) {
// 						var toppingName = Object.keys(topping[i])[0];
// 						var toppingQuantity = topping[i][toppingName];
// 						if (toppingName != 'price') {
// 							toppingQuantity = capitalize(toppingQuantity);
// 							toppingName = splitCamelCaseToString(toppingName);
// 							format += toppingQuantity;
// 							format += ' ';
// 							format += toppingName;
// 							// there is an extra topping called price
// 							if (i != topping.length - 2) {
// 								format += ' and ';
// 							}
// 						} else {
// 							formatDict['price'] = toppingQuantity;
// 						}
// 					}

// 					formatDict['format'] = format;
// 					formattedOtherToppings.push(formatDict);
// 				} else {
// 					const protein = customCrepeIngredients[key];
// 					console.log('protein', protein);
// 					//if (protein.length > 1) {
// 					var formattedProtein = '';
// 					for (var i = 0; i < protein.length; i++) {
// 						var proteinName = Object.keys(protein[i])[0];
// 						var proteinQuantity = protein[i][proteinName];
// 						if (proteinName != 'price') {
// 							console.log('pq', proteinQuantity);
// 							console.log('pn', proteinName);
// 							proteinName = splitCamelCaseToString(proteinName);
// 							proteinQuantity = capitalize(proteinQuantity);
// 							formattedProtein += proteinQuantity;
// 							formattedProtein += ' ';
// 							formattedProtein += proteinName;
// 							// there is an extra topping called price
// 							if (i != protein.length - 2) {
// 								formattedProtein += ' and ';
// 							}
// 						} else {
// 							formatDict['price'] = proteinQuantity;
// 						}
// 					}

// 					formatDict['format'] = formattedProtein;
// 					formattedOtherToppings.unshift(formatDict);
// 				}
// 			}
// 		}
// 	}

// 	console.log('formattedOtherToppings', formattedOtherToppings);
// 	const checkoutCartLength = formattedOtherToppings.length;
// 	console.log('len', formattedOtherToppings.length);
// 	console.log('o', customCrepeIngredients);
// 	var subtotal = 0;
// 	// have to prepend here (insert item as first child of card body) because don't want to interfere with other items in the card body
// 		$(`#checkingCartBody0`).prepend(
// 			`<li class="list-group-item d-flex justify-content-between lh-condensed" style="border-top: 0px solid white;" id="flexRow${j}-1"></li>`
// 		);

// 		//because the crepes are being prepended their order is reversed, so this switches the order of iteration through the crepes to put them back in order
// 		$(`#flexRow${j}-1`).append(`<div id=""><h4>Crepe #${localStorage.length - j}</h4></div>`);

// 		$(
// 			`<li class="list-group-item d-flex justify-content-between lh-condensed" id="flexRow${j}0"></li>`
// 		).insertAfter(`#flexRow${j}-1`);
// 		if (j == 0) {
// 			lastRowIndex = checkoutCartLength + 1;
// 		}
// 		for (var i = 0; i < checkoutCartLength + 1; i++) {
// 			// index is longer than format toppings so we have to get the price inside the if blocks
// 			if (i == checkoutCartLength) {
// 				// add total price at the end

// 				$(`#flexRow${j}${i}`).append(
// 					`<h5 style="color: black; font-weight:bold;" id="span${j}${i}">Subtotal (USD)</h5>`
// 				);
// 				$(`<h5 style="font-weight:bold; color:black;">$${subtotal.toFixed(2)}</h5>`).insertAfter(
// 					`#span${j}${i}`
// 				);
// 				$(
// 					`<li class="list-group-item d-flex justify-content-between lh-condensed" style="border-top: 5px solid red" id="flexRow${j}${
// 						i + 1
// 					}"></li>`
// 				).insertAfter(`#flexRow${j}${i}`);
// 			} else if (i == checkoutCartLength - 1) {
// 				// if at the last row item add the list group item that doesn't have lh-condensed
// 				console.log('close');
// 				const price = formattedOtherToppings[i]['price'];
// 				subtotal += price;

// 				$(`#flexRow${j}${i}`).append(`<div id="div${j}${i}" ></div>`);
// 				$(`#div${j}${i}`).append(
// 					`<h6 class="my-0" id="h6${j}${i}">${formattedOtherToppings[i]['format']}</h6>`
// 				);
// 				$(`<h4 id="h4${j}${i}">${price.toFixed(2)}</h4>`).insertAfter($(`#div${j}${i}`));

// 				$(
// 					`<li class="list-group-item d-flex justify-content-between" id="flexRow${j}${i + 1}"></li>`
// 				).insertAfter($(`#flexRow${j}${i}`));
// 			} else {
// 				const price = formattedOtherToppings[i]['price'];
// 				subtotal += price;

// 				$(`#flexRow${j}${i}`).append(`<div id="div${j}${i}" ></div>`);
// 				$(`#div${j}${i}`).append(
// 					`<h6 class="my-0" id="h6${j}${i}">${formattedOtherToppings[i]['format'].replace(
// 						'Regular ',
// 						''
// 					)}</h6>`
// 				);
// 				$(`<h4 id="h4${j}${i}">${price.toFixed(2)}</h4>`).insertAfter($(`#div${j}${i}`));

// 				$(
// 					`<li class="list-group-item d-flex justify-content-between lh-condensed" id="flexRow${j}${
// 						i + 1
// 					}"></li>`
// 				).insertAfter($(`#flexRow${j}${i}`));
// 			}
// 		}
// 		orderTotal += subtotal;
// 	}

// 	$(`<li class="list-group-item d-flex justify-content-between lh-condensed" style="border-top: 0px solid white"><h4 style="color: black; font-weight:bold;">Order Total (USD)</h4>
// 							<h4 style="font-weight:bold; color:black;">$${orderTotal.toFixed(2)}</h4>
// 			</li>`).insertAfter($(`#flexRow0${lastRowIndex}`));
// 	$(`#flexRow${localStorage.length - 1}-1`).css('border-top', '');

// 	x = document.getElementsByClassName('badge badge-secondary badge-pill')[0].setAttribute('id', 'foo');
// 	$('#foo').html(`${localStorage.length}`);
// });
