from models import *
import json
from datetime import date
from pathlib import Path
# https://stackoverflow.com/questions/52939176/json-encoder-different-results-for-json-dump-and-json-dumps
# https://stackoverflow.com/questions/12664385/sqlalchemy-metaclass-confusion
# https://www.w3schools.com/python/ref_func_isinstance.asp
# https://stackoverflow.com/questions/5022066/how-to-serialize-sqlalchemy-result-to-json/7032311

cwd = os.getcwd()

def load_json(filename):

    # https://stackoverflow.com/questions/46408051/python-json-load-set-encoding-to-utf-8/46408435#46408435
    with open(filename, encoding='UTF-8') as file:
        jsn = json.load(file)
        file.close()

    return jsn


def create_ingredient_category():
    
    
    file_path = Path(cwd+'/static/json/ingredient_category.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']

        new_ingredient_category = Ingredient_Category(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ingredient_category)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_ingredient():
    cwd = os.getcwd()
    file_path = Path(cwd+'/static/json/ingredient.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']
        ingredient_category_id = item['ingredient_category_id']
        ingredient_flavor_profile_id = item['ingredient_flavor_profile_id']

        new_ingredient = Ingredient(id=id,
                                    ingredient_category_id=ingredient_category_id, ingredient_flavor_profile_id=ingredient_flavor_profile_id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ingredient)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_ingredient_serving_size():
    file_path = Path(cwd+'/static/json/ingredient_serving_size.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']

        new_ingredient_serving_size_price = Ingredient_Serving_Size(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ingredient_serving_size_price)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_ingredient_serving_size_price():
    file_path = Path(cwd+'/static/json/ingredient_serving_size_price.json')
    json_items = load_json(file_path)

    for item in json_items:
        ingredient_id =item['ingredient_id']
        serving_size = item['serving_size']
        price = item['price']

        new_ingredient_serving_price = Ingredient_Serving_Size_Price(ingredient_id=ingredient_id,
                                                                     serving_size=serving_size, price=price)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ingredient_serving_price)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_crepe_flavor_profile():
    file_path = Path(cwd+'/static/json/crepe_flavor_profile.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']
        new_crepe_flavor_profile = Crepe_Flavor_Profile(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_crepe_flavor_profile)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_menu_crepe():
    file_path = Path(cwd+'/static/json/menu_crepe.json')
    test_items = load_json(file_path)

    for i in range(len(test_items)):
        if test_items[i]['name'] == 'happy_crepe':
            flavor_profile_id = 'sweet'
        else:
            flavor_profile_id = 'savory'
        origination_id = 'menu'
        new_crepe = Crepe(origination_id=origination_id,
                          flavor_profile_id=flavor_profile_id)
        db.session.add(new_crepe)
    db.session.commit()
    db.session.remove()
    crepes = db.session.query(Crepe)
    serialized_crepes = [x.serialize for x in crepes]
    for i in range(len(test_items)):
        item = test_items[i]
        crepe_id = serialized_crepes[i]['id']
        name = item['name']
        price = item['price']
        new_menu_crepe = Menu_Crepe(
            crepe_id=crepe_id, name=name, price=price)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_menu_crepe)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_milk():
    file_path = Path(cwd+'/static/json/milk.json')
    test_items = load_json(file_path)

    for item in test_items:
        id = item['id']
        price = item['price']
        new_milk = Milk(id=id, price=price)

        # After I create the item, I can then add it to my session.
        db.session.add(new_milk)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_sides():
    croissant_file_path = Path(cwd+'/static/json/croissant.json')
    ice_cream_bowl_file_path = Path(cwd+'/static/json/ice_cream.json')

    croissant_items = load_json(
        croissant_file_path)
    ice_cream_items = load_json(
        ice_cream_bowl_file_path)

    for i in range(len(croissant_items)):
        side_type_id = 'pastry'
        side_name_id = 'croissant'
        side_id = uuid.uuid4()
        new_side = Side(id=side_id, side_type_id=side_type_id, side_name_id=side_name_id)
        db.session.add(new_side)
    db.session.commit()

    for i in range(len(ice_cream_items)):
        id = uuid.uuid4()
        side_type_id = 'ice_cream'
        side_name_id = 'ice_cream_bowl'
        new_side = Side(id=id, side_type_id=side_type_id, side_name_id=side_name_id)
        db.session.add(new_side)
    db.session.commit()

    sides = db.session.query(Side)
    serialized_sides = [x.serialize for x in sides]
    for i in range(len(croissant_items)):
        side = croissant_items[i]
        if serialized_sides[i]['side_name_id'] == 'croissant':
            id = serialized_sides[i]['id']
            side_flavor = side['flavor_id']
            side_price = side['price']
            new_croissant = Croissant(
                side_id=id, flavor_id=side_flavor, price=side_price)
            # After I create the ingredient, I can then add it to my session.
            db.session.add(new_croissant)

    for i in range(len(croissant_items), len(croissant_items) + len(ice_cream_items)):
        ice_cream_index = i - len(croissant_items)
        side = ice_cream_items[ice_cream_index]
        if serialized_sides[i]['side_name_id'] == 'ice_cream_bowl':
            side_flavor = side['flavor']
            side_serving_size = side['serving_size']
            side_price = side['price']
            new_ice_cream = Ice_Cream_Flavor_Serving_Size_Price(
               serving_size_id = side_serving_size, flavor_id = side_flavor, price = side_price)

            # After I create the ingredient, I can then add it to my session.
            db.session.add(new_ice_cream)
    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_crepe_origination():
    file_path = Path(cwd+'/static/json/crepe_origination.json')
    json_items = load_json(file_path)
    for item in json_items:
        id = item['id']
        new_crepe_origination = Crepe_Origination(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_crepe_origination)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_drink_category():
    file_path = Path(cwd+'/static/json/drink_category.json')

    json_items = load_json(
        file_path)

    for item in json_items:
        id = item['id']
        new_drink_category = Drink_Category(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_drink_category)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_drink_serving_size():
    file_path = Path(cwd+'/static/json/drink_serving_size.json')

    json_items = load_json(file_path)

    for item in json_items:

        id = item['id']

        new_drink_serving_size_price = Drink_Serving_Size(id=id)

        # After I create the drink, I can then add it to my session.
        db.session.add(new_drink_serving_size_price)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_coffee_name():
    file_path = Path(cwd+'/static/json/coffee_name.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']
        new_coffee_name = Coffee_Name(
            id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_coffee_name)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_coffee_name_serving_size_price():
    file_path = Path(cwd+'/static/json/coffee_name_serving_size_price.json')
    json_items = load_json(file_path)
    for item in json_items:
        coffee_name = item['coffee_name']
        serving_size = item['serving_size']
        price = item['price']
        new_coffee_name_serving_size_price = Coffee_Name_Serving_Size_Price(
            coffee_name=coffee_name, serving_size=serving_size, price=price)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_coffee_name_serving_size_price)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_coffee_temperature():
    file_path = Path(cwd+'/static/json/coffee_temperature.json')
    json_items = load_json(file_path)
    for item in json_items:
        id = item['id']
        new_coffee_temperature = Coffee_Temperature(id=id)
        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_coffee_temperature)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_coffee_flavor_syrup():
    file_path = Path(cwd+'/static/json/coffee_flavor_syrup.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']
        new_coffee_flavor_syrup = Coffee_Flavor_Syrup(id=id)
        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_coffee_flavor_syrup)
    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_coffee_flavor_syrup_serving_size():
    file_path = Path(cwd+'/static/json/coffee_flavor_syrup_serving_size.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']
        new_coffee_flavor_syrup = Coffee_Flavor_Syrup_Serving_Size(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_coffee_flavor_syrup)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_coffee_flavor_syrup_serving_size_price():
    file_path = Path(cwd+'/static/json/coffee_flavor_syrup_serving_size_price.json')
    json_items = load_json(file_path)

    for item in json_items:
        coffee_flavor_syrup_id = item['coffee_flavor_syrup_id']
        coffee_flavor_syrup_serving_size_id = item['coffee_flavor_syrup_serving_size_id']
        price = item['price']
        new_coffee_flavor_syrup_serving_size_price = Coffee_Flavor_Syrup_Serving_Size_Price(
            coffee_flavor_syrup_id=coffee_flavor_syrup_id, coffee_flavor_syrup_serving_size_id=coffee_flavor_syrup_serving_size_id, price=price)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_coffee_flavor_syrup_serving_size_price)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_drinks():
    milkshake_file_path = Path(cwd+'/static/json/milkshake.json')
    milkshake_items = load_json(milkshake_file_path)

    non_coffee_drinks_file_path = Path(cwd+'/static/json/non_coffee_drinks.json')
    non_coffee_items = load_json(non_coffee_drinks_file_path)

    bottled_drinks_file_path = Path(cwd+'/static/json/bottled_drinks.json')
    bottled_drink_items = load_json(bottled_drinks_file_path)

    for item in milkshake_items:
        name = item['name']
        price = item['price']
        drink_category_id = 'milkshake'
        id = uuid.uuid4()
        new_drink = Drink(id=id, name=name, price=price, drink_category_id=drink_category_id)
        db.session.add(new_drink)

    for item in non_coffee_items:
        name = item['name']
        price = item['price']
        drink_category_id = 'non-coffee'
        id = uuid.uuid4()
        new_drink = Drink(id=id, name=name, price=price, drink_category_id=drink_category_id)
        db.session.add(new_drink)

    for item in bottled_drink_items:
        name = item['name']
        price = item['price']
        id = uuid.uuid4()
        drink_category_id = 'bottled'
        new_drink = Drink(id=id, name=name, price=price, drink_category_id=drink_category_id)
        db.session.add(new_drink)
    db.session.commit()
    db.session.remove()

