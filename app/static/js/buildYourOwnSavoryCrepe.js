// // https://stackoverflow.com/questions/15876302/uncaught-typeerror-cannot-read-property-clientwidth-of-null
// // https://stackoverflow.com/questions/4381228/jquery-selector-inside-the-each-method
// // https://stackoverflow.com/questions/4735342/jquery-to-loop-through-elements-with-the-same-class
// var editCrepeIndex = undefined;
// var editCrepe = undefined;
// function stringify(dataObject) {
// 	// there will only ever be one item in local storage because a customer can only have 1 order in their shopping cart.
// 	// the object is a dictionary with a key called order and the value being an array which will hold each crepe as either a menu crepe object
// 	// or an orderCrepe array, the order props, a drinks array, and a sides array
// 	console.log('dataObject', dataObject);
// 	if (dataObject['crepes'][0]['crepeTotal'] > 0) {
// 		if (editCrepeIndex == undefined) {
// 			console.log('editCrepeIndexNot: %s', editCrepeIndex);

// 			if (localStorage.length > 0) {
// 				const order = JSON.parse(localStorage.getItem(localStorage.key(0)));
// 				console.log('order: %s', order);

// 				if ('orderCrepe' in order) {
// 					order['orderCrepe'].push(dataObject);
// 					const stringifiedDataObject = JSON.stringify(order);
// 					console.log('stringifiedDataObject', stringifiedDataObject);
// 					localStorage.setItem('order', stringifiedDataObject);
// 				} else {
// 					order['orderCrepe'] = [];
// 					order['orderCrepe'].push(dataObject);
// 					const stringifiedDataObject = JSON.stringify(order);
// 					console.log('order', order);
// 					console.log('stringifiedDataObject', stringifiedDataObject);
// 					localStorage.setItem('order', stringifiedDataObject);
// 				}
// 			} else {
// 				const order = {};
// 				order['orderCrepe'] = [];
// 				order['orderCrepe'].push(dataObject);
// 				const stringifiedDataObject = JSON.stringify(order);
// 				console.log('order', order);
// 				console.log('stringifiedDataObjectOrder', stringifiedDataObject);
// 				localStorage.setItem('order', stringifiedDataObject);
// 			}
// 		} else {
// 			console.log('editCrepe', editCrepe);
// 			var currentOrder = JSON.parse(localStorage.getItem(localStorage.key(0)));
// 			var currentOrderCrepeList = currentOrder['orderCrepe'];
// 			var currentOrderCrepe = currentOrderCrepeList[editCrepeIndex]['crepes'][0];
// 			Object.assign(currentOrderCrepe, dataObject['crepes'][0]);
// 			// if a previously had two proteins and then i remove one then i will have an empty object in my array that i don't want
// 			for (var i = 0; i < currentOrderCrepeList.length; i++) {
// 				if (currentOrderCrepeList[i] === {}) {
// 					currentOrderCrepeList.splice(i);
// 				}
// 			}
// 			localStorage.setItem('order', JSON.stringify(currentOrder));

// 			console.log('editCrepe2', editCrepe);
// 		}
// 	}
// 	for (var i = 0; i < localStorage.length; i++) {
// 		const key = localStorage.key(i);
// 		console.log('key: %s', key);

// 		const value = localStorage[key];
// 		console.log('value: %s', value);
// 	}
// 	return true;
// }
// function getCSSToppingName(element) {
// 	var toppingCategory = $(element).closest('.card-deck').attr('id');
// 	var toppingName = $(element).closest('.card').find('.card-title').text().split(' ');
// 	var formattedtoppingName = '';
// 	if (toppingName.length > 1) {
// 		const firstName = toppingName[0].toLowerCase();
// 		formattedtoppingName += firstName;
// 		for (var i = 1; i < toppingName.length; i++) {
// 			const otherPartsOftoppingName = toppingName[i];
// 			formattedtoppingName += otherPartsOftoppingName;
// 		}
// 		toppingName = formattedtoppingName;
// 	} else {
// 		toppingName = toppingName[0];
// 	}
// 	var resultArray = [];
// 	resultArray.push(toppingCategory);
// 	resultArray.push(toppingName);
// 	return resultArray;
// }

// function checkIfToppingIsAlreadySelected(element) {
// 	if ($(element).closest('.card').find('.btn2').css('--half') == 'true') {
// 		////https://developer.mozilla.org/en-US/docs/Web/CSS/--*
// 		console.log('halfMeat true');
// 		$(element).closest('.card').find('.btn2').css('--half', 'false');
// 		$(element).closest('.card').find('.btn2').toggle();
// 		//https://stackoverflow.com/questions/21286887/adding-check-marks-to-bootstrap-button-drop-down-items/46890814
// 		$(element).closest('.card').find('.btn2').html('✓');
// 		return true;
// 	} else if ($(element).closest('.card').find('.btn2').css('--extra') == 'true') {
// 		console.log('extraMeat true');
// 		$(element).closest('.card').find('.btn2').css('--extra', 'false');
// 		$(element).closest('.card').find('.btn2').toggle();
// 		$(element).closest('.card').find('.btn2').html('✓');
// 		return true;
// 	} else if ($(element).closest('.card').find('.btn2').css('--regular') == 'true') {
// 		console.log('regMeat true');
// 		$(element).closest('.card').find('.btn2').css('--regular', 'false');
// 		$(element).closest('.card').find('.btn2').hide();
// 		return true;
// 	}
// 	return false;
// }

// function removeAllChildNodes(parent) {
// 	while (parent.firstChild) {
// 		parent.removeChild(parent.firstChild);
// 	}
// }

// function validateToppingSelection(selectedElement, btn) {
// 	console.log('selectedElement inside counter', selectedElement);
// 	console.log('btn inside counter ', btn);
// 	var halfMeatCounter = 0;
// 	var regularMeatCounter = 0;
// 	var halfMeatIndex = 0;
// 	var regularMeatIndex = 0;
// 	var extraMeatIndex = 0;
// 	var extraMeatCounter = 0;
// 	var countSum = 0;
// 	const meatSelections = [];

// 	var toppingCategoryAndToppingNameArray = getCSSToppingName(selectedElement);
// 	var toppingCategory = toppingCategoryAndToppingNameArray[0];
// 	var toppingName = toppingCategoryAndToppingNameArray[1];
// 	console.log('tc', toppingCategory, 'tn', toppingName);

// 	$('#protein')
// 		.find('.btn2')
// 		.each(function () {
// 			meatSelections.push($(this));
// 		});

// 	function countToppings() {
// 		countSum = 0;
// 		halfMeatCounter = 0;
// 		regularMeatCounter = 0;
// 		extraMeatCounter = 0;
// 		$('#protein')
// 			.find('.btn2')
// 			.each(function (i) {
// 				if ($(this).css('--half') == 'true') {
// 					countSum += 1;
// 					halfMeatCounter += 1;
// 					halfMeatIndex = i;
// 					console.log('halfcounter', halfMeatCounter);
// 				} else if ($(this).css('--regular') == 'true') {
// 					countSum += 1;
// 					regularMeatCounter += 1;
// 					regularMeatIndex = i;
// 					console.log('regcounter', regularMeatCounter);
// 					console.log('regIndex', regularMeatIndex);
// 				} else if ($(this).css('--extra') == 'true') {
// 					countSum += 1;
// 					extraMeatCounter += 1;
// 					extraMeatIndex = i;
// 					console.log('extracounter', extraMeatCounter);
// 				}
// 			});
// 		const meatIndexArray = [];
// 		meatIndexArray.push(halfMeatIndex, regularMeatIndex, extraMeatIndex);
// 	}

// 	function displayErrorMsg(element) {
// 		console.log('element: %s', element);
// 		console.log(`element.closest('.card').attr('id')`, element.closest('.card').attr('id'));

// 		const selector = `#${element.closest('.card').attr('id') + 'error'}`;

// 		const id = `${element.closest('.card').attr('id') + 'error'}`;

