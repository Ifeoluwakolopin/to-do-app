from flask import Flask
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from . import login_manager


class User(UserMixin, db.Model):
    """
    A class representing a user in the to-do app.

    Attributes:
    -----------
    id : int
        The unique identifier for the user.
    username : str
        The username for the user.
    password_hash : str
        The hashed password for the user.
    lists : relationship
        A relationship to the user's to-do lists.

    Methods:
    --------
    set_password(password: str) -> None:
        Sets the password hash for the user.
    check_password(password: str) -> bool:
        Checks if the provided password matches the user's password hash.
    """

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    lists = db.relationship("TodoList", backref="owner", lazy="dynamic")

    def set_password(self, password):
        """
        Set the password hash for the user.

        Parameters:
        password (str): The password to hash and store.

        Returns:
        None
        """
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """
        Check if the provided password matches the user's password hash.

        Args:
            password (str): The password to check.

        Returns:
            bool: True if the password matches, False otherwise.
        """
        return check_password_hash(self.password_hash, password)


@login_manager.user_loader
def load_user(user_id):
    """
    Load a user by ID.

    Args:
        user_id (str): The ID of the user.

    Returns:
        User: The user with the specified ID or None if not found.
    """
    return User.query.get(int(user_id))


class TodoList(db.Model):
    """
    A class representing a to-do list.

    Attributes:
    -----------
    id : int
        The unique identifier for the to-do list.
    title : str
        The title of the to-do list.
    owner_id : int
        The unique identifier of the user who owns the to-do list.
    items : list
        A list of TodoItem objects associated with the to-do list.

    Methods:
    --------
    serialize()
        Returns a dictionary representation of the to-do list object.
    """

    __tablename__ = "lists"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    items = db.relationship("TodoItem", backref="list", lazy="dynamic")

    def serialize(self):
        """
        Serializes the model instance into a dictionary.

        Returns:
            A dictionary containing the serialized model instance.
        """
        return {
            "id": self.id,
            "title": self.title,
            "owner_id": self.owner_id,
            "items": [i.serialize() for i in self.items],
        }


class TodoItem(db.Model):
    """
    A class representing a to-do item in the application.

    Attributes:
    -----------
    id : int
        The unique identifier for the to-do item.
    content : str
        The content of the to-do item.
    depth : int
        The depth level of the to-do item in the hierarchy.
    list_id : int
        The unique identifier of the to-do list the item belongs to.
    parent_id : int
        The unique identifier of the parent item.
    children : list
        A list of TodoItem objects that are children of the item.

    Methods:
    --------
    serialize()
        Returns a dictionary representation of the to-do item.
    can_have_children()
        Returns a boolean indicating whether the to-do item can have children.
    add_child(child: TodoItem)
        Adds a child to the to-do item.
    """

    __tablename__ = "items"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    depth = db.Column(db.Integer, default=1)
    list_id = db.Column(db.Integer, db.ForeignKey("lists.id"), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey("items.id"), nullable=True)

    # Explicit parent-child relationships
    children = db.relationship(
        "TodoItem", backref=db.backref("parent", remote_side=[id])
    )

    def serialize(self):
        """
        Returns a dictionary representation of the to-do item.
        """
        return {
            "id": self.id,
            "content": self.content,
            "depth": self.depth,
            "list_id": self.list_id,
            "parent_id": self.parent_id,
            "children": [i.serialize() for i in self.children],
        }

    def __init__(self, *args, **kwargs):
        """
        Initializes a new to-do item instance.
        """

        parent_id = kwargs.get("parent_id", None)
        if parent_id:
            parent = db.session.get(TodoItem, parent_id)
            if not parent:
                raise ValueError("Invalid parent_id provided")
            if parent.depth >= 3:
                raise ValueError("Cannot create an item at this depth level.")
            self.depth = parent.depth + 1
        else:
            self.depth = 1

        super(TodoItem, self).__init__(*args, **kwargs)

    def can_have_children(self):
        """
        Returns a boolean indicating whether the to-do item can have children.
        """
        return self.depth < 3

    def add_child(self, child):
        """
        Adds a child to the to-do item.
        """
        if not self.can_have_children():
            raise ValueError(
                "This item has reached the maximum depth and can't have more children."
            )
        child.parent = self
        child.parent_id = self.id
        child.depth = self.depth + 1
