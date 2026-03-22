# AI Task Manager

## Introduction
The AI Task Manager is a powerful tool designed to help users manage tasks efficiently using artificial intelligence. This application allows users to create, update, and manage tasks seamlessly, enhancing productivity.

## Features
- Create, read, update, and delete tasks
- AI recommendations for task prioritization
- User-friendly interface
- Multi-user support
- Detailed reporting

## Installation
To set up the project locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/fmitesh007/AI_TASK_MANAGER.git
   ```
2. Change into the project directory:
   ```
   cd AI_TASK_MANAGER
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage
To start the application, run:
```
npm start
```
Visit `http://localhost:3000` in your browser to access the application.

## API Documentation
### Endpoints

#### 1. Create Task
- **POST** `/api/tasks`
- **Request Body**: 
  ```json
  {
    "title": "Task Title",
    "description": "Task Description",
    "dueDate": "YYYY-MM-DD",
    "priority": "high|medium|low"
  }
  ```
  
#### 2. Get All Tasks
- **GET** `/api/tasks`

#### 3. Update Task
- **PUT** `/api/tasks/:id`
- **Request Body**:
  ```json
  {
    "title": "Updated Task Title",
    "description": "Updated Task Description",
    "dueDate": "YYYY-MM-DD",
    "priority": "high|medium|low"
  }
  ```

#### 4. Delete Task
- **DELETE** `/api/tasks/:id`

## Contributing
We welcome contributions! Please submit a pull request or open an issue to discuss improvements.

## License
This project is licensed under the MIT License.

## Contact Information
For any inquiries, please reach out to [fmitesh007](https://github.com/fmitesh007).