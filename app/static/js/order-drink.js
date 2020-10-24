//https://stackoverflow.com/questions/15876302/uncaught-typeerror-cannot-read-property-clientwidth-of-null
//https://stackoverflow.com/questions/4381228/jquery-selector-inside-the-each-method
('use strict');
import { Order, OrderDrink } from './model.js';

var editDrinkIndex = null;
var editOrder = null;
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
var drinkCategories = new Array();
var userOrderDrink = new OrderDrink();
var drinkServingSizes = new Array();

const jq = (myid) => {
	return myid.replace(/(:|\.|\[|\]|%|,|=|@)/g, '\\$1');
};
const checkOut = (order) => {
	if (editDrinkIndex != null) {
		// when checking out make sure that if no milk has been selected then we assign the default value of 2%
		for (var i = 0; i < userOrderDrink.orderDrink.length; i++) {
			if (userOrderDrink.orderDrink[i].drinkCategory === 'coffee') {
				if (!userOrderDrink.orderDrink[i]._milkType) {
					userOrderDrink.orderDrink[i]._milkType = 'two_percent_milk';
				}
			}
		}
		stringify(order);
		// $.when(stringify(order)).then(location.assign('/order?userOrder=true'));
	} else {
		stringify(order);
		// $.when(stringify(order)).then(location.assign('/order/side'));
	}
};

