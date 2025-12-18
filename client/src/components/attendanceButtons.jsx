import React, { useState } from 'react';
import api from '../api'; // Importing the axios instance we created
import axios from 'axios';
import AttendanceHistory from './AttendanceHistory'; // <--- Import the separate component
import UserInfo from './userInfo';
import styles from '../styles/attendanceButtons.module.css'


function AttendanceButtons({onLogout})
{
    const [content, setContent] = useState('');


    // Logic to reload table: We just increment this number
    const [refreshCount, setRefreshCount] = useState(0);
    
    
    const handlePunchIn = async () => {
        try {
            const token = localStorage.getItem('authToken'); // 1. Get the token
            const response = await api.post('/attendance/punch-in', {}, {
                headers: {
                    Authorization: `Bearer ${token}` // 2. Send it in headers
                }
            });
            const time = response.data.serverTime;
            const date = response.data.serverDate;
            setContent(`Punched In at: ${time}, ${date}`);
            // Tell table to reload
            setRefreshCount(prev => prev + 1);
        } catch (error){
            console.error(error);
            setContent('❌ Punch In Failed');
        }
    };
    const handlePunchOut = async () => {
        try{
            const token = localStorage.getItem('authToken'); // 1. Get the token
            const response = await api.post('/attendance/punch-out', {}, {
                headers: {
                    Authorization: `Bearer ${token}` // 2. Send it in headers
                }
            });
            const time = response.data.serverTime;
            const date = response.data.serverDate;
            setContent(`Punched Out at: ${time}, ${date}`);
            // Tell table to reload
            setRefreshCount(prev => prev + 1);
        }catch (error){
            console.error(error);
            setContent('❌ Punch Out Failed');
        }
    }
    return (
        <div className="attendance-container">
            <div className={styles.dashboardHeader}>
            <UserInfo onLogout={onLogout}/>
            </div>
            <h2>Mark Attendance</h2>
            <p className={styles.statusMessage}>{ content }</p>
            
            
            <div id="buttons" className={styles.buttonGroup}>
                <button className={styles.punchButton} id="punchInButton" onClick={handlePunchIn}>Punch In</button>
                <button className={styles.punchButton} id="punchOutButton" onClick={handlePunchOut}>Punch Out</button>
                {/* Render the Separate Table Component Here */}
                {/* Pass the counter so it knows when to update */}
                <AttendanceHistory refreshTrigger={refreshCount} />
            </div>
        </div>
    )

}

export default AttendanceButtons;