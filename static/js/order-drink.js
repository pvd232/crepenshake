('use strict');
import { Order, OrderDrink, humanize } from './model.js';

var editDrinkIndex = null;
var editOrder = null;
var userOrderDrink = new OrderDrink();

function checkOut (order) {
	if (editDrinkIndex != null) {
		// when checking out make sure that if no milk has been selected then we assign the default value of 2%
		for (var i = 0; i < userOrderDrink.orderDrink.length; i++) {
			if (userOrderDrink.orderDrink[i].drinkCategory === 'coffee') {
				if (!userOrderDrink.orderDrink[i]._milkType) {
					userOrderDrink.orderDrink[i]._milkType = 'two_percent_milk';
				}
			}
		}
		$.when(stringify(order)).then(location.assign('/order?userOrder=true'));
	} else {
		$.when(stringify(order)).then(location.assign('/order/side'));
	}
};

function stringify (drinkOrder) {
	if (editDrinkIndex === null) {
		const order = new Order();
		if (drinkOrder.orderDrink.length) {
			if (localStorage.getItem('order')) {
				order.fromJSON(localStorage.getItem('order'));
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

function removeAllChildNodes (parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
};

function modifyOrder () {
	if ($('.edit').length) {
		editDrinkIndex = $('.edit').first().attr('id');
		editOrder = new Order();
		editOrder.fromJSON(localStorage.getItem('order'));

		const editOrderDrink = editOrder.orderDrink[editDrinkIndex];
		userOrderDrink = editOrderDrink;

		for (var i = 0; i < editOrderDrink.orderDrink.length; i++) {
			const drink = editOrderDrink.orderDrink[i];

			if (drink.drinkCategory === 'coffee') {
				//send crepe recipe to blaise
				if (drink.espressoServingSize === 'extra') {
					$(`#${drink.id}-${drink.servingSize}`).find('.btn2').html('3x');
					$(`#${drink.id}-${drink.servingSize}`).find('.btn2').show();
					$(`#${drink.id}-${drink.servingSize}`).find('.btn').show();
				} else if (drink.espressoServingSize === 'regular') {
					$(`#${drink.id}-${drink.servingSize}`).find('.btn2').html('✓');
					$(`#${drink.id}-${drink.servingSize}`).find('.btn2').show();
					$(`#${drink.id}-${drink.servingSize}`).find('.btn').show();
				} else if (drink.espressoServingSize === 'light') {
					$(`#${drink.id}-${drink.servingSize}`).find('.btn2').html('½');
					$(`#${drink.id}-${drink.servingSize}`).find('.btn2').show();
					$(`#${drink.id}-${drink.servingSize}`).find('.btn').show();
				}
				if (drink.flavorSyrup) {
					if (drink.flavorSyrupServingSize === 'extra') {
						$(`#${drink.flavorSyrup}`).closest('.card, .list-group-item').find('.btn2').html('2x');
						$(`#${drink.flavorSyrup}`).closest('.card, .list-group-item').find('.btn2').show();
						$(`#${drink.flavorSyrup}`).closest('.card, .list-group-item').find('.btn').show();
					} else if (drink.flavorSyrupServingSize === 'regular') {
						$(`#${drink.flavorSyrup}`).closest('.card, .list-group-item').find('.btn2').html('✓');
						$(`#${drink.flavorSyrup}`).closest('.card, .list-group-item').find('.btn2').show();
						$(`#${drink.flavorSyrup}`).closest('.card, .list-group-item').find('.btn').show();
					} else if (drink.flavorSyrupServingSize === 'light') {
						$(`#${drink.flavorSyrup}`).closest('.card, .list-group-item').find('.btn2').html('½');
						$(`#${drink.flavorSyrup}`).closest('.card, .list-group-item').find('.btn2').show();
						$(`#${drink.flavorSyrup}`).closest('.card, .list-group-item').find('.btn').show();
					}
				}
				const milkName = drink.milkType;

				$(`#${milkName}`).closest('.card, .list-group-item').find('.btn2').show();
				if (drink.temperature) {
					$(`#${drink.temperature}`).closest('.card, .list-group-item').find('.btn2').show();
				}
				$('#coffee')
					.find('.card, .list-group-item')
					.each(function () {
						const json = JSON.parse($(this).attr('data-drinks'));
						if (!userOrderDrink.findDrink(json)) {
							$(this).css('opacity', '.3');
						}
					});
				$('#milk, #temperature, #syrup').each(function () {
					$(this)
						.find('.card, .list-group-item')
						.each(function () {
							const json = JSON.parse($(this).attr('data-drinks'));
							const selectedItemCategory = $(this).closest('.card-deck, .list-group').attr('id');
							if (selectedItemCategory === 'milk') {
								if (userOrderDrink.checkIfMilkSelected()) {
									if (userOrderDrink.checkIfThisMilkSelected(json)) {
										$(this).css('opacity', '1');
									}
									else {
										$(this).css('opacity', '.3');
								}
									$('#errorMilk').html('Only 1 milk per coffee');
									$('#errorMilk').show();
								} else {
									$('#errorMilk').hide();
								}
							} else if (selectedItemCategory === 'temperature') {
								if (userOrderDrink.checkIfTempSelected()) {
									if (userOrderDrink.checkIfThisTempSelected(json)) {
										$(this).css('opacity', '1');
									}
									else {
										$(this).css('opacity', '.3');
									}
									$('#errorTemp').html('*Only 1 temperature per coffee');
									$('#errorTemp').show();
								} else {
									$('#errorTemp').hide();
								}
							} else if (selectedItemCategory === 'syrup') {
								if (userOrderDrink.checkIfSyrupSelected()) {
									if (userOrderDrink.checkIfThisSyrupSelected(json)) {
										$(this).css('opacity', '1');
									} else {
										$(this).css('opacity', '.3');
									}
									$('#errorSyrup').html('*Only 1 syrup per coffee');
									$('#errorSyrup').show();
								} 
							} else {
								$('#errorSyrup').hide();
							}
						});
				});
			} else if (drink.drinkCategory === 'non-coffee') {
				$(`#${drink.id}-${drink.servingSize}`).find('.btn2').html(drink.quantity);
				$(`#${drink.id}-${drink.servingSize}`).find('.btn2').show();
				$(`#${drink.id}-${drink.servingSize}`).find('.btn6').show();
				$(`#${drink.id}-${drink.servingSize}`).find('.btn7').show();
			}
			else {
				$(`#${drink.id}`).find('.btn2').html(drink.quantity);
				$(`#${drink.id}`).find('.btn2').show();
				$(`#${drink.id}`).find('.btn6').show();
				$(`#${drink.id}`).find('.btn7').show();
			}
		}
	}
};
function pageLogic () {
	$('.card, .list-group-item')
		.on('mouseenter', function () {
			if ($(this).attr('class') === 'card') {
				const json = JSON.parse($(this).attr('data-drinks'));
				const selectedItemCategory = $(this).closest('.card-deck').attr('id');
				// if the card isn't milk or temperature or syrup
				if (
					selectedItemCategory != 'milk' &&
					selectedItemCategory != 'temperature' &&
					selectedItemCategory != 'syrup'
				) {
					// if the card also isn't coffee then fade it out
					if (selectedItemCategory != 'coffee') {
						$(this).find('.card-body, .card-img-top').css('opacity', '.3');
						// if the card is coffee but a coffee has not been previously selected
					} else if (!userOrderDrink.checkIfCoffeeSelected()) {
						$(this).find('.card-body, .card-img-top').css('opacity', '.3');
						$(this).find('.btn').show();
					}
				} else if (selectedItemCategory === 'syrup' && userOrderDrink.checkIfCoffeeSelected()) {
					$(this).find('.card-body, .card-img-top').css('opacity', '.3');
					$(this).find('.btn').show();
					// if the hover card is milk and a coffee has been selected then fade it out
				} else if (selectedItemCategory === 'milk' && userOrderDrink.checkIfCoffeeSelected()) {
					// 	make sure a milk hasn't already been selected
					if (!userOrderDrink.checkIfMilkSelected()) {
						$(this).find('.card-body, .card-img-top').css('opacity', '.3');
					}
				} else if (selectedItemCategory === 'temperature' && userOrderDrink.checkIfCoffeeSelected()) {
					if (!userOrderDrink.checkIfTempSelected()) {
						$(this).find('.card-body, .card-img-top').css('opacity', '.3');
					} else if (userOrderDrink.checkIfThisTempSelected(json)) {
						$(this).find('.card-body, .card-img-top').css('opacity', '.3');
					}
				}
			}
			//click the card somewhere
			$(this)
				.unbind('click')
				.bind('click', function (event) {
					const senderElementClass = event.target.getAttribute('class');
					const senderElementType = event.target.tagName;
					if (
						senderElementClass === 'list-group-item d-flex justify-content-between align-items-center' ||
						senderElementClass === 'card-text' ||
						senderElementClass === 'card-title' ||
						senderElementClass === 'card-body' ||
						senderElementClass === 'card-img-top' ||
						senderElementType === 'CONTAINER' ||
						senderElementType === 'P' ||
						senderElementType === 'IMG' ||
						senderElementType === 'H2'
					) {
						const json = JSON.parse($(this).closest('.card, li').attr('data-drinks'));
						const selectedItemCategory = $(this).closest('.card-deck, .list-group').attr('id');
						// check to see if the card is bottled or non-coffee or milkshake first because when you click on those cards, if they have already been selected you don't want to remove them
						// these cards have counters so they will have fundamentally different logic from the rest of the cards which is why we want to evaluate them first and then apply other logical conditions after
						// if you're clicking the card and it is a bottled drink or milkshake or non-coffee drink then by default you are adding the drink
						if (
							selectedItemCategory === 'bottled' ||
							selectedItemCategory === 'non-coffee' ||
							selectedItemCategory === 'milkshake'
						) {
							const newDrink = userOrderDrink.changeDrinkQuantity(json, 'increase');
							$(this).closest('.card, li').find('.btn2').html(newDrink.quantity);
							$(this).closest('.card, li').find('.btn2').show();
							//after clicking the card show the + and - buttons
							$(this).closest('.card, li').find('.btn6').show();
							$(this).closest('.card, li').find('.btn7').show();
						}

						// if you click the card and it has already been selected then remove the item
						else if (userOrderDrink.findDrink(json)) {
							userOrderDrink.removeDrink(json);
							$(this).closest('.card, li').find('.btn2').hide();
							$(this).closest('.card, li').find('.btn').toggle();

							// if the card you removed was a coffee card
							if (!userOrderDrink.checkIfCoffeeSelected()) {
								// reactivate all the coffee cards
								$('#coffee')
									.find('.card, .list-group-item')
									.each(function () {
										$(this).css('opacity', '1');
									});
								$('#milk, #temperature, #syrup')
									.find('.card, .list-group-item')
									.each(function () {
										$(this).css('opacity', '.3');
										$(this).find('.btn2').hide();
										$(this).find('.btn').hide();
									});
								$('#errorMilk').html('*Please select a coffee first');
								$('#errorTemp').html('*Please select a coffee first');
								$('#errorSyrup').html('*Please select a coffee first');
								$('#errorMilk').show();
								$('#errorTemp').show();
								$('#errorSyrup').show();
							}
						} else if (selectedItemCategory === 'milk' && userOrderDrink.checkIfThisMilkSelected(json)) {
							userOrderDrink.removeMilk();
							// reactivate all the milk cards
							$(this).closest('.card, li').find('.btn2').hide();
							$('#milk')
								.find('.card, .list-group-item')
								.each(function () {
									$(this).css('opacity', '1');
								});
							$('#errorMilk').hide();
						} else if (
							selectedItemCategory === 'temperature' &&
							userOrderDrink.checkIfThisTempSelected(json)
						) {
							userOrderDrink.removeTemp();
							$(this).closest('.card, li').find('.btn2').hide();
							$('#temperature')
								.find('.card, .list-group-item')
								.each(function () {
									$(this).css('opacity', '1');
								});
							$('#errorTemp').hide();
						} else if (selectedItemCategory === 'syrup' && userOrderDrink.checkIfThisSyrupSelected(json)) {
							userOrderDrink.removeSyrup();
							$(this).closest('.card, li').find('.btn2').hide();
							$('#syrup')
								.find('.card, .list-group-item')
								.each(function () {
									$(this).css('opacity', '1');
								});
							$('#errorSyrup').hide();
						}
						// if the drink/temp/milk hasn't already been selected and is not bottled non-coffee or milkshake
						else {
							//this is being considered before the drink selection has been added to the order
							// if a coffee has been selected already then milk or syrup can be selected
							if (userOrderDrink.checkIfCoffeeSelected()) {
								// if coffee has been selected alredy then we don't want to select another coffee!
								if (selectedItemCategory != 'coffee') {
									//make sure the selected card isn't milk because we want extra logic in there to make sure a milk hasn't already been selected
									if (selectedItemCategory != 'milk') {
										if (selectedItemCategory === 'temperature') {
											if (!userOrderDrink.checkIfTempSelected()) {
												userOrderDrink.addTemp(json);
												$(this).closest('.card, li').find('.btn2').html('✓');
												$(this).closest('.card, li').find('.btn2').toggle();
												// if a temp has been selected then we want to make sure all the other temp cards are knocked out
												//and we want to change the temp error message to say that only one temp may be selected
												$('#temperature')
													.find('.card, .list-group-item')
													.each(function () {
														const json = JSON.parse($(this).attr('data-drinks'));

														if (!userOrderDrink.checkIfThisTempSelected(json)) {
															$(this).css('opacity', '.3');
														}
													});
												$('#errorTemp').html('*Only 1 temperature per coffee');
												$('#errorTemp').show();
											}
										} else {
											// if the selected card is coffee syrup flavor
											if (!userOrderDrink.checkIfSyrupSelected()) {
												const servingSize = 'regular';
												userOrderDrink.addSyrup(json, servingSize);
												$(this).closest('.card, li').find('.btn2').html('✓');
												$(this).closest('.card, li').find('.btn2').show();
												$(this).closest('.card, li').find('.btn').show();

												// if a temp has been selected then we want to make sure all the other temp cards are knocked out
												//and we want to change the temp error message to say that only one temp may be selected
												$('#syrup')
													.find('.card, .list-group-item')
													.each(function () {
														const json = JSON.parse($(this).attr('data-drinks'));
														if (!userOrderDrink.checkIfThisSyrupSelected(json)) {
															$(this).css('opacity', '.3');
														}
													});
												$('#errorSyrup').html('*Only 1 syrup per coffee');
												$('#errorSyrup').show();
											}
										}
									}
									// if the selected card is milk
									else if (selectedItemCategory === 'milk') {
										// make sure a milk hasn't already been selected when selecting a milk card
										if (!userOrderDrink.checkIfMilkSelected()) {
											userOrderDrink.addMilk(json);
											$(this).closest('.card, li').find('.btn2').html('✓');
											$(this).closest('.card, li').find('.btn2').toggle();
											$('#errorMilk').hide();
											$('#milk')
												.find('.card, .list-group-item')
												.each(function () {
													const json = JSON.parse($(this).attr('data-drinks'));
													// make sure that you don't hide the already selected milk
													if (!userOrderDrink.checkIfThisMilkSelected(json)) {
														$(this).css('opacity', '.3');
													}
												});
											$('#errorMilk').html('*Only 1 milk per coffee');
											$('#errorMilk').show();
										}
									}
								}
								// if a coffee has not already been selected and the card being selected isn't any of the other drink options then the card being selected should be coffee
							} else if (selectedItemCategory === 'coffee') {
								const espressoServingSize = 'regular';
								userOrderDrink.addCoffee(json, espressoServingSize);
								$(this).closest('.card, li').find('.btn2').html('✓');
								$(this).closest('.card, li').find('.btn2').toggle();
								$(this).closest('.card, li').find('.btn').toggle();

								$('#milk, #temperature, #syrup').each(function () {
									$(this)
										.find('.card, .list-group-item')
										.each(function () {
											$(this).css('opacity', '1');
										});
									$('#errorMilk').hide();
									$('#errorSyrup').hide();
									$('#errorTemp').hide();
								});
								$('#coffee')
									.find('.card, .list-group-item')
									.each(function () {
										const json = JSON.parse($(this).attr('data-drinks'));
										if (!userOrderDrink.findDrink(json)) {
											$(this).css('opacity', '.3');
										}
									});
							}
						}
					}
				});
			$('.btn')
				.unbind('click')
				.bind('click', function () {
					const selectedItemCategory = $(this).closest('.card-deck, .list-group').attr('id');
					const json = JSON.parse($(this).closest('.card, .list-group-item').attr('data-drinks'));
					if ($(this).html() == 'Customize') {
						if (selectedItemCategory === 'syrup' && !userOrderDrink.checkIfSyrupSelected()) {
							$(this).blur();
							$(this).html('2 Pumps');
							$(this).closest('.card, li').find('.btn3').show();
							$(this).closest('.card, li').find('.btn4').show();
						} else if (selectedItemCategory === 'coffee') {
							$(this).blur();
							$(this).html('3 Espresso Shots');
							$(this).closest('.card, li').find('.btn3').show();
							$(this).closest('.card, li').find('.btn4').show();
						}
					} else {
						const servingSize = 'extra';
						var coffeeBool;

						if (!userOrderDrink.checkIfCoffeeSelected()) {
							coffeeBool = false
						}
						if (selectedItemCategory === 'syrup') {
							userOrderDrink.addSyrup(json, servingSize);
							$(this).closest('.card, li').find('.btn2').html('2X');
							// if a temp has been selected then we want to make sure all the other temp cards are knocked out
							//and we want to change the temp error message to say that only one temp may be selected
							$('#syrup')
								.find('.card, .list-group-item')
								.each(function () {
									const json = JSON.parse($(this).attr('data-drinks'));
									if (!userOrderDrink.checkIfThisSyrupSelected(json)) {
										$(this).css('opacity', '.3');
									}
								});
							$('#errorSyrup').html('Max of 1 syrup');
							$('#errorSyrup').show();
						} else if (selectedItemCategory === 'coffee') {
							if (!userOrderDrink.findDrink(json)) {
								userOrderDrink.addCoffee(json, servingSize);
								$('#errorCoffee').show();
							} else {
								userOrderDrink.updateEspressoServingSize(json, servingSize);
							}
							$(this).closest('.card, li').find('.btn2').html('3X');
							// if you selected coffee by getting extra espresso then we still need to blot out the other coffee cards
							$('#coffee')
								.find('.card, .list-group-item')
								.each(function () {
									const json = JSON.parse($(this).attr('data-drinks'));

									if (!userOrderDrink.findDrink(json)) {
										$(this).css('opacity', '.3');
									}
								});
								if (!coffeeBool){
							$('#milk, #temperature, #syrup').each(function () {
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
						const json = JSON.parse($(this).closest('.card, li').attr('data-drinks'));
						var servingSize;
						if ($(this).attr('class') === 'btn3') {
							servingSize = 'light';
							$(this).closest('.card, .list-group-item').find('.btn2').html('½');
						} else if ($(this).attr('class') === 'btn4') {
							servingSize = 'regular';
							$(this).closest('.card, .list-group-item').find('.btn2').html('✓');
						}

						const selectedItemCategory = $(this).closest('.card-deck, .list-group').attr('id');
						if (selectedItemCategory === 'syrup' && !userOrderDrink.checkIfSyrupSelected()) {
							userOrderDrink.addSyrup(json, servingSize);
							$('#syrup')
								.find('.card, .list-group-item')
								.each(function () {
									const json = JSON.parse($(this).attr('data-drinks'));

									if (!userOrderDrink.checkIfThisSyrupSelected(json)) {
										$(this).css('opacity', '.3');
									}
								});
						} else if (selectedItemCategory === 'coffee') {
							var coffeeBool;
							if (!userOrderDrink.checkIfCoffeeSelected()) {
								coffeeBool = false
							}
							userOrderDrink.addCoffee(json, servingSize);
							// if you selected coffee by getting extra espresso then we still need to blot out the other coffee cards
							$('#coffee')
								.find('.card, .list-group-item')
								.each(function () {
									const json = JSON.parse($(this).attr('data-drinks'));

									if (!userOrderDrink.findDrink(json)) {
										$(this).css('opacity', '.3');
									}
								});
								if (!coffeeBool){
							$('#milk, #temperature, #syrup').each(function () {
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
					const json = JSON.parse($(this).closest('.card, li').attr('data-drinks'));

					userOrderDrink.changeDrinkQuantity(json, 'decrease');
					const selectedDrink = userOrderDrink.findDrink(json);
					if (selectedDrink.quantity <= 0) {
						$(this).closest('.card, .list-group-item').find('.btn2').hide();
						$(this).closest('.card, .list-group-item').find('.btn2').html(selectedDrink.quantity);
						userOrderDrink.removeDrink(json);
						$(this).hide();
						$(this).closest('.card, .list-group-item').find('.btn7').hide();
					} else {
						$(this).closest('.card, .list-group-item').find('.btn2').html(selectedDrink.quantity);
						$(this).closest('.card, .list-group-item').find('.btn2').show();
					}
				});

			$('.btn7')
				.unbind('click')
				.bind('click', function () {
					const json = JSON.parse($(this).closest('.card, li').attr('data-drinks'));

					userOrderDrink.changeDrinkQuantity(json, 'increase');
					$(this)
						.closest('.card, .list-group-item')
						.find('.btn2')
						.html(userOrderDrink.findDrink(json).quantity);
					$(this).closest('.card, .list-group-item').find('.btn2').show();
				});
		})
		.on('mouseleave', function () {
			var json;
			var selectedItemCategory;
			selectedItemCategory = $(this).closest('.card-deck, .list-group').attr('id');
			json = JSON.parse($(this).attr('data-drinks'));

			if (selectedItemCategory != 'syrup' && !userOrderDrink.findDrink(json)) {
				$(this).find('.btn').hide();
				$(this).find('.btn3').hide();
				$(this).find('.btn4').hide();
			} else if (selectedItemCategory === 'syrup' && !userOrderDrink.checkIfThisSyrupSelected(json)) {
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
};
function pageBuild () {
	$('.card-img-top').wrap('<div class="containerDrink"></div>');
	$('#drinkcheckout')
		.unbind('click')
		.bind('click', function () {
			if (userOrderDrink.checkIfCoffeeSelected() && !userOrderDrink.checkIfTempSelected()) {
				$('#errorCoffeeCheckout').show();
				return false;
			} else {
				checkOut(userOrderDrink);
			}
		});
	$('.card-img-top').each(function (i) {
		const selectedItemCategory = $(this).closest('.card-deck').attr('id');
		if (selectedItemCategory === 'syrup') {
			$('<button class="btn"  type="button">Customize</button>').insertAfter($(this));
			$('<button class="btn4"  type="button">1 Pump</button>').insertAfter($(this));
			$('<button class="btn3"  type="button">½ Pump</button>').insertAfter($(this));
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		} else if (selectedItemCategory === 'coffee') {
			$('<button class="btn"  type="button">Customize</button>').insertAfter($(this));
			$('<button class="btn4"  type="button">2 Espresso Shots</button>').insertAfter($(this));
			$('<button class="btn3"  type="button">Decaf</button>').insertAfter($(this));
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		} else if (
			selectedItemCategory === 'bottled' ||
			selectedItemCategory === 'milkshake' ||
			selectedItemCategory === 'non-coffee'
		) {
			$(`<div class="grid-container" id="bottled_drink${i}" style="margin-top: 0px; margin-bottom:0px; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
				$(this)
			);
			$('<button class="btn2" type="button">1</button>').insertAfter($(this));
		} else if (selectedItemCategory === 'temperature' || selectedItemCategory === 'milk') {
			$(`<div class="grid-container" id="bottled_drink${i}" style="margin-top: 0px; margin-bottom:0px; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"></div>`).insertAfter($(this));
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		}
	});

	$('.card-title, .head3').each(function () {
		$(this).html(humanize(null, null, $(this).html()));
	});
	$('.head3').each(function () {
		$(this).html($(this).html().toLowerCase());
	});
	$('.card-text').each(function () {
		const price = parseFloat($(this).html());
		if (!Number.isNaN(price)) {
			$(this).html('$' + price.toFixed(2));
		}
	});

	$('#milk, #temperature, #syrup').each(function () {
		$(this)
			.find('.card')
			.each(function () {
				$(this).css('opacity', '.3');
			});
	});
	const height = $("#drinkFooter").height()
	$('#errorCoffeeCheckout').css("margin-bottom", height)
};
function mobileRendering () {
	const cardDeckElements = document.getElementsByClassName('card-deck');
	const cardTitleElements = document.getElementsByClassName('card-title');
	const cardTextElements = document.getElementsByClassName('card-text');
	const cardImgTopElements = document.getElementsByClassName('card-img-top');
	const cardData = document.getElementsByClassName('card');

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

	const constCardData = new Array();
	for (var i = 0; i < cardData.length; i++) {
		const clone = cardData[i].cloneNode(true);
		constCardData.push(clone);
	}

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

	var counter = 0;

	for (var i = 0; i < cardDeckElementsLength; i++) {
		const row = document.createElement('div');
		row.setAttribute('class', 'row');
		row.setAttribute('style', 'width: 100%');
		const listGroupTitle = document.createElement('div');
		listGroupTitle.setAttribute('class', 'col-12 col-sm-12 col-lg-12 col-md-12');
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

		const stoppingPoint = k + cardDeckChildrenLength[i];
		for (k; k < stoppingPoint; k++) {
			const listValue = document.createElement('li');
			listValue.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
			listValue.setAttribute('style', 'width:100%');
			const jsonData = constCardData[counter].getAttribute('data-drinks');
			const data = JSON.parse(constCardData[counter].getAttribute('data-drinks'));
			if (data.coffee_syrup_flavor) {
				listValue.setAttribute('id', data.coffee_syrup_flavor);
			} else if (data.drink_category_id === 'coffee' || data.drink_category_id === 'non-coffee') {
				const id = String(data.id) + '-' + data.serving_size;
				listValue.setAttribute('id', id);
			} else {
				listValue.setAttribute('id', data.id);
			}
			listValue.setAttribute('data-drinks', jsonData);

			const string1 = String(constCardTitleValues[k]);
			const string2 = String(constCardTextValues[k]);

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

			const cardImgAbsolutePath = constCardImgSrcValues[counter].split('/');
			const cardImgRelativePathFrags = cardImgAbsolutePath.slice(
				cardImgAbsolutePath.length - 3,
				cardImgAbsolutePath.length
			);
			const cardImgRelativePath = '../' + cardImgRelativePathFrags.join('/');

			img.setAttribute('src', cardImgRelativePath);
			img.setAttribute('class', 'img-fluid');
			imageParent.appendChild(img);

			listValue.appendChild(imageParent);
			listGroupTitle.append(listValue);

			counter += 1;
		}

		row.appendChild(listGroupTitle);
		const x = document.getElementsByClassName('list-group');
		x[i].appendChild(row);
	}
	$('.list-group-item').each(function () {
		const selectedItemCategory = $(this).closest('.list-group').attr('id');
		if (selectedItemCategory === 'syrup' || selectedItemCategory === 'coffee') {
			$(`<div class='container3'>
						<div class='grid-container' style='margin-top: 0px; margin-bottom:0px; align-items:center; grid-template-columns: auto auto auto; align-self: center;  grid-gap: 2px; display:grid;'>
							<button class='btn' style='display: none;'>Customize</button>
							<button class='btn2'>✓</button>
						</div>
					</div>`).insertAfter($(this).find('container'));
		} else if (
			selectedItemCategory === 'bottled' ||
			selectedItemCategory === 'milkshake' ||
			selectedItemCategory === 'non-coffee'
		) {
			$(
				`<div class="container4"><div class="grid-container" style="margin-top: 0px; margin-bottom:0px;  align-items:center; grid-template-columns: auto auto auto; align-self: center; grid-gap: 2px; display:grid;"><button class="btn6">-</button><button class="btn2">1</button><button class="btn7">+</button></div></div>`
			).insertAfter($(this).find('container'));
		} else if (selectedItemCategory === 'temperature' || selectedItemCategory === 'milk') {
			$(`<div class='drinkContainer3'>
						<div class='grid-container' style='margin-top: 0px; margin-bottom:0px;  align-items:center; grid-template-columns: 1 fr; align-self: center; grid-gap: 2px; display:grid;'>
							<button class='btn2'>✓</button>
						</div>
					</div>`).insertAfter($(this).find('container'));
		}
	});
	$('.container0sweetCrepe').each(function () {
		$(this).css('border-bottom', '');
		$(this).find('.list-group').css('border-bottom', '');
	});
};
var cWidth = $(window).width();
$(window).on('load', function () {
	pageBuild();
	const newWidth = $(window).width();
	if (cWidth < newWidth) {
		cWidth = newWidth;
	}
	if (cWidth <= 576) {
		mobileRendering();
		pageLogic();
		modifyOrder();
	} else {
		pageLogic();
		modifyOrder();
		$('.container0sweetCrepe').each(function () {
			$(this).addClass('container');
			$(this).removeClass('container0sweetCrepe');
		});
	}
});
