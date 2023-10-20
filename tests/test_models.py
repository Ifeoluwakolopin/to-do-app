import unittest
from backend import create_app, db
from backend.models import TodoItem, TodoList

class BaseTestCase(unittest.TestCase):

    def setUp(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

class TestTodoItem(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.item1 = TodoItem(content="Buy groceries", list_id=1)
        db.session.add(self.item1)
        db.session.commit()

        self.item2 = TodoItem(content="Clean the house", list_id=1, parent_id=self.item1.id)
        db.session.add(self.item2)
        db.session.commit()

        self.item3 = TodoItem(content="Do laundry", list_id=1, parent_id=self.item2.id)
        db.session.add(self.item3)
        db.session.commit()

    def test_serialize(self):
        # Use the items created in setUp method for the serialization test
        expected = {
            'id': self.item1.id,
            'content': 'Buy groceries',
            'depth': 1,
            'list_id': 1,
            'parent_id': None,
            'children': [
                {
                    'id': self.item2.id,
                    'content': 'Clean the house',
                    'depth': 2,
                    'list_id': 1,
                    'parent_id': self.item1.id,
                    'children': [
                        {
                            'id': self.item3.id,
                            'content': 'Do laundry',
                            'depth': 3,
                            'list_id': 1,
                            'parent_id': self.item2.id,
                            'children': []
                        }
                    ]
                }
            ]
        }

        self.assertEqual(self.item1.serialize(), expected)

    def test_can_have_children(self):
        self.assertTrue(self.item1.can_have_children())
        self.assertTrue(self.item2.can_have_children())
        self.assertFalse(self.item3.can_have_children())


    def test_add_child(self):
        child = TodoItem(content="Buy milk", list_id=1)
        self.item1.add_child(child)
        db.session.add(child)  # Ensure the child is added to the session
        db.session.commit()
        self.assertEqual(child.parent_id, self.item1.id)
        self.assertEqual(child.depth, self.item1.depth + 1)
        self.assertIn(child, self.item1.children)



class TestTodoList(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.list1 = TodoList(title="Groceries", owner_id=1)
        self.list2 = TodoList(title="Chores", owner_id=1)
        db.session.add_all([self.list1, self.list2])
        db.session.commit()

    def test_serialize(self):
        expected = {
            'id': self.list1.id,
            'title': 'Groceries',
            'owner_id': 1,
            'items': []
        }
        self.assertEqual(self.list1.serialize(), expected)

    def test_items_relationship(self):
        item1 = TodoItem(content="Buy milk", list_id=self.list1.id)
        item2 = TodoItem(content="Buy eggs", list_id=self.list1.id)
        item3 = TodoItem(content="Vacuum the floor", list_id=self.list2.id)
        db.session.add_all([item1, item2, item3])
        db.session.commit()
        self.assertEqual(self.list1.items.count(), 2)
        self.assertEqual(self.list2.items.count(), 1)
        self.assertIn(item1, self.list1.items.all())
        self.assertIn(item2, self.list1.items.all())
        self.assertIn(item3, self.list2.items.all())