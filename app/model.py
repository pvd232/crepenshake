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
            self.quantity = ingredient_object["quantity"]
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
    def __init__(self, order_id=None, order_crepe=list(), order_crepe_object=None):
        self.order_id = order_id
        self.order_crepe = order_crepe
        if order_crepe_object:
            for order_crepe in order_crepe_object:
                    if order_crepe['origination'] == 'custom':
                        new_custom_crepe = Custom_Crepe_Model(custom_crepe_object = order_crepe)
                        self.order_crepe.append(new_custom_crepe)
                    elif order_crepe['origination'] == 'menu':
                        for menu_crepe in order_crepe['menuCrepes']:
                            new_menu_crepe = Menu_Crepe_Model(menu_crepe_object=menu_crepe)
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
    def __init__(self, order_id=None, side_id=None, quantity=None):
        self.order_id = order_id
        self.side_id = side_id
        self.quantity = quantity

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Order_Drink_Model(object):
    def __init__(self, order_id=None, drink_id=None, quantity=None):
        self.order_id = order_id
        self.drink_id = drink_id
        self.quantity = quantity

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Order_Model(object):
    def __init__(self, id=None, customer=None, cost=None, date=date.today(), order_crepe = None, order_drink = None, order_side = None, order_object=None):
        if order_object:
            print("order_object", order_object)
            
            self.id = uuid.uuid4()
            self.customer = Customer_Model(
                customer_object=order_object['customerData'])
            self.cost = order_object['orderTotal']
            self.date = date
            if len(order_object['orderCrepe']) > 0:
                self.order_crepe = Order_Crepe_Model(order_id = self.id,
                    order_crepe_object=order_object['orderCrepe'])
            else:
                self.order_crepe = order_crepe
            # if len(order_object['orderDrink']) > 0:
            #     self.order_drink = Order_Drink_Model(
            #         order_drink_object=order_object['orderDrink'])
            # else:
            #     self.order_drink = order_drink
            # if len(order_object['orderSide']) > 0:
            #     self.order_side = Order_Side_Model(
            #         order_side_object=order_object['orderSide'])
            # else:
            #     self.order_side = order_side
            
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
    def __init__(self, id=None, first_name=None, last_name=None, street=None, city=None, state=None, zipcode=None, country=None, customer_object=None):
        if customer_object:
            self.id = customer_object["id"]
            self.first_name = customer_object["firstName"]
            self.last_name = customer_object["lastName"]
            self.street = customer_object["street"]
            self.city = customer_object["city"]
            self.state = customer_object["state"]
            self.zipcode = customer_object["zipcode"]
            self.country = customer_object["country"]
            self.payment_information = Payment_Information_Model(
                payment_object=customer_object['paymentInformation'])

        else:
            self.id = id
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


class Payment_Information_Model(object):
    def __init__(self, payment_object):
        self.payment_method = payment_object["paymentMethod"]
        self.credit_card_name = payment_object["creditCardName"]
        self.credit_card_number = payment_object["creditCardNumber"]
        self.credit_card_expiration = payment_object["creditCardExpiration"]
        self.credit_card_cvv = payment_object["creditCardCVV"]


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
    def __init__(self, crepe_id=None, ingredients=list(), flavor_profile_id=None, origination_id=None, quantity=1, custom_crepe_object=None):
        if custom_crepe_object:
            self.crepe_id = uuid.uuid4()
            self.ingredients = ingredients
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


class Drink_Model(object):
    def __init__(self, id=None, drink_category_id=None,  name=None,  milk_type_id=None, flavor=None, price=None, espresso=None, coffee_syrup_flavor=None, serving_size=None):

        self.id = id
        self.name = name
        self.drink_category_id = drink_category_id
        self.milk_type_id = milk_type_id
        self.flavor = flavor
        self.price = price
        self.espresso = espresso
        self.coffee_syrup_flavor = coffee_syrup_flavor
        self.serving_size = serving_size

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Order_Coffee(object):
    def __init__(self, id=None, coffee_name_id=None, serving_size_id=None, temperature_id=None, flavor_syrup_id=None, flavor_serving_size_id=None, espresso_serving_size_id=None, milk_type_id=None):
        self.id = id
        self.coffee_name_id = coffee_name_id
        self.serving_size_id = serving_size_id
        self.temperature_id = temperature_id
        self.flavor_syrup_id = flavor_syrup_id
        self.flavor_serving_size_id = flavor_serving_size_id
        self.espresso_serving_size_id = espresso_serving_size_id
        self.milk_type_id = milk_type_id

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
    def __init__(self, id=None, side_type_id=None, side_name_id=None, flavor=None, price=None, serving_size=None):
        self.id = id
        self.side_type_id = side_type_id
        self.side_name_id = side_name_id
        self.flavor = flavor
        self.price = price
        self.serving_size = serving_size

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Ice_Cream_Model(object):
    def __init__(self, id=None, serving_size=None):
        self.id = id
        self.serving_size = serving_size

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Order_Ice_Cream_Model(object):
    def __init__(self, id=None, flavor=None, price=None, serving_size=None, topping=None, topping_serving_size=None):
        self.id = id
        self.flavor = flavor
        self.topping = topping
        self.topping_serving_size = topping_serving_size

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes
