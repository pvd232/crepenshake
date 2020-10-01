//https://stackoverflow.com/questions/39627549/how-to-center-modal-to-the-center-of-screen/39636961
('use strict');

import { Order, Drink, Coffee } from './order-drink.js'
import { Crepe, Ingredient } from './build-your-own-sweet-crepe.js';
import { IceCreamBowl, Topping } from './order-side.js';
 
$(window).ready(function () {
	const modal = $('#shoppingCart');
	$('#showShoppingCart')
		.unbind('click')
		.bind('click', function () {
			console.log('hey');
			showShoppingCart();
		});
	// console.log('fdjaopisdfjaosij');
	// console.log(localStorage.length, 'localStorage.length');
	for (var i = 0; i < localStorage.length; i++) {
		const order = {};
		console.log(JSON.parse(localStorage.getItem(localStorage.key(0))));
	}
	if (localStorage.getItem('reload') === 'true') {
		showShoppingCart();
		localStorage.setItem('reload', 'false');
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
});
function showShoppingCart() {
	// console.log('weeeeeeeee');
	$('#shoppingCart').modal('toggle');
}
function modifyItem(index, itemType, operation) {
	if (operation === 'copy') {
		if (itemType === 'crepe') {
			const order = JSON.parse(localStorage.getItem(localStorage.key(0)));
			const crepeToBeCopied = order['orderCrepe'][index];
			order['orderCrepe'].push(crepeToBeCopied);
			localStorage.setItem('order', JSON.stringify(order));
			location.reload();
		} else if (itemType === 'drink') {
			const order = JSON.parse(localStorage.getItem(localStorage.key(0)));
			const crepeToBeCopied = order['orderDrink'][index];
			order['orderDrink'].push(crepeToBeCopied);
			localStorage.setItem('order', JSON.stringify(order));
			location.reload();
		} else if (itemType === 'side') {
			const order = JSON.parse(localStorage.getItem(localStorage.key(0)));
			const crepeToBeCopied = order['orderSide'][index];
			order['orderSide'].push(crepeToBeCopied);
			localStorage.setItem('order', JSON.stringify(order));
			location.reload();
		}
	} else if (operation === 'remove') {
		if (itemType === 'crepe') {
			const order = JSON.parse(localStorage.getItem(localStorage.key(0)));
			order['orderCrepe'].splice(index, 1);
			localStorage.setItem('order', JSON.stringify(order));
			location.reload();
		} else if (itemType === 'drink') {
			const order = JSON.parse(localStorage.getItem(localStorage.key(0)));
			order['orderDrink'].splice(index, 1);
			localStorage.setItem('order', JSON.stringify(order));
			location.reload();
		} else if (itemType === 'side') {
			const order = JSON.parse(localStorage.getItem(localStorage.key(0)));
			order['orderSide'].splice(index, 1);
			localStorage.setItem('order', JSON.stringify(order));
			location.reload();
		}
	}
	localStorage.setItem('reload', 'true');
}

function copyItem(index) {
	// console.log('foo');
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
		// console.log('true');
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
		const orderDict = localStorage.getItem(key);
		if (orderDict) {
			console.log("orderDict: %s", orderDict)
			const order = new Order();
			console.log('check orderDict b4', order);

			order.fromJSON(orderDict)
			console.log('check orderDict after', order);

			if (!order) {
				if (order.orderCrepe.length) {
					const orderCrepes = order.orderCrepe;
					console.log("orderCrepes: %s", JSON.stringify(orderCrepes))
				
					for (var k = 0; k <= orderCrepes.length - 1; k++) {
						// the crepe is an object with the higher level crepe properties like the crepe price and type of crepe as keys
						// the crepe is inside an object whose only key is "ordercrepes" and whose value is a list of different orders of crepes. for custom crepes there will only be one crepe in the list
						const orderCrepe = orderCrepes[k]
						console.log("orderCrepe: %s", JSON.stringify(orderCrepe))
					
					

						if (orderCrepe.flavorProfile === 'sweet' && orderCrepe.origination === 'custom') {
							const orderCrepeIngredientCategories = orderCrepe.ingredients[0]['ingredients'];
							$('#modalBody1').append(`<div class="container" id="container${k}"></div>`);
							$(`#container${k}`).append(
								`<div class="row" style= "border-bottom: 2px solid black; margin-bottom:20px;" id="row${k}0"><h5 style='font-weight: 700; '>Crepe Order #${k + 1
								}</h5></div>`
							);
							for (var j = 0; j < orderCrepeIngredientCategories.length; j++) {
								const ingredientsInIngredientCategory = orderCrepeIngredientCategories[j]['ingredients'];
								console.log("ingredientsInIngredientCategory: %s", ingredientsInIngredientCategory)
							
								for (var k = 0; k < ingredientsInIngredientCategory.length; k++) {
									const ingredient = ingredientsInIngredientCategory[k];
									console.log("ingredient: %s", ingredient)

								}
							}

							var subtotal = 0;
							// insert the row and child header with the crepe number
							// console.log('formattedOtherToppings', formattedOtherToppings);

							const toppingPrice = parseFloat(formattedOtherToppings[i]['price']);

							subtotal += toppingPrice;

							$(`<div class="row" name="savory" style= "margin-bottom: 20px;" id="row${k}${i + 1
								}"><div class="col-9" style="margin-right: 0px; " id="col${k}${i}"><h5 style=''>
								${formattedOtherToppings[i]['format']}</h5>
									</div><div class="col-3" style=""id="col${k}${i + 2}"><h4 style=''>$${formattedOtherToppings[i]['price'].toFixed(
									2
								)}</h4></div></div>`).insertAfter(`#row${k}${i}`);

							// the i iterator ends with an id of k, i+1 so this must be formattedOtherToppings.length not formattedothertoppings.length -1
							// insert the subtotal after completing the insertion of the toppings
							// $(
							// 	`<div class="row" id=row${k}${
							// 		formattedOtherToppings.length + 1
							// 	} style="margin-top: 20px; margin-bottom: 20px; margin-top: 20px; border-top: 2px solid black" id=""><div class="col-9" id="0col23" style="margin-left: 0px;"><h5 style="font-weight: 700" ;="">Crepe #${
							// 		k + 1
							// 	} Total</h5></div><div class="col-3" id="0col22" style="margin-left: 0px;"><h4 style="font-weight: 700;">$${subtotal.toFixed(
							// 		2
							// 	)}</h4></div></div>`
							// ).insertAfter($(`#row${k}${formattedOtherToppings.length}`));
							if (subtotal) {
								orderPrice += subtotal;
							}
							// console.log('orderPrice: %s', orderPrice);
						} // end of if block that corrals custom crepe
						else if (!crepe['customCrepe']) {
							const crepeName = splitCamelCaseToString(crepe['name']);
							// console.log('crepe: %s', crepe);
							const crepeQuantity = crepe['quantity'];
							// console.log('crepeName', crepeName);
							const crepePrice = crepe['price'];
							if (crepePrice) {
								orderPrice += crepePrice;
							}
							$(`<div class="row" name="menu" style= "margin-bottom: 20px;" id="crepeRow${k}${i + 1}">
								<div class="col-9" style="margin-right: 0px; " id="crepeCol${k}${i}">
									<h5 style=''>${crepeQuantity + 'x' + ' ' + crepeName}</h5>
								</div>
								<div class="col-3" style=""id="crepeCol${k}${i + 2}">
									<h4 style=''>$${crepePrice.toFixed(2)}</h4>
								</div>
								</div>`).insertAfter(`#row${k}${i}`);
							
					
							const itemIndex =
								$(`#container${k}`)
									.find('.row')
									.first()
									.text()
									.replace('Order ', '')
									.replace(' ', '-')
									.replace('#', '')
									.toLowerCase()
									.split('-')[1] - 1;
							// console.log('itemIndex: %s', itemIndex);
						} else if (crepe['customCrepe'] && crepe['flavorProfile'] === 'sweet') {
							const customCrepeIngredients = crepe['ingredients'];
							// console.log('customCrepeIngredients', customCrepeIngredients);
							var sweetCrepeSubtotal = 0;
							var z = 0;

							for (var key in customCrepeIngredients) {
								// console.log('key', key);
								const toppingArray = customCrepeIngredients[key];
								if (toppingArray != '' && toppingArray != []) {
									for (var j = 0; j < toppingArray.length; j++) {
										z += 1;
										const topping = toppingArray[j];
										// console.log('topping', topping);
										const toppingName = splitCamelCaseToString(topping['name']);
										const toppingCost = topping['cost'];
										const toppingQuantity = topping['quantity'];
										sweetCrepeSubtotal += toppingCost;
										const lastElementId = $('#modalBody1').find('.row').last().attr('id');
										$(`<div class="row" name="sweet" style= "margin-bottom: 20px;" id="sweetRow${j}${z + 1
											}">
											<div class="col-9" style="margin-right: 0px; " id="sweetCrepeCol${j}${z}">
												<h5 style=''>${toppingQuantity + 'x' + ' ' + toppingName}</h5>
											</div>
											<div class="col-3" style="" id="sweetCrepeCol${j}${z + 2}">
												<h4 style=''>$${toppingCost.toFixed(2)}</h4>
											</div>
											</div>`).insertAfter(`#${lastElementId}`);

										const itemIndex =
											$(`#container${k}`)
												.find('.row')
												.first()
												.text()
												.replace('Order ', '')
												.replace(' ', '-')
												.replace('#', '')
												.toLowerCase()
												.split('-')[1] - 1;
										// console.log('itemIndex: %s', itemIndex);
									}
								}
							}
							const lastElementId = $('#modalBody1').find('.row').last().attr('id');
							// console.log('lastElementId: %s', lastElementId);

							// $(
							// 	`<div class="row"
							// 	style="margin-top: 20px; margin-bottom: 20px; margin-top: 20px; border-top: 2px solid black" id=""><div class="col-9" id="0col23" style="margin-left: 0px;"><h5 style="font-weight: 700" ;="">Crepe #${
							// 		k + 1
							// 	} Total</h5></div><div class="col-3" id="0col22" style="margin-left: 0px;"><h4 style="font-weight: 700;">$${sweetCrepeSubtotal.toFixed(
							// 		2
							// 	)}</h4></div></div>`
							// ).insertAfter($(`#${lastElementId}`));
							if (subtotal) {
								orderPrice += sweetCrepeSubtotal;
							}
						}
					
					} // end of the loop iterating through crepes in the order

					const itemIndex =
						$(`#container${k}`)
							.find('.row')
							.first()
							.text()
							.replace('Order ', '')
							.replace(' ', '-')
							.replace('#', '')
							.toLowerCase()
							.split('-')[1] - 1;
					var crepeURL;
					var crepeProfile = $(`#container${k}`).find('.row').first().next().attr('name');
					if (crepeProfile === 'menu') {
						crepeURL = 'menu-crepe';
					} else {
						crepeURL = 'make-your-own-' + crepeProfile + '-crepe';
					}
					// console.log('crepeProfile: %s', crepeProfile);

					// console.log('itemIndex: %s', itemIndex);
					$(`<div class="grid-container" id="menubuttoncontainer${k}" style="margin-top: 30px; margin-bottom:40px; align-content:space-evenly; grid-template-columns: auto auto auto;
            				grid-gap: 5px; display:grid;"></div>`).insertAfter($(`#container${k}`));
					$(`#menubuttoncontainer${k}`).append(
						`<div id="col5"><button class="btn8" onclick="modifyItem('${itemIndex}', 'crepe', 'copy')" style="margin-left:40px;">Duplicate</button></div>`
					);
					// pass in the item that is being modified to the make your own crepe page
					$(`#menubuttoncontainer${k}`).append(
						`<div  id="col6" ><button class= "btn8" style="margin-top:.5px;" onclick="location.assign('/order/${crepeURL}?editOrder=${itemIndex}')">Edit</button></div>`
					);
					$(`#menubuttoncontainer${k}`).append(
						`<div id="col5"><button class="btn8" onclick="modifyItem('${itemIndex}', 'crepe', 'remove')" >Remove</button></div>`
					);
			
				} // end of for loop confirming orderCrepe existence
				if (orderDict.orderDrink.length) {
					if ($('#modalBody1').children.length > 0) {
						// format the drink list
						const orderDrinks = orderDict['orderDrink'];
						for (var i = 0; i < orderDrinks.length; i++) {
							// for each drink order, tracked by the index number i, j will add a new container with a row appended to it that lists the drink order # i
							var drinkSubTotal = 0;
							$('#modalBody1').append(
								`<div class="container" id="drinkContainer${i}"><div class="row" style= "border-bottom: 2px solid black; margin-bottom:20px;" id="drinkRow${i}0"><h5 style='font-weight: 700; '>Drink Order #${i + 1
								}</h5></div></div>`
							);
							const drinks = orderDrinks[i]['drinkCategories'];
							for (var j = 0; j < drinks.length - 1; j++) {
								// console.log('key milk: %s', key);

								const drinksInDrinkCategory = drinks[j]['drinks'];
								console.log("drinksInDrinkCategory: %s", drinksInDrinkCategory)
							
								for (var k = 0; k < drinksInDrinkCategory.length; k++) {
									const drink = drinksInDrinkCategory[k];
									console.log("drink: %s", drink)
								
									drinkSubTotal += drink.price


									if ('milkType' in drink) {
									
										const milkName = splitCamelCaseToString(drink.milkType);
									
										const milkPrice = drink.milkPrice;
										const espressoPrice = drink.price;
										const espressoServingSize = drink.espressoServingSize
										var espressFormat;
										var flavorSyrup = '';
										var flavorSyrupServingSize = '';
										var flavorSyrupPrice = '';

										if (espressoServingSize === 'extra') {
											espressFormat = '3x Espresso Shot';
										} else if (espressoServingSize === 'regular') {
											espressFormat = '2x Espresso Shot';
										} else if (espressoServingSize === 'half') {
											espressFormat = '1x Espresso Shot';
										}
										if (drink.flavorSyrup && drink.flavorSyrupServingSize) {
											flavorSyrup = drink.flavorSyrup;
											flavorSyrupServingSize = drink.flavorSyrupServingSize;
											if (flavorSyrupServingSize === 'extra') {
												flavorSyrupPrice = 0.99;
											} else {
												flavorSyrupPrice = 0;
											}
										}
									
										$(`	<div class="row" style= "margin-bottom: 20px;">
											<div class="col-9" style="margin-right: 0px; " >
												<h5 style=''>${drink.quantity + 'x' + ' ' + drink.name}</h5>
											</div>
											<div class="col-3">
												<h4 style=''>$${drink.price.toFixed(2)}</h4>
											</div>
										</div>
										<div class="row" style= "margin-bottom: 20px;">
											<div class="col-9" style="margin-right: 0px; " >
												<h5 style=''>${espressFormat}</h5>
											</div>
											<div class="col-3" style="">
												<h4 style=''>$${espressoPrice}</h4>
											</div></div>
										<div class="row" style= "margin-bottom: 20px;">
											<div class="col-9" style="margin-right: 0px;">
												<h5 style=''>${milkName}</h5>
											</div>
											<div class="col-3" style="">
												<h4 style=''>$${milkPrice}</h4>
											</div>
										</div>
										<div class="row" style= "margin-bottom: 20px;" id="drinkRow${i}${k + 1}">
											<div class="col-9" style="margin-right: 0px;">
												<h5 style=''>${capitalize(flavorSyrupServingSize)} ${capitalize(flavorSyrup)}</h5>
											</div>
											<div class="col-3" style="">
												<h4 style=''>$${flavorSyrupPrice}</h4>
											</div>
										</div>`).insertAfter(`#drinkRow${i}${k}`);
										drinkSubTotal += parseFloat(milkPrice);
										drinkSubTotal += parseFloat(espressoPrice);
									} // milk block
									else {
													
										$(`<div class="row" style= "margin-bottom: 20px;" id="drinkRow${i}${k + 1
											}">
											<div class="col-9" style="margin-right: 0px; " id="drinkCol${i}${k}">
												<h5 style=''>${drink.quantity + 'x' + ' ' + drink.name}</h5>
											</div>
											<div class="col-3" style=""id="drinkCol${i}${k + 2}">
												<h4 style=''>$${drink.price.toFixed(2)}</h4>
											</div>
											</div>`).insertAfter(`#drinkRow${i}${k}`);
														
									} // end of non-coffee drinks else block
								} // end of for loop iterating through list of drink dictionaries in drink category
							} // end of loop itering through drink category key values

							const drinkItemIndex =
								$(`#drinkContainer${i}`)
									.find('.row')
									.first()
									.text()
									.replace('Order ', '')
									.replace(' ', '-')
									.replace('#', '')
									.toLowerCase()
									.split('-')[1] - 1;
							// console.log('drinkItemIndex: %s', drinkItemIndex);

							$(`<div class="grid-container" id="drinkButtonContainer${i}" style="margin-top: 30px; margin-bottom:40px; align-content:space-evenly; grid-template-columns: auto auto auto;
            				grid-gap: 5px; display:grid;"></div>`).insertAfter($(`#drinkContainer${i}`));
							$(`#drinkButtonContainer${i}`).append(
								`<div id="col5"><button class="btn8" onclick="modifyItem('${drinkItemIndex}', 'drink', 'copy')" style="margin-left:40px;">Duplicate</button></div>`
							);
							// pass in the item that is being modified to the make your own crepe page
							$(`#drinkButtonContainer${i}`).append(
								`<div  id="col6" ><button class= "btn8" style="margin-top:.5px;" onclick="location.assign('/order/drink?editOrder=${drinkItemIndex}')">Edit</button></div>`
							);
							$(`#drinkButtonContainer${i}`).append(
								`<div id="col5"><button class="btn8" onclick="modifyItem('${drinkItemIndex}', 'drink', 'remove')" >Remove</button></div>`
							);
							if (drinkSubTotal) {
								orderPrice += drinkSubTotal;
							}
						} // end of for loop iterating through drink list
						// console.log('drinkSubTotal', drinkSubTotal);
					}
					// console.log('orderPriceDrink: %s', orderPrice);

					// console.log('orderPriceDrink: %s', orderPrice);
				}

				if ('orderSide' in orderDict) {
					if ($('#modalBody1').children.length > 0) {
						if (orderDict['orderSide'].length > 0) {
							// format the drink list

							const orderSide = orderDict['orderSide'];

							for (var k = 0; k < orderSide.length; k++) {
								// const lastElementId = $('#modalBody1').children().last().attr('id');
								//https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
								$('#modalBody1').append(
									`<div class="container" id="sideContainer${k}"><div class="row" style= "border-bottom: 2px solid black; margin-bottom:20px;" id="sideRow${k}0"><h5 style='font-weight: 700; '>Side Order #${k + 1
									}</h5></div></div>`
								);
								const sides = orderSide[k]['sides'];
								var sideSubTotal = 0;
								for (var key in sides) {
									// console.log('sideSubTotal: %s', sideSubTotal);

									// if (key != 'sideTotal') {
									// console.log('key', key);
									const sidesInSideCategory = sides[key];
									// console.log('sidesInSideCategory: %s', sidesInSideCategory);

									if (sidesInSideCategory != '') {
										// console.log('sidesInSideCategory', sidesInSideCategory);
										for (var i = 0; i < sidesInSideCategory.length; i++) {
											var side = sidesInSideCategory[i];
											// console.log('side: %s', side);
											var sideName = splitCamelCaseToString(side['name']);
											// console.log('sideName', sideName);
											const sideQuantity = side['quantity'];
											// console.log('sideQuantity: %s', sideQuantity);
											var sidePrice = parseFloat(side['price']);

											$(`<div class="row" style= "margin-bottom: 20px;" id="sideRow${k}${i + 1}">
										<div class="col-9" style="margin-right: 0px; " id="sideCol${k}${i}">
											<h5 style=''>${sideName}</h5>
										</div>
										<div class="col-3" style=""id="sideCol${k}${i + 2}">
											<h4 style=''>$${sidePrice}</h4>
										</div>
										</div>`).insertAfter(`#sideRow${k}${i}`);
											// console.log('sideSubTotal: %s', sideSubTotal);

											// i will add the side with the side price regardless of whether there are toppings that go after it, thus i check for the existence of the toppings array afer
											if ('toppings' in side) {
												const arrayOfToppingDictionaries = side['toppings'];
												// console.log('arrayOfToppingDictionaries: %s', arrayOfToppingDictionaries);
												// console.log('sideSubTotal: %s', sideSubTotal);

												for (var j = 0; j < arrayOfToppingDictionaries.length; j++) {
													const toppingDictionary = arrayOfToppingDictionaries[j];
													// console.log('toppingDictionary: %s', toppingDictionary);

													const toppingServingSize = splitCamelCaseToString(
														toppingDictionary['servingSize']
													);
													// console.log('sideSubTotal: %s', sideSubTotal);

													const toppingName = splitCamelCaseToString(toppingDictionary['name']);
													const toppingPrice = toppingDictionary['price'];
													// console.log('toppingPrice: %s', toppingPrice);

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
										// console.log('sideSubTotal', sideSubTotal);
									} // end of for loop iterating through sides in side order
									// console.log('sideSubTotal: %s', sideSubTotal);
								}
								// console.log('orderPriceSide: %s', orderPrice);
								// console.log('sideSubTotal: %s', sideSubTotal);
								if (sideSubTotal) {
									orderPrice += sideSubTotal;
								}
								// console.log('orderPriceSide: %s', orderPrice);

								const sideItemIndex =
									$(`#sideContainer${k}`)
										.find('.row')
										.first()
										.text()
										.replace('Order ', '')
										.replace(' ', '-')
										.replace('#', '')
										.toLowerCase()
										.split('-')[1] - 1;
								// console.log('sideItemIndex: %s', sideItemIndex);

								$(`<div class="grid-container" id="sideButtonContainer${k}" style="margin-top: 30px; margin-bottom:40px; align-content:space-evenly; grid-template-columns: auto auto auto;
            			grid-gap: 5px; display:grid;"></div>`).insertAfter($(`#sideContainer${k}`));
								$(`#sideButtonContainer${k}`).append(
									`<div id="col5"><button class="btn8" onclick="modifyItem('${sideItemIndex}', 'side', 'copy')" style="margin-left:40px;">Duplicate</button></div>`
								);
								// pass in the item that is being modified to the make your own crepe page
								$(`#sideButtonContainer${k}`).append(
									`<div  id="col6" ><button class= "btn8" style="margin-top:.5px;" onclick="location.assign('/order/side?editOrder=${sideItemIndex}')">Edit</button></div>`
								);
								$(`#sideButtonContainer${k}`).append(
									`<div id="col5"><button class="btn8" onclick="modifyItem('${sideItemIndex}', 'side', 'remove')" >Remove</button></div>`
								);
								// console.log('sideSubTotal: %s', sideSubTotal);
							}
						}
					}
				}
			}
			// var updatedOrder = JSON.parse(localStorage.getItem(localStorage.key(0)));
			// // console.log('updatedOrder: %s', updatedOrder);
			// if (updatedOrder) {
			// 	updatedOrder['orderTotal'] = orderPrice;
			// 	localStorage.setItem('order', JSON.stringify(updatedOrder));
			// }
			// else {
			// 	updatedOrder['orderTotal'] = 0;
			// 	localStorage.setItem('order', JSON.stringify(updatedOrder));
			// }
			$(`<div class="modal-footer" id="footer" style= " border-top: 2px solid black"></div>`).insertAfter(
				`#modalBody1`
			);

			$(`#footer`).append(`<div class="col-8" id="footerCol0"><h3 style="font-weight: bold;">Order Total</h3>
		</div>`);
			$(`#footer`)
				.append(`<div class="col-3" style="margin-left: 21px; " id="footerCol1"><h3 style="float:right; font-weight: bold; ">$${orderPrice.toFixed(
					2
				)}</h3>
		</div>`);
		}
	}
}

// send mitra an updated resume
// send mitra an unofficial transcript
// prepare a statement of purpose that explains what in my background makes me a good candidate for the masters program
