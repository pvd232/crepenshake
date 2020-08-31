from models import db, Customer, Order, Order_Drink, Order_Crepe, Order_Side, Crepe_Origination, Crepe_Flavor_Profile, Crepe, Custom_Crepe, Menu_Crepe, Ingredient_Category, Ingredient, Ingredient_Serving_Price, Drink_Type, Drink, Coffee, Milk, Milkshake, Side, Side_Type, Croissant, Ice_Cream, Ice_Cream_Price
import json
from datetime import date

# https://stackoverflow.com/questions/52939176/json-encoder-different-results-for-json-dump-and-json-dumps
# https://stackoverflow.com/questions/12664385/sqlalchemy-metaclass-confusion
# https://www.w3schools.com/python/ref_func_isinstance.asp
# https://stackoverflow.com/questions/5022066/how-to-serialize-sqlalchemy-result-to-json/7032311


def load_json(filename):

    # https://stackoverflow.com/questions/46408051/python-json-load-set-encoding-to-utf-8/46408435#46408435
    with open(filename, encoding='utf-8') as file:
        jsn = json.load(file)
        file.close()

    return jsn


def create_ingredient_category():

    json_items = load_json("ingredient_category.json")

    for item in json_items:
        id = item['id']

        new_ingredient_category = Ingredient_Category(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ingredient_category)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_ingredient():

    json_items = load_json("ingredient.json")

    for item in json_items:
        id = item['id']
        ingredient_category_id = item['ingredient_category_id']

        new_ingredient = Ingredient(id=id,
                                    ingredient_category_id=ingredient_category_id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ingredient)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_ingredient_serving_size_price():

    json_items = load_json("ingredient_serving_price.json")

    for item in json_items:
        ingredient_id = item['ingredient_id']
        serving_size = item['serving_size']
        price = item['price']

        new_ingredient_serving_price = Ingredient_Serving_Price(ingredient_id=ingredient_id,
                                                                serving_size=serving_size, price=price)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ingredient_serving_price)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_crepe_flavor_profile():

    json_items = load_json("crepe_flavor_profile.json")

    for item in json_items:
        id = item['id']
        new_crepe_flavor_profile = Crepe_Flavor_Profile(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_crepe_flavor_profile)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_menu_crepe():
    test_items = load_json("menu_crepe.json")

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

    json_items = load_json("menu_crepe.json")
    crepes = db.session.query(Crepe)
    serialized_crepes = [x.serialize for x in crepes]
    for i in range(len(json_items)):
        item = json_items[i]
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
    test_items = load_json("milk.json")

    for item in test_items:
        id = item['id']

        new_milk = Milk(id=id)

        # After I create the item, I can then add it to my session.
        db.session.add(new_milk)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_croissant():

    json_items = load_json("croissant.json")

    for item in json_items:
        side_id = item['side_id']
        flavor = item['flavor']
        price = item['price']
        new_croissant = Croissant(side_id=side_id, flavor=flavor, price=price)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_croissant)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_crepe_origination():

    json_items = load_json("crepe_origination.json")

    for item in json_items:
        id = item['id']
        new_crepe_origination = Crepe_Origination(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_crepe_origination)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_drink_type():

    json_items = load_json("drink_type.json")

    for item in json_items:
        id = item['id']
        new_drink_type = Drink_Type(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_drink_type)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_drink():

    json_items = load_json("drink.json")

    for item in json_items:
        id = item['id']
        drink_type_id = item['drink_type_id']
        new_drink = Drink(id=id, drink_type_id=drink_type_id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_drink)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_side_type():

    json_items = load_json("side_type.json")

    for item in json_items:
        id = item['id']
        new_side_type = Side_Type(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_side_type)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_side():

    json_items = load_json("side.json")

    for item in json_items:
        id = item['id']
        side_type_id = item['side_type_id']
        new_side = Side(id=id, side_type_id=side_type_id)
        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_side)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_ice_cream():

    json_items = load_json("ice_cream.json")

    for item in json_items:
        side_id = item['side_id']
        flavor = item['flavor']
        serving_size = item['serving_size']
        topping = item['topping']
        new_ice_cream = Ice_Cream(
            side_id=side_id, flavor=flavor, serving_size=serving_size, topping=topping)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ice_cream)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_ice_cream_price():

    json_items = load_json("ice_cream_price.json")

    for item in json_items:

        serving_size = item['serving_size']
        topping = item['topping']
        price = item['price']
        new_ice_cream_price = Ice_Cream_Price(
            serving_size=serving_size, topping=topping, price=price)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ice_cream_price)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_everything():
    create_ingredient_category()
    create_ingredient()
    create_ingredient_serving_size_price()
    create_crepe_flavor_profile()
    create_drink_type()
    create_drink()
    create_milk()
    create_crepe_origination()
    create_side_type()
    create_side()
    create_croissant()
    create_ice_cream()
    create_ice_cream_price()
    create_menu_crepe()


create_everything()
