//https://stackoverflow.com/questions/15876302/uncaught-typeerror-cannot-read-property-clientwidth-of-null
//https://stackoverflow.com/questions/4381228/jquery-selector-inside-the-each-method
//https://stackoverflow.com/questions/4735342/jquery-to-loop-through-elements-with-the-same-class
function stringify(dataObject) {
	// there will only ever be one item in local storage because a customer can only have 1 order in their shopping cart.
	// the object is a dictionary with a key called order and the value being an array which will hold each crepe as either a menu crepe object
	// or an orderCrepe array, the order props, a drinks array, and a sides array
	if (localStorage.length > 0) {
		const order = JSON.parse(localStorage.getItem(localStorage.key(0)));
		console.log('order: %s', order);

		if ('orderCrepe' in order) {
			order['orderCrepe'].push(dataObject);
			const stringifiedDataObject = JSON.stringify(order);
			console.log('stringifiedDataObject', stringifiedDataObject);
			localStorage.setItem('order', stringifiedDataObject);
		} else {
			order['orderCrepe'] = [];
			order['orderCrepe'].push(dataObject);
			const stringifiedDataObject = JSON.stringify(order);
			console.log('order', order);
			console.log('stringifiedDataObject', stringifiedDataObject);
			localStorage.setItem('order', stringifiedDataObject);
		}
	} else {
		const order = {};
		order['orderCrepe'] = [];
		order['orderCrepe'].push(dataObject);
		const stringifiedDataObject = JSON.stringify(order);
		console.log('order', order);
		console.log('stringifiedDataObjectOrder', stringifiedDataObject);
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
		toppingName = toppingName[0];
	}
	var resultArray = [];
	resultArray.push(toppingCategory);
	resultArray.push(toppingName);
	return resultArray;
}

function checkIfToppingIsAlreadySelected(element) {
	if ($(element).closest('.card').find('.btn2').css('--half') == 'true') {
		////https://developer.mozilla.org/en-US/docs/Web/CSS/--*
		console.log('halfMeat true');
		$(element).closest('.card').find('.btn2').css('--half', 'false');
		$(element).closest('.card').find('.btn2').toggle();
		//https://stackoverflow.com/questions/21286887/adding-check-marks-to-bootstrap-button-drop-down-items/46890814
		$(element).closest('.card').find('.btn2').html('✓');
		return true;
	} else if ($(element).closest('.card').find('.btn2').css('--extra') == 'true') {
		console.log('extraMeat true');
		$(element).closest('.card').find('.btn2').css('--extra', 'false');
		$(element).closest('.card').find('.btn2').toggle();
		$(element).closest('.card').find('.btn2').html('✓');
		return true;
	} else if ($(element).closest('.card').find('.btn2').css('--regular') == 'true') {
		console.log('regMeat true');
		$(element).closest('.card').find('.btn2').css('--regular', 'false');
		$(element).closest('.card').find('.btn2').hide();
		return true;
	}
	return false;
}

function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

function validateToppingSelection(selectedElement, btn) {
	console.log('selectedElement inside counter', selectedElement);
	console.log('btn inside counter ', btn);
	var halfMeatCounter = 0;
	var regularMeatCounter = 0;
	var halfMeatIndex = 0;
	var regularMeatIndex = 0;
	var extraMeatIndex = 0;
	var extraMeatCounter = 0;
	var countSum = 0;
	meatSelections = [];

	var toppingCategoryAndToppingNameArray = getCSSToppingName(selectedElement);
	var toppingCategory = toppingCategoryAndToppingNameArray[0];
	var toppingName = toppingCategoryAndToppingNameArray[1];
	console.log('tc', toppingCategory, 'tn', toppingName);

	$('#protein')
		.find('.btn2')
		.each(function () {
			meatSelections.push($(this));
		});

	function countToppings() {
		countSum = 0;
		halfMeatCounter = 0;
		regularMeatCounter = 0;
		extraMeatCounter = 0;
		$('#protein')
			.find('.btn2')
			.each(function (i) {
				if ($(this).css('--half') == 'true') {
					countSum += 1;
					halfMeatCounter += 1;
					halfMeatIndex = i;
					console.log('halfcounter', halfMeatCounter);
				} else if ($(this).css('--regular') == 'true') {
					countSum += 1;
					regularMeatCounter += 1;
					regularMeatIndex = i;
					console.log('regcounter', regularMeatCounter);
					console.log('regIndex', regularMeatIndex);
				} else if ($(this).css('--extra') == 'true') {
					countSum += 1;
					extraMeatCounter += 1;
					extraMeatIndex = i;
					console.log('extracounter', extraMeatCounter);
				}
			});
		const meatIndexArray = [];
		meatIndexArray.push(halfMeatIndex, regularMeatIndex, extraMeatIndex);
	}

	function displayErrorMsg(element) {
		selector = `#${element.closest('.card').attr('id') + 'error'}`;
		id = `${element.closest('.card').attr('id') + 'error'}`;

		if ($(selector).length) {
			$(selector).fadeIn('slow').delay(4000).fadeOut('slow'); //https://stackoverflow.com/questions/15686598/jquery-delay-before-fadeout
		} else {
			$(
				`<div class="alert-danger" role="alert" id="${id}" style="font-size: 20px; font-weight: 600; vertical-align: middle; text-align: center; padding: 5px; display: none; line-height: 40px; color:black; height: 100px; top: 100px; position: absolute;">You may only select 2 proteins.</div>`
			).insertAfter($(selectedElement).closest('.card').find('img'));
			$(selector).fadeIn('slow').delay(4000).fadeOut('slow');
		}

		return false;
	}

	countToppings();
	console.log('countSum', countSum);
	console.log('halfMeatCounter', halfMeatCounter);
	console.log('extraMeatCounter', extraMeatCounter);
	console.log('regMeatCounter', regularMeatCounter);

	if (btn == false && checkIfToppingIsAlreadySelected(selectedElement) == false) {
		if (countSum >= 2) {
			displayErrorMsg(selectedElement);
		} else if (countSum == 0) {
			console.log('topping cat', toppingCategory);
			console.log('topping nam', toppingName);
			$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
			console.log(
				'css(`--${toppingCategory}`)',
				$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`)
			);
			$(selectedElement).closest('.card').find('.btn2').css('--regular', 'true');
			$(selectedElement).closest('.card').find('.btn2').html('✓');
			$(selectedElement).closest('.card').find('.btn2').toggle();
			console.log(
				'after clicking regular meat',
				$(selectedElement).closest('.card').find('.btn2').css('--regular')
			);
		} else if (countSum == 1) {
			if (regularMeatCounter == 1) {
				console.log('pointer', $(`#${meatSelections[regularMeatIndex].attr('id')}`));
				$(`#${meatSelections[regularMeatIndex].attr('id')}`).html('½');
				$(`#${meatSelections[regularMeatIndex].attr('id')}`).css('--regular', 'false');
				$(`#${meatSelections[regularMeatIndex].attr('id')}`).css('--half', 'true');
				console.log(
					'css(`--${toppingCategory}`)',
					$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`)
				);
				console.log('meatselection', $(`#${meatSelections[regularMeatIndex].attr('id')}`).css('--half'));
				$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
				$(selectedElement).closest('.card').find('.btn2').html('½');
				$(selectedElement).closest('.card').find('.btn2').css('--half', 'true');
				$(selectedElement).closest('.card').find('.btn2').show();
			} else if (extraMeatCounter == 1) {
				$(`#${meatSelections[extraMeatIndex].attr('id')}`).html('✓');
				$(`#${meatSelections[extraMeatIndex].attr('id')}`).css('--extra', 'false');
				$(`#${meatSelections[extraMeatIndex].attr('id')}`).css('--regular', 'true');
				$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
				$(selectedElement).closest('.card').find('.btn2').html('✓');
				$(selectedElement).closest('.card').find('.btn2').css('--regular', 'true');
				$(selectedElement).closest('.card').find('.btn2').show();
			} else if (halfMeatCounter == 1) {
				$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
				$(selectedElement).closest('.card').find('.btn2').html('½');
				$(selectedElement).closest('.card').find('.btn2').css('--half', 'true');
				$(selectedElement).closest('.card').find('.btn2').show();
			}
		} else if (countSum >= 2) {
			displayErrorMsg(selectedElement);
		}
	} //end of the if block "if btn == false"

	// if the user selected a button
	else if (btn != false) {
		if (btn == 'btn') {
			// if they select the customize button
			console.log('btn clicked');
			console.log(selectedElement);
			if ($(selectedElement).html() == 'Customize') {
				// if they select the customize button for the first time
				console.log('.btn clicked first time');
				//https://stackoverflow.com/questions/857245/is-there-a-jquery-unfocus-method
				$(selectedElement).blur();
				$(selectedElement).html('Extra +$3.50');
				$(selectedElement).closest('.card').find('.btn3').show();
				$(selectedElement).closest('.card').find('.btn4').show();
			} else {
				// if they select the customize button for the second time then they have selected the extra meat button
				console.log('.btn clicked second time');
				if (countSum == 1) {
					if (regularMeatCounter == 1) {
						$(`#${meatSelections[regularMeatIndex].attr('id')}`).html('✓');
						$(`#${meatSelections[regularMeatIndex].attr('id')}`).toggle();
						$(`#${meatSelections[regularMeatIndex].attr('id')}`).css('--regular', 'false');
						$(`#${meatSelections[regularMeatIndex].attr('id')}`).css(`--${toppingCategory}`, 'false');

						$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
						$(selectedElement).closest('.card').find('.btn2').html('2X');
						$(selectedElement).closest('.card').find('.btn2').css('--extra', 'true');
						$(selectedElement).closest('.card').find('.btn2').show();
					} else if (extraMeatCounter == 1) {
						$(`#${meatSelections[extraMeatIndex].attr('id')}`).html('✓');
						$(`#${meatSelections[extraMeatIndex].attr('id')}`).css('--extra', 'false');
						$(`#${meatSelections[regularMeatIndex].attr('id')}`).css(`--${toppingCategory}`, 'false');
						$(`#${meatSelections[extraMeatIndex].attr('id')}`).toggle();

						$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
						$(selectedElement).closest('.card').find('.btn2').html('2X');
						$(selectedElement).closest('.card').find('.btn2').css('--extra', 'true');
						$(selectedElement).closest('.card').find('.btn2').show();
					} else if (halfMeatCounter == 1) {
						$(`#${meatSelections[halfMeatIndex].attr('id')}`).html('✓');
						$(`#${meatSelections[halfMeatIndex].attr('id')}`).toggle();
						$(`#${meatSelections[halfMeatIndex].attr('id')}`).css('--half', 'false');
						$(`#${meatSelections[regularMeatIndex].attr('id')}`).css(`--${toppingCategory}`, 'false');

						$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
						$(selectedElement).closest('.card').find('.btn2').html('2X');
						$(selectedElement).closest('.card').find('.btn2').css('--extra', 'true');
						$(selectedElement).closest('.card').find('.btn2').show();
					}
				} else if (countSum == 0) {
					console.log('countSum', countSum);
					$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
					$(selectedElement).closest('.card').find('.btn2').css('--extra', 'true');
					$(selectedElement).html('Customize');
					$(selectedElement).blur();
					$(selectedElement).closest('.card').find('.btn2').html('2X');
					$(selectedElement).closest('.card').find('.btn2').show();
				} else if (countSum >= 2) {
					const oldCountSum = countSum;
					console.log('old', oldCountSum);
					checkIfToppingIsAlreadySelected(selectedElement);
					countToppings();
					console.log('new', countSum);

					if (oldCountSum != countSum) {
						validateToppingSelection(selectedElement, 'btn');
					} else {
						displayErrorMsg(selectedElement);
					}
				}
			}
		} else if (btn == 'btn3') {
			if (countSum == 1) {
				if (regularMeatCounter == 1) {
					$(`#${meatSelections[regularMeatIndex].attr('id')}`).html('½');
					$(`#${meatSelections[regularMeatIndex].attr('id')}`).css('--regular', 'false');
					$(`#${meatSelections[regularMeatIndex].attr('id')}`).css('--half', 'true');

					$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
					$(selectedElement).closest('.card').find('.btn2').html('½');
					$(selectedElement).closest('.card').find('.btn2').css('--half', 'true');
					$(selectedElement).closest('.card').find('.btn2').show();
				} else if (extraMeatCounter == 1) {
					$(`#${meatSelections[extraMeatIndex].attr('id')}`).html('✓');
					$(`#${meatSelections[extraMeatIndex].attr('id')}`).css('--extra', 'false');
					$(`#${meatSelections[regularMeatIndex].attr('id')}`).css(`--${toppingCategory}`, 'false');
					$(`#${meatSelections[extraMeatIndex].attr('id')}`).hide();

					$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
					$(selectedElement).closest('.card').find('.btn2').html('½');
					$(selectedElement).closest('.card').find('.btn2').css('--half', 'true');
					$(selectedElement).closest('.card').find('.btn2').show();
				} else if (halfMeatCounter == 1) {
					$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
					$(selectedElement).closest('.card').find('.btn2').html('½');
					$(selectedElement).closest('.card').find('.btn2').css('--half', 'true');
					$(selectedElement).closest('.card').find('.btn2').show();
				}
			} else if (countSum == 0) {
				console.log('countSum', countSum);
				$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
				$(selectedElement).closest('.card').find('.btn2').css('--half', 'true');
				$(selectedElement).html('Customize');
				$(selectedElement).blur();
				$(selectedElement).closest('.card').find('.btn2').html('½');
				$(selectedElement).closest('.card').find('.btn2').show();
			} else if (countSum >= 2) {
				const oldCountSum = countSum;
				checkIfToppingIsAlreadySelected(selectedElement);
				countToppings();
				if (oldCountSum != countSum) {
					validateToppingSelection(selectedElement, 'btn3');
				} else {
					displayErrorMsg(selectedElement);
				}
			}
		} else if (btn == 'btn4') {
			console.log('btn4 countSum');
			if (countSum == 1) {
				if (regularMeatCounter == 1) {
					$(`#${meatSelections[regularMeatIndex].attr('id')}`).html('½');
					$(`#${meatSelections[regularMeatIndex].attr('id')}`).css('--regular', 'false');
					$(`#${meatSelections[regularMeatIndex].attr('id')}`).css('--half', 'true');

					$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
					$(selectedElement).closest('.card').find('.btn2').html('½');
					$(selectedElement).closest('.card').find('.btn2').css('--half', 'true');
					$(selectedElement).closest('.card').find('.btn2').show();
				} else if (extraMeatCounter == 1) {
					$(`#${meatSelections[extraMeatIndex].attr('id')}`).html('✓');
					$(`#${meatSelections[extraMeatIndex].attr('id')}`).css('--extra', 'false');
					$(`#${meatSelections[extraMeatIndex].attr('id')}`).css('--regular', 'true');

					$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
					$(selectedElement).closest('.card').find('.btn2').html('✓');
					$(selectedElement).closest('.card').find('.btn2').css('--regular', 'true');
					$(selectedElement).closest('.card').find('.btn2').show();
				} else if (halfMeatCounter == 1) {
					$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
					$(selectedElement).closest('.card').find('.btn2').html('✓');
					$(selectedElement).closest('.card').find('.btn2').css('--half', 'true');
					$(selectedElement).closest('.card').find('.btn2').show();
				}
			} else if (countSum == 0) {
				console.log('countSum', countSum);
				$(selectedElement).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
				$(selectedElement).closest('.card').find('.btn2').html('✓');
				$(selectedElement).closest('.card').find('.btn2').css('--regular', 'true');
				$(selectedElement).blur();
				$(selectedElement).closest('.card').find('.btn2').show();
			} else if (countSum >= 2) {
				const oldCountSum = countSum;
				console.log('oldCountSum', oldCountSum);
				checkIfToppingIsAlreadySelected(selectedElement);
				countToppings();
				console.log('NewcountSum', countSum);
				if (oldCountSum != countSum) {
					validateToppingSelection(selectedElement, 'btn4');
				} else {
					displayErrorMsg(selectedElement);
				}
			}
		}
	}
} // end of counter function

//mouse over functionality
$(window).on('load', function () {
	$('.card').each(function (i) {
		this.id = 'card' + i;
	});

	//https://api.jquery.com/wrap/
	$('.card-img-top').wrap('<div class="container2"></div>');
	$('.card-img-top').each(function () {
		//https://stackoverflow.com/questions/21556874/display-an-alert-in-jquery-for-a-few-seconds-then-fade-it-out
		$('<button class="btn" type="button">Customize</button>').insertAfter($(this));
		$('<button class="btn4" type="button">Regular</button>').insertAfter($(this));
		$('<button class="btn3" type="button">Light</button>').insertAfter($(this));
		$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
	});

	$('.btn2').each(function (i) {
		this.id = 'btn' + i;
	});

	var x = document.getElementsByClassName('card-title');
	var y = [];

	for (i = 2; i < x.length; i++) {
		y.push(x[i].innerHTML);
	}

	$('.card-img-top').each(function (j) {
		this.src = '/static/images/' + y[j] + '.jpg';
	});

	$('.card')
		.unbind('mouseenter')
		.bind('mouseenter', function () {
			if ($(this).closest('.card-deck').attr('id') == 'protein') {
				if ($(this).find('.card-body').attr('id') != 'cardBody') {
					//don't want to fade out the card with the build your crepe words at the top
					$(this).find('.card-body').css('opacity', '.3'); //https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_image_overlay_opacity
				}

				$(this).find('.card-img-top').css('opacity', '.3');
				$(this).find('.btn').show();

				//https://www.w3schools.com/jquery/tryit.asp?filename=tryjquery_traversing_find4
				//https://stackoverflow.com/questions/5333426/how-to-find-a-parent-with-a-known-class-in-jquery

				//if you just click the card

				//https://stackoverflow.com/questions/14969960/jquery-click-events-firing-multiple-times

				$(this)
					.find('.card-text, .card-title, .card-body, .card-img-top')
					.unbind('click')
					.bind('click', function () {
						console.log('clicked', $(this).closest('.card').find('.card-text').text());
						validateToppingSelection($(this), false); // validate the user's topping choice after making sure that the card they selected has not already been selected
					});

				$('#protein')
					.find('.btn')
					.unbind('click')
					.bind('click', function () {
						console.log('$(this).attr("class")', $(this).attr('class'));
						console.log('$this inside .btn click function', $(this));
						validateToppingSelection($(this), $(this).attr('class'));
					});

				$('#protein')
					.find('.btn3')
					.unbind('click')
					.bind('click', function () {
						validateToppingSelection($(this), $(this).attr('class'));
					});

				$('#protein')
					.find('.btn4')
					.unbind('click')
					.bind('click', function () {
						validateToppingSelection((selectedElement = $(this)), $(this).attr('class'));
					});

				//mouse leave functionality
				//https://stackoverflow.com/questions/15722997/jquery-mouseover-image-overlay
			}
		});

	$('.card')
		.unbind('mouseleave')
		.bind('mouseleave', function () {
			if ($(this).closest('.card-deck').attr('id') == 'protein') {
				var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
				var toppingCategory = toppingCategoryAndToppingNameArray[0];
				var toppingName = toppingCategoryAndToppingNameArray[1];

				$(this).find('.btn').html('Customize');

				if (
					$(this).find('.btn2').css('--extra') != 'true' &&
					$(this).find('.btn2').css('--half') != 'true' &&
					$(this).find('.btn2').css('--regular') != 'true'
				) {
					$(this).find('.btn').hide();
					$(this).find('.btn3').hide();
					$(this).find('.btn4').hide();
				} else {
					$(this).find('.btn').blur();
					$(this).find('.btn3').hide();
					$(this).find('.btn4').hide();
				}

				$(this).find('img').css('opacity', '1');
				$(this).find('.card-body').css('opacity', '1');
			}
		});

	//veggie + all other topping functionality
	$(document)
		.on('mouseenter', '.card', function () {
			if ($(this).closest('.card-deck').attr('id') != 'protein') {
				console.log('hey');
				var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
				var toppingCategory = toppingCategoryAndToppingNameArray[0];
				var toppingName = toppingCategoryAndToppingNameArray[1];
				console.log('tc', toppingCategory, 'tn', toppingName);

				if ($(this).find('.card-body').attr('id') != 'cardBody') {
					$(this).find('.card-body').css('opacity', '.3'); //https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_image_overlay_opacity
				}

				$(this).find('.card-img-top').css('opacity', '.3');
				$(this).find('.btn').show();

				//click the card somewhere
				$(this)
					.find('.card-text, .card-title, .card-body, .card-img-top')
					.unbind('click')
					.bind('click', function () {
						// TODO: dynamically set css values
						if (
							$(this).closest('.card').find('.btn2').css('--extra') != 'true' &&
							$(this).closest('.card').find('.btn2').css('--half') != 'true' &&
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
					});
			}
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
			if ($(this).closest('.card-deck').attr('id') != 'protein') {
				var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
				var toppingCategory = toppingCategoryAndToppingNameArray[0];
				var toppingName = toppingCategoryAndToppingNameArray[1];
				console.log('tc', toppingCategory, 'tn', toppingName);
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
					console.log('`--${toppingCategory}`, `${toppingName}`', `--${toppingCategory}`, `${toppingName}`);
				}
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
orderToppingsDict['ingredients'] = [];
function checkOut() {
	// $('#checkout')
	// 	.unbind('click')
	// 	.bind('click', function () {
	console.log('checkout');
	var proteinToppings = 0;
	$('#protein')
		.find('.btn2')
		.each(function () {
			if ($(this).css('--regular') == 'true') {
				proteinToppings += 1;
			} else if ($(this).css('--extra') == 'true') {
				proteinToppings += 1;
			} else if ($(this).css('--half') == 'true') {
				proteinToppings += 1;
			}
		});

	if (proteinToppings < 1) {
		$('#error2').fadeIn('slow').delay(5000).fadeOut('slow');
		return false;
	} else {
		console.log('checkout');

		$('.card-deck').each(function () {
			console.log('id', `${$(this).attr('id')}`);
			ingredientsDict[`${$(this).attr('id')}`] = [];
		});

		$('.btn2').each(function () {
			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			var toppingCategory = toppingCategoryAndToppingNameArray[0];
			var toppingName = toppingCategoryAndToppingNameArray[1];
			console.log(
				'tc literal in checkout',
				toppingCategory,
				'tc in checkout',
				$(this).css(`--${toppingCategory}`),
				'tname in checkout',
				toppingName,
				'tc reg then half then extra',
				$(this).css('--regular'),
				$(this).css('--half'),
				$(this).css('--extra')
			);
			if ($(this).css(`--${toppingCategory}`) == toppingName) {
				var toppingDictionary = {};
				if ($(this).css('--half') == 'true') {
					toppingDictionary[`${toppingName}`] = 'half';
				} else if ($(this).css('--regular') == 'true') {
					toppingDictionary[`${toppingName}`] = 'regular';
				} else if ($(this).css('--extra') == 'true') {
					toppingDictionary[`${toppingName}`] = 'extra';
				}
				ingredientsDict[`${toppingCategory}`].push(toppingDictionary);
				console.log('ingredientsDict', ingredientsDict);
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
				} else {
					var protein = orderItems[key];
					console.log('protein', protein);
					//if (protein.length > 1) {

					for (var i = 0; i < protein.length; i++) {
						var proteinCount = 0;
						var proteinCategoryCountDict = {};
						var proteinName = Object.keys(protein[i])[0];
						var proteinQuantity = protein[i][proteinName];
						console.log('pname', proteinName, 'pquant', proteinQuantity);
						if (proteinQuantity == 'half') {
							proteinCount += 0.5;
						} else if (proteinQuantity == 'regular') {
							proteinCount += 1;
						} else if (proteinQuantity == 'extra') {
							proteinCount += 2;
						}

						proteinCategoryCountDict[`${proteinName}`] = proteinCount;

						proteinCategoryCount.push(proteinCategoryCountDict);
					}
				}
			}
		}
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
		orderToppingsDict['crepeTotal'] = orderTotal;
		orderToppingsDict['flavorProfile'] = 'savory';
		orderToppingsDict['customCrepe'] = true;
		orderToppingsDict['ingredients'] = ingredientsDict;
		console.log('orderToppingsDictwithIngredient', orderToppingsDict);

		//https://developer.mozilla.org/en-US/docs/Web/API/Window/location
		console.log('odict', orderToppingsDict);
		// $.when(stringify(orderToppingsDict)).then(location.assign('/order?userOrder=true'));
		$.when(stringify(orderToppingsDict)).then(location.assign('/order-drink'));
	}
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
// .5 upcharge for almond milk
//keep only vanilla, chocolate, strawb, and blueb & cookie milshakes 4 std milkshakes
// add drip coffee
//make coffee word in select milk title dynamic
//no customization of milk for latte but you can customize for drip coffee
//only select one coffee
// add apple streudel croissant for 4.25
