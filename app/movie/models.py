from app import db
import json
from marshmallow import Serializer


class MovieSerializer(Serializer):
    class Meta:
        fields = (
            'id',
            'omdbID',
            'imdbID',
            'Title',
            'Year',
            'Rating',
            'Runtime',
            'Genre',
            'Released',
            'Director',
            'Writer',
            'Cast',
            'Metacritic',
            'imdbRating',
            'imdbVotes',
            'Poster',
            'Plot',
            'FullPlot',
            'Language',
            'Country',
            'Awards',
            'lastUpdated'
        )

class Movie(db.Model):
    __tablename__ = 'movies'
    id              = db.Column(db.Integer, primary_key=True)
    omdbID          = db.Column(db.Integer)
    imdbID          = db.Column(db.Text)
    Title           = db.Column(db.Text)
    Year            = db.Column(db.Integer)
    Rating          = db.Column(db.Text)
    Runtime         = db.Column(db.Text)
    Genre           = db.Column(db.Text)
    Released        = db.Column(db.Text)
    Director        = db.Column(db.Text)
    Writer          = db.Column(db.Text)
    Cast            = db.Column(db.Text)
    Metacritic      = db.Column(db.Integer)
    imdbRating      = db.Column(db.Float)
    imdbVotes       = db.Column(db.Integer)
    Poster          = db.Column(db.Text)
    Plot            = db.Column(db.Text)
    FullPlot        = db.Column(db.Text)
    Language        = db.Column(db.Text)
    Country         = db.Column(db.Text)
    Awards          = db.Column(db.Text)
    lastUpdated     = db.Column(db.Date)


    def __repr__(self):
        return self.to_json()

    def to_dict(self):
        return MovieSerializer(self).data

    def to_json(self):
        return json.dumps(MovieSerializer(self).data)

    def to_json_response(self):
        return json.dumps(MovieSerializer(self).data), 200, {'Content-Type': 'application/json'}