def create_side_type():
    file_path = Path(cwd+'/static/json/side_type.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']
        new_side_type = Side_Type(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_side_type)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_side_name():
    file_path = Path(cwd+'/static/json/side_name.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']
        new_side_name = Side_Name(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_side_name)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_ice_cream_serving_size():
    file_path = Path(cwd+'/static/json/ice_cream_serving_size.json')
    json_items = load_json(file_path)

    for item in json_items:

        id = item['id']
        new_ice_cream_serving_size = Ice_Cream_Serving_Size(
            id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ice_cream_serving_size)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_ice_cream_flavor():
    file_path = Path(cwd+'/static/json/ice_cream_flavor.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']
        new_ice_cream_flavor = Ice_Cream_Flavor(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ice_cream_flavor)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_coffee_flavor_syrup():
    file_path = Path(cwd+'/static/json/coffee_flavor_syrup.json')
    json_items = load_json(file_path)

    for item in json_items:
        id = item['id']
        new_coffee_flavor_syrup = Coffee_Flavor_Syrup(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_coffee_flavor_syrup)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_espresso():
    file_path = Path(cwd+'/static/json/espresso.json')
    json_items = load_json(file_path)

    for item in json_items:
        serving_size = item['serving_size']
        price = item['price']
        new_espresso = Espresso(serving_size=serving_size, price=price)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_espresso)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_everything():
    create_ingredient_category()
    create_crepe_flavor_profile()
    create_ingredient()
    create_ingredient_serving_size()
    create_ingredient_serving_size_price()
    create_drink_category()
    create_drink_serving_size()
    create_espresso()
    create_coffee_name()
    create_coffee_flavor_syrup()
    create_coffee_flavor_syrup_serving_size()
    create_coffee_flavor_syrup_serving_size_price()
    create_coffee_name_serving_size_price()
    create_coffee_temperature()
    create_drinks()
    create_milk()
    create_crepe_origination()
    create_side_type()
    create_side_name()
    create_ice_cream_serving_size()
    create_ice_cream_flavor()
    create_sides()
    create_menu_crepe()

try:
    create_everything()
except Exception:
    pass
