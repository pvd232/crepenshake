from models import *
#db, Customer, Order, Order_Drink, Order_Crepe, Order_Side, Crepe_Origination, Crepe_Flavor_Profile, Crepe, Custom_Crepe, Menu_Crepe, Ingredient_Category, Ingredient, Ingredient_Serving_Price, Drink_Type, Drink, Coffee, Milk, Milkshake, Side, Side_Type, Croissant, Ice_Cream, Ice_Cream_Price
import json
from datetime import date

# https://stackoverflow.com/questions/52939176/json-encoder-different-results-for-json-dump-and-json-dumps
# https://stackoverflow.com/questions/12664385/sqlalchemy-metaclass-confusion
# https://www.w3schools.com/python/ref_func_isinstance.asp
# https://stackoverflow.com/questions/5022066/how-to-serialize-sqlalchemy-result-to-json/7032311


def load_json(filename):

    # https://stackoverflow.com/questions/46408051/python-json-load-set-encoding-to-utf-8/46408435#46408435
    with open(filename, encoding='UTF-8') as file:
        jsn = json.load(file)
        file.close()

    return jsn


def create_ingredient_category():

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\ingredient_category.json")

    for item in json_items:
        id = item['id']

        new_ingredient_category = Ingredient_Category(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ingredient_category)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_ingredient():

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\ingredient.json")

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

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\ingredient_serving_size.json")

    for item in json_items:

        id = item['id']

        new_ingredient_serving_size_price = Ingredient_Serving_Size(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ingredient_serving_size_price)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_ingredient_serving_size_price():

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\ingredient_serving_size_price.json")

    for item in json_items:
        ingredient_id = item['ingredient_id']
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

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\crepe_flavor_profile.json")

    for item in json_items:
        id = item['id']
        new_crepe_flavor_profile = Crepe_Flavor_Profile(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_crepe_flavor_profile)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_menu_crepe():
    test_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\menu_crepe.json")

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

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\menu_crepe.json")
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
    test_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\milk.json")

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

    croissant_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\croissant.json")
    ice_cream_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\ice_cream.json")

    for i in range(len(croissant_items)):
        side_type_id = 'pastry'
        side_name_id = 'croissant'
        new_side = Side(side_type_id=side_type_id, side_name_id=side_name_id)
        db.session.add(new_side)
    db.session.commit()

    for i in range(len(ice_cream_items)):
        side_type_id = 'ice_cream'
        side_name_id = 'ice_cream_bowl'
        new_side = Side(side_type_id=side_type_id, side_name_id=side_name_id)
        db.session.add(new_side)
    db.session.commit()

    sides = db.session.query(Side)
    serialized_sides = [x.serialize for x in sides]
    for i in range(len(croissant_items)):
        side = croissant_items[i]
        print("serialized_sides[i]['side_name_id']: %s",
              serialized_sides[i]['side_name_id'])

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
        print("serialized_sides[i]['side_name_id']: %s", serialized_sides[i]['side_name_id'])
        if serialized_sides[i]['side_name_id'] == 'ice_cream_bowl':
            side_id = serialized_sides[i]['id']
            side_flavor = side['flavor_id']
            side_serving_size = side['serving_size_id']
            side_price = side['price']
            new_ice_cream = Ice_Cream_Bowl(
                side_id = side_id, serving_size_id = side_serving_size, flavor_id = side_flavor, price = side_price)

            # After I create the ingredient, I can then add it to my session.
            db.session.add(new_ice_cream)
    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_crepe_origination():

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\crepe_origination.json")

    for item in json_items:
        id = item['id']
        new_crepe_origination = Crepe_Origination(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_crepe_origination)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_drink_category():

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\drink_category.json")

    for item in json_items:
        id = item['id']
        new_drink_category = Drink_Category(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_drink_category)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_drink_serving_size():

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\drink_serving_size.json")

    for item in json_items:

        id = item['id']

        new_drink_serving_size_price = Drink_Serving_Size(id=id)

        # After I create the drink, I can then add it to my session.
        db.session.add(new_drink_serving_size_price)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_coffee_name():

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\coffee_name.json")

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

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\coffee_name_serving_size_price.json")

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

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\coffee_temperature.json")

    for item in json_items:
        id = item['id']

        new_coffee_temperature = Coffee_Temperature(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_coffee_temperature)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_coffee_flavor_syrup():

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\coffee_flavor_syrup.json")

    for item in json_items:
        id = item['id']
        new_coffee_flavor_syrup = Coffee_Flavor_Syrup(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_coffee_flavor_syrup)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_coffee_flavor_syrup_serving_size():

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\coffee_flavor_syrup_serving_size.json")

    for item in json_items:
        id = item['id']
        new_coffee_flavor_syrup = Coffee_Flavor_Syrup_Serving_Size(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_coffee_flavor_syrup)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_coffee_flavor_syrup_serving_size_price():

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\coffee_flavor_syrup_serving_size_price.json")

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

    milkshake_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\milkshake.json")

    non_coffee_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\non_coffee_drinks.json")

    bottled_drink_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\bottled_drinks.json")

    for i in range(len(milkshake_items)):
        drink_category_id = 'milkshake'
        new_drink = Drink(drink_category_id=drink_category_id)
        db.session.add(new_drink)
    db.session.commit()

    for i in range(len(non_coffee_items)):
        drink_category_id = 'non-coffee'
        new_drink = Drink(drink_category_id=drink_category_id)
        db.session.add(new_drink)
    db.session.commit()

    for i in range(len(bottled_drink_items)):
        drink_category_id = 'bottled'
        new_drink = Drink(drink_category_id=drink_category_id)
        db.session.add(new_drink)
    db.session.commit()

    drinks = db.session.query(Drink)
    serialized_drinks = [x.serialize for x in drinks]
    for i in range(len(milkshake_items)):
        item = milkshake_items[i]
        if serialized_drinks[i]["drink_category_id"] == 'milkshake':
            drink_id = serialized_drinks[i]['id']
            name = item['name']
            price = item['price']
            new_milkshake = Milkshake(
                drink_id=drink_id, name=name, price=price)

            # After I create the ingredient, I can then add it to my session.
            db.session.add(new_milkshake)

    # commit the session to my DB.

    drinks = db.session.query(Drink)
    serialized_drinks = [x.serialize for x in drinks]
    for i in range(len(milkshake_items), len(milkshake_items) + len(non_coffee_items)):
        coffeeIndex = i - len(milkshake_items)
        item = non_coffee_items[coffeeIndex]
        if serialized_drinks[i]["drink_category_id"] == 'non-cofee':
            drink_id = serialized_drinks[i]['id']
            name = item['name']
            price = item['price']
            serving_size = item['serving_size']
            new_non_coffee_item = Non_Coffee_Drink(
                drink_id=drink_id, name=name, serving_size=serving_size, price=price)

            # After I create the ingredient, I can then add it to my session.
            db.session.add(new_non_coffee_item)

    drinks = db.session.query(Drink)
    serialized_drinks = [x.serialize for x in drinks]
    for i in range(len(milkshake_items) + len(non_coffee_items), len(serialized_drinks)):
        bottled_drink_index = i - len(milkshake_items) - len(non_coffee_items)
        item = bottled_drink_items[bottled_drink_index]
        if serialized_drinks[i]["drink_category_id"] == 'bottled':
            drink_id = serialized_drinks[i]['id']
            name = item['name']
            price = item['price']
            new_bottled_drink = Bottled_Drink(
                drink_id=drink_id, name=name, price=price)

            # After I create the ingredient, I can then add it to my session.
            db.session.add(new_bottled_drink)
    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_side_type():

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\side_type.json")

    for item in json_items:
        id = item['id']
        new_side_type = Side_Type(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_side_type)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_side_name():

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\side_name.json")

    for item in json_items:
        id = item['id']
        new_side_name = Side_Name(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_side_name)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_ice_cream_serving_size():

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\ice_cream_serving_size.json")

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

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\ice_cream_flavor.json")

    for item in json_items:
        id = item['id']
        new_ice_cream_flavor = Ice_Cream_Flavor(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_ice_cream_flavor)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_coffee_flavor_syrup():

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\coffee_flavor_syrup.json")

    for item in json_items:
        id = item['id']
        new_coffee_flavor_syrup = Coffee_Flavor_Syrup(id=id)

        # After I create the ingredient, I can then add it to my session.
        db.session.add(new_coffee_flavor_syrup)

    # commit the session to my DB.
    db.session.commit()
    db.session.remove()


def create_espresso():

    json_items = load_json(
        r"C:\Users\Peter\VscodeProjects\CrepeNShake\app\static\json\espresso.json")

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


create_everything()
