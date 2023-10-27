import unittest
from backend import create_app, db
from backend.models import TodoItem, TodoList


class BaseTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app("testing")
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

        self.item2 = TodoItem(
            content="Clean the house", list_id=1, parent_id=self.item1.id
        )
        db.session.add(self.item2)
        db.session.commit()

        self.item3 = TodoItem(content="Do laundry", list_id=1, parent_id=self.item2.id)
        db.session.add(self.item3)
        db.session.commit()

    def test_serialize(self):
        # Use the items created in setUp method for the serialization test
        expected = {
            "id": self.item1.id,
            "content": "Buy groceries",
            "depth": 1,
            "list_id": 1,
            "parent_id": None,
            "is_complete": False,  # Add this line
            "children": [
                {
                    "id": self.item2.id,
                    "content": "Clean the house",
                    "depth": 2,
                    "list_id": 1,
                    "parent_id": self.item1.id,
                    "is_complete": False,  # Add this line
                    "children": [
                        {
                            "id": self.item3.id,
                            "content": "Do laundry",
                            "depth": 3,
                            "list_id": 1,
                            "parent_id": self.item2.id,
                            "is_complete": False,  # Add this line
                            "children": [],
                        }
                    ],
                }
            ],
        }

        self.assertEqual(self.item1.serialize_with_children(), expected)

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

        def test_mark_complete(self):
            # Marking a parent complete should complete all children
            self.item1.mark_complete()
            self.assertTrue(self.item1.is_complete)
            self.assertTrue(self.item2.is_complete)
            self.assertTrue(self.item3.is_complete)

            # Unmarking a child should not affect the parent's completion status
            self.item3.is_complete = False
            self.assertTrue(self.item1.is_complete)

    def test_move_item(self):
        new_list = TodoList(title="New List")
        db.session.add(new_list)
        db.session.commit()

        self.item1.move(new_list.id)
        self.assertEqual(self.item1.list_id, new_list.id)
        self.assertEqual(self.item2.list_id, new_list.id)
        self.assertEqual(self.item3.list_id, new_list.id)


class TestTodoList(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.list1 = TodoList(title="Shopping")
        db.session.add(self.list1)
        db.session.commit()

    def test_serialize(self):
        # Ensure that a list serializes correctly
        expected = {
            "id": self.list1.id,
            "title": "Shopping",
            "items": [],  # Initially, the list has no items
        }
        self.assertEqual(self.list1.serialize(), expected)
