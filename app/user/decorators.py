from functools import wraps

from flask import g, flash, redirect, url_for, request, session

def requires_login(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        print('checking user')
        from app.user.models import User
        g.user = None
        if 'user' in session:
            user = User.query.get(session['user'])
            if not user:
                return redirect('/login')
            
            g.user = user
            print "Found User"
        else:
            return redirect('/login')     
        return f(*args, **kwargs)
    return decorated_function