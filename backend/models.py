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
    items = db.relationship(
        "TodoItem", backref="list", lazy="dynamic", cascade="all, delete-orphan"
    )

    def serialize(self):
        """
        Serialize the TodoList object.

        Returns:
        --------
        dict
            A dictionary representation of the to-do list object with tasks and their respective sub-tasks.
        """

        # Get all tasks (items without parent_id) associated with this list
        tasks = TodoItem.query.filter_by(list_id=self.id, parent_id=None).all()

        # For each task, get its sub-tasks (items with parent_id) and assign them as children
        for task in tasks:
            task.children = TodoItem.query.filter_by(parent_id=task.id).all()

        # Serialize the list along with its tasks and nested sub-tasks
        serialized_data = {
            "id": self.id,
            "title": self.title,
            "items": [task.serialize_with_children() for task in tasks],
        }

        return serialized_data


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
    is_complete = db.Column(db.Boolean, default=False, nullable=False)
    children = db.relationship(
        "TodoItem",
        backref=db.backref("parent", remote_side=[id]),
        cascade="all, delete-orphan",
    )

    def serialize_with_children(self):
        """
        Returns a dictionary representation of the to-do item including its children.
        """
        serialized_data = {
            "id": self.id,
            "content": self.content,
            "depth": self.depth,
            "list_id": self.list_id,
            "parent_id": self.parent_id,
            "is_complete": self.is_complete,  # Include the is_complete field in the serialized data
        }

        if self.children:
            serialized_data["children"] = [
                child.serialize_with_children() for child in self.children
            ]
        else:
            serialized_data["children"] = []

        return serialized_data

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

    def move(self, new_list_id):
        """
        Moves the current item and all its children to a new list.
        """
        # Update the current item's attributes
        self.list_id = new_list_id
        self.parent_id = None
        self.depth = 1

        # Recursively update all children
        for child in self.children:
            child.update_child_list_and_depth(new_list_id, 2)

    def update_child_list_and_depth(self, new_list_id, new_depth):
        """
        Recursively updates the list_id and depth of the child and its children.
        """
        self.list_id = new_list_id
        self.depth = new_depth

        for grandchild in self.children:
            grandchild.update_child_list_and_depth(new_list_id, new_depth + 1)

    def mark_complete(self):
        """
        Marks the task and possibly its subtasks as complete or incomplete based on conditions.
        """
        # Toggle the current task's completion status
        self.is_complete = not self.is_complete

        # If the task was marked as complete
        if self.is_complete:
            # Recursively mark all children tasks as complete
            for child in self.children:
                if (
                    not child.is_complete
                ):  # Only toggle children that aren't already complete
                    child.mark_complete()

            # Check siblings and if all are complete, set the parent as complete
            # Make sure there's a parent and more than one sibling
            if self.parent and len(self.parent.children) > 1:
                all_siblings_complete = all(
                    sibling.is_complete for sibling in self.parent.children
                )
                if all_siblings_complete:
                    self.parent.is_complete = True
