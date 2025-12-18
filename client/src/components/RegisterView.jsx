import React, { useState } from 'react';
import axios from 'axios';
import api from '../api';
import styles from '../styles/RegisterView.module.css'

const RegisterView = ({ switchToLogin }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '',Manager: '',Employee_Type:''});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await api.post('/api/auth/register', formData);
            setSuccess('Registration successful! Please login.');
            
            // Optional: Automatically switch to login after 2 seconds
            setTimeout(() => {
                switchToLogin();
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className={styles.authContainer}>
            <h2 className={styles.authHeader}>Create Account</h2>
            <form onSubmit={handleSubmit} className={styles.authForm}>
                <input 
                    name="name"
                    type="text" 
                    placeholder="Full Name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className={styles.authInput}
                />
                <input 
                    name="email"
                    type="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className={styles.authInput}
                />
                <input 
                    name="password"
                    type="password" 
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                    className={styles.authInput}
                />

               
                <input 
                    name="Manager"
                    type="text" 
                    placeholder="Manager" 
                    value={formData.Manager} 
                    onChange={handleChange} 
                    required 
                    className={styles.authInput}
                />

                 <input 
                    name="Employee_Type"
                    type="text" 
                    placeholder="Manager or IC" 
                    value={formData.Employee_Type} 
                    onChange={handleChange} 
                    required 
                    className={styles.authInput}
                />

                {error && <p className={styles.errorMessage}>{error}</p>}
                {success && <p className={styles.successMessage}>{success}</p>}

                <button type="submit" className={styles.authButton}>Register</button>
            </form>

            <p className={styles.authFooter}>
                Already have an account? <button onClick={switchToLogin} className={styles.switchButton}>Login</button>
            </p>
        </div>
    );
};

export default RegisterView;

