import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

//LogIn User Function
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try{
        // 1. Find user by email
        const result =await query('Select * FROM users where email = $1',[email]);
        const user = result.rows[0];

        if(!user){
            return res.status(401).json({ success: false, message: 'Invalid Credentials (User Not Found'});
        }
        // 2. Verify Password (using bcrypt)
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ success: false, message: 'Invalid credentials (Password mismatch)' });
        }
        // 3 Generate JWT "Badge" (the token)
        const token = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        //4 Send back the token and user details
        res.status(200).json({ 
            message: "Login successful",
            token: token, // <--- ADD THIS LINE
            user: {
                id: user.user_id,
                username: user.user_name,
                email: user.email,
                employee_type: user.employee_type // <--- CRITICAL LINE
                
            }
        });
    } catch (err) {
        console.error('Server LogIn Error:', err);
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
};