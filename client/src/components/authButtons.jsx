import React, { useState, useEffect } from 'react';
import LoginView from './LoginView';
import RegisterView from './RegisterView';
import LogoutButton from './LogoutButton';
import AttendanceButtons from './attendanceButtons'
import ManagerDashboard from './ManagerDashboard'; // 1. Import your Manager Component
import styles from '../styles/attendanceButtons.module.css'

const AuthButtons = ({ isLoggedIn, onLoginSuccess, onLogout }) => {
    // Internal state: Only matters if user is NOT logged in
    const [view, setView] = useState('login'); // 'login' or 'register'
    // 2. New State: Track who the user is (to check if they are a Manager)
    const [currentUser, setCurrentUser] = useState(null);
    
    // 3. Effect: Check LocalStorage on load so the view persists on refresh
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, [isLoggedIn]);


    // 4. Helper: Intercept login to save user data locally before telling App.jsx
    const handleLoginWrapper = (data) => {
        console.log("AuthButtons received:", data);
        setCurrentUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (onLoginSuccess) {
            onLoginSuccess(data); // Call the original parent function
        }
    };

    // SCENARIO 1: User is Logged In
    // We strictly handle the Logout Button here as requested
    if (isLoggedIn) {
       
        // 👇 CHECK: If user is a Manager, show their Dashboard
        if (currentUser?.employee_type === 'manager') {
            return (
                <div className="auth-container">
                    
                    <h3 style={{color: 'darkblue'}}>Manager Portal</h3>
                    <ManagerDashboard />
                    <div style={{marginTop: '20px'}}>
                        <LogoutButton onLogout={onLogout} />
                    </div>
                </div>
            );
        }

        // 🅱️ IF EMPLOYEE -> Show Attendance Buttons
        // This used to be in App.jsx, but now it lives here!
        return (
            <div className="auth-container">
                
                   <h3>Employee Dashboard</h3>        
                    <AttendanceButtons /> 
                <div style={{marginTop: '20px'}}>
                    <LogoutButton onLogout={onLogout} />
                </div>
            </div>
        );
    }
    

    // SCENARIO 2: User is Logged Out (Guest)
    // We handle the toggle between Login and Register here
    return (
        <div className="auth-container">
            {view === 'login' ? (
                <LoginView 
                    onLoginSuccess={handleLoginWrapper} 
                    switchToRegister={() => setView('register')} 
                />
            ) : (
                <RegisterView 
                    switchToLogin={() => setView('login')} 
                />
            )}
        </div>
    );
};

export default AuthButtons;