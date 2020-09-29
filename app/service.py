from model import *
from repository import Ingredient_Repository,  Order_Repository, Drink_Repository, Side_Repository, Menu_Crepe_Repository

from datetime import date
import uuid
from sqlalchemy.orm import scoped_session
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from contextlib import contextmanager


def change_case(str):
    res = [str[0].lower()]
    for c in str[1:]:
        if c in ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'):
            res.append('_')
            res.append(c.lower())
        else:
            res.append(c)

    return ''.join(res)


class Ingredient_Service(object):
    # dope shit magic https://docs.sqlalchemy.org/en/13/orm/session_basics.html
    def __init__(self):
        self.username = "postgres"
        self.password = "Iqopaogh23!"
        self.connection_string_beginning = "postgres://"
        self.connection_string_end = "@localhost:5432/crepenshake"
        self.connection_string = self.connection_string_beginning + \
            self.username + ":" + self.password + self.connection_string_end

        self.ingredient_repository = Ingredient_Repository()

    @contextmanager
    def session_scope(self):
        # an Engine, which the Session will use for connection
        # resources
        self.drink_engine = create_engine(self.connection_string)

        # create a configured "Session" class
        self.session_factory = sessionmaker(bind=self.drink_engine)

        # create a Session
        self.session = scoped_session(self.session_factory)
        try:
            yield self.session
            self.session.commit()
        except:
            self.session.rollback()
            raise
        finally:
            self.session.close()
        # now all calls to Session() will create a thread-local session

    def get_ingredients(self):
        response = []
        with self.session_scope() as session:
            for ingredient in self.ingredient_repository.get_ingredients(session):
                ingredient_model = Ingredient_Model(
                    id=ingredient.id, ingredient_category_id=ingredient.ingredient_category_id)
                response.append(ingredient_model)
            return response

    def get_ingredient_prices(self):
        response = []
        with self.session_scope() as session:
            for ingredient in self.ingredient_repository.get_ingredient_prices(session):
                ingredient_model = Ingredient_Model(
                    id=ingredient.id, ingredient_category_id=ingredient.ingredient_category_id, price=ingredient.price)
                response.append(ingredient_model)
            return response

    def get_sweet_ingredient_prices(self):
        response = []
        with self.session_scope() as session:
            for ingredient in self.ingredient_repository.get_sweet_ingredient_prices(session):
                ingredient_model = Ingredient_Model(
                    id=ingredient.ingredient_id, ingredient_category_id=ingredient.ingredient_category_id, price=ingredient.price)
                response.append(ingredient_model)
            return response

    def get_ingredient_categories(self):
        response = []
        with self.session_scope() as session:
            for ingredient_category in self.ingredient_repository.get_ingredient_categories(session):

                ingredient_category_model = Ingredient_Category(
                    id=ingredient_category.id)
                response.append(ingredient_category)
            return response

    def get_sweet_ingredient_categories(self):
        response = []
        with self.session_scope() as session:
            for ingredient_category in self.ingredient_repository.get_sweet_ingredient_categories(session):

                ingredient_category_model = Ingredient_Category(
                    id=ingredient_category.id)
                response.append(ingredient_category)
            return response
    
    def get_ingredient_serving_sizes(self):
        response = []
        with self.session_scope() as session:
            for ingredient_serving_size in self.ingredient_repository.get_ingredient_serving_sizes(session):
                ingredient_serving_size_model = Ingredient_Model(
                    serving_size=ingredient_serving_size.id)
                response.append(ingredient_serving_size_model)
            return response


