('use strict');
import { Order, OrderCrepe } from './model.js';

var editCrepeIndex = null;
var editCrepe = null;
var sweetnessIngredients;
var fruitIngredients;
var sweetIngredientCategories;
var ingredientServingSizes;
var ingredientCategoryDataArray;
var userOrderCrepe;

const stringify = (crepeOrder) => {
	console.log("crepeOrder: %s", JSON.stringify(crepeOrder))
	
	if (crepeOrder.ingredients.length) {
		if (editCrepeIndex === null) {
			const order = new Order();
			if (localStorage.length > 0) {
				// there will only ever be one item in local storage because a customer can only have 1 order in their shopping cart.
				order.fromJSON(localStorage.getItem(localStorage.key(0)));
				console.log("order: %s", JSON.stringify(order))
				console.log('crepeOrder: %s', JSON.stringify(crepeOrder));
				
				// only one crepe order will be processed on this page at a time
				const crepeOrderTotal = crepeOrder.orderTotal;
				console.log('crepeOrderTotal: %s', crepeOrderTotal);

				order.orderTotal += crepeOrderTotal;
				order.orderCrepe.push(crepeOrder);

				const stringifiedCrepeOrder = JSON.stringify(order);
				localStorage.setItem('order', stringifiedCrepeOrder);
			} else {
				console.log('order: %s', JSON.stringify(order));

				order.orderTotal += crepeOrder.orderTotal;
				
				order.orderCrepe.push(crepeOrder);
				const stringifiedCrepeOrder = JSON.stringify(order);
				localStorage.setItem('order', stringifiedCrepeOrder);
			}
		} else {
			console.log('nope');
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
	console.log("order: %s", JSON.stringify(order))
	
	
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

	sweetIngredientCategories = $('#sweetIngredientCategories').data('sweetingredientcategories');
	console.log('sweetIngredientCategories: %s', sweetIngredientCategories);

	sweetnessIngredients = $('#sweetnessIngredients').data('sweetnessingredients');
	console.log('sweetnessIngredients: %s', sweetnessIngredients);

	fruitIngredients = $('#fruitIngredients').data('fruitingredients');
	console.log('fruitIngredients: %s', fruitIngredients);

	ingredientServingSizes = $('#ingredientServingSizes').data('ingredientservingsizes');
	console.log('ingredientServingSizes: %s', ingredientServingSizes);
	ingredientCategoryDataArray = new Array();
	ingredientCategoryDataArray.push(fruitIngredients);
	ingredientCategoryDataArray.push(sweetnessIngredients);
	console.log('ingredientCategoryDataArray: %s', ingredientCategoryDataArray);

	$('.card-img-top').wrap('<div class="container2"></div>');
	$('#buildSweetCrepecheckout')
		.unbind('click')
		.bind('click', function () {
			checkOut(userOrderCrepe);
			console.log('checkout func');
		});
	
	$('.card-img-top').each(function () {
		$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		$(`<div class="grid-container"  style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
			$(this)
		);
	});

	if ($('.edit').length) {
		editCrepeIndex = $('.edit').first().attr('id');
		// const editCrepeArray = editCrepeParam.split('-');
		//have to subtract one because the crepe index on the shopping cart is 1 higher than the array index
		// editCrepeIndex = parseInt(editCrepeArray[editCrepeArray.length - 1]);
		editCrepe = JSON.parse(localStorage.getItem(localStorage.key(0)))['orderCrepe'][editCrepeIndex]['crepes'][0];
		console.log('editCrepe: %s', editCrepe);
		for (var key in editCrepe) {
			console.log('key: %s', key);
			console.log('editCrepe[key]', editCrepe[key]);
		}
		const crepeIngredients = editCrepe['ingredients'];
		console.log('crepeIngredients: %s', crepeIngredients);

		for (var key in crepeIngredients) {
			console.log('key: %s', key);
			console.log('crepeIngredients[key]', crepeIngredients[key]);
		}
		for (var ingredientCategoryKey in crepeIngredients) {
			console.log('ingredientCategoryKey: %s', ingredientCategoryKey);

			const ingredientArray = crepeIngredients[ingredientCategoryKey];
			console.log('ingredientArray: %s', ingredientArray);

			for (var i = 0; i < ingredientArray.length; i++) {
				const ingredient = ingredientArray[i];
				if ('name' in ingredient) {
					console.log('ingredient name: %s', ingredient['name']);
					const ingredientName = ingredient['name'];
					const ingredientQuantity = ingredient['quantity'];
					const ingredientServingSize = ingredient['servingSize'];
					$(`#${ingredientName}`).find('.btn2').css(`--${ingredientCategoryKey}`, `${ingredientName}`);
					$(`#${ingredientName}`).find('.btn2').css(`--quantity`, `${ingredientQuantity}`);
					$(`#${ingredientName}`).find('.btn2').html(ingredientQuantity);
					$(`#${ingredientName}`).find('.btn2').show();
					$(`#${ingredientName}`).find('.btn6').show();
					$(`#${ingredientName}`).find('.btn7').show();
					console.log('ingredientServingSize: %s', ingredientServingSize);
				}
			}
		}
	}

	$('.card-img-top').each(function () {
		this.src = '../static/images/vanilla_ice_cream.jpg';
		console.log('this.src: %s', this.src);
	});
	userOrderCrepe = new OrderCrepe();

	//veggie + all other topping functionality
	$(document)
		.on('mouseenter', '.card', function () {
			if ($(this).find('.card-body').attr('id') != 'cardBody') {
				$(this).find('.card-body').css('opacity', '.3');
				$(this).find('.card-img-top').css('opacity', '.3');
			}

			//click the card somewhere
			$(this)
				.find('.card-text, .card-title, .card-body, .card-img-top')
				.unbind('click')
				.bind('click', function () {
					const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
					console.log("selectedItemIndex: %s", selectedItemIndex)
					
					const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
					console.log("selectedItemCategoryIndex: %s", selectedItemCategoryIndex)
					
					// if you click the card and it hasn't been selected
						console.log('ingredientCategoryDataArray: %s', ingredientCategoryDataArray);
						const money = userOrderCrepe.checkIfThisIngredientSelected(							
							selectedItemIndex,
							selectedItemCategoryIndex,
							ingredientCategoryDataArray
					)
							console.log('money: %s', money);

					
					
					userOrderCrepe.checkIfThisIngredientSelected(selectedItemIndex, selectedItemCategoryIndex, ingredientCategoryDataArray)
					if (!userOrderCrepe.checkIfThisIngredientSelected(selectedItemIndex, selectedItemCategoryIndex, ingredientCategoryDataArray)) {
						
						const updatedIngredient = userOrderCrepe.changeIngredientQuantity(
							selectedItemIndex,
							selectedItemCategoryIndex,
							'increase',
							ingredientCategoryDataArray
						);
						console.log('quant: %s', updatedIngredient.quantity);

						$(this).closest('.card').find('.btn2').html(updatedIngredient.quantity);
						$(this).closest('.card').find('.btn2').show();
						//after clicking the card show the + and - buttons
						$(this).closest('.card').find('.btn6').show();
						$(this).closest('.card').find('.btn7').show();
					}
				});
		})
		.on('mouseleave', '.card', function () {
			$(this).find('img').css('opacity', '1');
			$(this).find('.card-body').css('opacity', '1');
		});

	$('.btn6')
		.unbind('click')
		.bind('click', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			const updatedIngredient = userOrderCrepe.changeIngredientQuantity(
				selectedItemIndex,
				selectedItemCategoryIndex, 	'decrease', ingredientCategoryDataArray,
			
			);
			if (updatedIngredient) {
				if (updatedIngredient.quantity <= 0) {
					$(this).closest('.card').find('.btn2').hide();
					$(this).closest('.card').find('.btn2').html(updatedIngredient.quantity);
					$(this).hide();
					$(this).closest('.card').find('.btn7').hide();
				} else {
					$(this).closest('.card').find('.btn2').html(updatedIngredient.quantity);
					$(this).closest('.card').find('.btn2').show();
				}
			}
		});

	$('.btn7')
		.unbind('click')
		.bind('click', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			const updatedIngredient = userOrderCrepe.changeIngredientQuantity(
				selectedItemIndex,
				selectedItemCategoryIndex, 'increase', ingredientCategoryDataArray,
				
			);
			console.log('updatedIngredient.quantity: %s', updatedIngredient.quantity);

			$(this).closest('.card').find('.btn2').html(updatedIngredient.quantity);
			$(this).closest('.card').find('.btn2').show();
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
	newWidth = $(window).width();
	if (cWidth < newWidth) {
		cWidth = newWidth;
	}
	if ($(window).width() > 767) {
		location.reload();
	}
});
