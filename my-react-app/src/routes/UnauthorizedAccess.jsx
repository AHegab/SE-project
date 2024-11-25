import React from 'react';

const UnauthorizedAccess = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Access Denied</h1>
            <p style={styles.message}>You do not have permission to view this page. Please contact your administrator if you think this is a mistake.</p>
        </div>
    );
};

// Styles object to style the component
const styles = {
    container: {
        width: '100%',
        height: '100vh', // Takes full height of the viewport
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f2f2f2', // Light grey background
    },
    header: {
        color: '#d32f2f', // Red color for the header
        fontSize: '24px',
    },
    message: {
        color: '#666', // Dark gray for text
        fontSize: '16px',
        marginTop: '20px',
        width: '80%',
        textAlign: 'center',
    }
};

export default UnauthorizedAccess;
