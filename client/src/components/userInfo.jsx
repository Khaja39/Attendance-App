    import React, { useState, useEffect } from 'react';
    import styles from '../styles/userInfo.module.css';
    import LogoutButton from './LogoutButton';


// Get current user (Manager) from local storage
    const userString = localStorage.getItem('user');
    const currentUser = userString ? JSON.parse(userString) : null;
    
    const UserInfo = ({ onLogout }) => {
        const [user, setUser] = useState(null);

        useEffect(() => {
        // This runs immediately after the component mounts to the screen
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        }, []);
        if (!user) return null; // Don't render anything if user isn't found yet
    return(
    //<div className={styles.dashboardHeader}>
    <div className={styles.dashboardHeader}>
        {currentUser && (
                    <div > 
                    <LogoutButton  onLogout={onLogout}/>
                    <div className="{styles.userInfo}">
                        <p><strong>Name:</strong> {currentUser.username}</p>
                        <p><strong>Email:</strong> {currentUser.email}</p>  {/* <--- THIS DISPLAYS THE EMAIL */}
                        <p><strong>ID:</strong> {currentUser.id}</p>
                    </div>
                    </div>
                )}
    </div>
    );
    };
    export default UserInfo;