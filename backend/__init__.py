import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# initialize SQLAlchemy to be used later in the models
db = SQLAlchemy()

# initialize LoginManager
login_manager = LoginManager()


def create_app(config_name="default"):
    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    # configure the database
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite3"

    # set app secret key
    app.secret_key = os.environ.get("SECRET_KEY") or "fallback_secret_key"

    if config_name == "testing":
        app.config["TESTING"] = True
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test_db.sqlite3"

    # initialize the database
    db.init_app(app)

    # initialize LoginManager for the app
    login_manager.init_app(app)

    # import the blueprint and register it on the app
    from .api import main_api

    app.register_blueprint(main_api)

    with app.app_context():
        db.create_all()

    return app
