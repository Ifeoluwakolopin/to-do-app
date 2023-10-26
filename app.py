from backend import create_app
from backend.models import TodoList

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
