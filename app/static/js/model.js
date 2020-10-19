// Drinks Models
export class Drink {
	constructor(id = null, name = null, price = 0, quantity = 1, servingSize = 'regular', drinkCategory = null) {
		this.id = id;
		this.name = name;
		this.price = price;
		this.quantity = quantity;
		this.servingSize = servingSize;
		this.drinkCategory = drinkCategory;
	}
	get id() {
		return this._id;
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
	set id(value) {
		this._id = value;
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
		const drinkId = newDrink.id;
		const drinkName = newDrink.name;
		const drinkPrice = newDrink.price;
		const drinkServingSize = newDrink.serving_size;

		this._id = drinkId;
		this._name = drinkName;
		this._price = drinkPrice;
		this._drinkCategory = drinkCategory;
		this._servingSize = drinkServingSize;
	};
	toJSON = () => {
		const data = {
			id: this._id,
			name: this._name,
			price: this._price,
			quantity: this._quantity,
			servingSize: this._servingSize,
			drinkCategory: this._drinkCategory,
		};
		return data;
	};
	fromJSON = (json) => {
		const data = json;
		this._id = data.id;
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
		const coffeePrice = drinkCategoryDataArray[selectedItemCategoryIndex][index].price;
		const coffeeServingSize = drinkCategoryDataArray[selectedItemCategoryIndex][index].serving_size;
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
		return data;
	};
	fromJSON = (json) => {
		const data = JSON.parse(json);
		for (var i = 0; i < data.orderDrink.length; i++) {
			const newDrinkOrder = new OrderDrink();
			newDrinkOrder.fromJSON(data.orderDrink[i]);
			this._orderDrink.push(newDrinkOrder);
		}
		for (var i = 0; i < data.orderSide.length; i++) {
			const newSideOrder = new OrderSide();
			newSideOrder.fromJSON(data.orderSide[i]);
			this._orderSide.push(newSideOrder);
		}
		for (var i = 0; i < data.orderCrepe.length; i++) {
			const newCrepeOrder = new OrderCrepe();
			newCrepeOrder.fromJSON(data.orderCrepe[i]);
			this._orderCrepe.push(newCrepeOrder);
		}
		this._orderTotal = data.orderTotal;
		this._customerData = data.customerData;
	};
}
export class PaymentInformation {
	constructor(
		paymentObject
	) {
		this.paymentMethod = paymentObject.paymentMethod;
		this.creditCardName = paymentObject["cc-name"];
		this.creditCardNumber = paymentObject["cc-number"];
		this.creditCardExpiration = paymentObject["cc-expiration"];
		this.creditCardCVV = paymentObject["cc-cvv"];
	}

	get paymentMethod() {
		return this._paymentMethod;
	}
	get creditCardName() {
		return this._creditCardName;
	}
	get creditCardNumber() {
		return this._creditCardNumber;
	}
	get creditCardExpiration() {
		return this._creditCardExpiration;
	}
	get creditCardCVV() {
		return this._creditCardCVV;
	}
	set paymentMethod(value) {
		this._paymentMethod = value;
	}
	set creditCardName(value) {
		this._creditCardName = value;
	}
	set creditCardNumber(value) {
		this._creditCardNumber = value;
	}
	set creditCardExpiration(value) {
		this._creditCardExpiration = value;
	}
	set creditCardCVV(value) {
		this._creditCardCVV = value;
	}
	toJSON = () => {
		const data = {
			paymentMethod: this._paymentMethod,
			creditCardName: this._creditCardName,
			creditCardNumber: this._creditCardNumber,
			creditCardExpiration: this._creditCardExpiration,
			creditCardCVV: this._creditCardCVV,
		};
		return data;
	};
	fromJSON = (json) => {
		const data = json;
		this._paymentMethod = data.paymentMethod;
		this._creditCardName = data.creditCardName;
		this._creditCardNumber = data.creditCardNumber;
		this._creditCardExpiration = data.creditCardExpiration;
		this._creditCardCVV = data.creditCardCVV;
	};
}
export class Customer {
	constructor(
		customerObject = null,
	) {
		if (customerObject) {
			console.log("customerObject", customerObject)
			console.log('customerObject', JSON.stringify(customerObject));
			
			this.id = customerObject.email;
			this.firstName = customerObject.firstName;
			this.lastName = customerObject.lastName;
			this.street = customerObject.address;
			this.city = customerObject.city;
			this.state = customerObject.state;
			this.zipcode = customerObject.zip;
			this.country = customerObject.country;
			this.paymentInformation = new PaymentInformation(customerObject.paymentInformation);
	}
		else {
			console.log('no cust object')
			this.id = null;
			this.firstName = null;
			this.lastName = null;
			this.street = null;
			this.city = null;
			this.state = null;
			this.zipcode = null;
			this.country = null;
			this.paymentInformation = null;
		}
	}

