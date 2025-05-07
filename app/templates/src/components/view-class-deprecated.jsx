import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const backendApiUrl = process.env.BACKEND_API_URL || "http://localhost:5000";
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

const ViewClass = () => {
    const [className, setClassName] = useState('Loading...');
    const [students, setStudents] = useState([
        { id: 11, name: 'Alice Johnson', email: 'alice.johnson@myokanagan.bc.ca' },
        { id: 52, name: 'Bob Smith', email: 'bob.smith@myokanagan.bc.ca' },
        { id: 26, name: 'Charlie Brown', email: 'charlie.brown@myokanagan.bc.ca' },
        { id: 47, name: 'Dana White', email: 'dana.white@myokanagan.bc.ca' },
        { id: 45, name: 'Evan Lee', email: 'evan.lee@myokanagan.bc.ca' },
        { id: 68, name: 'Fiona Hill', email: 'fiona.hill@myokanagan.bc.ca' },
        { id: 21, name: 'George King', email: 'george.king@myokanagan.bc.ca' },
        { id: 85, name: 'Hannah Adams', email: 'hannah.adams@myokanagan.bc.ca' },
        { id: 19, name: 'Isaac Newton', email: 'isaac.newton@myokanagan.bc.ca' },
        { id: 10, name: 'Julia Roberts', email: 'julia.roberts@myokanagan.bc.ca' },
    ]);
    const [questions, setQuestions] = useState([
        "What is the deontological perspective?",
        "How does utilitarianism differ from Kantian ethics?",
        "What are the main criticisms of virtue ethics?",
        "What is the concept of moral relativism?",
        "Can ethical egoism justify actions that harm others?",
        "What is the role of duty in ethical decision-making?",
        "How does the principle of justice relate to fairness?",
        "What is the difference between consequentialism and deontology?",
        "Why is the trolley problem an important ethical dilemma?",
        "What are the key ideas in feminist ethics?",
    ]);

    const navigate = useNavigate(); // Initialize useNavigate

    // Simulate fetching the class name from URL parameters
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const classNameFromUrl = params.get('class');
        if (classNameFromUrl) {
            setClassName(classNameFromUrl);
        } else {
            setClassName('Security error, developer plz fix');
        }
    }, []);

    // Function to handle editing a question
    const editQuestion = (index) => {
        const newQuestion = prompt('Edit your question:', questions[index]);
        if (newQuestion) {
            const updatedQuestions = [...questions];
            updatedQuestions[index] = newQuestion;
            setQuestions(updatedQuestions);
        }
    };

    // Function to handle clicking on a student row
    const handleStudentClick = (studentId) => {
        navigate(`/student/${studentId}`); 
    };

    // Inline styles
    const styles = {
        body: {
            margin: 0,
            fontFamily: 'Arial, sans-serif',
            backgroundColor: 'white',
            color: '#333',
        },
        h1: {
            fontSize: '24px',
            textAlign: 'center',
            color: 'black',
            padding: '20px',
            margin: 0,
        },
        table: {
            width: '80%',
            margin: '20px auto',
            borderCollapse: 'collapse',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        th: {
            backgroundColor: '#8f94fb',
            color: 'white',
            border: '1px solid #ddd',
            textAlign: 'left',
            padding: '10px',
        },
        td: {
            border: '1px solid #ddd',
            textAlign: 'left',
            padding: '10px',
            cursor: 'pointer', 
        },
        trEven: {
            backgroundColor: '#f9f9f9',
        },
        trHover: {
            backgroundColor: '#f1f1f1',
        },
        currentQuestions: {
            width: '80%',
            margin: '20px auto',
            backgroundColor: '#f8f8f8',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        questionsList: {
            listStyleType: 'none',
            padding: 0,
        },
        questionItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            marginBottom: '10px',
            padding: '10px',
            borderRadius: '4px',
        },
        editButton: {
            backgroundColor: '#8f94fb',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        },
        createQuestionButton: {
            display: 'block',
            margin: '20px auto',
            backgroundColor: '#8f94fb',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s ease',
        },
    };

    return (
        <div style={styles.body}>
            <h1 style={styles.h1}>{className}</h1>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr
                            key={student.id}
                            style={index % 2 === 0 ? styles.trEven : {}}
                            onClick={() => handleStudentClick(student.id)} // Add onClick handler
                        >
                            <td style={styles.td}>{student.id}</td>
                            <td style={styles.td}>{student.name}</td>
                            <td style={styles.td}>{student.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={styles.currentQuestions}>
                <h2>Current Questions</h2>
                <ul style={styles.questionsList}>
                    {questions.map((question, index) => (
                        <li key={index} style={styles.questionItem}>
                            <span>{question}</span>
                            <button
                                style={styles.editButton}
                                onClick={() => editQuestion(index)}
                            >
                                Edit
                            </button>
                        </li>
                    ))}
                </ul>
                <button style={styles.createQuestionButton}>Create Question</button>
            </div>
        </div>
    );
};

export default ViewClass;