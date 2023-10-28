import subprocess
import os
import sys


def get_python_and_pip():
    """Determine the correct python and pip commands for the system."""
    if sys.version_info.major == 3:
        python_cmd = ["python3"]
    else:
        python_cmd = ["python"]

    pip_cmd = python_cmd + ["-m", "pip"]

    return python_cmd, pip_cmd


def is_venv_active():
    """Check if the virtual environment named '.venv' is active."""
    venv_path = os.getenv("VIRTUAL_ENV")
    return venv_path and os.path.basename(venv_path) == ".venv"


def create_and_activate_virtualenv():
    """Create a new virtual environment called '.venv' and activate it."""
    venv_path = os.path.join(os.getcwd(), ".venv")
    python_cmd, _ = get_python_and_pip()

    if not os.path.exists(venv_path):
        print("Creating a new virtual environment named '.venv'.")
        subprocess.run(python_cmd + ["-m", "venv", venv_path])

    if os.name == "nt":  # Windows
        print("Activating the virtual environment for Windows.")
        subprocess.run([".\.venv\Scripts\activate"], shell=True)
    else:  # macOS, Linux, etc.
        print("Activating the virtual environment.")
        os.system(f"source {venv_path}/bin/activate")


def install_dependencies():
    """Install necessary dependencies for Flask and React."""
    python_cmd, pip_cmd = get_python_and_pip()

    try:
        import TodoList
    except ImportError:
        print("Installing Flask dependencies from backend/requirements.txt.")
        subprocess.run(pip_cmd + ["install", "-r", "backend/requirements.txt"])

    if not os.path.exists("frontend/node_modules"):
        print("Installing React dependencies.")
        subprocess.run(["npm", "install"], cwd="frontend/")


def start_frontend():
    """Start the React frontend."""
    subprocess.Popen(["npm", "start"], cwd="frontend/")


if __name__ == "__main__":
    if not is_venv_active():
        create_and_activate_virtualenv()
    else:
        print("Virtual environment '.venv' is already active.")

    install_dependencies()

    from backend import create_app
    from backend.models import TodoList

    app = create_app()
    start_frontend()
    app.run(host="127.0.0.1", port=5000, debug=True)
