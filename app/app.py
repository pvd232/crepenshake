import os
import json
import time
from flask import request, Response, Flask, render_template, jsonify, send_file, redirect, url_for
from service import Ingredient_Service, Order_Service, Drink_Service, Side_Service, Menu_Crepe_Service
from models import Ingredient_Category
from repository import Ingredient_Repository


application = Flask(__name__)

app = application


def humanize(dict=None, attr=None, format=False):
    if format == True:
        for x in dict['ingredients']:
            str = x.__getattribute__(attr)
            frags = str.split('_')
            if len(frags) < 2:
                str = str.capitalize()
                setattr(x, attr, str)
            newFrags = []
            for frag in frags:
                frag = frag.capitalize()
                newFrags.append(frag)
            newFrags = " ".join(newFrags)
            setattr(x, attr, newFrags)
        return dict
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
def order():
    return render_template('order.html')


@app.route('/order/make-your-own-savory-crepe')
def make_your_own_savory_crepe(editOrder=None):
    ingredient_service = Ingredient_Service()
    
    ingredient_prices_by_category = ingredient_service.get_ingredient_prices_by_category()
    new_ingredient_prices_by_category = []
    for x in ingredient_prices_by_category:
        new_ingredient_category_dict = {}
        new_ingredient_category_dict['ingredient_category'] = x['ingredient_category']
        new_ingredient_category_dict['ingredients'] = []
        for y in x['ingredients']:
            new_ingredient_category_dict['ingredients'].append(y.serialize())
        new_ingredient_prices_by_category.append(new_ingredient_category_dict)
        
    print('ingredient_prices_by_category', ingredient_prices_by_category)
    print()
    print("new_ingredient_prices_by_category: %s", new_ingredient_prices_by_category)

    formatted_ingredient_prices_by_category = [humanize(x, 'id', True)
                         for x in ingredient_service.get_ingredient_prices_by_category()]
    for x in formatted_ingredient_prices_by_category:
        print('format', x)
    ingredient_categories = ingredient_service.get_ingredient_categories()
    formatted_ingredient_categories = [humanize(x, 'id') for x in ingredient_service.get_ingredient_categories()]
    ingredient_serving_sizes = [x.serialize() for x in ingredient_service.get_ingredient_serving_sizes()]
    rules_for_each_category = ["(2 Servings Max)", "(4 Servings Included, +$0.50 per additional serving)",
                               "(1 Serving Included, Each Extra Serving is +$0.99)", "($0.99 Per Serving)", "($0.50 Per Serving)"]
    editOrder = request.args.get('editOrder')
    return render_template('make_your_own_savory_crepe.html', formatted_ingredient_prices_by_category = formatted_ingredient_prices_by_category, ingredient_prices_by_category = new_ingredient_prices_by_category, ingredient_categories=ingredient_categories, formatted_ingredient_categories=formatted_ingredient_categories, ingredient_serving_sizes=ingredient_serving_sizes, rules_for_each_category=rules_for_each_category, editOrder=editOrder)


@app.route('/order/make-your-own-sweet-crepe')
def make_your_own_sweet_crepe(editOrder=None):
    ingredient_service = Ingredient_Service()
    sweet_ingredients = ingredient_service.get_sweet_ingredient_prices()
    formatted_sweet_ingredients = [humanize(x, 'id') for x in ingredient_service.get_sweet_ingredient_prices()]
    ingredient_serving_sizes = [
        x.serialize() for x in ingredient_service.get_ingredient_serving_sizes()]
    sweetness_ingredients = [
        x.serialize() for x in ingredient_service.get_sweetness_ingredients()]
    fruit_ingredients = [x.serialize()
                         for x in ingredient_service.get_fruit_ingredients()]
    sweet_ingredient_categories = [
       x.serialize() for x in ingredient_service.get_sweet_ingredient_categories()]
    formatted_sweet_ingredient_categories = [
        humanize(x, 'id') for x in ingredient_service.get_sweet_ingredient_categories()]
    rules_for_each_category = ["(2 Fruit Servings Included, +$0.99 per additional serving)",
                               "(1 Servings Included, +$0.99 per additional serving)"]
    editOrder = request.args.get('editOrder')
    return render_template('build_your_own_sweet_crepe.html', ingredient_serving_sizes=ingredient_serving_sizes, sweet_ingredients = sweet_ingredients, formatted_sweet_ingredients = formatted_sweet_ingredients, sweetness_ingredients = sweetness_ingredients, fruit_ingredients = fruit_ingredients, sweet_ingredient_categories=sweet_ingredient_categories, formatted_sweet_ingredient_categories = formatted_sweet_ingredient_categories, rules_for_each_category=rules_for_each_category, editOrder=editOrder)


