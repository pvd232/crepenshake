import json
import os
from base64 import b64encode
import requests
from domain import *
from models import instantiate_db_connection
from repository import Ingredient_Repository,  Order_Repository, Drink_Repository, Side_Repository, Menu_Crepe_Repository, Settings_Repository, db
from datetime import date
import uuid
from sqlalchemy.orm import scoped_session
from sqlalchemy.orm import sessionmaker
from sqlalchemy import inspect, create_engine
from contextlib import contextmanager
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import logging


def change_case(str):
    res = [str[0].lower()]
    for c in str[1:]:
        if c in ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'):
            res.append('_')
            res.append(c.lower())
        else:
            res.append(c)
    return ''.join(res)

@contextmanager
def session_scope():
    username = "postgres"
    password = "Iqopaogh23!"
    connection_string_beginning = "postgres://"
    connection_string_end = "@localhost:5432/crepenshakedb"
    connection_string = connection_string_beginning + \
        username + ":" + password + connection_string_end

    # an Engine, which the Session will use for connection
    # resources
    drink_engine = create_engine(
        os.environ.get("DB_STRING", connection_string), pool_size=0)

    # create a configured "Session" class
    session_factory = sessionmaker(bind=drink_engine)

    # create a Session
    session = scoped_session(session_factory)
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()
    # now all calls to Session() will create a thread-local session

class Menu_Service(object):
    def __init__(self):
        self.ingredient_service = Ingredient_Service()
        self.drink_service = Drink_Service()
        self.side_service = Side_Service()
        self.menu_crepe_service = Menu_Crepe_Service()
    def get_menu_items(self):
        response = {}
        fruit_ingredients = [
            x.serialize() for x in self.ingredient_service.get_fruit_ingredients()]
        response["fruit_ingredients"] = fruit_ingredients
        sweetness_ingredients = [
            x.serialize() for x in self.ingredient_service.get_sweetness_ingredients()]
        response["sweetness_ingredients"] = sweetness_ingredients

        savory_ingredient_prices_by_category = self.ingredient_service.get_savory_ingredient_prices_by_category()
        new_ingredient_prices_by_category = []
        for x in savory_ingredient_prices_by_category:
            print('x',x)
            new_ingredient_category_dict = {}
            new_ingredient_category_dict['ingredient_category'] = x["ingredient_category"]
            new_ingredient_category_dict['ingredients'] = []
            for y in x["ingredients"]:
                new_ingredient_category_dict['ingredients'].append(
                    y.serialize())
            new_ingredient_prices_by_category.append(
                new_ingredient_category_dict)
        response['savory_ingredient_prices_by_category'] = savory_ingredient_prices_by_category

        ice_cream_bowls = [x.serialize()
                           for x in self.side_service.get_ice_cream_bowls()]
            
        response['ice_cream_bowls'] = ice_cream_bowls

        toppings = [x.serialize()
                    for x in self.ingredient_service.get_sweet_ingredient_prices()]
        response['toppings'] = toppings

        coffee_drinks = [x.serialize()
                         for x in self.drink_service.get_drinks('coffee')]
        response['coffee_drinks'] = coffee_drinks

        temperatures = [x.serialize()
                        for x in self.drink_service.get_coffee_temperature()]
        response['temperatures'] = temperatures

        milks = [x.serialize() for x in self.drink_service.get_milk_drinks()]
        response['milks'] = milks

        syrups = [x.serialize()
                  for x in self.drink_service.get_coffee_syrups()]
        response['syrups'] = syrups

        milkshakes = [x.serialize()
                      for x in self.drink_service.get_drinks('milkshake')]
        response['milkshakes'] = milkshakes

        non_coffee_drinks = [x.serialize()
                             for x in self.drink_service.get_drinks('non-coffee')]
        response['non_coffee_drinks'] = non_coffee_drinks

        bottled_drinks = [x.serialize()
                          for x in self.drink_service.get_drinks('bottled')]
        response['bottled_drinks'] = bottled_drinks

        savory_menu_crepes = [
            x.serialize() for x in self.menu_crepe_service.get_savory_menu_crepes()]
        response['savory_menu_crepes'] = savory_menu_crepes

        sweet_menu_crepes = [
            x.serialize() for x in self.menu_crepe_service.get_sweet_menu_crepes()]
        response['sweet_menu_crepes'] = sweet_menu_crepes

        return response


