import os
import sys

from jinja2 import Environment, PackageLoader
jinja_env = Environment(loader=PackageLoader('app', 'templates'))

from flask import Flask, render_template, render_template_string, g, request, session, redirect
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('config')
app.secret_key = 'LG]1OWi8UMNC8vAvvSs8zBCu}eTViFX9^P5hyuCOFeod!I`3y5'

db = SQLAlchemy(app) 

@app.errorhandler(404)
def not_found(error):
    return "404 ERROR"

from app.movie.feed import get_feed
from app.user.decorators import requires_login
from app.user.criticList import get_critics
from app.review.models import Review
from app.user.routes import get_user_shared_likes, get_user_favorites, get_user_recent
@app.route('/')
@requires_login
def main():
    # Create empty critic list for now
    print 'logged in!', g.user

    criticList = None
    carousel = jinja_env.get_template('carousel.html')
    critic = jinja_env.get_template('critic.html')

    likes = Review.query.filter(Review.userId == g.user.id).all()
    if len(likes) < 10:
        print("Likes too low")
        criticList = [{'name': '','criticPublication': ''} for i in range(10)]
    else:
        results = []
        for r in get_critics(g.user, likes):
            results.append(r)

        if len(results) == 0:
            print("results 0")
            criticList = [{'name': '','criticPublication': ''} for i in range(10)]
        else:
            criticList = results

    criticTemplate = None
    if len(criticList[0]['name']) > 0:
        criticTemplate = critic.render(
            critic=criticList[0],
            similars=get_user_shared_likes(criticList[0]['id']),
            favorites=get_user_favorites(criticList[0]['id']),
            recents=get_user_recent(criticList[0]['id'])
        )

    return render_template('index.html',
        carousel_template=carousel.render(
            feed=get_feed(g.user)
        ),
        criticList=criticList,
        criticInfo=criticTemplate
    )

@app.route('/login', methods=["GET"])
def login():
    return render_template('login.html')

@app.route('/logout', methods=["GET"])
def logout():
    session['user'] = None
    return redirect('/login')

@app.before_request
def make_user():
    from app.user.models import User
    g.user = None
    print("pre")
    if 'session' in request.headers:
        results = User.query.filter(User.session == request.headers['session'])
        print('results', results, results.all())
        if results.count() == 1:
            g.user = results[0]
            print("found", g.user)
        else:
            print("Error: Duplicate ")


from app.user.routes import mod as usersModule
app.register_blueprint(usersModule)

from app.review.routes import reviews_blueprint
app.register_blueprint(reviews_blueprint)

from app.movie.routes import movies_blueprint
app.register_blueprint(movies_blueprint)

# Later on you'll import the other blueprints the same way:
#from app.comments.views import mod as commentsModule
#from app.posts.views import mod as postsModule
#app.register_blueprint(commentsModule)
#app.register_blueprint(postsModule)