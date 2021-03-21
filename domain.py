from datetime import datetime
import uuid


def humanize(dict=None, attr=None, format=False, word=False):
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


class Crepe_Domain(object):
    # def __init__(self, id=None, orgination_id=None, flavor_profile_id=None)
    def __init__(self, crepe_json=None, crepe_object=None):
        if crepe_json:
            self.id = crepe_json["id"]
            self.origination_id = crepe_json["crepe_json.orgination_id"]
            self.flavor_profile_id = crepe_json["flavor_profile_id"]
        elif crepe_object:
            self.id = crepe_json.id
            self.origination_id = crepe_json.orgination_id
            self.flavor_profile_id = crepe_json.flavor_profile_id

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Ingredient_Serving_Size(object):
    def __init__(self, id=None):
        self.id = id

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Ingredient_Domain(object):
    def __init__(self, ingredient_json=None, ingredient_object=None):
        print("ingredient_object", ingredient_object)
        
        if ingredient_json:
            self.id = ingredient_json["id"]
            self.ingredient_category_id = ingredient_json["category"]
            self.serving_size = ingredient_json["servingSize"]
            self.price = ingredient_json["price"]
        elif ingredient_object:
            if hasattr(ingredient_object, 'ingredient_id'):
                self.id = ingredient_object.ingredient_id
            else:
                self.id = ingredient_object.id
            self.ingredient_category_id = ingredient_object.ingredient_category_id
            self.serving_size = ingredient_object.serving_size
            self.price = ingredient_object.price

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes

    def __str__(self):
        return '<p style="font-size:large;"><span style="text-decoration:underline">Ingredient:</span> {0}, {1}</p>'.format(humanize(word=self.id), humanize(word=self.serving_size))


class Order_Crepe_Domain(object):
    def __init__(self, order_id=None, order_crepe_json=None, order_crepe_object=None):
        self.order_id = order_id
        self.order_crepe = list()
        if order_crepe_json:
            for order_crepe in order_crepe_json:
                if order_crepe['origination'] == 'menu':
                    for menu_crepe in order_crepe['menuCrepes']:
                        menu_crepe_bool = False
                        new_menu_crepe = Menu_Crepe_Domain(
                            menu_crepe_json=menu_crepe)
                        for crepe in self.order_crepe:
                            if crepe.crepe_id == new_menu_crepe.crepe_id:
                                crepe.quantity += 1
                                menu_crepe_bool = True
                        if not menu_crepe_bool:
                            self.order_crepe.append(new_menu_crepe)
            for order_crepe in order_crepe_json:
                if order_crepe['origination'] == 'custom':
                    new_custom_crepe = Custom_Crepe_Domain(
                        custom_crepe_json=order_crepe)
                    self.order_crepe.append(new_custom_crepe)
        elif order_crepe_object:
            for order_crepe in order_crepe_object:
                if order_crepe.origination == 'menu':
                    for menu_crepe in order_crepe.menuCrepes:
                        menu_crepe_bool = False
                        new_menu_crepe = Menu_Crepe_Domain(
                            menu_crepe_object=menu_crepe)
                        for crepe in self.order_crepe:
                            if crepe.crepe_id == new_menu_crepe.crepe_id:
                                crepe.quantity += 1
                                menu_crepe_bool = True
                        if not menu_crepe_bool:
                            self.order_crepe.append(new_menu_crepe)
            for order_crepe in order_crepe_object:
                if order_crepe.origination == 'custom':
                    new_custom_crepe = Custom_Crepe_Domain(
                        custom_crepe_object=order_crepe)
                    self.order_crepe.append(new_custom_crepe)

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
        return_object += '<br>'
        return return_object


class Order_Side_Domain(object):
    def __init__(self, order_id=None, order_side_json=None, order_side_object=None):
        if order_side_json:
            self.order_id = order_id
            self.order_side = list()
            for order_side in order_side_json:
                sides_in_order = order_side['orderSide']
                for side in sides_in_order:
                    if side['sideName'] == 'ice_cream_bowl':
                        new_ice_cream_bowl = Ice_Cream_Bowl_Domain(
                            ice_cream_json=side)
                        self.order_side.append(new_ice_cream_bowl)
        elif order_side_object:
            self.order_id = order_id
            self.order_side = list()
            for order_side in order_side_object:
                sides_in_order = order_side.orderSide
                for side in sides_in_order:
                    if side.sideName == 'ice_cream_bowl':
                        new_ice_cream_bowl = Ice_Cream_Bowl_Domain(
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
        return_object += '<br>'
        return return_object


class Order_Drink_Domain(object):
    def __init__(self, order_id=None, order_drink_json=None, order_drink_object=None):
        if order_drink_json:
            self.order_id = order_id
            self.order_drink = list()
            coffee_list = []
            milkshake_list = []
            bottled_list = []
            non_coffee_list = []
            for orderDrink in order_drink_json:
                drinks_in_order = orderDrink['orderDrink']
                # organizing the list for when i send the confirmation email to my parents
                for drink in drinks_in_order:
                    if drink['drinkCategory'] == 'coffee':
                        new_coffee = Coffee_Domain(coffee_json=drink)
                        coffee_list.append(new_coffee)
                    elif drink['drinkCategory'] == 'milkshake':
                        drink_bool = False
                        new_drink = Drink_Domain(drink_json=drink)
                        for drink in milkshake_list:
                            if drink.id == new_drink.id:
                                drink.quantity += 1
                                drink_bool = True
                        if not drink_bool:
                            milkshake_list.append(new_drink)
                    elif drink['drinkCategory'] == 'bottled':
                        drink_bool = False
                        new_drink = Drink_Domain(drink_json=drink)
                        for drink in bottled_list:
                            if drink.id == new_drink.id:
                                drink.quantity += 1
                                drink_bool = True
                        if not drink_bool:
                            bottled_list.append(new_drink)
                    elif drink['drinkCategory'] == 'non-coffee':
                        drink_bool = False
                        new_drink = Drink_Domain(drink_json=drink)
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

        elif order_drink_object:
            self.order_id = order_id
            self.order_drink = list()
            coffee_list = []
            milkshake_list = []
            bottled_list = []
            non_coffee_list = []
            for orderDrink in order_drink_object:
                drinks_in_order = orderDrink.orderDrink
                # organizing the list for when i send the confirmation email to my parents
                for drink in drinks_in_order:
                    if drink.drinkCategory == 'coffee':
                        new_coffee = Coffee_Domain(coffee_json=drink)
                        coffee_list.append(new_coffee)
                    elif drink.drinkCategory == 'milkshake':
                        drink_bool = False
                        new_drink = Drink_Domain(drink_object=drink)
                        for drink in milkshake_list:
                            if drink.id == new_drink.id:
                                drink.quantity += 1
                                drink_bool = True
                        if not drink_bool:
                            milkshake_list.append(new_drink)
                    elif drink.drinkCategory == 'bottled':
                        drink_bool = False
                        new_drink = Drink_Domain(drink_object=drink)
                        for drink in bottled_list:
                            if drink.id == new_drink.id:
                                drink.quantity += 1
                                drink_bool = True
                        if not drink_bool:
                            bottled_list.append(new_drink)
                    elif drink.drinkCategory == 'non-coffee':
                        drink_bool = False
                        new_drink = Drink_Domain(drink_object=drink)
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
        return_object += '<br>'
        return return_object


class Order_Domain(object):
    def __init__(self, order_json=None, order_object=None):
        if order_json:
            self.id = uuid.uuid4()
            self.customer = Customer_Domain(
                customer_json=order_json['customerData'])
            self.cost = float(order_json['orderTotal'])
            self.date = datetime.today()
            self.pickup_time = order_json["pickupTime"]
            self.pickup_timestamp = datetime.fromtimestamp(
                order_json["pickupTimestamp"])
            if len(order_json['orderCrepe']) > 0:
                self.order_crepe = Order_Crepe_Domain(order_id=self.id,
                                                      order_crepe_json=order_json['orderCrepe'])
            else:
                self.order_crepe = None
            if len(order_json['orderDrink']) > 0:
                self.order_drink = Order_Drink_Domain(order_id=self.id,
                                                      order_drink_json=order_json['orderDrink'])
            else:
                self.order_drink = None
            if len(order_json['orderSide']) > 0:
                self.order_side = Order_Side_Domain(order_id=self.id,
                                                    order_side_json=order_json['orderSide'])
            else:
                self.order_side = None

        elif order_object:
            self.id = order_object.id
            self.customer = order_object.customer_id
            self.cost = order_object.cost
            self.date = order_object.date
            self.pickup_time = order_object.pickupTime
            self.pickup_timestamp = datetime.fromtimestamp.pickupTimestamp
            if len(order_object.orderCrepe) > 0:
                self.order_crepe = Order_Crepe_Domain(order_id=self.id,
                                                      order_crepe_object=order_object.orderCrepe)
            else:
                self.order_crepe = None
            if len(order_object.orderDrink) > 0:
                self.order_drink = Order_Drink_Domain(order_id=self.id,
                                                      order_drink_object=order_object.orderDrink)
            else:
                self.order_drink = None
            if len(order_object.orderSide) > 0:
                self.order_side = Order_Side_Domain(order_id=self.id,
                                                    order_side_object=order_object.orderSide)
            else:
                self.order_side = None

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes

    def __str__(self):
        return '<p style= "font-weight:bold; font-size: large;">Crepes In Order:</p> <p style="font-size:large;">{0}</p> <br> <p style= "font-weight:bold; font-size: large;">Drinks in Order :</p> <p style="font-size:large;">{1}</p> <br> <p style= "font-weight:bold; font-size: large;">Sides in Order:</p> <p style="font-size:large;">{2}</p>'.format(str(self.order_crepe), str(self.order_drink), str(self.order_side))


class Customer_Domain(object):
    def __init__(self, customer_object=None, customer_json=None):
        if customer_json:
            self.id = customer_json["id"]
            self.stripe_id = customer_json["stripeId"]
            self.first_name = customer_json["firstName"]
            self.last_name = customer_json["lastName"]
            self.street = customer_json["street"]
            self.city = customer_json["city"]
            self.state = customer_json["state"]
            self.zipcode = customer_json["zipcode"]
            self.country = customer_json["country"]
            self.phone_number = customer_json["phoneNumber"]
        elif customer_object:
            self.id = customer_object.id
            self.stripe_id = customer_object.stripe_id
            self.first_name = customer_object.first_name
            self.last_name = customer_object.last_name
            self.street = customer_object.street
            self.city = customer_object.city
            self.state = customer_object.state
            self.zipcode = customer_object.zipcode
            self.country = customer_object.country

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Menu_Crepe_Domain(object):
    def __init__(self, menu_crepe_json=None, menu_crepe_object=None):
        if menu_crepe_json:
            self.crepe_id = menu_crepe_json["id"]
            self.name = menu_crepe_json["name"]
            self.price = menu_crepe_json["price"]
            self.flavor_profile_id = menu_crepe_json["flavor"]
            self.origination_id = menu_crepe_json["origination"]
            self.quantity = menu_crepe_json["quantity"]
            self.description = menu_crepe_json["description"]
        elif menu_crepe_object:
            self.crepe_id = menu_crepe_object.crepe_id
            self.name = menu_crepe_object.name
            self.price = menu_crepe_object.price
            self.flavor_profile_id = menu_crepe_object.flavor_profile_id
            self.origination_id = menu_crepe_object.origination_id
            self.description = menu_crepe_object.description

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


class Custom_Crepe_Domain(object):
    def __init__(self, custom_crepe_json=None, custom_crepe_object=None):
        if custom_crepe_json:
            self.crepe_id = uuid.uuid4()
            self.ingredients = list()
            self.flavor_profile_id = custom_crepe_json['flavor']
            self.origination_id = 'custom'
            self.quantity = custom_crepe_json['quantity']
            for ingredient in custom_crepe_json["ingredients"]:
                new_ingredient = Ingredient_Domain(ingredient_json=ingredient)
                self.ingredients.append(new_ingredient)
        elif custom_crepe_object:
            self.crepe_id = custom_crepe_object.id
            self.ingredients = list()
            self.flavor_profile_id = custom_crepe_object.flavor
            self.origination_id = 'custom'
            self.quantity = custom_crepe_object.quantity
            for ingredient in custom_crepe_object.ingredients:
                new_ingredient = Ingredient_Domain(
                    ingredient_object=ingredient)

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


class Drink_Category_Domain(object):
    def __init__(self, id=None):
        self.id = id

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Drink_Category_Domain(object):
    def __init__(self, id=None):
        self.id = id

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Drink_Domain(object):
    def __init__(self, drink_json=None, drink_object=None, drink_price_object=None):
        if (drink_json):
            self.id = drink_json['id']
            self.name = drink_json["name"]
            self.drink_category_id = drink_json["drinkCategory"]
            self.price = drink_json["price"]
            self.serving_size = drink_json["servingSize"]
            self.quantity = drink_json["quantity"]
        elif drink_object:
            self.id = drink_object.id
            self.name = drink_object.name
            self.drink_category_id = drink_object.drink_category_id
            self.price = drink_object.price
            self.serving_size = drink_object.serving_size
            self.quantity = 1
        elif drink_price_object:
            self.id = drink_price_object.id
            self.name = drink_price_object.name
            self.drink_category_id = drink_price_object.drink_category_id
            self.price = drink_price_object.price
            self.serving_size = drink_price_object.serving_size
            self.quantity = 1
            self.description = drink_price_object.description
        if self.description != None:
            self.gourmet_milkshake=True

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes

    def __str__(self):
        return '<p style="font-size: large"><span style="text-decoration: underline">Name:</span> {0}, Serving Size: {1}, Quantity: {2}</p>'.format(humanize(word=self.name), humanize(word=self.serving_size), self.quantity)


class Milk_Domain(object):
    def __init__(self, milk_json=None, milk_object=None):
        if (milk_json):
            self.id = milk_json['id']
            self.price = milk_json["price"]
        elif milk_object:
            self.id = milk_object.id
            self.price = milk_object.price

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Coffee_Syrup_Flavor_Domain(object):
    def __init__(self, id=None):
        self.id = id

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Coffee_Domain(object):
    def __init__(self, coffee_json=None, coffee_object=None):
        if coffee_json:
            self.id = uuid.uuid4()
            self.drink_id = coffee_json['id']
            self.name = coffee_json["name"]
            self.drink_category_id = coffee_json["drinkCategory"]
            self.milk_type_id = coffee_json["milkType"]
            self.price = coffee_json["price"]
            if coffee_json["espressoServingSize"] == 'extra':
                self.espresso_serving_size = '3_shots'
            elif coffee_json["espressoServingSize"] == 'regular':
                self.espresso_serving_size = '2_shots'
            elif coffee_json["espressoServingSize"] == 'light':
                self.espresso_serving_size = '0_shots'
            if coffee_json["flavorSyrupServingSize"] == 'extra':
                self.coffee_syrup_flavor_serving_size = '2_pumps'
            elif coffee_json["flavorSyrupServingSize"] == 'regular':
                self.coffee_syrup_flavor_serving_size = '1_pump'
            elif coffee_json["flavorSyrupServingSize"] == 'light':
                self.coffee_syrup_flavor_serving_size = '.5_pumps'
            else:
                self.coffee_syrup_flavor_serving_size = coffee_json["flavorSyrupServingSize"]
            self.espresso_price = coffee_json["espressoPrice"]
            self.coffee_syrup_flavor = coffee_json["flavorSyrup"]
            self.serving_size = coffee_json["servingSize"]
            self.temperature = coffee_json['temperature']
            self.syrup_price = coffee_json["flavorSyrupPrice"]
            self.quantity = coffee_json["quantity"]
        elif coffee_object:
            self.id = coffee_object.id
            self.drink_id = coffee_object.drink_id
            self.name = coffee_object.name
            self.drink_category_id = coffee_object.drink_category_id
            self.milk_type_id = coffee_object.milk_type_id
            self.price = coffee_object.price
            if coffee_object.espressoServingSize == 'extra':
                self.espresso_serving_size = '3_shots'
            elif coffee_object.espressoServingSize == 'regular':
                self.espresso_serving_size = '2_shots'
            elif coffee_object.espressoServingSize == 'light':
                self.espresso_serving_size = '0_shots'
            if coffee_object.flavorSyrupServingSize == 'extra':
                self.coffee_syrup_flavor_serving_size = '2_pumps'
            elif coffee_object.flavorSyrupServingSize == 'regular':
                self.coffee_syrup_flavor_serving_size = '1_pump'
            elif coffee_object.flavorSyrupServingSize == 'light':
                self.coffee_syrup_flavor_serving_size = '.5_pumps'
            else:
                self.coffee_syrup_flavor_serving_size = coffee_object.flavorSyrupServingSize
            self.espresso_price = coffee_object.espressoPrice
            self.coffee_syrup_flavor = coffee_object.flavorSyrup
            self.serving_size = coffee_object.servingSize
            self.temperature = coffee_object.temperature
            self.syrup_price = coffee_object.syrup_price
            self.quantity = coffee_object.quantity

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes

    def __str__(self):
        if self.coffee_syrup_flavor and self.coffee_syrup_flavor_serving_size:
            return '<p style="font-size: large;"><span style="text-decoration: underline;">Name:</span> {0}, Serving Size: {1}</p> <p style="font-size:large;">Milk: {2}</p> <p style="font-size:large;">Temperature: {3}</p> <p style="font-size:large;"> # of Espresso Shots: {4}</p> <p style="font-size:large;">Syrup Flavor: {5}, Serving Size: {6}</p>'.format(humanize(word=self.name), humanize(word=self.serving_size), humanize(word=self.milk_type_id), humanize(word=self.temperature), humanize(word=self.espresso_serving_size), humanize(word=self.coffee_syrup_flavor), humanize(word=self.coffee_syrup_flavor_serving_size))
        else:
            return '<p style="font-size: large;"><span style="text-decoration: underline;">Name:</span> {0}, Serving Size: {1}</p> <p style="font-size:large;">Milk: {2}</p> <p style="font-size:large;">Temperature: {3}</p> <p style="font-size:large;"> # of Espresso Shots: {4}</p>'.format(humanize(word=self.name), humanize(word=self.serving_size), humanize(word=self.milk_type_id), humanize(word=self.temperature), humanize(word=self.espresso_serving_size))


class Ingredient_Category_Domain(object):
    def __init__(self, id=None):
        self.id = id

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Temperature_Domain(object):
    def __init__(self, id=None):
        self.id = id

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Side_Type_Domain(object):
    def __init__(self, id=None):
        self.id = id

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Side_Domain(object):
    def __init__(self, side_json=None, side_object=None):
        if side_json:
            self.id = side_json["id"]
            self.side_name_id = side_json["sideName"]
            self.flavor = side_json["flavor"]
            self.price = side_json["price"]
            self.quantity = side_json["quantity"]
        elif side_object:
            self.id = side_object.id
            self.side_type_id = side_object.side_type_id
            self.side_name_id = side_object.side_name_id
            self.flavor = side_object.flavor
            self.price = side_object.price
            self.quantity = side_object.quantity

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Ice_Cream_Bowl_Domain(object):
    def __init__(self, ice_cream_json=None, ice_cream_object=None):
        if ice_cream_json:
            self.id = uuid.uuid4()
            self.flavor = ice_cream_json["flavor"]
            self.price = ice_cream_json["price"]
            self.serving_size = ice_cream_json["servingSize"]
            self.quantity = ice_cream_json["quantity"]
            self.side_name_id = ice_cream_json["sideName"]
            self.toppings = list()
            self.side_name_id = 'ice_cream_bowl'
            for topping in ice_cream_json["toppings"]:
                new_topping = Ingredient_Domain(ingredient_json=topping)
                self.toppings.append(new_topping)
        elif ice_cream_object:
            # no id attribute because ice_cream_object has its uuid created when it is ordered
            self.id = None
            self.flavor = ice_cream_object.flavor_id
            self.price = ice_cream_object.price
            self.serving_size = ice_cream_object.serving_size_id
            self.quantity = 1
            self.toppings = list()
            self.side_name_id = 'ice_cream_bowl'
            if hasattr(ice_cream_object, 'toppings'):

                for topping in ice_cream_object.toppings:
                    new_topping = Ingredient_Domain(ingredient_object=topping)
                    self.toppings.append(new_topping)

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