class Ingredient_Service(object):
    # dope shit magic https://docs.sqlalchemy.org/en/13/orm/session_basics.html
    def __init__(self):
        self.ingredient_repository = Ingredient_Repository()

    def get_savory_ingredient_categories(self):
        response = []
        with session_scope() as session:
            for ingredient_category in self.ingredient_repository.get_savory_ingredient_categories(session):
                ingredient_category_model = Ingredient_Category_Domain(
                    id=ingredient_category.id)
                response.append(ingredient_category_model)
            return response

    def get_sweet_ingredient_categories(self):
        response = []
        with session_scope() as session:
            for ingredient_category in self.ingredient_repository.get_sweet_ingredient_categories(session):
                ingredient_category_model = Ingredient_Category_Domain(
                    id=ingredient_category.id)
                response.append(ingredient_category_model)
            return response

    def get_ingredient_serving_sizes(self):
        response = []
        with session_scope() as session:
            for ingredient_serving_size in self.ingredient_repository.get_ingredient_serving_sizes(session):
                ingredient_serving_size_model = Ingredient_Serving_Size(
                    id=ingredient_serving_size.id)
                response.append(ingredient_serving_size_model)
            return response

    def get_ingredients(self):
        response = []
        with session_scope() as session:
            for ingredient in self.ingredient_repository.get_ingredients(session):
                ingredient_model = Ingredient_Domain(
                    ingredient_object=ingredient)
                response.append(ingredient_model)
            return response

    def get_ingredient_prices(self):
        response = []
        with session_scope() as session:
            for ingredient in self.ingredient_repository.get_ingredient_prices(session):
                ingredient_model = Ingredient_Domain(
                    ingredient_object=ingredient)
                response.append(ingredient_model)
            return response

    # self.ingredient_repository.get_savory_ingredient_categories() only gets ingredient categories that are not sweet or fruit
    def get_savory_ingredient_prices_by_category(self):
        response = []
        savory_ingredient_categories = self.get_savory_ingredient_categories()
        with session_scope() as session:
            for ingredient_category in savory_ingredient_categories:
                ingredient_category_dict = {}
                ingredient_category_dict['ingredients'] = []
                for ingredient in self.ingredient_repository.get_ingredient_prices(session):
                    if ingredient_category.id == ingredient.ingredient_category_id:
                        ingredient_category_dict['ingredient_category'] = ingredient_category.id
                        ingredient_model = Ingredient_Domain(
                            ingredient_object=ingredient)
                        ingredient_category_dict['ingredients'].append(
                            ingredient_model)
                response.append(ingredient_category_dict)
            return response

    def get_sweet_ingredient_prices(self):
        response = []
        with session_scope() as session:
            for ingredient in self.ingredient_repository.get_sweet_ingredient_prices(session):
                ingredient_model = Ingredient_Domain(
                    ingredient_object=ingredient)
                response.append(ingredient_model)
            return response

    def get_sweetness_ingredients(self):
        response = []
        with session_scope() as session:
            for ingredient in self.ingredient_repository.get_sweet_ingredient_prices(session):
                if ingredient.ingredient_category_id == 'sweetness':
                    ingredient_domain = Ingredient_Domain(
                        ingredient_object=ingredient)
                    response.append(ingredient_domain)
            return response

    def get_fruit_ingredients(self):
        response = []
        with session_scope() as session:
            for ingredient in self.ingredient_repository.get_sweet_ingredient_prices(session):
                if ingredient.ingredient_category_id == 'fruit':
                    ingredient_domain = Ingredient_Domain(
                        ingredient_object=ingredient)
                    response.append(ingredient_domain)
            return response


class Order_Service(object):
    def __init__(self):
        self.order_repository = Order_Repository()

    def send_confirmation_email(self, order):
        mail_content = '<html><body>'
        mail_content += str(order)
        mail_content += '</body></html>'

        sender_address = 'confirmation@crepenshake.com'
        email = 'crepenshake@yahoo.com'

        # Setup the MIME
        message = MIMEMultipart()
        message['From'] = sender_address
        message['To'] = email
        message_subject = ' ' + order.customer.first_name + ' ' + order.customer.last_name + ' ' + 'Phone Number: ' + order.customer.phone_number + 'Email: ' + order.customer.id + ' ' + order.pickup_time
        message['Subject'] = 'Order From' + message_subject  # The subject line
        
        # The body and the attachments for the mail
        message.attach(MIMEText(mail_content, 'html'))
        # Create SMTP session for sending the mail
        s = smtplib.SMTP('smtp.mailgun.org', 587)
        s.starttls()
        s.login('postmaster@crepenshake.com',
                '6695313d8a619bc44dce00ad7184960a-ba042922-f2a8cfbb')
        s.sendmail(message['From'], message['To'], message.as_string())
        s.quit()

    def create_order(self, order):
        new_order = Order_Domain(order_json=order)
        self.send_confirmation_email(new_order)
        with session_scope() as session:
            return self.order_repository.post_order(session, order=new_order)
            

    def stripe_pay(self, order):
        with session_scope() as session:
            return self.order_repository.post_stripe_order(session, order=order)


