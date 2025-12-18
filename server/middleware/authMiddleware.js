// server/middleware/authMiddleware.js

import jwt from 'jsonwebtoken'; // You might need to install 'jsonwebtoken' (npm install jsonwebtoken)
import { query } from '../config/db.js'; // Assuming your database connection utility is here

// This function checks the request for a valid token and attaches user info to req.user
export const protect = async (req, res, next) => {
    let token;

    // 1. Check if the token is present in the Authorization header (Bearer <token>)
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header (removes 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token using your secret key
            // ⚠️ IMPORTANT: Replace 'YOUR_JWT_SECRET' with the secret key you use when logging in
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 1. Change decoded.id to decoded.userId
            const userIdFromToken = decoded.userId;

            // 3. Query the database to get the user's ID and details
            // This is crucial to ensure the user is still active and exists
            const result = await query(
                'SELECT user_id, email, user_name FROM users WHERE user_id = $1',
                [userIdFromToken] // Assuming your token payload includes the user's ID as 'id'
            );

            if (result.rows.length === 0) {
                console.log("Auth Error: No user found in DB for token ID:", userIdFromToken);
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // 4. Attach the user object to the request (THE FIX)
            // Now, req.user.id will be available in your controller!
            // 3. Attach to req.user so controllers can find it
            req.user = { id: result.rows[0].user_id };

            next(); // Proceed to the next middleware or the controller function

        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};