// 		if ($(selector).length) {
// 			$(selector).fadeIn('slow').delay(4000).fadeOut('slow'); //https://stackoverflow.com/questions/15686598/jquery-delay-before-fadeout
// 		} else {
// 			$(
// 				`<div class="alert-danger" role="alert" id="${id}" style="font-size: 20px; font-weight: 600; vertical-align: middle; text-align: center; padding: 5px; display: none; line-height: 40px; color:black; height: 100px; top: 100px; position: absolute;">You may only select 2 proteins.</div>`
// 			).insertAfter($(selectedElement).closest('.card').find('img'));
// 			$(selector).fadeIn('slow').delay(4000).fadeOut('slow');
// 		}

// 		return false;
// 	}

// 	countToppings();
// 	console.log('countSum', countSum);
// 	console.log('halfMeatCounter', halfMeatCounter);
// 	console.log('extraMeatCounter', extraMeatCounter);
// 	console.log('regMeatCounter', regularMeatCounter);

// 	if (btn == false && checkIfToppingIsAlreadySelected(selectedElement) == false) {
// 		if (countSum >= 2) {
// 			displayErrorMsg(selectedElement);
// 		} else if (countSum == 0) {
// 			console.log('topping cat', toppingCategory);
// 			console.log('topping nam', toppingName);
// 			$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 			console.log(
// 				'css(`--${toppingCategory}`)',
// 				$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`)
// 			);
// 			$(selectedElement).closest('.card').find('.btn2').css('--regular', 'true');
// 			$(selectedElement).closest('.card').find('.btn2').html('✓');
// 			$(selectedElement).closest('.card').find('.btn2').toggle();
// 			console.log(
// 				'after clicking regular meat',
// 				$(selectedElement).closest('.card').find('.btn2').css('--regular')
// 			);
// 		} else if (countSum == 1) {
// 			if (regularMeatCounter == 1) {
// 				console.log('pointer', $(`#${meatSelections[regularMeatIndex].attr('id')}`));
// 				$(`#${meatSelections[regularMeatIndex].attr('id')}`).html('½');
// 				$(`#${meatSelections[regularMeatIndex].attr('id')}`).css('--regular', 'false');
// 				$(`#${meatSelections[regularMeatIndex].attr('id')}`).css('--half', 'true');
// 				console.log(
// 					'css(`--${toppingCategory}`)',
// 					$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`)
// 				);
// 				console.log('meatselection', $(`#${meatSelections[regularMeatIndex].attr('id')}`).css('--half'));
// 				$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 				$(selectedElement).closest('.card').find('.btn2').html('½');
// 				$(selectedElement).closest('.card').find('.btn2').css('--half', 'true');
// 				$(selectedElement).closest('.card').find('.btn2').show();
// 			} else if (extraMeatCounter == 1) {
// 				$(`#${meatSelections[extraMeatIndex].attr('id')}`).html('✓');
// 				$(`#${meatSelections[extraMeatIndex].attr('id')}`).css('--extra', 'false');
// 				$(`#${meatSelections[extraMeatIndex].attr('id')}`).css('--regular', 'true');
// 				$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 				$(selectedElement).closest('.card').find('.btn2').html('✓');
// 				$(selectedElement).closest('.card').find('.btn2').css('--regular', 'true');
// 				$(selectedElement).closest('.card').find('.btn2').show();
// 			} else if (halfMeatCounter == 1) {
// 				$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 				$(selectedElement).closest('.card').find('.btn2').html('½');
// 				$(selectedElement).closest('.card').find('.btn2').css('--half', 'true');
// 				$(selectedElement).closest('.card').find('.btn2').show();
// 			}
// 		} else if (countSum >= 2) {
// 			displayErrorMsg(selectedElement);
// 		}
// 	} //end of the if block "if btn == false"

// 	// if the user selected a button
// 	else if (btn != false) {
// 		if (btn == 'btn') {
// 			// if they select the customize button
// 			console.log('btn clicked');
// 			console.log(selectedElement);
// 			if ($(selectedElement).html() == 'Customize') {
// 				// if they select the customize button for the first time
// 				console.log('.btn clicked first time');
// 				//https://stackoverflow.com/questions/857245/is-there-a-jquery-unfocus-method
// 				$(selectedElement).blur();
// 				$(selectedElement).html('Extra +$3.50');
// 				$(selectedElement).closest('.card').find('.btn3').show();
// 				$(selectedElement).closest('.card').find('.btn4').show();
// 			} else {
// 				// if they select the customize button for the second time then they have selected the extra meat button
// 				console.log('.btn clicked second time');
// 				if (countSum == 1) {
// 					if (regularMeatCounter == 1) {
// 						$(`#${meatSelections[regularMeatIndex].attr('id')}`).html('✓');
// 						$(`#${meatSelections[regularMeatIndex].attr('id')}`).toggle();
// 						$(`#${meatSelections[regularMeatIndex].attr('id')}`).css('--regular', 'false');
// 						$(`#${meatSelections[regularMeatIndex].attr('id')}`).css(`--${toppingCategory}`, 'false');

// 						$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 						$(selectedElement).closest('.card').find('.btn2').html('2X');
// 						$(selectedElement).closest('.card').find('.btn2').css('--extra', 'true');
// 						$(selectedElement).closest('.card').find('.btn2').show();
// 					} else if (extraMeatCounter == 1) {
// 						$(`#${meatSelections[extraMeatIndex].attr('id')}`).html('✓');
// 						$(`#${meatSelections[extraMeatIndex].attr('id')}`).css('--extra', 'false');
// 						$(`#${meatSelections[regularMeatIndex].attr('id')}`).css(`--${toppingCategory}`, 'false');
// 						$(`#${meatSelections[extraMeatIndex].attr('id')}`).toggle();

// 						$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 						$(selectedElement).closest('.card').find('.btn2').html('2X');
// 						$(selectedElement).closest('.card').find('.btn2').css('--extra', 'true');
// 						$(selectedElement).closest('.card').find('.btn2').show();
// 					} else if (halfMeatCounter == 1) {
// 						$(`#${meatSelections[halfMeatIndex].attr('id')}`).html('✓');
// 						$(`#${meatSelections[halfMeatIndex].attr('id')}`).toggle();
// 						$(`#${meatSelections[halfMeatIndex].attr('id')}`).css('--half', 'false');
// 						$(`#${meatSelections[regularMeatIndex].attr('id')}`).css(`--${toppingCategory}`, 'false');

// 						$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 						$(selectedElement).closest('.card').find('.btn2').html('2X');
// 						$(selectedElement).closest('.card').find('.btn2').css('--extra', 'true');
// 						$(selectedElement).closest('.card').find('.btn2').show();
// 					}
// 				} else if (countSum == 0) {
// 					console.log('countSum', countSum);
// 					$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 					$(selectedElement).closest('.card').find('.btn2').css('--extra', 'true');
// 					$(selectedElement).html('Customize');
// 					$(selectedElement).blur();
// 					$(selectedElement).closest('.card').find('.btn2').html('2X');
// 					$(selectedElement).closest('.card').find('.btn2').show();
// 				} else if (countSum >= 2) {
// 					const oldCountSum = countSum;
// 					console.log('old', oldCountSum);
// 					checkIfToppingIsAlreadySelected(selectedElement);
// 					countToppings();
// 					console.log('new', countSum);

// 					if (oldCountSum != countSum) {
// 						validateToppingSelection(selectedElement, 'btn');
// 					} else {
// 						displayErrorMsg(selectedElement);
// 					}
// 				}
// 			}
// 		} else if (btn == 'btn3') {
// 			if (countSum == 1) {
// 				if (regularMeatCounter == 1) {
// 					$(`#${meatSelections[regularMeatIndex].attr('id')}`).html('½');
// 					$(`#${meatSelections[regularMeatIndex].attr('id')}`).css('--regular', 'false');
// 					$(`#${meatSelections[regularMeatIndex].attr('id')}`).css('--half', 'true');

