import unittest
from backend import create_app, db
from backend.models import User, TodoItem


class TestAPI(unittest.TestCase):
    def setUp(self):
        self.app = create_app("testing")
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.create_all()

        # Create a test user
        with self.app.app_context():
            user = User(username="testuser")
            user.set_password("testpassword")
            db.session.add(user)
            db.session.commit()

        # Login the user and retrieve the token
        response = self.client.post(
            "/login", json={"username": "testuser", "password": "testpassword"}
        )
        self.token = response.get_json().get("token")

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def test_create_list(self):
        data = {"title": "Test List"}
        headers = {"Authorization": f"Bearer {self.token}"}
        response = self.client.post("/lists", json=data, headers=headers)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.get_json()["title"], "Test List")


def test_update_item(self):
    with self.app.app_context():
        # Setup: Create an initial TodoItem
        item = TodoItem(content="Test Item", list_id=1)
        db.session.add(item)
        db.session.commit()

        headers = {"Authorization": f"Bearer {self.token}"}

        # Test: Update the item and verify the response
        update_data = {"content": "Updated Item", "list_id": 2, "parent_id": None}
        response = self.client.put(
            f"/items/{item.id}", json=update_data, headers=headers
        )
        json_response = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json_response["content"], "Updated Item")
        self.assertEqual(json_response["list_id"], 2)
        self.assertIsNone(json_response["parent_id"])

        # Verify: Item was updated in the database
        updated_item = db.session.get(TodoItem, item.id)
        self.assertEqual(updated_item.content, "Updated Item")
        self.assertEqual(updated_item.list_id, 2)
        self.assertIsNone(updated_item.parent_id)

        # Setup: Create a parent item with a high depth
        parent_item = TodoItem(content="Parent Item", list_id=1)
        parent_item.depth = 3
        db.session.add(parent_item)
        db.session.commit()

        # Test: Attempt to update item with a parent with high depth and verify the response
        high_depth_data = {
            "content": "Updated Item",
            "list_id": 2,
            "parent_id": parent_item.id,
        }
        response = self.client.put(
            f"/items/{item.id}", json=high_depth_data, headers=headers
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.get_json()["error"], "Cannot move item to this depth level."
        )

        # Refresh the item to ensure you're checking the latest data.
        db.session.refresh(item)

        # Ensure: Parent ID of the item remains unchanged after the update attempt
        self.assertNotEqual(item.parent_id, parent_item.id)
