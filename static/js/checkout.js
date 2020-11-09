// Example starter JavaScript for disabling form submissions if there are invalid fields
//https://www.codeply.com/p?starter=Bootstrap&ex=Sh3KmpOVTc
('use strict');
import { humanize } from './model.js';

import { Order, Customer, Coffee } from './model.js';

const buildPage = () => {
	const key = 'order';
	const orderDict = localStorage.getItem(key);
	console.log("orderDict", orderDict)
	
	const order = new Order();
	if (orderDict) {
		order.fromJSON(orderDict);
		console.log('order', order);
		var numOrderItems = 0
		if (order.orderCrepe.length) {
			for (i in order.orderCrepe) {
				numOrderItems += 1
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
		$('#pill').html(numOrderItems)

		if (order) {
			if (order.orderCrepe.length) {
				const orderCrepes = order.orderCrepe;
				for (var i = 0; i < orderCrepes.length; i++) {
					const crepeOrder = orderCrepes[i];
					if (crepeOrder.origination === 'custom') {
						$(`#checkingCartBody0`).append(
							`<li class="list-group-item d-flex justify-content-between lh-condensed" " id="crepeRow${i}0">
								<h4 style="font-weight:bold;">Crepe Order #${i + 1}</h4>
						</li>`
						);
						for (var j = 0; j < crepeOrder.ingredients.length; j++) {
							const ingredient = crepeOrder.ingredients[j];
							$(
								`<li class="list-group-item d-flex justify-content-between lh-condensed" id="crepeRow${i}${j + 1
								}"><div class="col-8" style="margin-right: 0px; "><h5 style=''>
								${humanize(ingredient, 'servingSize').servingSize + ' ' + humanize(ingredient, 'id').id}</h5>
									</div><div class="col-4"><h4 style=''>$${ingredient.price.toFixed(2)}</h4></div></li>`
							).insertAfter(`#crepeRow${i}${j}`);
						}
					} else if (crepeOrder.origination === 'menu') {
						$(`#checkingCartBody0`).append(
							`<li class="list-group-item d-flex justify-content-between lh-condensed" " id="crepeRow${i}0">
								<h4 style="font-weight:bold;">Crepe Order #${i + 1}</h4>
						</li>`
						);
						for (var j = 0; j < crepeOrder.menuCrepes.length; j++) {
							const menuCrepe = crepeOrder.menuCrepes[j];
							$(
								`<li class="list-group-item d-flex justify-content-between lh-condensed" id="crepeRow${i}${j + 1
								}"><div class="col-8" style="margin-right: 0px; "><h5 style=''>
								${menuCrepe.quantity + 'x' + ' ' + humanize(menuCrepe, 'name').name}</h5>
									</div><div class="col-4"><h4 style=''>$${menuCrepe.price.toFixed(2)}</h4></div></li>`
							).insertAfter(`#crepeRow${i}${j}`);
						}
					}
				}
				const lastElementId = $('#checkingCartBody0').find('li').last().attr('id');
				console.log('lastElementId: %s', lastElementId);
			}

			if (order.orderDrink.length) {
				const drinkOrders = order.orderDrink;

				for (var i = 0; i < drinkOrders.length; i++) {
					$(`#checkingCartBody0`).append(
						`<li class="list-group-item d-flex justify-content-between lh-condensed" id="checkoutDrinkRow${i}0">
								<h4 style="font-weight:bold;">Drink Order #${i + 1}</h4>
					</li>`
					);
					const drinks = drinkOrders[i].orderDrink;

					for (var j = 0; j < drinks.length; j++) {
						const drink = drinks[j];
						console.log('drink: %s', drink);

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
									`<li class="list-group-item d-flex justify-content-between lh-condensed" id="checkoutDrinkRow${i}0">
									<div class="col-8" style="margin-right: 0px; ">
										<h5 style=''>${drink.quantity + 'x' + ' ' + humanize(drink, 'name').name}</h5>
									</div>
									<div class="col-4">
										<h4 style=''>$${drinkPrice.toFixed(2)}</h4>
									</div>
								</li>
								<li class="list-group-item d-flex justify-content-between lh-condensed">
									<div class="col-8" style="margin-right: 0px; ">
										<h5 style=''>${espressFormat}</h5>
									</div>	
									<div class="col-4">
										<h4 style=''>$${espressoPrice}</h4>
									</div>
								</li>
								<li class="list-group-item d-flex justify-content-between lh-condensed">
									<div class="col-8" style="margin-right: 0px; ">
										<h5 style=''>${milkName}</h5>
									</div>
									<div class="col-4">
										<h4 style=''>$${milkPrice}</h4>
									</div>
								</li>
								<li class="list-group-item d-flex justify-content-between lh-condensed" id="checkoutDrinkRow${i}${j + 1}">
									<div class="col-8" style="margin-right: 0px; ">
										<h5 style=''>${humanize(drink, 'flavorSyrupServingSize').flavorSyrupServingSize +
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
									`<li class="list-group-item d-flex justify-content-between lh-condensed">
									<div class="col-8" style="margin-right: 0px; ">
										<h5 style=''>${drink.quantity + 'x' + ' ' + humanize(drink, 'name').name}</h5>
									</div>
									<div class="col-4" >
										<h4 style=''>$${drinkPrice.toFixed(2)}</h4>
									</div>
								</li>
								<li class="list-group-item d-flex justify-content-between lh-condensed">
									<div class="col-8" style="margin-right: 0px; ">
										<h5 style=''>${espressFormat}</h5>
									</div>	
									<div class="col-4">
										<h4 style=''>$${espressoPrice}</h4>
									</div>
								</li>
								<li class="list-group-item d-flex justify-content-between lh-condensed" id="checkoutDrinkRow${i}${j + 1}">
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
							console.log('poo');
							var drinkName = '';
							if (drink.drinkCategory === 'milkshake') {
								drinkName = humanize(drink, 'name').name;
								drinkName += ' Milkshake';
							} else {
								drinkName = humanize(drink, 'name').name;
							}
							$(
								`<li class="list-group-item d-flex justify-content-between lh-condensed" id="checkoutDrinkRow${i}${j + 1
								}">
								<div class="col-8" style="margin-right: 0px; ">
									<h5 style=''>${drink.quantity + 'x' + ' ' + humanize(drink, 'name').name}</h5>
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
					console.log('sideOrder', sideOrder);

					$(`#checkingCartBody0`).append(
						`<li class="list-group-item d-flex justify-content-between lh-condensed" " id="checkoutSideRow${i}0">
								<h4 style="font-weight:bold;">Side Order #${i + 1}</h4>
						</li>`
					);
					for (var j = 0; j < sideOrder.length; j++) {
						const side = sideOrder[j];
						if (side.sideName === 'ice_cream_bowl') {
							const lastElementId = $('#checkingCartBody0').find('li').last().attr('id');

							$(
								`<li class="list-group-item d-flex justify-content-between lh-condensed" id="checkoutSideRow${i}${j + 1
								}${k}"><div class="col-8" style="margin-right: 0px; "><h5 style=''>
								${side.quantity + 'x Scoop ' + humanize(side, 'sideName').sideName}</h5>
									</div><div class="col-4"><h4 style=''>$${side.price.toFixed(2)}</h4></div></li>`
							).insertAfter(`#${lastElementId}`);
							if (side.toppings.length) {
								for (var k = 0; k < side.toppings.length; k++) {
									const lastElementId = $('#checkingCartBody0').find('li').last().attr('id');
									console.log('lastElementId: %s', lastElementId);
									const topping = side.toppings[k];
									$(
										`<li class="list-group-item d-flex justify-content-between lh-condensed" id="checkoutSideRow${i}${j + 1
										}${k}"><div class="col-8" style="margin-right: 0px; "><h5 style=''>
								${humanize(topping, 'servingSize').servingSize + ' ' + humanize(topping, 'id').id}</h5>
									</div><div class="col-4"><h4 style=''>$${topping.price.toFixed(2)}</h4></div></li>`
									).insertAfter(`#${lastElementId}`);
								}
							}
						} else {
							const lastElementId = $('#checkingCartBody0').find('li').last().attr('id');

							$(
								`<li class="list-group-item d-flex justify-content-between lh-condensed" id="checkoutSideRow${i}${j + 1
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
		}
	}
};
const handleFormSubmit = (stripe, card, data) => {
	const order = new Order();
	order.fromJSON(localStorage.getItem('order'));
	const response = {};
	const customerData = {};
	$('input, select', $('#checkoutForm')).each(function () {
		if ($(this).val() != '' && $(this).val() != 'on') {
			customerData[$(this).attr('id')] = $(this).val();
		}
	});
	console.log("data", data)
	console.log("data.customer", data.customer)
	
	customerData["stripeId"]= data.customer
	console.log('customerData: %s', JSON.stringify(customerData));
	const newCustomer = new Customer(customerData);
	order.customerData = newCustomer;

	console.log('order', order);
	response['order'] = order;
	const JSONResponse = JSON.stringify(response);
	console.log('jsonValue', JSONResponse);
	console.log('response', response);
	// payWithCard(stripe, card, data.clientSecret, newCustomer);
	loading(true);
	stripe
		.confirmCardPayment(data.clientSecret, {
			payment_method: {
				card: card,
				billing_details: {
					name: newCustomer.firstName + ' ' + newCustomer.lastName,
					receiptEmail: newCustomer.email,
				},
			},
		})
		.then(function (result) {
			console.log('result', result);
			if (result.error) {
				// Show error to your customer
				showError(result.error.message);
				return false;
			} else {
				// The payment succeeded!
				console.log('result.paymentIntent.id', result.paymentIntent.id);
				$.ajax({
					url: '/checkout',
					data: JSONResponse,
					dataType: 'json',
					type: 'POST',
					contentType: 'application/json',
					success: (response) => localStorage.setItem('stripeId', newCustomer.stripeId),
					// success: () => location.assign('/order/confirmation'),
					error: (response) => console.log('console.log error', response),
				});
				orderComplete(result.paymentIntent.id);
				// return result;
			}
		});
	// console.log('result', result);
		
};
// Show the customer the error from Stripe if their card fails to charge
const showError = (errorMsgText) => {
	loading(false);
	var errorMsg = document.querySelector('#cardError');
	errorMsg.textContent = errorMsgText;
	setTimeout(function () {
		errorMsg.textContent = '';
	}, 4000);
};
// Show a spinner on payment submission
const loading = (isLoading) => {
	if (isLoading) {
		// Disable the button and show a spinner
		document.querySelector('button').disabled = true;
		document.querySelector('#spinner').classList.remove('hidden');
		document.querySelector('#button-text').classList.add('hidden');
	} else {
		document.querySelector('button').disabled = false;
		document.querySelector('#spinner').classList.add('hidden');
		document.querySelector('#button-text').classList.remove('hidden');
	}
};
// Calls stripe.confirmCardPayment
// If the card requires authentication Stripe shows a pop-up modal to
// prompt the user to enter authentication details without leaving your page.
const payWithCard = (stripe, card, clientSecret, customer) => {
	console.log("clientSecret", clientSecret)
	
	console.log("card", card)
	
	console.log("stripe", stripe)
	
	console.log("customer", customer)
	

};
const orderComplete = (paymentIntentId) => {
	loading(false);
	const url = 'https://dashboard.stripe.com/test/payments/' + paymentIntentId;
	$('#success').find('a').attr('href' , url)
	$('#success').css('visibility', 'visible');
	document.querySelector('button').disabled = true;
};
const validateForm = () => {
	// function luhnChecksum(code) {
	// 	var len = code.length;
	// 	var parity = len % 2;
	// 	var sum = 0;
	// 	for (var i = len - 1; i >= 0; i--) {
	// 		var d = parseInt(code.charAt(i));
	// 		if (i % 2 == parity) {
	// 			d *= 2;
	// 		}
	// 		if (d > 9) {
	// 			d -= 9;
	// 		}
	// 		sum += d;
	// 	}
	// 	return sum % 10;
	// }
	// /* luhn_validate
	//  * Return true if specified code (with check digit) is valid.
	//  */
	// function luhnValidate(fullcode) {
	// 	return luhnChecksum(fullcode) == 0;
	// }
	console.log("localStorage.getItem('stripeId')", localStorage.getItem('stripeId'))
	
	const order = new Order();
	const orderDict = localStorage.getItem('order');
	if (orderDict) {
		order.fromJSON(orderDict);
		if (localStorage.getItem('stripeId')) {
			const newCustomer = new Customer(null, localStorage.getItem('stripeId'));
			console.log("newCustomer", newCustomer)
			order.customerData = newCustomer
		}
		const forms = document.getElementsByClassName('needs-validation');
		const stripe = Stripe(
			'pk_test_51HkZexHlxrw6CLurXRJ1Z8xcNjsYrhP36BnoJz6q2i0B6gUrR1ViPANQZN6pcDH02rqVoujFG8PEj0ct5mkNw5lW00mGuA7PJZ'
		);
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
				console.log("data", data)
			
			
				const elements = stripe.elements();
				// var style = {
				// 	base: {
				// 		color: '#32325d',
				// 		fontFamily: 'Arial, sans-serif',
				// 		fontSmoothing: 'antialiased',
				// 		fontSize: '16px',
				// 		'::placeholder': {
				// 			color: '#32325d',
				// 		},
				// 	},
				// 	invalid: {
				// 		fontFamily: 'Arial, sans-serif',
				// 		color: '#fa755a',
				// 		iconColor: '#fa755a',
				// 	},
				// };
				const card = elements.create('card');
				// Stripe injects an iframe into the DOM
				card.mount('#cc-card');
				card.on('change', function (event) {
					console.log('event', event);
					// Disable the Pay button if there are no card details in the Element
					document.querySelector('#checkoutButton').disabled = event.empty;
					if (event.error) {
						document.querySelector('#checkoutButton').disabled = true;
						document.querySelector('#cardError').textContent = event.error ? event.error.message : '';
						$('#cardError').show();
					} else if (!event.complete) {
						document.querySelector('#cardError').textContent = 'Please enter a valid card date';
					}
					else {
						document.querySelector('#checkoutButton').disabled = false;
						document.querySelector('#cardError').textContent = ''
						$('#cardError').hide();
					}
				});
				card.on('ready', function (event) {
					// Disable the Pay button if there are no card details in the Element
					if (!event.empty) {
						document.querySelector('#cardError').textContent = 'Please enter a valid card number';
					} else if (!event.complete) {
						document.querySelector('#cardError').textContent = 'Please complete the required card information';
					}
				});
				// Loop over them and prevent submission
				//https://gomakethings.com/what-the-hell-is-the-call-method-and-when-should-you-use-it/
				Array.prototype.filter.call(forms, function (form) {
					$('#checkoutButton')
						.unbind('click')
						.bind('click', function (event) {
							if (form.checkValidity() === false) {
								form.classList.add('was-validated');
								return false;
							} else {
								if (document.querySelector('#cardError').textContent) {
									$('#cardError').show();
									return false;
								}
								else {
									form.classList.add('was-validated');
									handleFormSubmit(stripe, card, data);
									return false;
								}
							
							}
						});
				});
			});
	}
};

$(window).ready(function () {
	buildPage();
	validateForm();
});
