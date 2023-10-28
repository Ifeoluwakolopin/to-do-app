# Hierarchical To-Do List App

## Description
The Hierarchical To-Do List App allows users to create, manage, and organize tasks in a structured manner. Users can create lists and tasks. While lists can contain tasks, tasks can further contain sub-tasks up to a depth of 3, making it perfect for complex projects that require a layered breakdown of tasks.

## How It Works
1. **Lists**: This serves as the highest level of task organization. You can create multiple lists to separate and categorize different projects or areas of your life.
2. **Tasks**: Within each list, you can add tasks. These tasks represent the individual items you need to complete.
3. **Sub-Tasks**: Each task can have sub-tasks up to a depth of 3. This is ideal for breaking down complex tasks into more manageable pieces. For example, a task can be "Prepare for meeting" and its sub-tasks could be "Create presentation", "Research topic", and "Print materials".

## File Structure
```
to-do app/
│
├── backend/           # Contains Flask backend API files
│
├── frontend/          # Contains React frontend components and assets
│
├── tests/             # Contains test cases and testing configurations
│
├── instance/          # Contains instance-specific configurations
│
└── app.py             # Main executable script to run the application
```

## How to Run

To run the Hierarchical To-Do List App, follow these steps:

1. **Pre-requisites**:
    - Ensure you have Python and Node.js installed on your machine.

2. **Starting the Application**:
    - Navigate to the root directory of the project (`to-do app/`).
    - Execute the command `python app.py`. This command will automatically install the required packages for Flask and React, then initialize both the Flask backend and the React frontend.
    - Wait for the startup logs to confirm that both services are running successfully.
    - Open your browser and navigate to the address shown in the logs (`http://127.0.0.1:3000/`) to access the application.

3. **Stopping the Application**:
    - To stop the application, simply go to the terminal where the app is running and press `Ctrl+C`. Note: You might need to manually stop the React frontend process in certain cases.

4. **Starting the Application**:
    - Navigate to the root directory of the project (`to-do app/`).
    - Execute the command `python app.py`. This command will initialize both the Flask backend and the React frontend.
    - Wait for the startup logs to confirm that both services are running successfully.
    - Open your browser and navigate to the address shown in the logs (commonly `http://127.0.0.1:3000/`) to access the application.

5. **Stopping the Application**:
    - To stop the application, simply go to the terminal where the app is running and press `Ctrl+C`.

6. Running Tests:
   - From the top-level directory you can run tests using `python -m unittest discover`