import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // <-- Import the new middleware
import { punchIn,punchOut,getAttendanceHistory } from '../controllers/attendanceController.js';
console.log("Attendance Routes file is loading..."); // <--- Add this
const router = express.Router();

router.post('/punch-in', protect, punchIn);
router.post('/punch-Out', protect, punchOut);

// ✅ New Route for History
router.get('/history',protect, getAttendanceHistory);

export default router;