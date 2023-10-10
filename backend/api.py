from flask import Blueprint, request, jsonify
from .models import db, TodoList, TodoItem

main_api = Blueprint('main', __name__)

# TODO Lists
@main_api.route('/lists', methods=['GET'])
def get_all_lists():
    """Get all TODO lists"""
    lists = [l.serialize() for l in TodoList.query.all()]
    return jsonify(lists), 200

@main_api.route('/lists', methods=['POST'])
def create_list():
    """Create a new TODO list"""
    data = request.json
    new_list = TodoList(title=data['title'], owner_id=data.get('owner_id'))
    db.session.add(new_list)
    db.session.commit()
    return jsonify(new_list.serialize()), 201

@main_api.route('/lists/<int:id>', methods=['GET'])
def get_list(id):
    """Get a specific TODO list by ID"""
    todo_list = TodoList.query.get_or_404(id)
    return jsonify(todo_list.serialize()), 200

@main_api.route('/lists/<int:id>', methods=['PUT'])
def update_list(id):
    """Update a TODO list by ID"""
    todo_list = TodoList.query.get_or_404(id)
    data = request.json
    todo_list.title = data['title']
    db.session.commit()
    return jsonify(todo_list.serialize()), 200

@main_api.route('/lists/<int:id>', methods=['DELETE'])
def delete_list(id):
    """Delete a TODO list by ID"""
    todo_list = TodoList.query.get_or_404(id)
    db.session.delete(todo_list)
    db.session.commit()
    return jsonify({"message": "List deleted successfully"}), 200

# TODO Items
@main_api.route('/items', methods=['GET'])
def get_all_items():
    """Get all TODO items"""
    items = [i.serialize() for i in TodoItem.query.all()]
    return jsonify(items), 200

@main_api.route('/items', methods=['POST'])
def create_item():
    """Create a new TODO item"""
    data = request.json
    parent_item = TodoItem.query.get(data.get('parent_id')) if data.get('parent_id') else None
    
    if parent_item and parent_item.depth >= 3:
        return jsonify({"error": "Maximum depth level reached. Cannot add more sub-items."}), 400
    
    new_item = TodoItem(
        content=data['content'], 
        list_id=data['list_id'],
        parent_id=data.get('parent_id')
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.serialize()), 201

@main_api.route('/items/<int:id>', methods=['GET'])
def get_item(id):
    """Get a specific TODO item by ID"""
    item = TodoItem.query.get_or_404(id)
    return jsonify(item.serialize()), 200

@main_api.route('/items/<int:id>', methods=['PUT'])
def update_item(id):
    """Update a TODO item by ID"""
    item = TodoItem.query.get_or_404(id)
    data = request.json

    # Ensure depth constraints are maintained
    parent_item = TodoItem.query.get(data.get('parent_id')) if data.get('parent_id') else None
    if parent_item and parent_item.depth >= 3:
        return jsonify({"error": "Cannot move item to this depth level."}), 400

    item.content = data['content']
    item.list_id = data['list_id']
    item.parent_id = data.get('parent_id')
    if parent_item:
        item.depth = parent_item.depth + 1
    else:
        item.depth = 1
    
    db.session.commit()
    return jsonify(item.serialize()), 200

@main_api.route('/items/<int:id>', methods=['DELETE'])
def delete_item(id):
    """Delete a TODO item by ID"""
    item = TodoItem.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item deleted successfully"}), 200