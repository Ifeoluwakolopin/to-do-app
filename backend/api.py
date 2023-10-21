from flask import Blueprint, request, jsonify
from .models import db, TodoList, TodoItem, User
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash


# create a blueprint for the main API
main_api = Blueprint("main", __name__)


# Get all Todo lists
@main_api.route("/lists", methods=["GET"])
def get_all_lists():
    """Get all TODO lists"""
    # get all the lists from the database and serialize them
    lists = [l.serialize() for l in TodoList.query.all()]
    return jsonify(lists), 200


@main_api.route("/lists", methods=["POST"])
def create_list():
    """Create a new TODO list"""
    # get the data from the request and create a new list
    data = request.json
    new_list = TodoList(title=data["title"], owner_id=data.get("owner_id"))
    db.session.add(new_list)
    db.session.commit()
    return jsonify(new_list.serialize()), 201


@main_api.route("/lists/<int:id>", methods=["GET"])
def get_list(id):
    """Get a specific TODO list by ID"""
    # get the list with the given ID from the database and serialize it
    todo_list = TodoList.query.get_or_404(id)
    return jsonify(todo_list.serialize()), 200


@main_api.route("/lists/<int:id>", methods=["PUT"])
def update_list(id):
    """Update a TODO list by ID"""
    # get the list with the given ID from the database, update its title, and commit the changes
    todo_list = TodoList.query.get_or_404(id)
    data = request.json
    todo_list.title = data["title"]
    db.session.commit()
    return jsonify(todo_list.serialize()), 200


@main_api.route("/lists/<int:id>", methods=["DELETE"])
def delete_list(id):
    """Delete a TODO list by ID"""
    # get the list with the given ID from the database and delete it
    todo_list = TodoList.query.get_or_404(id)
    db.session.delete(todo_list)
    db.session.commit()
    return jsonify({"message": "List deleted successfully"}), 200


# TODO Items
@main_api.route("/items", methods=["GET"])
def get_all_items():
    """Get all TODO items"""
    # get all the items from the database and serialize them
    items = [i.serialize() for i in TodoItem.query.all()]
    return jsonify(items), 200


@main_api.route("/items", methods=["POST"])
def create_item():
    """Create a new TODO item"""
    # get the data from the request and create a new item
    data = request.json
    parent_item = (
        TodoItem.query.get(data.get("parent_id")) if data.get("parent_id") else None
    )

    # check if the maximum depth level has been reached
    if parent_item and parent_item.depth >= 3:
        return (
            jsonify(
                {"error": "Maximum depth level reached. Cannot add more sub-items."}
            ),
            400,
        )

    new_item = TodoItem(
        content=data["content"],
        list_id=data["list_id"],
        parent_id=data.get("parent_id"),
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.serialize()), 201


@main_api.route("/items/<int:id>", methods=["GET"])
def get_item(id):
    """Get a specific TODO item by ID"""
    # get the item with the given ID from the database and serialize it
    item = TodoItem.query.get_or_404(id)
    return jsonify(item.serialize()), 200


@main_api.route("/items/<int:id>", methods=["PUT"])
def update_item(id):
    """
    Update a TODO item by ID.

    Args:
        id (int): The ID of the item to update.

    Returns:
        tuple: A tuple containing the updated item as a JSON object and a status code.
    """
    # get the item with the given ID from the database, update its content and parent item, and commit the changes
    item = TodoItem.query.get_or_404(id)
    data = request.json

    # check if the new parent item violates the depth constraints
    parent_item = (
        db.session.get(TodoItem, data.get("parent_id"))
        if data.get("parent_id")
        else None
    )
    if parent_item and parent_item.depth >= 3:
        return jsonify({"error": "Cannot move item to this depth level."}), 400

    item.content = data["content"]
    item.list_id = data["list_id"]
    item.parent_id = data.get("parent_id")
    if parent_item:
        item.depth = parent_item.depth + 1
    else:
        item.depth = 1

    db.session.commit()
    return jsonify(item.serialize()), 200


@main_api.route("/items/<int:id>", methods=["DELETE"])
def delete_item(id):
    """Delete a Todo item by ID.

    Args:
        id (int): The ID of the Todo item to be deleted.

    Returns:
        tuple: A tuple containing a JSON response and a status code.
            The JSON response contains a message indicating whether the item was deleted successfully or not.
            The status code is 200 if the item was deleted successfully, or an error code otherwise.
    """
    # get the item with the given ID from the database and delete it
    item = db.session.get_or_404(TodoItem, id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item deleted successfully"}), 200


# Signup
@main_api.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data["username"]
    password = data["password"]

    # Check if user already exists
    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({"message": "Username already taken"}), 409

    # Create new user and add to database
    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201


# Login
@main_api.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data["username"]
    password = data["password"]

    # Check user exists and password matches
    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid username or password"}), 401

    # Use Flask-Login to handle session
    login_user(user)
    return jsonify({"message": "Logged in successfully"}), 200


# Logout
@main_api.route("/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200