// 					$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 					$(selectedElement).closest('.card').find('.btn2').html('½');
// 					$(selectedElement).closest('.card').find('.btn2').css('--half', 'true');
// 					$(selectedElement).closest('.card').find('.btn2').show();
// 				} else if (extraMeatCounter == 1) {
// 					$(`#${meatSelections[extraMeatIndex].attr('id')}`).html('✓');
// 					$(`#${meatSelections[extraMeatIndex].attr('id')}`).css('--extra', 'false');
// 					$(`#${meatSelections[regularMeatIndex].attr('id')}`).css(`--${toppingCategory}`, 'false');
// 					$(`#${meatSelections[extraMeatIndex].attr('id')}`).hide();

// 					$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 					$(selectedElement).closest('.card').find('.btn2').html('½');
// 					$(selectedElement).closest('.card').find('.btn2').css('--half', 'true');
// 					$(selectedElement).closest('.card').find('.btn2').show();
// 				} else if (halfMeatCounter == 1) {
// 					$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 					$(selectedElement).closest('.card').find('.btn2').html('½');
// 					$(selectedElement).closest('.card').find('.btn2').css('--half', 'true');
// 					$(selectedElement).closest('.card').find('.btn2').show();
// 				}
// 			} else if (countSum == 0) {
// 				console.log('countSum', countSum);
// 				$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 				$(selectedElement).closest('.card').find('.btn2').css('--half', 'true');
// 				$(selectedElement).html('Customize');
// 				$(selectedElement).blur();
// 				$(selectedElement).closest('.card').find('.btn2').html('½');
// 				$(selectedElement).closest('.card').find('.btn2').show();
// 			} else if (countSum >= 2) {
// 				const oldCountSum = countSum;
// 				checkIfToppingIsAlreadySelected(selectedElement);
// 				countToppings();
// 				if (oldCountSum != countSum) {
// 					validateToppingSelection(selectedElement, 'btn3');
// 				} else {
// 					displayErrorMsg(selectedElement);
// 				}
// 			}
// 		} else if (btn == 'btn4') {
// 			console.log('btn4 countSum');
// 			if (countSum == 1) {
// 				if (regularMeatCounter == 1) {
// 					$(`#${meatSelections[regularMeatIndex].attr('id')}`).html('½');
// 					$(`#${meatSelections[regularMeatIndex].attr('id')}`).css('--regular', 'false');
// 					$(`#${meatSelections[regularMeatIndex].attr('id')}`).css('--half', 'true');

// 					$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 					$(selectedElement).closest('.card').find('.btn2').html('½');
// 					$(selectedElement).closest('.card').find('.btn2').css('--half', 'true');
// 					$(selectedElement).closest('.card').find('.btn2').show();
// 				} else if (extraMeatCounter == 1) {
// 					$(`#${meatSelections[extraMeatIndex].attr('id')}`).html('✓');
// 					$(`#${meatSelections[extraMeatIndex].attr('id')}`).css('--extra', 'false');
// 					$(`#${meatSelections[extraMeatIndex].attr('id')}`).css('--regular', 'true');

// 					$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 					$(selectedElement).closest('.card').find('.btn2').html('✓');
// 					$(selectedElement).closest('.card').find('.btn2').css('--regular', 'true');
// 					$(selectedElement).closest('.card').find('.btn2').show();
// 				} else if (halfMeatCounter == 1) {
// 					$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 					$(selectedElement).closest('.card').find('.btn2').html('✓');
// 					$(selectedElement).closest('.card').find('.btn2').css('--half', 'true');
// 					$(selectedElement).closest('.card').find('.btn2').show();
// 				}
// 			} else if (countSum == 0) {
// 				console.log('countSum', countSum);
// 				$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 				$(selectedElement).closest('.card').find('.btn2').html('✓');
// 				$(selectedElement).closest('.card').find('.btn2').css('--regular', 'true');
// 				$(selectedElement).blur();
// 				$(selectedElement).closest('.card').find('.btn2').show();
// 			} else if (countSum >= 2) {
// 				const oldCountSum = countSum;
// 				console.log('oldCountSum', oldCountSum);
// 				checkIfToppingIsAlreadySelected(selectedElement);
// 				countToppings();
// 				console.log('NewcountSum', countSum);
// 				if (oldCountSum != countSum) {
// 					validateToppingSelection(selectedElement, 'btn4');
// 				} else {
// 					displayErrorMsg(selectedElement);
// 				}
// 			}
// 		}
// 	}
// } // end of counter function

// //mouse over functionality
// $(window).on('load', function () {
// 	$('.card').each(function () {
// 		var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
// 		var toppingName = toppingCategoryAndToppingNameArray[1];
// 		this.id = toppingName;
// 	});

// 	//https://api.jquery.com/wrap/
// 	$('.card-img-top').wrap('<div class="container2"></div>');
// 	$('.card-img-top').each(function () {
// 		//https://stackoverflow.com/questions/21556874/display-an-alert-in-jquery-for-a-few-seconds-then-fade-it-out
// 		$('<button class="btn" type="button">Customize</button>').insertAfter($(this));
// 		$('<button class="btn4" type="button">Regular</button>').insertAfter($(this));
// 		$('<button class="btn3" type="button">Split</button>').insertAfter($(this));
// 		$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
// 	});

// 	$('.btn2').each(function (i) {
// 		this.id = 'btn' + i;
// 	});

// 	var myButton = document.getElementById('checkOut');
// 	myButton.onclick = function () {
// 		checkOut();
// 	};

// 	var x = document.getElementsByClassName('card-title');
// 	var y = [];

// 	for (var i = 2; i < x.length; i++) {
// 		y.push(x[i].innerHTML);
// 	}

// 	$('.card-img-top').each(function (j) {
// 		this.src = '/static/images/' + y[j] + '.jpg';
// 	});

// 	// edit crepe functionality

// 	if ($('.edit').length) {
// 		editCrepeIndex = $('.edit').first().attr('id');
// 		// const editCrepeArray = editCrepeParam.split('-');
// 		//have to subtract one because the crepe index on the shopping cart is 1 higher than the array index
// 		// editCrepeIndex = parseInt(editCrepeArray[editCrepeArray.length - 1]);
// 		editCrepe = JSON.parse(localStorage.getItem(localStorage.key(0)))['orderCrepe'][editCrepeIndex]['crepes'][0];
// 		console.log('editCrepe: %s', editCrepe);
// 		for (var key in editCrepe) {
// 			console.log('key: %s', key);
// 			console.log('editCrepe[key]', editCrepe[key]);
// 		}
// 		const crepeIngredients = editCrepe['ingredients'];
// 		console.log('crepeIngredients: %s', crepeIngredients);

// 		for (var key in crepeIngredients) {
// 			console.log('key: %s', key);
// 			console.log('crepeIngredients[key]', crepeIngredients[key]);
// 		}
// 		for (var ingredientCategoryKey in crepeIngredients) {
// 			console.log('ingredientCategoryKey: %s', ingredientCategoryKey);

// 			const ingredientArray = crepeIngredients[ingredientCategoryKey];
// 			console.log('ingredientArray: %s', ingredientArray);

// 			for (var i = 0; i < ingredientArray.length; i++) {
// 				const ingredient = ingredientArray[i];
// 				if ('name' in ingredient) {
// 					console.log('ingredient name: %s', ingredient['name']);
// 					const ingredientName = ingredient['name'];
// 					$(`#${ingredientName}`).find('.btn2').css(`--${ingredientCategoryKey}`, `${ingredientName}`);
// 					const ingredientServingSize = ingredient['servingSize'];
// 					if (ingredientServingSize === 'extra') {
// 						$(`#${ingredientName}`).find('.btn2').html('2x');
// 						$(`#${ingredientName}`).find('.btn2').show();
// 						$(`#${ingredientName}`).find('.btn').show();
// 						$(`#${ingredientName}`).find('.btn2').css('--extra', 'true');
// 					} else if (ingredientServingSize === 'regular') {
// 						$(`#${ingredientName}`).find('.btn2').html('✓');
// 						$(`#${ingredientName}`).find('.btn2').show();
// 						$(`#${ingredientName}`).find('.btn').show();

