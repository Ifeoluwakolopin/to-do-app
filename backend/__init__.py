from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

# initialize SQLAlchemy to be used later in the models
db = SQLAlchemy()

def create_app():

    app = Flask(__name__)
    CORS(app)

    # configure the database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'

    # initialize the database
    db.init_app(app)

    # import the blueprint and register it on the app
    from .api import main_api
    app.register_blueprint(main_api)

    with app.app_context():
        db.create_all()

    return app
