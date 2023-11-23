from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.sql import func
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime
from config import db, bcrypt

# Models go here!
categories_association = db.Table('categories_association',
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id'), primary_key=True),
    db.Column('game_id', db.Integer, db.ForeignKey('games.id'), primary_key=True)
    )

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-posts.created_by','-reviews.user_reviews', '-favorites.user_favorites','-_password_hash',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable= False)
    pfp = db.Column(db.String, default='../images/default_pfp.jpg')
    created = db.Column(db.DateTime, default = datetime.utcnow)
    bio = db.Column(db.String)
    reviews = db.relationship('Review', backref = 'user_reviews')
    favorites = db.relationship('Favorite', backref = 'user_favorites')
    posts = db.relationship('Game', backref='created_by')
    _password_hash = db.Column(db.String)

    @hybrid_property
    def password_hash(self):
         return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
       return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

class Game(db.Model, SerializerMixin):
    __tablename__ = 'games'

    serialize_rules = ('-created_by.posts','-reviews.reviewed','-favorited_by.game_favorites', '-created_by.reviews', '-created_by.favorites')

    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String)
    description = db.Column(db.String)
    thumbnail = db.Column(db.String)
    path = db.Column(db.String)
    playcount = db.Column(db.Integer, default=0)
    score = db.Column(db.Integer, default =0)
    release_date = db.Column(db.DateTime, default = datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    favorited_by = db.relationship('Favorite', backref='game_favorites')
    reviews = db.relationship('Review', backref='reviewed')
    categories = db.relationship('Category', back_populates='games',secondary=categories_association)

class Review(db.Model, SerializerMixin):

    __tablename__ = 'reviews'

    serialize_rules = ('-user_reviews','-reviewed.reviews.reviewed','-reviewed.created_by' )

    id = db.Column(db.Integer, primary_key=True)
    game_score = db.Column(db.Integer)
    comment_score = db.Column(db.Integer, default=0)
    comment = db.Column(db.String)
    created = db.Column(db.DateTime, default = datetime.utcnow)
    user_id  = db.Column(db.Integer, db.ForeignKey('users.id'))
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))


class Favorite(db.Model, SerializerMixin):
    __tablename__ = 'favorites'

    serialize_rules = ('-user_favorites','-game_favorites.favorited_by.game_favorites','-game_favorites.created_by', '-games_favorites.reviews' '-game_favorites.favorited_by.user_favorites' )

    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer,db.ForeignKey('users.id'))
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'

    serialize_only =('id', 'name')

    id = db.Column(db.Integer, primary_key =True)
    name = db.Column(db.String, unique=True, nullable=False)
    games= db.relationship('Game',secondary=categories_association, back_populates='categories')


