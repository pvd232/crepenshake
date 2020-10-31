('use strict');
import { Order, OrderCrepe } from './model.js';

var editCrepeIndex = null;
var editOrder = null;
var userOrderCrepe = new OrderCrepe();

const displayErrorMsg = (element) => {
	const selector = `#${element.closest('.card, .list-group-item').attr('id') + 'error'}`;
	const id = `${element.closest('.card, .list-group-item').attr('id') + 'error'}`;
	if ($(selector).length) {
		$(selector).fadeIn('slow').delay(4000).fadeOut('slow'); //https://stackoverflow.com/questions/15686598/jquery-delay-before-fadeout
	} else {
		if ($(element).attr('class') === 'card') {
			$(
				`<div class="alert-danger" role="alert" id="${id}" style="font-size: 20px; font-weight: 600; vertical-align: middle; text-align: center; padding: 5px; display: none; line-height: 40px; color:black; height: 100px; top: 100px; position: absolute;">You may only select 2 proteins.</div>`
			).insertAfter($(element).closest('.card, .list-group-item').find('img'));
			$(selector).fadeIn('slow').delay(4000).fadeOut('slow');
		} else if ($(element).attr('class') === 'list-group-item d-flex justify-content-between align-items-center') {
			$(
				`<div class="alert-danger" role="alert" id="${id}" style="font-size: 20px; font-weight: 600; vertical-align: middle; text-align: center; padding: 5px; display: none; line-height: 40px; color:black; height: 85px; top: 20px; position: absolute;">You may only select 2 proteins.</div>`
			).insertAfter($(element).find('container'));
			$(selector).fadeIn('slow').delay(4000).fadeOut('slow');
		}
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
	userOrderCrepe.flavor = 'savory';
	userOrderCrepe.origination = 'custom';
	if (editCrepeIndex != null) {
		// stringify(order);
		$.when(stringify(order)).then(location.assign('/order?userOrder=true'));
	} else {
		// stringify(order);
		$.when(stringify(order)).then(location.assign('/order/drink'));
	}
};

function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}
const modifyOrder = () => {
	if ($('.edit').length) {
		console.log('edit');
		editCrepeIndex = $('.edit').first().attr('id');
		editOrder = new Order();
		editOrder.fromJSON(localStorage.getItem(localStorage.key(0)));
		const editOrderCrepe = editOrder.orderCrepe[editCrepeIndex];
		userOrderCrepe = editOrderCrepe;
		console.log('editOrderCrepe', editOrderCrepe);

		const crepeIngredients = editOrderCrepe.ingredients;
		for (var i = 0; i < crepeIngredients.length; i++) {
			const ingredient = crepeIngredients[i];
			if (ingredient.servingSize === 'light') {
				$(`#${ingredient.id}`).find('.btn2').html('½');
			} else if (userOrderCrepe.ingredients[i].servingSize === 'regular') {
				$(`#${ingredient.id}`).find('.btn2').html('✓');
			} else if (userOrderCrepe.ingredients[i].servingSize === 'extra') {
				$(`#${ingredient.id}`).find('.btn2').html('2x');
			}
			$(`#${ingredient.id}`).find('.btn2').show();
			$(`#${ingredient.id}`).find('.btn').show();

			console.log('ingredient', ingredient);
		}
	}
	console.log('userOrderCrepe', userOrderCrepe);
};
const pageLogic = () => {
	$('.card, .list-group-item')
		.on('mouseenter', function () {
			if ($(this).find('.card-body').attr('id') != 'cardBody') {
				$(this).find('.card-body, .card-img-top, img, h5, p').css('opacity', '.3');
				$(this).find('.btn').show();
			}

			//click the card somewhere
			$(this)
				.unbind('click')
				.bind('click', function (event) {
					const senderElementClass = event.target.getAttribute('class');
					console.log('senderElement', senderElementClass);

					if (
						senderElementClass === 'list-group-item d-flex justify-content-between align-items-center' ||
						senderElementClass === 'card-text' ||
						senderElementClass === 'card-title' ||
						senderElementClass === 'card-body' ||
						senderElementClass === 'card-img-top'
					) {
						const json = JSON.parse($(this).attr('data-ingredients'));

						// if you click the card and it hasn't been selected
						const selectedIngredient = userOrderCrepe.findIngredient(json);
						if (!selectedIngredient) {
							const servingSize = 'regular';
							const addedIngredient = userOrderCrepe.changeSavoryIngredientQuantity(json, servingSize);
							if (!addedIngredient) {
								displayErrorMsg($(this));
							} else {
								if (addedIngredient.servingSize === 'light') {
									$(this).find('.btn2').html('½');
									$(this).find('.btn2').show();
								} else if (addedIngredient.servingSize === 'regular') {
									$(this).find('.btn2').html('✓');
									$(this).find('.btn2').show();
								}
							}
						} else {
							userOrderCrepe.removeIngredient(json);
							$(this).find('.btn2').hide();
						}
						for (var i = 0; i < userOrderCrepe.ingredients.length; i++) {
							const ingredient = userOrderCrepe.ingredients[i];
							if (ingredient.category === 'protein') {
								if (ingredient.servingSize === 'light') {
									$(`#${ingredient.id}`).find('.btn2').html('½');
								} else if (userOrderCrepe.ingredients[i].servingSize === 'regular') {
									$(`#${ingredient.id}`).find('.btn2').html('✓');
								} else if (userOrderCrepe.ingredients[i].servingSize === 'extra') {
									$(`#${ingredient.id}`).find('.btn2').html('2x');
								}
							}
						}
					}
				});
			$('.btn')
				.unbind('click')
				.bind('click', function () {
					const json = JSON.parse($(this).closest('.card, .list-group-item').attr('data-ingredients'));

					if ($(this).html() === 'Customize') {
						// if they select the customize button for the first time
						//https://stackoverflow.com/questions/857245/is-there-a-jquery-unfocus-method
						$(this).blur();
						$(this).html('Extra');
						$(this).closest('.card, .list-group-item').find('.btn3').show();
						$(this).closest('.card, .list-group-item').find('.btn4').show();
					} else {
						const ingredientServingSize = 'extra';
						// if they select the customize button for the second time then they have selected the extra meat button
						// check if this ingredient is being modified
						const addedIngredient = userOrderCrepe.changeSavoryIngredientQuantity(
							json,
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
					const json = JSON.parse($(this).closest('.card, .list-group-item').attr('data-ingredients'));

					const ingredientServingSize = 'light';
					const addedIngredient = userOrderCrepe.changeSavoryIngredientQuantity(json, ingredientServingSize);
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
					const json = JSON.parse($(this).closest('.card, .list-group-item').attr('data-ingredients'));

					const ingredientServingSize = 'regular';
					const addedIngredient = userOrderCrepe.changeSavoryIngredientQuantity(json, ingredientServingSize);
					if (!addedIngredient) {
						displayErrorMsg($(this));
					} else {
						$(this).closest('.card, .list-group-item').find('.btn2').html('✓');
						$(this).closest('.card, .list-group-item').find('.btn2').show();
					}
				});
		})
		.on('mouseleave', function () {
			if ($(this).find('.card-body').attr('id') != 'cardBody') {
				const json = JSON.parse($(this).attr('data-ingredients'));

				$(this).find('img, h5, p').css('opacity', '1');

				$(this).find('.card-body').css('opacity', '1');
				$(this).find('.btn').html('Customize');
				if (!userOrderCrepe.findIngredient(json)) {
					$(this).find('.btn').hide();
					$(this).find('.btn3').hide();
					$(this).find('.btn4').hide();
				} else {
					$(this).find('.btn3').hide();
					$(this).find('.btn4').hide();
				}
			}
		});
};

// all this code changes display for smaller screen sizes
var cWidth = $(window).width();
$(window).on('load resize', function () {
	$('.card-img-top').each(function () {
		$(this).wrap('<div class="container2"></div>');
		$('<button class="btn" id="servingSize-2" type="button">Customize</button>').insertAfter($(this));
		$('<button class="btn4" id="servingSize-1" type="button">Regular</button>').insertAfter($(this));
		$('<button class="btn3" id="servingSize-0" type="button">Light</button>').insertAfter($(this));
		$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		this.src = '../static/images/vanilla_ice_cream.jpg';
	});

	$('#savoryCrepeCheckOut')
		.unbind('click')
		.bind('click', function () {
			checkOut(userOrderCrepe);
		});
	const newWidth = $(window).width();

	if (cWidth < newWidth) {
		cWidth = newWidth;
	}

	if ($(window).width() < 576) {
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

		const constCardData = new Array();
		for (var i = 0; i < cardData.length; i++) {
			const clone = cardData[i].cloneNode(true);
			console.log('clone', clone);

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
		// set this to one because the first card on the page is a decorative card without a value
		var counter = 1;
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
				const jsonData = constCardData[counter].getAttribute('data-ingredients');

				console.log('constCardData', constCardData);
				console.log('jsonData', jsonData);

				const data = JSON.parse(constCardData[counter].getAttribute('data-ingredients'));
				console.log('data', data);

				listValue.setAttribute('id', data.id);
				listValue.setAttribute('data-ingredients', jsonData);

				const string1 = String(constCardTitleValues[k]);
				const string2 = String(constCardTextValues[k]);
				const container = document.createElement('container');
				container.setAttribute('style', 'max-width:25%');
				container.setAttribute('class', 'container5');

				const listValueHeader = document.createElement('h2');
				listValueHeader.setAttribute('style', 'font-size: 110%');

				const listValueBodyText = document.createElement('p');
				listValueBodyText.setAttribute('style', 'font-size: 110%');

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

				gridContainer.appendChild(button);
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

				counter += 1;
			}

			row.appendChild(listGroupTitle);
			const x = document.getElementsByClassName('list-group');
			x[i].appendChild(row);
			
		}
		$('#savoryCrepeImg').closest('.row').find('.col').next().css('width:100%')
		$('#savoryCrepeImg').closest('.row').find('.col').first().remove();

	} else {
		$('.container0').each(function () {	
			$(this).addClass('container');
			$(this).removeClass('container0');
		});
		console.log('smoll')
		console.log("$('#savoryCrepeImg')", $('#savoryCrepeImg').attr('class'))	
	}
	pageLogic();
	modifyOrder();
	
});
// TODO: add sauteed onions & peppers, pesto, dill
var cWidth = $(window).width();
$(window).on('resize', function () {
	const newWidth = $(window).width();
	if (cWidth < newWidth) {
		cWidth = newWidth;
	}
	if ($(window).width() > 576) {
		location.reload();
	}
});
