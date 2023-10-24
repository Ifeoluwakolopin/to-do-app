import json
from backend import create_app, db
from backend.models import TodoItem, TodoList
from flask_login import current_user


class TestAPI:
    def setup_method(self):
        self.app = create_app("testing")
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

        # Create a user and log them in
        self.user = {"email": "test@example.com", "password": "password"}
        self.client.post("/auth/register", json=self.user)
        response = self.client.post("/auth/login", json=self.user)
        self.access_token = json.loads(response.data)["access_token"]

        # Create a todo list and item for the user
        self.list = TodoList(title="Groceries", owner_id=current_user.id)
        db.session.add(self.list)
        db.session.commit()

        self.item = TodoItem(content="Buy milk", list_id=self.list.id)
        db.session.add(self.item)
        db.session.commit()

    def teardown_method(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_update_item(self):
        # Test updating the content of an item
        new_content = "Buy cheese"
        data = {"content": new_content, "list_id": self.list.id}
        response = self.client.put(
            f"/items/{self.item.id}",
            json=data,
            headers={"Authorization": f"Bearer {self.access_token}"},
        )
        assert response.status_code == 200
        assert json.loads(response.data)["content"] == new_content

        # Test updating the parent of an item
        new_parent = TodoItem(content="Buy bread", list_id=self.list.id)
        db.session.add(new_parent)
        db.session.commit()

        data = {"parent_id": new_parent.id, "list_id": self.list.id}
        response = self.client.put(
            f"/items/{self.item.id}",
            json=data,
            headers={"Authorization": f"Bearer {self.access_token}"},
        )
        assert response.status_code == 200
        assert json.loads(response.data)["parent_id"] == new_parent.id

        # Test trying to move an item to a depth level greater than 3
        grandparent = TodoItem(content="Buy fruit", list_id=self.list.id)
        db.session.add(grandparent)
        db.session.commit()

        parent = TodoItem(
            content="Buy vegetables", list_id=self.list.id, parent_id=grandparent.id
        )
        db.session.add(parent)
        db.session.commit()

        child = TodoItem(
            content="Buy carrots", list_id=self.list.id, parent_id=self.item.id
        )
        db.session.add(child)
        db.session.commit()

        data = {"parent_id": grandparent.id, "list_id": self.list.id}
        response = self.client.put(
            f"/items/{child.id}",
            json=data,
            headers={"Authorization": f"Bearer {self.access_token}"},
        )
        assert response.status_code == 400
        assert (
            json.loads(response.data)["error"]
            == "Cannot move item to this depth level."
        )

        # Test updating an item that doesn't exist
        data = {"content": "Buy eggs", "list_id": self.list.id}
        response = self.client.put(
            "/items/999",
            json=data,
            headers={"Authorization": f"Bearer {self.access_token}"},
        )
        assert response.status_code == 404
        assert json.loads(response.data)["message"] == "Item not found"

        # Test updating an item with an invalid parent_id
        data = {"parent_id": 999, "list_id": self.list.id}
        response = self.client.put(
            f"/items/{self.item.id}",
            json=data,
            headers={"Authorization": f"Bearer {self.access_token}"},
        )
        assert response.status_code == 404
        assert json.loads(response.data)["message"] == "Parent item not found"