// 						$(`#${ingredientName}`).find('.btn2').css('--regular', 'true');
// 					} else if (ingredientServingSize === 'half') {
// 						$(`#${ingredientName}`).find('.btn2').html('½');
// 						$(`#${ingredientName}`).find('.btn2').show();
// 						$(`#${ingredientName}`).find('.btn').show();

// 						$(`#${ingredientName}`).find('.btn2').css('--half', 'true');
// 					}
// 					console.log('ingredientServingSize: %s', ingredientServingSize);
// 				}
// 			}
// 		}

// 		for (var key in editCrepe) {
// 			console.log(key);
// 			console.log(editCrepe[key]);
// 		}
// 		console.log('editCrepe: %s', editCrepe);

// 		console.log('editCrepeIndex: %s', editCrepeIndex);

// 		console.log('editCrepe: %s', editCrepe);
// 	}

// 	$('.card')
// 		.unbind('mouseenter')
// 		.bind('mouseenter', function () {
// 			if ($(this).closest('.card-deck').attr('id') == 'protein') {
// 				if ($(this).find('.card-body').attr('id') != 'cardBody') {
// 					//don't want to fade out the card with the build your crepe words at the top
// 					$(this).find('.card-body').css('opacity', '.3'); //https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_image_overlay_opacity
// 				}

// 				$(this).find('.card-img-top').css('opacity', '.3');
// 				$(this).find('.btn').show();

// 				//https://www.w3schools.com/jquery/tryit.asp?filename=tryjquery_traversing_find4
// 				//https://stackoverflow.com/questions/5333426/how-to-find-a-parent-with-a-known-class-in-jquery

// 				//if you just click the card

// 				//https://stackoverflow.com/questions/14969960/jquery-click-events-firing-multiple-times

// 				$(this)
// 					.find('.card-text, .card-title, .card-body, .card-img-top')
// 					.unbind('click')
// 					.bind('click', function () {
// 						console.log('clicked', $(this).closest('.card').find('.card-text').text());
// 						validateToppingSelection($(this), false); // validate the user's topping choice after making sure that the card they selected has not already been selected
// 					});

// 				$('#protein')
// 					.find('.btn')
// 					.unbind('click')
// 					.bind('click', function () {
// 						console.log('$(this).attr("class")', $(this).attr('class'));
// 						console.log('$this inside .btn click function', $(this));
// 						validateToppingSelection($(this), $(this).attr('class'));
// 					});

// 				$('#protein')
// 					.find('.btn3')
// 					.unbind('click')
// 					.bind('click', function () {
// 						validateToppingSelection($(this), $(this).attr('class'));
// 					});

// 				$('#protein')
// 					.find('.btn4')
// 					.unbind('click')
// 					.bind('click', function () {
// 						validateToppingSelection((selectedElement = $(this)), $(this).attr('class'));
// 					});

// 				//mouse leave functionality
// 				//https://stackoverflow.com/questions/15722997/jquery-mouseover-image-overlay
// 			}
// 		});

// 	$('.card')
// 		.unbind('mouseleave')
// 		.bind('mouseleave', function () {
// 			if ($(this).closest('.card-deck').attr('id') == 'protein') {
// 				$(this).find('.btn').html('Customize');

// 				if (
// 					$(this).find('.btn2').css('--extra') != 'true' &&
// 					$(this).find('.btn2').css('--half') != 'true' &&
// 					$(this).find('.btn2').css('--regular') != 'true'
// 				) {
// 					$(this).find('.btn').hide();
// 					$(this).find('.btn3').hide();
// 					$(this).find('.btn4').hide();
// 				} else {
// 					$(this).find('.btn').blur();
// 					$(this).find('.btn3').hide();
// 					$(this).find('.btn4').hide();
// 				}

// 				$(this).find('img').css('opacity', '1');
// 				$(this).find('.card-body').css('opacity', '1');
// 			}
// 		});

// 	//veggie + all other topping functionality
// 	$(document)
// 		.on('mouseenter', '.card', function () {
// 			if ($(this).closest('.card-deck').attr('id') != 'protein') {
// 				console.log('hey');
// 				var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
// 				var toppingCategory = toppingCategoryAndToppingNameArray[0];
// 				var toppingName = toppingCategoryAndToppingNameArray[1];
// 				console.log('tc', toppingCategory, 'tn', toppingName);

// 				if ($(this).find('.card-body').attr('id') != 'cardBody') {
// 					$(this).find('.card-body').css('opacity', '.3'); //https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_image_overlay_opacity
// 				}

// 				$(this).find('.card-img-top').css('opacity', '.3');
// 				$(this).find('.btn').show();

// 				//click the card somewhere
// 				$(this)
// 					.find('.card-text, .card-title, .card-body, .card-img-top')
// 					.unbind('click')
// 					.bind('click', function () {
// 						// TODO: dynamically set css values
// 						if (
// 							$(this).closest('.card').find('.btn2').css('--extra') != 'true' &&
// 							$(this).closest('.card').find('.btn2').css('--half') != 'true' &&
// 							$(this).closest('.card').find('.btn2').css('--regular') != 'true' &&
// 							$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`) != toppingName
// 						) {
// 							console.log(
// 								'`--${toppingCategory}`, `${toppingName}`',
// 								`--${toppingCategory}`,
// 								`${toppingName}`
// 							);
// 							$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 							$(this).closest('.card').find('.btn2').css('--regular', 'true');
// 							console.log('veggieCraze', $(this).closest('.card').find('.btn2').css('--regular'));
// 							$(this).closest('.card').find('.btn2').html('✓');
// 							$(this).closest('.card').find('.btn2').toggle();
// 						} else if ($(this).closest('.card').find('.btn2').css('--half') == 'true') {
// 							$(this).closest('.card').find('.btn2').css('--half', 'false');
// 							$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
// 							$(this).closest('.card').find('.btn2').toggle();
// 							//https://stackoverflow.com/questions/21286887/adding-check-marks-to-bootstrap-button-drop-down-items/46890814
// 							$(this).closest('.card').find('.btn2').html('✓');
// 						} else if ($(this).closest('.card').find('.btn2').css('--extra') == 'true') {
// 							console.log('dVeggies toggle');
// 							$(this).closest('.card').find('.btn2').css('--extra', 'false');
// 							$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
// 							$(this).closest('.card').find('.btn2').toggle();
// 							$(this).closest('.card').find('.btn2').html('✓');
// 						} else if ($(this).closest('.card').find('.btn2').css('--regular') == 'true') {
// 							console.log('fag');
// 							$(this).closest('.card').find('.btn2').css('--regular', 'false');
// 							$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
// 							$(this).closest('.card').find('.btn2').toggle();
// 							$(this).closest('.card').find('.btn2').html('✓');
// 						}
// 					});
// 			}
// 		})
// 		.on('mouseleave', '.card', function () {
// 			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
// 			var toppingCategory = toppingCategoryAndToppingNameArray[0];
// 			var toppingName = toppingCategoryAndToppingNameArray[1];
// 			console.log('tc', toppingCategory, 'tn', toppingName);
// 			// TODO: Replace this with the assignment from the gettoppingCategory function
// 			if ($(this).closest('.card-deck').attr('id') != 'protein') {
// 				if (
// 					$(this).find('.btn2').css('--extra') != 'true' &&
// 					$(this).find('.btn2').css('--half') != 'true' &&
// 					$(this).find('.btn2').css('--regular') != 'true' &&
// 					$(this).find('.btn2').css(`--${toppingCategory}`) != toppingName
// 				) {
// 					$(this).find('.btn').hide();
// 					$(this).find('.btn3').hide();
// 					$(this).find('.btn4').hide();
// 				} else {
// 					$(this).find('.btn3').hide();
// 					$(this).find('.btn4').hide();
// 				}

// 				$(this).find('.btn').html('Customize');
// 				$(this).find('img').css('opacity', '1');
// 				$(this).find('.card-body').css('opacity', '1');
// 			}
// 		});

