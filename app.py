import subprocess
import os

from backend import create_app
from backend.models import TodoList

app = create_app()


def install_dependencies():
    """Install necessary dependencies for Flask and React."""

    # Check Flask dependencies by trying to import them (example with TodoList)
    try:
        import TodoList
    except ImportError:
        subprocess.run(["pip", "install", "-r", "backend/requirements.txt"])

    # Check React dependencies
    if not os.path.exists("frontend/node_modules"):
        subprocess.run(["npm", "install"], cwd="frontend/")


def start_frontend():
    """Start the React frontend."""
    subprocess.Popen(["npm", "start"], cwd="frontend/")


if __name__ == "__main__":
    install_dependencies()  # Install all dependencies first
    start_frontend()  # Start the React frontend
    app.run(host="127.0.0.1", port=5000, debug=True)
