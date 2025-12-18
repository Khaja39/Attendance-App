// client/src/components/AttendanceHistory.jsx
import React, { useEffect, useState } from 'react';
import api from '../api'; // Importing the axios instance we created
import { calculateDuration } from '../utils/utils.js'; // 👇 Import here too

// Accepts 'refreshTrigger' prop: whenever this number changes, the table reloads.
const AttendanceHistory = ({ refreshTrigger }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('authToken'); // Get the token
            const userString = JSON.parse(localStorage.getItem('user'));
        
            // Block the request if the token isn't present in the object yet
            if (!token || !userString) {
                console.log("AttendanceHistory: Waiting for token or user data...");
                return;
            }
            setTimeout(async () => {
                try {
            const response = await api.get('/attendance/history', {
                headers: {
                    Authorization: `Bearer ${token}` // Manually pass it if interceptors aren't set
                }
            });
                console.log("History Received:", response.data);
                setHistory(response.data);
            } catch (err) {
                console.error("Fetch history failed", err);
            }
            }, 500);
            
        };
        
        fetchHistory();
    }, [refreshTrigger]); // <--- Dependency: re-runs when refreshTrigger changes

    // Helper to make time look nice (e.g., "10:30 AM")
    const formatTime = (isoString) => {
        if (!isoString) return '---';
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (isoString) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleDateString();
    };

    

    

    return (
        <div style={{ marginTop: '30px' }}>
            <h3>Recent Activity</h3>
            <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Punch In</th>
                        <th>Punch Out</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((row, index) => (
                        <tr key={index}>
                            <td>{formatDate(row.date)}</td>
                            <td>{formatTime(row.punch_in_time)}</td>
                            <td>{formatTime(row.punch_out_time)}</td>
                            <td>{calculateDuration(row.punch_in_time, row.punch_out_time)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceHistory;