//https://stackoverflow.com/questions/15876302/uncaught-typeerror-cannot-read-property-clientwidth-of-null
//https://stackoverflow.com/questions/4381228/jquery-selector-inside-the-each-method
('use strict');
import { Order, OrderDrink } from './model.js';

var editDrinkIndex = null;
var editDrink = null;
var drinkCategoryDataArray;
var coffeeDrinks;
var milkDrinks;
var coffeeSyrups;
var milkshakes;
var nonCoffeeDrinks;
var bottledDrinks;
var drinkCategories;
var newDrinkCategories = new Array();
var temperatures;
var userOrderDrink;
var drinkCategories = new Array();

function jq(myid) {
	return myid.replace(/(:|\.|\[|\]|%|,|=|@)/g, '\\$1');
}
const checkOut = (order) => {
	if (editDrinkIndex != null) {
		stringify(order);
		// $.when(stringify(order)).then(location.assign('/order?userOrder=true'));
	} else {
		stringify(order);
		// $.when(stringify(order)).then(location.assign('/order/side'));
	}
};

function stringify(drinkOrder) {
	//check to make sure a drink was selected
	console.log('drinkOrder.orderDrink: %s', JSON.stringify(drinkOrder));
	if (drinkOrder.orderDrink.length) {
		if (editDrinkIndex === null) {
			const order = new Order();
			if (localStorage.length > 0) {
				// there will only ever be one item in local storage because a customer can only have 1 order in their shopping cart.
				order.fromJSON(localStorage.getItem(localStorage.key(0)));
				const drinkOrderTotal = drinkOrder.orderTotal;
				console.log('drinkOrderTotal: %s', drinkOrderTotal);

				order.orderTotal += drinkOrderTotal;
				order.orderDrink.push(drinkOrder);

				const stringifiedDrinkOrder = JSON.stringify(order);
				localStorage.setItem('order', stringifiedDrinkOrder);
			} else {
				order.orderTotal += drinkOrder.orderTotal;
				order.orderDrink.push(drinkOrder);
				const stringifiedDrinkOrder = JSON.stringify(order);
				localStorage.setItem('order', stringifiedDrinkOrder);
			}
		} else {
			console.log('nope');
			var currentOrder = JSON.parse(localStorage.getItem(localStorage.key(0)));
			var currentOrderDrinkList = currentOrder.orderDrink;
			var currentOrderDrink = currentOrderDrinkList[editDrinkIndex];
			const drinkOrderTotal = drinkOrder.orderDrink.orderTotal;
			currentOrder.orderTotal += drinkOrderTotal;
			Object.assign(currentOrderDrink, drinkOrder.orderDrink);
			// if a previously had two proteins and then i remove one then i will have an empty object in my array that i don't want
			for (var i = 0; i < currentOrderDrinkList.length; i++) {
				if (currentOrderDrinkList[i] === {}) {
					currentOrderDrinkList.splice(i);
				}
			}
			localStorage.setItem('order', JSON.stringify(currentOrder));
		}
	}
	return true;
}

function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

