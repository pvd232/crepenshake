from sqlalchemy.orm import scoped_session
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from models import Ingredient, Ingredient_Category
from create_db import db


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
        self.Session.remove()
        return ingredient_prices

    def get_ingredient_categories(self):
        get_ingredient_session = self.Session()
        ingredient_categories = get_ingredient_session.query(
            Ingredient_Category).all()

        self.Session.remove()
        return ingredient_categories
