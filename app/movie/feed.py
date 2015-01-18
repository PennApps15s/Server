from app import db

COLUMNS_FOR_FEED = ['id', '"Title"', '"imdbRating"', '"Poster"', '"Year"', '"Rating"']
UNIVERSAL_FILTERS = '''
        movies."Rating" IN (
            'G', 'PG', 'PG-13', 'R', 'TV-PG'
        )
        AND (movies."Year" > 2004)
        AND (movies."imdbRating" > 5)
        AND (movies."Genre" NOT LIKE 'Documentary, Music')
    '''

def get_feed(user):
    most_voted_results = db.engine.execute('''
        SELECT ''' + ', '.join(COLUMNS_FOR_FEED) + '''
        FROM movies 
        WHERE ''' + UNIVERSAL_FILTERS + '''
        AND movies.id NOT IN (
            SELECT reviews."movieId" 
            FROM reviews 
            WHERE reviews."userId" = ''' + str(user.id) + '''
        )
        ORDER BY movies."imdbVotes" DESC
        LIMIT 12
    ''')

    highest_rated_results = db.engine.execute('''
        SELECT ''' + ', '.join(COLUMNS_FOR_FEED) + '''
        FROM movies 
        WHERE ''' + UNIVERSAL_FILTERS + '''
        AND movies.id NOT IN (
            SELECT reviews."movieId" 
            FROM reviews 
            WHERE reviews."userId" = ''' + str(user.id) + '''
        )
        ORDER BY movies."imdbRating" DESC
        LIMIT 12
    ''')

    feed_movies = []
    for row in most_voted_results:
        data = {}
        for i, cell in enumerate(row):
            data[COLUMNS_FOR_FEED[i].replace('"', '')] = cell
        feed_movies.append(data)
    for row in highest_rated_results:
        data = {}
        for i, cell in enumerate(row):
            data[COLUMNS_FOR_FEED[i].replace('"', '')] = cell
        feed_movies.append(data)

    return feed_movies