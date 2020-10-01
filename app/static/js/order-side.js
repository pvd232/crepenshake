//https://stackoverflow.com/questions/15876302/uncaught-typeerror-cannot-read-property-clientwidth-of-null
//https://stackoverflow.com/questions/4381228/jquery-selector-inside-the-each-method
//https://stackoverflow.com/questions/4735342/jquery-to-loop-through-elements-with-the-same-class
('use strict');

var sideCategoryDataArray;
var sideTypes;
var sideNames;
var newSideNames = new Array();
var sideNames = new Array()
var croissants;
var iceCreamBowls;
var toppings;
var toppingServingSizes;
var userOrderSide;
var editSideIndex = null;

const stringify = (dataObject) => {
	// there will only ever be one item in local storage because a customer can only have 1 order in their shopping cart.
	// the object is a dictionary with a key called order and the value being an array which will hold each crepe as either a menu crepe object
	// or an orderCrepe array, the order props, a sides array, and a sides array

	//don't want to store an empty order
	if (dataObject.orderSide.length) {
		if (editSideIndex === null) {
			if (localStorage.length > 0) {
				const order = new Order();
				order.fromJSON(localStorage.getItem(localStorage.key(0)));
				console.log('order local stor > 0', order);
				if (order.orderSide.length) {
					const sideOrderTotal = dataObject.orderTotal;
					console.log("sideOrderTotal: %s", sideOrderTotal)
					
					order.orderTotal += sideOrderTotal;
					order.orderSide.push(dataObject.orderSide[0]);
					const stringifiedDataObject = JSON.stringify(order);
					console.log('stringifiedDataObject', stringifiedDataObject);
					localStorage.setItem('order', stringifiedDataObject);
				} else {
					const sideOrderTotal = dataObject.orderTotal;
					console.log('sideOrderTotal: %s', sideOrderTotal);
					
					order.orderTotal += sideOrderTotal;
					order.orderSide = [...dataObject.orderSide]
					const stringifiedDataObject = JSON.stringify(order);
					console.log('order', order);
					console.log('stringifiedDataObject', stringifiedDataObject);
					localStorage.setItem('order', stringifiedDataObject);
				}
			} else {
				const stringifiedDataObject = JSON.stringify(dataObject);
				console.log('stringifiedDataObject', stringifiedDataObject);
				localStorage.setItem('order', stringifiedDataObject);
			}
		} else {
			var currentOrder = JSON.parse(localStorage.getItem(localStorage.key(0)));
			var currentOrderSideList = currentOrder.orderSide;
			var currentOrderSide = currentOrderSideList[editSideIndex];
			Object.assign(currentOrderSide, dataObject);
			// if a previously had two proteins and then i remove one then i will have an empty object in my array that i don't want
			for (var i = 0; i < currentOrderSideList.length; i++) {
				if (currentOrderSideList[i] === {}) {
					currentOrderSideList.splice(i);
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

export class Topping {
	constructor(id = null, servingSize = null, price = 0) {
		this.id = id;
		this.servingSize = servingSize;
		this.price = price;
	}
	get id() {
		return this._id;
	}
	get servingSize() {
		return this._quantity;
	}
	get price() {
		return this._price;
	}
	set id(value) {
		this._id = value;
	}
	set servingSize(value) {
		this._servingSize = value;
	}
	set price(value) {
		this._price = value;
	}
	initFromHTML = (index, selectedItemCategoryIndex) => {
		const newTopping = sideCategoryDataArray[selectedItemCategoryIndex][index];
		const toppingId = newTopping.id;
		const toppingPrice = newTopping.price;
		const toppingServingSize = newTopping.serving_size;

		this._id = toppingId;
		this._price = toppingPrice;
		this._servingSize = toppingServingSize;
	};
	toJSON = () => {
		const data = {
			id: this._id,
			servingSize: this._servingSize,
			price: this._price,
		};
		return data;
	};
	fromJSON = (json) => {
		data = JSON.parse(json);
		const toppingId = data.id;
		const toppingPrice = data.price;
		const toppingServingSize = data.servingSize;
		return new Topping(toppingId, toppingServingSize, toppingPrice);
	};
}

export class Croissant {
	constructor(id = null, flavor = null, price = null, quantity = 1, sideName = null) {
		this.id = id;
		this.flavor = flavor;
		this.price = price;
		this.quantity = quantity;
		this.sideName = sideName;
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
	get sideName() {
		return this._sideName;
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
	set sideName(value) {
		this._sideName = value;
	}

	initFromHTML = (index, selectedItemCategoryIndex) => {
		const newCroissant = sideCategoryDataArray[selectedItemCategoryIndex][index];
		const croissantId = newCroissant.id;
		const croissantPrice = newCroissant.price;
		const croissantFlavor = newCroissant.flavor;
		const croissantSideName = newSideNames[selectedItemCategoryIndex].side_name_id;

		this._id = croissantId;
		this._flavor = croissantFlavor;
		this._price = croissantPrice;
		this._sideName = croissantSideName;
	};
	toJSON = () => {
		const data = {
			id: this._id,
			flavor: this._flavor,
			price: this._price,
			quantity: this._quantity,
			sideName: this._sideName,
		};
		return data;
	};
	fromJSON = (json) => {
		data = JSON.parse(json);
		const croissantId = data.id;
		const croissantFlavor = data.flavor;
		const croissantPrice = data.price;
		const croissantQuantity = data.quantity;
		const croissantSideName = data.sideName;
		return new Croissant(croissantId, croissantFlavor, croissantPrice, croissantQuantity, croissantSideName);
	};
	updateCroissantQuantity = (value) => {
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

export class IceCreamBowl {
	constructor(id = null, flavor = null, price = null, quantity = 1, sideName = null, toppings = new Array()) {
		this.id = id;
		this.flavor = flavor;
		this.price = price;
		this.quantity = quantity;
		this.sideName = sideName;
		this.toppings = toppings;
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
	get sideName() {
		return this._sideName;
	}
	get toppings() {
		return this._toppings;
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
	set sideName(value) {
		this._sideName = value;
	}
	set toppings(value) {
		this._toppings = value;
	}

	initFromHTML = (index, selectedItemCategoryIndex) => {
		const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;
		const iceCreamId = iceCreamBowls[index].id;
		const iceCreamFlavor = iceCreamBowls[index].flavor;
		const iceCreamPrice = iceCreamBowls[index].price;
		const iceCreamSideName = selectedItemCategory;

		//the default quantity will persist during initialization and no toppings will be present
		this._id = iceCreamId;
		this._flavor = iceCreamFlavor;
		this._price = iceCreamPrice;
		this._sideName = iceCreamSideName;
	};

	toJSON = () => {
		const data = {
			id: this._id,
			flavor: this._flavor,
			price: this._price,
			quantity: this._quantity,
			sideName: this._sideName,
			toppings: this._toppings,
		};
		return data;
	};
	fromJSON = (json) => {
		data = JSON.parse(json);
		const id = data.id;
		const flavor = data.flavor;
		const price = data.price;
		const quantity = data.quantity;
		const sideName = data.sideName;
		const toppings = data.toppings;
		return new IceCreamBowl(id, flavor, price, quantity, sideName, toppings);
	};
	updateIceCreamBowlQuantity = (value) => {
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

class Order {
	constructor(
		orderCrepe = new Array(),
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
		data = JSON.parse(json);
		return new Order(data.orderCrepe, data.orderDrink, data.orderSide, data.orderTotal, data.customerData);
	};
	checkIfIceCreamSelected = () => {
		for (var i = 0; i < this.orderSide.length; i++) {
			console.log('this.orderSide[i].sideName: %s', this.orderSide[i].sideName);

			if (this.orderSide[i].sideName === 'ice_cream_bowl') {
				console.log('true');
				return true;
			}
		}
		return false;
	};
	checkIfThisToppingSelected = (index, selectedItemCategoryIndex) => {
		const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;
		console.log('selectedItemCategory: %s', selectedItemCategory);

		if (selectedItemCategory === 'topping') {
			const topping = sideCategoryDataArray[selectedItemCategoryIndex][index];
			console.log('topping: %s', topping);
			for (var key in topping) {
				console.log('key: %s', key);
				console.log('topping: %s', topping[key]);
			}
			for (var i = 0; i < this.orderSide.length; i++) {
				if (this.orderSide[i].sideName === 'ice_cream_bowl') {
					if (this.orderSide[i].toppings.length) {
						for (var j = 0; j < this.orderSide[i].toppings.length; j++) {
							if (this.orderSide[i].toppings[j].id === topping.id) {
								return true;
							}
						}
					}
				}
			}
		}
		return false;
	};
	checkIfThisSideSelected = (index, selectedItemCategoryIndex) => {
		const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;
		if (selectedItemCategory != 'topping') {
			for (var i = 0; i < this.orderSide.length; i++) {
				const selectedSide = sideCategoryDataArray[selectedItemCategoryIndex][index];
				for (var key in selectedSide) {
					console.log('key: %s', key);

					console.log('selectedSide: %s', selectedSide[key]);
				}
				if (this.orderSide[i].id === selectedSide.id) {
					return true;
				}
			}
		}
		return false;
	};
	changeSideQuantity = (index, selectedItemCategoryIndex, value) => {
		const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;
		if (selectedItemCategory != 'topping') {
			const selectedSide = this.findSide(index, selectedItemCategoryIndex);
			if (!selectedSide) {
				const addedSide = this.addSide(index, selectedItemCategoryIndex);
				if (this.checkIfIceCreamSelected()) {
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
						});
				}
				return addedSide;
			} else {
				if (selectedItemCategory === 'croissant') {
					selectedSide.updateCroissantQuantity(value);
					if (selectedSide.quantity === 0) {
						userOrderSide.removeSide(index, selectedItemCategoryIndex);
					}
					return selectedSide;
				} else if (selectedItemCategory === 'ice_cream_bowl') {
					selectedSide.updateIceCreamBowlQuantity(value);
					if (selectedSide.quantity === 0) {
						userOrderSide.removeSide(index, selectedItemCategoryIndex);
					}
					if (this.checkIfIceCreamSelected()) {
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
							});
					}
					return selectedSide;
				}
			}
		}
				
	};
	findSide = (index, selectedItemCategoryIndex) => {
		const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;
		const selectedSide = sideCategoryDataArray[selectedItemCategoryIndex][index];
		if (selectedItemCategory != 'topping') {
			for (var i = 0; i < this.orderSide.length; i++) {
				if (this.orderSide[i].id === selectedSide.id) {
					return this.orderSide[i];
				}
			}
		}
		return false;
	};
	addSide = (index, selectedItemCategoryIndex) => {
		const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;
		if (!this.findSide(index, selectedItemCategoryIndex)) {
			if (selectedItemCategory === 'ice_cream_bowl') {
				const newIceCreamBowl = new IceCreamBowl();
				newIceCreamBowl.initFromHTML(index, selectedItemCategoryIndex);
				this.orderSide.push(newIceCreamBowl);
				return newIceCreamBowl;
			} else if (selectedItemCategory === 'croissant') {
				const croissant = new Croissant();
				croissant.initFromHTML(index, selectedItemCategoryIndex);
				this.orderSide.push(croissant);
				return croissant;
			}
		}
	};
	removeSide = (index, selectedItemCategoryIndex) => {
		for (var i = 0; i < this.orderSide.length; i++) {
			const selectedSide = sideCategoryDataArray[selectedItemCategoryIndex][index];
			if (selectedSide.id === this.orderSide[i].id) {
				this.orderSide.splice(i, 1);
				return true;
			}
		}
		return false;
	};
	addTopping = (index, selectedItemCategoryIndex, servingSize) => {
		const newTopping = new Topping();
		newTopping.initFromHTML(index, selectedItemCategoryIndex, servingSize);
		for (var i = 0; i < this.orderSide.length; i++) {
			if (this.orderSide[i].sideName === 'ice_cream_bowl') {
				this.orderSide[i].toppings.push(newTopping);
				return newTopping;
			}
		}
		return false;
	};
	removeTopping = (index, selectedItemCategoryIndex) => {
		const selectedTopping = sideCategoryDataArray[selectedItemCategoryIndex][index];
		for (var i = 0; i < this.orderSide.length; i++) {
			if (this.orderSide[i].sideName === 'ice_cream_bowl') {
				if (this.orderSide[i].toppings.length) {
					for (var j = 0; j < this.orderSide[i].toppings.length; j++) {
						if (this.orderSide[i].toppings[j].id === selectedTopping.id) {
							this.orderSide[i].toppings.splice(j, 1);
							return true;
						}
					}
				}
			}
		}
		return false;
	};
}
var file = location.href.split('/').pop();
if (file === 'side') {
	const checkOut = () => {
		const order = new Order();
		//the order object will have one key drinks, which has an array as its value which will store drink category objects which will have the key as the drink category they represent, and an array for the value which will store individual drink objects
		const orderSide = {};
		orderSide['sideNames'] = [];
		for (var i = 0; i < sideNames.length; i++) {
			const sideNameDict = {};
			const sidesForSideNameArray = new Array();

			sideNameDict['sideName'] = sideNames[i].side_name_id;
			console.log('sideNames[i].side_name_id: %s', sideNames[i].side_name_id);

			sideNameDict['sides'] = sidesForSideNameArray;
			for (var j = 0; j < userOrderSide.orderSide.length; j++) {
				if (userOrderSide.orderSide[j].sideName === sideNames[i].side_name_id) {
					const sideQuantity = userOrderSide.orderSide[j].quantity;
					const price = userOrderSide.orderSide[j].price;
					var sidePrice = sideQuantity * price;
					order.orderTotal += sidePrice;
					sideNameDict['sides'].push(userOrderSide.orderSide[j]);
				}
			}
			orderSide['sideNames'].push(sideNameDict);
		}
		order.orderSide.push(orderSide);
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
		console.log("sideNames: %s", sideNames)
	
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
	
		$('#checkout')
			.unbind('click')
			.bind('click', function () {
				checkOut();
			});
	
		$('.card-img-top').each(function () {
			const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
			const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;
			if (selectedItemCategory == 'ice_cream_bowl') {
				$('<button class="btn2" type="button">1</button>').insertAfter($(this));
				$(`<div class="grid-container"  style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
					$(this)
				);
			} else if (selectedItemCategory == 'croissant') {
				$('<button class="btn2" type="button">1</button>').insertAfter($(this));
				$(`<div class="grid-container" style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
					$(this)
				);
			} else if (selectedItemCategory == 'topping') {
				$('<button class="btn" id=servingSize-2 type="button">Customize</button>').insertAfter($(this));
				$('<button class="btn4" id=servingSize-1 type="button">Regular</button>').insertAfter($(this));
				$('<button class="btn3" id=servingSize-0 type="button">Light</button>').insertAfter($(this));
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
		// const x = document.getElementsByClassName('card-title');
		// const y = [];

		// for (i = 2; i < x.length; i++) {
		// 	y.push(x[i].innerHTML);
		// }

		$('.card-img-top').each(function () {
			this.src = '../static/images/vanilla_ice_cream.jpg';
		});

		userOrderSide = new Order();
		//veggie + all other topping functionality
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
							if (!userOrderSide.findSide(selectedItemIndex, selectedItemCategoryIndex)) {
								const updatedSide = userOrderSide.changeSideQuantity(
									selectedItemIndex,
									selectedItemCategoryIndex,
									'increase'
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
							userOrderSide.checkIfThisToppingSelected(selectedItemIndex, selectedItemCategoryIndex)
						) {
							userOrderSide.removeTopping(selectedItemIndex, selectedItemCategoryIndex);
							$(this).closest('.card').find('.btn2').hide();
						} else if (
							selectedItemCategory === 'topping' &&
							!userOrderSide.checkIfThisToppingSelected(selectedItemIndex, selectedItemCategoryIndex)
						) {
							if (userOrderSide.checkIfIceCreamSelected()) {
								const servingSizeIndex = $(this).closest('.card').find('.btn').attr('id').split('-')[1];
								const toppingServingSize = toppingServingSizes[servingSizeIndex];
								const newTopping = userOrderSide.addTopping(
									selectedItemIndex,
									selectedItemCategoryIndex,
									toppingServingSize
								);

								$(this).closest('.card').find('.btn').show();
								$(this).closest('.card').find('.btn2').html(newTopping.quantity);
								$(this).closest('.card').find('.btn2').show();
								//after clicking the card show the + and - buttons
								$(this).closest('.card').find('.btn6').show();
								$(this).closest('.card').find('.btn7').show();
							}
						}
					});
			})
			.on('mouseleave', '.card', function () {
				const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
				const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
				const selectedItemCategory = newSideNames[selectedItemCategoryIndex].side_name_id;
				if (selectedItemCategory === 'topping') {
					if (!userOrderSide.checkIfThisToppingSelected(selectedItemIndex, selectedItemCategoryIndex)) {
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
					const servingSizeIndex = $(this).attr('id').split('-')[1];
					const toppingServingSize = toppingServingSizes[servingSizeIndex];
					if ($(this).html() == 'Customize') {
						$(this).blur();
						$(this).html('Extra');
						$(this).closest('.card').find('.btn3').show();
						$(this).closest('.card').find('.btn4').show();
					} else {
						userOrderSide.addTopping(selectedItemIndex, selectedItemCategoryIndex, toppingServingSize);
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
					const toppingServingSize = toppingServingSizes[servingSizeIndex];
					userOrderSide.addTopping(selectedItemIndex, selectedItemCategoryIndex, toppingServingSize);
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
					const toppingServingSize = toppingServingSizes[servingSizeIndex];
					userOrderSide.addTopping(selectedItemIndex, selectedItemCategoryIndex, toppingServingSize);
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
				const updatedSide = userOrderSide.changeSideQuantity(
					selectedItemIndex,
					selectedItemCategoryIndex,
					'decrease'
				);
				if (updatedSide) {
					if (updatedSide.quantity <= 0) {
						$(this).closest('.card').find('.btn2').hide();
						$(this).closest('.card').find('.btn2').html(updatedSide.quantity);
						$(this).hide();
						$(this).closest('.card').find('.btn7').hide();
					} else {
						$(this).closest('.card').find('.btn2').html(updatedSide.quantity);
						$(this).closest('.card').find('.btn2').show();
					}
				}
			});

		$('.btn7')
			.unbind('click')
			.bind('click', function () {
				const selectedItemIndex = $(this).closest('.card').attr('id').split('-')[1];
				const selectedItemCategoryIndex = $(this).closest('.card-deck').attr('id').split('-')[1];
				const updatedSide = userOrderSide.changeSideQuantity(
					selectedItemIndex,
					selectedItemCategoryIndex,
					'increase'
				);
				$(this).closest('.card').find('.btn2').html(updatedSide.quantity);
				$(this).closest('.card').find('.btn2').show();
			});
	});

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
}