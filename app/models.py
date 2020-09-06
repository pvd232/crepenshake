# beginning of Models.py
# note that at this point you should have created "crepenshake" database (see install_postgres.txt).
from flask.json import JSONEncoder
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
import os
import datetime
from sqlalchemy.schema import DropTable
from sqlalchemy.ext.compiler import compiles
from dataclasses import dataclass

# https://stackoverflow.com/questions/38678336/sqlalchemy-how-to-implement-drop-table-cascade
@compiles(DropTable, "postgresql")
def _compile_drop_table(element, compiler, **kwargs):
    return compiler.visit_drop_table(element) + " CASCADE"


app = Flask(__name__)


username = "postgres"
password = "Iqopaogh23!"
connection_string_beginning = "postgres://"
connection_string_end = "@localhost:5432/crepenshake"
connection_string = connection_string_beginning + \
    username + ":" + password + connection_string_end
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    "DB_STRING", connection_string)


# to suppress a warning message
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)

# username = os.getenv("USER", None) or os.environ.get("username", None)
# password = os.getenv(
#     "PASSWORD", None) or os.environ.get("password", None)
# print('password', password)


class Crepe_Origination(db.Model):
    __tablename__ = 'crepe_origination'
    id = db.Column(db.String(80), primary_key=True,
                   unique=True, nullable=False)
    crepe = relationship('Crepe', lazy=True)

    @property
    def serialize(self):
        return {'id': self.id}


class Crepe_Flavor_Profile(db.Model):
    __tablename__ = 'crepe_flavor_profile'

    id = db.Column(db.String(80), primary_key=True,
                   unique=True, nullable=False)

    crepe = relationship('Crepe', lazy=True)

    @property
    def serialize(self):
        return {'id': self.id}


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
        return {'id': self.id, 'origination_id': self.origination_id, 'flavor_profile_id': self.flavor_profile_id}


class Custom_Crepe(db.Model):
    __tablename__ = 'custom_crepe'
    crepe_id = db.Column(UUID(as_uuid=True), db.ForeignKey('crepe.id'), primary_key=True,
                         nullable=False)

    ingredient_id = db.Column(
        db.String(80), db.ForeignKey('ingredient.id'), primary_key=True, nullable=False)
    quantity = db.Column(db.String(80), nullable=False)

    @property
    def serialize(self):
        return {'crepe_id': self.crepe_id, 'ingredient_id': self.ingredient_id, 'quantity': self.quantity}

# ingredientQuantity pricing table that lists a price for the given combination of the ingredient and quantity


class Menu_Crepe(db.Model):
    __tablename__ = 'menu_crepe'
    crepe_id = db.Column(UUID(as_uuid=True), db.ForeignKey('crepe.id'), primary_key=True,
                         unique=True, nullable=False)

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


