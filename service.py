from model import *
from repository import Ingredient_Repository, Order_Repository
from datetime import date
import uuid


def change_case(str):
    res = [str[0].lower()]
    for c in str[1:]:
        if c in ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'):
            res.append('_')
            res.append(c.lower())
        else:
            res.append(c)

    return ''.join(res)


class Ingredient_Service(object):
    def __init__(self):
        self.ingredient_repository = Ingredient_Repository()
        self.ingredients = self.get_ingredients()

    def get_ingredients(self):
        response = []
        print('yeee', self.ingredient_repository.get_ingredients())
        for ingredient in self.ingredient_repository.get_ingredients():
            ingredient_attributes = ingredient.serialize
            print('ingredient_attributes', ingredient_attributes)
            ingredient_model = Ingredient_Model(
                id=ingredient_attributes['id'], ingredient_category_id=ingredient_attributes['ingredient_category_id'])
            response.append(ingredient_model)
        return response

    def get_ingredient_prices(self):
        response = []
        for ingredient in self.ingredient_repository.get_ingredient_prices():
            ingredient_model = Ingredient_Model(
                id=ingredient['id'], ingredient_category_id=ingredient['ingredient_category_id'], price=ingredient['price'])
            response.append(ingredient_model.serialize())
        return response

    def get_ingredient_categories(self):
        response = []

        for ingredient_category in self.ingredient_repository.get_ingredient_categories():

            ingredient_model = Ingredient_Model(
                ingredient_category_id=ingredient_category.id)
            response.append(ingredient_model.serialize())
            # response.append(ingredient_model.serialize())

        return response


class Order_Service(object):
    def __init__(self):
        self.order_repository = Order_Repository()

    def create_order(self, order):
        customer_data = order['customerData']
        print('order', order)
        new_customer_model = Customer_Model(id=customer_data['email'], first_name=customer_data['firstName'], last_name=customer_data['lastName'],
                                            street=customer_data['address'], city=customer_data['city'], zipcode=customer_data['zip'], state=customer_data['state'], country=customer_data['country'])
        new_order_model = Order_Model(
            id=uuid.uuid4(), customer_id=new_customer_model.id, cost=order['orderTotal'], date=date.today())

        order_crepe_list = None
        order_drink_list = None
        order_side_list = None
        new_model_crepe_list = None

        if 'orderCrepe' in list(order.keys()):
            crepes = order['orderCrepe']
            id_list = []
            for crepe in crepes:
                key = list(crepe.keys())[0]
                order_crepe = crepe[key]
                print('key', key)

                print('order_crepe', order_crepe)
                if order_crepe['customCrepe'] == True:
                    order_crepe['id'] = uuid.uuid4()
                crepe_id = order_crepe['id']
                print('crepePostId', crepe)
                if crepe_id not in id_list:
                    id_list.append(crepe_id)

            print('crepesPost', crepes)
            print('id_list', id_list)
            # order_crepe_list will have the order_crepe_model with the menu crepes and the custom crepes
            order_crepe_list = []
            custom_crepe_model_list = []
            new_model_crepe_list = []
            for aCrepe_id in id_list:

                order_crepe_model = Order_Crepe_Model(
                    order_id=new_order_model.id, crepe_id=aCrepe_id, quantity=0)
                for crepe in crepes:
                    key = list(crepe.keys())[0]
                    order_crepe = crepe[key]
                    crepe_id = order_crepe['id']
                    if crepe_id == aCrepe_id:
                        order_crepe_model.quantity += 1
                order_crepe_list.append(order_crepe_model)
            for crepe in crepes:
                ingredient_id_list = []
                key = list(crepe.keys())[0]
                order_crepe = crepe[key]

                crepe_id = order_crepe['id']
                if order_crepe['customCrepe'] == True:
                    new_crepe_model = Crepe_Model(
                        id=order_crepe['id'], orgination_id='custom', flavor_profile_id=order_crepe['flavorProfile'])
                    new_model_crepe_list.append(new_crepe_model)
                    ingredients = order_crepe['ingredients']
                    print("ingredients", ingredients)
                    for ingredientDictList in ingredients.values():
                        print('ingredientDictList', ingredientDictList)
                        for ingredientDict in ingredientDictList:
                            ingredientName = list(ingredientDict.keys())[
                                0]
                            ingredientQuantity = list(
                                ingredientDict.values())[0]
                            if ingredientName != 'price':
                                custom_crepe = Custom_Crepe_Model(
                                    crepe_id=crepe_id, ingredient_id=change_case(ingredientName), quantity=ingredientQuantity)
                                custom_crepe_model_list.append(custom_crepe)
            print('orderCrepelist', order_crepe_list)
            print('custom_crepe_model_list', custom_crepe_model_list)
            # order_crepe_list.append(custom_crepe)

        if 'order_drink' in list(order.keys()):
            order_drink_list = []
            drinks = order['order_drink']
            id_list = []
            price = 0
            for drink in drinks:
                drink = drink['drink']
                drink_id = drink['id']
                price += float(drink['price'])
                if drink_id not in id_list:
                    id_list.append(drink_id)

            for aDrink_id in id_list:
                order_drink_model = Order_Drink_Model(
                    order_id=new_order_model.id, drink_id=aDrink_id, quantity=0)
                for drink in drinks:
                    drink = drink['drink']
                    drink_id = drink['id']
                    if drink_id == aDrink_id:
                        order_drink_model.quantity += 1
                order_drink_list.append(order_drink_model)

        if 'order_side' in list(order.keys()):
            order_side_list = []
            sides = order['order_side']
            id_list = []
            price = 0
            for side in sides:
                side = side['side']
                side_id = side['id']
                price += float(side['price'])
                if side_id not in id_list:
                    id_list.append(side_id)

            order_side_list = []
            for aSide_id in id_list:
                order_side_model = Order_Side_Model(
                    order_id=new_order_model.id, side_id=aSide_id, quantity=0)
                for side in sides:
                    side = side['side']
                    side_id = side['id']
                    if side_id == aSide_id:
                        order_side_model.quantity += 1
                order_side_list.append(order_side_model)

        self.order_repository.post_order(customer=new_customer_model, order=new_order_model,
                                         order_crepe_list=order_crepe_list, order_drink_list=order_drink_list, order_side_list=order_side_list, custom_crepe_list=custom_crepe_model_list, new_model_crepe_list=new_model_crepe_list)
        # pass in the order side list as a list to the order_side repository because I think making a new DB connection for every order side would be too expensive and lead to poor performance

        # def get_cheap_ingredients(self):
        #     response = []
        #     for ingredient in self.ingredient:
        #         if ingredient.price < 30:
        #             response.append(ingredient)
        #     return response
