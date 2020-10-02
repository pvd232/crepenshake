// Drinks Models
export class Drink {
	constructor(name = null, price = 0, quantity = 1, servingSize = 
		'regular', drinkCategory = null) {
		this.name = name;
		this.price = price;
		this.quantity = quantity;
		this.servingSize = servingSize;
		this.drinkCategory = drinkCategory;
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
	get servingSize() {
		return this._servingSize;
	}
	get drinkCategory() {
		return this._drinkCategory;
	}
	set name(value) {
		this._name = value;
	}
	set price(value) {
		this._price = value;
	}
	set quantity(value) {
		this._quantity = value;
	}
	set servingSize(value) {
		this._servingSize = value;
	}
	set drinkCategory(value) {
		this._drinkCategory = value;
	}
	initFromHTML = (index, selectedItemCategoryIndex, drinkCategoryDataArray, newDrinkCategories) => {
		const newDrink = drinkCategoryDataArray[selectedItemCategoryIndex][index];
		const drinkCategory = newDrinkCategories[selectedItemCategoryIndex].id;
		for (var i = 0; i < drinkCategoryDataArray.length; i++) {
			console.log(drinkCategoryDataArray[i]);
		}
		const drinkName = newDrink.name;
		const drinkPrice = newDrink.price;
		const drinkServingSize = newDrink.serving_size;

		this._name = drinkName;
		this._price = drinkPrice;
		this._drinkCategory = drinkCategory;
		this._servingSize = drinkServingSize;
	};
	toJSON = () => {
		const data = {
			name: this._name,
			price: this._price,
			quantity: this._quantity,
			servingSize: this._servingSize,
			drinkCategory: this._drinkCategory,
		};
		console.log('toJSON data: %s', data);
		return data;
	};
	fromJSON = (json) => {
		const data = json;
		console.log('fromJSON data', data);
		this._name = data.name;
		this._price = data.price;
		this._quantity = data.quantity;
		this.servingSize = data.servingSize;
		this._drinkCategory = data.drinkCategory;
	};
	updateDrinkQuantity = (value) => {
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

export class Coffee {
	constructor(
		id = null,
		name = null,
		servingSize = null,
		temperature = null,
		flavorSyrup = null,
		flavorSyrupServingSize = null,
		espressoServingSize = null,
		espressoPrice = null,
		milkType = null,
		milkPrice = 0,
		price = null,
		drinkCategory = null,
		quantity = 1
	) {
		this.id = id;
		this.name = name;
		this.servingSize = servingSize;
		this.temperature = temperature;
		this.flavorSyrup = flavorSyrup;
		this.flavorSyrupServingSize = flavorSyrupServingSize;
		this.espressoServingSize = espressoServingSize;
		this.espressoPrice = espressoPrice;
		this.milkType = milkType;
		this.milkPrice = milkPrice;
		this.price = price;
		this.drinkCategory = drinkCategory;
		this.quantity = quantity;
	}
	get id() {
		return this._id;
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
	get flavorSyrupServingSize() {
		return this._flavorServingSize;
	}
	get espressoServingSize() {
		return this._espressoServingSize;
	}
	get espressoPrice() {
		return this._espressoPrice;
	}
	get milkType() {
		return this._milkType;
	}
	get milkPrice() {
		return this._milkPrice;
	}
	get price() {
		return this._price;
	}
	get drinkCategory() {
		return this._drinkCategory;
	}
	get quantity() {
		return this._quantity;
	}
	set id(value) {
		this._id = value;
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
	set flavorSyrupServingSize(value) {
		this._flavorServingSize = value;
	}
	set espressoServingSize(value) {
		this._espressoServingSize = value;
	}
	set espressoPrice(value) {
		this._espressoPrice = value;
	}
	set milkType(value) {
		this._milkType = value;
	}
	set milkPrice(value) {
		this._milkPrice = value;
	}
	set price(value) {
		this._price = value;
	}
	set drinkCategory(value) {
		this._drinkCategory = value;
	}
	set quantity(value) {
		this._quantity = value;
	}

	initFromHTML = (index, espressoServingSize, selectedItemCategoryIndex, drinkCategoryDataArray) => {
		const coffeeName = drinkCategoryDataArray[selectedItemCategoryIndex][index].name;
		const coffeePrice = coffeeDrinks[index].price;
		const coffeeServingSize = coffeeDrinks[index].serving_size;
		// UUID will be generated in the backend
		this._name = coffeeName;
		this._price = coffeePrice;
		this._servingSize = coffeeServingSize;
		this._espressoServingSize = espressoServingSize;
		if (espressoServingSize === 'extra') {
			this._espressoPrice = 2;
		} else {
			this._espressoPrice = 0;
		}
		this._drinkCategory = 'coffee';
	};

	toJSON = () => {
		// if they didn't select a milk then the default is 2%
		if (!this._milkType) {
			this._milkType = '2% Milk';
		}
		const data = {
			id: this._id,
			name: this._name,
			servingSize: this._servingSize,
			temperature: this._temperature,
			flavorSyrup: this._flavorSyrup,
			flavorSyrupServingSize: this._flavorServingSize,
			espressoServingSize: this._espressoServingSize,
			espressoPrice: this._espressoPrice,
			milkType: this._milkType,
			milkPrice: this._milkPrice,
			price: this._price,
			drinkCategory: this._drinkCategory,
			quantity: this._quantity,
		};
		return data;
	};
	fromJSON = (json) => {
		const data = json;
		console.log('fromJSON data: %s', data);
		this._id = data.id;
		this._name = data.name;
		this._servingSize = data.servingSize;
		this._temperature = data.temperature;
		this._flavorSyrup = data.flavorSyrup;
		this._flavorSyrupServingSize = data.flavorSyrupServingSize;
		this._espressoServingSize = data.espressoServingSize;
		this._espressoPrice = data.espressoPrice;
		this._milkType = data.milkType;
		this._milkPrice = data.milkPrice;
		this._price = data.price;
		this._quantity = data.quantity;
		this._drinkCategory = data.drinkCategory;
	};
}

export class Order {
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
		// console.log('this.data: %s', this.data);
		return data;
	};
	fromJSON = (json) => {
		const data = JSON.parse(json);
		console.log('data order: %s', data);
		console.log('data order: %s', JSON.stringify(data));
		console.log('data.orderCrepe: %s', data.orderCrepe);
		console.log('data.orderDrink: %s', data.orderDrink);
		console.log('data.orderSide: %s', data.orderSide);
		for (var i = 0; i < data.orderDrink.length; i++) {
			console.log('data.orderDrink[i]: %s', JSON.stringify(data.orderDrink[i]));
			const newDrinkOrder = new OrderDrink();
			newDrinkOrder.fromJSON(data.orderDrink[i]);
			console.log('newDrinkOrder: %s', JSON.stringify(newDrinkOrder));
			this._orderDrink.push(newDrinkOrder);
		}
		for (var i = 0; i < data.orderSide.length; i++) {
			const newSideOrder = new OrderSide();
			newSideOrder.fromJSON(data.orderSide[i]);
			console.log('newSideOrder: %s', newSideOrder);
			console.log('newSideOrder: %s', JSON.stringify(newSideOrder));
			this._orderSide.push(newSideOrder);
		}
		for (var i = 0; i < data.orderCrepe.length; i++) {
			const newCrepeOrder = new OrderCrepe();
			newCrepeOrder.fromJSON(data.orderCrepe[i]);
			console.log('newCrepeOrder: %s', newCrepeOrder);
			console.log('newCrepeOrder: %s', JSON.stringify(newCrepeOrder));
			this._orderCrepe.push(newCrepeOrder);
		}
		this._orderTotal = data.orderTotal;
		this._customerData = data.customerData;
	};
}

export class OrderDrink {
	constructor(orderDrink = new Array(), orderTotal = 0) {
		this.orderDrink = orderDrink;
		this.orderTotal = orderTotal;
	}

	get orderDrink() {
		return this._orderDrink;
	}
	get orderTotal() {
		return this._orderTotal;
	}
	set orderDrink(value) {
		this._orderDrink = value;
	}
	set orderTotal(value) {
		this._orderTotal = value;
	}
	toJSON = () => {
		const data = {
			orderDrink: this._orderDrink,
			orderTotal: this._orderTotal,
		};
		// console.log('this.data: %s', this.data);
		return data;
	};
	fromJSON = (json) => {
		const data = json;
		for (var i = 0; i < data.orderDrink.length; i++) {
			console.log('data.orderDrink: %s', JSON.stringify(data.orderDrink[i]));
			const drinkCategory = data.orderDrink[i].drinkCategory;
			if (drinkCategory != 'coffee') {
				const newDrink = new Drink();
				newDrink.fromJSON(data.orderDrink[i]);
				console.log('newDrink: %s', JSON.stringify(newDrink));
				this._orderDrink.push(newDrink);
			} else {
				const newCoffee = new Coffee();
				newCoffee.fromJSON(data.orderDrink[i]);
				console.log('newCoffee: %s', JSON.stringify(newCoffee));
				this._orderDrink.push(newCoffee);
			}
		}
		this._orderTotal = data.orderTotal;
	};
	checkIfCoffeeSelected = () => {
		for (var i = 0; i < this._orderDrink.length; i++) {
			if (this._orderDrink[i].drinkCategory === 'coffee') {
				return true;
			}
		}
		return false;
	};
	checkIfTempSelected = () => {
		for (var i = 0; i < this._orderDrink.length; i++) {
			if (this._orderDrink[i].drinkCategory === 'coffee') {
				if (this._orderDrink[i].temperature) {
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	};
	checkIfThisTempSelected = (index, selectedItemCategory, drinkCategoryDataArray) => {
		const temp = drinkCategoryDataArray[selectedItemCategoryIndex][index];
		if (selectedItemCategory === 'temperature') {
			for (var i = 0; i < this._orderDrink.length; i++) {
				if (this._orderDrink[i].drinkCategory === 'coffee') {
					if (this._orderDrink[i].temperature === temp.id) {
						return true;
					} else {
						return false;
					}
				}
			}
		}
		return false;
	};
	checkIfMilkSelected = () => {
		for (var i = 0; i < this._orderDrink.length; i++) {
			if (this._orderDrink[i].drinkCategory === 'coffee') {
				if (this._orderDrink[i].milkType) {
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	};
	checkIfThisMilkSelected = (index, selectedItemCategory, drinkCategoryDataArray) => {
		if (selectedItemCategory === 'milk') {
			const milk = drinkCategoryDataArray[selectedItemCategory][index];
			for (var i = 0; i < this._orderDrink.length; i++) {
				if (this._orderDrink[i].drinkCategory === 'coffee') {
					if (this._orderDrink[i].milkType === milk.id) {
						return true;
					} else {
						return false;
					}
				}
			}
		}
		return false;
	};
	checkIfThisSyrupSelected = (index, selectedItemCategory, drinkCategoryDataArray) => {
		if (selectedItemCategory === 'syrup') {
			const syrup = drinkCategoryDataArray[selectedItemCategory][index];
			for (var i = 0; i < this._orderDrink.length; i++) {
				if (this._orderDrink[i].drinkCategory === 'coffee') {
					if (this._orderDrink[i].flavorSyrup === syrup.coffee_syrup_flavor) {
						return true;
					} else {
						return false;
					}
				}
			}
		}
		return false;
	};
	checkIfThisDrinkSelected = (index, selectedItemCategoryIndex, drinkCategoryDataArray) => {
		for (var i = 0; i < this._orderDrink.length; i++) {
			const selectedDrink = drinkCategoryDataArray[selectedItemCategoryIndex][index];
			if (
				this._orderDrink[i].name === selectedDrink.name &&
				this._orderDrink[i].servingSize === selectedDrink.serving_size
			) {
				return true;
			}
		}
		return false;
	};
	changeDrinkQuantity = (index, selectedItemCategoryIndex, value, drinkCategoryDataArray, newDrinkCategories) => {
		if (!this.findDrink(index, selectedItemCategoryIndex, drinkCategoryDataArray)) {
			this.addDrink(index, selectedItemCategoryIndex, drinkCategoryDataArray, newDrinkCategories);
		} else {
			this.findDrink(index, selectedItemCategoryIndex, drinkCategoryDataArray).updateDrinkQuantity(value);
		}
	};
	findDrink = (index, selectedItemCategoryIndex, drinkCategoryDataArray) => {
		for (var i = 0; i < this._orderDrink.length; i++) {
			const selectedDrink = drinkCategoryDataArray[selectedItemCategoryIndex][index];
			if (
				this._orderDrink[i].name === selectedDrink.name &&
				this._orderDrink[i].servingSize === selectedDrink.serving_size
			) {
				return this._orderDrink[i];
			}
		}
		return false;
	};
	addDrink = (index, selectedItemCategoryIndex, drinkCategoryDataArray, newDrinkCategories) => {
		if (!this.findDrink(index, selectedItemCategoryIndex, drinkCategoryDataArray)) {
			const drink = new Drink();
			drink.initFromHTML(index, selectedItemCategoryIndex, drinkCategoryDataArray, newDrinkCategories);
			this._orderDrink.push(drink);
			console.log('removeDrinkB4 orderTotal', this._orderTotal);

			this.priceDrinks();
			console.log('addDrink orderTotal', this._orderTotal);
		}
	};
	removeDrink = (index, selectedItemCategoryIndex, drinkCategoryDataArray) => {
		for (var i = 0; i < this._orderDrink.length; i++) {
			const selectedDrink = drinkCategoryDataArray[selectedItemCategoryIndex][index];

			if (selectedDrink.name === this._orderDrink[i].name) {
				this._orderDrink.splice(i, 1);
				console.log('removeDrinkB4 orderTotal', this._orderTotal);

				this.priceDrinks();
				console.log('removeDrinkAfter orderTotal', this._orderTotal);

				return true;
			}
		}
		return false;
	};
	addCoffee = (index, espressoServingSize, selectedItemCategoryIndex, drinkCategoryDataArray) => {
		const coffee = new Coffee();
		coffee.initFromHTML(index, espressoServingSize, selectedItemCategoryIndex, drinkCategoryDataArray);
		this._orderDrink.push(coffee);
		console.log('addCoffeeBefore orderTotal', this._orderTotal);

		this.priceDrinks();
		console.log('addCoffeeAfter orderTotal', this._orderTotal);
	};
	addTemp = (index, selectedItemCategoryIndex, drinkCategoryDataArray) => {
		const temp = drinkCategoryDataArray[selectedItemCategoryIndex][index];
		for (var i = 0; i < this._orderDrink.length; i++) {
			if (this._orderDrink[i].drinkCategory === 'coffee') {
				this._orderDrink[i].temperature = temp.id;
				return true;
			}
		}
		return false;
	};
	removeTemp = () => {
		for (var i = 0; i < this._orderDrink.length; i++) {
			if (this._orderDrink[i].drinkCategory === 'coffee') {
				this._orderDrink[i].temperature = null;
				return true;
			}
		}
		return false;
	};
	addMilk = (index, selectedItemCategoryIndex, drinkCategoryDataArray) => {
		const milk = drinkCategoryDataArray[selectedItemCategoryIndex][index];
		for (var i = 0; i < this._orderDrink.length; i++) {
			if (this._orderDrink[i].drinkCategory === 'coffee') {
				this._orderDrink[i].milkType = milk.id;
				this._orderDrink[i].milkPrice = milk.price;
				this.priceDrinks();

				return true;
			}
		}
		return false;
	};
	removeMilk = () => {
		for (var i = 0; i < this._orderDrink.length; i++) {
			if (this._orderDrink[i].drinkCategory === 'coffee') {
				this._orderDrink[i].milkType = null;
				this._orderDrink[i].milkPrice = null;
				this.priceDrinks();

				return true;
			}
		}
		return false;
	};
	addSyrup = (index, servingSize, selectedItemCategoryIndex, drinkCategoryDataArray) => {
		const syrup = drinkCategoryDataArray[selectedItemCategoryIndex][index];
		for (var i = 0; i < this._orderDrink.length; i++) {
			if (this._orderDrink[i].drinkCategory === 'coffee') {
				this._orderDrink[i].flavorSyrup = syrup.coffee_syrup_flavor;
				this._orderDrink[i].flavorSyrupServingSize = servingSize;
				this.priceDrinks();
				return true;
			}
		}
		return false;
	};
	removeSyrup = () => {
		for (var i = 0; i < this._orderDrink.length; i++) {
			if (this._orderDrink[i].drinkCategory === 'coffee') {
				this._orderDrink[i].coffee_syrup_flavor = null;
				this._orderDrink[i].flavorSyrupServingSize = null;
				this.priceDrinks();
				return true;
			}
		}
		return false;
	};
	priceDrinks = () => {
		this._orderTotal = 0;
		for (var i = 0; i < this._orderDrink.length; i++) {
			console.log('this._orderDrink: %s', JSON.stringify(this._orderDrink[i]));

			if (this._orderDrink[i].drinkCategory === 'coffee') {
				this._orderTotal += this._orderDrink[i].milkPrice;
				var espressoPrice = 0;
				var syrupPrice = 0;
				if (this._orderDrink.espressoServingSize === 'extra') {
					espressoPrice = 2;
				}
				if (this._orderDrink.flavorSyrupServingSize === 'extra') {
					syrupPrice = 1.98;
				} else if (this._orderDrink.flavorSyrupServingSize) {
					syrupPrice = 0.99;
				}
				this._orderTotal += syrupPrice;
				this._orderTotal += espressoPrice;
				this._orderTotal += this._orderDrink[i].price;
			} else {
				this._orderTotal += this._orderDrink[i].quantity * this._orderDrink[i].price;
			}
		}
	};
}

// Side Models
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
		const data = json;
		this._id = data.id;
		this._price = data.price;
		this._servingSize = data.servingSize;
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
		const data = json;
		this._id = data.id;
		this._flavor = data.flavor;
		this._price = data.price;
		this._quantity = data.quantity;
		this._sideName = data.sideName;
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
		const data = json;
		this._id = data.id;
		this._flavor = data.flavor;
		this._price = data.price;
		this._quantity = data.quantity;
		this._sideName = data.sideName;
		for (var i = 0; i < data.toppings.length; i++) {
			const newTopping = new Topping();
			newTopping.fromJSON(data.toppings[i]);
			console.log('newTopping: %s', JSON.stringify(newTopping));
			this._toppings.push(newTopping);
		}
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
export class OrderSide {
	constructor(orderSide = new Array(), orderTotal = 0) {
		this.orderSide = orderSide;
		this.orderTotal = orderTotal;
	}
	get orderSide() {
		return this._orderSide;
	}
	get orderTotal() {
		return this._orderTotal;
	}
	set orderSide(value) {
		this._orderSide = value;
	}
	set orderTotal(value) {
		this._orderTotal = value;
	}
	toJSON = () => {
		const data = {
			orderSide: this._orderSide,
			orderTotal: this._orderTotal,
		};
		return data;
	};
	fromJSON = (json) => {
		const data = json;
		for (var i = 0; i < data.orderSide.length; i++) {
			const sideCategory = data.orderSide[i].sideName;
			if (sideCategory === 'croissant') {
				const newCroissant = new Croissant();
				newCroissant.fromJSON(data.orderSide[i]);
				console.log('newCroissant: %s', newCroissant);
				console.log('newCroissant: %s', JSON.stringify(newCroissant));
				this._orderSide.push(newCroissant);
			} else if (sideCategory === 'ice_cream_bowl') {
				const newIceCreamBowl = new IceCreamBowl();
				newIceCreamBowl.fromJSON(data.orderSide[i]);
				console.log('newIceCreamBowl: %s', newIceCreamBowl);
				console.log('newIceCreamBowl: %s', JSON.stringify(newIceCreamBowl));
				this._orderSide.push(newIceCreamBowl);
			}
		}
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
				this.priceSides();
				return newIceCreamBowl;
			} else if (selectedItemCategory === 'croissant') {
				const croissant = new Croissant();
				croissant.initFromHTML(index, selectedItemCategoryIndex);
				this.orderSide.push(croissant);
				this.priceSides();
				return croissant;
			}
		}
	};
	removeSide = (index, selectedItemCategoryIndex) => {
		for (var i = 0; i < this.orderSide.length; i++) {
			const selectedSide = sideCategoryDataArray[selectedItemCategoryIndex][index];
			if (selectedSide.id === this.orderSide[i].id) {
				this.orderSide.splice(i, 1);
				this.priceSides();
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
				this.priceSides();
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
							this.priceSides();
							return true;
						}
					}
				}
			}
		}
		return false;
	};
	priceSides = () => {
		this._orderTotal = 0;
		if (this._orderSide.length) {
			for (var i = 0; i < this._orderSide.length; i++) {
				if (this._orderSide[i].sideName === 'ice_cream_bowl') {
					var toppingPrice = 0;
					for (var j = 0; j < this._orderSide[i].toppings.length; j++) {
						toppingPrice += this._orderSide[i].toppings[j].price * this._orderSide[i].toppings[j].quantity;
					}
					var iceCreamPrice = this._orderSide[i].price * this._orderSide[i].quantity;
					this._orderTotal += toppingPrice;
					this._orderTotal += iceCreamPrice;
				} else {
					this._orderTotal += this._orderSide[i].price * this._orderSide[i].quantity;
				}
			}
		}
	};
}
// Sweet Crepe Models
export class Ingredient {
	constructor(id = null, servingSize = 'regular', price = 0, category = null, quantity = 1) {
		this.id = id;
		this.servingSize = servingSize;
		this.price = price;
		this.category = category;
		this.quantity = quantity;
	}
	get id() {
		return this._id;
	}
	get servingSize() {
		return this._servingSize;
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
	set servingSize(value) {
		this._servingSize = value;
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
	initFromHTML = (index, selectedItemCategoryIndex, ingredientCategoryDataArray) => {
		const newIngredient = ingredientCategoryDataArray[selectedItemCategoryIndex][index];
		const ingredientId = newIngredient.id;
		const ingredientServingSize = newIngredient.servingSize;
		const ingredientPrice = newIngredient.price;
		const ingredientCategory = newIngredient.ingredient_category_id;

		this._id = ingredientId;
		this._servingSize = ingredientServingSize;
		this._price = ingredientPrice;
		this._category = ingredientCategory;
	};
	toJSON = () => {
		const data = {
			id: this._id,
			servingSize: this._servingSize,
			price: this._price,
			category: this._category,
			quantity: this._quantity,
		};
		return data;
	};
	fromJSON = (json) => {
		const data = json;
		this._id = data.id;
		this._servingSize = data.servingSize;
		this._price = data.price;
		this._category = data.category;
		this._quantity = data.quantity;
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

export class OrderCrepe {
	constructor(id = null, flavor = null, quantity = 1, origination = null, ingredients = new Array(), orderTotal = 0) {
		this.id = id;
		this.flavor = flavor;
		this.quantity = quantity;
		this.origination = origination;
		this.ingredients = ingredients;
		this.orderTotal = orderTotal;
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
	get orderTotal() {
		return this._orderTotal;
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
	set orderTotal(value) {
		this._orderTotal = value;
	}

	initFromHTML = (index, selectedItemCategoryIndex, newOriginations) => {
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
			quantity: this._quantity,
			origination: this._origination,
			ingredients: this._ingredients,
			orderTotal: this._orderTotal,
		};
		return data;
	};
	fromJSON = (json) => {
		const data = json;
		this._id = data.id;
		this._flavor = data.flavor;
		this._quantity = data.quantity;
		this._origination = data.origination;
		this._orderTotal = data.orderTotal;

		// data.orderCrepe[i].ingredients is a list of objects that have sweetIngredientCategory as one key and the list of ingredients from that category in another key called ingredients
		// i realize this is confusing but basically data.orderCrepe[i].ingredients is a list of individual ingredient categories with associated ingredients
		for (var i = 0; i < data.ingredients.length; i++) {
			const newIngredient = new Ingredient();
			newIngredient.fromJSON(data.ingredients[i]);
			console.log('newIngredient: %s', newIngredient);
			console.log('newIngredient: %s', JSON.stringify(newIngredient));
			this._ingredients.push(newIngredient);
		}
	};
	checkIfThisIngredientSelected = (index, selectedItemCategoryIndex, ingredientCategoryDataArray) => {
		const ingredient = ingredientCategoryDataArray[selectedItemCategoryIndex][index];
		if (this._ingredients.length) {
			for (var i = 0; i < this._ingredients.length; i++) {
				if (this._ingredients[i].id === ingredient.id) {
					return true;
				}
			}
		}
		return false;
	};
	findIngredient = (index, selectedItemCategoryIndex, ingredientCategoryDataArray) => {
		console.log('ingredientCategoryDataArray: %s', JSON.stringify(ingredientCategoryDataArray));

		console.log('selectedItemCategoryIndex: %s', selectedItemCategoryIndex);

		console.log('index: %s', index);

		const selectedIngredient = ingredientCategoryDataArray[selectedItemCategoryIndex][index];
		console.log('selectedIngredient: %s', JSON.stringify(selectedIngredient));

		if (this._ingredients.length) {
			for (var i = 0; i < this._ingredients.length; i++) {
				if (this._ingredients[i].id === selectedIngredient.id) {
					console.log('this._ingredients[i].id: %s', this._ingredients[i].id);

					return this._ingredients[i];
				}
			}
		}
		return false;
	};
	addIngredient = (index, selectedItemCategoryIndex, ingredientCategoryDataArray) => {
		const newIngredient = new Ingredient();
		newIngredient.initFromHTML(index, selectedItemCategoryIndex, ingredientCategoryDataArray);
		this._ingredients.push(newIngredient);
		this.priceCrepe();

		return newIngredient;
	};
	removeIngredient = (index, selectedItemCategoryIndex, ingredientCategoryDataArray) => {
		const selectedIngredient = ingredientCategoryDataArray[selectedItemCategoryIndex][index];
		if (this._ingredients.length) {
			for (var i = 0; i < this._ingredients.length; i++) {
				if (this._ingredients[i].id === selectedIngredient.id) {
					this._ingredients.splice(i, 1);
					this.priceCrepe();
					return true;
				}
			}
		}
		return false;
	};
	changeIngredientQuantity = (index, selectedItemCategoryIndex, value, ingredientCategoryDataArray) => {
		const selectedIngredient = this.findIngredient(index, selectedItemCategoryIndex, ingredientCategoryDataArray);
		if (!selectedIngredient) {
			const addedIngredient = this.addIngredient(index, selectedItemCategoryIndex, ingredientCategoryDataArray);
			this.priceCrepe();

			return addedIngredient;
		} else {
			selectedIngredient.updateQuantity(value);
			if (selectedIngredient.quantity === 0) {
				this.removeIngredient(index, selectedItemCategoryIndex, ingredientCategoryDataArray);
			}
			this.priceCrepe();
			return selectedIngredient;
		}
	};
	priceCrepe = () => {
		this._orderTotal = 0;
		if (this._ingredients.length) {
			for (var i = 0; i < this._ingredients.length; i++) {
				this._orderTotal += this._ingredients[i].price * this._ingredients[i].quantity;
			}
		}
	};
}

// export class OrderCrepe {
// 	constructor(orderCrepe = new Crepe(), orderTotal = 0) {
// 		this.orderCrepe = orderCrepe;
// 		this.orderTotal = orderTotal;
// 	}

// 	get orderCrepe() {
// 		return this._orderCrepe;
// 	}
// 	get orderTotal() {
// 		return this._orderTotal;
// 	}
// 	set orderCrepe(value) {
// 		this._orderCrepe = value;
// 	}
// 	set orderTotal(value) {
// 		this._orderTotal = value;
// 	}
// 	toJSON = () => {
// 		const data = {
// 			orderCrepe: this._orderCrepe,
// 			orderTotal: this._orderTotal,
// 		};
// 		return data;
// 	};
// 	fromJSON = (json) => {
// 		const data = json;
// 		this._orderCrepe = data.orderCrepe;
// 		this._orderTotal = data.orderTotal;
// 	};
// 	checkIfProteinSelected = () => {
// 		return this.orderCrepe.checkIfProteinSelected();
// 	};
// 	checkIfThisIngredientSelected = (index, selectedItemCategoryIndex) => {
// 		return this.orderCrepe.checkIfThisIngredientSelected(index, selectedItemCategoryIndex);
// 	};
// 	findIngredient = () => {
// 		return this.orderCrepe.findIngredient();
// 	};
// 	addIngredient = () => {
// 		return this.orderCrepe.addIngredient();
// 	};
// 	removeIngredient = () => {
// 		return this.orderCrepe.removeIngredient();
// 	};
// 	changeIngredientQuantity = (index, selectedItemCategoryIndex, value) => {
// 		return this.orderCrepe.changeIngredientQuantity(index, selectedItemCategoryIndex, value);
// 	};
// }
