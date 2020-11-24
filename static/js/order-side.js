('use strict');
import { Order, OrderSide, humanize } from './model.js';

var userOrderSide = new OrderSide();
var editSideIndex = null;
var editOrder = null;

function displayErrorMsg (element) {
	const selector = `#${element.closest('.card, .list-group-item').attr('id') + 'error'}`;
	const id = `${element.closest('.card, .list-group-item').attr('id') + 'error'}`;
	if ($(selector).length) {
		$(selector).fadeIn('slow').delay(4000).fadeOut('slow');
	} else {
		$(
			`<div class="alert-danger" role="alert" id="${id}" style="font-size: 20px; font-weight: 600; vertical-align: middle; text-align: center; padding: 5px; display: none; line-height: 40px; color:black; height: 100px; top: 0px; position: absolute;">Max of 3 Ice Cream Scoops.</div>`
		).insertAfter($(element).closest('.card, .list-group-item').find('img'));
		$(selector).fadeIn('slow').delay(4000).fadeOut('slow');
	}
	return false;
};
function removeAllChildNodes (parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
};
function stringify (sideOrder) {
	if (editSideIndex === null) {
		const order = new Order();
		if (sideOrder.orderSide.length) {
			if (localStorage.getItem('order')) {
				order.fromJSON(localStorage.getItem('order'));
				const sideOrderTotal = sideOrder.orderTotal;
				order.orderTotal += sideOrderTotal;
				order.orderSide.push(sideOrder);

				const stringifiedSideOrder = JSON.stringify(order);
				localStorage.setItem('order', stringifiedSideOrder);
			} else {
				order.orderTotal += sideOrder.orderTotal;
				order.orderSide.push(sideOrder);
				const stringifiedSideOrder = JSON.stringify(order);
				localStorage.setItem('order', stringifiedSideOrder);
			}
		}
	} else {
		if (sideOrder.orderSide.length) {
			editOrder.orderSide[editSideIndex] = sideOrder;
			localStorage.setItem('order', JSON.stringify(editOrder));
		} else {
			editOrder.orderSide.splice(editSideIndex, 1);
			localStorage.setItem('order', JSON.stringify(editOrder));
		}
	}
	return true;
};
function checkOut (order) {
	if (editSideIndex != null) {
		$.when(stringify(order)).then(location.assign('/order?userOrder=true'));
	} else {
		$.when(stringify(order)).then(location.assign('/checkout'));
	}
};

function modifyOrder () {
	if ($('.edit').length) {
		editSideIndex = $('.edit').first().attr('id');
		editOrder = new Order();
		editOrder.fromJSON(localStorage.getItem('order'));
		const editOrderSide = editOrder.orderSide[editSideIndex];
		userOrderSide = editOrderSide;
		for (var i = 0; i < editOrderSide.orderSide.length; i++) {
			const side = editOrderSide.orderSide[i];
			if (side.sideName === 'ice_cream_bowl') {
				$(`#${side.flavor}`).closest('.card, .list-group-item').find('.btn2').html(side.quantity);
				$(`#${side.flavor}`).closest('.card, .list-group-item').find('.btn2').show();
				$(`#${side.flavor}`).closest('.card, .list-group-item').find('.btn6').show();
				$(`#${side.flavor}`).closest('.card, .list-group-item').find('.btn7').show();
				const toppings = side.toppings;
				if (toppings.length) {
					for (var j in toppings) {
						const topping = toppings[j];
						if (topping.servingSize === 'extra') {
							$(`#${topping.id}`).closest('.card, .list-group-item').find('.btn2').html('2x');
						} else if (topping.servingSize === 'regular') {
							$(`#${topping.id}`).closest('.card, .list-group-item').find('.btn2').html('✓');
						} else if (topping.servingSize === 'light') {
							$(`#${topping.id}`).closest('.card, .list-group-item').find('.btn2').html('½');
						}
						$(`#${topping.id}`).closest('.card, .list-group-item').find('.btn2').show();
					}
					$('#toppings')
						.find('.card, .list-group-item')
						.each(function () {
							$(this).css('opacity', '1');
						});
					$('#errorTopping').hide();
				}
			}
		}
	}
};
function pageLogic () {
	$('#toppings')
		.find('.card, .list-group-item')
		.each(function () {
			$(this).css('opacity', '.3');
		});

	$('#sideCheckout')
		.unbind('click')
		.bind('click', function () {
			checkOut(userOrderSide);
		});

	$('.card-img-top').each(function () {
		const selectedItemCategory = $(this).closest('.card-deck').attr('id');
		if (selectedItemCategory == 'ice_cream_bowl') {
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
			$(`<div class="grid-container"  style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
				$(this)
			);
		} else if (selectedItemCategory == 'toppings') {
			$('<button class="btn" id="servingSize-2" type="button">Customize</button>').insertAfter($(this));
			$('<button class="btn4" id="servingSize-1" type="button">Regular</button>').insertAfter($(this));
			$('<button class="btn3" id="servingSize-0" type="button">Light</button>').insertAfter($(this));
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		}
	});
	$('.card, .list-group')
		.on('mouseenter', function () {
			if ($(this).attr('class') === 'card') {
				const selectedItemCategory = $(this).closest('.card-deck').attr('id');

				if (selectedItemCategory != 'toppings') {
					$(this).find('.card-body').css('opacity', '.3');
					$(this).find('.card-img-top').css('opacity', '.3');
					$(this).find('.btn').show();
				} else if (selectedItemCategory === 'toppings' && userOrderSide.checkIfIceCreamSelected()) {
					$(this).find('.btn').show();
					$(this).find('.card-body').css('opacity', '.3');
					$(this).find('.card-img-top').css('opacity', '.3');
				}
			}
			//click the card somewhere
			$(this)
				.find('.card-text, .card-title, .card-body, .card-img-top, .list-group-item')
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
						senderElementClass === 'container4' ||
						senderElementType === 'CONTAINER' ||
						senderElementType === 'P' ||
						senderElementType === 'IMG' ||
						senderElementType === 'H2'
					) {
						const selectedItemCategory = $(this).closest('.card-deck, .list-group').attr('id');
						const json = JSON.parse($(this).closest('.card, li').attr('data-sides'));
						// logic for toppings is the most complex and should be evaluated last. de facto the non-topping cards are ice cream which have counters
						userOrderSide.checkIfThisToppingSelected(json);
						if (selectedItemCategory != 'toppings') {
							// the side will be an ice cream bowl and it will only be added by clicking the card if it is not currently selected
							if (!userOrderSide.findSide(json)) {
								const updatedSide = userOrderSide.changeSideQuantity(json, 'increase');

								if (updatedSide.quantity === 3 && updatedSide.sideName === 'ice_cream_bowl') {
									displayErrorMsg($(this));
								}
								$(this).closest('.card, .list-group-item').find('.btn2').html(updatedSide.quantity);
								$(this).closest('.card, .list-group-item').find('.btn2').show();
								//after clicking the card show the + and - buttons
								$(this).closest('.card, .list-group-item').find('.btn6').show();
								$(this).closest('.card, .list-group-item').find('.btn7').show();
								if (userOrderSide.checkIfIceCreamSelected()) {
									$('#toppings')
										.find('.card, .list-group-item')
										.each(function () {
											$(this).css('opacity', '1');
										});
								} else {
									$('#toppings')
										.find('.card, .list-group-item')
										.each(function () {
											$(this).css('opacity', '.3');
										});
								}
							}
						}
						// if the selected card is a topping and if it has been selected
						else if (
							selectedItemCategory === 'toppings' &&
							userOrderSide.checkIfThisToppingSelected(json)
						) {
							userOrderSide.removeTopping(json);
							$(this).closest('.card, .list-group-item').find('.btn2').hide();
							$(this).closest('.card, .list-group-item').find('.btn').hide();
						} else if (
							selectedItemCategory === 'toppings' &&
							!userOrderSide.checkIfThisToppingSelected(json)
						) {
							if (userOrderSide.checkIfIceCreamSelected()) {
								const toppingServingSize = 'regular';
								userOrderSide.addTopping(json, toppingServingSize);
								$(this).closest('.card, .list-group-item').find('.btn').show();
								$(this).closest('.card, .list-group-item').find('.btn2').html('✓');
								$(this).closest('.card, .list-group-item').find('.btn2').show();
							}
						}
					}
				});
			$('.btn')
				.unbind('click')
				.bind('click', function () {
					const json = JSON.parse($(this).closest('.card, .list-group-item').attr('data-sides'));
					const selectedItemCategory = $(this).closest('.card-deck, .list-group').attr('id');
					if (selectedItemCategory === 'toppings') {
						if ($(this).html() === 'Customize') {
							$(this).blur();
							$(this).html('Extra');
							$(this).closest('.card, .list-group-item').find('.btn3').show();
							$(this).closest('.card, .list-group-item').find('.btn4').show();
						} else {
							const toppingServingSize = 'extra';
							userOrderSide.addTopping(json, toppingServingSize);
							$(this).html('Customize');
							$(this).blur();
							$(this).closest('.card, .list-group-item').find('.btn2').html('2X');
							$(this).closest('.card, .list-group-item').find('.btn2').show();
							$(this).closest('.card, .list-group-item').find('.btn3').hide();
							$(this).closest('.card, .list-group-item').find('.btn4').hide();
						}
					}
				});

			$('.btn3')
				.unbind('click')
				.bind('click', function () {
					const json = JSON.parse($(this).closest('.card, li').attr('data-sides'));
					const selectedItemCategory = $(this).closest('.card-deck, .list-group').attr('id');
					if (selectedItemCategory == 'toppings') {
						const toppingServingSize = 'light';
						userOrderSide.addTopping(json, toppingServingSize);
						$(this).closest('.card, .list-group-item').find('.btn2').html('½');
						$(this).closest('.card, .list-group-item').find('.btn2').show();
						$(this).hide();
						$(this).closest('.card, .list-group-item').find('.btn3').hide();
						$(this).closest('.card, .list-group-item').find('.btn4').hide();
						$(this).closest('.card, .list-group-item').find('.btn').html('Customize');
					}
				});

			$('.btn4')
				.unbind('click')
				.bind('click', function () {
					const json = JSON.parse($(this).closest('.card, li').attr('data-sides'));
					const selectedItemCategory = $(this).closest('.card-deck, .list-group').attr('id');
					if (selectedItemCategory == 'toppings') {
						const toppingServingSize = 'regular';
						userOrderSide.addTopping(json, toppingServingSize);
						$(this).closest('.card, .list-group-item').find('.btn2').html('✓');
						$(this).closest('.card, .list-group-item').find('.btn2').show();
						$(this).hide();
						$(this).closest('.card, .list-group-item').find('.btn3').hide();
						$(this).closest('.card, .list-group-item').find('.btn4').hide();
						$(this).closest('.card, .list-group-item').find('.btn').html('Customize');
					}
				});

			$('.btn6')
				.unbind('click')
				.bind('click', function () {
					const json = JSON.parse($(this).closest('.card, li').attr('data-sides'));
					const updatedSide = userOrderSide.changeSideQuantity(json, 'decrease');
					if (updatedSide === 0) {
						$(this).closest('.card, .list-group-item').find('.btn2').hide();
						$(this).closest('.card, .list-group-item').find('.btn2').html(0);
						$(this).hide();
						$(this).closest('.card, .list-group-item').find('.btn7').hide();
						if (userOrderSide.checkIfIceCreamSelected()) {
							$('#toppings')
								.find('.card, .list-group-item')
								.each(function () {
									$(this).css('opacity', '1');
								});
						} else {
							$('#toppings')
								.find('.card, .list-group-item')
								.each(function () {
									$(this).css('opacity', '.3');
									$(this).find('.btn2').hide();
									$(this).find('.btn').hide();
								});
						}
					} else {
						$(this).closest('.card, .list-group-item').find('.btn2').html(updatedSide.quantity);
						$(this).closest('.card, .list-group-item').find('.btn2').show();
					}
				});

			$('.btn7')
				.unbind('click')
				.bind('click', function () {
					const json = JSON.parse($(this).closest('.card, li').attr('data-sides'));
					const updatedSide = userOrderSide.changeSideQuantity(json, 'increase');
					if (updatedSide.quantity === 3 && updatedSide.sideName === 'ice_cream_bowl') {
						displayErrorMsg($(this));
					}
					$(this).closest('.card, .list-group-item').find('.btn2').html(updatedSide.quantity);
					$(this).closest('.card, .list-group-item').find('.btn2').show();
				});
		})
		.on('mouseleave', function () {
			var json;
			var selectedItemCategory;
			if ($(this).attr('class') === 'card') {
				$(this).attr('data-sides');
				json = JSON.parse($(this).attr('data-sides'));
				selectedItemCategory = $(this).closest('.card-deck').attr('id');
			} else if ($(this).attr('class') === 'list-group') {
				json = JSON.parse($(this).find('.list-group-item').attr('data-sides'));
				selectedItemCategory = $(this).attr('id');
			}
			if (selectedItemCategory === 'toppings') {
				if (!userOrderSide.checkIfThisToppingSelected(json)) {
					$(this).find('.btn').hide();
					$(this).find('.btn3').hide();
					$(this).find('.btn4').hide();
				} else {
					$(this).find('.btn3').hide();
					$(this).find('.btn4').hide();
				}
			}
			// all cards should go back to normal opacity when the mouse leaves them no matter what
			$(this).find('img').css('opacity', '1');
			$(this).find('.card-body').css('opacity', '1');
		});
};
function pageBuild () {
	$('.card-img-top').wrap('<div class="container2"></div>');
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
			const jsonData = constCardData[counter].getAttribute('data-sides');
			const data = JSON.parse(constCardData[counter].getAttribute('data-sides'));
			if (data.id) {
				listValue.setAttribute('id', data.id);
			} else {
				listValue.setAttribute('id', data.flavor);
			}
			listValue.setAttribute('data-sides', jsonData);

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
		const selectedItemCategory = $(this).closest('.card-deck, .list-group').attr('id');
		if (selectedItemCategory === 'toppings') {
			$(`<div class='container3'>
					<div class='grid-container' style='margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto; grid-gap: 2px; display:grid;'>
						<button class='btn' id='servingSize-2' style='display: none;'>Customize</button>
						<button class='btn2'>✓</button>
					</div>
				</div>`).insertAfter($(this).find('container'));
		} else if (selectedItemCategory === 'ice_cream_bowl') {
			$(
				`<div class="container4"><div class="grid-container" style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto; grid-gap: 2px; display:grid;"><button class="btn6">-</button><button class="btn2">1</button><button class="btn7">+</button></div></div>`
			).insertAfter($(this).find('container'));
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
