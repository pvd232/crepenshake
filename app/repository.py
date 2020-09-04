from sqlalchemy.orm import scoped_session
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from models import Ingredient, Ingredient_Category, Order, Order_Crepe, Order_Side, Order_Drink, Customer, Custom_Crepe, Crepe, Drink, Drink_Category, Bottled_Drink, Non_Coffee_Drink, Milkshake, Milk, Coffee_Espresso, Coffee_Name_Serving_Size, Coffee_Syrup_Flavor, Coffee_Temperature
from create_db import db
from datetime import date


class Ingredient_Repository(object):
    def __init__(self):
        username = "postgres"
        password = "Iqopaogh23!"
        connection_string_beginning = "postgres://"
        connection_string_end = "@localhost:5432/crepenshake"
        connection_string = connection_string_beginning + \
            username + ":" + password + connection_string_end

        # an Engine, which the Session will use for connection
        # resources
        ingredient_engine = create_engine(connection_string)

        # create a configured "Session" class
        session_factory = sessionmaker(bind=ingredient_engine)

        # create a Session
        self.Session = scoped_session(session_factory)

        # now all calls to Session() will create a thread-local session

    def get_ingredients(self):
        get_ingredient_session = self.Session()
        ingredients = get_ingredient_session.query(Ingredient)

        # you can now use some_session to run multiple queries, etc.
        # remember to close it when you're finished!
        self.Session.remove()
        return ingredients

    def get_ingredient_prices(self):
        get_ingredient_session = self.Session()
        ingredient_prices = get_ingredient_session.execute("SELECT i.id, i.ingredient_category_id, p.price FROM ingredient i JOIN ingredient_serving_price p on i.id = p.ingredient_id WHERE p.serving_size=:param",
                                                           {"param": "regular"})

        # ingredient_prices.close()
        self.Session.remove()
        return ingredient_prices

    def get_ingredient_categories(self):
        get_ingredient_session = self.Session()
        ingredient_categories = get_ingredient_session.query(
            Ingredient_Category).all()

        self.Session.remove()
        return ingredient_categories


class Order_Repository(object):
    def __init__(self):
        username = "postgres"
        password = "Iqopaogh23!"
        connection_string_beginning = "postgres://"
        connection_string_end = "@localhost:5432/crepenshake"
        connection_string = connection_string_beginning + \
            username + ":" + password + connection_string_end

        # an Engine, which the Session will use for connection
        # resources
        ingredient_engine = create_engine(connection_string)

        # create a configured "Session" class
        session_factory = sessionmaker(bind=ingredient_engine)

        # create a Session
        self.Session = scoped_session(session_factory)

        # now all calls to Session() will create a thread-local session

    def post_order(self, customer, order, order_drink_list=None, order_side_list=None,  order_crepe_list=None, custom_crepe_list=None, new_model_crepe_list=None):
        post_order_session = self.Session()

        user = post_order_session.query(Customer).filter(
            Customer.id == customer.id).first()
        if not user:
            new_customer = Customer(id=customer.id, first_name=customer.first_name, last_name=customer.last_name,
                                    street=customer.street, city=customer.city, state=customer.state, zipcode=customer.zipcode, country=customer.country)
            post_order_session.add(new_customer)
        new_order = Order(id=order.id, customer_id=order.customer_id,
                          cost=order.cost, date=date.today())
        post_order_session.add(new_order)
        post_order_session.commit()

        if order_crepe_list:
            if custom_crepe_list:
                for new_model_crepe in new_model_crepe_list:
                    new_crepe = Crepe(id=new_model_crepe.id, origination_id=new_model_crepe.origination_id,
                                      flavor_profile_id=new_model_crepe.flavor_profile_id)
                    post_order_session.add(new_crepe)
                for custom_crepe in custom_crepe_list:
                    new_custom_crepe = Custom_Crepe(
                        crepe_id=custom_crepe.crepe_id, ingredient_id=custom_crepe.ingredient_id, quantity=custom_crepe.quantity)
                    post_order_session.add(new_custom_crepe)
                post_order_session.commit()
            for each_order_crepe in order_crepe_list:

                new_order_crepe = Order_Crepe(
                    order_id=new_order.id, crepe_id=each_order_crepe.crepe_id, quantity=each_order_crepe.quantity)
                post_order_session.add(new_order_crepe)
            post_order_session.commit()

        if order_drink_list:

            for each_order_drink in order_drink_list:
                new_order_drink = Order_Drink(
                    order_id=new_order.id, drink_id=each_order_drink.drink_id, quantity=each_order_drink.quantity)
                post_order_session.add(new_order_drink)
            post_order_session.commit()

        if order_side_list:
            for each_order_side in order_side_list:
                new_order_side = Order_Side(
                    order_id=new_order.id, side_id=each_order_side.side_id, quantity=each_order_side.quantity)
                post_order_session.add(new_order_side)
            post_order_session.commit()
            self.Session.remove()
        post_order_session.commit()

    def get_orders(self):
        get_order_session = self.Session()
        orders = get_order_session.query(Order)
        self.Session.remove()
        return orders


class Drink_Repository(object):
    def __init__(self):
        username = "postgres"
        password = "Iqopaogh23!"
        connection_string_beginning = "postgres://"
        connection_string_end = "@localhost:5432/crepenshake"
        connection_string = connection_string_beginning + \
            username + ":" + password + connection_string_end

        # an Engine, which the Session will use for connection
        # resources
        drink_engine = create_engine(connection_string)

        # create a configured "Session" class
        session_factory = sessionmaker(bind=drink_engine)

        # create a Session
        self.Session = scoped_session(session_factory)

        # now all calls to Session() will create a thread-local session

    def get_drinks(self):
        get_drink_session = self.Session()
        drinks = get_drink_session.query(Drink)

        # you can now use some_session to run multiple queries, etc.
        # remember to close it when you're finished!
        self.Session.remove()
        return drinks

    def get_bottled_drinks(self):
        get_drink_session = self.Session()
        bottled_drinks = self.Session.query(Bottled_Drink)
        return bottled_drinks

    def get_milkshakes(self):
        get_drink_session = self.Session()
        milkshakes = self.Session.query(Milkshake)
        return milkshakes

    def get_coffee_drinks(self):
        get_drink_session = self.Session()
        coffee = self.Session.query(Coffee_Name_Serving_Size)
        return coffee

    def get_non_coffee_drinks(self):
        get_drink_session = self.Session()
        non_coffee = self.Session.query(Non_Coffee_Drink)
        return non_coffee

    def get_drink_categories(self):
        get_drink_session = self.Session()
        drink_categories = get_drink_session.query(
            Drink_Category).all()

        self.Session.remove()
        return drink_categories
