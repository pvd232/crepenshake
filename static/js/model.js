export function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
export function capitalize(str) {
  return str.replace(/^./, function (str) {
    return str.toUpperCase();
  });
}

export function humanize(dict = null, attr = null, word = null) {
  // this is providing a deep copy of the object so we don't mutate the original order
  var formatDict = JSON.parse(JSON.stringify(dict));
  if (formatDict) {
    var str = formatDict[`${attr}`];
    var frags = str.split("_");
    if (frags.length < 2) {
      str = capitalize(str);
      formatDict[`${attr}`] = str;
      return formatDict;
    }
    var newFrags = new Array();
    for (var i in frags) {
      const capitalFrag = capitalize(frags[i]);
      newFrags.push(capitalFrag);
    }
    newFrags = newFrags.join(" ");
    formatDict[`${attr}`] = newFrags;
    return formatDict;
  } else if (word) {
    var servingSize = null;
    if (word.split(" ").length > 1 && word.includes("oz")) {
      servingSize = word.split(" ")[0];
      word = word.split(" ")[1];
    }
    var frags = word.split("_");
    if (frags.length < 2) {
      word = capitalize(word);
      if (servingSize) {
        word = servingSize + " " + word;
      }
      return word;
    }
    var newFrags = new Array();
    for (var i in frags) {
      const capitalFrag = capitalize(frags[i]);
      newFrags.push(capitalFrag);
    }
    newFrags = newFrags.join(" ");
    if (servingSize) {
      newFrags = servingSize + " " + newFrags;
    }
    return newFrags;
  }
}
// Drinks Models
export class Drink {
  constructor(
    id = null,
    name = null,
    price = 0,
    quantity = 1,
    servingSize = null,
    drinkCategory = null
  ) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._quantity = quantity;
    this._servingSize = servingSize;
    this._drinkCategory = drinkCategory;
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
  toJSON() {
    const data = {
      id: this._id,
      name: this._name,
      price: this._price,
      quantity: this._quantity,
      servingSize: this._servingSize,
      drinkCategory: this._drinkCategory,
    };
    return data;
  }
  fromJSON(json) {
    const data = json;
    data.id;

    this._id = data.id;
    this._name = data.name;
    this._price = data.price;
    if (data.quantity) {
      this._quantity = data.quantity;
    }
    if (data.drink_category_id) {
      this._drinkCategory = data.drink_category_id;
    } else if (data.drinkCategory) {
      this._drinkCategory = data.drinkCategory;
    }
    if (data.servingSize) {
      this._servingSize = data.servingSize;
    } else if (data.serving_size) {
      this._servingSize = data.serving_size;
    }
  }
  updateDrinkQuantity(value) {
    if (value === "decrease") {
      if (this._quantity === 0) {
        return;
      } else {
        this._quantity -= 1;
      }
    } else if (value === "increase") {
      this._quantity += 1;
    }
  }
}

