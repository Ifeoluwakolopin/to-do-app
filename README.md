# Hierarchical To-Do List App

## Description
The Hierarchical To-Do List App allows users to create, manage, and organize tasks in a structured manner. Users can create lists and tasks. While lists can contain tasks, tasks can further contain sub-tasks up to a depth of 3, making it perfect for complex projects that require a layered breakdown of tasks.

## How to use
Watch this [demo](https://loom.com/embed/54f94cb551f74f5ba96676df36a948d0) on how to use the app: 

https://github.com/Ifeoluwakolopin/to-do-app/assets/60819380/d4b1226d-6a18-4109-a9dc-d5872d3c7bdd



## How It Works
1. **Lists**: This serves as the highest level of task organization. You can create multiple lists to separate and categorize different projects or areas of your life.
2. **Tasks**: Within each list, you can add tasks. These tasks represent the individual items you need to complete.
3. **Sub-Tasks**: Each task can have sub-tasks up to a depth of 3. This is ideal for breaking down complex tasks into more manageable pieces. For example, a task can be "Prepare for meeting" and its sub-tasks could be "Create presentation", "Research topic", and "Print materials".

## How to Run

To run the Hierarchical To-Do List App, follow these steps:

### 1. **Pre-requisites**:
- Ensure you have Python and Node.js installed on your machine.

### 2. **Starting the Application**:
- Navigate to the root directory of the project (`to-do app/`).
- Execute the command `python app.py`. This command will check for an active virtual environment named `.venv` or create one if it doesn't exist, then install the required packages for Flask and React, and finally initialize both the Flask backend and the React frontend.
- *Watch the terminal to make sure that the script completes successfully, and respond to any of its prompts. You might need to hit enter at some point.*
- Wait for the startup logs to confirm that both services are running successfully.
- Open your browser and navigate to the address shown in the logs (`http://127.0.0.1:3000/`) to access the application.

### Script Not working?

If the script doesn't work, you can manually start the application by following these steps:

- Create and Activate your virtual environment.
- Install the dependencies for the backend by running `pip install -r backend/requirements.txt`.
- Install the dependencies for the frontend by running `npm install` from the `frontend/` directory.
- Start the backend by running `python run.py` from the root level.
- Start the frontend by running `npm start` from the `frontend/` directory.

### 3. **Stopping the Application**:
- To stop the application, simply go to the terminal where the app is running and press `Ctrl+C`. Note: You might need to manually stop the React frontend process in certain cases.

### 4. **Running Tests**:
- From the top-level directory, you can run tests using `python -m unittest discover`.


## File Structure
```
to-do app/
│
├── backend/
│   ├── api.py         # API routes for the backend
│   ├── models.py      # Database models
│   └── requirements.txt # List of dependencies for the backend
│
├── frontend/
│   ├── node_modules/  # Node.js modules and dependencies
│   ├── public/        # Public static files for React frontend
│   ├── src/           # React source code
│   ├── .gitignore     # Specifies intentionally untracked files to ignore
│   ├── package-lock.json # Dependency versions for the frontend
│   ├── package.json   # List of packages and metadata for the frontend
│   └── README.md      # Frontend-specific README
│
├── instance/
│   └── db.sqlite3     # SQLite database for instance-specific data
│
├── tests/
│   ├── test_api.py    # Test cases for the API routes
│   └── test_models.py # Test cases for the database models
│
├── .env               # Environment variables
├── .gitignore         # Specifies intentionally untracked files to ignore
├── app.py             # Main executable script to run the application
└── README.md          # Main README for the entire project
```