// 	// click the card buttons

// 	$('.btn')
// 		.unbind('click')
// 		.bind('click', function () {
// 			if ($(this).closest('.card-deck').attr('id') != 'protein') {
// 				var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
// 				var toppingCategory = toppingCategoryAndToppingNameArray[0];
// 				var toppingName = toppingCategoryAndToppingNameArray[1];
// 				console.log('tc', toppingCategory, 'tn', toppingName);
// 				if ($(this).html() == 'Customize') {
// 					//https://stackoverflow.com/questions/857245/is-there-a-jquery-unfocus-method
// 					$(this).blur();
// 					$(this).html('Extra');
// 					$(this).closest('.card').find('.btn3').show();
// 					$(this).closest('.card').find('.btn4').show();
// 				} else {
// 					$(this).closest('.card').find('.btn2').css('--half', 'false');
// 					$(this).closest('.card').find('.btn2').css('--regular', 'false');
// 					$(this).closest('.card').find('.btn2').css('--extra', 'true');
// 					$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 					$(this).html('Customize');
// 					$(this).blur();
// 					$(this).closest('.card').find('.btn2').html('2X');
// 					$(this).closest('.card').find('.btn2').show();
// 					$(this).closest('.card').find('.btn3').hide();
// 					$(this).closest('.card').find('.btn4').hide();
// 					console.log('`--${toppingCategory}`, `${toppingName}`', `--${toppingCategory}`, `${toppingName}`);
// 				}
// 			}
// 		});

// 	$('.btn3')
// 		.unbind('click')
// 		.bind('click', function () {
// 			if ($(this).closest('.card-deck').attr('id') != 'protein') {
// 				var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
// 				var toppingCategory = toppingCategoryAndToppingNameArray[0];
// 				var toppingName = toppingCategoryAndToppingNameArray[1];
// 				console.log('tc', toppingCategory, 'tn', toppingName);
// 				$(this).closest('.card').find('.btn2').css('--half', 'true');
// 				$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 				$(this).closest('.card').find('.btn2').css('--regular', 'false');
// 				$(this).closest('.card').find('.btn2').css('--extra', 'false');
// 				$(this).closest('.card').find('.btn2').html('½');
// 				$(this).closest('.card').find('.btn2').show();
// 				$(this).hide();
// 				$(this).closest('.card').find('.btn3').hide();
// 				$(this).closest('.card').find('.btn4').hide();
// 				$(this).closest('.card').find('.btn').html('Customize');
// 				console.log('`--${toppingCategory}`, `${toppingName}`', `--${toppingCategory}`, `${toppingName}`);
// 			}
// 		});

// 	$('.btn4')
// 		.unbind('click')
// 		.bind('click', function () {
// 			if ($(this).closest('.card-deck').attr('id') != 'protein') {
// 				var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
// 				var toppingCategory = toppingCategoryAndToppingNameArray[0];
// 				var toppingName = toppingCategoryAndToppingNameArray[1];
// 				console.log('tc', toppingCategory, 'tn', toppingName);
// 				$(this).closest('.card').find('.btn2').css('--regular', 'true');
// 				$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
// 				$(this).closest('.card').find('.btn2').css('--half', 'false');
// 				$(this).closest('.card').find('.btn2').css('--extra', 'false');
// 				$(this).closest('.card').find('.btn2').html('✓');
// 				$(this).closest('.card').find('.btn2').show();
// 				$(this).hide();
// 				$(this).closest('.card').find('.btn3').hide();
// 				$(this).closest('.card').find('.btn').html('Customize');
// 				console.log('`--${toppingCategory}`, `${toppingName}`', `--${toppingCategory}`, `${toppingName}`);
// 			}
// 		});
// });

// function toppingPricing(toppingCategoryList, proteinCategoryList) {
// 	var newToppingCategoryListWithPricesofToppingCategories = [];
// 	for (var i = 0; i < toppingCategoryList.length; i++) {
// 		const toppingDict = toppingCategoryList[i];
// 		const toppingName = toppingDict['name'].toLowerCase();
// 		console.log('tkey', toppingName);
// 		console.log('toppingDict', toppingDict);
// 		const newToppingDict = {};
// 		const toppingCount = toppingDict['count'];
// 		console.log('toppingCount: %s', toppingCount);

// 		var priceForTopping;

// 		if (toppingName == 'veggie') {
// 			console.log('tquant', toppingCount);
// 			const amountOverIncludedAmount = toppingCount - 4;
// 			if (amountOverIncludedAmount > 0) {
// 				priceForTopping = amountOverIncludedAmount * 0.5;
// 			} else {
// 				priceForTopping = 0;
// 			}
// 			newToppingDict['price'] = priceForTopping;
// 			newToppingDict['name'] = toppingName;
// 		} else if (toppingName == 'cheese') {
// 			const amountOverIncludedAmount = toppingCount - 1;
// 			var priceForTopping;
// 			if (amountOverIncludedAmount > 0) {
// 				priceForTopping = amountOverIncludedAmount * 0.99;
// 			} else {
// 				priceForTopping = 0;
// 			}
// 			newToppingDict['price'] = priceForTopping;
// 			newToppingDict['name'] = toppingName;
// 		} else if (toppingName == 'sauce') {
// 			const amountOverIncludedAmount = toppingCount;
// 			if (amountOverIncludedAmount > 0) {
// 				priceForTopping = amountOverIncludedAmount * 0.99;
// 			} else {
// 				priceForTopping = 0;
// 			}
// 			newToppingDict['price'] = priceForTopping;
// 			newToppingDict['name'] = toppingName;
// 		} else if (toppingName == 'herb') {
// 			const amountOverIncludedAmount = toppingCount;
// 			if (amountOverIncludedAmount > 0) {
// 				priceForTopping = amountOverIncludedAmount * 0.5;
// 			} else {
// 				priceForTopping = 0;
// 			}
// 			newToppingDict['price'] = priceForTopping;
// 			newToppingDict['name'] = toppingName;
// 		}
// 		console.log('newToppingDict: %s', newToppingDict);

// 		newToppingCategoryListWithPricesofToppingCategories.push(newToppingDict);
// 	}
// 	//count up protein price
// 	console.log('pcatList', proteinCategoryList);
// 	var priceForProtein = 0;
// 	var newProteinDict = {};
// 	for (var i = 0; i < proteinCategoryList.length; i++) {
// 		const proteinDict = proteinCategoryList[i];
// 		console.log('proteinDict: %s', proteinDict);

// 		const proteinName = proteinDict['name'];
// 		console.log('tkey', proteinName);
// 		console.log('proteinDict', proteinDict);

// 		if (proteinName == 'Steak') {
// 			var priceForProtein = 9.5;
// 			const toppingCount = proteinDict[proteinName];
// 			console.log('tquant', toppingCount);
// 			const proteinAmountOverIncludedAmount = toppingCount;
// 			var priceForProtein;
// 			if (proteinAmountOverIncludedAmount > 0) {
// 				priceForProtein += 3.5;
// 			} else {
// 				priceForProtein += 0;
// 			}
// 		} else if (proteinName == 'Chicken Breast') {
// 			priceForProtein = 8.5;
// 			const toppingCount = proteinDict[proteinName];
// 			const proteinAmountOverIncludedAmount = toppingCount;
// 			var priceForProtein;
// 			if (proteinAmountOverIncludedAmount > 0) {
// 				priceForProtein += 2.5;
// 			} else {
// 				priceForProtein += 0;
// 			}
// 		} else {
// 			priceForProtein = 7.5;
// 			const toppingCount = proteinDict[proteinName];
// 			const proteinAmountOverIncludedAmount = toppingCount;
// 			var priceForProtein;
// 			if (proteinAmountOverIncludedAmount > 0) {
// 				priceForProtein += 2.5;
// 			} else {
// 				priceForProtein += 0;
// 			}
// 		}
// 	}
// 	newProteinDict['price'] = priceForProtein;
// 	newProteinDict['name'] = 'protein';
// 	newToppingCategoryListWithPricesofToppingCategories.unshift(newProteinDict);
// 	console.log(
// 		'newToppingCategoryListWithPricesofToppingCategories',
// 		newToppingCategoryListWithPricesofToppingCategories
// 	);
// 	return newToppingCategoryListWithPricesofToppingCategories;
// }
// // checkout function
// var orderToppingsDict = {};
// var ingredientsDict = {};
// orderToppingsDict['ingredients'] = [];
// function checkOut() {
// 	console.log('checkout');
// 	var proteinToppings = 0;
// 	$('#protein')
// 		.find('.btn2')
// 		.each(function () {
// 			if ($(this).css('--regular') == 'true') {
// 				proteinToppings += 1;
// 			} else if ($(this).css('--extra') == 'true') {
// 				proteinToppings += 1;
// 			} else if ($(this).css('--half') == 'true') {
// 				proteinToppings += 1;
// 			}
// 		});