$(window).ready(function () {
	$('.card-deck').each(function (i) {
		var cardDeckId = 'cardDeck-';
		cardDeckId += String(i);
		this.id = cardDeckId;
		$(this)
			.find('.card')
			.each(function (i) {
				var cardId = 'card-';
				cardId += String(i);
				this.id = cardId;
			});
	});
	coffeeDrinks = $('#coffeeDrinks').data('coffee');
	milkDrinks = $('#milkDrinks').data('milk');
	coffeeSyrups = $('#coffeeSyrups').data('syrup');
	milkshakes = $('#milkshakeDrinks').data('milkshake');
	nonCoffeeDrinks = $('#nonCoffeeDrinks').data('noncoffee');
	console.log(
		"	nonCoffeeDrinks = $('#nonCoffeeDrinks').data('noncoffee');: %s",
		(nonCoffeeDrinks = $('#nonCoffeeDrinks').data('noncoffee'))
	);

	bottledDrinks = $('#bottledDrinks').data('bottled');
	drinkCategories = $('#drinkCategories').data('category');

	temperatures = $('#coffeeTemperature').data('temperature');
	newDrinkCategories = [...drinkCategories];
	// i have to add the milk and syrup and temp categories so that the index of card decks will be correct
	newDrinkCategories.splice(1, 0, { id: 'milk' });
	newDrinkCategories.splice(2, 0, { id: 'temperature' });
	newDrinkCategories.splice(3, 0, { id: 'syrup' });
	for (var i = 0; i < newDrinkCategories.length; i++) {
		console.log('newDrinkCategories', newDrinkCategories[i]);
	}
	drinkCategoryDataArray = new Array();
	drinkCategoryDataArray.push(coffeeDrinks);
	drinkCategoryDataArray.push(milkDrinks);
	drinkCategoryDataArray.push(temperatures);
	drinkCategoryDataArray.push(coffeeSyrups);
	drinkCategoryDataArray.push(milkshakes);
	drinkCategoryDataArray.push(nonCoffeeDrinks);
	drinkCategoryDataArray.push(bottledDrinks);
	for (var i = 0; i < drinkCategoryDataArray.length; i++) {
		console.log('drinkCategoryDataArray: %s', drinkCategoryDataArray[i]);
	}
	//https://api.jquery.com/wrap/
	$('.card-img-top').wrap('<div class="container2"></div>');
	$('#drinkcheckout')
		.unbind('click')
		.bind('click', function () {
			console.log('checkout');
			checkOut(userOrderDrink);
		});
	$('.card-img-top').each(function (i) {
		const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
		const selectedItemCategory = newDrinkCategories[selectedItemCategoryIndex].id;
		if (selectedItemCategory === 'syrup') {
			$('<button class="btn" type="button">Customize</button>').insertAfter($(this));
			$('<button class="btn4" type="button">1 Pump</button>').insertAfter($(this));
			$('<button class="btn3" type="button">½ Pump</button>').insertAfter($(this));
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		} else if (selectedItemCategory === 'coffee') {
			$('<button class="btn" type="button">Customize</button>').insertAfter($(this));
			$('<button class="btn4" type="button">2 Espresso Shots</button>').insertAfter($(this));
			$('<button class="btn3" type="button">Decaf</button>').insertAfter($(this));
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		} else if (
			selectedItemCategory === 'bottled' ||
			selectedItemCategory === 'milkshake' ||
			selectedItemCategory === 'non-coffee'
		) {
			$(`<div class="grid-container" id="bottled_drink${i}" style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
				$(this)
			);
			$('<button class="btn2" type="button">1</button>').insertAfter($(this));
		} else if (
			selectedItemCategory === 'bottled' ||
			selectedItemCategory === 'milkshake' ||
			selectedItemCategory === 'temperature' ||
			selectedItemCategory === 'non-coffee'
		) {
			$(`<div class="grid-container" id="bottled_drink${i}" style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
				$(this)
			);
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		} else if (
			selectedItemCategory != 'milkshake' &&
			selectedItemCategory != 'non-coffee' &&
			selectedItemCategory != 'bottled'
		) {
			$('<button class="btn" type="button">Customize</button>').insertAfter($(this));
			$('<button class="btn4" type="button">Regular</button>').insertAfter($(this));
			$('<button class="btn3" type="button">Light</button>').insertAfter($(this));
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		} else if (
			selectedItemCategory === 'milkshake' ||
			selectedItemCategory === 'non-coffee' ||
			selectedItemCategory === 'bottled'
		) {
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		}
	});

	$('#cardDeck-1, #cardDeck-2, #cardDeck-3').each(function () {
		$(this)
			.find('.card')
			.each(function () {
				$(this).css('opacity', '.3');
			});
	});

	if ($('.edit').length) {
		editDrinkIndex = $('.edit').first().attr('id');
		console.log('editDrinkIndex: %s', editDrinkIndex);
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
						//send crepe recipe to blaise
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
				if (userOrderDrink.checkIfCoffeeSelected()) {
					$('#cardDeck-2')
						.find('.card')
						.each(function () {
							$(this).css('opacity', '1');
						});
					$('#errorSyrup').hide();
					$('cardDeck-0')
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

				if (userOrderDrink.checkIfTempSelected()) {
					$('#cardDeck-3')
						.find('.card')
						.each(function () {
							$(this).css('opacity', '1');
						});
				}
			} else {
				for (var i = 0; i < drinkArray.length; i++) {
					const drink = drinkArray[i];
					if ('name' in drink) {
						// i add the word milkshake to each name for formatting so i have to remove it for the html element id to be recognized
						const nonCoffeeDrinkName = drink['name'].replace('Milkshake', '');
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
	}

	$('.card-img-top').each(function () {
		this.src = '../static/images/steak.jpg';
		console.log('this.src: %s', this.src);
	});

	userOrderDrink = new OrderDrink();
	$(document)
		.on('mouseenter', '.card', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			const selectedItemCategory = newDrinkCategories[selectedItemCategoryIndex].id;
			// if the card isn't milk or temperature
			if (
				selectedItemCategory != 'milk' &&
				selectedItemCategory != 'temperature' &&
				selectedItemCategory != 'syrup'
			) {
				// if the card also isn't coffee then fade it out
				if (selectedItemCategory != 'coffee') {
					$(this).find('.card-body').css('opacity', '.3');
					$(this).find('.card-img-top').css('opacity', '.3');
					$(this).find('.btn').show();
					// if the card is coffee but a coffee has not been previously selected
				} else if (!userOrderDrink.checkIfCoffeeSelected()) {
					$(this).find('.card-body').css('opacity', '.3');
					$(this).find('.card-img-top').css('opacity', '.3');
					$(this).find('.btn').show();
				}
				// if you hover over a selected coffee card it will fade out otherwise it won't but it will already be faded out
				else if (userOrderDrink.checkIfThisDrinkSelected(selectedItemIndex, selectedItemCategoryIndex, drinkCategoryDataArray)) {
					$(this).find('.card-body').css('opacity', '.3');
					$(this).find('.card-img-top').css('opacity', '.3');
				}
				// if the hover card is syrup and a coffee has been selected then fade it out
			} else if (userOrderDrink.checkIfCoffeeSelected() && selectedItemCategory === 'syrup') {
				$(this).find('.card-body').css('opacity', '.3');
				$(this).find('.card-img-top').css('opacity', '.3');
				$(this).find('.btn').show();
				// if the hover card is milk and a coffee has been selected then fade it out
			} else if (userOrderDrink.checkIfCoffeeSelected() && selectedItemCategory === 'milk') {
				// 	make sure a milk hasn't already been selected
				if (!userOrderDrink.checkIfMilkSelected()) {
					$(this).find('.card-body').css('opacity', '.3');
					$(this).find('.card-img-top').css('opacity', '.3');
					// if a milk has been selected then we only want to highlight the card if it is that milk
				} else if (userOrderDrink.checkIfThisMilkSelected(selectedItemIndex, selectedItemCategory, drinkCategoryDataArray)) {
					$(this).find('.card-body').css('opacity', '.3');
					$(this).find('.card-img-top').css('opacity', '.3');
				}
			} else if (userOrderDrink.checkIfCoffeeSelected() && selectedItemCategory === 'temperature') {
				if (!userOrderDrink.checkIfTempSelected()) {
					$(this).find('.card-body').css('opacity', '.3');
					$(this).find('.card-img-top').css('opacity', '.3');
				} else if (userOrderDrink.checkIfThisTempSelected(selectedItemIndex, selectedItemCategory, drinkCategoryDataArray)) {
					$(this).find('.card-body').css('opacity', '.3');
					$(this).find('.card-img-top').css('opacity', '.3');
				}
			}
			//click the card somewhere
			$(this)
				.find('.card-text, .card-title, .card-body, .card-img-top')
				.unbind('click')
				.bind('click', function () {
					const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
					const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
					const selectedItemCategory = newDrinkCategories[selectedItemCategoryIndex].id;
					// check to see if the card is bottled or non-coffee or milkshake first because when you click on those cards, if they have already been selected you don't want to remove them
					// these cards have counters so they will have fundamentally different logic from the rest of the cards which is why we want to evaluate them first and then apply other logical conditions after
					// we know the selected card is not one of them
					if (
						selectedItemCategory === 'bottled' ||
						selectedItemCategory === 'non-coffee' ||
						selectedItemCategory === 'milkshake'
					) {
						userOrderDrink.changeDrinkQuantity(selectedItemIndex, selectedItemCategoryIndex, 'increase', drinkCategoryDataArray, newDrinkCategories);
						$(this)
							.closest('.card')
							.find('.btn2')
							.html(userOrderDrink.findDrink(selectedItemIndex, selectedItemCategoryIndex, drinkCategoryDataArray).quantity);
						$(this).closest('.card').find('.btn2').show();
						//after clicking the card show the + and - buttons
						$(this).closest('.card').find('.btn6').show();
						$(this).closest('.card').find('.btn7').show();
					}

					// if you click the card and it has already been selected then remove the item
					else if (userOrderDrink.checkIfThisDrinkSelected(selectedItemIndex, selectedItemCategoryIndex, drinkCategoryDataArray)) {
						userOrderDrink.removeDrink(selectedItemIndex, selectedItemCategoryIndex, drinkCategoryDataArray);
						$(this).closest('.card').find('.btn2').toggle();
						// if the card you removed was a coffee card
						if (!userOrderDrink.checkIfCoffeeSelected()) {
							// reactivate all the coffee cards
							$('#cardDeck-0')
								.find('.card')
								.each(function () {
									$(this).css('opacity', '1');
								});
							$('#cardDeck-1, #cardDeck-2, #cardDeck-3')
								.find('.card')
								.each(function () {
									$(this).css('opacity', '.3');
								});
						}
						// if the selected item is a milk card
					} else if (userOrderDrink.checkIfThisMilkSelected(selectedItemIndex, selectedItemCategory, drinkCategoryDataArray)) {
						userOrderDrink.removeMilk();
						// reactivate all the milk cards
						$(this).closest('.card').find('.btn2').hide();
						$('#cardDeck-1')
							.find('.card')
							.each(function () {
								$(this).css('opacity', '1');
							});
					} else if (userOrderDrink.checkIfThisTempSelected(selectedItemIndex, selectedItemCategory)) {
						userOrderDrink.removeTemp();
						$(this).closest('.card').find('.btn2').hide();
						// reactivate all the milk cards
						$('#cardDeck-2')
							.find('.card')
							.each(function () {
								$(this).css('opacity', '1');
							});
					} else if (userOrderDrink.checkIfThisSyrupSelected(selectedItemIndex, selectedItemCategory, drinkCategoryDataArray)) {
						userOrderDrink.removeSyrup();
						$(this).closest('.card').find('.btn2').hide();
						// reactivate all the milk cards
						$('#cardDeck-3')
							.find('.card')
							.each(function () {
								$(this).css('opacity', '1');
							});
					}
					// if the drink/temp/milk hasn't already been selected and is not bottled non-coffee or milkshake
					else if (
						!userOrderDrink.checkIfThisDrinkSelected(selectedItemIndex, selectedItemCategoryIndex, drinkCategoryDataArray) &&
						!userOrderDrink.checkIfThisTempSelected(selectedItemIndex, selectedItemCategory, drinkCategoryDataArray) &&
						!userOrderDrink.checkIfThisMilkSelected(selectedItemIndex, selectedItemCategory, drinkCategoryDataArray)
					) {
						// if a coffee has been selected already then milk or syrup can be selected
						if (userOrderDrink.checkIfCoffeeSelected()) {
							// if coffee has been selected alredy then we don't want to select another coffee!
							if (selectedItemCategory != 'coffee') {
								//make sure the selected card isn't milk because we want extra logic in there to make sure a milk hasn't already been selected
								if (selectedItemCategory != 'milk') {
									if (selectedItemCategory === 'temperature') {
										if (!userOrderDrink.checkIfTempSelected()) {
											userOrderDrink.addTemp(selectedItemIndex, selectedItemCategoryIndex, drinkCategoryDataArray);
											$(this).closest('.card').find('.btn2').html('✓');
											$(this).closest('.card').find('.btn2').toggle();
											// if a temp has been selected then we want to make sure all the other temp cards are knocked out
											//and we want to change the temp error message to say that only one temp may be selected
											$('#cardDeck-2')
												.find('.card')
												.each(function () {
													const selectedItemIndex = $(this)
														.closest('.card')
														.attr('id')
														.split('-')[1];
													const selectedItemCategoryIndex = $(this)
														.closest('.card-deck')
														.attr('id')
														.split('-')[1];
													const selectedItemCategory =
														newDrinkCategories[selectedItemCategoryIndex].id;
													if (
														!userOrderDrink.checkIfThisTempSelected(
															selectedItemIndex,
															selectedItemCategory, drinkCategoryDataArray
														)
													) {
														$(this).css('opacity', '.3');
													}
												});
											$('#errorTemp').html('You may only select one temperature for your coffee');
											$('#errorTemp').show();
										}
									} else {
										// if the selected card is coffee syrup flavor
										userOrderDrink.addSyrup(selectedItemIndex, selectedItemCategoryIndex, drinkCategoryDataArray);
										$(this).closest('.card').find('.btn2').html('✓');
										$(this).closest('.card').find('.btn2').toggle();
									}
								}
								// if the selected card is milk
								else {
									// make sure a milk hasn't already been selected when selecting a milk card
									if (!userOrderDrink.checkIfMilkSelected()) {
										userOrderDrink.addMilk(selectedItemIndex, selectedItemCategoryIndex, drinkCategoryDataArray);
										console.log('fuck');
										$(this).closest('.card').find('.btn2').html('✓');
										$(this).closest('.card').find('.btn2').toggle();
										// if a milk has been selected then we want to make sure all the other milk cards are knocked out
										//and we want to change the milk error message to say that only one milk may be selected
										$('#cardDeck-1')
											.find('.card')
											.each(function () {
												const selectedItemIndex = $(this).attr('id').split('-')[1];
												const selectedItemCategory =
													newDrinkCategories[selectedItemCategoryIndex].id;

												// make sure that you don't hide the already selected milk
												if (
													!userOrderDrink.checkIfThisMilkSelected(
														selectedItemIndex,
														selectedItemCategory, drinkCategoryDataArray
													)
												) {
													$(this).css('opacity', '.3');
												}
											});
										$('#errorMilk').html('You may only select one milk for your coffee');
										$('#errorMilk').show();
									}
								}
							}
							// if a coffee has not already been selected and the card being selected isn't any of the other drink options then the card being selected should be coffee
						} else if (selectedItemCategory === 'coffee') {
							const espressoServingSize = 'regular';
							console.log('coffee');
							userOrderDrink.addCoffee(selectedItemIndex, espressoServingSize, drinkCategoryDataArray);
							$(this).closest('.card').find('.btn2').html('✓');
							$(this).closest('.card').find('.btn2').toggle();
							// activate the milk and temp and syrup cards after selecting coffee
							$('#cardDeck-1, #cardDeck-2, #cardDeck-3').each(function () {
								$(this)
									.find('.card')
									.each(function () {
										$(this).css('opacity', '1');
									});
								$('#errorMilk').hide();
								$('#errorSyrup').hide();
								$('#errorTemp').hide();
							});
						}
					}
				});
		})
		.on('mouseleave', '.card', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			const selectedItemCategory = newDrinkCategories[selectedItemCategoryIndex].id;
			if (!userOrderDrink.checkIfThisDrinkSelected(selectedItemIndex, selectedItemCategoryIndex, drinkCategoryDataArray)) {
				$(this).find('.btn').hide();
				$(this).find('.btn3').hide();
				$(this).find('.btn4').hide();
			} else if (!userOrderDrink.checkIfThisSyrupSelected(selectedItemIndex, selectedItemCategory, drinkCategoryDataArray)) {
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
			$(this).find('.card-img-top').css('opacity', '1');
		});

	// click the card buttons
	$('.btn')
		.unbind('click')
		.bind('click', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			const selectedItemCategory = newDrinkCategories[selectedItemCategoryIndex].id;
			if ($(this).html() == 'Customize') {
				if (selectedItemCategory === 'syrup') {
					//https://stackoverflow.com/questions/857245/is-there-a-jquery-unfocus-method
					$(this).blur();
					$(this).html('2 Pumps');
					$(this).closest('.card').find('.btn3').show();
					$(this).closest('.card').find('.btn4').show();
				} else if (selectedItemCategory === 'coffee') {
					//https://stackoverflow.com/questions/857245/is-there-a-jquery-unfocus-method
					$(this).blur();
					$(this).html('3 Espresso Shots');
					$(this).closest('.card').find('.btn3').show();
					$(this).closest('.card').find('.btn4').show();
				}
			} else {
				const servingSize = 'extra';
				if (selectedItemCategory === 'syrup') {
					userOrderDrink.addSyrup(selectedItemIndex, servingSize, drinkCategoryDataArray);
					$('#cardDeck-3')
						.find('.card')
						.each(function () {
							const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
							const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
							const selectedItemCategory = newDrinkCategories[selectedItemCategoryIndex].id;

							if (!userOrderDrink.checkIfThisSyrupSelected(selectedItemIndex, selectedItemCategory, drinkCategoryDataArray)) {
								$(this).css('opacity', '.3');
							}
						});
					$(this).closest('.card').find('.btn2').html('2X');
				} else if (selectedItemCategory === 'coffee') {
					userOrderDrink.addCoffee(selectedItemIndex, servingSize, drinkCategoryDataArray);
					$(this).closest('.card').find('.btn2').html('3X');
					// if you selected coffee by getting extra espresso then we still need to blot out the other coffee cards
					$('#cardDeck-0')
						.find('.card')
						.each(function () {
							const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
							const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
							if (
								!userOrderDrink.checkIfThisDrinkSelected(selectedItemIndex, selectedItemCategoryIndex, drinkCategoryDataArray)
							) {
								$(this).css('opacity', '.3');
							}
						});
					$('#cardDeck-1, #cardDeck-2, #cardDeck-3').each(function () {
						$(this)
							.find('.card')
							.each(function () {
								$(this).css('opacity', '1');
							});
						$('#errorMilk').hide();
						$('#errorSyrup').hide();
						$('#errorTemp').hide();
					});
				}
				$(this).html('Customize');
				$(this).blur();
				$(this).closest('.card').find('.btn2').show();
				$(this).closest('.card').find('.btn3').hide();
				$(this).closest('.card').find('.btn4').hide();
			}
		});

	$('.btn3, .btn4').each(function () {
		$(this)
			.unbind('click')
			.bind('click', function () {
				var servingSize;
				if ($(this).attr('class') === 'btn3') {
					servingSize = 'half';
					$(this).closest('.card').find('.btn2').html('½');
				} else if ($(this).attr('class') === 'btn4') {
					servingSize = 'regular';
					$(this).closest('.card').find('.btn2').html('✓');
				}
				console.log('click');
				const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
				const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
				const selectedItemCategory = newDrinkCategories[selectedItemCategoryIndex].id;

				if (selectedItemCategory === 'syrup') {
					userOrderDrink.addSyrup(selectedItemIndex, servingSize, drinkCategoryDataArray);
					$('#cardDeck-3')
						.find('.card')
						.each(function () {
							const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
							const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
							const selectedItemCategory = newDrinkCategories[selectedItemCategoryIndex].id;
							if (!userOrderDrink.checkIfThisSyrupSelected(selectedItemIndex, selectedItemCategory, drinkCategoryDataArray)) {
								$(this).css('opacity', '.3');
							}
						});
				} else if (selectedItemCategory === 'coffee') {
					userOrderDrink.addCoffee(selectedItemIndex, servingSize, drinkCategoryDataArray);
					// if you selected coffee by getting extra espresso then we still need to blot out the other coffee cards
					$('#cardDeck-0')
						.find('.card')
						.each(function () {
							const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
							const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
							if (
								!userOrderDrink.checkIfThisDrinkSelected(selectedItemIndex, selectedItemCategoryIndex, drinkCategoryDataArray)
							) {
								$(this).css('opacity', '.3');
							}
						});
					$('#cardDeck-1, #cardDeck-2, #cardDeck-3').each(function () {
						$(this)
							.find('.card')
							.each(function () {
								$(this).css('opacity', '1');
							});
						$('#errorMilk').hide();
						$('#errorSyrup').hide();
						$('#errorTemp').hide();
					});
				}
				$(this).closest('.card').find('.btn2').show();
				$(this).hide();
				$(this).closest('.card').find('.btn4').hide();
				$(this).closest('.card').find('.btn').html('Customize');
			});
	});

	$('.btn6')
		.unbind('click')
		.bind('click', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			userOrderDrink.changeDrinkQuantity(selectedItemIndex, selectedItemCategoryIndex, 'decrease', drinkCategoryDataArray);
			if (userOrderDrink.findDrink(selectedItemIndex, selectedItemCategoryIndex, drinkCategoryDataArray).quantity <= 0) {
				$(this).closest('.card').find('.btn2').hide();
				$(this)
					.closest('.card')
					.find('.btn2')
					.html(userOrderDrink.findDrink(selectedItemIndex, selectedItemCategoryIndex, drinkCategoryDataArray).quantity);
				userOrderDrink.removeDrink(selectedItemIndex, selectedItemCategoryIndex, drinkCategoryDataArray);
				$(this).hide();
				$(this).closest('.card').find('.btn7').hide();
			} else {
				$(this)
					.closest('.card')
					.find('.btn2')
					.html(userOrderDrink.findDrink(selectedItemIndex, selectedItemCategoryIndex, drinkCategoryDataArray).quantity);
				$(this).closest('.card').find('.btn2').show();
			}
		});

	$('.btn7')
		.unbind('click')
		.bind('click', function () {
			console.log('click btn7');
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			userOrderDrink.changeDrinkQuantity(selectedItemIndex, selectedItemCategoryIndex, 'increase', drinkCategoryDataArray);
			$(this)
				.closest('.card')
				.find('.btn2')
				.html(userOrderDrink.findDrink(selectedItemIndex, selectedItemCategoryIndex, drinkCategoryDataArray).quantity);
			$(this).closest('.card').find('.btn2').show();
		});
});

// all this code changes display for smaller screen sizes
var cWidth = $(window).width();
$(window).on('load resize', function () {
	var newWidth = $(window).width();
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
