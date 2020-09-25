//https://stackoverflow.com/questions/15876302/uncaught-typeerror-cannot-read-property-clientwidth-of-null
//https://stackoverflow.com/questions/4381228/jquery-selector-inside-the-each-method
//https://stackoverflow.com/questions/4735342/jquery-to-loop-through-elements-with-the-same-class

var coffeeBool = false;
var milkBool = false;
var tempBool = false;
var editDrinkIndex = undefined;
var editDrink = undefined;
var drinkCategoryDataArray;
var coffeeDrinks;
var milkDrinks;
var coffeeSyrups;
var milkshakes;
var nonCoffeeDrinks;
var bottledDrinks;
var drinkCategories;
var temperatures;
// var dripBool = false;
// var latteBool = false;

class Drink {
	constructor(name = undefined, price = undefined, quantity = 0, drinkCategory = undefined) {
		this.name = name;
		this.price = price;
		this.quantity = quantity;
		this.drinkCategory = drinkCategory;
		this.makeSound = () => console.log(`The ${this.name} named ${this.price} goes ${this.quantity}!`);
	}
	set name(value) {
		this._name = value;
	}
	set price(value) {
		this._price = value;
	}
	set quantity(value) {
		this._quantity = value
	}
	set drinkCategory(value) {
		this._drinkCategory = value;
	}
	get name() {
		return this._name;
	}
	get price() {
		return this._price;
	}
	get quantity() {
		return this._quantity;
	}
	get drinkCategory() {
		return this._drinkCategory;
	}
	initFromHTML = (index, selectedItemCategoryIndex) => {
		console.log('selectedItemCategoryIndex: %s', selectedItemCategoryIndex);

		console.log('index: %s', index);

		const newDrink = drinkCategoryDataArray[selectedItemCategoryIndex][index];
		console.log('drinkCategoryDataArray: %s', drinkCategoryDataArray);
		for (var i = 0; i < drinkCategoryDataArray.length; i++) {
			console.log(drinkCategoryDataArray[i]);
		}
		console.log('newDrink: %s', newDrink);

		const drinkName = newDrink.name;
		console.log('drinkName: %s', drinkName);

		const drinkPrice = newDrink.price;
		console.log('drinkPrice: %s', drinkPrice);

		this._name = drinkName;
		this._price = drinkPrice;
	};
	updateDrinkQuantity = (value) => {
		if (value === 'decrease') {
			if (this._quantity === 0){ 
				return
			}
			else {
			this._quantity -= 1;

			}
		} else if (value === 'increase') {
			this._quantity += 1;
		}
	};
}

class Coffee {
	constructor(
		id = undefined,
		name = undefined,
		servingSize = undefined,
		temperature = undefined,
		flavorSyrup = undefined,
		flavorServingSize = undefined,
		espressoServingSize = undefined,
		milkType = undefined,
		milkPrice = 0,
		price = undefined,
		drinkCategory = undefined
	) {
		this.id = id;
		this.name = name;
		this.servingSize = servingSize;
		this.temperature = temperature;
		this.flavorSyrup = flavorSyrup;
		this.flavorServingSize = flavorServingSize;
		this.espressoServingSize = espressoServingSize;
		this.milkType = milkType;
		this.milkPrice = milkPrice;
		this.price = price;
		this.drinkCategory = drinkCategory;
		this.makeSound = () => console.log(`The ${this.name} named ${this.price} goes ${this.temperature}!`);
	}

	set name(value) {
		this._name = value;
	}
	set servingSize(value) {
		this._servingSize = value;
	}
	set temperature(value) {
		this._temperature = value;
	}
	set flavorSyrup(value) {
		this._flavorSyrup = value;
	}
	set flavorServingSize(value) {
		this._flavorServingSize = value;
	}
	set espressoServingSize(value) {
		this._espressoServingSize = value;
	}
	set milkType(value) {
		this._milkType = value;
	}
	set price(value) {
		this._price = value;
	}
	set drinkCategory(value) {
		this._drinkCategory = value;
	}
	get name() {
		return this._name;
	}
	get servingSize() {
		return this._servingSize;
	}
	get temperature() {
		return this._temperature;
	}
	get flavorSyrup() {
		return this._flavorSyrup;
	}
	get flavorServingSize() {
		return this._flavorServingSize;
	}
	get espressoServingSize() {
		return this._espressoServingSize;
	}
	get milkType() {
		return this._milkType;
	}
	get price() {
		return this._price;
	}
	get drinkCategory() {
		return this._drinkCategory;
	}
	initFromHTML = (index, servingSize) => {
		const coffeeName = coffeeDrinks[index].name;
		const coffeePrice = coffeeDrinks[index].price;
		// UUID will be generated in the backend
		this._name = coffeeName;
		this._price = coffeePrice;
		this._servingSize = servingSize;
	};
}

class Order {
	constructor(orderCrepe = new Array(), orderDrink = new Array(), orderSide = new Array()) {
		this.orderCrepe = orderCrepe;
		this.orderDrink = orderDrink;
		this.orderSide = orderSide;
	}

