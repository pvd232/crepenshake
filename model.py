from datetime import date
import uuid


class Crepe_Model(object):
    def __init__(self, id=None, orgination_id=None, flavor_profile_id=None):
        self.id = id
        self.origination_id = orgination_id
        self.flavor_profile_id = flavor_profile_id

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Ingredient_Category(object):
    def __init__(self, id=None):
        self.id = id

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Ingredient_Model(object):
    def __init__(self, id=None, ingredient_category_id=None, serving_size=None, price=None, ingredient_object=None):
        if ingredient_object:
            self.id = ingredient_object["id"]
            self.ingredient_category_id = ingredient_object["category"]
            self.serving_size = ingredient_object["servingSize"]
            self.price = ingredient_object["price"]
        else:
            self.id = id
            self.ingredient_category_id = ingredient_category_id
            self.serving_size = serving_size
            self.price = price

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Order_Crepe_Model(object):
    def __init__(self, order_id=None, order_crepe=None, order_crepe_object=None):
        self.order_id = order_id
        self.order_crepe = list()
        if order_crepe_object:
            for order_crepe in order_crepe_object:
                if order_crepe['origination'] == 'custom':
                    new_custom_crepe = Custom_Crepe_Model(
                        custom_crepe_object=order_crepe)
                    self.order_crepe.append(new_custom_crepe)
                elif order_crepe['origination'] == 'menu':
                    for menu_crepe in order_crepe['menuCrepes']:
                        menu_crepe_bool = False
                        new_menu_crepe = Menu_Crepe_Model(
                            menu_crepe_object=menu_crepe)
                        for crepe in self.order_crepe:
                            if crepe.crepe_id == new_menu_crepe.crepe_id:
                                crepe.quantity += 1
                                menu_crepe_bool = True
                        if not menu_crepe_bool:
                            self.order_crepe.append(new_menu_crepe)
        else:
            self.order_id = order_id
            self.order_crepe = order_crepe

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Order_Side_Model(object):
    def __init__(self, order_id=None, order_side=None, quantity=None, order_side_object=None):
        if order_side_object:
            self.order_id = order_id
            self.order_side = list()
            for order_side in order_side_object:
                sides_in_order = order_side['orderSide']
                for side in sides_in_order:
                    if side['sideName'] == 'ice_cream_bowl':
                        new_ice_cream_bowl = Ice_Cream_Bowl_Model(
                            ice_cream_object=side)
                        self.order_side.append(new_ice_cream_bowl)
                    else:
                        new_croissant = Side_Model(side_object=side)
                        side_bool = False
                        for side in self.order_side:
                            if side.id == new_croissant.id:
                                side.quantity += 1
                                side_bool = True
                        if not side_bool:
                            self.order_side.append(new_croissant)

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Order_Drink_Model(object):
    def __init__(self, order_id=None, order_drink=None, order_drink_object=None):
        if order_drink_object:
            self.order_id = order_id
            self.order_drink = list()
            for orderDrink in order_drink_object:
                drinks_in_order = orderDrink['orderDrink']
                for drink in drinks_in_order:
                    if drink['drinkCategory'] == 'coffee':
                        new_coffee = Coffee_Model(coffee_object=drink)
                        self.order_drink.append(new_coffee)
                    else:
                        drink_bool = False
                        new_drink = Drink_Model(drink_object=drink)
                        for drink in self.order_drink:
                            if drink.id == new_drink.id:
                                drink.quantity += 1
                                drink_bool = True
                        if not drink_bool:
                            self.order_drink.append(new_drink)
        else:
            self.order_id = order_id
            self.order_drink = order_drink

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Order_Model(object):
    def __init__(self, id=None, customer=None, cost=None, date=date.today(), order_crepe=None, order_drink=None, order_side=None, order_object=None):
        if order_object:
            self.id = uuid.uuid4()
            self.customer = Customer_Model(
                customer_object=order_object['customerData'])
            self.cost = float(order_object['orderTotal'])
            self.date = date
            if len(order_object['orderCrepe']) > 0:
                self.order_crepe = Order_Crepe_Model(order_id=self.id,
                                                     order_crepe_object=order_object['orderCrepe'])
            else:
                self.order_crepe = order_crepe
            if len(order_object['orderDrink']) > 0:
                self.order_drink = Order_Drink_Model(order_id=self.id,
                                                     order_drink_object=order_object['orderDrink'])
            else:
                self.order_drink = order_drink
            if len(order_object['orderSide']) > 0:
                self.order_side = Order_Side_Model(order_id=self.id,
                                                   order_side_object=order_object['orderSide'])
            else:
                self.order_side = order_side

        else:
            self.id = id
            self.customer = customer
            self.cost = cost
            self.date = date

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Customer_Model(object):
    def __init__(self, id=None, first_name=None, last_name=None, street=None, city=None, state=None, zipcode=None, country=None, customer_object=None, stripe_id=None):
        if customer_object:
            self.id = customer_object["id"]
            self.stripe_id = customer_object["stripeId"]
            self.first_name = customer_object["firstName"]
            self.last_name = customer_object["lastName"]
            self.street = customer_object["street"]
            self.city = customer_object["city"]
            self.state = customer_object["state"]
            self.zipcode = customer_object["zipcode"]
            self.country = customer_object["country"]
            # self.payment_information = Payment_Information_Model(
            #     payment_object=customer_object['paymentInformation'])
        
        else:
            self.id = id
            self.stripe_id = stripe_id
            self.first_name = first_name
            self.last_name = last_name
            self.street = street
            self.city = city
            self.state = state
            self.zipcode = zipcode
            self.country = country

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


