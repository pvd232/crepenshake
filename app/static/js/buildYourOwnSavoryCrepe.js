('use strict');
import { Order, OrderCrepe } from './model.js';

var editCrepeIndex = null;
var editOrder = null;
var ingredientServingSizes;
var ingredientCategoryDataArray = new Array();
var userOrderCrepe;

const displayErrorMsg = (element) => {
	const selector = `#${element.closest('.card, .list-group-item').attr('id') + 'error'}`;
	const id = `${element.closest('.card, .list-group-item').attr('id') + 'error'}`;
	if ($(selector).length) {
		$(selector).fadeIn('slow').delay(4000).fadeOut('slow'); //https://stackoverflow.com/questions/15686598/jquery-delay-before-fadeout
	} else {
		$(
			`<div class="alert-danger" role="alert" id="${id}" style="font-size: 20px; font-weight: 600; vertical-align: middle; text-align: center; padding: 5px; display: none; line-height: 40px; color:black; height: 100px; top: 100px; position: absolute;">You may only select 2 proteins.</div>`
		).insertAfter($(element).closest('.card, .list-group-item').find('img'));
		$(selector).fadeIn('slow').delay(4000).fadeOut('slow');
	}
	return false;
};

const stringify = (crepeOrder) => {
	if (editCrepeIndex === null) {
		if (crepeOrder.ingredients.length) {
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
		}
	} else {
		if (crepeOrder.ingredients.length) {
			editOrder.orderCrepe[editCrepeIndex] = crepeOrder;
			localStorage.setItem('order', JSON.stringify(editOrder));
		} else {
			editOrder.orderCrepe.splice(editCrepeIndex, 1);
			localStorage.setItem('order', JSON.stringify(editOrder));
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
		editOrder = new Order();
		editOrder.fromJSON(localStorage.getItem(localStorage.key(0)));
		const editOrderCrepe = editOrder.orderCrepe[editCrepeIndex];
		userOrderCrepe = editOrderCrepe;
		console.log('editOrderCrepe', editOrderCrepe);

		const crepeIngredients = editOrderCrepe.ingredients;
		for (var i = 0; i < crepeIngredients.length; i++) {
			const ingredient = crepeIngredients[i];
			$(`#${ingredient.id}`).closest('.card').find('.btn2').html(ingredient.quantity);
			$(`#${ingredient.id}`).closest('.card').find('.btn2').show();
			$(`#${ingredient.id}`).closest('.card').find('.btn6').show();
			$(`#${ingredient.id}`).closest('.card').find('.btn7').show();
			$(`#${ingredient.id}`).closest('.card').find('.btn').show();

			console.log('ingredient', ingredient);
		}
	}

	$('.card-img-top').each(function () {
		this.src = '../static/images/vanilla_ice_cream.jpg';
	});
	userOrderCrepe._flavor = 'savory';
	userOrderCrepe._origination = 'custom';
	//veggie + all other topping functionality
	$(document)
		.on('mouseenter', '.card, .list-group', function () {
			if ($(this).find('.card-body').attr('id') != 'cardBody' && $(this).attr('class') != 'list-group') {
				$(this).find('.card-body').css('opacity', '.3');
				$(this).find('.card-img-top').css('opacity', '.3');
				$(this).find('.btn').show();
			}
			if ($(this).attr('class') === 'list-group') {
				$(this)
					.find('.list-group-item')
					.unbind('mouseenter')
					.bind('mouseenter', function () {
						const selectedItemIndex = $(this).attr('id').split('-')[1];
						console.log('selectedItemIndex', selectedItemIndex);

						const selectedItemCategoryIndex = $(this).closest('.list-group').attr('id').split('-')[1];
						if (
							!userOrderCrepe.checkIfThisIngredientSelected(
								selectedItemIndex,
								selectedItemCategoryIndex,
								ingredientCategoryDataArray
							)
						) {
							$(this).find('img, h5, p').css('opacity', '.3');
							$(this).find('.btn').show();
						}
					});
			}

			//click the card somewhere
			$(this)
				.find('.card-text, .card-title, .card-body, .card-img-top, .list-group-item')
				.unbind('click')
				.bind('click', function (event) {
					const senderElement = event.target;
					if (this === senderElement) {
						const selectedItemIndex = $(this).closest('.card, li').attr('id').split('-')[1];
						const selectedItemCategoryIndex = $(this)
							.closest('.card-deck, .list-group')
							.attr('id')
							.split('-')[1];
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
									$(this).closest('.card, .list-group-item').find('.btn2').html('½');
									$(this).closest('.card, .list-group-item').find('.btn2').show();
								} else if (addedIngredient.servingSize === 'regular') {
									$(this).closest('.card, .list-group-item').find('.btn2').html('✓');
									$(this).closest('.card, .list-group-item').find('.btn2').show();
								}
							}
						} else {
							userOrderCrepe.removeIngredient(
								selectedItemIndex,
								selectedItemCategoryIndex,
								ingredientCategoryDataArray
							);
							$(this).closest('.card, .list-group-item').find('.btn2').hide();
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
					}
				});
			$('.btn')
				.unbind('click')
				.bind('click', function () {
					const selectedItemIndex = $(this).closest('.card, .list-group-item').attr('id').split('-')[1];
					const selectedItemCategoryIndex = $(this)
						.closest('.card-deck, .list-group')
						.attr('id')
						.split('-')[1];
					if ($(this).html() === 'Customize') {
						// if they select the customize button for the first time
						//https://stackoverflow.com/questions/857245/is-there-a-jquery-unfocus-method
						$(this).blur();
						$(this).html('Extra');
						$(this).closest('.card, .list-group-item').find('.btn3').show();
						$(this).closest('.card, .list-group-item').find('.btn4').show();
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
						} else {
							$(this).blur();
							$(this).closest('.card, .list-group-item').find('.btn2').html('2x');
							$(this).closest('.card, .list-group-item').find('.btn2').show();
						}
					}
				});

			$('.btn3')
				.unbind('click')
				.bind('click', function () {
					const selectedItemIndex = $(this).closest('.card, .list-group-item').attr('id').split('-')[1];
					const selectedItemCategoryIndex = $(this)
						.closest('.card-deck, .list-group')
						.attr('id')
						.split('-')[1];
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
					} else {
						$(this).closest('.card, .list-group-item').find('.btn2').html('½');
						$(this).closest('.card, .list-group-item').find('.btn2').show();
					}
				});
			$('.btn4')
				.unbind('click')
				.bind('click', function () {
					const selectedItemIndex = $(this).closest('.card, .list-group-item').attr('id').split('-')[1];
					const selectedItemCategoryIndex = $(this)
						.closest('.card-deck, .list-group')
						.attr('id')
						.split('-')[1];
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
					} else {
						$(this).closest('.card, .list-group-item').find('.btn2').html('✓');
						$(this).closest('.card, .list-group-item').find('.btn2').show();
					}
				});
		})
		.on('mouseleave', '.card, .list-group-item', function () {
			if ($(this).find('.card-body').attr('id') != 'cardBody') {
				$(this).find('img, h5, p').css('opacity', '1');

				$(this).find('.card-body').css('opacity', '1');
				$(this).find('.btn').html('Customize');

				const selectedItemIndex = $(this).closest('.card, li').attr('id').split('-')[1];
				const selectedItemCategoryIndex = $(this).closest('.card-deck, .list-group').attr('id').split('-')[1];
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
});

// all this code changes display for smaller screen sizes
//https://stackoverflow.com/questions/15876302/uncaught-typeerror-cannot-read-property-clientwidth-of-null
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
		const h3Elements = document.getElementsByClassName('h3');

		$('#crepeImg').css('margin-left', '0px');
		$('#cardText').css('margin-left', '0px');
		$('#cardText').css('margin-right', '0px');
		$('#cardText').css('margin-bottom', '20px');
		$('#cardBody').css('margin-left', '0px');

		const cardTitleValues = new Array();
		for (var i = 2; i < cardTitleElements.length; i++) {
			cardTitleValues.push(cardTitleElements[i].innerHTML);
		}

		const constCardTitleValues = [...cardTitleValues];
		const cardTextValues = new Array();
		for (var i = 1; i < cardTextElements.length; i++) {
			cardTextValues.push(cardTextElements[i].innerHTML);
		}

		const constCardTextValues = [...cardTextValues];
		var cardImgSrcValues = new Array();
		for (var i = 0; i < cardImgTopElements.length; i++) {
			cardImgSrcValues.push(cardImgTopElements[i].src);
		}

		const constCardImgSrcValues = [...cardImgSrcValues];
		const cardDeckElementsLength = cardDeckElements.length;
		var cardDeckTitleValues = new Array();
		for (var i = 0; i < h3Elements.length; i++) {
			cardDeckTitleValues.push(h3Elements[i].innerHTML);
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

			const stoppingPoint = k + cardDeckChildrenLength[i];
			for (var k; k < stoppingPoint; k++) {
				const listValue = document.createElement('li');
				listValue.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
				listValue.setAttribute('style', 'width:100%');

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
				const container3 = document.createElement('div');
				container3.setAttribute('class', 'container3');

				const gridContainer = document.createElement('div');
				gridContainer.setAttribute('class', 'grid-container');
				gridContainer.setAttribute(
					'style',
					'margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto; grid-gap: 2px; display:grid;'
				);

				const button = document.createElement('button');
				button.setAttribute('class', 'btn');
				button.setAttribute('id', 'servingSize-2');
				button.innerHTML = 'Customize';

				const button2 = document.createElement('button');
				button2.setAttribute('class', 'btn2');
				button2.innerHTML = '✓';

				// const button3 = document.createElement('button');
				// button3.setAttribute('class', 'btn3');
				// button3.innerHTML = 'Light';
				// button3.setAttribute('id', 'servingSize-0');

				// const button4 = document.createElement('button');
				// button4.setAttribute('class', 'btn4');
				// button4.innerHTML = 'Regular';
				// button4.setAttribute('id', 'servingSize-1');

				gridContainer.appendChild(button);
				// gridContainer.appendChild(button4);
				// gridContainer.appendChild(button3);
				gridContainer.appendChild(button2);

				container3.appendChild(gridContainer);
				listValue.appendChild(container3);

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
					var cardId = 'card-';
					cardId += String(i);
					this.id = cardId;
				});
		});
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
	const newWidth = $(window).width();
	if (cWidth < newWidth) {
		cWidth = newWidth;
	}
	if ($(window).width() > 767) {
		location.reload();
	}
});
