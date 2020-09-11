//https://stackoverflow.com/questions/15876302/uncaught-typeerror-cannot-read-property-clientwidth-of-null
//https://stackoverflow.com/questions/4381228/jquery-selector-inside-the-each-method
//https://stackoverflow.com/questions/4735342/jquery-to-loop-through-elements-with-the-same-class

// var dripBool = false;
// var latteBool = false;
var iceCreamBool = false;

// class side {
// 	constructor(name = undefined, price = undefined, quantity = undefined) {
// 		this.name = name;
// 		this.price = price;
// 		this.quantity = quantity;
// 		this.makeSound = () => console.log(`The ${this.name} named ${this.price} goes ${this.quantity}!`);
// 	}
// }

// class thisOrder {
// 	constructor(orderSide = new Array()) {
// 		this.orderSide = orderSide;
// 		this.display = () => alert(this.orderSide);
// 	}

// 	addSide = (side) => {
// 		this.orderSide.push(side);
// 	};

// 	alertSides = () => {
// 		for (var i = 0; i < this.orderSide.length; i++) {
// 			this.orderSide[i].makeSound();
// 		}
// 		{
// 		}
// 	};
// }

function stringify(dataObject) {
	// there will only ever be one item in local storage because a customer can only have 1 order in their shopping cart.
	// the object is a dictionary with a key called order and the value being an array which will hold each crepe as either a menu crepe object
	// or an orderCrepe array, the order props, a drinks array, and a sides array
	if (localStorage.length > 0) {
		const order = JSON.parse(localStorage.getItem(localStorage.key(0)));
		console.log('order local stor > 0', order);
		if ('orderSide' in order) {
			order['orderSide'].push(dataObject);
			const stringifiedDataObject = JSON.stringify(order);
			console.log('stringifiedDataObject', stringifiedDataObject);
			localStorage.setItem('order', stringifiedDataObject);
		} else {
			order['orderSide'] = [];
			order['orderSide'].push(dataObject);
			const stringifiedDataObject = JSON.stringify(order);
			console.log('order', order);
			console.log('stringifiedDataObject', stringifiedDataObject);
			localStorage.setItem('order', stringifiedDataObject);
		}
	} else {
		const order = {};
		order['orderSide'] = [];
		order['orderSide'].push(dataObject);
		const stringifiedDataObject = JSON.stringify(order);
		console.log('order', order);
		console.log('stringifiedDataObject', stringifiedDataObject);
		localStorage.setItem('order', stringifiedDataObject);
	}
	for (i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		console.log('key: %s', key);

		var value = localStorage[key];
		console.log('value: %s', value);
	}
	return true;
}

function getCSSToppingName(element) {
	var toppingCategory = $(element).closest('.card-deck').attr('id');
	var toppingName = $(element).closest('.card').find('.card-title').text().split(' ');
	var formattedtoppingName = '';

	if (toppingName.length > 1) {
		const firstName = toppingName[0].toLowerCase();
		formattedtoppingName += firstName;
		for (var i = 1; i < toppingName.length; i++) {
			const otherPartsOftoppingName = toppingName[i];
			formattedtoppingName += otherPartsOftoppingName;
		}
		toppingName = formattedtoppingName;
	} else {
		toppingName = toppingName[0].toLowerCase();
	}
	var resultArray = [];
	resultArray.push(toppingCategory);
	resultArray.push(toppingName);
	return resultArray;
}