class Order_Service(object):
    def __init__(self):
        self.username = "postgres"
        self.password = "Iqopaogh23!"
        self.connection_string_beginning = "postgres://"
        self.connection_string_end = "@localhost:5432/crepenshake"
        self.connection_string = self.connection_string_beginning + \
            self.username + ":" + self.password + self.connection_string_end
        self.order_repository = Order_Repository()

    @contextmanager
    def session_scope(self):
        # an Engine, which the Session will use for connection
        # resources
        self.drink_engine = create_engine(self.connection_string)

        # create a configured "Session" class
        self.session_factory = sessionmaker(bind=self.drink_engine)

        # create a Session
        self.session = scoped_session(self.session_factory)
        try:
            yield self.session
            self.session.commit()
        except:
            self.session.rollback()
            raise
        finally:
            self.session.close()
        # now all calls to Session() will create a thread-local session

    def create_order(self, order):

        customer_data = order['customerData']
        new_customer_model = Customer_Model(id=customer_data['email'], first_name=customer_data['firstName'], last_name=customer_data['lastName'],
                                            street=customer_data['address'], city=customer_data['city'], zipcode=customer_data['zip'], state=customer_data['state'], country=customer_data['country'])
        new_order_model = Order_Model(
            id=uuid.uuid4(), customer_id=new_customer_model.id, cost=order['orderTotal'], date=date.today())

        order_crepe_list = None
        order_drink_list = None
        order_side_list = None
        new_model_crepe_list = None
        print('order dinosaur', order)
        if 'orderCrepe' in list(order.keys()):
            crepe_order_list = order['orderCrepe']
            print("crepe_order_list: %s", crepe_order_list)

            id_list = []
            for i in range(len(crepe_order_list)):
                crepe_order = crepe_order_list[i]
                print("order: %s", order)
                crepes = crepe_order['crepes']
                print("crepes pre id: %s", crepes)

                for crepe in crepes:
                    print()
                    print("crepe: %s", crepe)

                # key = list(crepe.keys())[0]
                # order_crepe = crepe[key]

                # print('order_crepe', order_crepe)
                    if crepe['customCrepe'] == True:
                        crepe['id'] = uuid.uuid4()
                    crepe_id = crepe['id']

                    if crepe_id not in id_list:
                        id_list.append(crepe_id)

            # order_crepe_list will have the order_crepe_model with the menu crepes and the custom crepes
            print('id_list', id_list)
            order_crepe_list = []
            custom_crepe_model_list = []
            new_model_crepe_list = []
            for aCrepe_id in id_list:

                order_crepe_model = Order_Crepe_Model(
                    order_id=new_order_model.id, crepe_id=aCrepe_id, quantity=0)
                for i in range(len(crepe_order_list)):
                    crepe_list = crepe_order_list[i]["crepes"]
                    for i in range(len(crepe_list)):
                        crepe = crepe_list[i]
                        crepe_id = crepe['id']
                        if crepe_id == aCrepe_id:
                            order_crepe_model.quantity += 1
                order_crepe_list.append(order_crepe_model)
            for i in range(len(crepe_order_list)):
                crepe_list = crepe_order_list[i]["crepes"]
                for i in range(len(crepe_list)):
                    ingredient_id_list = []
                    crepe = crepe_list[i]
                    crepe_id = crepe['id']

                    if crepe['customCrepe'] == True:
                        new_crepe_model = Crepe_Model(
                            id=crepe['id'], orgination_id='custom', flavor_profile_id=crepe['flavorProfile'])
                    new_model_crepe_list.append(new_crepe_model)
                    ingredients = crepe['ingredients']

                    for ingredient_dict_list in ingredients.values():

                        for ingredient_dict in ingredient_dict_list:
                            if 'price' not in ingredient_dict:
                                print("ingredientDict: %s", ingredient_dict)
                                print()
                                ingredient_name = change_case(
                                    ingredient_dict['name'])
                                print("ingredient_name: %s", ingredient_name)
                                print()
                                ingredient_serving_size = ingredient_dict['servingSize']
                                if ingredient_serving_size == 'half':
                                    ingredient_serving_size = 'light'
                                print("ingredient_serving_size: %s",
                                      ingredient_serving_size)

                                print()
                                custom_crepe = Custom_Crepe_Model(
                                    crepe_id=crepe_id, ingredient_id=change_case(ingredient_name), serving_size=ingredient_serving_size)
                                custom_crepe_model_list.append(custom_crepe)

            # order_crepe_list.append(custom_crepe)
        if 'orderDrink' in list(order.keys()):
            drink_list = []
            order_drink_list = []
            drink_id_list = []
            order_coffee_list = []
            drink_orders = order['orderDrink']
            for i in range(len(drink_orders)):
                drink_order = drink_orders[i]['drinks']
                print("drink_order: %s", drink_order)
                # print('drink_order.values()', drink_order.values())
                for key, value in drink_order.items():
                    if len(value) > 0:
                        drink_dict_list = value
                        print()
                        print("drink_dict_list: %s", drink_dict_list)
                        print()
                        # each drink dict will be a drink order, but in the case of coffee it will be multiple drink dicts because one will be milk
                        for drink_dict in drink_dict_list:
                            if 'name' in drink_dict:
                                drink_name = drink_dict['name']
                                drink_category = key
                                if drink_category == 'coffee':
                                    drink_id = uuid.uuid4()
                                    drink_model = Drink_Model(
                                        id=drink_id, drink_category_id=drink_category)
                                    drink_list.append(drink_model)
                                    print("key: %s", key)
                                    print()
                                    print("drink_dict: %s", drink_dict)
                                    print()
                                    drink_serving_size = drink_dict['servingSize']
                                    print("coffee_name: %s", drink_name)
                                    syrup = drink_dict['syrup']
                                    flavor_syrup = syrup['name']
                                    flavor_syrup_serving_size = syrup['servingSize']
                                    drink_price = syrup['price']
                                    print("coffee_price: %s", drink_price)
                                    espresso = drink_dict['espresso']
                                    espresso_name = espresso['name']
                                    espresso_serving_size = espresso['quantity']
                                    temperature = drink_dict['temperature']
                                    espresso_price = espresso['price']
                                    # for key, value in drink_dict:
                                    milk = drink_dict['milk']
                                    # if key == 'milk':
                                    milk_name = milk['name']
                                    print("milk_name: %s", milk_name)
                                    milk_price = milk['price']
                                    espresso = drink_dict['espresso']
                                    # TODO finish order_coffee and order_coffee and drink model objects
                                    order_coffee = Order_Coffee(id=drink_id, coffee_name_id=drink_name, serving_size_id=drink_serving_size, temperature_id=temperature,
                                                                flavor_syrup_id=flavor_syrup, flavor_serving_size_id=flavor_syrup_serving_size, espresso_serving_size_id=espresso_serving_size, milk_type_id=milk_name)
                                    order_coffee_list.append(order_coffee)
                                    print("milk_price: %s", milk_price)
                                    # TODO make order drink model objects and drink model objects and create uuid for coffee
                                    print()
                                else:
                                    drink_id = drink_dict['id']
                                    #need to pull out drink quantity for order_drink to make my life easier
                                    drink_quantity = drink_dict['quantity']
                                    drink_model = Drink_Model(
                                        id=drink_id, drink_category_id=drink_category)
                                    drink_list.append(drink_model)
                                    print(drink_dict)
                for drink in drink_list:
                    print("drink: %s", drink.serialize())

                    order_drink_model = Order_Drink_Model(
                        order_id=new_order_model.id, drink_id=drink.id, quantity=drink.quantity)
                    order_drink_list.append(drink)

                    # if drink.id not in drink_id_list:
                    #     drink_id_list.append(drink.id)
                # for drink_id in drink_id_list:
                    # order_drink_model = Order_Drink_Model(
                    #     order_id=new_order_model.id, drink_id=drink.id, quantity=0)
                #     for drink in drink_list:
                #         if drink.id == drink_id:
                #             order_drink_model.quantity += 1
                #     order_drink_list.append(order_drink_model)

        side_list = []
        order_side_list = []
        order_ice_cream_list = []
        side_id_list = []
        side_orders = order['orderSide']
        for i in range(len(side_orders)):
            side_order = side_orders[i]['sides']
            print("side_order: %s", side_order)
            # print('side_order.values()', side_order.values())
            for key, value in side_order.items():
                if len(value) > 0:
                    side_dict_list = value
                    print()
                    print("side_dict_list: %s", side_dict_list)
                    print()
                    # each side dict will be a side order, but in the case of coffee it will be multiple side dicts because one will be milk
                    for side_dict in side_dict_list:
                        if 'name' in side_dict:
                            side_name = side_dict['name']
                            side_category = key
                            if side_category == 'ice_cream_bowl':
                                side_id = uuid.uuid4()
                                side_flavor = side_dict['flavor']
                                side_price = side_dict['price']
                                side_serving_size = side_dict['servingSize']
                                side_model = Side_Model(
                                    id=side_id, side_type_id=side_category, side_name_id=side_name, flavor=side_flavor, price=side_price, serving_size=side_serving_size)
                                side_list.append(side_model)
                                toppings = crepe['toppings']

                                for topping_dict_list in toppings.values():
                                    for topping_dict in topping_dict_list:
                                        if 'price' not in topping_dict:
                                            print("toppingDict: %s",
                                                  topping_dict)
                                            print()
                                            topping_name = change_case(
                                                topping_dict['name'])
                                            print("topping_name: %s",
                                                  topping_name)
                                            print()
                                            topping_serving_size = topping_dict['servingSize']
                                            if topping_serving_size == 'half':
                                                topping_serving_size = 'light'
                                            print("topping_serving_size: %s",
                                                  topping_serving_size)

                                            print()
                                            order_ice_cream = Order_Ice_Cream_Model(id=side_id, topping_id=change_case(
                                                topping_name), topping_serving_size=topping_serving_size)
                                            order_ice_cream_list.append(
                                                custom_crepe)

                                        else:
                                            side_id = side_dict['name']
                                            side_model = Side_Model(
                                                id=side_id, side_category_id=side_category)
                                            side_list.append(side_model)
                                            print(side_dict)
            for side in side_list:
                if side.id not in side_id_list:
                    side_id_list.append(side.id)
            for side_id in side_id_list:
                order_side_model = Order_Side_Model(
                    order_id=new_order_model.id, side_id=side.id, quantity=0)
                for side in side_list:
                    if side.id == side_id:
                        order_side_model.quantity += 1
                order_side_list.append(order_side_model)

        # if 'orderSide' in list(order.keys()):
        #     order_side_list = []
        #     order_side = order['orderSide']
        #     sides = order_side['sides']
        #     print()
        #     print("sides: %s", sides)

        #     id_list = []
        #     price = 0
        #     for side in sides:
        #         side = side['side']
        #         side_id = side['id']
        #         price += float(side['price'])
        #         if side_id not in id_list:
        #             id_list.append(side_id)

        #     order_side_list = []
        #     for aSide_id in id_list:
        #         order_side_model = Order_Side_Model(
        #             order_id=new_order_model.id, side_id=aSide_id, quantity=0)
        #         for side in sides:
        #             side = side['side']
        #             side_id = side['id']
        #             if side_id == aSide_id:
        #                 order_side_model.quantity += 1
        #         order_side_list.append(order_side_model)
        # print('order_drink_list', order_drink_list)
        # print('order_side_list', order_side_list)

        with self.session_scope() as session:
            self.order_repository.post_order(session, customer=new_customer_model, order=new_order_model,
                                             order_crepe_list=order_crepe_list, order_drink_list=order_drink_list, order_side_list=order_side_list, custom_crepe_list=custom_crepe_model_list, new_model_crepe_list=new_model_crepe_list)


class Drink_Service(object):
    def __init__(self):
        self.username = "postgres"
        self.password = "Iqopaogh23!"
        self.connection_string_beginning = "postgres://"
        self.connection_string_end = "@localhost:5432/crepenshake"
        self.connection_string = self.connection_string_beginning + \
            self.username + ":" + self.password + self.connection_string_end
        self.drink_repository = Drink_Repository()

    @contextmanager
    def session_scope(self):
        # an Engine, which the Session will use for connection
        # resources
        self.drink_engine = create_engine(self.connection_string)

        # create a configured "Session" class
        self.session_factory = sessionmaker(bind=self.drink_engine)

        # create a Session
        self.session = scoped_session(self.session_factory)
        try:
            yield self.session
            self.session.commit()
        except:
            self.session.rollback()
            raise
        finally:
            self.session.close()
        # now all calls to Session() will create a thread-local session

    def get_drink_categories(self):
        response = []

        with self.session_scope() as session:
            for drink_category in self.drink_repository.get_drink_categories(session):
                drink_category_model = Drink_Category(id = drink_category.id)
                response.append(drink_category_model)
                # response.append(drink_model.serialize())

            return response

    def get_milkshakes(self):
        response = []

        with self.session_scope() as session:
            for milkshake in self.drink_repository.get_milkshakes(session):
                drink_model = Drink_Model(
                    name=milkshake.name, price=milkshake.price)
                response.append(drink_model)
            return response

    def get_bottled_drinks(self):
        response = []

        with self.session_scope() as session:
            for bottled_drink in self.drink_repository.get_bottled_drinks(session):

                drink_model = Drink_Model(
                    name=bottled_drink.name, price=bottled_drink.price)
                response.append(drink_model)
            return response

    def get_coffee_drinks(self):
        response = []

        with self.session_scope() as session:
            for coffee_drink in self.drink_repository.get_coffee_drinks(session):
                drink_model = Drink_Model(
                    name=coffee_drink.coffee_name, price=coffee_drink.price, serving_size=coffee_drink.serving_size)
                response.append(drink_model)
            return response

    def get_non_coffee_drinks(self):
        response = []

        with self.session_scope() as session:
            for non_coffee_drink in self.drink_repository.get_non_coffee_drinks(session):

                drink_model = Drink_Model(
                    name=non_coffee_drink.name, price=non_coffee_drink.price, serving_size=non_coffee_drink.serving_size)
                response.append(drink_model)
            return response

    def get_milk_drinks(self):
        response = []

        with self.session_scope() as session:
            for milk_drink in self.drink_repository.get_milk_drinks(session):

                drink_model = Drink_Model(
                    id=milk_drink.id, price=milk_drink.price)
                response.append(drink_model)
            return response

    def get_coffee_syrups(self):
        response = []

        with self.session_scope() as session:
            for coffee_syrup in self.drink_repository.get_coffee_syrups(session):
                drink_model = Drink_Model(
                    coffee_syrup_flavor=coffee_syrup.id)
                response.append(drink_model)
            return response

    def get_coffee_temperature(self):
        response = []

        with self.session_scope() as session:
            for temp in self.drink_repository.get_temperature(session):
                temp_model = Temperature(
                    id=temp.id)
                response.append(temp_model)
            return response


