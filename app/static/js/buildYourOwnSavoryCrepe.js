('use strict');
import { Order, OrderCrepe } from './model.js';

var editCrepeIndex = null;
var editCrepe = null;
var ingredientServingSizes;
var ingredientCategoryDataArray = new Array();
var userOrderCrepe;

function displayErrorMsg(element) {
	const selector = `#${element.closest('.card').attr('id') + 'error'}`;
	const id = `${element.closest('.card').attr('id') + 'error'}`;
	if ($(selector).length) {
		$(selector).fadeIn('slow').delay(4000).fadeOut('slow'); //https://stackoverflow.com/questions/15686598/jquery-delay-before-fadeout
	} else {
		$(
			`<div class="alert-danger" role="alert" id="${id}" style="font-size: 20px; font-weight: 600; vertical-align: middle; text-align: center; padding: 5px; display: none; line-height: 40px; color:black; height: 100px; top: 100px; position: absolute;">You may only select 2 proteins.</div>`
		).insertAfter($(element).closest('.card').find('img'));
		$(selector).fadeIn('slow').delay(4000).fadeOut('slow');
	}
	return false;
}

const stringify = (crepeOrder) => {
	if (crepeOrder.ingredients.length) {
		if (editCrepeIndex === null) {
			const order = new Order();
			if (localStorage.length > 0) {
				// there will only ever be one item in local storage because a customer can only have 1 order in their shopping cart.
				order.fromJSON(localStorage.getItem(localStorage.key(0)));
				// only one crepe order will be processed on this page at a time
				const crepeOrderTotal = crepeOrder.orderTotal;
				order.orderTotal += crepeOrderTotal;
				order.orderCrepe.push(crepeOrder);
				const stringifiedCrepeOrder = JSON.stringify(order);
				localStorage.setItem('order', stringifiedCrepeOrder);
			} else {
				order.orderTotal += crepeOrder.orderTotal;
				order.orderCrepe.push(crepeOrder);
				const stringifiedCrepeOrder = JSON.stringify(order);
				localStorage.setItem('order', stringifiedCrepeOrder);
			}
		} else {
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
	// had to reformat this data to match what the orderCrepe model is expecting. index the ingredient category with its associated ingredients in a list
	const unformattedIngredientCategoryDataArray = $('#ingredientPricesByCategory').data('ingredientpricesbycategory');
	for (var i = 0; i < unformattedIngredientCategoryDataArray.length; i++) {
		const ingredients = [...unformattedIngredientCategoryDataArray[i].ingredients];
		ingredientCategoryDataArray.push(ingredients);
	}
	$('.card-img-top').wrap('<div class="container2"></div>');

	$('.card-img-top').each(function () {
		//https://stackoverflow.com/questions/21556874/display-an-alert-in-jquery-for-a-few-seconds-then-fade-it-out
		$('<button class="btn" id="servingSize-2" type="button">Customize</button>').insertAfter($(this));
		$('<button class="btn4" id="servingSize-1" type="button">Regular</button>').insertAfter($(this));
		$('<button class="btn3" id="servingSize-0" type="button">Light</button>').insertAfter($(this));
		$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
	});

	$('#savoryCrepeCheckOut')
		.unbind('click')
		.bind('click', function () {
			checkOut(userOrderCrepe);
		});

	if ($('.edit').length) {
		editCrepeIndex = $('.edit').first().attr('id');
		editCrepe = JSON.parse(localStorage.getItem(localStorage.key(0)))['orderCrepe'][editCrepeIndex]['crepes'][0];
		const crepeIngredients = editCrepe['ingredients'];
		for (var ingredientCategoryKey in crepeIngredients) {
			const ingredientArray = crepeIngredients[ingredientCategoryKey];
			for (var i = 0; i < ingredientArray.length; i++) {
				const ingredient = ingredientArray[i];
				if ('name' in ingredient) {
					const ingredientName = ingredient['name'];
					const ingredientQuantity = ingredient['quantity'];
					const ingredientServingSize = ingredient['servingSize'];
					$(`#${ingredientName}`).find('.btn2').css(`--${ingredientCategoryKey}`, `${ingredientName}`);
					$(`#${ingredientName}`).find('.btn2').css(`--quantity`, `${ingredientQuantity}`);
					$(`#${ingredientName}`).find('.btn2').html(ingredientQuantity);
					$(`#${ingredientName}`).find('.btn2').show();
					$(`#${ingredientName}`).find('.btn6').show();
					$(`#${ingredientName}`).find('.btn7').show();
				}
			}
		}
	}

	$('.card-img-top').each(function () {
		this.src = '../static/images/vanilla_ice_cream.jpg';
	});
	userOrderCrepe = new OrderCrepe();
	userOrderCrepe._flavor = 'savory'
	userOrderCrepe._origination = 'custom'
	//veggie + all other topping functionality
	$(document)
		.on('mouseenter', '.card', function () {
			if ($(this).find('.card-body').attr('id') != 'cardBody') {
				$(this).find('.card-body').css('opacity', '.3');
				$(this).find('.card-img-top').css('opacity', '.3');
				$(this).find('.btn').show();
			}

			//click the card somewhere
			$(this)
				.find('.card-text, .card-title, .card-body, .card-img-top')
				.unbind('click')
				.bind('click', function () {
					const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
					const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
					// if you click the card and it hasn't been selected
					const selectedIngredient = userOrderCrepe.checkIfThisIngredientSelected(
						selectedItemIndex,
						selectedItemCategoryIndex,
						ingredientCategoryDataArray
					);
					if (!selectedIngredient) {
						const servingSize = 'regular';
						const addedIngredient = userOrderCrepe.changeSavoryIngredientQuantity(
							selectedItemIndex,
							selectedItemCategoryIndex,
							ingredientCategoryDataArray,
							servingSize
						);
						if (!addedIngredient) {
							displayErrorMsg($(this));
						} else {
							if (addedIngredient.servingSize === 'light') {
								$(this).closest('.card').find('.btn2').html('½');
								$(this).closest('.card').find('.btn2').show();
							} else if (addedIngredient.servingSize === 'regular') {
								$(this).closest('.card').find('.btn2').html('✓');
								$(this).closest('.card').find('.btn2').show();
							}
						}
					} else {
						userOrderCrepe.removeIngredient(
							selectedItemIndex,
							selectedItemCategoryIndex,
							ingredientCategoryDataArray
						);
						$(this).closest('.card').find('.btn2').hide();
					}
					for (var i = 0; i < userOrderCrepe.ingredients.length; i++) {
						if (userOrderCrepe.ingredients[i].category === 'protein') {
							for (var j = 0; j < ingredientCategoryDataArray[0].length; j++) {
								if (ingredientCategoryDataArray[0][j].id === userOrderCrepe.ingredients[i].id) {
									var selector = '#card-';
									selector += String(j);
									if (userOrderCrepe.ingredients[i].servingSize === 'light') {
										$('#cardDeck-0').find(selector).find('.btn2').html('½');
									} else if (userOrderCrepe.ingredients[i].servingSize === 'regular') {
										$('#cardDeck-0').find(selector).find('.btn2').html('✓');
									} else if (userOrderCrepe.ingredients[i].servingSize === 'extra') {
										$('#cardDeck-0').find(selector).find('.btn2').html('2x');
									}
								}
							}
						}
					}
				});
		})
		.on('mouseleave', '.card', function () {
			if ($(this).find('.card-body').attr('id') != 'cardBody') {

				$(this).find('img').css('opacity', '1');
				$(this).find('.card-body').css('opacity', '1');
				$(this).find('.btn').html('Customize');
			
				const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
				const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
				if (
					!userOrderCrepe.checkIfThisIngredientSelected(
						selectedItemIndex,
						selectedItemCategoryIndex,
						ingredientCategoryDataArray
					)
				) {
					$(this).find('.btn').hide();
					$(this).find('.btn3').hide();
					$(this).find('.btn4').hide();
				} else {
					$(this).find('.btn3').hide();
					$(this).find('.btn4').hide();
				}
			}
			});

	$('.btn')
		.unbind('click')
		.bind('click', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			if ($(this).html() === 'Customize') {
				// if they select the customize button for the first time
				//https://stackoverflow.com/questions/857245/is-there-a-jquery-unfocus-method
				$(this).blur();
				$(this).html('Extra');
				$(this).closest('.card').find('.btn3').show();
				$(this).closest('.card').find('.btn4').show();
			} else {
				const servingSizeIndex = $(this).attr('id').split('-')[1];
				const ingredientServingSize = ingredientServingSizes[servingSizeIndex].serving_size;
				// if they select the customize button for the second time then they have selected the extra meat button
				const selectedIngredient = userOrderCrepe.checkIfThisIngredientSelected(
					selectedItemIndex,
					selectedItemCategoryIndex,
					ingredientCategoryDataArray
				);
				// check if this ingredient is being modified
				const addedIngredient = userOrderCrepe.changeSavoryIngredientQuantity(
					selectedItemIndex,
					selectedItemCategoryIndex,
					ingredientCategoryDataArray,
					ingredientServingSize
				);
				if (!addedIngredient) {
					displayErrorMsg($(this));
				}
				else {
					$(this).blur();
					$(this).closest('.card').find('.btn2').html('2x');
					$(this).closest('.card').find('.btn2').show();
				}
			}
		});

	$('.btn3')
		.unbind('click')
		.bind('click', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			const servingSizeIndex = $(this).attr('id').split('-')[1];
			const ingredientServingSize = ingredientServingSizes[servingSizeIndex].serving_size;
			const addedIngredient = userOrderCrepe.changeSavoryIngredientQuantity(
				selectedItemIndex,
				selectedItemCategoryIndex,
				ingredientCategoryDataArray,
				ingredientServingSize
			);
			if (!addedIngredient) {
				displayErrorMsg($(this));
			}
			else {
				$(this).closest('.card').find('.btn2').html('½');
				$(this).closest('.card').find('.btn2').show();
			}
		});
	$('.btn4')
		.unbind('click')
		.bind('click', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			const servingSizeIndex = $(this).attr('id').split('-')[1];
			const ingredientServingSize = ingredientServingSizes[servingSizeIndex].serving_size;
			const addedIngredient = userOrderCrepe.changeSavoryIngredientQuantity(
				selectedItemIndex,
				selectedItemCategoryIndex,
				ingredientCategoryDataArray,
				ingredientServingSize
			);
			if (!addedIngredient) {
				displayErrorMsg($(this));
			}
			else {
				$(this).closest('.card').find('.btn2').html('✓');
				$(this).closest('.card').find('.btn2').show();
			}
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
// TODO: add functionality to show customize card when clicked. also need to add all btn functionality
