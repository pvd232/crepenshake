import os
import json
import stripe
import time
from flask import request, Response, Flask, render_template, jsonify, send_file, redirect, url_for
from service import Ingredient_Service, Order_Service, Drink_Service, Side_Service, Menu_Crepe_Service, Menu_Service, Test_Service
from models import app

stripe.api_key = "sk_test_51HkZexHlxrw6CLurpBUYLk2wI22ALXfuL48F36xoblWPaI6fo6VXV0nZWOqnueBmSiforeOhWUux302KYSGcFfGm00uO8DHx7N"

# @app.before_request
# def before_request():
#     if not request.is_secure:
#         url = request.url.replace("http://", "https://", 1)
#         code = 301
#         return redirect(url, code=code)

@app.route("/")
def home():
    test_service = Test_Service()
    test_service.test_connection()
    return render_template('index.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/team')
def team():
    return render_template('team.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/menu')
def menu():
    menu_service = Menu_Service()
    menu_items = menu_service.get_menu_items()
    rules_for_each_category = ["(2 Servings Max)", "(4 Servings Included, +$0.50 per additional serving)",
                               "(1 Serving Included, Each Extra Serving is +$0.99)", "($0.99 Per Serving)", "($0.50 Per Serving)"]
    return render_template('menu.html', menu_items=menu_items, rules_for_each_category=rules_for_each_category)


@app.route('/order')
def order():
    return render_template('order.html')


@app.route('/order/make-your-own-savory-crepe')
def make_your_own_savory_crepe(editOrder=None):
    ingredient_service = Ingredient_Service()

    savory_ingredient_prices_by_category = ingredient_service.get_savory_ingredient_prices_by_category()
    new_ingredient_prices_by_category = []
    for x in savory_ingredient_prices_by_category:
        new_ingredient_category_dict = {}
        new_ingredient_category_dict['ingredient_category'] = x['ingredient_category']
        new_ingredient_category_dict['ingredients'] = []
        for y in x['ingredients']:
            new_ingredient_category_dict['ingredients'].append(y.serialize())
        new_ingredient_prices_by_category.append(new_ingredient_category_dict)

    savory_ingredient_categories = ingredient_service.get_savory_ingredient_categories()
    ingredient_serving_sizes = [
        x.serialize() for x in ingredient_service.get_ingredient_serving_sizes()]
    rules_for_each_category = ["(2 Servings Max)", "(4 Servings Included, +$0.50 per additional serving)",
                               "(1 Serving Included, Each Extra Serving is +$0.99)", "($0.99 Per Serving)", "($0.50 Per Serving)"]
    editOrder = request.args.get('editOrder')
    return render_template('order_savory_crepe.html', savory_ingredient_prices_by_category=new_ingredient_prices_by_category, savory_ingredient_categories=savory_ingredient_categories, ingredient_serving_sizes=ingredient_serving_sizes, rules_for_each_category=rules_for_each_category, editOrder=editOrder)


@app.route('/order/make-your-own-sweet-crepe')
def make_your_own_sweet_crepe(editOrder=None):
    ingredient_service = Ingredient_Service()
    sweet_ingredients = [x.serialize()
                         for x in ingredient_service.get_sweet_ingredient_prices()]
    ingredient_serving_sizes = [
        x.serialize() for x in ingredient_service.get_ingredient_serving_sizes()]
    sweetness_ingredients = [
        x.serialize() for x in ingredient_service.get_sweetness_ingredients()]
    fruit_ingredients = [x.serialize()
                         for x in ingredient_service.get_fruit_ingredients()]
    sweet_ingredient_categories = [
        x.serialize() for x in ingredient_service.get_sweet_ingredient_categories()]
    rules_for_each_category = ["(2 Fruit Servings Included, +$0.99 per additional serving)",
                               "(1 Servings Included, +$0.99 per additional serving)"]
    editOrder = request.args.get('editOrder')
    return render_template('order_sweet_crepe.html', ingredient_serving_sizes=ingredient_serving_sizes, sweet_ingredients=sweet_ingredients, sweetness_ingredients=sweetness_ingredients, fruit_ingredients=fruit_ingredients, sweet_ingredient_categories=sweet_ingredient_categories, rules_for_each_category=rules_for_each_category, editOrder=editOrder)


