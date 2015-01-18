from flask import Blueprint, request, render_template, render_template_string, flash, g, session, redirect, url_for, jsonify
from werkzeug import check_password_hash, generate_password_hash

from app import db
from app.user.models import User
from app.review.models import Review 
from app.user.decorators import requires_login
from app.user.criticList import get_critics

import json
from uuid import uuid4 as random_uuid
import bcrypt

mod = Blueprint('users', __name__, url_prefix='/user')

def gen_session(user):
    token = random_uuid().hex
    user.session = token
    db.session.add(user)
    db.session.commit()
    return token

@mod.route('/', methods=["POST"])
def create_user():
    user = User(
        name=request.form['name'],
        email=request.form['email'],
        password= bcrypt.hashpw( request.form['password'].encode('utf-8'), bcrypt.gensalt() )
    )
    db.session.add(user)
    db.session.commit()

    session['user'] = user.id
    return redirect('/')

@mod.route('/login/', methods=['POST'])
def login():
    user = User.query.filter(User.email == request.form['email'])
    if user.count() != 1:
        return redirect('/login?error=email')
    user = user.all()[0]

    hashed = user.password.encode('utf-8')
    if bcrypt.hashpw(request.form['password'].encode('utf-8'), hashed) == hashed:
        session['user'] = user.id
        return redirect('/')
    else:
        return redirect('/login?error=password')

@mod.route('/', methods=["GET"])
def get_all():
    q = User.query.all()
    result = []
    for item in q:
        result.append(item.to_dict())
    return json.dumps(result), 200, {'Content-Type': 'application/json'}

@mod.route('/<user_id>/', methods=["GET"])
@requires_login
def get_user(user_id):
    if user_id == 'me':
        return g.user.to_json_response()

    user = User.query.get(user_id)
    if not user:
        return "User not found", 404

    return user.to_json_response()

@mod.route('/<user_id>/reviews', methods=["GET"])
@requires_login
def get_user_likes(user_id):
    if user_id == 'me':
        user_id = g.user.id

    user = User.query.get(user_id)
    if not user:
        return "User not found", 404

    results = []
    for r in Review.query.filter(Review.userId == user_id).all():
        results.append(r.to_dict())

    return json.dumps(results), 200, {'Content-Type': 'application/json'}

def get_user_shared_likes(user_id):
    user = User.query.get(user_id)
    if not user:
        return "User not found", 404

    sql = """
        SELECT movies.id, "Title", "Year", "Rating", "Poster" FROM reviews
        LEFT JOIN movies ON "movieId"=movies.id
        WHERE "userId" = %s AND "movieId" IN
            (SELECT "movieId" FROM reviews
             WHERE "userId" = %s AND score=1)
        """ % (user_id, g.user.id)

    columns = ['id', 'Title', 'Year', 'Rating', 'Poster']
    result = []
    for row in db.engine.execute(sql):
        data = {}
        for i, cell in enumerate(row):
            data[ columns[i].replace('"', '') ] = cell
        result.append(data)
    return result

def get_user_favorites(user_id):
    user = User.query.get(user_id)
    if not user:
        return "User not found", 404

    sql = """
        SELECT movies.id, "Title", "Year", "Rating", "Poster", "metacriticScore", "reviewBody" FROM reviews
        LEFT JOIN movies ON "movieId"=movies.id
        WHERE "userId" = %s AND "metacriticScore" > 90
            AND "movieId" NOT IN
            (SELECT "movieId" FROM reviews
             WHERE "userId" = %s)
        ORDER BY "metacriticScore" DESC
        LIMIT 18
        """ % (user_id, g.user.id)

    columns = ['id', 'Title', 'Year', 'Rating', 'Poster', 'metacriticScore', 'reviewBody']
    result = []
    for row in db.engine.execute(sql):
        data = {}
        for i, cell in enumerate(row):
            data[ columns[i].replace('"', '') ] = cell
        result.append(data)

    return result

def get_user_recent(user_id):
    user = User.query.get(user_id)
    if not user:
        return "User not found", 404

    sql = """
        SELECT movies.id, "Title", "Year", "Rating", "Poster", "metacriticScore", "reviewBody" FROM reviews
        LEFT JOIN movies ON "movieId"=movies.id
        WHERE "userId" = %s
            AND "movieId" NOT IN
            (SELECT "movieId" FROM reviews
             WHERE "userId" = %s)
        ORDER BY "Year" DESC
        LIMIT 18
        """ % (user_id, g.user.id)

    columns = ['id', 'Title', 'Year', 'Rating', 'Poster', 'metacriticScore', 'reviewBody']
    result = []
    for row in db.engine.execute(sql):
        data = {}
        for i, cell in enumerate(row):
            data[ columns[i].replace('"', '') ] = cell
        result.append(data)

    return result

@mod.route('/<user_id>/template/')
@requires_login
def get_user_template(user_id):
    if user_id == 'me':
        return "Only built for critic templates"
    user = User.query.get(user_id)
    if not user:
        return "User not found", 404

    return render_template('critic.html',
            critic=user,
            similars=get_user_shared_likes(user.id),
            favorites=get_user_favorites(user.id),
            recents=get_user_recent(user.id)
        )

@mod.route('/criticList/', methods=["GET"])
@requires_login
def get_user_critics():
    likes = Review.query.filter(Review.userId == g.user.id).all()
    if len(likes) < 10:
        return "User needs more likes", 409

    results = []
    for r in get_critics(g.user, likes):
        results.append(r)

    if len(results) == 0:
        return "User needs more likes", 409        

    return json.dumps(results), 200, {'Content-Type': 'application/json'}

