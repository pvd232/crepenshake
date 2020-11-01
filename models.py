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
from create_db import create_everything


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

    name = db.Column(db.String(80), nullable = False)
    price = db.Column(db.Float(), nullable=False)
    drink_category_id = db.Column(db.String(80), db.ForeignKey(
        'drink_category.id'), nullable=False)
    # milkshake = relationship('Milkshake', lazy=True)
    # non_coffee_drink = relationship('Non_Coffee_Drink', lazy=True)
    # bottled_drink = relationship('Bottled_Drink', lazy=True)
    coffee = relationship('Coffee', lazy=True)
    order_drink = relationship('Order_Drink', lazy=True)

    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Coffee_Name_Serving_Size_Price(db.Model):
    __tablename__ = 'coffee_name_serving_size_price'
    serving_size = db.Column(db.String(80), db.ForeignKey(
        "drink_serving_size.id"), primary_key=True, nullable=False)
    coffee_name = db.Column(db.String(80), db.ForeignKey(
        "coffee_name.id"), primary_key=True, nullable=False)
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
    coffee = relationship('Coffee', lazy=True)

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
    coffee_name_serving_size_price = relationship(
        'Coffee_Name_Serving_Size_Price', lazy=True)

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
    coffee_name_serving_size_price = relationship(
        'Coffee_Name_Serving_Size_Price', lazy=True)

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
    coffee = relationship(
        'Coffee', backref='espresso', lazy=True)
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
    coffee = relationship(
        'Coffee', backref='coffee_flavor_syrup', lazy=True)

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
    coffee = relationship(
        'Coffee', backref='coffee_flavor_syrup_serving_size', lazy=True)
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
    coffee = relationship('Coffee', lazy=True)
    @property
    def serialize(self):
        attribute_names = list(self.__dict__.keys())
        attributes = list(self.__dict__.values())
        serialized_attributes = {}
        for i in range(len(attributes)):
            serialized_attributes[attribute_names[i]] = attributes[i]
        return serialized_attributes


class Coffee(db.Model):
    __tablename__ = 'coffee'
    drink_id = db.Column(UUID(as_uuid=True), db.ForeignKey('drink.id'), primary_key=True,
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
    id = db.Column(UUID(as_uuid=True),primary_key=True,  # https://stackoverflow.com/questions/55917056/how-to-prevent-uuid-primary-key-for-new-sqlalchemy-objects-being-created-with-th
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


class Croissant(db.Model):
    side_id = db.Column(UUID(as_uuid=True), db.ForeignKey('side.id'), primary_key=True,  # natural key
                        nullable=False)
    flavor_id = db.Column(db.String(80), unique=True, nullable=False)
    price = db.Column(db.Float(), nullable=False)

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
    side_id = db.Column(UUID(as_uuid=True), db.ForeignKey("side.id"), primary_key=True, nullable=False)
    flavor_id = db.Column(db.String(80), db.ForeignKey("ice_cream_flavor.id"),  primary_key=True, nullable=False)
    serving_size_id = db.Column(db.String(80), db.ForeignKey("ice_cream_serving_size.id"), nullable=False)
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
try:
    db.create_all()
    create_everything()
except Exception:
    pass
# 2000-12-31
# db.drop_all()
# db.create_all()
# End of Models.py
