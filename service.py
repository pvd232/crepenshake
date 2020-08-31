from model import Ingredient_Model
from repository import Ingredient_Repository


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

    # def get_cheap_ingredients(self):
    #     response = []
    #     for ingredient in self.ingredient:
    #         if ingredient.price < 30:
    #             response.append(ingredient)
    #     return response
