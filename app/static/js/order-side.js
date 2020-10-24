//https://stackoverflow.com/questions/15876302/uncaught-typeerror-cannot-read-property-clientwidth-of-null
//https://stackoverflow.com/questions/4381228/jquery-selector-inside-the-each-method
//https://stackoverflow.com/questions/4735342/jquery-to-loop-through-elements-with-the-same-class
('use strict');
import { Order, OrderSide } from './model.js';

var sideCategoryDataArray;
var sideNames;
var newSideNames = new Array();
var sideNames = new Array();
var croissants;
var iceCreamBowls;
var toppings;
var toppingServingSizes;
var userOrderSide = new OrderSide();
var editSideIndex = null;
var editOrder = null;

const displayErrorMsg = (element) => {
	const selector = `#${element.closest('.card').attr('id') + 'error'}`;
	const id = `${element.closest('.card').attr('id') + 'error'}`;
	if ($(selector).length) {
		$(selector).fadeIn('slow').delay(4000).fadeOut('slow'); //https://stackoverflow.com/questions/15686598/jquery-delay-before-fadeout
	} else {
		$(
			`<div class="alert-danger" role="alert" id="${id}" style="font-size: 20px; font-weight: 600; vertical-align: middle; text-align: center; padding: 5px; display: none; line-height: 40px; color:black; height: 100px; top: 0px; position: absolute;">Max of 3 Ice Cream Scoops.</div>`
		).insertAfter($(element).closest('.card').find('img'));
		$(selector).fadeIn('slow').delay(4000).fadeOut('slow');
	}
	return false;
};
const removeAllChildNodes = (parent) => {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
};

