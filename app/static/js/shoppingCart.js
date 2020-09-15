//https://stackoverflow.com/questions/39627549/how-to-center-modal-to-the-center-of-screen/39636961
$(window).on('load', function () {
	const modal = $('#shoppingCart');
	// console.log('fdjaopisdfjaosij');
	// console.log(localStorage.length, 'localStorage.length');
	// for (var i = 0; i < localStorage.length; i++) {
	// 	const order = {};
	// 	const key = localStorage.key(0);
	// 	console.log('key', key);
	// 	order[key] = JSON.parse(localStorage.getItem(key));
	// 	console.log('order', order);
	// }
	for (var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		console.log('key: %s', key);

		var value = localStorage[key];
		console.log('value: %s', value);
	}
	const body = $(window);
	// Get modal size
	const w = modal.width();
	const h = modal.height();
	// Get window size
	const bw = body.width();
	const bh = body.height();

	// Update the css and center the modal on screen
	modal.css({
		position: 'absolute',
		top: (bh - h) / 2 + 'px',
		left: (bw - w) / 2 + 'px',
	});
	doShowAll();
	$('#shoppingCart').modal('show');
});

function removeItem() {
	var name = document.forms.ShoppingList.name.value;
	document.forms.ShoppingList.data.value = localStorage.removeItem(name);
	doShowAll();
}