	// addCrepe = (crepe) => {
	// 	this.orderCrepe.push(crepe);
	// };
	// addDrink = (drink) => {
	// 	this.orderDrink.push(drink);
	// };
	// addSide = (side) => {
	// 	this.orderSide.push(side);
	// };
	checkIfCoffeeSelected = () => {
		for (var i = 0; i < this.orderDrink.length; i++) {
						console.log('this.orderDrink.length: %s', this.orderDrink.length);

						console.log('this.orderDrink: %s', this.orderDrink);

						console.log('orderDrink[i]', this.orderDrink[0]);

						console.log('orderDrink[i]', this.orderDrink[i]);
			// const drink = this.orderDrink[i];
			// console.log("drink: %s", drink)
			
			if (this.orderDrink[i] === 'coffee') {
				return true;
			}
		}
		return false;
	};
	checkIfTempSelected = () => {
		for (var i = 0; i < this.orderDrink.length; i++) {
		 
			if (this.orderDrink[i].drinkCategory === 'coffee') {
				if (this.orderDrink[i].temperature) {
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	};
	checkIfThisTempSelected = (index) => {
		const temp = temperatures[index];
		for (var i = 0; i < this.orderDrink.length; i++) {
			if (this.orderDrink[i].drinkCategory === 'coffee') {
				if (this.orderDrink[i].temperature === temp) {
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	};
	checkIfMilkSelected = () => {
		for (var i = 0; i < this.orderDrink.length; i++) {
			if (this.orderDrink[i].drinkCategory === 'coffee') {
				if (this.orderDrink[i].milkType) {
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	};
	checkIfThisMilkSelected = (index) => {
		const milk = milkDrinks[index];
		for (var i = 0; i < this.orderDrink.length; i++) {
			if (this.orderDrink[i].drinkCategory === 'coffee') {
				if (this.orderDrink[i].milk === milk) {
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	};
	checkIfDrinkSelected = (index, selectedItemCategoryIndex) => {
		for (var i = 0; i < this.orderDrink.length; i++) {
			const selectedDrink = drinkCategoryDataArray[selectedItemCategoryIndex][index];
			if (this.orderDrink[i].name === selectedDrink.name) {
				return true;
			}
		}
		return false;
	};
	changeDrinkQuantity = (index, selectedItemCategoryIndex, value) => {
		if (!this.findDrink(index, selectedItemCategoryIndex)) {
			this.addDrink(index, selectedItemCategoryIndex)
		}
		else {
			for (var i = 0; i < this.orderDrink.length; i++) {
				const selectedDrink = drinkCategoryDataArray[selectedItemCategoryIndex][index];
				if (this.orderDrink[i].name === selectedDrink.name) {
					console.log("this.orderDrink[i]: %s", this.orderDrink[i])
					
					this.orderDrink[i].updateDrinkQuantity(value);
				}
			}
			return false;
		}
	};
	findDrink = (index, selectedItemCategoryIndex) => {
		for (var i = 0; i < this.orderDrink.length; i++) {
			const selectedDrink = drinkCategoryDataArray[selectedItemCategoryIndex][index];
			console.log("selectedDrink: %s", selectedDrink)
			
			console.log("this.orderDrink[i].name: %s", this.orderDrink[i].name)
			
			if (this.orderDrink[i].name === selectedDrink.name) {
				return this.orderDrink[i];
			}
		}
		return false;
	};
	addDrink = (index, selectedItemCategoryIndex) => {
		if (!this.findDrink(index, selectedItemCategoryIndex)) {
			const drink = new Drink();
			drink.initFromHTML(index, selectedItemCategoryIndex);
			console.log('drink: %s', drink);
			for (var i = 0; i < this.orderDrink.length; i++){
				console.log('b4AddDrink', this.orderDrink[i])
			}
			this.orderDrink.push(drink);
			
			for (var i = 0; i < this.orderDrink.length; i++){
				console.log('afterAddDrink', this.orderDrink[i])
			}
		}
	};
	removeDrink = (index, selectedItemCategoryIndex) => {
		console.log('index: %s', index);

		for (var i = 0; i < this.orderDrink.length; i++) {
			const selectedDrink = drinkCategoryDataArray[selectedItemCategoryIndex][index];

			if (selectedDrink.name === this.orderDrink[i].name) {
				this.orderDrink.splice(i, 1, 1);
				return true;
			}
		}
		return false;
	};
	addCoffee = (index, servingSize) => {
			const coffee = new Coffee();
			coffee.initFromHTML(index, servingSize);
			console.log('coffee: %s', coffee);
			this.orderDrink.push(coffee);
		
	};
	addTemp = (index) => {
		const temp = temperatures[index].index;
		for (var i = 0; i < this.orderDrink.length; i++) {
			if (this.orderDrink[i].drinkCategory === 'coffee') {
				this.orderDrink[i].temperature = temp;
				return true;
			}
		}
		return false;
	};
	addMilk = (index) => {
		const milk = milkDrinks[index];
		for (var i = 0; i < this.orderDrink.length; i++) {
			if (this.orderDrink[i].drinkCategory === 'coffee') {
				this.orderDrink[i].milkType = milk.name;
				this.orderDrink[i].milkPrice = milk.price;
				return true;
			}
		}
		return false;
	};
	addSyrup = (index, servingSize) => {
		const syrup = coffeeSyrups[index];
		for (var i = 0; i < this.orderDrink.length; i++) {
			if (this.orderDrink[i].drinkCategory === 'coffee') {
				this.orderDrink[i].addSyrup(syrup, servingSize);
				return true;
			}
		}
		return false;
	};
}

function jq(myid) {
	return myid.replace(/(:|\.|\[|\]|%|,|=|@)/g, '\\$1');
}
function stringify(dataObject) {
	console.log('dataObject drank: %s', dataObject['drinks']);
	var orderBool = false;
	for (key in dataObject['drinks']) {
		// console.log(key);
		// console.log(dataObject['drinks'][key]);
		if (dataObject['drinks'][key].length) {
			orderBool = true;
		}
	}
	// there will only ever be one item in local storage because a customer can only have 1 order in their shopping cart.
	// the object is a dictionary with a key called order and the value being an array which will hold each crepe as either a menu crepe object
	if (orderBool) {
		if (editDrinkIndex === undefined) {
			if (localStorage.length > 0) {
				const order = JSON.parse(localStorage.getItem(localStorage.key(0)));
				console.log('order local stor > 0', order);
				if ('orderDrink' in order) {
					order['orderDrink'].push(dataObject);
					const stringifiedDataObject = JSON.stringify(order);
					console.log('stringifiedDataObject', stringifiedDataObject);
					localStorage.setItem('order', stringifiedDataObject);
				} else {
					order['orderDrink'] = [];
					order['orderDrink'].push(dataObject);
					const stringifiedDataObject = JSON.stringify(order);
					console.log('order', order);
					console.log('stringifiedDataObject', stringifiedDataObject);
					localStorage.setItem('order', stringifiedDataObject);
				}
			} else {
				const order = {};
				order['orderDrink'] = [];
				order['orderDrink'].push(dataObject);
				const stringifiedDataObject = JSON.stringify(order);
				console.log('order', order);
				console.log('stringifiedDataObject', stringifiedDataObject);
				localStorage.setItem('order', stringifiedDataObject);
			}
		} else {
			var currentOrder = JSON.parse(localStorage.getItem(localStorage.key(0)));
			var currentOrderDrinkList = currentOrder['orderDrink'];
			var currentOrderDrink = currentOrderDrinkList[editDrinkIndex];
			Object.assign(currentOrderDrink, dataObject);
			// if a previously had two proteins and then i remove one then i will have an empty object in my array that i don't want
			for (var i = 0; i < currentOrderDrinkList.length; i++) {
				if (currentOrderDrinkList[i] === {}) {
					currentOrderDrinkList.splice(i);
				}
			}
			localStorage.setItem('order', JSON.stringify(currentOrder));
		}
	}

	for (i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		console.log('key: %s', key);

		var value = localStorage[key];
		console.log('value: %s', value);
	}
	return true;
}

// function checkIfCoffeeSelected() {
// 	coffeeBool = false;
// 	// dripBool = false;
// 	// latteBool = false;
// 	$(`#coffee`)
// 		.find('.btn2')
// 		.each(function () {
// 			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
// 			var toppingCategory = toppingCategoryAndToppingNameArray[0];
// 			var toppingName = toppingCategoryAndToppingNameArray[1];
// 			if ($(this).css(`--${toppingCategory}`) == toppingName) {
// 				coffeeBool = true;
// 			}
// 		});
// }

// function checkIfMilkSelected() {
// 	milkBool = false;
// 	// dripBool = false;
// 	// latteBool = false;
// 	$(`#milk`)
// 		.find('.btn2')
// 		.each(function () {
// 			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
// 			var toppingCategory = toppingCategoryAndToppingNameArray[0];
// 			var toppingName = toppingCategoryAndToppingNameArray[1];
// 			if ($(this).css(`--${toppingCategory}`) == toppingName) {
// 				milkBool = true;
// 			}
// 		});
// 	milkBool;
// 	console.log('milkBoolPost: %s', milkBool);
// }

// function checkIfTempSelected() {
// 	tempBool = false;
// 	// dripBool = false;
// 	// latteBool = false;
// 	$(`#temperature`)
// 		.find('.btn2')
// 		.each(function () {
// 			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
// 			var toppingCategory = toppingCategoryAndToppingNameArray[0];
// 			var toppingName = toppingCategoryAndToppingNameArray[1];
// 			if ($(this).css(`--${toppingCategory}`) == toppingName) {
// 				tempBool = true;
// 			}
// 		});
// 	tempBool;
// 	console.log('milkBoolPost: %s', tempBool);
// }

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
// 		toppingName = toppingName[0];
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
$(window).on('load', function () {
	$('.card-deck').each(function (i) {
		this.id = i;
		$(this)
			.find('.card')
			.each(function (i) {
				this.id = i;
			});
	});
	// $('.card').each(function (i) {
	// var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
	// var toppingName = toppingCategoryAndToppingNameArray[1];
	// this.id = i;
	// });
	coffeeDrinks = $('#coffeeDrinks').data('coffee');
	milkDrinks = $('#milkDrinks').data('milk');
	coffeeSyrups = $('#coffeeSyrups').data('syrup');
	milkshakes = $('#milkshakeDrinks').data('milkshake');
	nonCoffeeDrinks = $('#nonCoffeeDrinks').data('noncoffee');
	bottledDrinks = $('#bottledDrinks').data('bottled');
	drinkCategories = $('#drinkCategories').data('category');
	console.log('drinkCategories: %s', drinkCategories);

	temperatures = $('#coffeeTemperature').data('temperature');

	// i have to add the milk and syrup and temp categories so that the index of card decks will be correct
	drinkCategories.splice(1, 0, { id: 'milk' });
	drinkCategories.splice(2, 0, { id: 'temperature' });
	drinkCategories.splice(3, 0, { id: 'syrup' });
	for (var i = 0; i < drinkCategories.length; i++) {
	}
	drinkCategoryDataArray = new Array();
	drinkCategoryDataArray.push(coffeeDrinks);
	drinkCategoryDataArray.push(milkDrinks);
	drinkCategoryDataArray.push(coffeeSyrups);
	drinkCategoryDataArray.push(temperatures);
	drinkCategoryDataArray.push(milkshakes);
	drinkCategoryDataArray.push(nonCoffeeDrinks);
	drinkCategoryDataArray.push(bottledDrinks);
	// const orderDrinkList = []

	// for (var i = 0; i < coffeeDrinks.length; i++) {
	// 	console.log('coffeeDrinks[i]', coffeeDrinks[i]);
	// }

	//https://api.jquery.com/wrap/
	$('.card-img-top').wrap('<div class="container2"></div>');

	// $('.card-img-top').each(function () {
	//https://stackoverflow.com/questions/21556874/display-an-alert-in-jquery-for-a-few-seconds-then-fade-it-out
	// 	$('<button class="btn" type="button">Customize</button>').insertAfter($(this));
	// 	$('<button class="btn4" type="button">Regular</button>').insertAfter($(this));
	// 	$('<button class="btn3" type="button">Light</button>').insertAfter($(this));
	// 	$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
	// });

	$('.card-img-top').each(function (i) {
		const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id');
		const selectedItemCategory = drinkCategories[selectedItemCategoryIndex].id;
		
		if (selectedItemCategory === 'syrup') {
			$('<button class="btn" type="button">Customize</button>').insertAfter($(this));
			$('<button class="btn4" type="button">1 Pump</button>').insertAfter($(this));
			$('<button class="btn3" type="button">½ Pump</button>').insertAfter($(this));
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		} else if (selectedItemCategory === 'coffee') {
			$('<button class="btn" type="button">Customize</button>').insertAfter($(this));
			$('<button class="btn4" type="button">2 Espresso Shots</button>').insertAfter($(this));
			$('<button class="btn3" type="button">Decaf</button>').insertAfter($(this));
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		} else if (
			selectedItemCategory === 'bottled' ||
			selectedItemCategory === 'milkshake' ||
			selectedItemCategory === 'non-coffee'
		) {
			$(`<div class="grid-container" id="bottled_drink${i}" style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
				$(this)
			);
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		} else if (
			selectedItemCategory === 'bottled' ||
			selectedItemCategory === 'milkshake' ||
			selectedItemCategory === 'temperature' ||
			selectedItemCategory === 'non-coffee'
		) {
			$(`<div class="grid-container" id="bottled_drink${i}" style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
				$(this)
			);
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		} else if (
			selectedItemCategory != 'milkshake' &&
			selectedItemCategory != 'non-coffee' &&
			selectedItemCategory != 'bottled'
		) {
			$('<button class="btn" type="button">Customize</button>').insertAfter($(this));
			$('<button class="btn4" type="button">Regular</button>').insertAfter($(this));
			$('<button class="btn3" type="button">Light</button>').insertAfter($(this));
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		} else if (
			selectedItemCategory === 'milkshake' ||
			selectedItemCategory === 'non-coffee' ||
			selectedItemCategory === 'bottled'
		) {
			$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		}
	});

	// $('.btn2').each(function (i) {
		// this.id = 'btn' + i;
		// $(this).css('--quantity', 1);
		// var drinkName = $(this).closest('.card').find('.card-title').text().split(' ').pop().toLowerCase();
		// console.log('drinkName1', drinkName);

		// if (drinkName === 'latte') {
		// 	// console.log('latte');
		// 	$(this).css('--latte', 'true');
		// }

		// drip coffee is the only coffee with "coffee" in the name so it will be the only element to return coffee as the last element
		// if (drinkName == 'coffee') {
		// 	// console.log('drip');
		// 	$(this).css('--drip', 'true');
		// }
		// }
		// var price = $(this).closest('.card').find('.card-text').text();
		// if (price.trim() != '') {
			// console.log('price', price);
			// price = price.replace('$', '');
			// this is just for the almond milk which has extra in the price name
			// if (price.split(' ').length > 1) {
				// console.log('price', price);
				// $(this).css('--price', price.split(' ').shift());
				// console.log('price', price.split(' ').shift());
			// } else {
				// $(this).css('--price', price);
			// }
		// }
	// });

	$('#milk, #syrup, #temperature').each(function () {
		$(this)
			.find('.card')
			.each(function () {
				$(this).css('opacity', '.3');
			});
	});

	if ($('.edit').length) {
		editDrinkIndex = $('.edit').first().attr('id');
		console.log('editDrinkIndex: %s', editDrinkIndex);
		editDrink = JSON.parse(localStorage.getItem(localStorage.key(0)))['orderDrink'][editDrinkIndex];
		console.log('editDrink: %s', editDrink);

		const drinkDict = editDrink['drinks'];
		for (var drinkCategoryKey in drinkDict) {
			console.log('drinkCategoryKey: %s', drinkCategoryKey);

			const drinkArray = drinkDict[drinkCategoryKey];
			console.log('drinkArray: %s', drinkArray);
			if (drinkCategoryKey === 'coffee') {
				for (var i = 0; i < drinkArray.length; i++) {
					const drink = drinkArray[i];
					if ('name' in drink) {
						console.log('drink name: %s', drink['name']);
						const drinkName = drink['name'];
						const drinkServingSize = drink['servingSize'];
						const drinkQuantity = drink['quantity'];
						console.log('drinkQuantity: %s', drinkQuantity);

						const milk = drink['milk'];
						console.log('milk: %s', milk);

						const milkName = milk['name'];
						const milkServingSize = milk['servingSize'];

						const espresso = drink['espresso'];
						console.log('espresso: %s', espresso);

						const espressoQuantity = espresso['quantity'];
						console.log('espressoQuantity: %s', espressoQuantity);
						//send crepe recipe to blaise
						$(`#${drinkName}`).find('.btn2').css(`--${drinkCategoryKey}`, `${drinkName}`);
						$(`#${drinkName}`).find('.btn2').css(`--quantity`, `${drinkQuantity}`);

						if (espressoQuantity === 3) {
							$(`#${drinkName}`).find('.btn2').html('3x');
							$(`#${drinkName}`).find('.btn2').show();
							$(`#${drinkName}`).find('.btn').show();
							$(`#${drinkName}`).find('.btn2').css('--extra', 'true');
						} else if (espressoQuantity === 2) {
							$(`#${drinkName}`).find('.btn2').html('✓');
							$(`#${drinkName}`).find('.btn2').show();
							$(`#${drinkName}`).find('.btn').show();
							$(`#${drinkName}`).find('.btn2').css('--regular', 'true');
						} else if (espressoQuantity === 1) {
							$(`#${drinkName}`).find('.btn2').html('½');
							$(`#${drinkName}`).find('.btn2').show();
							$(`#${drinkName}`).find('.btn').show();
							$(`#${drinkName}`).find('.btn2').css('--half', 'true');
						}
						// set all the milk props
						$(`#${jq(milkName)}`)
							.find('.btn2')
							.css(`--${drinkCategoryKey}`, `${milkName}`);
						$(`#${jq(milkName)}`)
							.find('.btn2')
							.css(`--${milkServingSize}`, 'true');
						$(`#${jq(milkName)}`)
							.closest('.card')
							.css('opacity', '1');
						$('#errorMilk').hide();

						if (milkServingSize === 'extra') {
							$(`#${jq(milkName)}`)
								.find('.btn2')
								.html('2x');
							$(`#${jq(milkName)}`)
								.find('.btn2')
								.show();
							$(`#${jq(milkName)}`)
								.find('.btn')
								.show();
							$(`#${jq(milkName)}`)
								.find('.btn2')
								.css('--extra', 'true');
						} else if (milkServingSize === 'regular') {
							$(`#${jq(milkName)}`)
								.find('.btn2')
								.html('✓');
							$(`#${jq(milkName)}`)
								.find('.btn2')
								.show();
							$(`#${jq(milkName)}`)
								.find('.btn')
								.show();
							$(`#${jq(milkName)}`)
								.find('.btn2')
								.css('--regular', 'true');
						} else if (milkServingSize === 'half') {
							$(`#${jq(milkName)}`)
								.find('.btn2')
								.html('½');
							$(`#${jq(milkName)}`)
								.find('.btn2')
								.show();
							$(`#${jq(milkName)}`)
								.find('.btn')
								.show();

							$(`#${jq(milkName)}`)
								.find('.btn2')
								.css('--half', 'true');
						}
						console.log('drinkServingSize: %s', drinkServingSize);
					}
				}
				// checkIfCoffeeSelected();
				if (coffeeBool) {
					$('#syrup')
						.find('.card')
						.each(function () {
							$(this).css('opacity', '1');
						});
					$('#errorSyrup').hide();
					$('#coffee')
						.find('.card')
						.each(function () {
							var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
							var toppingCategory = toppingCategoryAndToppingNameArray[0];
							var toppingName = toppingCategoryAndToppingNameArray[1];
							// make sure that you don't hide the already selected coffee
							if ($(this).find('.btn2').css(`--${toppingCategory}`) != toppingName) {
								$(this).css('opacity', '.3');
							}
						});
				}
				if (tempBool) {
					$('#temperature')
						.find('.card')
						.each(function () {
							$(this).css('opacity', '1');
						});
				}
			} else {
				for (var i = 0; i < drinkArray.length; i++) {
					const drink = drinkArray[i];
					if ('name' in drink) {
						// i add the word milkshake to each name for formatting so i have to remove it for the html element id to be recognized
						const nonCoffeeDrinkName = drink['name'].replace('Milkshake', '');
						// console.log('nonCoffeeDrinkName: %s', nonCoffeeDrinkName);
						const nonCoffeeDrinkQuantity = drink['quantity'];
						const nonCoffeeDrinkServingSize = drink['servingSize'];
						$(`#${nonCoffeeDrinkName}`).find('.btn2').css(`--${drinkCategoryKey}`, `${nonCoffeeDrinkName}`);
						$(`#${nonCoffeeDrinkName}`).find('.btn2').css(`--${nonCoffeeDrinkServingSize}`, 'true');
						$(`#${nonCoffeeDrinkName}`).find('.btn2').css(`--quantity`, `${nonCoffeeDrinkQuantity}`);
						$(`#${nonCoffeeDrinkName}`).find('.btn2').html(nonCoffeeDrinkQuantity);
						$(`#${nonCoffeeDrinkName}`).find('.btn2').show();
						$(`#${nonCoffeeDrinkName}`).find('.btn6').show();
						$(`#${nonCoffeeDrinkName}`).find('.btn7').show();
					}
				}
			}
		}

		for (var key in editDrink) {
			console.log(key);
			console.log(editDrink[key]);
		}
		console.log('editDrink: %s', editDrink);
		console.log('editDrinkIndex: %s', editDrinkIndex);
		console.log('editDrink: %s', editDrink);
	}
	const userOrderDrink = new Order();
	// var x = document.getElementsByClassName('card-title');
	// var y = [];

	// for (i = 2; i < x.length; i++) {
	// 	y.push(x[i].innerHTML);
	// }

	$('.card-img-top').each(function () {
		// this.src = '/static/images/' + y[j] + '.jpg';
		this.src = '/static/images/steak.jpg';
	});
	$(document)
		.on('mouseenter', '.card', function () {
			// var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			// var toppingCategory = toppingCategoryAndToppingNameArray[0];
			// var toppingName = toppingCategoryAndToppingNameArray[1];
			// console.log('tc', toppingCategory, 'tn', toppingName);
			// checkIfCoffeeSelected();
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id');
			const selectedItemCategory = drinkCategories[selectedItemCategoryIndex].id
			console.log("selectedItemCategory: %s", selectedItemCategory)
			
			

			if ($(this).find('.card-body').attr('id') != 'cardBody') {
				if (selectedItemCategory != 'milk' && selectedItemCategory != 'temperature') {
					if (selectedItemCategory != 'coffee') {
						$(this).find('.card-body').css('opacity', '.3');
						$(this).find('.card-img-top').css('opacity', '.3');
						$(this).find('.btn').show();
						// if the selected card is coffee but a coffee has not been previously selected
					} else if (!userOrderDrink.checkIfCoffeeSelected()) {
						// console.log('see if the card-deck id is coffee', $(this).closest('.card-deck').attr('id'));
						$(this).find('.card-body').css('opacity', '.3');
						$(this).find('.card-img-top').css('opacity', '.3');
						$(this).find('.btn').show();
					}
				} else if (userOrderDrink.checkIfCoffeeSelected() && selectedItemCategory === 'syrup') {
					$(this).find('.card-body').css('opacity', '.3');
					$(this).find('.card-img-top').css('opacity', '.3');
					$(this).find('.btn').show();
				} else if (userOrderDrink.checkIfCoffeeSelected() && selectedItemCategory === 'milk') {
					// checkIfMilkSelected();
					// console.log('milkBool in click: %s', milkBool);
					if (!userOrderDrink.checkIfMilkSelected()) {
						$(this).find('.card-body').css('opacity', '.3');
						$(this).find('.card-img-top').css('opacity', '.3');
					}
				} else if (userOrderDrink.checkIfCoffeeSelected() && selectedItemCategory === 'temperature') {
					// checkIfTempSelected();
					// console.log('tempBool in click: %s', tempBool);
					if (!userOrderDrink.checkIfTempSelected()) {
						$(this).find('.card-body').css('opacity', '.3');
						$(this).find('.card-img-top').css('opacity', '.3');
					}
				}
				// if a coffee is selected but not a latte or drip coffee then fade the card out and show the customize button
				// else if (coffeeBool && !dripBool && !latteBool) {
				// 		// milk card logic
				// 		$(this).find('.card-body').css('opacity', '.3');
				// 		$(this).find('.card-img-top').css('opacity', '.3');
				// 		$(this).find('.btn').show();
				// 	}
				// 	// if a coffee is selected and it is a latte or drip coffee then fade the card out and do not show the customize button
				// 	else if ((coffeeBool && latteBool) || (coffeeBool && dripBool)) {
				// 		$(this).find('.card-body').css('opacity', '.3');
				// 		$(this).find('.card-img-top').css('opacity', '.3');
				// 	}
			}

			//click the card somewhere
			$(this)
				.find('.card-text, .card-title, .card-body, .card-img-top')
				.unbind('click')
				.bind('click', function () {
					const selectedItemIndex = $(this).closest('.card').attr('id');
					const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id');
					const selectedItemCategory = drinkCategories[selectedItemCategoryIndex].id;
					console.log('selectedItemCategoryIndex: %s', selectedItemCategoryIndex);
					console.log('drinkCategories[selectedItemCategoryIndex].id', selectedItemCategory);
					// var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
					// var toppingCategory = toppingCategoryAndToppingNameArray[0];
					// var toppingName = toppingCategoryAndToppingNameArray[1];
					// checkIfCoffeeSelected();
					if (selectedItemCategory === 'bottled' || selectedItemCategory === 'non-coffee' || selectedItemCategory === 'milkshake') {
						// 	if (parseFloat($(this).closest('.card').find('.btn2').css('--quantity')) === 0) {
						// 		$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
						// 		$(this).closest('.card').find('.btn2').css('--quantity', 1);
						// 		// console.log('price', $(this).closest('.card-text').val());
						// 		$(this).closest('.card').find('.btn2').html(1);
						// 		$(this).closest('.card').find('.btn2').show();
						// 		//after clicking the card show the + and - buttons
						// 		$(this).closest('.card').find('.btn6').show();
						// 		$(this).closest('.card').find('.btn7').show();
						// 	}
						// }
						userOrderDrink.changeDrinkQuantity(selectedItemIndex, selectedItemCategoryIndex, 'increase');
						console.log(userOrderDrink.findDrink(selectedItemIndex, selectedItemCategoryIndex));
							console.log("userOrderDrink.findDrink(selectedItemIndex, selectedItemCategoryIndex).quantity: %s", userOrderDrink.findDrink(selectedItemIndex, selectedItemCategoryIndex).quantity)
							
							$(this)
								.closest('.card')
								.find('.btn2')
								.html(userOrderDrink.findDrink(selectedItemIndex, selectedItemCategoryIndex).quantity);
							$(this).closest('.card').find('.btn2').show();
							//after clicking the card show the + and - buttons
							$(this).closest('.card').find('.btn6').show();
							$(this).closest('.card').find('.btn7').show();
					}
					// if you click the card and it hasn't been selected and isnt bottled or non-coffee or milkshake
					// else if (
					// 	$(this).closest('.card').find('.btn2').css('--extra') != 'true' &&
					// 	$(this).closest('.card').find('.btn2').css('--half') != 'true' &&
					// 	$(this).closest('.card').find('.btn2').css('--regular') != 'true' &&
					// 	$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`) != toppingName
					// ) {
					else if (!userOrderDrink.findDrink(selectedItemIndex, selectedItemCategoryIndex)) {
						// if a coffee has been selected already then milk or syrup can be selected
						if (userOrderDrink.checkIfCoffeeSelected()) {
							// if coffee has been selected alredy then we don't want to select another coffee!
							if (selectedItemCategory != 'coffee') {
								//make sure the selected card isn't milk because we want extra logic in there to make sure a milk hasn't already been selected
								if (selectedItemCategory != 'milk') {
									if (selectedItemCategory === 'temperature') {
										// checkIfTempSelected();
										if (!userOrderDrink.checkIfTempSelected()) {
											// $(this)
											// 	.closest('.card')
											// 	.find('.btn2')
											// 	.css(`--${toppingCategory}`, `${toppingName}`);
											// $(this).closest('.card').find('.btn2').css('--regular', 'true');
											// $(this).closest('.card').find('.btn2').css('--regular', 'true');
											userOrderDrink.addTemp(selectedItemIndex);

											$(this).closest('.card').find('.btn2').html('✓');
											$(this).closest('.card').find('.btn2').toggle();

											// if a milk has been selected then we want to make sure all the other milk cards are knocked out
											//and we want to change the milk error message to say that only one milk may be selected
											$('#temperature')
												.find('.card')
												.each(function () {
													// var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
													// var toppingCategory = toppingCategoryAndToppingNameArray[0];
													// var toppingName = toppingCategoryAndToppingNameArray[1];
													// make sure that you don't hide the already selected coffee
													// 	if (
													// 		$(this).find('.btn2').css(`--${toppingCategory}`) != toppingName
													// 	) {
													// 		$(this).css('opacity', '.3');
													// 	}
													// });
													if (!userOrderDrink.checkIfThisTempSelected(selectedItemIndex)) {
														$(this).css('opacity', '.3');
													}
												});
											$('#errorTemp').html('You may only select one temperature for your coffee');
											$('#errorTemp').show();
										}
									} else {
										// $(this)
										// 	.closest('.card')
										// 	.find('.btn2')
										// 	.css(`--${toppingCategory}`, `${toppingName}`);
										// $(this).closest('.card').find('.btn2').css('--regular', 'true');
										userOrderDrink.addDrink(selectedItemIndex, selectedItemCategoryIndex);
										$(this).closest('.card').find('.btn2').html('✓');
										$(this).closest('.card').find('.btn2').toggle();
									}
								}
								// if the selected card is milk
								else {
									// console.log('milkBooooool: %s', milkBool);
									// checkIfMilkSelected();
									// make sure a milk hasn't already been selected when selecting a milk card
									if (!userOrderDrink.checkIfMilkSelected()) {
										// console.log(';weeewew');
										// $(this)
										// 	.closest('.card')
										// 	.find('.btn2')
										// 	.css(`--${toppingCategory}`, `${toppingName}`);
										// $(this).closest('.card').find('.btn2').css('--regular', 'true');
										userOrderDrink.addMilk(selectedItemIndex, selectedItemCategoryIndex);
										$(this).closest('.card').find('.btn2').html('✓');
										$(this).closest('.card').find('.btn2').toggle();
										// if a milk has been selected then we want to make sure all the other milk cards are knocked out
										//and we want to change the milk error message to say that only one milk may be selected
										$('#milk')
											.find('.card')
											.each(function () {
												// var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
												// var toppingCategory = toppingCategoryAndToppingNameArray[0];
												// var toppingName = toppingCategoryAndToppingNameArray[1];
												// make sure that you don't hide the already selected coffee
												// if ($(this).find('.btn2').css(`--${toppingCategory}`) != toppingName) {
												// 	$(this).css('opacity', '.3');
												// }
												if (!userOrderDrink.checkIfThisMilkSelected(selectedItemIndex)) {
													$(this).css('opacity', '.3');
												}
											});
										$('#errorMilk').html('You may only select one milk for your coffee');
										$('#errorMilk').show();
									}
								}
							}
						} else if (
							// otherwise make sure the card being clicked isn't milk or coffee syrup
							selectedItemCategory != 'milk' &&
							selectedItemCategory != 'syrup' &&
							selectedItemCategory != 'temperature'
						) {
							// $(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
							// $(this).closest('.card').find('.btn2').css('--regular', 'true');
							// $(this).closest('.card').find('.btn2').css('--quantity', 1);
							userOrderDrink.addCoffee(selectedItemIndex, 'regular');
							// console.log(
							// 	'anything but coffee syrup and milk',
							// 	$(this).closest('.card').find('.btn2').css('--regular')
							// );
							$(this).closest('.card').find('.btn2').html('✓');
							$(this).closest('.card').find('.btn2').toggle();
						} else if (userOrderDrink.findDrink(selectedItemIndex, selectedItemCategoryIndex)) {
							userOrderDrink.removeDrink(selectedItemIndex);
						}
						// } else if ($(this).closest('.card').find('.btn2').css('--half') === 'true') {
						// 	$(this).closest('.card').find('.btn2').css('--half', 'false');
						// 	$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
						// 	$(this).closest('.card').find('.btn2').toggle();
						// 	//https://stackoverflow.com/questions/21286887/adding-check-marks-to-bootstrap-button-drop-down-items/46890814
						// 	$(this).closest('.card').find('.btn2').html('✓');
						// } else if ($(this).closest('.card').find('.btn2').css('--extra') === 'true') {
						// 	// console.log('dVeggies toggle');
						// 	$(this).closest('.card').find('.btn2').css('--extra', 'false');
						// 	$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
						// 	$(this).closest('.card').find('.btn2').toggle();
						// 	$(this).closest('.card').find('.btn2').html('✓');
						// } else if ($(this).closest('.card').find('.btn2').css('--regular') === 'true') {
						// 	// console.log('fag');
						// 	$(this).closest('.card').find('.btn2').css('--regular', 'false');
						// 	$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
						// 	$(this).closest('.card').find('.btn2').css(`--quantity`, 0);
						// 	$(this).closest('.card').find('.btn2').toggle();
						// 	$(this).closest('.card').find('.btn2').html('✓');
						// }
						// milk card logic
						// after clicking a card, if you the card you selected was a coffee then unhide the milk and syrup
						// checkIfCoffeeSelected();
						// checkIfMilkSelected();
						// checkIfTempSelected();
						if (userOrderDrink.checkIfCoffeeSelected()) {
							// make sure a milk hasn't been selected before we activate all the milk cards
							if (!userOrderDrink.checkIfMilkSelected()) {
								$('#milk, #syrup').each(function () {
									// console.log('syrup & milk $(this) PT2', $(this));
									$(this)
										.find('.card')
										.each(function () {
											$(this).css('opacity', '1');
										});
									$('#errorMilk').hide();
									$('#errorSyrup').hide();
								});
							}

							if (!userOrderDrink.checkIfTempSelected()) {
								$('#temperature').each(function () {
									$(this)
										.find('.card')
										.each(function () {
											$(this).css('opacity', '1');
										});
								});
								$('#errorTemp').hide();
							}
							// after selecting one coffee the rest become unavailable

							$('#coffee')
								.find('.card')
								.each(function () {
									// var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
									// var toppingCategory = toppingCategoryAndToppingNameArray[0];
									// var toppingName = toppingCategoryAndToppingNameArray[1];
									// make sure that you don't hide the already selected coffee
									// if ($(this).find('.btn2').css(`--${toppingCategory}`) != toppingName) {
									// 	$(this).css('opacity', '.3');
									// }
									if (
										userOrderDrink.checkIfDrinkSelected(
											selectedItemIndex,
											selectedItemCategoryIndex
										)
									) {
										$(this).css('opacity', '.3');
									}
								});
							// if no coffee is selected then we need to make sure they're all available, and make sure we knock out the milk and syrup and temp options
						} else {
							$('#coffee')
								.find('.card')
								.each(function () {
									$(this).css('opacity', '1');
								});
							// if you unselected coffee then we need to reset the milk and syrup and temp values
							$('#milk, #syrup, #temperature').each(function () {
								// var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
								// var toppingCategory = toppingCategoryAndToppingNameArray[0];
								// var toppingName = toppingCategoryAndToppingNameArray[1];
								// console.log($(this), '$(this)');
								$(this)
									.find('.card')
									.each(function () {
										$(this).css('opacity', '.3');
										$(this).find('.btn2').hide();
										// $(this).find('.btn2').css(`--${toppingCategory}`, 'false');
										$(this).find('.btn').hide();
										// $(this).find('.btn2').css('--regular', 'false');
										// $(this).find('.btn2').css('--half', 'false');
										// $(this).find('.btn2').css('--extra', 'false');
										// $(this).closest('.card').find('.btn2').css(`--quantity`, 0);
									});
								$('#errorMilk').html('*Please select a coffee first');
								$('#errorMilk').show();
								$('#errorSyrup').show();
								$('#errorTemp').show();
							});
						}
					}
				});
		})
		.on('mouseleave', '.card', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id');
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id');
			const selectedItemCategory = drinkCategories[selectedItemCategoryIndex].id;
			console.log('selectedItemIndex: %s', selectedItemIndex);

			// var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			// var toppingCategory = toppingCategoryAndToppingNameArray[0];
			// var toppingName = toppingCategoryAndToppingNameArray[1];
			// console.log('tc', toppingCategory, 'tn', toppingName);
			// TODO: Replace this with the assignment from the gettoppingCategory function
			// if (
			// 	$(this).find('.btn2').css('--extra') != 'true' &&
			// 	$(this).find('.btn2').css('--half') != 'true' &&
			// 	$(this).find('.btn2').css('--regular') != 'true' &&
			// 	$(this).find('.btn2').css(`--${toppingCategory}`) != toppingName
			// )
			if (!userOrderDrink.checkIfDrinkSelected(selectedItemIndex, selectedItemCategoryIndex)) {
				$(this).find('.btn').hide();
				$(this).find('.btn3').hide();
				$(this).find('.btn4').hide();
			} else {
				$(this).find('.btn3').hide();
				$(this).find('.btn4').hide();
			}

			$(this).find('.btn').html('Customize');
			$(this).find('img').css('opacity', '1');
			$(this).find('.card-body').css('opacity', '1');
		});
	// click the card buttons

	$('.btn')
		.unbind('click')
		.bind('click', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id');
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id');
			const selectedItemCategory = drinkCategories[selectedItemCategoryIndex].id;
			// var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			// var toppingCategory = toppingCategoryAndToppingNameArray[0];
			// var toppingName = toppingCategoryAndToppingNameArray[1];
			// console.log('tc', toppingCategory, 'tn', toppingName);
			if ($(this).html() == 'Customize') {
				console.log('selectedItemCategory: %s', selectedItemCategory);

				if (selectedItemCategory === 'syrup') {
					//https://stackoverflow.com/questions/857245/is-there-a-jquery-unfocus-method
					$(this).blur();
					$(this).html('2 Pumps');
					$(this).closest('.card').find('.btn3').show();
					$(this).closest('.card').find('.btn4').show();
				} else if (selectedItemCategory === 'coffee') {
					//https://stackoverflow.com/questions/857245/is-there-a-jquery-unfocus-method
					$(this).blur();
					$(this).html('3 Espresso Shots');
					$(this).closest('.card').find('.btn3').show();
					$(this).closest('.card').find('.btn4').show();
				} else {
					//https://stackoverflow.com/questions/857245/is-there-a-jquery-unfocus-method
					$(this).blur();
					$(this).html('Extra');
					$(this).closest('.card').find('.btn3').show();
					$(this).closest('.card').find('.btn4').show();
				}
			} else {
				const servingSize = 'extra';
				if (selectedItemCategory=== 'syrup') {
					userOrderDrink.addSyrup(selectedItemIndex);
				} else if (selectedItemCategory === 'coffee') {
					userOrderDrink.addCoffee(selectedItemIndex, servingSize);
				}
				// $(this).closest('.card').find('.btn2').css('--half', 'false');
				// $(this).closest('.card').find('.btn2').css('--regular', 'false');
				// $(this).closest('.card').find('.btn2').css('--extra', 'true');
				// $(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
				// $(this).closest('.card').find('.btn2').css(`--quantity`, 1);
				userOrderDrink.addDrink(selectedItemIndex, selectedItemCategoryIndex);
				$(this).html('Customize');
				$(this).blur();
				$(this).closest('.card').find('.btn2').html('3X');
				$(this).closest('.card').find('.btn2').show();
				$(this).closest('.card').find('.btn3').hide();
				$(this).closest('.card').find('.btn4').hide();
				// checkIfCoffeeSelected();
				if (userOrderDrink.checkIfCoffeeSelected()) {
					// if you selected coffee by getting extra espresso then we still need to blot out the other coffee cards
					$('#coffee')
						.find(' .card')
						.each(function () {
							// var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
							// var toppingCategory = toppingCategoryAndToppingNameArray[0];
							// var toppingName = toppingCategoryAndToppingNameArray[1];
							// make sure that you don't hide the already selected coffee
							// if ($(this).find('.btn2').css(`--${toppingCategory}`) != toppingName) {
							// 	$(this).css('opacity', '.3');
							// }

							if (!userOrderDrink.checkIfDrinkSelected(selectedItemIndex, selectedItemCategoryIndex)) {
								$(this).css('opacity', '.3');
							}
						});
					$('#milk, #syrup').each(function () {
						// console.log('syrup & milk $(this) PT2', $(this));
						$(this)
							.find('.card')
							.each(function () {
								$(this).css('opacity', '1');
							});
						$('#errorMilk').hide();
						$('#errorSyrup').hide();
						$('#errorTemp').hide();
					});
				}
			}
		});

	$('.btn3')
		.unbind('click')
		.bind('click', function () {
			// var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			// var toppingCategory = toppingCategoryAndToppingNameArray[0];
			// var toppingName = toppingCategoryAndToppingNameArray[1];
			// console.log('tc', toppingCategory, 'tn', toppingName);
			// $(this).closest('.card').find('.btn2').css('--half', 'true');
			// $(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
			// $(this).closest('.card').find('.btn2').css(`--quantity`, 1);
			// $(this).closest('.card').find('.btn2').css('--regular', 'false');
			// $(this).closest('.card').find('.btn2').css('--extra', 'false');
			const servingSize = 'half';
			const selectedItemIndex = $(this).closest('.card').attr('id');
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id');
			const selectedItemCategory = drinkCategories[selectedItemCategoryIndex].id;
			
			if (selectedItemCategory === 'syrup') {
				userOrderDrink.addSyrup(selectedItemIndex);
			} else if (selectedItemCategory === 'coffee') {
				userOrderDrink.addCoffee(selectedItemIndex, servingSize);
			}
			$(this).closest('.card').find('.btn2').html('½');
			$(this).closest('.card').find('.btn2').show();
			$(this).hide();
			$(this).closest('.card').find('.btn3').hide();
			$(this).closest('.card').find('.btn4').hide();
			$(this).closest('.card').find('.btn').html('Customize');
			// checkIfCoffeeSelected();
			if (userOrderDrink.checkIfCoffeeSelected()) {
				// if you selected coffee by getting extra espresso then we still need to blot out the other coffee cards
				$('#coffee')
					.find('.card')
					.each(function () {
						// var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
						// var toppingCategory = toppingCategoryAndToppingNameArray[0];
						// var toppingName = toppingCategoryAndToppingNameArray[1];
						// make sure that you don't hide the already selected coffee
						// if ($(this).find('.btn2').css(`--${toppingCategory}`) != toppingName) {
						// 	$(this).css('opacity', '.3');
						// }
						if (!userOrderDrink.checkIfDrinkSelected(selectedItemIndex, selectedItemCategoryIndex)) {
							$(this).css('opacity', '.3');
						}
					});
				$('#milk, #syrup').each(function () {
					// console.log('syrup & milk $(this) PT2', $(this));
					$(this)
						.find('.card')
						.each(function () {
							$(this).css('opacity', '1');
						});
					$('#errorMilk').hide();
					$('#errorSyrup').hide();
					$('#errorTemp').hide();
				});
			}
		});

	$('.btn4')
		.unbind('click')
		.bind('click', function () {
			// var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			// var toppingCategory = toppingCategoryAndToppingNameArray[0];
			// var toppingName = toppingCategoryAndToppingNameArray[1];
			// $(this).closest('.card').find('.btn2').css('--regular', 'true');
			// $(this).closest('.card').find('.btn2').css(`--quantity`, 1);

			// $(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
			// $(this).closest('.card').find('.btn2').css('--half', 'false');
			// $(this).closest('.card').find('.btn2').css('--extra', 'false');
			// $(this).closest('.card').find('.btn2').html('✓');
			// $(this).closest('.card').find('.btn2').show();
			// $(this).hide();
			// $(this).closest('.card').find('.btn3').hide();
			// $(this).closest('.card').find('.btn').html('Customize');
			// checkIfCoffeeSelected();
			const servingSize = 'regular';
			const selectedItemIndex = $(this).closest('.card').attr('id');
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id');
			const selectedItemCategory = drinkCategories[selectedItemCategoryIndex].id;

			if (selectedItemCategory === 'syrup') {
				userOrderDrink.addSyrup(selectedItemIndex);
			} else if (selectedItemCategory === 'coffee') {
				userOrderDrink.addCoffee(selectedItemIndex, servingSize);
			}

			if (userOrderDrink.checkIfCoffeeSelected()) {
				// if you selected coffee by getting extra espresso then we still need to blot out the other coffee cards
				$('#coffee')
					.find('.card')
					.each(function () {
						// var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
						// var toppingCategory = toppingCategoryAndToppingNameArray[0];
						// var toppingName = toppingCategoryAndToppingNameArray[1];
						// make sure that you don't hide the already selected coffee
						// if ($(this).find('.btn2').css(`--${toppingCategory}`) != toppingName) {
						// 	$(this).css('opacity', '.3');
						// }
						if (!userOrderDrink.checkIfDrinkSelected(selectedItemIndex, selectedItemCategoryIndex)) {
							$(this).css('opacity', '.3');
						}
					});
				$('#milk, #syrup').each(function () {
					// console.log('syrup & milk $(this) PT2', $(this));
					$(this)
						.find('.card')
						.each(function () {
							$(this).css('opacity', '1');
						});
					$('#errorMilk').hide();
					$('#errorSyrup').hide();
					$('#errorTemp').hide();
				});
			}
		});

	$('.btn6')
		.unbind('click')
		.bind('click', function () {
			const selectedItemIndex = $(this).closest('.card').attr('id');
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id');
			console.log("selectedItemCategoryIndex: %s", selectedItemCategoryIndex)
			
			// var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			// var toppingCategory = toppingCategoryAndToppingNameArray[0];
			// var toppingName = toppingCategoryAndToppingNameArray[1];
			// console.log('tc', toppingCategory, 'tn', toppingName);
			// var currentQuant = parseFloat($(this).closest('.card').find('.btn2').css('--quantity'));
			// console.log('cuuremtQuant', currentQuant);
			// currentQuant -= 1;
			userOrderDrink.findDrink(selectedItemIndex, selectedItemCategoryIndex);
			userOrderDrink.addDrink(selectedItemIndex, selectedItemCategoryIndex);
			userOrderDrink.changeDrinkQuantity(selectedItemIndex, selectedItemCategoryIndex, 'decrease');
			if (userOrderDrink.findDrink(selectedItemIndex, selectedItemCategoryIndex).quantity <= 0) {
				$(this).closest('.card').find('.btn2').hide();
				// $(this).closest('.card').find('.btn2').html(`${currentQuant}`);
				$(this).closest('.card').find('.btn2').html(userOrderDrink.findDrink(selectedItemIndex, selectedItemCategoryIndex).quantity);
				userOrderDrink.removeDrink(selectedItemIndex);
				// $(this).closest('.card').find('.btn2').css('--quantity', currentQuant);
				// $(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
				$(this).hide();
				$(this).closest('.card').find('.btn7').hide();
			} else {
				// $(this).closest('.card').find('.btn2').html(`${currentQuant}`);
				$(this).closest('.card').find('.btn2').html(userOrderDrink.findDrink(selectedItemIndex, selectedItemCategoryIndex).quantity);
				$(this).closest('.card').find('.btn2').show();
				// $(this).closest('.card').find('.btn2').css('--quantity', currentQuant);
			}
			// console.log('.btn quant value', $(this).closest('.card').find('.btn2').css('--quantity'));
			// console.log('.btn name value', $(this).closest('.card').find('.btn2').css('--drinkName'));
		});

	$('.btn7')
		.unbind('click')
		.bind('click', function () {
			// var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			// var toppingCategory = toppingCategoryAndToppingNameArray[0];
			// var toppingName = toppingCategoryAndToppingNameArray[1];
			// console.log('tc', toppingCategory, 'tn', toppingName);
			// var currentQuant = parseFloat($(this).closest('.card').find('.btn2').css('--quantity'));
			// console.log('--price', $(this).css('--price'));
			// currentQuant += 1;
			const selectedItemIndex = $(this).closest('.card').attr('id');
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id');
			console.log("selectedItemCategoryIndex: %s", selectedItemCategoryIndex)
			
			userOrderDrink.changeDrinkQuantity(selectedItemIndex, selectedItemCategoryIndex, 'increase');
			console.log(
				'userOrderDrink.findDrink(selectedItemIndex, selectedItemCategoryIndex).quantity',
				userOrderDrink.findDrink(selectedItemIndex, selectedItemCategoryIndex)
			);
			$(this).closest('.card').find('.btn2').html(userOrderDrink.findDrink(selectedItemIndex, selectedItemCategoryIndex).quantity);

			// $(this).closest('.card').find('.btn2').html(`${currentQuant}`);
			$(this).closest('.card').find('.btn2').show();
			// $(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
			// $(this).closest('.card').find('.btn2').css('--quantity', currentQuant);
			// console.log('.btn quant value', $(this).closest('.card').find('.btn2').css('--quantity'));
		});
});

const orderToppingsDict = {};
const drinkDict = {};
orderToppingsDict['drinks'] = [];
function checkOut() {
	// $('.card-deck').each(function () {
	// 	// create a drink category (ex. coffee) for each key in the drink dict
	// 	// drinkDict[`${$(this).attr('id')}`] = [];
	// 	const selectedItemCategoryIndex = $(this).attr('id');
	// 	drinkDict[`${drinkCategories[selectedItemCategoryIndex]}`] = [];
	// });

	// $('.btn2').each(function () {
	// var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
	// var toppingCategory = toppingCategoryAndToppingNameArray[0];
	// var toppingName = toppingCategoryAndToppingNameArray[1];

	// if ($(this).css(`--${toppingCategory}`) == toppingName) {
	// 		var toppingDictionary = {};
	// 		if (toppingCategory == 'temperature') {
	// 			const temperature = $(`#temperature`).find('.card-title').text();
	// 			console.log('temperature: %s', temperature);

	// 			toppingDictionary['name'] = temperature;
	// 			toppingDictionary['price'] = 0;
	// 		} else {
	// 			if ($(this).css('--half') == 'true') {
	// 				toppingDictionary['servingSize'] = 'half';
	// 			} else if ($(this).css('--regular') == 'true') {
	// 				toppingDictionary['servingSize'] = 'regular';
	// 			} else if ($(this).css('--extra') == 'true') {
	// 				toppingDictionary['servingSize'] = 'extra';
	// 			}
	// 			// if the drink is a drink with a quantity then it won't have half or regular or extra and the previous if blocks won't grab the topping name
	// 			else {
	// 				toppingDictionary['servingSize'] = 'regular';
	// 			}

	// 			// console.log('toppingName: %s', toppingName);
	// 			toppingDictionary['quantity'] = $(this).css('--quantity');
	// 			toppingDictionary['name'] = toppingName;
	// 			if ($(this).css('--price')) {
	// 				// console.log('price', $(this).css('--price'));
	// 				toppingDictionary['price'] = parseFloat($(this).css('--price'));
	// 			} else {
	// 				toppingDictionary['price'] = 0;
	// 			}
	// 		}

	// 		drinkDict[`${toppingCategory}`].push(toppingDictionary);
	// 	}
	// });

	var orderItems = userOrderDrink;
	console.log('oldOrderItems', orderItems);
	//https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
	// var proteinCategoryCount = [];
	const coffeeArray = orderItems['coffee'];
	var orderTotal = 0;
	for (var key in orderItems) {
		console.log('key: %s', key);

		const drinksForItemCategory = orderItems[key];
		// console.log('drinksForItemCategory', drinksForItemCategory);
		if (drinksForItemCategory.length) {
			// console.log('drinksForItemCategory', drinksForItemCategory);
			for (var i = 0; i < drinksForItemCategory.length; i++) {
				var drink = drinksForItemCategory[i];
				// console.log('drink', drink);

				const itemQuantity = drink['quantity'];
				const itemServingSize = drink['servingSize'];
				// console.log('preParse', drink['price']);
				var itemPrice = drink['price'];
				if (key === 'coffee') {
					var espressoPrice = 0;
					const espressoDict = {};
					if (itemServingSize === 'extra') {
						espressoPrice = 3;
						espressoDict['quantity'] = 3;
					} else if (itemServingSize === 'regular') {
						espressoPrice = 2;
						espressoDict['quantity'] = 2;
					} else if (itemServingSize === 'half') {
						espressoPrice = 2;
						espressoDict['quantity'] = 1;
					}
					// console.log('itemPricetoFixed', espressoPrice);
					espressoDict['price'] = espressoPrice;
					espressoDict['name'] = 'espresso';
					drink['espresso'] = espressoDict;
					orderTotal += espressoPrice;
				} else if (key === 'milk') {
					coffeeArray[0]['milk'] = drink;
					// create a new key in the coffee dictionary whose value is the milk dictionary. remmeber that the coffee dictionary is the first element of the coffee array (selecting the first element of the coffee array works because the user can only order one coffee per visit to this page)
					// after cloning the dictionary, delete the milk category from orderItems
					orderTotal += drink['price'];
					delete orderItems[key];
				} else if (key === 'syrup') {
					var syrupPrice = 0;
					const dictSource = {};
					if (itemServingSize === 'extra') {
						syrupPrice = 2;
						dictSource['servingSize'] = itemServingSize;
					} else {
						syrupPrice = 1;
						dictSource['servingSize'] = itemServingSize;
					}
					dictSource['price'] = syrupPrice;
					orderTotal += syrupPrice;
					dictSource['name'] = drink['name'];
					// recompartmentalize the syrup dictionary into the coffee dictionary in the coffee array then delete the syrup category from orderItems
					coffeeArray[0]['syrup'] = dictSource;
					delete orderItems[key]; // https://www.tutorialspoint.com/Remove-elements-from-a-Dictionary-using-Javascript
				} else if (key === 'temperature') {
					coffeeArray[0]['temperature'] = drink;
					delete orderItems[key];
					for (var key in orderItems) {
						// console.log('key', key);
						// console.log('value', orderItems[key]);
					}

					// create a new key in the coffee dictionary whose value is the milk dictionary. remmeber that the coffee dictionary is the first element of the coffee array (selecting the first element of the coffee array works because the user can only order one coffee per visit to this page)
					// after cloning the dictionary, delete the milk category from orderItems
				} else if (key === 'milkshake') {
					// console.log('itemQuantity', itemQuantity);
					// console.log('itemPrice', itemPrice);
					const milkShakePrice = itemQuantity * itemPrice;
					const dictSource = {};
					dictSource['price'] = milkShakePrice;
					var milkshakeName = drink['name'];
					milkshakeName += 'Milkshake';
					dictSource['name'] = milkshakeName;
					orderTotal += milkShakePrice;
					Object.assign(drink, dictSource);
				} else if (key === 'bottled') {
					const bottledPrice = itemQuantity * itemPrice;
					const dictSource = {};
					dictSource['price'] = bottledPrice;
					orderTotal += bottledPrice;
					Object.assign(drink, dictSource);
				} else if (key === 'non-coffee') {
					const nonCoffeePrice = itemQuantity * itemPrice;
					const dictSource = {};
					dictSource['price'] = nonCoffeePrice;
					Object.assign(drink, dictSource);
				}
			}
			// need to populate the milk values
		} else if (key === 'milk' && coffeeArray[0]) {
			// console.log('fuck');
			const milkDict = {};
			milkDict['name'] = '2%Milk';
			milkDict['servingSize'] = 'regular';
			milkDict['price'] = 0;
			coffeeArray[0]['milk'] = milkDict;
		}
	}
	console.log('newOrderItems', orderItems);

	orderToppingsDict['drinks'] = drinkDict;
	// console.log('drinks dict', orderToppingsDict);
	// console.log('orderToppingsDictwithIngredient', orderToppingsDict);
	//https://developer.mozilla.org/en-US/docs/Web/API/Window/location
	if (editDrinkIndex != undefined) {
		// stringify(orderToppingsDict);

		$.when(stringify(orderToppingsDict)).then(location.assign('/order?userOrder=true'));
	} else {
		// stringify(orderToppingsDict);

		$.when(stringify(orderToppingsDict)).then(location.assign('/order/side'));
	}
}
// all this code changes display for smaller screen sizes
//https://stackoverflow.com/questions/15876302/uncaught-typeerror-cannot-read-property-clientwidth-of-null
var cWidth = $(window).width();
//https://stackoverflow.com/questions/1974788/combine-onload-and-onresize-jquery
$(window).on('load resize', function () {
	newWidth = $(window).width();

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