// 	if (proteinToppings < 1) {
// 		$('#error2').fadeIn('slow').delay(5000).fadeOut('slow');
// 		return false;
// 	} else {
// 		console.log('checkout');

// 		$('.card-deck').each(function () {
// 			console.log('id', `${$(this).attr('id')}`);
// 			ingredientsDict[`${$(this).attr('id')}`] = [];
// 		});

// 		$('.btn2').each(function () {
// 			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
// 			var toppingCategory = toppingCategoryAndToppingNameArray[0];
// 			var toppingName = toppingCategoryAndToppingNameArray[1];
// 			console.log(
// 				'tc literal in checkout',
// 				toppingCategory,
// 				'tc in checkout',
// 				$(this).css(`--${toppingCategory}`),
// 				'tname in checkout',
// 				toppingName,
// 				'tc reg then half then extra',
// 				$(this).css('--regular'),
// 				$(this).css('--half'),
// 				$(this).css('--extra')
// 			);
// 			if ($(this).css(`--${toppingCategory}`) == toppingName) {
// 				var toppingDictionary = {};
// 				if ($(this).css('--half') == 'true') {
// 					toppingDictionary['name'] = `${toppingName}`;
// 					toppingDictionary['servingSize'] = 'half';
// 				} else if ($(this).css('--regular') == 'true') {
// 					toppingDictionary['name'] = `${toppingName}`;
// 					toppingDictionary['servingSize'] = 'regular';
// 				} else if ($(this).css('--extra') == 'true') {
// 					toppingDictionary['servingSize'] = 'extra';
// 					toppingDictionary['name'] = `${toppingName}`;
// 				}
// 				ingredientsDict[`${toppingCategory}`].push(toppingDictionary);
// 				console.log('ingredientsDict', ingredientsDict);
// 			}
// 		});

// 		var orderItems = ingredientsDict;
// 		console.log('unstringified', orderItems);
// 		//https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
// 		var toppingCategoryCount = [];
// 		var proteinCategoryCount = [];

// 		for (var key in orderItems) {
// 			const toppingArray = orderItems[key];
// 			if (toppingArray != '') {
// 				console.log('toppingArray', toppingArray);
// 				const toppingCategoryCountDict = {};
// 				var toppingCount = 0;
// 				if (key != 'protein') {
// 					for (var i = 0; i < toppingArray.length; i++) {
// 						const topping = toppingArray[i];
// 						const toppingName = topping['name'];
// 						const toppingServingSize = topping['servingSize'];
// 						console.log('toppingName', toppingName);
// 						console.log('toppingQuant', toppingServingSize);
// 						if (toppingServingSize == 'half') {
// 							toppingCount += 0.5;
// 						} else if (toppingServingSize == 'regular') {
// 							toppingCount += 1;
// 						} else if (toppingServingSize == 'extra') {
// 							toppingCount += 2;
// 						}
// 					}
// 					toppingCategoryCountDict['count'] = toppingCount;
// 					toppingCategoryCountDict['name'] = key;
// 					console.log('countDict', toppingCategoryCountDict);
// 					toppingCategoryCount.push(toppingCategoryCountDict);
// 				} else {
// 					var protein = orderItems[key];
// 					const proteinCategoryCountDict = {};

// 					console.log('protein', protein);
// 					//if (protein.length > 1) {

// 					for (var i = 0; i < protein.length; i++) {
// 						var proteinCount = 0;
// 						var protein = protein[i];
// 						for (var key in protein) {
// 							console.log('key: %s', key);
// 							console.log('t key: %s', protein[key]);
// 						}
// 						console.log('protein: %s', protein);
// 						const proteinName = protein['name'];
// 						const proteinServingSize = protein['servingSize'];
// 						console.log('pname', proteinName, 'pquant', proteinServingSize);
// 						if (proteinServingSize == 'half') {
// 							proteinCount += 0.5;
// 						} else if (proteinServingSize == 'regular') {
// 							proteinCount += 1;
// 						} else if (proteinServingSize == 'extra') {
// 							proteinCount += 2;
// 						}
// 						proteinCategoryCountDict['count'] = proteinCount;
// 						proteinCategoryCountDict['name'] = proteinName;
// 						proteinCategoryCount.push(proteinCategoryCountDict);
// 					}
// 				}
// 			}
// 		}
// 		const newToppingCategoryListWithPricesofToppingCategories = toppingPricing(
// 			toppingCategoryCount,
// 			proteinCategoryCount
// 		);

// 		console.log('TcatPrice', newToppingCategoryListWithPricesofToppingCategories);

// 		console.log('ingredientsDict', ingredientsDict);
// 		console.log('newCatCount', newToppingCategoryListWithPricesofToppingCategories);
// 		console.log('ingredientsDict', ingredientsDict);
// 		var orderTotal = 0;
// 		for (var toppingCategoryKey in ingredientsDict) {
// 			// toppingCategoryKey is a key in the orderToppings dictionary
// 			for (var i = 0; i < newToppingCategoryListWithPricesofToppingCategories.length; i++) {
// 				// newToppingCategoryListWithPricesofToppingCategories[i] is an individual dictionary
// 				const dictKey = newToppingCategoryListWithPricesofToppingCategories[i]['name'];

// 				if (toppingCategoryKey == dictKey) {
// 					const pricingDict = {};
// 					console.log('toppingCategoryKey', toppingCategoryKey);
// 					console.log('dictKey', dictKey);
// 					pricingDict['price'] = newToppingCategoryListWithPricesofToppingCategories[i]['price'];
// 					orderTotal += pricingDict['price'];
// 					console.log('pDict', pricingDict);
// 					ingredientsDict[toppingCategoryKey].push(pricingDict);
// 					break;
// 				}
// 			}
// 		}
// 		orderToppingsDict['crepeTotal'] = orderTotal;
// 		orderToppingsDict['flavorProfile'] = 'savory';
// 		orderToppingsDict['customCrepe'] = true;
// 		orderToppingsDict['ingredients'] = ingredientsDict;

// 		const crepeDict = {};
// 		crepeDict['crepes'] = [];
// 		crepeDict['crepes'].push(orderToppingsDict);
// 		console.log('orderToppingsDictwithIngredient', orderToppingsDict);

// 		//https://developer.mozilla.org/en-US/docs/Web/API/Window/location
// 		console.log('odict', orderToppingsDict);
// 		// stringify(crepeDict);
// 		if (editCrepeIndex != undefined) {
// 			$.when(stringify(crepeDict)).then(location.assign('/order?userOrder=true'));
// 		} else {
// 			$.when(stringify(crepeDict)).then(location.assign('/order/drink'));
// 		}
// 	}
// 	// });
// }
// // all this code changes display for smaller screen sizes
// // https://stackoverflow.com/questions/15876302/uncaught-typeerror-cannot-read-property-clientwidth-of-null
// var cWidth = $(window).width();
// //https://stackoverflow.com/questions/1974788/combine-onload-and-onresize-jquery
// $(window).on('load resize', function () {
// 	var newWidth = $(window).width();