# class Payment_Information_Model(object):
#     def __init__(self, payment_object):
#         print("payment_object", payment_object)
        
#         self.payment_method = payment_object["paymentMethod"]
#         self.credit_card_name = payment_object["creditCardName"]
#         self.credit_card_number = payment_object["creditCardNumber"]
#         self.credit_card_expiration_month = payment_object["creditCardExpirationMonth"]
#         self.credit_card_expiration_year = payment_object["creditCardExpirationYear"]
#         self.credit_card_cvv = payment_object["creditCardCVV"]


class Menu_Crepe_Model(object):
    def __init__(self, crepe_id=None, name=None, price=None, flavor_profile_id=None, origination_id=None, menu_crepe_object=None):
        if menu_crepe_object:
            self.crepe_id = menu_crepe_object["id"]
            self.name = menu_crepe_object["name"]
            self.price = menu_crepe_object["price"]
            self.flavor_profile_id = menu_crepe_object["flavor"]
            self.origination_id = menu_crepe_object["origination"]
            self.quantity = menu_crepe_object["quantity"]
        else:
            self.crepe_id = crepe_id
            self.name = name
            self.price = price
            self.flavor_profile_id = flavor_profile_id
            self.origination_id = origination_id

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes

# these will only be recieved from the front end


class Custom_Crepe_Model(object):
    def __init__(self, crepe_id=None, ingredients=None, flavor_profile_id=None, origination_id=None, quantity=1, custom_crepe_object=None):
        if custom_crepe_object:
            self.crepe_id = uuid.uuid4()
            self.ingredients = list()
            self.flavor_profile_id = custom_crepe_object['flavor']
            self.origination_id = 'custom'
            self.quantity = custom_crepe_object['quantity']
            for ingredient in custom_crepe_object["ingredients"]:
                new_ingredient = Ingredient_Model(ingredient_object=ingredient)
                self.ingredients.append(new_ingredient)
        else:
            self.crepe_id = uuid.uuid4()
            self.ingredients = ingredients

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Drink_Category(object):
    def __init__(self, id=None):
        self.id = id

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Coffee_Model(object):
    def __init__(self, id=None, drink_category_id=None, name=None, milk_type_id=None, price=None, espresso_serving_size=None, espresso_price=None, coffee_syrup_flavor=None, coffee_syrup_flavor_serving_size=None, serving_size=None, quantity=None, temperature=None, coffee_object=None):
        if (coffee_object):
            self.id = uuid.uuid4()
            self.name = coffee_object["name"]
            self.drink_category_id = coffee_object["drinkCategory"]
            self.milk_type_id = coffee_object["milkType"]
            self.price = coffee_object["price"]

            if coffee_object["espressoServingSize"] == 'extra':
                self.espresso_serving_size = '3_shots'
            elif coffee_object["espressoServingSize"] == 'regular':
                self.espresso_serving_size = '2_shots'
            elif coffee_object["espressoServingSize"] == 'light':
                self.espresso_serving_size = '0_shots'

            if coffee_object["flavorSyrupServingSize"] == 'extra':
                self.coffee_syrup_flavor_serving_size = '2_pumps'
            elif coffee_object["flavorSyrupServingSize"] == 'regular':
                self.coffee_syrup_flavor_serving_size = '1_pump'
            elif coffee_object["flavorSyrupServingSize"] == 'light':
                self.coffee_syrup_flavor_serving_size = '.5_pumps'

            self.espresso_price = coffee_object["espressoPrice"]
            self.coffee_syrup_flavor = coffee_object["flavorSyrup"]
            self.serving_size = coffee_object["servingSize"]
            self.temperature = coffee_object['temperature']
            self.quantity = coffee_object["quantity"]
        else:
            self.id = id
            self.name = name
            self.drink_category_id = drink_category_id
            self.milk_type_id = milk_type_id
            self.price = price
            self.espresso_serving_size = espresso_serving_size
            self.espresso_price = espresso_price
            self.coffee_syrup_flavor = coffee_syrup_flavor
            self.coffee_syrup_flavor_serving_size = coffee_syrup_flavor_serving_size
            self.serving_size = serving_size
            self.quantity = quantity

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Drink_Model(object):
    def __init__(self, id=None, drink_category_id=None, name=None,  price=None, serving_size=None, quantity=None, drink_object=None):
        if (drink_object):
            self.id = drink_object['id']
            self.name = drink_object["name"]
            self.drink_category_id = drink_object["drinkCategory"]
            self.price = drink_object["price"]
            self.serving_size = drink_object["servingSize"]
            self.quantity = drink_object["quantity"]
        else:
            self.id = id
            self.name = name
            self.drink_category_id = drink_category_id
            self.price = price
            self.serving_size = serving_size
            self.quantity = quantity

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Temperature(object):
    def __init__(self, id=None):
        self.id = id

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Side_Model(object):
    def __init__(self, id=None, side_type_id=None, side_name_id=None, flavor=None, price=None, quantity=None, side_object=None):
        if side_object:
            self.id = side_object["id"]
            self.side_name_id = side_object["sideName"]
            self.flavor = side_object["flavor"]
            self.price = side_object["price"]
            self.quantity = side_object["quantity"]

        else:
            self.id = id
            self.side_type_id = side_type_id
            self.side_name_id = side_name_id
            self.flavor = flavor
            self.price = price
            self.quantity = quantity

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Ice_Cream_Bowl_Model(object):
    def __init__(self, id=None, flavor=None, price=None, serving_size=None, quantity=None, side_name_id=None, toppings=None, ice_cream_object=None):
        if ice_cream_object:
            print()
            print("ice_cream_object", ice_cream_object)
            print()
            self.id = uuid.uuid4()

            self.flavor = ice_cream_object["flavor"]
            self.price = ice_cream_object["price"]
            self.serving_size = ice_cream_object["servingSize"]
            self.quantity = ice_cream_object["quantity"]
            self.side_name_id = ice_cream_object["sideName"]
            self.toppings = list()
            print()
            print("self.toppings b4", self.toppings)
            print()
            for topping in ice_cream_object["toppings"]:
                new_topping = Ingredient_Model(ingredient_object=topping)
                self.toppings.append(new_topping)
            print("self.toppings after", self.toppings)

        else:
            self.id = id
            self.flavor = flavor
            self.price = price
            self.serving_size = serving_size
            self.quantity = quantity
            self.side_name_id = side_name_id
            self.toppings = toppings

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes
