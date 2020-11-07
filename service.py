import json
import os
from base64 import b64encode
import requests
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from model import *
from repository import Ingredient_Repository,  Order_Repository, Drink_Repository, Side_Repository, Menu_Crepe_Repository

from datetime import date
import uuid
from sqlalchemy.orm import scoped_session
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from contextlib import contextmanager
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def change_case(str):
    res = [str[0].lower()]
    for c in str[1:]:
        if c in ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'):
            res.append('_')
            res.append(c.lower())
        else:
            res.append(c)
    return ''.join(res)

class Menu_Service(object):
    def __init__(self):
        self.username = "postgres"
        self.password = "Iqopaogh23!"
        self.connection_string_beginning = "postgres://"
        self.connection_string_end = "@localhost:5432/crepenshakedb"
        self.connection_string = self.connection_string_beginning + \
            self.username + ":" + self.password + self.connection_string_end

        self.ingredient_service = Ingredient_Service()
        self.drink_service = Drink_Service()
        self.side_service = Side_Service()
        self.menu_crepe_service = Menu_Crepe_Service()

    @contextmanager
    def session_scope(self):
        # an Engine, which the Session will use for connection
        # resources
        self.drink_engine = create_engine(os.environ.get("DB_STRING", self.connection_string))

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
    def get_menu_items(self):
        response = {}
        fruit_ingredients = [x.serialize() for x in self.ingredient_service.get_fruit_ingredients()]
        response['fruit_ingredients'] = fruit_ingredients
        sweetness_ingredients = [x.serialize() for x in self.ingredient_service.get_sweetness_ingredients()]
        response['sweetness_ingredients'] = sweetness_ingredients

        savory_ingredient_prices_by_category = self.ingredient_service.get_savory_ingredient_prices_by_category()
        new_ingredient_prices_by_category = []
        for x in savory_ingredient_prices_by_category:
            new_ingredient_category_dict = {}
            new_ingredient_category_dict['ingredient_category'] = x['ingredient_category']
            new_ingredient_category_dict['ingredients'] = []
            for y in x['ingredients']:
                new_ingredient_category_dict['ingredients'].append(y.serialize())
            new_ingredient_prices_by_category.append(new_ingredient_category_dict)
        response['savory_ingredient_prices_by_category'] = savory_ingredient_prices_by_category
        
        croissants = [x.serialize() for x in self.side_service.get_croissants()]
        response['croissants'] = croissants

        ice_cream_bowls = [x.serialize() for x in self.side_service.get_ice_cream_bowls()]
        response['ice_cream_bowls'] = ice_cream_bowls

        toppings = [x.serialize()
                    for x in self.ingredient_service.get_sweet_ingredient_prices()]
        response['toppings'] = toppings

        coffee_drinks = [x.serialize() for x in self.drink_service.get_coffee_drinks()]
        response['coffee_drinks'] = coffee_drinks
        

        temperatures = [x.serialize() for x in self.drink_service.get_coffee_temperature()]
        response['temperatures'] = temperatures

        milks = [x.serialize() for x in self.drink_service.get_milk_drinks()]
        response['milks'] = milks

        syrups = [x.serialize() for x in self.drink_service.get_coffee_syrups()]
        response['syrups'] = syrups


        milkshakes = [x.serialize() for x in self.drink_service.get_drinks('milkshake')]
        response['milkshakes'] = milkshakes

        non_coffee_drinks = [x.serialize() for x in self.drink_service.get_drinks('non-coffee')]
        response['non_coffee_drinks'] = non_coffee_drinks
        
        bottled_drinks = [x.serialize() for x in self.drink_service.get_drinks('bottled')]
        response['bottled_drinks'] = bottled_drinks


        savory_menu_crepes = [x.serialize() for x in self.menu_crepe_service.get_savory_menu_crepes()]
        response['savory_menu_crepes'] = savory_menu_crepes

        sweet_menu_crepes = [x.serialize() for x in self.menu_crepe_service.get_sweet_menu_crepes()]
        response['sweet_menu_crepes'] = sweet_menu_crepes

        return response


    

