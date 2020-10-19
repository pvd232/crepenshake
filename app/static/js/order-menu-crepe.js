('use strict');
import { Order, OrderCrepe } from './model.js';

var editCrepeIndex = null;
var editCrepe = null;
const menuCrepeDataArray = new Array();
const userOrderMenuCrepe = new OrderCrepe();

const stringify = (crepeOrder) => {
	if (crepeOrder.ingredients.length || crepeOrder.menuCrepes.length) {
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

const checkOut = (orderCrepe) => {
	orderCrepe._origination = 'menu'
	if (editCrepeIndex != null) {
		stringify(orderCrepe);
		// $.when(stringify(orderCrepe)).then(location.assign('/order?userOrder=true'));
	} else {
		stringify(orderCrepe);
		// $.when(stringify(orderCrepe)).then(location.assign('/order/side'));
	}
};

const removeAllChildNodes = (parent) => {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
};

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

	//https://api.jquery.com/wrap/
	$('.card-img-top').wrap('<div class="container2"></div>');

	$('.card-img-top').each(function () {
		$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		$(`<div class="grid-container"  style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
			$(this)
		);
		this.src = '../static/images/vanilla_ice_cream.jpg';
	});

	if ($('.edit').length) {
		editCrepeIndex = $('.edit').first().attr('id');
		editCrepe = JSON.parse(localStorage.getItem(localStorage.key(0)))['orderCrepe'][editCrepeIndex];
		const crepeDict = editCrepe['crepes'];
		for (var crepeCategoryKey in crepeDict) {
			const crepeArray = crepeDict[crepeCategoryKey];
			for (var i = 0; i < crepeArray.length; i++) {
				const crepe = crepeArray[i];
				if ('name' in crepe) {
					// i add the word milkshake to each name for formatting so i have to remove it for the html element id to be recognized
					const crepeName = crepe['name'];
					const crepeQuantity = crepe['quantity'];
					const crepeServingSize = crepe['servingSize'];
					$(`#${crepeName}`).find('.btn2').css(`--${crepeCategoryKey}`, `${crepeName}`);
					$(`#${crepeName}`).find('.btn2').css(`--${crepeServingSize}`, 'true');
					$(`#${crepeName}`).find('.btn2').css(`--quantity`, `${crepeQuantity}`);
					$(`#${crepeName}`).find('.btn2').html(crepeQuantity);
					$(`#${crepeName}`).find('.btn2').show();
					$(`#${crepeName}`).find('.btn6').show();
					$(`#${crepeName}`).find('.btn7').show();
				}
			}
		}
	}
	//veggie + all other topping functionality
	const savoryMenuCrepes = $('#savoryMenuCrepes').data('savorymenucrepes');
	const sweetMenuCrepes = $('#sweetMenuCrepes').data('sweetmenucrepes');
	menuCrepeDataArray.push(savoryMenuCrepes);
	menuCrepeDataArray.push(sweetMenuCrepes);

	$('#menuCrepeCheckout')
		.unbind('click')
		.bind('click', function () {
			checkOut(userOrderMenuCrepe);
		});
	
	$(document)
		.on('mouseenter', '.card', function () {
			if (
				$(this).find('.card-body').attr('id') != 'cardBody' &&
				$(this).closest('.card-deck').attr('id') != 'toppings'
			) {
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
					const selectedCrepe = userOrderMenuCrepe.findCrepe(
						selectedItemIndex,
						selectedItemCategoryIndex,
						menuCrepeDataArray
					);
					// if you click the card and it hasn't been selected
					if (!selectedCrepe) {
						const addedMenuCrepe = userOrderMenuCrepe.changeCrepeQuantity(
							selectedItemIndex,
							selectedItemCategoryIndex,
							'increase',
							menuCrepeDataArray
						);
						$(this).closest('.card').find('.btn2').html(addedMenuCrepe.quantity);
						$(this).closest('.card').find('.btn2').show();
						//after clicking the card show the + and - buttons
						$(this).closest('.card').find('.btn6').show();
						$(this).closest('.card').find('.btn7').show();
					}
				});
		})
		.on('mouseleave', '.card', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			const selectedCrepe = userOrderMenuCrepe.findCrepe(
				selectedItemIndex,
				selectedItemCategoryIndex,
				menuCrepeDataArray
			);
			// if you click the card and it hasn't been selected
			if (!selectedCrepe) {
				$(this).find('.btn').hide();
				$(this).find('.btn3').hide();
				$(this).find('.btn4').hide();
			} else {
				$(this).find('.btn3').hide();
				$(this).find('.btn4').hide();
			}

			$(this).find('img').css('opacity', '1');
			$(this).find('.card-body').css('opacity', '1');
		});

	$('.btn6')
		.unbind('click')
		.bind('click', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			const selectedCrepe = userOrderMenuCrepe.findCrepe(
				selectedItemIndex,
				selectedItemCategoryIndex,
				menuCrepeDataArray
			);
			userOrderMenuCrepe.changeCrepeQuantity(
				selectedItemIndex,
				selectedItemCategoryIndex,
				'decrease',
				menuCrepeDataArray
			);
			if (!userOrderMenuCrepe.findCrepe(selectedItemIndex, selectedItemCategoryIndex, menuCrepeDataArray)) {
				$(this).closest('.card').find('.btn2').hide();
				$(this).closest('.card').find('.btn2').html(0);
				$(this).hide();
				$(this).closest('.card').find('.btn7').hide();
			} else {
				$(this).closest('.card').find('.btn2').html(`${selectedCrepe.quantity}`);
				$(this).closest('.card').find('.btn2').show();
			}
		});

	$('.btn7')
		.unbind('click')
		.bind('click', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			const selectedCrepe = userOrderMenuCrepe.findCrepe(
				selectedItemIndex,
				selectedItemCategoryIndex,
				menuCrepeDataArray
			);
			userOrderMenuCrepe.changeCrepeQuantity(
				selectedItemIndex,
				selectedItemCategoryIndex,
				'increase',
				menuCrepeDataArray
			);
			$(this).closest('.card').find('.btn2').html(`${selectedCrepe.quantity}`);
			$(this).closest('.card').find('.btn2').show();
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
