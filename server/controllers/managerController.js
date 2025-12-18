import { query } from '../config/db.js';

export const getTeamAttendance = async (req, res) => {
    // We get the Manager's ID from the query parameter
    const { managerId } = req.query;

    if (!managerId) {
        return res.status(400).json({ message: "Manager ID is required" });
    }

    try {
        // SQL Explanation:
        // 1. JOIN attendance (a) and users (u) matches records where user_id matches.
        // 2. WHERE u.manager_id = $1 filters to show ONLY employees of this manager.
        const sql = `
            SELECT 
                u.user_id,
                u.user_name,
                a.date,
                a.punch_in_time,
                a.punch_out_time
            FROM attendance a
            JOIN users u ON a.user_id = u.user_id
            WHERE u.manager_id = $1
            ORDER BY a.date DESC, a.punch_in_time DESC
        `;

        const result = await query(sql, [managerId]);
        console.log("SQL Result found:", result.rows.length); // Add this
        res.status(200).json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};