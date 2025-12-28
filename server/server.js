import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'; // Import the new route file
import attendanceRoutes from './routes/attendanceRoutes.js'; // Import the new route file
import managerRoutes from './routes/managerRoutes.js';
import { query } from './config/db.js';

const app = express();
dotenv.config();

// Middleware
// 1. PLACE THIS AT THE VERY TOP (Before any routes)
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://attendance-app-seven-mu.vercel.app" 
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. Handle the "Preflight" OPTIONS request manually (Optional but helps)
app.options(/(.*)/, cors());

app.use(express.json());


// Mount the Auth Routes
// All routes in authRoutes.js will be prefixed with /api/auth
app.use('/api/auth', authRoutes);

// All routes in attendnace Routes.js will be prefixed with /attendance

app.use('/attendance', attendanceRoutes);

// We mount the manager routes at '/manager'
// So the full URL becomes: /manager/attendance
app.use('/manager', managerRoutes);






// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});