//https://stackoverflow.com/questions/15876302/uncaught-typeerror-cannot-read-property-clientwidth-of-null
//https://stackoverflow.com/questions/4381228/jquery-selector-inside-the-each-method
//https://stackoverflow.com/questions/4735342/jquery-to-loop-through-elements-with-the-same-class
function stringify(dataObject) {
	// there will only ever be one item in local storage because a customer can only have 1 order in their shopping cart.
	// the object is a dictionary with a key called order and the value being an array which will hold each crepe as either a menu crepe object
	// or an orderCrepe array, the order props, a drinks array, and a sides array
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
	return true;
}

// function checkIfMilkSelected(element) {
// 	var myBool = false;
// 	$(`#${element}`)
// 		.find('.btn2')
// 		.each(function () {
// 			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
// 			var toppingCategory = toppingCategoryAndToppingNameArray[0];
// 			var toppingName = toppingCategoryAndToppingNameArray[1];
// 			if ($(this).css(`--${toppingCategory}`) == toppingName) {
// 				return true;
// 			}
// 		})
// 		.promse()
// 		.then(function () {
// 			return false;
// 		});
// }

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
	$('.card').each(function (i) {
		this.id = 'card' + i;
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
			// } else if (
			// 	$(this).closest('.card-deck').attr('id') == 'milkshake' ||
			// 	$(this).closest('.card-deck').attr('id') == 'non-coffee' ||
			// 	$(this).closest('.card-deck').attr('id') == 'coffee' ||
			// 	$(this).closest('.card-deck').attr('id') == 'coffee_syrup' ||
			// 	$(this).closest('.card-deck').attr('id') == 'milk' ||
			// 	$(this).closest('.card-deck').attr('id') == 'non-coffee' ||
			// 	$(this).closest('.card-deck').attr('id') == 'bottled'
			// ) {
			// 	$(this).closest('.card-deck').css('drink', 'true');
		}
	});

	$('.btn2').each(function (i) {
		this.id = 'btn' + i;
		$(this).css('--quantity', 0);
	});

	var coffeeBool;
	$('#coffee')
		.find('.btn2')
		.each(function () {
			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			var toppingCategory = toppingCategoryAndToppingNameArray[0];
			var toppingName = toppingCategoryAndToppingNameArray[1];
			if ($(this).css(`--${toppingCategory}`) == toppingName) {
				coffeeBool = true;
				console.log('coffeeBool true');
			}
		})
		.promise()
		.done(function () {
			if (coffeeBool != true) {
				coffeeBool = false;
				$('#milk, #coffee_syrup').each(function () {
					console.log('coffee_syrup & milk $(this)', $(this));
					$(this)
						.find('.card')
						.each(function () {
							$(this).css('opacity', '.3');
						});
				});
			}
		});

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

			if (
				$(this).find('.card-body').attr('id') != 'cardBody' &&
				$(this).closest('.card-deck').attr('id') != 'milk' &&
				$(this).closest('.card-deck').attr('id') != 'coffee_syrup'
			) {
				$(this).find('.card-body').css('opacity', '.3'); //https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_image_overlay_opacity
				$(this).find('.card-img-top').css('opacity', '.3');
				$(this).find('.btn').show();
			} else if (coffeeBool) {
				// milk card logic
				$(this).find('.card-body').css('opacity', '.3');
				$(this).find('.card-img-top').css('opacity', '.3');
				$(this).find('.btn').show();
			}

			//click the card somewhere
			$(this)
				.find('.card-text, .card-title, .card-body, .card-img-top')
				.unbind('click')
				.bind('click', function () {
					if (
						$(this).closest('.card-deck').attr('id') === 'bottled' ||
						$(this).closest('.card-deck').attr('id') === 'non-coffee' ||
						$(this).closest('.card-deck').attr('id') === 'milkshake'
					) {
						if (parseInt($(this).closest('.card').find('.btn2').css('--quantity')) === 0) {
							$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
							$(this).closest('.card').find('.btn2').css('--quantity', 1);
							$(this).closest('.card').find('.btn2').html(1);
							$(this).closest('.card').find('.btn2').show();
							$(this).closest('.card').find('.btn6').show();
							$(this).closest('.card').find('.btn7').show();
						}
					}
					// TODO: dynamically set css values
					if (
						$(this).closest('.card').find('.btn2').css('--extra') != 'true' &&
						$(this).closest('.card').find('.btn2').css('--half') != 'true' &&
						$(this).closest('.card-deck').attr('id') != 'bottled' &&
						$(this).closest('.card-deck').attr('id') != 'non-coffee' &&
						$(this).closest('.card-deck').attr('id') != 'milkshake' &&
						$(this).closest('.card').find('.btn2').css('--regular') != 'true' &&
						$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`) != toppingName
					) {
						console.log(
							'`--${toppingCategory}`, `${toppingName}`',
							`--${toppingCategory}`,
							`${toppingName}`
						);
						$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
						$(this).closest('.card').find('.btn2').css('--regular', 'true');
						console.log('veggieCraze', $(this).closest('.card').find('.btn2').css('--regular'));
						$(this).closest('.card').find('.btn2').html('✓');
						$(this).closest('.card').find('.btn2').toggle();
					} else if ($(this).closest('.card').find('.btn2').css('--half') == 'true') {
						$(this).closest('.card').find('.btn2').css('--half', 'false');
						$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
						$(this).closest('.card').find('.btn2').toggle();
						//https://stackoverflow.com/questions/21286887/adding-check-marks-to-bootstrap-button-drop-down-items/46890814
						$(this).closest('.card').find('.btn2').html('✓');
					} else if ($(this).closest('.card').find('.btn2').css('--extra') == 'true') {
						console.log('dVeggies toggle');
						$(this).closest('.card').find('.btn2').css('--extra', 'false');
						$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
						$(this).closest('.card').find('.btn2').toggle();
						$(this).closest('.card').find('.btn2').html('✓');
					} else if ($(this).closest('.card').find('.btn2').css('--regular') == 'true') {
						console.log('fag');
						$(this).closest('.card').find('.btn2').css('--regular', 'false');
						$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
						$(this).closest('.card').find('.btn2').toggle();
						$(this).closest('.card').find('.btn2').html('✓');
					}

					// milk card logic
					coffeeBool = false;
					$('#coffee')
						.find('.btn2')
						.each(function () {
							var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
							var toppingCategory = toppingCategoryAndToppingNameArray[0];
							var toppingName = toppingCategoryAndToppingNameArray[1];
							if ($(this).css(`--${toppingCategory}`) == toppingName) {
								// if a coffee is selected then unhide the coffee syrup and milk
								coffeeBool = true;
								console.log('coffeeBool true');
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
						})
						.promise()
						.done(function () {
							if (!coffeeBool) {
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
										});
									console.log('coffeeBool false');
									$('#errorMilk').show();
									$('#errorSyrup').show();
								});
							}
						});
				});
		})
		.on('mouseleave', '.card', function () {
			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			var toppingCategory = toppingCategoryAndToppingNameArray[0];
			var toppingName = toppingCategoryAndToppingNameArray[1];
			console.log('tc', toppingCategory, 'tn', toppingName);
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
			console.log('tc', toppingCategory, 'tn', toppingName);
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
					coffeeBool = true;
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
				$(this).html('Customize');
				$(this).blur();
				$(this).closest('.card').find('.btn2').html('2X');
				$(this).closest('.card').find('.btn2').show();
				$(this).closest('.card').find('.btn3').hide();
				$(this).closest('.card').find('.btn4').hide();
				console.log('`--${toppingCategory}`, `${toppingName}`', `--${toppingCategory}`, `${toppingName}`);
			}
		});

	$('.btn3')
		.unbind('click')
		.bind('click', function () {
			if ($(this).closest('.card-deck').attr('id') != 'protein') {
				var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
				var toppingCategory = toppingCategoryAndToppingNameArray[0];
				var toppingName = toppingCategoryAndToppingNameArray[1];
				console.log('tc', toppingCategory, 'tn', toppingName);
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
				console.log('`--${toppingCategory}`, `${toppingName}`', `--${toppingCategory}`, `${toppingName}`);
			}
		});

	$('.btn4')
		.unbind('click')
		.bind('click', function () {
			if ($(this).closest('.card-deck').attr('id') != 'protein') {
				var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
				var toppingCategory = toppingCategoryAndToppingNameArray[0];
				var toppingName = toppingCategoryAndToppingNameArray[1];
				console.log('tc', toppingCategory, 'tn', toppingName);
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
			console.log('tc', toppingCategory, 'tn', toppingName);
			var currentQuant = parseInt($(this).closest('.card').find('.btn2').css('--quantity'));
			console.log('cuuremtQuant', currentQuant);
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
			console.log('.btn name value', $(this).closest('.card').find('.btn2').css('--drinName'));
		});

	$('.btn7')
		.unbind('click')
		.bind('click', function () {
			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			var toppingCategory = toppingCategoryAndToppingNameArray[0];
			var toppingName = toppingCategoryAndToppingNameArray[1];
			console.log('tc', toppingCategory, 'tn', toppingName);
			var currentQuant = parseInt($(this).closest('.card').find('.btn2').css('--quantity'));
			console.log('currentQuant', currentQuant);
			currentQuant += 1;
			$(this).closest('.card').find('.btn2').html(`${currentQuant}`);
			$(this).closest('.card').find('.btn2').show();
			$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
			$(this).closest('.card').find('.btn2').css('--quantity', currentQuant);

			console.log('.btn quant value', $(this).closest('.card').find('.btn2').css('--quantity'));
		});
});

function toppingPricing(toppingCategoryList, proteinCategoryList) {
	var newToppingCategoryListWithPricesofToppingCategories = [];
	for (var i = 0; i < toppingCategoryList.length; i++) {
		const toppingDict = toppingCategoryList[i];
		const toppingKey = Object.keys(toppingDict)[0];
		console.log('tkey', toppingKey);
		console.log('toppingDict', toppingDict);
		if (toppingKey == 'veggie') {
			const newToppingDict = {};
			const toppingQuantity = toppingDict[toppingKey];
			console.log('tquant', toppingQuantity);
			const amountOverIncludedAmount = toppingQuantity - 4;
			var priceForTopping;
			if (amountOverIncludedAmount > 0) {
				priceForTopping = amountOverIncludedAmount * 0.5;
			} else {
				priceForTopping = 0;
			}
			newToppingDict[`${toppingKey}`] = priceForTopping;
			newToppingCategoryListWithPricesofToppingCategories.push(newToppingDict);
		} else if (toppingKey == 'cheese') {
			const newToppingDict = {};
			const toppingQuantity = toppingDict[toppingKey];
			const amountOverIncludedAmount = toppingQuantity - 1;
			var priceForTopping;
			if (amountOverIncludedAmount > 0) {
				priceForTopping = amountOverIncludedAmount * 0.99;
			} else {
				priceForTopping = 0;
			}
			newToppingDict[`${toppingKey}`] = priceForTopping;
			newToppingCategoryListWithPricesofToppingCategories.push(newToppingDict);
		} else if (toppingKey == 'sauce') {
			const newToppingDict = {};
			const toppingQuantity = toppingDict[toppingKey];
			const amountOverIncludedAmount = toppingQuantity;
			var priceForTopping;
			if (amountOverIncludedAmount > 0) {
				priceForTopping = amountOverIncludedAmount * 0.99;
			} else {
				priceForTopping = 0;
			}
			newToppingDict[`${toppingKey}`] = priceForTopping;
			newToppingCategoryListWithPricesofToppingCategories.push(newToppingDict);
		} else if (toppingKey == 'herb') {
			const newToppingDict = {};
			const toppingQuantity = toppingDict[toppingKey];
			const amountOverIncludedAmount = toppingQuantity;
			var priceForTopping;
			if (amountOverIncludedAmount > 0) {
				priceForTopping = amountOverIncludedAmount * 0.5;
			} else {
				priceForTopping = 0;
			}
			newToppingDict[`${toppingKey}`] = priceForTopping;
			newToppingCategoryListWithPricesofToppingCategories.push(newToppingDict);
		}
	}
	//count up protein price
	console.log('pcatList', proteinCategoryList);
	var priceForProtein = 0;
	var newProteinDict = {};
	for (var i = 0; i < proteinCategoryList.length; i++) {
		const proteinDict = proteinCategoryList[i];
		const proteinKey = Object.keys(proteinDict)[0];
		console.log('tkey', proteinKey);
		console.log('proteinDict', proteinDict);

		if (proteinKey == 'Steak') {
			var priceForProtein = 9.5;
			const toppingQuantity = proteinDict[proteinKey];
			console.log('tquant', toppingQuantity);
			const proteinAmountOverIncludedAmount = toppingQuantity;
			var priceForProtein;
			if (proteinAmountOverIncludedAmount > 0) {
				priceForProtein += 3.5;
			} else {
				priceForProtein += 0;
			}
		} else if (proteinKey == 'Chicken Breast') {
			priceForProtein = 8.5;
			const toppingQuantity = proteinDict[proteinKey];
			const proteinAmountOverIncludedAmount = toppingQuantity;
			var priceForProtein;
			if (proteinAmountOverIncludedAmount > 0) {
				priceForProtein += 2.5;
			} else {
				priceForProtein += 0;
			}
		} else {
			priceForProtein = 7.5;
			const toppingQuantity = proteinDict[proteinKey];
			const proteinAmountOverIncludedAmount = toppingQuantity;
			var priceForProtein;
			if (proteinAmountOverIncludedAmount > 0) {
				priceForProtein += 2.5;
			} else {
				priceForProtein += 0;
			}
		}
	}
	newProteinDict['protein'] = priceForProtein;
	newToppingCategoryListWithPricesofToppingCategories.unshift(newProteinDict);
	console.log(
		'newToppingCategoryListWithPricesofToppingCategories',
		newToppingCategoryListWithPricesofToppingCategories
	);
	return newToppingCategoryListWithPricesofToppingCategories;
}
// checkout function
var orderToppingsDict = {};
var ingredientsDict = {};
var drinkDict = {};
orderToppingsDict['drinks'] = [];
function checkOut() {
	// $('#checkout')
	// 	.unbind('click')
	// 	.bind('click', function () {
	console.log('checkout');

	$('.card-deck').each(function () {
		// create a drink category (ex. coffee) for each key in the drink dict

		ingredientsDict[`${$(this).attr('id')}`] = [];
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
				toppingDictionary[`${toppingName}`] = 'half';
			} else if ($(this).css('--regular') == 'true') {
				toppingDictionary[`${toppingName}`] = 'regular';
			} else if ($(this).css('--extra') == 'true') {
				toppingDictionary[`${toppingName}`] = 'extra';
			} else {
				toppingDictionary[`${toppingName}`] = $(this).css('--quantity');

				console.log('ingredientsDict', ingredientsDict);
			}
			ingredientsDict[`${toppingCategory}`].push(toppingDictionary);
		}
	});

	var orderItems = ingredientsDict;
	console.log('unstringified', orderItems);
	//https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
	var toppingCategoryCount = [];
	var proteinCategoryCount = [];

	for (var key in orderItems) {
		var topping = orderItems[key];
		if (topping != '') {
			console.log('topping', topping);
			var toppingCategoryCountDict = {};
			var toppingCount = 0;
			if (key != 'protein') {
				for (var i = 0; i < topping.length; i++) {
					var toppingName = Object.keys(topping[i])[0];
					var toppingQuantity = topping[i][toppingName];
					console.log('toppingName', toppingName);
					console.log('toppingQuant', toppingQuantity);
					if (toppingQuantity == 'half') {
						toppingCount += 0.5;
					} else if (toppingQuantity == 'regular') {
						toppingCount += 1;
					} else if (toppingQuantity == 'extra') {
						toppingCount += 2;
					}
				}
				toppingCategoryCountDict[`${key}`] = toppingCount;
				console.log('countDict', toppingCategoryCountDict);
				toppingCategoryCount.push(toppingCategoryCountDict);
			}
		}
	}
	console.log('toppingCatCount', toppingCategoryCount);
	var newToppingCategoryListWithPricesofToppingCategories = toppingPricing(
		toppingCategoryCount,
		proteinCategoryCount
	);

	console.log('TcatPrice', newToppingCategoryListWithPricesofToppingCategories);

	console.log('ingredientsDict', ingredientsDict);
	console.log('newCatCount', newToppingCategoryListWithPricesofToppingCategories);
	console.log('ingredientsDict', ingredientsDict);
	var orderTotal = 0;
	for (var toppingCategoryKey in ingredientsDict) {
		// toppingCategoryKey is a key in the orderToppings dictionary
		for (var i = 0; i < newToppingCategoryListWithPricesofToppingCategories.length; i++) {
			// newToppingCategoryListWithPricesofToppingCategories[i] is an individual dictionary
			var dictKey = Object.keys(newToppingCategoryListWithPricesofToppingCategories[i])[0];

			if (toppingCategoryKey == dictKey) {
				const pricingDict = {};
				console.log('toppingCategoryKey', toppingCategoryKey);
				console.log('dictKey', dictKey);
				pricingDict['price'] = newToppingCategoryListWithPricesofToppingCategories[i][dictKey];
				orderTotal += newToppingCategoryListWithPricesofToppingCategories[i][dictKey];
				console.log('pDict', pricingDict);
				ingredientsDict[toppingCategoryKey].push(pricingDict);
				break;
			}
		}
	}
	// orderToppingsDict['price'] = orderTotal;

	orderToppingsDict['drinks'] = ingredientsDict;
	console.log('drinks dict', orderToppingsDict);
	console.log('orderToppingsDictwithIngredient', orderToppingsDict);
	//https://developer.mozilla.org/en-US/docs/Web/API/Window/location
	stringify(orderToppingsDict);
	// $.when(stringify(orderToppingsDict)).then(location.assign('/order?userOrder=true'));

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

		const constCardDeckTitleValues = [...cardDeckTitleValues];
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
