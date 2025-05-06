import React, { useState, useEffect } from 'react';

const Index = () => {
    const [activeTab, setActiveTab] = useState('professor');
    const [errorMessage, setErrorMessage] = useState('');

    // Simulate the `onload` functionality to show an error message
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        if (error) {
            setErrorMessage(error);
        }
    }, []);

    // Function to show an error message
    const showError = (message) => {
        if (message) {
            alert(message);
        }
    };

    // Function to handle tab switching
    const showTab = (tabId) => {
        setActiveTab(tabId);
    };

    // Inline styles
    const styles = {
        body: {
            fontFamily: 'Arial, sans-serif',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #4e54c8, #8f94fb)',
            color: '#333',
        },
        container: {
            textAlign: 'center',
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            width: '90%',
        },
        h1: {
            fontSize: '2rem',
            marginBottom: '1.5rem',
            color: '#4e54c8',
        },
        tabMenu: {
            display: 'flex',
            marginBottom: '1rem',
        },
        tab: {
            flex: 1,
            padding: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: '#4e54c8',
            borderBottom: '2px solid transparent',
            transition: 'background-color 0.3s, color 0.3s',
        },
        activeTab: {
            color: '#4e54c8',
            borderBottom: '2px solid #4e54c8',
        },
        tabContent: {
            display: 'none',
        },
        activeContent: {
            display: 'block',
        },
        loginForm: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
        },
        loginInput: {
            padding: '0.8rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
        },
        loginBtn: {
            padding: '1rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#4e54c8',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        registerBtn: {
            display: 'inline-block',
            marginTop: '1rem',
            padding: '1rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#8f94fb',
            border: 'none',
            borderRadius: '8px',
            textAlign: 'center',
            textDecoration: 'none',
            transition: 'background-color 0.3s',
            width: '100%',
        },
        guestBtn: {
            display: 'inline-block',
            marginTop: '1rem',
            padding: '1rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#8f94fb',
            border: 'none',
            borderRadius: '8px',
            textAlign: 'center',
            textDecoration: 'none',
            transition: 'background-color 0.3s',
            width: '100%',
        },
    };

    return (
        <div style={styles.body}>
            <div style={styles.container}>
                <h1 style={styles.h1}>Sign In</h1>
                <div style={styles.tabMenu}>
                    <div
                        style={{ ...styles.tab, ...(activeTab === 'professor' ? styles.activeTab : {}) }}
                        onClick={() => showTab('professor')}
                    >
                        Professor
                    </div>
                    <div
                        style={{ ...styles.tab, ...(activeTab === 'student' ? styles.activeTab : {}) }}
                        onClick={() => showTab('student')}
                    >
                        Student
                    </div>
                </div>
                <div
                    id="professor"
                    style={{ ...styles.tabContent, ...(activeTab === 'professor' ? styles.activeContent : {}) }}
                >
                    <form style={styles.loginForm} action="/login-professor" method="post">
                        <input type="text" style={styles.loginInput} placeholder="Email" name="email" required />
                        <input type="password" style={styles.loginInput} placeholder="Password" name="password" required />
                        <button type="submit" style={styles.loginBtn}>Login as Professor</button>
                    </form>

                    <a href="/register" style={styles.registerBtn}>Register as Professor</a>
                    <a href="/guest-dashboard" style={styles.guestBtn}>Continue as Guest</a>
                </div>
                <div
                    id="student"
                    style={{ ...styles.tabContent, ...(activeTab === 'student' ? styles.activeContent : {}) }}
                >
                    <form style={styles.loginForm} action="" method="post">
                        <input type="text" style={styles.loginInput} placeholder="Student ID" required />
                        <input type="password" style={styles.loginInput} placeholder="Password" required />
                        <button type="submit" style={styles.loginBtn}>Login as Student</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EthicsDashboard;