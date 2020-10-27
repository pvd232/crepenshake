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

    def get_ingredient_categories(self):
        response = []
        with self.session_scope() as session:
            for ingredient_category in self.ingredient_repository.get_ingredient_categories(session):
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
    

    def get_ingredient_prices_by_category(self):
        response = []
        ingredient_categories = self.get_ingredient_categories()
        with self.session_scope() as session:
            for ingredient_category in ingredient_categories:
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

    def create_order(self, order):
        new_order = Order_Model(order_object=order)
        print("new_order.customer.id", new_order.customer.id)
        customer_email = new_order.customer.id
        self.send_confirmation_email(customer_email)
        # with self.session_scope() as session:
        #     self.order_repository.post_order(session, order=new_order)
        #     return True
    

            


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
                ice_cream_model = Ice_Cream_Bowl_Model(
                                       flavor=ice_cream.flavor_id, price=ice_cream.price, serving_size = ice_cream.serving_size_id, quantity=1, side_name_id= 'ice_cream_bowl',toppings=None,ice_cream_object=None )
                response.append(ice_cream_model)
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
