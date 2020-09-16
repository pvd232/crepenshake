//https://stackoverflow.com/questions/15876302/uncaught-typeerror-cannot-read-property-clientwidth-of-null
//https://stackoverflow.com/questions/4381228/jquery-selector-inside-the-each-method
//https://stackoverflow.com/questions/4735342/jquery-to-loop-through-elements-with-the-same-class

var coffeeBool = false;
var milkBool = false;
var editDrinkIndex = undefined;
var editDrink = undefined;
// var dripBool = false;
// var latteBool = false;

function jq(myid) {
	return myid.replace(/(:|\.|\[|\]|%|,|=|@)/g, '\\$1');
}
function stringify(dataObject) {
	console.log('dataObject drank: %s', dataObject['drinks']);
	var orderBool = false;
	for (key in dataObject['drinks']) {
		console.log(key);
		console.log(dataObject['drinks'][key]);
		if (dataObject['drinks'][key].length) {
			orderBool = true;
		}
	}
	// there will only ever be one item in local storage because a customer can only have 1 order in their shopping cart.
	// the object is a dictionary with a key called order and the value being an array which will hold each crepe as either a menu crepe object
	if (orderBool) {
		if (editDrinkIndex === undefined) {
			if (localStorage.length > 0) {
				const order = JSON.parse(localStorage.getItem(localStorage.key(0)));
				console.log('order local stor > 0', order);
				if ('orderDrink' in order) {
					order['orderDrink'].push(dataObject);
					const stringifiedDataObject = JSON.stringify(order);
					console.log('stringifiedDataObject', stringifiedDataObject);
					localStorage.setItem('order', stringifiedDataObject);
				} else {
					order['orderDrink'] = [];
					order['orderDrink'].push(dataObject);
					const stringifiedDataObject = JSON.stringify(order);
					console.log('order', order);
					console.log('stringifiedDataObject', stringifiedDataObject);
					localStorage.setItem('order', stringifiedDataObject);
				}
			} else {
				const order = {};
				order['orderDrink'] = [];
				order['orderDrink'].push(dataObject);
				const stringifiedDataObject = JSON.stringify(order);
				console.log('order', order);
				console.log('stringifiedDataObject', stringifiedDataObject);
				localStorage.setItem('order', stringifiedDataObject);
			}
		} else {
			var currentOrder = JSON.parse(localStorage.getItem(localStorage.key(0)));
			var currentOrderDrinkList = currentOrder['orderDrink'];
			var currentOrderDrink = currentOrderDrinkList[editDrinkIndex];
			Object.assign(currentOrderDrink, dataObject);
			// if a previously had two proteins and then i remove one then i will have an empty object in my array that i don't want
			for (var i = 0; i < currentOrderDrinkList.length; i++) {
				if (currentOrderDrinkList[i] === {}) {
					currentOrderDrinkList.splice(i);
				}
			}
			localStorage.setItem('order', JSON.stringify(currentOrder));
		}
	}

	for (i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		console.log('key: %s', key);

		var value = localStorage[key];
		console.log('value: %s', value);
	}
	return true;
}

function checkIfCoffeeSelected() {
	coffeeBool = false;
	// dripBool = false;
	// latteBool = false;
	$(`#coffee`)
		.find('.btn2')
		.each(function () {
			// console.log('.btn2 classname', $(this).attr('class'));
			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			var toppingCategory = toppingCategoryAndToppingNameArray[0];
			var toppingName = toppingCategoryAndToppingNameArray[1];
			// console.log('tcat && tname', toppingCategory, toppingName);
			if ($(this).css(`--${toppingCategory}`) == toppingName) {
				coffeeBool = true;
				// if ($(this).css('--drip') === 'true') {
				// 	dripBool = true;
				// 	console.log('dripBool true');
				// }
				// if ($(this).css('--latte') === 'true') {
				// 	console.log('latte');
				// 	latteBool = true;
				// }
			}
		});
}

