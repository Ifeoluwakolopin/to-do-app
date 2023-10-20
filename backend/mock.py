import random
from . import db, create_app  # adjust the import as per your directory structure
from .models import (
    User,
    TodoList,
    TodoItem,
)  # adjust the import as per your directory structure
from faker import Faker

fake = Faker()

# Define some settings for the mock data generation
NUM_USERS = 2
MAX_LISTS_PER_USER = 2
MAX_ITEMS_PER_LIST = 2
MAX_SUBITEMS_PER_ITEM = 2
MAX_SUBSUBITEMS_PER_SUBITEM = 2


def create_random_user():
    user = User(
        username=fake.unique.user_name(),
    )
    user.set_password(fake.password())
    return user


def create_random_todo_list(user):
    todo_list = TodoList(title=fake.sentence(nb_words=3), owner_id=user.id)
    return todo_list


def create_random_todo_item(list_id, parent_id=None):
    item = TodoItem(
        content=fake.sentence(nb_words=5), list_id=list_id, parent_id=parent_id
    )
    return item


def populate_db():
    print("Database populated with mock data!")

    # Create random users
    for _ in range(NUM_USERS):
        user = create_random_user()
        db.session.add(user)
        db.session.commit()

        # Create random lists for each user
        for _ in range(random.randint(1, MAX_LISTS_PER_USER)):
            todo_list = create_random_todo_list(user)
            db.session.add(todo_list)
            db.session.commit()

            # Create random items for each list
            for _ in range(random.randint(1, MAX_ITEMS_PER_LIST)):
                item = create_random_todo_item(todo_list.id)
                db.session.add(item)
                db.session.commit()

                # Create random sub-items for each item
                for _ in range(random.randint(1, MAX_SUBITEMS_PER_ITEM)):
                    subitem = create_random_todo_item(todo_list.id, item.id)
                    db.session.add(subitem)
                    db.session.commit()

                    # Create random sub-sub-items for each sub-item
                    for _ in range(random.randint(1, MAX_SUBSUBITEMS_PER_SUBITEM)):
                        subsubitem = create_random_todo_item(todo_list.id, subitem.id)
                        db.session.add(subsubitem)
                        db.session.commit()