class Ingredient_Service(object):
    # dope shit magic https://docs.sqlalchemy.org/en/13/orm/session_basics.html
    def __init__(self):
        self.username = "postgres"
        self.password = "Iqopaogh23!"
        self.connection_string_beginning = "postgres://"
        self.connection_string_end = "@localhost:5432/crepenshakedb"
        self.connection_string = self.connection_string_beginning + \
            self.username + ":" + self.password + self.connection_string_end

        self.ingredient_repository = Ingredient_Repository()

    @contextmanager
    def session_scope(self):
        # an Engine, which the Session will use for connection
        # resources
        self.drink_engine = create_engine(os.environ.get("DB_STRING", self.connection_string))

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

    def get_savory_ingredient_categories(self):
        response = []
        with self.session_scope() as session:
            for ingredient_category in self.ingredient_repository.get_savory_ingredient_categories(session):
                ingredient_category_model = Ingredient_Category(
                    id=ingredient_category.id)
                response.append(ingredient_category_model)
            return response

    
    def get_sweet_ingredient_categories(self):
        response = []
        with self.session_scope() as session:
            for ingredient_category in self.ingredient_repository.get_sweet_ingredient_categories(session):

                ingredient_category_model = Ingredient_Category(
                    id=ingredient_category.id)
                response.append(ingredient_category_model)
            return response

    def get_ingredient_serving_sizes(self):
        response = []
        with self.session_scope() as session:
            for ingredient_serving_size in self.ingredient_repository.get_ingredient_serving_sizes(session):
                ingredient_serving_size_model = Ingredient_Model(
                    serving_size=ingredient_serving_size.id)
                response.append(ingredient_serving_size_model)
            return response



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
    
    #self.ingredient_repository.get_savory_ingredient_categories() only gets ingredient categories that are not sweet or fruit
    def get_savory_ingredient_prices_by_category(self):
        response = []
        savory_ingredient_categories = self.get_savory_ingredient_categories()
        with self.session_scope() as session:
            for ingredient_category in savory_ingredient_categories:
                ingredient_category_dict = {}
                ingredient_category_dict['ingredients'] = []
                for ingredient in self.ingredient_repository.get_ingredient_prices(session):
                    if ingredient_category.id == ingredient.ingredient_category_id:
                        ingredient_category_dict['ingredient_category'] = ingredient_category.id
                        ingredient_model = Ingredient_Model(id=ingredient.id, ingredient_category_id=ingredient.ingredient_category_id, price=ingredient.price)
                        ingredient_category_dict['ingredients'].append(
                            ingredient_model)
                response.append(ingredient_category_dict)
            return response

                
    def get_sweet_ingredient_prices(self):
        response = []
        with self.session_scope() as session:
            for ingredient in self.ingredient_repository.get_sweet_ingredient_prices(session):
                ingredient_model = Ingredient_Model(
                    id=ingredient.ingredient_id, ingredient_category_id=ingredient.ingredient_category_id, price=ingredient.price)
                response.append(ingredient_model)
            return response

    def get_sweetness_ingredients(self):
        response = []
        with self.session_scope() as session:
            for ingredient in self.ingredient_repository.get_sweet_ingredient_prices(session):
                if ingredient.ingredient_category_id == 'sweetness':
                    ingredient_model = Ingredient_Model(
                        id=ingredient.ingredient_id, ingredient_category_id=ingredient.ingredient_category_id, price=ingredient.price)
                    response.append(ingredient_model)
            return response

    def get_fruit_ingredients(self):
        response = []
        with self.session_scope() as session:
            for ingredient in self.ingredient_repository.get_sweet_ingredient_prices(session):
                if ingredient.ingredient_category_id == 'fruit':
                    ingredient_model = Ingredient_Model(
                        id=ingredient.ingredient_id, ingredient_category_id=ingredient.ingredient_category_id, price=ingredient.price)
                    response.append(ingredient_model)
            return response


