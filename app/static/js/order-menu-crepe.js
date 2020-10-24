('use strict');
import { Order, OrderCrepe } from './model.js';

var editCrepeIndex = null;
var editOrder = null;
const menuCrepeDataArray = new Array();
const userOrderMenuCrepe = new OrderCrepe();

const stringify = (crepeOrder) => {
		if (editCrepeIndex === null) {
			const order = new Order();
			if (crepeOrder.menuCrepes.length) {
				if (localStorage.length > 0) {
					order.fromJSON(localStorage.getItem(localStorage.key(0)));
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
			if (crepeOrder.menuCrepes.length) {
				console.log('b4', editOrder.orderCrepe[editCrepeIndex]);
				editOrder.orderCrepe[editCrepeIndex] = crepeOrder
				console.log('after', editOrder.orderCrepe[editCrepeIndex]);
			localStorage.setItem('order', JSON.stringify(editOrder));
			}
			else {
				editOrder.orderCrepe.splice(editCrepeIndex, 1)
				localStorage.setItem('order', JSON.stringify(editOrder));
			}
		}
	return true;
};

const checkOut = (orderCrepe) => {
	orderCrepe._origination = 'menu';
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
		$('<button class="btn2" type="button">1</button>').insertAfter($(this));
		$(`<div class="grid-container"  style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
			$(this)
		);
		this.src = '../static/images/vanilla_ice_cream.jpg';
	});

	if ($('.edit').length) {
		editCrepeIndex = $('.edit').first().attr('id')
		console.log('editCrepeIndex', editCrepeIndex);

		editOrder = new Order();
		editOrder.fromJSON(localStorage.getItem(localStorage.key(0)));
		const editOrderCrepe = editOrder.orderCrepe[editCrepeIndex].menuCrepes;
		userOrderMenuCrepe.menuCrepes = editOrderCrepe
		console.log('editOrderCrepe', editOrderCrepe);
		for (var i = 0; i < editOrderCrepe.length; i++) {
			const crepe = editOrderCrepe[i];
			$(`#${crepe.id}`).closest('.card').find('.btn2').html(crepe.quantity);
			$(`#${crepe.id}`).closest('.card').find('.btn2').show();
			$(`#${crepe.id}`).closest('.card').find('.btn6').show();
			$(`#${crepe.id}`).closest('.card').find('.btn7').show();
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
		.on('mouseenter', '.card, .list-group', function () {
			if (
				$(this).find('.card-body').attr('id') != 'cardBody' &&
				$(this).closest('.card-deck').attr('id') != 'toppings'
			) {
				$(this).find('.card-body').css('opacity', '.3');
				$(this).find('.card-img-top').css('opacity', '.3');

				if ($(this).attr('class') === 'list-group') {
					$(document).on('mouseenter', '.list-group-item', function () {
						const selectedItemIndex = $(this).attr('id').split('-')[1];
						console.log('selectedItemIndex', selectedItemIndex);

						const selectedItemCategoryIndex = $(this).closest('.list-group').attr('id').split('-')[1];
						if (
							!userOrderMenuCrepe.findCrepe(
								selectedItemIndex,
								selectedItemCategoryIndex,
								menuCrepeDataArray
							)
						) {
							$(this).css('opacity', '.3');
						}
					});
				}
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
						console.log('selectedItemCategoryIndex', selectedItemCategoryIndex);

						const selectedCrepe = userOrderMenuCrepe.findCrepe(
							selectedItemIndex,
							selectedItemCategoryIndex,
							menuCrepeDataArray
						);
						console.log('selectedCrepe', selectedCrepe);

						// if you click the card and it hasn't been selected
						if (!selectedCrepe) {
							const addedMenuCrepe = userOrderMenuCrepe.changeCrepeQuantity(
								selectedItemIndex,
								selectedItemCategoryIndex,
								'increase',
								menuCrepeDataArray
							);
							$(this).closest('.card, .list-group-item').find('.btn2').html(addedMenuCrepe.quantity);
							$(this).closest('.card, .list-group-item').find('.btn2').show();
							//after clicking the card show the + and - buttons
							$(this).closest('.card, .list-group-item').find('.btn6').show();
							$(this).closest('.card, .list-group-item').find('.btn7').show();
							$(this).css('opacity', '1');
						}
					}
				});
			$('.btn6')
				.unbind('click')
				.bind('click', function (event) {
					const selectedItemIndex = $(this).closest('.card, .list-group-item').attr('id').split('-')[1];
					const selectedItemCategoryIndex = $(this)
						.closest('.card-deck, .list-group')
						.attr('id')
						.split('-')[1];
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
					console.log(
						'userOrderMenuCrepe.findCrepe(selectedItemIndex, selectedItemCategoryIndex, menuCrepeDataArray)',
						userOrderMenuCrepe.findCrepe(selectedItemIndex, selectedItemCategoryIndex, menuCrepeDataArray)
					);

					if (
						!userOrderMenuCrepe.findCrepe(selectedItemIndex, selectedItemCategoryIndex, menuCrepeDataArray)
					) {
						console.log('removed');
						console.log("$(this).closest('.card')", $(this).closest('.card, .list-group-item').attr('id'));

						$(this).closest('.card, .list-group-item').find('.btn2').hide();
						$(this).closest('.card, .list-group-item').find('.btn2').html(0);
						$(this).hide();
						$(this).closest('.card, .list-group-item').find('.btn7').hide();
					} else {
						console.log('nope');
						$(this).closest('.card, .list-group-item').find('.btn2').html(`${selectedCrepe.quantity}`);
						$(this).closest('.card, .list-group-item').find('.btn2').show();
					}
				});

			$('.btn7')
				.unbind('click')
				.bind('click', function (event) {
					console.log('btn7 clicked');
					event.stopPropagation();

					const selectedItemIndex = $(this).closest('.card, .list-group-item').attr('id').split('-')[1];
					const selectedItemCategoryIndex = $(this)
						.closest('.card-deck, .list-group')
						.attr('id')
						.split('-')[1];
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
					$(this).closest('.card, .list-group-item').find('.btn2').html(`${selectedCrepe.quantity}`);
					$(this).closest('.card, .list-group-item').find('.btn2').show();
				});
		})
		.on('mouseleave', '.card, .list-group-item', function () {
			console.log('$(this)', $(this));
			const selectedItemIndex = $(this).closest('.card, li').attr('id').split('-')[1];
			console.log('mouse leave selectedItemIndex', selectedItemIndex);

			const selectedItemCategoryIndex = $(this).closest('.card-deck, .list-group').attr('id').split('-')[1];
			console.log('mouse leave selectedItemCategoryIndex', selectedItemCategoryIndex);

			const selectedCrepe = userOrderMenuCrepe.findCrepe(
				selectedItemIndex,
				selectedItemCategoryIndex,
				menuCrepeDataArray
			);
			selectedCrepe;
			console.log('selectedCrepe mouseleave', selectedCrepe);

			// if you click the card and it hasn't been selected
			if (!selectedCrepe) {
				console.log('hey');
				$(this).find('.btn').hide();
				$(this).find('.btn3').hide();
				$(this).find('.btn4').hide();
			} else {
				$(this).find('.btn3').hide();
				$(this).find('.btn4').hide();
			}

			$(this).find('img').css('opacity', '1');
			$(this).find('.card-body').css('opacity', '1');
			if ($(this).closest('.list-group')) {
				$(this).css('opacity', '1');
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
			for (k; k < stoppingPoint; k++) {
				const listValue = document.createElement('li');
				listValue.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
				listValue.setAttribute('style', 'width:100%');

				if (constCardTextValues[k]) {
					const string1 = String(constCardTitleValues[k]);
					const string2 = String(constCardTextValues[k]);
					const container = document.createElement('container');
					container.setAttribute('style', 'width:30%');

					const listValueHeader = document.createElement('h5');
					const listValueBodyText = document.createElement('p');
					listValueBodyText.innerHTML = string2;
					listValueHeader.innerHTML = string1 + '<br>';
					container.appendChild(listValueHeader);
					container.appendChild(listValueBodyText);
					listValue.appendChild(container);
				} else {
					const listValueText = String(constCardTitleValues[k]);
					listValue.innerHTML = listValueText;
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
					'margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto; grid-gap: 2px; display:grid;'
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
