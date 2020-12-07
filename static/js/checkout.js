// Example starter JavaScript for disabling form submissions if there are invalid fields
//https://www.codeply.com/p?starter=Bootstrap&ex=Sh3KmpOVTc
('use strict');
import { humanize } from './model.js';

import { Order, Customer, Coffee } from './model.js';

function buildPage () {
	const key = 'order';
	const orderDict = localStorage.getItem(key);
	const order = new Order();
	if (orderDict) {
		order.fromJSON(orderDict);
		var numOrderItems = 0;
		if (order.orderCrepe.length) {
			for (i in order.orderCrepe) {
				numOrderItems += 1;
			}
		}
		if (order.orderDrink.length) {
			for (i in order.orderDrink) {
				numOrderItems += 1;
			}
		}
		if (order.orderSide.length) {
			for (i in order.orderSide) {
				numOrderItems += 1;
			}
		}
		$('#pill').html(numOrderItems);
		if (order) {
			if (order.orderCrepe.length) {
				const orderCrepes = order.orderCrepe;
				for (var i = 0; i < orderCrepes.length; i++) {
					const crepeOrder = orderCrepes[i];
					if (crepeOrder.origination === 'custom') {
						$(`#checkingCartBody0`).append(
							`<li class="list-group-item d-flex justify-content-between" " id="crepeRow${i}0">
								<h4 style="font-weight:bold;">Crepe Order #${i + 1}</h4>
						</li>`
						);
						for (var j = 0; j < crepeOrder.ingredients.length; j++) {
							const ingredient = crepeOrder.ingredients[j];
							$(
								`<li class="list-group-item d-flex justify-content-between" id="crepeRow${i}${
									j + 1
								}"><div class="col-8" style="margin-right: 0px; "><h5 style=''>
								${humanize(ingredient, 'servingSize').servingSize + ' ' + humanize(ingredient, 'id').id}</h5>
									</div><div class="col-4"><h4 style=''>$${ingredient.price.toFixed(2)}</h4></div></li>`
							).insertAfter(`#crepeRow${i}${j}`);
						}
					} else if (crepeOrder.origination === 'menu') {
						$(`#checkingCartBody0`).append(
							`<li class="list-group-item d-flex justify-content-between" " id="crepeRow${i}0">
								<h4 style="font-weight:bold;">Crepe Order #${i + 1}</h4>
						</li>`
						);
						for (var j = 0; j < crepeOrder.menuCrepes.length; j++) {
							const menuCrepe = crepeOrder.menuCrepes[j];
							$(
								`<li class="list-group-item d-flex justify-content-between" id="crepeRow${i}${
									j + 1
								}"><div class="col-8" style="margin-right: 0px; "><h5 style=''>
								${menuCrepe.quantity + 'x' + ' ' + humanize(menuCrepe, 'name').name}</h5>
									</div><div class="col-4"><h4 style=''>$${menuCrepe.price.toFixed(2)}</h4></div></li>`
							).insertAfter(`#crepeRow${i}${j}`);
						}
					}
				}
			}

			if (order.orderDrink.length) {
				const drinkOrders = order.orderDrink;

				for (var i = 0; i < drinkOrders.length; i++) {
					$(`#checkingCartBody0`).append(
						`<li class="list-group-item d-flex justify-content-between" id="checkoutDrinkRow${i}0">
								<h4 style="font-weight:bold;">Drink Order #${i + 1}</h4>
					</li>`
					);
					const drinks = drinkOrders[i].orderDrink;

					for (var j = 0; j < drinks.length; j++) {
						const drink = drinks[j];
						const drinkPrice = drink.price * drink.quantity;
						if (drink instanceof Coffee) {
							const milkName = humanize(drink, 'milkType').milkType;
							const milkPrice = drink.milkPrice;
							const espressoPrice = drink.espressoPrice;
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
								$(
									`<li class="list-group-item d-flex justify-content-between" id="checkoutDrinkRow${i}0">
									<div class="col-8" style="margin-right: 0px; ">
										<h5 style=''>${drink.servingSize + ' ' + humanize(drink, 'name').name}</h5>
									</div>
									<div class="col-4">
										<h4 style=''>$${drinkPrice.toFixed(2)}</h4>
									</div>
								</li>
								<li class="list-group-item d-flex justify-content-between">
									<div class="col-8" style="margin-right: 0px; ">
										<h5 style=''>${espressFormat}</h5>
									</div>	
									<div class="col-4">
										<h4 style=''>$${espressoPrice}</h4>
									</div>
								</li>
								<li class="list-group-item d-flex justify-content-between">
									<div class="col-8" style="margin-right: 0px; ">
										<h5 style=''>${milkName}</h5>
									</div>
									<div class="col-4">
										<h4 style=''>$${milkPrice}</h4>
									</div>
								</li>
								<li class="list-group-item d-flex justify-content-between" id="checkoutDrinkRow${i}${j + 1}">
									<div class="col-8" style="margin-right: 0px; ">
										<h5 style=''>${
											humanize(drink, 'flavorSyrupServingSize').flavorSyrupServingSize +
											' ' +
											humanize(drink, 'flavorSyrup').flavorSyrup
										}</h5>
									</div>
									<div class="col-4">
										<h4 style=''>$${flavorSyrupPrice}</h4>
									</div>
								</li>`
								).insertAfter(`#checkoutDrinkRow${i}${j}`);
							} else {
								$(
									`<li class="list-group-item d-flex justify-content-between">
									<div class="col-8" style="margin-right: 0px; ">
										<h5 style=''>${drink.quantity + 'x' + ' ' + humanize(drink, 'name').name}</h5>
									</div>
									<div class="col-4" >
										<h4 style=''>$${drinkPrice.toFixed(2)}</h4>
									</div>
								</li>
								<li class="list-group-item d-flex justify-content-between">
									<div class="col-8" style="margin-right: 0px; ">
										<h5 style=''>${espressFormat}</h5>
									</div>	
									<div class="col-4">
										<h4 style=''>$${espressoPrice}</h4>
									</div>
								</li>
								<li class="list-group-item d-flex justify-content-between" id="checkoutDrinkRow${i}${j + 1}">
									<div class="col-8" style="margin-right: 0px; ">
										<h5 style=''>${milkName}</h5>
									</div>
									<div class="col-4">
										<h4 style=''>$${milkPrice}</h4>
									</div>
								</li>`
								).insertAfter(`#checkoutDrinkRow${i}${j}`);
							}
						} else {
							var drinkName = '';
							var drinkQuantity = '';
							if (drink.drinkCategory === 'milkshake') {
								drinkName = humanize(drink, 'name').name;
								drinkName += ' Milkshake';
								if (drink.quantity > 1) {
									drinkQuantity = drink.quantity + 'x' + ' ' + drink.servingSize
								}
								else {
								drinkQuantity = drink.servingSize;
								}
							} else if (drink.drinkCategory === 'non-coffee') {
								drinkName = humanize(drink, 'name').name;
								if (drink.quantity > 1) {
									drinkQuantity = drink.quantity + 'x' + ' ' + drink.servingSize
								}
								else if (drink.servingSize) {
								drinkQuantity = drink.servingSize;
								}
							} else {
								if (drink.quantity > 1) {
									drinkQuantity = drink.quantity + 'x'
								}
								drinkName = humanize(drink, 'name').name;
							}
							$(
								`<li class="list-group-item d-flex justify-content-between" id="checkoutDrinkRow${i}${
									j + 1
								}">
								<div class="col-8" style="margin-right: 0px; ">
									<h5 style=''>${drinkQuantity + ' ' + drinkName}</h5>
								</div>
								<div class="col-4">
									<h4 style=''>$${drinkPrice.toFixed(2)}</h4>
								</div>
							</li>`
							).insertAfter(`#checkoutDrinkRow${i}${j}`);
						}
					}
				}
			}

			if (order.orderSide.length) {
				const orderSides = order.orderSide;
				for (var i = 0; i < orderSides.length; i++) {
					const sideOrder = orderSides[i].orderSide;
					$(`#checkingCartBody0`).append(
						`<li class="list-group-item d-flex justify-content-between" " id="checkoutSideRow${i}0">
								<h4 style="font-weight:bold;">Side Order #${i + 1}</h4>
						</li>`
					);
					for (var j = 0; j < sideOrder.length; j++) {
						const side = sideOrder[j];
						if (side.sideName === 'ice_cream_bowl') {
							const lastElementId = $('#checkingCartBody0').find('li').last().attr('id');
							$(
								`<li class="list-group-item d-flex justify-content-between" id="checkoutSideRow${i}${
									j + 1
								}${k}"><div class="col-8" style="margin-right: 0px; "><h5 style=''>
								${side.quantity + 'x Scoop ' + humanize(side, 'sideName').sideName}</h5>
									</div><div class="col-4"><h4 style=''>$${side.price.toFixed(2)}</h4></div></li>`
							).insertAfter(`#${lastElementId}`);
							if (side.toppings.length) {
								for (var k = 0; k < side.toppings.length; k++) {
									const lastElementId = $('#checkingCartBody0').find('li').last().attr('id');
									const topping = side.toppings[k];
									$(
										`<li class="list-group-item d-flex justify-content-between" id="checkoutSideRow${i}${
											j + 1
										}${k}"><div class="col-8" style="margin-right: 0px; "><h5 style=''>
								${humanize(topping, 'servingSize').servingSize + ' ' + humanize(topping, 'id').id}</h5>
									</div><div class="col-4"><h4 style=''>$${topping.price.toFixed(2)}</h4></div></li>`
									).insertAfter(`#${lastElementId}`);
								}
							}
						} else {
							const lastElementId = $('#checkingCartBody0').find('li').last().attr('id');

							$(
								`<li class="list-group-item d-flex justify-content-between" id="checkoutSideRow${i}${
									j + 1
								}"><div class="col-8" style="margin-right: 0px; "><h5 style=''>
								${side.quantity + 'x' + ' ' + humanize(side, 'sideName').sideName}</h5>
									</div><div class="col-4"><h4 style=''>$${side.price.toFixed(2)}</h4></div></li>`
							).insertAfter(`#${lastElementId}`);
						}
					}
				}
			}
			$(`#checkingCartBody0`).append(
				`<div class="list-group-item d-flex justify-content-between" id="checkoutFooter"></div>`
			);

			$(`#checkoutFooter`).append(`<div class="col-8"><h4 style="font-weight: bold;">Order Total</h4>
				</div> <div class="col-4" style="margin-left: 21px; "><h4 style="float:right; font-weight: bold; ">$${order.orderTotal.toFixed(
					2
				)}</h4></div>`);
				$('#timePicker').mdtimepicker({theme:'red'});
				$('#timePicker').mdtimepicker().on('timechanged', function(e){
					// console.log(e.value);
					// console.log(e.time);
					order.pickupTime = e.value;
					// console.log('order.pickupTime', order.pickupTime); 
				  });
		}
	}
	return order
};
function loading (isLoading) {
	if (isLoading) {
		// Disable the button and show a spinner
		document.querySelector('button').disabled = true;
		$('#buttonText').html('Loading...');
		$('#spinner').css('visibility', 'visible');
	} else {
		document.querySelector('button').disabled = false;
		document.querySelector('#spinner').classList.add('hidden');
	}
};
function handleFormSubmit (stripe, card, data, order) {
	loading(true);
	const response = {};
	const customerData = {};
	$('input, select', $('#checkoutForm')).each(function () {
		if ($(this).val() != '' && $(this).val() != 'on') {
			if ($(this).attr('id') === 'phoneNumber'){
				if ($(this).val().split("-").length > 1){
					customerData[$(this).attr('id')] = $(this).val().split("-").join("")
				} 
			} 
			customerData[$(this).attr('id')] = $(this).val();
		}
	});
	customerData['stripeId'] = data.customer;
	const newCustomer = new Customer(customerData);
	order.customerData = newCustomer;
	response['order'] = order;
	const JSONResponse = JSON.stringify(response);
	stripe
		.confirmCardPayment(data.clientSecret, {
			payment_method: {
				card: card,
				billing_details: {
					name: newCustomer.firstName + ' ' + newCustomer.lastName,
				},
			},
			receipt_email: newCustomer.id,
		})
		.then(function (result) {
			if (result.error) {
				console.log('result.error', result.error);
				// Show error to your customer
				showError(result.error.message);
				return false;
			} else {
				// The payment succeeded!
				$.ajax({
					url: '/checkout',
					data: JSONResponse,
					dataType: 'json',
					type: 'POST',
					contentType: 'application/json',
					success: function() {
						localStorage.setItem('stripeId', newCustomer.stripeId);
						location.assign('/order/confirmation');
					},
					error: function (response) { console.log('console.log error', response)},
				});
			}
		});
};
// Show the customer the error from Stripe if their card fails to charge
function showError (errorMsgText) {
	loading(false);
	var errorMsg = document.querySelector('#cardError');
	errorMsg.textContent = errorMsgText;
	setTimeout(function () {
		errorMsg.textContent = '';
	}, 4000);
};
function validateForm (order) {
		if (localStorage.getItem('stripeId')) {
			const newCustomer = new Customer(null, localStorage.getItem('stripeId'));
			order.customerData = newCustomer;
		}
		const forms = document.getElementsByClassName('needs-validation');
		const stripe = Stripe(
			'pk_live_51HkZexHlxrw6CLurJeot1lKQ6wnEhU7kmLH84WADrcKuCEWibpeT5r3OiWprFoYcHKhouPhVmjLbT7owgKcSs73n00znWaC2Xp'
		);
		// const stripe = Stripe(
		// 	'pk_test_51HkZexHlxrw6CLurXRJ1Z8xcNjsYrhP36BnoJz6q2i0B6gUrR1ViPANQZN6pcDH02rqVoujFG8PEj0ct5mkNw5lW00mGuA7PJZ'
		// );
		
		document.querySelector('button').disabled = true;
		fetch('/create-payment-intent', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(order),
		})
			.then(function (result) {
				return result.json();
			})
			.then(function (data) {
				console.log('data', data)
				const elements = stripe.elements();
				const card = elements.create('card');
				// Stripe injects an iframe into the DOM
				card.mount('#cc-card');
				card.on('change', function (event) {
					// Disable the Pay button if there are no card details in the Element
					document.querySelector('#checkoutButton').disabled = event.empty;
					if (event.error) {
						document.querySelector('#checkoutButton').disabled = true;
						document.querySelector('#cardError').textContent = event.error ? event.error.message : '';
						$('#cardError').show();
					} else if (!event.complete) {
						document.querySelector('#cardError').textContent = 'Please enter a valid card date';
					} else {
						document.querySelector('#checkoutButton').disabled = false;
						document.querySelector('#cardError').textContent = '';
						$('#cardError').hide();
					}
				});
				card.on('ready', function (event) {
					// Disable the Pay button if there are no card details in the Element
					if (!event.empty) {
						document.querySelector('#cardError').textContent = 'Please enter a valid card number';
					} else if (!event.complete) {
						document.querySelector('#cardError').textContent =
							'Please complete the required card information';
					}
				});
				// Loop over them and prevent submission
				Array.prototype.filter.call(forms, function (form) {
					$('#checkoutButton')
						.unbind('click')
						.bind('click', function () {
							if (form.checkValidity() === false) {
								form.classList.add('was-validated');
								return false;
							} else {
								if (document.querySelector('#cardError').textContent) {
									$('#cardError').show();
									return false;
								} else {
									form.classList.add('was-validated');
									handleFormSubmit(stripe, card, data, order);
									return false;
								}
							}
						});
				});
			});
};

$(window).ready(function () {
	const order = buildPage();
	console.log('order', order)
	validateForm(order);
});
