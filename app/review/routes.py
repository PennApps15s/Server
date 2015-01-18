from flask import Blueprint

from app import db
from app.review.models import Review

reviews_blueprint = Blueprint('reviews', __name__, url_prefix='/review')

@reviews_blueprint.route('/', methods=["POST"])
def create_review():
    review = Review(
            userId = request.json['userId'],
            movieId = request.json['movieId'],
            score = request.json['score'],
            reviewBody = request.json['reviewBody'],
            publicationTitle = request.json['publicationTitle'],
            datePosted = request.json['datePosted']
        )
    db.session.add(review)
    db.session.commit()
    return str(review), 200, {'Content-Type': 'application/json'}