class Order_Service(object):
    def __init__(self):
        self.username = "postgres"
        self.password = "Iqopaogh23!"
        self.connection_string_beginning = "postgres://"
        self.connection_string_end = "@localhost:5432/crepenshakedb"
        self.connection_string = self.connection_string_beginning + \
            self.username + ":" + self.password + self.connection_string_end
        self.order_repository = Order_Repository()

    @contextmanager
    def session_scope(self):
        # an Engine, which the Session will use for connection
        # resources
        self.drink_engine = create_engine(os.environ.get("DB_STRING", self.connection_string))

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

    def send_confirmation_email(self, customer_email):
        mail_content = "Hello, we need you at the office ASAP. It is extremely urgent."
        #The mail addresses and password
        sender_address = 'patardriscoll@gmail.com'
        sender_pass = 'Iqopaogh23!'
        #Setup the MIME
        message = MIMEMultipart()
        message['From'] = sender_address
        message['To'] = customer_email
        message['Subject'] = 'Urgent Strategy& Task'   #The subject line
        #The body and the attachments for the mail
        message.attach(MIMEText(mail_content, 'plain'))
        #Create SMTP session for sending the mail
        session = smtplib.SMTP('smtp.gmail.com', 587) #use gmail with port
        session.starttls() #enable security
        session.login(sender_address, sender_pass) #login with mail_id and password
        text = message.as_string()
        session.sendmail(sender_address, customer_email, text)
        session.quit()
        print('Mail Sent')

    def developer_pay(self, order):
        print("order", order)
        
        ###############################################
        ########## BEGIN SCRIPT CONFIG SETUP ##########
        ###############################################

        merchantID = "CNKMYYVYGJHXJ"  # sandbox Test Merchant
        target_env = "https://sandbox.dev.clover.com/v2/merchant/"
        # orderID = order.id
        orderID = "8GCADRD79S1DW"

        print("orderID", orderID)
        
        API_Token = "1decda79-717f-8ad5-a3d4-f4f6bb0d7ee0"
        # amount =  order.cost
        amount = 1
        print("amount", amount)
        
        # amount = 1
        tip_amount = 0
        tax_amount = 0
        cardNumber = str(order.customer.payment_information.credit_card_number)
        # cardNumber = '4761739001010010'

        expMonth = order.customer.payment_information.credit_card_expiration_month
        expYear = order.customer.payment_information.credit_card_expiration_year
        CVV = order.customer.payment_information.credit_card_cvv


        nj_sales_tax_rt = .06625
        # tax_amount = amount * nj_sales_tax_rt
        # tax_amount = round(tax_amount, 2)
        print("tax_amount", tax_amount)
        
        ###############################################
        ########## END SCRIPT CONFIG SETUP ############
        ###############################################

        # GET to /v2/merchant/{mId}/pay/key To get the encryption information needed for the pay endpoint.
        url = target_env + merchantID + '/pay/key'
        headers = {"Authorization": "Bearer " + API_Token}
        response = requests.get(url, headers=headers).json()

        modulus = int(response['modulus'])
        print("modulus", modulus)
        
        exponent = int(response['exponent'])
        print("exponent", exponent)
        
        prefix = str(response['prefix'])
        print("prefix", prefix)
        

        # construct an RSA public key using the modulus and exponent provided by GET /v2/merchant/{mId}/pay/key
        key = RSA.construct((modulus, exponent))

        # create a cipher from the RSA key and use it to encrypt the card number, prepended with the prefix from GET /v2/merchant/{mId}/pay/key
        cipher = PKCS1_OAEP.new(key)
        encoded_card_num = cardNumber.encode('ascii')
        encoded_prefix = prefix.encode('ascii')
        encrypted = cipher.encrypt(encoded_prefix + encoded_card_num)

        # Base64 encode the resulting encrypted data into a string to Clover as the 'cardEncrypted' property.
        cardEncrypted = b64encode(encrypted)

        # POST to /v2/merchant/{mId}/pay
        post_data = {
            "orderId": orderID,
            "currency": "usd",
            "amount": amount,
            "tipAmount": tip_amount,
            "taxAmount": tax_amount,
            "expMonth": expMonth,
            "cvv": CVV,
            "expYear": expYear,
            "cardEncrypted": cardEncrypted,
            "last4": cardNumber[-4:],
            "first6": cardNumber[0:6]
        }
        posturl = target_env + merchantID + '/pay'
        postresponse = requests.post( 
            posturl,
            headers=headers,
            data=post_data
        ).json()

    def create_order(self, order):
        new_order = Order_Model(order_object=order)
        # customer_email = new_order.customer.id
        email = 'crepenshake427@gmail.com'
        # self.send_confirmation_email(customer_email)
        self.send_confirmation_email(email)
        # self.developer_pay(new_order)
        with self.session_scope() as session:
            self.order_repository.post_order(session, order=new_order)
            return True
    
    def stripe_pay(self, order):
        with self.session_scope() as session:
            return self.order_repository.post_stripe_order(session, order=order)
        