	get id() {
		return this._id;
	}
	get firstName() {
		return this._firstName;
	}
	get lastName() {
		return this._lastName;
	}
	get street() {
		return this._street;
	}
	get city() {
		return this._city;
	}
	get state() {
		return this._state;
	}
	get zipcode() {
		return this._zipcode;
	}
	get country() {
		return this._country;
	}
	get paymentInformation() {
		return this._paymentInformation;
	}
	set id(value) {
		this._id = value;
	}
	set firstName(value) {
		this._firstName = value;
	}
	set lastName(value) {
		this._lastName = value;
	}
	set street(value) {
		this._street = value;
	}
	set city(value) {
		this._city = value;
	}
	set state(value) {
		this._state = value;
	}
	set zipcode(value) {
		this._zipcode = value;
	}
	set country(value) {
		this._country = value;
	}
	set paymentInformation(value) {
		this._paymentInformation = value;
	}
	toJSON = () => {
		const data = {
			id: this._id,
			firstName: this._firstName,
			lastName: this._lastName,
			street: this._street,
			city: this._city,
			state: this._state,
			zipcode: this._zipcode,
			country: this._country,
			paymentInformation: this._paymentInformation
		};
		return data;
	};
	fromJSON = (json) => {
		const data = json;
		this._id = data.id;
		this._firstName = data.firstName;
		this._lastName = data.lastName;
		this._street = data.street;
		this._city = data.city;
		this._state = data.state;
		this._country = data.country;
		this._paymentInformation = new PaymentInformation(data.paymentInformation);
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
		return data;
	};
	fromJSON = (json) => {
		const data = json;
		for (var i = 0; i < data.orderDrink.length; i++) {
			const drinkCategory = data.orderDrink[i].drinkCategory;
			if (drinkCategory != 'coffee') {
				const newDrink = new Drink();
				newDrink.fromJSON(data.orderDrink[i]);
				this._orderDrink.push(newDrink);
			} else {
				const newCoffee = new Coffee();
				newCoffee.fromJSON(data.orderDrink[i]);
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
				}
			}
		}
		return false;
	};
	checkIfThisTempSelected = (index, selectedItemCategoryIndex, selectedItemCategory, drinkCategoryDataArray) => {
		const temp = drinkCategoryDataArray[selectedItemCategoryIndex][index];
		if (selectedItemCategory === 'temperature') {
			for (var i = 0; i < this._orderDrink.length; i++) {
				if (this._orderDrink[i].drinkCategory === 'coffee') {
					if (this._orderDrink[i].temperature === temp.id) {
						return true;
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
				}
			}
		}
		return false;
	};
	checkIfThisMilkSelected = (index, selectedItemCategoryIndex, selectedItemCategory, drinkCategoryDataArray) => {
		if (selectedItemCategory === 'milk') {
			const milk = drinkCategoryDataArray[selectedItemCategoryIndex][index];
			for (var i = 0; i < this._orderDrink.length; i++) {
				if (this._orderDrink[i].drinkCategory === 'coffee') {
					if (this._orderDrink[i].milkType === milk.id) {
						return true;
					}
				}
			}
		}
		return false;
	};
	checkIfSyrupSelected = () => {
		for (var i = 0; i < this._orderDrink.length; i++) {
			if (this._orderDrink[i].drinkCategory === 'coffee') {
				if (this._orderDrink[i].flavorSyrup) {
					return true;
				}
			}
		}
		return false;
	};
	checkIfThisSyrupSelected = (index, selectedItemCategoryIndex, selectedItemCategory, drinkCategoryDataArray) => {
		if (selectedItemCategory === 'syrup') {
			const syrup = drinkCategoryDataArray[selectedItemCategoryIndex][index];
			for (var i = 0; i < this._orderDrink.length; i++) {
				if (this._orderDrink[i].drinkCategory === 'coffee') {
					if (this._orderDrink[i].flavorSyrup === syrup.coffee_syrup_flavor) {
						return true;
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
			this.priceDrinks();
		}
	};
	removeDrink = (index, selectedItemCategoryIndex, drinkCategoryDataArray) => {
		for (var i = 0; i < this._orderDrink.length; i++) {
			const selectedDrink = drinkCategoryDataArray[selectedItemCategoryIndex][index];

			if (selectedDrink.name === this._orderDrink[i].name) {
				this._orderDrink.splice(i, 1);
				this.priceDrinks();
				return true;
			}
		}
		return false;
	};
	addCoffee = (index, espressoServingSize, selectedItemCategoryIndex, drinkCategoryDataArray) => {
		const coffee = new Coffee();
		coffee.initFromHTML(index, espressoServingSize, selectedItemCategoryIndex, drinkCategoryDataArray);
		this._orderDrink.push(coffee);
		this.priceDrinks();
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
				this._orderDrink[i].flavorSyrup = null;
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

	initFromHTML = (index, selectedItemCategoryIndex, selectedItemCategory, sideCategoryDataArray) => {
		const newCroissant = sideCategoryDataArray[selectedItemCategoryIndex][index];
		const croissantId = newCroissant.id;
		const croissantPrice = newCroissant.price;
		const croissantFlavor = newCroissant.flavor;
		const croissantSideName = selectedItemCategory;

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

	initFromHTML = (index, selectedItemCategoryIndex, selectedItemCategory, sideCategoryDataArray) => {
		const iceCreamId = sideCategoryDataArray[selectedItemCategoryIndex][index].id;
		const iceCreamFlavor = sideCategoryDataArray[selectedItemCategoryIndex][index].flavor;
		const iceCreamPrice = sideCategoryDataArray[selectedItemCategoryIndex][index].price;
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
			const newTopping = new Ingredient();
			newTopping.fromJSON(data.toppings[i]);
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
				this._orderSide.push(newCroissant);
			} else if (sideCategory === 'ice_cream_bowl') {
				const newIceCreamBowl = new IceCreamBowl();
				newIceCreamBowl.fromJSON(data.orderSide[i]);
				this._orderSide.push(newIceCreamBowl);
			}
		}
	};
	checkIfIceCreamSelected = () => {
		for (var i = 0; i < this._orderSide.length; i++) {
			this._orderSide[i];
			if (this._orderSide[i].sideName === 'ice_cream_bowl') {
				return true;
			}
		}
		return false;
	};
	checkIfThisToppingSelected = (index, selectedItemCategoryIndex, selectedItemCategory, sideCategoryDataArray) => {
		if (selectedItemCategory === 'topping') {
			const topping = sideCategoryDataArray[selectedItemCategoryIndex][index];
			for (var i = 0; i < this._orderSide.length; i++) {
				if (this._orderSide[i].sideName === 'ice_cream_bowl') {
					if (this._orderSide[i].toppings.length) {
						for (var j = 0; j < this._orderSide[i].toppings.length; j++) {
							if (this._orderSide[i].toppings[j].id === topping.id) {
								return true;
							}
						}
					}
				}
			}
		}
		return false;
	};
	changeSideQuantity = (index, selectedItemCategoryIndex, value, selectedItemCategory, sideCategoryDataArray) => {
		if (selectedItemCategory != 'topping') {
			const selectedSide = this.findSide(
				index,
				selectedItemCategoryIndex,
				selectedItemCategory,
				sideCategoryDataArray
			);
			if (!selectedSide && value === 'increase') {
				const addedSide = this.addSide(
					index,
					selectedItemCategoryIndex,
					selectedItemCategory,
					sideCategoryDataArray
				);
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
						this.removeSide(index, selectedItemCategoryIndex, sideCategoryDataArray);
						return 0;
					}
					else {
						return selectedSide
					}
				} else if (selectedItemCategory === 'ice_cream_bowl') {
					selectedSide.updateIceCreamBowlQuantity(value);
					if (selectedSide.quantity === 0) {
						this.removeSide(index, selectedItemCategoryIndex, sideCategoryDataArray);
						return 0;
					}
					else {
						return selectedSide
					}
				}
			}
		}
	};
	findSide = (index, selectedItemCategoryIndex, selectedItemCategory, sideCategoryDataArray) => {
		const selectedSide = sideCategoryDataArray[selectedItemCategoryIndex][index];
		if (selectedItemCategory != 'topping') {
			for (var i = 0; i < this._orderSide.length; i++) {
				if (this._orderSide[i].id === selectedSide.id) {
					return this._orderSide[i];
				}
			}
		}
		return false;
	};
	addSide = (index, selectedItemCategoryIndex, selectedItemCategory, sideCategoryDataArray) => {
		if (!this.findSide(index, selectedItemCategoryIndex, selectedItemCategory, sideCategoryDataArray)) {
			if (selectedItemCategory === 'ice_cream_bowl') {
				const newIceCreamBowl = new IceCreamBowl();
				newIceCreamBowl.initFromHTML(
					index,
					selectedItemCategoryIndex,
					selectedItemCategory,
					sideCategoryDataArray
				);
				this._orderSide.push(newIceCreamBowl);
				this.priceSides();
				return newIceCreamBowl;
			} else if (selectedItemCategory === 'croissant') {
				const croissant = new Croissant();
				croissant.initFromHTML(index, selectedItemCategoryIndex, selectedItemCategory, sideCategoryDataArray);
				this._orderSide.push(croissant);
				this.priceSides();
				return croissant;
			}
		}
	};
	removeSide = (index, selectedItemCategoryIndex, sideCategoryDataArray) => {
		for (var i = 0; i < this._orderSide.length; i++) {
			const selectedSide = sideCategoryDataArray[selectedItemCategoryIndex][index];
			if (selectedSide.id === this._orderSide[i].id) {
				this._orderSide.splice(i, 1);
				this.priceSides();
				return true;
			}
		}
		return false;
	};

	addTopping = (index, selectedItemCategoryIndex, sideCategoryDataArray, servingSize) => {
		const newTopping = new Ingredient();
		newTopping.initFromHTML(index, selectedItemCategoryIndex, sideCategoryDataArray, servingSize);
		for (var i = 0; i < this._orderSide.length; i++) {
			if (this._orderSide[i].sideName === 'ice_cream_bowl') {
				this._orderSide[i].toppings.push(newTopping);
				this.priceSides();
				return newTopping;
			}
		}
		return false;
	};
	removeTopping = (index, selectedItemCategoryIndex, sideCategoryDataArray) => {
		const selectedTopping = sideCategoryDataArray[selectedItemCategoryIndex][index];
		for (var i = 0; i < this._orderSide.length; i++) {
			if (this._orderSide[i].sideName === 'ice_cream_bowl') {
				if (this._orderSide[i].toppings.length) {
					for (var j = 0; j < this._orderSide[i].toppings.length; j++) {
						if (this._orderSide[i].toppings[j].id === selectedTopping.id) {
							this._orderSide[i].toppings.splice(j, 1);
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

	initFromHTML = (index, selectedItemCategoryIndex, ingredientCategoryDataArray, servingSize = 'regular') => {
		const newIngredient = ingredientCategoryDataArray[selectedItemCategoryIndex][index];
		const ingredientId = newIngredient.id;
		const ingredientPrice = newIngredient.price;
		const ingredientCategory = newIngredient.ingredient_category_id;
		this._id = ingredientId;
		this._servingSize = servingSize;
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
export class MenuCrepe {
	constructor(id = null, name = null, flavor = null, quantity = 1, origination = null, price = 0) {
		this.id = id;
		this.name = name;
		this.flavor = flavor;
		this.quantity = quantity;
		this.origination = origination;
		this.price = price;
	}
	get id() {
		return this._id;
	}
	get name() {
		return this._name;
	}
	get flavor() {
		return this._flavor;
	}
	get quantity() {
		return this._quantity;
	}
	get origination() {
		return this._origination;
	}
	get price() {
		return this._price;
	}
	set id(value) {
		this._id = value;
	}
	set name(value) {
		this._name = value;
	}
	set flavor(value) {
		this._flavor = value;
	}
	set quantity(value) {
		this._quantity = value;
	}
	set origination(value) {
		this._origination = value;
	}
	set price(value) {
		this._price = value;
	}

	initFromHTML = (index, selectedItemCategoryIndex, dataArray) => {
		const crepeId = dataArray[selectedItemCategoryIndex][index].crepe_id;
		const crepeName = dataArray[selectedItemCategoryIndex][index].name;
		const crepeFlavor = dataArray[selectedItemCategoryIndex][index].flavor_profile_id;
		const crepePrice = dataArray[selectedItemCategoryIndex][index].price;
		const crepeOrigination = dataArray[selectedItemCategoryIndex][index].origination_id;

		this._id = crepeId;
		this._name = crepeName;
		this._flavor = crepeFlavor;
		this._price = crepePrice;
		this._origination = crepeOrigination;
	};

	toJSON = () => {
		const data = {
			id: this._id,
			name: this._name,
			flavor: this._flavor,
			quantity: this._quantity,
			origination: this._origination,
			price: this._price,
		};
		return data;
	};
	fromJSON = (json) => {
		const data = json;
		this._id = data.id;
		this._name = data.name;
		this._flavor = data.flavor;
		this._quantity = data.quantity;
		this._origination = data.origination;
		this._price = data.price;
	};
	updateCrepeQuantity = (value) => {
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
	constructor(
		id = null,
		name = null,
		flavor = null,
		quantity = 1,
		origination = null,
		ingredients = new Array(),
		menuCrepes = new Array(),
		orderTotal = 0
	) {
		this.id = id;
		this.name = name;
		this.flavor = flavor;
		this.quantity = quantity;
		this.origination = origination;
		this.ingredients = ingredients;
		this.menuCrepes = menuCrepes;
		this.orderTotal = orderTotal;
	}
	get id() {
		return this._id;
	}
	get name() {
		return this._name;
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
	get menuCrepes() {
		return this._menuCrepes;
	}
	get orderTotal() {
		return this._orderTotal;
	}
	set id(value) {
		this._id = value;
	}
	set name(value) {
		this._name = value;
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
	set menuCrepes(value) {
		this._menuCrepes = value;
	}
	set orderTotal(value) {
		this._orderTotal = value;
	}

	toJSON = () => {
		const data = {
			id: this._id,
			name: this._name,
			flavor: this._flavor,
			quantity: this._quantity,
			origination: this._origination,
			ingredients: this._ingredients,
			menuCrepes: this._menuCrepes,
			orderTotal: this._orderTotal,
		};
		return data;
	};
	fromJSON = (json) => {
		const data = json;
		this._id = data.id;
		this._name = data.name;
		this._flavor = data.flavor;
		this._quantity = data.quantity;
		this._origination = data.origination;
		this._orderTotal = data.orderTotal;

		// data.orderCrepe[i].ingredients is a list of objects that have sweetIngredientCategory as one key and the list of ingredients from that category in another key called ingredients
		// i realize this is confusing but basically data.orderCrepe[i].ingredients is a list of individual ingredient categories with associated ingredients
		if (data.ingredients) {
			for (var i = 0; i < data.ingredients.length; i++) {
				const newIngredient = new Ingredient();
				newIngredient.fromJSON(data.ingredients[i]);
				this._ingredients.push(newIngredient);
			}
		}
		if (data.menuCrepes) {
			for (var i = 0; i < data.menuCrepes.length; i++) {
				const newMenuCrepe = new MenuCrepe();
				newMenuCrepe.fromJSON(data.menuCrepes[i]);
				this._menuCrepes.push(newMenuCrepe);
			}
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
		const selectedIngredient = ingredientCategoryDataArray[selectedItemCategoryIndex][index];
		if (this._ingredients.length) {
			for (var i = 0; i < this._ingredients.length; i++) {
				if (this._ingredients[i].id === selectedIngredient.id) {
					return this._ingredients[i];
				}
			}
		}
		return false;
	};
	addIngredient = (index, selectedItemCategoryIndex, ingredientCategoryDataArray, servingSize = null) => {
		const newIngredient = new Ingredient();
		newIngredient.initFromHTML(index, selectedItemCategoryIndex, ingredientCategoryDataArray, servingSize);
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
			const addedIngredient = this.addIngredient(index, selectedItemCategoryIndex, ingredientCategoryDataArray, 'regular');
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
	changeSavoryIngredientQuantity = (index, selectedItemCategoryIndex, ingredientCategoryDataArray, servingSize) => {
		const selectedIngredient = this.findIngredient(index, selectedItemCategoryIndex, ingredientCategoryDataArray);
		const ingredientCategory = ingredientCategoryDataArray[selectedItemCategoryIndex][index].ingredient_category_id;
		const proteinStatus = this.checkIfProteinSelected();
		if (!selectedIngredient) {
			if (ingredientCategory != 'protein') {
				const addedIngredient = this.addIngredient(
					index,
					selectedItemCategoryIndex,
					ingredientCategoryDataArray,
					servingSize
				);
				return addedIngredient;
			} else {
				// if a protein has alread been selected then we want to add this protein as either a regular quantity if the other is extra, or a light quantity if the other is regular
				if (proteinStatus != true && proteinStatus != false) {
					// check the serving size of the already selected protein
					// TODO finish adding in logic for protein ingredients and test it
					const proteinIngredient = proteinStatus;
					const servingSizeOfSelectedProtein = proteinIngredient.servingSize;
					if (servingSizeOfSelectedProtein === 'regular') {
						const servingSizeOfNewIngredient = 'light';
						const addedIngredient = this.addIngredient(
							index,
							selectedItemCategoryIndex,
							ingredientCategoryDataArray,
							servingSizeOfNewIngredient
						);
						this.updateIngredientServingSize(proteinIngredient, 'light');
						return addedIngredient;
					} else if (servingSizeOfSelectedProtein === 'extra') {
						const servingSizeOfNewIngredient = 'regular';
						const addedIngredient = this.addIngredient(
							index,
							selectedItemCategoryIndex,
							ingredientCategoryDataArray,
							servingSizeOfNewIngredient
						);
						this.updateIngredientServingSize(proteinIngredient, 'regular');
						return addedIngredient;
					} else if (servingSizeOfSelectedProtein === 'light') {
						const servingSizeOfNewIngredient = 'light';
						const addedIngredient = this.addIngredient(
							index,
							selectedItemCategoryIndex,
							ingredientCategoryDataArray,
							servingSizeOfNewIngredient
						);
						return addedIngredient;
					}
				} else if (proteinStatus === true) {
					const addedIngredient = this.addIngredient(
						index,
						selectedItemCategoryIndex,
						ingredientCategoryDataArray,
						servingSize
					);
					return addedIngredient;
				} else if (proteinStatus === false) return proteinStatus;
			}
		} else {
			return this.updateIngredientServingSize(selectedIngredient, servingSize);
		}
	};
	updateIngredientServingSize = (ingredient, servingSize) => {
		for (var i = 0; i < this._ingredients.length; i++) {
			if (this._ingredients[i].id === ingredient.id) {
				this._ingredients[i].servingSize = servingSize;
				this.priceCrepe();
				return true;
			}
		}
		return false;
	};
	priceCrepe = () => {
		this._orderTotal = 0;
		if (this._ingredients.length) {
			for (var i = 0; i < this._ingredients.length; i++) {
				this._orderTotal += this._ingredients[i].price * this._ingredients[i].quantity;
			}
		}
	};
	checkIfProteinSelected = () => {
		var counter = 0;
		var response = null;
		for (var i = 0; i < this._ingredients.length; i++) {
			if (this._ingredients[i].category === 'protein') {
				counter += 1;
				response = this._ingredients[i];
			}
		}
		if (counter > 1) {
			return false;
		} else if (!response) {
			return true;
		} else {
			return response;
		}
	};
	findCrepe = (index, categoryIndex, dataArray) => {
		const selectedCrepe = dataArray[categoryIndex][index];
		for (var i = 0; i < this._menuCrepes.length; i++) {
			if (this._menuCrepes[i].id === selectedCrepe.crepe_id) {
				return this._menuCrepes[i];
			}
		}
		return false;
	};
	addCrepe = (index, categoryIndex, dataArray) => {
		const crepeToAdd = new MenuCrepe();
		crepeToAdd.initFromHTML(index, categoryIndex, dataArray);
		this._menuCrepes.push(crepeToAdd);
		this.priceCrepes();
		return crepeToAdd;
	};
	removeCrepe = (index, categoryIndex, dataArray) => {
		const selectedCrepe = dataArray[categoryIndex][index];
		for (var i = 0; i < this._menuCrepes.length; i++) {
			if (selectedCrepe.crepe_id === this._menuCrepes[i].id) {
				this._menuCrepes.splice(i, 1);
				this.priceCrepes();
				return true;
			}
		}
		return false;
	};
	changeCrepeQuantity = (index, categoryIndex, value, dataArray) => {
		const selectedCrepe = this.findCrepe(index, categoryIndex, dataArray);
		if (!selectedCrepe) {
			return this.addCrepe(index, categoryIndex, dataArray);
		} else {
			selectedCrepe.updateCrepeQuantity(value);
			if (selectedCrepe.quantity === 0) {
				this.removeCrepe(index, categoryIndex, dataArray);
			}
		}
	};
	priceCrepes = () => {
		for (var i = 0; i < this._menuCrepes.length; i++) {
			this._orderTotal += this._menuCrepes[i].price;
		}
	};
}
// Bugs:
// 1. fix pricing for sweet crepe page
// 2.

// Testing
//Custom Savory Crepe:
//1 steak 1 chicken 
//2x artichoke heart 1 cheesy grits .5 cilantro
//2x blue cheese 1 gourmet cheese .5 brie
//2x bernaise 1 balsamic glaze .5 creamy lemon
//2x basil 1 oregano .5 fresh chives

// results: all veggies were added as extra and all other ingredients were added as extra, regular, extra
