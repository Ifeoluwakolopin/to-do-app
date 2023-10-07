from flask import Blueprint
from . import db

main = Blueprint('main', __name__)

@main.route('/')
def hello():
    return 'Hello, World!'