import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';

export const registerUser = async (req, res) => {
    const { name, email, password,Manager, employee_Type } = req.body;
    // We will store the final Manager ID here (starts as null)
    let finalManagerId = null;
    try {


        // --- STEP 1: VALIDATE THE MANAGER NAME ---
        if (Manager) {
            // Check if this name exists in the DB and is actually a Manager
            const managerCheck = await query(
                `SELECT user_id FROM users 
                 WHERE user_name = $1 
                 AND employee_type = 'Manager'`, 
                [Manager]
            );

            // If the database returns 0 rows, the name is invalid
            if (managerCheck.rowCount === 0) {
                return res.status(404).json({ 
                    message: `Invalid Manager Name. '${Manager}' does not exist or is not a Manager.` 
                });
            // FIX: Extract the actual ID from the database result
            finalManagerId = managerCheck.rows[0].user_id;
            }
            
            // If we get here, the manager is valid!
            // We don't need to do anything else, we just proceed to save the name.
        }


        // 1. Check if user exists
        const userCheck = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // 3. Insert into DB
        const newUser = await query(
            'INSERT INTO users (user_name, email, password,manager_id,employee_Type) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, user_name, email',
            [name, email, hash,Manager,employee_Type]
        );

        res.status(201).json({ success: true, user: newUser.rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
};