// Example starter JavaScript for disabling form submissions if there are invalid fields
//https://www.codeply.com/p?starter=Bootstrap&ex=Sh3KmpOVTc
('use strict');
import { humanize } from './model.js';

import { Order, Customer, Coffee } from './model.js';

const handleFormSubmit = () => {
	const order = new Order();
	order.fromJSON(localStorage.getItem(localStorage.key(0)));
	const response = {};
	const customerData = {};
	const paymentInfo = {};
	$('input, select', $('#checkoutForm')).each(function () {
		console.log('thisVal', $(this).val());
		console.log('thisKey', $(this).attr('id'));
		console.log('thisSer', $(this).serialize());

		if ($(this).serialize() == 'paymentMethod=on') {
			paymentInfo['paymentMethod'] = $(this).attr('id');
		} else if (
			$(this).attr('id') === 'cc-name' ||
			$(this).attr('id') === 'cc-number' ||
			$(this).attr('id') === 'cc-expiration' ||
			$(this).attr('id') === 'cc-cvv'
		) {
			paymentInfo[$(this).attr('id')] = $(this).val();
		} else if ($(this).val() != '' && $(this).val() != 'on') {
			customerData[$(this).attr('id')] = $(this).val();
		}
	});
	customerData['paymentInformation'] = paymentInfo;
	console.log('customerData: %s', JSON.stringify(customerData));
	const newCustomer = new Customer(customerData);
	order.customerData = newCustomer;
	console.log('order', order);

	// const stringifiedOrder = JSON.stringify(order)
	response['order'] = order;
	const JSONResponse = JSON.stringify(response);
	console.log('jsonValue', JSONResponse);
	console.log('response', response);

	$.ajax({
		url: '/checkout',
		data: JSONResponse,
		dataType: 'json',
		type: 'POST',
		contentType: 'application/json',
		success: (response) => console.log('console.log success', response),
		// success: () => location.assign('/order/confirmation'),
		error: (response) => console.log('console.log error', response),
	});
};
const buildPage = () => {
	const key = localStorage.key(0);
	const orderDict = localStorage.getItem(key);
	const order = new Order();
	order.fromJSON(orderDict);
	console.log('order', order);

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
							`<li class="list-group-item d-flex justify-content-between lh-condensed" id="crepeRow${i}${
								j + 1
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
							`<li class="list-group-item d-flex justify-content-between lh-condensed" id="crepeRow${i}${
								j + 1
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
							console.log('drink', drink);

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
							`<li class="list-group-item d-flex justify-content-between lh-condensed" id="checkoutDrinkRow${i}${
								j + 1
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
							`<li class="list-group-item d-flex justify-content-between lh-condensed" id="checkoutSideRow${i}${
								j + 1
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
									`<li class="list-group-item d-flex justify-content-between lh-condensed" id="checkoutSideRow${i}${
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
							`<li class="list-group-item d-flex justify-content-between lh-condensed" id="checkoutSideRow${i}${
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
	}
};
const validateForm = () => {
	const forms = document.getElementsByClassName('needs-validation');
	// Loop over them and prevent submission
	//https://gomakethings.com/what-the-hell-is-the-call-method-and-when-should-you-use-it/
	Array.prototype.filter.call(forms, function (form) {
		$('#checkoutButton')
			.unbind('click')
			.bind('click', function () {
				if (form.checkValidity() === false) {
					form.classList.add('was-validated');
					return false;
				} else {
					handleFormSubmit();
					return false;
				}
			});
	});
}

$(window).ready(function () {
	buildPage();
	validateForm();
});
