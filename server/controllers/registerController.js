import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';

export const registerUser = async (req, res) => {
    const { name, email, password, Manager, employee_Type } = req.body;
    
    // Default to null. If no manager is provided, this stays null.
    let finalManagerId = null;

    console.log("👉 Registering User:", name);
    console.log("👉 Manager Input:", Manager);

    try {
        // --- STEP 1: VALIDATE THE MANAGER ---
        if (Manager) {
            // Trim whitespace to avoid "Manager One " errors
            const cleanManagerName = Manager.trim();

            // FIX 1: Use ILIKE for case-insensitivity on BOTH name and type
            const managerCheck = await query(
                `SELECT user_id, user_name, employee_type FROM users 
                 WHERE user_name ILIKE $1 
                 AND employee_type ILIKE 'manager'`, 
                [cleanManagerName]
            );

            console.log("🔎 DB Search Result:", managerCheck.rows);

            // If 0 rows found, return 404
            if (managerCheck.rowCount === 0) {
                return res.status(404).json({ 
                    message: `Manager '${cleanManagerName}' not found. Ensure spelling is correct and they are registered as a Manager.` 
                });
            }

            // Get the ID
            finalManagerId = managerCheck.rows[0].user_id;
            console.log("✅ Manager Found. ID:", finalManagerId);
        }

        // --- STEP 2: CHECK IF USER EXISTS ---
        const userCheck = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // --- STEP 3: HASH PASSWORD ---
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // --- STEP 4: INSERT INTO DB ---
        // FIX 2: Use 'finalManagerId' (Number), NOT 'Manager' (String)
        const newUser = await query(
            'INSERT INTO users (user_name, email, password, manager_id, employee_type) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, user_name, email',
            [name, email, hash, finalManagerId, employee_Type] 
        );

        res.status(201).json({ success: true, user: newUser.rows[0] });

    } catch (err) {
        console.error("❌ Register Error:", err);
        res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
    }
};