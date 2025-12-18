import React, { useState, useEffect, useMemo } from 'react';
import api from '../api.js';
import { calculateDuration } from '../utils/utils.js';
import styles from '../styles/managerDashboard.module.css';
import UserInfo from './userInfo.jsx';

import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    flexRender,
} from '@tanstack/react-table';

const ManagerDashboard = ({ onLogout }) => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(true);
    // 1. Create a state for the user
    const [manager, setManager] = useState(null);

    useEffect(() => {
        // 2. Read user from localStorage inside useEffect
        const userString = localStorage.getItem('user');
        if (userString) {
            const parsedUser = JSON.parse(userString);
            setManager(parsedUser);
            fetchData(parsedUser.id);
        }else {
            // If no user is found after 1 second, redirect or show error
            console.log("No user found in storage yet...");
        }
    }, []);

    const fetchData = async (managerId) => {
        try {
            // Fetch employees reporting to this manager
            const res = await api.get(`/manager/attendance?managerId=${managerId}`);
            setAttendanceData(res.data);
        } catch (err) {
            console.error("Error fetching team data:", err);
        } finally {
            setLoading(false);
        }
    };

   
    const columns = useMemo(() => [
        { accessorKey: 'user_id', header: 'User ID' },
        { accessorKey: 'user_name', header: 'Username' },
        { 
            accessorKey: 'date', 
            header: 'Date',
            cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : 'N/A'
        },
        { 
            accessorKey: 'punch_in_time', 
            header: 'Login Time',
            cell: info => info.getValue() ? new Date(info.getValue()).toLocaleTimeString() : 'N/A'
        },
        { 
            accessorKey: 'punch_out_time', 
            header: 'Logout Time',
            cell: info => info.getValue() ? new Date(info.getValue()).toLocaleTimeString() : 'Working'
        },
        { 
            accessorFn: row => calculateDuration(row.punch_in_time, row.punch_out_time),
            header: 'Duration',
            id: 'duration',
        },
    ], []);

    const table = useReactTable({
        data: attendanceData,
        columns,
        state: {
            globalFilter, // 3. Duplicate key warning fixed here
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });


     // 3. CRITICAL: If manager state is null, show a placeholder 
    // This prevents the component from rendering "empty" versions of UserInfo
    if (!manager) {
        return <div className={styles.loader}>Loading Dashboard...</div>;
    }


    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.dashboardHeader}>
                <h2 className={styles.headerTitle}>Manager Dashboard</h2>
                {/* UserInfo is now outside the loading check, so it shows up instantly */}
                <UserInfo onLogout={onLogout} />
            </header>
            
            <div className={styles.contentSection}>
                <input 
                    type="text" 
                    className={styles.searchInput}
                    placeholder="Search by name or ID..." 
                    value={globalFilter ?? ''}
                    onChange={e => setGlobalFilter(e.target.value)}
                />

                {loading ? (
                    <div className={styles.loader}>Loading team data...</div>
                ) : (
                    <table className={styles.attendanceTable}>
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className={styles.noData}>
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManagerDashboard;