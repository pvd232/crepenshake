from model import *
from repository import Ingredient_Repository,  Order_Repository, Drink_Repository, Side_Repository

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

    def get_ingredient_categories(self):
        response = []
        with self.session_scope() as session:
            for ingredient_category in self.ingredient_repository.get_ingredient_categories(session):

                ingredient_category_model = Ingredient_Category(
                    id=ingredient_category.id)
                response.append(ingredient_category)
                # response.append(ingredient_model.serialize())

            return response


class Order_Service(object):
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

        if 'orderCrepe' in list(order.keys()):
            crepes = order['orderCrepe']
            id_list = []
            for crepe in crepes:
                key = list(crepe.keys())[0]
                order_crepe = crepe[key]

                print('order_crepe', order_crepe)
                if order_crepe['customCrepe'] == True:
                    order_crepe['id'] = uuid.uuid4()
                crepe_id = order_crepe['id']

                if crepe_id not in id_list:
                    id_list.append(crepe_id)

            # order_crepe_list will have the order_crepe_model with the menu crepes and the custom crepes
            order_crepe_list = []
            custom_crepe_model_list = []
            new_model_crepe_list = []
            for aCrepe_id in id_list:

                order_crepe_model = Order_Crepe_Model(
                    order_id=new_order_model.id, crepe_id=aCrepe_id, quantity=0)
                for crepe in crepes:
                    key = list(crepe.keys())[0]
                    order_crepe = crepe[key]
                    crepe_id = order_crepe['id']
                    if crepe_id == aCrepe_id:
                        order_crepe_model.quantity += 1
                order_crepe_list.append(order_crepe_model)
            for crepe in crepes:
                ingredient_id_list = []
                key = list(crepe.keys())[0]
                order_crepe = crepe[key]

                crepe_id = order_crepe['id']
                if order_crepe['customCrepe'] == True:
                    new_crepe_model = Crepe_Model(
                        id=order_crepe['id'], orgination_id='custom', flavor_profile_id=order_crepe['flavorProfile'])
                    new_model_crepe_list.append(new_crepe_model)
                    ingredients = order_crepe['ingredients']

                    for ingredientDictList in ingredients.values():

                        for ingredientDict in ingredientDictList:
                            ingredientName = list(ingredientDict.keys())[
                                0]
                            ingredientQuantity = list(
                                ingredientDict.values())[0]
                            if ingredientName != 'price':
                                custom_crepe = Custom_Crepe_Model(
                                    crepe_id=crepe_id, ingredient_id=change_case(ingredientName), quantity=ingredientQuantity)
                                custom_crepe_model_list.append(custom_crepe)

            # order_crepe_list.append(custom_crepe)

        if 'order_drink' in list(order.keys()):
            order_drink_list = []
            drinks = order['order_drink']
            id_list = []
            price = 0
            for drink in drinks:
                drink = drink['drink']
                drink_id = drink['id']
                price += float(drink['price'])
                if drink_id not in id_list:
                    id_list.append(drink_id)

            for aDrink_id in id_list:
                order_drink_model = Order_Drink_Model(
                    order_id=new_order_model.id, drink_id=aDrink_id, quantity=0)
                for drink in drinks:
                    drink = drink['drink']
                    drink_id = drink['id']
                    if drink_id == aDrink_id:
                        order_drink_model.quantity += 1
                order_drink_list.append(order_drink_model)

        if 'order_side' in list(order.keys()):
            order_side_list = []
            sides = order['order_side']
            id_list = []
            price = 0
            for side in sides:
                side = side['side']
                side_id = side['id']
                price += float(side['price'])
                if side_id not in id_list:
                    id_list.append(side_id)

            order_side_list = []
            for aSide_id in id_list:
                order_side_model = Order_Side_Model(
                    order_id=new_order_model.id, side_id=aSide_id, quantity=0)
                for side in sides:
                    side = side['side']
                    side_id = side['id']
                    if side_id == aSide_id:
                        order_side_model.quantity += 1
                order_side_list.append(order_side_model)
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
                drink_category = drink_category.serialize
                response.append(drink_category)
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
                    id=milk_drink.id)
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
                croissant_model = Side_Model(
                    side_name_id=croissant.side_name_id, flavor=croissant.flavor, price=croissant.price)
                response.append(croissant_model)
            return response

    def get_side_names(self):
        response = []

        with self.session_scope() as session:
            for side_name in self.side_repository.get_side_names(session):
                side_name_model = Side_Model(side_name_id=side_name.id)
                response.append(side_name_model)

            return response

    def get_ice_cream_prices(self):
        response = []
        with self.session_scope() as session:
            for ice_cream in self.side_repository.get_ice_cream_prices(session):
                ice_cream = Side_Model(
                    flavor=ice_cream.flavor_id, serving_size=ice_cream.serving_size_id, price=ice_cream.price)
                response.append(ice_cream)
            return response

    def get_toppings(self):
        response = []
        with self.session_scope() as session:
            for topping in self.side_repository.get_toppings(session):
                print(topping.serialize)
                topping = Ingredient_Model(
                    id=topping.ingredient_id, price=topping.price)
                response.append(topping)
            return response

        # def get_cheap_ingredients(self):
        #     response = []
        #     for ingredient in self.ingredient:
        #         if ingredient.price < 30:
        #             response.append(ingredient)
        #     return response