const stringify = (sideOrder) => {
	if (editSideIndex === null) {
		const order = new Order();
		if (sideOrder.orderSide.length) {
			if (localStorage.length > 0) {
				order.fromJSON(localStorage.getItem(localStorage.key(0)));
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
const checkOut = (order) => {
	if (editSideIndex != null) {
		stringify(order);
		// $.when(stringify(order)).then(location.assign('/order?userOrder=true'));
	} else {
		stringify(order);
		// $.when(stringify(order)).then(location.assign('/order/side'));
	}
};

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
	sideNames = $('#sideNames').data('sidenames');
	croissants = $('#sideCroissants').data('croissants');
	iceCreamBowls = $('#iceCreamBowls').data('icecreambowls');
	toppings = $('#sideToppings').data('sidetoppings');
	toppingServingSizes = $('#toppingServingSizes').data('toppingservingsizes');
	console.log('toppingServingSizes', toppingServingSizes);

	// i have to add the topping Cateogory so that the index of card decks will be correct
	newSideNames = [...sideNames];
	newSideNames.push({ side_name_id: 'topping' });
	sideCategoryDataArray = new Array();
	sideCategoryDataArray.push(croissants);
	sideCategoryDataArray.push(iceCreamBowls);
	sideCategoryDataArray.push(toppings);

	$('.card-img-top').wrap('<div class="container2"></div>');
	$('#cardDeck-2')
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
		const selectedItemCategoryIndex = $(this).closest('.card-deck, .list-group').attr('id').split('-')[1];
		const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;
		if (selectedItemCategory == 'ice_cream_bowl') {
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
			$(`<div class="grid-container"  style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
				$(this)
			);
		} else if (selectedItemCategory == 'croissant') {
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
			$(`<div class="grid-container" style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
				$(this)
			);
		} else if (selectedItemCategory == 'topping') {
			$('<button class="btn" id="servingSize-2" type="button">Customize</button>').insertAfter($(this));
			$('<button class="btn4" id="servingSize-1" type="button">Regular</button>').insertAfter($(this));
			$('<button class="btn3" id="servingSize-0" type="button">Light</button>').insertAfter($(this));
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		}
	});

	if ($('.edit').length) {
		editSideIndex = $('.edit').first().attr('id');
		console.log('editSideIndex', editSideIndex);

		editOrder = new Order();
		editOrder.fromJSON(localStorage.getItem(localStorage.key(0)));
		console.log('editOrder', editOrder);

		const editOrderSide = editOrder.orderSide[editSideIndex];
		console.log('editOrderSide', editOrderSide);
		console.log('userOrderSide', userOrderSide);

		userOrderSide = editOrderSide;
		console.log('userOrderSide', userOrderSide);

		for (var i = 0; i < editOrderSide.orderSide.length; i++) {
			const side = editOrderSide.orderSide[i];
			if (side.sideName === 'croissant') {
				$(`#${side.id}`).closest('.card').find('.btn2').html(side.quantity);
				$(`#${side.id}`).closest('.card').find('.btn2').show();
				$(`#${side.id}`).closest('.card').find('.btn6').show();
				$(`#${side.id}`).closest('.card').find('.btn7').show();
			} else if (side.sideName === 'ice_cream_bowl') {
				$(`#${side.flavor}`).closest('.card').find('.btn2').html(side.quantity);
				$(`#${side.flavor}`).closest('.card').find('.btn2').show();
				$(`#${side.flavor}`).closest('.card').find('.btn6').show();
				$(`#${side.flavor}`).closest('.card').find('.btn7').show();
				const toppings = side.toppings;
				if (toppings.length) {
					for (var j in toppings) {
						const topping = toppings[j];
						if (topping.servingSize === 'extra') {
							$(`#${topping.id}`).closest('.card').find('.btn2').html('2x');
						} else if (topping.servingSize === 'regular') {
							$(`#${topping.id}`).closest('.card').find('.btn2').html('✓');
						} else if (topping.servingSize === 'light') {
							$(`#${topping.id}`).closest('.card').find('.btn2').html('½');
						}
						$(`#${topping.id}`).closest('.card').find('.btn2').show();
						console.log('topping', topping);
					}
					$('#cardDeck-2')
						.find('.card, .list-group-item')
						.each(function () {
							$(this).css('opacity', '1');
						});
					$('#errorTopping').hide();
				}
			}
		}
	}

	$('.card-img-top').each(function () {
		this.src = '../static/images/vanilla_ice_cream.jpg';
	});

	$(document)
		.on('mouseenter', '.card, .list-group', function () {
			if ($(this).attr('class') === 'card') {
				const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
				const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;

				if (selectedItemCategory != 'topping') {
					$(this).find('.card-body').css('opacity', '.3');
					$(this).find('.card-img-top').css('opacity', '.3');
					$(this).find('img, h5, p').css('opacity', '.3');

					$(this).find('.btn').show();
				} else if (selectedItemCategory === 'topping' && userOrderSide.checkIfIceCreamSelected()) {
					$(this).find('.btn').show();
					$(this).find('.card-body').css('opacity', '.3');
					$(this).find('.card-img-top').css('opacity', '.3');
					$(this).find('img, h5, p').css('opacity', '.3');
				}
			} else if ($(this).attr('class') === 'list-group') {
				$(this)
					.find('.list-group-item')
					.unbind('mouseenter')
					.bind('mouseenter', function () {
						const selectedItemCategoryIndex = $(this).closest('.list-group').attr('id').split('-')[1];
						const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;
						if (selectedItemCategory != 'topping') {
							$(this).find('img, h5, p').css('opacity', '.3');
							$(this).find('.btn').show();
						} else if (selectedItemCategory === 'topping' && userOrderSide.checkIfIceCreamSelected()) {
							$(this).find('.btn').show();
							$(this).find('img, h5, p').css('opacity', '.3');
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
					const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;
					const senderElement = event.target;
					console.log('senderElement', senderElement);
					console.log('this', this);

					if (this === senderElement) {
						console.log('same');
						// logic for toppings is the most complex and should be evaluated last. de facto the non-topping cards are ice cream and croissant which have counters

						if (selectedItemCategory != 'topping') {
							// the side will be a croissant or ice cream bowl and it will only be added by clicking the card if it is not currently selected
							if (
								!userOrderSide.findSide(
									selectedItemIndex,
									selectedItemCategoryIndex,
									selectedItemCategory,
									sideCategoryDataArray
								)
							) {
								const updatedSide = userOrderSide.changeSideQuantity(
									selectedItemIndex,
									selectedItemCategoryIndex,
									'increase',
									selectedItemCategory,
									sideCategoryDataArray
								);

								if (updatedSide.quantity === 3 && updatedSide.sideName === 'ice_cream_bowl') {
									displayErrorMsg($(this));
								}
								$(this).closest('.card, .list-group-item').find('.btn2').html(updatedSide.quantity);
								$(this).closest('.card, .list-group-item').find('.btn2').show();
								//after clicking the card show the + and - buttons
								$(this).closest('.card, .list-group-item').find('.btn6').show();
								$(this).closest('.card, .list-group-item').find('.btn7').show();
							}
						}
						// if the selected card is a topping and if it has been selected
						else if (
							selectedItemCategory === 'topping' &&
							userOrderSide.checkIfThisToppingSelected(
								selectedItemIndex,
								selectedItemCategoryIndex,
								sideCategoryDataArray
							)
						) {
							userOrderSide.removeTopping(
								selectedItemIndex,
								selectedItemCategoryIndex,
								sideCategoryDataArray
							);
							$(this).closest('.card, .list-group-item').find('.btn2').hide();
						} else if (
							selectedItemCategory === 'topping' &&
							!userOrderSide.checkIfThisToppingSelected(
								selectedItemIndex,
								selectedItemCategoryIndex,
								sideCategoryDataArray
							)
						) {
							if (userOrderSide.checkIfIceCreamSelected()) {
								const toppingServingSize = 'regular';
								console.log('toppingServingSize', toppingServingSize);

								const newTopping = userOrderSide.addTopping(
									selectedItemIndex,
									selectedItemCategoryIndex,
									sideCategoryDataArray,
									toppingServingSize
								);

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
					const selectedItemIndex = $(this).closest('.card, li').attr('id').split('-')[1];
					const selectedItemCategoryIndex = $(this)
						.closest('.card-deck, .list-group')
						.attr('id')
						.split('-')[1];
					const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;
					console.log('btn clicked');
					console.log('$(this).html()', $(this).html());

					if (selectedItemCategory === 'topping') {
						if ($(this).html() === 'Customize') {
							$(this).blur();
							$(this).html('Extra');
							$(this).closest('.card, li').find('.btn3').show();
							$(this).closest('.card, li').find('.btn4').show();
						} else {
							const servingSizeIndex = $(this).attr('id').split('-')[1];
							const toppingServingSize = toppingServingSizes[servingSizeIndex].serving_size;
							userOrderSide.addTopping(
								selectedItemIndex,
								selectedItemCategoryIndex,
								sideCategoryDataArray,
								toppingServingSize
							);
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
					const selectedItemIndex = $(this).closest('.card, .list-group-item').attr('id').split('-')[1];
					const selectedItemCategoryIndex = $(this)
						.closest('.card-deck, .list-group')
						.attr('id')
						.split('-')[1];
					const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;
					if (selectedItemCategory == 'topping') {
						const servingSizeIndex = $(this).attr('id').split('-')[1];
						const toppingServingSize = toppingServingSizes[servingSizeIndex].serving_size;
						userOrderSide.addTopping(
							selectedItemIndex,
							selectedItemCategoryIndex,
							sideCategoryDataArray,
							toppingServingSize
						);
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
					const selectedItemIndex = $(this).closest('.card, .list-group-item').attr('id').split('-')[1];
					const selectedItemCategoryIndex = $(this)
						.closest('.card-deck, .list-group')
						.attr('id')
						.split('-')[1];
					const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;
					if (selectedItemCategory == 'topping') {
						const servingSizeIndex = $(this).attr('id').split('-')[1];
						const toppingServingSize = toppingServingSizes[servingSizeIndex].serving_size;
						userOrderSide.addTopping(
							selectedItemIndex,
							selectedItemCategoryIndex,
							sideCategoryDataArray,
							toppingServingSize
						);
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
					const selectedItemIndex = $(this).closest('.card, .list-group-item').attr('id').split('-')[1];
					const selectedItemCategoryIndex = $(this)
						.closest('.card-deck, .list-group')
						.attr('id')
						.split('-')[1];
					const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;
					userOrderSide.orderSide;
					console.log('userOrderSide.orderSide b4', userOrderSide.orderSide);

					const updatedSide = userOrderSide.changeSideQuantity(
						selectedItemIndex,
						selectedItemCategoryIndex,
						'decrease',
						selectedItemCategory,
						sideCategoryDataArray
					);
					console.log('userOrderSide.orderSide after', userOrderSide.orderSide);

					if (updatedSide === 0) {
						$(this).closest('.card, .list-group-item').find('.btn2').hide();
						$(this).closest('.card, .list-group-item').find('.btn2').html(0);
						$(this).hide();
						$(this).closest('.card, .list-group-item').find('.btn7').hide();
						if (userOrderSide.checkIfIceCreamSelected()) {
							$('#cardDeck-2')
								.find('.card, .list-group-item')
								.each(function () {
									$(this).css('opacity', '1');
								});
						} else {
							$('#cardDeck-2')
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
					const selectedItemIndex = $(this).closest('.card, .list-group-item').attr('id').split('-')[1];
					const selectedItemCategoryIndex = $(this)
						.closest('.card-deck, .list-group')
						.attr('id')
						.split('-')[1];
					const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;

					const updatedSide = userOrderSide.changeSideQuantity(
						selectedItemIndex,
						selectedItemCategoryIndex,
						'increase',
						selectedItemCategory,
						sideCategoryDataArray
					);
					if (updatedSide.quantity === 3 && updatedSide.sideName === 'ice_cream_bowl') {
						displayErrorMsg($(this));
					}
					console.log('updatedSide.quantity', updatedSide.quantity);

					$(this).closest('.card, .list-group-item').find('.btn2').html(updatedSide.quantity);

					$(this).closest('.card, .list-group-item').find('.btn2').show();
				});
		})
		.on('mouseleave', '.card, .list-group-item', function () {
			const selectedItemIndex = $(this).attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck, .list-group').attr('id').split('-')[1];
			const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;
			if (selectedItemCategory === 'topping') {
				if (
					!userOrderSide.checkIfThisToppingSelected(
						selectedItemIndex,
						selectedItemCategoryIndex,
						sideCategoryDataArray
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
			// all cards should go back to normal opacity when the mouse leaves them no matter what
			$(this).find('img').css('opacity', '1');
			$(this).find('.card-body').css('opacity', '1');
			$(this).find('img, h5, p').css('opacity', '1');
		});
});

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
					const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;

					if (selectedItemCategory === 'topping') {
						$(`<div class='container3'>
						<div class='grid-container' style='margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto; grid-gap: 2px; display:grid;'>
							<button class='btn' id='servingSize-2' style='display: none;'>Customize</button>
							<button class='btn2'>✓</button>
						</div>
					</div>`).insertAfter($(this).find('container'));
					} else if (selectedItemCategory === 'ice_cream_bowl' || selectedItemCategory === 'croissant') {
						$(
							`<div class="container4"><div class="grid-container" style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto; grid-gap: 2px; display:grid;"><button class="btn6">-</button><button class="btn2">1</button><button class="btn7">+</button></div></div>`
						).insertAfter($(this).find('container'));
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
