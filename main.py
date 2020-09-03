import os
import json
import time
from flask import request, Response, Flask, render_template, jsonify, send_file, redirect, url_for
from service import Ingredient_Service, Order_Service
from models import Ingredient_Category
from repository import Ingredient_Repository


application = Flask(__name__)
app = application


def humanize(dict):
    str = dict['id']
    frags = str.split('_')
    if len(frags) < 2:
        str = str.capitalize()
        dict['id'] = str
        return dict
    newFrags = []
    for frag in frags:
        frag = frag.capitalize()
        newFrags.append(frag)

    newFrags = " ".join(newFrags)
    print('newFrags', newFrags)
    dict['id'] = newFrags
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
def make_your_own_crepe():

    ingredient_service = Ingredient_Service()
    ingredient_prices = ingredient_service.get_ingredient_prices()
    ingredient_categories = list(
        ingredient_service.get_ingredient_categories())
    rules_for_each_category = ["(2 Servings Max)", "(4 Servings Included, +$0.50 per additional serving)",
                               "(1 Serving Included, Each Extra Serving is +$0.99)", "($0.99 Per Serving)", "($0.50 Per Serving)"]
    # print(ingredient_prices[0].serialize)

    ingredient_prices = [humanize(x)
                         for x in ingredient_prices]
    return render_template('make_your_own_crepe.html', ingredient_prices=ingredient_prices, ingredient_categories=ingredient_categories, rules_for_each_category=rules_for_each_category)


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


@app.route("/static/add_pool", methods=['POST'])
def add_pool():

    pool = {}
    pool['pool_name'] = request.form['poolName']
    pool['status'] = request.form['status']
    pool['phone'] = request.form['phone']
    pool['pool_type'] = request.form['poolType']

    # Insert into database.

    modify_db(pool, post=True)

    return render_template('pool_added.html')


@app.route("/pools")
def get_pools():
    response = {}
    pools = query_data()

    return jsonify(pools)


@app.route("/favicon.ico")
def favicon():
    file_path = cwd = os.getcwd()
    file_name = file_path + "/favicon.ico"
    return send_file(file_name, mimetype='image/vnd.microsoft.icon')


if __name__ == "__main__":
    app.debug = True
    app.run()
