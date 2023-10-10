from backend import create_app
from backend.mock import populate_db

app = create_app()

if not app.config['DB_POPULATED']:
    populate_db()
    app.config['DB_POPULATED'] = True

if __name__ == "__main__":
    app.run(debug=True)