import subprocess
import os
import sys


def is_venv_active():
    """Check if the virtual environment named '.venv' is active."""
    # The VIRTUAL_ENV environment variable is set when a virtual environment is active
    venv_path = os.getenv("VIRTUAL_ENV")

    # Check if VIRTUAL_ENV is set and if it points to the .venv directory
    return venv_path and os.path.basename(venv_path) == ".venv"


def create_and_activate_virtualenv():
    """Create a new virtual environment called '.venv' and activate it."""
    venv_path = os.path.join(os.getcwd(), ".venv")

    if not os.path.exists(venv_path):
        print("Creating a new virtual environment named '.venv'.")
        subprocess.run([sys.executable, "-m", "venv", venv_path])

    # Activate the virtual environment
    if os.name == "nt":  # Windows
        print("Activating the virtual environment for Windows.")
        subprocess.run([".\.venv\Scripts\activate"], shell=True)
    else:  # macOS, Linux, etc.
        print("Activating the virtual environment.")
        os.system(f"source {venv_path}/bin/activate")


def install_dependencies():
    """Install necessary dependencies for Flask and React."""
    # Check Flask dependencies by trying to import them (example with TodoList)
    try:
        import TodoList
    except ImportError:
        print("Installing Flask dependencies from backend/requirements.txt.")
        subprocess.run(["pip", "install", "-r", "backend/requirements.txt"])

    # Check React dependencies
    if not os.path.exists("frontend/node_modules"):
        print("Installing React dependencies.")
        subprocess.run(["npm", "install"], cwd="frontend/")


def start_frontend():
    """Start the React frontend."""
    subprocess.Popen(["npm", "start"], cwd="frontend/")


if __name__ == "__main__":
    if not is_venv_active():
        create_and_activate_virtualenv()  # Set up virtual environment if not active
    else:
        print("Virtual environment '.venv' is already active.")

    install_dependencies()  # Install all dependencies

    from backend import create_app
    from backend.models import TodoList

    app = create_app()
    start_frontend()  # Start the React frontend
    app.run(host="127.0.0.1", port=5000, debug=True)
