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
var userOrderSide;
var editSideIndex = null;

const stringify = (sideOrder) => {
	if (sideOrder.orderSide.length) {
		if (editSideIndex === null) {
			const order = new Order();
			if (localStorage.length > 0) {
				// there will only ever be one item in local storage because a customer can only have 1 order in their shopping cart.
				order.fromJSON(localStorage.getItem(localStorage.key(0)));
				// only one side order will be processed on this page at a time
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
		} else {
			var currentOrder = JSON.parse(localStorage.getItem(localStorage.key(0)));
			var currentOrderSideList = currentOrder.orderSide;
			var currentOrderSide = currentOrderSideList[editSideIndex];
			const sideOrderTotal = sideOrder.orderSide.orderTotal;
			currentOrder.orderTotal += sideOrderTotal;
			Object.assign(currentOrderSide, sideOrder.orderSide);

			// if a previously had two proteins and then i remove one then i will have an empty object in my array that i don't want
			for (var i = 0; i < currentOrderSideList.length; i++) {
				if (currentOrderSideList[i] === {}) {
					currentOrderSideList.splice(i);
				}
			}
			localStorage.setItem('order', JSON.stringify(currentOrder));
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

	// i have to add the topping Cateogory so that the index of card decks will be correct
	newSideNames = [...sideNames];
	newSideNames.push({ side_name_id: 'topping' });
	sideCategoryDataArray = new Array();
	sideCategoryDataArray.push(croissants);
	sideCategoryDataArray.push(iceCreamBowls);
	sideCategoryDataArray.push(toppings);
	
	$('.card-img-top').wrap('<div class="container2"></div>');
	$('#cardDeck-2')
		.find('.card')
		.each(function () {
			$(this).css('opacity', '.3');
		});

	$('#sideCheckout')
		.unbind('click')
		.bind('click', function () {
			checkOut(userOrderSide);
		});

	$('.card-img-top').each(function () {
		const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
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
		const editSideParam = $('.edit').first().attr('id');
		const editSideArray = editSideParam.split('-');
		//have to subtract one because the side index on the shopping cart is 1 higher than the array index
		editSideIndex = editSideArray[editSideArray.length - 1];
		editSide = JSON.parse(localStorage.getItem(localStorage.key(0)))['orderSide'][editSideIndex];
		const sideDict = editSide['sides'];
		for (var sideCategoryKey in sideDict) {
			const sideArray = sideDict[sideCategoryKey];
			if (sideCategoryKey === 'ice_cream_bowl') {
				for (var i = 0; i < sideArray.length; i++) {
					const side = sideArray[i];
					if ('name' in side) {
						const sideName = side['name'];
						const sideServingSize = side['servingSize'];
						const sideQuantity = side['quantity'];
						$(`#${sideName}`).find('.btn2').css(`--${sideCategoryKey}`, `${sideName}`);
						$(`#${sideName}`).find('.btn2').css(`--quantity`, `${sideQuantity}`);
						$(`#${sideName}`).find('.btn2').css(`--${sideServingSize}`, 'true');
						$(`#${sideName}`).find('.btn2').html(`${sideQuantity}`);
						$(`#${sideName}`).find('.btn2').show();
						$(`#${sideName}`).find('.btn6').show();
						$(`#${sideName}`).find('.btn7').show();

						if ('toppings' in side) {
							const toppingsArray = side['toppings'];
							for (var i = 0; i < toppingsArray.length; i++) {
								const topping = toppingsArray[i];
								const toppingName = topping['name'];
								const toppingServingSize = topping['servingSize'];
								$(`#${toppingName}`).find('.btn2').css(`--${sideCategoryKey}`, `${sideName}`);
								$(`#${toppingName}`).find('.btn2').css(`--${sideServingSize}`, 'true');
								$(`#${toppingName}`).find('.btn2').show();
								$(`#${toppingName}`).find('.btn').show();
								$(`#${sideName}`).closest('.card').css('opacity', '1');
								$('#errorTopping').hide();
								if (toppingServingSize === 'extra') {
									$(`#${toppingName}`).find('.btn2').html('2x');
									$(`#${toppingName}`).find('.btn2').show();
									$(`#${toppingName}`).find('.btn').show();
									$(`#${toppingName}`).find('.btn2').css('--extra', 'true');
								} else if (toppingServingSize === 'regular') {
									$(`#${toppingName}`).find('.btn2').html('✓');
									$(`#${toppingName}`).find('.btn2').show();
									$(`#${toppingName}`).find('.btn').show();
									$(`#${toppingName}`).find('.btn2').css('--regular', 'true');
								} else if (toppingServingSize === 'half') {
									$(`#${toppingName}`).find('.btn2').html('½');
									$(`#${toppingName}`).find('.btn2').show();
									$(`#${toppingName}`).find('.btn').show();
									$(`#${toppingName}`).find('.btn2').css('--half', 'true');
								}
							}
							$('##cardDeck-2')
								.find('.card')
								.each(function () {
									$(this).css('opacity', '1');
								});
						}
					}
				}
			} else {
				for (var i = 0; i < sideArray.length; i++) {
					const side = sideArray[i];
					if ('name' in side) {
						// i add the word milkshake to each name for formatting so i have to remove it for the html element id to be recognized
						const sideName = side['name'];
						const sideQuantity = side['quantity'];
						const sideServingSize = side['servingSize'];
						$(`#${sideName}`).find('.btn2').css(`--${sideCategoryKey}`, `${sideName}`);
						$(`#${sideName}`).find('.btn2').css(`--${sideServingSize}`, 'true');
						$(`#${sideName}`).find('.btn2').css(`--quantity`, `${sideQuantity}`);
						$(`#${sideName}`).find('.btn2').html(sideQuantity);
						$(`#${sideName}`).find('.btn2').show();
						$(`#${sideName}`).find('.btn6').show();
						$(`#${sideName}`).find('.btn7').show();
					}
				}
			}
		}
	}

	$('.card-img-top').each(function () {
		this.src = '../static/images/vanilla_ice_cream.jpg';
	});

	userOrderSide = new OrderSide();
	$(document)
		.on('mouseenter', '.card', function () {
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;

			if ($(this).find('.card-body').attr('id') != 'cardBody' && selectedItemCategory != 'topping') {
				$(this).find('.card-body').css('opacity', '.3');
				$(this).find('.card-img-top').css('opacity', '.3');
				$(this).find('.btn').show();
			} else if (selectedItemCategory === 'topping' && userOrderSide.checkIfIceCreamSelected()) {
				$(this).find('.btn').show();
				$(this).find('.card-body').css('opacity', '.3');
				$(this).find('.card-img-top').css('opacity', '.3');
			}
			//click the card somewhere
			$(this)
				.find('.card-text, .card-title, .card-body, .card-img-top')
				.unbind('click')
				.bind('click', function () {
					const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
					const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
					const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;
					// logic for toppings is the most complex and should be evaluated last. de facto the non-topping cards are ice cream and croissant which have counters

					if (selectedItemCategory != 'topping') {
						// the side will be a croissant or ice cream bowl and it will only be added by clicking the card if it is not currently selected
						if (
							!userOrderSide.findSide(selectedItemIndex, selectedItemCategoryIndex, selectedItemCategory, sideCategoryDataArray)
						) {
							const updatedSide = userOrderSide.changeSideQuantity(
								selectedItemIndex,
								selectedItemCategoryIndex,
								'increase',
								selectedItemCategory, sideCategoryDataArray
							);
							$(this).closest('.card').find('.btn2').html(updatedSide.quantity);							
							$(this).closest('.card').find('.btn2').show();
							//after clicking the card show the + and - buttons
							$(this).closest('.card').find('.btn6').show();
							$(this).closest('.card').find('.btn7').show();
						}
					}
					// if the selected card is a topping and if it has been selected
					else if (
						selectedItemCategory === 'topping' &&
						userOrderSide.checkIfThisToppingSelected(
							selectedItemIndex,
							selectedItemCategoryIndex,
							selectedItemCategory,
							sideCategoryDataArray
						)
					) {
						userOrderSide.removeTopping(
							selectedItemIndex,
							selectedItemCategoryIndex,
							sideCategoryDataArray
						);
						$(this).closest('.card').find('.btn2').hide();
					} else if (
						selectedItemCategory === 'topping' &&
						!userOrderSide.checkIfThisToppingSelected(
							selectedItemIndex,
							selectedItemCategoryIndex,
							selectedItemCategory,
							sideCategoryDataArray
						)
					) {
						if (userOrderSide.checkIfIceCreamSelected()) {
							const servingSizeIndex = $(this).closest('.card').find('.btn').attr('id').split('-')[1];
							const toppingServingSize = toppingServingSizes[servingSizeIndex].serving_size;
							const newTopping = userOrderSide.addTopping(
								selectedItemIndex,
								selectedItemCategoryIndex,
								sideCategoryDataArray,
								toppingServingSize
							);

							$(this).closest('.card').find('.btn').show();
							$(this).closest('.card').find('.btn2').html('✓');
							$(this).closest('.card').find('.btn2').show();
						}
					}
				});
		})
		.on('mouseleave', '.card', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;
			if (selectedItemCategory === 'topping') {
				if (
					!userOrderSide.checkIfThisToppingSelected(
						selectedItemIndex,
						selectedItemCategoryIndex,
						selectedItemCategory,
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
		});
	$('.btn')
		.unbind('click')
		.bind('click', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;
			if (selectedItemCategory == 'topping') {
				if ($(this).html() == 'Customize') {
					$(this).blur();
					$(this).html('Extra');
					$(this).closest('.card').find('.btn3').show();
					$(this).closest('.card').find('.btn4').show();
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
					$(this).closest('.card').find('.btn2').html('2X');
					$(this).closest('.card').find('.btn2').show();
					$(this).closest('.card').find('.btn3').hide();
					$(this).closest('.card').find('.btn4').hide();
				}
			}
		});

	$('.btn3')
		.unbind('click')
		.bind('click', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
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
				$(this).closest('.card').find('.btn2').html('½');
				$(this).closest('.card').find('.btn2').show();
				$(this).hide();
				$(this).closest('.card').find('.btn3').hide();
				$(this).closest('.card').find('.btn4').hide();
				$(this).closest('.card').find('.btn').html('Customize');
			}
		});

	$('.btn4')
		.unbind('click')
		.bind('click', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
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
				$(this).closest('.card').find('.btn2').html('✓');
				$(this).closest('.card').find('.btn2').show();
				$(this).hide();
				$(this).closest('.card').find('.btn3').hide();
				$(this).closest('.card').find('.btn4').hide();
				$(this).closest('.card').find('.btn').html('Customize');
			}
		});

	$('.btn6')
		.unbind('click')
		.bind('click', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;

			const updatedSide = userOrderSide.changeSideQuantity(				
				selectedItemIndex,
				selectedItemCategoryIndex,
				'decrease',
				selectedItemCategory,
				sideCategoryDataArray
			);
			if (updatedSide === 0) {
				$(this).closest('.card').find('.btn2').hide();
				$(this).closest('.card').find('.btn2').html(0);
				$(this).hide();
				$(this).closest('.card').find('.btn7').hide();
				if (userOrderSide.checkIfIceCreamSelected()) {
					$('#cardDeck-2')
						.find('.card')
						.each(function () {
							$(this).css('opacity', '1');
						});
				} else {
					$('#cardDeck-2')
						.find('.card')
						.each(function () {
							$(this).css('opacity', '.3');
							$(this).find('.btn2').hide();
							$(this).find('.btn').hide();
						});
				}
			}
			else {
					$(this).closest('.card').find('.btn2').html(updatedSide.quantity);
					$(this).closest('.card').find('.btn2').show();
				}
			
		});

	$('.btn7')
		.unbind('click')
		.bind('click', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;

			const updatedSide = userOrderSide.changeSideQuantity(
				selectedItemIndex,
				selectedItemCategoryIndex,
				'increase',
				selectedItemCategory, sideCategoryDataArray
			);
			$(this).closest('.card').find('.btn2').html(updatedSide.quantity);
			$(this).closest('.card').find('.btn2').show();
		});
});

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