function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}
function checkIfIceCreamSelected() {
	iceCreamBool = false;
	console.log('iceCreamBool check if ice cream: %s', iceCreamBool);

	$(`#ice_cream_bowl`)
		.find('.btn2')
		.each(function () {
			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			var toppingCategory = toppingCategoryAndToppingNameArray[0];
			var toppingName = toppingCategoryAndToppingNameArray[1];
			if ($(this).css(`--${toppingCategory}`) == toppingName) {
				iceCreamBool = true;
			}
		});

	if (iceCreamBool) {
		$('#toppings').each(function () {
			console.log('coffee_syrup & milk $(this) PT2', $(this));
			$(this)
				.find('.card')
				.each(function () {
					$(this).css('opacity', '1');
				});
			$('#errorTopping').hide();
		});
	} else {
		// if you unselected ice crean then we need to reset the topping values
		var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
		var toppingCategory = toppingCategoryAndToppingNameArray[0];
		$('#toppings')
			.find('.card')
			.each(function () {
				// console.log($(this), '$(this2)');
				$(this).css('opacity', '.3');
				$(this).find('.btn2').hide();
				// console.log('toppingName', toppingName);
				// console.log('toppingCat', toppingCategory);
				// console.log(
				// 	'css val for topping cat b4 false',
				// 	$(this).find('.btn2').css(`--${toppingCategory}`)
				// );
				$(this).find('.btn2').css(`--${toppingCategory}`, 'false');
				// console.log(
				// 	'css val for topping cat after false',
				// 	$(this).find('.btn2').css(`--${toppingCategory}`)
				// );
				$(this).find('.btn').hide();
				$(this).find('.btn2').css('--regular', 'false');
				$(this).find('.btn2').css('--half', 'false');
				$(this).find('.btn2').css('--extra', 'false');
			});
		// console.log('coffeeBool false');
		$('#errorTopping').show();
	}
	console.log('iceCreamBool check if ice cream: %s', iceCreamBool);
}
//format the document
$(window).on('load', function () {
	$('.card').each(function (i) {
		this.id = 'card' + i;
	});

	// need to distinguish between the flavor and the name of the side for the backend
	// the logic for the croissant if different from the ice cream
	$('#croissant')
		.find('.card')
		.each(function () {
			const toppingArray = $(this).closest('.card').find('.card-title').text().split(' ');

			var flavor = '';
			if (toppingArray.length > 1) {
				// the flavor of the croissant will always be all the words in card title besides the last word which will be the topping category
				// im storing the flavor using camelcase to keep with previous convention
				for (var i = 0; i < toppingArray.length - 1; i++) {
					if (i == 0) {
						const firstWordInFlavor = toppingArray[i].toLowerCase();
						flavor += firstWordInFlavor;
					} else {
						const flavorWord = toppingArray[i];
						flavor += flavorWord;
					}
				}
				$(this).css('--flavor', `${flavor}`);
			} else {
				$(this).css('--flavor', `${toppingArray[0]}`);
			}
			console.log('flavor town: %s', $(this).css('--flavor'));
		});

	$('#ice_cream_bowl')
		.find('.card')
		.each(function () {
			const toppingArray = $(this).closest('.card').find('.card-title').text().split(' ');

			if (toppingArray.length > 1) {
				// the flavor of the ice cream will always be the first word in the card title
				const flavor = toppingArray[0].toLowerCase();
				$(this).css('--flavor', flavor);
				console.log('flavor town: %s', $(this).css('--flavor'));
			}
		});

	// const side1 = new side((name = 'ice_cream'), (price = 0.99), (quantity = 2));
	// const side2 = new side((name = 'croissant'), (price = 0.99), (quantity = 3));
	// const myOrder = new thisOrder();
	// myOrder.addSide(side1);
	// myOrder.addSide(side2);
	// myOrder.alertSides();
	// myOrder.display();

	//https://api.jquery.com/wrap/
	$('.card-img-top').wrap('<div class="container2"></div>');

	// $('.card-img-top').each(function () {
	//https://stackoverflow.com/questions/21556874/display-an-alert-in-jquery-for-a-few-seconds-then-fade-it-out
	// 	$('<button class="btn" type="button">Customize</button>').insertAfter($(this));
	// 	$('<button class="btn4" type="button">Regular</button>').insertAfter($(this));
	// 	$('<button class="btn3" type="button">Light</button>').insertAfter($(this));
	// 	$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
	// });

	$('#toppings')
		.find('.card')
		.each(function () {
			$(this).css('opacity', '.3');
		});

	$('.card-img-top').each(function (i) {
		if ($(this).closest('.card-deck').attr('id') == 'ice_cream_bowl') {
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
			$(`<div class="grid-container" id="bottled_drink${i}" style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
				$(this)
			);
		} else if ($(this).closest('.card-deck').attr('id') == 'croissant') {
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
			$(`<div class="grid-container" id="bottled_drink${i}" style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
				$(this)
			);
		} else if ($(this).closest('.card-deck').attr('id') == 'toppings') {
			$('<button class="btn" type="button">Customize</button>').insertAfter($(this));
			$('<button class="btn4" type="button">Regular</button>').insertAfter($(this));
			$('<button class="btn3" type="button">Light</button>').insertAfter($(this));
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		}
	});

	$('.btn2').each(function (i) {
		this.id = 'btn' + i;
		$(this).css('--quantity', 0);
		// var drinkName = $(this).closest('.card').find('.card-title').text().split(' ').pop().toLowerCase();

		var price = $(this).closest('.card').find('.card-text').text();
		if (price.trim() != '') {
			console.log('price', price);
			price = price.replace('$', '');
			// this is just for the almond milk which has extra in the price name
			if (price.split(' ').length > 1) {
				console.log('price', price);
				$(this).css('--price', price.split(' ').shift());
				console.log('price', price.split(' ').shift());
			} else {
				$(this).css('--price', price);
			}
			// console.log('--price', $(this).css('--price'));
		}
	});

	const x = document.getElementsByClassName('card-title');
	const y = [];

	for (i = 2; i < x.length; i++) {
		y.push(x[i].innerHTML);
	}

	$('.card-img-top').each(function () {
		this.src = '../static/images/vanilla_ice_cream.jpg';
		console.log('this.src: %s', this.src);
	});
	//veggie + all other topping functionality
	$(document)
		.on('mouseenter', '.card', function () {
			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			var toppingCategory = toppingCategoryAndToppingNameArray[0];
			var toppingName = toppingCategoryAndToppingNameArray[1];
			// console.log('tc', toppingCategory, 'tn', toppingName);

			if (
				$(this).find('.card-body').attr('id') != 'cardBody' &&
				$(this).closest('.card-deck').attr('id') != 'toppings'
			) {
				$(this).find('.card-body').css('opacity', '.3');
				$(this).find('.card-img-top').css('opacity', '.3');
				$(this).find('.btn').show();
			} else if ($(this).closest('.card-deck').attr('id') == 'toppings' && iceCreamBool) {
				$(this).find('.btn').show();
			}

			//click the card somewhere
			$(this)
				.find('.card-text, .card-title, .card-body, .card-img-top')
				.unbind('click')
				.bind('click', function () {
					var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
					console.log('toppingCategoryAndToppingNameArray: %s', toppingCategoryAndToppingNameArray);

					var toppingCategory = toppingCategoryAndToppingNameArray[0];
					console.log('toppingCategory: %s', toppingCategory);

					var toppingName = toppingCategoryAndToppingNameArray[1];
					console.log('toppingName: %s', toppingName);

					if ($(this).closest('.card-deck').attr('id') != 'toppings') {
						if (parseFloat($(this).closest('.card').find('.btn2').css('--quantity')) === 0) {
							$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
							$(this).closest('.card').find('.btn2').css('--quantity', 1);
							console.log('price', $(this).closest('.card-text').val());

							$(this).closest('.card').find('.btn2').html(1);
							$(this).closest('.card').find('.btn2').show();

							//after clicking the card show the + and - buttons
							$(this).closest('.card').find('.btn6').show();
							$(this).closest('.card').find('.btn7').show();
						}
					}

					// if you click the card and it hasn't been selected
					else if (
						$(this).closest('.card').find('.btn2').css('--extra') != 'true' &&
						$(this).closest('.card').find('.btn2').css('--half') != 'true' &&
						$(this).closest('.card').find('.btn2').css('--regular') != 'true' &&
						$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`) != toppingName
					) {
						if (iceCreamBool) {
							$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
							$(this).closest('.card').find('.btn2').css('--regular', 'true');
							console.log('veggieCraze', $(this).closest('.card').find('.btn2').css('--regular'));
							$(this).closest('.card').find('.btn2').html('✓');
							$(this).closest('.card').find('.btn2').toggle();
						}
						// } else if (
						// 	// otherwise make sure the card being clicked isn't milk or coffee syrup
						// 	$(this).closest('.card-deck').attr('id') != 'milk' &&
						// 	$(this).closest('.card-deck').attr('id') != 'coffee_syrup'
						// ) {
						// 	$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
						// 	$(this).closest('.card').find('.btn2').css('--regular', 'true');
						// 	// console.log(
						// 	// 	'anything but coffee syrup and milk',
						// 	// 	$(this).closest('.card').find('.btn2').css('--regular')
						// 	// );
						// 	$(this).closest('.card').find('.btn2').html('✓');
						// 	$(this).closest('.card').find('.btn2').toggle();
						// }
						// $(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
						// $(this).closest('.card').find('.btn2').css('--regular', 'true');
						// console.log('veggieCraze', $(this).closest('.card').find('.btn2').css('--regular'));
						// $(this).closest('.card').find('.btn2').html('✓');
						// $(this).closest('.card').find('.btn2').toggle();
					} else if ($(this).closest('.card').find('.btn2').css('--half') === 'true') {
						$(this).closest('.card').find('.btn2').css('--half', 'false');
						$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
						$(this).closest('.card').find('.btn2').toggle();
						//https://stackoverflow.com/questions/21286887/adding-check-marks-to-bootstrap-button-drop-down-items/46890814
						$(this).closest('.card').find('.btn2').html('✓');
					} else if ($(this).closest('.card').find('.btn2').css('--extra') === 'true') {
						console.log('dVeggies toggle');
						$(this).closest('.card').find('.btn2').css('--extra', 'false');
						$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
						$(this).closest('.card').find('.btn2').toggle();
						$(this).closest('.card').find('.btn2').html('✓');
					} else if ($(this).closest('.card').find('.btn2').css('--regular') === 'true') {
						$(this).closest('.card').find('.btn2').css('--regular', 'false');
						$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
						$(this).closest('.card').find('.btn2').toggle();
						$(this).closest('.card').find('.btn2').html('✓');
					}
					checkIfIceCreamSelected();
				});
		})
		.on('mouseleave', '.card', function () {
			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			var toppingCategory = toppingCategoryAndToppingNameArray[0];
			var toppingName = toppingCategoryAndToppingNameArray[1];
			// console.log('tc', toppingCategory, 'tn', toppingName);

			if (
				$(this).find('.btn2').css('--extra') != 'true' &&
				$(this).find('.btn2').css('--half') != 'true' &&
				$(this).find('.btn2').css('--regular') != 'true' &&
				$(this).find('.btn2').css(`--${toppingCategory}`) != toppingName
			) {
				$(this).find('.btn').hide();
				$(this).find('.btn3').hide();
				$(this).find('.btn4').hide();
			} else {
				$(this).find('.btn3').hide();
				$(this).find('.btn4').hide();
			}

			$(this).find('img').css('opacity', '1');
			$(this).find('.card-body').css('opacity', '1');
		});

	$('.btn')
		.unbind('click')
		.bind('click', function () {
			if ($(this).closest('.card-deck').attr('id') == 'toppings') {
				var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
				var toppingCategory = toppingCategoryAndToppingNameArray[0];
				var toppingName = toppingCategoryAndToppingNameArray[1];
				// console.log('tc', toppingCategory, 'tn', toppingName);
				if ($(this).html() == 'Customize') {
					//https://stackoverflow.com/questions/857245/is-there-a-jquery-unfocus-method
					$(this).blur();
					$(this).html('Extra');
					$(this).closest('.card').find('.btn3').show();
					$(this).closest('.card').find('.btn4').show();
				} else {
					$(this).closest('.card').find('.btn2').css('--half', 'false');
					$(this).closest('.card').find('.btn2').css('--regular', 'false');
					$(this).closest('.card').find('.btn2').css('--extra', 'true');
					$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
					$(this).html('Customize');
					$(this).blur();
					$(this).closest('.card').find('.btn2').html('2X');
					$(this).closest('.card').find('.btn2').show();
					$(this).closest('.card').find('.btn3').hide();
					$(this).closest('.card').find('.btn4').hide();
					// console.log('`--${toppingCategory}`, `${toppingName}`', `--${toppingCategory}`, `${toppingName}`);
				}
			}
		});

	$('.btn3')
		.unbind('click')
		.bind('click', function () {
			if ($(this).closest('.card-deck').attr('id') == 'toppings') {
				var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
				var toppingCategory = toppingCategoryAndToppingNameArray[0];
				var toppingName = toppingCategoryAndToppingNameArray[1];
				// console.log('tc', toppingCategory, 'tn', toppingName);
				$(this).closest('.card').find('.btn2').css('--half', 'true');
				$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
				$(this).closest('.card').find('.btn2').css('--regular', 'false');
				$(this).closest('.card').find('.btn2').css('--extra', 'false');
				$(this).closest('.card').find('.btn2').html('½');
				$(this).closest('.card').find('.btn2').show();
				$(this).hide();
				$(this).closest('.card').find('.btn3').hide();
				$(this).closest('.card').find('.btn4').hide();
				$(this).closest('.card').find('.btn').html('Customize');
				// console.log('`--${toppingCategory}`, `${toppingName}`', `--${toppingCategory}`, `${toppingName}`);
			}
		});

	$('.btn4')
		.unbind('click')
		.bind('click', function () {
			if ($(this).closest('.card-deck').attr('id') == 'toppings') {
				var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
				var toppingCategory = toppingCategoryAndToppingNameArray[0];
				var toppingName = toppingCategoryAndToppingNameArray[1];
				// console.log('tc', toppingCategory, 'tn', toppingName);
				$(this).closest('.card').find('.btn2').css('--regular', 'true');
				$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
				$(this).closest('.card').find('.btn2').css('--half', 'false');
				$(this).closest('.card').find('.btn2').css('--extra', 'false');
				$(this).closest('.card').find('.btn2').html('✓');
				$(this).closest('.card').find('.btn2').show();
				$(this).hide();
				$(this).closest('.card').find('.btn3').hide();
				$(this).closest('.card').find('.btn').html('Customize');
				console.log('`--${toppingCategory}`, `${toppingName}`', `--${toppingCategory}`, `${toppingName}`);
			}
		});

	$('.btn6')
		.unbind('click')
		.bind('click', function () {
			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			var toppingCategory = toppingCategoryAndToppingNameArray[0];
			var toppingName = toppingCategoryAndToppingNameArray[1];
			// console.log('tc', toppingCategory, 'tn', toppingName);
			var currentQuant = parseFloat($(this).closest('.card').find('.btn2').css('--quantity'));
			console.log('currentQuant: %s', currentQuant);

			// console.log('cuuremtQuant', currentQuant);
			currentQuant -= 1;
			console.log('currentQuant: %s', currentQuant);

			if (currentQuant === 0) {
				$(this).closest('.card').find('.btn2').hide();
				$(this).closest('.card').find('.btn2').html(`${currentQuant}`);
				$(this).closest('.card').find('.btn2').css('--quantity', currentQuant);
				$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
				$(this).hide();
				$(this).closest('.card').find('.btn7').hide();
			} else {
				$(this).closest('.card').find('.btn2').html(`${currentQuant}`);
				$(this).closest('.card').find('.btn2').show();
				$(this).closest('.card').find('.btn2').css('--quantity', currentQuant);
			}
			checkIfIceCreamSelected();
			console.log('.btn quant value', $(this).closest('.card').find('.btn2').css('--quantity'));
			console.log('.btn name value', $(this).closest('.card').find('.btn2').css('--drinkName'));
		});

	$('.btn7')
		.unbind('click')
		.bind('click', function () {
			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			var toppingCategory = toppingCategoryAndToppingNameArray[0];
			var toppingName = toppingCategoryAndToppingNameArray[1];
			// console.log('tc', toppingCategory, 'tn', toppingName);
			var currentQuant = parseFloat($(this).closest('.card').find('.btn2').css('--quantity'));
			// console.log('--price', $(this).css('--price'));
			currentQuant += 1;
			$(this).closest('.card').find('.btn2').html(`${currentQuant}`);
			$(this).closest('.card').find('.btn2').show();
			$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
			$(this).closest('.card').find('.btn2').css('--quantity', currentQuant);

			console.log('.btn quant value', $(this).closest('.card').find('.btn2').css('--quantity'));
		});
});
// checkout function
var orderToppingsDict = {};
var ingredientsDict = {};
orderToppingsDict['sides'] = [];
function checkOut() {
	$('.card-deck').each(function () {
		// create a side category (ex. coffee) for each key in the side dict

		ingredientsDict[`${$(this).attr('id')}`] = [];
	});

	$('.btn2').each(function () {
		var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
		var toppingCategory = toppingCategoryAndToppingNameArray[0];
		var toppingName = toppingCategoryAndToppingNameArray[1];
		// console.log(
		// 	'topping category and name before being true',
		// 	$(this).css(`--${toppingCategory}`),
		// 	'toppingCategory',
		// 	toppingCategory,
		// 	' toppingName',
		// 	toppingName
		// );
		if ($(this).css(`--${toppingCategory}`) == toppingName) {
			// console.log(
			// 	'topping category and name after being true',
			// 	$(this).css(`--${toppingCategory}`),
			// 	'toppingCategory',
			// 	toppingCategory,
			// 	' toppingName',
			// 	toppingName
			// );

			const toppingDictionary = {};
			// record the serving size of the topping
			if ($(this).css('--half') == 'true') {
				// $(this).css('--quantity', 1);
				toppingDictionary['servingSize'] = 'half';
			} else if ($(this).css('--regular') == 'true') {
				// $(this).css('--quantity', 1);
				toppingDictionary['servingSize'] = 'regular';
			} else if ($(this).css('--extra') == 'true') {
				// $(this).css('--quantity', 1);
				toppingDictionary['servingSize'] = 'extra';
			} else {
				toppingDictionary['servingSize'] = 'regular';
			}
			// record the topping name and price
			toppingDictionary['name'] = `${toppingName}`;
			if ($(this).css('--price')) {
				toppingDictionary['price'] = parseFloat($(this).css('--price'));
			} else {
				toppingDictionary['price'] = 0;
			}
			toppingDictionary['quantity'] = $(this).css('--quantity');

			if ($(this).css('--flavor')) {
				toppingDictionary['flavor'] = $(this).css('--flavor');
			}
			// console.log('ingredientsDict', ingredientsDict);

			ingredientsDict[`${toppingCategory}`].push(toppingDictionary);
		}
	});

	const orderItems = ingredientsDict;
	console.log('oldOrderItems', orderItems);
	//https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
	// var proteinCategoryCount = [];
	var orderTotal = 0;
	for (var key in orderItems) {
		const sidesForItemCategory = orderItems[key];
		console.log('sidesForItemCategory', sidesForItemCategory);
		if (sidesForItemCategory != []) {
			console.log('sidesForItemCategory', sidesForItemCategory);
			// if (key != 'protein') {
			for (var i = 0; i < sidesForItemCategory.length; i++) {
				console.log('key', key);
				var side = sidesForItemCategory[i];
				const itemQuantity = side['quantity'];
				const itemServingSize = side['servingSize'];
				console.log('preParse', side['price']);
				var itemPrice = side['price'];
				if (key === 'ice_cream_bowl') {
					console.log('itemQuantity', itemQuantity);
					console.log('itemPrice', itemPrice);
					const ice_cream_price = itemQuantity * itemPrice;
					const dictSource = {};
					dictSource['price'] = ice_cream_price;
					var ice_cream_name = side['name'];
					dictSource['name'] = ice_cream_name;
					orderTotal += ice_cream_price;
					Object.assign(side, dictSource);
				} else if (key === 'croissant') {
					console.log('itemQuantity', itemQuantity);
					console.log('itemPrice', itemPrice);
					const croissantPrice = itemQuantity * itemPrice;
					const dictSource = {};
					dictSource['price'] = croissantPrice;
					orderTotal += croissantPrice;
					Object.assign(side, dictSource);
				} else if (key === 'toppings') {
					var toppingPrice = 0;
					console.log('itemPrice: %s', itemPrice);
					console.log('itemServingSize: %s', itemServingSize);

					if (itemServingSize == 'half') {
						toppingPrice = itemPrice * 0.5;
					} else if (itemServingSize == 'regular') {
						toppingPrice = itemPrice;
					} else if (itemServingSize == 'extra') {
						toppingPrice = itemPrice * 2;
					}
					const dictSource = {};
					dictSource['price'] = toppingPrice;
					Object.assign(side, dictSource);
				}
			}
		}
	}
	// order items is a dictionary. i am getting the ice cream key of this dictionary, which has an array as its value. because the user can only choose one ice cream per visit to this page i can get the first element of the ice cream array and know that it will map to the ice cream whose toppings the user's toppings choices map to.
	// the data structure of the element in the ice cream value of the orderItems dictionary is another dictionary. it is within this dictionary that I now create a toppings key which will store the toppings dictionary.
	const toppingsDict = orderItems['toppings'];
	console.log('toppingsDict: %s', toppingsDict);

	orderItems['ice_cream_bowl'][0]['toppings'] = toppingsDict;
	// then i want to delete the toppings dictionary from the order items array so as not to have duplicative information
	delete orderItems['toppings'];
	console.log('newOrderItems', orderItems);

	orderToppingsDict['sides'] = ingredientsDict;
	console.log('sides dict', orderToppingsDict);
	console.log('orderToppingsDictwithIngredient', orderToppingsDict);
	//https://developer.mozilla.org/en-US/docs/Web/API/Window/location
	$.when(stringify(orderToppingsDict)).then(location.assign('/order?userOrder=True'));
	// });
}
// all this code changes display for smaller screen sizes
//https://stackoverflow.com/questions/15876302/uncaught-typeerror-cannot-read-property-clientwidth-of-null
var cWidth = $(window).width();
//https://stackoverflow.com/questions/1974788/combine-onload-and-onresize-jquery
$(window).on('load resize', function () {
	newWidth = $(window).width();

	if (cWidth < newWidth) {
		cWidth = newWidth;
	}

	if ($(window).width() < 767) {
		const a = document.getElementsByClassName('container');
		const b = document.getElementsByClassName('card-deck');
		const c = document.getElementsByClassName('card-title');
		const d = document.getElementsByClassName('card-text');
		const e = document.getElementsByClassName('card-img-top');
		const f = document.getElementsByClassName('card');
		const g = document.getElementsByClassName('h3');

		$('#crepeImg').css('margin-left', '0px');
		$('#cardText').css('margin-left', '0px');
		$('#cardText').css('margin-right', '0px');
		$('#cardText').css('margin-bottom', '20px');
		$('#cardBody').css('margin-left', '0px');

		var cardTitleValues = [];
		for (var i = 2; i < c.length; i++) {
			cardTitleValues.push(c[i].innerHTML);
		}

		const constCardTitleValues = [...cardTitleValues];
		var cardTextValues = [];
		for (var i = 1; i < d.length; i++) {
			cardTextValues.push(d[i].innerHTML);
		}

		const constCardTextValues = [...cardTextValues];
		var cardImgSrcValues = [];
		for (var i = 0; i < e.length; i++) {
			cardImgSrcValues.push(e[i].src);
		}

		const constCardImgSrcValues = [...cardImgSrcValues];
		const constBLength = b.length;
		var cardDeckTitleValues = [];
		for (var i = 0; i < g.length; i++) {
			cardDeckTitleValues.push(g[i].innerHTML);
		}

		var cardDeckChildrenLength = [];
		var constCardDeckNodes = [];
		for (i = 0; i < constBLength; i++) {
			clone = b[i].cloneNode(true);
			constCardDeckNodes.push(clone);
			var cardDeckCards = b[i].children;
			var counter = 0;
			for (j = 0; j < cardDeckCards.length; j++) {
				if (cardDeckCards[j].className == 'card') {
					counter += 1;
				}
			}
			cardDeckChildrenLength.push(counter);
		}

		for (i = 0; i < constBLength; i++) {
			removeAllChildNodes(b[i]);
		}

		for (i = 0; i < constBLength; i++) {
			var row = document.createElement('div');
			row.setAttribute('class', 'row');
			row.setAttribute('style', 'width: 100%');
			var listGroupTitle = document.createElement('div');
			//https://www.htmldog.com/guides/javascript/advanced/creatingelements/
			listGroupTitle.setAttribute('class', 'col-12 col-sm-12 col-lg-12 col-md-12');

			//https://stackoverflow.com/questions/3304014/how-to-interpolate-variables-in-strings-in-javascript-without-concatenation
			$(`#${constCardDeckNodes[i].id}`).removeClass('card-deck');
			$(`#${constCardDeckNodes[i].id}`).addClass('list-group');

			//need to move the iterator for each card deck to not get the prior deck's card titles
			var k;
			if (i == 0) {
				k = 0;
			} else {
				var priorChildLength = 0;
				for (m = 0; m < i; m++) {
					priorChildLength += cardDeckChildrenLength[m];
				}

				k = priorChildLength;
			}

			var stoppingPoint = k + cardDeckChildrenLength[i];
			for (k; k < stoppingPoint; k++) {
				var listValue = document.createElement('li');
				listValue.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
				listValue.setAttribute('style', 'width:100%');

				if (constCardTextValues[k]) {
					string1 = String(constCardTitleValues[k]);
					string2 = String(constCardTextValues[k]);
					var listValueText = string1 + '<br>' + string2;
					listValue.innerHTML = listValueText;
				} else {
					var listValueText = String(constCardTitleValues[k]);
					listValue.innerHTML = listValueText;
				}

				var imageParent = document.createElement('div');
				imageParent.setAttribute('class', 'image-parent');
				var img = document.createElement('img');
				img.setAttribute('src', constCardImgSrcValues[k]);
				img.setAttribute('class', 'img-fluid');
				imageParent.appendChild(img);

				listValue.appendChild(imageParent);
				listGroupTitle.append(listValue);
			}

			row.appendChild(listGroupTitle);
			x = document.getElementsByClassName('list-group');
			x[i].appendChild(row);
		}
	} else {
		$('#crepeImg').css('margin-left', '80px');
		$('#cardText').css('margin-left', '180px');
		$('#cardText').css('margin-right', '50px');
		$('#cardBody').css('margin-left', '170px');
	}
});
// TODO: add sauteed onions & peppers, pesto, dill

// this code reformats the page if the user goes from small screen size to large
//var doc = document;
//var cWidth = doc.body.clientWidth;
var cWidth = $(window).width();
$(window).on('resize', function () {
	newWidth = $(window).width();
	if (cWidth < newWidth) {
		cWidth = newWidth;
	}
	if ($(window).width() > 767) {
		location.reload();
	}
});
