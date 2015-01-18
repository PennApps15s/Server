import os
_basedir = os.path.abspath(os.path.dirname(__file__))

DEBUG = False

# ADMINS = frozenset(['youremail@yourdomain.com'])
# SECRET_KEY = 'This string will be replaced with a proper key in production.'

SQLALCHEMY_DATABASE_URI = "postgresql://localhost/pennapps2015"
DATABASE_CONNECT_OPTIONS = {}

THREADS_PER_PAGE = 8
