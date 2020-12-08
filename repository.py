
from models import *
import stripe
from datetime import date
from sqlalchemy import or_
from sqlalchemy.orm import load_only

class Ingredient_Repository(object):

    def get_ingredients(self, session):
        ingredients = session.query(Ingredient)
        return ingredients

    def get_ingredient_prices(self, session):
        ingredient_prices = session.execute("SELECT i.id, i.ingredient_category_id, p.price, p.serving_size FROM ingredient i JOIN ingredient_serving_size_price p on i.id = p.ingredient_id WHERE p.serving_size=:param",
                                            {"param": "regular"})
        return ingredient_prices

    def get_savory_ingredient_categories(self, session):
        ingredient_categories = session.query(
            Ingredient_Category.id).filter(Ingredient_Category.id != 'fruit').filter(Ingredient_Category.id != 'sweetness')
        return ingredient_categories

    def get_sweet_ingredient_prices(self, session):
        sweet_ingredients = session.query(Ingredient_Serving_Size_Price.ingredient_id, Ingredient_Serving_Size_Price.serving_size, Ingredient_Serving_Size_Price.price, Ingredient.ingredient_category_id).join(Ingredient).filter(or_(
            Ingredient.ingredient_category_id == 'fruit', Ingredient.ingredient_category_id == 'sweetness'), Ingredient_Serving_Size_Price.serving_size == 'regular')
        return sweet_ingredients

    def get_sweet_ingredient_categories(self, session):
        ingredient_categories = session.query(
            Ingredient_Category.id).filter(or_(Ingredient_Category.id == 'fruit', Ingredient_Category.id == 'sweetness'))
        return ingredient_categories

    def get_ingredient_serving_sizes(self, session):
        ingredient_serving_sizes = session.query(Ingredient_Serving_Size)
        return ingredient_serving_sizes