class Side_Service(object):
    def __init__(self):
        self.username = "postgres"
        self.password = "Iqopaogh23!"
        self.connection_string_beginning = "postgres://"
        self.connection_string_end = "@localhost:5432/crepenshake"
        self.connection_string = self.connection_string_beginning + \
            self.username + ":" + self.password + self.connection_string_end
        self.side_repository = Side_Repository()

    @contextmanager
    def session_scope(self):
        # an Engine, which the Session will use for connection
        # resources
        self.side_engine = create_engine(self.connection_string)

        # create a configured "Session" class
        self.session_factory = sessionmaker(bind=self.side_engine)

        # create a Session
        self.session = scoped_session(self.session_factory)
        try:
            yield self.session
            self.session.commit()
        except:
            self.session.rollback()
            raise
        finally:
            self.session.close()
        # now all calls to Session() will create a thread-local session

    def get_croissants(self):
        response = []
        with self.session_scope() as session:
            for croissant in self.side_repository.get_croissants(session):
                # the front end needs the side_name prop
                croissant_model = Side_Model(id=croissant.side_id, side_name_id='croissant',
                    flavor=croissant.flavor_id, price=croissant.price)
                response.append(croissant_model)
            return response

    def get_side_types(self):
        response = []

        with self.session_scope() as session:
            for side_type in self.side_repository.get_side_types(session):
                side_type_model = Side_Model(side_type_id=side_type.id)
                response.append(side_type_model)

            return response

    def get_side_names(self):
            response = []
            with self.session_scope() as session:
                for side_name in self.side_repository.get_side_names(session):
                    side_name_model = Side_Model(side_name_id=side_name.id)
                    response.append(side_name_model)
                return response

    def get_ice_cream_bowls(self):
        response = []
        with self.session_scope() as session:
            for ice_cream in self.side_repository.get_ice_cream_bowls(session):
                ice_cream = Side_Model(id=ice_cream.side_id, side_name_id='ice_cream_bowl',
                    flavor=ice_cream.flavor_id, serving_size=ice_cream.serving_size_id, price=ice_cream.price)
                response.append(ice_cream)
            return response

    def get_toppings(self):
        response = []
        with self.session_scope() as session:
            for topping in self.side_repository.get_toppings(session):
                topping = Ingredient_Model(
                    id=topping.ingredient_id, price=topping.price)
                response.append(topping)
            return response


class Menu_Crepe_Service(object):
    def __init__(self):
        self.username = "postgres"
        self.password = "Iqopaogh23!"
        self.connection_string_beginning = "postgres://"
        self.connection_string_end = "@localhost:5432/crepenshake"
        self.connection_string = self.connection_string_beginning + \
            self.username + ":" + self.password + self.connection_string_end
        self.menu_crepe_repository = Menu_Crepe_Repository()

    @contextmanager
    def session_scope(self):
        # an Engine, which the Session will use for connection
        # resources
        self.menu_crepe_engine = create_engine(self.connection_string)

        # create a configured "Session" class
        self.session_factory = sessionmaker(bind=self.menu_crepe_engine)

        # create a Session
        self.session = scoped_session(self.session_factory)
        try:
            yield self.session
            self.session.commit()
        except:
            self.session.rollback()
            raise
        finally:
            self.session.close()
        # now all calls to Session() will create a thread-local session

    def get_sweet_menu_crepes(self):
        response = []
        with self.session_scope() as session:
            for menu_crepe in self.menu_crepe_repository.get_sweet_menu_crepes(session):
                crepe_model = Menu_Crepe_Model(
                    crepe_id=menu_crepe.crepe_id, name=menu_crepe.name, price=menu_crepe.price, flavor_profile_id=menu_crepe.flavor_profile_id)
                response.append(crepe_model)
            return response

    def get_savory_menu_crepes(self):
        response = []
        with self.session_scope() as session:
            for menu_crepe in self.menu_crepe_repository.get_savory_menu_crepes(session):
                crepe_model = Menu_Crepe_Model(
                    crepe_id=menu_crepe.crepe_id, name=menu_crepe.name, price=menu_crepe.price, flavor_profile_id=menu_crepe.flavor_profile_id)
                response.append(crepe_model)
            return response
