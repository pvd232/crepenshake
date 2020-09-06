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


class Ingredient_Model(object):
    def __init__(self, id=None, ingredient_category_id=None, serving_size=None, price=None):
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
    def __init__(self, order_id=None, crepe_id=None, quantity=None):
        self.order_id = order_id
        self.crepe_id = crepe_id
        self.quantity = quantity

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
    def __init__(self, id=None, customer_id=None, cost=None, date=None):
        self.id = id
        self.customer_id = customer_id
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
    def __init__(self, id=None, first_name=None, last_name=None, street=None, city=None, state=None, zipcode=None, country=None):
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


class Menu_Crepe_Model():
    def __init__(self, crepe_id=None, name=None, price=None):
        self.crepe_id = crepe_id
        self.name = name
        self.price = price

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Custom_Crepe_Model(object):
    def __init__(self, crepe_id=None, ingredient_id=None, quantity=None):
        self.crepe_id = crepe_id
        self.ingredient_id = ingredient_id
        self.quantity = quantity

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


class Side_Model(object):
    def __init__(self, id=None, side_type_id=None, flavor=None, price=None, serving_size=None, topping=None):
        self.id = id
        self.side_type_id = side_type_id
        self.flavor = flavor
        self.price = price
        self.serving_size = serving_size
        self.topping = topping

    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes
