import os
import json
import time
from flask import request, Response, Flask, render_template, jsonify, send_file


application = Flask(__name__)
app = application


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
    print('hey')
    userOrder = request.args.get('userOrder')
    print('userORder', userOrder)
    if userOrder == None:
        return render_template('order.html')

    else:
        return render_template('order.html', userOrder=True)


@app.route('/make-your-own-crepe')
def make_your_own_crepe():
    return render_template('make_your_own_crepe.html')


@app.route('/make-your-own-savory-crepe')
def make_your_own_savory_crepe():
    return render_template('make_your_own_savory_crepe.html')


@app.route('/checkout')
def checkout():
    return render_template('checkout.html')


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
