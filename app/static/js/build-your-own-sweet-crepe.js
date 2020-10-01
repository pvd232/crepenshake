('use strict');
var editCrepeIndex = null;
var editCrepe = null;
var sweetnessIngredients;
var fruitIngredients;
var sweetIngredientCategories;
var ingredientServingSizes;
var ingredientCategoryDataArray = new Array();
var userOrderCrepe;

// Then, enter the following commands separately:
console.log($); // function jQuery(selector, context)
console.log('typeof $', typeof $); // "function

export class Ingredient {
	constructor(id = null, servingSize = null, price = 0, category = null, quantity = 1) {
		this.id = id;
		this.price = price;
		this.category = category;
		this.quantity = quantity;
	}
	get id() {
		return this._id;
	}
	get price() {
		return this._price;
	}
	get category() {
		return this._category;
	}
	get quantity() {
		return this._quantity;
	}
	set id(value) {
		this._id = value;
	}
	set price(value) {
		this._price = value;
	}
	set category(value) {
		this._category = value;
	}
	set quantity(value) {
		this._quantity = value;
	}
	initFromHTML = (index, selectedItemCategoryIndex) => {
		const newIngredient = ingredientCategoryDataArray[selectedItemCategoryIndex][index];
		const ingredientId = newIngredient.id;
		const ingredientPrice = newIngredient.price;
		const ingredientCategory = newIngredient.ingredient_category_id;

		this._id = ingredientId;
		this._price = ingredientPrice;
		this._category = ingredientCategory;
	};
	toJSON = () => {
		const data = {
			id: this._id,
			price: this._price,
			category: this._category,
			quantity: this._quantity,
		};
		return data;
	};
	fromJSON = (json) => {
		const data = JSON.parse(json);
		const ingredientId = data.id;
		const ingredientPrice = data.price;
		const ingredientCategory = data.category;
		const ingredientQuantity = data.quantity;
		return new Ingredient(data.id, data.price, data.category, data.quantity);
	};
	updateQuantity = (value) => {
		if (value === 'decrease') {
			if (this._quantity === 0) {
				return;
			} else {
				this._quantity -= 1;
			}
		} else if (value === 'increase') {
			this._quantity += 1;
		}
	};
}

export class Crepe {
	constructor(id = null, flavor = null, price = null, quantity = 1, origination = null, ingredients = new Array()) {
		this.id = id;
		this.flavor = flavor;
		this.price = price;
		this.quantity = quantity;
		this.origination = origination;
		this.ingredients = ingredients;
	}
	get id() {
		return this._id;
	}
	get flavor() {
		return this._flavor;
	}
	get price() {
		return this._price;
	}
	get quantity() {
		return this._quantity;
	}
	get origination() {
		return this._origination;
	}
	get ingredients() {
		return this._ingredients;
	}
	set id(value) {
		this._id = value;
	}
	set flavor(value) {
		this._flavor = value;
	}
	set price(value) {
		this._price = value;
	}
	set quantity(value) {
		this._quantity = value;
	}
	set origination(value) {
		this._origination = value;
	}
	set ingredients(value) {
		this._ingredients = value;
	}

	initFromHTML = (index, selectedItemCategoryIndex) => {
		const selectedItemCategory = newOriginations[selectedItemCategoryIndex].ingredient_category_id;
		const crepeId = crepes[index].id;
		const crepeFlavor = crepes[index].flavor;
		const crepePrice = crepes[index].price;
		const crepeOrigination = selectedItemCategory;

		this._id = crepeId;
		this._flavor = crepeFlavor;
		this._price = crepePrice;
		this._origination = crepeOrigination;
	};

	toJSON = () => {
		const data = {
			id: this._id,
			flavor: this._flavor,
			price: this._price,
			quantity: this._quantity,
			origination: this._origination,
			ingredients: this._ingredients,
		};
		return data;
	};
	fromJSON = (json) => {
		data = JSON.parse(json);
		const id = data.id;
		const flavor = data.flavor;
		const price = data.price;
		const quantity = data.quantity;
		const origination = data.origination;
		const ingredients = data.ingredients;
		return new Crepe(data.id, data.flavor, data.price, data.quantity, data.origination, data.ingredients);
	};
	checkIfThisIngredientSelected = (index, selectedItemCategoryIndex) => {
		const ingredient = ingredientCategoryDataArray[selectedItemCategoryIndex][index];
		if (this.ingredients.length) {
			for (var i = 0; i < this.ingredients.length; i++) {
				if (this.ingredients[i].id === ingredient.id) {
					return true;
				}
			}
		}
		return false;
	};
	findIngredient = (index, selectedItemCategoryIndex) => {
		const selectedIngredient = ingredientCategoryDataArray[selectedItemCategoryIndex][index];
		if (this.ingredients.length) {
			for (var i = 0; i < this.ingredients.length; i++) {
				if (this.ingredients[i].id === selectedIngredient.id) {
					console.log('this.ingredients[i].id: %s', this.ingredients[i].id);

					return this.ingredients[i];
				}
			}
		}
		return false;
	};
	addIngredient = (index, selectedItemCategoryIndex) => {
		const newIngredient = new Ingredient();
		newIngredient.initFromHTML(index, selectedItemCategoryIndex);
		this.ingredients.push(newIngredient);
		return newIngredient;
	};
	removeIngredient = (index, selectedItemCategoryIndex) => {
		const selectedIngredient = ingredientCategoryDataArray[selectedItemCategoryIndex][index];
		if (this.ingredients.length) {
			for (var i = 0; i < this.ingredients.length; i++) {
				if (this.ingredients[i].id === selectedIngredient.id) {
					this.ingredients.splice(i, 1);
					return true;
				}
			}
		}
		return false;
	};
	changeIngredientQuantity = (index, selectedItemCategoryIndex, value) => {
		const selectedIngredient = this.findIngredient(index, selectedItemCategoryIndex);
		if (!selectedIngredient) {
			const addedIngredient = this.addIngredient(index, selectedItemCategoryIndex);
			return addedIngredient;
		} else {
			selectedIngredient.updateQuantity(value);
			if (selectedIngredient.quantity === 0) {
				this.removeIngredient(index, selectedItemCategoryIndex);
			}
			return selectedIngredient;
		}
	};
}

export class Order {
	constructor(
		orderCrepe = new Crepe(),
		orderDrink = new Array(),
		orderSide = new Array(),
		orderTotal = 0,
		customerData = null
	) {
		this.orderCrepe = orderCrepe;
		this.orderDrink = orderDrink;
		this.orderSide = orderSide;
		this.orderTotal = orderTotal;
		this.customerData = customerData;
	}

	get orderCrepe() {
		return this._orderCrepe;
	}
	get orderDrink() {
		return this._orderDrink;
	}
	get orderSide() {
		return this._orderSide;
	}
	get orderTotal() {
		return this._orderTotal;
	}
	get customerData() {
		return this._customerData;
	}
	set orderCrepe(value) {
		this._orderCrepe = value;
	}
	set orderDrink(value) {
		this._orderDrink = value;
	}
	set orderSide(value) {
		this._orderSide = value;
	}
	set orderTotal(value) {
		this._orderTotal = value;
	}
	set customerData(value) {
		this._customerData = value;
	}
	toJSON = () => {
		const data = {
			orderCrepe: this._orderCrepe,
			orderDrink: this._orderDrink,
			orderSide: this._orderSide,
			orderTotal: this._orderTotal,
			customerData: this._customerData,
		};
		return data;
	};
	fromJSON = (json) => {
		const data = JSON.parse(json);
		return new Order(data.orderCrepe, data.orderDrink, data.orderSide, data.orderTotal, data.customerData);
	};
	checkIfProteinSelected = () => {
		return this.orderCrepe.checkIfProteinSelected();
	};
	checkIfThisIngredientSelected = (index, selectedItemCategoryIndex) => {
		return this.orderCrepe.checkIfThisIngredientSelected(index, selectedItemCategoryIndex);
	};
	findIngredient = () => {
		return this.orderCrepe.findIngredient();
	};
	addIngredient = () => {
		return this.orderCrepe.addIngredient();
	};
	removeIngredient = () => {
		return this.orderCrepe.removeIngredient();
	};
	changeIngredientQuantity = (index, selectedItemCategoryIndex, value) => {
		return this.orderCrepe.changeIngredientQuantity(index, selectedItemCategoryIndex, value);
	};
}

var file = location.href.split('/').pop();
if (file === 'make-your-own-sweet-crepe') {
	const stringify = (dataObject) => {
		// there will only ever be one item in local storage because a customer can only have 1 order in their shopping cart.
		// the object is a dictionary with a key called order and the value being an array which will hold each crepe as either a menu crepe object
		// or an orderCrepe array, the order props, a crepes array, and a crepes array
		console.log('dataObject', dataObject);
		//don't want to store an empty order
		if (dataObject.orderCrepe.length) {
			if (editCrepeIndex === null) {
				if (localStorage.length > 0) {
					const order = new Order();
					order.fromJSON(localStorage.getItem(localStorage.key(0)));
					console.log('order local stor > 0', order);
					if (order.orderCrepe.length) {
						const crepeOrderTotal = dataObject.orderTotal;
						console.log('crepeOrderTotal: %s', crepeOrderTotal);

						order.orderTotal += crepeOrderTotal;
						order.orderCrepe.push(dataObject.orderCrepe[0]);
						const stringifiedDataObject = JSON.stringify(order);
						console.log('stringifiedDataObject', stringifiedDataObject);
						localStorage.setItem('order', stringifiedDataObject);
					} else {
						const crepeOrderTotal = dataObject.orderTotal;
						console.log('crepeOrderTotal: %s', crepeOrderTotal);

						order.orderTotal += crepeOrderTotal;
						order.orderCrepe = [...dataObject.orderCrepe];
						const stringifiedDataObject = JSON.stringify(order);
						console.log('order', order);
						console.log('stringifiedDataObject', stringifiedDataObject);
						localStorage.setItem('order', stringifiedDataObject);
					}
				} else {
					const stringifiedDataObject = JSON.stringify(dataObject);
					console.log('stringifiedDataObject', stringifiedDataObject);
					localStorage.setItem('order', stringifiedDataObject);
					console.log('unstringified', JSON.parse(stringifiedDataObject));
				}
			} else {
				var currentOrder = JSON.parse(localStorage.getItem(localStorage.key(0)));
				var currentOrderCrepeList = currentOrder.orderCrepe;
				var currentOrderCrepe = currentOrderCrepeList[editCrepeIndex];
				Object.assign(currentOrderCrepe, dataObject);
				// if a previously had two proteins and then i remove one then i will have an empty object in my array that i don't want
				for (var i = 0; i < currentOrderCrepeList.length; i++) {
					if (currentOrderCrepeList[i] === {}) {
						currentOrderCrepeList.splice(i);
					}
				}
				localStorage.setItem('order', JSON.stringify(currentOrder));
			}

			for (i = 0; i < localStorage.length; i++) {
				var key = localStorage.key(i);
				console.log('key: %s', key);

				var value = localStorage[key];
				console.log('value: %s', value);
			}
		}
		const order = JSON.parse(localStorage.getItem('order'));
		console.log('order', order);
		return true;
	};

	const checkOut = () => {
		const order = new Order();
		order.orderCrepe = new Array();
		//the order object will have one key drinks, which has an array as its value which will store drink category objects which will have the key as the drink category they represent, and an array for the value which will store individual drink objects
		const orderCrepe = new Crepe();
		orderCrepe.flavor = 'sweet';
		orderCrepe.origination = 'custom';
		// orderCrepe['sweetIngredientCategories'] = new Array();
		for (var i = 0; i < sweetIngredientCategories.length; i++) {
			const sweetIngredientCategoryDict = {};
			const ingredientsForSweetIngredientCategoryArray = new Array();

			sweetIngredientCategoryDict['sweetIngredientCategory'] = sweetIngredientCategories[i].id;
			console.log('sweetIngredientCategories[i].id: %s', sweetIngredientCategories[i].id);

			sweetIngredientCategoryDict['ingredients'] = ingredientsForSweetIngredientCategoryArray;
			for (var j = 0; j < userOrderCrepe.orderCrepe.ingredients.length; j++) {
				if (userOrderCrepe.orderCrepe.ingredients[j].category === sweetIngredientCategories[i].id) {
					const ingredientQuantity = userOrderCrepe.orderCrepe.ingredients[j].quantity;
					const price = userOrderCrepe.orderCrepe.ingredients[j].price;
					const ingredientPrice = ingredientQuantity * price;
					order.orderTotal += ingredientPrice;
					sweetIngredientCategoryDict['ingredients'].push(userOrderCrepe.orderCrepe.ingredients[j]);
				}
			}
			orderCrepe.ingredients.push(sweetIngredientCategoryDict);
		}
		const strOrderCrepe = JSON.stringify(orderCrepe);
		console.log('strOrderCrepe: %s', strOrderCrepe);
		console.log('order.orderCrepe: %s', order.orderCrepe);

		order.orderCrepe.push(orderCrepe);
		const strOrder = JSON.stringify(order);
		console.log('strOrder: %s', strOrder);
		const unStrOrder = JSON.parse(strOrder);
		console.log('unStrOrder: %s', unStrOrder);

		if (editCrepeIndex != null) {
			stringify(order);
			// $.when(stringify(order)).then(location.assign('/order?userOrder=true'));
		} else {
			stringify(order);
			// $.when(stringify(order)).then(location.assign('/order/side'));
		}
	};
	// function getCSSToppingName(element) {
	// 	var toppingCategory = $(element).closest('.card-deck').attr('id');
	// 	var toppingName = $(element).closest('.card').find('.card-title').text().split(' ');
	// 	var formattedtoppingName = '';

	// 	if (toppingName.length > 1) {
	// 		const firstName = toppingName[0].toLowerCase();
	// 		formattedtoppingName += firstName;
	// 		for (var i = 1; i < toppingName.length; i++) {
	// 			const otherPartsOftoppingName = toppingName[i];
	// 			formattedtoppingName += otherPartsOftoppingName;
	// 		}
	// 		toppingName = formattedtoppingName;
	// 	} else {
	// 		toppingName = toppingName[0].toLowerCase();
	// 	}
	// 	var resultArray = [];
	// 	resultArray.push(toppingCategory);
	// 	resultArray.push(toppingName);
	// 	return resultArray;
	// }

	function removeAllChildNodes(parent) {
		while (parent.firstChild) {
			parent.removeChild(parent.firstChild);
		}
	}
	//format the document
	$(window).ready(function () {
		// $('.card').each(function () {
		// 	var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
		// 	var toppingName = toppingCategoryAndToppingNameArray[1];
		// 	this.id = toppingName;
		// 	$(this).css('--flavorProfile', $(this).closest('.card-deck').attr('id'));
		// });
		console.log('hey');
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

		ingredientCategoryDataArray.push(fruitIngredients);
		ingredientCategoryDataArray.push(sweetnessIngredients);
		console.log('ingredientCategoryDataArray: %s', ingredientCategoryDataArray);

		$('.card-img-top').wrap('<div class="container2"></div>');

		$('.card-img-top').each(function () {
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
			$(`<div class="grid-container"  style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
				$(this)
			);
		});

		// $('.btn2').each(function (i) {
		// 	this.id = 'btn' + i;
		// 	$(this).css('--quantity', 0);
		// 	// var crepeName = $(this).closest('.card').find('.card-title').text().split(' ').pop().toLowerCase();

		// 	var price = $(this).closest('.card').find('.card-text').text();
		// 	if (price.trim() != '') {
		// 		console.log('price', price);
		// 		price = price.replace('$', '');
		// 		// this is just for the almond milk which has extra in the price name
		// 		if (price.split(' ').length > 1) {
		// 			console.log('price', price);
		// 			$(this).css('--price', price.split(' ').shift());
		// 			console.log('price', price.split(' ').shift());
		// 		} else {
		// 			$(this).css('--price', price);
		// 		}
		// 	}
		// });

		if ($('.edit').length) {
			editCrepeIndex = $('.edit').first().attr('id');
			// const editCrepeArray = editCrepeParam.split('-');
			//have to subtract one because the crepe index on the shopping cart is 1 higher than the array index
			// editCrepeIndex = parseInt(editCrepeArray[editCrepeArray.length - 1]);
			editCrepe = JSON.parse(localStorage.getItem(localStorage.key(0)))['orderCrepe'][editCrepeIndex][
				'crepes'
			][0];
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
		// const x = document.getElementsByClassName('card-title');
		// const y = [];

		// for (i = 2; i < x.length; i++) {
		// 	y.push(x[i].innerHTML);
		// }
		userOrderCrepe = new Order();
		$('.card-img-top').each(function () {
			this.src = '../static/images/vanilla_ice_cream.jpg';
			console.log('this.src: %s', this.src);
		});

		$('#buildSweetCrepecheckout')
			.unbind('click')
			.bind('click', function () {
				checkOut();
				console.log('checkout func');
			});
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
						const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
						// if you click the card and it hasn't been selected
						if (
							!userOrderCrepe.checkIfThisIngredientSelected(selectedItemIndex, selectedItemCategoryIndex)
						) {
							const updatedIngredient = userOrderCrepe.changeIngredientQuantity(
								selectedItemIndex,
								selectedItemCategoryIndex
							);
							console.log('quant: %s', updatedIngredient.quantity);

							$(this).closest('.card').find('.btn2').html(updatedIngredient.quantity);
							$(this).closest('.card').find('.btn2').show();
							//after clicking the card show the + and - buttons
							$(this).closest('.card').find('.btn6').show();
							$(this).closest('.card').find('.btn7').show();
						}
						// if ($(this).closest('.card').find('.btn2').css(`--${toppingCategory}`) != toppingName) {
						// 	if (parseFloat($(this).closest('.card').find('.btn2').css('--quantity')) === 0) {
						// 		$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
						// 		$(this).closest('.card').find('.btn2').css('--quantity', 1);
						// 		console.log('price', $(this).closest('.card-text').val());

						// 		$(this).closest('.card').find('.btn2').html(1);
						// 		$(this).closest('.card').find('.btn2').show();

						// 		//after clicking the card show the + and - buttons
						// 		$(this).closest('.card').find('.btn6').show();
						// 		$(this).closest('.card').find('.btn7').show();
						// 	}
						// } else if ($(this).closest('.card').find('.btn2').css('--regular') === 'true') {
						// 	$(this).closest('.card').find('.btn2').css('--regular', 'false');
						// 	$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
						// 	$(this).closest('.card').find('.btn2').toggle();
						// 	$(this).closest('.card').find('.btn2').html('✓');
						// }
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
					selectedItemCategoryIndex,
					'decrease'
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
				// var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
				// var toppingCategory = toppingCategoryAndToppingNameArray[0];
				// var currentQuant = parseFloat($(this).closest('.card').find('.btn2').css('--quantity'));
				// console.log('currentQuant: %s', currentQuant);
				// currentQuant -= 1;
				// console.log('currentQuant: %s', currentQuant);

				// if (currentQuant === 0) {
				// 	$(this).closest('.card').find('.btn2').hide();
				// 	$(this).closest('.card').find('.btn2').html(`${currentQuant}`);
				// 	$(this).closest('.card').find('.btn2').css('--quantity', currentQuant);
				// 	$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
				// 	$(this).hide();
				// 	$(this).closest('.card').find('.btn7').hide();
				// } else {
				// 	$(this).closest('.card').find('.btn2').html(`${currentQuant}`);
				// 	$(this).closest('.card').find('.btn2').show();
				// 	$(this).closest('.card').find('.btn2').css('--quantity', currentQuant);
				// }
				// console.log('.btn quant value', $(this).closest('.card').find('.btn2').css('--quantity'));
			});

		$('.btn7')
			.unbind('click')
			.bind('click', function () {
				const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
				const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
				const updatedIngredient = userOrderCrepe.changeIngredientQuantity(
					selectedItemIndex,
					selectedItemCategoryIndex,
					'increase'
				);
				console.log('updatedIngredient.quantity: %s', updatedIngredient.quantity);

				$(this).closest('.card').find('.btn2').html(updatedIngredient.quantity);
				$(this).closest('.card').find('.btn2').show();
				// var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
				// var toppingCategory = toppingCategoryAndToppingNameArray[0];
				// var toppingName = toppingCategoryAndToppingNameArray[1];
				// var currentQuant = parseFloat($(this).closest('.card').find('.btn2').css('--quantity'));
				// currentQuant += 1;
				// $(this).closest('.card').find('.btn2').html(`${currentQuant}`);
				// $(this).closest('.card').find('.btn2').show();
				// $(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
				// $(this).closest('.card').find('.btn2').css('--quantity', currentQuant);
				// console.log('.btn quant value', $(this).closest('.card').find('.btn2').css('--quantity'));
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
					listValue.setAttribute(
						'class',
						'list-group-item d-flex justify-content-between align-items-center'
					);
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
}
