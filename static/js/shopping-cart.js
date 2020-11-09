//https://stackoverflow.com/questions/39627549/how-to-center-modal-to-the-center-of-screen/39636961
('use strict');

import { Coffee, Order, capitalize, humanize } from './model.js';

const showShoppingCart = () => {
	$('#shoppingCart').modal('toggle');
};

//https://www.smashingmagazine.com/2019/08/shopping-cart-html5-web-storage/
const checkBrowser = () => {
	if ('localStorage' in window && window['localStorage'] !== null) {
		return true;
	} else {
		return false;
	}
};

//https://stackoverflow.com/questions/2827764/ecommerceshopping-cartwhere-should-i-store-shopping-cart-data-in-session-or#:~:text=The%20client%20never%20stores%20individual,cart%20is%20lost%20for%20good.
const doShowAll = () => {
	if (checkBrowser()) {
		const modifyItem = (index, itemType, operation) => {
			const order = new Order();
			order.fromJSON(localStorage.getItem('order'));
			if (operation === 'copy') {
				if (itemType === 'crepe') {
					const crepeToBeCopied = order.orderCrepe[index];
					order.orderCrepe.push(crepeToBeCopied);
					localStorage.setItem('order', JSON.stringify(order));
					location.reload();
				} else if (itemType === 'drink') {
					const drinkToBeCopied = order.orderDrink[index];
					order.orderDrink.push(drinkToBeCopied);
					localStorage.setItem('order', JSON.stringify(order));
					location.reload();
				} else if (itemType === 'side') {
					const sideToBeCopied = order.orderSide[index];
					order.orderSide.push(sideToBeCopied);
					localStorage.setItem('order', JSON.stringify(order));
					location.reload();
				}
			} else if (operation === 'remove') {
				if (itemType === 'crepe') {
					order.orderCrepe.splice(index, 1);
					localStorage.setItem('order', JSON.stringify(order));
					location.reload();
				} else if (itemType === 'drink') {
					order.orderDrink.splice(index, 1);
					localStorage.setItem('order', JSON.stringify(order));
					location.reload();
				} else if (itemType === 'side') {
					order.orderSide.splice(index, 1);
					localStorage.setItem('order', JSON.stringify(order));
					location.reload();
				}
			}
			localStorage.setItem('reload', 'true');
		};
		
		const orderDict = localStorage.getItem('order');
		console.log("orderDict", orderDict)
		
		if (orderDict) {
			const order = new Order();
			order.fromJSON(orderDict);
			console.log('order', order);

			// to do finish the serialization and deserialization of all the classes, then build savory crepe, then menu crepe pg, then clover pmt in backend, then mobile buttons
			if (order) {
				if (order.orderCrepe.length) {
					const orderCrepes = order.orderCrepe;
					for (var k = 0; k < orderCrepes.length; k++) {
						const orderCrepe = orderCrepes[k];
						if (orderCrepe.origination === 'custom') {
							if (orderCrepe.flavor === 'savory') {
								$('#modalBody1').append(`<div class="container" id="container${k}"></div>`);
								$(`#container${k}`).append(
									`<div class="row" style= "border-bottom: 2px solid black; margin-bottom:20px;" id="row-${k}-0"  flavor="${
										orderCrepe.flavor
									}" origination="${
										orderCrepe.origination
									}"><h5 style='font-weight: 700;'>Crepe Order #${k + 1}</h5></div>`
								);
								for (var j = 0; j < orderCrepe.ingredients.length; j++) {
									$(`<div class="row" style= "margin-bottom: 20px;" id="row-${k}-${
										j + 1
									}"><div class="col-9" style="margin-right: 0px;"><h5>
								${
									humanize(orderCrepe.ingredients[j], 'servingSize').servingSize +
									' ' +
									humanize(orderCrepe.ingredients[j], 'id').id
								}</h5>
									</div><div class="col-3" ><h4>$${orderCrepe.ingredients[j].price.toFixed(2)}</h4></div></div>`).insertAfter(
										`#row-${k}-${j}`
									);
								}
							}
							else if (orderCrepe.flavor === 'sweet') {
										$('#modalBody1').append(`<div class="container" id="container${k}"></div>`);
										$(`#container${k}`).append(
											`<div class="row" style= "border-bottom: 2px solid black; margin-bottom:20px;" id="row-${k}-0"  flavor="${
												orderCrepe.flavor
											}" origination="${
												orderCrepe.origination
											}"><h5 style='font-weight: 700;'>Crepe Order #${k + 1}</h5></div>`
										);
										for (var j = 0; j < orderCrepe.ingredients.length; j++) {
											$(`<div class="row" style= "margin-bottom: 20px;" id="row-${k}-${
												j + 1
											}"><div class="col-9" style="margin-right: 0px;"><h5>
								${orderCrepe.ingredients[j].quantity + 'x' + ' ' + humanize(orderCrepe.ingredients[j], 'id').id}</h5>
									</div><div class="col-3" ><h4>$${
										orderCrepe.ingredients[j].price.toFixed(2) * orderCrepe.ingredients[j]
									.quantity}</h4></div></div>`).insertAfter(`#row-${k}-${j}`);
										}
							}
							
						} // end of if block that corrals custom crepe
						// iterate through each menu crepe in the order
						else if (orderCrepe.origination === 'menu') {
							$('#modalBody1').append(`<div class="container" id="container${k}"></div>`);
							$(`#container${k}`).append(
								`<div class="row" style= "border-bottom: 2px solid black; margin-bottom:20px;" id="row-${k}-0" origination="${
									orderCrepe.origination
								}"><h5 style='font-weight: 700; '>Crepe Order #${k + 1}</h5></div>`
							);
							for (var j = 0; j < orderCrepe.menuCrepes.length; j++) {
								const menuCrepe = orderCrepe.menuCrepes[j];
								$(`<div class="row"  style= "margin-bottom: 20px;" id="row-${k}-${j + 1}">
									<div class="col-9" style="margin-right: 0px; " >
										<h5>${menuCrepe.quantity + 'x' + ' ' + humanize(menuCrepe, 'name').name}</h5>
									</div>
									<div class="col-3">
										<h4>$${menuCrepe.price.toFixed(2)}</h4>
									</div>
								</div>`).insertAfter(`#row-${k}-${j}`);
							}
						}

						const itemIndex = $(`#container${k}`).find('.row').first().attr('id').split('-')[1];
						const crepeFlavor = $(`#container${k}`).find('.row').first().attr('flavor');

						var crepeURL = '';
						if (crepeFlavor) {
							crepeURL += 'make-your-own-';
							crepeURL += crepeFlavor;
							crepeURL += '-crepe';
						} else {
							crepeURL = 'menu-crepe';
						}
						$(`<div class="grid-container" id="menubuttoncontainer${k}" style="grid-template-columns: 1fr 1fr 1fr;
            				display:grid; grid-gap: 5px; justify-items: center; margin: 30px auto;"></div>`).insertAfter(
							$(`#container${k}`)
						);
						$(`#menubuttoncontainer${k}`).append(
							`<button class="btn8" itemIndex="${itemIndex}" itemType="crepe" operation="copy" >Duplicate</button>`
						);
						// pass in the item that is being modified to the make your own crepe page
						$(`#menubuttoncontainer${k}`).append(
							`<button class= "btn10" style="margin-top:.5px;" onclick="location.assign('/order/${crepeURL}?editOrder=${itemIndex}')">Edit</button>`
						);
						$(`#menubuttoncontainer${k}`).append(
							`<button class="btn8" itemIndex="${itemIndex}" itemType="crepe" operation="remove" >Remove</button>`
						);
					} // end of the loop iterating through crepe orders
				} // end of for loop confirming orderCrepe existence
				if (order.orderDrink.length) {
					const drinkOrders = order.orderDrink;

					for (var i = 0; i < drinkOrders.length; i++) {
						$('#modalBody1').append(
							`<div class="container" id="drinkContainer${i}"><div class="row" style= "border-bottom: 2px solid black; margin-bottom:20px; " id="drinkRow-${i}-0"><h5 style='font-weight: 700; '>Drink Order #${
								i + 1
							}</h5></div></div>`
						);
						const drinks = drinkOrders[i].orderDrink;

						for (var j = 0; j < drinks.length; j++) {
							const drink = drinks[j];
							console.log('drink', drink);

							const drinkPrice = drink.price * drink.quantity;
							if (drink instanceof Coffee) {
								const milkName = humanize(drink, 'milkType').milkType;
								const milkPrice = drink.milkPrice;
								const espressoPrice = drink.price;
								const espressoServingSize = drink.espressoServingSize;
								var espressFormat;
								var flavorSyrupPrice = '';

								if (espressoServingSize === 'extra') {
									espressFormat = '3x Espresso Shot';
								} else if (espressoServingSize === 'regular') {
									espressFormat = '2x Espresso Shot';
								} else if (espressoServingSize === 'light') {
									espressFormat = '1x Espresso Shot';
								}
								if (drink.flavorSyrup && drink.flavorSyrupServingSize) {
									if (drink.flavorSyrupServingSize === 'extra') {
										flavorSyrupPrice = 0.99;
									} else {
										flavorSyrupPrice = 0;
									}
									$(`<div class="row" style= "margin-bottom: 20px;">
													<div class="col-9" style="margin-right: 0px; " >
														<h5 >${drink.quantity + 'x' + ' ' + humanize(drink, 'name').name}</h5>
												</div>
													<div class="col-3">
														<h4 >$${drinkPrice.toFixed(2)}</h4>
													</div>
												</div>
												<div class="row" style= "margin-bottom: 20px;">
													<div class="col-9" style="margin-right: 0px; " >
														<h5 >${espressFormat}</h5>
													</div>
													<div class="col-3" style="">
														<h4 >$${espressoPrice}</h4>
													</div>
												</div>
												<div class="row" style= "margin-bottom: 20px;">
													<div class="col-9" style="margin-right: 0px; " >
														<h5 >${milkName}</h5>
													</div>
													<div class="col-3" style="">
														<h4 >$${milkPrice}</h4>
													</div>
												</div>
												<div class="row" style= "margin-bottom: 20px;" id='#drinkRow-${i}-${j + 1}'>
													<div class="col-9" style="margin-right: 0px;">
														<h5 >${humanize(drink, 'flavorSyrupServingSize').flavorSyrupServingSize} ${
										humanize(drink, 'flavorSyrup').flavorSyrup
									} Syrup</h5>
													</div>
													<div class="col-3" style="">
														<h4 >$${flavorSyrupPrice}</h4>
													</div>
												</div>`).insertAfter(`#drinkRow-${i}-${j}`);
								}
								// if there is no flavor syrup selected but there is a coffee in the drink order
								else {
									$(`<div class="row" style= "margin-bottom: 20px;">
											<div class="col-9" style="margin-right: 0px;">
												<h5>${drink.quantity + 'x' + ' ' + humanize(drink, 'name').name}</h5>
											</div>
											<div class="col-3">
												<h4>$${drinkPrice.toFixed(2)}</h4>
											</div>
										</div>
										<div class="row" style= "margin-bottom: 20px;">
											<div class="col-9" style="margin-right: 0px; " >
												<h5 >${espressFormat}</h5>
											</div>
											<div class="col-3" style="">
												<h4 >$${espressoPrice}</h4>
											</div>
										</div>
										<div class="row" style= "margin-bottom: 20px;" id="drinkRow-${i}-${j + 1}">
											<div class="col-9" style="margin-right: 0px;">
												<h5 >${milkName}</h5>
											</div>
											<div class="col-3" style="">
												<h4 >$${milkPrice}</h4>
											</div>
										</div>`).insertAfter(`#drinkRow-${i}-${j}`);
								}
							}
							// if the drink is not a coffee
							else {
								var drinkName;
								if (drink.drinkCategory === 'milkshake') {
									drinkName = humanize(drink, 'name').name;
									drinkName += ' Milkshake';
								} else {
									drinkName = humanize(drink, 'name').name;
								}
								$(`<div class="row" style= "margin-bottom: 20px;" id="drinkRow-${i}-${j + 1}">
											<div class="col-9" style="margin-right: 0px;" >
												<h5 >${drink.quantity + 'x' + ' ' + drinkName}</h5>
											</div>
											<div class="col-3">
												<h4 >$${drinkPrice.toFixed(2)}</h4>
											</div>
											</div>`).insertAfter(`#drinkRow-${i}-${j}`);
							} // end of non-coffee drinks else block
						} // end of loop for drinks in drink order

						const drinkItemIndex = $(`#drinkContainer${i}`).find('.row').first().attr('id').split('-')[1];

						$(`<div class="grid-container" id="drinkButtonContainer${i}" style="grid-template-columns: 1fr 1fr 1fr;
            				display:grid; grid-gap: 5px; justify-items: center; margin: 30px auto;"></div>`).insertAfter(
							$(`#drinkContainer${i}`)
						);
						$(`#drinkButtonContainer${i}`).append(
							`<button class="btn8" itemIndex="${drinkItemIndex}" itemType="drink" operation="copy">Duplicate</button>`
						);
						// pass in the item that is being modified to the make your own crepe page
						$(`#drinkButtonContainer${i}`).append(
							`<button class= "btn10" style="margin-top:.5px;" onclick="location.assign('/order/drink?editOrder=${drinkItemIndex}')">Edit</button>`
						);
						$(`#drinkButtonContainer${i}`).append(
							`<button class="btn8" itemIndex="${drinkItemIndex}" itemType="drink" operation="remove" >Remove</button>`
						);
					}
				} // end of for loop confirming orderDrink length

				if (order.orderSide.length) {
					for (var i = 0; i < order.orderSide.length; i++) {
						$('#modalBody1').append(
							`<div class="container" id="sideContainer${i}"><div class="row" style= "border-bottom: 2px solid black; margin-bottom:20px;" id="sideRow-${i}-0"><h5 style='font-weight: 700; '>Side Order #${
								i + 1
							}</h5></div></div>`
						);
						const sidesInOrder = order.orderSide[i].orderSide;
						for (var j = 0; j < sidesInOrder.length; j++) {
							const side = sidesInOrder[j];
							if (side.toppings) {
								$(`<div class="row" style= "margin-bottom: 20px;" id="sideRow-${i}-${j + 1}">
												<div class="col-9" style="margin-right: 0px; " id="sideCol-${i}-${j + 1}">
													<h5 >${humanize(side, 'sideName').sideName}</h5>
												</div>
												<div class="col-3" id="sideCol-${i}-${j + 2}">
													<h4 >$${side.price.toFixed(2)}</h4>
												</div>
										</div>`).insertAfter(`#sideRow-${i}-${j}`);
								for (var k = 0; k < side.toppings.length; k++) {
									const topping = side.toppings[k];
									var toppingServingSize;
									if (topping.servingSize === 'extra') {
										toppingServingSize = 'Double';
									} else {
										toppingServingSize = capitalize(topping.servingSize);
									}
									const lastElementId = $('#modalBody1').find('.row').last().attr('id');

									$(`
										<div class="row" style= "margin-bottom: 20px;" id="toppingRow-${i}-${j + 1}-${k}">
											<div class="col-9" style="margin-right:0px;">
												<h5 >${toppingServingSize + ' ' + humanize(topping, 'id').id}</h5>
											</div>
											<div class="col-3">
												<h4 >$${topping.price.toFixed(2)}</h4>
											</div>
										</div>`).insertAfter(`#${lastElementId}`);
								}
							} else {
								const lastElementId = $('#modalBody1').find('.row').last().attr('id');

								$(`<div class="row" style= "margin-bottom: 20px;" id="sideRow-${i}-${j + 1}">
											<div class="col-9" style="margin-right: 0px; " id="sideCol-${i}-${j + 1}">
												<h5 >${side.quantity + 'x' + ' ' + humanize(side, 'flavor').flavor + ' ' + humanize(side, 'sideName').sideName}</h5>
											</div>
											<div class="col-3" id="sideCol-${i}-${j + 2}">
												<h4 >$${side.price.toFixed(2)}</h4>
											</div>
											</div>`).insertAfter(`#${lastElementId}`);
							}
						} // end of for loop iterating through side list
						const sideItemIndex = $(`#sideContainer${i}`).find('.row').first().attr('id').split('-')[1];
						console.log('sideItemIndex', sideItemIndex);

						$(`<div class="grid-container" id="sideButtonContainer${i}" style="grid-template-columns: 1fr 1fr 1fr;
            				display:grid; grid-gap: 5px; justify-items: center; margin: 30px auto;"></div>`).insertAfter(
							$(`#sideContainer${i}`)
						);
						$(`#sideButtonContainer${i}`).append(
							`<button class="btn8" itemIndex="${sideItemIndex}" itemType="side" operation="copy">Duplicate</button>`
						);
						// pass in the item that is being modified to the make your own crepe page
						$(`#sideButtonContainer${i}`).append(
							`<button class= "btn10" style="margin-top:.5px;" onclick="location.assign('/order/side?editOrder=${sideItemIndex}')">Edit</button>`
						);
						$(`#sideButtonContainer${i}`).append(
							`<button class="btn8" itemIndex="${sideItemIndex}" itemType="side" operation="remove">Remove</button>`
						);
					} // end of for loop iterating through sides in side order
				}

				$(`<div class="modal-footer" id="footer" style= " border-top: 2px solid black"></div>`).insertAfter(`#modalBody1`);

				$(`#footer`).append(`<div class="col-8" ><h3 style="font-weight: bold;">Order Total</h3></div>`);
				$(`#footer`).append(
					`<div class="col-3" style="margin-left:21px;" id="footerCol1"><h3 style="float:right;font-weight:bold;">$${order.orderTotal.toFixed(
						2
					)}</h3></div>`
				);
			}
			$('.btn8').each(function () {
				$(this)
					.unbind('click')
					.bind('click', function () {
						const itemIndex = $(this).attr('itemIndex');
						const itemType = $(this).attr('itemType');
						const operation = $(this).attr('operation');
						modifyItem(itemIndex, itemType, operation);
					
							$(this).css('margin-left', '0px');
					});
			});
		}
	}
};

$(window).on('load', function () {
	console.log("localStorage.getItem('reload')", localStorage.getItem('reload'))
	
	const modal = $('#shoppingCart');
	$('#showShoppingCart')
		.unbind('click')
		.bind('click', function () {
			showShoppingCart();
		});

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
