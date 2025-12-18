import express from 'express';
import { getTeamAttendance } from '../controllers/managerController.js';

const router = express.Router();

router.get('/attendance', getTeamAttendance);

export default router;