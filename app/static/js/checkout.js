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
	var lastRowIndex = 0;
	for (var j = 0; j < localStorage.length; j++) {
		const stringifiedDataObject = localStorage.getItem(`order${localStorage.length - 1 - j}`);
		console.log('StringifiedDataObject', stringifiedDataObject);
		const customCrepeProps = JSON.parse(stringifiedDataObject);
		const customCrepeIngredients = customCrepeProps['ingredients'];
		console.log('customCrepeIngredients', customCrepeIngredients);
		//https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
		var formattedOtherToppings = [];
		for (var key in customCrepeIngredients) {
			if (key != 'orderTotal' && key != 'flavorProfile') {
				const topping = customCrepeIngredients[key];
				if (topping != '') {
					console.log('topping', topping);
					const formatDict = {};
					if (key != 'protein') {
						var format = '';
						for (var i = 0; i < topping.length; i++) {
							var toppingName = Object.keys(topping[i])[0];
							var toppingQuantity = topping[i][toppingName];
							if (toppingName != 'price') {
								toppingQuantity = capitalize(toppingQuantity);
								toppingName = splitCamelCaseToString(toppingName);
								format += toppingQuantity;
								format += ' ';
								format += toppingName;
								// there is an extra topping called price
								if (i != topping.length - 2) {
									format += ' and ';
								}
							} else {
								formatDict['price'] = toppingQuantity;
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
							var proteinName = Object.keys(protein[i])[0];
							var proteinQuantity = protein[i][proteinName];
							if (proteinName != 'price') {
								console.log('pq', proteinQuantity);
								console.log('pn', proteinName);
								proteinName = splitCamelCaseToString(proteinName);
								proteinQuantity = capitalize(proteinQuantity);
								formattedProtein += proteinQuantity;
								formattedProtein += ' ';
								formattedProtein += proteinName;
								// there is an extra topping called price
								if (i != protein.length - 2) {
									formattedProtein += ' and ';
								}
							} else {
								formatDict['price'] = proteinQuantity;
							}
						}

						formatDict['format'] = formattedProtein;
						formattedOtherToppings.unshift(formatDict);
					}
				}
			}
		}

		console.log('formattedOtherToppings', formattedOtherToppings);
		const checkoutCartLength = formattedOtherToppings.length;
		console.log('len', formattedOtherToppings.length);
		console.log('o', customCrepeIngredients);
		var subtotal = 0;
		// have to prepend here (insert item as first child of card body) because don't want to interfere with other items in the card body
		$(`#checkingCartBody0`).prepend(
			`<li class="list-group-item d-flex justify-content-between lh-condensed" style="border-top: 0px solid white;" id="flexRow${j}-1"></li>`
		);

		//because the crepes are being prepended their order is reversed, so this switches the order of iteration through the crepes to put them back in order
		$(`#flexRow${j}-1`).append(`<div id=""><h4>Crepe #${localStorage.length - j}</h4></div>`);

		$(
			`<li class="list-group-item d-flex justify-content-between lh-condensed" id="flexRow${j}0"></li>`
		).insertAfter(`#flexRow${j}-1`);
		if (j == 0) {
			lastRowIndex = checkoutCartLength + 1;
		}
		for (var i = 0; i < checkoutCartLength + 1; i++) {
			// index is longer than format toppings so we have to get the price inside the if blocks
			if (i == checkoutCartLength) {
				// add total price at the end

				$(`#flexRow${j}${i}`).append(
					`<h5 style="color: black; font-weight:bold;" id="span${j}${i}">Subtotal (USD)</h5>`
				);
				$(`<h5 style="font-weight:bold; color:black;">$${subtotal.toFixed(2)}</h5>`).insertAfter(
					`#span${j}${i}`
				);
				$(
					`<li class="list-group-item d-flex justify-content-between lh-condensed" style="border-top: 5px solid red" id="flexRow${j}${
						i + 1
					}"></li>`
				).insertAfter(`#flexRow${j}${i}`);
			} else if (i == checkoutCartLength - 1) {
				// if at the last row item add the list group item that doesn't have lh-condensed
				console.log('close');
				const price = formattedOtherToppings[i]['price'];
				subtotal += price;

				$(`#flexRow${j}${i}`).append(`<div id="div${j}${i}" ></div>`);
				$(`#div${j}${i}`).append(
					`<h6 class="my-0" id="h6${j}${i}">${formattedOtherToppings[i]['format']}</h6>`
				);
				$(`<h4 id="h4${j}${i}">${price.toFixed(2)}</h4>`).insertAfter($(`#div${j}${i}`));

				$(
					`<li class="list-group-item d-flex justify-content-between" id="flexRow${j}${i + 1}"></li>`
				).insertAfter($(`#flexRow${j}${i}`));
			} else {
				const price = formattedOtherToppings[i]['price'];
				subtotal += price;

				$(`#flexRow${j}${i}`).append(`<div id="div${j}${i}" ></div>`);
				$(`#div${j}${i}`).append(
					`<h6 class="my-0" id="h6${j}${i}">${formattedOtherToppings[i]['format'].replace(
						'Regular ',
						''
					)}</h6>`
				);
				$(`<h4 id="h4${j}${i}">${price.toFixed(2)}</h4>`).insertAfter($(`#div${j}${i}`));

				$(
					`<li class="list-group-item d-flex justify-content-between lh-condensed" id="flexRow${j}${
						i + 1
					}"></li>`
				).insertAfter($(`#flexRow${j}${i}`));
			}
		}
		orderTotal += subtotal;
	}

	$(`<li class="list-group-item d-flex justify-content-between lh-condensed" style="border-top: 0px solid white"><h4 style="color: black; font-weight:bold;">Order Total (USD)</h4>
							<h4 style="font-weight:bold; color:black;">$${orderTotal.toFixed(2)}</h4>
			</li>`).insertAfter($(`#flexRow0${lastRowIndex}`));
	$(`#flexRow${localStorage.length - 1}-1`).css('border-top', '');

	x = document.getElementsByClassName('badge badge-secondary badge-pill')[0].setAttribute('id', 'foo');
	$('#foo').html(`${localStorage.length}`);
});
