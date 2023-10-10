import unittest
from backend import create_app, db
from backend.models import TodoItem

class TestAPI(unittest.TestCase):

    def setUp(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def test_create_list(self):
        data = {'title': 'Test List'}
        response = self.client.post('/lists', json=data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.get_json()['title'], 'Test List')

    def test_update_item(self):
        with self.app.app_context():
            item = TodoItem(content='Test Item', list_id=1)
            db.session.add(item)
            db.session.commit()

            # Update the item
            data = {'content': 'Updated Item', 'list_id': 2, 'parent_id': None}
            response = self.client.put(f'/items/{item.id}', json=data)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.get_json()['content'], 'Updated Item')
            self.assertEqual(response.get_json()['list_id'], 2)
            self.assertIsNone(response.get_json()['parent_id'])

            # Refresh and Check that the item was updated in the database
            updated_item = db.session.get(TodoItem, item.id)
            db.session.refresh(updated_item)  # Refresh the object to get latest state
            self.assertEqual(updated_item.content, 'Updated Item')
            self.assertEqual(updated_item.list_id, 2)
            self.assertIsNone(updated_item.parent_id)

            # Try to move the item to a parent with too high depth
            parent_item = TodoItem(content='Parent Item', list_id=1)
            db.session.add(parent_item)
            parent_item.depth = 3  # Force-set the depth attribute after adding to the session
            db.session.flush()  # Flush the changes to ensure they are processed

            # Check the parent's depth again after flushing
            self.assertEqual(parent_item.depth, 3)

            data = {'content': 'Updated Item', 'list_id': 2, 'parent_id': parent_item.id}
            response = self.client.put(f'/items/{item.id}', json=data)
            self.assertEqual(response.status_code, 400)
            self.assertEqual(response.get_json()['error'], 'Cannot move item to this depth level.')

            # Ensure parent_id of the item wasn't changed to parent_item's id
            self.assertNotEqual(updated_item.parent_id, parent_item.id)