class Drink_Service(object):
    def __init__(self):
        self.drink_repository = Drink_Repository()

    def get_drink_categories(self):
        response = []
        with session_scope() as session:
            for drink_category in self.drink_repository.get_drink_categories(session):
                drink_category_domain = Drink_Category_Domain(id=drink_category.id)
                response.append(drink_category_domain)
            return response

    def get_drinks(self, requested_drink_category_id):
        response = []
        with session_scope() as session:
            for drink in self.drink_repository.get_drinks(session, requested_drink_category_id):
                drink_domain = Drink_Domain(drink_object=drink)
                response.append(drink_domain)
            return response

    def get_milk_drinks(self):
        response = []
        with session_scope() as session:
            for milk_drink in self.drink_repository.get_milk_drinks(session):
                drink_domain = Milk_Domain(
                    milk_object=milk_drink)
                response.append(drink_domain)
            return response

    def get_coffee_syrups(self):
        response = []
        with session_scope() as session:
            for coffee_syrup_flavor in self.drink_repository.get_coffee_syrups(session):
                coffee_syrup_flavor_domain = Coffee_Syrup_Flavor_Domain(
                    id=coffee_syrup_flavor.id)
                response.append(coffee_syrup_flavor_domain)
            return response

    def get_coffee_temperature(self):
        response = []
        with session_scope() as session:
            for temp in self.drink_repository.get_temperature(session):
                temp_domain = Temperature_Domain(
                    id=temp.id)
                response.append(temp_domain)
            return response


class Side_Service(object):
    def __init__(self):
        self.side_repository = Side_Repository()

    def get_side_types(self):
        response = []
        with session_scope() as session:
            for side_type in self.side_repository.get_side_types(session):
                side_type_domain = Side_Type_Domain(id=side_type.id)
                response.append(side_type_domain)

            return response

    def get_side_names(self):
        response = []
        with session_scope() as session:
            for side_name in self.side_repository.get_side_names(session):
                side_name_domain = Side_Type_Domain(id=side_name.id)
                response.append(side_name_domain)
            return response

    def get_ice_cream_bowls(self):
        response = []
        with session_scope() as session:
            for ice_cream in self.side_repository.get_ice_cream_bowls(session):                
                ice_cream_domain = Ice_Cream_Bowl_Domain(ice_cream_object=ice_cream)
                response.append(ice_cream_domain)
            return response


class Menu_Crepe_Service(object):
    def __init__(self):
        self.menu_crepe_repository = Menu_Crepe_Repository()

    def get_sweet_menu_crepes(self):
        response = []
        with session_scope() as session:
            for menu_crepe in self.menu_crepe_repository.get_sweet_menu_crepes(session):
                menu_crepe_domain = Menu_Crepe_Domain(
                    menu_crepe_object = menu_crepe)
                response.append(menu_crepe_domain)
            return response

    def get_savory_menu_crepes(self):
        response = []
        with session_scope() as session:
            for menu_crepe in self.menu_crepe_repository.get_savory_menu_crepes(session):
                crepe_domain = Menu_Crepe_Domain(
                    menu_crepe_object = menu_crepe)
                response.append(crepe_domain)
            return response


class Test_Service(object):
    def __init__(self):
        self.username = "postgres"
        self.password = "Iqopaogh23!"
        self.connection_string_beginning = "postgres://"
        self.connection_string_end = "@localhost:5432/crepenshakedb"
        self.connection_string = self.connection_string_beginning + \
            self.username + ":" + self.password + self.connection_string_end
        self.test_engine = create_engine(
            os.environ.get("DB_STRING", self.connection_string))

    def test_connection(self):
        inspector = inspect(self.test_engine)
        #use this if you want to trigger a reset of the database in GCP
        # if len(inspector.get_table_names()) > 0:
        if len(inspector.get_table_names()) == 0:
            instantiate_db_connection()
            self.test_engine.dispose()
            return


class Settings_Service(object):
    def __init__(self):
        self.settings_repository = Settings_Repository()

    def update_settings(self, settings):
        with session_scope() as session:
            self.settings_repository.update_settings(session, settings)
            return
    
    def get_settings(self):
        with session_scope() as session:
            response = self.settings_repository.get_settings(session).serialize
            return response