class Order(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True,
                   unique=True, nullable=False)
    customer_id = db.Column(db.String(80), db.ForeignKey(
        'customer.id'), nullable=False)
    cost = db.Column(db.Float(), nullable=False)
    date = db.Column(db.String(80), nullable=False)
    orderDrink = relationship('Order_Drink', lazy=True)
    orderCrepe = relationship('Order_Crepe', lazy=True)
    orderSide = relationship('Order_Side', lazy=True)

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
                         unique=True, nullable=False)
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
    side_id = db.Column(db.String(80), db.ForeignKey('side.id'), primary_key=True,
                        unique=True, nullable=False)
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

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Ingredient_Serving_Price(db.Model):
    __tablename__ = 'ingredient_serving_price'
    ingredient_id = db.Column(db.String(80), db.ForeignKey('ingredient.id'), primary_key=True,
                              nullable=False)
    serving_size = db.Column(db.String(80), primary_key=True, nullable=False)
    price = db.Column(db.Float(), primary_key=True, nullable=False)

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

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Drink(db.Model):
    id = db.Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True,  # https://stackoverflow.com/questions/55917056/how-to-prevent-uuid-primary-key-for-new-sqlalchemy-objects-being-created-with-th
                   unique=True, nullable=False)
    drink_category_id = db.Column(db.String(80), db.ForeignKey(
        'drink_category.id'), nullable=False)
    order_drink = relationship('Order_Drink', lazy=True)
    milkshake = relationship('Milkshake', lazy=True)
    non_coffee_drink = relationship('Non_Coffee_Drink', lazy=True)
    bottled_drink = relationship('Bottled_Drink', lazy=True)
    order_coffee = relationship('Order_Coffee', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Coffee_Name_Serving_Size(db.Model):
    __tablename__ = 'coffee_name_serving_size'
    serving_size = db.Column(db.String(80), primary_key=True, nullable=False)
    coffee_name = db.Column(db.String(80), primary_key=True, nullable=False)
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
    coffee = relationship('Order_Coffee', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Coffee_Espresso(db.Model):
    __tablename__ = 'coffee_espresso'
    id = db.Column(db.String(80), primary_key=True, unique=True,  # natural key with the name of the milk
                   nullable=False)
    # for moon milk this will be a .25, .5, .75, or 1.0 , otherwise it will be 1.0
    coffee = relationship('Order_Coffee', lazy=True)
    price = db.Column(db.Float(), nullable=False)
    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Coffee_Syrup_Flavor(db.Model):
    __tablename__ = 'coffee_syrup_flavor'
    id = db.Column(db.String(80), primary_key=True, unique=True,  # natural key with the name of the milk
                   nullable=False)
    # for moon milk this will be a .25, .5, .75, or 1.0 , otherwise it will be 1.0
    price = db.Column(db.Float(), nullable=False)
    coffee = relationship('Order_Coffee')

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
    # for moon milk this will be a .25, .5, .75, or 1.0 , otherwise it will be 1.0
    coffee = relationship('Order_Coffee', lazy=True)
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
    id = db.Column(UUID(as_uuid=True), db.ForeignKey('drink.id'), primary_key=True,
                   nullable=False)
    coffee_name = db.Column(db.String(80),
                            nullable=False)
    serving_size = db.Column(db.String(80),
                             nullable=False)
    temperature = db.Column(db.String(80), db.ForeignKey("coffee_temperature.id"),
                            nullable=False)
    flavor_id = db.Column(db.String(80), db.ForeignKey(
        'coffee_syrup_flavor.id'), nullable=False)
    espresso_id = db.Column(db.String(80), db.ForeignKey(
        'coffee_espresso.id'), nullable=False)
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


class Milkshake(db.Model):
    drink_id = db.Column(UUID(as_uuid=True), db.ForeignKey('drink.id'), primary_key=True,
                         nullable=False)
    name = db.Column(db.String(80), nullable=False, unique=True)
    price = db.Column(db.Float(), nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Non_Coffee_Drink(db.Model):
    __tablename__ = 'non_coffee_drink'
    drink_id = db.Column(UUID(as_uuid=True), db.ForeignKey('drink.id'), primary_key=True,
                         nullable=False)
    name = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Float(), nullable=False)
    serving_size = db.Column(db.String(80), nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Bottled_Drink(db.Model):
    __tablename__ = 'bottled_drink'
    drink_id = db.Column(UUID(as_uuid=True), db.ForeignKey('drink.id'), primary_key=True,
                         nullable=False)
    name = db.Column(db.String(80), nullable=False, unique=True)
    price = db.Column(db.Float(), nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Side(db.Model):
    id = db.Column(db.String(80), primary_key=True,
                   unique=True, nullable=False)
    side_type_id = db.Column(db.String(80), db.ForeignKey('side_type.id'),  # natural key
                             unique=True, nullable=False)
    order_side = relationship('Order_Side', lazy=True)
    croissant = relationship('Croissant', lazy=True)
    ice_cream = relationship('Ice_Cream', lazy=True)

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

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Croissant(db.Model):
    side_id = db.Column(db.String(80), db.ForeignKey('side.id'), primary_key=True,  # natural key
                        nullable=False)
    flavor = db.Column(db.String(80), primary_key=True, nullable=False)
    price = db.Column(db.Float(), nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Ice_Cream(db.Model):
    __tablename__ = 'ice_cream'
    side_id = db.Column(db.String(80), db.ForeignKey('side.id'), primary_key=True,  # natural key
                        nullable=False)
    flavor = db.Column(db.String(80), primary_key=True, nullable=False)
    serving_size = db.Column(db.String(80), primary_key=True, nullable=False)
    topping = db.Column(db.String(80), primary_key=True, nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Ice_Cream_Price(db.Model):
    __tablename__ = 'ice_cream_price'
    serving_size = db.Column(db.String(80), primary_key=True, nullable=False)
    topping = db.Column(db.Boolean(), primary_key=True, nullable=False)
    price = db.Column(db.Float(), primary_key=True, nullable=False)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


# 2000-12-31
# db.drop_all()
# db.create_all()
# End of Models.py