function checkIfMilkSelected() {
	milkBool = false;
	// dripBool = false;
	// latteBool = false;
	$(`#milk`)
		.find('.btn2')
		.each(function () {
			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			var toppingCategory = toppingCategoryAndToppingNameArray[0];
			var toppingName = toppingCategoryAndToppingNameArray[1];
			if ($(this).css(`--${toppingCategory}`) == toppingName) {
				milkBool = true;
			}
		});
	milkBool;
	console.log('milkBoolPost: %s', milkBool);
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
		toppingName = toppingName[0];
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

//format the document
$(window).on('load', function () {
	$('.card').each(function () {
		var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
		var toppingName = toppingCategoryAndToppingNameArray[1];
		this.id = toppingName;
	});

	//https://api.jquery.com/wrap/
	$('.card-img-top').wrap('<div class="container2"></div>');

	// $('.card-img-top').each(function () {
	//https://stackoverflow.com/questions/21556874/display-an-alert-in-jquery-for-a-few-seconds-then-fade-it-out
	// 	$('<button class="btn" type="button">Customize</button>').insertAfter($(this));
	// 	$('<button class="btn4" type="button">Regular</button>').insertAfter($(this));
	// 	$('<button class="btn3" type="button">Light</button>').insertAfter($(this));
	// 	$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
	// });

	$('.card-img-top').each(function (i) {
		if ($(this).closest('.card-deck').attr('id') == 'coffee_syrup') {
			$('<button class="btn" type="button">Customize</button>').insertAfter($(this));
			$('<button class="btn4" type="button">1 Pump</button>').insertAfter($(this));
			$('<button class="btn3" type="button">½ Pump</button>').insertAfter($(this));
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		} else if ($(this).closest('.card-deck').attr('id') == 'coffee') {
			$('<button class="btn" type="button">Customize</button>').insertAfter($(this));
			$('<button class="btn4" type="button">2 Espresso Shots</button>').insertAfter($(this));
			$('<button class="btn3" type="button">Decaf</button>').insertAfter($(this));
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		} else if (
			$(this).closest('.card-deck').attr('id') == 'bottled' ||
			$(this).closest('.card-deck').attr('id') == 'milkshake' ||
			$(this).closest('.card-deck').attr('id') == 'non-coffee'
		) {
			$(`<div class="grid-container" id="bottled_drink${i}" style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
				$(this)
			);
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		} else if (
			$(this).closest('.card-deck').attr('id') != 'milkshake' &&
			$(this).closest('.card-deck').attr('id') != 'non-coffee' &&
			$(this).closest('.card-deck').attr('id') != 'bottled'
		) {
			$('<button class="btn" type="button">Customize</button>').insertAfter($(this));
			$('<button class="btn4" type="button">Regular</button>').insertAfter($(this));
			$('<button class="btn3" type="button">Light</button>').insertAfter($(this));
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		} else if (
			$(this).closest('.card-deck').attr('id') == 'milkshake' ||
			$(this).closest('.card-deck').attr('id') == 'non-coffee' ||
			$(this).closest('.card-deck').attr('id') == 'bottled'
		) {
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		}
	});

	$('.btn2').each(function (i) {
		this.id = 'btn' + i;
		$(this).css('--quantity', 0);
		// var drinkName = $(this).closest('.card').find('.card-title').text().split(' ').pop().toLowerCase();
		// console.log('drinkName1', drinkName);

		// if (drinkName === 'latte') {
		// 	// console.log('latte');
		// 	$(this).css('--latte', 'true');
		// }

		// drip coffee is the only coffee with "coffee" in the name so it will be the only element to return coffee as the last element
		// if (drinkName == 'coffee') {
		// 	// console.log('drip');
		// 	$(this).css('--drip', 'true');
		// }
		// }
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

		// if ($(this).css('--price')) {
		// 	console.log('--price', $(this).css('--price'));
		// }
		// console.log($(this).css('--price'));
	});

	$('#milk, #coffee_syrup').each(function () {
		// console.log('coffee_syrup & milk $(this)', $(this));
		$(this)
			.find('.card')
			.each(function () {
				$(this).css('opacity', '.3');
			});
	});

	if ($('.edit').length) {
		editDrinkIndex = $('.edit').first().attr('id');
		console.log('editDrinkIndex: %s', editDrinkIndex);

		// const editDrinkArray = editDrinkParam.split('-');
		//have to subtract one because the drink index on the shopping cart is 1 higher than the array index
		// editDrinkIndex = parseInt(editDrinkArray[editDrinkArray.length - 1]) - 1;
		editDrink = JSON.parse(localStorage.getItem(localStorage.key(0)))['orderDrink'][editDrinkIndex];
		console.log('editDrink: %s', editDrink);

		const drinkDict = editDrink['drinks'];
		for (var drinkCategoryKey in drinkDict) {
			console.log('drinkCategoryKey: %s', drinkCategoryKey);

			const drinkArray = drinkDict[drinkCategoryKey];
			console.log('drinkArray: %s', drinkArray);
			if (drinkCategoryKey === 'coffee') {
				for (var i = 0; i < drinkArray.length; i++) {
					const drink = drinkArray[i];
					if ('name' in drink) {
						console.log('drink name: %s', drink['name']);
						const drinkName = drink['name'];
						const drinkServingSize = drink['servingSize'];
						const drinkQuantity = drink['quantity'];
						console.log('drinkQuantity: %s', drinkQuantity);

						const milk = drink['milk'];
						console.log('milk: %s', milk);

						const milkName = milk['name'];
						const milkServingSize = milk['servingSize'];

						const espresso = drink['espresso'];
						console.log('espresso: %s', espresso);

						const espressoQuantity = espresso['quantity'];
						console.log('espressoQuantity: %s', espressoQuantity);

						$(`#${drinkName}`).find('.btn2').css(`--${drinkCategoryKey}`, `${drinkName}`);
						$(`#${drinkName}`).find('.btn2').css(`--quantity`, `${drinkQuantity}`);

						if (espressoQuantity === 3) {
							$(`#${drinkName}`).find('.btn2').html('3x');
							$(`#${drinkName}`).find('.btn2').show();
							$(`#${drinkName}`).find('.btn').show();
							$(`#${drinkName}`).find('.btn2').css('--extra', 'true');
						} else if (espressoQuantity === 2) {
							$(`#${drinkName}`).find('.btn2').html('✓');
							$(`#${drinkName}`).find('.btn2').show();
							$(`#${drinkName}`).find('.btn').show();

							$(`#${drinkName}`).find('.btn2').css('--regular', 'true');
						} else if (espressoQuantity === 1) {
							$(`#${drinkName}`).find('.btn2').html('½');
							$(`#${drinkName}`).find('.btn2').show();
							$(`#${drinkName}`).find('.btn').show();

							$(`#${drinkName}`).find('.btn2').css('--half', 'true');
						}
						// set all the milk props
						$(`#${jq(milkName)}`)
							.find('.btn2')
							.css(`--${drinkCategoryKey}`, `${milkName}`);
						$(`#${jq(milkName)}`)
							.find('.btn2')
							.css(`--${milkServingSize}`, 'true');
						$(`#${jq(milkName)}`)
							.closest('.card')
							.css('opacity', '1');
						$('#errorMilk').hide();

						if (milkServingSize === 'extra') {
							$(`#${jq(milkName)}`)
								.find('.btn2')
								.html('2x');
							$(`#${jq(milkName)}`)
								.find('.btn2')
								.show();
							$(`#${jq(milkName)}`)
								.find('.btn')
								.show();
							$(`#${jq(milkName)}`)
								.find('.btn2')
								.css('--extra', 'true');
						} else if (milkServingSize === 'regular') {
							$(`#${jq(milkName)}`)
								.find('.btn2')
								.html('✓');
							$(`#${jq(milkName)}`)
								.find('.btn2')
								.show();
							$(`#${jq(milkName)}`)
								.find('.btn')
								.show();

							$(`#${jq(milkName)}`)
								.find('.btn2')
								.css('--regular', 'true');
						} else if (milkServingSize === 'half') {
							$(`#${jq(milkName)}`)
								.find('.btn2')
								.html('½');
							$(`#${jq(milkName)}`)
								.find('.btn2')
								.show();
							$(`#${jq(milkName)}`)
								.find('.btn')
								.show();

							$(`#${jq(milkName)}`)
								.find('.btn2')
								.css('--half', 'true');
						}

						console.log('drinkServingSize: %s', drinkServingSize);
					}
				}
				checkIfCoffeeSelected();
				if (coffeeBool) {
					$('#coffee_syrup')
						.find('.card')
						.each(function () {
							$(this).css('opacity', '1');
						});
					$('#errorSyrup').hide();
					$('#coffee')
						.find('.card')
						.each(function () {
							var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
							var toppingCategory = toppingCategoryAndToppingNameArray[0];
							var toppingName = toppingCategoryAndToppingNameArray[1];
							// make sure that you don't hide the already selected coffee
							if ($(this).find('.btn2').css(`--${toppingCategory}`) != toppingName) {
								$(this).css('opacity', '.3');
							}
						});
				}
			} else {
				for (var i = 0; i < drinkArray.length; i++) {
					const drink = drinkArray[i];
					if ('name' in drink) {
						// i add the word milkshake to each name for formatting so i have to remove it for the html element id to be recognized
						const nonCoffeeDrinkName = drink['name'].replace('Milkshake', '');
						console.log('nonCoffeeDrinkName: %s', nonCoffeeDrinkName);

						const nonCoffeeDrinkQuantity = drink['quantity'];
						const nonCoffeeDrinkServingSize = drink['servingSize'];
						$(`#${nonCoffeeDrinkName}`).find('.btn2').css(`--${drinkCategoryKey}`, `${nonCoffeeDrinkName}`);
						$(`#${nonCoffeeDrinkName}`).find('.btn2').css(`--${nonCoffeeDrinkServingSize}`, 'true');
						$(`#${nonCoffeeDrinkName}`).find('.btn2').css(`--quantity`, `${nonCoffeeDrinkQuantity}`);
						$(`#${nonCoffeeDrinkName}`).find('.btn2').html(nonCoffeeDrinkQuantity);
						$(`#${nonCoffeeDrinkName}`).find('.btn2').show();
						$(`#${nonCoffeeDrinkName}`).find('.btn6').show();
						$(`#${nonCoffeeDrinkName}`).find('.btn7').show();
					}
				}
			}
		}

		for (var key in editDrink) {
			console.log(key);
			console.log(editDrink[key]);
		}
		console.log('editDrink: %s', editDrink);

		console.log('editDrinkIndex: %s', editDrinkIndex);

		console.log('editDrink: %s', editDrink);
	}
	var x = document.getElementsByClassName('card-title');
	var y = [];

	for (i = 2; i < x.length; i++) {
		y.push(x[i].innerHTML);
	}

	$('.card-img-top').each(function () {
		// this.src = '/static/images/' + y[j] + '.jpg';
		this.src = '/static/images/steak.jpg';
	});
	//veggie + all other topping functionality
	$(document)
		.on('mouseenter', '.card', function () {
			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			var toppingCategory = toppingCategoryAndToppingNameArray[0];
			var toppingName = toppingCategoryAndToppingNameArray[1];
			console.log('tc', toppingCategory, 'tn', toppingName);
			checkIfCoffeeSelected();
			if ($(this).find('.card-body').attr('id') != 'cardBody') {
				if (
					$(this).closest('.card-deck').attr('id') != 'milk' &&
					$(this).closest('.card-deck').attr('id') != 'coffee_syrup'
				) {
					if ($(this).closest('.card-deck').attr('id') != 'coffee') {
						$(this).find('.card-body').css('opacity', '.3');
						$(this).find('.card-img-top').css('opacity', '.3');
						$(this).find('.btn').show();
						// if the selected card is coffee but a coffee has not been previously selected
					} else if (!coffeeBool) {
						console.log('see if the card-deck id is coffee', $(this).closest('.card-deck').attr('id'));
						$(this).find('.card-body').css('opacity', '.3');
						$(this).find('.card-img-top').css('opacity', '.3');
						$(this).find('.btn').show();
					}
				} else if (coffeeBool && $(this).closest('.card-deck').attr('id') === 'coffee_syrup') {
					$(this).find('.card-body').css('opacity', '.3');
					$(this).find('.card-img-top').css('opacity', '.3');
					$(this).find('.btn').show();
				} else if (coffeeBool && $(this).closest('.card-deck').attr('id') === 'milk') {
					checkIfMilkSelected();
					console.log('milkBool in click: %s', milkBool);

					if (!milkBool) {
						$(this).find('.card-body').css('opacity', '.3');
						$(this).find('.card-img-top').css('opacity', '.3');
					}
				}
				// if a coffee is selected but not a latte or drip coffee then fade the card out and show the customize button
				// else if (coffeeBool && !dripBool && !latteBool) {
				// 		// milk card logic
				// 		$(this).find('.card-body').css('opacity', '.3');
				// 		$(this).find('.card-img-top').css('opacity', '.3');
				// 		$(this).find('.btn').show();
				// 	}
				// 	// if a coffee is selected and it is a latte or drip coffee then fade the card out and do not show the customize button
				// 	else if ((coffeeBool && latteBool) || (coffeeBool && dripBool)) {
				// 		$(this).find('.card-body').css('opacity', '.3');
				// 		$(this).find('.card-img-top').css('opacity', '.3');
				// 	}
			}

			//click the card somewhere
			$(this)
				.find('.card-text, .card-title, .card-body, .card-img-top')
				.unbind('click')
				.bind('click', function () {
					var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
					var toppingCategory = toppingCategoryAndToppingNameArray[0];
					var toppingName = toppingCategoryAndToppingNameArray[1];
					checkIfCoffeeSelected();
					if (
						$(this).closest('.card-deck').attr('id') === 'bottled' ||
						$(this).closest('.card-deck').attr('id') === 'non-coffee' ||
						$(this).closest('.card-deck').attr('id') === 'milkshake'
					) {
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
					// if you click the card and it hasn't been selected and isnt bottled or non-coffee or milkshake
					else if (
						$(this).closest('.card').find('.btn2').css('--extra') != 'true' &&
						$(this).closest('.card').find('.btn2').css('--half') != 'true' &&
						$(this).closest('.card').find('.btn2').css('--regular') != 'true' &&
						$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`) != toppingName
					) {
						// 'console.log(checkIfCoffeeSelected(coffee)', console.log(checkIfCoffeeSelected('coffee'));
						// if a coffee has been selected already then milk or coffee_syrup can be selected
						if (coffeeBool) {
							// if coffee has been selected alredy then we don't want to select another coffee!
							if ($(this).closest('.card-deck').attr('id') != 'coffee') {
								//make sure the selected card isn't milk because we want extra logic in there to make sure a milk hasn't already been selected
								if ($(this).closest('.card-deck').attr('id') != 'milk') {
									$(this)
										.closest('.card')
										.find('.btn2')
										.css(`--${toppingCategory}`, `${toppingName}`);
									$(this).closest('.card').find('.btn2').css('--regular', 'true');
									console.log('veggieCraze', $(this).closest('.card').find('.btn2').css('--regular'));
									$(this).closest('.card').find('.btn2').html('✓');
									$(this).closest('.card').find('.btn2').toggle();
								}
								// if the selected card is milk
								else {
									console.log('milkBooooool: %s', milkBool);
									checkIfMilkSelected();
									// make sure a milk hasn't already been selected
									if (!milkBool) {
										console.log(';weeewew');
										$(this)
											.closest('.card')
											.find('.btn2')
											.css(`--${toppingCategory}`, `${toppingName}`);
										$(this).closest('.card').find('.btn2').css('--regular', 'true');
										console.log(
											'veggieCraze',
											$(this).closest('.card').find('.btn2').css('--regular')
										);
										$(this).closest('.card').find('.btn2').html('✓');
										$(this).closest('.card').find('.btn2').toggle();
										// if a milk has been selected then we want to make sure all the other milk cards are knocked out
										//and we want to change the milk error message to say that only one milk may be selected
										$('#milk')
											.find('.card')
											.each(function () {
												var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
												var toppingCategory = toppingCategoryAndToppingNameArray[0];
												var toppingName = toppingCategoryAndToppingNameArray[1];
												// make sure that you don't hide the already selected coffee
												if ($(this).find('.btn2').css(`--${toppingCategory}`) != toppingName) {
													$(this).css('opacity', '.3');
												}
											});
										$('#errorMilk').html('You may only select one milk for your coffee');
										$('#errorMilk').show();
									}
								}
							}
						} else if (
							// otherwise make sure the card being clicked isn't milk or coffee syrup
							$(this).closest('.card-deck').attr('id') != 'milk' &&
							$(this).closest('.card-deck').attr('id') != 'coffee_syrup'
						) {
							$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
							$(this).closest('.card').find('.btn2').css('--regular', 'true');
							$(this).closest('.card').find('.btn2').css('--quantity', 1);
							// console.log(
							// 	'anything but coffee syrup and milk',
							// 	$(this).closest('.card').find('.btn2').css('--regular')
							// );
							$(this).closest('.card').find('.btn2').html('✓');
							$(this).closest('.card').find('.btn2').toggle();
						}
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
						console.log('fag');
						$(this).closest('.card').find('.btn2').css('--regular', 'false');
						$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
						$(this).closest('.card').find('.btn2').css(`--quantity`, 0);
						$(this).closest('.card').find('.btn2').toggle();
						$(this).closest('.card').find('.btn2').html('✓');
					}

					// milk card logic
					// after clicking a card, if you the card you selected was a coffee then unhide the milk and syrup
					checkIfCoffeeSelected();
					checkIfMilkSelected();
					if (coffeeBool) {
						// make sure a milk hasn't been selected before we activate all the milk cards
						if (!milkBool) {
							$('#milk, #coffee_syrup').each(function () {
								console.log('coffee_syrup & milk $(this) PT2', $(this));
								$(this)
									.find('.card')
									.each(function () {
										$(this).css('opacity', '1');
									});
								$('#errorMilk').hide();
								$('#errorSyrup').hide();
							});
						}

						// after selecting one coffee the rest become unavailable

						$('#coffee')
							.find('.card')
							.each(function () {
								var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
								var toppingCategory = toppingCategoryAndToppingNameArray[0];
								var toppingName = toppingCategoryAndToppingNameArray[1];
								// make sure that you don't hide the already selected coffee
								if ($(this).find('.btn2').css(`--${toppingCategory}`) != toppingName) {
									$(this).css('opacity', '.3');
								}
							});
					} else {
						// if no coffee is selected then we need to make sure they're all available
						$('#coffee')
							.find('.card')
							.each(function () {
								$(this).css('opacity', '1');
							});
						// if you unselected coffee then we need to reset the milk and syrup values
						$('#milk, #coffee_syrup').each(function () {
							var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
							var toppingCategory = toppingCategoryAndToppingNameArray[0];
							var toppingName = toppingCategoryAndToppingNameArray[1];
							console.log($(this), '$(this)');
							$(this)
								.find('.card')
								.each(function () {
									console.log($(this), '$(this2)');
									$(this).css('opacity', '.3');
									$(this).find('.btn2').hide();
									console.log('toppingName', toppingName);
									console.log('toppingCat', toppingCategory);
									console.log(
										'css val for topping cat b4 false',
										$(this).find('.btn2').css(`--${toppingCategory}`)
									);
									$(this).find('.btn2').css(`--${toppingCategory}`, 'false');
									console.log(
										'css val for topping cat after false',
										$(this).find('.btn2').css(`--${toppingCategory}`)
									);
									$(this).find('.btn').hide();
									$(this).find('.btn2').css('--regular', 'false');
									$(this).find('.btn2').css('--half', 'false');
									$(this).find('.btn2').css('--extra', 'false');
									$(this).closest('.card').find('.btn2').css(`--quantity`, 0);
								});
							// console.log('coffeeBool false');
							$('#errorMilk').html('*Please select a coffee first');
							$('#errorMilk').show();
							$('#errorSyrup').show();
						});
					}
				});
		})
		.on('mouseleave', '.card', function () {
			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			var toppingCategory = toppingCategoryAndToppingNameArray[0];
			var toppingName = toppingCategoryAndToppingNameArray[1];
			// console.log('tc', toppingCategory, 'tn', toppingName);
			// TODO: Replace this with the assignment from the gettoppingCategory function
			if ($(this).closest('.card-deck').attr('id') != 'protein') {
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

				$(this).find('.btn').html('Customize');
				$(this).find('img').css('opacity', '1');
				$(this).find('.card-body').css('opacity', '1');
			}
		});

	// click the card buttons

	$('.btn')
		.unbind('click')
		.bind('click', function () {
			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			var toppingCategory = toppingCategoryAndToppingNameArray[0];
			var toppingName = toppingCategoryAndToppingNameArray[1];
			// console.log('tc', toppingCategory, 'tn', toppingName);
			if ($(this).html() == 'Customize') {
				if ($(this).closest('.card-deck').attr('id') === 'coffee_syrup') {
					//https://stackoverflow.com/questions/857245/is-there-a-jquery-unfocus-method
					$(this).blur();
					$(this).html('2 Pumps');
					$(this).closest('.card').find('.btn3').show();
					$(this).closest('.card').find('.btn4').show();
				} else if ($(this).closest('.card-deck').attr('id') === 'coffee') {
					//https://stackoverflow.com/questions/857245/is-there-a-jquery-unfocus-method
					$(this).blur();
					$(this).html('3 Espresso Shots');
					$(this).closest('.card').find('.btn3').show();
					$(this).closest('.card').find('.btn4').show();
				} else {
					//https://stackoverflow.com/questions/857245/is-there-a-jquery-unfocus-method
					$(this).blur();
					$(this).html('Extra');
					$(this).closest('.card').find('.btn3').show();
					$(this).closest('.card').find('.btn4').show();
				}
			} else {
				$(this).closest('.card').find('.btn2').css('--half', 'false');
				$(this).closest('.card').find('.btn2').css('--regular', 'false');
				$(this).closest('.card').find('.btn2').css('--extra', 'true');
				$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
				$(this).closest('.card').find('.btn2').css(`--quantity`, 1);

				$(this).html('Customize');
				$(this).blur();
				$(this).closest('.card').find('.btn2').html('3X');
				$(this).closest('.card').find('.btn2').show();
				$(this).closest('.card').find('.btn3').hide();
				$(this).closest('.card').find('.btn4').hide();
				checkIfCoffeeSelected();
				if (coffeeBool) {
					// if you selected coffee by getting extra espresso then we still need to blot out the other coffee cards
					$('#coffee')
						.find('.card')
						.each(function () {
							var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
							var toppingCategory = toppingCategoryAndToppingNameArray[0];
							var toppingName = toppingCategoryAndToppingNameArray[1];
							// make sure that you don't hide the already selected coffee
							if ($(this).find('.btn2').css(`--${toppingCategory}`) != toppingName) {
								$(this).css('opacity', '.3');
							}
						});
					$('#milk, #coffee_syrup').each(function () {
						// console.log('coffee_syrup & milk $(this) PT2', $(this));
						$(this)
							.find('.card')
							.each(function () {
								$(this).css('opacity', '1');
							});
						$('#errorMilk').hide();
						$('#errorSyrup').hide();
					});
				}
				// console.log('`--${toppingCategory}`, `${toppingName}`', `--${toppingCategory}`, `${toppingName}`);
			}
		});

	$('.btn3')
		.unbind('click')
		.bind('click', function () {
			if ($(this).closest('.card-deck').attr('id') != 'protein') {
				var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
				var toppingCategory = toppingCategoryAndToppingNameArray[0];
				var toppingName = toppingCategoryAndToppingNameArray[1];
				// console.log('tc', toppingCategory, 'tn', toppingName);
				$(this).closest('.card').find('.btn2').css('--half', 'true');
				$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
				$(this).closest('.card').find('.btn2').css(`--quantity`, 1);

				$(this).closest('.card').find('.btn2').css('--regular', 'false');
				$(this).closest('.card').find('.btn2').css('--extra', 'false');
				$(this).closest('.card').find('.btn2').html('½');
				$(this).closest('.card').find('.btn2').show();
				$(this).hide();
				$(this).closest('.card').find('.btn3').hide();
				$(this).closest('.card').find('.btn4').hide();
				$(this).closest('.card').find('.btn').html('Customize');
				checkIfCoffeeSelected();

				if (coffeeBool) {
					// if you selected coffee by getting extra espresso then we still need to blot out the other coffee cards
					$('#coffee')
						.find('.card')
						.each(function () {
							var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
							var toppingCategory = toppingCategoryAndToppingNameArray[0];
							var toppingName = toppingCategoryAndToppingNameArray[1];
							// make sure that you don't hide the already selected coffee
							if ($(this).find('.btn2').css(`--${toppingCategory}`) != toppingName) {
								$(this).css('opacity', '.3');
							}
						});
					$('#milk, #coffee_syrup').each(function () {
						// console.log('coffee_syrup & milk $(this) PT2', $(this));
						$(this)
							.find('.card')
							.each(function () {
								$(this).css('opacity', '1');
							});
						$('#errorMilk').hide();
						$('#errorSyrup').hide();
					});
				}
			}
		});

	$('.btn4')
		.unbind('click')
		.bind('click', function () {
			if ($(this).closest('.card-deck').attr('id') != 'protein') {
				var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
				var toppingCategory = toppingCategoryAndToppingNameArray[0];
				var toppingName = toppingCategoryAndToppingNameArray[1];
				$(this).closest('.card').find('.btn2').css('--regular', 'true');
				$(this).closest('.card').find('.btn2').css(`--quantity`, 1);

				$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
				$(this).closest('.card').find('.btn2').css('--half', 'false');
				$(this).closest('.card').find('.btn2').css('--extra', 'false');
				$(this).closest('.card').find('.btn2').html('✓');
				$(this).closest('.card').find('.btn2').show();
				$(this).hide();
				$(this).closest('.card').find('.btn3').hide();
				$(this).closest('.card').find('.btn').html('Customize');
				checkIfCoffeeSelected();
				if (coffeeBool) {
					// if you selected coffee by getting extra espresso then we still need to blot out the other coffee cards
					$('#coffee')
						.find('.card')
						.each(function () {
							var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
							var toppingCategory = toppingCategoryAndToppingNameArray[0];
							var toppingName = toppingCategoryAndToppingNameArray[1];
							// make sure that you don't hide the already selected coffee
							if ($(this).find('.btn2').css(`--${toppingCategory}`) != toppingName) {
								$(this).css('opacity', '.3');
							}
						});
					$('#milk, #coffee_syrup').each(function () {
						// console.log('coffee_syrup & milk $(this) PT2', $(this));
						$(this)
							.find('.card')
							.each(function () {
								$(this).css('opacity', '1');
							});
						$('#errorMilk').hide();
						$('#errorSyrup').hide();
					});
				}
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
			// console.log('cuuremtQuant', currentQuant);
			currentQuant -= 1;
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

const orderToppingsDict = {};
const drinkDict = {};
orderToppingsDict['drinks'] = [];
function checkOut() {
	$('.card-deck').each(function () {
		// create a drink category (ex. coffee) for each key in the drink dict
		drinkDict[`${$(this).attr('id')}`] = [];
	});

	$('.btn2').each(function () {
		var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
		var toppingCategory = toppingCategoryAndToppingNameArray[0];
		var toppingName = toppingCategoryAndToppingNameArray[1];
		console.log(
			'topping category and name before being true',
			$(this).css(`--${toppingCategory}`),
			'toppingCategory',
			toppingCategory,
			' toppingName',
			toppingName
		);
		if ($(this).css(`--${toppingCategory}`) == toppingName) {
			console.log(
				'topping category and name after being true',
				$(this).css(`--${toppingCategory}`),
				'toppingCategory',
				toppingCategory,
				' toppingName',
				toppingName
			);

			console.log($(this).css('--half'), $(this).css('--regular'), $(this).css('--extra'));
			var toppingDictionary = {};
			if ($(this).css('--half') == 'true') {
				toppingDictionary['servingSize'] = 'half';
			} else if ($(this).css('--regular') == 'true') {
				toppingDictionary['servingSize'] = 'regular';
			} else if ($(this).css('--extra') == 'true') {
				toppingDictionary['servingSize'] = 'extra';
			}
			// if the drink is a drink with a quantity then it won't have half or regular or extra and the previous if blocks won't grab the topping name
			else {
				toppingDictionary['servingSize'] = 'regular';
			}

			toppingDictionary['name'] = `${toppingName}`;

			if ($(this).css('--price')) {
				console.log('price', $(this).css('--price'));
				toppingDictionary['price'] = parseFloat($(this).css('--price'));
			} else {
				toppingDictionary['price'] = 0;
			}
			toppingDictionary['quantity'] = $(this).css('--quantity');

			drinkDict[`${toppingCategory}`].push(toppingDictionary);
		}
	});

	var orderItems = drinkDict;
	console.log('oldOrderItems', orderItems);
	//https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
	// var proteinCategoryCount = [];
	const coffeeArray = orderItems['coffee'];
	var orderTotal = 0;
	for (var key in orderItems) {
		console.log('key: %s', key);

		const drinksForItemCategory = orderItems[key];
		console.log('drinksForItemCategory', drinksForItemCategory);
		if (drinksForItemCategory.length) {
			console.log('drinksForItemCategory', drinksForItemCategory);
			for (var i = 0; i < drinksForItemCategory.length; i++) {
				var drink = drinksForItemCategory[i];
				const itemQuantity = drink['quantity'];
				const itemServingSize = drink['servingSize'];
				console.log('preParse', drink['price']);
				var itemPrice = drink['price'];
				if (key === 'coffee') {
					var espressoPrice = 0;
					const espressoDict = {};
					if (itemServingSize === 'extra') {
						espressoPrice = 3;
						espressoDict['quantity'] = 3;
					} else if (itemServingSize === 'regular') {
						espressoPrice = 2;
						espressoDict['quantity'] = 2;
					} else if (itemServingSize === 'half') {
						espressoPrice = 2;
						espressoDict['quantity'] = 1;
					}
					console.log('itemPricetoFixed', espressoPrice);
					espressoDict['price'] = espressoPrice;
					espressoDict['name'] = 'espresso';
					drink['espresso'] = espressoDict;
					orderTotal += espressoPrice;
				} else if (key === 'milk') {
					coffeeArray[0]['milk'] = drink;

					// create a new key in the coffee dictionary whose value is the milk dictionary. remmeber that the coffee dictionary is the first element of the coffee array (selecting the first element of the coffee array works because the user can only order one coffee per visit to this page)
					// after cloning the dictionary, delete the milk category from orderItems
					orderTotal += drink['price'];
					delete orderItems[key];
				} else if (key === 'coffee_syrup') {
					var syrupPrice = 0;
					const dictSource = {};
					if (itemServingSize === 'extra') {
						syrupPrice = 2;
						dictSource['quantity'] = 2;
					} else {
						syrupPrice = 1;
						dictSource['quantity'] = 1;
					}
					dictSource['price'] = syrupPrice;
					orderTotal += syrupPrice;
					dictSource['name'] = key;
					// recompartmentalize the coffee_syrup dictionary into the coffee dictionary in the coffee array then delete the coffee_syrup category from orderItems
					coffeeArray[0]['syrup'] = dictSource;
					delete orderItems[key]; // https://www.tutorialspoint.com/Remove-elements-from-a-Dictionary-using-Javascript
				} else if (key === 'milkshake') {
					console.log('itemQuantity', itemQuantity);
					console.log('itemPrice', itemPrice);
					const milkShakePrice = itemQuantity * itemPrice;
					const dictSource = {};
					dictSource['price'] = milkShakePrice;
					var milkshakeName = drink['name'];
					milkshakeName += 'Milkshake';
					dictSource['name'] = milkshakeName;
					orderTotal += milkShakePrice;
					Object.assign(drink, dictSource);
				} else if (key === 'bottled') {
					const bottledPrice = itemQuantity * itemPrice;
					const dictSource = {};
					dictSource['price'] = bottledPrice;
					orderTotal += bottledPrice;
					Object.assign(drink, dictSource);
				} else if (key === 'non-coffee') {
					const nonCoffeePrice = itemQuantity * itemPrice;
					const dictSource = {};
					dictSource['price'] = nonCoffeePrice;
					Object.assign(drink, dictSource);
				}
			}
			// need to populate the milk values
		} else if (key === 'milk' && coffeeArray[0]) {
			console.log('fuck');
			const milkDict = {};
			milkDict['name'] = '2%Milk';
			milkDict['servingSize'] = 'regular';
			milkDict['price'] = 0;
			coffeeArray[0]['milk'] = milkDict;
		}
	}
	console.log('newOrderItems', orderItems);

	orderToppingsDict['drinks'] = drinkDict;
	console.log('drinks dict', orderToppingsDict);
	console.log('orderToppingsDictwithIngredient', orderToppingsDict);
	//https://developer.mozilla.org/en-US/docs/Web/API/Window/location
	if (editDrinkIndex != undefined) {
		// stringify(orderToppingsDict);
		$.when(stringify(orderToppingsDict)).then(location.assign('/order?userOrder=true'));
	} else {
		$.when(stringify(orderToppingsDict)).then(location.assign('/order/side'));
	}
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
