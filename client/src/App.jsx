import React, { useState, useEffect } from 'react';
import AttendanceButtons from './components/attendanceButtons';
import AuthButtons from './components/authButtons';
import styles from './styles/App.module.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check for existing token on load
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) setIsLoggedIn(true);
    }, []);

    const handleLogin = (userData) => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <div>
            <h1>My Attendance App</h1>

            

            {/* 2. AuthButtons handles everything else: 
                   - Shows "Logout" if logged in.
                   - Shows "Login/Register" if logged out. 
            */}
            <AuthButtons 
                isLoggedIn={isLoggedIn} 
                onLoginSuccess={handleLogin} 
                onLogout={handleLogout} 
            />
        </div>
    );
}

export default App;