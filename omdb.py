from app.movie.models import Movie
from app import db

with open('../omdb.txt') as f:
    lines = f.readlines()
    COLUMNS = lines.pop(0).decode('iso-8859-1').replace('\r', '').replace('\n', '').split('\t')
    count = 0
    for line in lines:
        cols = line.decode('iso-8859-1').split('\t')
        data = {}
        for i, col in enumerate(cols):
            if col == 'N/A' or COLUMNS[i] == 'ID':
                continue;

            if COLUMNS[i] == 'imdbVotes':
                data[COLUMNS[i]] = col.replace(',', '')
            else: 
                data[COLUMNS[i]] = col
        data['id'] = count
        if 'Language' not in data or data['Language'] != 'English' or 'Poster' not in data:
            continue;
        print 'Adding movie', data['Title']
        movie = Movie(**data)
        db.session.add(movie)
        count+=1
    
    db.session.commit()