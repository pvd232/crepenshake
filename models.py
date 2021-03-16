# beginning of Models.py
# note that at this point you should have created "crepenshakedb" database (see install_postgres.txt).
import json
from datetime import date
from pathlib import Path
from flask.json import JSONEncoder
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
import os
from sqlalchemy.schema import DropTable
from sqlalchemy.ext.compiler import compiles
from sqlalchemy import inspect, create_engine
from flask_migrate import Migrate


@compiles(DropTable, "postgresql")
def _compile_drop_table(element, compiler, **kwargs):
    return compiler.visit_drop_table(element) + " CASCADE"


app = Flask(__name__)


username = "postgres"
password = "Iqopaogh23!"
connection_string_beginning = "postgresql+psycopg2://"
connection_string_end = "@localhost:5432/crepenshakedb"
connection_string = connection_string_beginning + \
    username + ":" + password + connection_string_end
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    "DB_STRING", connection_string)


# to suppress a warning message
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)
migrate = Migrate(app, db)


class Crepe_Origination(db.Model):
    __tablename__ = 'crepe_origination'
    id = db.Column(db.String(80), primary_key=True,
                   unique=True, nullable=False)
    crepe = relationship('Crepe', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Crepe_Flavor_Profile(db.Model):
    __tablename__ = 'crepe_flavor_profile'

    id = db.Column(db.String(80), primary_key=True,
                   unique=True, nullable=False)

    crepe = relationship('Crepe', lazy=True)
    ingredient = relationship('Ingredient', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Crepe(db.Model):
    id = db.Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True,  # https://stackoverflow.com/questions/55917056/how-to-prevent-uuid-primary-key-for-new-sqlalchemy-objects-being-created-with-th
                   unique=True, nullable=False)

    origination_id = db.Column(db.String(80), db.ForeignKey('crepe_origination.id'),
                               nullable=False)
    flavor_profile_id = db.Column(
        db.String(80), db.ForeignKey('crepe_flavor_profile.id'), nullable=False)
    order_crepe = relationship('Order_Crepe', lazy=True)
    custom_crepe = relationship('Custom_Crepe', lazy=True)
    menu_crepe = relationship('Menu_Crepe', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Custom_Crepe(db.Model):
    __tablename__ = 'custom_crepe'
    crepe_id = db.Column(UUID(as_uuid=True), db.ForeignKey('crepe.id'), primary_key=True,
                         nullable=False)

    ingredient_id = db.Column(
        db.String(80), db.ForeignKey('ingredient.id'), primary_key=True, nullable=False)
    serving_size = db.Column(db.String(80), db.ForeignKey(
        'ingredient_serving_size.id'),  nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes

# ingredientQuantity pricing table that lists a price for the given combination of the ingredient and quantity


class Menu_Crepe(db.Model):
    __tablename__ = 'menu_crepe'
    crepe_id = db.Column(UUID(as_uuid=True), db.ForeignKey('crepe.id'), primary_key=True,
                         nullable=False)

    name = db.Column(db.String(80), nullable=False)

    price = db.Column(db.Float(), nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Customer(db.Model):
    id = db.Column(db.String(80), primary_key=True,  # this will be the customer's email
                   unique=True, nullable=False)
    stripe_id = db.Column(db.String(80), db.ForeignKey('stripe.id'), primary_key=True,
                          nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    street = db.Column(db.String(80), nullable=False)
    city = db.Column(db.String(80), nullable=False)
    state = db.Column(db.String(80), nullable=False)
    zipcode = db.Column(db.Integer, nullable=False)
    country = db.Column(db.String(80), nullable=False)
    order = relationship('Order', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Stripe(db.Model):
    id = db.Column(db.String(80), primary_key=True,
                   unique=True, nullable=False)
    customer = relationship('Customer', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Order(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True,
                   unique=True, nullable=False)
    customer_id = db.Column(db.String(80), db.ForeignKey(
        'customer.id'), nullable=False)
    cost = db.Column(db.Float(), nullable=False)
    date = db.Column(db.DateTime(), nullable=False)
    pickup_timestamp = db.Column(db.DateTime(), nullable=False)
    order_drink = relationship('Order_Drink', lazy=True)
    order_crepe = relationship('Order_Crepe', lazy=True)
    order_side = relationship('Order_Side', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Order_Drink(db.Model):
    __tablename__ = 'order_drink'
    order_id = db.Column(UUID(as_uuid=True), db.ForeignKey(
        'order.id'), nullable=False, primary_key=True)
    drink_id = db.Column(UUID(as_uuid=True), db.ForeignKey('drink.id'), primary_key=True,
                         nullable=False)
    serving_size = db.Column(
        db.String(80), db.ForeignKey('drink_serving_size.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Order_Crepe(db.Model):
    __tablename__ = 'order_crepe'
    order_id = db.Column(UUID(as_uuid=True), db.ForeignKey(
        'order.id'), nullable=False, primary_key=True)
    crepe_id = db.Column(UUID(as_uuid=True), db.ForeignKey(
        'crepe.id'), nullable=False, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Order_Side(db.Model):
    __tablename__ = 'order_side'
    order_id = db.Column(UUID(as_uuid=True), db.ForeignKey(
        'order.id'), nullable=False, primary_key=True)
    side_id = db.Column(UUID(as_uuid=True), db.ForeignKey('side.id'), primary_key=True,
                        nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Ingredient_Category(db.Model):
    __tablename__ = 'ingredient_category'
    id = db.Column(db.String(80), primary_key=True,
                   unique=True, nullable=False)

    ingredient = relationship('Ingredient', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Ingredient(db.Model):
    id = db.Column(db.String(80), primary_key=True,
                   unique=True, nullable=False)
    ingredient_category_id = db.Column(db.String(80), db.ForeignKey('ingredient_category.id'),
                                       nullable=False)
    ingredient_flavor_profile_id = db.Column(
        db.String(80), db.ForeignKey('crepe_flavor_profile.id'), nullable=False)
    is_active = db.Column(db.Boolean(), default=False, nullable=False)
    custom_crepe = relationship('Custom_Crepe')
    order_ice_cream = relationship('Order_Ice_Cream')
    ingredient_serving_size_price = relationship(
        'Ingredient_Serving_Size_Price', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Ingredient_Serving_Size(db.Model):
    __tablename__ = 'ingredient_serving_size'
    id = db.Column(db.String(80), primary_key=True,
                   unique=True, nullable=False)

    order_ice_cream = relationship('Order_Ice_Cream', lazy=True)
    ingredient_serving_size_price = relationship(
        'Ingredient_Serving_Size_Price', lazy=True)
    custom_crepe = relationship('Custom_Crepe', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Ingredient_Serving_Size_Price(db.Model):
    __tablename__ = 'ingredient_serving_size_price'
    ingredient_id = db.Column(db.String(80), db.ForeignKey('ingredient.id'), primary_key=True,
                              nullable=False)
    ingredient_category_id = db.Column(db.String(80), db.ForeignKey('ingredient_category.id'),
                                       nullable=False)
    serving_size = db.Column(db.String(80), db.ForeignKey(
        'ingredient_serving_size.id'), primary_key=True,  nullable=False)
    price = db.Column(db.Float(), nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes

# https://stackoverflow.com/questions/4989202/is-it-bad-practice-to-implement-a-separate-table-consisting-of-only-two-rows-fem


# used an underscore because this table is referenced by a foreign key and I think just camelcase will get messed up
class Drink_Category(db.Model):
    __tablename__ = 'drink_category'
    id = db.Column(db.String(80), primary_key=True,  # this will be a natural key, coffee, milkshake, or regular drink
                   unique=True, nullable=False)
    drink = relationship('Drink', lazy=True)
    drink_name_serving_size_price = relationship(
        'Drink_Name_Serving_Size_Price', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Drink(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True,  # https://stackoverflow.com/questions/55917056/how-to-prevent-uuid-primary-key-for-new-sqlalchemy-objects-being-created-with-th
                   unique=True, nullable=False)
    name = db.Column(db.String(80), unique=True, nullable=False)
    drink_category_id = db.Column(db.String(80), db.ForeignKey(
        'drink_category.id'), nullable=False)
    order_coffee = relationship('Order_Coffee', lazy=True)
    order_drink = relationship('Order_Drink', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Drink_Name_Serving_Size_Price(db.Model):
    __tablename__ = 'drink_name_serving_size_price'
    id = db.Column(UUID(as_uuid=True),  db.ForeignKey(
        'drink.id'), primary_key=True,
        nullable=False)
    name = db.Column(db.String(80), db.ForeignKey(
        "drink.name"), primary_key=True, nullable=False)
    drink_category_id = db.Column(db.String(80), db.ForeignKey(
        'drink_category.id'), nullable=False)
    serving_size = db.Column(db.String(80), db.ForeignKey(
        "drink_serving_size.id"), primary_key=True, nullable=False)
    price = db.Column(db.Float(), nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Coffee_Temperature(db.Model):
    __tablename__ = 'coffee_temperature'
    id = db.Column(db.String(80), primary_key=True, unique=True,  # natural key with the name of the milk
                   nullable=False)
    # for moon milk this will be a .25, .5, .75, or 1.0 , otherwise it will be 1.0
    order_coffee = relationship('Order_Coffee', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Coffee_Name(db.Model):
    __tablename__ = 'coffee_name'
    id = db.Column(db.String(80), primary_key=True, unique=True,  # natural key with the name of the coffee
                   nullable=False)
    # for moon milk this will be a .25, .5, .75, or 1.0 , otherwise it will be 1.0

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Drink_Serving_Size(db.Model):
    __tablename__ = 'drink_serving_size'
    id = db.Column(db.String(80), primary_key=True, unique=True,  # natural key with the name of the milk
                   nullable=False)
    # for moon milk this will be a .25, .5, .75, or 1.0 , otherwise it will be 1.0
    drink_name_serving_size_price = relationship(
        'Drink_Name_Serving_Size_Price', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Espresso(db.Model):
    __tablename__ = 'espresso'
    serving_size = db.Column(db.String(80), primary_key=True, unique=True,  # natural key with the name of the milk
                             nullable=False)
    # for moon milk this will be a .25, .5, .75, or 1.0 , otherwise it will be 1.0
    order_coffee = relationship(
        'Order_Coffee', backref='espresso', lazy=True)
    price = db.Column(db.Float(), nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Coffee_Flavor_Syrup(db.Model):
    __tablename__ = 'coffee_flavor_syrup'
    id = db.Column(db.String(80), primary_key=True, unique=True,  # natural key with the name of the milk
                   nullable=False)
    # for moon milk this will be a .25, .5, .75, or 1.0 , otherwise it will be 1.0
    order_coffee = relationship(
        'Order_Coffee', backref='coffee_flavor_syrup', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Coffee_Flavor_Syrup_Serving_Size(db.Model):
    __tablename__ = 'coffee_flavor_syrup_serving_size'
    id = db.Column(db.String(80), primary_key=True, unique=True,  # natural key with the name of the milk
                   nullable=False)
    # for moon milk this will be a .25, .5, .75, or 1.0 , otherwise it will be 1.0
    order_coffee = relationship(
        'Order_Coffee', backref='coffee_flavor_syrup_serving_size', lazy=True)
    coffee_flavor_syrup_serving_size_price = relationship(
        'Coffee_Flavor_Syrup_Serving_Size_Price', backref='coffee_flavor_syrup_serving_size', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Coffee_Flavor_Syrup_Serving_Size_Price(db.Model):
    __tablename__ = 'coffee_flavor_syrup_serving_size_price'
    coffee_flavor_syrup_id = db.Column(db.String(80), db.ForeignKey('coffee_flavor_syrup.id'), primary_key=True,  # natural key with the name of the milk
                                       nullable=False)
    coffee_flavor_syrup_serving_size_id = db.Column(db.String(80), db.ForeignKey('coffee_flavor_syrup_serving_size.id'), primary_key=True,  # natural key with the name of the milk
                                                    nullable=False)
    # for moon milk this will be a .25, .5, .75, or 1.0 , otherwise it will be 1.0
    price = db.Column(db.Float(), nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Milk(db.Model):
    id = db.Column(db.String(80), primary_key=True, unique=True,  # natural key with the name of the milk
                   nullable=False)
    price = db.Column(db.Float(), nullable=False)
    # for moon milk this will be a .25, .5, .75, or 1.0 , otherwise it will be 1.0
    order_coffee = relationship('Order_Coffee', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Order_Coffee(db.Model):
    __tablename__ = 'order_coffee'
    id = db.Column(UUID(as_uuid=True), primary_key=True,
                   nullable=False)
    drink_id = db.Column(UUID(as_uuid=True), db.ForeignKey('drink.id'),
                         nullable=False)
    coffee_name_id = db.Column(db.String(80), db.ForeignKey('coffee_name.id'),
                               nullable=False)
    serving_size_id = db.Column(db.String(80), db.ForeignKey('drink_serving_size.id'),
                                nullable=False)
    temperature_id = db.Column(db.String(80), db.ForeignKey("coffee_temperature.id"),
                               nullable=False)
    flavor_syrup_id = db.Column(db.String(80), db.ForeignKey(
        'coffee_flavor_syrup.id'), nullable=True)

    flavor_syrup_serving_size_id = db.Column(db.String(80), db.ForeignKey(
        'coffee_flavor_syrup_serving_size.id'), nullable=True)
    espresso_serving_size_id = db.Column(db.String(80), db.ForeignKey(
        'espresso.serving_size'), nullable=False)
    milk_type_id = db.Column(
        db.String(80), db.ForeignKey('milk.id'), nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Side(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True,  # https://stackoverflow.com/questions/55917056/how-to-prevent-uuid-primary-key-for-new-sqlalchemy-objects-being-created-with-th
                   unique=True, nullable=False)
    side_type_id = db.Column(db.String(80), db.ForeignKey('side_type.id'),  # natural key
                             nullable=False)
    side_name_id = db.Column(db.String(80), db.ForeignKey('side_name.id'),  # natural key
                             nullable=False)
    order_side = relationship('Order_Side', lazy=True)

    ice_cream = relationship('Order_Ice_Cream', backref='side', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Side_Name(db.Model):
    __tablename__ = 'side_name'
    id = db.Column(db.String(80), primary_key=True,
                   unique=True, nullable=False)
    side = relationship('Side', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Side_Type(db.Model):
    __tablename__ = 'side_type'
    id = db.Column(db.String(80), primary_key=True,
                   unique=True, nullable=False)
    side = relationship('Side', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Ice_Cream_Flavor(db.Model):
    __tablename__ = 'ice_cream_flavor'
    id = db.Column(db.String(80), primary_key=True, unique=True,  # natural key with the name of the ice cream flavor
                   nullable=False)
    order_ice_cream = relationship('Order_Ice_Cream', lazy=True)
    ice_cream_serving_size_price = relationship(
        'Ice_Cream_Bowl', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Ice_Cream_Bowl(db.Model):
    __tablename__ = 'ice_cream_bowl'
    side_id = db.Column(UUID(as_uuid=True), db.ForeignKey(
        "side.id"), primary_key=True, nullable=False)
    flavor_id = db.Column(db.String(80), db.ForeignKey(
        "ice_cream_flavor.id"),  primary_key=True, nullable=False)
    serving_size_id = db.Column(db.String(80), db.ForeignKey(
        "ice_cream_serving_size.id"), nullable=False)
    price = db.Column(db.Float(), nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Ice_Cream_Flavor_Serving_Size_Price(db.Model):
    __tablename__ = 'ice_cream_flavor_serving_size_price'
    flavor_id = db.Column(db.String(80), db.ForeignKey(
        "ice_cream_flavor.id"),  primary_key=True, nullable=False)
    serving_size_id = db.Column(db.String(80), db.ForeignKey(
        "ice_cream_serving_size.id"), primary_key=True, nullable=False)
    price = db.Column(db.Float(), nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Order_Ice_Cream(db.Model):
    __tablename__ = 'order_ice_cream'
    side_id = db.Column(UUID(as_uuid=True), db.ForeignKey(
        "side.id"), primary_key=True, nullable=False)
    order_id = db.Column(UUID(as_uuid=True), db.ForeignKey(
        "order.id"), primary_key=True, nullable=False)
    flavor = db.Column(db.String(80),  db.ForeignKey(
        "ice_cream_flavor.id"), nullable=False)
    serving_size_id = db.Column(db.String(80), db.ForeignKey(
        "ice_cream_serving_size.id"), nullable=False)
    topping = db.Column(db.String(80), db.ForeignKey(
        "ingredient.id"), primary_key=True, nullable=False)
    topping_serving_size = db.Column(
        db.String(80), db.ForeignKey(
            "ingredient_serving_size.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Ice_Cream_Serving_Size(db.Model):
    __tablename__ = 'ice_cream_serving_size'
    id = db.Column(db.String(80), primary_key=True, unique=True,
                   nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Settings(db.Model):
    __tablename__ = 'settings'
    id = db.Column(db.String(10), primary_key=True, unique=True,
                   nullable=False)
    ordering = db.Column(db.String(10),
                         nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


cwd = os.getcwd()


def load_json(filename):

    # https://stackoverflow.com/questions/46408051/python-json-load-set-encoding-to-utf-8/46408435#46408435
    with open(filename, encoding='UTF-8') as file:
        jsn = json.load(file)
        file.close()

    return jsn


def create_ingredient_category():

    file_path = Path(cwd+'/static/json/ingredient_category.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']

        new_ingredient_category = Ingredient_Category(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ingredient_category)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_ingredient():
    cwd = os.getcwd()
    file_path = Path(cwd+'/static/json/ingredient.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']
        ingredient_category_id = item['ingredient_category_id']
        ingredient_flavor_profile_id = item['ingredient_flavor_profile_id']

        new_ingredient = Ingredient(id=id,
                                    ingredient_category_id=ingredient_category_id, ingredient_flavor_profile_id=ingredient_flavor_profile_id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ingredient)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_ingredient_serving_size():
    file_path = Path(cwd+'/static/json/ingredient_serving_size.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']

        new_ingredient_serving_size_price = Ingredient_Serving_Size(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ingredient_serving_size_price)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_ingredient_serving_size_price():
    file_path = Path(cwd+'/static/json/ingredient_serving_size_price.json')
    json_items = load_json(file_path)

    for item in json_items:
        ingredient_id = item['ingredient_id']
        ingredient_category_id = item['ingredient_category_id']
        serving_size = item['serving_size']
        price = item['price']

        new_ingredient_serving_price = Ingredient_Serving_Size_Price(ingredient_id=ingredient_id, ingredient_category_id=ingredient_category_id,
                                                                     serving_size=serving_size, price=price)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ingredient_serving_price)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_crepe_flavor_profile():
    file_path = Path(cwd+'/static/json/crepe_flavor_profile.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']
        new_crepe_flavor_profile = Crepe_Flavor_Profile(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_crepe_flavor_profile)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_menu_crepe():
    file_path = Path(cwd+'/static/json/menu_crepe.json')
    test_items = load_json(file_path)

    for i in range(len(test_items)):
        crepe = test_items[i]
        origination_id = 'menu'
        new_crepe = Crepe(origination_id=origination_id,
                          flavor_profile_id=crepe["flavor_profile_id"])
        db.session.add(new_crepe)
    db.session.commit()
    db.session.remove()
    crepes = db.session.query(Crepe)
    serialized_crepes = [x.serialize for x in crepes]
    for i in range(len(test_items)):
        item = test_items[i]
        crepe_id = serialized_crepes[i]['id']
        name = item['name']
        price = item['price']
        new_menu_crepe = Menu_Crepe(
            crepe_id=crepe_id, name=name, price=price)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_menu_crepe)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_milk():
    file_path = Path(cwd+'/static/json/milk.json')
    test_items = load_json(file_path)

    for item in test_items:
        id = item['id']
        price = item['price']
        new_milk = Milk(id=id, price=price)

        # After I create the item, I can then add it to my session.
        db.session.add(new_milk)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_sides():
    ice_cream_bowl_file_path = Path(cwd+'/static/json/ice_cream.json')

    ice_cream_items = load_json(
        ice_cream_bowl_file_path)

    for i in range(len(ice_cream_items)):
        id = uuid.uuid4()
        side_type_id = 'ice_cream'
        side_name_id = 'ice_cream_bowl'
        new_side = Side(id=id, side_type_id=side_type_id,
                        side_name_id=side_name_id)
        db.session.add(new_side)
    db.session.commit()

    sides = db.session.query(Side)
    serialized_sides = [x.serialize for x in sides]

    for i in range(len(ice_cream_items)):
        side = ice_cream_items[i]
        side_flavor = side['flavor']
        side_serving_size = side['serving_size']
        side_price = side['price']
        new_ice_cream = Ice_Cream_Flavor_Serving_Size_Price(
            serving_size_id=side_serving_size, flavor_id=side_flavor, price=side_price)
        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ice_cream)
    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_crepe_origination():
    file_path = Path(cwd+'/static/json/crepe_origination.json')
    json_items = load_json(file_path)
    for item in json_items:
        id = item['id']
        new_crepe_origination = Crepe_Origination(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_crepe_origination)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_drink_category():
    file_path = Path(cwd+'/static/json/drink_category.json')

    json_items = load_json(
        file_path)

    for item in json_items:
        id = item['id']
        new_drink_category = Drink_Category(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_drink_category)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_drink_serving_size():
    file_path = Path(cwd+'/static/json/drink_serving_size.json')

    json_items = load_json(file_path)

    for item in json_items:

        id = item['id']

        new_drink_serving_size_price = Drink_Serving_Size(id=id)

        # After I create the drink, I can then add it to my session.
        db.session.add(new_drink_serving_size_price)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_coffee_name():
    file_path = Path(cwd+'/static/json/coffee_name.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']
        new_coffee_name = Coffee_Name(
            id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_coffee_name)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_coffee_temperature():
    file_path = Path(cwd+'/static/json/coffee_temperature.json')
    json_items = load_json(file_path)
    for item in json_items:
        id = item['id']
        new_coffee_temperature = Coffee_Temperature(id=id)
        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_coffee_temperature)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_coffee_flavor_syrup():
    file_path = Path(cwd+'/static/json/coffee_flavor_syrup.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']
        new_coffee_flavor_syrup = Coffee_Flavor_Syrup(id=id)
        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_coffee_flavor_syrup)
    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_coffee_flavor_syrup_serving_size():
    file_path = Path(cwd+'/static/json/coffee_flavor_syrup_serving_size.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']
        new_coffee_flavor_syrup = Coffee_Flavor_Syrup_Serving_Size(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_coffee_flavor_syrup)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_coffee_flavor_syrup_serving_size_price():
    file_path = Path(
        cwd+'/static/json/coffee_flavor_syrup_serving_size_price.json')
    json_items = load_json(file_path)

    for item in json_items:
        coffee_flavor_syrup_id = item['coffee_flavor_syrup_id']
        coffee_flavor_syrup_serving_size_id = item['coffee_flavor_syrup_serving_size_id']
        price = item['price']
        new_coffee_flavor_syrup_serving_size_price = Coffee_Flavor_Syrup_Serving_Size_Price(
            coffee_flavor_syrup_id=coffee_flavor_syrup_id, coffee_flavor_syrup_serving_size_id=coffee_flavor_syrup_serving_size_id, price=price)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_coffee_flavor_syrup_serving_size_price)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_drinks():

    drinks_file_path = Path(cwd+'/static/json/drink.json')
    drink_items = load_json(drinks_file_path)

    for item in drink_items:
        name = item['name']
        drink_category_id = item['drink_category_id']
        id = uuid.uuid4()
        new_drink = Drink(id=id, name=name,
                          drink_category_id=drink_category_id)
        db.session.add(new_drink)
    db.session.commit()
    db.session.remove()


def create_drink_name_serving_size_price():
    drinks = db.session.query(Drink)
    serialized_drinks = [x.serialize for x in drinks]
    milkshake_file_path = Path(cwd+'/static/json/milkshake.json')
    milkshake_items = load_json(milkshake_file_path)

    non_coffee_drinks_file_path = Path(
        cwd+'/static/json/non_coffee_drinks.json')
    non_coffee_items = load_json(non_coffee_drinks_file_path)

    bottled_drinks_file_path = Path(cwd+'/static/json/bottled_drinks.json')
    bottled_drink_items = load_json(bottled_drinks_file_path)

    coffee_file_path = Path(
        cwd+'/static/json/coffee_name_serving_size_price.json')
    coffee_items = load_json(coffee_file_path)

    for i in range(len(milkshake_items)):
        for j in range(len(serialized_drinks)):
            item = milkshake_items[i]
            name = item['name']
            if name == serialized_drinks[j]['name']:
                id = serialized_drinks[j]['id']
                drink_category_id = 'milkshake'
                serving_size = item['serving_size']
                price = item['price']
                new_drink_name_serving_size_price = Drink_Name_Serving_Size_Price(id=id,
                                                                                  name=name, drink_category_id=drink_category_id, serving_size=serving_size, price=price)
                db.session.add(new_drink_name_serving_size_price)

    for i in range(len(non_coffee_items)):
        for j in range(len(serialized_drinks)):
            item = non_coffee_items[i]
            name = item['name']
            if name == serialized_drinks[j]['name']:
                id = serialized_drinks[j]['id']
                drink_category_id = 'non-coffee'
                serving_size = item['serving_size']
                price = item['price']
                new_drink_name_serving_size_price = Drink_Name_Serving_Size_Price(id=id,
                                                                                  name=name, drink_category_id=drink_category_id, serving_size=serving_size, price=price)
                db.session.add(new_drink_name_serving_size_price)

    for i in range(len(bottled_drink_items)):
        for j in range(len(serialized_drinks)):
            item = bottled_drink_items[i]
            name = item['name']
            if name == serialized_drinks[j]['name']:
                id = serialized_drinks[j]['id']
                drink_category_id = 'bottled'
                serving_size = item['serving_size']
                price = item['price']
                new_drink_name_serving_size_price = Drink_Name_Serving_Size_Price(id=id,
                                                                                  name=name, drink_category_id=drink_category_id, serving_size=serving_size, price=price)
                db.session.add(new_drink_name_serving_size_price)

    for i in range(len(coffee_items)):
        for j in range(len(serialized_drinks)):
            item = coffee_items[i]
            name = item['name']
            if name == serialized_drinks[j]['name']:
                id = serialized_drinks[j]['id']
                drink_category_id = 'coffee'
                serving_size = item['serving_size']
                price = item['price']
                new_drink_name_serving_size_price = Drink_Name_Serving_Size_Price(id=id,
                                                                                  name=name, drink_category_id=drink_category_id, serving_size=serving_size, price=price)
                db.session.add(new_drink_name_serving_size_price)
    db.session.commit()
    db.session.remove()


def create_side_type():
    file_path = Path(cwd+'/static/json/side_type.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']
        new_side_type = Side_Type(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_side_type)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_side_name():
    file_path = Path(cwd+'/static/json/side_name.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']
        new_side_name = Side_Name(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_side_name)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_ice_cream_serving_size():
    file_path = Path(cwd+'/static/json/ice_cream_serving_size.json')
    json_items = load_json(file_path)

    for item in json_items:

        id = item['id']
        new_ice_cream_serving_size = Ice_Cream_Serving_Size(
            id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ice_cream_serving_size)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_ice_cream_flavor():
    file_path = Path(cwd+'/static/json/ice_cream_flavor.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']
        new_ice_cream_flavor = Ice_Cream_Flavor(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ice_cream_flavor)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_coffee_flavor_syrup():
    file_path = Path(cwd+'/static/json/coffee_flavor_syrup.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']
        new_coffee_flavor_syrup = Coffee_Flavor_Syrup(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_coffee_flavor_syrup)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_espresso():
    file_path = Path(cwd+'/static/json/espresso.json')
    json_items = load_json(file_path)

    for item in json_items:
        serving_size = item['serving_size']
        price = item['price']
        new_espresso = Espresso(serving_size=serving_size, price=price)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_espresso)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_settings():
    setting = {"id": 0, "ordering": "on"}
    new_setting = Settings(id=setting['id'], ordering=setting['ordering'])
    db.session.add(new_setting)
    db.session.commit()


def create_everything():
    create_ingredient_category()
    create_crepe_flavor_profile()
    create_ingredient()
    create_ingredient_serving_size()
    create_ingredient_serving_size_price()
    create_drink_category()
    create_drink_serving_size()
    create_espresso()
    create_coffee_name()
    create_coffee_flavor_syrup()
    create_coffee_flavor_syrup_serving_size()
    create_coffee_flavor_syrup_serving_size_price()
    create_coffee_temperature()
    create_drinks()
    create_drink_name_serving_size_price()
    create_milk()
    create_crepe_origination()
    create_side_type()
    create_side_name()
    create_ice_cream_serving_size()
    create_ice_cream_flavor()
    create_sides()
    create_menu_crepe()
    create_settings()


def instantiate_db_connection():
    db.drop_all()
    db.create_all()
    create_everything()


instantiate_db_connection()


def update_ingredients():
    ingredients_to_update = [
        {"id": "steak", "serving_size": "light", "price": 11.50,
         "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "steak", "serving_size": "extra", "price": 11.50,
         "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "steak", "serving_size": "regular", "price": 11.50,
            "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "fajita_chicken", "serving_size": "light", "price": 9.50,
         "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "fajita_chicken", "serving_size": "extra", "price": 9.50,
            "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "fajita_chicken", "serving_size": "regular", "price": 11.50,
            "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "blackened_tofu", "serving_size": "light", "price": 8.95,
            "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "blackened_tofu", "serving_size": "extra", "price": 8.95,
         "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "blackened_tofu", "serving_size": "regular", "price": 10.45,
            "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "virginia_ham", "serving_size": "light", "price": 8.95,
         "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "virginia_ham", "serving_size": "extra", "price": 8.95,
         "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "virginia_ham", "serving_size": "regular", "price": 10.45,
            "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "smoked_turkey", "serving_size": "light", "price": 8.95,
            "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "smoked_turkey", "serving_size": "extra", "price": 8.95,
         "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "smoked_turkey", "serving_size": "regular", "price": 10.45,
            "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "roast_beef", "serving_size": "light", "price": 8.95,
            "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "roast_beef", "serving_size": "extra", "price": 8.95,
         "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "roast_beef", "serving_size": "regular", "price": 10.45,
            "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "buffalo_chicken", "serving_size": "light", "price": 8.95,
            "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "buffalo_chicken", "serving_size": "extra", "price": 8.95,
         "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "buffalo_chicken", "serving_size": "regular", "price": 10.45,
            "ingredient_category_id": "protein", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "artichoke_hearts", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "artichoke_hearts", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "artichoke_hearts", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "cooked_spinach", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "cooked_spinach", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "cooked_spinach", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "sauteed onions", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "sauteed onions", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "sauteed onions", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "red_onion", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "red_onion", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "red_onion", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "cucumber", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "cucumber", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "cucumber", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "roasted_red_peppers", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "roasted_red_peppers", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "roasted_red_peppers", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "raw_spinach", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "raw_spinach", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "raw_spinach", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "mushrooms", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "mushrooms", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "mushrooms", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "sauteed_garlic", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "sauteed_garlic", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "sauteed_garlic", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "olives", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "olives", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "olives", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "banana_pepper", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "banana_pepper", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "banana_pepper", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "bernaise", "serving_size": "light", "price": 0.99,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "bernaise", "serving_size": "extra", "price": 0.99,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "bernaise", "serving_size": "regular", "price": 1.98,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "chimichuri", "serving_size": "light", "price": 0.99,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "chimichuri", "serving_size": "extra", "price": 0.99,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "chimichuri", "serving_size": "regular", "price": 1.98,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "balsamic_glaze", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "balsamic_glaze", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "balsamic_glaze", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "ranch", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "ranch", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "ranch", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "peanut_sauce", "serving_size": "light", "price": 0.99,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "peanut_sauce", "serving_size": "extra", "price": 0.99,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "peanut_sauce", "serving_size": "regular", "price": 1.98,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "onion_vinegarette", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "onion_vinegarette", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "onion_vinegarette", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "steak_diane", "serving_size": "light", "price": 0.99,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "steak_diane", "serving_size": "extra", "price": 0.99,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "steak_diane", "serving_size": "regular", "price": 1.98,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "blue_cheese", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "blue_cheese", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "blue_cheese", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "caesar", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "caesar", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "caesar", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "honey_mustard", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "honey_mustard", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "honey_mustard", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "oil_vinaigrette", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "oil_vinaigrette", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "oil_vinaigrette", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "hot_sauce", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "hot_sauce", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "hot_sauce", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "blue_cheese_crumble", "serving_size": "light", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "blue_cheese_crumble", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "blue_cheese_crumble", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "gourmet_herb_cheese", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "gourmet_herb_cheese", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "gourmet_herb_cheese", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "triple_creme_brie", "serving_size": "light", "price": 0.75,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "triple_creme_brie", "serving_size": "extra", "price": 0.75,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "triple_creme_brie", "serving_size": "regular", "price": 1.50,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "sharp_cheddar", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "sharp_cheddar", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "sharp_cheddar", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "swiss", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "swiss", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "swiss", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "smoked_gouda", "serving_size": "light", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "smoked_gouda", "serving_size": "extra", "price": 0.0,
         "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},
        {"id": "smoked_gouda", "serving_size": "regular", "price": 0.0,
            "ingredient_category_id": "vegetable", "ingredient_flavor_profile_id": "savory", "is_active": True},

        {"id": "raspberries", "serving_size": "light", "price": 0.99,
            "ingredient_category_id": "fruit", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "raspberries", "serving_size": "regular", "price": 1.98,
         "ingredient_category_id": "fruit", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "raspberries", "serving_size": "extra", "price": 0.99,
            "ingredient_category_id": "fruit", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "blueberries", "serving_size": "light", "price": 0.99,
            "ingredient_category_id": "fruit", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "blueberries", "serving_size": "regular", "price": 1.98,
         "ingredient_category_id": "fruit", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "blueberries", "serving_size": "extra", "price": 0.99,
            "ingredient_category_id": "fruit", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "bananas", "serving_size": "light", "price": 0.99,
            "ingredient_category_id": "fruit", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "bananas", "serving_size": "regular", "price": 1.98,
         "ingredient_category_id": "fruit", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "bananas", "serving_size": "extra", "price": 0.99,
            "ingredient_category_id": "fruit", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "strawberry_slices", "serving_size": "light", "price": 0.99,
            "ingredient_category_id": "fruit", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "strawberry_slices", "serving_size": "regular", "price": 1.98,
         "ingredient_category_id": "fruit", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "strawberry_slices", "serving_size": "extra", "price": 0.99,
            "ingredient_category_id": "fruit", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "apple_slices", "serving_size": "light", "price": 0.99,
            "ingredient_category_id": "fruit", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "apple_slices", "serving_size": "regular", "price": 1.98,
         "ingredient_category_id": "fruit", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "apple_slices", "serving_size": "extra", "price": 0.99,
            "ingredient_category_id": "fruit", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "toasted_coconut", "serving_size": "light", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "toasted_coconut", "serving_size": "regular", "price": 1.98,
         "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "toasted_coconut", "serving_size": "extra", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "milk_chocolate", "serving_size": "light", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "milk_chocolate", "serving_size": "regular", "price": 1.98,
         "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "milk_chocolate", "serving_size": "extra", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "white_chocolate", "serving_size": "light", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "white_chocolate", "serving_size": "regular", "price": 1.98,
         "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "white_chocolate", "serving_size": "extra", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "dark_chocolate", "serving_size": "light", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "dark_chocolate", "serving_size": "regular", "price": 1.98,
         "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "dark_chocolate", "serving_size": "extra", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "oreo_crumble", "serving_size": "light", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "oreo_crumble", "serving_size": "regular", "price": 1.98,
         "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "oreo_crumble", "serving_size": "extra", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "homemade_whipped_cream", "serving_size": "light", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "homemade_whipped_cream", "serving_size": "regular", "price": 1.98,
         "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "homemade_whipped_cream", "serving_size": "extra", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "nutella", "serving_size": "light", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "nutella", "serving_size": "regular", "price": 1.98,
         "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "nutella", "serving_size": "extra", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "honey", "serving_size": "light", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "honey", "serving_size": "regular", "price": 1.98,
         "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "honey", "serving_size": "extra", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "cobbler_crumble", "serving_size": "light", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "cobbler_crumble", "serving_size": "regular", "price": 1.98,
         "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "cobbler_crumble", "serving_size": "extra", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "lemon_curd", "serving_size": "light", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "lemon_curd", "serving_size": "regular", "price": 1.98,
         "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True},
        {"id": "lemon_curd", "serving_size": "extra", "price": 0.99,
            "ingredient_category_id": "sweetness", "ingredient_flavor_profile_id": "sweet", "is_active": True}
    ]

    for ingredient in ingredients_to_update:
        same_serving_size = []
        same_serving_size.append(ingredient)
        for other_ingredient in ingredients_to_update:
            if other_ingredient["id"] == ingredient["id"] and other_ingredient["serving_size"] != ingredient["serving_size"]:
                same_serving_size.append(other_ingredient)

        ingredient_existence = db.session.query(Ingredient).filter(
            Ingredient.id == ingredient["id"]).first()
        if not ingredient_existence:
            new_ingredient = Ingredient(id=ingredient["id"], ingredient_category_id=ingredient["ingredient_category_id"],
                                        ingredient_flavor_profile_id=ingredient["ingredient_flavor_profile_id"], is_active=True)
            db.session.add(new_ingredient)
            for ingredient in same_serving_size:
                new_ingredient_serving_size_price = Ingredient_Serving_Size_Price(
                    ingredient_id=ingredient["id"], ingredient_category_id=ingredient["ingredient_category_id"], serving_size=ingredient["serving_size"], price=ingredient["price"])
                db.session.add(new_ingredient_serving_size_price)
        else:
            ingredient_existence.is_active = True
            ingredient_serving_size_prices = db.session.query(Ingredient_Serving_Size_Price).filter(
                Ingredient_Serving_Size_Price.ingredient_id == ingredient["id"]).all()
            for ingredient_serving_size_price in ingredient_serving_size_prices:
                for ingredient in same_serving_size:
                    if ingredient_serving_size_price.ingredient_id == ingredient["id"] and ingredient_serving_size_price.serving_size == ingredient["serving_size"] and ingredient_serving_size_price.price != ingredient["price"]:
                        ingredient_serving_size_price.price = ingredient["price"]
        db.session.commit()


update_ingredients()
