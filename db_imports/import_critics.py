import json
import logging
from app import db
from app.user.models import User

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

def add_user(name, criticPublication=None,
        highest_review=None, lowest_review=None,
        average_review=None, session=None,
        bio=None, email=None,
        password=None, isCritic=True):
    logging.debug('Adding user: ' + name)

    user = User(
            name = name,
            email = email,
            password = password,
            isCritic = isCritic,
            bio = bio,
            criticPublication = criticPublication,
            session = session,
            highest_review = highest_review,
            lowest_review = lowest_review,
            average_review = average_review 
        )

    db.session.add(user)
    db.session.commit()

def import_json_file(filename):
    json_data=open(filename)
    data = json.load(json_data)
    for critic in data:
        if critic:
            add_user(
                critic['critic_name'],
                criticPublication = critic['publication_title'],
                highest_review = critic['highest_review_score'],
                lowest_review = critic['lowest_review_score'],
                average_review = critic['average_review_score']
                )
    json_data.close()

import_json_file('db_imports/metacritic_scrape/critics_abcdef.min.json')
import_json_file('db_imports/metacritic_scrape/critics_ghijklmno.min.json')
import_json_file('db_imports/metacritic_scrape/critics_pqrstuvwxyz.min.json')