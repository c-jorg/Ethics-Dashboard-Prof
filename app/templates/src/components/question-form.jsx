import React from 'react';

const backendApiUrl = process.env.BACKEND_API_URL || "http://localhost:5000";
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

const QuestionForm = () => {
    const styles = {
        formContainer: {
            maxWidth: '600px',
            margin: '40px auto',
            padding: '30px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
        formHeader: {
            fontSize: '32px',
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: '30px',
            fontFamily: 'Arial, sans-serif',
        },
        formContent: {
            background: '#ffffff',
            padding: '25px',
            borderRadius: '8px',
        },
        formTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '10px',
            fontFamily: 'Arial, sans-serif',
            textDecoration: 'underline',
        },
        formSubtitle: {
            fontSize: '18px',
            marginBottom: '20px',
            fontFamily: 'Arial, sans-serif',
        },
        textarea: {
            width: '100%',
            height: '200px',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            resize: 'vertical',
            marginBottom: '20px',
            fontFamily: 'Arial, sans-serif',
        },
        submitBtn: {
            backgroundColor: '#4052e4',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
        },
        body: {
            backgroundColor: '#4052e4',
            margin: '0',
            padding: '20px',
            minHeight: '100vh',
        },
    };

    return (
        <div style={styles.body}>
            <div style={styles.formHeader}>Question Creation</div>
            <div style={styles.formContainer}>
                <div style={styles.formContent}>
                    <div style={styles.formTitle}>Describe Your Dilemma</div>
                    <div style={styles.formSubtitle}>State The Problem</div>
                    <textarea style={styles.textarea} placeholder="Enter dilemma here..."></textarea>
                    <button style={styles.submitBtn}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default QuestionForm;