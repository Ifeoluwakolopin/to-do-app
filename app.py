from backend import create_app
from backend.mock import populate_db
from backend.models import TodoList

app = create_app()

with app.app_context():
    if not TodoList.query.first():
        # No records found, likely an empty database
        populate_db()

if __name__ == "__main__":
    app.run(debug=True)