// 	if (cWidth < newWidth) {
// 		cWidth = newWidth;
// 	}

// 	if ($(window).width() < 767) {
// 		const a = document.getElementsByClassName('container');
// 		const b = document.getElementsByClassName('card-deck');
// 		const c = document.getElementsByClassName('card-title');
// 		const d = document.getElementsByClassName('card-text');
// 		const e = document.getElementsByClassName('card-img-top');
// 		const f = document.getElementsByClassName('card');
// 		const g = document.getElementsByClassName('h3');

// 		$('#crepeImg').css('margin-left', '0px');
// 		$('#cardText').css('margin-left', '0px');
// 		$('#cardText').css('margin-right', '0px');
// 		$('#cardText').css('margin-bottom', '20px');
// 		$('#cardBody').css('margin-left', '0px');

// 		var cardTitleValues = [];
// 		for (var i = 2; i < c.length; i++) {
// 			cardTitleValues.push(c[i].innerHTML);
// 		}

// 		const constCardTitleValues = [...cardTitleValues];
// 		var cardTextValues = [];
// 		for (var i = 1; i < d.length; i++) {
// 			cardTextValues.push(d[i].innerHTML);
// 		}

// 		const constCardTextValues = [...cardTextValues];
// 		var cardImgSrcValues = [];
// 		for (var i = 0; i < e.length; i++) {
// 			cardImgSrcValues.push(e[i].src);
// 		}

// 		const constCardImgSrcValues = [...cardImgSrcValues];
// 		const constBLength = b.length;
// 		var cardDeckTitleValues = [];
// 		for (var i = 0; i < g.length; i++) {
// 			cardDeckTitleValues.push(g[i].innerHTML);
// 		}

// 		var cardDeckChildrenLength = [];
// 		var constCardDeckNodes = [];
// 		for (i = 0; i < constBLength; i++) {
// 			clone = b[i].cloneNode(true);
// 			constCardDeckNodes.push(clone);
// 			var cardDeckCards = b[i].children;
// 			var counter = 0;
// 			for (j = 0; j < cardDeckCards.length; j++) {
// 				if (cardDeckCards[j].className == 'card') {
// 					counter += 1;
// 				}
// 			}
// 			cardDeckChildrenLength.push(counter);
// 		}

// 		for (i = 0; i < constBLength; i++) {
// 			removeAllChildNodes(b[i]);
// 		}

// 		for (i = 0; i < constBLength; i++) {
// 			var row = document.createElement('div');
// 			row.setAttribute('class', 'row');
// 			row.setAttribute('style', 'width: 100%');
// 			var listGroupTitle = document.createElement('div');
// 			//https://www.htmldog.com/guides/javascript/advanced/creatingelements/
// 			listGroupTitle.setAttribute('class', 'col-12 col-sm-12 col-lg-12 col-md-12');

// 			//https://stackoverflow.com/questions/3304014/how-to-interpolate-variables-in-strings-in-javascript-without-concatenation
// 			$(`#${constCardDeckNodes[i].id}`).removeClass('card-deck');
// 			$(`#${constCardDeckNodes[i].id}`).addClass('list-group');

// 			//need to move the iterator for each card deck to not get the prior deck's card titles
// 			var k;
// 			if (i == 0) {
// 				k = 0;
// 			} else {
// 				var priorChildLength = 0;
// 				for (m = 0; m < i; m++) {
// 					priorChildLength += cardDeckChildrenLength[m];
// 				}

// 				k = priorChildLength;
// 			}

// 			var stoppingPoint = k + cardDeckChildrenLength[i];
// 			for (k; k < stoppingPoint; k++) {
// 				var listValue = document.createElement('li');
// 				listValue.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
// 				listValue.setAttribute('style', 'width:100%');

// 				if (constCardTextValues[k]) {
// 					string1 = String(constCardTitleValues[k]);
// 					string2 = String(constCardTextValues[k]);
// 					var listValueText = string1 + '<br>' + string2;
// 					listValue.innerHTML = listValueText;
// 				} else {
// 					var listValueText = String(constCardTitleValues[k]);
// 					listValue.innerHTML = listValueText;
// 				}

// 				var imageParent = document.createElement('div');
// 				imageParent.setAttribute('class', 'image-parent');
// 				var img = document.createElement('img');
// 				img.setAttribute('src', constCardImgSrcValues[k]);
// 				img.setAttribute('class', 'img-fluid');
// 				imageParent.appendChild(img);

// 				listValue.appendChild(imageParent);
// 				listGroupTitle.append(listValue);
// 			}

// 			row.appendChild(listGroupTitle);
// 			x = document.getElementsByClassName('list-group');
// 			x[i].appendChild(row);
// 		}
// 	} else {
// 		$('#crepeImg').css('margin-left', '80px');
// 		$('#cardText').css('margin-left', '180px');
// 		$('#cardText').css('margin-right', '50px');
// 		$('#cardBody').css('margin-left', '170px');
// 	}
// });
// // TODO: add sauteed onions & peppers, pesto, dill

// // this code reformats the page if the user goes from small screen size to large
// //var doc = document;
// //var cWidth = doc.body.clientWidth;
// var cWidth = $(window).width();
// $(window).on('resize', function () {
// 	const newWidth = $(window).width();
// 	if (cWidth < newWidth) {
// 		cWidth = newWidth;
// 	}
// 	if ($(window).width() > 767) {
// 		location.reload();
// 	}
// });
// .5 upcharge for almond milk
//keep only vanilla, chocolate, strawb, and blueb & cookie milshakes 4 std milkshakes
// add drip coffee
//make coffee word in select milk title dynamic
//no customization of milk for latte but you can customize for drip coffee
//only select one coffee
// add apple streudel croissant for 4.25


('use strict');
import { Order, OrderCrepe } from './model.js';

var editCrepeIndex = null;
var editCrepe = null;
// var sweetnessIngredients;
// var fruitIngredients;
// var sweetIngredientCategories;
var ingredientCategories;
var ingredientServingSizes;
var ingredientCategoryDataArray = new Array();
var userOrderCrepe;

const stringify = (crepeOrder) => {
	console.log('crepeOrder: %s', JSON.stringify(crepeOrder));

	if (crepeOrder.ingredients.length) {
		if (editCrepeIndex === null) {
			const order = new Order();
			if (localStorage.length > 0) {
				// there will only ever be one item in local storage because a customer can only have 1 order in their shopping cart.
				order.fromJSON(localStorage.getItem(localStorage.key(0)));
				console.log('order: %s', JSON.stringify(order));
				console.log('crepeOrder: %s', JSON.stringify(crepeOrder));

				// only one crepe order will be processed on this page at a time
				const crepeOrderTotal = crepeOrder.orderTotal;
				console.log('crepeOrderTotal: %s', crepeOrderTotal);

				order.orderTotal += crepeOrderTotal;
				order.orderCrepe.push(crepeOrder);

				const stringifiedCrepeOrder = JSON.stringify(order);
				localStorage.setItem('order', stringifiedCrepeOrder);
			} else {
				console.log('order: %s', JSON.stringify(order));

				order.orderTotal += crepeOrder.orderTotal;

				order.orderCrepe.push(crepeOrder);
				const stringifiedCrepeOrder = JSON.stringify(order);
				localStorage.setItem('order', stringifiedCrepeOrder);
			}
		} else {
			console.log('nope');
			var currentOrder = JSON.parse(localStorage.getItem(localStorage.key(0)));
			var currentOrderCrepeList = currentOrder.orderCrepe;
			var currentOrderCrepe = currentOrderCrepeList[editCrepeIndex];
			const crepeOrderTotal = crepeOrder.orderCrepe.orderTotal;
			currentOrder.orderTotal += crepeOrderTotal;
			Object.assign(currentOrderCrepe, crepeOrder.orderCrepe);

			// if a previously had two proteins and then i remove one then i will have an empty object in my array that i don't want
			for (var i = 0; i < currentOrderCrepeList.length; i++) {
				if (currentOrderCrepeList[i] === {}) {
					currentOrderCrepeList.splice(i);
				}
			}
			localStorage.setItem('order', JSON.stringify(currentOrder));
		}
	}
	return true;
};

