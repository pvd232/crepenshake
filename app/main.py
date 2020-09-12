import os
import json
import time
from flask import request, Response, Flask, render_template, jsonify, send_file, redirect, url_for
from service import Ingredient_Service, Order_Service, Drink_Service, Side_Service
from models import Ingredient_Category
from repository import Ingredient_Repository


application = Flask(__name__)
app = application


def humanize(dict, attr):
    print('dict', dict.serialize())
    str = dict.__getattribute__(attr)

    frags = str.split('_')
    if len(frags) < 2:
        str = str.capitalize()
        setattr(dict, attr, str)
        return dict
    newFrags = []
    for frag in frags:
        frag = frag.capitalize()
        newFrags.append(frag)

    newFrags = " ".join(newFrags)
    print('newFrags', newFrags)
    setattr(dict, attr, newFrags)
    return dict


@app.route("/")
def home():
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
    return render_template('menu.html')


@app.route('/order')
def order(userOrder=None):
    userOrder = request.args.get('userOrder')

    if userOrder == None:
        return render_template('order.html')

    else:
        return render_template('order.html', userOrder=True)


@app.route('/make-your-own-crepe')
def make_your_own_crepe(editOrder=None):
    ingredient_service = Ingredient_Service()
    ingredient_prices = [humanize(x, 'id')
                         for x in ingredient_service.get_ingredient_prices()]

    # for price in ingredient_prices:
    # print('price', price.serialize())
    ingredient_categories = ingredient_service.get_ingredient_categories()

    # print('iCat', ingredient_categories)

    rules_for_each_category = ["(2 Servings Max)", "(4 Servings Included, +$0.50 per additional serving)",
                               "(1 Serving Included, Each Extra Serving is +$0.99)", "($0.99 Per Serving)", "($0.50 Per Serving)"]
    editOrder = request.args.get('editOrder')

    if editOrder == None:
        return render_template('make_your_own_crepe.html', ingredient_prices=ingredient_prices, ingredient_categories=ingredient_categories, rules_for_each_category=rules_for_each_category, editOrder=editOrder)

    else:
        return render_template('make_your_own_crepe.html', ingredient_prices=ingredient_prices, ingredient_categories=ingredient_categories, rules_for_each_category=rules_for_each_category, editOrder=True)

    # print(ingredient_prices[0].serialize)


@app.route('/order-drink')
def order_drink():
    drink_service = Drink_Service()

    milkshakes = [humanize(x, "name") for x in drink_service.get_milkshakes()]
    bottled_drinks = [humanize(x, "name")
                      for x in drink_service.get_bottled_drinks()]

    drink_categories = drink_service.get_drink_categories()
    print("drink_categories", drink_categories)
    coffee_syrups = [humanize(x, "coffee_syrup_flavor")
                     for x in drink_service.get_coffee_syrups()]

    coffee_drinks = [humanize(x, "name")
                     for x in drink_service.get_coffee_drinks()]
    non_coffee_drinks = [humanize(x, "name")
                         for x in drink_service.get_non_coffee_drinks()]
    milk_drinks = [humanize(x, "id") for x in drink_service.get_milk_drinks()]

    return render_template('order_drink.html', drink_categories=drink_categories, bottled_drinks=bottled_drinks, milkshakes=milkshakes, coffee_drinks=coffee_drinks, non_coffee_drinks=non_coffee_drinks, milk_drinks=milk_drinks, coffee_syrups=coffee_syrups)


@app.route('/order-side')
def order_side():
    side_service = Side_Service()
    croissants = [humanize(x, 'flavor') for x in side_service.get_croissants()]
    # formatted_side_names = [humanize(x, 'side_name_id')
    #                         for x in side_service.get_side_names()]

    side_names = side_service.get_side_names()
    ice_cream_prices = [humanize(x, 'flavor')
                        for x in side_service.get_ice_cream_prices()]
    toppings = [humanize(x, 'id')
                for x in side_service.get_toppings()]
    for x in toppings:
        print(x.serialize())

    return render_template('order_side.html', side_names=side_names, croissants=croissants, ice_cream_prices=ice_cream_prices, toppings=toppings)


@app.route('/make-your-own-savory-crepe')
def make_your_own_savory_crepe():
    return render_template('make_your_own_savory_crepe.html')


@app.route('/checkout', methods=['POST', 'GET'])
def checkout():
    if request.method == 'GET':
        return render_template('checkout.html')
    elif request.method == 'POST':
        new_order = request.json

        order_service = Order_Service()
        order_service.create_order(new_order)
        return jsonify(200)


@app.route('/order-confirmation')
def order_confirmation():
    return render_template('order_confirmation.html')


@app.route("/favicon.ico")
def favicon():
    file_path = cwd = os.getcwd()
    file_name = file_path + "/static/favico/favicon.ico"
    return send_file(file_name, mimetype='image/vnd.microsoft.icon')


if __name__ == "__main__":
    app.debug = True
    app.run()
