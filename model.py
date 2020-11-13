from datetime import date
import uuid


def humanize(dict=None, attr=None, format=False, word = False):
    if format == True:
        for x in dict['ingredients']:
            str = x.__getattribute__(attr)
            frags = str.split('_')
            if len(frags) < 2:
                str = str.capitalize()
                setattr(x, attr, str)
            newFrags = []
            for frag in frags:
                frag = frag.capitalize()
                newFrags.append(frag)
            newFrags = " ".join(newFrags)
            setattr(x, attr, newFrags)
        return dict
    elif attr and dict:
        str = dict.__getattribute__(attr)
        frags = str.split('_')
        if len(frags) < 2:
            str = str.capitalize()
            setattr(dict, attr, str)
            return dict
        newFrags = []
        for frag in frags:
            frag = frag.capitalize()
            newFrags.append(frag)
        newFrags = " ".join(newFrags)
        setattr(dict, attr, newFrags)
        return dict

    elif word:
        frags = word.split('_')
        if len(frags) < 2:
            word = word.capitalize()
            return word
        else:
            newFrags = []
            for i in range(len(frags)):
                capitalFrag = frags[i].capitalize()
                newFrags.append(capitalFrag)    
            newFrags = ' '.join(newFrags)
            return newFrags


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

    def __str__(self):
        return '<p style="font-size:large;"><span style="text-decoration:underline">Ingredient:</span> {0}, {1}</p>'.format(humanize(word=self.id), humanize(word=self.serving_size))


class Order_Crepe_Model(object):
    def __init__(self, order_id=None, order_crepe=None, order_crepe_object=None):
        self.order_id = order_id
        self.order_crepe = list()
        if order_crepe_object:
            for order_crepe in order_crepe_object:
                if order_crepe['origination'] == 'menu':
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
            for order_crepe in order_crepe_object:
                if order_crepe['origination'] == 'custom':
                    new_custom_crepe = Custom_Crepe_Model(
                        custom_crepe_object=order_crepe)
                    self.order_crepe.append(new_custom_crepe)
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

    def __str__(self):
        return_object = ''
        menu_bool = False
        for i in range(len(self.order_crepe)):
            if self.order_crepe[i].origination_id == 'custom':
                return_object += str(self.order_crepe[i])
            elif self.order_crepe[i].origination_id == 'menu':
                if not menu_bool:
                    return_object += '<p style = "font-size: large; font-weight:bold;">Menu Crepes:</p>'
                    menu_bool = True
                return_object += str(self.order_crepe[i])
        return return_object


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

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes

    def __str__(self):
        return_object = ''
        for i in range(len(self.order_side)):
            if self.order_side[i].side_name_id == 'ice_cream_bowl':
                return_object += str(self.order_side[i])
        return return_object