const checkOut = (order) => {
	console.log('order: %s', JSON.stringify(order));

	if (editCrepeIndex != null) {
		stringify(order);
		// $.when(stringify(order)).then(location.assign('/order?userOrder=true'));
	} else {
		stringify(order);
		// $.when(stringify(order)).then(location.assign('/order/side'));
	}
};

function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}
//format the document
$(window).on('load', function () {
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

	ingredientServingSizes = $('#ingredientServingSizes').data('ingredientservingsizes');
	console.log('ingredientServingSizes: %s', ingredientServingSizes);

	// had to reformat this data to match what the orderCrepe model is expecting. index the ingredient category with its associated ingredients in a list
	const unformattedIngredientCategoryDataArray = $('#ingredientPricesByCategory').data('ingredientpricesbycategory');
	for (var i = 0; i < unformattedIngredientCategoryDataArray.length; i++) {
		const ingredients = [...unformattedIngredientCategoryDataArray[i].ingredients];
		ingredientCategoryDataArray.push(ingredients);
	}
	// ingredientCategoryDataArray.push(fruitIngredients);
	// ingredientCategoryDataArray.push(sweetnessIngredients);
	console.log('ingredientCategoryDataArray: %s', JSON.stringify(ingredientCategoryDataArray));

	$('.card-img-top').wrap('<div class="container2"></div>');
	$('#savoryCrepeCheckOut')
		.unbind('click')
		.bind('click', function () {
			checkOut(userOrderCrepe);
			console.log('checkout func');
		});

	$('.card-img-top').each(function () {
		$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		$(`<div class="grid-container"  style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
			$(this)
		);
	});

	if ($('.edit').length) {
		editCrepeIndex = $('.edit').first().attr('id');
		// const editCrepeArray = editCrepeParam.split('-');
		//have to subtract one because the crepe index on the shopping cart is 1 higher than the array index
		// editCrepeIndex = parseInt(editCrepeArray[editCrepeArray.length - 1]);
		editCrepe = JSON.parse(localStorage.getItem(localStorage.key(0)))['orderCrepe'][editCrepeIndex]['crepes'][0];
		console.log('editCrepe: %s', editCrepe);
		for (var key in editCrepe) {
			console.log('key: %s', key);
			console.log('editCrepe[key]', editCrepe[key]);
		}
		const crepeIngredients = editCrepe['ingredients'];
		console.log('crepeIngredients: %s', crepeIngredients);

		for (var key in crepeIngredients) {
			console.log('key: %s', key);
			console.log('crepeIngredients[key]', crepeIngredients[key]);
		}
		for (var ingredientCategoryKey in crepeIngredients) {
			console.log('ingredientCategoryKey: %s', ingredientCategoryKey);

			const ingredientArray = crepeIngredients[ingredientCategoryKey];
			console.log('ingredientArray: %s', ingredientArray);

			for (var i = 0; i < ingredientArray.length; i++) {
				const ingredient = ingredientArray[i];
				if ('name' in ingredient) {
					console.log('ingredient name: %s', ingredient['name']);
					const ingredientName = ingredient['name'];
					const ingredientQuantity = ingredient['quantity'];
					const ingredientServingSize = ingredient['servingSize'];
					$(`#${ingredientName}`).find('.btn2').css(`--${ingredientCategoryKey}`, `${ingredientName}`);
					$(`#${ingredientName}`).find('.btn2').css(`--quantity`, `${ingredientQuantity}`);
					$(`#${ingredientName}`).find('.btn2').html(ingredientQuantity);
					$(`#${ingredientName}`).find('.btn2').show();
					$(`#${ingredientName}`).find('.btn6').show();
					$(`#${ingredientName}`).find('.btn7').show();
					console.log('ingredientServingSize: %s', ingredientServingSize);
				}
			}
		}
	}

	$('.card-img-top').each(function () {
		this.src = '../static/images/vanilla_ice_cream.jpg';
		console.log('this.src: %s', this.src);
	});
	userOrderCrepe = new OrderCrepe();

	//veggie + all other topping functionality
	$(document)
		.on('mouseenter', '.card', function () {
			if ($(this).find('.card-body').attr('id') != 'cardBody') {
				$(this).find('.card-body').css('opacity', '.3');
				$(this).find('.card-img-top').css('opacity', '.3');
			}

			//click the card somewhere
			$(this)
				.find('.card-text, .card-title, .card-body, .card-img-top')
				.unbind('click')
				.bind('click', function () {
					const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
					console.log('selectedItemIndex: %s', selectedItemIndex);

					const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
					console.log('selectedItemCategoryIndex: %s', selectedItemCategoryIndex);

					// if you click the card and it hasn't been selected
					console.log('ingredientCategoryDataArray: %s', ingredientCategoryDataArray);
					const money = userOrderCrepe.checkIfThisIngredientSelected(
						selectedItemIndex,
						selectedItemCategoryIndex,
						ingredientCategoryDataArray
					);
					console.log('money: %s', money);

					userOrderCrepe.checkIfThisIngredientSelected(
						selectedItemIndex,
						selectedItemCategoryIndex,
						ingredientCategoryDataArray
					);
					if (
						!userOrderCrepe.checkIfThisIngredientSelected(
							selectedItemIndex,
							selectedItemCategoryIndex,
							ingredientCategoryDataArray
						)
					) {
						// const updatedIngredient = userOrderCrepe.changeIngredientQuantity(
						// 	selectedItemIndex,
						// 	selectedItemCategoryIndex,
						// 	'increase',
						// 	ingredientCategoryDataArray
						// );
						// console.log('quant: %s', updatedIngredient.quantity);
						userOrderCrepe.up
						$(this).closest('.card').find('.btn2').html(updatedIngredient.quantity);
						$(this).closest('.card').find('.btn2').show();
						//after clicking the card show the + and - buttons
						$(this).closest('.card').find('.btn6').show();
						$(this).closest('.card').find('.btn7').show();
					}
				});
		})
		.on('mouseleave', '.card', function () {
			$(this).find('img').css('opacity', '1');
			$(this).find('.card-body').css('opacity', '1');
		});

	$('.btn6')
		.unbind('click')
		.bind('click', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			const updatedIngredient = userOrderCrepe.changeIngredientQuantity(
				selectedItemIndex,
				selectedItemCategoryIndex,
				'decrease',
				ingredientCategoryDataArray
			);
			if (updatedIngredient) {
				if (updatedIngredient.quantity <= 0) {
					$(this).closest('.card').find('.btn2').hide();
					$(this).closest('.card').find('.btn2').html(updatedIngredient.quantity);
					$(this).hide();
					$(this).closest('.card').find('.btn7').hide();
				} else {
					$(this).closest('.card').find('.btn2').html(updatedIngredient.quantity);
					$(this).closest('.card').find('.btn2').show();
				}
			}
		});

	$('.btn7')
		.unbind('click')
		.bind('click', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			const updatedIngredient = userOrderCrepe.changeIngredientQuantity(
				selectedItemIndex,
				selectedItemCategoryIndex,
				'increase',
				ingredientCategoryDataArray
			);
			console.log('updatedIngredient.quantity: %s', updatedIngredient.quantity);

			$(this).closest('.card').find('.btn2').html(updatedIngredient.quantity);
			$(this).closest('.card').find('.btn2').show();
		});
});

// all this code changes display for smaller screen sizes
//https://stackoverflow.com/questions/15876302/uncaught-typeerror-cannot-read-property-clientwidth-of-null
var cWidth = $(window).width();
//https://stackoverflow.com/questions/1974788/combine-onload-and-onresize-jquery
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
			const clone = b[i].cloneNode(true);
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
var cWidth = $(window).width();
$(window).on('resize', function () {
	var newWidth = $(window).width();
	if (cWidth < newWidth) {
		cWidth = newWidth;
	}
	if ($(window).width() > 767) {
		location.reload();
	}
});
