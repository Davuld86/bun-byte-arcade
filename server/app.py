#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, make_response, jsonify
from flask_restful import Resource
from difflib import SequenceMatcher

# Local imports
from config import app, db, api
# Add your model imports
from models import *
def fuzzy_search(query, games, threshold=0.4):
    results = []
    for game in games:
        similarity = SequenceMatcher(None, query.lower(), game.title.lower()).ratio()
        if similarity >= threshold:
            results.append(game)
    return results

def add_category(game, category_name):
    check_category = Category.query.filter(Category.name == category_name).first()
    if check_category:
        game.categories.append(check_category)
    elif category_name == '' or category_name==' ':
        pass
    else:
        cate = Category(
            name = category_name
        )
        game.categories.append(cate)
        db.session.add(cate)
    db.session.commit()

class AllGames(Resource):
    def get(self):
        games = Game.query.all()
        return[game.to_dict() for game in games],200
class RecentGames(Resource):
    def get(self):
        games = Game.query.order_by(Game.release_date.desc()).all()
        if games:
            return [game.to_dict() for game in games],200
        return {'error': 'No games found!'}

class GameID(Resource):
    def get(self, game_id):
        game = Game.query.filter(Game.id == game_id).first()
        if game == None:
            return {'error': 'Game not found'}, 404
        if game.playcount == None:
            game.playcount =1
        else:
            game.playcount += 1
        db.session.add(game)
        db.session.commit()
        return (game.to_dict(),200)

    def post(self, game_id):
        json = request.get_json()
        review = Review(
            game_score = json['score'],
            comment = json['comment'],
            user_id = json['user_id'],
            game_id = game_id,
        )
        db.session.add(review)
        game = Game.query.filter(Game.id ==game_id).first()
        temp =[review.game_score for review in game.reviews]
        game.score = int(sum(temp)/len(temp))
        db.session.add(game)
        db.session.commit()
        return review.to_dict(),200

    def patch(self, game_id):
        json = request.get_json()
        category_list = json.pop('categories')

        game = Game.query.filter(Game.id == game_id).first()
        game.categories.clear()
        for attribute in json:
            setattr(game, attribute, json[attribute])
        for category in category_list:
            add_category(game, category)
        db.session.add(game)
        db.session.commit()

    def delete(self, game_id):
        game = Game.query.filter(Game.id == game_id).first()
        db.session.delete(game)
        db.session.commit()
        return '', 204

class UploadGame(Resource):
    def post(self):
        json = request.get_json()

        game = Game(
            title = json['title'],
            description = json['description'],
            thumbnail = json['thumbnail'],
            path = json['path'],
            user_id = json['user_id'],
        )
        for category in json['categories']:
            add_category(game, category)
        db.session.add(game)
        db.session.commit()
        return game.to_dict(),200

class GamesByTitle(Resource):
    def get(self,title):

        games = Game.query.all()
        search = fuzzy_search(title, games)
        if search:
            return [game.to_dict() for game in search],200
        return {'error': 'No games found!'},404

class GamesByCategory(Resource):
    def get(self, category_name):
        game_list = Game.query.join(Game.categories).filter(Category.name == category_name).all()
        if game_list:
            return [game.to_dict() for game in game_list], 200
        else:
            return {'error':'No games with that category found'},404

class ReviewID(Resource):
    def get(self, review_id):
        review = Review.query.filter(Review.id == review_id).first()
        if review:
            return review.to_dict(),200
        return {'error': 'No review found'}, 404

    def delete(self, review_id):
        review = Review.query.filter(Review.id== review_id).first()
        db.session.delete(review)

        game = Game.query.filter(Game.id==review.game_id).first()
        temp =[review.game_score for review in game.reviews]
        if len(temp)==0:
            game.score = 0
        else:
            game.score = int(sum(temp)/len(temp))
        db.session.add(game)
        db.session.commit()
        return '', 204

class CheckSession(Resource):
    def get(self):

        if session['user_id']:
            user = User.query.filter(User.id ==session['user_id']).first()
            if user:
                return user.to_dict(), 200
            else:
                return {'error':'No user found'}, 404
        else:
            return {'error': 'Not logged in'}, 401

class SignUp(Resource):
    def post(self):
        json = request.get_json()
        if User.query.filter_by(username = json['username'].lower()).first():
            return ({'error': 'Username already taken.'}, 401)
        else:
            new_user = User(
                username = json['username'].strip(),
                password_hash = json['password'].strip()
            )
            db.session.add(new_user)
            db.session.commit()
            return new_user.to_dict(),201

class Login(Resource):
    def post(self):
        json = request.get_json()
        user = User.query.filter(User.username == json['username']).first()
        if user == None:
            return {'error': 'Username or Password Incorrect'}, 401
        if user.authenticate(json['password']):
            session['user_id'] = user.id
            return user.to_dict(), 200
        return {'error': 'Username or Password Incorrect'}, 401

class Logout(Resource):
    def delete(self):
            if session.get('user_id') ==None:
                session['user_id'] = None
                return {'error': 'Login first silly'},401
            session['user_id']= None
            return '', 204

class Profile(Resource):
    def get(self, user_id):
        user = User.query.filter_by(id = user_id).first()
        if user:
            return user.to_dict(), 200
        return {'error': 'No bunny found in this burrow'}, 404

    def patch(self,user_id):
        data = request.get_json()
        user = User.query.filter(User.id == user_id).first()
        for attribute in data:
            setattr(user, attribute, data[attribute])
        db.session.add(user)
        db.session.commit()

        return user.to_dict(), 200

    def delete(self, user_id):
        user = User.query.filter_by(id = user_id).first()
        db.session.delete(user)
        db.session.commit()
        return '', 204

class FavoriteGame(Resource):
    def patch(self,user_id,game_id):
        user = User.query.filter(User.id==user_id).first()
        game = Game.query.filter(Game.id==game_id).first()
        check = [game for game in user.favorites if game.id==game_id]
        if check == []:
            user.favorites.append(game)
        else:
            user.favorites.remove(check[0])
        db.session.add(user)
        db.session.commit()

class AllCategories(Resource):
    def get(self):
        categories = Category.query.order_by(Category.name).all()
        if categories:
            return [category.to_dict() for category in categories],200
        else:
            return {'error': 'No categories found'}

# Views go here!
api.add_resource(AllGames, '/all_games')
api.add_resource(GameID, '/game/<int:game_id>/')
api.add_resource(GamesByCategory, '/api/games/<string:category_name>/')
api.add_resource(UploadGame, '/api/upload-game/')
api.add_resource(Login,'/login', endpoint = 'login')
api.add_resource(Logout,'/logout', endpoint ='logout')
api.add_resource(SignUp, '/signup', endpoint = 'signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Profile, '/user/<int:user_id>')
api.add_resource(ReviewID, '/review/<int:review_id>')
api.add_resource(FavoriteGame, '/api/favorite_game/<int:user_id>/<int:game_id>')
api.add_resource(AllCategories, '/api/categories/')
api.add_resource(GamesByTitle, '/api/search/<string:title>')
api.add_resource(RecentGames, '/api/recent_games')
if __name__ == '__main__':
    app.run(port=5555, debug=True)

