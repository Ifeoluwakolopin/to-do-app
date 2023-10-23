import os
from flask import Blueprint, request, jsonify
from .models import db, TodoList, TodoItem, User
from flask_login import login_user, logout_user, login_required, current_user

# create a blueprint for the main API
main_api = Blueprint("main", __name__)


# Get all Todo lists
@main_api.route("/lists", methods=["GET"])
@login_required
def get_all_lists():
    lists = [
        l.serialize() for l in TodoList.query.filter_by(owner_id=current_user.id).all()
    ]
    return jsonify(lists), 200


@main_api.route("/add_list", methods=["POST"])
@login_required
def add_list():
    data = request.json
    new_list = TodoList(title=data["title"], owner_id=current_user.id)
    db.session.add(new_list)
    db.session.commit()
    return jsonify(new_list.serialize()), 201


@main_api.route("/lists/<int:id>", methods=["GET"])
@login_required
def get_list(id):
    todo_list = TodoList.query.get_or_404(id=id, owner_id=current_user.id)
    return jsonify(todo_list.serialize()), 200


@main_api.route("/edit_list/<int:id>", methods=["PUT"])
@login_required
def edit_list(id):
    todo_list = TodoList.query.filter_by(id=id, owner_id=current_user.id).first_or_404()
    data = request.json
    todo_list.title = data["title"]
    db.session.commit()
    return jsonify(todo_list.serialize()), 200


@main_api.route("/delete_list/<int:id>", methods=["DELETE"])
@login_required
def delete_list(id):
    todo_list = TodoList.query.get_or_404(id=id, owner_id=current_user.id)
    db.session.delete(todo_list)
    db.session.commit()
    return jsonify({"message": "List deleted successfully"}), 200


@main_api.route("/items", methods=["GET"])
@login_required
def get_all_items():
    items = [
        i.serialize()
        for i in TodoItem.query.join(TodoList, TodoItem.list_id == TodoList.id).filter(
            TodoList.owner_id == current_user.id
        )
    ]
    return jsonify(items), 200


@main_api.route("/items", methods=["POST"])
@login_required
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
@login_required
def get_item(id):
    # get the item with the given ID from the database related to the current user and serialize it
    item = (
        TodoItem.query.join(TodoList, TodoItem.list_id == TodoList.id)
        .filter(TodoItem.id == id, TodoList.owner_id == current_user.id)
        .first_or_404()
    )
    return jsonify(item.serialize()), 200


@main_api.route("/items/<int:id>", methods=["PUT"])
@login_required
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
@login_required
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

    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({"message": "Username already taken"}), 409

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

    login_user(user)
    return jsonify({"message": "Logged in successfully"}), 200


@main_api.route("/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200
