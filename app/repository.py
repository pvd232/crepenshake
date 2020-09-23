
from models import *
from create_db import db
from datetime import date
from sqlalchemy import or_
from sqlalchemy.orm import load_only


class Ingredient_Repository(object):

    def get_ingredients(self, session):
        ingredients = session.query(Ingredient)
        return ingredients

    def get_ingredient_prices(self, session):

        ingredient_prices = session.execute("SELECT i.id, i.ingredient_category_id, p.price FROM ingredient i JOIN ingredient_serving_size_price p on i.id = p.ingredient_id WHERE p.serving_size=:param",
                                            {"param": "regular"})
        return ingredient_prices

    def get_ingredient_categories(self, session):
        ingredient_categories = session.query(
            Ingredient_Category.id).filter(Ingredient_Category.id != 'fruit').filter(Ingredient_Category.id != 'sweetness')
        print("ingredient_categories: %s", ingredient_categories)
        return ingredient_categories

    def get_sweet_ingredient_prices(self, session):
        sweet_ingredients = session.query(Ingredient_Serving_Size_Price.ingredient_id, Ingredient_Serving_Size_Price.price, Ingredient.ingredient_category_id).join(Ingredient).filter(or_(
            Ingredient.ingredient_category_id == 'fruit', Ingredient.ingredient_category_id == 'sweetness'))
        return sweet_ingredients

    def get_sweet_ingredient_categories(self, session):
        ingredient_categories = session.query(
            Ingredient_Category.id).filter(or_(Ingredient_Category.id == 'fruit', Ingredient_Category.id == 'sweetness'))
        print("ingredient_categories: %s", ingredient_categories)
        return ingredient_categories


class Order_Repository(object):

    def post_order(self, session, customer, order, order_drink_list=None, order_side_list=None,  order_crepe_list=None, custom_crepe_list=None, new_model_crepe_list=None):

        user = session.query(Customer).filter(
            Customer.id == customer.id).first()
        # check to make sure the customer doesn't already exist in the database
        if not user:
            new_customer = Customer(id=customer.id, first_name=customer.first_name, last_name=customer.last_name,
                                    street=customer.street, city=customer.city, state=customer.state, zipcode=customer.zipcode, country=customer.country)
            session.add(new_customer)
        new_order = Order(id=order.id, customer_id=order.customer_id,
                          cost=order.cost, date=date.today())
        session.add(new_order)
        print('new_model_crepe_list', new_model_crepe_list)
        if order_crepe_list:
            if custom_crepe_list:
                for new_model_crepe in new_model_crepe_list:
                    new_crepe = Crepe(id=new_model_crepe.id, origination_id=new_model_crepe.origination_id,
                                      flavor_profile_id=new_model_crepe.flavor_profile_id)
                    session.add(new_crepe)
                for custom_crepe in custom_crepe_list:
                    print("custom_crepe: %s", custom_crepe.serialize())

                    new_custom_crepe = Custom_Crepe(
                        crepe_id=custom_crepe.crepe_id, ingredient_id=custom_crepe.ingredient_id, serving_size=custom_crepe.serving_size)
                    session.add(new_custom_crepe)
            for each_order_crepe in order_crepe_list:

                new_order_crepe = Order_Crepe(
                    order_id=new_order.id, crepe_id=each_order_crepe.crepe_id, quantity=each_order_crepe.quantity)
                session.add(new_order_crepe)

        if order_drink_list:

            for each_order_drink in order_drink_list:
                new_order_drink = Order_Drink(
                    order_id=new_order.id, drink_id=each_order_drink.drink_id, quantity=each_order_drink.quantity)
                session.add(new_order_drink)

        if order_side_list:
            for each_order_side in order_side_list:
                new_order_side = Order_Side(
                    order_id=new_order.id, side_id=each_order_side.side_id, quantity=each_order_side.quantity)
                session.add(new_order_side)

    def get_orders(self, session):

        orders = session.query(Order)
        return orders


class Drink_Repository(object):

    def get_bottled_drinks(self, session):
        bottled_drinks = session.execute(
            "SELECT m.name, m.price, d.drink_category_id FROM bottled_drink m JOIN drink d ON m.drink_id=d.id")
        return bottled_drinks

    def get_milkshakes(self, session):
        milkshakes = session.execute(
            "SELECT m.name, m.price, d.drink_category_id FROM milkshake m JOIN drink d ON m.drink_id=d.id")
        return milkshakes

    def get_coffee_drinks(self, session):
        coffee = session.execute(
            "SELECT * FROM coffee_name_serving_size_price JOIN drink_category d ON d.id = 'coffee'")
        return coffee

    def get_non_coffee_drinks(self, session):
        non_coffee = session.execute(
            "SELECT m.name, m.price, m.serving_size, d.drink_category_id FROM non_coffee_drink m JOIN drink d ON m.drink_id=d.id")
        return non_coffee

    def get_milk_drinks(self, session):
        milk_drinks = session.execute("SELECT id FROM milk")
        return milk_drinks

    def get_coffee_syrups(self, session):
        coffee_syrups = session.query(
            Coffee_Flavor_Syrup)
        return coffee_syrups

    def get_drink_categories(self, session):
        drink_categories = session.query(
            Drink_Category)
        return drink_categories

    def get_temperature(self, session):
        drink_categories = session.query(
            Coffee_Temperature)
        return drink_categories


class Side_Repository(object):
    def get_croissants(self, session):
        croissants = session.query(Croissant)
        return croissants

    def get_side_names(self, session):
        side_names = session.query(Side_Name)
        return side_names

    def get_ice_cream_prices(self, session):
        ice_cream_prices = session.query(Ice_Cream_Serving_Size_Price)
        return ice_cream_prices

    def get_toppings(self, session):
        toppings = session.query(Ingredient_Serving_Size_Price).join(Ingredient).filter(or_(
            Ingredient.ingredient_category_id == 'fruit', Ingredient.ingredient_category_id == 'sweetness'))
        return toppings


class Menu_Crepe_Repository(object):
    def get_sweet_menu_crepes(self, session):
        menu_crepes = session.query(Menu_Crepe.crepe_id, Menu_Crepe.name, Menu_Crepe.price, Crepe.flavor_profile_id).join(Crepe).filter(
            Crepe.flavor_profile_id == 'sweet')
        return menu_crepes

    def get_savory_menu_crepes(self, session):
        menu_crepes = session.query(Menu_Crepe.crepe_id, Menu_Crepe.name, Menu_Crepe.price, Crepe.flavor_profile_id).join(Crepe).filter(
            Crepe.flavor_profile_id == 'savory')
        return menu_crepes
