from app import db
import json
from marshmallow import Serializer


class ReviewSerializer(Serializer):
    class Meta:
        fields = (
            'id',
            'userId',
            'movieId',
            'score',
            'metacriticScore',
            'reviewBody',
            'publicationTitle',
            'datePosted',
        )

class Review(db.Model):
    __tablename__ = 'reviews'

    id                  = db.Column(db.Integer, primary_key=True)
    userId              = db.Column(db.Integer)
    movieId             = db.Column(db.Integer)
    score               = db.Column(db.Integer)
    metacriticScore     = db.Column(db.Integer)
    reviewBody          = db.Column(db.Text)
    publicationTitle    = db.Column(db.String(120))
    datePosted          = db.Column(db.String(120))

    def __repr__(self):
        return self.to_json()

    def to_dict(self):
        return ReviewSerializer(self).data

    def to_json(self):
        return json.dumps(ReviewSerializer(self).data)

    def to_json_response(self):
        return json.dumps(ReviewSerializer(self).data), 200, {'Content-Type': 'application/json'}