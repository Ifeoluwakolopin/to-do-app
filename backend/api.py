import os
import jwt
from flask import Blueprint, request, jsonify
from flask import make_response
from functools import wraps
from .models import db, TodoList, TodoItem, User
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash

SECRET_KEY = os.environ.get("SECRET_KEY", "default_secret_key")

# create a blueprint for the main API
main_api = Blueprint("main", __name__)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get("token")
        if not token:
            return jsonify({"message": "Token is missing!"}), 403
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            global current_user
            current_user = db.session.get(User, data["user_id"])
        except:
            return jsonify({"message": "Token is invalid!"}), 403
        return f(*args, **kwargs)

    return decorated


# Get all Todo lists
@main_api.route("/lists", methods=["GET"])
@token_required
def get_all_lists():
    """
    Get all Todo lists
    """
    # get all the lists from the database and serialize them
    lists = [l.serialize() for l in TodoList.query.all(owner_id=current_user.id)]
    return jsonify(lists), 200


@main_api.route("/lists", methods=["POST"])
@token_required
def create_list():
    """
    Create a new Todo list
    """
    # get the data from the request and create a new list
    data = request.json
    new_list = TodoList(title=data["title"], owner_id=current_user.id)
    db.session.add(new_list)
    db.session.commit()
    return jsonify(new_list.serialize()), 201


@main_api.route("/lists/<int:id>", methods=["GET"])
@token_required
def get_list(id):
    """
    Get a specific TODO list by ID
    """
    # get the list with the given ID from the database and serialize it
    todo_list = TodoList.query.get_or_404(id=id, owner_id=current_user.id)
    return jsonify(todo_list.serialize()), 200


@main_api.route("/lists/<int:id>", methods=["PUT"])
@token_required
def update_list(id):
    """
    Update a TODO list by ID
    """
    # get the list with the given ID from the database, update its title, and commit the changes
    todo_list = TodoList.query.get_or_404(id=id, owner_id=current_user.id)
    data = request.json
    todo_list.title = data["title"]
    db.session.commit()
    return jsonify(todo_list.serialize()), 200


@main_api.route("/lists/<int:id>", methods=["DELETE"])
@token_required
def delete_list(id):
    """
    Delete a Todo list by ID
    """
    # get the list with the given ID from the database and delete it
    todo_list = TodoList.query.get_or_404(id=id, owner_id=current_user.id)
    db.session.delete(todo_list)
    db.session.commit()
    return jsonify({"message": "List deleted successfully"}), 200


@main_api.route("/items", methods=["GET"])
@token_required
def get_all_items():
    # get all the items from the database related to the current user and serialize them
    items = [
        i.serialize()
        for i in TodoItem.query.join(TodoList, TodoItem.list_id == TodoList.id).filter(
            TodoList.owner_id == current_user.id
        )
    ]
    return jsonify(items), 200


@main_api.route("/items", methods=["POST"])
@token_required
def create_item():
    data = request.json
    parent_item = (
        TodoItem.query.get(data.get("parent_id")) if data.get("parent_id") else None
    )

    # check depth constraints
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
@token_required
def get_item(id):
    # get the item with the given ID from the database related to the current user and serialize it
    item = (
        TodoItem.query.join(TodoList, TodoItem.list_id == TodoList.id)
        .filter(TodoItem.id == id, TodoList.owner_id == current_user.id)
        .first_or_404()
    )
    return jsonify(item.serialize()), 200


@main_api.route("/items/<int:id>", methods=["PUT"])
@token_required
def update_item(id):
    item = (
        TodoItem.query.join(TodoList, TodoItem.list_id == TodoList.id)
        .filter(TodoItem.id == id, TodoList.owner_id == current_user.id)
        .first_or_404()
    )
    data = request.json

    parent_item = (
        TodoItem.query.get(data.get("parent_id")) if data.get("parent_id") else None
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
@token_required
def delete_item(id):
    item = (
        TodoItem.query.join(TodoList, TodoItem.list_id == TodoList.id)
        .filter(TodoItem.id == id, TodoList.owner_id == current_user.id)
        .first_or_404()
    )
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


@main_api.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data["username"]
    password = data["password"]

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid username or password"}), 401

    # Use Flask-Login to handle session
    login_user(user)

    # Generate a JWT token
    token_payload = {"user_id": user.id, "username": user.username}
    token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")

    # Create a response and set the token as a cookie
    response = make_response(jsonify({"message": "Logged in successfully"}), 200)
    response.set_cookie(
        "token", token, max_age=3600, secure=True, httponly=True, samesite="Lax"
    )

    return response


@main_api.route("/logout", methods=["POST"])
def logout():
    response = make_response(jsonify({"message": "Logged out successfully"}), 200)
    response.delete_cookie("token")
    logout_user()
    return response
