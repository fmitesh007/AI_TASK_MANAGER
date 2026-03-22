# 🤖 AI Task Manager

## 📋 Overview

AI Task Manager is a full-stack backend application designed to help users manage tasks efficiently with the power of AI. It provides robust task management features along with intelligent automation like generating subtasks, rewriting descriptions, and estimating task complexity.

This project combines traditional CRUD operations with AI-powered enhancements to boost productivity and decision-making.

---

## ✨ Features

### 🧩 Core Task Management
- Create, update, delete, and retrieve tasks
- Task prioritization (Low, Medium, High)
- Task status tracking (TODO, IN_PROGRESS, DONE)
- Multi-user support with authentication

### 🤖 AI-Powered Capabilities
- Generate subtasks automatically
- Rewrite task descriptions intelligently
- Estimate task complexity & completion time
- Get a summary of all tasks

### 🔐 Authentication & Security
- JWT-based authentication
- Password hashing with bcrypt
- Input validation using Zod

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| AI Integration | Google Generative AI (Gemini 2.5 Flash) |
| Authentication | JWT |
| Validation | Zod |
| Security | Bcrypt |

---

## 🚀 Installation & Setup

Follow these steps to run the project locally:

### 1. Clone the repository
```bash
git clone https://github.com/fmitesh007/AI_TASK_MANAGER.git
```

### 2. Navigate to the project directory
```bash
cd AI_TASK_MANAGER
```

### 3. Install dependencies
```bash
npm install
```

### 4. Set up environment variables

Create a `.env` file in the root directory and add:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_google_ai_key
```

### 5. Start the server
```bash
npm start
```

### 6. Access the app
```
http://localhost:3000
```

---

## 📖 API Documentation

### 🔐 Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |

### 📝 Task Management Routes (`/api`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/user/tasks` | Create a task |
| GET | `/api/alltasks` | Get all tasks |
| GET | `/api/user/tasks` | Get user tasks |
| GET | `/api/user/tasks/:id` | Get task by ID |
| PUT | `/api/user/tasks/:id` | Update task |
| DELETE | `/api/user/tasks/:id` | Delete task |

### 🤖 AI Features

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tasks/:id/generate-subtasks` | Generate subtasks |
| POST | `/api/tasks/:id/rewrite` | Rewrite task description |
| POST | `/api/tasks/:id/estimate` | Estimate task complexity |
| GET | `/api/tasks/summary` | Get tasks summary |

---

## 📦 Example Request Body

### Create / Update Task
```json
{
  "title": "Build API",
  "description": "Create backend for task manager",
  "dueDate": "2026-03-30",
  "priority": "HIGH"
}
```

---

## 📁 Project Structure

```
AI_TASK_MANAGER/
│── models/
│── routes/
│── controllers/
│── middleware/
│── utils/
│── config/
│── .env
│── server.js
│── package.json
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit your changes
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch
   ```bash
   git push origin feature/new-feature
   ```
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📬 Contact

- **GitHub:** [https://github.com/fmitesh007](https://github.com/fmitesh007)
