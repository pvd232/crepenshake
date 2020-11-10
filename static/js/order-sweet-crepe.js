('use strict');
import { Order, OrderCrepe, removeAllChildNodes, humanize } from './model.js';

var editCrepeIndex = null;
var editOrder = null;
var userOrderCrepe = new OrderCrepe();

const stringify = (crepeOrder) => {
	if (editCrepeIndex === null) {
		if (crepeOrder.ingredients.length) {
			const order = new Order();
			if (localStorage.length > 0) {
				// there will only ever be one item in local storage because a customer can only have 1 order in their shopping cart.
				order.fromJSON(localStorage.getItem('order'));
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
	userOrderCrepe.flavor = 'sweet';
	userOrderCrepe.origination = 'custom';
	if (editCrepeIndex != null) {
		// stringify(order);
		$.when(stringify(order)).then(location.assign('/order?userOrder=true'));
	} else {
		// stringify(order);
		$.when(stringify(order)).then(location.assign('/order/drink'));
	}
};

const modifyOrder = () => {
	if ($('.edit').length) {
		editCrepeIndex = $('.edit').first().attr('id');
		editOrder = new Order();
		editOrder.fromJSON(localStorage.getItem('order'));
		const editOrderCrepe = editOrder.orderCrepe[editCrepeIndex];
		userOrderCrepe = editOrderCrepe;
		console.log('editOrderCrepe', editOrderCrepe);

		const crepeIngredients = editOrderCrepe.ingredients;
		for (var i = 0; i < crepeIngredients.length; i++) {
			const ingredient = crepeIngredients[i];
			console.log('ingredient', ingredient);

			$(`#${ingredient.id}`).find('.btn2').html(ingredient.quantity);
			$(`#${ingredient.id}`).find('.btn2').show();
			$(`#${ingredient.id}`).find('.btn6').show();
			$(`#${ingredient.id}`).find('.btn7').show();
		}
	}
};

const pageLogic = () => {
	$('.card, .list-group-item')
		.on('mouseenter', function () {
			if (
				$(this).find('.card-body').attr('id') != 'cardBody' &&
				$(this).closest('.card-deck').attr('id') != 'toppings' &&
				$(this).attr('class') != 'list-group-item d-flex justify-content-between align-items-center'
			) {
				$(this).find('.card-body, .card-img-top, .card-text, .card-title, p, h2, img').css('opacity', '.3');
			}
			//click the card somewhere
			$(this)
				.unbind('click')
				.bind('click', function (event) {
					const senderElementClass = event.target.getAttribute('class');
					const senderElementType = event.target.tagName;

					console.log('senderElement', senderElementClass);

					if (
						senderElementClass === 'list-group-item d-flex justify-content-between align-items-center' ||
						senderElementClass === 'card-text' ||
						senderElementClass === 'card-title' ||
						senderElementClass === 'card-body' ||
						senderElementClass === 'card-img-top' ||
						senderElementClass === 'container4' ||
						senderElementType === 'P' ||
						senderElementType === 'IMG' ||
						senderElementType === 'H2'
					) {
						const json = JSON.parse($(this).attr('data-ingredients'));

						// if you click the card and it hasn't been selected
						if (!userOrderCrepe.findIngredient(json)) {
							const updatedIngredient = userOrderCrepe.changeIngredientQuantity(json, 'increase');
							$(this).find('.btn2').html(updatedIngredient.quantity);
							$(this).find('.btn2').show();
							//after clicking the card show the + and - buttons
							$(this).find('.btn6').show();
							$(this).find('.btn7').show();
						}
						$(this).css('opacity', '1');
					}
				});

			$('.btn6')
				.unbind('click')
				.bind('click', function () {
					const json = JSON.parse($(this).closest('.card, .list-group-item').attr('data-ingredients'));

					const updatedIngredient = userOrderCrepe.changeIngredientQuantity(json, 'decrease');
					if (updatedIngredient) {
						if (updatedIngredient.quantity <= 0) {
							$(this).closest('.card, .list-group-item').find('.btn2').hide();
							$(this).closest('.card, .list-group-item').find('.btn2').html(updatedIngredient.quantity);
							$(this).hide();
							$(this).closest('.card, .list-group-item').find('.btn7').hide();
						} else {
							$(this).closest('.card, .list-group-item').find('.btn2').html(updatedIngredient.quantity);
							$(this).closest('.card, .list-group-item').find('.btn2').show();
						}
					}
				});

			$('.btn7')
				.unbind('click')
				.bind('click', function () {
					const json = JSON.parse($(this).closest('.card, .list-group-item').attr('data-ingredients'));

					const updatedIngredient = userOrderCrepe.changeIngredientQuantity(json, 'increase');
					$(this).closest('.card, .list-group-item').find('.btn2').html(updatedIngredient.quantity);
					$(this).closest('.card, .list-group-item').find('.btn2').show();
				});
		})
		.on('mouseleave', function () {
			$(this).find('.card-body, .card-img-top, .card-text, .card-title').css('opacity', '1');
		});
};

var cWidth = $(window).width();
//https://stackoverflow.com/questions/1974788/combine-onload-and-onresize-jquery
$(window).on('load resize', function () {
	$('#buildSweetCrepecheckout')
		.unbind('click')
		.bind('click', function () {
			checkOut(userOrderCrepe);
		});

	$('.card-img-top').each(function () {
		$(this).wrap('<div class="container2"></div>');

		$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		$(`<div class="grid-container"  style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
			$(this)
		);
		this.src = '../static/images/vanilla_ice_cream.jpg';
	});
	$('.card-title, .head3').each(function () {
		$(this).html(humanize(null, null, $(this).html()));
	});
	$('.head3').each(function () {
		$(this).html($(this).html().toLowerCase());
	});
	const newWidth = $(window).width();

	if (cWidth < newWidth) {
		cWidth = newWidth;
	}
	console.log('cWidth', cWidth);

	if (cWidth <= 576) {
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
				const container4 = document.createElement('div');
				container4.setAttribute('class', 'container4');
				const button2 = document.createElement('button');
				button2.setAttribute('class', 'btn2');
				button2.innerHTML = '✓';

				const gridContainer = document.createElement('div');
				gridContainer.setAttribute('class', 'grid-container');
				gridContainer.setAttribute(
					'style',
					'grid-template-columns: 1fr 1fr 1fr; display:grid; grid-gap: 5px; justify-items: center;'
				);

				const button6 = document.createElement('button');
				button6.setAttribute('class', 'btn6');
				button6.innerHTML = '-';

				const button7 = document.createElement('button');
				button7.setAttribute('class', 'btn7');
				button7.innerHTML = '+';

				gridContainer.appendChild(button6);
				gridContainer.appendChild(button2);

				gridContainer.appendChild(button7);
				container4.appendChild(gridContainer);
				listValue.appendChild(container4);

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
			console.log('x', x);
			x[i].appendChild(row);
		}
		$('#sweetCrepeImg').closest('.row').find('.col').next().css('width:100%');
		$('#sweetCrepeImg').closest('.row').find('.col').first().remove();
		$('.btn6').each(function () {
			$(this).css('-webkit-appearance', 'none !important');
		});
		$('.btn7').each(function () {
			$(this).css('-webkit-appearance', 'none !important');
		});
	} else {
		$('.container0sweetCrepe').each(function () {
			$(this).addClass('container');
			$(this).removeClass('container0sweetCrepe');
		});
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
	if (cWidth > 576) {
		location.reload();
	}
});
