
from models import *
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
        return ingredient_categories

    def get_sweet_ingredient_prices(self, session):
        sweet_ingredients = session.query(Ingredient_Serving_Size_Price.ingredient_id, Ingredient_Serving_Size_Price.serving_size, Ingredient_Serving_Size_Price.price, Ingredient.ingredient_category_id).join(Ingredient).filter(or_(
            Ingredient.ingredient_category_id == 'fruit', Ingredient.ingredient_category_id == 'sweetness'), Ingredient_Serving_Size_Price.serving_size == 'regular')
        for x in sweet_ingredients:
            print('sweet', x)
        return sweet_ingredients

    def get_sweet_ingredient_categories(self, session):
        ingredient_categories = session.query(
            Ingredient_Category.id).filter(or_(Ingredient_Category.id == 'fruit', Ingredient_Category.id == 'sweetness'))
        return ingredient_categories

    def get_ingredient_serving_sizes(self, session):
        ingredient_serving_sizes = session.query(Ingredient_Serving_Size)
        return ingredient_serving_sizes


class Order_Repository(object):
    def post_order(self, session, order):
        new_customer = order.customer
        user = session.query(Customer).filter(
            Customer.id == new_customer.id).first()
        # check to make sure the customer doesn't already exist in the database
        if not user:
            new_customer = Customer(id=new_customer.id, first_name=new_customer.first_name, last_name=new_customer.last_name,
                                    street=new_customer.street, city=new_customer.city, state=new_customer.state, zipcode=new_customer.zipcode, country=new_customer.country)
            session.add(new_customer)
            new_order = Order(id=order.id, customer_id=new_customer.id,
                              cost=order.cost, date=order.date)
            session.add(new_order)
        else:
            new_order = Order(id=order.id, customer_id=user.id,
                              cost=order.cost, date=order.date)
            session.add(new_order)
        session.commit()
        for i in range(len(order.order_crepe.order_crepe)):
            crepe_to_add = order.order_crepe.order_crepe[i]
            if crepe_to_add.origination_id == 'custom':
                new_crepe = Crepe(id=crepe_to_add.crepe_id, origination_id=crepe_to_add.origination_id,
                                  flavor_profile_id=crepe_to_add.flavor_profile_id)
                session.add(new_crepe)
                for ingredient in crepe_to_add.ingredients:
                    new_custom_crepe = Custom_Crepe(
                        crepe_id=new_crepe.id, ingredient_id=ingredient.id, serving_size=ingredient.serving_size)
                    session.add(new_custom_crepe)
                new_order_crepe = Order_Crepe(
                    order_id=new_order.id, crepe_id=crepe_to_add.crepe_id, quantity=crepe_to_add.quantity)
                session.add(new_order_crepe)
            elif crepe_to_add.origination_id == 'menu':
                new_order_crepe = Order_Crepe(
                    order_id=new_order.id, crepe_id=crepe_to_add.crepe_id, quantity=crepe_to_add.quantity)
                session.add(new_order_crepe)
        session.commit()
        return

    def get_orders(self, session):
        orders = session.query(Order)
        return orders


class Drink_Repository(object):

    def get_bottled_drinks(self, session):
        bottled_drinks = session.execute(
            "SELECT m.name, m.price, d.id, d.drink_category_id FROM bottled_drink m JOIN drink d ON m.drink_id=d.id")
        return bottled_drinks

    def get_milkshakes(self, session):
        milkshakes = session.execute(
            "SELECT m.name, m.price, d.id, d.drink_category_id FROM milkshake m JOIN drink d ON m.drink_id=d.id")
        return milkshakes

    def get_coffee_drinks(self, session):
        coffee = session.execute(
            "SELECT * FROM coffee_name_serving_size_price JOIN drink_category d ON d.id = 'coffee'")
        return coffee

    def get_non_coffee_drinks(self, session):
        non_coffee = session.execute(
            "SELECT m.name, m.price, m.serving_size, d.id, d.drink_category_id FROM non_coffee_drink m JOIN drink d ON m.drink_id=d.id")
        return non_coffee

    def get_milk_drinks(self, session):
        milk_drinks = session.execute("SELECT id, price FROM milk")
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

    def get_side_types(self, session):
        side_types = session.query(Side_Type)
        return side_types

    def get_side_names(self, session):
        side_names = session.query(Side_Name)
        return side_names

    def get_side_serving_sizes(self, session):
        side_serving_sizes = session.query()

    def get_ice_cream_bowls(self, session):
        ice_cream = session.query(Ice_Cream_Bowl)
        return ice_cream

    # def get_toppings(self, session):
    #     toppings = session.query(Ingredient).filter(or_(
    #         Ingredient.ingredient_category_id == 'fruit', Ingredient.ingredient_category_id == 'sweetness'))
    #     return toppings


class Menu_Crepe_Repository(object):
    def get_sweet_menu_crepes(self, session):
        menu_crepes = session.query(Menu_Crepe.crepe_id, Menu_Crepe.name, Menu_Crepe.price, Crepe.flavor_profile_id, Crepe.origination_id).join(Crepe).filter(
            Crepe.flavor_profile_id == 'sweet')
        return menu_crepes

    def get_savory_menu_crepes(self, session):
        menu_crepes = session.query(Menu_Crepe.crepe_id, Menu_Crepe.name, Menu_Crepe.price, Crepe.flavor_profile_id, Crepe.origination_id).join(Crepe).filter(
            Crepe.flavor_profile_id == 'savory')
        return menu_crepes