class Order_Drink_Model(object):
    def __init__(self, order_id=None, order_drink=None, order_drink_object=None):
        if order_drink_object:
            self.order_id = order_id
            self.order_drink = list()
            coffee_list = []
            milkshake_list = []
            bottled_list = []
            non_coffee_list = []
            for orderDrink in order_drink_object:
                drinks_in_order = orderDrink['orderDrink']
                # organizing the list for when i send the confirmation email to my parents
                for drink in drinks_in_order:
                    if drink['drinkCategory'] == 'coffee':
                        new_coffee = Coffee_Model(coffee_object=drink)
                        coffee_list.append(new_coffee)
                    elif drink['drinkCategory'] == 'milkshake':
                        drink_bool = False
                        new_drink = Drink_Model(drink_object=drink)
                        for drink in milkshake_list:
                            if drink.id == new_drink.id:
                                drink.quantity += 1
                                drink_bool = True
                        if not drink_bool:
                            milkshake_list.append(new_drink)
                    elif drink['drinkCategory'] == 'bottled':
                        drink_bool = False
                        new_drink = Drink_Model(drink_object=drink)
                        for drink in bottled_list:
                            if drink.id == new_drink.id:
                                drink.quantity += 1
                                drink_bool = True
                        if not drink_bool:
                            bottled_list.append(new_drink)
                    elif drink['drinkCategory'] == 'non-coffee':
                        drink_bool = False
                        new_drink = Drink_Model(drink_object=drink)
                        for drink in non_coffee_list:
                            if drink.id == new_drink.id:
                                drink.quantity += 1
                                drink_bool = True
                        if not drink_bool:
                            non_coffee_list.append(new_drink)
            for drink in coffee_list:
                self.order_drink.append(drink)
            for drink in milkshake_list:
                self.order_drink.append(drink)
            for drink in non_coffee_list:
                self.order_drink.append(drink)
            for drink in bottled_list:
                self.order_drink.append(drink)
            
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

    def __str__(self):
        return_object = ''
        coffee_bool = False
        milkshake_bool = False
        non_coffee_bool = False
        bottled_bool = False
        for i in range(len(self.order_drink)):
            if self.order_drink[i].drink_category_id == 'coffee':
                if not coffee_bool:
                    return_object += '<p style="font-size: large; font-weight:bold;">Coffee</p>'
                    coffee_bool = True
                return_object += str(self.order_drink[i])
            elif self.order_drink[i].drink_category_id == 'milkshake':
                if not milkshake_bool:
                    return_object += '<p style="font-size: large; font-weight:bold;">Milkshake</p>'
                    milkshake_bool = True
                return_object += str(self.order_drink[i])
            elif self.order_drink[i].drink_category_id == 'non-coffee':
                if not non_coffee_bool:
                    return_object += '<p style="font-size: large; font-weight:bold;">Non-Coffee</p>'
                    non_coffee_bool = True
                return_object += str(self.order_drink[i])
            elif self.order_drink[i].drink_category_id == 'bottled':
                if not bottled_bool:
                    return_object += '<p style="font-size: large; font-weight:bold;">Bottled</p>'
                    bottled_bool = True
                return_object += str(self.order_drink[i])
        return return_object

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

    def __str__(self):
        return '<p style= "font-weight:bold; font-size: large;">Crepes In Order:</p> <p style="font-size:large;">{0}</p> <p style= "font-weight:bold; font-size: large;">Drinks in Order :</p> <p style="font-size:large;">{1}</p> <p style= "font-weight:bold; font-size: large;">Sides in Order:</p> <p style="font-size:large;">{2}</p>'.format(str(self.order_crepe), str(self.order_drink), str(self.order_side))


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

    def __str__(self):
        return '<p style="font-size: large;"><span style="text-decoration:underline">Crepe Name:</span> {0}, Quantity: {1}</p>'.format(humanize(word=self.name), self.quantity)
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

    def __str__(self):
        return_object = '<p style="font-size:large; font-weight:bold;">Custom Crepe:</p>'
        for i in range(len(self.ingredients)-1):
            return_object += str(self.ingredients[i])
        return_object += str(self.ingredients[-1])
        return return_object


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
    def __init__(self, id=None, drink_id = None, drink_category_id=None, name=None, milk_type_id=None, price=None, espresso_serving_size=None, espresso_price=None, coffee_syrup_flavor=None, coffee_syrup_flavor_serving_size=None, serving_size=None, quantity=None, temperature=None, syrup_price=None, coffee_object=None):
        if (coffee_object):
            self.id = uuid.uuid4()
            self.drink_id = coffee_object['id']
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
            self.syrup_price = syrup_price
            self.quantity = coffee_object["quantity"]
        else:
            self.id = id
            self.drink_id = drink_id
            self.name = name
            self.drink_category_id = drink_category_id
            self.milk_type_id = milk_type_id
            self.price = price
            self.espresso_serving_size = espresso_serving_size
            self.espresso_price = espresso_price
            self.coffee_syrup_flavor = coffee_syrup_flavor
            self.coffee_syrup_flavor_serving_size = coffee_syrup_flavor_serving_size
            self.serving_size = serving_size
            self.syrup_price = syrup_price
            self.quantity = quantity

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes

    def __str__(self):
        return '<p style="font-size: large;"><span style="text-decoration: underline;">Name:</span> {0}, Serving Size: {1}</p> <p style="font-size:large;">Milk: {2}</p> <p style="font-size:large;">Temperature: {3}</p> <p style="font-size:large;"> # of Espresso Shots: {4}</p> <p style="font-size:large;">Syrup Flavor: {5}, Serving Size: {6}</p>'.format(humanize(word=self.name), humanize(word=self.serving_size), humanize(word=self.milk_type_id), humanize(word=self.temperature), humanize(word=self.espresso_serving_size), humanize(word=self.coffee_syrup_flavor), humanize(word=self.coffee_syrup_flavor_serving_size))


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

    def __str__(self):
        return '<p style="font-size: large"><span style="text-decoration: underline">Drink:</span> {0}, Serving Size: {1}, Quantity: {2}</p>'.format(humanize(word=self.name), humanize(word=self.serving_size), self.quantity)


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
            self.id = uuid.uuid4()
            self.flavor = ice_cream_object["flavor"]
            self.price = ice_cream_object["price"]
            self.serving_size = ice_cream_object["servingSize"]
            self.quantity = ice_cream_object["quantity"]
            self.side_name_id = ice_cream_object["sideName"]
            self.toppings = list()
            for topping in ice_cream_object["toppings"]:
                new_topping = Ingredient_Model(ingredient_object=topping)
                self.toppings.append(new_topping)
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

    def __str__(self):
        return_object = '<p style="font-size:large; font-weight:bold;">Vanilla Ice Cream Bowl:</p>'
        return_object += f'<p style="font-size: large;">{humanize(word= self.serving_size)}</p>'
        for i in range(len(self.toppings)):
            return_object += str(self.toppings[i])
        return return_object
