from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from . import db

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
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    items = db.relationship("TodoItem", backref="list", lazy="dynamic")

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'owner_id': self.owner_id,
            'items': [i.serialize() for i in self.items]
        }
    
class TodoItem(db.Model):
    __tablename__ = "items"
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    depth = db.Column(db.Integer, default=1)  # Depth level of the item in the hierarchy
    list_id = db.Column(db.Integer, db.ForeignKey('lists.id'), nullable=False)  # Always required
    parent_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=True)  # Nullable for top-level items
    children = db.relationship("TodoItem",
                               backref=db.backref("parent", remote_side=[id]),
                               lazy="dynamic")
    
    def serialize(self):
        return {
            'id': self.id,
            'content': self.content,
            'depth': self.depth,
            'list_id': self.list_id,
            'parent_id': self.parent_id,
            'children': [i.serialize() for i in self.children]
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Calculate the depth
        if self.parent_id:
            parent_item = TodoItem.query.get(self.parent_id)
            self.depth = parent_item.depth + 1
        else:
            # This item is directly under a list
            self.depth = 1

    def can_have_children(self):
        return self.depth < 3

    def add_child(self, child):
        if not self.can_have_children():
            raise ValueError("This item has reached the maximum depth and can't have more children.")
        child.parent = self
        child.depth = self.depth + 1