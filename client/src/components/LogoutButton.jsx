import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api';

const LogoutButton = ({ onLogout }) => {
   const navigate = useNavigate(); // <--- ADD THIS LINE HERE
    const handleLogout = async () => {
        try {
            // 1. Notify backend (Optional, but good practice)
            await api.post('/api/auth/logout');
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            // 2. Clear Frontend Storage (Critical Step)
            localStorage.removeItem('authToken');

            // --- CRITICAL UPDATES FOR OPTION B ---
            // 1. Remove the unified user object (which contains the token)
            localStorage.removeItem('user');
            
            // 3. Update Parent State to switch views
            
           if (typeof onLogout === 'function') {
                onLogout(); 
            } else {
                    console.warn("onLogout prop missing! Redirecting manually.");
                // Fallback: If the prop is missing, just force a reload or navigate
                navigate('/');
                window.location.reload();
            }
        }
    };

    return (
        <button onClick={handleLogout}>
            Log Out
        </button>
    );
};

export default LogoutButton;