function copyItem(index) {
	console.log('foo');
	index = index.split('-')[1] - 1;
	const order = JSON.parse(localStorage.getItem(localStorage.key(0)));
	const crepeToBeCopied = order['orderCrepe'][index];

	order['orderCrepe'].push(crepeToBeCopied);
	localStorage.setItem('order', JSON.stringify(order));
	location.reload();
}

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
		var orderPrice = 0;
		key = localStorage.key(0);
		const orderDict = JSON.parse(localStorage.getItem(key));
		console.log('check orderDict', orderDict);
		if (orderDict) {
			if ('orderCrepe' in orderDict) {
				const crepes = orderDict['orderCrepe'];

				for (k = 0; k <= crepes.length - 1; k++) {
					//https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
					var formattedOtherToppings = [];
					const customCrepeIngredients = crepes[k]['ingredients'];
					console.log('customCrepeIngredients', customCrepeIngredients);
					for (var key in customCrepeIngredients) {
						// if (key != 'crepeTotal' && key != 'flavorProfile') {
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
								//if (protein.length > 1) {
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

								formattedProtein = Array.from(formattedProtein).splice(0, formattedProtein.length - 5);
								formattedProtein = formattedProtein.join('');
								console.log('formattedProtein2: %s', formattedProtein);

								formatDict['format'] = formattedProtein;
								formattedOtherToppings.unshift(formatDict);
							}
						}
						// }
					}
					var subtotal = 0;

					// insert the row and child header with the crepe number
					console.log('formattedOtherToppings', formattedOtherToppings);
					$('#modalBody1').append(`<div class="container" id="container${k}"></div>`);

					$(`#container${k}`).append(
						`<div class="row" style= "border-bottom: 1px solid black; margin-bottom:20px;" id="row${k}0"><h5 style='font-weight: 700; '>Crepe #${
							k + 1
						}</h5></div>`
					);
					// const currentRowHeaderIndex = `${k}0`
					for (var i = 0; i < formattedOtherToppings.length; i++) {
						const toppingPrice = parseFloat(formattedOtherToppings[i]['price']);

						subtotal += toppingPrice;

						$(`<div class="row" style= "margin-bottom: 20px;" id="row${k}${
							i + 1
						}"><div class="col-9" style="margin-right: 0px; " id="col${k}${i}"><h5 style=''>
				${formattedOtherToppings[i]['format']}</h5>
					</div><div class="col-3" style=""id="col${k}${i + 2}"><h4 style=''>$${formattedOtherToppings[i]['price'].toFixed(
							2
						)}</h4></div></div>`).insertAfter(`#row${k}${i}`);
					} // end of the loop iterating through the toppings in the crepe

					// the i iterator ends with an id of k, i+1 so this must be formattedOtherToppings.length not formattedothertoppings.length -1
					// insert the subtotal after completing the insertion of the toppings
					$(
						`<div class="row" id=row${k}${
							formattedOtherToppings.length + 1
						} style="margin-top: 20px; margin-bottom: 20px; margin-top: 20px; border-top: 1px solid black" id=""><div class="col-9" id="0col23" style="margin-left: 0px;"><h5 style="font-weight: 700" ;="">Crepe #${
							k + 1
						} Total</h5></div><div class="col-3" id="0col22" style="margin-left: 0px;"><h4 style="font-weight: 700;">$${subtotal.toFixed(
							2
						)}</h4></div></div>`
					).insertAfter($(`#row${k}${formattedOtherToppings.length}`));
					orderPrice += subtotal;
					console.log('orderPrice: %s', orderPrice);

					// insert the modify, edit, delete buttons
					// const itemIndex = $(this).closest('.container').first();
					const itemIndex = $(`#container${k}`)
						.find('.row')
						.first()
						.text()
						.replace(' ', '-')
						.replace('#', '')
						.toLowerCase();
					console.log('itemIndex: %s', itemIndex);

					$(`<div class="grid-container" id="buttoncontainer${k}" style="margin-top: 30px; margin-bottom:40px; align-content:space-evenly; grid-template-columns: auto auto auto;
            grid-gap: 5px; display:grid;"></div>`).insertAfter($(`#container${k}`));
					$(`#buttoncontainer${k}`).append(
						`<div id="col5"><button class="btn" onclick="copyItem('${itemIndex}')" style="margin-left:75px;" >duplicate</button></div>`
					);
					// $(`#buttoncontainer${k}`).append(
					// 	`<div  id="col6" ><h6 style=" margin-left: 0px; text-decoration:underline;"><a onclick="console.log('${itemIndex}')">edit</a></h6></div>`
					// );

					// pass in the item that is being modified to the make your own crepe page
					$(`#buttoncontainer${k}`).append(
						`<div  id="col6" ><h6 style=" margin-left: 0px; text-decoration:underline;"><a href="/make-your-own-crepe?editOrder=${itemIndex}">edit</a></h6></div>`
					);
					$(`#buttoncontainer${k}`).append(
						`<div  id="col7"><h6 style=" text-decoration:underline; margin-right: 35px"><a href="removeItem()">remove</a></h6></div>`
					);
				} // end of the loop iterating through crepes in the order

				for (i = 0; i < localStorage.length; i++) {
					var key = localStorage.key(i);
					console.log('key: %s', key);

					var value = localStorage[key];
					console.log('value: %s', value);
				}
			} // end of for loop confirming orderCrepe existence
			// const lastElementId = $('#modalBody1').find('.container').last().attr('id');
			if ('orderDrink' in orderDict) {
				if ($('#modalBody1').children.length > 0) {
					// format the drink list

					const orderDrinks = orderDict['orderDrink'];
					console.log('orderDrinks Lookng for milk: %s', orderDrinks);

					for (k = 0; k <= orderDrinks.length - 1; k++) {
						// for each drink order, tracked by the index number k, i will add a new container with a row appended to it that lists the drink order # k

						var drinkSubTotal = 0;

						$('#modalBody1').append(
							`<div class="container" id="drinkContainer${k}"><div class="row" style= "border-bottom: 1px solid black; margin-bottom:20px;" id="drinkRow${k}0"><h5 style='font-weight: 700; '>Drink Order #${
								k + 1
							}</h5></div></div>`
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
								drinkSubTotal += drinkPrice;
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
									$(`<div class="row" style= "margin-bottom: 20px;">
							<div class="col-9" style="margin-right: 0px; " >
								<h5 style=''>${drinkQuantity + ' ' + drinkName}</h5>
							</div>
							<div class="col-3">
								<h4 style=''>$${drinkPrice.toFixed(2)}</h4>
							</div>
							</div>
							<div class="row" style= "margin-bottom: 20px;">
							<div class="col-9" style="margin-right: 0px; " >
								<h5 style=''>${espressFormat}</h5>
							</div>
							<div class="col-3" style="">
								<h4 style=''>$${espressoPrice}</h4>
							</div></div>
							<div class="row" style= "margin-bottom: 20px;" id="drinkRow${k}${i + 1}">
							<div class="col-9" style="margin-right: 0px; " id="drinkCol${k}${i}">
								<h5 style=''>${milkName}</h5>
							</div>
							<div class="col-3" style=""id="drinkCol${k}${i + 2}">
								<h4 style=''>$${milkPrice}</h4>
							</div>
							</div>`).insertAfter(`#drinkRow${k}${i}`);
									drinkSubTotal += parseFloat(milkPrice);
									drinkSubTotal += parseFloat(espressoPrice);
								} // coffee block
								else {
									if (drinkQuantity > 1) {
										// add an "s" to the title
										$(`<div class="row" style= "margin-bottom: 20px;" id="drinkRow${k}${i + 1}">
							<div class="col-9" style="margin-right: 0px; " id="drinkCol${k}${i}">
								<h5 style=''>${drinkQuantity + ' ' + drinkName + 's'}</h5>
							</div>
							<div class="col-3" style=""id="drinkCol${k}${i + 2}">
								<h4 style=''>$${drinkPrice.toFixed(2)}</h4>
							</div>
							</div>`).insertAfter(`#drinkRow${k}${i}`);
									} else {
										$(`<div class="row" style= "margin-bottom: 20px;" id="drinkRow${k}${i + 1}">
							<div class="col-9" style="margin-right: 0px; " id="drinkCol${k}${i}">
								<h5 style=''>${drinkQuantity + ' ' + drinkName}</h5>
							</div>
							<div class="col-3" style=""id="drinkCol${k}${i + 2}">
								<h4 style=''>$${drinkPrice.toFixed(2)}</h4>
							</div>
							</div>`).insertAfter(`#drinkRow${k}${i}`);
									}
								} // end of non-coffee drinks else block
							} // end of for loop iterating through list of drink dictionaries in drink category
						} // end of loop itering through drink category key values

						// const lastElementId = $('#modalBody1').find('.container').last().attr('id');
						const drinkItemIndex = $(`#drinkContainer${k}`)
							.find('.row')
							.first()
							.text()
							.replace('Order ', '')
							.replace(' ', '-')
							.replace('#', '')
							.toLowerCase();
						console.log('drinkItemIndex: %s', drinkItemIndex);

						$(`<div class="grid-container" id="drinkButtonContainer${k}" style="margin-top: 30px; margin-bottom:40px; align-content:space-evenly; grid-template-columns: auto auto auto;
            grid-gap: 5px; display:grid;"></div>`).insertAfter($(`#drinkContainer${k}`));
						$(`#drinkButtonContainer${k}`).append(
							`<div id="col5"><h6 style=" margin-left:75px;text-decoration:underline"><a href="copyItem()">duplicate</a></h6></div>`
						);
						$(`#drinkButtonContainer${k}`).append(
							`<div  id="col6" ><h6 style=" margin-left: 0px; text-decoration:underline;"><a href="/order-drink?editOrder=${drinkItemIndex}">edit</a></h6></div>`
						);
						$(`#drinkButtonContainer${k}`).append(
							`<div  id="col7"><h6 style=" text-decoration:underline; margin-right: 35px"><a href="removeItem()">remove</a></h6></div>`
						);
						// $(
						// 	`<div class="row"
						// }" style="margin-top: 20px; margin-bottom: 20px; border-bottom: 1px solid black" id=""><div class="col-9" id="0col23" style="margin-left: 0px;"><h5 style="font-weight: 700" ;="">Subtotal</h5></div><div class="col-3" id="0col22" style="margin-left: 0px;"><h4 style="font-weight: 700">$${drinkSubTotal.toFixed(
						// 	2
						// )}</h4></div></div>`
						// ).insertAfter($(`#${lastElementId}`));
						orderPrice += drinkSubTotal;
					} // end of for loop iterating through drink list
					console.log('drinkSubTotal', drinkSubTotal);
				}
				console.log('orderPriceDrink: %s', orderPrice);

				console.log('orderPriceDrink: %s', orderPrice);
			}

			if ('orderSide' in orderDict) {
				if ($('#modalBody1').children.length > 0) {
					// format the drink list

					const orderSide = orderDict['orderSide'];

					for (var k = 0; k < orderSide.length; k++) {
						// const lastElementId = $('#modalBody1').children().last().attr('id');
						//https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
						$('#modalBody1').append(
							`<div class="container" id="sideContainer${k}"><div class="row" style= "border-bottom: 1px solid black; margin-bottom:20px;" id="sideRow${k}0"><h5 style='font-weight: 700; '>Side Order #${
								k + 1
							}</h5></div></div>`
						);
						const sides = orderSide[k]['sides'];
						var sideSubTotal = 0;
						for (var key in sides) {
							// if (key != 'sideTotal') {
							console.log('key', key);
							const sidesInSideCategory = sides[key];
							console.log('sidesInSideCategory: %s', sidesInSideCategory);

							if (sidesInSideCategory != '') {
								console.log('sidesInSideCategory', sidesInSideCategory);
								for (var i = 0; i < sidesInSideCategory.length; i++) {
									var side = sidesInSideCategory[i];
									console.log('side: %s', side);
									var sideName = splitCamelCaseToString(side['name']);
									console.log('sideName', sideName);
									const sideQuantity = side['quantity'];
									console.log('sideQuantity: %s', sideQuantity);
									var sidePrice = parseFloat(side['price']);

									$(`<div class="row" style= "margin-bottom: 20px;" id="sideRow${k}${i + 1}">
							<div class="col-9" style="margin-right: 0px; " id="sideCol${k}${i}">
								<h5 style=''>${sideName}</h5>
							</div>
							<div class="col-3" style=""id="sideCol${k}${i + 2}">
								<h4 style=''>$${sidePrice}</h4>
							</div>
							</div>`).insertAfter(`#sideRow${k}${i}`);

									// i will add the side with the side price regardless of whether there are toppings that go after it, thus i check for the existence of the toppings array afer
									if ('toppings' in side) {
										const arrayOfToppingDictionaries = side['toppings'];
										console.log('arrayOfToppingDictionaries: %s', arrayOfToppingDictionaries);

										for (var j = 0; j < arrayOfToppingDictionaries.length; j++) {
											const toppingDictionary = arrayOfToppingDictionaries[j];
											console.log('toppingDictionary: %s', toppingDictionary);

											const toppingServingSize = splitCamelCaseToString(
												toppingDictionary['servingSize']
											);

											const toppingName = splitCamelCaseToString(toppingDictionary['name']);
											const toppingPrice = toppingDictionary['price'];
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

											$(`<div class="row" style= "margin-bottom: 20px;">
							<div class="col-9" style="margin-right: 0px; " id="toppingCol${k}${j}">
								<h5 style=''>${toppingFormat}</h5>
							</div>
							<div class="col-3" style=""id="toppingCol${k}${j + 2}">
								<h4 style=''>$${toppingPrice.toFixed(2)}</h4>
							</div>
							</div>`).insertAfter($(`#sideRow${k}${i + 1}`));
										}
									}
								} // end of for loop iterating through side list
								// const lastElementId = $('#modalBody1').find('.container').last().attr('id');

								console.log('sideSubTotal', sideSubTotal);

								// $(
								// 	`<div class="row" id="sideRow${k}${
								// 		formattedSides.length + 1
								// 	}" style="margin-top: 20px; margin-bottom: 20px; border-bottom: 1px solid black"><div class="col-9" id="0col23" style="margin-left: 0px;"><h5 style="font-weight: 700;">Subtotal</h5></div><div class="col-3" id="0col22" style="margin-left: 0px;"><h4 style="font-weight: 700">$${sideSubTotal.toFixed(
								// 		2
								// 	)}</h4></div></div>`
								// ).insertAfter($(`#${lastElementId}`));
							} // end of for loop iterating through sides in side order
						}
						const sideItemIndex = $(`#sideContainer${k}`)
							.find('.row')
							.first()
							.text()
							.replace('Order ', '')
							.replace(' ', '-')
							.replace('#', '')
							.toLowerCase();
						const formattedSideItemIndex = parseInt(sideItemIndex.split('-')[1]);
						console.log('formattedSideItemIndex: %s', formattedSideItemIndex);

						$(`<div class="grid-container" id="sideButtonContainer${k}" style="margin-top: 30px; margin-bottom:40px; align-content:space-evenly; grid-template-columns: auto auto auto;
            grid-gap: 5px; display:grid;"></div>`).insertAfter($(`#sideContainer${k}`));
						$(`#sideButtonContainer${k}`).append(
							`<div id="col5"><h6 style=" margin-left:75px;text-decoration:underline"><a onclick="copyItem()">duplicate</a></h6></div>`
						);
						$(`#sideButtonContainer${k}`).append(
							`<div  id="col6" ><h6 style=" margin-left: 0px; text-decoration:underline;"><a href="/order-side?editOrder=${formattedSideItemIndex}">edit</a></h6></div>`
						);
						$(`#sideButtonContainer${k}`).append(
							`<div  id="col7"><h6 style=" text-decoration:underline; margin-right: 35px"><a href="removeItem()">remove</a></h6></div>`
						);
					}
					console.log('orderPriceSide: %s', orderPrice);

					orderPrice += sideSubTotal;
					console.log('orderPriceSide: %s', orderPrice);

					// after adding ice cream and croissants add the toppings

					// const iceCreamDict = sides['ice_cream_bowl '];
					// if ('toppings' in toppingDict) {
					// 	arrayOfToppingDictionaries = iceCreamDict['toppings'];

					// 	for (var j = 0; j < arrayOfToppingDictionaries.length; j++) {
					// 		const topping = arrayOfToppingDictionaries[i];
					// 		const toppingName = splitCamelCaseToString(topping['name']);
					// 		// var drinkQuantity = drink['servingSize'];
					// 		console.log('drinkName', toppingName);
					// 		toppingQuantity = topping['quantity'];
					// 		console.log('toppingQuantity: %s', toppingQuantity);
					// 		var toppingPrice = parseFloat(topping['price']);

					// 		const formattedTopping = toppingQuantity + ' ' + toppingName;
					// 		$(`<div class="row" style= "margin-bottom: 20px;" id="${j}${i + 1}siderow">
					// 	<div class="col-9" style="margin-right: 0px; " id="${j}${i}col">
					// 		<h5 style=''>${formattedTopping}</h5>
					// 	</div>
					// 	<div class="col-3" style=""id="${j}${i + 2}col">
					// 		<h4 style=''>$${toppingPrice}</h4>
					// 	</div>
					// 	</div>`).insertAfter(`#${j}${i}siderow`);
					// 		// all other sides
					// 	}
					// }
				}
			}
		}

		$(`<div class="modal-footer" id="footer"></div>`).insertAfter(`#modalBody1`);

		$(`#footer`).append(`<div class="col-8" id="footerCol0"><h3 style="font-weight: bold;">Order Total</h3>
		</div>`);
		$(`#footer`)
			.append(`<div class="col-3" style="margin-left: 21px; " id="footerCol1"><h3 style="float:right; font-weight: bold; ">$${orderPrice.toFixed(
			2
		)}</h3>
		</div>`);
	}
}

// send mitra an updated resume
// send mitra an unofficial transcript
// prepare a statement of purpose that explains what in my background makes me a good candidate for the masters program