class Drink_Service(object):
    def __init__(self):
        self.username = "postgres"
        self.password = "Iqopaogh23!"
        self.connection_string_beginning = "postgres://"
        self.connection_string_end = "@localhost:5432/crepenshakedb"
        self.connection_string = self.connection_string_beginning + \
            self.username + ":" + self.password + self.connection_string_end
        self.drink_repository = Drink_Repository()

    @contextmanager
    def session_scope(self):
        # an Engine, which the Session will use for connection
        # resources
        self.drink_engine = create_engine(os.environ.get("DB_STRING", self.connection_string))

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
                drink_category_model = Drink_Category(id=drink_category.id)
                response.append(drink_category_model)
                # response.append(drink_model.serialize())

            return response

    def get_drinks(self, requested_drink_category_id):
        response = []

        with self.session_scope() as session:
            for drink in self.drink_repository.get_drinks(session, requested_drink_category_id):
                drink_model = Drink_Model( id = drink.id, drink_category_id = drink.drink_category_id,
                    name=drink.name, price=drink.price)
                response.append(drink_model)
            formatted_response = [x.serialize() for x in response]
            return response

    def get_milk_drinks(self):
        response = []

        with self.session_scope() as session:
            for milk_drink in self.drink_repository.get_milk_drinks(session):

                drink_model = Drink_Model(
                    id=milk_drink.id, price=milk_drink.price)
                response.append(drink_model)
            return response

    def get_coffee_drinks(self):
        response = []

        with self.session_scope() as session:
            for coffee_drink in self.drink_repository.get_coffee_drinks(session):
                drink_model = Drink_Model(
                    name=coffee_drink.coffee_name, drink_category_id='coffee', price=coffee_drink.price, serving_size=coffee_drink.serving_size)
                response.append(drink_model)
            return response

    def get_coffee_syrups(self):
        response = []

        with self.session_scope() as session:
            for coffee_syrup in self.drink_repository.get_coffee_syrups(session):
                drink_model = Coffee_Model(
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
        self.connection_string_end = "@localhost:5432/crepenshakedb"
        self.connection_string = self.connection_string_beginning + \
            self.username + ":" + self.password + self.connection_string_end
        self.side_repository = Side_Repository()

    @contextmanager
    def session_scope(self):
        # an Engine, which the Session will use for connection
        # resources
        self.side_engine = create_engine(os.environ.get("DB_STRING", self.connection_string))

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
                ice_cream_model = Ice_Cream_Bowl_Model(
                                       flavor=ice_cream.flavor_id, price=ice_cream.price, serving_size = ice_cream.serving_size_id, quantity=1, side_name_id= 'ice_cream_bowl',toppings=None,ice_cream_object=None )
                response.append(ice_cream_model)
            return response


class Menu_Crepe_Service(object):
    def __init__(self):
        self.username = "postgres"
        self.password = "Iqopaogh23!"
        self.connection_string_beginning = "postgres://"
        self.connection_string_end = "@localhost:5432/crepenshakedb"
        self.connection_string = self.connection_string_beginning + \
            self.username + ":" + self.password + self.connection_string_end
        
        self.menu_crepe_repository = Menu_Crepe_Repository()

    @contextmanager
    def session_scope(self):
        # an Engine, which the Session will use for connection
        # resources
        self.menu_crepe_engine = create_engine(os.environ.get("DB_STRING", self.connection_string))

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
                    crepe_id=menu_crepe.crepe_id, name=menu_crepe.name, price=menu_crepe.price, flavor_profile_id=menu_crepe.flavor_profile_id, origination_id=menu_crepe.origination_id)
                response.append(crepe_model)
            return response

    def get_savory_menu_crepes(self):
        response = []
        with self.session_scope() as session:
            for menu_crepe in self.menu_crepe_repository.get_savory_menu_crepes(session):
                crepe_model = Menu_Crepe_Model(
                    crepe_id=menu_crepe.crepe_id, name=menu_crepe.name, price=menu_crepe.price, flavor_profile_id=menu_crepe.flavor_profile_id, origination_id=menu_crepe.origination_id)
                response.append(crepe_model)
            return response
