import { query } from '../config/db.js';


// --- Helper function for standard time format ---
const getStandardTime = () => {
    // Use ISO format for database storage (YYYY-MM-DDTHH:MM:SSZ)
    return new Date().toISOString(); 
};

// --- Helper to extract display-friendly strings ---
const extractDisplayTime = (isoString) => {
    const dateObj = new Date(isoString);
    return {
        date: dateObj.toLocaleDateString(), // e.g., "12/13/2025"
        time: dateObj.toLocaleTimeString()  // e.g., "8:30:00 PM"
    };
};

// --- POST ROUTE PunchIn ---
export const punchIn = async (req, res) => {
    // DEBUG LOGS
    console.log("Full User Object from Middleware:", req.user);
    console.log("Extracted User ID:", req.user?.id);
    const userId = req.user?.id ;
    const nowIso = getStandardTime();
    const dateOnly = nowIso.split('T')[0]; // YYYY-MM-DD

    try {
        const result = await query(
             'INSERT INTO attendance (user_id, punch_in_time, date) VALUES ($1, $2, $3) RETURNING punch_in_time, date',
            [userId, nowIso, dateOnly]
        );
        // Convert DB format back to friendly format for Frontend
        const displayData = extractDisplayTime(nowIso);

        res.status(201).json({
            message: 'Punch In Successful',
            // ✅ EXACT KEYS your frontend expects:
            serverTime: displayData.time,
            serverDate: displayData.date,
            // Optional: raw data if needed
            data: result.rows[0] 
        });
    } catch (error) {
        console.error("Punch In Error:", error);
        res.status(500).json({ message: 'Failed to record punch in.' });
    }   
};
// --- Post Route PunchOut
export const punchOut = async (req, res) => {
    const userId = req.user?.id || req.user?.userId;
    const nowIso = getStandardTime();
    const dateOnly = nowIso.split('T')[0]; // YYYY-MM-DD

    try {
        // 1. First, find the open record for today (where punch_out is NULL)
        // We need to know WHICH row to update.
        const findOpenRecord = await query(
            `SELECT id FROM attendance 
             WHERE user_id = $1 AND date = $2 AND punch_out_time IS NULL
             ORDER BY punch_in_time DESC LIMIT 1`,
            [userId, dateOnly]
        );

        if (findOpenRecord.rowCount === 0) {
            return res.status(400).json({ message: 'No active punch-in found to punch out from.' });
        }

        const recordId = findOpenRecord.rows[0].id;

        // 2. UPDATE that specific record
        const result = await query(
             'UPDATE attendance SET punch_out_time = $1 WHERE id = $2 RETURNING *',
            [nowIso, recordId]
        );

        // Convert DB format back to friendly format for Frontend
        const displayData = extractDisplayTime(nowIso);

        res.status(200).json({
            message: 'Punch Out Successful',
            // ✅ EXACT KEYS your frontend expects:
            serverTime: displayData.time,
            serverDate: displayData.date,
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Punch Out Error:", error);
        res.status(500).json({ message: 'Failed to record punch out.' });
    }
};

// --- SEPARATE FUNCTION: Get Attendance History ---
export const getAttendanceHistory = async (req, res) => {
    // ⚠️ TODO: Replace '1' with req.user.id when auth is fully linked
    const userId = req.user.id ; 

    try {
        const result = await query(
            `SELECT date, punch_in_time, punch_out_time 
             FROM attendance 
             WHERE user_id = $1 
             ORDER BY date DESC`,
            [userId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("History Error:", error);
        res.status(500).json({ message: 'Failed to fetch history.' });
    }
};