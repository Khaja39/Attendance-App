import express from 'express';
import { loginUser } from '../controllers/loginController.js'; // Import the function
import { logoutUser } from '../controllers/logoutController.js'; // Import the function
import { registerUser } from '../controllers/registerController.js'; // Import the function
const router = express.Router();

// Define the POST route for login
// Define Routes
router.post('/login', loginUser);       // POST /api/auth/login
router.post('/register', registerUser); // POST /api/auth/register
router.post('/logout', logoutUser);     // POST /api/auth/logout

export default router;