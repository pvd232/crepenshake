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
	const order = JSON.parse(localStorage.getItem(localStorage.key(0)));
	order['customerData'] = customerDataDict;
	// const orderCrepeArray = [];
	// unpack orders from local storage into jsonData
	// for (var i = 0; i < localStorage.length; i++) {
	// 	const order = {};
	// 	const key = localStorage.key(i);
	// 	order[key] = JSON.parse(localStorage.getItem(key));
	// 	console.log('order', order);
	// 	orderCrepeArray.push(order);
	// }

	responseDict['order'] = order;
	const jsonValue = JSON.stringify(responseDict);
	console.log('jsonValue', jsonValue);
	console.log('responseDict', responseDict);

	$.ajax({
		url: '/checkout',
		data: jsonValue,
		dataType: 'json',
		type: 'POST',
		contentType: 'application/json',
		success: (response) => console.log(response),

		error: (response) => console.log('console.log error', response),
	});
}
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
$(window).on('load', function () {
	var orderTotal = 0;
	key = localStorage.key(0);
	const orderDict = JSON.parse(localStorage.getItem(key));
	console.log('check orderDict', orderDict);
	if (orderDict) {
		if ('orderCrepe' in orderDict) {
			const orderCrepes = orderDict['orderCrepe'];
			for (var k = 0; k <= orderCrepes.length - 1; k++) {
				// the crepe is an object with the higher level crepe properties like the crepe cost and type of crepe as keys
				// the crepe is inside an object whose only key is "ordercrepes" and whose value is a list of different orders of crepes. for custom crepes there will only be one crepe in the list
				const crepes = orderCrepes[k]['crepes'];
				console.log('crepes: %s', crepes);
				for (key in crepes) {
					console.log('key: %s', key);
					console.log('crepes key: %s', crepes[key]);
				}
				$(`#checkingCartBody0`).append(
					`<li class="list-group-item d-flex justify-content-between lh-condensed" " id="flexRow${k}0"></li>`
				);
				$(`#flexRow${k}${0}`).append(`<div id=""><h4 style="font-weight:bold;">Crepe #${k + 1}</h4></div>`);
				for (var i = 0; i < crepes.length; i++) {
					const crepe = crepes[i];
					console.log('crepe: %s', crepe);

					if (crepe['customCrepe'] && crepe['flavorProfile'] === 'savory') {
						//https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
						const formattedOtherToppings = [];
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
											formatDict['cost'] = topping[i]['price'];
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
											formatDict['cost'] = protein[i]['price'];
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

						// insert the row and child header with the crepe number
						console.log('formattedOtherToppings', formattedOtherToppings);

						for (var i = 0; i < formattedOtherToppings.length; i++) {
							const toppingCost = parseFloat(formattedOtherToppings[i]['cost']);
							orderTotal += toppingCost;
							$(
								`<li class="list-group-item d-flex justify-content-between lh-condensed" id="flexRow${k}${
									i + 1
								}"><div class="col-9" style="margin-right: 0px; " id="col${k}${i}"><h5 style=''>
								${formattedOtherToppings[i]['format']}</h5>
									</div><div class="col-3" style=""id="col${k}${i + 2}"><h4 style=''>$${toppingCost.toFixed(2)}</h4></div></li>`
							).insertAfter(`#flexRow${k}${i}`);
						} // end of the loop iterating through the toppings in the crepe

						// the i iterator ends with an id of k, i+1 so this must be formattedOtherToppings.length not formattedothertoppings.length -1
						// insert the subtotal after completing the insertion of the toppings
						lastElementId = $('#checkingCartBody0').find('li').last().attr('id');
						console.log('lastElementId: %s', lastElementId);

						// $(
						// 	`<div class="list-group-item d-flex justify-content-between lh-condensed"
						// 		style="" id=""><div class="col-9" id="0col23" style="margin-left: 0px;"><h5 style="font-weight: 700" ;="">Crepe #${
						// 			k + 1
						// 		} Total</h5></div><div class="col-3" id="0col22" style="margin-left: 0px;"><h4 style="font-weight: 700;">$${subtotal.toFixed(
						// 		2
						// 	)}</h4></div></div>`
						// ).insertAfter($(`#${lastElementId}`));
						console.log('orderTotal: %s', orderTotal);
					} // end of if block that corrals custom crepe
					else if (crepe['customCrepe'] && crepe['flavorProfile'] === 'sweet') {
						const customCrepeIngredients = crepe['ingredients'];
						console.log('customCrepeIngredients', customCrepeIngredients);
						var z = 0;
						console.log('z: %s', z);

						for (var key in customCrepeIngredients) {
							console.log('key', key);
							z += 1;
							console.log('z: %s', z);

							const toppingArray = customCrepeIngredients[key];
							console.log('toppingArray: %s', toppingArray);

							if (toppingArray != '' && toppingArray != []) {
								for (var j = 0; j < toppingArray.length; j++) {
									console.log('toppingArray.length: %s', toppingArray.length);

									console.log('j: %s', j);

									const topping = toppingArray[j];
									console.log('topping', topping);
									const toppingName = splitCamelCaseToString(topping['name']);
									const toppingCost = topping['cost'];
									const toppingQuantity = topping['quantity'];
									orderTotal += toppingCost;
									const lastElementId = $('#checkingCartBody0').find('li').last().attr('id');
									console.log('lastElementId: %s', lastElementId);

									$(
										`<li class="list-group-item d-flex justify-content-between lh-condensed" id="toppingRow${z}${j}"><div class="col-9" style="margin-right: 0px; " id="col${z}${j}"><h5 style=''>
													${toppingQuantity + 'x' + ' ' + toppingName}</h5>
														</div><div class="col-3" style=""id="col${z}${j + 2}"><h4 style=''>$${toppingCost.toFixed(2)}</h4></div></li>`
									).insertAfter(`#${lastElementId}`);
								}
							}
						}
						lastElementId = $('#checkingCartBody0').find('li').last().attr('id');
						console.log('lastElementId: %s', lastElementId);

						// $(
						// 	`<div class="list-group-item d-flex justify-content-between lh-condensed"
						// 		style="" id=""><div class="col-9" id="0col23" style="margin-left: 0px;"><h5 style="font-weight: 700;">Crepe #${
						// 			k + 1
						// 		} Total</h5></div><div class="col-3" id="0col22" style="margin-left: 0px;"><h4 style="font-weight: 700;">$${sweetCrepeSubtotal.toFixed(
						// 		2
						// 	)}</h4></div></div>`
						// ).insertAfter($(`#${lastElementId}`));
					}
				}
			}
		}
		if ('orderDrink' in orderDict) {
			if ($('#checkingCartBody0').children.length > 0) {
				// format the drink list

				const orderDrinks = orderDict['orderDrink'];
				console.log('orderDrinks Lookng for milk: %s', orderDrinks);

				for (var k = 0; k < orderDrinks.length; k++) {
					// for each drink order, tracked by the index number k, i will add a new container with a row appended to it that lists the drink order # k
					$(`#checkingCartBody0`).append(
						`<li class="list-group-item d-flex justify-content-between lh-condensed" " id="drinkRow${k}0"></li>`
					);
					$(`#drinkRow${k}${0}`).append(
						`<div id=""><h4 style="font-weight:bold;">Drink #${k + 1}</h4></div>`
					);
					const drinks = orderDrinks[k]['drinks'];
					console.log('drinks milk: %s', drinks);

					for (var key in drinks) {
						console.log('key milk: %s', key);

						const drinksInDrinkCategory = drinks[key];
						for (var i = 0; i < drinksInDrinkCategory.length; i++) {
							const drink = drinksInDrinkCategory[i];
							const drinkName = splitCamelCaseToString(drink['name']);

							console.log('drink: %s', drink);

							const drinkQuantity = drink['quantity'];
							console.log('drinkName', drinkName);

							const drinkPrice = drink['price'];
							orderTotal += drinkPrice;
							for (var key in drink) {
								console.log('key plz', key);
							}
							console.log('drinkPrice: %s', drinkPrice);

							if ('milk' in drink) {
								const milk = drink['milk'];
								const milkPrice = milk['price'];

								const milkName = splitCamelCaseToString(milk['name']);
								const espresso = drink['espresso'];
								const espressoPrice = espresso['price'];
								const espressFormat = espresso['quantity'] + 'x Espresso Shot';
								const lastElementId = $('#checkingCartBody0').find('li').last().attr('id');
								console.log('lastElementId: %s', lastElementId);

								$(
									`<li class="list-group-item d-flex justify-content-between lh-condensed" id="drinkRow${k}${i}"><div class="col-9" style="margin-right: 0px; " id="col${k}${i}"><h5 style=''>
													${drinkQuantity + 'x' + ' ' + drinkName}</h5>
														</div><div class="col-3" style=""id="col${k}${i + 2}"><h4 style=''>$${drinkPrice.toFixed(2)}</h4></div></li>
														<li class="list-group-item d-flex justify-content-between lh-condensed" id="drinkRow${k}${i}"><div class="col-9" style="margin-right: 0px; " id="col${k}${i}">
															<h5 style=''>${espressFormat}</h5>
														</div><div class="col-3" style=""id="col${k}${i + 2}"><h4 style=''>$${espressoPrice.toFixed(2)}</h4></div></li>
														<li class="list-group-item d-flex justify-content-between lh-condensed" id="drinkRow${k}${i}"><div class="col-9" style="margin-right: 0px; " id="col${k}${i}">
															<h5 style=''>${milkName}</h5>
														</div><div class="col-3" style=""id="col${k}${i + 2}"><h4 style=''>$${milkPrice.toFixed(2)}</h4></div></li>`
								).insertAfter(`#${lastElementId}`);
								orderTotal += parseFloat(milkPrice);
								orderTotal += parseFloat(espressoPrice);
							} // coffee block
							else {
								$(`<li class="list-group-item d-flex justify-content-between lh-condensed" id="drinkRow${k}${i}"><div class="col-9" style="margin-right: 0px; " id="col${k}${i}"><h5 style=''>
													${drinkQuantity + 'x' + ' ' + drinkName}</h5>
														</div><div class="col-3" style=""id="col${k}${i + 2}"><h4 style=''>$${drinkPrice.toFixed(
									2
								)}</h4></div></li>`).insertAfter(lastElementId);
							}

							// end of non-coffee drinks else block
						} // end of for loop iterating through list of drink dictionaries in drink category
					} // end of loop itering through drink category key values
				} // end of for loop iterating through drink list
			}
		}

		if ('orderSide' in orderDict) {
			if ($('#checkingCartBody0').children.length > 0) {
				// format the drink list

				const orderSide = orderDict['orderSide'];

				for (var k = 0; k < orderSide.length; k++) {
					// const lastElementId = $('#modalBody1').children().last().attr('id');
					//https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
					$(`#checkingCartBody0`).append(
						`<li class="list-group-item d-flex justify-content-between lh-condensed" " id="sideRow${k}0"></li>`
					);
					$(`#sideRow${k}${0}`).append(`<div id=""><h4 style="font-weight:bold;">Side #${k + 1}</h4></div>`);
					const sides = orderSide[k]['sides'];
					var sideSubTotal = 0;
					for (var key in sides) {
						const sidesInSideCategory = sides[key];
						if (sidesInSideCategory != '') {
							for (var i = 0; i < sidesInSideCategory.length; i++) {
								const side = sidesInSideCategory[i];
								console.log('side: %s', side);
								const sideName = splitCamelCaseToString(side['name']);
								console.log('sideName', sideName);
								const sideQuantity = side['quantity'];
								console.log('sideQuantity: %s', sideQuantity);
								const sidePrice = parseFloat(side['price']);
								const lastElementId = $('#checkingCartBody0').find('li').last().attr('id');

								$(
									`<li class="list-group-item d-flex justify-content-between lh-condensed" id="sideRow${k}${i}"><div class="col-9" style="margin-right: 0px; " id="col${k}${i}"><h5 style=''>
													${sideQuantity + 'x' + ' ' + sideName}</h5>
														</div><div class="col-3" style=""id="col${k}${i + 2}"><h4 style=''>$${sidePrice.toFixed(2)}</h4></div></li>`
								).insertAfter(`#${lastElementId}`);

								// i will add the side with the side price regardless of whether there are toppings that go after it, thus i check for the existence of the toppings array afer
								if ('toppings' in side) {
									const arrayOfToppingDictionaries = side['toppings'];
									console.log('arrayOfToppingDictionaries: %s', arrayOfToppingDictionaries);
									console.log('sideSubTotal: %s', sideSubTotal);

									for (var j = 0; j < arrayOfToppingDictionaries.length; j++) {
										const toppingDictionary = arrayOfToppingDictionaries[j];
										console.log('toppingDictionary: %s', toppingDictionary);

										const toppingServingSize = splitCamelCaseToString(
											toppingDictionary['servingSize']
										);
										console.log('sideSubTotal: %s', sideSubTotal);

										const toppingName = splitCamelCaseToString(toppingDictionary['name']);
										const toppingPrice = toppingDictionary['price'];
										console.log('toppingPrice: %s', toppingPrice);

										sideSubTotal += toppingPrice;
										var toppingFormat = '';
										if (toppingServingSize === 'Extra') {
											const newToppingServingSize = 'Double';
											toppingFormat += newToppingServingSize;
										} else {
											toppingFormat += toppingServingSize;
										}
										toppingFormat += ' ';
										toppingFormat += toppingName;
										const lastElementId = $('#checkingCartBody0').find('li').last().attr('id');

										$(
											`<li class="list-group-item d-flex justify-content-between lh-condensed" id="toppingRow${k}${j}"><div class="col-9" style="margin-right: 0px; " id="col${k}${j}"><h5 style=''>
													${toppingFormat}</h5>
														</div><div class="col-3" style=""id="col${k}${j + 2}"><h4 style=''>$${toppingPrice.toFixed(2)}</h4></div></li>`
										).insertAfter(`#${lastElementId}`);
									}
								}
							} // end of for loop iterating through side list
							// const lastElementId = $('#modalBody1').find('.container').last().attr('id');
						} // end of for loop iterating through sides in side order
					}
				}
			}
		}
		$(`#checkingCartBody0`).append(
			`<div class="list-group-item d-flex justify-content-between" id="footer"></div>`
		);

		$(`#footer`).append(`<div class="col-8" id="footerCol0"><h4 style="font-weight: bold;">Order Total</h4>
		</div>`);
		$(`#footer`)
			.append(`<div class="col-3" style="margin-left: 21px; " id="footerCol1"><h4 style="float:right; font-weight: bold; ">$${orderTotal.toFixed(
			2
		)}</h4>
		</div>`);
	}
});
