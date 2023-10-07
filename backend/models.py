from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    lists = db.relationship("TodoList", backref="owner", lazy="dynamic")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class TodoList(db.Model):
    __tablename__ = "lists"
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    items = db.relationship("TodoItem", backref="list", lazy="dynamic")

class TodoItem(db.Model):
    __tablename__ = "items"
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    
    # Hierarchy: parent-child relationship within items
    parent_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=True)
    children = db.relationship("TodoItem",
                               backref=db.backref("parent", remote_side=[id]),
                               lazy="dynamic")
    
    # Association with a list
    list_id = db.Column(db.Integer, db.ForeignKey('lists.id'), nullable=False)