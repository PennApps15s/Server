from app import db
import json
from marshmallow import Serializer

class UserSerializer(Serializer):
    class Meta:
        fields = (
            'id',
            'name',
            'email',
            'isCritic',
            'bio',
            'criticPublication',
            'highest_review',
            'lowest_review',
            'average_review'
        )

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(120))
    isCritic = db.Column(db.Boolean())
    
    bio = db.Column(db.String(255))
    criticPublication = db.Column(db.String(120))

    highest_review = db.Column(db.Integer)
    lowest_review = db.Column(db.Integer)
    average_review = db.Column(db.Integer)

    def __repr__(self):
        return self.to_json()

    def to_dict(self):
        return UserSerializer(self).data

    def to_json(self):
        return json.dumps(UserSerializer(self).data)

    def to_json_response(self):
        return json.dumps(UserSerializer(self).data), 200, {'Content-Type': 'application/json'}