@app.route('/order/drink')
def order_drink(editOrder=None):
    drink_service = Drink_Service()
    ingredient_service = Ingredient_Service()

    milkshakes = [x.serialize() for x in drink_service.get_drinks('milkshake')]
    bottled_drinks = [x.serialize()
                      for x in drink_service.get_drinks('bottled')]

    drink_categories = [x.serialize()
                        for x in drink_service.get_drink_categories()]

    coffee_syrups = [x.serialize() for x in drink_service.get_coffee_syrups()]

    coffee_drinks = [x.serialize()
                     for x in drink_service.get_drinks('coffee')]
    non_coffee_drinks = [x.serialize()
                         for x in drink_service.get_drinks('non-coffee')]
    milk_drinks = [x.serialize() for x in drink_service.get_milk_drinks()]

    coffee_temperatures = [x.serialize()
                           for x in drink_service.get_coffee_temperature()]
    serving_sizes = [x.serialize()
                     for x in ingredient_service.get_ingredient_serving_sizes()]
    editOrder = request.args.get('editOrder')
    return render_template('order_drink.html', drink_categories=drink_categories, bottled_drinks=bottled_drinks, milkshakes=milkshakes, coffee_drinks=coffee_drinks, non_coffee_drinks=non_coffee_drinks, milk_drinks=milk_drinks, coffee_syrups=coffee_syrups, coffee_temperatures=coffee_temperatures, serving_sizes=serving_sizes, editOrder=editOrder)


@app.route('/order/side')
def order_side(editOrder=None):
    side_service = Side_Service()
    ingredient_service = Ingredient_Service()

    side_names = [x.serialize() for x in side_service.get_side_names()]
    new_side_name = {}
    new_side_name['side_name_id'] = 'toppings'
    side_names.append(new_side_name)

    side_types = [x.serialize() for x in side_service.get_side_types()]
    ice_cream_bowls = [x.serialize()
                       for x in side_service.get_ice_cream_bowls()]
    topping_serving_sizes = [
        x.serialize() for x in ingredient_service.get_ingredient_serving_sizes()]

    toppings = [x.serialize()
                for x in ingredient_service.get_sweet_ingredient_prices()]
    for topping in toppings:
        topping['side_name_id'] = 'toppings'

    editOrder = request.args.get('editOrder')
    return render_template('order_side.html', side_names=side_names, side_types=side_types, ice_cream_bowls=ice_cream_bowls, toppings=toppings, topping_serving_sizes=topping_serving_sizes, editOrder=editOrder)


@app.route('/order/menu-crepe')
def order_menu_crepe(editOrder=None):
    menu_crepe_service = Menu_Crepe_Service()
    sweet_menu_crepes = [x.serialize()
                         for x in menu_crepe_service.get_sweet_menu_crepes()]

    savory_menu_crepes = [x.serialize()
                          for x in menu_crepe_service.get_savory_menu_crepes()]
    editOrder = request.args.get('editOrder')
    return render_template('order_menu_crepe.html', savory_menu_crepes=savory_menu_crepes, sweet_menu_crepes=sweet_menu_crepes, editOrder=editOrder)


@app.route('/create-payment-intent', methods=['POST'])
def create_payment():
    order = json.loads(request.data)
    order_service = Order_Service()
    return jsonify(order_service.stripe_pay(order))


@app.route('/checkout', methods=['POST', 'GET'])
def checkout():
    if request.method == 'GET':
        return render_template('checkout.html')
    elif request.method == 'POST':
        new_order = request.json
        new_order_value = new_order['order']
        order_service = Order_Service()
        order_service.create_order(new_order_value)
        return jsonify(200)


@app.route('/order/confirmation')
def order_confirmation():
    return render_template('order_confirmation.html')


@app.route("/favicon.ico")
def favicon():
    file_path = cwd = os.getcwd()
    file_name = file_path + "/static/favico/favicon.ico"
    return send_file(file_name, mimetype='image/vnd.microsoft.icon')


if __name__ == "__main__":
    app.run()
