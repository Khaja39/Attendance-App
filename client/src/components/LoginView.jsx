import React, { useState } from 'react';
import axios from 'axios';
import api from '../api';
import styles from "../styles/loginView.module.css";

const LoginView = ({ onLoginSuccess, switchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const res = await api.post('/api/auth/login', {
                email,
                password
            });
            // 1. Log this to your console to verify the token actually exists now
            console.log("Server Response:", res.data);

            // Create a single object containing both user info and the token
            const userData = {
                ...res.data.user, // id, username, email, etc.
                token: res.data.token // Put the token inside this object
            };

            // ADD/CHANGE THESE LINES:
            // This saves the { token, user: {...} } object so api.js can read it
            localStorage.setItem('user', JSON.stringify(userData));
            // Save token
            localStorage.setItem('authToken', res.data.token);
            
            
            // Notify Parent (App.jsx)
            onLoginSuccess(res.data);

        } catch (err) {
            console.error("Login Error:", err);
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div>
        <div className={styles.snView}>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                
                {error && <p>{error}</p>}
                
                <button type="submit" className={styles.submitButton}>Login</button>
            </form>

            <p className={styles.registerText}>
                New here? <button onClick={switchToRegister} className={styles.linkButton}>Register</button>
            </p>
        </div>
        <div className={styles.snView}>
            <h4>Below are the Manager id's </h4>            
            <h4>For all Manager & Employee Id's password is "123"</h4>            
            <ol>
                <li>manager1@test.com</li>
                <li>manager2@test.com</li>
                <li>manager3@test.com</li>
            </ol>
            <h4>Manager Names for Registering</h4>
            <ol>
                <li>Manager One</li>
                <li>Manager Two</li>
                <li>Manager Three</li>
            </ol>
        </div>
        </div>
    );
};

export default LoginView;