export class Coffee {
  constructor(
    id = null,
    name = null,
    servingSize = null,
    temperature = null,
    flavorSyrup = null,
	flavorSyrupServingSize = null,
	flavorSyrupPrice = 0,
    espressoServingSize = null,
    espressoPrice = 0,
    milkType = null,
    milkPrice = 0,
    price = null,
    drinkCategory = null,
    quantity = 1
  ) {
    this._id = id;
    this._name = name;
    this._servingSize = servingSize;
    this.temperature = temperature;
	this._flavorSyrup = flavorSyrup;
	this._flavorSyrupPrice = flavorSyrupPrice;
    this._flavorSyrupServingSize = flavorSyrupServingSize;
    this._espressoServingSize = espressoServingSize;
    this._espressoPrice = espressoPrice;
    this._milkType = milkType;
    this._milkPrice = milkPrice;
    this._price = price;
    this._drinkCategory = drinkCategory;
    this._quantity = quantity;
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
    return this._flavorSyrupServingSize;
  }
  get flavorSyrupPrice() {
    return this._flavorSyrupPrice;
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
    this._flavorSyrupServingSize = value;
  }
  set flavorSyrupPrice(value) {
    this._flavorSyrupPrice = value;
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

  toJSON() {
    const data = {
      id: this._id,
      name: this._name,
      servingSize: this._servingSize,
      temperature: this._temperature,
	  flavorSyrup: this._flavorSyrup,
	  flavorSyrupPrice: this._flavorSyrupPrice,
      flavorSyrupServingSize: this._flavorSyrupServingSize,
      espressoServingSize: this._espressoServingSize,
      espressoPrice: this._espressoPrice,
      milkType: this._milkType,
      milkPrice: this._milkPrice,
      price: this._price,
      drinkCategory: this._drinkCategory,
      quantity: this._quantity,
    };
    return data;
  }
  fromJSON(json) {
    const data = json;
    this._id = data.id;
    this._name = data.name;
    if (data.servingSize) {
      this._servingSize = data.servingSize;
    } else if (data.serving_size) {
      this._servingSize = data.serving_size;
    }
    if (data.temperature) {
      this._temperature = data.temperature;
    }
    if (data.flavorSyrup) {
      this._flavorSyrup = data.flavorSyrup;
    }
    if (data.flavorSyrupServingSize) {
      this._flavorSyrupServingSize = data.flavorSyrupServingSize;
	}
	if (data.flavorSyrupPrice) {
		this._flavorSyrupPrice= data.flavorSyrupPrice
	  }
    if (data.espressoServingSize) {
      this._espressoServingSize = data.espressoServingSize;
    }
    if (data.espressoPrice) {
      this._espressoPrice = data.espressoPrice;
    }
    if (data.milkType) {
      this._milkType = data.milkType;
    }
    if (data.milkPrice) {
      this._milkPrice = data.milkPrice;
    }
    this._price = data.price;
    if (data.quantity) {
      this._quantity = data.quantity;
    }
    if (data.drinkCategory) {
      this._drinkCategory = data.drinkCategory;
    } else if (data.drink_category_id) {
      this._drinkCategory = data.drink_category_id;
    }
  }
}

export class Order {
  constructor(
    orderCrepe = new Array(),
    orderDrink = new Array(),
    orderSide = new Array(),
    orderTotal = 0,
    customerData = null,
    pickupTime = null,
    pickupTimestamp = null
  ) {
    this._orderCrepe = orderCrepe;
    this._orderDrink = orderDrink;
    this._orderSide = orderSide;
    this._orderTotal = orderTotal;
    this._customerData = customerData;
    this._pickupTime = pickupTime;
    this._pickupTimestamp = pickupTimestamp;
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
  get pickupTime() {
    return this._pickupTime;
  }
  get pickupTimestamp() {
    return this._pickupTimestamp;
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
  set pickupTime(value) {
    this._pickupTime = value;
  }
  set pickupTimestamp(value) {
    this._pickupTimestamp = value;
  }
  toJSON() {
    this.priceOrder();
    const data = {
      orderCrepe: this._orderCrepe,
      orderDrink: this._orderDrink,
      orderSide: this._orderSide,
      orderTotal: this._orderTotal,
      customerData: this._customerData,
      pickupTime: this._pickupTime,
      pickupTimestamp: this._pickupTimestamp,
    };
    return data;
  }
  fromJSON(json) {
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
    this._pickupTime = data.pickupTime;
    this._pickupTimestamp = data.pickupTimestamp;
    this.priceOrder();
  }
  priceOrder() {
    this._orderTotal = 0;
    for (var i = 0; i < this._orderCrepe.length; i++) {
      this._orderTotal += this._orderCrepe[i].orderTotal;
    }
    for (var i in this._orderDrink) {
      this._orderTotal += this._orderDrink[i].orderTotal;
    }
    for (var i in this._orderSide) {
      this._orderTotal += this._orderSide[i].orderTotal;
    }
  }
}

export class Customer {
  constructor(customerObject, stripeId) {
    if (customerObject) {
      this._id = customerObject.email.toLowerCase();
      this._stripeId = customerObject.stripeId;
      this._firstName = customerObject.firstName;
      this._lastName = customerObject.lastName;
      this._street = customerObject.address;
      this._city = customerObject.city;
      this._state = customerObject.state;
      this._zipcode = customerObject.zip;
      this._country = customerObject.country;
      this._phoneNumber = customerObject.phoneNumber;
    } else if (stripeId) {
      this._stripeId = stripeId;
    } else {
      this._id = null;
      this._stripeId = null;
      this._firstName = null;
      this._lastName = null;
      this._street = null;
      this._city = null;
      this._state = null;
      this._zipcode = null;
      this._country = null;
      this._phoneNumber = null;
    }
  }

  get id() {
    return this._id;
  }
  get stripeId() {
    return this._stripeId;
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
  get phoneNumber() {
    return this._phoneNumber;
  }
  set id(value) {
    this._id = value;
  }
  set stripeId(value) {
    this._stripeId = value;
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
  set phoneNumber(value) {
    this._phoneNumber = value;
  }
  toJSON() {
    const data = {
      id: this._id,
      stripeId: this._stripeId,
      firstName: this._firstName,
      lastName: this._lastName,
      street: this._street,
      city: this._city,
      state: this._state,
      zipcode: this._zipcode,
      country: this._country,
      phoneNumber: this._phoneNumber,
    };
    return data;
  }
  fromJSON(json) {
    const data = json;
    this._id = data.id;
    this.stripeId = data.stripeId;
    this._firstName = data.firstName;
    this._lastName = data.lastName;
    this._street = data.street;
    this._city = data.city;
    this._state = data.state;
    this._country = data.country;
    this._phoneNumber = data.phoneNumber;
  }
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
  toJSON() {
    this.priceDrinks();
    const data = {
      orderDrink: this._orderDrink,
      orderTotal: this._orderTotal,
    };
    return data;
  }
  fromJSON(json) {
    const data = json;
    for (var i = 0; i < data.orderDrink.length; i++) {
      const drinkCategory = data.orderDrink[i].drinkCategory;
      if (drinkCategory != "coffee") {
        const newDrink = new Drink();
        newDrink.fromJSON(data.orderDrink[i]);
        this._orderDrink.push(newDrink);
      } else {
        const newCoffee = new Coffee();
        newCoffee.fromJSON(data.orderDrink[i]);
        this._orderDrink.push(newCoffee);
      }
    }
    this.priceDrinks();
  }
  checkIfCoffeeSelected() {
    for (var i = 0; i < this._orderDrink.length; i++) {
      if (this._orderDrink[i].drinkCategory === "coffee") {
        return true;
      }
    }
    return false;
  }
  checkIfTempSelected() {
    for (var i = 0; i < this._orderDrink.length; i++) {
      if (this._orderDrink[i].drinkCategory === "coffee") {
        if (this._orderDrink[i].temperature) {
          return true;
        }
      }
    }
    return false;
  }

  checkIfThisTempSelected(json) {
    const temp = json;
    for (var i = 0; i < this._orderDrink.length; i++) {
      if (this._orderDrink[i].drinkCategory === "coffee") {
        if (this._orderDrink[i].temperature === temp.id) {
          return true;
        }
      }
    }
    return false;
  }
  checkIfMilkSelected() {
    for (var i = 0; i < this._orderDrink.length; i++) {
      if (this._orderDrink[i].drinkCategory === "coffee") {
        if (this._orderDrink[i].milkType) {
          return true;
        }
      }
    }
    return false;
  }
  checkIfThisMilkSelected(json) {
    const milk = json;
    for (var i = 0; i < this._orderDrink.length; i++) {
      if (this._orderDrink[i].drinkCategory === "coffee") {
        if (this._orderDrink[i].milkType === milk.id) {
          return true;
        }
      }
    }
    return false;
  }
  checkIfSyrupSelected() {
    for (var i = 0; i < this._orderDrink.length; i++) {
      if (this._orderDrink[i].drinkCategory === "coffee") {
        if (this._orderDrink[i].flavorSyrup) {
          return true;
        }
      }
    }
    return false;
  }
  checkIfThisSyrupSelected(json) {
	const syrup = json;
    for (var i = 0; i < this._orderDrink.length; i++) {
      if (this._orderDrink[i].drinkCategory === "coffee") {
        if (this._orderDrink[i].flavorSyrup === syrup.id) {
          return true;
        }
      }
    }
    return false;
  }
  changeDrinkQuantity(json, value) {
    const selectedDrink = this.findDrink(json);
    if (!selectedDrink) {
      return this.addDrink(json);
    } else {
      selectedDrink.updateDrinkQuantity(value);
    }
  }
  findDrink(json) {
    for (var i = 0; i < this._orderDrink.length; i++) {
      const selectedDrink = new Drink();
      selectedDrink.fromJSON(json);
      if (
        this._orderDrink[i].id === selectedDrink.id &&
        this._orderDrink[i].servingSize === selectedDrink.servingSize
      ) {
        return this._orderDrink[i];
      }
    }

    return false;
  }
  addDrink(json) {
    this.findDrink(json);
    if (!this.findDrink(json)) {
      const selectedDrink = new Drink();
      selectedDrink.fromJSON(json);
      this._orderDrink.push(selectedDrink);
      this.priceDrinks();
      return selectedDrink;
    }
  }
  removeDrink(json) {
    for (var i = 0; i < this._orderDrink.length; i++) {
      const selectedDrink = new Drink();
      selectedDrink.fromJSON(json);
      if (
        selectedDrink.id === this._orderDrink[i].id &&
        selectedDrink.servingSize === this._orderDrink[i].servingSize
      ) {
        this._orderDrink.splice(i, 1);
        this.priceDrinks();
        return true;
      }
    }
    return false;
  }
  addCoffee(json, espressoServingSize) {
    const coffee = new Coffee();
    coffee.fromJSON(json);
    coffee.espressoServingSize = espressoServingSize;
    this._orderDrink.push(coffee);
    this.priceDrinks();
  }
  updateEspressoServingSize(json, espressoServingSize) {
    const coffee = new Coffee();
    coffee.fromJSON(json);
    for (var i in this._orderDrink) {
      if (
        this._orderDrink[i].id === coffee.id &&
        this._orderDrink[i].servingSize === coffee.servingSize
      ) {
        this._orderDrink[i].espressoServingSize = espressoServingSize;
      }
    }
    this.priceDrinks();
  }
  addTemp(json) {
    const temp = json;

    for (var i = 0; i < this._orderDrink.length; i++) {
      if (this._orderDrink[i].drinkCategory === "coffee") {
        this._orderDrink[i].temperature = temp.id;
        return true;
      }
    }
    return false;
  }
  removeTemp() {
    for (var i = 0; i < this._orderDrink.length; i++) {
      if (this._orderDrink[i].drinkCategory === "coffee") {
        this._orderDrink[i].temperature = null;
        return true;
      }
    }
    return false;
  }
  addMilk(json) {
    const milk = json;
    for (var i = 0; i < this._orderDrink.length; i++) {
      if (this._orderDrink[i].drinkCategory === "coffee") {
        this._orderDrink[i].milkType = milk.id;
        this._orderDrink[i].milkPrice = milk.price;
        this.priceDrinks();
        return true;
      }
    }
    return false;
  }
  removeMilk() {
    for (var i = 0; i < this._orderDrink.length; i++) {
      if (this._orderDrink[i].drinkCategory === "coffee") {
        this._orderDrink[i].milkType = null;
        this._orderDrink[i].milkPrice = null;
        this.priceDrinks();
        return true;
      }
    }
    return false;
  }
  addSyrup(json, servingSize) {
    const syrup = json;
    for (var i = 0; i < this._orderDrink.length; i++) {
      if (this._orderDrink[i].drinkCategory === "coffee") {
        this._orderDrink[i].flavorSyrup = syrup.id;
        this._orderDrink[i].flavorSyrupServingSize = servingSize;
        this.priceDrinks();
        return true;
      }
    }

    return false;
  }
  removeSyrup() {
    for (var i = 0; i < this._orderDrink.length; i++) {
      if (this._orderDrink[i].drinkCategory === "coffee") {
        this._orderDrink[i].flavorSyrup = null;
        this._orderDrink[i].flavorSyrupServingSize = null;
        this.priceDrinks();
        return true;
      }
    }
    return false;
  }
  priceDrinks() {
    this._orderTotal = 0;
    for (var i = 0; i < this._orderDrink.length; i++) {
      if (this._orderDrink[i].drinkCategory === "coffee") {
        this._orderTotal += this._orderDrink[i].milkPrice;
        var espressoPrice = 0;
        var syrupPrice = 0;
        if (this._orderDrink[i].espressoServingSize === "extra") {
          espressoPrice = 3.5;
          this._orderDrink[i].espressoPrice = espressoPrice;
        }
        if (this._orderDrink[i].flavorSyrupServingSize === "extra") {
		  syrupPrice = 1.98;
		  this._orderDrink[i].flavorSyrupPrice = syrupPrice
		  
        } else if (this._orderDrink[i].flavorSyrupServingSize) {
		  syrupPrice = 0.99;
		  this._orderDrink[i].flavorSyrupPrice = syrupPrice
        }
        this._orderTotal += syrupPrice;
        this._orderTotal += espressoPrice;
        this._orderTotal += this._orderDrink[i].price;
      } else {
        const drinkPrice =
          this._orderDrink[i].quantity * this._orderDrink[i].price;
        this._orderTotal += drinkPrice;
      }
    }
  }
}
// Side Models
export class IceCreamBowl {
  constructor(
    id = null,
    flavor = null,
    servingSize = null,
    price = null,
    quantity = 1,
    sideName = null,
    toppings = new Array(),
    cost = 3.5
  ) {
    this._id = id;
    this._flavor = flavor;
    this._price = price;
    this._servingSize = servingSize;
    this._quantity = quantity;
    this._sideName = sideName;
    this._toppings = toppings;
    this._cost = cost;
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
  get servingSize() {
    return this._servingSize;
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
  get cost() {
    return this._cost;
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
  set servingSize(value) {
    this._servingSize = value;
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
  set cost(value) {
    this._cost = value;
  }
  toJSON() {
    this.updateServingSize();
    const data = {
      id: this._id,
      flavor: this._flavor,
      price: this._price,
      servingSize: this._servingSize,
      quantity: this._quantity,
      sideName: this._sideName,
      toppings: this._toppings,
      cost: this._cost,
    };
    return data;
  }
  fromJSON(json) {
	const data = json;
    this._id = data.id;
    this._flavor = data.flavor;
    this._price = data.price;
    this._servingSize = data.servingSize;
    this._quantity = data.quantity;
    if (data.side_name_id) {
      this._sideName = data.side_name_id;
    } else if (data.sideName) {
      this._sideName = data.sideName;
    }
    if (data.cost) {
      this._cost = data.cost;
    } else {
      this._cost = this._price * this._quantity
    }
    if (data.toppings) {
      for (var i = 0; i < data.toppings.length; i++) {
        const newTopping = new Ingredient();
        newTopping.fromJSON(data.toppings[i]);
        this._toppings.push(newTopping);
      }
    }
  }
  updateIceCreamBowlQuantity(value) {
    if (value === "decrease") {
      if (this._quantity === 0) {
        return;
      } else {
        this._quantity -= 1;
        this.updateServingSize();
      }
    } else if (value === "increase") {
      if (this._quantity < 3) {
        this._quantity += 1;
        this.updateServingSize();
      } else {
        return;
      }
    }
    if (this._quantity === 1) {
      this._cost = 3.5;
    } else if (this._quantity === 2) {
      this._cost = 4.5;
    } else if (this._quantity === 3) {
      this._cost = 5.5;
    }
  }
  updateServingSize() {
    if (this._quantity === 1) {
      this._servingSize = "1_scoop";
    } else if (this._quantity === 2) {
      this._servingSize = "2_scoops";
    } else if (this._quantity === 3) {
      this._servingSize = "3_scoops";
    }
  }
}
export class OrderSide {
  constructor(orderSide = new Array(), orderTotal = 0) {
    this._orderSide = orderSide;
    this._orderTotal = orderTotal;
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
  toJSON() {
    this.priceSides();
    const data = {
      orderSide: this._orderSide,
      orderTotal: this._orderTotal,
    };
    return data;
  }
  fromJSON(json) {
    const data = json;
    for (var i = 0; i < data.orderSide.length; i++) {
      const sideCategory = data.orderSide[i].sideName;
      if (sideCategory === "ice_cream_bowl") {
        const newIceCreamBowl = new IceCreamBowl();
        newIceCreamBowl.fromJSON(data.orderSide[i]);
        this._orderSide.push(newIceCreamBowl);
      }
    }
    this.priceSides();
  }
  checkIfIceCreamSelected() {
    for (var i = 0; i < this._orderSide.length; i++) {
      if (this._orderSide[i].sideName === "ice_cream_bowl") {
        return true;
      }
    }
    return false;
  }
  checkIfThisToppingSelected(json) {
    const topping = new Ingredient();
    topping.fromJSON(json);
    for (var i = 0; i < this._orderSide.length; i++) {
      if (this._orderSide[i].sideName === "ice_cream_bowl") {
        if (this._orderSide[i].toppings.length) {
          for (var j = 0; j < this._orderSide[i].toppings.length; j++) {
            if (this._orderSide[i].toppings[j].id === topping.id) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
  changeSideQuantity(json, value) {
    const selectedItemCategory = json.side_name_id;
    const selectedSide = this.findSide(json);
    if (!selectedSide && value === "increase") {
      const addedSide = this.addSide(json);
      return addedSide;
    } else {
      if (selectedItemCategory === "ice_cream_bowl") {
        selectedSide.updateIceCreamBowlQuantity(value);
        if (selectedSide.quantity === 0) {
          this.removeSide(json);
          return 0;
        } else {
          return selectedSide;
        }
      }
    }
  }
  findSide(json) {
    const selectedItemCategory = json.side_name_id;

    if (selectedItemCategory === "ice_cream_bowl") {
      const selectedSide = new IceCreamBowl();
      selectedSide.fromJSON(json);
      for (var i = 0; i < this._orderSide.length; i++) {
        if (this._orderSide[i].flavor === selectedSide.flavor) {
          return this._orderSide[i];
        }
      }
    }
    return false;
  }
  addSide(json) {
    const selectedItemCategory = json.side_name_id;
    if (!this.findSide(json)) {
      if (selectedItemCategory === "ice_cream_bowl") {
        const newIceCreamBowl = new IceCreamBowl();
        newIceCreamBowl.fromJSON(json);
        this._orderSide.push(newIceCreamBowl);
        this.priceSides();
        return newIceCreamBowl;
      }
    }
  }
  removeSide(json) {
    const selectedItemCategory = json["side_name_id"];
    if (selectedItemCategory === "ice_cream_bowl") {
      const selectedItem = new IceCreamBowl();
      selectedItem.fromJSON(json);
      for (var i = 0; i < this._orderSide.length; i++) {
        if (selectedItem.flavor === this._orderSide[i].flavor) {
          this._orderSide.splice(i, 1);
          this.priceSides();
          return true;
        }
      }
    }

    return false;
  }
  addTopping(json, servingSize) {
    const selectedItem = new Ingredient();
    selectedItem.fromJSON(json);
    if (!this.checkIfThisToppingSelected(json)) {
      selectedItem.servingSize = servingSize;
      for (var i = 0; i < this._orderSide.length; i++) {
        if (this._orderSide[i].sideName === "ice_cream_bowl") {
          this._orderSide[i].toppings.push(selectedItem);
          this.priceSides();
          return selectedItem;
        }
      }
    } else if (this.checkIfThisToppingSelected(json)) {
      this.updateToppingServingSize(selectedItem, servingSize);
      return true;
    }
    return false;
  }
  removeTopping(json) {
    const selectedTopping = new Ingredient();
    selectedTopping.fromJSON(json);
    for (var i = 0; i < this._orderSide.length; i++) {
      if (this._orderSide[i].sideName === "ice_cream_bowl") {
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
  }
  priceSides() {
    this._orderTotal = 0;
    if (this._orderSide.length) {
      for (var i = 0; i < this._orderSide.length; i++) {
        if (this._orderSide[i].sideName === "ice_cream_bowl") {
          if (this._orderSide[i].toppings.length) {
            for (var j = 0; j < this._orderSide[i].toppings.length; j++) {
              this._orderTotal += this._orderSide[i].toppings[j].cost;
            }
          }
          this._orderTotal += this._orderSide[i].cost;
        } else {
          this._orderTotal += this._orderSide[i].cost;
        }
      }
    }
  }
  updateToppingServingSize(topping, servingSize) {
    for (var i = 0; i < this._orderSide.length; i++) {
      if (this._orderSide[i].sideName === "ice_cream_bowl") {
        if (this._orderSide[i].toppings.length) {
          for (var j = 0; i < this._orderSide[i].toppings.length; j++) {
            if (this._orderSide[i].toppings[j].id === topping.id) {
              this._orderSide[i].toppings[j].servingSize = servingSize;
              return true;
            }
          }
          return false;
        }
      }
    }
  }
}
// Sweet Crepe Models
export class Ingredient {
  constructor(
    id = null,
    servingSize = "regular",
    price = 0,
    category = null,
    quantity = 1,
    cost = 0
  ) {
    this._id = id;
    this._servingSize = servingSize;
    this._price = price;
    this._category = category;
    this._quantity = quantity;
    this._cost = cost;
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
  get cost() {
    return this._cost;
  }
  set id(value) {
    this._id = value;
  }
  set servingSize(value) {
    this._servingSize = value;
    if (this._servingSize === "extra") {
      this._quantity = 2;
    }
    this._cost = this._quantity * this._price;
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
  set cost(value) {
    this._cost = value;
  }
  toJSON() {
    const data = {
      id: this._id,
      servingSize: this._servingSize,
      price: this._price,
      category: this._category,
      quantity: this._quantity,
      cost: this._cost,
    };
    return data;
  }
  fromJSON(json) {
    const data = json;
    this.id = data.id;
    this.servingSize = data.servingSize;
    this.price = data.price;
    if (data.cost) {
      this._cost = data.cost;
    }
    if (data.category) {
      this._category = data.category;
    } else if (data.ingredient_category_id) {
      this._category = data.ingredient_category_id;
    }
    if (data.quantity) {
      this._quantity = data.quantity;
    }
  }
  updateQuantity(value) {
    if (value === "decrease") {
      if (this._quantity === 0) {
        if (this._category === "fruit" || this._category === "sweetness") {
          this._cost = this._quantity * this._price;
          return;
        }
      } else {
        this._quantity -= 1;
      }
    } else if (value === "increase") {
      this._quantity += 1;
    }
    if (this._category === "fruit" || this._category === "sweetness") {
      this._cost = this._quantity * this._price;
      return;
    }
  }
}
export class MenuCrepe {
  constructor(
    id = null,
    name = null,
    flavor = null,
    quantity = 1,
    origination = null,
    price = 0
  ) {
    this._id = id;
    this._name = name;
    this._flavor = flavor;
    this._quantity = quantity;
    this._origination = origination;
    this._price = price;
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

  toJSON() {
    const data = {
      id: this._id,
      name: this._name,
      flavor: this._flavor,
      quantity: this._quantity,
      origination: this._origination,
      price: this._price,
    };
    return data;
  }
  fromJSON(json) {
    const data = json;
    if (data.crepe_id) {
      this._id = data.crepe_id;
    } else if (data.id) {
      this._id = data.id;
    }
    this._name = data.name;
    if (data.flavor) {
      this._flavor = data.flavor;
    } else if (data.flavor_profile_id) {
      this._flavor = data.flavor_profile_id;
    }
    if (data.quantity) {
      this._quantity = data.quantity;
    }
    if (data.origination) {
      this._origination = data.origination;
    } else if (data.origination_id) {
      this._origination = data.origination_id;
    }
    this._price = data.price;
  }
  updateCrepeQuantity(value) {
    if (value === "decrease") {
      if (this._quantity === 0) {
        return;
      } else {
        this._quantity -= 1;
      }
    } else if (value === "increase") {
      this._quantity += 1;
    }
  }
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
    this._id = id;
    this._name = name;
    this._flavor = flavor;
    this._quantity = quantity;
    this._origination = origination;
    this._ingredients = ingredients;
    this._menuCrepes = menuCrepes;
    this._orderTotal = orderTotal;
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

  toJSON() {
    if (this._ingredients.length) {
      this.priceCrepe();
    } else if (this._menuCrepes.length) {
      this.priceCrepes();
    }
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
  }
  fromJSON(json) {
    const data = json;
    this._id = data.id;
    this._name = data.name;
    this._flavor = data.flavor;
    this._quantity = data.quantity;
    this._origination = data.origination;
    this._orderTotal = data.orderTotal;

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
  }

  findIngredient(json) {
    const selectedIngredient = new Ingredient();
    selectedIngredient.fromJSON(json);
    if (this._ingredients.length) {
      for (var i = 0; i < this._ingredients.length; i++) {
        if (this._ingredients[i].id === selectedIngredient.id) {
          return this._ingredients[i];
        }
      }
    }
    return false;
  }
  addIngredient(json, servingSize) {
    const newIngredient = new Ingredient();
    newIngredient.fromJSON(json);
    newIngredient.servingSize = servingSize;
    this._ingredients.push(newIngredient);
    this.priceCrepe();
    return newIngredient;
  }
  removeIngredient(json) {
    const selectedIngredient = new Ingredient();
    selectedIngredient.fromJSON(json);
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
  }
  changeIngredientQuantity(json, value) {
    const selectedIngredient = this.findIngredient(json);
    if (!selectedIngredient) {
      const addedIngredient = this.addIngredient(json, "regular");
      this.priceCrepe();
      return addedIngredient;
    } else {
      selectedIngredient.updateQuantity(value);
      if (selectedIngredient.quantity === 0) {
        this.removeIngredient(json);
      }
      this.priceCrepe();
      return selectedIngredient;
    }
  }
  changeSavoryIngredientQuantity(json, servingSize) {
    const selectedIngredient = this.findIngredient(json);
    const ingredientCategory = json.ingredient_category_id;
    const proteinStatus = this.checkIfProteinSelected();
    if (!selectedIngredient) {
      if (ingredientCategory != "protein") {
        const addedIngredient = this.addIngredient(json, servingSize);
        return addedIngredient;
      } else {
        // if a protein has alread been selected then we want to add this protein as either a regular quantity if the other is extra, or a light quantity if the other is regular
        if (proteinStatus != true && proteinStatus != false) {
          const proteinIngredient = proteinStatus;
          const servingSizeOfSelectedProtein = proteinIngredient.servingSize;
          if (servingSizeOfSelectedProtein === "regular") {
            const servingSizeOfNewIngredient = "light";
            const addedIngredient = this.addIngredient(
              json,
              servingSizeOfNewIngredient
            );
            this.updateIngredientServingSize(proteinIngredient, "light");
            return addedIngredient;
          } else if (servingSizeOfSelectedProtein === "extra") {
            const servingSizeOfNewIngredient = "regular";
            const addedIngredient = this.addIngredient(
              json,
              servingSizeOfNewIngredient
            );
            this.updateIngredientServingSize(proteinIngredient, "regular");
            return addedIngredient;
          } else if (servingSizeOfSelectedProtein === "light") {
            const servingSizeOfNewIngredient = "light";
            const addedIngredient = this.addIngredient(
              json,
              servingSizeOfNewIngredient
            );
            return addedIngredient;
          }
        } else if (proteinStatus === true) {
          const addedIngredient = this.addIngredient(json, servingSize);
          return addedIngredient;
        } else if (proteinStatus === false) {
          return proteinStatus;
        }
      }
    } else {
      return this.updateIngredientServingSize(selectedIngredient, servingSize);
    }
  }
  updateIngredientServingSize(ingredient, servingSize) {
    for (var i = 0; i < this._ingredients.length; i++) {
      if (this._ingredients[i].id === ingredient.id) {
        this._ingredients[i].servingSize = servingSize;
        this.priceCrepe();
        return true;
      }
    }
    return false;
  }
  priceCrepe() {
    this._orderTotal = 0;
    var allotedFruit = 2;
    if (this._flavor === "savory") {
      var cheeseBool = false;
      if (this._ingredients.length) {
        for (var i = 0; i < this._ingredients.length; i++) {
          if (this._ingredients[i].category === "cheese" && !cheeseBool && this._ingredients[i].id !== 'triple_creme_brie') {
            console.log("this._ingredients[i].id", this._ingredients[i].id)
            
            cheeseBool = true;
            const cheeseQuantMinusIncludedCheese =
              this._ingredients[i].quantity - 1;
            this._ingredients[i].cost =
              cheeseQuantMinusIncludedCheese * this._ingredients[i].price;
          }
     
          const ingredientPrice = this._ingredients[i].cost;
          console.log("this._ingredients[i]", this._ingredients[i])
          
          this._orderTotal += ingredientPrice;
        }
      }
    } else if (this._flavor === "sweet") {
      this._orderTotal += 10.95;
      var sweetnessBool = false;
      var fruitQuantMinusIncludedfruit = 0;
      if (this._ingredients.length) {
        for (var i = 0; i < this._ingredients.length; i++) {
          if (this._ingredients[i].category === "fruit" && allotedFruit > 0) {
            if (this._ingredients[i].quantity > 1) {
              fruitQuantMinusIncludedfruit = this._ingredients[i].quantity - 2;
              allotedFruit -= 2;
            } else {
              fruitQuantMinusIncludedfruit = this._ingredients[i].quantity - 1;
              allotedFruit -= 1;
            }

            this._ingredients[i].cost =
              fruitQuantMinusIncludedfruit * this._ingredients[i].price;
          } else if (
            this._ingredients[i].category === "sweetness" &&
            !sweetnessBool && this._ingredients[i].id !== "homemade_whipped_cream"
          ) {
            sweetnessBool = true;
            const sweetnessQuantMinusIncludedsweetness =
              this._ingredients[i].quantity - 1;
            this._ingredients[i].cost =
              sweetnessQuantMinusIncludedsweetness * this._ingredients[i].price;
          }
          else if (this._ingredients[i].category === "sweetness" &&
          !sweetnessBool && this._ingredients[i].id === "homemade_whipped_cream") {
            this._ingredients[i].cost = this._ingredients[i].quantity * this._ingredients[i].price
            const ingredientCost = this._ingredients[i].cost
            this._cost += ingredientCost
          }
          const ingredientPrice = this._ingredients[i].cost;
          this._orderTotal += ingredientPrice;
        }
      }
    }
  }
  checkIfProteinSelected() {
    var counter = 0;
    var response = null;
    for (var i = 0; i < this._ingredients.length; i++) {
      if (this._ingredients[i].category === "protein") {
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
  }
  findCrepe(json) {
    const selectedCrepe = new MenuCrepe();
    selectedCrepe.fromJSON(json);
    for (var i = 0; i < this._menuCrepes.length; i++) {
      if (this._menuCrepes[i].id === selectedCrepe.id) {
        return this._menuCrepes[i];
      }
    }
    return false;
  }
  addCrepe(json) {
    const crepeToAdd = new MenuCrepe();
    crepeToAdd.fromJSON(json);
    this._menuCrepes.push(crepeToAdd);
    this.priceCrepes();
    return crepeToAdd;
  }
  removeCrepe(json) {
    const selectedCrepe = new MenuCrepe();
    selectedCrepe.fromJSON(json);
    for (var i = 0; i < this._menuCrepes.length; i++) {
      if (selectedCrepe.id === this._menuCrepes[i].id) {
        this._menuCrepes.splice(i, 1);
        this.priceCrepes();
        return true;
      }
    }
    return false;
  }
  changeCrepeQuantity(json, value) {
    const selectedCrepe = this.findCrepe(json);
    if (!selectedCrepe) {
      return this.addCrepe(json);
    } else {
      selectedCrepe.updateCrepeQuantity(value);
      if (selectedCrepe.quantity === 0) {
        this.removeCrepe(json);
      }
    }
  }
  priceCrepes() {
    this._orderTotal = 0;
    for (var i = 0; i < this._menuCrepes.length; i++) {
      const crepePrice =
        this._menuCrepes[i].price * this._menuCrepes[i].quantity;
      this._orderTotal += crepePrice;
    }
  }
}
