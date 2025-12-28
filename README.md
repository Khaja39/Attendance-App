# 🕒 Attendance Management System

A full-stack web application designed to track employee attendance efficiently. It allows employees to punch in/out and view their history, while managers can monitor employee logs in real-time.



## 🚀 Tech Stack

* **Frontend:** React.js, HTML5, CSS3
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (NeonDB)
* **Authentication:** JWT (JSON Web Tokens) & bcryptjs
* **Deployment:** Vercel (Frontend) & Render (Backend)

## ✨ Key Features

### 👤 Employee Panel
* **Secure Registration & Login:** Users can create accounts and log in securely.
* **Punch In / Punch Out:** Mark daily attendance with a single click.
* **Status Tracking:** Prevents double punch-ins or punch-outs.

### 💼 Manager Dashboard
* **Employee Oversight:** View a list of all employees.
* **Attendance Logs:** See exact login and logout timings for any employee.
* **Real-time Data:** Data is fetched directly from the PostgreSQL database.

---

## 🛠️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone (https://github.com/Khaja39/Attendance-App)
cd attendance-app

```

### 2. Backend Setup

Navigate to the server folder and install dependencies:

```bash
cd server
npm install

```

**Configure Environment Variables:**
Create a `.env` file in the `server` folder and add the following:

```env
PORT=5000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key_here

```

**Start the Server:**

```bash
npm start
# Server runs on http://localhost:5000

```

### 3. Frontend Setup

Open a new terminal, navigate to the client folder, and install dependencies:

```bash
cd client
npm install

```

**Start the React App:**

```bash
npm run dev
# App runs on http://localhost:5173

```

---

## 🗄️ Database Schema

The app uses a PostgreSQL database with the following structure:

**Users Table (`users`)**

* `user_id` (Primary Key)
* `user_name`
* `email` (Unique)
* `password` (Hashed)
* `employee_type` ('Manager' or 'Employee')
* `manager_id` (Foreign Key linked to a Manager)

**Attendance Table (`attendance`)**

* `id` (Primary Key)
* `user_id` (Foreign Key)
* `date`
* `clock_in`
* `clock_out`
* `status` ('Present', 'Absent')

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| **POST** | `/api/auth/register` | Register a new user |
| **POST** | `/api/auth/login` | Login user and get JWT |
| **POST** | `/attendance/clock-in` | Record punch-in time |
| **POST** | `/attendance/clock-out` | Record punch-out time |
| **GET** | `/manager/attendance` | (Manager Only) View all logs |

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

*Developed by Shaik Khaja Moinuddin*

```

```