@app.route('/order/drink')
def order_drink(editOrder=None):
    drink_service = Drink_Service()

    milkshakes = [humanize(x, "name").serialize()
                  for x in drink_service.get_milkshakes()]
    bottled_drinks = [humanize(x, "name").serialize()
                      for x in drink_service.get_bottled_drinks()]

    drink_categories = [x.serialize()
                        for x in drink_service.get_drink_categories()]
    coffee_syrups = [humanize(x, "coffee_syrup_flavor").serialize()
                     for x in drink_service.get_coffee_syrups()]

    coffee_drinks = [humanize(x, "name").serialize()
                     for x in drink_service.get_coffee_drinks()]
    non_coffee_drinks = [humanize(x, "name").serialize()
                         for x in drink_service.get_non_coffee_drinks()]
    milk_drinks = [humanize(x, "id").serialize()
                   for x in drink_service.get_milk_drinks()]

    coffee_temperatures = [humanize(x, "id").serialize()
                           for x in drink_service.get_coffee_temperature()]
    editOrder = request.args.get('editOrder')
    return render_template('order_drink.html', drink_categories=drink_categories, bottled_drinks=bottled_drinks, milkshakes=milkshakes, coffee_drinks=coffee_drinks, non_coffee_drinks=non_coffee_drinks, milk_drinks=milk_drinks, coffee_syrups=coffee_syrups, editOrder=editOrder, coffee_temperatures=coffee_temperatures)


@app.route('/order/side')
def order_side(editOrder=None):
    side_service = Side_Service()
    ingredient_service = Ingredient_Service()
    croissants = [x.serialize() for x in side_service.get_croissants()]
    formatted_croissants = [humanize(x, 'flavor')
                            for x in side_service.get_croissants()]
    side_names = [x.serialize() for x in side_service.get_side_names()]
    formatted_side_names = [humanize(x, 'side_name_id')
                            for x in side_service.get_side_names()]
    side_types = [x.serialize() for x in side_service.get_side_types()]
    ice_cream_bowls = [x.serialize()
                       for x in side_service.get_ice_cream_bowls()]
    topping_serving_sizes = [
        x.serialize() for x in ingredient_service.get_ingredient_serving_sizes()]
    formatted_ice_cream_bowls = [humanize(x, 'flavor')
                                 for x in side_service.get_ice_cream_bowls()]
    toppings = [x.serialize() for x in ingredient_service.get_sweet_ingredient_prices()]
    formatted_toppings = [humanize(x, 'id')
                          for x in ingredient_service.get_sweet_ingredient_prices()]
    editOrder = request.args.get('editOrder')
    return render_template('order_side.html', croissants=croissants, formatted_croissants=formatted_croissants, side_names=side_names, formatted_side_names=formatted_side_names, side_types=side_types, ice_cream_bowls=ice_cream_bowls, formatted_ice_cream_bowls=formatted_ice_cream_bowls, toppings=toppings, formatted_toppings=formatted_toppings, topping_serving_sizes=topping_serving_sizes, editOrder=editOrder)


@app.route('/order/menu-crepe')
def order_menu_crepe(editOrder=None):
    menu_crepe_service = Menu_Crepe_Service()
    sweet_menu_crepes = [humanize(x, 'name')
                         for x in menu_crepe_service.get_sweet_menu_crepes()]
    savory_menu_crepes = [humanize(x, 'name')
                          for x in menu_crepe_service.get_savory_menu_crepes()]
    editOrder = request.args.get('editOrder')
    return render_template('order_menu_crepe.html', savory_menu_crepes=savory_menu_crepes, sweet_menu_crepes=sweet_menu_crepes, editOrder=editOrder)


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
    app.run(debug=True)
    app.run()