class Order_Repository(object):
    def post_stripe_order(self, session, order):
        customer = order['customerData']
        amount = int(order['orderTotal'] * 100)
        customerExistenceBool = False
        if customer:
            confirmCustomerExistence = session.query(Stripe).filter(                
                Stripe.id == customer['stripeId']).first()
            # Lookup the saved card (you can store multiple PaymentMethods on a Customer)
            if confirmCustomerExistence:
                customerExistenceBool = True
                payment_methods = stripe.PaymentMethod.list(                    
                    customer=customer['stripeId'],
                    type='card'
                )

                # Charge the customer and payment method immediately
                payment_intent = stripe.PaymentIntent.create(                    
                    amount=amount,
                    currency='usd',
                    customer=customer['stripeId'],
                    payment_method=payment_methods.data[0].id
                )
                return {'clientSecret': payment_intent['client_secret'], 'customer': customer['stripeId']}
        if not customerExistenceBool:
            customer = stripe.Customer.create()
            new_stripe_id = Stripe(id=customer.id)
            session.add(new_stripe_id)
            amount = int(order['orderTotal'] * 100)
            payment_intent = stripe.PaymentIntent.create(                
                amount=amount,
                customer=customer.id,
                setup_future_usage='off_session',
                currency='usd'
            )
            return {'clientSecret': payment_intent['client_secret'], 'customer': customer.id}

    def post_order(self, session, order):
        customer = order.customer
        user = session.query(Customer).filter(
            Customer.id == customer.id, Customer.stripe_id == customer.stripe_id).first()
        if not user:
            # if the user already exists in the database but for some reason they have been assigned a different stripe id, for example if they deleted their browser cache then they would be assigned a new stripe id even if their email exists in the database already
            user = session.query(Customer).filter(Customer.id == customer.id).first()
        # update stripe customer email because the customer is created with the payment intent when the email has not been harvested yet
        if user and not stripe.Customer.retrieve(user.stripe_id).email:
            stripe.Customer.modify(user.stripe_id, email=user.id)
        # check to make sure the customer doesn't already exist in the database        
        if not user:
            customer = Customer(id=customer.id, stripe_id=customer.stripe_id, first_name=customer.first_name, last_name=customer.last_name,
                                    street=customer.street, city=customer.city, state=customer.state, zipcode=customer.zipcode, country=customer.country)
            session.add(customer)
            new_order = Order(id=order.id, customer_id=customer.id,
                              cost=order.cost, date=order.date, pickup_timestamp = order.pickup_timestamp)
            session.add(new_order)
        else:
            new_order = Order(id=order.id, customer_id=user.id,
                              cost=order.cost, date=order.date, pickup_timestamp = order.pickup_timestamp)
            session.add(new_order)
        if order.order_crepe:
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
        if order.order_drink:
            for i in range(len(order.order_drink.order_drink)):
                drink_to_add = order.order_drink.order_drink[i]
                if drink_to_add.drink_category_id == 'coffee':
                    new_order_coffee = Order_Coffee(id = drink_to_add.id, drink_id=drink_to_add.drink_id, coffee_name_id=drink_to_add.name, serving_size_id=drink_to_add.serving_size,
                                                    temperature_id=drink_to_add.temperature, flavor_syrup_id=drink_to_add.coffee_syrup_flavor,  flavor_syrup_serving_size_id=drink_to_add.coffee_syrup_flavor_serving_size, espresso_serving_size_id=drink_to_add.espresso_serving_size, milk_type_id=drink_to_add.milk_type_id)
                    session.add(new_order_coffee)

                    new_order_drink = Order_Drink(order_id=new_order.id, drink_id=drink_to_add.drink_id,
                                              serving_size=drink_to_add.serving_size, quantity=drink_to_add.quantity)
                else:
                    new_order_drink = Order_Drink(order_id=new_order.id, drink_id=drink_to_add.id,
                                              serving_size=drink_to_add.serving_size, quantity=drink_to_add.quantity)
                    session.add(new_order_drink)

        if order.order_side:
            order_side_list = list()
            for i in range(len(order.order_side.order_side)):
                side_to_add = order.order_side.order_side[i]
                if side_to_add.side_name_id == 'ice_cream_bowl':
                    side_type_id = 'ice_cream'
                    new_side = Side(
                        id=side_to_add.id, side_type_id='ice_cream', side_name_id=side_to_add.side_name_id)
                    session.add(new_side)
                    if len(side_to_add.toppings) > 0:
                        new_ice_cream_order_side = Order_Side(
                            order_id=new_order.id, side_id=side_to_add.id, quantity=side_to_add.quantity)
                        session.add(new_ice_cream_order_side)
                        for topping in side_to_add.toppings:
                            new_ice_cream_bowl = Order_Ice_Cream(side_id=side_to_add.id, order_id=new_order.id, flavor=side_to_add.flavor,
                                                                 serving_size_id=side_to_add.serving_size, topping=topping.id, topping_serving_size=topping.serving_size, quantity=1)
                            session.add(new_ice_cream_bowl)
        return True

    def get_orders(self, session):
        orders = session.query(Order)
        return orders


class Drink_Repository(object):

    def get_drinks(self, session, requested_drink_category_id):
        drinks = session.query(Drink_Name_Serving_Size_Price).filter(
            Drink_Name_Serving_Size_Price.drink_category_id == requested_drink_category_id)
        return drinks

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

    def get_side_types(self, session):
        side_types = session.query(Side_Type)
        return side_types

    def get_side_names(self, session):
        side_names = session.query(Side_Name)
        return side_names

    def get_side_serving_sizes(self, session):
        side_serving_sizes = session.query()

    def get_ice_cream_bowls(self, session):
        ice_cream = session.query(Ice_Cream_Flavor_Serving_Size_Price)
        return ice_cream


class Menu_Crepe_Repository(object):
    def get_sweet_menu_crepes(self, session):
        menu_crepes = session.query(Menu_Crepe.crepe_id, Menu_Crepe.name, Menu_Crepe.price, Crepe.flavor_profile_id, Crepe.origination_id).join(Crepe).filter(
            Crepe.flavor_profile_id == 'sweet')
        return menu_crepes

    def get_savory_menu_crepes(self, session):
        menu_crepes = session.query(Menu_Crepe.crepe_id, Menu_Crepe.name, Menu_Crepe.price, Crepe.flavor_profile_id, Crepe.origination_id).join(Crepe).filter(
            Crepe.flavor_profile_id == 'savory')
        return menu_crepes