const stringify = (drinkOrder) => {
	if (editDrinkIndex === null) {
		const order = new Order();
		if (drinkOrder.orderDrink.length) {
			if (localStorage.length > 0) {
				order.fromJSON(localStorage.getItem(localStorage.key(0)));
				const drinkOrderTotal = drinkOrder.orderTotal;
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
		}
	} else {
		if (drinkOrder.orderDrink.length) {
			editOrder.orderDrink[editDrinkIndex] = drinkOrder;
			localStorage.setItem('order', JSON.stringify(editOrder));
		} else {
			editOrder.orderDrink.splice(editDrinkIndex, 1);
			localStorage.setItem('order', JSON.stringify(editOrder));
		}
	}
	return true;
};

const removeAllChildNodes = (parent) => {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
};

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
	bottledDrinks = $('#bottledDrinks').data('bottled');
	drinkCategories = $('#drinkCategories').data('category');
	drinkServingSizes = $('#servingSizes').data('servingsizes');

	temperatures = $('#coffeeTemperature').data('temperature');
	newDrinkCategories = [...drinkCategories];
	// i have to add the milk and syrup and temp categories so that the index of card decks will be correct
	newDrinkCategories.splice(1, 0, { id: 'milk' });
	newDrinkCategories.splice(2, 0, { id: 'temperature' });
	newDrinkCategories.splice(3, 0, { id: 'syrup' });

	drinkCategoryDataArray = new Array();
	drinkCategoryDataArray.push(coffeeDrinks);
	drinkCategoryDataArray.push(milkDrinks);
	drinkCategoryDataArray.push(temperatures);
	drinkCategoryDataArray.push(coffeeSyrups);
	drinkCategoryDataArray.push(milkshakes);
	drinkCategoryDataArray.push(nonCoffeeDrinks);
	drinkCategoryDataArray.push(bottledDrinks);

	$('.card-img-top').wrap('<div class="container2"></div>');
	$('#drinkcheckout')
		.unbind('click')
		.bind('click', function () {
			if (userOrderDrink.checkIfCoffeeSelected() && !userOrderDrink.checkIfTempSelected()) {
				console.log('hey');
				$('#errorCoffee').show();
				return false;
			} else {
				checkOut(userOrderDrink);
			}
		});
	$('.card-img-top').each(function (i) {
		const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
		const selectedItemCategory = newDrinkCategories[selectedItemCategoryIndex].id;
		if (selectedItemCategory === 'syrup') {
			$('<button class="btn" id="servingSize-2" type="button">Customize</button>').insertAfter($(this));
			$('<button class="btn4" id="servingSize-1" type="button">1 Pump</button>').insertAfter($(this));
			$('<button class="btn3" id="servingSize-0" type="button">½ Pump</button>').insertAfter($(this));
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		} else if (selectedItemCategory === 'coffee') {
			$('<button class="btn" id="servingSize-2" type="button">Customize</button>').insertAfter($(this));
			$('<button class="btn4" id="servingSize-1" type="button">2 Espresso Shots</button>').insertAfter($(this));
			$('<button class="btn3" id="servingSize-0" type="button">Decaf</button>').insertAfter($(this));
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
		} else if (selectedItemCategory === 'temperature' || 'milk') {
			$(`<div class="grid-container" id="bottled_drink${i}" style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"></div>`).insertAfter($(this));
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
		console.log('editDrinkIndex', editDrinkIndex);

		editOrder = new Order();
		editOrder.fromJSON(localStorage.getItem(localStorage.key(0)));
		console.log('editOrder', editOrder);

		const editOrderDrink = editOrder.orderDrink[editDrinkIndex];
		console.log('editOrderDrink', editOrderDrink);
		console.log('userOrderDrink', userOrderDrink);

		userOrderDrink = editOrderDrink;
		console.log('userOrderDrink', userOrderDrink);

		for (var i = 0; i < editOrderDrink.orderDrink.length; i++) {
			const drink = editOrderDrink.orderDrink[i];
			console.log('drink', drink);

			if (drink.drinkCategory === 'coffee') {
				//send crepe recipe to blaise
				if (drink.espressoServingSize === 'extra') {
					$(`#${drink.name}`).closest('.card, .list-group-item').find('.btn2').html('3x');
					$(`#${drink.name}`).closest('.card, .list-group-item').find('.btn2').show();
					$(`#${drink.name}`).closest('.card, .list-group-item').find('.btn').show();
				} else if (drink.espressoServingSize === 2) {
					$(`#${drink.name}`).closest('.card, .list-group-item').find('.btn2').html('✓');
					$(`#${drink.name}`).closest('.card, .list-group-item').find('.btn2').show();
					$(`#${drink.name}`).closest('.card, .list-group-item').find('.btn').show();
				} else if (drink.espressoServingSize === 1) {
					$(`#${drink.name}`).closest('.card, .list-group-item').find('.btn2').html('½');
					$(`#${drink.name}`).closest('.card, .list-group-item').find('.btn2').show();
					$(`#${drink.name}`).closest('.card, .list-group-item').find('.btn').show();
				}
				if (drink.flavorSyrup) {
					console.log('flavor');
					if (drink.flavorSyrupServingSize === 'extra') {
						console.log('flavor ex');
						$(`#${drink.flavorSyrup}Syrup`).attr('id');
						console.log(
							"$(`#${drink.flavorSyrup}Syrup`).attr('id')",
							$(`#${drink.flavorSyrup}Syrup`).attr('id')
						);

						$(`#${drink.flavorSyrup}Syrup`).closest('.card, .list-group-item').find('.btn2').html('2x');
						$(`#${drink.flavorSyrup}Syrup`).closest('.card, .list-group-item').find('.btn2').show();

						$(`#${drink.flavorSyrup}Syrup`).closest('.card, .list-group-item').find('.btn').show();
					} else if (drink.flavorSyrupServingSize === 'regular') {
						$(`#${drink.flavorSyrup}Syrup`).closest('.card, .list-group-item').find('.btn2').html('✓');
						$(`#${drink.flavorSyrup}Syrup`).closest('.card, .list-group-item').find('.btn2').show();
						$(`#${drink.flavorSyrup}Syrup`).closest('.card, .list-group-item').find('.btn').show();
					} else if (drink.flavorSyrupServingSize === 'light') {
						$(`#${drink.flavorSyrup}Syrup`).closest('.card, .list-group-item').find('.btn2').html('½');
						$(`#${drink.flavorSyrup}Syrup`).closest('.card, .list-group-item').find('.btn2').show();
						$(`#${drink.flavorSyrup}Syrup`).closest('.card, .list-group-item').find('.btn').show();
					}
				}
				const milkName = jq(drink.milkType);
				console.log('milkName', milkName);

				$(`#${milkName}`).closest('.card, .list-group-item').find('.btn2').show();
				if (drink.temperature) {
					$(`#${drink.temperature}`).closest('.card, .list-group-item').find('.btn2').show();
				}
				$('#cardDeck-0')
					.find('.card, .list-group-item')
					.each(function () {
						const selectedItemIndex = $(this).attr('id').split('-')[1];
						const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
						// make sure that you don't hide the already selected coffee
						if (
							!userOrderDrink.checkIfThisDrinkSelected(
								selectedItemIndex,
								selectedItemCategoryIndex,
								drinkCategoryDataArray
							)
						) {
							$(this).css('opacity', '.3');
						}
					});
				$('#cardDeck-1, #cardDeck-2, #cardDeck-3');
				$(this)
					.find('.card, .list-group-item')
					.each(function () {
						const selectedItemIndex = $(this).attr('id').split('-')[1];
						const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
						if ($(this).closest('.card-deck').attr('id') === 'cardDeck-1') {
							if (
								userOrderDrink.checkIfThisMilkSelected(
									selectedItemIndex,
									selectedItemCategoryIndex,
									'milk',
									drinkCategoryDataArray
								)
							) {
								$(this).css('opacity', '1');
							}
						} else if ($(this).closest('.card-deck').attr('id') === 'cardDeck-2') {
							if (
								userOrderDrink.checkIfThisTempSelected(
									selectedItemIndex,
									selectedItemCategoryIndex,
									'temperature',
									drinkCategoryDataArray
								)
							) {
								$(this).css('opacity', '1');
							}
						} else if ($(this).closest('.card-deck').attr('id') === 'cardDeck-3') {
							if (userOrderDrink.checkIfSyrupSelected()) {
								if (
									userOrderDrink.checkIfThisSyrupSelected(
										selectedItemIndex,
										selectedItemCategoryIndex,
										'syrup',
										drinkCategoryDataArray
									)
								) {
									$(this).css('opacity', '1');
								}
							} else {
								$(this).css('opacity', '1');
							}
						}
					});
				$('#errorCoffee').hide();
				$('#errorMilk').hide();
				$('#errorTemp').hide();
				$('#errorSyrup').hide();
			} else {
				// i add the word milkshake to each name for formatting so i have to remove it for the html element id to be recognized
				$(`#${drink.id}`).find('.btn2').html(drink.quantity);
				$(`#${drink.id}`).find('.btn2').show();
				$(`#${drink.id}`).find('.btn6').show();
				$(`#${drink.id}`).find('.btn7').show();
			}
		}
	}

	$('.card-img-top').each(function () {
		this.src = '../static/images/steak.jpg';
	});

	$(document)
		.on('mouseenter', '.card, .list-group', function () {
			console.log("$(this).attr('class')", $(this).attr('class'));

			if ($(this).attr('class') === 'card') {
				const selectedItemIndex = $(this).attr('id').split('-')[1];
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
						$(this).find('.card-body, .card-img-top, img, h5, p').css('opacity', '.3');
						$(this).find('.btn').show();
						// if the card is coffee but a coffee has not been previously selected
					} else if (!userOrderDrink.checkIfCoffeeSelected()) {
						$(this).find('.card-body, .card-img-top, img, h5, p').css('opacity', '.3');

						$(this).find('.btn').show();
					}
					// if you hover over a selected coffee card it will fade out otherwise it won't but it will already be faded out
					else if (
						userOrderDrink.checkIfThisDrinkSelected(
							selectedItemIndex,
							selectedItemCategoryIndex,
							drinkCategoryDataArray
						)
					) {
						$(this).find('.card-body, .card-img-top, img, h5, p').css('opacity', '.3');
					}
					// if the hover card is syrup and a coffee has been selected then fade it out
				} else if (userOrderDrink.checkIfCoffeeSelected() && selectedItemCategory === 'syrup') {
					$(this).find('.card-body, .card-img-top, img, h5, p').css('opacity', '.3');

					$(this).find('.btn').show();
					// if the hover card is milk and a coffee has been selected then fade it out
				} else if (userOrderDrink.checkIfCoffeeSelected() && selectedItemCategory === 'milk') {
					// 	make sure a milk hasn't already been selected
					if (!userOrderDrink.checkIfMilkSelected()) {
						$(this).find('.card-body, .card-img-top, img, h5, p').css('opacity', '.3');
						// if a milk has been selected then we only want to highlight the card if it is that milk
					}
				} else if (userOrderDrink.checkIfCoffeeSelected() && selectedItemCategory === 'temperature') {
					if (!userOrderDrink.checkIfTempSelected()) {
						$(this).find('.card-body, .card-img-top, img, h5, p').css('opacity', '.3');
					} else if (
						userOrderDrink.checkIfThisTempSelected(
							selectedItemIndex,
							selectedItemCategoryIndex,
							selectedItemCategory,
							drinkCategoryDataArray
						)
					) {
						$(this).find('.card-body, .card-img-top, img, h5, p').css('opacity', '.3');
					}
				}
			} else if ($(this).attr('class') === 'list-group') {
				$(this)
					.find('.list-group-item')
					.unbind('mouseenter')
					.bind('mouseenter', function () {
						const selectedItemIndex = $(this).attr('id').split('-')[1];
						console.log('selectedItemIndex', selectedItemIndex);

						const selectedItemCategoryIndex = $(this).closest('.list-group').attr('id').split('-')[1];
						const selectedItemCategory = newDrinkCategories[selectedItemCategoryIndex].id;

						if (
							selectedItemCategory != 'milk' &&
							selectedItemCategory != 'temperature' &&
							selectedItemCategory != 'syrup'
						) {
							// if the card also isn't coffee then fade it out
							if (selectedItemCategory != 'coffee') {
								$(this).find('.card-body, .card-img-top, img, h5, p').css('opacity', '.3');
								$(this).find('.btn').show();
								// if the card is coffee but a coffee has not been previously selected
							} else if (!userOrderDrink.checkIfCoffeeSelected()) {
								$(this).find('.card-body, .card-img-top, img, h5, p').css('opacity', '.3');

								$(this).find('.btn').show();
							}
							// if you hover over a selected coffee card it will fade out otherwise it won't but it will already be faded out
							else if (
								userOrderDrink.checkIfThisDrinkSelected(
									selectedItemIndex,
									selectedItemCategoryIndex,
									drinkCategoryDataArray
								)
							) {
								$(this).find('.card-body, .card-img-top, img, h5, p').css('opacity', '.3');
							}
							// if the hover card is syrup and a coffee has been selected then fade it out
						} else if (userOrderDrink.checkIfCoffeeSelected() && selectedItemCategory === 'syrup') {
							$(this).find('.card-body, .card-img-top, img, h5, p').css('opacity', '.3');

							$(this).find('.btn').show();
							// if the hover card is milk and a coffee has been selected then fade it out
						} else if (userOrderDrink.checkIfCoffeeSelected() && selectedItemCategory === 'milk') {
							// 	make sure a milk hasn't already been selected
							if (!userOrderDrink.checkIfMilkSelected()) {
								$(this).find('.card-body, .card-img-top, img, h5, p').css('opacity', '.3');

								// if a milk has been selected then we only want to highlight the card if it is that milk
							}
						} else if (userOrderDrink.checkIfCoffeeSelected() && selectedItemCategory === 'temperature') {
							if (!userOrderDrink.checkIfTempSelected()) {
								$(this).find('.card-body, .card-img-top, img, h5, p').css('opacity', '.3');
							} else if (
								userOrderDrink.checkIfThisTempSelected(
									selectedItemIndex,
									selectedItemCategoryIndex,
									selectedItemCategory,
									drinkCategoryDataArray
								)
							) {
								$(this).find('.card-body, .card-img-top, img, h5, p').css('opacity', '.3');
							}
						}
					});
			}
			//click the card somewhere
			$(this)
				.find('.card-text, .card-title, .card-body, .card-img-top, .list-group-item')
				.unbind('click')
				.bind('click', function (event) {
					const selectedItemIndex = $(this).closest('.card, li').attr('id').split('-')[1];
					const selectedItemCategoryIndex = $(this)
						.closest('.card-deck, .list-group')
						.attr('id')
						.split('-')[1];
					const selectedItemCategory = newDrinkCategories[selectedItemCategoryIndex].id;
					const senderElement = event.target;
					console.log('senderElement', senderElement);

					if (this === senderElement) {
						// check to see if the card is bottled or non-coffee or milkshake first because when you click on those cards, if they have already been selected you don't want to remove them
						// these cards have counters so they will have fundamentally different logic from the rest of the cards which is why we want to evaluate them first and then apply other logical conditions after
						// we know the selected card is not one of them
						if (
							selectedItemCategory === 'bottled' ||
							selectedItemCategory === 'non-coffee' ||
							selectedItemCategory === 'milkshake'
						) {
							userOrderDrink.changeDrinkQuantity(
								selectedItemIndex,
								selectedItemCategoryIndex,
								'increase',
								drinkCategoryDataArray,
								newDrinkCategories
							);
							$(this)
								.closest('.card, li')
								.find('.btn2')
								.html(
									userOrderDrink.findDrink(
										selectedItemIndex,
										selectedItemCategoryIndex,
										drinkCategoryDataArray
									).quantity
								);
							$(this).closest('.card, li').find('.btn2').show();
							//after clicking the card show the + and - buttons
							$(this).closest('.card, li').find('.btn6').show();
							$(this).closest('.card, li').find('.btn7').show();
						}

						// if you click the card and it has already been selected then remove the item
						else if (
							userOrderDrink.checkIfThisDrinkSelected(
								selectedItemIndex,
								selectedItemCategoryIndex,
								drinkCategoryDataArray
							)
						) {
							userOrderDrink.removeDrink(
								selectedItemIndex,
								selectedItemCategoryIndex,
								drinkCategoryDataArray
							);
							$(this).closest('.card, li').find('.btn2').toggle();
							// if the card you removed was a coffee card
							if (!userOrderDrink.checkIfCoffeeSelected()) {
								// reactivate all the coffee cards
								$('#cardDeck-0')
									.find('.card, .list-group-item')
									.each(function () {
										$(this).css('opacity', '1');
									});
								$('#cardDeck-1, #cardDeck-2, #cardDeck-3');
								$(this)
									.find('.card, .list-group-item')
									.each(function () {
										$(this).css('opacity', '.3');
										$(this).find('.btn2').hide();
									});
								$('#errorMilk').html('Please select a coffee first');
								$('#errorTemp').html('Please select a coffee first');
								$('#errorSyrup').html('Please select a coffee first');
								$('#errorMilk').show();
								$('#errorTemp').show();
								$('#errorSyrup').show();
							}
							// if the selected item is a milk card
						} else if (
							userOrderDrink.checkIfThisMilkSelected(
								selectedItemIndex,
								selectedItemCategoryIndex,
								selectedItemCategory,
								drinkCategoryDataArray
							)
						) {
							userOrderDrink.removeMilk();
							// reactivate all the milk cards
							$(this).closest('.card, li').find('.btn2').hide();
							$('#cardDeck-1')
								.find('.card, .list-group-item')
								.each(function () {
									$(this).css('opacity', '1');
								});
							$('#errorMilk').hide();
						} else if (
							userOrderDrink.checkIfThisTempSelected(
								selectedItemIndex,
								selectedItemCategoryIndex,
								selectedItemCategory,
								drinkCategoryDataArray
							)
						) {
							userOrderDrink.removeTemp();
							$(this).closest('.card, li').find('.btn2').hide();
							// reactivate all the milk cards
							$('#cardDeck-2')
								.find('.card, .list-group-item')
								.each(function () {
									$(this).css('opacity', '1');
								});
							$('#errorTemp').hide();
						} else if (
							userOrderDrink.checkIfThisSyrupSelected(
								selectedItemIndex,
								selectedItemCategoryIndex,
								selectedItemCategory,
								drinkCategoryDataArray
							)
						) {
							userOrderDrink.removeSyrup();
							$(this).closest('.card, li').find('.btn2').hide();
							// reactivate all the milk cards
							$('#cardDeck-3')
								.find('.card, .list-group-item')
								.each(function () {
									$(this).css('opacity', '1');
								});
							$('#errorSyrup').hide();
						}
						// if the drink/temp/milk hasn't already been selected and is not bottled non-coffee or milkshake
						else if (
							!userOrderDrink.checkIfThisDrinkSelected(
								selectedItemIndex,
								selectedItemCategoryIndex,
								drinkCategoryDataArray
							) &&
							!userOrderDrink.checkIfThisTempSelected(
								selectedItemIndex,
								selectedItemCategoryIndex,
								selectedItemCategory,
								drinkCategoryDataArray
							) &&
							!userOrderDrink.checkIfThisSyrupSelected(
								selectedItemIndex,
								selectedItemCategoryIndex,
								selectedItemCategory,
								drinkCategoryDataArray
							) &&
							!userOrderDrink.checkIfThisMilkSelected(
								selectedItemIndex,
								selectedItemCategoryIndex,
								selectedItemCategory,
								drinkCategoryDataArray
							)
						) {
							//this is being considered before the drink selection has been added to the order
							// if a coffee has been selected already then milk or syrup can be selected
							if (userOrderDrink.checkIfCoffeeSelected()) {
								// if coffee has been selected alredy then we don't want to select another coffee!
								if (selectedItemCategory != 'coffee') {
									//make sure the selected card isn't milk because we want extra logic in there to make sure a milk hasn't already been selected
									if (selectedItemCategory != 'milk') {
										if (selectedItemCategory === 'temperature') {
											if (!userOrderDrink.checkIfTempSelected()) {
												userOrderDrink.addTemp(
													selectedItemIndex,
													selectedItemCategoryIndex,
													drinkCategoryDataArray
												);
												$(this).closest('.card, li').find('.btn2').html('✓');
												$(this).closest('.card, li').find('.btn2').toggle();
											}
										} else {
											// if the selected card is coffee syrup flavor
											if (!userOrderDrink.checkIfSyrupSelected()) {
												const servingSize = 'regular';
												console.log('servingSize', servingSize);

												userOrderDrink.addSyrup(
													selectedItemIndex,
													servingSize,
													selectedItemCategoryIndex,
													drinkCategoryDataArray
												);
												$(this).closest('.card, li').find('.btn2').html('✓');
												$(this).closest('.card, li').find('.btn2').toggle();
											}
										}
									}
									// if the selected card is milk
									else {
										// make sure a milk hasn't already been selected when selecting a milk card
										if (!userOrderDrink.checkIfMilkSelected()) {
											userOrderDrink.addMilk(
												selectedItemIndex,
												selectedItemCategoryIndex,
												drinkCategoryDataArray
											);
											$(this).closest('.card, li').find('.btn2').html('✓');
											$(this).closest('.card, li').find('.btn2').toggle();
											$('#errorMilk').hide();

											// if a milk has been selected then we want to make sure all the other milk cards are knocked out
											//and we want to change the milk error message to say that only one milk may be selected
										}
									}
								}
								// if a coffee has not already been selected and the card being selected isn't any of the other drink options then the card being selected should be coffee
							} else if (selectedItemCategory === 'coffee') {
								const espressoServingSize = 'regular';
								userOrderDrink.addCoffee(
									selectedItemIndex,
									espressoServingSize,
									selectedItemCategoryIndex,
									drinkCategoryDataArray
								);
								$(this).closest('.card, li').find('.btn2').html('✓');
								$(this).closest('.card, li').find('.btn2').toggle();
							}

							// cleanup after the card has been selected

							if (userOrderDrink.checkIfCoffeeSelected()) {
								$('#cardDeck-0')
									.find('.card, .list-group-item')
									.each(function () {
										const selectedItemIndex = $(this).closest('.card, li').attr('id').split('-')[1];
										const selectedItemCategoryIndex = $(this)
											.closest('.card-deck, .list-group')
											.attr('id')
											.split('-')[1];
										if (
											!userOrderDrink.checkIfThisDrinkSelected(
												selectedItemIndex,
												selectedItemCategoryIndex,
												drinkCategoryDataArray
											)
										) {
											$(this).css('opacity', '.3');
										}
									});
								// activate the milk and temp and syrup cards after selecting coffee
								$('#cardDeck-1, #cardDeck-2, #cardDeck-3').each(function () {
									$(this)
										.find('.card, .list-group-item')
										.each(function () {
											$(this).css('opacity', '1');
										});
									$('#errorMilk').hide();
									$('#errorSyrup').hide();
									$('#errorTemp').hide();
								});
							}
							if (userOrderDrink.checkIfMilkSelected()) {
								$('#cardDeck-1')
									.find('.card, .list-group-item')
									.each(function () {
										const selectedItemIndex = $(this).attr('id').split('-')[1];
										const selectedItemCategory = newDrinkCategories[selectedItemCategoryIndex].id;

										// make sure that you don't hide the already selected milk
										if (
											!userOrderDrink.checkIfThisMilkSelected(
												selectedItemIndex,
												selectedItemCategoryIndex,
												selectedItemCategory,
												drinkCategoryDataArray
											)
										) {
											$(this).css('opacity', '.3');
										}
									});
								$('#errorMilk').html('You may only select one milk for your coffee');
								$('#errorMilk').show();
							}

							if (userOrderDrink.checkIfTempSelected()) {
								// if a temp has been selected then we want to make sure all the other temp cards are knocked out
								//and we want to change the temp error message to say that only one temp may be selected
								$('#cardDeck-2')
									.find('.card, .list-group-item')
									.each(function () {
										const selectedItemIndex = $(this).closest('.card, li').attr('id').split('-')[1];
										const selectedItemCategoryIndex = $(this)
											.closest('.card-deck, .list-group')
											.attr('id')
											.split('-')[1];
										const selectedItemCategory = newDrinkCategories[selectedItemCategoryIndex].id;
										if (
											!userOrderDrink.checkIfThisTempSelected(
												selectedItemIndex,
												selectedItemCategoryIndex,
												selectedItemCategory,
												drinkCategoryDataArray
											)
										) {
											$(this).css('opacity', '.3');
										}
									});
								$('#errorTemp').html('You may only select one temperature for your coffee');
								$('#errorTemp').show();
							}
							if (userOrderDrink.checkIfSyrupSelected()) {
								// if a temp has been selected then we want to make sure all the other temp cards are knocked out
								//and we want to change the temp error message to say that only one temp may be selected
								$('#cardDeck-3')
									.find('.card, .list-group-item')
									.each(function () {
										const selectedItemIndex = $(this).closest('.card, li').attr('id').split('-')[1];
										const selectedItemCategoryIndex = $(this)
											.closest('.card-deck, li')
											.attr('id')
											.split('-')[1];
										const selectedItemCategory = newDrinkCategories[selectedItemCategoryIndex].id;

										if (
											!userOrderDrink.checkIfThisSyrupSelected(
												selectedItemIndex,
												selectedItemCategoryIndex,
												selectedItemCategory,
												drinkCategoryDataArray
											)
										) {
											$(this).css('opacity', '.3');
										}
									});
								$('#errorSyrup').html('You may only select one syrup for your coffee');
								$('#errorSyrup').show();
							}
						}
					}
				});
			$('.btn')
				.unbind('click')
				.bind('click', function () {
					const selectedItemIndex = $(this).closest('.card, li').attr('id').split('-')[1];
					const selectedItemCategoryIndex = $(this)
						.closest('.card-deck, .list-group')
						.attr('id')
						.split('-')[1];
					const selectedItemCategory = newDrinkCategories[selectedItemCategoryIndex].id;

					if ($(this).html() == 'Customize') {
						if (selectedItemCategory === 'syrup') {
							//https://stackoverflow.com/questions/857245/is-there-a-jquery-unfocus-method
							$(this).blur();
							$(this).html('2 Pumps');
							$(this).closest('.card, li').find('.btn3').show();
							$(this).closest('.card, li').find('.btn4').show();
						} else if (selectedItemCategory === 'coffee') {
							//https://stackoverflow.com/questions/857245/is-there-a-jquery-unfocus-method
							$(this).blur();
							$(this).html('3 Espresso Shots');
							$(this).closest('.card, li').find('.btn3').show();
							$(this).closest('.card, li').find('.btn4').show();
						}
					} else {
						const servingSizeIndex = $(this).attr('id').split('-')[1];
						const servingSize = drinkServingSizes[servingSizeIndex].serving_size;
						console.log('servingSize', servingSize);

						if (selectedItemCategory === 'syrup') {
							userOrderDrink.addSyrup(
								selectedItemIndex,
								servingSize,
								selectedItemCategoryIndex,
								drinkCategoryDataArray
							);
							$(this).closest('.card, li').find('.btn2').html('2X');
						} else if (selectedItemCategory === 'coffee') {
							userOrderDrink.addCoffee(
								selectedItemIndex,
								servingSize,
								selectedItemCategoryIndex,
								drinkCategoryDataArray
							);
							$(this).closest('.card, li').find('.btn2').html('3X');
							// if you selected coffee by getting extra espresso then we still need to blot out the other coffee cards
							$('#cardDeck-0')
								.find('.card, .list-group-item')
								.each(function () {
									const selectedItemIndex = $(this).attr('id').split('-')[1];
									const selectedItemCategoryIndex = $(this)
										.closest('.card-deck, .list-group')
										.attr('id')
										.split('-')[1];
									if (
										!userOrderDrink.checkIfThisDrinkSelected(
											selectedItemIndex,
											selectedItemCategoryIndex,
											drinkCategoryDataArray
										)
									) {
										$(this).css('opacity', '.3');
									}
								});
							$('#cardDeck-1, #cardDeck-2, #cardDeck-3').each(function () {
								$(this)
									.find('.card, .list-group-item')
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
						$(this).closest('.card, .list-group-item').find('.btn2').show();
						$(this).closest('.card, .list-group-item').find('.btn3').hide();
						$(this).closest('.card, .list-group-item').find('.btn4').hide();
					}
				});

			$('.btn3, .btn4').each(function () {
				$(this)
					.unbind('click')
					.bind('click', function () {
						const servingSizeIndex = $(this).attr('id').split('-')[1];
						const servingSize = drinkServingSizes[servingSizeIndex].serving_size;
						console.log('servingSize', servingSize);

						if (servingSize === 'light') {
							$(this).closest('.card, .list-group-item').find('.btn2').html('½');
						} else if (servingSize === 'regular') {
							$(this).closest('.card, .list-group-item').find('.btn2').html('✓');
						}
						const selectedItemIndex = $(this).closest('.card, .list-group-item').attr('id').split('-')[1];
						const selectedItemCategoryIndex = $(this)
							.closest('.card-deck, .list-group')
							.attr('id')
							.split('-')[1];
						const selectedItemCategory = newDrinkCategories[selectedItemCategoryIndex].id;

						if (selectedItemCategory === 'syrup') {
							userOrderDrink.addSyrup(
								selectedItemIndex,
								servingSize,
								selectedItemCategoryIndex,
								drinkCategoryDataArray
							);
							$('#cardDeck-3')
								.find('.card, .list-group-item')
								.each(function () {
									const selectedItemIndex = $(this).attr('id').split('-')[1];
									const selectedItemCategoryIndex = $(this)
										.closest('.card-deck, .list-group')
										.attr('id')
										.split('-')[1];
									const selectedItemCategory = newDrinkCategories[selectedItemCategoryIndex].id;
									if (
										!userOrderDrink.checkIfThisSyrupSelected(
											selectedItemIndex,
											selectedItemCategoryIndex,
											selectedItemCategory,
											drinkCategoryDataArray
										)
									) {
										$(this).css('opacity', '.3');
									}
								});
						} else if (selectedItemCategory === 'coffee') {
							userOrderDrink.addCoffee(
								selectedItemIndex,
								servingSize,
								selectedItemCategoryIndex,
								drinkCategoryDataArray
							);
							// if you selected coffee by getting extra espresso then we still need to blot out the other coffee cards
							$('#cardDeck-0')
								.find('.card, .list-group-item')
								.each(function () {
									const selectedItemIndex = $(this).attr('id').split('-')[1];
									const selectedItemCategoryIndex = $(this)
										.closest('.card-deck, .list-group')
										.attr('id')
										.split('-')[1];
									if (
										!userOrderDrink.checkIfThisDrinkSelected(
											selectedItemIndex,
											selectedItemCategoryIndex,
											drinkCategoryDataArray
										)
									) {
										$(this).css('opacity', '.3');
									}
								});
							$('#cardDeck-1, #cardDeck-2, #cardDeck-3').each(function () {
								$(this)
									.find('.card, .list-group-item')
									.each(function () {
										$(this).css('opacity', '1');
									});
								$('#errorMilk').hide();
								$('#errorSyrup').hide();
								$('#errorTemp').hide();
							});
						}
						$(this).closest('.card, .list-group-item').find('.btn2').show();
						$(this).hide();
						$(this).closest('.card, .list-group-item').find('.btn4').hide();
						$(this).closest('.card, .list-group-item').find('.btn').html('Customize');
					});
			});

			$('.btn6')
				.unbind('click')
				.bind('click', function () {
					const selectedItemIndex = $(this).closest('.card, .list-group-item').attr('id').split('-')[1];
					const selectedItemCategoryIndex = $(this)
						.closest('.card-deck, .list-group')
						.attr('id')
						.split('-')[1];
					userOrderDrink.changeDrinkQuantity(
						selectedItemIndex,
						selectedItemCategoryIndex,
						'decrease',
						drinkCategoryDataArray,
						newDrinkCategories
					);
					if (
						userOrderDrink.findDrink(selectedItemIndex, selectedItemCategoryIndex, drinkCategoryDataArray)
							.quantity <= 0
					) {
						$(this).closest('.card, .list-group-item').find('.btn2').hide();
						$(this)
							.closest('.card, .list-group-item')
							.find('.btn2')
							.html(
								userOrderDrink.findDrink(
									selectedItemIndex,
									selectedItemCategoryIndex,
									drinkCategoryDataArray
								).quantity
							);
						userOrderDrink.removeDrink(
							selectedItemIndex,
							selectedItemCategoryIndex,
							drinkCategoryDataArray
						);
						$(this).hide();
						$(this).closest('.card, .list-group-item').find('.btn7').hide();
					} else {
						$(this)
							.closest('.card, .list-group-item')
							.find('.btn2')
							.html(
								userOrderDrink.findDrink(
									selectedItemIndex,
									selectedItemCategoryIndex,
									drinkCategoryDataArray
								).quantity
							);
						$(this).closest('.card, .list-group-item').find('.btn2').show();
					}
				});

			$('.btn7')
				.unbind('click')
				.bind('click', function () {
					const selectedItemIndex = $(this).closest('.card, .list-group-item').attr('id').split('-')[1];
					const selectedItemCategoryIndex = $(this)
						.closest('.card-deck, .list-group')
						.attr('id')
						.split('-')[1];
					userOrderDrink.changeDrinkQuantity(
						selectedItemIndex,
						selectedItemCategoryIndex,
						'increase',
						drinkCategoryDataArray,
						newDrinkCategories
					);
					$(this)
						.closest('.card, .list-group-item')
						.find('.btn2')
						.html(
							userOrderDrink.findDrink(
								selectedItemIndex,
								selectedItemCategoryIndex,
								drinkCategoryDataArray
							).quantity
						);
					$(this).closest('.card, .list-group-item').find('.btn2').show();
				});
		})
		.on('mouseleave', '.card, .list-group-item', function () {
			const selectedItemIndex = $(this).attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck, .list-group').attr('id').split('-')[1];
			const selectedItemCategory = newDrinkCategories[selectedItemCategoryIndex].id;
			if (
				!userOrderDrink.checkIfThisDrinkSelected(
					selectedItemIndex,
					selectedItemCategoryIndex,
					drinkCategoryDataArray
				)
			) {
				$(this).find('.btn').hide();
				$(this).find('.btn3').hide();
				$(this).find('.btn4').hide();
			} else if (
				!userOrderDrink.checkIfThisSyrupSelected(
					selectedItemIndex,
					selectedItemCategoryIndex,
					selectedItemCategory,
					drinkCategoryDataArray
				)
			) {
				$(this).find('.btn').hide();
				$(this).find('.btn3').hide();
				$(this).find('.btn4').hide();
			} else {
				$(this).find('.btn3').hide();
				$(this).find('.btn4').hide();
			}

			$(this).find('.btn').html('Customize');
			$(this).find('.card-body, .card-img-top, img, h5, p').css('opacity', '1');
		});

	// click the card buttons
});

// all this code changes display for smaller screen sizes
var cWidth = $(window).width();
//https://stackoverflow.com/questions/1974788/combine-onload-and-onresize-jquery
$(window).on('load resize', function () {
	const newWidth = $(window).width();

	if (cWidth < newWidth) {
		cWidth = newWidth;
	}

	if ($(window).width() < 767) {
		const cardDeckElements = document.getElementsByClassName('card-deck');
		const cardTitleElements = document.getElementsByClassName('card-title');
		const cardTextElements = document.getElementsByClassName('card-text');
		const cardImgTopElements = document.getElementsByClassName('card-img-top');

		$('#crepeImg').css('margin-left', '0px');
		$('#cardText').css('margin-left', '0px');
		$('#cardText').css('margin-right', '0px');
		$('#cardText').css('margin-bottom', '20px');
		$('#cardBody').css('margin-left', '0px');

		const cardTitleValues = new Array();
		for (var i = 0; i < cardTitleElements.length; i++) {
			cardTitleValues.push(cardTitleElements[i].innerHTML);
		}

		const constCardTitleValues = [...cardTitleValues];
		const cardTextValues = new Array();
		for (var i = 0; i < cardTextElements.length; i++) {
			cardTextValues.push(cardTextElements[i].innerHTML);
		}

		const constCardTextValues = [...cardTextValues];
		var cardImgSrcValues = new Array();
		for (var i = 0; i < cardImgTopElements.length; i++) {
			cardImgSrcValues.push(cardImgTopElements[i].src);
		}

		const constCardImgSrcValues = [...cardImgSrcValues];
		const cardDeckElementsLength = cardDeckElements.length;
		// var cardDeckTitleValues = new Array();
		// for (var i = 0; i < h3Elements.length; i++) {
		// 	cardDeckTitleValues.push(h3Elements[i].innerHTML);
		// }

		const cardDeckChildrenLength = new Array();
		const constCardDeckNodes = new Array();
		for (var i = 0; i < cardDeckElementsLength; i++) {
			const clone = cardDeckElements[i].cloneNode(true);
			constCardDeckNodes.push(clone);
			const cardDeckCards = cardDeckElements[i].children;
			var counter = 0;
			for (var j = 0; j < cardDeckCards.length; j++) {
				if (cardDeckCards[j].className == 'card') {
					counter += 1;
				}
			}
			cardDeckChildrenLength.push(counter);
		}

		for (var i = 0; i < cardDeckElementsLength; i++) {
			removeAllChildNodes(cardDeckElements[i]);
		}

		for (var i = 0; i < cardDeckElementsLength; i++) {
			const row = document.createElement('div');
			row.setAttribute('class', 'row');
			row.setAttribute('style', 'width: 100%');
			const listGroupTitle = document.createElement('div');
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
				for (var m = 0; m < i; m++) {
					priorChildLength += cardDeckChildrenLength[m];
				}
				k = priorChildLength;
			}
			console.log('k', k);

			const stoppingPoint = k + cardDeckChildrenLength[i];
			for (var k; k < stoppingPoint; k++) {
				const listValue = document.createElement('li');
				listValue.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
				listValue.setAttribute('style', 'width:100%');

				const string1 = String(constCardTitleValues[k]);
				const string2 = String(constCardTextValues[k]);
				console.log('string2', string2);

				const container = document.createElement('container');
				container.setAttribute('style', 'width:30%');

				const listValueHeader = document.createElement('h5');
				const listValueBodyText = document.createElement('p');
				if (constCardTextValues[k]) {
					listValueBodyText.innerHTML = string2;
					listValueHeader.innerHTML = string1 + '<br>';
					container.appendChild(listValueHeader);
					container.appendChild(listValueBodyText);
					listValue.appendChild(container);
				} else {
					listValueHeader.innerHTML = string1;
					container.appendChild(listValueHeader);
					listValue.appendChild(container);
				}
				const imageParent = document.createElement('div');
				imageParent.setAttribute('class', 'image-parent');
				const img = document.createElement('img');
				img.setAttribute('src', constCardImgSrcValues[k]);
				img.setAttribute('class', 'img-fluid');
				imageParent.appendChild(img);

				listValue.appendChild(imageParent);
				listGroupTitle.append(listValue);
			}

			row.appendChild(listGroupTitle);
			const x = document.getElementsByClassName('list-group');
			x[i].appendChild(row);
		}
		$('.list-group').each(function (i) {
			var cardDeckId = 'cardDeck-';
			cardDeckId += String(i);
			this.id = cardDeckId;
			$(this)
				.find('.list-group-item')
				.each(function (i) {
					var cardId = 'listItem-';
					cardId += String(i);
					this.id = cardId;
					const selectedItemCategoryIndex = $(this).closest('.list-group').attr('id').split('-')[1];
					const selectedItemCategory = newDrinkCategories[selectedItemCategoryIndex].id;
					if (selectedItemCategory === 'syrup' || selectedItemCategory === 'coffee') {
						$(`<div class='container3'>
						<div class='grid-container' style='margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto; grid-gap: 2px; display:grid;'>
							<button class='btn' id='servingSize-2' style='display: none;'>Customize</button>
							<button class='btn2'>✓</button>
						</div>
					</div>`).insertAfter($(this).find('container'));
					} else if (
						selectedItemCategory === 'bottled' ||
						selectedItemCategory === 'milkshake' ||
						selectedItemCategory === 'non-coffee'
					) {
						$(
							`<div class="container4"><div class="grid-container" style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto; grid-gap: 2px; display:grid;"><button class="btn6">-</button><button class="btn2">1</button><button class="btn7">+</button></div></div>`
						).insertAfter($(this).find('container'));
					} else if (selectedItemCategory === 'temperature' || selectedItemCategory === 'milk') {
						$(`<div class='container3'>
						<div class='grid-container' style='margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto; grid-gap: 2px; display:grid;'>
							<button class='btn2'>✓</button>
						</div>
					</div>`).insertAfter($(this).find('container'));
					}
				});
		});
	} else {
		$('#cardText').css('margin-left', '180px');
		$('#cardText').css('margin-right', '50px');
		$('#cardBody').css('margin-left', '170px');
	}
});
// TODO: add sauteed onions & peppers, pesto, dill
var cWidth = $(window).width();
$(window).on('resize', function () {
	const newWidth = $(window).width();
	if (cWidth < newWidth) {
		cWidth = newWidth;
	}
	if ($(window).width() > 767) {
		location.reload();
	}
});
